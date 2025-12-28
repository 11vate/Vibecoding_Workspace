/**
 * Icon Generator - Generate UI icons from SVG or pixel art
 *
 * Purpose: Create icons for UI elements
 * Authority: Tier 2 (Mandatory for UI generation)
 * Use: Icons, symbols, indicators
 */

import { generateIcon as generateSVGIcon, SVGConfig, listIcons } from '../../procedural-generation/vector-engine/svg-generator';
import { createCanvas } from 'canvas';

export type IconFormat = 'svg' | 'png';

export interface IconSpec {
  name: string; // Icon name (e.g., 'save', 'load', 'settings')
  size: number; // Icon size in pixels
  color?: string; // Icon color (default: #000000)
  format?: IconFormat; // Output format (default: 'png')
  backgroundColor?: string; // Background color for PNG (default: transparent)
}

export interface IconGenerationResult {
  image: Buffer | string; // PNG buffer or SVG string
  spec: IconSpec;
  symbolName: string;
  format: IconFormat;
}

/**
 * Generate icon
 */
export async function generateIcon(spec: IconSpec): Promise<IconGenerationResult> {
  const {
    name,
    size,
    color = '#000000',
    format = 'png',
    backgroundColor = 'transparent'
  } = spec;

  // Generate SVG
  const svgString = generateSVGIcon(name, { size, color });

  // Convert to PNG if requested
  let image: Buffer | string;
  let finalFormat: IconFormat;

  if (format === 'png') {
    image = await svgToPNG(svgString, size, size, backgroundColor);
    finalFormat = 'png';
  } else {
    image = svgString;
    finalFormat = 'svg';
  }

  const symbolName = `icon-${name}-${size}x${size}`;

  return {
    image,
    spec,
    symbolName,
    format: finalFormat
  };
}

/**
 * Generate a set of icons (multiple sizes)
 */
export async function generateIconSet(
  name: string,
  sizes: number[] = [16, 24, 32, 48, 64],
  color: string = '#000000',
  format: IconFormat = 'png'
): Promise<Record<number, IconGenerationResult>> {
  const results: Record<number, IconGenerationResult> = {};

  for (const size of sizes) {
    results[size] = await generateIcon({ name, size, color, format });
  }

  return results;
}

/**
 * Generate all available icons at a specific size
 */
export async function generateAllIcons(
  size: number = 32,
  color: string = '#000000',
  format: IconFormat = 'png'
): Promise<Record<string, IconGenerationResult>> {
  const iconNames = listIcons();
  const results: Record<string, IconGenerationResult> = {};

  for (const name of iconNames) {
    results[name] = await generateIcon({ name, size, color, format });
  }

  return results;
}

/**
 * Convert SVG string to PNG buffer
 */
async function svgToPNG(
  svgString: string,
  width: number,
  height: number,
  backgroundColor: string
): Promise<Buffer> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background if not transparent
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Convert SVG to image data URL
  const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;

  // Load and draw SVG (Canvas API doesn't support SVG directly in Node.js)
  // For now, we'll parse the SVG and re-draw it manually
  // This is a simplified approach - proper SVG rendering would use a library
  await drawSimpleSVG(ctx, svgString, width, height);

  return canvas.toBuffer('image/png');
}

/**
 * Simplified SVG drawing (draws basic shapes from SVG)
 * Note: This is a basic implementation. For production, use a proper SVG renderer.
 */
async function drawSimpleSVG(
  ctx: CanvasRenderingContext2D,
  svgString: string,
  width: number,
  height: number
): Promise<void> {
  // Extract elements from SVG string
  const circleMatches = svgString.matchAll(/<circle[^>]*cx="([^"]*)"[^>]*cy="([^"]*)"[^>]*r="([^"]*)"[^>]*(?:fill="([^"]*)")?[^>]*(?:stroke="([^"]*)")?[^>]*stroke-width="([^"]*)"?/g);
  const rectMatches = svgString.matchAll(/<rect[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*width="([^"]*)"[^>]*height="([^"]*)"[^>]*(?:fill="([^"]*)")?[^>]*(?:stroke="([^"]*)")?[^>]*stroke-width="([^"]*)"?/g);
  const lineMatches = svgString.matchAll(/<line[^>]*x1="([^"]*)"[^>]*y1="([^"]*)"[^>]*x2="([^"]*)"[^>]*y2="([^"]*)"[^>]*stroke="([^"]*)"[^>]*stroke-width="([^"]*)"/g);
  const pathMatches = svgString.matchAll(/<path[^>]*d="([^"]*)"[^>]*(?:stroke="([^"]*)")?[^>]*(?:stroke-width="([^"]*)")?[^>]*(?:fill="([^"]*)")[^>]*/g);

  // Draw circles
  for (const match of Array.from(circleMatches)) {
    const cx = parseFloat(match[1]);
    const cy = parseFloat(match[2]);
    const r = parseFloat(match[3]);
    const fill = match[4];
    const stroke = match[5];
    const strokeWidth = parseFloat(match[6]) || 1;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);

    if (fill && fill !== 'none') {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  }

  // Draw rectangles
  for (const match of Array.from(rectMatches)) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    const w = parseFloat(match[3]);
    const h = parseFloat(match[4]);
    const fill = match[5];
    const stroke = match[6];
    const strokeWidth = parseFloat(match[7]) || 1;

    if (fill && fill !== 'none') {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, w, h);
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(x, y, w, h);
    }
  }

  // Draw lines
  for (const match of Array.from(lineMatches)) {
    const x1 = parseFloat(match[1]);
    const y1 = parseFloat(match[2]);
    const x2 = parseFloat(match[3]);
    const y2 = parseFloat(match[4]);
    const stroke = match[5];
    const strokeWidth = parseFloat(match[6]) || 1;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }

  // Draw paths (simplified - this is complex in full SVG)
  for (const match of Array.from(pathMatches)) {
    const d = match[1];
    const stroke = match[2];
    const strokeWidth = parseFloat(match[3]) || 1;
    const fill = match[4];

    // Parse path commands (simplified)
    const commands = d.match(/[MLQZmlqz][^MLQZmlqz]*/g) || [];

    ctx.beginPath();

    for (const cmd of commands) {
      const type = cmd[0];
      const values = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);

      switch (type.toUpperCase()) {
        case 'M':
          ctx.moveTo(values[0], values[1]);
          break;
        case 'L':
          ctx.lineTo(values[0], values[1]);
          break;
        case 'Q':
          ctx.quadraticCurveTo(values[0], values[1], values[2], values[3]);
          break;
        case 'Z':
          ctx.closePath();
          break;
      }
    }

    if (fill && fill !== 'none') {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke && stroke !== 'none') {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  }
}

/**
 * List all available icon names
 */
export function listAvailableIcons(): string[] {
  return listIcons();
}
