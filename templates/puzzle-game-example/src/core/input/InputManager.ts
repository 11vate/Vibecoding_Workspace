/**
 * Input Manager - Puzzle Game Version
 *
 * Purpose: Handle user input
 * Authority: Tier 2 (Core subsystem)
 */

import { InputEvent } from '../state/store';

export class InputManager {
  private eventQueue: InputEvent[] = [];
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    this.eventQueue.push({
      type: 'keydown',
      key: e.key,
      timestamp: performance.now()
    });
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.eventQueue.push({
      type: 'keyup',
      key: e.key,
      timestamp: performance.now()
    });
  }

  private handleMouseDown(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.eventQueue.push({
      type: 'mousedown',
      button: e.button,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: performance.now()
    });
  }

  private handleMouseUp(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.eventQueue.push({
      type: 'mouseup',
      button: e.button,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: performance.now()
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.eventQueue.push({
      type: 'mousemove',
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: performance.now()
    });
  }

  private handleClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.eventQueue.push({
      type: 'click',
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: performance.now()
    });
  }

  pollEvents(): InputEvent[] {
    const events = [...this.eventQueue];
    this.eventQueue = [];
    return events;
  }
}
