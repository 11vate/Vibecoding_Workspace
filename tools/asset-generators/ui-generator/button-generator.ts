/**
 * Button Generator - Procedural UI Button Generation
 *
 * Purpose: Generate button sprites procedurally using geometric engine
 * Authority: Tier 2 (Mandatory for UI generation)
 * Dependencies: geometric-engine
 */

import { Canvas } from 'canvas';
import {
  createCanvasWithConfig,
  roundRect,
  canvasToPNG,
  darkenColor,
  lightenColor,
  addDropShadow,
  clearShadow,
  addInnerShadow
} from '../../procedural-generation/geometric-engine';

export type ButtonState = 'normal' | 'hover' | 'pressed' | 'disabled';
export type ButtonStyle = 'flat' | 'glossy' | 'gradient' | 'outline' | 'glass';

export interface ButtonSpec {
  width: number;
  height: number;
  color: string;
  state: ButtonState;
  style: ButtonStyle;
  borderRadius?: number;
  text?: string;
  textColor?: string;
  fontSize?: number;
}

export interface ButtonGenerationResult {
  buffer: Buffer;
  width: number;
  height: number;
  state: ButtonState;
}

/**
 * Generate a button sprite
 */
export async function generateButton(spec: ButtonSpec): Promise<ButtonGenerationResult> {
  const { canvas, ctx } = createCanvasWithConfig({
    width: spec.width,
    height: spec.height,
    transparent: true
  });

  const radius = spec.borderRadius || 8;

  // Generate based on style
  switch (spec.style) {
    case 'flat':
      generateFlatButton(ctx, spec, radius);
      break;
    case 'glossy':
      generateGlossyButton(ctx, spec, radius);
      break;
    case 'gradient':
      generateGradientButton(ctx, spec, radius);
      break;
    case 'outline':
      generateOutlineButton(ctx, spec, radius);
      break;
    case 'glass':
      generateGlassButton(ctx, spec, radius);
      break;
    default:
      generateFlatButton(ctx, spec, radius);
  }

  // Add text if specified
  if (spec.text) {
    addButtonText(ctx, spec);
  }

  return {
    buffer: canvasToPNG(canvas),
    width: spec.width,
    height: spec.height,
    state: spec.state
  };
}

/**
 * Generate flat style button
 */
function generateFlatButton(
  ctx: CanvasRenderingContext2D,
  spec: ButtonSpec,
  radius: number
): void {
  let fillColor = spec.color;

  // Adjust color based on state
  switch (spec.state) {
    case 'hover':
      fillColor = lightenColor(spec.color, 0.1);
      break;
    case 'pressed':
      fillColor = darkenColor(spec.color, 0.1);
      break;
    case 'disabled':
      fillColor = '#cccccc';
      break;
  }

  // Draw button
  roundRect(ctx, 0, 0, spec.width, spec.height, radius);
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Add subtle border
  if (spec.state !== 'disabled') {
    ctx.strokeStyle = darkenColor(spec.color, 0.2);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

/**
 * Generate glossy style button
 */
function generateGlossyButton(
  ctx: CanvasRenderingContext2D,
  spec: ButtonSpec,
  radius: number
): void {
  let baseColor = spec.color;

  // Adjust based on state
  switch (spec.state) {
    case 'hover':
      baseColor = lightenColor(spec.color, 0.1);
      break;
    case 'pressed':
      baseColor = darkenColor(spec.color, 0.1);
      break;
    case 'disabled':
      baseColor = '#cccccc';
      break;
  }

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, spec.height);
  gradient.addColorStop(0, lightenColor(baseColor, 0.3));
  gradient.addColorStop(0.5, baseColor);
  gradient.addColorStop(1, darkenColor(baseColor, 0.2));

  // Draw button
  roundRect(ctx, 0, 0, spec.width, spec.height, radius);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Add highlight on top half
  const highlightGradient = ctx.createLinearGradient(0, 0, 0, spec.height / 2);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.save();
  roundRect(ctx, 1, 1, spec.width - 2, spec.height / 2, radius);
  ctx.fillStyle = highlightGradient;
  ctx.fill();
  ctx.restore();

  // Border
  if (spec.state !== 'disabled') {
    roundRect(ctx, 0, 0, spec.width, spec.height, radius);
    ctx.strokeStyle = darkenColor(baseColor, 0.3);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

/**
 * Generate gradient style button
 */
function generateGradientButton(
  ctx: CanvasRenderingContext2D,
  spec: ButtonSpec,
  radius: number
): void {
  let color1 = spec.color;
  let color2 = darkenColor(spec.color, 0.2);

  // Adjust based on state
  switch (spec.state) {
    case 'hover':
      color1 = lightenColor(spec.color, 0.1);
      color2 = spec.color;
      break;
    case 'pressed':
      color1 = darkenColor(spec.color, 0.2);
      color2 = darkenColor(spec.color, 0.3);
      break;
    case 'disabled':
      color1 = '#cccccc';
      color2 = '#999999';
      break;
  }

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, spec.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  // Draw button
  roundRect(ctx, 0, 0, spec.width, spec.height, radius);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Border
  roundRect(ctx, 0, 0, spec.width, spec.height, radius);
  ctx.strokeStyle = darkenColor(color2, 0.2);
  ctx.lineWidth = 2;
  ctx.stroke();
}

/**
 * Generate outline style button
 */
function generateOutlineButton(
  ctx: CanvasRenderingContext2D,
  spec: ButtonSpec,
  radius: number
): void {
  let strokeColor = spec.color;
  let fillColor = 'transparent';

  // Adjust based on state
  switch (spec.state) {
    case 'hover':
      fillColor = spec.color;
      strokeColor = spec.color;
      // Will adjust alpha for fill
      break;
    case 'pressed':
      fillColor = spec.color;
      strokeColor = darkenColor(spec.color, 0.2);
      break;
    case 'disabled':
      strokeColor = '#cccccc';
      break;
  }

  // Draw background fill if hover/pressed
  if (spec.state === 'hover' || spec.state === 'pressed') {
    roundRect(ctx, 0, 0, spec.width, spec.height, radius);
    ctx.fillStyle = hexToRGBA(fillColor, spec.state === 'hover' ? 0.1 : 0.2);
    ctx.fill();
  }

  // Draw outline
  roundRect(ctx, 1, 1, spec.width - 2, spec.height - 2, radius);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

/**
 * Generate glass/translucent style button
 */
function generateGlassButton(
  ctx: CanvasRenderingContext2D,
  spec: ButtonSpec,
  radius: number
): void {
  let baseColor = spec.color;
  let opacity = 0.3;

  // Adjust based on state
  switch (spec.state) {
    case 'hover':
      opacity = 0.4;
      break;
    case 'pressed':
      opacity = 0.5;
      break;
    case 'disabled':
      baseColor = '#cccccc';
      opacity = 0.2;
      break;
  }

  // Create glass gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, spec.height);
  gradient.addColorStop(0, hexToRGBA(baseColor, opacity + 0.2));
  gradient.addColorStop(0.5, hexToRGBA(baseColor, opacity));
  gradient.addColorStop(1, hexToRGBA(baseColor, opacity + 0.1));

  // Draw button
  roundRect(ctx, 0, 0, spec.width, spec.height, radius);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Add highlight
  const highlightGradient = ctx.createLinearGradient(0, 0, 0, spec.height / 3);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.save();
  roundRect(ctx, 1, 1, spec.width - 2, spec.height / 3, radius);
  ctx.fillStyle = highlightGradient;
  ctx.fill();
  ctx.restore();

  // Border
  roundRect(ctx, 0, 0, spec.width, spec.height, radius);
  ctx.strokeStyle = hexToRGBA(baseColor, opacity + 0.3);
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * Add text to button
 */
function addButtonText(ctx: CanvasRenderingContext2D, spec: ButtonSpec): void {
  const fontSize = spec.fontSize || 16;
  const textColor = spec.textColor || (isLightColor(spec.color) ? '#000000' : '#ffffff');

  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Adjust opacity if disabled
  if (spec.state === 'disabled') {
    ctx.globalAlpha = 0.5;
  }

  ctx.fillText(spec.text!, spec.width / 2, spec.height / 2);

  ctx.globalAlpha = 1.0;
}

// Helper functions

function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

/**
 * Generate a complete button set (all states)
 */
export async function generateButtonSet(
  baseSpec: Omit<ButtonSpec, 'state'>
): Promise<Record<ButtonState, ButtonGenerationResult>> {
  const states: ButtonState[] = ['normal', 'hover', 'pressed', 'disabled'];

  const results: Record<string, ButtonGenerationResult> = {};

  for (const state of states) {
    results[state] = await generateButton({ ...baseSpec, state });
  }

  return results as Record<ButtonState, ButtonGenerationResult>;
}
