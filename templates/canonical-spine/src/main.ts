/**
 * Main Entry Point
 *
 * Purpose: Initialize and start the application
 * Authority: Tier 1 (Application root)
 */

import { CoreLoop } from './core/loop';
import { store, ActionType } from './core/state/store';
import { PhysicsSystem } from './core/systems/PhysicsSystem';
import { AnimationSystem } from './core/systems/AnimationSystem';

/**
 * Application class
 */
class Application {
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
      console.warn('Application already initialized');
      return;
    }

    console.log('Initializing application...');

    // Register custom systems
    this.loop['systemManager'].registerSystem(new PhysicsSystem());
    this.loop['systemManager'].registerSystem(new AnimationSystem());

    // Initialize state
    store.dispatch({
      type: ActionType.SET_STATE,
      payload: {
        initialized: true,
        ui: {
          activeScreen: 'main',
          activeModal: null,
          modals: {}
        }
      }
    });

    // Subscribe to state changes for debugging
    store.subscribe((state) => {
      if (state.debug.enabled && state.debug.logLevel === 'debug') {
        console.log('[State Update]', state);
      }
    });

    this.initialized = true;
    console.log('Application initialized');
  }

  /**
   * Start application
   */
  start(): void {
    if (!this.initialized) {
      console.error('Application not initialized');
      return;
    }

    console.log('Starting application...');

    // Start game
    store.dispatch({ type: ActionType.START_GAME });

    // Start core loop
    this.loop.start();

    console.log('Application started');
  }

  /**
   * Stop application
   */
  stop(): void {
    console.log('Stopping application...');

    // End game
    store.dispatch({ type: ActionType.END_GAME });

    // Stop core loop
    this.loop.stop();

    console.log('Application stopped');
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
}

/**
 * Entry point
 */
async function main() {
  console.log('='.repeat(80));
  console.log('CANONICAL SPINE APPLICATION');
  console.log('='.repeat(80));
  console.log('');

  // Create application
  const app = new Application();

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
  console.log('  app.stop() - Stop application');
  console.log('  app.start() - Start application');
  console.log('  store.getState() - Get current state');
  console.log('');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

export { Application };
