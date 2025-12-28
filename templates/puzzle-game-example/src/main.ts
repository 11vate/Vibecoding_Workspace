/**
 * Main Entry Point - Puzzle Game
 *
 * Purpose: Initialize and start the puzzle game
 * Authority: Tier 1 (Application root)
 */

import { CoreLoop } from './core/loop';
import { store, ActionType } from './core/state/store';
import { GridSystem } from './core/systems/GridSystem';

/**
 * Puzzle Game Application class
 */
class PuzzleGame {
  private loop: CoreLoop;
  private initialized: boolean = false;
  private gridSystem!: GridSystem;

  constructor() {
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
      console.warn('Puzzle game already initialized');
      return;
    }

    console.log('Initializing puzzle game...');

    // Register game systems
    const systemManager = this.loop.getSystemManager();
    this.gridSystem = new GridSystem();

    systemManager.registerSystem(this.gridSystem);

    // Setup click handler
    this.setupClickHandler();

    // Load saved state
    this.loop.loadState();

    this.initialized = true;
    console.log('Puzzle game initialized');
  }

  /**
   * Setup click handler
   */
  private setupClickHandler(): void {
    const canvas = document.getElementById('app') as HTMLCanvasElement;

    canvas.addEventListener('click', (e) => {
      const state = store.getState();

      if (state.gameState === 'menu') {
        // Check if start button clicked
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 200 && x <= 400 && y >= 300 && y <= 360) {
          this.startGame();
        }
      } else if (state.gameState === 'playing') {
        // Handle grid click
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridStartX = 50;
        const gridStartY = 120;
        const cellSize = 60;

        if (x >= gridStartX && y >= gridStartY) {
          const col = Math.floor((x - gridStartX) / cellSize);
          const row = Math.floor((y - gridStartY) / cellSize);

          if (row >= 0 && row < state.gridRows && col >= 0 && col < state.gridCols) {
            this.gridSystem.handleCellClick(row, col);
          }
        }
      } else if (state.gameState === 'gameOver') {
        // Check if play again button clicked
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 200 && x <= 400 && y >= 420 && y <= 480) {
          this.restartGame();
        }
      }
    });
  }

  /**
   * Start application
   */
  start(): void {
    if (!this.initialized) {
      console.error('Puzzle game not initialized');
      return;
    }

    console.log('Starting puzzle game...');

    // Start core loop
    this.loop.start();

    console.log('Puzzle game started');
  }

  /**
   * Stop application
   */
  stop(): void {
    console.log('Stopping puzzle game...');

    // Stop core loop
    this.loop.stop();

    console.log('Puzzle game stopped');
  }

  /**
   * Start game
   */
  startGame(): void {
    store.dispatch({ type: ActionType.START_GAME });
    console.log('Game started');
  }

  /**
   * Restart game
   */
  restartGame(): void {
    store.dispatch({ type: ActionType.RESTART_GAME });
    console.log('Game restarted');
  }

  /**
   * Pause game
   */
  pauseGame(): void {
    store.dispatch({ type: ActionType.PAUSE_GAME });
    console.log('Game paused');
  }

  /**
   * Resume game
   */
  resumeGame(): void {
    store.dispatch({ type: ActionType.RESUME_GAME });
    console.log('Game resumed');
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
  console.log('MATCH-3 PUZZLE GAME');
  console.log('='.repeat(80));
  console.log('');

  // Create application
  const game = new PuzzleGame();

  // Initialize
  await game.initialize();

  // Start
  game.start();

  // Expose game to window for debugging
  (window as any).game = game;
  (window as any).store = store;

  console.log('');
  console.log('Game running. Available commands:');
  console.log('  game.startGame() - Start new game');
  console.log('  game.restartGame() - Restart current game');
  console.log('  game.pauseGame() - Pause game');
  console.log('  game.resumeGame() - Resume game');
  console.log('  game.toggleDebug() - Toggle debug mode');
  console.log('  game.toggleFPS() - Toggle FPS display');
  console.log('  game.stop() - Stop application');
  console.log('  game.start() - Start application');
  console.log('  store.getState() - Get current state');
  console.log('');
  console.log('Keyboard shortcuts:');
  console.log('  F1 - Toggle debug mode');
  console.log('  F2 - Toggle FPS display');
  console.log('  ESC - Pause/Resume');
  console.log('  R - Restart game');
  console.log('');
  console.log('How to play:');
  console.log('  1. Click "Start Game" on the menu');
  console.log('  2. Click two adjacent gems to swap them');
  console.log('  3. Match 3 or more gems of the same color');
  console.log('  4. Build combos for bonus points!');
  console.log('');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

export { PuzzleGame };
