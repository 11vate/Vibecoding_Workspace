/**
 * Application Entry Point
 * 
 * Initializes the application and starts the core loop.
 */

import { CoreLoop } from './core/loop';

/**
 * Initialize and start the application
 */
function init(): void {
  // Initialize systems
  // Load assets
  // Setup UI
  // Start core loop

  const loop = new CoreLoop();
  loop.start();
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


