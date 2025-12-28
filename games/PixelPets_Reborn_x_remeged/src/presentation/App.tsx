/**
 * Main Application Component
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navigation } from './components/common/Navigation';
import { CollectionView } from './components/Collection/CollectionView';
import { SummonView } from './components/Summon/SummonView';
import { FusionLab } from './components/FusionLab/FusionLab';
import { BattleView } from './components/Battle/BattleView';
import { DungeonView } from './components/Dungeon/DungeonView';
import { TeamBuilder } from './components/Team/TeamBuilder';
import { StoneInventoryView } from './components/Stones/StoneInventoryView';
import { StarterPetSelection } from './components/Starter/StarterPetSelection';
import { useDatabaseInit } from './hooks/useDatabaseInit';
import './App.css';

function App() {
  const { isInitializing, needsPlayerSetup, error } = useDatabaseInit();
  const [playerSetupComplete, setPlayerSetupComplete] = useState(false);

  if (isInitializing) {
    return (
      <div className="app">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Initializing Game...</h1>
          <p>Please wait while we set up your game data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
          <h1>Initialization Error</h1>
          <p>{error}</p>
          <p>Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  // Show starter setup for new players
  if (needsPlayerSetup && !playerSetupComplete) {
    return <StarterPetSelection onSelectionComplete={() => setPlayerSetupComplete(true)} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app">
          <Navigation />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<Navigate to="/collection" replace />} />
              <Route path="/collection" element={<CollectionView />} />
              <Route path="/summon" element={<SummonView />} />
              <Route path="/fusion" element={<FusionLab />} />
              <Route path="/battle" element={<BattleView />} />
              <Route path="/dungeons" element={<DungeonView />} />
              <Route path="/teams" element={<TeamBuilder />} />
              <Route path="/stones" element={<StoneInventoryView />} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/collection" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
