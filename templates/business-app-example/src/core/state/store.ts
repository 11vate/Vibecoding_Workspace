/**
 * State Store - Business App Version
 *
 * Purpose: Centralized state management
 * Authority: Tier 1 (Application state)
 */

export enum ActionType {
  // Lifecycle
  LOOP_STARTED = 'LOOP_STARTED',
  LOOP_STOPPED = 'LOOP_STOPPED',

  // Input
  INPUT_RECEIVED = 'INPUT_RECEIVED',

  // Frame
  FRAME_UPDATE = 'FRAME_UPDATE',
  UPDATE_FPS = 'UPDATE_FPS',

  // State
  SAVE_COMPLETED = 'SAVE_COMPLETED',
  LOAD_COMPLETED = 'LOAD_COMPLETED',

  // UI
  NAVIGATE_TO = 'NAVIGATE_TO',
  OPEN_MODAL = 'OPEN_MODAL',
  CLOSE_MODAL = 'CLOSE_MODAL',
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',

  // Data
  DATA_LOADED = 'DATA_LOADED',
  DATA_UPDATED = 'DATA_UPDATED',
  FILTER_CHANGED = 'FILTER_CHANGED',
  SORT_CHANGED = 'SORT_CHANGED',

  // Debug
  TOGGLE_DEBUG = 'TOGGLE_DEBUG',
  TOGGLE_FPS = 'TOGGLE_FPS',
  TOGGLE_PAUSE = 'TOGGLE_PAUSE',
  SET_LOG_LEVEL = 'SET_LOG_LEVEL',

  // Generic
  SET_STATE = 'SET_STATE'
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

export interface DataFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface DataSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface AppState {
  // Lifecycle
  initialized: boolean;
  running: boolean;
  paused: boolean;

  // Frame
  frameCount: number;
  deltaTime: number;
  fps: number;

  // UI
  ui: {
    currentView: 'dashboard' | 'analytics' | 'reports' | 'settings';
    sidebarOpen: boolean;
    activeModal: string | null;
    modals: { [key: string]: any };
  };

  // Data
  appData: {
    datasets: any[];
    filters: DataFilter[];
    sort: DataSort | null;
    selectedItems: string[];
  };

  // Settings
  settings: {
    autoSave: boolean;
    theme: 'light' | 'dark';
    refreshInterval: number;
    chartType: 'line' | 'bar' | 'pie';
  };

  // Debug
  debug: {
    enabled: boolean;
    showFPS: boolean;
    logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';
  };
}

const initialState: AppState = {
  initialized: false,
  running: false,
  paused: false,

  frameCount: 0,
  deltaTime: 0,
  fps: 0,

  ui: {
    currentView: 'dashboard',
    sidebarOpen: true,
    activeModal: null,
    modals: {}
  },

  appData: {
    datasets: [],
    filters: [],
    sort: null,
    selectedItems: []
  },

  settings: {
    autoSave: true,
    theme: 'light',
    refreshInterval: 60000,
    chartType: 'line'
  },

  debug: {
    enabled: false,
    showFPS: false,
    logLevel: 'warn'
  }
};

/**
 * Root reducer
 */
function rootReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.LOOP_STARTED:
      return { ...state, running: true };

    case ActionType.LOOP_STOPPED:
      return { ...state, running: false };

    case ActionType.FRAME_UPDATE:
      return {
        ...state,
        frameCount: action.payload.frameCount,
        deltaTime: action.payload.deltaTime
      };

    case ActionType.UPDATE_FPS:
      return { ...state, fps: action.payload };

    case ActionType.NAVIGATE_TO:
      return {
        ...state,
        ui: { ...state.ui, currentView: action.payload }
      };

    case ActionType.OPEN_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeModal: action.payload.id,
          modals: {
            ...state.ui.modals,
            [action.payload.id]: action.payload.data
          }
        }
      };

    case ActionType.CLOSE_MODAL:
      return {
        ...state,
        ui: { ...state.ui, activeModal: null }
      };

    case ActionType.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
      };

    case ActionType.DATA_LOADED:
      return {
        ...state,
        appData: { ...state.appData, datasets: action.payload }
      };

    case ActionType.FILTER_CHANGED:
      return {
        ...state,
        appData: { ...state.appData, filters: action.payload }
      };

    case ActionType.SORT_CHANGED:
      return {
        ...state,
        appData: { ...state.appData, sort: action.payload }
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

    case ActionType.TOGGLE_PAUSE:
      return { ...state, paused: !state.paused };

    case ActionType.SET_LOG_LEVEL:
      return {
        ...state,
        debug: { ...state.debug, logLevel: action.payload }
      };

    case ActionType.SET_STATE:
      return { ...state, ...action.payload };

    case ActionType.SAVE_COMPLETED:
    case ActionType.LOAD_COMPLETED:
      if (action.payload) {
        return { ...state, appData: action.payload };
      }
      return state;

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
