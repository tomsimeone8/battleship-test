
import { render, screen } from '@testing-library/react';
import { VictoryModal } from '../VictoryModal';
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
      coordinates: [],
      isHorizontal: true,
      isSunk: false,
    },
    {
      id: 'battleship',
      name: 'Battleship',
      length: 4,
      coordinates: [],
      isHorizontal: true,
      isSunk: true,
    },
  ];
};

describe('VictoryModal Integration', () => {
  const mockResetGame = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates game statistics correctly', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'victory',
      currentPlayer: 'human',
      winner: 'human',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 5, col: 5 },
        ],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [
          { row: 1, col: 1 },
          { row: 2, col: 2 },
        ],
      },
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: jest.fn(),
      resetGame: mockResetGame,
      setPhase: jest.fn(),
    });

    render(<VictoryModal />);
    
    expect(screen.getByText('Shots: 3')).toBeInTheDocument();
    expect(screen.getByText('Shots: 2')).toBeInTheDocument();
  });

  it('displays fleet status with mixed sunk/alive ships', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'victory',
      currentPlayer: 'human',
      winner: 'human',
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
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: jest.fn(),
      resetGame: mockResetGame,
      setPhase: jest.fn(),
    });

    render(<VictoryModal />);
    
    expect(screen.getAllByText('Carrier 🚢')).toHaveLength(2);
    expect(screen.getAllByText('Battleship 💀')).toHaveLength(2);
  });

  it('shows battle statistics section', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'victory',
      currentPlayer: 'human',
      winner: 'human',
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
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: jest.fn(),
      resetGame: mockResetGame,
      setPhase: jest.fn(),
    });

    render(<VictoryModal />);
    
    expect(screen.getByText('Battle Statistics')).toBeInTheDocument();
    expect(screen.getByText('Your Performance')).toBeInTheDocument();
    expect(screen.getByText('CPU Performance')).toBeInTheDocument();
  });
});
