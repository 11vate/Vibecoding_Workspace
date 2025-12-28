/**
 * Stable Diffusion Integration
 * 
 * Integration with Stable Diffusion API for image generation.
 */

import type { GeneratedAsset, ImageGenerationParams, SpriteGenerationParams } from '../../layer-36-multimodal-core';
import { retry, type RetryOptions } from '../../utils/retry';
import { createRateLimiter, type RateLimiter } from '../../utils/rate-limiter';
import { validateDimensions, validateColorPalette } from '../../utils/validation';
import { z } from 'zod';

/**
 * Stable Diffusion API configuration
 */
export interface StableDiffusionConfig {
  apiKey?: string; // For hosted API
  baseUrl?: string; // For self-hosted or Replicate/Stability AI
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
  progress?: number; // 0-1
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
export class StableDiffusionError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StableDiffusionError';
  }
}

/**
 * API Response Schema
 */
const GenerationResponseSchema = z.object({
  artifacts: z.array(z.object({
    base64: z.string(),
    seed: z.number(),
    finishReason: z.string().optional()
  }))
});

/**
 * Stable Diffusion Service
 */
export class StableDiffusionService {
  private config: Required<Omit<StableDiffusionConfig, 'retryOptions' | 'rateLimiter' | 'onProgress'>> & {
    retryOptions?: RetryOptions;
    rateLimiter?: RateLimiter;
    onProgress?: (progress: GenerationProgress) => void;
  };
  private defaultBaseUrl = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
  private defaultRateLimiter: RateLimiter;

  constructor(config: StableDiffusionConfig) {
    // Load from environment if not provided
    const apiKey = config.apiKey || process.env.STABILITY_AI_API_KEY || "";
    
    // API key is now optional - will fallback to local SD if not provided
    if (!apiKey && process.env.USE_LOCAL_MODELS !== "false") {
      console.warn("Stability AI API key not provided. Will attempt to use local Stable Diffusion as fallback.");
    }

    this.config = {
      baseUrl: config.baseUrl || process.env.STABILITY_AI_BASE_URL || this.defaultBaseUrl,
      model: config.model || process.env.STABILITY_AI_MODEL || "stable-diffusion-xl-1024-v1-0",
      defaultParams: {
        num_inference_steps: parseInt(process.env.SD_INFERENCE_STEPS || "30"),
        guidance_scale: parseFloat(process.env.SD_GUIDANCE_SCALE || "7.5"),
        num_outputs: parseInt(process.env.SD_NUM_OUTPUTS || "1")
      },
      enableLogging: config.enableLogging || process.env.ENABLE_LOGGING === "true",
      apiKey,
      retryOptions: config.retryOptions,
      rateLimiter: config.rateLimiter,
      onProgress: config.onProgress
    };

    // Default rate limiter: 10 requests per minute for Stability AI
    this.defaultRateLimiter = config.rateLimiter || createRateLimiter({
      maxRequests: parseInt(process.env.STABILITY_AI_RATE_LIMIT || "10"),
      windowMs: 60000
    });
  }

  /**
   * Log message if logging is enabled
   */
  private log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[StableDiffusion] ${message}`, data || '');
    }
  }

  /**
   * Report progress
   */
  private reportProgress(progress: GenerationProgress): void {
    if (this.config.onProgress) {
      this.config.onProgress(progress);
    }
    this.log(progress.stage, progress.message);
  }

  /**
   * Validate generation parameters
   */
  private validateParams(params: ImageGenerationParams): void {
    // Validate dimensions
    const dimValidation = validateDimensions(
      params.resolution[0],
      params.resolution[1],
      16, // Min width
      16, // Min height
      2048, // Max width
      2048 // Max height
    );
    if (!dimValidation.valid) {
      throw new StableDiffusionError(dimValidation.error || 'Invalid dimensions');
    }

    // Validate palette if provided
    if ("palette" in params && params.palette && params.palette.length > 0) {
      const paletteValidation = validateColorPalette(params.palette, 16);
      if (!paletteValidation.valid) {
        throw new StableDiffusionError(paletteValidation.error || 'Invalid palette');
      }
    }

    // Validate prompt length
    if (params.prompt.length > 1000) {
      throw new StableDiffusionError('Prompt too long (max 1000 characters)');
    }
  }

  /**
   * Make API request with retry and rate limiting
   */
  private async makeRequest(payload: unknown): Promise<unknown> {
    // Wait for rate limiter
    await this.defaultRateLimiter.waitUntilAllowed();

    const retryOptions = this.config.retryOptions || {
      maxAttempts: 3,
      initialDelay: 2000,
      retryableErrors: (error: unknown) => {
        if (error instanceof StableDiffusionError) {
          return error.statusCode === 429 || 
                 (error.statusCode !== undefined && error.statusCode >= 500);
        }
        return false;
      }
    };

    const result = await retry(async () => {
      this.log('Making API request', { model: this.config.model });

      const response = await fetch(this.config.baseUrl!, {
        method: 'POST',
        headers: {
          'Authorization': this.config.apiKey ? `Bearer ${this.config.apiKey}` : '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new StableDiffusionError(
          errorData.message || `API error: ${response.statusText}`,
          response.status,
          errorData.name,
          errorData
        );
        throw error;
      }

      return await response.json();
    }, retryOptions);

    if (!result.success) {
      throw result.error || new StableDiffusionError('Request failed after retries');
    }

    return result.result;
  }

  /**
   * Generate image from text prompt
   */
  async generateImage(params: ImageGenerationParams): Promise<GeneratedAsset> {
    // If no API key, try local Stable Diffusion fallback
    if (!this.config.apiKey && process.env.USE_LOCAL_MODELS !== "false") {
      try {
        const { createLocalStableDiffusionService } = require('../local-models/local-stable-diffusion');
        const localSD = createLocalStableDiffusionService({
          type: (process.env.SD_TYPE || "comfyui") as "comfyui" | "automatic1111" | "fooocus",
          baseUrl: process.env.SD_BASE_URL,
          enableLogging: this.config.enableLogging,
          onProgress: this.config.onProgress
        });
        
        return await localSD.generateImage(params);
      } catch (error) {
        console.warn("Local Stable Diffusion fallback failed, attempting API call anyway:", error);
      }
    }

    if (!this.config.apiKey) {
      throw new StableDiffusionError(
        "Stability AI API key is required. Set STABILITY_AI_API_KEY or enable local models with USE_LOCAL_MODELS=true"
      );
    }

    try {
      this.validateParams(params);

      this.reportProgress({ stage: "submitting", message: "Submitting generation request" });

      const sdParams: StableDiffusionParams = {
        prompt: this.buildPrompt(params),
        negative_prompt: params.negativePrompt || this.getDefaultNegativePrompt(),
        width: params.resolution[0],
        height: params.resolution[1],
        num_inference_steps: 30,
        guidance_scale: 7.5,
        seed: params.seed,
        num_outputs: 1,
        ...this.config.defaultParams
      };

      this.reportProgress({ stage: "processing", message: "Generating image..." });

      const data = await this.makeRequest(sdParams) as unknown;

      // Validate response
      const validation = GenerationResponseSchema.safeParse(data);
      if (!validation.success) {
        throw new StableDiffusionError(
          'Invalid response format from API',
          undefined,
          undefined,
          validation.error
        );
      }

      const response = validation.data;

      if (!response.artifacts || response.artifacts.length === 0) {
        throw new StableDiffusionError('No images generated in response');
      }

      const artifact = response.artifacts[0];
      if (artifact.finishReason === 'CONTENT_FILTERED') {
        throw new StableDiffusionError('Content filtered by safety system');
      }

      const imageBuffer = Buffer.from(artifact.base64, 'base64');

      this.reportProgress({ stage: "completed", progress: 1.0, message: "Generation complete" });

      return {
        type: "sprite",
        data: imageBuffer,
        metadata: {
          id: this.generateId(),
          name: params.prompt.substring(0, 50),
          dimensions: {
            width: params.resolution[0],
            height: params.resolution[1]
          },
          format: "png",
          palette: {
            dominant: params.palette?.slice(0, 5) || [],
            all: params.palette || [],
            count: params.palette?.length || 0,
            style: params.style === "pixel-art" ? "pixel-art" : "unknown"
          },
          tags: this.extractTags(params),
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      this.reportProgress({ stage: "failed", message: error instanceof Error ? error.message : 'Unknown error' });
      this.log('Image generation failed', error);
      if (error instanceof StableDiffusionError) {
        throw error;
      }
      throw new StableDiffusionError(
        `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error
      );
    }
  }

  /**
   * Generate sprite with animation frames
   */
  async generateSprite(params: SpriteGenerationParams): Promise<GeneratedAsset> {
    try {
      // Validate frame count
      if (params.frameCount && (params.frameCount < 1 || params.frameCount > 32)) {
        throw new StableDiffusionError('Frame count must be between 1 and 32');
      }

      // Generate base sprite
      this.reportProgress({ stage: "submitting", message: "Generating base sprite" });
      const baseAsset = await this.generateImage(params);
      
      // If frameCount specified, generate animation frames
      if (params.frameCount && params.frameCount > 1) {
        this.reportProgress({ 
          stage: "processing", 
          message: `Generating ${params.frameCount} animation frames...`,
          progress: 0
        });

        // Generate variations for animation frames
        const frames: Buffer[] = [];
        const totalFrames = params.frameCount;
        
        for (let i = 0; i < totalFrames; i++) {
          this.reportProgress({
            stage: "processing",
            message: `Generating frame ${i + 1} of ${totalFrames}`,
            progress: (i + 1) / totalFrames
          });

          const frameParams: ImageGenerationParams = {
            ...params,
            prompt: `${params.prompt}, frame ${i + 1} of ${totalFrames}, animation sequence, consistent style`,
            seed: params.seed ? params.seed + i : undefined
          };
          
          const frameAsset = await this.generateImage(frameParams);
          frames.push(frameAsset.data as Buffer);
        }
        
        // Combine frames into sprite sheet metadata
        return {
          ...baseAsset,
          metadata: {
            ...baseAsset.metadata,
            frames: frames.map((_, i) => ({
              index: i,
              bounds: {
                x: 0,
                y: i * params.resolution[1],
                width: params.resolution[0],
                height: params.resolution[1]
              }
            }))
          }
        };
      }

      return baseAsset;
    } catch (error) {
      this.log('Sprite generation failed', error);
      if (error instanceof StableDiffusionError) {
        throw error;
      }
      throw new StableDiffusionError(
        `Failed to generate sprite: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error
      );
    }
  }

  /**
   * Build optimized prompt for Stable Diffusion
   */
  private buildPrompt(params: ImageGenerationParams | SpriteGenerationParams): string {
    let prompt = params.prompt;

    // Add style modifiers
    if (params.style === "pixel-art") {
      prompt += ", pixel art, 8-bit style, retro game sprite";
    } else if (params.style === "hand-drawn") {
      prompt += ", hand-drawn, sketch style";
    } else if (params.style === "vector") {
      prompt += ", vector art, clean lines";
    }

    // Add palette constraints if specified
    if ("palette" in params && params.palette && params.palette.length > 0) {
      prompt += `, color palette: ${params.palette.join(", ")}`;
    }

    // Add resolution hint
    prompt += `, ${params.resolution[0]}x${params.resolution[1]} pixels`;

    // Add game asset specific modifiers
    if ("entity" in params) {
      prompt += `, game asset, ${params.entity}, ${params.theme} theme`;
      if (params.viewAngle) {
        prompt += `, ${params.viewAngle} view`;
      }
    }

    // Add quality modifiers
    prompt += ", high quality, detailed, transparent background, game ready";

    return prompt;
  }

  /**
   * Get default negative prompt
   */
  private getDefaultNegativePrompt(): string {
    return "blurry, low quality, distorted, watermark, text, signature, bad anatomy, deformed";
  }

  /**
   * Extract tags from generation parameters
   */
  private extractTags(params: ImageGenerationParams | SpriteGenerationParams): string[] {
    const tags: string[] = [params.style];
    
    if ("entity" in params) {
      tags.push(params.entity, params.theme);
      if (params.viewAngle) {
        tags.push(params.viewAngle);
      }
    }

    return tags;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `asset_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * Create Stable Diffusion service instance
 */
export function createStableDiffusionService(config: StableDiffusionConfig): StableDiffusionService {
  return new StableDiffusionService(config);
}

