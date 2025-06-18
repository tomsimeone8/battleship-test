import * as React from 'react';
import { useState } from 'react';
import { Ship, Coordinate, ROWS, COLS } from '../types/game';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

interface ShipPlacementProps {
  ships: Ship[];
  onPlaceShip: (shipId: string, coordinate: Coordinate, isHorizontal: boolean) => boolean;
  onComplete: () => void;
}

export const ShipPlacement: React.FC<ShipPlacementProps> = ({
  ships,
  onPlaceShip,
  onComplete,
}) => {
  const [selectedShip, setSelectedShip] = useState<string | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(true);

  const unplacedShips = ships.filter(ship => ship.coordinates.length === 0);
  const placedShips = ships.filter(ship => ship.coordinates.length > 0);

  const handleCellClick = (coordinate: Coordinate) => {
    if (!selectedShip) return;

    const success = onPlaceShip(selectedShip, coordinate, isHorizontal);
    if (success) {
      setSelectedShip(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, coordinate: Coordinate) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCellClick(coordinate);
    }
  };



  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <h2 className="text-2xl font-bold text-center">Place Your Fleet</h2>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Ship Selection Panel */}
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Ships to Place</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unplacedShips.length > 0 ? (
              <>
                <div className="space-y-2">
                  {unplacedShips.map(ship => (
                    <Button
                      key={ship.id}
                      variant={selectedShip === ship.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedShip(ship.id)}
                    >
                      {ship.name} ({ship.length} cells)
                    </Button>
                  ))}
                </div>
                
                {selectedShip && (
                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm font-medium">Orientation:</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={isHorizontal ? 'default' : 'outline'}
                        onClick={() => setIsHorizontal(true)}
                      >
                        Horizontal
                      </Button>
                      <Button
                        size="sm"
                        variant={!isHorizontal ? 'default' : 'outline'}
                        onClick={() => setIsHorizontal(false)}
                      >
                        Vertical
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-green-600 font-medium">All ships placed!</p>
                <Button onClick={onComplete} className="w-full">
                  Start Battle
                </Button>
              </div>
            )}
            
            {placedShips.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Placed Ships:</p>
                <div className="space-y-1">
                  {placedShips.map(ship => (
                    <div key={ship.id} className="text-sm text-green-600">
                      ✓ {ship.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Board */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-600">
            {selectedShip 
              ? `Click on the board to place your ${ships.find(s => s.id === selectedShip)?.name}`
              : 'Select a ship to place'
            }
          </p>
          
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
            {Array.from({ length: 10 }, (_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Row header */}
                <div className="w-8 h-8 border border-gray-400 bg-gray-100 flex items-center justify-center text-sm font-bold">
                  {ROWS[rowIndex]}
                </div>
                
                {/* Row cells */}
                {Array.from({ length: 10 }, (_, colIndex) => {
                  const coordinate = { row: rowIndex, col: colIndex };
                  const hasShip = placedShips.some(ship => 
                    ship.coordinates.some(coord => 
                      coord.row === rowIndex && coord.col === colIndex
                    )
                  );
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        'w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors',
                        'hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                        {
                          'bg-gray-200': hasShip,
                          'bg-white': !hasShip,
                        }
                      )}
                      onClick={() => handleCellClick(coordinate)}
                      onKeyDown={(e) => handleKeyDown(e, coordinate)}
                      tabIndex={selectedShip ? 0 : -1}
                      role="button"
                      aria-label={`${ROWS[rowIndex]}${COLS[colIndex]} - ${hasShip ? 'Ship placed' : 'Empty'}`}
                    >
                      {hasShip ? '🚢' : ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
