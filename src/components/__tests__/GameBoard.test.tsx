import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '../GameBoard';
import { Board, BOARD_SIZE } from '../../types/game';

const createMockBoard = (): Board => {
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => ({
      coordinate: { row, col },
      hasShip: false,
      isHit: false,
      isMiss: false,
    }))
  );
};

describe('GameBoard', () => {
  it('renders the game board with correct dimensions', () => {
    const board = createMockBoard();
    render(<GameBoard board={board} />);
    
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays ships when showShips is true', () => {
    const board = createMockBoard();
    board[0][0].hasShip = true;
    board[0][0].shipId = 'carrier';
    
    render(<GameBoard board={board} showShips={true} />);
    
    const shipCell = screen.getByLabelText('A1 - Ship');
    expect(shipCell).toHaveTextContent('🚢');
  });

  it('displays hit markers correctly', () => {
    const board = createMockBoard();
    board[0][0].hasShip = true;
    board[0][0].isHit = true;
    
    render(<GameBoard board={board} />);
    
    const hitCell = screen.getByLabelText('A1 - Hit');
    expect(hitCell).toHaveTextContent('💥');
  });

  it('displays miss markers correctly', () => {
    const board = createMockBoard();
    board[0][0].isMiss = true;
    
    render(<GameBoard board={board} />);
    
    const missCell = screen.getByLabelText('A1 - Miss');
    expect(missCell).toHaveTextContent('⚪');
  });

  it('calls onCellClick when a cell is clicked', () => {
    const board = createMockBoard();
    const mockOnCellClick = jest.fn();
    
    render(<GameBoard board={board} onCellClick={mockOnCellClick} />);
    
    const cell = screen.getByLabelText('A1 - Empty');
    fireEvent.click(cell);
    
    expect(mockOnCellClick).toHaveBeenCalledWith({ row: 0, col: 0 });
  });

  it('supports keyboard navigation', () => {
    const board = createMockBoard();
    const mockOnCellClick = jest.fn();
    
    render(<GameBoard board={board} onCellClick={mockOnCellClick} />);
    
    const cell = screen.getByLabelText('A1 - Empty');
    fireEvent.keyDown(cell, { key: 'Enter' });
    
    expect(mockOnCellClick).toHaveBeenCalledWith({ row: 0, col: 0 });
  });

  it('supports space key for keyboard navigation', () => {
    const board = createMockBoard();
    const mockOnCellClick = jest.fn();
    
    render(<GameBoard board={board} onCellClick={mockOnCellClick} />);
    
    const cell = screen.getByLabelText('A1 - Empty');
    fireEvent.keyDown(cell, { key: ' ' });
    
    expect(mockOnCellClick).toHaveBeenCalledWith({ row: 0, col: 0 });
  });
});
