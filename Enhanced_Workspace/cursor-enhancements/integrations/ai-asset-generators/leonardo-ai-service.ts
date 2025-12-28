/**
 * Leonardo AI Service Integration
 * 
 * Integration with Leonardo AI API for asset generation.
 */

import type { GeneratedAsset, ImageGenerationParams, SpriteGenerationParams } from '../../layer-36-multimodal-core';
import { retry, type RetryOptions } from '../../utils/retry';
import { createRateLimiter, type RateLimiter } from '../../utils/rate-limiter';
import { validateDimensions } from '../../utils/validation';
import { z } from 'zod';

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
export class LeonardoAIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'LeonardoAIError';
  }
}

/**
 * Generation status response schema
 */
const GenerationStatusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETE", "FAILED"]),
  generations: z.array(z.object({
    url: z.string(),
    id: z.string()
  })).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  error: z.string().optional()
});

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
export class LeonardoAIService {
  private config: Required<Omit<LeonardoAIConfig, 'retryOptions' | 'rateLimiter'>> & {
    retryOptions?: RetryOptions;
    rateLimiter?: RateLimiter;
  };
  private defaultBaseUrl = "https://cloud.leonardo.ai/api/rest/v1";
  private defaultRateLimiter: RateLimiter;

  constructor(config: LeonardoAIConfig) {
    this.config = {
      baseUrl: this.defaultBaseUrl,
      maxWaitTime: 120000, // 2 minutes
      pollInterval: 2000, // 2 seconds
      enableLogging: false,
      ...config
    };

    // Default rate limiter: 20 requests per minute
    this.defaultRateLimiter = config.rateLimiter || createRateLimiter({
      maxRequests: 20,
      windowMs: 60000
    });
  }

  /**
   * Log message if logging is enabled
   */
  private log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[LeonardoAI] ${message}`, data || '');
    }
  }

  /**
   * Validate generation parameters
   */
  private validateParams(params: ImageGenerationParams): void {
    const dimValidation = validateDimensions(
      params.resolution[0],
      params.resolution[1],
      64, // Min
      64, // Min
      2048, // Max
      2048 // Max
    );
    if (!dimValidation.valid) {
      throw new LeonardoAIError(dimValidation.error || 'Invalid dimensions');
    }

    if (params.prompt.length > 1000) {
      throw new LeonardoAIError('Prompt too long (max 1000 characters)');
    }
  }

  /**
   * Submit generation job
   */
  private async submitGeneration(leonardoParams: LeonardoAIParams): Promise<string> {
    await this.defaultRateLimiter.waitUntilAllowed();

    const retryOptions = this.config.retryOptions || {
      maxAttempts: 3,
      initialDelay: 1000
    };

    const result = await retry(async () => {
      this.log('Submitting generation job');

      const response = await fetch(`${this.config.baseUrl}/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leonardoParams)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new LeonardoAIError(
          errorData.message || `API error: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const data = await response.json() as { generationId?: string; sdGenerationJob?: { generationId?: string } };
      const generationId = data.generationId || data.sdGenerationJob?.generationId;

      if (!generationId) {
        throw new LeonardoAIError('No generationId in response');
      }

      return generationId;
    }, retryOptions);

    if (!result.success || !result.result) {
      throw result.error || new LeonardoAIError('Failed to submit generation after retries');
    }

    return result.result;
  }

  /**
   * Generate image
   */
  async generateImage(params: ImageGenerationParams): Promise<GeneratedAsset> {
    try {
      this.validateParams(params);

      const leonardoParams: LeonardoAIParams = {
        prompt: this.buildPrompt(params),
        negative_prompt: params.negativePrompt || this.getDefaultNegativePrompt(),
        width: params.resolution[0],
        height: params.resolution[1],
        num_images: 1,
        guidance_scale: 7.5,
        seed: params.seed,
        modelId: this.getModelId(params.style)
      };

      const generationId = await this.submitGeneration(leonardoParams);
      this.log('Generation job submitted', { generationId });

      // Poll for completion
      const result = await this.waitForGeneration(generationId);

      return result;
    } catch (error) {
      this.log('Image generation failed', error);
      if (error instanceof LeonardoAIError) {
        throw error;
      }
      throw new LeonardoAIError(
        `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }

  /**
   * Generate sprite
   */
  async generateSprite(params: SpriteGenerationParams): Promise<GeneratedAsset> {
    // Enhance prompt for sprite generation
    const enhancedParams: ImageGenerationParams = {
      ...params,
      prompt: `${params.prompt}, game sprite, ${params.entity}, ${params.theme} theme, pixel art style, transparent background`
    };

    return this.generateImage(enhancedParams);
  }

  /**
   * Build optimized prompt
   */
  private buildPrompt(params: ImageGenerationParams): string {
    let prompt = params.prompt;

    if (params.style === "pixel-art") {
      prompt += ", pixel art, 8-bit, retro game sprite, clean pixels";
    }

    if (params.palette && params.palette.length > 0) {
      prompt += `, color palette: ${params.palette.join(", ")}`;
    }

    prompt += ", high quality, detailed, game asset";

    return prompt;
  }

  /**
   * Get model ID based on style
   */
  private getModelId(style: string): string {
    // Leonardo AI model IDs - would need to be configured
    const models: Record<string, string> = {
      "pixel-art": "pixel-art-model-id",
      "hand-drawn": "hand-drawn-model-id",
      "vector": "vector-model-id",
      "realistic": "realistic-model-id"
    };

    return models[style] || models["realistic"];
  }

  /**
   * Get default negative prompt
   */
  private getDefaultNegativePrompt(): string {
    return "blurry, low quality, distorted, watermark, text, signature";
  }

  /**
   * Wait for generation to complete
   */
  private async waitForGeneration(generationId: string): Promise<GeneratedAsset> {
    const startTime = Date.now();
    const maxWait = this.config.maxWaitTime;
    const pollInterval = this.config.pollInterval;

    while (Date.now() - startTime < maxWait) {
      try {
        const statusResponse = await fetch(`${this.config.baseUrl}/generations/${generationId}`, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        });

        if (!statusResponse.ok) {
          throw new LeonardoAIError(
            `Failed to check generation status: ${statusResponse.statusText}`,
            statusResponse.status
          );
        }

        const statusData = await statusResponse.json() as unknown;
        const validation = GenerationStatusSchema.safeParse(statusData);

        if (!validation.success) {
          this.log('Invalid status response format', validation.error);
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          continue;
        }

        const status = validation.data;

        if (status.status === "COMPLETE" && status.generations && status.generations.length > 0) {
          const imageUrl = status.generations[0].url;
          
          // Download image with retry
          const imageResult = await retry(async () => {
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
              throw new LeonardoAIError(
                `Failed to download image: ${imageResponse.statusText}`,
                imageResponse.status
              );
            }
            return Buffer.from(await imageResponse.arrayBuffer());
          }, {
            maxAttempts: 3,
            initialDelay: 1000
          });

          if (!imageResult.success || !imageResult.result) {
            throw new LeonardoAIError('Failed to download generated image');
          }

          const imageBuffer = imageResult.result;

          return {
            type: "sprite",
            data: imageBuffer,
            metadata: {
              id: this.generateId(),
              name: `leonardo_${generationId}`,
              dimensions: {
                width: status.width || 512,
                height: status.height || 512
              },
              format: "png",
              palette: {
                dominant: [],
                all: [],
                count: 0,
                style: "unknown"
              },
              tags: ["leonardo-ai"],
              createdAt: new Date().toISOString()
            }
          };
        }

        if (status.status === "FAILED") {
          throw new LeonardoAIError(
            `Generation failed: ${status.error || "Unknown error"}`,
            undefined,
            status
          );
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        if (error instanceof LeonardoAIError && error.message.includes("Generation failed")) {
          throw error;
        }
        // Log but continue polling for transient errors
        this.log('Error checking generation status', error);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    throw new LeonardoAIError(
      `Generation timeout after ${maxWait}ms`,
      undefined,
      { generationId, elapsed: Date.now() - startTime }
    );
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `leonardo_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * Create Leonardo AI service instance
 */
export function createLeonardoAIService(config: LeonardoAIConfig): LeonardoAIService {
  return new LeonardoAIService(config);
}

