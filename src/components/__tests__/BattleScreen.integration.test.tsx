
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BattleScreen } from '../BattleScreen';
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

describe('BattleScreen Integration', () => {
  const mockFireShot = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
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
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: mockFireShot,
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handles player shot on enemy board', () => {
    render(<BattleScreen />);
    
    const enemyCell = screen.getAllByRole('button')[0];
    fireEvent.click(enemyCell);
    
    expect(mockFireShot).toHaveBeenCalled();
  });

  it('triggers CPU move after delay when CPU turn', async () => {
    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'cpu',
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
      fireShot: mockFireShot,
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });

    render(<BattleScreen />);
    
    expect(mockFireShot).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(mockFireShot).toHaveBeenCalled();
    });
  });

  it('displays ship status badges', () => {
    render(<BattleScreen />);
    
    expect(screen.getAllByText('Carrier 🚢')).toHaveLength(2);
  });

  it('shows sunk ship status', () => {
    const sunkShips = createMockShips();
    sunkShips[0].isSunk = true;

    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'human',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: createMockBoard(),
        ships: sunkShips,
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
      fireShot: mockFireShot,
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });

    render(<BattleScreen />);
    
    expect(screen.getByText('Carrier 💀')).toBeInTheDocument();
  });
});
