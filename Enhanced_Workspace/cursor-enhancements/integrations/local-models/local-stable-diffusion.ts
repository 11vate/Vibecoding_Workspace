/**
 * Local Stable Diffusion Integration
 * 
 * Local Stable Diffusion client for ComfyUI, Automatic1111, or Fooocus.
 * Completely free, no API keys required.
 */

import type { GeneratedAsset, ImageGenerationParams, SpriteGenerationParams } from '../../layer-36-multimodal-core';
import { retry, type RetryOptions } from '../../utils/retry';
import { createRateLimiter, type RateLimiter } from '../../utils/rate-limiter';
import { validateDimensions } from '../../utils/validation';

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
export class LocalStableDiffusionError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'LocalStableDiffusionError';
  }
}

/**
 * Local Stable Diffusion Service
 */
export class LocalStableDiffusionService {
  private config: Required<Omit<LocalStableDiffusionConfig, 'retryOptions' | 'rateLimiter' | 'onProgress'>> & {
    retryOptions?: RetryOptions;
    rateLimiter?: RateLimiter;
    onProgress?: (progress: GenerationProgress) => void;
  };
  private baseUrl: string;

  constructor(config: LocalStableDiffusionConfig) {
    this.config = {
      type: config.type,
      baseUrl: config.baseUrl || this.getDefaultBaseUrl(config.type),
      enableLogging: config.enableLogging || process.env.ENABLE_LOGGING === "true",
      retryOptions: config.retryOptions,
      rateLimiter: config.rateLimiter,
      onProgress: config.onProgress
    };
    this.baseUrl = this.config.baseUrl;
  }

  /**
   * Get default base URL for SD type
   */
  private getDefaultBaseUrl(type: string): string {
    switch (type) {
      case "comfyui":
        return process.env.COMFYUI_BASE_URL || "http://localhost:8188";
      case "automatic1111":
        return process.env.AUTOMATIC1111_BASE_URL || "http://localhost:7860";
      case "fooocus":
        return process.env.FOOOCUS_BASE_URL || "http://localhost:7865";
      default:
        return "http://localhost:8188";
    }
  }

  /**
   * Log message if logging is enabled
   */
  private log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[LocalSD] ${message}`, data || '');
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
   * Check if service is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      let healthUrl: string;
      switch (this.config.type) {
        case "comfyui":
          healthUrl = `${this.baseUrl}/system_stats`;
          break;
        case "automatic1111":
          healthUrl = `${this.baseUrl}/`;
          break;
        case "fooocus":
          healthUrl = `${this.baseUrl}/`;
          break;
        default:
          return false;
      }

      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generate image using ComfyUI
   */
  private async generateWithComfyUI(params: ImageGenerationParams): Promise<GeneratedAsset> {
    // Use existing ComfyUI client
    const { createComfyUIService } = require('../multimodal-models/comfyui-client');
    const comfyUI = createComfyUIService({
      baseUrl: this.baseUrl,
      enableLogging: this.config.enableLogging,
      onProgress: this.config.onProgress
    });

    return comfyUI.generateSprite(params);
  }

  /**
   * Generate image using Automatic1111
   */
  private async generateWithAutomatic1111(params: ImageGenerationParams): Promise<GeneratedAsset> {
    this.reportProgress({ stage: "submitting", message: "Submitting to Automatic1111" });

    const payload = {
      prompt: this.buildPrompt(params),
      negative_prompt: params.negativePrompt || "blurry, low quality, distorted",
      width: params.resolution[0],
      height: params.resolution[1],
      steps: 20,
      cfg_scale: 7.5,
      seed: params.seed || -1
    };

    const response = await fetch(`${this.baseUrl}/sdapi/v1/txt2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new LocalStableDiffusionError(
        `Automatic1111 API error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json() as { images: string[] };
    const imageBuffer = Buffer.from(data.images[0], 'base64');

    this.reportProgress({ stage: "completed", progress: 1.0 });

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
  }

  /**
   * Generate image using Fooocus
   */
  private async generateWithFooocus(params: ImageGenerationParams): Promise<GeneratedAsset> {
    this.reportProgress({ stage: "submitting", message: "Submitting to Fooocus" });

    const payload = {
      prompt: this.buildPrompt(params),
      negative_prompt: params.negativePrompt || "",
      width: params.resolution[0],
      height: params.resolution[1],
      seed: params.seed || -1
    };

    const response = await fetch(`${this.baseUrl}/v1/generation/text-to-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new LocalStableDiffusionError(
        `Fooocus API error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json() as { base64_image: string };
    const imageBuffer = Buffer.from(data.base64_image, 'base64');

    this.reportProgress({ stage: "completed", progress: 1.0 });

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
  }

  /**
   * Generate image
   */
  async generateImage(params: ImageGenerationParams): Promise<GeneratedAsset> {
    try {
      // Validate parameters
      const dimValidation = validateDimensions(
        params.resolution[0],
        params.resolution[1],
        16, 16, 2048, 2048
      );
      if (!dimValidation.valid) {
        throw new LocalStableDiffusionError(dimValidation.error || 'Invalid dimensions');
      }

      // Check availability
      const available = await this.checkAvailability();
      if (!available) {
        throw new LocalStableDiffusionError(
          `${this.config.type} is not available at ${this.baseUrl}. Please ensure it's running.`
        );
      }

      // Route to appropriate implementation
      switch (this.config.type) {
        case "comfyui":
          return this.generateWithComfyUI(params);
        case "automatic1111":
          return this.generateWithAutomatic1111(params);
        case "fooocus":
          return this.generateWithFooocus(params);
        default:
          throw new LocalStableDiffusionError(`Unsupported SD type: ${this.config.type}`);
      }
    } catch (error) {
      this.reportProgress({ 
        stage: "failed", 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
      if (error instanceof LocalStableDiffusionError) {
        throw error;
      }
      throw new LocalStableDiffusionError(
        `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      if (params.frameCount && (params.frameCount < 1 || params.frameCount > 32)) {
        throw new LocalStableDiffusionError('Frame count must be between 1 and 32');
      }

      const baseAsset = await this.generateImage(params);

      if (params.frameCount && params.frameCount > 1) {
        this.reportProgress({
          stage: "processing",
          message: `Generating ${params.frameCount} animation frames...`,
          progress: 0
        });

        const frames: Buffer[] = [];
        for (let i = 0; i < params.frameCount; i++) {
          this.reportProgress({
            stage: "processing",
            message: `Generating frame ${i + 1} of ${params.frameCount}`,
            progress: (i + 1) / params.frameCount
          });

          const frameParams: ImageGenerationParams = {
            ...params,
            prompt: `${params.prompt}, frame ${i + 1} of ${params.frameCount}, animation sequence, consistent style`,
            seed: params.seed ? params.seed + i : undefined
          };

          const frameAsset = await this.generateImage(frameParams);
          frames.push(frameAsset.data as Buffer);
        }

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
      if (error instanceof LocalStableDiffusionError) {
        throw error;
      }
      throw new LocalStableDiffusionError(
        `Failed to generate sprite: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }

  /**
   * Build optimized prompt
   */
  private buildPrompt(params: ImageGenerationParams): string {
    let prompt = params.prompt;

    if (params.style === "pixel-art") {
      prompt += ", pixel art, 8-bit style, retro game sprite";
    }

    if (params.palette && params.palette.length > 0) {
      prompt += `, color palette: ${params.palette.join(", ")}`;
    }

    prompt += `, ${params.resolution[0]}x${params.resolution[1]} pixels`;
    prompt += ", high quality, detailed, transparent background, game ready";

    return prompt;
  }

  /**
   * Extract tags
   */
  private extractTags(params: ImageGenerationParams): string[] {
    const tags: string[] = [params.style];
    return tags;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `local_sd_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * Create local Stable Diffusion service
 */
export function createLocalStableDiffusionService(
  config: LocalStableDiffusionConfig
): LocalStableDiffusionService {
  return new LocalStableDiffusionService(config);
}









