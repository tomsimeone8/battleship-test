export type Coordinate = {
  row: number;
  col: number;
};

export type Ship = {
  id: string;
  name: string;
  length: number;
  coordinates: Coordinate[];
  isHorizontal: boolean;
  isSunk: boolean;
};

export type Cell = {
  coordinate: Coordinate;
  hasShip: boolean;
  shipId?: string;
  isHit: boolean;
  isMiss: boolean;
};

export type Board = Cell[][];

export type Player = {
  id: string;
  name: string;
  board: Board;
  ships: Ship[];
  shots: Coordinate[];
};

export type GamePhase = 'setup' | 'battle' | 'victory';

export type GameState = {
  phase: GamePhase;
  currentPlayer: 'human' | 'cpu';
  humanPlayer: Player;
  cpuPlayer: Player;
  winner?: 'human' | 'cpu';
  lastShot?: {
    coordinate: Coordinate;
    result: 'hit' | 'miss' | 'sunk';
    shipName?: string;
  };
};

export const SHIP_TYPES = [
  { id: 'carrier', name: 'Carrier', length: 5 },
  { id: 'battleship', name: 'Battleship', length: 4 },
  { id: 'cruiser', name: 'Cruiser', length: 3 },
  { id: 'submarine', name: 'Submarine', length: 3 },
  { id: 'destroyer', name: 'Destroyer', length: 2 },
] as const;

export const BOARD_SIZE = 10;
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const;
export const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
