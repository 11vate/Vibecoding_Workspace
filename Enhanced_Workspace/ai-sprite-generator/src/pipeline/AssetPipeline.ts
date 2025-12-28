/**
 * Asset Pipeline
 * 
 * Main orchestrator for the complete asset generation pipeline.
 */

import type { GeneratedSprite } from '../types/index.js';
import { ConceptInterpreter } from '../intelligence/ConceptInterpreter.js';
import { AIGenerator } from '../generation/AIGenerator.js';
import { BackgroundRemover } from '../postprocessing/BackgroundRemover.js';
import { SpriteNormalizer } from '../postprocessing/SpriteNormalizer.js';
import { QualityValidator } from '../postprocessing/QualityValidator.js';
import { FrameAligner } from '../postprocessing/FrameAligner.js';
import { SpriteSheetAssembler } from '../export/SpriteSheetAssembler.js';
import { MetadataGenerator } from '../export/MetadataGenerator.js';
import { CodeBindingGenerator } from '../export/CodeBindingGenerator.js';
import { AnimationReasoner } from '../intelligence/AnimationReasoner.js';
import { MotionRetargeter } from '../motion/MotionRetargeter.js';
import { MotionExtractor, type PoseSequence } from '../motion/MotionExtractor.js';
import type { MotionRetargetingOptions } from '../motion/MotionRetargeter.js';

/**
 * Pipeline configuration
 */
export interface PipelineConfig {
  enablePostProcessing?: boolean;
  enableValidation?: boolean;
  enableExport?: boolean;
  targetEngine?: 'phaser' | 'pixijs' | 'custom';
  motionTransfer?: {
    referenceSpriteSheet?: Buffer;
    referencePath?: string;
    frameWidth?: number;
    frameHeight?: number;
    options?: MotionRetargetingOptions;
  };
}

/**
 * Pipeline result
 */
export interface PipelineResult {
  success: boolean;
  sprite?: GeneratedSprite;
  frames?: GeneratedSprite[];
  sheet?: Buffer;
  metadata?: any;
  codeBindings?: any[];
  errors: string[];
  warnings: string[];
}

/**
 * Asset Pipeline
 * 
 * Orchestrates the complete asset generation pipeline.
 */
export class AssetPipeline {
  private conceptInterpreter: ConceptInterpreter;
  private aiGenerator: AIGenerator;
  private backgroundRemover: BackgroundRemover;
  private spriteNormalizer: SpriteNormalizer;
  private qualityValidator: QualityValidator;
  private frameAligner: FrameAligner;
  private sheetAssembler: SpriteSheetAssembler;
  private metadataGenerator: MetadataGenerator;
  private codeBindingGenerator: CodeBindingGenerator;
  private animationReasoner: AnimationReasoner;
  private motionRetargeter: MotionRetargeter;
  private motionExtractor: MotionExtractor;

  constructor() {
    this.conceptInterpreter = new ConceptInterpreter();
    this.aiGenerator = new AIGenerator();
    this.backgroundRemover = new BackgroundRemover();
    this.spriteNormalizer = new SpriteNormalizer();
    this.qualityValidator = new QualityValidator();
    this.frameAligner = new FrameAligner();
    this.sheetAssembler = new SpriteSheetAssembler();
    this.metadataGenerator = new MetadataGenerator();
    this.codeBindingGenerator = new CodeBindingGenerator();
    this.animationReasoner = new AnimationReasoner();
    this.motionRetargeter = new MotionRetargeter();
    this.motionExtractor = new MotionExtractor();
  }

  /**
   * Execute complete pipeline
   */
  async execute(
    concept: string,
    config: PipelineConfig = {}
  ): Promise<PipelineResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Stage 1: Concept Interpretation
      const interpretation = this.conceptInterpreter.interpret(concept);
      if (interpretation.confidence < 0.5) {
        warnings.push(`Low confidence interpretation: ${interpretation.confidence}`);
      }

      const params = interpretation.params;

      // Stage 2: Generation
      let sprite: GeneratedSprite;
      let frames: GeneratedSprite[] | undefined;

      if (params.frameCount && params.frameCount > 1) {
        // Check if motion transfer is requested
        if (config.motionTransfer?.referenceSpriteSheet || config.motionTransfer?.referencePath) {
          // Extract motion from reference
          let referenceSequence: PoseSequence;
          
          if (config.motionTransfer.referenceSpriteSheet) {
            const frameWidth = config.motionTransfer.frameWidth || 64;
            const frameHeight = config.motionTransfer.frameHeight || 64;
            referenceSequence = await this.motionExtractor.extractPoseSequence(
              config.motionTransfer.referenceSpriteSheet,
              frameWidth,
              frameHeight
            );
          } else if (config.motionTransfer.referencePath) {
            const { readFile } = await import('fs/promises');
            const spriteSheet = await readFile(config.motionTransfer.referencePath);
            const frameWidth = config.motionTransfer.frameWidth || 64;
            const frameHeight = config.motionTransfer.frameHeight || 64;
            referenceSequence = await this.motionExtractor.extractPoseSequence(
              spriteSheet,
              frameWidth,
              frameHeight
            );
          } else {
            throw new Error('Motion transfer requires referenceSpriteSheet or referencePath');
          }

          // Transfer motion to target
          const targetDescription = concept; // Use original concept
          frames = await this.motionRetargeter.transferMotion(
            referenceSequence,
            targetDescription,
            params.style,
            config.motionTransfer.options
          );
        } else {
          // Generate animation frames normally
          frames = await this.aiGenerator.generateAnimation(params, params.frameCount);
        }
        sprite = frames[0]; // Use first frame as reference
      } else {
        // Generate single sprite
        sprite = await this.aiGenerator.generate(params);
      }

      // Stage 3: Post-Processing
      if (config.enablePostProcessing !== false) {
        // Background removal
        try {
          sprite.data = await this.backgroundRemover.removeBackground(sprite);
        } catch (error) {
          warnings.push(`Background removal failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Normalize size
        try {
          sprite.data = await this.spriteNormalizer.normalize(
            sprite,
            params.resolution[0],
            params.resolution[1]
          );
        } catch (error) {
          errors.push(`Normalization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Align frames if animation
        if (frames && frames.length > 1) {
          try {
            const pivot = await this.frameAligner.detectPivot(frames[0]);
            frames = await this.frameAligner.alignFrames(frames, pivot.x, pivot.y);
          } catch (error) {
            warnings.push(`Frame alignment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      // Stage 4: Validation
      if (config.enableValidation !== false) {
        const validation = await this.qualityValidator.validate(sprite);
        if (!validation.valid) {
          errors.push(...validation.errors);
        }
        warnings.push(...validation.warnings);
      }

      // Stage 5: Export
      let sheet: Buffer | undefined;
      let metadata: any;
      let codeBindings: any[] | undefined;

      if (config.enableExport !== false) {
        if (frames && frames.length > 1) {
          // Create sprite sheet
          const sheetResult = await this.sheetAssembler.assembleSheet(
            frames,
            params.resolution[0],
            params.resolution[1]
          );
          sheet = sheetResult.sheet;

          // Generate metadata
          const animationReasoning = this.animationReasoner.reason(params);
          const animations = params.action ? {
            [params.action]: {
              frames: frames.map((_, i) => i),
              frameRate: animationReasoning.timing,
              loop: animationReasoning.loopable,
            },
          } : undefined;

          metadata = this.metadataGenerator.generateSheetMetadata(
            sprite,
            sheetResult.metadata,
            animations
          );

          // Generate code bindings
          if (config.targetEngine) {
            codeBindings = [];
            if (config.targetEngine === 'phaser') {
              codeBindings.push(
                this.codeBindingGenerator.generatePhaserAnimation(
                  sprite.id,
                  sheetResult.metadata,
                  animations || {}
                )
              );
            } else if (config.targetEngine === 'pixijs') {
              codeBindings.push(
                this.codeBindingGenerator.generatePixiJSLoader(
                  sprite.id,
                  sheetResult.metadata
                )
              );
            } else {
              codeBindings.push(
                this.codeBindingGenerator.generateCustomBinding(
                  sprite.id,
                  sheetResult.metadata
                )
              );
            }
          }
        } else {
          // Single sprite metadata
          metadata = this.metadataGenerator.generateSpriteMetadata(sprite);
        }
      }

      return {
        success: errors.length === 0,
        sprite,
        frames,
        sheet,
        metadata,
        codeBindings,
        errors,
        warnings,
      };
    } catch (error) {
      errors.push(`Pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        errors,
        warnings,
      };
    }
  }

  /**
   * Generate asset set
   */
  async generateAssetSet(
    baseConcept: string,
    setType: 'directional' | 'animation' | 'color-variants',
    config: PipelineConfig = {}
  ): Promise<PipelineResult[]> {
    const results: PipelineResult[] = [];

    // Generate base sprite first
    const baseResult = await this.execute(baseConcept, config);
    if (!baseResult.success || !baseResult.sprite) {
      return [baseResult];
    }

    // Generate variants based on set type
    const { VariantGenerator } = await import('../sets/VariantGenerator.js');
    const variantGenerator = new VariantGenerator();

    if (setType === 'directional') {
      const directions = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'];
      const views = await variantGenerator.generateDirectionalViews(baseResult.sprite, directions);
      
      for (const view of views) {
        const result = await this.execute(`${baseConcept} ${view.metadata.perspective}`, config);
        results.push(result);
      }
    } else if (setType === 'color-variants') {
      const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
      const variants = await variantGenerator.generateColorVariants(baseResult.sprite, colors);
      
      for (const variant of variants) {
        results.push({
          success: true,
          sprite: variant,
          errors: [],
          warnings: [],
        });
      }
    } else if (setType === 'animation') {
      // Animation set is handled by frame generation
      return [baseResult];
    }

    return results;
  }
}

