import { render, screen, waitFor } from '@testing-library/react';
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

describe('BattleScreen Advanced', () => {
  const mockFireShot = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handles CPU turn with timeout', async () => {
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

  it('displays last shot with ship sunk', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'human',
      lastShot: {
        coordinate: { row: 0, col: 0 },
        result: 'sunk',
        shipName: 'Carrier',
      },
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
    
    expect(screen.getByText('Sunk Carrier!')).toBeInTheDocument();
  });

  it('displays miss result', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'human',
      lastShot: {
        coordinate: { row: 0, col: 0 },
        result: 'miss',
      },
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
    
    expect(screen.getByText(/Miss/i)).toBeInTheDocument();
  });

  it('handles cleanup on unmount', () => {
    const { unmount } = render(<BattleScreen />);
    
    unmount();
    
    expect(jest.getTimerCount()).toBe(0);
  });

  it('covers CPU hunt-and-target logic with hits', async () => {
    const boardWithHit = createMockBoard();
    boardWithHit[0][0].hasShip = true;
    boardWithHit[0][0].isHit = true;

    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'cpu',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: boardWithHit,
        ships: createMockShips(),
        shots: [],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [{ row: 0, col: 0 }],
      },
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: mockFireShot,
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });

    render(<BattleScreen />);
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(mockFireShot).toHaveBeenCalled();
    });
  });

  it('covers CPU fallback logic when checkerboard exhausted', async () => {
    const shots = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 === 0) {
          shots.push({ row, col });
        }
      }
    }

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
        shots: shots,
      },
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: mockFireShot,
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });

    render(<BattleScreen />);
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(mockFireShot).toHaveBeenCalled();
    });
  });

  it('covers adjacent cell calculation edge cases', async () => {
    const boardWithHit = createMockBoard();
    boardWithHit[9][9].hasShip = true;
    boardWithHit[9][9].isHit = true;

    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'cpu',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: boardWithHit,
        ships: createMockShips(),
        shots: [],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: createMockBoard(),
        ships: createMockShips(),
        shots: [{ row: 9, col: 9 }],
      },
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: mockFireShot,
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });

    render(<BattleScreen />);
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(mockFireShot).toHaveBeenCalled();
    });
  });
});
