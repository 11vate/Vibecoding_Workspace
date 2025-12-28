/**
 * Renderer - Puzzle Game Version
 *
 * Purpose: Render game graphics
 * Authority: Tier 2 (Core subsystem)
 */

import { AppState } from '../state/store';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 700;

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private gemColors: string[] = [
    '#e74c3c', // Red
    '#3498db', // Blue
    '#2ecc71', // Green
    '#f39c12', // Yellow
    '#9b59b6', // Purple
    '#1abc9c'  // Teal
  ];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
  }

  render(state: AppState, interpolation: number): void {
    this.clear();

    if (state.gameState === 'menu') {
      this.renderMenu(state);
    } else if (state.gameState === 'playing' || state.gameState === 'paused') {
      this.renderGame(state);

      if (state.gameState === 'paused') {
        this.renderPauseOverlay();
      }
    } else if (state.gameState === 'gameOver') {
      this.renderGameOver(state);
    }

    if (state.debug.enabled || state.debug.showFPS) {
      this.renderDebugInfo(state);
    }
  }

  private clear(): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private renderMenu(state: AppState): void {
    // Title
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Match-3 Puzzle', CANVAS_WIDTH / 2, 150);
    this.ctx.restore();

    // Start button
    this.renderButton(200, 300, 200, 60, 'Start Game', '#2ecc71');

    // High score
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`High Score: ${state.highScore}`, CANVAS_WIDTH / 2, 400);
    this.ctx.restore();

    // Instructions
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Click two adjacent gems to swap them', CANVAS_WIDTH / 2, 480);
    this.ctx.fillText('Match 3 or more gems to score points', CANVAS_WIDTH / 2, 510);
    this.ctx.fillText('ESC to pause • R to restart', CANVAS_WIDTH / 2, 540);
    this.ctx.restore();
  }

  private renderGame(state: AppState): void {
    // Header
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 32px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Match-3 Puzzle', CANVAS_WIDTH / 2, 40);
    this.ctx.restore();

    // Score
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${state.score}`, 20, 90);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`High: ${state.highScore}`, CANVAS_WIDTH - 20, 90);
    this.ctx.restore();

    // Combo
    if (state.combo > 0) {
      this.ctx.save();
      this.ctx.fillStyle = '#f39c12';
      this.ctx.font = 'bold 24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`Combo x${state.combo}!`, CANVAS_WIDTH / 2, 90);
      this.ctx.restore();
    }

    // Grid
    this.renderGrid(state);
  }

  private renderGrid(state: AppState): void {
    const gridStartX = 50;
    const gridStartY = 120;
    const cellSize = 60;
    const cellPadding = 5;

    // Draw grid background
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(
      gridStartX - 10,
      gridStartY - 10,
      state.gridCols * cellSize + 20,
      state.gridRows * cellSize + 20
    );
    this.ctx.restore();

    // Draw cells
    for (let row = 0; row < state.gridRows; row++) {
      for (let col = 0; col < state.gridCols; col++) {
        const cell = state.grid[row][col];
        const x = gridStartX + col * cellSize;
        const y = gridStartY + row * cellSize;

        // Cell background
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(
          x + cellPadding,
          y + cellPadding,
          cellSize - cellPadding * 2,
          cellSize - cellPadding * 2
        );
        this.ctx.restore();

        // Gem
        if (cell.type >= 0) {
          const gemX = x + cellSize / 2;
          const gemY = y + cellSize / 2;
          const gemRadius = (cellSize - cellPadding * 2) / 2 - 5;

          this.ctx.save();
          this.ctx.fillStyle = this.gemColors[cell.type];

          if (cell.matched) {
            this.ctx.globalAlpha = 0.5;
          }

          this.ctx.beginPath();
          this.ctx.arc(gemX, gemY, gemRadius, 0, Math.PI * 2);
          this.ctx.fill();

          // Highlight
          const highlightGradient = this.ctx.createRadialGradient(
            gemX - gemRadius / 3,
            gemY - gemRadius / 3,
            0,
            gemX,
            gemY,
            gemRadius
          );
          highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          this.ctx.fillStyle = highlightGradient;
          this.ctx.fill();

          this.ctx.restore();
        }

        // Selection highlight
        if (state.selectedCell && state.selectedCell.row === row && state.selectedCell.col === col) {
          this.ctx.save();
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 3;
          this.ctx.strokeRect(
            x + cellPadding,
            y + cellPadding,
            cellSize - cellPadding * 2,
            cellSize - cellPadding * 2
          );
          this.ctx.restore();
        }
      }
    }
  }

  private renderPauseOverlay(): void {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    this.ctx.font = '20px sans-serif';
    this.ctx.fillText('Press ESC to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    this.ctx.restore();
  }

  private renderGameOver(state: AppState): void {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Game Over', CANVAS_WIDTH / 2, 200);

    this.ctx.font = '32px sans-serif';
    this.ctx.fillText(`Final Score: ${state.score}`, CANVAS_WIDTH / 2, 280);

    if (state.score === state.highScore && state.score > 0) {
      this.ctx.fillStyle = '#f39c12';
      this.ctx.fillText('New High Score!', CANVAS_WIDTH / 2, 340);
    } else {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(`High Score: ${state.highScore}`, CANVAS_WIDTH / 2, 340);
    }

    this.renderButton(200, 420, 200, 60, 'Play Again', '#2ecc71');

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.font = '18px sans-serif';
    this.ctx.fillText('Press R to restart', CANVAS_WIDTH / 2, 550);
    this.ctx.restore();
  }

  private renderButton(x: number, y: number, width: number, height: number, text: string, color: string): void {
    this.ctx.save();

    // Button background
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);

    // Button text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x + width / 2, y + height / 2);

    this.ctx.restore();
  }

  private renderDebugInfo(state: AppState): void {
    const x = CANVAS_WIDTH - 140;
    const y = 20;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x - 10, y - 10, 130, 80);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    if (state.debug.showFPS) {
      this.ctx.fillText(`FPS: ${state.fps}`, x, y);
    }

    if (state.debug.enabled) {
      this.ctx.fillText(`Frame: ${state.frameCount}`, x, y + 20);
      this.ctx.fillText(`Delta: ${state.deltaTime.toFixed(3)}`, x, y + 40);
      this.ctx.fillText(`State: ${state.gameState}`, x, y + 60);
    }

    this.ctx.restore();
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
