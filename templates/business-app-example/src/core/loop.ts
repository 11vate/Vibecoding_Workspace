/**
 * Core Loop - Business App Version
 *
 * Purpose: Main application loop for business dashboard
 * Authority: Tier 1 (Application core)
 */

import { InputManager } from './input/InputManager';
import { SystemManager } from './systems/SystemManager';
import { Renderer } from './rendering/Renderer';
import { store, ActionType } from './state/store';

export interface LoopConfig {
  targetFPS?: number;
  maxDeltaTime?: number;
}

/**
 * Core application loop
 */
export class CoreLoop {
  private running: boolean = false;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private frameTime: number;
  private maxDeltaTime: number;

  private inputManager: InputManager;
  private systemManager: SystemManager;
  private renderer: Renderer;

  private fpsCounter: number = 0;
  private fpsTime: number = 0;

  constructor(config: LoopConfig = {}) {
    const targetFPS = config.targetFPS || 60;
    this.frameTime = 1000 / targetFPS;
    this.maxDeltaTime = config.maxDeltaTime || 100;

    // Initialize managers
    const canvas = document.getElementById('app') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    this.inputManager = new InputManager(canvas);
    this.systemManager = new SystemManager();
    this.renderer = new Renderer(canvas);

    // Initialize systems
    this.systemManager.initialize();

    console.log('[CoreLoop] Initialized with target FPS:', targetFPS);
  }

  /**
   * Start the loop
   */
  start(): void {
    if (this.running) {
      console.warn('[CoreLoop] Already running');
      return;
    }

    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;

    // Dispatch start action
    store.dispatch({ type: ActionType.LOOP_STARTED });

    // Start loop
    requestAnimationFrame((time) => this.loop(time));

    console.log('[CoreLoop] Started');
  }

  /**
   * Stop the loop
   */
  stop(): void {
    if (!this.running) {
      console.warn('[CoreLoop] Already stopped');
      return;
    }

    this.running = false;

    // Dispatch stop action
    store.dispatch({ type: ActionType.LOOP_STOPPED });

    console.log('[CoreLoop] Stopped');
  }

  /**
   * Main loop
   */
  private loop(currentTime: number): void {
    if (!this.running) {
      return;
    }

    // Calculate delta time
    const deltaTime = Math.min(currentTime - this.lastTime, this.maxDeltaTime);
    this.lastTime = currentTime;

    // Add to accumulator
    this.accumulator += deltaTime;

    // Update FPS
    this.updateFPS(deltaTime);

    // Process input events
    this.processInput();

    // Fixed timestep updates
    while (this.accumulator >= this.frameTime) {
      this.updateState(this.frameTime / 1000);
      this.accumulator -= this.frameTime;
    }

    // Render with interpolation
    const alpha = this.accumulator / this.frameTime;
    this.render(alpha);

    // Handle side effects
    this.handleSideEffects();

    // Continue loop
    requestAnimationFrame((time) => this.loop(time));
  }

  /**
   * Process input events
   */
  private processInput(): void {
    const events = this.inputManager.pollEvents();

    for (const event of events) {
      // Dispatch input action
      store.dispatch({
        type: ActionType.INPUT_RECEIVED,
        payload: event
      });

      // Handle global shortcuts
      if (event.type === 'keydown') {
        if (event.key === 'F1') {
          store.dispatch({ type: ActionType.TOGGLE_DEBUG });
        } else if (event.key === 'F2') {
          store.dispatch({ type: ActionType.TOGGLE_FPS });
        } else if (event.key === 'Escape') {
          store.dispatch({ type: ActionType.TOGGLE_PAUSE });
        }
      }
    }
  }

  /**
   * Update state
   */
  private updateState(deltaTime: number): void {
    const state = store.getState();

    if (state.paused) {
      return;
    }

    // Increment frame counter
    store.dispatch({
      type: ActionType.FRAME_UPDATE,
      payload: {
        frameCount: state.frameCount + 1,
        deltaTime
      }
    });

    // Update all systems
    this.systemManager.update(deltaTime);
  }

  /**
   * Render
   */
  private render(interpolation: number): void {
    const state = store.getState();
    this.renderer.render(state, interpolation);
  }

  /**
   * Handle side effects
   */
  private handleSideEffects(): void {
    const state = store.getState();

    // Auto-save check
    if (state.settings.autoSave && state.frameCount % (60 * 60) === 0) {
      this.saveState();
    }
  }

  /**
   * Save state
   */
  private saveState(): void {
    const state = store.getState();

    try {
      localStorage.setItem('business-app-state', JSON.stringify(state.appData));

      store.dispatch({
        type: ActionType.SAVE_COMPLETED,
        payload: { timestamp: Date.now() }
      });

      console.log('[CoreLoop] State saved');
    } catch (error) {
      console.error('[CoreLoop] Save failed:', error);
    }
  }

  /**
   * Load state
   */
  loadState(): void {
    try {
      const saved = localStorage.getItem('business-app-state');

      if (saved) {
        const data = JSON.parse(saved);

        store.dispatch({
          type: ActionType.LOAD_COMPLETED,
          payload: data
        });

        console.log('[CoreLoop] State loaded');
      }
    } catch (error) {
      console.error('[CoreLoop] Load failed:', error);
    }
  }

  /**
   * Update FPS counter
   */
  private updateFPS(deltaTime: number): void {
    this.fpsCounter++;
    this.fpsTime += deltaTime;

    if (this.fpsTime >= 1000) {
      const fps = Math.round((this.fpsCounter * 1000) / this.fpsTime);

      store.dispatch({
        type: ActionType.UPDATE_FPS,
        payload: fps
      });

      this.fpsCounter = 0;
      this.fpsTime = 0;
    }
  }

  /**
   * Get input manager
   */
  getInputManager(): InputManager {
    return this.inputManager;
  }

  /**
   * Get system manager
   */
  getSystemManager(): SystemManager {
    return this.systemManager;
  }

  /**
   * Get renderer
   */
  getRenderer(): Renderer {
    return this.renderer;
  }
}
