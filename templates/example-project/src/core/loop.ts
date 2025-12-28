/**
 * Core Loop
 * 
 * The heart of the application - handles the main game/app loop.
 * 
 * Core Loop Structure:
 * 1. Input - Handle user input
 * 2. State Update - Update game/app state
 * 3. Side Effects - Handle side effects (saves, network, etc.)
 * 4. Render - Render the current state
 * 
 * This demonstrates the canonical core loop pattern.
 */

export class CoreLoop {
  private running: boolean = false;
  private lastTime: number = 0;
  private frameCount: number = 0;

  /**
   * Start the core loop
   */
  start(): void {
    this.running = true;
    this.lastTime = performance.now();
    console.log('🔄 Core loop started');
    this.loop();
  }

  /**
   * Stop the core loop
   */
  stop(): void {
    this.running = false;
    console.log('⏹️ Core loop stopped');
  }

  /**
   * Main loop iteration
   */
  private loop(): void {
    if (!this.running) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // 1. Input
    this.handleInput();

    // 2. State Update
    this.updateState(deltaTime);

    // 3. Side Effects
    this.handleSideEffects();

    // 4. Render
    this.render();

    // Continue loop
    requestAnimationFrame(() => this.loop());
  }

  /**
   * Handle user input
   */
  private handleInput(): void {
    // Input handling would go here
    // For this example, we're just demonstrating the structure
  }

  /**
   * Update game/app state
   */
  private updateState(deltaTime: number): void {
    // State updates would go here
    // For this example, we're just demonstrating the structure
    
    // Log every 60 frames (approximately once per second at 60fps)
    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      console.log(`📊 Core loop running (${Math.round(1000 / deltaTime)} fps)`);
    }
  }

  /**
   * Handle side effects (saves, network, etc.)
   */
  private handleSideEffects(): void {
    // Side effects would go here
    // For this example, we're just demonstrating the structure
  }

  /**
   * Render the current state
   */
  private render(): void {
    // Rendering would go here
    // For this example, we're just demonstrating the structure
  }
}


