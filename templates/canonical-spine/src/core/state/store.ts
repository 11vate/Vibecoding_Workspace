/**
 * Centralized State Store
 *
 * Purpose: Single source of truth for application state
 * Pattern: Redux-inspired store with actions and reducers
 * Authority: Tier 1 (Core architecture)
 */

export enum ActionType {
  // Input actions
  INPUT_RECEIVED = 'INPUT_RECEIVED',

  // Frame actions
  FRAME_UPDATE = 'FRAME_UPDATE',
  UPDATE_FPS = 'UPDATE_FPS',

  // Save actions
  SAVE_COMPLETED = 'SAVE_COMPLETED',
  LOAD_COMPLETED = 'LOAD_COMPLETED',

  // State actions
  SET_STATE = 'SET_STATE',
  RESET_STATE = 'RESET_STATE',

  // Game/App specific actions
  START_GAME = 'START_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  END_GAME = 'END_GAME',

  // UI actions
  SHOW_MODAL = 'SHOW_MODAL',
  HIDE_MODAL = 'HIDE_MODAL',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',

  // Debug actions
  TOGGLE_DEBUG = 'TOGGLE_DEBUG',
  TOGGLE_FPS = 'TOGGLE_FPS'
}

export interface Action {
  type: ActionType;
  payload?: any;
}

export interface AppState {
  // Core state
  initialized: boolean;
  running: boolean;
  paused: boolean;

  // Frame tracking
  frameCount: number;
  deltaTime: number;
  timestamp: number;
  fps: number;

  // Input state
  input: {
    keyboard: Record<string, boolean>;
    mouse: {
      x: number;
      y: number;
      buttons: Record<number, boolean>;
    };
    touch: Array<{ id: number; x: number; y: number }>;
  };

  // Settings
  settings: {
    autoSave: boolean;
    autoSaveInterval: number;
    networkSync: boolean;
    analytics: boolean;
    volume: number;
    musicVolume: number;
    sfxVolume: number;
  };

  // UI state
  ui: {
    activeModal: string | null;
    activeScreen: string;
    modals: Record<string, any>;
  };

  // Debug state
  debug: {
    enabled: boolean;
    showFPS: boolean;
    showHitboxes: boolean;
    logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';
  };

  // Save/load tracking
  lastSaveTime: number | null;
  lastLoadTime: number | null;

  // Game/app specific state
  gameState: any;
}

/**
 * Initial state
 */
const initialState: AppState = {
  initialized: false,
  running: false,
  paused: false,

  frameCount: 0,
  deltaTime: 0,
  timestamp: 0,
  fps: 60,

  input: {
    keyboard: {},
    mouse: {
      x: 0,
      y: 0,
      buttons: {}
    },
    touch: []
  },

  settings: {
    autoSave: true,
    autoSaveInterval: 60000, // 1 minute
    networkSync: false,
    analytics: false,
    volume: 0.7,
    musicVolume: 0.7,
    sfxVolume: 0.7
  },

  ui: {
    activeModal: null,
    activeScreen: 'main',
    modals: {}
  },

  debug: {
    enabled: false,
    showFPS: false,
    showHitboxes: false,
    logLevel: 'warn'
  },

  lastSaveTime: null,
  lastLoadTime: null,

  gameState: {}
};

/**
 * Root reducer
 */
function rootReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.FRAME_UPDATE:
      return {
        ...state,
        frameCount: state.frameCount + 1,
        deltaTime: action.payload.deltaTime,
        timestamp: action.payload.timestamp
      };

    case ActionType.UPDATE_FPS:
      return {
        ...state,
        fps: action.payload.fps
      };

    case ActionType.INPUT_RECEIVED:
      return handleInputAction(state, action.payload);

    case ActionType.SAVE_COMPLETED:
      return {
        ...state,
        lastSaveTime: action.payload.timestamp
      };

    case ActionType.LOAD_COMPLETED:
      return {
        ...state,
        lastLoadTime: action.payload.timestamp
      };

    case ActionType.START_GAME:
      return {
        ...state,
        running: true,
        paused: false,
        initialized: true
      };

    case ActionType.PAUSE_GAME:
      return {
        ...state,
        paused: true
      };

    case ActionType.RESUME_GAME:
      return {
        ...state,
        paused: false
      };

    case ActionType.END_GAME:
      return {
        ...state,
        running: false,
        paused: false
      };

    case ActionType.SHOW_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeModal: action.payload.modalId,
          modals: {
            ...state.ui.modals,
            [action.payload.modalId]: action.payload.data
          }
        }
      };

    case ActionType.HIDE_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeModal: null
        }
      };

    case ActionType.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case ActionType.TOGGLE_DEBUG:
      return {
        ...state,
        debug: {
          ...state.debug,
          enabled: !state.debug.enabled
        }
      };

    case ActionType.TOGGLE_FPS:
      return {
        ...state,
        debug: {
          ...state.debug,
          showFPS: !state.debug.showFPS
        }
      };

    case ActionType.SET_STATE:
      return {
        ...state,
        ...action.payload
      };

    case ActionType.RESET_STATE:
      return { ...initialState };

    default:
      return state;
  }
}

/**
 * Handle input actions
 */
function handleInputAction(state: AppState, inputEvent: any): AppState {
  const newInput = { ...state.input };

  switch (inputEvent.type) {
    case 'keydown':
      newInput.keyboard[inputEvent.key] = true;
      break;

    case 'keyup':
      newInput.keyboard[inputEvent.key] = false;
      break;

    case 'mousemove':
      newInput.mouse.x = inputEvent.x;
      newInput.mouse.y = inputEvent.y;
      break;

    case 'mousedown':
      newInput.mouse.buttons[inputEvent.button] = true;
      break;

    case 'mouseup':
      newInput.mouse.buttons[inputEvent.button] = false;
      break;

    case 'touchstart':
    case 'touchmove':
      newInput.touch = inputEvent.touches;
      break;

    case 'touchend':
      newInput.touch = newInput.touch.filter((t: any) => t.id !== inputEvent.touchId);
      break;
  }

  return {
    ...state,
    input: newInput
  };
}

/**
 * Store implementation
 */
class Store {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];
  private middleware: Array<(action: Action, state: AppState) => void> = [];

  constructor() {
    this.state = { ...initialState };
  }

  /**
   * Get current state
   */
  getState(): AppState {
    return this.state;
  }

  /**
   * Dispatch an action
   */
  dispatch(action: Action): void {
    // Run middleware
    for (const mw of this.middleware) {
      mw(action, this.state);
    }

    // Update state
    const prevState = this.state;
    this.state = rootReducer(this.state, action);

    // Notify listeners if state changed
    if (this.state !== prevState) {
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Add middleware
   */
  use(middleware: (action: Action, state: AppState) => void): void {
    this.middleware.push(middleware);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  /**
   * Reset store to initial state
   */
  reset(): void {
    this.state = { ...initialState };
    this.notifyListeners();
  }
}

/**
 * Singleton store instance
 */
export const store = new Store();

/**
 * Logger middleware (optional, for debugging)
 */
export function loggerMiddleware(action: Action, state: AppState): void {
  if (state.debug.logLevel === 'debug' || state.debug.logLevel === 'info') {
    console.log('[Action]', action.type, action.payload);
    console.log('[State]', state);
  }
}

/**
 * Performance middleware (tracks action execution time)
 */
export function performanceMiddleware(action: Action, state: AppState): void {
  if (state.debug.enabled) {
    const start = performance.now();

    // Action will execute after middleware
    setTimeout(() => {
      const duration = performance.now() - start;
      if (duration > 16) { // Longer than 1 frame at 60fps
        console.warn(`[Performance] Action ${action.type} took ${duration.toFixed(2)}ms`);
      }
    }, 0);
  }
}

// Add middleware if in debug mode
if (typeof window !== 'undefined' && (window as any).__DEBUG__) {
  store.use(loggerMiddleware);
  store.use(performanceMiddleware);
}
