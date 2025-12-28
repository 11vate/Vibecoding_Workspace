/**
 * Canvas Renderer - Core utilities for Canvas API-based procedural generation
 *
 * Purpose: Provides clean wrapper around Canvas API for geometric sprite generation
 * Authority: Tier 2 (Mandatory for geometric generation)
 * Dependencies: canvas library (Node.js Canvas implementation)
 */

import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor?: string;
  transparent?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Create a new canvas with specified configuration
 */
export function createCanvasWithConfig(config: CanvasConfig): {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext('2d');

  // Set background
  if (config.transparent) {
    ctx.clearRect(0, 0, config.width, config.height);
  } else if (config.backgroundColor) {
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.width, config.height);
  }

  return { canvas, ctx };
}

/**
 * Convert hex color to RGBA string
 */
export function hexToRGBA(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Convert RGB object to string
 */
export function rgbToString(color: Color): string {
  const a = color.a !== undefined ? color.a : 1;
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${a})`;
}

/**
 * Lighten a hex color by a percentage (0-1)
 */
export function lightenColor(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + Math.floor(255 * amount));
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + Math.floor(255 * amount));
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + Math.floor(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Darken a hex color by a percentage (0-1)
 */
export function darkenColor(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.floor(255 * amount));
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.floor(255 * amount));
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - Math.floor(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Draw a rounded rectangle
 */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Apply linear gradient
 */
export function applyLinearGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  colorStops: Array<{ offset: number; color: string }>
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const stop of colorStops) {
    gradient.addColorStop(stop.offset, stop.color);
  }
  return gradient;
}

/**
 * Apply radial gradient
 */
export function applyRadialGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number,
  colorStops: Array<{ offset: number; color: string }>
): CanvasGradient {
  const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  for (const stop of colorStops) {
    gradient.addColorStop(stop.offset, stop.color);
  }
  return gradient;
}

/**
 * Add drop shadow effect
 */
export function addDropShadow(
  ctx: CanvasRenderingContext2D,
  offsetX: number = 2,
  offsetY: number = 2,
  blur: number = 4,
  color: string = 'rgba(0, 0, 0, 0.3)'
): void {
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
}

/**
 * Clear shadow effect
 */
export function clearShadow(ctx: CanvasRenderingContext2D): void {
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
}

/**
 * Add inner shadow effect (simulated)
 */
export function addInnerShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';

  const gradient = ctx.createLinearGradient(x, y, x, y + 10);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  roundRect(ctx, x, y, width, 10, radius);
  ctx.fill();

  ctx.restore();
}

/**
 * Add glow effect
 */
export function addGlow(
  ctx: CanvasRenderingContext2D,
  color: string,
  blur: number = 10
): void {
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
}

/**
 * Export canvas to PNG buffer
 */
export function canvasToPNG(canvas: Canvas): Buffer {
  return canvas.toBuffer('image/png');
}

/**
 * Get pixel data from canvas
 */
export function getPixelData(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Uint8ClampedArray {
  const imageData = ctx.getImageData(0, 0, width, height);
  return imageData.data;
}

/**
 * Set pixel data on canvas
 */
export function setPixelData(
  ctx: CanvasRenderingContext2D,
  data: Uint8ClampedArray,
  width: number,
  height: number
): void {
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(data);
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Set individual pixel color
 */
export function setPixel(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  width: number,
  color: Color
): void {
  const index = (y * width + x) * 4;
  data[index] = color.r;
  data[index + 1] = color.g;
  data[index + 2] = color.b;
  data[index + 3] = color.a !== undefined ? Math.floor(color.a * 255) : 255;
}

/**
 * Get individual pixel color
 */
export function getPixel(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  width: number
): Color {
  const index = (y * width + x) * 4;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
    a: data[index + 3] / 255
  };
}

/**
 * Fill entire canvas with color
 */
export function fillCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Clear entire canvas
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}

/**
 * Interpolate between two colors
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = {
    r: parseInt(color1.slice(1, 3), 16),
    g: parseInt(color1.slice(3, 5), 16),
    b: parseInt(color1.slice(5, 7), 16)
  };

  const c2 = {
    r: parseInt(color2.slice(1, 3), 16),
    g: parseInt(color2.slice(3, 5), 16),
    b: parseInt(color2.slice(5, 7), 16)
  };

  const r = Math.floor(c1.r + (c2.r - c1.r) * factor);
  const g = Math.floor(c1.g + (c2.g - c1.g) * factor);
  const b = Math.floor(c1.b + (c2.b - c1.b) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
