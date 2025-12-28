/**
 * Gradient Utilities - Advanced gradient generation for geometric assets
 *
 * Purpose: Provides sophisticated gradient patterns for UI elements
 * Authority: Tier 2 (Mandatory for geometric generation)
 */

import { CanvasRenderingContext2D, Canvas } from 'canvas';
import { applyLinearGradient, applyRadialGradient } from './canvas-renderer';

export type GradientType = 'linear' | 'radial' | 'conic' | 'diagonal' | 'multi-stop';

export interface GradientConfig {
  type: GradientType;
  colors: string[];
  angle?: number; // For linear gradients (degrees, 0 = horizontal)
  centerX?: number; // For radial/conic gradients (0-1, percentage of width)
  centerY?: number; // For radial/conic gradients (0-1, percentage of height)
  radius?: number; // For radial gradients (percentage of smallest dimension)
}

/**
 * Create a linear gradient
 */
export function createLinearGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[],
  angle: number = 90 // 0 = horizontal, 90 = vertical
): CanvasGradient {
  const angleRad = (angle * Math.PI) / 180;

  // Calculate gradient endpoints based on angle
  const x0 = width / 2 - (Math.cos(angleRad) * width) / 2;
  const y0 = height / 2 - (Math.sin(angleRad) * height) / 2;
  const x1 = width / 2 + (Math.cos(angleRad) * width) / 2;
  const y1 = height / 2 + (Math.sin(angleRad) * height) / 2;

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

  // Distribute colors evenly
  const step = 1 / (colors.length - 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index * step, color);
  });

  return gradient;
}

/**
 * Create a radial gradient
 */
export function createRadialGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[],
  centerX: number = 0.5,
  centerY: number = 0.5,
  radius: number = 0.5
): CanvasGradient {
  const cx = width * centerX;
  const cy = height * centerY;
  const r = Math.min(width, height) * radius;

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);

  // Distribute colors evenly
  const step = 1 / (colors.length - 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index * step, color);
  });

  return gradient;
}

/**
 * Create a conic gradient (simulated, not natively supported in canvas)
 */
export function createConicGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[],
  centerX: number = 0.5,
  centerY: number = 0.5,
  startAngle: number = 0
): void {
  const cx = width * centerX;
  const cy = height * centerY;
  const maxRadius = Math.max(width, height);

  const segments = colors.length;
  const anglePerSegment = (Math.PI * 2) / segments;

  colors.forEach((color, index) => {
    const startAngleRad = startAngle + anglePerSegment * index;
    const endAngleRad = startAngle + anglePerSegment * (index + 1);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxRadius, startAngleRad, endAngleRad);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
  });
}

/**
 * Create glossy button gradient (common UI pattern)
 */
export function createGlossyGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string
): CanvasGradient {
  // Lighten for top, darken for bottom
  const topColor = lightenHex(baseColor, 0.2);
  const bottomColor = darkenHex(baseColor, 0.1);

  return createLinearGradient(ctx, width, height, [topColor, bottomColor], 90);
}

/**
 * Create glass/translucent gradient effect
 */
export function createGlassGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string,
  opacity: number = 0.3
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, hexToRGBA(baseColor, opacity + 0.2));
  gradient.addColorStop(0.5, hexToRGBA(baseColor, opacity));
  gradient.addColorStop(1, hexToRGBA(baseColor, opacity + 0.1));

  return gradient;
}

/**
 * Create metallic gradient effect
 */
export function createMetallicGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);

  const darkColor = darkenHex(baseColor, 0.3);
  const lightColor = lightenHex(baseColor, 0.3);

  gradient.addColorStop(0, lightColor);
  gradient.addColorStop(0.25, baseColor);
  gradient.addColorStop(0.5, darkColor);
  gradient.addColorStop(0.75, baseColor);
  gradient.addColorStop(1, lightColor);

  return gradient;
}

/**
 * Create gradient from config
 */
export function applyGradientFromConfig(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: GradientConfig
): CanvasGradient | void {
  switch (config.type) {
    case 'linear':
      return createLinearGradient(ctx, width, height, config.colors, config.angle);

    case 'radial':
      return createRadialGradient(
        ctx,
        width,
        height,
        config.colors,
        config.centerX,
        config.centerY,
        config.radius
      );

    case 'conic':
      createConicGradient(
        ctx,
        width,
        height,
        config.colors,
        config.centerX,
        config.centerY,
        config.angle
      );
      return; // Conic gradient is drawn directly

    case 'diagonal':
      return createLinearGradient(ctx, width, height, config.colors, 45);

    default:
      return createLinearGradient(ctx, width, height, config.colors, 90);
  }
}

// Helper functions

function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lightenHex(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + Math.floor(255 * amount));
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + Math.floor(255 * amount));
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + Math.floor(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function darkenHex(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.floor(255 * amount));
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.floor(255 * amount));
  const b = Math.max(0, parseInt(hex.slice(3, 7), 16) - Math.floor(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
