import React from 'react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../utils/cn';

export const PlayerHand: React.FC = () => {
  const activePlayerId = useGameStore((state) => state.activePlayerId);
  const players = useGameStore((state) => state.players);
  const activeRelicId = useGameStore((state) => state.activeRelicId);
  const selectRelic = useGameStore((state) => state.selectRelic);

  if (!activePlayerId) return null;
  const player = players[activePlayerId];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl flex gap-4 items-end">
        {player.inventory.map((relic) => (
          <button
            key={relic.id}
            onClick={() => selectRelic(activeRelicId === relic.id ? null : relic.id)}
            className={cn(
              'w-16 h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all hover:-translate-y-2',
              activeRelicId === relic.id
                ? 'bg-indigo-900/50 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'bg-slate-800 border-slate-600 hover:border-slate-400'
            )}
            title={relic.description}
          >
            <span className="text-2xl">{relic.icon || '🔮'}</span>
            <span className="text-[10px] font-bold text-slate-300 text-center leading-tight px-1">
              {relic.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
