import { create } from 'zustand';
import { GameState, Player, Board, Ship, Coordinate, SHIP_TYPES, BOARD_SIZE } from '../types/game';

interface GameStore extends GameState {
  initializeGame: () => void;
  placeShip: (shipId: string, startCoordinate: Coordinate, isHorizontal: boolean) => boolean;
  fireShot: (coordinate: Coordinate) => void;
  resetGame: () => void;
  setPhase: (phase: GameState['phase']) => void;
}

const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => ({
      coordinate: { row, col },
      hasShip: false,
      isHit: false,
      isMiss: false,
    }))
  );
};

const createPlayer = (id: string, name: string): Player => ({
  id,
  name,
  board: createEmptyBoard(),
  ships: SHIP_TYPES.map(shipType => ({
    id: shipType.id,
    name: shipType.name,
    length: shipType.length,
    coordinates: [],
    isHorizontal: true,
    isSunk: false,
  })),
  shots: [],
});

const isValidPlacement = (
  board: Board,
  ship: Ship,
  startCoordinate: Coordinate,
  isHorizontal: boolean
): boolean => {
  const { row, col } = startCoordinate;
  const { length } = ship;

  if (isHorizontal && col + length > BOARD_SIZE) return false;
  if (!isHorizontal && row + length > BOARD_SIZE) return false;

  for (let i = 0; i < length; i++) {
    const checkRow = isHorizontal ? row : row + i;
    const checkCol = isHorizontal ? col + i : col;

    if (board[checkRow][checkCol].hasShip) return false;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const adjRow = checkRow + dr;
        const adjCol = checkCol + dc;
        
        if (
          adjRow >= 0 && adjRow < BOARD_SIZE &&
          adjCol >= 0 && adjCol < BOARD_SIZE &&
          board[adjRow][adjCol].hasShip
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

const placeShipOnBoard = (
  board: Board,
  ship: Ship,
  startCoordinate: Coordinate,
  isHorizontal: boolean
): Board => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const coordinates: Coordinate[] = [];

  for (let i = 0; i < ship.length; i++) {
    const row = isHorizontal ? startCoordinate.row : startCoordinate.row + i;
    const col = isHorizontal ? startCoordinate.col + i : startCoordinate.col;
    
    newBoard[row][col].hasShip = true;
    newBoard[row][col].shipId = ship.id;
    coordinates.push({ row, col });
  }

  return newBoard;
};

const generateCPUShips = (): { board: Board; ships: Ship[] } => {
  let board = createEmptyBoard();
  const ships = SHIP_TYPES.map(shipType => ({
    id: shipType.id,
    name: shipType.name,
    length: shipType.length,
    coordinates: [] as Coordinate[],
    isHorizontal: true,
    isSunk: false,
  }));

  for (const ship of ships) {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 100) {
      const isHorizontal = Math.random() < 0.5;
      const maxRow = isHorizontal ? BOARD_SIZE : BOARD_SIZE - ship.length;
      const maxCol = isHorizontal ? BOARD_SIZE - ship.length : BOARD_SIZE;
      
      const startCoordinate = {
        row: Math.floor(Math.random() * maxRow),
        col: Math.floor(Math.random() * maxCol),
      };

      if (isValidPlacement(board, ship, startCoordinate, isHorizontal)) {
        board = placeShipOnBoard(board, ship, startCoordinate, isHorizontal);
        ship.isHorizontal = isHorizontal;
        
        for (let i = 0; i < ship.length; i++) {
          const row = isHorizontal ? startCoordinate.row : startCoordinate.row + i;
          const col = isHorizontal ? startCoordinate.col + i : startCoordinate.col;
          ship.coordinates.push({ row, col });
        }
        
        placed = true;
      }
      attempts++;
    }
  }

  return { board, ships };
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'setup',
  currentPlayer: 'human',
  humanPlayer: createPlayer('human', 'Human'),
  cpuPlayer: createPlayer('cpu', 'CPU'),

  initializeGame: () => {
    const { board: cpuBoard, ships: cpuShips } = generateCPUShips();
    
    set({
      phase: 'setup',
      currentPlayer: 'human',
      humanPlayer: createPlayer('human', 'Human'),
      cpuPlayer: {
        ...createPlayer('cpu', 'CPU'),
        board: cpuBoard,
        ships: cpuShips,
      },
      winner: undefined,
      lastShot: undefined,
    });
  },

  placeShip: (shipId: string, startCoordinate: Coordinate, isHorizontal: boolean) => {
    const { humanPlayer } = get();
    const ship = humanPlayer.ships.find(s => s.id === shipId);
    
    if (!ship) return false;

    if (!isValidPlacement(humanPlayer.board, ship, startCoordinate, isHorizontal)) {
      return false;
    }

    const newBoard = placeShipOnBoard(humanPlayer.board, ship, startCoordinate, isHorizontal);
    const coordinates: Coordinate[] = [];
    
    for (let i = 0; i < ship.length; i++) {
      const row = isHorizontal ? startCoordinate.row : startCoordinate.row + i;
      const col = isHorizontal ? startCoordinate.col + i : startCoordinate.col;
      coordinates.push({ row, col });
    }

    const updatedShip = {
      ...ship,
      coordinates,
      isHorizontal,
    };

    const updatedShips = humanPlayer.ships.map(s => 
      s.id === shipId ? updatedShip : s
    );

    set({
      humanPlayer: {
        ...humanPlayer,
        board: newBoard,
        ships: updatedShips,
      },
    });

    return true;
  },

  fireShot: (coordinate: Coordinate) => {
    const state = get();
    const { currentPlayer, humanPlayer, cpuPlayer } = state;
    
    if (state.phase !== 'battle') return;

    const targetPlayer = currentPlayer === 'human' ? cpuPlayer : humanPlayer;
    const shootingPlayer = currentPlayer === 'human' ? humanPlayer : cpuPlayer;
    
    const targetCell = targetPlayer.board[coordinate.row][coordinate.col];
    
    if (targetCell.isHit || targetCell.isMiss) return;

    const newTargetBoard = targetPlayer.board.map(row => 
      row.map(cell => ({ ...cell }))
    );
    
    let result: 'hit' | 'miss' | 'sunk' = 'miss';
    let shipName: string | undefined;

    if (targetCell.hasShip) {
      newTargetBoard[coordinate.row][coordinate.col].isHit = true;
      result = 'hit';
      
      const hitShip = targetPlayer.ships.find(ship => ship.id === targetCell.shipId);
      if (hitShip) {
        shipName = hitShip.name;
        const allHit = hitShip.coordinates.every(coord => 
          newTargetBoard[coord.row][coord.col].isHit
        );
        
        if (allHit) {
          result = 'sunk';
          hitShip.isSunk = true;
        }
      }
    } else {
      newTargetBoard[coordinate.row][coordinate.col].isMiss = true;
    }

    const updatedTargetPlayer = {
      ...targetPlayer,
      board: newTargetBoard,
    };

    const updatedShootingPlayer = {
      ...shootingPlayer,
      shots: [...shootingPlayer.shots, coordinate],
    };

    const allShipsSunk = updatedTargetPlayer.ships.every(ship => ship.isSunk);
    const winner = allShipsSunk ? currentPlayer : undefined;
    const phase = winner ? 'victory' : 'battle';

    set({
      [currentPlayer === 'human' ? 'cpuPlayer' : 'humanPlayer']: updatedTargetPlayer,
      [currentPlayer === 'human' ? 'humanPlayer' : 'cpuPlayer']: updatedShootingPlayer,
      currentPlayer: result === 'hit' || result === 'sunk' ? currentPlayer : (currentPlayer === 'human' ? 'cpu' : 'human'),
      lastShot: { coordinate, result, shipName },
      winner,
      phase,
    });
  },

  resetGame: () => {
    get().initializeGame();
  },

  setPhase: (phase) => {
    set({ phase });
  },
}));
