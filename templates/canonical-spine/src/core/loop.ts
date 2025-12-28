/**
 * Core Loop
 *
 * The heart of the application - handles the main game/app loop.
 *
 * Core Loop Structure:
 * 1. Input - Handle user input
 * 2. State Update - Update game/app state
 * 3. Side Effects - Handle side effects (saves, network, etc.)
 * 4. Render - Render the current state
 */

import { store, ActionType } from './state/store';
import { InputManager } from './input/InputManager';
import { SystemManager } from './systems/SystemManager';
import { Renderer } from './rendering/Renderer';

export interface LoopConfig {
  targetFPS?: number;
  maxDeltaTime?: number;
}

export class CoreLoop {
  private running: boolean = false;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private frameTime: number;
  private maxDeltaTime: number;

  private inputManager: InputManager;
  private systemManager: SystemManager;
  private renderer: Renderer;

  // Performance tracking
  private fpsHistory: number[] = [];
  private lastFPSUpdate: number = 0;

  constructor(config: LoopConfig = {}) {
    this.frameTime = 1000 / (config.targetFPS || 60); // Target 60 FPS
    this.maxDeltaTime = config.maxDeltaTime || 100; // Cap at 100ms to prevent spiral of death

    this.inputManager = new InputManager();
    this.systemManager = new SystemManager();
    this.renderer = new Renderer();
  }

  /**
   * Start the core loop
   */
  start(): void {
    if (this.running) {
      console.warn('Loop already running');
      return;
    }

    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;

    // Initialize subsystems
    this.inputManager.initialize();
    this.systemManager.initialize();
    this.renderer.initialize();

    console.log('Core loop started');
    this.loop();
  }

  /**
   * Stop the core loop
   */
  stop(): void {
    if (!this.running) {
      console.warn('Loop not running');
      return;
    }

    this.running = false;

    // Cleanup subsystems
    this.inputManager.cleanup();
    this.systemManager.cleanup();
    this.renderer.cleanup();

    console.log('Core loop stopped');
  }

  /**
   * Main loop iteration using fixed timestep
   */
  private loop(): void {
    if (!this.running) return;

    const currentTime = performance.now();
    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap deltaTime to prevent spiral of death
    if (deltaTime > this.maxDeltaTime) {
      deltaTime = this.maxDeltaTime;
    }

    this.accumulator += deltaTime;

    // 1. Input (once per frame)
    this.handleInput();

    // 2. State Update (fixed timestep)
    while (this.accumulator >= this.frameTime) {
      this.updateState(this.frameTime / 1000); // Convert to seconds
      this.accumulator -= this.frameTime;
    }

    // 3. Side Effects (after all updates)
    this.handleSideEffects();

    // 4. Render (with interpolation)
    const alpha = this.accumulator / this.frameTime;
    this.render(alpha);

    // Track FPS
    this.trackFPS(deltaTime);

    // Continue loop
    requestAnimationFrame(() => this.loop());
  }

  /**
   * Handle user input
   */
  private handleInput(): void {
    // Process all pending input events
    const inputEvents = this.inputManager.pollEvents();

    for (const event of inputEvents) {
      // Dispatch input events to store
      store.dispatch({
        type: ActionType.INPUT_RECEIVED,
        payload: event
      });
    }
  }

  /**
   * Update game/app state
   */
  private updateState(deltaTime: number): void {
    // Update all systems in priority order
    this.systemManager.update(deltaTime);

    // Dispatch frame update action
    store.dispatch({
      type: ActionType.FRAME_UPDATE,
      payload: { deltaTime, timestamp: performance.now() }
    });
  }

  /**
   * Handle side effects (saves, network, etc.)
   */
  private handleSideEffects(): void {
    const state = store.getState();

    // Auto-save check
    if (state.settings?.autoSave && this.shouldAutoSave()) {
      this.performAutoSave();
    }

    // Network sync check
    if (state.settings?.networkSync && this.shouldNetworkSync()) {
      this.performNetworkSync();
    }

    // Analytics check
    if (state.settings?.analytics && this.shouldSendAnalytics()) {
      this.sendAnalytics();
    }
  }

  /**
   * Render the current state
   */
  private render(interpolation: number): void {
    const state = store.getState();

    // Clear previous frame
    this.renderer.clear();

    // Render current state with interpolation for smooth visuals
    this.renderer.render(state, interpolation);

    // Render debug info if enabled
    if (state.debug?.showFPS) {
      this.renderDebugInfo();
    }
  }

  /**
   * Track FPS for performance monitoring
   */
  private trackFPS(deltaTime: number): void {
    const fps = 1000 / deltaTime;
    this.fpsHistory.push(fps);

    // Keep only last 60 frames
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    // Update FPS display every second
    const now = performance.now();
    if (now - this.lastFPSUpdate > 1000) {
      const avgFPS = this.fpsHistory.reduce((sum, f) => sum + f, 0) / this.fpsHistory.length;

      store.dispatch({
        type: ActionType.UPDATE_FPS,
        payload: { fps: Math.round(avgFPS) }
      });

      this.lastFPSUpdate = now;
    }
  }

  /**
   * Render debug information
   */
  private renderDebugInfo(): void {
    const state = store.getState();
    const avgFPS = this.fpsHistory.reduce((sum, f) => sum + f, 0) / (this.fpsHistory.length || 1);

    this.renderer.renderText({
      text: `FPS: ${Math.round(avgFPS)}`,
      x: 10,
      y: 10,
      color: avgFPS > 50 ? 'green' : avgFPS > 30 ? 'yellow' : 'red'
    });

    this.renderer.renderText({
      text: `Systems: ${this.systemManager.getActiveSystemCount()}`,
      x: 10,
      y: 30,
      color: 'white'
    });
  }

  /**
   * Check if auto-save should trigger
   */
  private shouldAutoSave(): boolean {
    const state = store.getState();
    const lastSave = state.lastSaveTime || 0;
    const autoSaveInterval = state.settings?.autoSaveInterval || 60000; // Default: 1 minute

    return performance.now() - lastSave > autoSaveInterval;
  }

  /**
   * Perform auto-save
   */
  private performAutoSave(): void {
    const state = store.getState();

    try {
      localStorage.setItem('autosave', JSON.stringify({
        timestamp: Date.now(),
        state: this.serializeState(state)
      }));

      store.dispatch({
        type: ActionType.SAVE_COMPLETED,
        payload: { timestamp: performance.now() }
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  /**
   * Serialize state for saving
   */
  private serializeState(state: any): any {
    // Remove non-serializable data
    return {
      ...state,
      // Exclude transient data
      debug: undefined,
      lastSaveTime: undefined
    };
  }

  /**
   * Check if network sync should trigger
   */
  private shouldNetworkSync(): boolean {
    // Implement network sync logic
    return false;
  }

  /**
   * Perform network sync
   */
  private performNetworkSync(): void {
    // Implement network sync
  }

  /**
   * Check if analytics should be sent
   */
  private shouldSendAnalytics(): boolean {
    // Implement analytics logic
    return false;
  }

  /**
   * Send analytics data
   */
  private sendAnalytics(): void {
    // Implement analytics
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    const avgFPS = this.fpsHistory.reduce((sum, f) => sum + f, 0) / (this.fpsHistory.length || 1);
    return Math.round(avgFPS);
  }

  /**
   * Get running status
   */
  isRunning(): boolean {
    return this.running;
  }
}


