/**
 * Panel Generator - Generate UI panel/window sprites
 *
 * Purpose: Create panels, dialogs, windows for UI
 * Authority: Tier 2 (Mandatory for UI generation)
 * Use: Menus, dialogs, windows, containers
 */

import { createCanvasWithConfig, roundRect, canvasToPNG } from '../../procedural-generation/geometric-engine/canvas-renderer';

export type PanelStyle = 'solid' | 'bordered' | 'gradient' | 'glass' | 'paper';

export interface PanelSpec {
  width: number;
  height: number;
  backgroundColor: string;
  style: PanelStyle;
  borderRadius?: number; // Corner radius (default: 8)
  borderColor?: string; // Border color (default: darker version of background)
  borderWidth?: number; // Border width (default: 2)
  padding?: number; // Inner padding (default: 10)
  shadow?: boolean; // Add drop shadow (default: true)
  title?: string; // Optional title bar
  titleHeight?: number; // Title bar height (default: 30)
  titleColor?: string; // Title bar color
}

export interface PanelGenerationResult {
  image: Buffer;
  spec: PanelSpec;
  symbolName: string;
  contentArea: { x: number; y: number; width: number; height: number }; // Usable content area
}

/**
 * Generate panel sprite
 */
export async function generatePanel(spec: PanelSpec): Promise<PanelGenerationResult> {
  const {
    width,
    height,
    backgroundColor,
    style,
    borderRadius = 8,
    borderColor,
    borderWidth = 2,
    padding = 10,
    shadow = true,
    title,
    titleHeight = 30,
    titleColor
  } = spec;

  const { canvas, ctx } = createCanvasWithConfig({ width, height });

  // Draw shadow first (if enabled)
  if (shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
  }

  // Draw panel based on style
  switch (style) {
    case 'solid':
      drawSolidPanel(ctx, width, height, backgroundColor, borderRadius);
      break;
    case 'bordered':
      drawBorderedPanel(ctx, width, height, backgroundColor, borderRadius, borderColor || darkenColor(backgroundColor, 0.3), borderWidth);
      break;
    case 'gradient':
      drawGradientPanel(ctx, width, height, backgroundColor, borderRadius);
      break;
    case 'glass':
      drawGlassPanel(ctx, width, height, backgroundColor, borderRadius);
      break;
    case 'paper':
      drawPaperPanel(ctx, width, height, backgroundColor, borderRadius);
      break;
  }

  // Clear shadow for subsequent drawings
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Draw title bar if specified
  let contentY = padding;
  if (title) {
    const finalTitleColor = titleColor || darkenColor(backgroundColor, 0.2);
    drawTitleBar(ctx, width, titleHeight, finalTitleColor, title, borderRadius);
    contentY = titleHeight + padding;
  }

  // Calculate content area
  const contentArea = {
    x: padding,
    y: contentY,
    width: width - padding * 2,
    height: height - contentY - padding
  };

  const symbolName = `panel-${style}-${width}x${height}${title ? '-titled' : ''}`;

  return {
    image: canvasToPNG(canvas),
    spec,
    symbolName,
    contentArea
  };
}

// Panel drawing functions

function drawSolidPanel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor: string,
  borderRadius: number
): void {
  ctx.fillStyle = backgroundColor;
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();
}

function drawBorderedPanel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor: string,
  borderRadius: number,
  borderColor: string,
  borderWidth: number
): void {
  // Fill background
  ctx.fillStyle = backgroundColor;
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  // Draw border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  roundRect(ctx, borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth, borderRadius);
  ctx.stroke();
}

function drawGradientPanel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor: string,
  borderRadius: number
): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, lightenColor(backgroundColor, 0.1));
  gradient.addColorStop(1, darkenColor(backgroundColor, 0.1));

  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  // Add subtle border
  ctx.strokeStyle = darkenColor(backgroundColor, 0.2);
  ctx.lineWidth = 1;
  roundRect(ctx, 0.5, 0.5, width - 1, height - 1, borderRadius);
  ctx.stroke();
}

function drawGlassPanel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor: string,
  borderRadius: number
): void {
  // Semi-transparent background
  ctx.fillStyle = hexToRGBA(backgroundColor, 0.4);
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  // Glass reflection effect
  const reflectionGradient = ctx.createLinearGradient(0, 0, 0, height);
  reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  reflectionGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  reflectionGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

  ctx.fillStyle = reflectionGradient;
  roundRect(ctx, 1, 1, width - 2, height - 2, borderRadius);
  ctx.fill();

  // Frosted border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  roundRect(ctx, 0.5, 0.5, width - 1, height - 1, borderRadius);
  ctx.stroke();
}

function drawPaperPanel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor: string,
  borderRadius: number
): void {
  // Paper background
  ctx.fillStyle = backgroundColor;
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  // Paper texture (simulated with subtle noise)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillRect(x, y, 1, 1);
  }

  // Folded corner effect (optional)
  const cornerSize = 20;
  ctx.fillStyle = darkenColor(backgroundColor, 0.1);
  ctx.beginPath();
  ctx.moveTo(width - cornerSize, 0);
  ctx.lineTo(width, cornerSize);
  ctx.lineTo(width, 0);
  ctx.closePath();
  ctx.fill();

  // Subtle shadow on edges
  ctx.strokeStyle = darkenColor(backgroundColor, 0.15);
  ctx.lineWidth = 1;
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.stroke();
}

function drawTitleBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  title: string,
  borderRadius: number
): void {
  // Draw title bar background
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(borderRadius, 0);
  ctx.lineTo(width - borderRadius, 0);
  ctx.arcTo(width, 0, width, borderRadius, borderRadius);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.lineTo(0, borderRadius);
  ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
  ctx.closePath();
  ctx.fill();

  // Draw title text
  ctx.fillStyle = getContrastColor(color);
  ctx.font = `bold ${Math.floor(height * 0.5)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, width / 2, height / 2);

  // Draw separator line
  ctx.strokeStyle = darkenColor(color, 0.2);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(width, height);
  ctx.stroke();
}

// Color utility functions

function lightenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  const r = Math.min(255, rgb.r + Math.floor(255 * amount));
  const g = Math.min(255, rgb.g + Math.floor(255 * amount));
  const b = Math.min(255, rgb.b + Math.floor(255 * amount));
  return rgbToHex(r, g, b);
}

function darkenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  const r = Math.max(0, rgb.r - Math.floor(255 * amount));
  const g = Math.max(0, rgb.g - Math.floor(255 * amount));
  const b = Math.max(0, rgb.b - Math.floor(255 * amount));
  return rgbToHex(r, g, b);
}

function getContrastColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function hexToRGBA(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Generate dialog panel with standard layout
 */
export async function generateDialog(
  width: number,
  height: number,
  title: string,
  backgroundColor: string = '#ffffff'
): Promise<PanelGenerationResult> {
  return generatePanel({
    width,
    height,
    backgroundColor,
    style: 'bordered',
    title,
    titleColor: '#3b82f6',
    shadow: true
  });
}

/**
 * Generate tooltip panel
 */
export async function generateTooltip(
  width: number,
  height: number,
  backgroundColor: string = '#2c3e50'
): Promise<PanelGenerationResult> {
  return generatePanel({
    width,
    height,
    backgroundColor,
    style: 'glass',
    borderRadius: 6,
    padding: 8,
    shadow: true
  });
}
