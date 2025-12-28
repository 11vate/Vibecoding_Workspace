/**
 * Style Analyzer
 * 
 * Analyzes style requirements and selects appropriate models and LoRAs.
 */

import type { VisualStyle, GenerationParams } from '../types/index.js';

/**
 * Model configuration
 */
export interface ModelConfig {
  name: string;
  baseModel: string;
  lora?: string;
  loraWeight?: number;
  steps?: number;
  cfgScale?: number;
  resolution?: [number, number];
}

/**
 * Style Analyzer
 * 
 * Selects appropriate models and LoRAs based on style requirements.
 */
export class StyleAnalyzer {
  private styleConfigs: Map<VisualStyle, ModelConfig> = new Map([
    ['pixel-art', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      lora: 'pixel-art-xl',
      loraWeight: 0.8,
      steps: 25,
      cfgScale: 7.5,
    }],
    ['pixel-art-8bit', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      lora: 'pixel-art-xl',
      loraWeight: 0.9,
      steps: 25,
      cfgScale: 7.5,
    }],
    ['pixel-art-16bit', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      lora: 'pixel-art-xl',
      loraWeight: 0.85,
      steps: 25,
      cfgScale: 7.5,
    }],
    ['pixel-art-hd', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      lora: 'pixel-art-xl',
      loraWeight: 0.75,
      steps: 30,
      cfgScale: 8.0,
    }],
    ['cartoon', {
      name: 'stable-diffusion-2.1',
      baseModel: 'stable-diffusion-2-1-base',
      lora: 'cartoon-lora',
      loraWeight: 0.7,
      steps: 25,
      cfgScale: 7.0,
    }],
    ['hand-drawn', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      steps: 30,
      cfgScale: 7.5,
    }],
    ['painterly', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      steps: 30,
      cfgScale: 8.0,
    }],
    ['fantasy', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      steps: 30,
      cfgScale: 7.5,
    }],
    ['isometric', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      steps: 25,
      cfgScale: 7.5,
    }],
    ['pseudo-3d', {
      name: 'stable-diffusion-xl',
      baseModel: 'stable-diffusion-xl-base-1.0',
      steps: 30,
      cfgScale: 8.0,
    }],
  ]);

  /**
   * Analyze style and return model configuration
   */
  analyzeStyle(params: GenerationParams): ModelConfig {
    const config = this.styleConfigs.get(params.style);
    
    if (!config) {
      // Default configuration
      return {
        name: 'stable-diffusion-xl',
        baseModel: 'stable-diffusion-xl-base-1.0',
        steps: 25,
        cfgScale: 7.5,
      };
    }
    
    // Override resolution if specified in params
    if (params.resolution) {
      return {
        ...config,
        resolution: params.resolution,
      };
    }
    
    return config;
  }

  /**
   * Get available LoRAs for a style
   */
  getAvailableLoRAs(style: VisualStyle): string[] {
    const config = this.styleConfigs.get(style);
    if (config?.lora) {
      return [config.lora];
    }
    return [];
  }

  /**
   * Check if LoRA is required for style
   */
  requiresLoRA(style: VisualStyle): boolean {
    const config = this.styleConfigs.get(style);
    return !!config?.lora;
  }
}







