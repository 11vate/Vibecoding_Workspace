/**
 * LAYER 36 — MULTIMODAL CORE
 *
 * Enable Cursor to understand and generate across text, images, code, audio, and video.
 *
 * This layer provides the foundation for multimodal AI capabilities, allowing Cursor
 * to interpret visual assets, generate images, reason across modalities, and bridge
 * the gap between visual assets and code.
 */
/**
 * Modality type
 */
export type Modality = "text" | "image" | "code" | "audio" | "video" | "metadata";
/**
 * Image analysis result
 */
export interface ImageAnalysis {
    description: string;
    detectedObjects: DetectedObject[];
    palette: ColorPalette;
    dimensions: {
        width: number;
        height: number;
    };
    format: string;
    metadata: Record<string, unknown>;
}
/**
 * Detected object in image
 */
export interface DetectedObject {
    type: string;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    confidence: number;
    attributes: Record<string, unknown>;
}
/**
 * Color palette extracted from image
 */
export interface ColorPalette {
    dominant: string[];
    all: string[];
    count: number;
    style: "pixel-art" | "hand-drawn" | "photorealistic" | "vector" | "unknown";
}
/**
 * Sprite sheet analysis
 */
export interface SpriteSheetAnalysis {
    frameCount: number;
    frameDimensions: {
        width: number;
        height: number;
    };
    layout: "grid" | "packed" | "custom";
    gridConfig?: {
        rows: number;
        columns: number;
        cellWidth: number;
        cellHeight: number;
    };
    frames: FrameDefinition[];
    palette: ColorPalette;
    animations: AnimationSequence[];
    metadata: SpriteSheetMetadata;
}
/**
 * Frame definition
 */
export interface FrameDefinition {
    index: number;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    anchor?: {
        x: number;
        y: number;
    };
    duration?: number;
    tags?: string[];
}
/**
 * Animation sequence
 */
export interface AnimationSequence {
    name: string;
    frames: number[];
    loop: boolean;
    timing: number;
    tags: string[];
}
/**
 * Sprite sheet metadata
 */
export interface SpriteSheetMetadata {
    name: string;
    entity: string;
    theme: string;
    resolution: [number, number];
    actions: AnimationAction[];
    palette: string[];
    constraints: AssetConstraints;
}
/**
 * Animation action definition
 */
export interface AnimationAction {
    name: string;
    frames: number;
    loop: boolean;
    timing?: number;
}
/**
 * Asset constraints
 */
export interface AssetConstraints {
    pixelStyle: "crisp" | "smooth" | "antialiased";
    animationSmoothness: "gameReady" | "preview" | "draft";
    colorDepth: 8 | 16 | 24 | 32;
    maxColors?: number;
}
/**
 * Generated asset
 */
export interface GeneratedAsset {
    type: "sprite" | "background" | "icon" | "animation" | "effect";
    data: Buffer | string;
    metadata: AssetMetadata;
    codeBindings?: CodeBinding[];
}
/**
 * Asset metadata
 */
export interface AssetMetadata {
    id: string;
    name: string;
    dimensions: {
        width: number;
        height: number;
    };
    format: string;
    palette: ColorPalette;
    frames?: FrameDefinition[];
    animations?: AnimationSequence[];
    tags: string[];
    createdAt: string;
}
/**
 * Code binding (generated code that uses the asset)
 */
export interface CodeBinding {
    framework: "phaser" | "pixi" | "custom";
    code: string;
    type: "animation" | "loader" | "sprite" | "scene";
    dependencies: string[];
}
/**
 * Multimodal reasoning result
 */
export interface MultimodalReasoning {
    understanding: string;
    connections: ModalityConnection[];
    suggestions: Suggestion[];
    confidence: number;
}
/**
 * Connection between modalities
 */
export interface ModalityConnection {
    from: {
        modality: Modality;
        content: string;
    };
    to: {
        modality: Modality;
        content: string;
    };
    relationship: string;
    strength: number;
}
/**
 * Suggestion from multimodal analysis
 */
export interface Suggestion {
    type: "code" | "asset" | "design" | "optimization";
    description: string;
    priority: "high" | "medium" | "low";
    implementation?: string;
}
/**
 * Image generation parameters
 */
export interface ImageGenerationParams {
    prompt: string;
    style: "pixel-art" | "hand-drawn" | "vector" | "realistic";
    resolution: [number, number];
    palette?: string[];
    constraints?: AssetConstraints;
    seed?: number;
    negativePrompt?: string;
}
/**
 * Sprite generation parameters
 */
export interface SpriteGenerationParams extends ImageGenerationParams {
    entity: string;
    theme: string;
    actions: AnimationAction[];
    frameCount?: number;
    viewAngle?: "top-down" | "side" | "isometric" | "front";
}
/**
 * Main multimodal core configuration
 */
export declare const MULTIMODAL_CORE: {
    /**
     * Image Analysis Capabilities
     */
    readonly imageAnalysis: {
        readonly spriteSheetParsing: {
            readonly description: "Parse sprite sheets to extract frames, animations, and metadata";
            readonly capabilities: readonly ["Detect frame boundaries", "Identify animation sequences", "Extract color palettes", "Detect layout patterns (grid, packed)", "Identify anchor points", "Extract metadata"];
            readonly output: "SpriteSheetAnalysis";
        };
        readonly paletteExtraction: {
            readonly description: "Extract color palettes from images";
            readonly capabilities: readonly ["Identify dominant colors", "Count unique colors", "Detect color style (pixel-art, etc.)", "Suggest palette constraints", "Validate palette limits"];
            readonly output: "ColorPalette";
        };
        readonly objectDetection: {
            readonly description: "Detect objects and regions in images";
            readonly capabilities: readonly ["Identify sprite boundaries", "Detect hitbox regions", "Recognize animation states", "Identify visual elements"];
            readonly output: "DetectedObject[]";
        };
    };
    /**
     * Image Generation Capabilities
     */
    readonly imageGeneration: {
        readonly spriteGeneration: {
            readonly description: "Generate pixel art sprites with metadata";
            readonly parameters: {
                readonly entity: "Entity name/description";
                readonly theme: "Visual theme (cyber-vaporwave, fantasy, etc.)";
                readonly resolution: "Sprite resolution [width, height]";
                readonly actions: "Animation actions with frame counts";
                readonly palette: "Color palette constraints";
                readonly style: "Pixel art style (crisp, smooth)";
                readonly viewAngle: "View angle (top-down, side, isometric)";
            };
            readonly output: "GeneratedAsset with metadata and code bindings";
        };
        readonly backgroundGeneration: {
            readonly description: "Generate game backgrounds";
            readonly parameters: {
                readonly scene: "Scene description";
                readonly mood: "Atmospheric mood";
                readonly colorScheme: "Color scheme";
                readonly tileable: "Whether background should tile";
                readonly resolution: "Background resolution";
            };
            readonly output: "GeneratedAsset";
        };
        readonly animationGeneration: {
            readonly description: "Generate animation frame sequences";
            readonly parameters: {
                readonly baseSprite: "Base sprite or description";
                readonly action: "Animation action";
                readonly frameCount: "Number of frames";
                readonly loop: "Whether animation loops";
                readonly timing: "Frame timing";
            };
            readonly output: "FrameSequence with metadata";
        };
    };
    /**
     * Multimodal Reasoning
     */
    readonly reasoning: {
        readonly spriteToCode: {
            readonly description: "Generate code from sprite sheet analysis";
            readonly process: readonly ["Analyze sprite sheet structure", "Extract frame definitions", "Identify animation sequences", "Generate framework-specific code", "Create code bindings"];
            readonly output: "CodeBinding[]";
        };
        readonly codeToAsset: {
            readonly description: "Understand code requirements and suggest assets";
            readonly process: readonly ["Analyze code structure", "Identify asset requirements", "Suggest asset specifications", "Generate asset generation prompts"];
            readonly output: "AssetGenerationParams[]";
        };
        readonly crossModalUnderstanding: {
            readonly description: "Reason across text, images, and code simultaneously";
            readonly capabilities: readonly ["Connect visual assets to code logic", "Understand semantic relationships", "Suggest improvements", "Validate consistency"];
            readonly output: "MultimodalReasoning";
        };
    };
    /**
     * Audio Capabilities
     */
    readonly audio: {
        readonly understanding: {
            readonly description: "Understand audio files and generate metadata";
            readonly capabilities: readonly ["Extract audio metadata", "Identify sound types (SFX, music, ambience)", "Generate semantic tags", "Suggest usage contexts"];
        };
        readonly generation: {
            readonly description: "Generate audio assets (future capability)";
            readonly note: "Audio generation integration planned for future phases";
        };
    };
    /**
     * Video Capabilities
     */
    readonly video: {
        readonly generation: {
            readonly description: "Generate video previews and animations";
            readonly capabilities: readonly ["Text-to-video generation", "Image-to-video conversion", "Animation preview generation", "Scene preview creation"];
            readonly integration: "Runway Gen-2, Imagen Video APIs";
        };
        readonly analysis: {
            readonly description: "Analyze video content";
            readonly capabilities: readonly ["Extract frames", "Identify animation sequences", "Analyze timing", "Generate metadata"];
        };
    };
    /**
     * Integration Points
     */
    readonly integrations: {
        readonly openaiVision: {
            readonly description: "OpenAI GPT-4 Vision for image understanding";
            readonly capabilities: readonly ["Image analysis", "Visual reasoning", "Object detection"];
        };
        readonly stableDiffusion: {
            readonly description: "Stable Diffusion API for image generation";
            readonly capabilities: readonly ["Text-to-image", "Image-to-image", "Inpainting", "ControlNet"];
        };
        readonly claudeVision: {
            readonly description: "Anthropic Claude 3 Vision for multimodal reasoning";
            readonly capabilities: readonly ["Image understanding", "Multimodal analysis", "Code generation"];
        };
        readonly comfyUI: {
            readonly description: "ComfyUI workflow API for advanced generation";
            readonly capabilities: readonly ["Workflow execution", "Batch generation", "Advanced control"];
        };
        readonly runwayGen2: {
            readonly description: "Runway Gen-2 for video generation";
            readonly capabilities: readonly ["Text-to-video", "Image-to-video", "Video editing"];
        };
    };
    /**
     * Quality Validation
     */
    readonly validation: {
        readonly spriteQuality: {
            readonly checks: readonly ["Palette limit compliance", "Frame alignment", "Transparency handling", "Resolution consistency", "Animation smoothness"];
        };
        readonly codeBindingQuality: {
            readonly checks: readonly ["Framework compatibility", "Code correctness", "Dependency completeness", "Performance optimization"];
        };
        readonly multimodalConsistency: {
            readonly checks: readonly ["Asset-code alignment", "Style consistency", "Metadata accuracy", "Relationship validity"];
        };
    };
};
/**
 * Analyze sprite sheet image
 */
export declare function analyzeSpriteSheet(imageData: Buffer, options?: {
    detectAnimations?: boolean;
    extractPalette?: boolean;
    detectLayout?: boolean;
}): Promise<SpriteSheetAnalysis>;
/**
 * Generate sprite from parameters
 */
export declare function generateSprite(params: SpriteGenerationParams): Promise<GeneratedAsset>;
/**
 * Generate code bindings from sprite sheet
 */
export declare function generateCodeBindings(spriteSheet: SpriteSheetAnalysis, framework: "phaser" | "pixi" | "custom"): Promise<CodeBinding[]>;
/**
 * Perform multimodal reasoning
 */
export declare function performMultimodalReasoning(inputs: Array<{
    modality: Modality;
    content: unknown;
}>, query: string): Promise<MultimodalReasoning>;
/**
 * Extract palette from image
 */
export declare function extractPalette(imageData: Buffer, maxColors?: number): Promise<ColorPalette>;
/**
 * Type exports
 */
export type { ImageAnalysis, SpriteSheetAnalysis, GeneratedAsset, AssetMetadata, CodeBinding, MultimodalReasoning, ImageGenerationParams, SpriteGenerationParams, ColorPalette, FrameDefinition, AnimationSequence };
//# sourceMappingURL=layer-36-multimodal-core.d.ts.map