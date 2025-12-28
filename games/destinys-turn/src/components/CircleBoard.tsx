import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { cn } from '../utils/cn';

export const CircleBoard: React.FC = () => {
  const circleBoardSize = useGameStore((state) => state.circleBoardSize);
  const activePlayerId = useGameStore((state) => state.activePlayerId);
  const players = useGameStore((state) => state.players);
  const movePlayer = useGameStore((state) => state.movePlayer);
  const setTheme = useGameStore((state) => state.setTheme);
  const moveRabbit = useGameStore((state) => state.moveRabbit);

  // Generate spaces
  const spaces = Array.from({ length: circleBoardSize }, (_, i) => i);

  const handleRoll = () => {
    if (!activePlayerId) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    movePlayer(activePlayerId, roll);
    
    // Debug: 1 in 6 chance to change theme for testing
    if (Math.random() > 0.8) {
       const themes = ['WATER', 'FIRE', 'NORMAL'] as const;
       const randomTheme = themes[Math.floor(Math.random() * themes.length)];
       setTheme(randomTheme);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-y-auto p-4 bg-slate-800 rounded-l-xl border-r border-slate-700">
      <div className="sticky top-0 bg-slate-800 py-2 z-10 flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-200">Outer Path</h2>
        <button
          onClick={handleRoll}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded shadow-lg transition-colors"
        >
          Roll Dice
        </button>
      </div>
      
      <div className="flex flex-col gap-2 relative">
        {spaces.map((index) => {
          // Check if any player is here
          const playersHere = Object.values(players).filter(p => p.position === index);

          return (
            <div
              key={index}
              className={cn(
                'w-full h-16 rounded-md border border-slate-600 flex items-center px-4 justify-between',
                'bg-slate-700/50 hover:bg-slate-700 transition-colors'
              )}
            >
              <span className="text-slate-400 font-mono text-sm">#{index}</span>
              
              <div className="flex gap-1">
                {playersHere.map(player => (
                  <motion.div
                    key={player.id}
                    layoutId={`player-${player.id}`}
                    className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white shadow-lg"
                    title={player.name}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
