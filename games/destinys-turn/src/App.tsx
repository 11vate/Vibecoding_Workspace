import React, { useEffect } from 'react';
import { GameLayout } from './components/GameLayout';
import { useGameStore } from './store/gameStore';

function App() {
  const initializeWorld = useGameStore((state) => state.initializeWorld);

  useEffect(() => {
    initializeWorld();
  }, [initializeWorld]);

  return (
    <GameLayout />
  );
}

export default App;
