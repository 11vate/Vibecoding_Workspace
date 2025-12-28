/**
 * Retry utility with exponential backoff
 */
/**
 * Default retry options
 */
const DEFAULT_OPTIONS = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2
};
/**
 * Check if error is retryable
 */
function isRetryableError(error, retryableErrors) {
    if (retryableErrors) {
        return retryableErrors(error);
    }
    // Default: retry on network errors and 5xx status codes
    if (error instanceof Error) {
        if (error.message.includes('ECONNRESET') ||
            error.message.includes('ETIMEDOUT') ||
            error.message.includes('network')) {
            return true;
        }
    }
    // Check for HTTP errors
    if (typeof error === 'object' && error !== null) {
        const httpError = error;
        const status = httpError.status || httpError.statusCode;
        if (status && status >= 500 && status < 600) {
            return true;
        }
        if (status === 429) { // Rate limit
            return true;
        }
    }
    return false;
}
/**
 * Calculate delay for retry attempt
 */
function calculateDelay(attempt, options) {
    const delay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt - 1);
    return Math.min(delay, options.maxDelay);
}
/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Retry a function with exponential backoff
 */
export async function retry(fn, options = {}) {
    const opts = {
        ...DEFAULT_OPTIONS,
        ...options
    };
    let lastError;
    let attempts = 0;
    for (attempts = 1; attempts <= opts.maxAttempts; attempts++) {
        try {
            const result = await fn();
            return {
                success: true,
                result,
                attempts
            };
        }
        catch (error) {
            lastError = error;
            // Don't retry if error is not retryable
            if (!isRetryableError(error, options.retryableErrors)) {
                return {
                    success: false,
                    error,
                    attempts
                };
            }
            // Don't sleep after last attempt
            if (attempts < opts.maxAttempts) {
                const delay = calculateDelay(attempts, opts);
                await sleep(delay);
            }
        }
    }
    return {
        success: false,
        error: lastError,
        attempts
    };
}
/**
 * Retry with custom delay function
 */
export async function retryWithCustomDelay(fn, getDelay, maxAttempts = 3) {
    let lastError;
    let attempts = 0;
    for (attempts = 1; attempts <= maxAttempts; attempts++) {
        try {
            const result = await fn();
            return {
                success: true,
                result,
                attempts
            };
        }
        catch (error) {
            lastError = error;
            if (attempts < maxAttempts) {
                const delay = getDelay(attempts, error);
                await sleep(delay);
            }
        }
    }
    return {
        success: false,
        error: lastError,
        attempts
    };
}
//# sourceMappingURL=retry.js.map