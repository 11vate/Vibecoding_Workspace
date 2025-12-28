/**
 * Sprite Sage Service Integration
 *
 * Integration with Sprite Sage API for sprite generation.
 */
import type { GeneratedAsset, SpriteGenerationParams } from '../../layer-36-multimodal-core';
import { type RetryOptions } from '../../utils/retry';
import { type RateLimiter } from '../../utils/rate-limiter';
/**
 * Sprite Sage configuration
 */
export interface SpriteSageConfig {
    apiKey: string;
    baseUrl?: string;
    retryOptions?: RetryOptions;
    rateLimiter?: RateLimiter;
    enableLogging?: boolean;
}
/**
 * Sprite Sage Error
 */
export declare class SpriteSageError extends Error {
    statusCode?: number | undefined;
    details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, details?: unknown | undefined);
}
/**
 * Sprite Sage Service
 */
export declare class SpriteSageService {
    private config;
    private defaultBaseUrl;
    private defaultRateLimiter;
    constructor(config: SpriteSageConfig);
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Validate parameters
     */
    private validateParams;
    /**
     * Generate sprite
     */
    generateSprite(params: SpriteGenerationParams): Promise<GeneratedAsset>;
    /**
     * Generate unique ID
     */
    private generateId;
}
/**
 * Create Sprite Sage service instance
 */
export declare function createSpriteSageService(config: SpriteSageConfig): SpriteSageService;
//# sourceMappingURL=sprite-sage-service.d.ts.map