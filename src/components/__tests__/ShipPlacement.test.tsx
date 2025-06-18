import { render, screen, fireEvent } from '@testing-library/react';
import { ShipPlacement } from '../ShipPlacement';
import { SHIP_TYPES } from '../../types/game';

const createMockShips = () => {
  return SHIP_TYPES.map(shipType => ({
    id: shipType.id,
    name: shipType.name,
    length: shipType.length,
    coordinates: [],
    isHorizontal: true,
    isSunk: false,
  }));
};

describe('ShipPlacement', () => {
  const mockPlaceShip = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPlaceShip.mockReturnValue(true);
  });

  it('renders ship placement interface', () => {
    const ships = createMockShips();
    
    render(
      <ShipPlacement 
        ships={ships}
        onPlaceShip={mockPlaceShip}
        onComplete={mockOnComplete}
      />
    );
    
    expect(screen.getByText('Place Your Fleet')).toBeInTheDocument();
    expect(screen.getByText('Carrier (5 cells)')).toBeInTheDocument();
    expect(screen.getByText('Battleship (4 cells)')).toBeInTheDocument();
    expect(screen.getByText('Cruiser (3 cells)')).toBeInTheDocument();
    expect(screen.getByText('Submarine (3 cells)')).toBeInTheDocument();
    expect(screen.getByText('Destroyer (2 cells)')).toBeInTheDocument();
  });

  it('shows start battle button when all ships are placed', () => {
    const shipsWithCoordinates = createMockShips().map(ship => ({
      ...ship,
      coordinates: Array.from({ length: ship.length }, (_, i) => ({ row: 0, col: i })),
    }));

    render(
      <ShipPlacement 
        ships={shipsWithCoordinates}
        onPlaceShip={mockPlaceShip}
        onComplete={mockOnComplete}
      />
    );
    
    const startButton = screen.getByText('Start Battle');
    expect(startButton).toBeInTheDocument();
    
    fireEvent.click(startButton);
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('handles ship selection', () => {
    const ships = createMockShips();
    
    render(
      <ShipPlacement 
        ships={ships}
        onPlaceShip={mockPlaceShip}
        onComplete={mockOnComplete}
      />
    );
    
    const carrierButton = screen.getByText('Carrier (5 cells)');
    fireEvent.click(carrierButton);
    
    expect(carrierButton).toHaveClass('bg-zinc-900');
  });

  it('handles orientation toggle', () => {
    const ships = createMockShips();
    
    render(
      <ShipPlacement 
        ships={ships}
        onPlaceShip={mockPlaceShip}
        onComplete={mockOnComplete}
      />
    );
    
    const carrierButton = screen.getByText('Carrier (5 cells)');
    fireEvent.click(carrierButton);
    
    const horizontalButton = screen.getByText('Horizontal');
    const verticalButton = screen.getByText('Vertical');
    
    expect(horizontalButton).toHaveClass('bg-zinc-900');
    
    fireEvent.click(verticalButton);
    expect(verticalButton).toHaveClass('bg-zinc-900');
  });
});
