import React, { useEffect } from 'react';
import { SquareBoard } from './SquareBoard';
import { CircleBoard } from './CircleBoard';
import { PlayerHand } from './PlayerHand';
import { GameOverModal } from './GameOverModal';
import { useGameStore } from '../store/gameStore';
import { THEME_REGISTRY } from '../data/themes';

export const GameLayout: React.FC = () => {
  const activeTheme = useGameStore((state) => state.activeTheme);
  const turnCount = useGameStore((state) => state.turnCount);
  const reactionQueue = useGameStore((state) => state.reactionQueue);
  const processReactionQueue = useGameStore((state) => state.processReactionQueue);
  const updateTile = useGameStore((state) => state.updateTile);
  const addToLog = useGameStore((state) => state.addToLog);

  // Reaction Queue Processor
  useEffect(() => {
    if (reactionQueue.length > 0) {
      const timer = setTimeout(() => {
        const event = reactionQueue[0];
        
        // Execute visual logic here (or in the store)
        // For now, we manually handle specific events to show the "Animation" delay
        if (event.type === 'FLOOD') {
           const { x, y } = event.payload;
           updateTile(x, y, { state: 'FLOODED' });
           addToLog(`The ocean rises at ${x},${y}!`, 'EVENT');
        }

        // Remove from queue
        processReactionQueue();
      }, 1000); // 1 second delay between events

      return () => clearTimeout(timer);
    }
  }, [reactionQueue, processReactionQueue, updateTile, addToLog]);

  return (
    <div className="w-screen h-screen bg-slate-950 flex overflow-hidden">
      {/* Left Panel: The Outer Circle (Control) */}
      <div className="w-[30%] min-w-[300px] h-full">
        <CircleBoard />
      </div>

      {/* Right Panel: The Inner Square (World) */}
      <div 
        className="flex-1 h-full flex flex-col items-center justify-center relative transition-colors duration-1000 ease-in-out"
        style={{ backgroundColor: activeThemeData.colors.bg }}
      >
        {/* Header / HUD */}
        <div className="absolute top-8 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-slate-700 text-slate-200 flex gap-6 shadow-xl">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Turn</span>
              <span className="font-bold font-mono text-xl">{turnCount}</span>
            </div>
            <div className="w-px h-full bg-slate-700" />
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Theme</span>
              <span className="font-bold" style={{ color: activeThemeData.colors.secondary }}>
                {activeThemeData.name}
              </span>
            </div>
          </div>
        </div>

        {/* The Board */}
        <div className="p-8">
          <SquareBoard />
        </div>

        {/* Player Hand Overlay */}
        <PlayerHand />
      </div>
    </div>
  );
};
