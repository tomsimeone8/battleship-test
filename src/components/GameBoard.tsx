import * as React from 'react';
import { Board, Coordinate, ROWS, COLS } from '../types/game';
import { cn } from '../lib/utils';

interface GameBoardProps {
  board: Board;
  isPlayerBoard?: boolean;
  onCellClick?: (coordinate: Coordinate) => void;
  showShips?: boolean;
  className?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  isPlayerBoard = false,
  onCellClick,
  showShips = false,
  className,
}) => {
  const handleCellClick = (coordinate: Coordinate) => {
    if (onCellClick) {
      onCellClick(coordinate);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, coordinate: Coordinate) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCellClick(coordinate);
    }
  };

  const getCellContent = (cell: typeof board[0][0]) => {
    if (cell.isHit && cell.hasShip) return '💥';
    if (cell.isHit) return '❌';
    if (cell.isMiss) return '⚪';
    if (showShips && cell.hasShip) return '🚢';
    return '';
  };

  const getCellClassName = (cell: typeof board[0][0]) => {
    return cn(
      'w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors',
      'hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
      {
        'bg-red-200': cell.isHit && cell.hasShip,
        'bg-blue-200': cell.isMiss,
        'bg-gray-200': showShips && cell.hasShip && !cell.isHit,
        'bg-white': !cell.isHit && !cell.isMiss && (!showShips || !cell.hasShip),
      }
    );
  };

  return (
    <div className={cn('inline-block', className)}>
      <div className="grid grid-cols-11 gap-0 border-2 border-gray-600">
        {/* Empty corner cell */}
        <div className="w-8 h-8 border border-gray-400 bg-gray-100"></div>
        
        {/* Column headers */}
        {COLS.map(col => (
          <div
            key={col}
            className="w-8 h-8 border border-gray-400 bg-gray-100 flex items-center justify-center text-sm font-bold"
          >
            {col}
          </div>
        ))}

        {/* Rows with row headers and cells */}
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Row header */}
            <div className="w-8 h-8 border border-gray-400 bg-gray-100 flex items-center justify-center text-sm font-bold">
              {ROWS[rowIndex]}
            </div>
            
            {/* Row cells */}
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClassName(cell)}
                onClick={() => handleCellClick(cell.coordinate)}
                onKeyDown={(e) => handleKeyDown(e, cell.coordinate)}
                tabIndex={onCellClick ? 0 : -1}
                role={onCellClick ? 'button' : 'cell'}
                aria-label={`${ROWS[rowIndex]}${COLS[colIndex]} - ${
                  cell.isHit && cell.hasShip ? 'Hit' :
                  cell.isMiss ? 'Miss' :
                  showShips && cell.hasShip ? 'Ship' :
                  'Empty'
                }`}
              >
                {getCellContent(cell)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
