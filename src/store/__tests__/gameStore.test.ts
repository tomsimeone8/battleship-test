import { useGameStore } from '../gameStore';
import { SHIP_TYPES } from '../../types/game';



describe('GameStore', () => {
  beforeEach(() => {
    useGameStore.getState().initializeGame();
  });

  it('initializes game with correct initial state', () => {
    const state = useGameStore.getState();
    
    expect(state.phase).toBe('setup');
    expect(state.currentPlayer).toBe('human');
    expect(state.humanPlayer.ships).toHaveLength(5);
    expect(state.cpuPlayer.ships).toHaveLength(5);
    expect(state.winner).toBeUndefined();
  });

  it('creates players with correct ship types', () => {
    const state = useGameStore.getState();
    
    SHIP_TYPES.forEach((shipType, index) => {
      expect(state.humanPlayer.ships[index].name).toBe(shipType.name);
      expect(state.humanPlayer.ships[index].length).toBe(shipType.length);
      expect(state.cpuPlayer.ships[index].name).toBe(shipType.name);
      expect(state.cpuPlayer.ships[index].length).toBe(shipType.length);
    });
  });

  it('places ships correctly on valid positions', () => {
    const state = useGameStore.getState();
    const success = state.placeShip('carrier', { row: 0, col: 0 }, true);
    
    expect(success).toBe(true);
    
    const updatedState = useGameStore.getState();
    const carrier = updatedState.humanPlayer.ships.find(s => s.id === 'carrier');
    
    expect(carrier?.coordinates).toHaveLength(5);
    expect(carrier?.isHorizontal).toBe(true);
    expect(updatedState.humanPlayer.board[0][0].hasShip).toBe(true);
    expect(updatedState.humanPlayer.board[0][4].hasShip).toBe(true);
  });

  it('prevents invalid ship placement', () => {
    const state = useGameStore.getState();
    
    const success = state.placeShip('carrier', { row: 0, col: 7 }, true);
    expect(success).toBe(false);
    
    const success2 = state.placeShip('carrier', { row: 7, col: 0 }, false);
    expect(success2).toBe(false);
  });

  it('prevents overlapping ship placement', () => {
    const state = useGameStore.getState();
    
    state.placeShip('carrier', { row: 0, col: 0 }, true);
    
    const success = state.placeShip('battleship', { row: 0, col: 2 }, true);
    expect(success).toBe(false);
  });

  it('processes shots correctly', () => {
    const state = useGameStore.getState();
    
    const cpuBoard = state.cpuPlayer.board;
    cpuBoard[5][5].hasShip = false;
    cpuBoard[5][5].shipId = undefined;
    
    state.setPhase('battle');
    
    state.fireShot({ row: 5, col: 5 });
    
    const updatedState = useGameStore.getState();
    expect(updatedState.cpuPlayer.board[5][5].isMiss).toBe(true);
    expect(updatedState.lastShot?.result).toBe('miss');
  });

  it('detects hits correctly', () => {
    const state = useGameStore.getState();
    
    const cpuBoard = state.cpuPlayer.board;
    cpuBoard[0][0].hasShip = true;
    cpuBoard[0][0].shipId = 'destroyer';
    
    state.setPhase('battle');
    
    state.fireShot({ row: 0, col: 0 });
    
    const updatedState = useGameStore.getState();
    expect(updatedState.cpuPlayer.board[0][0].isHit).toBe(true);
    expect(updatedState.lastShot?.result).toBe('hit');
  });

  it('switches turns correctly', () => {
    const state = useGameStore.getState();
    state.setPhase('battle');
    
    expect(state.currentPlayer).toBe('human');
    
    const cpuBoard = state.cpuPlayer.board;
    cpuBoard[5][5].hasShip = false;
    cpuBoard[5][5].shipId = undefined;
    
    state.fireShot({ row: 5, col: 5 });
    
    const updatedState = useGameStore.getState();
    expect(updatedState.currentPlayer).toBe('cpu');
    expect(updatedState.lastShot?.result).toBe('miss');
  });

  it('maintains turn on hit', () => {
    const state = useGameStore.getState();
    
    const cpuBoard = state.cpuPlayer.board;
    cpuBoard[0][0].hasShip = true;
    cpuBoard[0][0].shipId = 'destroyer';
    
    state.setPhase('battle');
    
    state.fireShot({ row: 0, col: 0 });
    
    const updatedState = useGameStore.getState();
    expect(updatedState.currentPlayer).toBe('human');
  });

  it('resets game correctly', () => {
    const state = useGameStore.getState();
    
    state.setPhase('battle');
    state.placeShip('carrier', { row: 0, col: 0 }, true);
    
    state.resetGame();
    
    const resetState = useGameStore.getState();
    expect(resetState.phase).toBe('setup');
    expect(resetState.currentPlayer).toBe('human');
    expect(resetState.humanPlayer.ships.every(ship => ship.coordinates.length === 0)).toBe(true);
  });
});
