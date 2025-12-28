/**
 * Ollama Vision Integration
 *
 * Vision model wrapper using Ollama's vision models (Llava, Bakllava).
 * Completely free, no API keys required.
 */
import { type OllamaConfig } from './ollama-client';
import type { ImageAnalysis, SpriteSheetAnalysis } from '../../layer-36-multimodal-core';
/**
 * Ollama Vision configuration
 */
export interface OllamaVisionConfig extends OllamaConfig {
    visionModel?: string;
    enableImageAnalysis?: boolean;
}
/**
 * Ollama Vision Service
 */
export declare class OllamaVisionService {
    private client;
    private config;
    constructor(config?: OllamaVisionConfig);
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Convert image buffer to base64
     */
    private imageToBase64;
    /**
     * Analyze image using vision model
     */
    analyzeImage(image: Buffer | string, prompt: string): Promise<ImageAnalysis>;
    /**
     * Analyze sprite sheet specifically
     */
    analyzeSpriteSheet(image: Buffer, prompt?: string): Promise<SpriteSheetAnalysis>;
    /**
     * Parse text-based analysis (fallback)
     */
    private parseTextAnalysis;
    /**
     * Detect art style from text
     */
    private detectStyle;
    /**
     * Convert image analysis to sprite sheet analysis
     */
    private convertToSpriteSheetAnalysis;
    /**
     * Parse frame range string
     */
    private parseFrameRange;
}
/**
 * Create Ollama Vision service
 */
export declare function createOllamaVisionService(config?: OllamaVisionConfig): OllamaVisionService;
//# sourceMappingURL=ollama-vision.d.ts.map