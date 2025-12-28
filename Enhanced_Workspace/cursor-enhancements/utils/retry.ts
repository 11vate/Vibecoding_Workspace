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
 * Default retry options
 */
const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'retryableErrors'>> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2
};

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown, retryableErrors?: (error: unknown) => boolean): boolean {
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
    const httpError = error as { status?: number; statusCode?: number };
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
function calculateDelay(attempt: number, options: Required<Omit<RetryOptions, 'retryableErrors'>>): number {
  const delay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt - 1);
  return Math.min(delay, options.maxDelay);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  let lastError: unknown;
  let attempts = 0;

  for (attempts = 1; attempts <= opts.maxAttempts; attempts++) {
    try {
      const result = await fn();
      return {
        success: true,
        result,
        attempts
      };
    } catch (error) {
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
export async function retryWithCustomDelay<T>(
  fn: () => Promise<T>,
  getDelay: (attempt: number, error: unknown) => number,
  maxAttempts: number = 3
): Promise<RetryResult<T>> {
  let lastError: unknown;
  let attempts = 0;

  for (attempts = 1; attempts <= maxAttempts; attempts++) {
    try {
      const result = await fn();
      return {
        success: true,
        result,
        attempts
      };
    } catch (error) {
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









