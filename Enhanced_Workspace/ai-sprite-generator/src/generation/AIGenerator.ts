/**
 * AI Generator
 * 
 * Main orchestrator for AI-powered sprite generation.
 * Coordinates between Stable Diffusion, LoRAs, and fallback systems.
 */

import type { GenerationParams, GeneratedSprite } from '../types/index.js';
import { StableDiffusionClient, type StableDiffusionConfig } from './StableDiffusionClient.js';
import { LoRAManager } from './LoRAManager.js';
import { ProceduralFallback } from './ProceduralFallback.js';
import { PromptCompiler } from '../intelligence/PromptCompiler.js';

/**
 * AI Generator
 * 
 * Main orchestrator for sprite generation.
 */
export class AIGenerator {
  private sdClient: StableDiffusionClient;
  private loraManager: LoRAManager;
  private proceduralFallback: ProceduralFallback;
  private promptCompiler: PromptCompiler;

  constructor(config?: StableDiffusionConfig) {
    this.sdClient = new StableDiffusionClient(
      config || { type: 'automatic1111' }
    );
    this.loraManager = new LoRAManager();
    this.loraManager.initializeDefaults();
    this.proceduralFallback = new ProceduralFallback();
    this.promptCompiler = new PromptCompiler();
  }

  /**
   * Generate sprite from parameters
   */
  async generate(params: GenerationParams): Promise<GeneratedSprite> {
    // Compile prompt
    const compiledPrompt = this.promptCompiler.compile(params);

    // Check if AI is available
    const aiAvailable = await this.sdClient.checkAvailability();

    if (!aiAvailable) {
      console.warn('[AIGenerator] AI not available, using procedural fallback');
      return this.proceduralFallback.generateSprite(params);
    }

    try {
      // Generate using AI
      const imageBuffer = await this.sdClient.generateImage(
        compiledPrompt,
        params.resolution
      );

      // Create sprite object
      const sprite: GeneratedSprite = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        data: imageBuffer,
        width: params.resolution[0],
        height: params.resolution[1],
        format: 'png',
        metadata: {
          entity: params.entity,
          style: params.style,
          theme: params.theme,
          action: params.action,
          frameCount: params.frameCount,
          perspective: params.perspective,
          tags: [params.style, params.entity, ...(params.theme ? [params.theme] : [])],
          createdAt: new Date().toISOString(),
        },
      };

      return sprite;
    } catch (error) {
      console.warn('[AIGenerator] AI generation failed, using procedural fallback:', error);
      return this.proceduralFallback.generateSprite(params);
    }
  }

  /**
   * Generate multiple frames for animation
   */
  async generateAnimation(
    params: GenerationParams,
    frameCount: number
  ): Promise<GeneratedSprite[]> {
    const frames: GeneratedSprite[] = [];

    for (let i = 0; i < frameCount; i++) {
      const frameParams: GenerationParams = {
        ...params,
        frameCount: 1, // Generate single frame
      };

      const frame = await this.generate(frameParams);
      frames.push(frame);
    }

    return frames;
  }

  /**
   * Check if AI generation is available
   */
  async isAvailable(): Promise<boolean> {
    return this.sdClient.checkAvailability();
  }
}

