
import { render, screen } from '@testing-library/react';
import App from '../../App';
import { useGameStore } from '../../store/gameStore';

jest.mock('../../store/gameStore');

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders setup phase correctly', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'setup',
      currentPlayer: 'human',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: [],
        ships: [],
        shots: [],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: [],
        ships: [],
        shots: [],
      },
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: jest.fn(),
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });

    render(<App />);
    
    expect(screen.getByText('⚓ Battleship ⚓')).toBeInTheDocument();
    expect(screen.getByText('Place Your Fleet')).toBeInTheDocument();
  });

  it('renders battle phase correctly', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'battle',
      currentPlayer: 'human',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: [],
        ships: [],
        shots: [],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: [],
        ships: [],
        shots: [],
      },
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: jest.fn(),
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });

    render(<App />);
    
    expect(screen.getByText('⚓ Battleship ⚓')).toBeInTheDocument();
    expect(screen.getByText('Battle Phase')).toBeInTheDocument();
  });

  it('renders victory phase correctly', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'victory',
      currentPlayer: 'human',
      winner: 'human',
      humanPlayer: {
        id: 'human',
        name: 'Human',
        board: [],
        ships: [],
        shots: [],
      },
      cpuPlayer: {
        id: 'cpu',
        name: 'CPU',
        board: [],
        ships: [],
        shots: [],
      },
      initializeGame: jest.fn(),
      placeShip: jest.fn(),
      fireShot: jest.fn(),
      resetGame: jest.fn(),
      setPhase: jest.fn(),
    });

    render(<App />);
    
    expect(screen.getByText('⚓ Battleship ⚓')).toBeInTheDocument();
    expect(screen.getByText('🎉 Victory!')).toBeInTheDocument();
  });
});
