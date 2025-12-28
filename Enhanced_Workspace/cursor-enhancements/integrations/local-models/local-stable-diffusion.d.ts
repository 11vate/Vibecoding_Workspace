/**
 * Local Stable Diffusion Integration
 *
 * Local Stable Diffusion client for ComfyUI, Automatic1111, or Fooocus.
 * Completely free, no API keys required.
 */
import type { GeneratedAsset, ImageGenerationParams, SpriteGenerationParams } from '../../layer-36-multimodal-core';
import { type RetryOptions } from '../../utils/retry';
import { type RateLimiter } from '../../utils/rate-limiter';
/**
 * Local Stable Diffusion configuration
 */
export interface LocalStableDiffusionConfig {
    type: "comfyui" | "automatic1111" | "fooocus";
    baseUrl?: string;
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
 * Local Stable Diffusion Error
 */
export declare class LocalStableDiffusionError extends Error {
    statusCode?: number | undefined;
    details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, details?: unknown | undefined);
}
/**
 * Local Stable Diffusion Service
 */
export declare class LocalStableDiffusionService {
    private config;
    private baseUrl;
    constructor(config: LocalStableDiffusionConfig);
    /**
     * Get default base URL for SD type
     */
    private getDefaultBaseUrl;
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Report progress
     */
    private reportProgress;
    /**
     * Check if service is available
     */
    checkAvailability(): Promise<boolean>;
    /**
     * Generate image using ComfyUI
     */
    private generateWithComfyUI;
    /**
     * Generate image using Automatic1111
     */
    private generateWithAutomatic1111;
    /**
     * Generate image using Fooocus
     */
    private generateWithFooocus;
    /**
     * Generate image
     */
    generateImage(params: ImageGenerationParams): Promise<GeneratedAsset>;
    /**
     * Generate sprite with animation frames
     */
    generateSprite(params: SpriteGenerationParams): Promise<GeneratedAsset>;
    /**
     * Build optimized prompt
     */
    private buildPrompt;
    /**
     * Extract tags
     */
    private extractTags;
    /**
     * Generate unique ID
     */
    private generateId;
}
/**
 * Create local Stable Diffusion service
 */
export declare function createLocalStableDiffusionService(config: LocalStableDiffusionConfig): LocalStableDiffusionService;
//# sourceMappingURL=local-stable-diffusion.d.ts.map