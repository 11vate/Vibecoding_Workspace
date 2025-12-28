/**
 * Progress Bar Generator - Generate progress bar sprites
 *
 * Purpose: Create progress bars for loading, health, status indicators
 * Authority: Tier 2 (Mandatory for UI generation)
 * Use: Loading bars, health bars, mana bars, status indicators
 */

import { createCanvasWithConfig, roundRect, canvasToPNG } from '../../procedural-generation/geometric-engine/canvas-renderer';

export type ProgressBarStyle = 'standard' | 'gradient' | 'segmented' | 'radial';

export interface ProgressBarSpec {
  width: number;
  height: number;
  progress: number; // 0.0 to 1.0 (0% to 100%)
  style: ProgressBarStyle;
  backgroundColor: string; // Background/empty color
  fillColor: string; // Progress/fill color
  borderRadius?: number; // Corner radius (default: height/2 for rounded)
  borderColor?: string; // Border color (optional)
  borderWidth?: number; // Border width (default: 2)
  segments?: number; // Number of segments for segmented style (default: 10)
  showPercentage?: boolean; // Show percentage text (default: false)
}

export interface ProgressBarGenerationResult {
  image: Buffer;
  spec: ProgressBarSpec;
  symbolName: string;
}

/**
 * Generate progress bar sprite
 */
export async function generateProgressBar(spec: ProgressBarSpec): Promise<ProgressBarGenerationResult> {
  const {
    width,
    height,
    progress,
    style,
    backgroundColor,
    fillColor,
    borderRadius = Math.floor(height / 2),
    borderColor,
    borderWidth = 2,
    segments = 10,
    showPercentage = false
  } = spec;

  const { canvas, ctx } = createCanvasWithConfig({ width, height });

  // Draw progress bar based on style
  switch (style) {
    case 'standard':
      drawStandardProgressBar(ctx, width, height, progress, backgroundColor, fillColor, borderRadius, borderColor, borderWidth);
      break;
    case 'gradient':
      drawGradientProgressBar(ctx, width, height, progress, backgroundColor, fillColor, borderRadius, borderColor, borderWidth);
      break;
    case 'segmented':
      drawSegmentedProgressBar(ctx, width, height, progress, backgroundColor, fillColor, borderRadius, segments, borderColor, borderWidth);
      break;
    case 'radial':
      drawRadialProgressBar(ctx, width, height, progress, backgroundColor, fillColor, borderColor, borderWidth);
      break;
  }

  // Add percentage text if requested
  if (showPercentage) {
    drawPercentageText(ctx, width, height, progress);
  }

  const symbolName = `progressbar-${style}-${Math.round(progress * 100)}pct-${width}x${height}`;

  return {
    image: canvasToPNG(canvas),
    spec,
    symbolName
  };
}

// Progress bar drawing functions

function drawStandardProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  backgroundColor: string,
  fillColor: string,
  borderRadius: number,
  borderColor?: string,
  borderWidth: number = 2
): void {
  // Draw background
  ctx.fillStyle = backgroundColor;
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  // Draw progress fill
  if (progress > 0) {
    const fillWidth = Math.max(borderRadius * 2, width * progress);
    ctx.fillStyle = fillColor;
    roundRect(ctx, 0, 0, fillWidth, height, borderRadius);
    ctx.fill();
  }

  // Draw border
  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    roundRect(ctx, borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth, borderRadius);
    ctx.stroke();
  }
}

function drawGradientProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  backgroundColor: string,
  fillColor: string,
  borderRadius: number,
  borderColor?: string,
  borderWidth: number = 2
): void {
  // Draw background
  ctx.fillStyle = backgroundColor;
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  // Draw gradient progress fill
  if (progress > 0) {
    const fillWidth = Math.max(borderRadius * 2, width * progress);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, fillWidth, 0);
    const lightColor = lightenColor(fillColor, 0.2);
    const darkColor = darkenColor(fillColor, 0.1);

    gradient.addColorStop(0, lightColor);
    gradient.addColorStop(0.5, fillColor);
    gradient.addColorStop(1, darkColor);

    ctx.fillStyle = gradient;
    roundRect(ctx, 0, 0, fillWidth, height, borderRadius);
    ctx.fill();

    // Add glossy highlight
    const highlightGradient = ctx.createLinearGradient(0, 0, 0, height / 2);
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = highlightGradient;
    roundRect(ctx, 1, 1, fillWidth - 2, height / 2 - 1, borderRadius);
    ctx.fill();
  }

  // Draw border
  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    roundRect(ctx, borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth, borderRadius);
    ctx.stroke();
  }
}

function drawSegmentedProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  backgroundColor: string,
  fillColor: string,
  borderRadius: number,
  segments: number,
  borderColor?: string,
  borderWidth: number = 2
): void {
  const segmentWidth = (width - (segments - 1) * 2) / segments; // 2px gap between segments
  const filledSegments = Math.floor(progress * segments);

  // Draw background
  ctx.fillStyle = backgroundColor;
  roundRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  // Draw segments
  for (let i = 0; i < segments; i++) {
    const x = i * (segmentWidth + 2);
    const isFilled = i < filledSegments;

    ctx.fillStyle = isFilled ? fillColor : darkenColor(backgroundColor, 0.2);

    // First and last segments need special border radius handling
    let segRadius = 0;
    if (i === 0) {
      segRadius = borderRadius;
    } else if (i === segments - 1) {
      segRadius = borderRadius;
    }

    roundRect(ctx, x, 2, segmentWidth, height - 4, segRadius);
    ctx.fill();
  }

  // Draw border
  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    roundRect(ctx, borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth, borderRadius);
    ctx.stroke();
  }
}

function drawRadialProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  backgroundColor: string,
  fillColor: string,
  borderColor?: string,
  borderWidth: number = 2
): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - borderWidth;
  const innerRadius = radius * 0.7;

  // Draw background circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = backgroundColor;
  ctx.fill();

  // Draw progress arc
  if (progress > 0) {
    const startAngle = -Math.PI / 2; // Start at top
    const endAngle = startAngle + (Math.PI * 2 * progress);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  // Draw inner circle (creates ring effect)
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  ctx.fillStyle = backgroundColor;
  ctx.fill();

  // Draw border
  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;

    // Outer border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner border
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawPercentageText(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
): void {
  const percentage = Math.round(progress * 100);
  const fontSize = Math.floor(height * 0.6);

  ctx.fillStyle = '#000000';
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add white outline for readability
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeText(`${percentage}%`, width / 2, height / 2);

  ctx.fillText(`${percentage}%`, width / 2, height / 2);
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

/**
 * Generate health bar (red progress bar)
 */
export async function generateHealthBar(
  width: number,
  height: number,
  health: number // 0.0 to 1.0
): Promise<ProgressBarGenerationResult> {
  return generateProgressBar({
    width,
    height,
    progress: health,
    style: 'gradient',
    backgroundColor: '#2c3e50',
    fillColor: health > 0.3 ? '#27ae60' : '#e74c3c',
    borderColor: '#34495e',
    borderWidth: 2
  });
}

/**
 * Generate mana bar (blue progress bar)
 */
export async function generateManaBar(
  width: number,
  height: number,
  mana: number // 0.0 to 1.0
): Promise<ProgressBarGenerationResult> {
  return generateProgressBar({
    width,
    height,
    progress: mana,
    style: 'gradient',
    backgroundColor: '#2c3e50',
    fillColor: '#3498db',
    borderColor: '#34495e',
    borderWidth: 2
  });
}

/**
 * Generate experience bar (yellow/gold progress bar)
 */
export async function generateExperienceBar(
  width: number,
  height: number,
  experience: number // 0.0 to 1.0
): Promise<ProgressBarGenerationResult> {
  return generateProgressBar({
    width,
    height,
    progress: experience,
    style: 'gradient',
    backgroundColor: '#2c3e50',
    fillColor: '#f39c12',
    borderColor: '#34495e',
    borderWidth: 2
  });
}
