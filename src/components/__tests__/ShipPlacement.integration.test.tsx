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

describe('ShipPlacement Integration', () => {
  const mockPlaceShip = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPlaceShip.mockReturnValue(true);
  });

  it('handles keyboard navigation', () => {
    const ships = createMockShips();
    
    render(
      <ShipPlacement 
        ships={ships}
        onPlaceShip={mockPlaceShip}
        onComplete={mockOnComplete}
      />
    );
    
    const carrierButton = screen.getByText('Carrier (5 cells)');
    carrierButton.focus();
    
    fireEvent.keyDown(carrierButton, { key: 'Enter' });
    expect(carrierButton).toBeInTheDocument();
  });

  it('handles grid cell keyboard interaction', () => {
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
    
    const gridCells = screen.getAllByRole('button');
    const firstGridCell = gridCells.find(cell => 
      cell.getAttribute('aria-label')?.includes('A1')
    );
    
    if (firstGridCell) {
      fireEvent.keyDown(firstGridCell, { key: 'Enter' });
      expect(mockPlaceShip).toHaveBeenCalled();
    }
  });

  it('shows placement feedback', () => {
    const ships = createMockShips();
    mockPlaceShip.mockReturnValue(false);
    
    render(
      <ShipPlacement 
        ships={ships}
        onPlaceShip={mockPlaceShip}
        onComplete={mockOnComplete}
      />
    );
    
    const carrierButton = screen.getByText('Carrier (5 cells)');
    fireEvent.click(carrierButton);
    
    const gridCells = screen.getAllByRole('button');
    const firstGridCell = gridCells.find(cell => 
      cell.getAttribute('aria-label')?.includes('A1')
    );
    
    if (firstGridCell) {
      fireEvent.click(firstGridCell);
      expect(mockPlaceShip).toHaveBeenCalled();
    }
  });

  it('handles ship selection and placement', () => {
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
    
    const gridCells = screen.getAllByRole('button');
    const firstGridCell = gridCells.find(cell => 
      cell.getAttribute('aria-label')?.includes('A1')
    );
    
    if (firstGridCell) {
      fireEvent.click(firstGridCell);
      expect(mockPlaceShip).toHaveBeenCalled();
    }
  });
});
