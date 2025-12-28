/**
 * LAYER 31 — ASSET CREATION & GENERATION
 *
 * Comprehensive asset creation capabilities including AI-assisted generation,
 * procedural generation, and asset design patterns
 *
 * This layer provides patterns, frameworks, and guidelines for creating game
 * assets including sprites, images, animations, and game content using both
 * AI-assisted and procedural generation techniques.
 */
/**
 * Asset type category
 */
export type AssetType = "sprite" | "background" | "tile" | "icon" | "ui" | "effect" | "particle" | "texture" | "material" | "animation";
/**
 * Generation method
 */
export type GenerationMethod = "ai-assisted" | "procedural" | "manual" | "hybrid";
/**
 * Asset generation pattern
 */
export interface AssetGenerationPattern {
    name: string;
    assetType: AssetType;
    method: GenerationMethod;
    description: string;
    workflow: string[];
    tools: string[];
    bestPractices: string[];
}
/**
 * AI prompt template
 */
export interface AIPromptTemplate {
    assetType: AssetType;
    template: string;
    variables: string[];
    examples: string[];
    styleGuidelines: string[];
}
/**
 * Procedural generation algorithm
 */
export interface ProceduralAlgorithm {
    name: string;
    assetType: AssetType;
    description: string;
    algorithm: string[];
    parameters: string[];
    useCases: string[];
}
/**
 * Main asset creation configuration
 */
export declare const ASSET_CREATION: {
    /**
     * AI-Assisted Generation
     */
    readonly aiAssisted: {
        readonly tools: {
            readonly stableDiffusion: {
                readonly name: "Stable Diffusion";
                readonly description: "Open-source text-to-image model";
                readonly useCases: readonly ["Sprite generation", "Texture generation", "Background generation"];
                readonly features: readonly ["Fine-tuning support", "ControlNet", "Style transfer", "Inpainting"];
                readonly integration: "API integration, prompt templates, batch generation";
            };
            readonly dalle: {
                readonly name: "DALL-E";
                readonly description: "OpenAI's text-to-image model";
                readonly useCases: readonly ["High-quality sprites", "Detailed backgrounds", "UI elements"];
                readonly features: readonly ["High quality", "Consistent style", "Detailed output"];
                readonly integration: "OpenAI API, prompt engineering, style consistency";
            };
            readonly midjourney: {
                readonly name: "Midjourney";
                readonly description: "AI art generation focused on aesthetics";
                readonly useCases: readonly ["Artistic sprites", "Beautiful backgrounds", "Concept art"];
                readonly features: "High aesthetic quality, artistic styles";
                readonly integration: "Prompt templates, style parameters, batch processing";
            };
            readonly recraft: {
                readonly name: "Recraft";
                readonly description: "AI design tool for creative workflows";
                readonly useCases: readonly ["Vector graphics", "UI elements", "Icons"];
                readonly features: readonly ["Brand consistency", "Text fidelity", "Layout control"];
                readonly integration: "API integration, style templates";
            };
        };
        readonly promptEngineering: {
            readonly spriteGeneration: {
                readonly assetType: AssetType;
                readonly template: "pixel art sprite, [DESCRIPTION], [STYLE], [COLORS], [SIZE], [POSE], game asset, clean background, transparent";
                readonly variables: readonly ["DESCRIPTION", "STYLE", "COLORS", "SIZE", "POSE"];
                readonly examples: readonly ["pixel art sprite, small cute creature, top-down view, 32x32 pixels, idle pose, game asset, clean background, transparent", "pixel art sprite, fantasy character, side view, 64x64 pixels, walking animation frame, game asset, clean background, transparent"];
                readonly styleGuidelines: readonly ["Specify pixel art style explicitly", "Include size dimensions", "Specify view angle (top-down, side, isometric)", "Request transparent background", "Include pose or animation state", "Specify color palette or theme"];
            };
            readonly backgroundGeneration: {
                readonly assetType: AssetType;
                readonly template: "pixel art background, [SCENE_DESCRIPTION], [MOOD], [COLOR_SCHEME], seamless tiling, game asset";
                readonly variables: readonly ["SCENE_DESCRIPTION", "MOOD", "COLOR_SCHEME"];
                readonly examples: readonly ["pixel art background, forest clearing, peaceful, green and brown tones, seamless tiling, game asset", "pixel art background, dungeon stone wall, dark and moody, grey tones, seamless tiling, game asset"];
                readonly styleGuidelines: readonly ["Specify seamless/tileable for backgrounds", "Include mood and atmosphere", "Specify color scheme", "Include scene description", "Consider parallax layers"];
            };
            readonly iconGeneration: {
                readonly assetType: AssetType;
                readonly template: "pixel art icon, [ITEM], [STYLE], [COLOR], simple, clear, game UI, 16x16 or 32x32";
                readonly variables: readonly ["ITEM", "STYLE", "COLOR"];
                readonly examples: readonly ["pixel art icon, sword, simple outline, silver, clear, game UI, 32x32", "pixel art icon, potion bottle, detailed, blue liquid, game UI, 16x16"];
                readonly styleGuidelines: readonly ["Keep icons simple and recognizable", "Specify exact dimensions", "Use clear outlines", "Ensure readability at small sizes", "Maintain consistency across icon set"];
            };
            readonly textureGeneration: {
                readonly assetType: AssetType;
                readonly template: "pixel art texture, [MATERIAL], [PATTERN], [COLOR], seamless, tileable, game asset";
                readonly variables: readonly ["MATERIAL", "PATTERN", "COLOR"];
                readonly examples: readonly ["pixel art texture, stone, rough surface, grey tones, seamless, tileable, game asset", "pixel art texture, wood, grain pattern, brown tones, seamless, tileable, game asset"];
                readonly styleGuidelines: readonly ["Always specify seamless/tileable", "Include material type", "Specify pattern or surface detail", "Ensure consistent scale", "Test tiling before use"];
            };
        };
        readonly styleConsistency: {
            readonly description: "Maintain consistent style across AI-generated assets";
            readonly strategies: readonly ["Use consistent prompt templates", "Specify style parameters (pixel art, resolution, color depth)", "Create style reference images", "Use seed values for consistency", "Fine-tune models on project style", "Post-process for style uniformity"];
            readonly styleParameters: readonly ["Art style (pixel art, hand-drawn, minimalist)", "Resolution (16x16, 32x32, 64x64, etc.)", "Color palette constraints", "Line style (outlined, filled, soft)", "Shading style (flat, gradient, cel-shaded)", "Detail level (simple, detailed, highly detailed)"];
        };
        readonly refinementWorkflows: {
            readonly description: "Workflows for refining AI-generated assets";
            readonly steps: readonly ["Generate initial asset with AI", "Review against style guide", "Identify needed adjustments", "Refine with inpainting/outpainting", "Post-process for pixel perfection", "Validate against asset standards", "Optimize file size and format"];
            readonly refinementTechniques: readonly ["Inpainting for fixing specific areas", "Outpainting for extending assets", "Style transfer for consistency", "Color adjustment for palette matching", "Pixel-perfect cleanup (manual or automated)", "Size optimization", "Format conversion (PNG, WebP, etc.)"];
        };
        readonly batchGeneration: {
            readonly description: "Generate multiple assets efficiently";
            readonly strategies: readonly ["Use batch API calls", "Template-based generation", "Variation generation", "Parameter sweeps", "Automated processing pipeline"];
            readonly useCases: readonly ["Generate sprite variations", "Create animation frames", "Generate icon sets", "Create tile sets", "Generate particle effects"];
        };
    };
    /**
     * Procedural Generation
     */
    readonly procedural: {
        readonly pixelArt: {
            readonly description: "Procedural pixel art generation algorithms";
            readonly algorithms: readonly ["Shape-based generation (circles, rectangles, polygons)", "Noise-based generation (Perlin noise, simplex noise)", "Pattern-based generation (repeating patterns, symmetry)", "Rule-based generation (cellular automata, L-systems)", "Template-based generation (base shapes, variations)"];
            readonly useCases: readonly ["Sprite generation", "Texture generation", "Pattern generation", "Tile generation", "Effect generation"];
        };
        readonly spriteGeneration: {
            readonly patterns: {
                readonly layeredGeneration: {
                    readonly name: "Layered Sprite Generation";
                    readonly description: "Generate sprites from layered components";
                    readonly algorithm: readonly ["Define base shape", "Add color layers", "Add detail layers", "Add highlight/shadow layers", "Composite layers in order"];
                    readonly parameters: readonly ["Base shape", "Color palette", "Detail level", "Layer order"];
                    readonly useCases: readonly ["Character sprites", "Object sprites", "Modular sprites"];
                };
                readonly tagBasedGeneration: {
                    readonly name: "Tag-Based Sprite Generation";
                    readonly description: "Generate sprites from descriptive tags";
                    readonly algorithm: readonly ["Parse tags", "Map tags to components", "Select components based on tags", "Combine components", "Apply color palette", "Generate final sprite"];
                    readonly parameters: readonly ["Tags", "Component library", "Color palette", "Style rules"];
                    readonly useCases: readonly ["Procedural characters", "Variant generation", "Random sprites"];
                };
            };
        };
        readonly colorPalette: {
            readonly description: "Generate color palettes procedurally";
            readonly algorithms: readonly ["Harmony-based generation (complementary, triadic, analogous)", "Temperature-based (warm, cool, neutral)", "Saturation-based (vibrant, muted, desaturated)", "Brightness-based (light, dark, medium)", "Random with constraints", "From base color"];
            readonly useCases: readonly ["Theme-based palettes", "Mood-based palettes", "Rarity-based palettes", "Family-based palettes"];
        };
        readonly patternGeneration: {
            readonly description: "Generate patterns procedurally";
            readonly algorithms: readonly ["Grid-based patterns", "Noise-based patterns", "Symmetry patterns", "Tiling patterns", "Fractal patterns"];
            readonly useCases: readonly ["Texture generation", "Background generation", "Tile generation", "Decorative elements"];
        };
        readonly textureGeneration: {
            readonly description: "Generate textures procedurally";
            readonly algorithms: readonly ["Noise-based textures", "Voronoi diagrams", "Cellular automata", "Perlin noise", "Worley noise", "Fractal noise"];
            readonly useCases: readonly ["Material textures (stone, wood, metal)", "Natural textures (grass, water, clouds)", "Abstract textures", "Pattern textures"];
        };
    };
    /**
     * Asset Design Patterns
     */
    readonly designPatterns: {
        readonly spriteSheet: {
            readonly description: "Organize sprites in sprite sheets";
            readonly organization: readonly ["Grid layout (uniform cells)", "Packed layout (optimized space)", "Animation frames in rows", "Different states in columns", "Power-of-2 dimensions for GPU efficiency"];
            readonly bestPractices: readonly ["Use uniform cell sizes when possible", "Leave padding between sprites (1-2 pixels)", "Group related animations together", "Use power-of-2 dimensions", "Optimize for memory usage", "Maintain consistent spacing"];
            readonly tools: readonly ["TexturePacker", "Aseprite", "LibGDX TexturePacker", "Custom tools"];
        };
        readonly namingConventions: {
            readonly description: "Naming conventions for assets";
            readonly patterns: readonly ["category_type_variant.ext (e.g., sprite_character_hero_idle.png)", "category-name-variant.ext (e.g., sprite-character-hero-idle.png)", "category/type/variant.ext (directory structure)", "Include size in name for sprites (e.g., icon_sword_32.png)"];
            readonly components: readonly ["Category (sprite, background, icon, etc.)", "Type (character, object, ui, etc.)", "Variant (name, id, animation state, etc.)", "Size (for scalable assets)", "Format/extension"];
            readonly examples: readonly ["sprite_pet_dragon_idle_64.png", "background_forest_day_1024.png", "icon_sword_32.png", "tile_grass_32.png"];
        };
        readonly dimensionStandards: {
            readonly description: "Standard dimensions for different asset types";
            readonly sprites: {
                readonly small: "16x16, 24x24, 32x32";
                readonly medium: "48x48, 64x64";
                readonly large: "96x96, 128x128";
                readonly guidelines: "Use power-of-2 sizes, maintain aspect ratio";
            };
            readonly icons: {
                readonly sizes: "16x16, 24x24, 32x32, 48x48, 64x64";
                readonly guidelines: "Scalable, simple, recognizable";
            };
            readonly backgrounds: {
                readonly sizes: "256x256, 512x512, 1024x1024, 2048x2048";
                readonly guidelines: "Tileable, power-of-2, optimized for memory";
            };
            readonly tiles: {
                readonly sizes: "16x16, 32x32, 64x64";
                readonly guidelines: "Uniform size, tileable, consistent style";
            };
            readonly spriteSheets: {
                readonly sizes: "512x512, 1024x1024, 2048x2048, 4096x4096";
                readonly guidelines: "Power-of-2, optimized packing, efficient memory usage";
            };
        };
        readonly colorDepth: {
            readonly description: "Color depth optimization";
            readonly strategies: readonly ["Indexed color (8-bit) for pixel art", "RGBA (32-bit) for transparency needed", "RGB (24-bit) for opaque assets", "Grayscale (8-bit) for masks/shadows", "1-bit for simple icons"];
            readonly optimization: readonly ["Reduce color palette when possible", "Use dithering for smooth gradients", "Optimize alpha channel usage", "Remove unused colors", "Use color quantization"];
        };
        readonly compression: {
            readonly description: "Asset compression strategies";
            readonly formats: {
                readonly png: "Lossless, supports transparency, good for pixel art";
                readonly webp: "Better compression than PNG, supports transparency, modern browsers";
                readonly jpg: "Lossy, no transparency, good for photos/complex images";
                readonly gif: "Animation support, limited colors, legacy format";
                readonly svg: "Vector format, scalable, good for UI elements";
            };
            readonly strategies: readonly ["PNG for pixel art (lossless)", "WebP for modern browsers (better compression)", "JPEG for photos/complex images (when transparency not needed)", "SVG for scalable UI elements", "Compress with tools (TinyPNG, ImageOptim, etc.)", "Use appropriate quality settings"];
            readonly tools: readonly ["TinyPNG", "ImageOptim", "Squoosh", "OptiPNG", "pngquant"];
        };
    };
    /**
     * Asset Types
     */
    readonly assetTypes: {
        readonly sprites: {
            readonly characters: {
                readonly description: "Character sprites";
                readonly characteristics: readonly ["Multiple animation states", "Consistent style", "Readable at small sizes"];
                readonly generation: readonly ["Layered generation", "Tag-based generation", "AI-assisted with templates"];
            };
            readonly objects: {
                readonly description: "Object sprites";
                readonly characteristics: readonly ["Simple shapes", "Clear silhouette", "Consistent lighting"];
                readonly generation: readonly ["Shape-based generation", "Template-based", "AI-assisted"];
            };
            readonly ui: {
                readonly description: "UI element sprites";
                readonly characteristics: readonly ["Simple and clear", "Consistent style", "Scalable"];
                readonly generation: readonly ["Template-based", "AI-assisted", "Manual creation"];
            };
        };
        readonly backgrounds: {
            readonly description: "Background assets";
            readonly characteristics: readonly ["Tileable or large format", "Atmospheric", "Layered for parallax"];
            readonly generation: readonly ["AI-assisted with seamless prompts", "Procedural noise-based", "Pattern-based"];
            readonly types: readonly ["Scenery", "Buildings", "Sky", "Ground", "Dungeons"];
        };
        readonly tiles: {
            readonly description: "Tile assets for tilemaps";
            readonly characteristics: readonly ["Uniform size", "Tileable edges", "Consistent style"];
            readonly generation: readonly ["Procedural generation", "Template-based", "AI-assisted with tiling prompts"];
            readonly types: readonly ["Terrain tiles", "Wall tiles", "Floor tiles", "Decorative tiles"];
        };
        readonly icons: {
            readonly description: "Icon assets";
            readonly characteristics: readonly ["Simple and recognizable", "Scalable", "Consistent style"];
            readonly generation: readonly ["Template-based", "AI-assisted", "Manual creation"];
            readonly sizes: readonly ["16x16", "24x24", "32x32", "48x48", "64x64"];
        };
        readonly effects: {
            readonly description: "Visual effect assets";
            readonly characteristics: readonly ["Animated sequences", "Transparency", "Dynamic"];
            readonly generation: readonly ["Procedural animation", "Frame sequences", "Particle systems"];
            readonly types: readonly ["Explosions", "Magic effects", "Trails", "Auras", "Sparks"];
        };
        readonly particles: {
            readonly description: "Particle effect assets";
            readonly characteristics: readonly ["Small sprites", "Transparent", "Animatable"];
            readonly generation: readonly ["Procedural generation", "Simple shapes", "Texture-based"];
            readonly types: readonly ["Fire", "Smoke", "Dust", "Stars", "Rain", "Snow"];
        };
        readonly textures: {
            readonly description: "Texture assets";
            readonly characteristics: readonly ["Seamless/tileable", "Consistent scale", "Material appropriate"];
            readonly generation: readonly ["Procedural noise", "AI-assisted", "Pattern-based"];
            readonly types: readonly ["Stone", "Wood", "Metal", "Fabric", "Grass", "Water"];
        };
    };
    /**
     * Generation Workflows
     */
    readonly workflows: {
        readonly batchGeneration: {
            readonly description: "Generate multiple assets in batch";
            readonly steps: readonly ["Define asset requirements", "Create generation template", "Set up batch parameters", "Generate assets", "Validate generated assets", "Process and optimize", "Organize assets"];
            readonly tools: readonly ["Scripts", "Automation tools", "API batch calls", "Custom pipelines"];
        };
        readonly variantGeneration: {
            readonly description: "Generate variations of assets";
            readonly strategies: readonly ["Color variations", "Size variations", "Style variations", "Component variations", "Animation frame variations"];
            readonly useCases: readonly ["Character variations", "Item variations", "Animation sequences", "Theme variations"];
        };
        readonly iterationRefinement: {
            readonly description: "Iterate and refine assets";
            readonly process: readonly ["Generate initial asset", "Review against requirements", "Identify improvements", "Refine or regenerate", "Validate quality", "Finalize asset"];
            readonly refinementTechniques: readonly ["AI refinement (inpainting, outpainting)", "Manual editing", "Style transfer", "Color adjustment", "Pixel-perfect cleanup"];
        };
        readonly qualityValidation: {
            readonly description: "Validate asset quality";
            readonly checks: readonly ["Dimensions match requirements", "Color depth appropriate", "File size within limits", "Style consistency", "Transparency handled correctly", "Tiling works (if applicable)", "Readable at target size", "No artifacts or errors"];
            readonly tools: readonly ["Automated validation scripts", "Visual inspection", "Performance testing"];
        };
    };
};
/**
 * Get AI prompt template for asset type
 */
export declare function getAIPromptTemplate(assetType: AssetType): AIPromptTemplate | undefined;
/**
 * Generate AI prompt from template
 */
export declare function generateAIPrompt(template: AIPromptTemplate, variables: Record<string, string>): string;
/**
 * Get procedural algorithm for asset type
 */
export declare function getProceduralAlgorithm(assetType: AssetType, algorithmName: string): ProceduralAlgorithm | undefined;
/**
 * Type exports
 */
export type { AssetGenerationPattern, AssetType, GenerationMethod, AIPromptTemplate, ProceduralAlgorithm };
//# sourceMappingURL=layer-31-asset-creation.d.ts.map