/**
 * Motion Retargeter
 * 
 * Transfers animations from reference sprites to target sprites.
 */

import type { PoseSequence } from './MotionExtractor.js';
import type { GeneratedSprite, GenerationParams } from '../types/index.js';
import { AIGenerator } from '../generation/AIGenerator.js';
import { ControlNetManager, type ControlNetConfig } from '../generation/ControlNetManager.js';
import { PromptCompiler } from '../intelligence/PromptCompiler.js';
import { StyleAnalyzer } from '../intelligence/StyleAnalyzer.js';

/**
 * Motion retargeting options
 */
export interface MotionRetargetingOptions {
  maintainStyle?: boolean;
  maintainColors?: boolean;
  controlNetWeight?: number;
  frameConsistency?: number; // 0.0 to 1.0
}

/**
 * Motion Retargeter
 */
export class MotionRetargeter {
  private aiGenerator: AIGenerator;
  private controlNetManager: ControlNetManager;
  private promptCompiler: PromptCompiler;
  private styleAnalyzer: StyleAnalyzer;

  constructor() {
    this.aiGenerator = new AIGenerator();
    this.controlNetManager = new ControlNetManager();
    this.promptCompiler = new PromptCompiler();
    this.styleAnalyzer = new StyleAnalyzer();
  }

  /**
   * Transfer motion from reference to target sprite
   */
  async transferMotion(
    referenceSequence: PoseSequence,
    targetDescription: string,
    style: string = 'pixel-art',
    options: MotionRetargetingOptions = {}
  ): Promise<GeneratedSprite[]> {
    const frames: GeneratedSprite[] = [];
    const frameCount = referenceSequence.poses.length;

    // Get style info using StyleAnalyzer
    const params: GenerationParams = {
      entity: 'character',
      style: style as any,
      perspective: 'side-view',
      resolution: [64, 64],
      postProcessing: [],
    };
    const styleInfo = this.styleAnalyzer.analyzeStyle(params);

    // Generate each frame with pose guidance
    for (let i = 0; i < frameCount; i++) {
      const pose = referenceSequence.poses[i];

      // Build generation parameters
      const params: GenerationParams = {
        entity: 'character', // Default, could be inferred
        style: style as any, // styleInfo doesn't have style property
        theme: this.extractTheme(targetDescription),
        action: this.inferAction(referenceSequence, i) as any,
        frameCount: 1, // Single frame
        perspective: 'side-view', // Default
        resolution: [referenceSequence.frameWidth, referenceSequence.frameHeight],
        loopable: referenceSequence.loopable,
        model: styleInfo.baseModel,
        lora: styleInfo.lora,
        postProcessing: ['background-removal', 'normalization']
      };

      // Compile prompt
      const compiledPrompt = this.promptCompiler.compile(params);

      // Apply ControlNet if available
      let controlConfig: ControlNetConfig | undefined;
      let controlImage: Buffer | undefined;

      if (await this.controlNetManager.checkAvailableTypes().then(types => types.has('openpose'))) {
        controlImage = await this.controlNetManager.generateControlImage(
          pose,
          'openpose',
          referenceSequence.frameWidth,
          referenceSequence.frameHeight
        );

        controlConfig = {
          type: 'openpose',
          weight: options.controlNetWeight || 0.8,
          guidanceStart: 0.0,
          guidanceEnd: 1.0,
          controlImage
        };

        // Apply ControlNet to prompt
        const controlResult = await this.controlNetManager.applyControlNet(
          compiledPrompt,
          controlConfig,
          undefined
        );
        
        // Generate frame with ControlNet
        const frame = await this.generateFrameWithControl(
          controlResult.prompt,
          controlResult.controlImage,
          controlResult.controlConfig,
          params,
          i === 0 ? undefined : frames[0] // Use first frame as base for consistency
        );
        
        frames.push(frame);
      } else {
        // Fallback: Generate without ControlNet
        const frame = await this.aiGenerator.generate(params);
        frames.push(frame);
      }
    }

    return frames;
  }

  /**
   * Generate frame with ControlNet
   */
  private async generateFrameWithControl(
    _prompt: any,
    _controlImage: Buffer,
    _controlConfig: ControlNetConfig,
    params: GenerationParams,
    _baseFrame?: GeneratedSprite
  ): Promise<GeneratedSprite> {
    // Placeholder: Would use StableDiffusionClient with ControlNet
    // For now, use regular generation
    return await this.aiGenerator.generate(params);
  }

  /**
   * Maintain character consistency across frames
   */
  async maintainConsistency(
    frames: GeneratedSprite[],
    _baseSprite: GeneratedSprite
  ): Promise<GeneratedSprite[]> {
    // Placeholder: Would use inpainting or style transfer to maintain consistency
    // For now, return frames as-is
    return frames;
  }

  /**
   * Extract theme from description
   */
  private extractTheme(description: string): string | undefined {
    // Simple extraction: look for common theme keywords
    const themes = ['fire', 'water', 'earth', 'air', 'ice', 'lightning', 'dark', 'light', 'nature', 'mechanical'];
    const lowerDesc = description.toLowerCase();
    
    for (const theme of themes) {
      if (lowerDesc.includes(theme)) {
        return theme;
      }
    }

    return undefined;
  }

  /**
   * Infer action from pose sequence and frame index
   */
  private inferAction(sequence: PoseSequence, frameIndex: number): string | undefined {
    // Simple heuristic: analyze pose movement
    if (sequence.poses.length === 0) {
      return 'idle';
    }

    // Check if poses show movement
    const firstPose = sequence.poses[0];
    const currentPose = sequence.poses[frameIndex];
    
    if (currentPose.keypoints.length > 0 && firstPose.keypoints.length > 0) {
      const dx = Math.abs(currentPose.keypoints[0].x - firstPose.keypoints[0].x);
      const dy = Math.abs(currentPose.keypoints[0].y - firstPose.keypoints[0].y);
      
      if (dx > 5 || dy > 5) {
        return 'walk';
      }
    }

    return 'idle';
  }
}

