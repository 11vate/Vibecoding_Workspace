import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { cn } from '../utils/cn';
import type { Tile } from '../types';

const TileRenderer = ({ tile, x, y }: { tile: Tile; x: number; y: number }) => {
  const placeRelic = useGameStore((state) => state.placeRelic);
  const activeRelicId = useGameStore((state) => state.activeRelicId);

  // Determine tile color based on state/theme
  const getTileStyle = () => {
    if (tile.state === 'FLOODED') return 'bg-blue-600';
    if (tile.state === 'BURNING') return 'bg-orange-600 animate-pulse';
    if (tile.state === 'LOCKED') return 'bg-gray-800 border-2 border-gray-600';
    
    // Default checkers pattern
    const isDark = (x + y) % 2 === 1;
    return isDark ? 'bg-slate-700' : 'bg-slate-600';
  };

  const handleClick = () => {
    if (activeRelicId) {
      placeRelic(x, y);
    } else {
      console.log('Clicked tile', tile.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: (x + y) * 0.05 }}
      className={cn(
        'w-full h-full relative flex items-center justify-center rounded-sm',
        'hover:brightness-110 cursor-pointer transition-all',
        activeRelicId && 'hover:ring-2 hover:ring-indigo-400',
        getTileStyle()
      )}
      onClick={handleClick}
    >
      <span className="text-[10px] text-white/20 absolute top-1 left-1">
        {x},{y}
      </span>
      
      {/* Render Rabbit */}
      {isRabbitHere && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
          transition={{ 
            scale: { duration: 0.3 },
            y: { duration: 0.5, repeat: Infinity, repeatType: "reverse" } 
          }}
          className="text-3xl z-10 filter drop-shadow-lg"
        >
          🐇
        </motion.div>
      )}
    </motion.div>
  );
};

export const SquareBoard: React.FC = () => {
  const squareGrid = useGameStore((state) => state.squareGrid);

  return (
    <div className="w-full aspect-square max-w-[800px] p-4 bg-slate-900 rounded-xl shadow-2xl border border-slate-700">
      <div className="grid grid-cols-8 grid-rows-8 gap-1 w-full h-full">
        {squareGrid.map((row, y) =>
          row.map((tile, x) => (
            <TileRenderer key={tile.id} tile={tile} x={x} y={y} />
          ))
        )}
      </div>
    </div>
  );
};
