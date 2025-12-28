/**
 * Geometric Primitives - Basic shape drawing functions
 *
 * Purpose: Provides fundamental geometric shapes for procedural generation
 * Authority: Tier 2 (Mandatory for geometric generation)
 */

import { CanvasRenderingContext2D } from 'canvas';
import { Point, roundRect } from './canvas-renderer';

export interface CircleParams {
  x: number;
  y: number;
  radius: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface RectangleParams {
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export interface PolygonParams {
  center: Point;
  radius: number;
  sides: number;
  rotation?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface StarParams {
  center: Point;
  outerRadius: number;
  innerRadius: number;
  points: number;
  rotation?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface LineParams {
  from: Point;
  to: Point;
  color: string;
  width?: number;
  lineCap?: CanvasLineCap;
}

/**
 * Draw a circle
 */
export function drawCircle(ctx: CanvasRenderingContext2D, params: CircleParams): void {
  ctx.beginPath();
  ctx.arc(params.x, params.y, params.radius, 0, Math.PI * 2);

  if (params.fillColor) {
    ctx.fillStyle = params.fillColor;
    ctx.fill();
  }

  if (params.strokeColor && params.strokeWidth) {
    ctx.strokeStyle = params.strokeColor;
    ctx.lineWidth = params.strokeWidth;
    ctx.stroke();
  }
}

/**
 * Draw a rectangle (with optional rounded corners)
 */
export function drawRectangle(ctx: CanvasRenderingContext2D, params: RectangleParams): void {
  if (params.borderRadius) {
    roundRect(ctx, params.x, params.y, params.width, params.height, params.borderRadius);

    if (params.fillColor) {
      ctx.fillStyle = params.fillColor;
      ctx.fill();
    }

    if (params.strokeColor && params.strokeWidth) {
      ctx.strokeStyle = params.strokeColor;
      ctx.lineWidth = params.strokeWidth;
      ctx.stroke();
    }
  } else {
    if (params.fillColor) {
      ctx.fillStyle = params.fillColor;
      ctx.fillRect(params.x, params.y, params.width, params.height);
    }

    if (params.strokeColor && params.strokeWidth) {
      ctx.strokeStyle = params.strokeColor;
      ctx.lineWidth = params.strokeWidth;
      ctx.strokeRect(params.x, params.y, params.width, params.height);
    }
  }
}

/**
 * Draw a regular polygon
 */
export function drawPolygon(ctx: CanvasRenderingContext2D, params: PolygonParams): void {
  const angle = (Math.PI * 2) / params.sides;
  const rotation = params.rotation || 0;

  ctx.beginPath();

  for (let i = 0; i < params.sides; i++) {
    const currentAngle = angle * i + rotation;
    const x = params.center.x + params.radius * Math.cos(currentAngle);
    const y = params.center.y + params.radius * Math.sin(currentAngle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();

  if (params.fillColor) {
    ctx.fillStyle = params.fillColor;
    ctx.fill();
  }

  if (params.strokeColor && params.strokeWidth) {
    ctx.strokeStyle = params.strokeColor;
    ctx.lineWidth = params.strokeWidth;
    ctx.stroke();
  }
}

/**
 * Draw a star
 */
export function drawStar(ctx: CanvasRenderingContext2D, params: StarParams): void {
  const angle = Math.PI / params.points;
  const rotation = params.rotation || 0;

  ctx.beginPath();

  for (let i = 0; i < params.points * 2; i++) {
    const radius = i % 2 === 0 ? params.outerRadius : params.innerRadius;
    const currentAngle = angle * i + rotation;
    const x = params.center.x + radius * Math.cos(currentAngle);
    const y = params.center.y + radius * Math.sin(currentAngle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();

  if (params.fillColor) {
    ctx.fillStyle = params.fillColor;
    ctx.fill();
  }

  if (params.strokeColor && params.strokeWidth) {
    ctx.strokeStyle = params.strokeColor;
    ctx.lineWidth = params.strokeWidth;
    ctx.stroke();
  }
}

/**
 * Draw a line
 */
export function drawLine(ctx: CanvasRenderingContext2D, params: LineParams): void {
  ctx.strokeStyle = params.color;
  ctx.lineWidth = params.width || 1;
  ctx.lineCap = params.lineCap || 'round';

  ctx.beginPath();
  ctx.moveTo(params.from.x, params.from.y);
  ctx.lineTo(params.to.x, params.to.y);
  ctx.stroke();
}

/**
 * Draw an ellipse
 */
export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  fillColor?: string,
  strokeColor?: string,
  strokeWidth?: number
): void {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  if (strokeColor && strokeWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

/**
 * Draw a triangle
 */
export function drawTriangle(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  p3: Point,
  fillColor?: string,
  strokeColor?: string,
  strokeWidth?: number
): void {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  if (strokeColor && strokeWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

/**
 * Draw a bezier curve
 */
export function drawBezierCurve(
  ctx: CanvasRenderingContext2D,
  start: Point,
  control1: Point,
  control2: Point,
  end: Point,
  color: string,
  width?: number
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 1;

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);
  ctx.stroke();
}

/**
 * Draw an arc
 */
export function drawArc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  color: string,
  width?: number
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 1;

  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.stroke();
}

/**
 * Draw a grid
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
  color: string = '#cccccc',
  lineWidth: number = 1
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  // Vertical lines
  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

/**
 * Draw a path from an array of points
 */
export function drawPath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  closed: boolean = false,
  fillColor?: string,
  strokeColor?: string,
  strokeWidth?: number
): void {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  if (closed) {
    ctx.closePath();
  }

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  if (strokeColor && strokeWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

/**
 * Draw a speech bubble
 */
export function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  tailPosition: 'bottom-left' | 'bottom-center' | 'bottom-right',
  fillColor: string = '#ffffff',
  strokeColor: string = '#000000',
  strokeWidth: number = 2
): void {
  const radius = 10;
  const tailHeight = 15;
  const tailWidth = 20;

  ctx.beginPath();

  // Top left corner
  ctx.moveTo(x + radius, y);

  // Top edge
  ctx.lineTo(x + width - radius, y);

  // Top right corner
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

  // Right edge
  ctx.lineTo(x + width, y + height - radius);

  // Bottom right corner
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

  // Bottom edge with tail
  if (tailPosition === 'bottom-right') {
    ctx.lineTo(x + width - 30, y + height);
    ctx.lineTo(x + width - 40, y + height + tailHeight);
    ctx.lineTo(x + width - 50, y + height);
  }

  if (tailPosition === 'bottom-center') {
    ctx.lineTo(x + width / 2 + tailWidth / 2, y + height);
    ctx.lineTo(x + width / 2, y + height + tailHeight);
    ctx.lineTo(x + width / 2 - tailWidth / 2, y + height);
  }

  ctx.lineTo(x + radius, y + height);

  if (tailPosition === 'bottom-left') {
    ctx.lineTo(x + 50, y + height);
    ctx.lineTo(x + 40, y + height + tailHeight);
    ctx.lineTo(x + 30, y + height);
  }

  // Bottom left corner
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

  // Left edge
  ctx.lineTo(x, y + radius);

  // Top left corner complete
  ctx.quadraticCurveTo(x, y, x + radius, y);

  ctx.closePath();

  // Fill and stroke
  ctx.fillStyle = fillColor;
  ctx.fill();

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}
