/**
 * Main Entry Point - Vibecoding Game
 *
 * This is the heart of the game, following the Design Intelligence Stack:
 * 1. Experience Intent - What fantasy does this fulfill?
 * 2. Player Psychology - How should it feel?
 * 3. Core Loop - What's the repeating interaction?
 * 4. Systems - How do mechanics interconnect?
 * 5. Implementation - The actual code
 */

import { Engine, DisplayMode, Color } from 'excalibur'
import { GameState } from './systems/GameState'
import { registerServiceWorker } from './utils/pwa'

// Import scenes
import { MainMenuScene } from './scenes/MainMenuScene'
import { GameScene } from './scenes/GameScene'

// Configuration constants (no magic numbers!)
const CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: Color.fromHex('#1a1a2e'),
  ANTIALIASING: false, // Pixel-perfect rendering
} as const

/**
 * Initialize the game engine
 */
function initializeGame(): Engine {
  const game = new Engine({
    width: CONFIG.WIDTH,
    height: CONFIG.HEIGHT,
    displayMode: DisplayMode.FitScreen,
    backgroundColor: CONFIG.BACKGROUND_COLOR,
    antialiasing: CONFIG.ANTIALIASING,
    pixelArt: true,
  })

  // Add scenes
  game.addScene('menu', new MainMenuScene())
  game.addScene('game', new GameScene())

  return game
}

/**
 * Bootstrap the application
 */
async function bootstrap() {
  try {
    // Register service worker for offline capability
    await registerServiceWorker()

    // Initialize game state
    const gameState = GameState.getInstance()
    await gameState.initialize()

    // Create and start the game
    const game = initializeGame()

    // Start with main menu
    await game.start('menu')

    console.log('🎮 Game initialized successfully')
  } catch (error) {
    console.error('Failed to initialize game:', error)
    // Show user-friendly error
    document.body.innerHTML = `
      <div style="color: white; padding: 20px; text-align: center;">
        <h1>Failed to start game</h1>
        <p>Please refresh the page to try again.</p>
        <p style="color: #888; font-size: 12px;">${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `
  }
}

// Start the application
bootstrap()
