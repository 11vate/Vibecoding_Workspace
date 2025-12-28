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
export declare class RateLimiter {
    private requests;
    private maxRequests;
    private windowMs;
    constructor(options: RateLimiterOptions);
    /**
     * Check if request is allowed
     */
    isAllowed(): boolean;
    /**
     * Wait until request is allowed
     */
    waitUntilAllowed(): Promise<void>;
    /**
     * Get time until next request is allowed
     */
    getTimeUntilNextRequest(): number;
    /**
     * Reset the rate limiter
     */
    reset(): void;
    /**
     * Get current request count
     */
    getCurrentCount(): number;
}
/**
 * Create a rate limiter instance
 */
export declare function createRateLimiter(options: RateLimiterOptions): RateLimiter;
//# sourceMappingURL=rate-limiter.d.ts.map