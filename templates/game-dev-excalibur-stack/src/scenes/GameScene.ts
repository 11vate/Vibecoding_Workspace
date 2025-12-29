/**
 * Main Game Scene
 *
 * This is where the core game loop happens
 *
 * Design Intelligence Stack Application:
 * 1. Experience Intent: Engaging, challenging, rewarding
 * 2. Player Psychology: Flow state, clear feedback, progressive difficulty
 * 3. Core Loop: Input → Update → Render (deterministic)
 * 4. Systems: Entity management, collision detection, scoring
 * 5. Implementation: Below
 */

import { Scene, Engine, Color, Actor, vec, Label, Font, Keys } from 'excalibur'
import { useGameStore } from '../systems/GameState'

export class GameScene extends Scene {
  private player!: Actor
  private scoreLabel!: Label
  private score = 0

  onInitialize(engine: Engine): void {
    this.backgroundColor = Color.fromHex('#0f3460')

    // Create player
    this.player = new Actor({
      pos: vec(engine.halfDrawWidth, engine.halfDrawHeight),
      width: 32,
      height: 32,
      color: Color.fromHex('#16c79a'),
    })
    this.add(this.player)

    // Create score label
    this.scoreLabel = new Label({
      text: 'Score: 0',
      pos: vec(20, 20),
      font: new Font({
        size: 24,
        color: Color.White,
      }),
    })
    this.add(this.scoreLabel)

    // Create instructions
    const instructions = new Label({
      text: 'Arrow Keys to Move | ESC to Menu',
      pos: vec(engine.halfDrawWidth, engine.drawHeight - 30),
      font: new Font({
        size: 16,
        color: Color.fromHex('#888888'),
      }),
    })
    this.add(instructions)

    // Set up player movement
    const PLAYER_SPEED = 200
    this.player.on('preupdate', (evt) => {
      const delta = evt.delta / 1000

      // Handle input (deterministic movement)
      let velocityX = 0
      let velocityY = 0

      if (engine.input.keyboard.isHeld(Keys.ArrowLeft)) {
        velocityX = -PLAYER_SPEED
      }
      if (engine.input.keyboard.isHeld(Keys.ArrowRight)) {
        velocityX = PLAYER_SPEED
      }
      if (engine.input.keyboard.isHeld(Keys.ArrowUp)) {
        velocityY = -PLAYER_SPEED
      }
      if (engine.input.keyboard.isHeld(Keys.ArrowDown)) {
        velocityY = PLAYER_SPEED
      }

      // Update position
      this.player.pos.x += velocityX * delta
      this.player.pos.y += velocityY * delta

      // Keep player in bounds
      this.player.pos.x = Math.max(16, Math.min(engine.drawWidth - 16, this.player.pos.x))
      this.player.pos.y = Math.max(16, Math.min(engine.drawHeight - 16, this.player.pos.y))

      // Increment score (placeholder mechanic)
      this.score += delta * 10
      this.scoreLabel.text = `Score: ${Math.floor(this.score)}`
    })
  }

  onActivate(): void {
    // Reset score when scene activates
    this.score = 0

    // Listen for ESC to return to menu
    this.engine.input.keyboard.on('press', (evt) => {
      if (evt.key === Keys.Escape) {
        // Save score to game state
        const gameState = useGameStore.getState()
        if (this.score > gameState.playerScore) {
          gameState.increaseScore(Math.floor(this.score) - gameState.playerScore)
        }

        this.engine.goToScene('menu')
      }
    })
  }

  onDeactivate(): void {
    // Clean up listeners
    this.engine.input.keyboard.off('press')
  }
}
