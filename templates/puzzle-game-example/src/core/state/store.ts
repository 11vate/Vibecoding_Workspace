/**
 * State Store - Puzzle Game Version
 *
 * Purpose: Centralized state management
 * Authority: Tier 1 (Application state)
 */

export enum ActionType {
  // Game lifecycle
  START_GAME = 'START_GAME',
  END_GAME = 'END_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  RESTART_GAME = 'RESTART_GAME',

  // Input
  INPUT_RECEIVED = 'INPUT_RECEIVED',

  // Frame
  FRAME_UPDATE = 'FRAME_UPDATE',
  UPDATE_FPS = 'UPDATE_FPS',

  // Grid
  GRID_INITIALIZED = 'GRID_INITIALIZED',
  CELL_SELECTED = 'CELL_SELECTED',
  CELLS_SWAPPED = 'CELLS_SWAPPED',
  MATCHES_FOUND = 'MATCHES_FOUND',
  CELLS_CLEARED = 'CELLS_CLEARED',
  CELLS_FALLEN = 'CELLS_FALLEN',

  // Score
  SCORE_ADDED = 'SCORE_ADDED',
  COMBO_INCREASED = 'COMBO_INCREASED',
  COMBO_RESET = 'COMBO_RESET',
  HIGH_SCORE_UPDATED = 'HIGH_SCORE_UPDATED',

  // State
  LOAD_STATE = 'LOAD_STATE',

  // Debug
  TOGGLE_DEBUG = 'TOGGLE_DEBUG',
  TOGGLE_FPS = 'TOGGLE_FPS'
}

export interface Action {
  type: ActionType;
  payload?: any;
}

export interface InputEvent {
  type: 'keydown' | 'keyup' | 'mousedown' | 'mouseup' | 'mousemove' | 'click';
  key?: string;
  button?: number;
  x?: number;
  y?: number;
  timestamp: number;
}

export interface GridCell {
  type: number; // 0-5 for different gem types
  row: number;
  col: number;
  selected: boolean;
  matched: boolean;
  falling: boolean;
}

export interface AppState {
  // Game state
  gameState: 'menu' | 'playing' | 'paused' | 'gameOver';

  // Frame
  frameCount: number;
  deltaTime: number;
  fps: number;

  // Grid
  grid: GridCell[][];
  gridRows: number;
  gridCols: number;
  selectedCell: { row: number; col: number } | null;

  // Score
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;

  // Settings
  settings: {
    autoSave: boolean;
    soundEnabled: boolean;
    musicEnabled: boolean;
    difficulty: 'easy' | 'normal' | 'hard';
  };

  // Debug
  debug: {
    enabled: boolean;
    showFPS: boolean;
  };
}

const GRID_ROWS = 8;
const GRID_COLS = 8;

/**
 * Create empty grid
 */
function createEmptyGrid(): GridCell[][] {
  const grid: GridCell[][] = [];

  for (let row = 0; row < GRID_ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_COLS; col++) {
      grid[row][col] = {
        type: Math.floor(Math.random() * 6),
        row,
        col,
        selected: false,
        matched: false,
        falling: false
      };
    }
  }

  return grid;
}

const initialState: AppState = {
  gameState: 'menu',

  frameCount: 0,
  deltaTime: 0,
  fps: 0,

  grid: createEmptyGrid(),
  gridRows: GRID_ROWS,
  gridCols: GRID_COLS,
  selectedCell: null,

  score: 0,
  highScore: 0,
  combo: 0,
  maxCombo: 0,

  settings: {
    autoSave: true,
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'normal'
  },

  debug: {
    enabled: false,
    showFPS: false
  }
};

/**
 * Root reducer
 */
function rootReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.START_GAME:
      return {
        ...state,
        gameState: 'playing',
        grid: createEmptyGrid(),
        score: 0,
        combo: 0,
        selectedCell: null
      };

    case ActionType.END_GAME:
      return {
        ...state,
        gameState: 'gameOver',
        highScore: Math.max(state.score, state.highScore)
      };

    case ActionType.PAUSE_GAME:
      return { ...state, gameState: 'paused' };

    case ActionType.RESUME_GAME:
      return { ...state, gameState: 'playing' };

    case ActionType.RESTART_GAME:
      return {
        ...state,
        gameState: 'playing',
        grid: createEmptyGrid(),
        score: 0,
        combo: 0,
        maxCombo: 0,
        selectedCell: null
      };

    case ActionType.FRAME_UPDATE:
      return {
        ...state,
        frameCount: action.payload.frameCount,
        deltaTime: action.payload.deltaTime
      };

    case ActionType.UPDATE_FPS:
      return { ...state, fps: action.payload };

    case ActionType.GRID_INITIALIZED:
      return { ...state, grid: action.payload };

    case ActionType.CELL_SELECTED:
      return { ...state, selectedCell: action.payload };

    case ActionType.CELLS_SWAPPED:
      return { ...state, grid: action.payload };

    case ActionType.MATCHES_FOUND:
      return { ...state, grid: action.payload };

    case ActionType.CELLS_CLEARED:
      return { ...state, grid: action.payload };

    case ActionType.CELLS_FALLEN:
      return { ...state, grid: action.payload };

    case ActionType.SCORE_ADDED:
      const newScore = state.score + action.payload;
      return {
        ...state,
        score: newScore,
        highScore: Math.max(newScore, state.highScore)
      };

    case ActionType.COMBO_INCREASED:
      return {
        ...state,
        combo: state.combo + 1,
        maxCombo: Math.max(state.combo + 1, state.maxCombo)
      };

    case ActionType.COMBO_RESET:
      return { ...state, combo: 0 };

    case ActionType.LOAD_STATE:
      return {
        ...state,
        highScore: action.payload.highScore || state.highScore,
        settings: action.payload.settings || state.settings
      };

    case ActionType.TOGGLE_DEBUG:
      return {
        ...state,
        debug: { ...state.debug, enabled: !state.debug.enabled }
      };

    case ActionType.TOGGLE_FPS:
      return {
        ...state,
        debug: { ...state.debug, showFPS: !state.debug.showFPS }
      };

    default:
      return state;
  }
}

/**
 * Store class
 */
class Store {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];

  constructor() {
    this.state = { ...initialState };
  }

  getState(): AppState {
    return this.state;
  }

  dispatch(action: Action): void {
    this.state = rootReducer(this.state, action);
    this.notifyListeners();
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const store = new Store();
