import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const GameOverModal: React.FC = () => {
  const status = useGameStore((state) => state.status);
  const initializeWorld = useGameStore((state) => state.initializeWorld);

  if (status === 'PLAYING') return null;

  const isWin = status === 'WON';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 border-2 border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md text-center"
        >
          <h2 className={`text-4xl font-bold mb-4 ${isWin ? 'text-indigo-400' : 'text-red-500'}`}>
            {isWin ? 'Victory!' : 'Defeat'}
          </h2>
          
          <p className="text-slate-300 mb-8 text-lg">
            {isWin 
              ? "You have cornered the White Rabbit! Destiny is yours to command." 
              : "The Rabbit has escaped into the void. Time has run out."}
          </p>

          <button
            onClick={initializeWorld}
            className="px-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-lg hover:bg-white hover:scale-105 transition-all"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
