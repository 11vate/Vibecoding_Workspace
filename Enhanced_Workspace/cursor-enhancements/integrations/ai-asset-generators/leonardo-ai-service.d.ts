/**
 * Leonardo AI Service Integration
 *
 * Integration with Leonardo AI API for asset generation.
 */
import type { GeneratedAsset, ImageGenerationParams, SpriteGenerationParams } from '../../layer-36-multimodal-core';
import { type RetryOptions } from '../../utils/retry';
import { type RateLimiter } from '../../utils/rate-limiter';
/**
 * Leonardo AI configuration
 */
export interface LeonardoAIConfig {
    apiKey: string;
    baseUrl?: string;
    retryOptions?: RetryOptions;
    rateLimiter?: RateLimiter;
    enableLogging?: boolean;
    maxWaitTime?: number;
    pollInterval?: number;
}
/**
 * Leonardo AI Error
 */
export declare class LeonardoAIError extends Error {
    statusCode?: number | undefined;
    details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, details?: unknown | undefined);
}
/**
 * Leonardo AI generation parameters
 */
export interface LeonardoAIParams {
    prompt: string;
    negative_prompt?: string;
    width: number;
    height: number;
    num_images?: number;
    guidance_scale?: number;
    seed?: number;
    modelId?: string;
}
/**
 * Leonardo AI Service
 */
export declare class LeonardoAIService {
    private config;
    private defaultBaseUrl;
    private defaultRateLimiter;
    constructor(config: LeonardoAIConfig);
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Validate generation parameters
     */
    private validateParams;
    /**
     * Submit generation job
     */
    private submitGeneration;
    /**
     * Generate image
     */
    generateImage(params: ImageGenerationParams): Promise<GeneratedAsset>;
    /**
     * Generate sprite
     */
    generateSprite(params: SpriteGenerationParams): Promise<GeneratedAsset>;
    /**
     * Build optimized prompt
     */
    private buildPrompt;
    /**
     * Get model ID based on style
     */
    private getModelId;
    /**
     * Get default negative prompt
     */
    private getDefaultNegativePrompt;
    /**
     * Wait for generation to complete
     */
    private waitForGeneration;
    /**
     * Generate unique ID
     */
    private generateId;
}
/**
 * Create Leonardo AI service instance
 */
export declare function createLeonardoAIService(config: LeonardoAIConfig): LeonardoAIService;
//# sourceMappingURL=leonardo-ai-service.d.ts.map