/**
 * Renderer
 *
 * Purpose: Handles all rendering operations
 * Authority: Tier 1 (Core system)
 */

import { AppState } from '../state/store';

export interface RenderOptions {
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export interface TextRenderOptions {
  text: string;
  x: number;
  y: number;
  color?: string;
  font?: string;
  align?: CanvasTextAlign;
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private backgroundColor: string;

  constructor(options: RenderOptions = {}) {
    // Get or create canvas
    this.canvas = options.canvas || this.createCanvas();
    this.ctx = this.canvas.getContext('2d')!;

    this.width = options.width || 800;
    this.height = options.height || 600;
    this.backgroundColor = options.backgroundColor || '#000000';

    // Set canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * Initialize renderer
   */
  initialize(): void {
    // Set default rendering properties
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Append canvas to document if not already present
    if (!this.canvas.parentElement) {
      document.body.appendChild(this.canvas);
    }

    console.log('Renderer initialized', this.width, 'x', this.height);
  }

  /**
   * Cleanup renderer
   */
  cleanup(): void {
    // Remove canvas from document
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }

    console.log('Renderer cleaned up');
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Render current state
   */
  render(state: AppState, interpolation: number): void {
    // Render game/app state
    // This is where you implement your rendering logic

    // Example: Render based on active screen
    switch (state.ui.activeScreen) {
      case 'main':
        this.renderMainScreen(state, interpolation);
        break;

      case 'game':
        this.renderGameScreen(state, interpolation);
        break;

      case 'settings':
        this.renderSettingsScreen(state, interpolation);
        break;

      default:
        this.renderDefaultScreen(state, interpolation);
    }

    // Render active modal if present
    if (state.ui.activeModal) {
      this.renderModal(state, state.ui.activeModal);
    }
  }

  /**
   * Render text
   */
  renderText(options: TextRenderOptions): void {
    const {
      text,
      x,
      y,
      color = 'white',
      font = '16px sans-serif',
      align = 'left'
    } = options;

    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  /**
   * Render rectangle
   */
  renderRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    filled: boolean = true
  ): void {
    this.ctx.save();

    if (filled) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(x, y, width, height);
    }

    this.ctx.restore();
  }

  /**
   * Render circle
   */
  renderCircle(
    x: number,
    y: number,
    radius: number,
    color: string,
    filled: boolean = true
  ): void {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (filled) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /**
   * Render image
   */
  renderImage(
    image: HTMLImageElement | HTMLCanvasElement,
    sx: number,
    sy: number,
    sw?: number,
    sh?: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number
  ): void {
    if (sw !== undefined && sh !== undefined && dx !== undefined && dy !== undefined) {
      this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw || sw, dh || sh);
    } else {
      this.ctx.drawImage(image, sx, sy);
    }
  }

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get 2D context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;

    console.log('Renderer resized to', width, 'x', height);
  }

  /**
   * Create canvas element
   */
  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    return canvas;
  }

  /**
   * Render main screen
   */
  private renderMainScreen(state: AppState, interpolation: number): void {
    // Example main screen rendering
    this.renderText({
      text: 'Main Screen',
      x: this.width / 2,
      y: this.height / 2,
      font: '32px sans-serif',
      align: 'center',
      color: 'white'
    });

    this.renderText({
      text: 'Press SPACE to start',
      x: this.width / 2,
      y: this.height / 2 + 50,
      font: '16px sans-serif',
      align: 'center',
      color: 'gray'
    });
  }

  /**
   * Render game screen
   */
  private renderGameScreen(state: AppState, interpolation: number): void {
    // Example game screen rendering
    this.renderText({
      text: 'Game Screen',
      x: this.width / 2,
      y: 50,
      font: '24px sans-serif',
      align: 'center',
      color: 'white'
    });

    // Render game-specific content here
  }

  /**
   * Render settings screen
   */
  private renderSettingsScreen(state: AppState, interpolation: number): void {
    // Example settings screen rendering
    this.renderText({
      text: 'Settings',
      x: this.width / 2,
      y: 50,
      font: '24px sans-serif',
      align: 'center',
      color: 'white'
    });

    this.renderText({
      text: `Volume: ${Math.round(state.settings.volume * 100)}%`,
      x: 50,
      y: 100,
      color: 'white'
    });

    this.renderText({
      text: `Auto-save: ${state.settings.autoSave ? 'ON' : 'OFF'}`,
      x: 50,
      y: 130,
      color: 'white'
    });
  }

  /**
   * Render default/fallback screen
   */
  private renderDefaultScreen(state: AppState, interpolation: number): void {
    this.renderText({
      text: 'Default Screen',
      x: this.width / 2,
      y: this.height / 2,
      font: '24px sans-serif',
      align: 'center',
      color: 'white'
    });
  }

  /**
   * Render modal overlay
   */
  private renderModal(state: AppState, modalId: string): void {
    // Semi-transparent overlay
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Modal background
    const modalWidth = 400;
    const modalHeight = 300;
    const modalX = (this.width - modalWidth) / 2;
    const modalY = (this.height - modalHeight) / 2;

    this.renderRect(modalX, modalY, modalWidth, modalHeight, '#333');
    this.renderRect(modalX, modalY, modalWidth, modalHeight, '#666', false);

    // Modal title
    this.renderText({
      text: modalId,
      x: this.width / 2,
      y: modalY + 40,
      font: '20px sans-serif',
      align: 'center',
      color: 'white'
    });

    this.ctx.restore();
  }
}
