/**
 * LAYER 39 — ASSET PIPELINE
 * 
 * End-to-end asset generation, processing, and integration pipeline.
 * 
 * This layer orchestrates the complete asset lifecycle from generation through
 * validation, metadata extraction, code binding, and project integration.
 */

import type { GeneratedAsset, AssetMetadata, SpriteGenerationParams } from './layer-36-multimodal-core';
import type { CodeBinding } from './layer-36-multimodal-core';
import type { GameFramework } from './layer-37-game-frameworks';
import { validateDimensions, validateColorPalette, validateImageBuffer } from './utils/validation';
import { generateAnimationController, generateSpriteLoader } from './layer-37-game-frameworks';
import * as path from 'path';

/**
 * Pipeline stage
 */
export type PipelineStage = 
  | "generation"
  | "validation"
  | "metadata-extraction"
  | "code-binding"
  | "integration"
  | "complete";

/**
 * Asset generation source
 */
export type GenerationSource = "ai" | "procedural" | "manual" | "hybrid";

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-1 quality score
}

/**
 * Validation error
 */
export interface ValidationError {
  type: "palette" | "dimension" | "format" | "metadata" | "quality";
  message: string;
  severity: "error" | "warning";
  fixable: boolean;
  suggestedFix?: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  type: string;
  message: string;
  suggestion?: string;
}

/**
 * Asset standards
 */
export interface AssetStandards {
  maxColors?: number;
  allowedFormats: string[];
  minDimensions: { width: number; height: number };
  maxDimensions: { width: number; height: number };
  requiredMetadata: string[];
  styleConstraints?: StyleConstraints;
}

/**
 * Style constraints
 */
export interface StyleConstraints {
  pixelStyle: "crisp" | "smooth" | "antialiased";
  colorDepth: 8 | 16 | 24 | 32;
  paletteConsistency: boolean;
  animationSmoothness: "gameReady" | "preview" | "draft";
}

/**
 * Pipeline configuration
 */
export interface PipelineConfig {
  generationSource: GenerationSource;
  validationEnabled: boolean;
  codeBindingEnabled: boolean;
  targetFramework?: GameFramework;
  standards: AssetStandards;
  autoIntegrate: boolean;
}

/**
 * Pipeline result
 */
export interface PipelineResult {
  stage: PipelineStage;
  asset: GeneratedAsset;
  metadata: AssetMetadata;
  validation: ValidationResult;
  codeBindings?: CodeBinding[];
  integrationPath?: string;
  errors: string[];
}

/**
 * Parametric generation template
 */
export interface GenerationTemplate {
  id: string;
  name: string;
  type: "sprite" | "background" | "animation" | "effect";
  parameters: TemplateParameter[];
  promptTemplate: string;
  constraints: AssetStandards;
}

/**
 * Template parameter
 */
export interface TemplateParameter {
  name: string;
  type: "string" | "number" | "color" | "enum" | "boolean";
  required: boolean;
  default?: unknown;
  options?: unknown[];
  description: string;
}

/**
 * Main asset pipeline configuration
 */
export const ASSET_PIPELINE = {
  /**
   * Pipeline Stages
   */
  stages: {
    generation: {
      description: "Generate asset using AI or procedural methods",
      inputs: ["GenerationParams", "Template"],
      outputs: ["RawAsset"],
      validators: []
    },
    
    validation: {
      description: "Validate asset against quality standards",
      inputs: ["RawAsset", "AssetStandards"],
      outputs: ["ValidationResult"],
      validators: [
        "paletteCheck",
        "dimensionCheck",
        "formatCheck",
        "metadataCheck",
        "qualityCheck"
      ]
    },
    
    metadataExtraction: {
      description: "Extract metadata from generated asset",
      inputs: ["ValidatedAsset"],
      outputs: ["AssetMetadata"],
      extractors: [
        "dimensionExtractor",
        "paletteExtractor",
        "frameExtractor",
        "animationExtractor"
      ]
    },
    
    codeBinding: {
      description: "Generate framework-specific code bindings",
      inputs: ["AssetMetadata", "TargetFramework"],
      outputs: ["CodeBinding[]"],
      generators: [
        "animationControllerGenerator",
        "spriteLoaderGenerator",
        "assetManagerGenerator"
      ]
    },
    
    integration: {
      description: "Integrate asset into project structure",
      inputs: ["Asset", "CodeBindings", "ProjectStructure"],
      outputs: ["IntegrationPath"],
      actions: [
        "organizeAssets",
        "updateImports",
        "registerAssets",
        "updateDocumentation"
      ]
    }
  },

  /**
   * Validation Checks
   */
  validation: {
    paletteCheck: {
      description: "Validate color palette constraints",
      checks: [
        "Max color count",
        "Palette consistency",
        "Color depth compliance"
      ],
      threshold: 0.8
    },
    
    dimensionCheck: {
      description: "Validate asset dimensions",
      checks: [
        "Within min/max bounds",
        "Power-of-2 (if required)",
        "Aspect ratio consistency"
      ],
      threshold: 1.0
    },
    
    formatCheck: {
      description: "Validate file format",
      checks: [
        "Format compatibility",
        "Transparency support",
        "Compression quality"
      ],
      threshold: 1.0
    },
    
    metadataCheck: {
      description: "Validate metadata completeness",
      checks: [
        "Required fields present",
        "Data types correct",
        "Values within ranges"
      ],
      threshold: 1.0
    },
    
    qualityCheck: {
      description: "Validate visual quality",
      checks: [
        "No artifacts",
        "Proper transparency",
        "Frame alignment",
        "Animation smoothness"
      ],
      threshold: 0.7
    }
  },

  /**
   * Metadata Extractors
   */
  extractors: {
    dimensionExtractor: {
      description: "Extract dimensions from image",
      method: "Image analysis"
    },
    
    paletteExtractor: {
      description: "Extract color palette",
      method: "Color quantization and analysis"
    },
    
    frameExtractor: {
      description: "Extract frame definitions from sprite sheet",
      method: "Grid detection or metadata parsing"
    },
    
    animationExtractor: {
      description: "Extract animation sequences",
      method: "Pattern recognition or metadata"
    }
  },

  /**
   * Code Binding Generators
   */
  codeGenerators: {
    animationControllerGenerator: {
      description: "Generate animation controller code",
      frameworks: ["phaser", "pixi", "custom"],
      inputs: ["SpriteSheetMetadata", "AnimationDefinitions"]
    },
    
    spriteLoaderGenerator: {
      description: "Generate sprite loader code",
      frameworks: ["phaser", "pixi", "monogame"],
      inputs: ["AssetMetadata", "ProjectStructure"]
    },
    
    assetManagerGenerator: {
      description: "Generate asset manager code",
      frameworks: ["phaser", "custom"],
      inputs: ["AssetList", "LoadingStrategy"]
    }
  },

  /**
   * Integration Actions
   */
  integration: {
    organizeAssets: {
      description: "Organize assets into project structure",
      strategy: "Follow Layer 32 (Asset Management) patterns"
    },
    
    updateImports: {
      description: "Update import statements",
      strategy: "Add to appropriate import files"
    },
    
    registerAssets: {
      description: "Register assets in asset registry",
      strategy: "Update asset manifest or registry"
    },
    
    updateDocumentation: {
      description: "Update project documentation",
      strategy: "Add to asset documentation"
    }
  },

  /**
   * Parametric Templates
   */
  templates: {
    sprite: {
      description: "Parametric sprite generation template",
      parameters: [
        {
          name: "entity",
          type: "string",
          required: true,
          description: "Entity name (e.g., 'Fire Pet', 'Hero')"
        },
        {
          name: "theme",
          type: "string",
          required: true,
          description: "Visual theme (e.g., 'cyber-vaporwave', 'fantasy')"
        },
        {
          name: "resolution",
          type: "enum",
          required: true,
          options: ["16x16", "32x32", "64x64", "128x128"],
          description: "Sprite resolution"
        },
        {
          name: "actions",
          type: "enum",
          required: false,
          options: ["idle", "walk", "attack", "death"],
          description: "Animation actions"
        }
      ]
    },
    
    background: {
      description: "Parametric background generation template",
      parameters: [
        {
          name: "scene",
          type: "string",
          required: true,
          description: "Scene description"
        },
        {
          name: "mood",
          type: "enum",
          required: true,
          options: ["peaceful", "dark", "energetic", "mysterious"],
          description: "Atmospheric mood"
        },
        {
          name: "tileable",
          type: "boolean",
          required: false,
          default: true,
          description: "Whether background should tile"
        }
      ]
    }
  }
} as const;

/**
 * Execute asset pipeline
 */
export async function executePipeline(
  params: SpriteGenerationParams,
  config: PipelineConfig
): Promise<PipelineResult> {
  const errors: string[] = [];
  let asset: GeneratedAsset | null = null;
  let metadata: AssetMetadata | null = null;
  let validation: ValidationResult | null = null;
  let codeBindings: CodeBinding[] | undefined;
  let integrationPath: string | undefined;

  try {
    // Stage 1: Generation
    if (config.generationSource === "ai") {
      // Try local models first (free, no API key)
      const useLocalModels = process.env.USE_LOCAL_MODELS !== "false";
      
      if (useLocalModels) {
        try {
          const { createLocalStableDiffusionService } = require('../integrations/local-models/local-stable-diffusion');
          const localSD = createLocalStableDiffusionService({
            type: (process.env.SD_TYPE || "comfyui") as "comfyui" | "automatic1111" | "fooocus",
            baseUrl: process.env.SD_BASE_URL,
            enableLogging: true
          });
          
          const available = await localSD.checkAvailability();
          if (available) {
            asset = await localSD.generateSprite(params);
          } else {
            throw new Error("Local Stable Diffusion not available");
          }
        } catch (localError) {
          // Fallback to API if local fails
          if (process.env.STABILITY_AI_API_KEY || process.env.STABLE_DIFFUSION_API_KEY) {
            console.warn("Local SD failed, falling back to API:", localError);
            const { createStableDiffusionService } = require('../integrations/multimodal-models/stable-diffusion');
            const sdService = createStableDiffusionService({
              apiKey: process.env.STABILITY_AI_API_KEY || process.env.STABLE_DIFFUSION_API_KEY,
              enableLogging: true
            });
            asset = await sdService.generateSprite(params);
          } else {
            throw new Error(
              `Local Stable Diffusion not available and no API key provided. ` +
              `Install ComfyUI/Automatic1111 or set STABILITY_AI_API_KEY`
            );
          }
        }
      } else {
        // Use API directly
        if (!process.env.STABILITY_AI_API_KEY && !process.env.STABLE_DIFFUSION_API_KEY) {
          throw new Error("STABILITY_AI_API_KEY required when USE_LOCAL_MODELS=false");
        }
        const { createStableDiffusionService } = require('../integrations/multimodal-models/stable-diffusion');
        const sdService = createStableDiffusionService({
          apiKey: process.env.STABILITY_AI_API_KEY || process.env.STABLE_DIFFUSION_API_KEY,
          enableLogging: true
        });
        asset = await sdService.generateSprite(params);
      }
    } else {
      throw new Error(`Generation source ${config.generationSource} not implemented`);
    }

    if (!asset) {
      throw new Error("Asset generation failed");
    }

    // Stage 2: Metadata Extraction
    metadata = extractMetadata(asset);

    // Stage 3: Validation
    if (config.validationEnabled) {
      validation = validateAsset(asset, config.standards);
      
      if (!validation.valid && validation.errors.some(e => e.severity === "error")) {
        errors.push(...validation.errors.filter(e => e.severity === "error").map(e => e.message));
        return {
          stage: "validation",
          asset,
          metadata,
          validation,
          errors
        };
      }
    } else {
      validation = {
        valid: true,
        errors: [],
        warnings: [],
        score: 1.0
      };
    }

    // Stage 4: Code Binding Generation
    if (config.codeBindingEnabled && config.targetFramework && metadata) {
      try {
        codeBindings = generateCodeBindings(metadata, config.targetFramework);
      } catch (error) {
        errors.push(`Code binding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Stage 5: Integration
    if (config.autoIntegrate && asset && codeBindings) {
      try {
        const projectPath = process.cwd();
        integrationPath = await integrateAsset(asset, codeBindings, projectPath);
      } catch (error) {
        errors.push(`Integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      stage: "complete",
      asset,
      metadata: metadata!,
      validation: validation!,
      codeBindings,
      integrationPath,
      errors
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    return {
      stage: "generation",
      asset: asset || {
        type: "sprite",
        data: Buffer.alloc(0),
        metadata: {
          id: "error",
          name: "error",
          dimensions: { width: 0, height: 0 },
          format: "unknown",
          palette: { dominant: [], all: [], count: 0, style: "unknown" },
          tags: [],
          createdAt: new Date().toISOString()
        }
      },
      metadata: metadata || {
        id: "error",
        name: "error",
        category: "sprites",
        filePath: "",
        format: "unknown",
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      },
      validation: validation || {
        valid: false,
        errors: [],
        warnings: [],
        score: 0
      },
      errors
    };
  }
}

/**
 * Validate asset against standards
 */
export function validateAsset(
  asset: GeneratedAsset,
  standards: AssetStandards
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let score = 1.0;

  // Validate format
  if (!standards.allowedFormats.includes(asset.metadata.format)) {
    errors.push({
      type: "format",
      message: `Format ${asset.metadata.format} not in allowed formats: ${standards.allowedFormats.join(', ')}`,
      severity: "error",
      fixable: false
    });
    score -= 0.3;
  }

  // Validate dimensions
  const dimValidation = validateDimensions(
    asset.metadata.dimensions.width,
    asset.metadata.dimensions.height,
    standards.minDimensions.width,
    standards.minDimensions.height,
    standards.maxDimensions.width,
    standards.maxDimensions.height
  );

  if (!dimValidation.valid) {
    errors.push({
      type: "dimension",
      message: dimValidation.error || "Invalid dimensions",
      severity: "error",
      fixable: true,
      suggestedFix: "Resize image to meet dimension requirements"
    });
    score -= 0.3;
  }

  // Validate palette
  if (standards.maxColors && asset.metadata.palette.count > standards.maxColors) {
    errors.push({
      type: "palette",
      message: `Palette has ${asset.metadata.palette.count} colors, max is ${standards.maxColors}`,
      severity: "error",
      fixable: true,
      suggestedFix: "Reduce color count using quantization"
    });
    score -= 0.2;
  }

  // Validate required metadata
  if (standards.requiredMetadata) {
    for (const field of standards.requiredMetadata) {
      if (!(field in asset.metadata)) {
        errors.push({
          type: "metadata",
          message: `Required metadata field missing: ${field}`,
          severity: "error",
          fixable: false
        });
        score -= 0.1;
      }
    }
  }

  // Validate style constraints
  if (standards.styleConstraints) {
    const constraints = standards.styleConstraints;
    
    if (constraints.colorDepth === 8 && asset.metadata.palette.count > 256) {
      warnings.push({
        type: "colorDepth",
        message: `8-bit color depth requires max 256 colors, but palette has ${asset.metadata.palette.count}`,
        suggestion: "Reduce color count or use higher color depth"
      });
      score -= 0.1;
    }

    if (constraints.paletteConsistency && asset.metadata.palette.style === "unknown") {
      warnings.push({
        type: "paletteConsistency",
        message: "Palette style is unknown, consistency cannot be verified",
        suggestion: "Extract palette style from image analysis"
      });
      score -= 0.05;
    }
  }

  // Validate image buffer
  if (Buffer.isBuffer(asset.data)) {
    const bufferValidation = validateImageBuffer(asset.data);
    if (!bufferValidation.valid) {
      errors.push({
        type: "format",
        message: bufferValidation.error || "Invalid image buffer",
        severity: "error",
        fixable: false
      });
      score -= 0.2;
    }
  }

  score = Math.max(0, Math.min(1, score));

  return {
    valid: errors.filter(e => e.severity === "error").length === 0,
    errors,
    warnings,
    score
  };
}

/**
 * Extract metadata from asset
 */
export function extractMetadata(asset: GeneratedAsset): AssetMetadata {
  // Start with existing metadata
  const baseMetadata: AssetMetadata = {
    id: asset.metadata.id,
    name: asset.metadata.name,
    category: "sprites",
    filePath: asset.metadata.filePath || "",
    format: asset.metadata.format,
    version: asset.metadata.version || "1.0.0",
    createdAt: asset.metadata.createdAt,
    modifiedAt: new Date().toISOString()
  };

  // Extract dimensions if available
  if (asset.metadata.dimensions) {
    baseMetadata.dimensions = asset.metadata.dimensions;
  }

  // Extract palette if available
  if (asset.metadata.palette) {
    baseMetadata.palette = asset.metadata.palette;
  }

  // Extract tags if available
  if (asset.metadata.tags) {
    baseMetadata.tags = asset.metadata.tags;
  }

  // Extract frame information if available
  if ('frames' in asset.metadata && Array.isArray(asset.metadata.frames)) {
    baseMetadata.frames = asset.metadata.frames;
  }

  return baseMetadata;
}

/**
 * Generate code bindings
 */
export function generateCodeBindings(
  metadata: AssetMetadata,
  framework: GameFramework
): CodeBinding[] {
  const bindings: CodeBinding[] = [];

  // Generate animation controller if frames exist
  if (metadata.frames && metadata.frames.length > 0) {
    try {
      const animationConfig = {
        spriteSheet: {
          name: metadata.name,
          path: metadata.filePath,
          frameWidth: metadata.dimensions?.width || 32,
          frameHeight: metadata.dimensions?.height || 32
        },
        animations: metadata.frames.map((frame, index) => ({
          key: `frame_${index}`,
          frames: [frame.index],
          frameRate: 10,
          repeat: -1,
          yoyo: false
        })),
        frameRate: 10
      };

      const animationCode = generateAnimationController(framework, animationConfig);
      bindings.push({
        type: "animation-controller",
        framework,
        code: animationCode.code,
        filePath: `src/animations/${metadata.name}Animations.ts`,
        language: animationCode.language
      });
    } catch (error) {
      console.error("Failed to generate animation controller:", error);
    }
  }

  // Generate sprite loader
  try {
    const spriteLoaderCode = generateSpriteLoader(framework, [{
      name: metadata.name,
      path: metadata.filePath,
      frameWidth: metadata.dimensions?.width || 32,
      frameHeight: metadata.dimensions?.height || 32,
      spacing: 0,
      margin: 0
    }]);

    bindings.push({
      type: "sprite-loader",
      framework,
      code: spriteLoaderCode.code,
      filePath: `src/loaders/${metadata.name}Loader.ts`,
      language: spriteLoaderCode.language
    });
  } catch (error) {
    console.error("Failed to generate sprite loader:", error);
  }

  return bindings;
}

/**
 * Integrate asset into project
 */
export async function integrateAsset(
  asset: GeneratedAsset,
  codeBindings: CodeBinding[],
  projectPath: string
): Promise<string> {
  const assetsDir = path.join(projectPath, 'assets', 'sprites');
  const codeDir = path.join(projectPath, 'src');

  // Create directories if they don't exist
  const fs = require('fs/promises');
  await fs.mkdir(assetsDir, { recursive: true });
  
  const assetFileName = `${asset.metadata.name}.${asset.metadata.format}`;
  const assetPath = path.join('assets', 'sprites', assetFileName);
  const fullAssetPath = path.join(projectPath, assetPath);
  
  // Save the asset file
  if (Buffer.isBuffer(asset.data)) {
    await fs.writeFile(fullAssetPath, asset.data);
  }
  
  // Register asset in registry
  try {
    const { createAssetRegistry, registerAsset } = require('../integrations/asset-registry/asset-registry');
    const { generateSpecFromDescription } = require('../integrations/asset-registry/asset-specification');
    
    const registry = await createAssetRegistry(projectPath);
    const spec = generateSpecFromDescription(asset.metadata.id);
    
    const assetEntry = {
      id: asset.metadata.id,
      path: assetPath,
      type: asset.type === 'sprite' ? 'sprite' : asset.type as any,
      spec,
      validated: true,
      lastValidated: new Date(),
      generated: true,
      metadata: asset.metadata,
      references: []
    };
    
    await registerAsset(registry, assetEntry);
  } catch (error) {
    console.warn('Failed to register asset in registry:', error);
  }
  
  return assetPath;
}

/**
 * Type exports
 */
export type {
  PipelineStage,
  ValidationResult,
  AssetStandards,
  PipelineConfig,
  PipelineResult,
  GenerationTemplate
};

