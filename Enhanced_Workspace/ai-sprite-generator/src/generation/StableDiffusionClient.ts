/**
 * Stable Diffusion Client
 * 
 * Client for local Stable Diffusion (ComfyUI/Automatic1111).
 * 100% free, no API keys required.
 */

import type { CompiledPrompt } from '../types/index.js';

/**
 * Stable Diffusion configuration
 */
export interface StableDiffusionConfig {
  type: "comfyui" | "automatic1111";
  baseUrl?: string;
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
 * Stable Diffusion Error
 */
export class StableDiffusionError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StableDiffusionError';
  }
}

/**
 * Stable Diffusion Client
 */
export class StableDiffusionClient {
  private config: Required<Omit<StableDiffusionConfig, 'onProgress'>> & {
    onProgress?: (progress: GenerationProgress) => void;
  };
  private baseUrl: string;

  constructor(config: StableDiffusionConfig) {
    this.config = {
      type: config.type,
      baseUrl: config.baseUrl || this.getDefaultBaseUrl(config.type),
      enableLogging: config.enableLogging || process.env.ENABLE_LOGGING === "true",
      onProgress: config.onProgress,
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
      default:
        return "http://localhost:8188";
    }
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
   * Generate image using Automatic1111
   */
  async generateImage(
    prompt: CompiledPrompt,
    resolution: [number, number]
  ): Promise<Buffer> {
    if (this.config.type === "automatic1111") {
      return this.generateWithAutomatic1111(prompt, resolution);
    } else {
      // ComfyUI would require more complex workflow setup
      // For now, fallback to Automatic1111 approach
      throw new StableDiffusionError(
        `ComfyUI generation not yet implemented. Please use Automatic1111 or implement ComfyUI workflow.`
      );
    }
  }

  /**
   * Generate with Automatic1111
   */
  private async generateWithAutomatic1111(
    prompt: CompiledPrompt,
    resolution: [number, number]
  ): Promise<Buffer> {
    this.reportProgress({ 
      stage: "submitting", 
      message: "Submitting to Automatic1111" 
    });

    const payload = {
      prompt: prompt.positivePrompt,
      negative_prompt: prompt.negativePrompt,
      width: resolution[0],
      height: resolution[1],
      steps: prompt.steps || 25,
      cfg_scale: prompt.cfgScale || 7.5,
      seed: prompt.seed || -1,
      // LoRA support would be added here if Automatic1111 API supports it
    };

    try {
      const response = await fetch(`${this.baseUrl}/sdapi/v1/txt2img`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new StableDiffusionError(
          `Automatic1111 API error: ${response.statusText}`,
          response.status
        );
      }

      this.reportProgress({ 
        stage: "processing", 
        message: "Generating image...",
        progress: 0.5
      });

      const data = await response.json() as { images: string[] };
      const imageBuffer = Buffer.from(data.images[0], 'base64');

      this.reportProgress({ 
        stage: "completed", 
        progress: 1.0 
      });

      return imageBuffer;
    } catch (error) {
      this.reportProgress({ 
        stage: "failed", 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      if (error instanceof StableDiffusionError) {
        throw error;
      }
      
      throw new StableDiffusionError(
        `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }
}

