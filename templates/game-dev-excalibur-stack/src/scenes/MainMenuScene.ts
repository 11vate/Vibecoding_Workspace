/**
 * Main Menu Scene
 *
 * Experience Intent: Welcoming, exciting, clear call-to-action
 * Player Psychology: Reduce friction, provide clear affordances
 */

import { Scene, Engine, Color, Actor, vec, Label, Font } from 'excalibur'
import { useGameStore } from '../systems/GameState'

export class MainMenuScene extends Scene {
  onInitialize(engine: Engine): void {
    // Set background color
    this.backgroundColor = Color.fromHex('#1a1a2e')

    // Create title
    const title = new Label({
      text: 'VIBECODING GAME',
      pos: vec(engine.halfDrawWidth, 150),
      font: new Font({
        size: 48,
        color: Color.White,
        bold: true,
      }),
    })
    this.add(title)

    // Create "Press SPACE to Start" prompt
    const startPrompt = new Label({
      text: 'Press SPACE to Start',
      pos: vec(engine.halfDrawWidth, engine.halfDrawHeight),
      font: new Font({
        size: 24,
        color: Color.fromHex('#16c79a'),
      }),
    })
    this.add(startPrompt)

    // Pulsing animation for start prompt
    let pulseTime = 0
    startPrompt.on('preupdate', (evt) => {
      pulseTime += evt.delta / 1000
      const alpha = (Math.sin(pulseTime * 3) + 1) / 2
      startPrompt.color = Color.fromHex('#16c79a').clone()
      startPrompt.color.a = alpha * 0.5 + 0.5
    })

    // Show player stats
    const state = useGameStore.getState()
    const statsLabel = new Label({
      text: `Level ${state.playerLevel} | High Score: ${state.playerScore}`,
      pos: vec(engine.halfDrawWidth, engine.halfDrawHeight + 100),
      font: new Font({
        size: 16,
        color: Color.fromHex('#888888'),
      }),
    })
    this.add(statsLabel)
  }

  onActivate(): void {
    // Listen for space key to start game
    this.engine.input.keyboard.on('press', (evt) => {
      if (evt.key === 'Space') {
        this.engine.goToScene('game')
      }
    })
  }
}
