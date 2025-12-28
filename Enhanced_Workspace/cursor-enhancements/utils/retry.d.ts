/**
 * Retry utility with exponential backoff
 */
export interface RetryOptions {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    retryableErrors?: (error: unknown) => boolean;
}
export interface RetryResult<T> {
    success: boolean;
    result?: T;
    error?: unknown;
    attempts: number;
}
/**
 * Retry a function with exponential backoff
 */
export declare function retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<RetryResult<T>>;
/**
 * Retry with custom delay function
 */
export declare function retryWithCustomDelay<T>(fn: () => Promise<T>, getDelay: (attempt: number, error: unknown) => number, maxAttempts?: number): Promise<RetryResult<T>>;
//# sourceMappingURL=retry.d.ts.map