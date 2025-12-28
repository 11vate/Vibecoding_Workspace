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
/**
 * Pipeline stage
 */
export type PipelineStage = "generation" | "validation" | "metadata-extraction" | "code-binding" | "integration" | "complete";
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
    score: number;
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
    minDimensions: {
        width: number;
        height: number;
    };
    maxDimensions: {
        width: number;
        height: number;
    };
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
export declare const ASSET_PIPELINE: {
    /**
     * Pipeline Stages
     */
    readonly stages: {
        readonly generation: {
            readonly description: "Generate asset using AI or procedural methods";
            readonly inputs: readonly ["GenerationParams", "Template"];
            readonly outputs: readonly ["RawAsset"];
            readonly validators: readonly [];
        };
        readonly validation: {
            readonly description: "Validate asset against quality standards";
            readonly inputs: readonly ["RawAsset", "AssetStandards"];
            readonly outputs: readonly ["ValidationResult"];
            readonly validators: readonly ["paletteCheck", "dimensionCheck", "formatCheck", "metadataCheck", "qualityCheck"];
        };
        readonly metadataExtraction: {
            readonly description: "Extract metadata from generated asset";
            readonly inputs: readonly ["ValidatedAsset"];
            readonly outputs: readonly ["AssetMetadata"];
            readonly extractors: readonly ["dimensionExtractor", "paletteExtractor", "frameExtractor", "animationExtractor"];
        };
        readonly codeBinding: {
            readonly description: "Generate framework-specific code bindings";
            readonly inputs: readonly ["AssetMetadata", "TargetFramework"];
            readonly outputs: readonly ["CodeBinding[]"];
            readonly generators: readonly ["animationControllerGenerator", "spriteLoaderGenerator", "assetManagerGenerator"];
        };
        readonly integration: {
            readonly description: "Integrate asset into project structure";
            readonly inputs: readonly ["Asset", "CodeBindings", "ProjectStructure"];
            readonly outputs: readonly ["IntegrationPath"];
            readonly actions: readonly ["organizeAssets", "updateImports", "registerAssets", "updateDocumentation"];
        };
    };
    /**
     * Validation Checks
     */
    readonly validation: {
        readonly paletteCheck: {
            readonly description: "Validate color palette constraints";
            readonly checks: readonly ["Max color count", "Palette consistency", "Color depth compliance"];
            readonly threshold: 0.8;
        };
        readonly dimensionCheck: {
            readonly description: "Validate asset dimensions";
            readonly checks: readonly ["Within min/max bounds", "Power-of-2 (if required)", "Aspect ratio consistency"];
            readonly threshold: 1;
        };
        readonly formatCheck: {
            readonly description: "Validate file format";
            readonly checks: readonly ["Format compatibility", "Transparency support", "Compression quality"];
            readonly threshold: 1;
        };
        readonly metadataCheck: {
            readonly description: "Validate metadata completeness";
            readonly checks: readonly ["Required fields present", "Data types correct", "Values within ranges"];
            readonly threshold: 1;
        };
        readonly qualityCheck: {
            readonly description: "Validate visual quality";
            readonly checks: readonly ["No artifacts", "Proper transparency", "Frame alignment", "Animation smoothness"];
            readonly threshold: 0.7;
        };
    };
    /**
     * Metadata Extractors
     */
    readonly extractors: {
        readonly dimensionExtractor: {
            readonly description: "Extract dimensions from image";
            readonly method: "Image analysis";
        };
        readonly paletteExtractor: {
            readonly description: "Extract color palette";
            readonly method: "Color quantization and analysis";
        };
        readonly frameExtractor: {
            readonly description: "Extract frame definitions from sprite sheet";
            readonly method: "Grid detection or metadata parsing";
        };
        readonly animationExtractor: {
            readonly description: "Extract animation sequences";
            readonly method: "Pattern recognition or metadata";
        };
    };
    /**
     * Code Binding Generators
     */
    readonly codeGenerators: {
        readonly animationControllerGenerator: {
            readonly description: "Generate animation controller code";
            readonly frameworks: readonly ["phaser", "pixi", "custom"];
            readonly inputs: readonly ["SpriteSheetMetadata", "AnimationDefinitions"];
        };
        readonly spriteLoaderGenerator: {
            readonly description: "Generate sprite loader code";
            readonly frameworks: readonly ["phaser", "pixi", "monogame"];
            readonly inputs: readonly ["AssetMetadata", "ProjectStructure"];
        };
        readonly assetManagerGenerator: {
            readonly description: "Generate asset manager code";
            readonly frameworks: readonly ["phaser", "custom"];
            readonly inputs: readonly ["AssetList", "LoadingStrategy"];
        };
    };
    /**
     * Integration Actions
     */
    readonly integration: {
        readonly organizeAssets: {
            readonly description: "Organize assets into project structure";
            readonly strategy: "Follow Layer 32 (Asset Management) patterns";
        };
        readonly updateImports: {
            readonly description: "Update import statements";
            readonly strategy: "Add to appropriate import files";
        };
        readonly registerAssets: {
            readonly description: "Register assets in asset registry";
            readonly strategy: "Update asset manifest or registry";
        };
        readonly updateDocumentation: {
            readonly description: "Update project documentation";
            readonly strategy: "Add to asset documentation";
        };
    };
    /**
     * Parametric Templates
     */
    readonly templates: {
        readonly sprite: {
            readonly description: "Parametric sprite generation template";
            readonly parameters: readonly [{
                readonly name: "entity";
                readonly type: "string";
                readonly required: true;
                readonly description: "Entity name (e.g., 'Fire Pet', 'Hero')";
            }, {
                readonly name: "theme";
                readonly type: "string";
                readonly required: true;
                readonly description: "Visual theme (e.g., 'cyber-vaporwave', 'fantasy')";
            }, {
                readonly name: "resolution";
                readonly type: "enum";
                readonly required: true;
                readonly options: readonly ["16x16", "32x32", "64x64", "128x128"];
                readonly description: "Sprite resolution";
            }, {
                readonly name: "actions";
                readonly type: "enum";
                readonly required: false;
                readonly options: readonly ["idle", "walk", "attack", "death"];
                readonly description: "Animation actions";
            }];
        };
        readonly background: {
            readonly description: "Parametric background generation template";
            readonly parameters: readonly [{
                readonly name: "scene";
                readonly type: "string";
                readonly required: true;
                readonly description: "Scene description";
            }, {
                readonly name: "mood";
                readonly type: "enum";
                readonly required: true;
                readonly options: readonly ["peaceful", "dark", "energetic", "mysterious"];
                readonly description: "Atmospheric mood";
            }, {
                readonly name: "tileable";
                readonly type: "boolean";
                readonly required: false;
                readonly default: true;
                readonly description: "Whether background should tile";
            }];
        };
    };
};
/**
 * Execute asset pipeline
 */
export declare function executePipeline(params: SpriteGenerationParams, config: PipelineConfig): Promise<PipelineResult>;
/**
 * Validate asset against standards
 */
export declare function validateAsset(asset: GeneratedAsset, standards: AssetStandards): ValidationResult;
/**
 * Extract metadata from asset
 */
export declare function extractMetadata(asset: GeneratedAsset): AssetMetadata;
/**
 * Generate code bindings
 */
export declare function generateCodeBindings(metadata: AssetMetadata, framework: GameFramework): CodeBinding[];
/**
 * Integrate asset into project
 */
export declare function integrateAsset(asset: GeneratedAsset, codeBindings: CodeBinding[], projectPath: string): Promise<string>;
/**
 * Type exports
 */
export type { PipelineStage, ValidationResult, AssetStandards, PipelineConfig, PipelineResult, GenerationTemplate };
//# sourceMappingURL=layer-39-asset-pipeline.d.ts.map