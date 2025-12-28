/**
 * Stable Diffusion Integration
 *
 * Integration with Stable Diffusion API for image generation.
 */
import type { GeneratedAsset, ImageGenerationParams, SpriteGenerationParams } from '../../layer-36-multimodal-core';
import { type RetryOptions } from '../../utils/retry';
import { type RateLimiter } from '../../utils/rate-limiter';
/**
 * Stable Diffusion API configuration
 */
export interface StableDiffusionConfig {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    defaultParams?: Partial<StableDiffusionParams>;
    retryOptions?: RetryOptions;
    rateLimiter?: RateLimiter;
    enableLogging?: boolean;
    onProgress?: (progress: GenerationProgress) => void;
}
/**
 * Generation progress
 */
export interface GenerationProgress {
    stage: "submitting" | "processing" | "completed" | "failed";
    progress?: number;
    message?: string;
}
/**
 * Stable Diffusion generation parameters
 */
export interface StableDiffusionParams {
    prompt: string;
    negative_prompt?: string;
    width: number;
    height: number;
    num_inference_steps?: number;
    guidance_scale?: number;
    seed?: number;
    num_outputs?: number;
}
/**
 * Stable Diffusion API Error
 */
export declare class StableDiffusionError extends Error {
    statusCode?: number | undefined;
    code?: string | undefined;
    details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, code?: string | undefined, details?: unknown | undefined);
}
/**
 * Stable Diffusion Service
 */
export declare class StableDiffusionService {
    private config;
    private defaultBaseUrl;
    private defaultRateLimiter;
    constructor(config: StableDiffusionConfig);
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Report progress
     */
    private reportProgress;
    /**
     * Validate generation parameters
     */
    private validateParams;
    /**
     * Make API request with retry and rate limiting
     */
    private makeRequest;
    /**
     * Generate image from text prompt
     */
    generateImage(params: ImageGenerationParams): Promise<GeneratedAsset>;
    /**
     * Generate sprite with animation frames
     */
    generateSprite(params: SpriteGenerationParams): Promise<GeneratedAsset>;
    /**
     * Build optimized prompt for Stable Diffusion
     */
    private buildPrompt;
    /**
     * Get default negative prompt
     */
    private getDefaultNegativePrompt;
    /**
     * Extract tags from generation parameters
     */
    private extractTags;
    /**
     * Generate unique ID
     */
    private generateId;
}
/**
 * Create Stable Diffusion service instance
 */
export declare function createStableDiffusionService(config: StableDiffusionConfig): StableDiffusionService;
//# sourceMappingURL=stable-diffusion.d.ts.map