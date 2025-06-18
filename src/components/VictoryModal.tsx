import React from 'react';
import { useGameStore } from '../store/gameStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const VictoryModal: React.FC = () => {
  const { phase, winner, humanPlayer, cpuPlayer, resetGame } = useGameStore();

  const isOpen = phase === 'victory';

  const handlePlayAgain = () => {
    resetGame();
  };

  const getGameStats = () => {
    const humanShots = humanPlayer.shots.length;
    const cpuShots = cpuPlayer.shots.length;
    const humanHits = humanPlayer.shots.filter(shot => {
      const cell = cpuPlayer.board[shot.row][shot.col];
      return cell.isHit && cell.hasShip;
    }).length;
    const cpuHits = cpuPlayer.shots.filter(shot => {
      const cell = humanPlayer.board[shot.row][shot.col];
      return cell.isHit && cell.hasShip;
    }).length;

    return {
      humanShots,
      cpuShots,
      humanHits,
      cpuHits,
      humanAccuracy: humanShots > 0 ? Math.round((humanHits / humanShots) * 100) : 0,
      cpuAccuracy: cpuShots > 0 ? Math.round((cpuHits / cpuShots) * 100) : 0,
    };
  };

  const stats = getGameStats();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {winner === 'human' ? '🎉 Victory!' : '💀 Defeat!'}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {winner === 'human' 
              ? 'Congratulations! You sunk all enemy ships!' 
              : 'The enemy has sunk your entire fleet!'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Game Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-center">Battle Statistics</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">Your Performance</div>
                <div className="space-y-1">
                  <div>Shots: {stats.humanShots}</div>
                  <div>Hits: {stats.humanHits}</div>
                  <div>
                    Accuracy: 
                    <Badge variant="outline" className="ml-1">
                      {stats.humanAccuracy}%
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-medium">CPU Performance</div>
                <div className="space-y-1">
                  <div>Shots: {stats.cpuShots}</div>
                  <div>Hits: {stats.cpuHits}</div>
                  <div>
                    Accuracy: 
                    <Badge variant="outline" className="ml-1">
                      {stats.cpuAccuracy}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fleet Status */}
          <div className="space-y-2">
            <div>
              <div className="font-medium text-sm mb-1">Your Fleet:</div>
              <div className="flex flex-wrap gap-1">
                {humanPlayer.ships.map(ship => (
                  <Badge 
                    key={ship.id}
                    variant={ship.isSunk ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {ship.name} {ship.isSunk ? '💀' : '🚢'}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="font-medium text-sm mb-1">Enemy Fleet:</div>
              <div className="flex flex-wrap gap-1">
                {cpuPlayer.ships.map(ship => (
                  <Badge 
                    key={ship.id}
                    variant={ship.isSunk ? 'destructive' : 'outline'}
                    className="text-xs"
                  >
                    {ship.name} {ship.isSunk ? '💀' : '🚢'}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={handlePlayAgain} className="w-full">
              Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
