/**
 * Button Component - Example UI Component
 *
 * Purpose: Reusable button component
 * Authority: Tier 2 (Standard component)
 */

export interface ButtonConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  onClick: () => void;
  color?: string;
  hoverColor?: string;
  textColor?: string;
  font?: string;
}

export class Button {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public text: string;
  public onClick: () => void;

  private color: string;
  private hoverColor: string;
  private textColor: string;
  private font: string;

  private hovered: boolean = false;
  private pressed: boolean = false;

  constructor(config: ButtonConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.text = config.text;
    this.onClick = config.onClick;

    this.color = config.color || '#4a4a4a';
    this.hoverColor = config.hoverColor || '#6a6a6a';
    this.textColor = config.textColor || '#ffffff';
    this.font = config.font || '16px sans-serif';
  }

  /**
   * Update button state
   */
  update(mouseX: number, mouseY: number, mousePressed: boolean): void {
    // Check hover
    this.hovered = this.isPointInside(mouseX, mouseY);

    // Check click
    if (this.hovered && mousePressed && !this.pressed) {
      this.onClick();
    }

    this.pressed = mousePressed;
  }

  /**
   * Render button
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Draw button background
    ctx.fillStyle = this.hovered ? this.hoverColor : this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw button border
    ctx.strokeStyle = this.textColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Draw button text
    ctx.fillStyle = this.textColor;
    ctx.font = this.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2
    );

    ctx.restore();
  }

  /**
   * Check if point is inside button
   */
  private isPointInside(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  /**
   * Set position
   */
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Set size
   */
  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * Set text
   */
  setText(text: string): void {
    this.text = text;
  }

  /**
   * Check if hovered
   */
  isHovered(): boolean {
    return this.hovered;
  }
}
