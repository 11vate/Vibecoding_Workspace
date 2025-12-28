import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState, Player, ThemeType, Coordinate, Tile } from '../types';
import { RELIC_REGISTRY } from '../data/relics';
import { THEME_REGISTRY } from '../data/themes';

interface GameActions {
  // Player Actions
  movePlayer: (playerId: string, steps: number) => void;
  teleportPlayer: (playerId: string, position: number) => void;
  
  // World Actions
  setTheme: (theme: ThemeType) => void;
  updateTile: (x: number, y: number, updates: Partial<Tile>) => void;
  addToLog: (message: string, type?: 'INFO' | 'EVENT' | 'COMBAT') => void;
  
  // Interaction
  selectRelic: (relicId: string | null) => void;
  placeRelic: (x: number, y: number) => void;
  
  // Turn Management
  endTurn: () => void;
  processReactionQueue: () => void;
  
  // Debug/Init
  initializeWorld: () => void;
}

// Helper to create an empty 8x8 grid
const createInitialGrid = (): Tile[][] => {
  const grid: Tile[][] = [];
  for (let y = 0; y < 8; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < 8; x++) {
      row.push({
        id: `tile-${x}-${y}`,
        position: { x, y },
        type: 'EMPTY',
        themeState: 'NORMAL',
        isLocked: false,
        contents: [],
      });
    }
    grid.push(row);
  }
  return grid;
};

export const useGameStore = create<GameState & GameActions>()(
  immer((set, get) => ({
    // Initial State
    activeTheme: 'NORMAL',
    turnCount: 1,
    isNight: false,
    circleBoardSize: 40,
    squareGrid: createInitialGrid(),
    players: {},
    activePlayerId: '',
    bosses: [],
    rabbit: {
      position: { x: 3, y: 3 }, // Start center-ish
      isCaught: false,
      isVisible: false,
    },
    messageLog: [],
    reactionQueue: [],

    // Actions
    initializeWorld: () => {
      set((state) => {
        state.status = 'PLAYING';
        state.squareGrid = createInitialGrid();
        state.activeTheme = 'NORMAL';
        state.turnCount = 1;
        state.players = {
          'p1': {
            id: 'p1',
            name: 'The Magician',
            position: 0,
            color: '#6366f1',
            // Give player some starting tools
            inventory: [RELIC_REGISTRY['tide-caller'], RELIC_REGISTRY['stone-wall']],
            stats: { movementMod: 0, luck: 0 }
          }
        };
        state.activePlayerId = 'p1';
        state.rabbit = {
           position: { x: 3, y: 3 },
           isCaught: false,
           isVisible: false,
        };
        state.messageLog = []; // Clear log
        state.messageLog.push({
          id: Date.now().toString(),
          message: 'World initialized. The Magician enters the path.',
          type: 'INFO',
          timestamp: Date.now(),
        });
      });
    },

    movePlayer: (playerId, steps) => {
      set((state) => {
        const player = state.players[playerId];
        if (player) {
          player.position = (player.position + steps) % state.circleBoardSize;
          state.messageLog.push({
            id: Date.now().toString(),
            message: `${player.name} moved ${steps} spaces to ${player.position}.`,
            type: 'INFO',
            timestamp: Date.now(),
          });
        }
      });
    },

    teleportPlayer: (playerId, position) => {
      set((state) => {
        const player = state.players[playerId];
        if (player) {
          player.position = position % state.circleBoardSize;
        }
      });
    },

    setTheme: (theme) => {
      set((state) => {
        state.activeTheme = theme;
        state.messageLog.push({
          id: Date.now().toString(),
          message: `The world shifts... Theme is now ${theme}.`,
          type: 'EVENT',
          timestamp: Date.now(),
        });
      });
    },

    updateTile: (x, y, updates) => {
      set((state) => {
        if (state.squareGrid[y] && state.squareGrid[y][x]) {
          Object.assign(state.squareGrid[y][x], updates);
        }
      });
    },

    addToLog: (message, type = 'INFO') => {
      set((state) => {
        state.messageLog.push({
          id: Date.now().toString(),
          message,
          type,
          timestamp: Date.now(),
        });
      });
    },

    endTurn: () => {
      set((state) => {
        state.turnCount += 1;
        // Logic to rotate active player would go here
      });
    },

    processReactionQueue: () => {
      // Placeholder for complex reaction chain logic
      set((state) => {
        const event = state.reactionQueue.shift();
        if (event) {
          console.log('Processing event:', event);
          
          // Handle specific event types if needed
          if (event.type === 'RABBIT_MOVE') {
             // Could trigger specific sound or particle effect here
          }
        }
      });
    },

    moveRabbit: () => {
      set((state) => {
        if (state.rabbit.isCaught) return;

        const { x, y } = state.rabbit.position;
        // Possible moves: Up, Down, Left, Right
        const moves = [
          { x: x, y: y - 1 },
          { x: x, y: y + 1 },
          { x: x - 1, y: y },
          { x: x + 1, y: y },
        ];

        // Filter valid moves
        const validMoves = moves.filter((move) => {
          // Check bounds
          if (move.x < 0 || move.x >= 8 || move.y < 0 || move.y >= 8) return false;
          
          // Check obstacles (assuming 'OBSTACLE' type exists)
          const tile = state.squareGrid[move.y][move.x];
          if (tile.type === 'OBSTACLE') return false;
          if (tile.state === 'BURNING') return false; // Rabbit avoids fire!

          return true;
        });

        if (validMoves.length > 0) {
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          state.rabbit.position = randomMove;
          state.rabbit.isVisible = true; // Rabbit reveals itself when it moves
          
          state.messageLog.push({
            id: Date.now().toString(),
            message: `The White Rabbit hops to ${randomMove.x},${randomMove.y}.`,
            type: 'INFO',
            timestamp: Date.now(),
          });
          
          state.reactionQueue.push({
            id: Date.now().toString(),
            type: 'RABBIT_MOVE',
            payload: { from: { x, y }, to: randomMove }
          });
        } else {
           state.messageLog.push({
            id: Date.now().toString(),
            message: `The White Rabbit is cornered! You WIN!`,
            type: 'EVENT',
            timestamp: Date.now(),
          });
          state.status = 'WON';
          state.rabbit.isCaught = true;
        }
      });
    },
  }))
);
