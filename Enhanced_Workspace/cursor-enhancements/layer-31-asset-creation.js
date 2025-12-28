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
 * Main asset creation configuration
 */
export const ASSET_CREATION = {
    /**
     * AI-Assisted Generation
     */
    aiAssisted: {
        tools: {
            stableDiffusion: {
                name: "Stable Diffusion",
                description: "Open-source text-to-image model",
                useCases: ["Sprite generation", "Texture generation", "Background generation"],
                features: ["Fine-tuning support", "ControlNet", "Style transfer", "Inpainting"],
                integration: "API integration, prompt templates, batch generation"
            },
            dalle: {
                name: "DALL-E",
                description: "OpenAI's text-to-image model",
                useCases: ["High-quality sprites", "Detailed backgrounds", "UI elements"],
                features: ["High quality", "Consistent style", "Detailed output"],
                integration: "OpenAI API, prompt engineering, style consistency"
            },
            midjourney: {
                name: "Midjourney",
                description: "AI art generation focused on aesthetics",
                useCases: ["Artistic sprites", "Beautiful backgrounds", "Concept art"],
                features: "High aesthetic quality, artistic styles",
                integration: "Prompt templates, style parameters, batch processing"
            },
            recraft: {
                name: "Recraft",
                description: "AI design tool for creative workflows",
                useCases: ["Vector graphics", "UI elements", "Icons"],
                features: ["Brand consistency", "Text fidelity", "Layout control"],
                integration: "API integration, style templates"
            }
        },
        promptEngineering: {
            spriteGeneration: {
                assetType: "sprite",
                template: "pixel art sprite, [DESCRIPTION], [STYLE], [COLORS], [SIZE], [POSE], game asset, clean background, transparent",
                variables: ["DESCRIPTION", "STYLE", "COLORS", "SIZE", "POSE"],
                examples: [
                    "pixel art sprite, small cute creature, top-down view, 32x32 pixels, idle pose, game asset, clean background, transparent",
                    "pixel art sprite, fantasy character, side view, 64x64 pixels, walking animation frame, game asset, clean background, transparent"
                ],
                styleGuidelines: [
                    "Specify pixel art style explicitly",
                    "Include size dimensions",
                    "Specify view angle (top-down, side, isometric)",
                    "Request transparent background",
                    "Include pose or animation state",
                    "Specify color palette or theme"
                ]
            },
            backgroundGeneration: {
                assetType: "background",
                template: "pixel art background, [SCENE_DESCRIPTION], [MOOD], [COLOR_SCHEME], seamless tiling, game asset",
                variables: ["SCENE_DESCRIPTION", "MOOD", "COLOR_SCHEME"],
                examples: [
                    "pixel art background, forest clearing, peaceful, green and brown tones, seamless tiling, game asset",
                    "pixel art background, dungeon stone wall, dark and moody, grey tones, seamless tiling, game asset"
                ],
                styleGuidelines: [
                    "Specify seamless/tileable for backgrounds",
                    "Include mood and atmosphere",
                    "Specify color scheme",
                    "Include scene description",
                    "Consider parallax layers"
                ]
            },
            iconGeneration: {
                assetType: "icon",
                template: "pixel art icon, [ITEM], [STYLE], [COLOR], simple, clear, game UI, 16x16 or 32x32",
                variables: ["ITEM", "STYLE", "COLOR"],
                examples: [
                    "pixel art icon, sword, simple outline, silver, clear, game UI, 32x32",
                    "pixel art icon, potion bottle, detailed, blue liquid, game UI, 16x16"
                ],
                styleGuidelines: [
                    "Keep icons simple and recognizable",
                    "Specify exact dimensions",
                    "Use clear outlines",
                    "Ensure readability at small sizes",
                    "Maintain consistency across icon set"
                ]
            },
            textureGeneration: {
                assetType: "texture",
                template: "pixel art texture, [MATERIAL], [PATTERN], [COLOR], seamless, tileable, game asset",
                variables: ["MATERIAL", "PATTERN", "COLOR"],
                examples: [
                    "pixel art texture, stone, rough surface, grey tones, seamless, tileable, game asset",
                    "pixel art texture, wood, grain pattern, brown tones, seamless, tileable, game asset"
                ],
                styleGuidelines: [
                    "Always specify seamless/tileable",
                    "Include material type",
                    "Specify pattern or surface detail",
                    "Ensure consistent scale",
                    "Test tiling before use"
                ]
            }
        },
        styleConsistency: {
            description: "Maintain consistent style across AI-generated assets",
            strategies: [
                "Use consistent prompt templates",
                "Specify style parameters (pixel art, resolution, color depth)",
                "Create style reference images",
                "Use seed values for consistency",
                "Fine-tune models on project style",
                "Post-process for style uniformity"
            ],
            styleParameters: [
                "Art style (pixel art, hand-drawn, minimalist)",
                "Resolution (16x16, 32x32, 64x64, etc.)",
                "Color palette constraints",
                "Line style (outlined, filled, soft)",
                "Shading style (flat, gradient, cel-shaded)",
                "Detail level (simple, detailed, highly detailed)"
            ]
        },
        refinementWorkflows: {
            description: "Workflows for refining AI-generated assets",
            steps: [
                "Generate initial asset with AI",
                "Review against style guide",
                "Identify needed adjustments",
                "Refine with inpainting/outpainting",
                "Post-process for pixel perfection",
                "Validate against asset standards",
                "Optimize file size and format"
            ],
            refinementTechniques: [
                "Inpainting for fixing specific areas",
                "Outpainting for extending assets",
                "Style transfer for consistency",
                "Color adjustment for palette matching",
                "Pixel-perfect cleanup (manual or automated)",
                "Size optimization",
                "Format conversion (PNG, WebP, etc.)"
            ]
        },
        batchGeneration: {
            description: "Generate multiple assets efficiently",
            strategies: [
                "Use batch API calls",
                "Template-based generation",
                "Variation generation",
                "Parameter sweeps",
                "Automated processing pipeline"
            ],
            useCases: [
                "Generate sprite variations",
                "Create animation frames",
                "Generate icon sets",
                "Create tile sets",
                "Generate particle effects"
            ]
        }
    },
    /**
     * Procedural Generation
     */
    procedural: {
        pixelArt: {
            description: "Procedural pixel art generation algorithms",
            algorithms: [
                "Shape-based generation (circles, rectangles, polygons)",
                "Noise-based generation (Perlin noise, simplex noise)",
                "Pattern-based generation (repeating patterns, symmetry)",
                "Rule-based generation (cellular automata, L-systems)",
                "Template-based generation (base shapes, variations)"
            ],
            useCases: [
                "Sprite generation",
                "Texture generation",
                "Pattern generation",
                "Tile generation",
                "Effect generation"
            ]
        },
        spriteGeneration: {
            patterns: {
                layeredGeneration: {
                    name: "Layered Sprite Generation",
                    description: "Generate sprites from layered components",
                    algorithm: [
                        "Define base shape",
                        "Add color layers",
                        "Add detail layers",
                        "Add highlight/shadow layers",
                        "Composite layers in order"
                    ],
                    parameters: ["Base shape", "Color palette", "Detail level", "Layer order"],
                    useCases: ["Character sprites", "Object sprites", "Modular sprites"]
                },
                tagBasedGeneration: {
                    name: "Tag-Based Sprite Generation",
                    description: "Generate sprites from descriptive tags",
                    algorithm: [
                        "Parse tags",
                        "Map tags to components",
                        "Select components based on tags",
                        "Combine components",
                        "Apply color palette",
                        "Generate final sprite"
                    ],
                    parameters: ["Tags", "Component library", "Color palette", "Style rules"],
                    useCases: ["Procedural characters", "Variant generation", "Random sprites"]
                }
            }
        },
        colorPalette: {
            description: "Generate color palettes procedurally",
            algorithms: [
                "Harmony-based generation (complementary, triadic, analogous)",
                "Temperature-based (warm, cool, neutral)",
                "Saturation-based (vibrant, muted, desaturated)",
                "Brightness-based (light, dark, medium)",
                "Random with constraints",
                "From base color"
            ],
            useCases: [
                "Theme-based palettes",
                "Mood-based palettes",
                "Rarity-based palettes",
                "Family-based palettes"
            ]
        },
        patternGeneration: {
            description: "Generate patterns procedurally",
            algorithms: [
                "Grid-based patterns",
                "Noise-based patterns",
                "Symmetry patterns",
                "Tiling patterns",
                "Fractal patterns"
            ],
            useCases: [
                "Texture generation",
                "Background generation",
                "Tile generation",
                "Decorative elements"
            ]
        },
        textureGeneration: {
            description: "Generate textures procedurally",
            algorithms: [
                "Noise-based textures",
                "Voronoi diagrams",
                "Cellular automata",
                "Perlin noise",
                "Worley noise",
                "Fractal noise"
            ],
            useCases: [
                "Material textures (stone, wood, metal)",
                "Natural textures (grass, water, clouds)",
                "Abstract textures",
                "Pattern textures"
            ]
        }
    },
    /**
     * Asset Design Patterns
     */
    designPatterns: {
        spriteSheet: {
            description: "Organize sprites in sprite sheets",
            organization: [
                "Grid layout (uniform cells)",
                "Packed layout (optimized space)",
                "Animation frames in rows",
                "Different states in columns",
                "Power-of-2 dimensions for GPU efficiency"
            ],
            bestPractices: [
                "Use uniform cell sizes when possible",
                "Leave padding between sprites (1-2 pixels)",
                "Group related animations together",
                "Use power-of-2 dimensions",
                "Optimize for memory usage",
                "Maintain consistent spacing"
            ],
            tools: ["TexturePacker", "Aseprite", "LibGDX TexturePacker", "Custom tools"]
        },
        namingConventions: {
            description: "Naming conventions for assets",
            patterns: [
                "category_type_variant.ext (e.g., sprite_character_hero_idle.png)",
                "category-name-variant.ext (e.g., sprite-character-hero-idle.png)",
                "category/type/variant.ext (directory structure)",
                "Include size in name for sprites (e.g., icon_sword_32.png)"
            ],
            components: [
                "Category (sprite, background, icon, etc.)",
                "Type (character, object, ui, etc.)",
                "Variant (name, id, animation state, etc.)",
                "Size (for scalable assets)",
                "Format/extension"
            ],
            examples: [
                "sprite_pet_dragon_idle_64.png",
                "background_forest_day_1024.png",
                "icon_sword_32.png",
                "tile_grass_32.png"
            ]
        },
        dimensionStandards: {
            description: "Standard dimensions for different asset types",
            sprites: {
                small: "16x16, 24x24, 32x32",
                medium: "48x48, 64x64",
                large: "96x96, 128x128",
                guidelines: "Use power-of-2 sizes, maintain aspect ratio"
            },
            icons: {
                sizes: "16x16, 24x24, 32x32, 48x48, 64x64",
                guidelines: "Scalable, simple, recognizable"
            },
            backgrounds: {
                sizes: "256x256, 512x512, 1024x1024, 2048x2048",
                guidelines: "Tileable, power-of-2, optimized for memory"
            },
            tiles: {
                sizes: "16x16, 32x32, 64x64",
                guidelines: "Uniform size, tileable, consistent style"
            },
            spriteSheets: {
                sizes: "512x512, 1024x1024, 2048x2048, 4096x4096",
                guidelines: "Power-of-2, optimized packing, efficient memory usage"
            }
        },
        colorDepth: {
            description: "Color depth optimization",
            strategies: [
                "Indexed color (8-bit) for pixel art",
                "RGBA (32-bit) for transparency needed",
                "RGB (24-bit) for opaque assets",
                "Grayscale (8-bit) for masks/shadows",
                "1-bit for simple icons"
            ],
            optimization: [
                "Reduce color palette when possible",
                "Use dithering for smooth gradients",
                "Optimize alpha channel usage",
                "Remove unused colors",
                "Use color quantization"
            ]
        },
        compression: {
            description: "Asset compression strategies",
            formats: {
                png: "Lossless, supports transparency, good for pixel art",
                webp: "Better compression than PNG, supports transparency, modern browsers",
                jpg: "Lossy, no transparency, good for photos/complex images",
                gif: "Animation support, limited colors, legacy format",
                svg: "Vector format, scalable, good for UI elements"
            },
            strategies: [
                "PNG for pixel art (lossless)",
                "WebP for modern browsers (better compression)",
                "JPEG for photos/complex images (when transparency not needed)",
                "SVG for scalable UI elements",
                "Compress with tools (TinyPNG, ImageOptim, etc.)",
                "Use appropriate quality settings"
            ],
            tools: ["TinyPNG", "ImageOptim", "Squoosh", "OptiPNG", "pngquant"]
        }
    },
    /**
     * Asset Types
     */
    assetTypes: {
        sprites: {
            characters: {
                description: "Character sprites",
                characteristics: ["Multiple animation states", "Consistent style", "Readable at small sizes"],
                generation: ["Layered generation", "Tag-based generation", "AI-assisted with templates"]
            },
            objects: {
                description: "Object sprites",
                characteristics: ["Simple shapes", "Clear silhouette", "Consistent lighting"],
                generation: ["Shape-based generation", "Template-based", "AI-assisted"]
            },
            ui: {
                description: "UI element sprites",
                characteristics: ["Simple and clear", "Consistent style", "Scalable"],
                generation: ["Template-based", "AI-assisted", "Manual creation"]
            }
        },
        backgrounds: {
            description: "Background assets",
            characteristics: ["Tileable or large format", "Atmospheric", "Layered for parallax"],
            generation: ["AI-assisted with seamless prompts", "Procedural noise-based", "Pattern-based"],
            types: ["Scenery", "Buildings", "Sky", "Ground", "Dungeons"]
        },
        tiles: {
            description: "Tile assets for tilemaps",
            characteristics: ["Uniform size", "Tileable edges", "Consistent style"],
            generation: ["Procedural generation", "Template-based", "AI-assisted with tiling prompts"],
            types: ["Terrain tiles", "Wall tiles", "Floor tiles", "Decorative tiles"]
        },
        icons: {
            description: "Icon assets",
            characteristics: ["Simple and recognizable", "Scalable", "Consistent style"],
            generation: ["Template-based", "AI-assisted", "Manual creation"],
            sizes: ["16x16", "24x24", "32x32", "48x48", "64x64"]
        },
        effects: {
            description: "Visual effect assets",
            characteristics: ["Animated sequences", "Transparency", "Dynamic"],
            generation: ["Procedural animation", "Frame sequences", "Particle systems"],
            types: ["Explosions", "Magic effects", "Trails", "Auras", "Sparks"]
        },
        particles: {
            description: "Particle effect assets",
            characteristics: ["Small sprites", "Transparent", "Animatable"],
            generation: ["Procedural generation", "Simple shapes", "Texture-based"],
            types: ["Fire", "Smoke", "Dust", "Stars", "Rain", "Snow"]
        },
        textures: {
            description: "Texture assets",
            characteristics: ["Seamless/tileable", "Consistent scale", "Material appropriate"],
            generation: ["Procedural noise", "AI-assisted", "Pattern-based"],
            types: ["Stone", "Wood", "Metal", "Fabric", "Grass", "Water"]
        }
    },
    /**
     * Generation Workflows
     */
    workflows: {
        batchGeneration: {
            description: "Generate multiple assets in batch",
            steps: [
                "Define asset requirements",
                "Create generation template",
                "Set up batch parameters",
                "Generate assets",
                "Validate generated assets",
                "Process and optimize",
                "Organize assets"
            ],
            tools: ["Scripts", "Automation tools", "API batch calls", "Custom pipelines"]
        },
        variantGeneration: {
            description: "Generate variations of assets",
            strategies: [
                "Color variations",
                "Size variations",
                "Style variations",
                "Component variations",
                "Animation frame variations"
            ],
            useCases: [
                "Character variations",
                "Item variations",
                "Animation sequences",
                "Theme variations"
            ]
        },
        iterationRefinement: {
            description: "Iterate and refine assets",
            process: [
                "Generate initial asset",
                "Review against requirements",
                "Identify improvements",
                "Refine or regenerate",
                "Validate quality",
                "Finalize asset"
            ],
            refinementTechniques: [
                "AI refinement (inpainting, outpainting)",
                "Manual editing",
                "Style transfer",
                "Color adjustment",
                "Pixel-perfect cleanup"
            ]
        },
        qualityValidation: {
            description: "Validate asset quality",
            checks: [
                "Dimensions match requirements",
                "Color depth appropriate",
                "File size within limits",
                "Style consistency",
                "Transparency handled correctly",
                "Tiling works (if applicable)",
                "Readable at target size",
                "No artifacts or errors"
            ],
            tools: ["Automated validation scripts", "Visual inspection", "Performance testing"]
        }
    }
};
/**
 * Get AI prompt template for asset type
 */
export function getAIPromptTemplate(assetType) {
    const templates = ASSET_CREATION.aiAssisted.promptEngineering;
    return templates[`${assetType}Generation`];
}
/**
 * Generate AI prompt from template
 */
export function generateAIPrompt(template, variables) {
    let prompt = template.template;
    template.variables.forEach(variable => {
        const value = variables[variable] || `[${variable}]`;
        prompt = prompt.replace(`[${variable}]`, value);
    });
    return prompt;
}
/**
 * Get procedural algorithm for asset type
 */
export function getProceduralAlgorithm(assetType, algorithmName) {
    // Return procedural algorithm by asset type and name
    // This is a placeholder - would search through algorithms
    return undefined;
}
//# sourceMappingURL=layer-31-asset-creation.js.map