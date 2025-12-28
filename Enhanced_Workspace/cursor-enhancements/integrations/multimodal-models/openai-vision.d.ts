/**
 * OpenAI Vision Integration
 *
 * Integration with OpenAI GPT-4 Vision API for image understanding and analysis.
 */
import type { ImageAnalysis, SpriteSheetAnalysis } from '../../layer-36-multimodal-core';
import { type RetryOptions } from '../../utils/retry';
import { type RateLimiter } from '../../utils/rate-limiter';
/**
 * OpenAI Vision service configuration
 */
export interface OpenAIVisionConfig {
    apiKey: string;
    model?: "gpt-4-vision-preview" | "gpt-4o" | "gpt-4o-mini";
    maxTokens?: number;
    temperature?: number;
    retryOptions?: RetryOptions;
    rateLimiter?: RateLimiter;
    enableLogging?: boolean;
}
/**
 * Image analysis request
 */
export interface VisionAnalysisRequest {
    image: Buffer | string;
    prompt: string;
    detail?: "low" | "high" | "auto";
    responseFormat?: "json_object" | "text";
}
/**
 * OpenAI API Error
 */
export declare class OpenAIVisionError extends Error {
    statusCode?: number | undefined;
    code?: string | undefined;
    details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, code?: string | undefined, details?: unknown | undefined);
}
/**
 * OpenAI Vision Service
 */
export declare class OpenAIVisionService {
    private config;
    private baseUrl;
    private defaultRateLimiter;
    constructor(config: OpenAIVisionConfig);
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Convert image to base64 data URL
     */
    private prepareImageData;
    /**
     * Make API request with retry and rate limiting
     */
    private makeRequest;
    /**
     * Analyze image with vision model
     */
    analyzeImage(request: VisionAnalysisRequest): Promise<ImageAnalysis>;
    /**
     * Analyze sprite sheet specifically
     */
    analyzeSpriteSheet(image: Buffer, prompt?: string): Promise<SpriteSheetAnalysis>;
    /**
     * Parse analysis from OpenAI response
     */
    private parseAnalysis;
    /**
     * Parse text-based analysis (fallback)
     */
    private parseTextAnalysis;
    /**
     * Detect art style from text description
     */
    private detectStyle;
    /**
     * Convert image analysis to sprite sheet analysis
     */
    private convertToSpriteSheetAnalysis;
    /**
     * Parse frame range string (e.g., "1-4" or "1,2,3,4" or "1 2 3 4")
     */
    private parseFrameRange;
}
/**
 * Create OpenAI Vision service instance
 */
export declare function createOpenAIVisionService(config: OpenAIVisionConfig): OpenAIVisionService;
//# sourceMappingURL=openai-vision.d.ts.map