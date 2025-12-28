/**
 * Rate limiter utility
 */

export interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

/**
 * Rate limiter class
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(): boolean {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    
    // Check if we're at the limit
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    this.requests.push(now);
    return true;
  }

  /**
   * Wait until request is allowed
   */
  async waitUntilAllowed(): Promise<void> {
    while (!this.isAllowed()) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (Date.now() - oldestRequest) + 100; // Add 100ms buffer
      await new Promise(resolve => setTimeout(resolve, Math.max(0, waitTime)));
    }
  }

  /**
   * Get time until next request is allowed
   */
  getTimeUntilNextRequest(): number {
    if (this.isAllowed()) {
      return 0;
    }

    const oldestRequest = this.requests[0];
    const waitTime = this.windowMs - (Date.now() - oldestRequest) + 100;
    return Math.max(0, waitTime);
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.requests = [];
  }

  /**
   * Get current request count
   */
  getCurrentCount(): number {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    return this.requests.length;
  }
}

/**
 * Create a rate limiter instance
 */
export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  return new RateLimiter(options);
}









