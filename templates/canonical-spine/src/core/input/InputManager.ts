/**
 * Input Manager
 *
 * Purpose: Centralized input handling for keyboard, mouse, and touch
 * Authority: Tier 1 (Core system)
 */

export interface InputEvent {
  type: string;
  key?: string;
  x?: number;
  y?: number;
  button?: number;
  touches?: Array<{ id: number; x: number; y: number }>;
  touchId?: number;
}

export class InputManager {
  private eventQueue: InputEvent[] = [];
  private keyStates: Record<string, boolean> = {};
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtons: Record<number, boolean> = {};
  private touches: Map<number, { x: number; y: number }> = new Map();

  private boundHandlers: Map<string, EventListener> = new Map();

  /**
   * Initialize input listeners
   */
  initialize(): void {
    // Keyboard events
    this.addListener('keydown', this.handleKeyDown.bind(this));
    this.addListener('keyup', this.handleKeyUp.bind(this));

    // Mouse events
    this.addListener('mousemove', this.handleMouseMove.bind(this));
    this.addListener('mousedown', this.handleMouseDown.bind(this));
    this.addListener('mouseup', this.handleMouseUp.bind(this));

    // Touch events
    this.addListener('touchstart', this.handleTouchStart.bind(this));
    this.addListener('touchmove', this.handleTouchMove.bind(this));
    this.addListener('touchend', this.handleTouchEnd.bind(this));
    this.addListener('touchcancel', this.handleTouchCancel.bind(this));

    // Prevent context menu on right click
    this.addListener('contextmenu', (e: Event) => e.preventDefault());

    console.log('Input manager initialized');
  }

  /**
   * Cleanup input listeners
   */
  cleanup(): void {
    for (const [eventType, handler] of this.boundHandlers.entries()) {
      window.removeEventListener(eventType, handler);
    }
    this.boundHandlers.clear();
    this.eventQueue = [];

    console.log('Input manager cleaned up');
  }

  /**
   * Poll all pending input events
   */
  pollEvents(): InputEvent[] {
    const events = [...this.eventQueue];
    this.eventQueue = [];
    return events;
  }

  /**
   * Check if key is currently pressed
   */
  isKeyPressed(key: string): boolean {
    return this.keyStates[key] || false;
  }

  /**
   * Get mouse position
   */
  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  /**
   * Check if mouse button is pressed
   */
  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons[button] || false;
  }

  /**
   * Get all active touches
   */
  getTouches(): Array<{ id: number; x: number; y: number }> {
    return Array.from(this.touches.entries()).map(([id, pos]) => ({
      id,
      ...pos
    }));
  }

  /**
   * Add event listener helper
   */
  private addListener(eventType: string, handler: EventListener): void {
    window.addEventListener(eventType, handler);
    this.boundHandlers.set(eventType, handler);
  }

  /**
   * Handle keydown event
   */
  private handleKeyDown(event: Event): void {
    const e = event as KeyboardEvent;
    e.preventDefault();

    if (!this.keyStates[e.key]) {
      this.keyStates[e.key] = true;

      this.eventQueue.push({
        type: 'keydown',
        key: e.key
      });
    }
  }

  /**
   * Handle keyup event
   */
  private handleKeyUp(event: Event): void {
    const e = event as KeyboardEvent;
    e.preventDefault();

    this.keyStates[e.key] = false;

    this.eventQueue.push({
      type: 'keyup',
      key: e.key
    });
  }

  /**
   * Handle mousemove event
   */
  private handleMouseMove(event: Event): void {
    const e = event as MouseEvent;

    this.mousePosition.x = e.clientX;
    this.mousePosition.y = e.clientY;

    this.eventQueue.push({
      type: 'mousemove',
      x: e.clientX,
      y: e.clientY
    });
  }

  /**
   * Handle mousedown event
   */
  private handleMouseDown(event: Event): void {
    const e = event as MouseEvent;
    e.preventDefault();

    this.mouseButtons[e.button] = true;

    this.eventQueue.push({
      type: 'mousedown',
      x: e.clientX,
      y: e.clientY,
      button: e.button
    });
  }

  /**
   * Handle mouseup event
   */
  private handleMouseUp(event: Event): void {
    const e = event as MouseEvent;
    e.preventDefault();

    this.mouseButtons[e.button] = false;

    this.eventQueue.push({
      type: 'mouseup',
      x: e.clientX,
      y: e.clientY,
      button: e.button
    });
  }

  /**
   * Handle touchstart event
   */
  private handleTouchStart(event: Event): void {
    const e = event as TouchEvent;
    e.preventDefault();

    const touches: Array<{ id: number; x: number; y: number }> = [];

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      this.touches.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY
      });

      touches.push({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
      });
    }

    this.eventQueue.push({
      type: 'touchstart',
      touches
    });
  }

  /**
   * Handle touchmove event
   */
  private handleTouchMove(event: Event): void {
    const e = event as TouchEvent;
    e.preventDefault();

    const touches: Array<{ id: number; x: number; y: number }> = [];

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      this.touches.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY
      });

      touches.push({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
      });
    }

    this.eventQueue.push({
      type: 'touchmove',
      touches
    });
  }

  /**
   * Handle touchend event
   */
  private handleTouchEnd(event: Event): void {
    const e = event as TouchEvent;
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      this.touches.delete(touch.identifier);

      this.eventQueue.push({
        type: 'touchend',
        touchId: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }

  /**
   * Handle touchcancel event
   */
  private handleTouchCancel(event: Event): void {
    const e = event as TouchEvent;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      this.touches.delete(touch.identifier);
    }

    // Clear all touches on cancel
    this.touches.clear();
  }
}
