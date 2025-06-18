import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { ShipPlacement } from './components/ShipPlacement';
import { BattleScreen } from './components/BattleScreen';
import { VictoryModal } from './components/VictoryModal';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

function App() {
  const { 
    phase, 
    humanPlayer, 
    initializeGame, 
    placeShip, 
    setPhase 
  } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handlePlaceShip = (shipId: string, coordinate: any, isHorizontal: boolean) => {
    return placeShip(shipId, coordinate, isHorizontal);
  };

  const handleStartBattle = () => {
    const allShipsPlaced = humanPlayer.ships.every(ship => ship.coordinates.length > 0);
    if (allShipsPlaced) {
      setPhase('battle');
    }
  };

  const handleNewGame = () => {
    initializeGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">⚓ Battleship ⚓</h1>
          <p className="text-blue-700">The classic naval strategy game</p>
        </div>

        {/* Game Content */}
        {phase === 'setup' && (
          <div className="max-w-6xl mx-auto">
            <ShipPlacement
              ships={humanPlayer.ships}
              onPlaceShip={handlePlaceShip}
              onComplete={handleStartBattle}
            />
          </div>
        )}

        {phase === 'battle' && (
          <div className="max-w-7xl mx-auto">
            <BattleScreen />
          </div>
        )}

        {/* New Game Button */}
        {phase !== 'setup' && (
          <div className="fixed top-4 right-4">
            <Button onClick={handleNewGame} variant="outline">
              New Game
            </Button>
          </div>
        )}

        {/* Victory Modal */}
        <VictoryModal />

        {/* Instructions Card */}
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-center">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Setup:</strong> Place your 5 ships on the grid. Ships cannot touch each other.</div>
            <div><strong>Battle:</strong> Take turns firing at enemy positions. Click on the enemy grid to attack.</div>
            <div><strong>Ships:</strong> Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2)</div>
            <div><strong>Victory:</strong> Sink all enemy ships to win!</div>
            <div><strong>Controls:</strong> Use mouse clicks or keyboard navigation (Tab + Enter/Space)</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
