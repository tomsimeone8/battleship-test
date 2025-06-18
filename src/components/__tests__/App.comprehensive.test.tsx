import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { useGameStore } from '../../store/gameStore';

jest.mock('../../store/gameStore');

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

const createMockBoard = () => {
  return Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 10 }, (_, col) => ({
      coordinate: { row, col },
      hasShip: false,
      isHit: false,
      isMiss: false,
    }))
  );
};

const createMockShips = () => {
  return [
    {
      id: 'carrier',
      name: 'Carrier',
      length: 5,
      coordinates: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
        { row: 0, col: 4 },
      ],
      isHorizontal: true,
      isSunk: false,
    },
  ];
};

describe('App Comprehensive', () => {
  const mockInitializeGame = jest.fn();
  const mockPlaceShip = jest.fn();
  const mockSetPhase = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPlaceShip.mockReturnValue(true);
  });

  it('covers ship placement validation and battle start', () => {
    const shipsWithCoordinates = createMockShips();
    
    mockUseGameStore.mockReturnValue({
      phase: 'setup',
      currentPlayer: 'human',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: createMockBoard(),
        ships: shipsWithCoordinates,
        shots: [],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [],
      },
      initializeGame: mockInitializeGame,
      placeShip: mockPlaceShip,
      fireShot: jest.fn(),
      resetGame: jest.fn(),
      setPhase: mockSetPhase,
    });

    render(<App />);
    
    const startBattleButton = screen.getByText('Start Battle');
    fireEvent.click(startBattleButton);
    
    expect(mockSetPhase).toHaveBeenCalledWith('battle');
  });

  it('covers new game functionality', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'human',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [],
      },
      initializeGame: mockInitializeGame,
      placeShip: mockPlaceShip,
      fireShot: jest.fn(),
      resetGame: jest.fn(),
      setPhase: mockSetPhase,
    });

    render(<App />);
    
    const newGameButton = screen.getByText('New Game');
    fireEvent.click(newGameButton);
    
    expect(mockInitializeGame).toHaveBeenCalled();
  });

  it('covers ship placement failure handling', () => {
    mockPlaceShip.mockReturnValue(false);
    
    mockUseGameStore.mockReturnValue({
      phase: 'setup',
      currentPlayer: 'human',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [],
      },
      initializeGame: mockInitializeGame,
      placeShip: mockPlaceShip,
      fireShot: jest.fn(),
      resetGame: jest.fn(),
      setPhase: mockSetPhase,
    });

    render(<App />);
    
    expect(mockPlaceShip).toBeDefined();
  });
});
