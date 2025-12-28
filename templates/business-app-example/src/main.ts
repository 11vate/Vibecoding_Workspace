/**
 * Main Entry Point - Business App
 *
 * Purpose: Initialize and start the business application
 * Authority: Tier 1 (Application root)
 */

import { CoreLoop } from './core/loop';
import { store, ActionType } from './core/state/store';
import { DataSyncSystem } from './core/systems/DataSyncSystem';
import { NotificationSystem } from './core/systems/NotificationSystem';

/**
 * Business Application class
 */
class BusinessApp {
  private loop: CoreLoop;
  private initialized: boolean = false;

  constructor() {
    // Create core loop with 60 FPS target
    this.loop = new CoreLoop({
      targetFPS: 60,
      maxDeltaTime: 100
    });
  }

  /**
   * Initialize application
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('Business application already initialized');
      return;
    }

    console.log('Initializing business application...');

    // Register business systems
    const systemManager = this.loop.getSystemManager();
    const dataSyncSystem = new DataSyncSystem(60);
    const notificationSystem = new NotificationSystem();

    systemManager.registerSystem(dataSyncSystem);
    systemManager.registerSystem(notificationSystem);

    // Initialize state
    store.dispatch({
      type: ActionType.SET_STATE,
      payload: {
        initialized: true,
        ui: {
          currentView: 'dashboard',
          sidebarOpen: true,
          activeModal: null,
          modals: {}
        }
      }
    });

    // Subscribe to state changes for logging
    store.subscribe((state) => {
      if (state.debug.logLevel === 'debug') {
        console.log('[State Update]', state);
      }
    });

    // Setup navigation handlers
    this.setupNavigationHandlers();

    // Load saved state
    this.loop.loadState();

    // Show welcome notification
    notificationSystem.success('Business Dashboard loaded successfully');

    this.initialized = true;
    console.log('Business application initialized');
  }

  /**
   * Setup navigation handlers
   */
  private setupNavigationHandlers(): void {
    const inputManager = this.loop.getInputManager();
    const canvas = document.getElementById('app') as HTMLCanvasElement;

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const state = store.getState();
      const sidebarWidth = state.ui.sidebarOpen ? 240 : 0;

      // Check sidebar clicks
      if (x < sidebarWidth) {
        if (y >= 65 && y < 105) {
          store.dispatch({ type: ActionType.NAVIGATE_TO, payload: 'dashboard' });
        } else if (y >= 115 && y < 155) {
          store.dispatch({ type: ActionType.NAVIGATE_TO, payload: 'analytics' });
        } else if (y >= 165 && y < 205) {
          store.dispatch({ type: ActionType.NAVIGATE_TO, payload: 'reports' });
        } else if (y >= 215 && y < 255) {
          store.dispatch({ type: ActionType.NAVIGATE_TO, payload: 'settings' });
        }
      }
    });
  }

  /**
   * Start application
   */
  start(): void {
    if (!this.initialized) {
      console.error('Business application not initialized');
      return;
    }

    console.log('Starting business application...');

    // Start core loop
    this.loop.start();

    console.log('Business application started');
  }

  /**
   * Stop application
   */
  stop(): void {
    console.log('Stopping business application...');

    // Stop core loop
    this.loop.stop();

    console.log('Business application stopped');
  }

  /**
   * Get core loop
   */
  getLoop(): CoreLoop {
    return this.loop;
  }

  /**
   * Toggle debug mode
   */
  toggleDebug(): void {
    store.dispatch({ type: ActionType.TOGGLE_DEBUG });

    const state = store.getState();
    console.log('Debug mode:', state.debug.enabled ? 'enabled' : 'disabled');
  }

  /**
   * Toggle FPS display
   */
  toggleFPS(): void {
    store.dispatch({ type: ActionType.TOGGLE_FPS });

    const state = store.getState();
    console.log('FPS display:', state.debug.showFPS ? 'enabled' : 'disabled');
  }

  /**
   * Navigate to view
   */
  navigateTo(view: 'dashboard' | 'analytics' | 'reports' | 'settings'): void {
    store.dispatch({ type: ActionType.NAVIGATE_TO, payload: view });
    console.log('Navigated to:', view);
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar(): void {
    store.dispatch({ type: ActionType.TOGGLE_SIDEBAR });

    const state = store.getState();
    console.log('Sidebar:', state.ui.sidebarOpen ? 'open' : 'closed');
  }
}

/**
 * Entry point
 */
async function main() {
  console.log('='.repeat(80));
  console.log('BUSINESS DASHBOARD APPLICATION');
  console.log('='.repeat(80));
  console.log('');

  // Create application
  const app = new BusinessApp();

  // Initialize
  await app.initialize();

  // Start
  app.start();

  // Expose app to window for debugging
  (window as any).app = app;
  (window as any).store = store;

  console.log('');
  console.log('Application running. Available commands:');
  console.log('  app.toggleDebug() - Toggle debug mode');
  console.log('  app.toggleFPS() - Toggle FPS display');
  console.log('  app.toggleSidebar() - Toggle sidebar');
  console.log('  app.navigateTo("dashboard"|"analytics"|"reports"|"settings") - Navigate');
  console.log('  app.stop() - Stop application');
  console.log('  app.start() - Start application');
  console.log('  store.getState() - Get current state');
  console.log('');
  console.log('Keyboard shortcuts:');
  console.log('  F1 - Toggle debug mode');
  console.log('  F2 - Toggle FPS display');
  console.log('  ESC - Toggle pause');
  console.log('');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

export { BusinessApp };
