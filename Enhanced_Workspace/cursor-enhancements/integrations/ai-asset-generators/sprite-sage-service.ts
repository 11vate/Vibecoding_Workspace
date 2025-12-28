/**
 * Sprite Sage Service Integration
 * 
 * Integration with Sprite Sage API for sprite generation.
 */

import type { GeneratedAsset, SpriteGenerationParams } from '../../layer-36-multimodal-core';
import { retry, type RetryOptions } from '../../utils/retry';
import { createRateLimiter, type RateLimiter } from '../../utils/rate-limiter';
import { validateDimensions } from '../../utils/validation';

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
export class SpriteSageError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SpriteSageError';
  }
}

/**
 * Sprite Sage Service
 */
export class SpriteSageService {
  private config: Required<Omit<SpriteSageConfig, 'retryOptions' | 'rateLimiter'>> & {
    retryOptions?: RetryOptions;
    rateLimiter?: RateLimiter;
  };
  private defaultBaseUrl = "https://api.spritesage.ai/v1";
  private defaultRateLimiter: RateLimiter;

  constructor(config: SpriteSageConfig) {
    this.config = {
      baseUrl: this.defaultBaseUrl,
      enableLogging: false,
      ...config
    };

    // Default rate limiter: 15 requests per minute
    this.defaultRateLimiter = config.rateLimiter || createRateLimiter({
      maxRequests: 15,
      windowMs: 60000
    });
  }

  /**
   * Log message if logging is enabled
   */
  private log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[SpriteSage] ${message}`, data || '');
    }
  }

  /**
   * Validate parameters
   */
  private validateParams(params: SpriteGenerationParams): void {
    const dimValidation = validateDimensions(
      params.resolution[0],
      params.resolution[1],
      16,
      16,
      1024,
      1024
    );
    if (!dimValidation.valid) {
      throw new SpriteSageError(dimValidation.error || 'Invalid dimensions');
    }
  }

  /**
   * Generate sprite
   */
  async generateSprite(params: SpriteGenerationParams): Promise<GeneratedAsset> {
    try {
      this.validateParams(params);

      await this.defaultRateLimiter.waitUntilAllowed();

      const retryOptions = this.config.retryOptions || {
        maxAttempts: 3,
        initialDelay: 1000
      };

      const result = await retry(async () => {
        this.log('Generating sprite', { entity: params.entity, theme: params.theme });

        // Note: This is a placeholder implementation
        // In production, this would call the actual Sprite Sage API
        const response = await fetch(`${this.config.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: params.prompt,
            entity: params.entity,
            theme: params.theme,
            style: params.style,
            resolution: params.resolution,
            frameCount: params.frameCount,
            palette: params.palette
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new SpriteSageError(
            errorData.message || `API error: ${response.statusText}`,
            response.status,
            errorData
          );
        }

        const data = await response.json() as { imageUrl?: string; imageData?: string; width?: number; height?: number };

        // Download or decode image
        let imageBuffer: Buffer;
        if (data.imageUrl) {
          const imageResponse = await fetch(data.imageUrl);
          imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        } else if (data.imageData) {
          imageBuffer = Buffer.from(data.imageData, 'base64');
        } else {
          throw new SpriteSageError('No image data in response');
        }

        return {
          type: "sprite",
          data: imageBuffer,
          metadata: {
            id: this.generateId(),
            name: `spritesage_${params.entity || 'sprite'}`,
            dimensions: {
              width: data.width || params.resolution[0],
              height: data.height || params.resolution[1]
            },
            format: "png",
            palette: {
              dominant: params.palette?.slice(0, 5) || [],
              all: params.palette || [],
              count: params.palette?.length || 0,
              style: params.style === "pixel-art" ? "pixel-art" : "unknown"
            },
            tags: ["sprite-sage", params.entity || "", params.theme || ""].filter(Boolean),
            createdAt: new Date().toISOString()
          }
        };
      }, retryOptions);

      if (!result.success || !result.result) {
        throw result.error || new SpriteSageError('Failed to generate sprite after retries');
      }

      return result.result;
    } catch (error) {
      this.log('Sprite generation failed', error);
      if (error instanceof SpriteSageError) {
        throw error;
      }
      throw new SpriteSageError(
        `Failed to generate sprite: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `spritesage_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * Create Sprite Sage service instance
 */
export function createSpriteSageService(config: SpriteSageConfig): SpriteSageService {
  return new SpriteSageService(config);
}

