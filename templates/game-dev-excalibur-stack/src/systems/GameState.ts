/**
 * Game State Management using Zustand
 *
 * Centralized state following these principles:
 * - Single source of truth
 * - Immutable updates
 * - Type-safe
 * - Deterministic
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { openDB, DBSchema, IDBPDatabase } from 'idb'

/**
 * Game state interface
 */
interface GameStateData {
  // Player data
  playerLevel: number
  playerScore: number
  playerHealth: number

  // Game progression
  currentLevel: number
  unlockedLevels: number[]

  // Settings
  audioEnabled: boolean
  musicVolume: number
  sfxVolume: number

  // Statistics
  totalPlayTime: number
  gamesPlayed: number
}

/**
 * Game state actions
 */
interface GameStateActions {
  // Player actions
  increaseScore: (amount: number) => void
  setPlayerHealth: (health: number) => void
  levelUp: () => void

  // Progression actions
  unlockLevel: (levelId: number) => void
  setCurrentLevel: (levelId: number) => void

  // Settings actions
  toggleAudio: () => void
  setMusicVolume: (volume: number) => void
  setSfxVolume: (volume: number) => void

  // Statistics actions
  incrementPlayTime: (seconds: number) => void
  incrementGamesPlayed: () => void

  // Utility actions
  reset: () => void
}

type GameStore = GameStateData & GameStateActions

// Initial state
const initialState: GameStateData = {
  playerLevel: 1,
  playerScore: 0,
  playerHealth: 100,
  currentLevel: 1,
  unlockedLevels: [1],
  audioEnabled: true,
  musicVolume: 0.7,
  sfxVolume: 0.8,
  totalPlayTime: 0,
  gamesPlayed: 0,
}

/**
 * IndexedDB storage for persistence
 */
const createIndexedDBStorage = () => {
  let db: IDBPDatabase | null = null

  return {
    getItem: async (name: string): Promise<string | null> => {
      if (!db) {
        db = await openDB('game-storage', 1, {
          upgrade(db) {
            db.createObjectStore('gameState')
          },
        })
      }
      const value = await db.get('gameState', name)
      return value || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
      if (!db) {
        db = await openDB('game-storage', 1, {
          upgrade(db) {
            db.createObjectStore('gameState')
          },
        })
      }
      await db.put('gameState', value, name)
    },
    removeItem: async (name: string): Promise<void> => {
      if (!db) return
      await db.delete('gameState', name)
    },
  }
}

/**
 * Create the game state store
 */
export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Player actions
      increaseScore: (amount) =>
        set((state) => ({ playerScore: state.playerScore + amount })),

      setPlayerHealth: (health) =>
        set({ playerHealth: Math.max(0, Math.min(100, health)) }),

      levelUp: () =>
        set((state) => ({ playerLevel: state.playerLevel + 1 })),

      // Progression actions
      unlockLevel: (levelId) =>
        set((state) => ({
          unlockedLevels: state.unlockedLevels.includes(levelId)
            ? state.unlockedLevels
            : [...state.unlockedLevels, levelId],
        })),

      setCurrentLevel: (levelId) =>
        set({ currentLevel: levelId }),

      // Settings actions
      toggleAudio: () =>
        set((state) => ({ audioEnabled: !state.audioEnabled })),

      setMusicVolume: (volume) =>
        set({ musicVolume: Math.max(0, Math.min(1, volume)) }),

      setSfxVolume: (volume) =>
        set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),

      // Statistics actions
      incrementPlayTime: (seconds) =>
        set((state) => ({ totalPlayTime: state.totalPlayTime + seconds })),

      incrementGamesPlayed: () =>
        set((state) => ({ gamesPlayed: state.gamesPlayed + 1 })),

      // Utility actions
      reset: () => set(initialState),
    }),
    {
      name: 'vibecoding-game-state',
      storage: createJSONStorage(() => createIndexedDBStorage()),
    }
  )
)

/**
 * Singleton GameState manager
 * Provides methods for initialization and state access
 */
export class GameState {
  private static instance: GameState
  private initialized = false

  private constructor() {}

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState()
    }
    return GameState.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    // Initialize persistent storage
    // IndexedDB is automatically loaded by Zustand persist middleware

    this.initialized = true
    console.log('✅ Game state initialized')
  }

  // Convenience methods to access store
  get state() {
    return useGameStore.getState()
  }

  subscribe(callback: (state: GameStore) => void) {
    return useGameStore.subscribe(callback)
  }
}
