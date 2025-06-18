
import { render, screen, fireEvent } from '@testing-library/react';
import { VictoryModal } from '../VictoryModal';
import { useGameStore } from '../../store/gameStore';

jest.mock('../../store/gameStore');

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

describe('VictoryModal', () => {
  const mockResetGame = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
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
      resetGame: mockResetGame,
      setPhase: jest.fn(),
    });
  });

  it('renders victory modal for human winner', () => {
    render(<VictoryModal />);
    
    expect(screen.getByText('🎉 Victory!')).toBeInTheDocument();
    expect(screen.getByText('Congratulations! You sunk all enemy ships!')).toBeInTheDocument();
  });

  it('renders victory modal for CPU winner', () => {
    mockUseGameStore.mockReturnValue({
      phase: 'victory',
      currentPlayer: 'cpu',
      winner: 'cpu',
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
      resetGame: mockResetGame,
      setPhase: jest.fn(),
    });

    render(<VictoryModal />);
    
    expect(screen.getByText('💀 Defeat!')).toBeInTheDocument();
    expect(screen.getByText('The enemy has sunk your entire fleet!')).toBeInTheDocument();
  });

  it('handles play again button click', () => {
    render(<VictoryModal />);
    
    const playAgainButton = screen.getByText('Play Again');
    fireEvent.click(playAgainButton);
    
    expect(mockResetGame).toHaveBeenCalled();
  });

  it('renders when phase is victory', () => {
    render(<VictoryModal />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  it('does not render when phase is not victory', () => {
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
      resetGame: mockResetGame,
      setPhase: jest.fn(),
    });

    const { container } = render(<VictoryModal />);
    expect(container.firstChild).toBeNull();
  });
});
