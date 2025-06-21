import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameBoard } from './GameBoard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Coordinate } from '../types/game';

export const BattleScreen: React.FC = () => {
  const {
    humanPlayer,
    cpuPlayer,
    currentPlayer,
    lastShot,
    fireShot,
  } = useGameStore();

  const handlePlayerShot = (coordinate: Coordinate) => {
    if (currentPlayer === 'human') {
      fireShot(coordinate);
    }
  };

  useEffect(() => {
    if (currentPlayer === 'cpu') {
      const timer = setTimeout(() => {
        const cpuShot = generateCPUShot();
        if (cpuShot) {
          fireShot(cpuShot);
        }
      }, 1000); // 1 second delay for CPU move

      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentPlayer]);

  const generateCPUShot = (): Coordinate | null => {
    const board = humanPlayer.board;
    const shots = cpuPlayer.shots;
    
    const hits = shots.filter(shot => {
      const cell = board[shot.row][shot.col];
      return cell.isHit && cell.hasShip;
    });

    if (hits.length > 0) {
      for (const hit of hits) {
        const adjacentCells = getAdjacentCells(hit);
        
        for (const adjacent of adjacentCells) {
          const alreadyShot = shots.some(shot => 
            shot.row === adjacent.row && shot.col === adjacent.col
          );
          
          if (!alreadyShot) {
            return adjacent;
          }
        }
      }
    }

    const availableCells: Coordinate[] = [];
    
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const alreadyShot = shots.some(shot => 
          shot.row === row && shot.col === col
        );
        
        if (!alreadyShot) {
          if ((row + col) % 2 === 0) {
            availableCells.push({ row, col });
          }
        }
      }
    }

    if (availableCells.length === 0) {
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const alreadyShot = shots.some(shot => 
            shot.row === row && shot.col === col
          );
          
          if (!alreadyShot) {
            availableCells.push({ row, col });
          }
        }
      }
    }

    if (availableCells.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
  };

  const getAdjacentCells = (coordinate: Coordinate): Coordinate[] => {
    const { row, col } = coordinate;
    const adjacent: Coordinate[] = [];
    
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 },  // right
    ];

    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      
      if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
        adjacent.push({ row: newRow, col: newCol });
      }
    }

    return adjacent;
  };

  const getShipStatus = (player: typeof humanPlayer) => {
    return player.ships.map(ship => ({
      name: ship.name,
      isSunk: ship.isSunk,
    }));
  };

  const humanShipStatus = getShipStatus(humanPlayer);
  const cpuShipStatus = getShipStatus(cpuPlayer);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <h2 className="text-2xl font-bold text-center">Battle Phase</h2>
      
      {/* Current turn indicator */}
      <div className="text-center">
        <Badge variant={currentPlayer === 'human' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
          {currentPlayer === 'human' ? 'Your Turn' : 'CPU Turn'}
        </Badge>
      </div>

      {/* Last shot result */}
      {lastShot && (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="font-medium">
            Last shot: {String.fromCharCode(65 + lastShot.coordinate.row)}{lastShot.coordinate.col + 1} - 
            <span className={`ml-2 ${
              lastShot.result === 'hit' ? 'text-orange-600' :
              lastShot.result === 'sunk' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {lastShot.result === 'sunk' ? `Sunk ${lastShot.shipName}!` : lastShot.result.toUpperCase()}
            </span>
          </p>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Enemy Board (CPU) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Enemy Waters</CardTitle>
            <div className="flex flex-wrap gap-2 justify-center">
              {cpuShipStatus.map(ship => (
                <Badge 
                  key={ship.name} 
                  variant={ship.isSunk ? 'destructive' : 'outline'}
                  className="text-xs"
                >
                  {ship.name} {ship.isSunk ? '💀' : '🚢'}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <GameBoard
              board={cpuPlayer.board}
              onCellClick={handlePlayerShot}
              showShips={false}
            />
            <p className="text-sm text-gray-600 mt-2 text-center">
              Click to fire at enemy ships
            </p>
          </CardContent>
        </Card>

        {/* Player Board (Human) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Your Fleet</CardTitle>
            <div className="flex flex-wrap gap-2 justify-center">
              {humanShipStatus.map(ship => (
                <Badge 
                  key={ship.name} 
                  variant={ship.isSunk ? 'destructive' : 'default'}
                  className="text-xs"
                >
                  {ship.name} {ship.isSunk ? '💀' : '🚢'}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <GameBoard
              board={humanPlayer.board}
              isPlayerBoard={true}
              showShips={true}
            />
            <p className="text-sm text-gray-600 mt-2 text-center">
              Your ships and enemy attacks
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
