
import { render, screen } from '@testing-library/react';
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
      coordinates: [],
      isHorizontal: true,
      isSunk: false,
    },
  ];
};

describe('BattleScreen', () => {
  const mockFireShot = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
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

  it('renders battle interface', () => {
    render(<BattleScreen />);
    
    expect(screen.getByText('Battle Phase')).toBeInTheDocument();
    expect(screen.getByText('Your Fleet')).toBeInTheDocument();
    expect(screen.getByText('Enemy Waters')).toBeInTheDocument();
    expect(screen.getByText("Your Turn")).toBeInTheDocument();
  });

  it('shows CPU turn indicator', () => {
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
    
    expect(screen.getByText("CPU Turn")).toBeInTheDocument();
  });

  it('displays last shot result', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'human',
      lastShot: {
        coordinate: { row: 0, col: 0 },
        result: 'hit',
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
    
    expect(screen.getByText('HIT')).toBeInTheDocument();
  });
});
