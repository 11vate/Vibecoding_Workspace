/**
 * Rate limiter utility
 */
/**
 * Rate limiter class
 */
export class RateLimiter {
    requests = [];
    maxRequests;
    windowMs;
    constructor(options) {
        this.maxRequests = options.maxRequests;
        this.windowMs = options.windowMs;
    }
    /**
     * Check if request is allowed
     */
    isAllowed() {
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
    async waitUntilAllowed() {
        while (!this.isAllowed()) {
            const oldestRequest = this.requests[0];
            const waitTime = this.windowMs - (Date.now() - oldestRequest) + 100; // Add 100ms buffer
            await new Promise(resolve => setTimeout(resolve, Math.max(0, waitTime)));
        }
    }
    /**
     * Get time until next request is allowed
     */
    getTimeUntilNextRequest() {
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
    reset() {
        this.requests = [];
    }
    /**
     * Get current request count
     */
    getCurrentCount() {
        const now = Date.now();
        this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
        return this.requests.length;
    }
}
/**
 * Create a rate limiter instance
 */
export function createRateLimiter(options) {
    return new RateLimiter(options);
}
//# sourceMappingURL=rate-limiter.js.map