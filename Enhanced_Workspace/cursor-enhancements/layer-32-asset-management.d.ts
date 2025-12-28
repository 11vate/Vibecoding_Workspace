/**
 * LAYER 32 — ASSET MANAGEMENT & ORGANIZATION
 *
 * Comprehensive asset organization, versioning, and management system
 *
 * This layer provides patterns for organizing assets, managing versions,
 * tracking metadata, optimizing performance, and maintaining asset libraries
 * for efficient game development workflows.
 */
/**
 * Asset category
 */
export type AssetCategory = "sprites" | "backgrounds" | "tiles" | "ui" | "audio" | "fonts" | "data" | "shaders" | "models" | "animations";
/**
 * Asset metadata schema
 */
export interface AssetMetadata {
    id: string;
    name: string;
    category: AssetCategory;
    type: string;
    path: string;
    version: string;
    tags: string[];
    dimensions?: {
        width: number;
        height: number;
    };
    fileSize?: number;
    format: string;
    license?: string;
    source?: string;
    author?: string;
    createdAt: string;
    modifiedAt: string;
    dependencies?: string[];
    usage?: string[];
}
/**
 * Asset organization pattern
 */
export interface AssetOrganizationPattern {
    name: string;
    description: string;
    structure: string[];
    useCases: string[];
    benefits: string[];
}
/**
 * Asset version
 */
export interface AssetVersion {
    version: string;
    timestamp: string;
    changes: string[];
    author?: string;
    notes?: string;
}
/**
 * Main asset management configuration
 */
export declare const ASSET_MANAGEMENT: {
    /**
     * Asset Organization Patterns
     */
    readonly organization: {
        readonly directoryStructure: {
            readonly flat: {
                readonly name: "Flat Structure";
                readonly description: "All assets in single directory";
                readonly structure: readonly ["assets/", "  sprite_character_hero.png", "  sprite_enemy_goblin.png", "  background_forest.png"];
                readonly useCases: readonly ["Small projects", "Simple organization", "Few assets"];
                readonly benefits: readonly ["Simple", "Easy to find", "No nesting"];
            };
            readonly categoryBased: {
                readonly name: "Category-Based Structure";
                readonly description: "Organize by asset category";
                readonly structure: readonly ["assets/", "  sprites/", "    characters/", "    enemies/", "    objects/", "  backgrounds/", "  ui/", "  audio/"];
                readonly useCases: readonly ["Medium projects", "Clear categorization", "Team collaboration"];
                readonly benefits: readonly ["Clear organization", "Easy navigation", "Scalable"];
            };
            readonly typeBased: {
                readonly name: "Type-Based Structure";
                readonly description: "Organize by asset type/format";
                readonly structure: readonly ["assets/", "  images/", "  audio/", "  fonts/", "  data/", "    images/", "      sprites/", "      backgrounds/"];
                readonly useCases: readonly ["Large projects", "Multiple asset types", "Format-specific processing"];
                readonly benefits: readonly ["Format separation", "Processing efficiency", "Tool-specific organization"];
            };
            readonly featureBased: {
                readonly name: "Feature-Based Structure";
                readonly description: "Organize by game feature/screen";
                readonly structure: readonly ["assets/", "  combat/", "  fusion/", "  collection/", "  ui/", "    combat/", "    fusion/"];
                readonly useCases: readonly ["Feature-focused development", "Modular architecture", "Feature isolation"];
                readonly benefits: readonly ["Feature isolation", "Easy feature removal", "Context-based organization"];
            };
            readonly hybrid: {
                readonly name: "Hybrid Structure";
                readonly description: "Combine category and feature organization";
                readonly structure: readonly ["assets/", "  sprites/", "    characters/", "      hero/", "      enemies/", "    objects/", "  backgrounds/", "    combat/", "    fusion/", "  ui/", "    icons/", "    buttons/"];
                readonly useCases: readonly ["Large projects", "Complex organization needs", "Team collaboration"];
                readonly benefits: readonly ["Flexible", "Scalable", "Clear hierarchy"];
            };
        };
        readonly namingConventions: {
            readonly description: "Naming conventions for assets";
            readonly patterns: readonly ["category_type_name_variant.ext", "category-name-variant.ext", "category_type_name.ext (with directory structure)", "PascalCase for categories, camelCase for names", "kebab-case for all (recommended)"];
            readonly rules: readonly ["Use consistent separator (dash, underscore, or camelCase)", "Use lowercase for file names (case-sensitive systems)", "Avoid spaces in file names", "Include relevant descriptors (size, state, animation)", "Use descriptive but concise names", "Maintain consistency across project"];
            readonly examples: readonly ["sprite-character-hero-idle.png", "background-forest-day.jpg", "icon-sword-32.png", "tile-grass-32.png", "audio-music-theme.mp3"];
        };
        readonly categorization: {
            readonly description: "Asset categorization system";
            readonly categories: {
                readonly sprites: readonly ["characters", "enemies", "npcs", "objects", "items", "effects", "particles"];
                readonly backgrounds: readonly ["scenery", "buildings", "sky", "ground", "dungeons", "interiors"];
                readonly tiles: readonly ["terrain", "walls", "floors", "decorative", "collision"];
                readonly ui: readonly ["icons", "buttons", "panels", "frames", "cursors", "fonts"];
                readonly audio: readonly ["music", "sfx", "ambience", "voice"];
                readonly data: readonly ["config", "localization", "levels", "save"];
            };
            readonly tagging: {
                readonly description: "Tag-based categorization";
                readonly tagTypes: readonly ["Category tags (character, enemy, item)", "Style tags (pixel-art, hand-drawn, minimalist)", "Theme tags (fantasy, sci-fi, modern)", "State tags (idle, walking, attacking)", "Size tags (16x16, 32x32, 64x64)", "Usage tags (combat, ui, background)"];
                readonly benefits: readonly ["Flexible categorization", "Multiple categories per asset", "Easy searching", "Dynamic organization"];
            };
        };
        readonly metadata: {
            readonly description: "Asset metadata systems";
            readonly schemas: {
                readonly basic: {
                    readonly description: "Basic metadata schema";
                    readonly fields: readonly ["id", "name", "path", "category", "format", "createdAt"];
                };
                readonly standard: {
                    readonly description: "Standard metadata schema";
                    readonly fields: readonly ["id", "name", "path", "category", "type", "format", "dimensions", "fileSize", "tags", "version", "createdAt", "modifiedAt"];
                };
                readonly full: {
                    readonly description: "Full metadata schema with licensing and usage";
                    readonly fields: readonly ["id", "name", "path", "category", "type", "format", "dimensions", "fileSize", "tags", "version", "license", "source", "author", "dependencies", "usage", "createdAt", "modifiedAt"];
                };
            };
            readonly storage: readonly ["JSON files (per asset or per directory)", "Database (for large projects)", "Asset management system", "Version control metadata"];
        };
        readonly relationships: {
            readonly description: "Asset relationships and dependencies";
            readonly types: readonly ["Parent-child (sprite sheet → individual sprites)", "Variants (original → variations)", "Dependencies (sprite → texture, animation → sprites)", "Usage (asset used in scenes/levels)", "Derived (optimized version of original)"];
            readonly tracking: readonly ["Dependency graphs", "Usage tracking", "Relationship metadata", "Impact analysis for changes"];
        };
    };
    /**
     * Asset Pipeline
     */
    readonly pipeline: {
        readonly import: {
            readonly description: "Asset import workflows";
            readonly steps: readonly ["Receive asset (download, generate, create)", "Validate format and requirements", "Extract metadata", "Process asset (optimize, convert)", "Organize into structure", "Generate metadata", "Register in asset database", "Create preview/thumbnail"];
            readonly validation: readonly ["Format check", "Dimension check", "File size check", "Naming convention check", "Metadata validation"];
        };
        readonly processing: {
            readonly description: "Asset processing pipelines";
            readonly operations: readonly ["Format conversion (PNG → WebP, etc.)", "Size optimization", "Color depth optimization", "Sprite sheet packing", "Atlas generation", "Compression", "Metadata extraction"];
            readonly automation: readonly ["Automated processing on import", "Batch processing scripts", "Watch folders for new assets", "CI/CD integration", "Asset pipeline tools"];
        };
        readonly optimization: {
            readonly description: "Asset optimization automation";
            readonly strategies: readonly ["Automatic compression", "Format optimization", "Size reduction", "Sprite sheet packing", "Texture atlas generation", "Duplicate detection", "Unused asset detection"];
            readonly tools: readonly ["ImageOptim", "TinyPNG", "TexturePacker", "Custom scripts"];
        };
        readonly formatConversion: {
            readonly description: "Format conversion workflows";
            readonly conversions: readonly ["PNG → WebP (for modern browsers)", "JPEG → WebP (for photos)", "PNG → PNG (optimized)", "SVG → PNG (for rasterization)", "Multiple formats for fallbacks"];
            readonly strategies: readonly ["Generate multiple formats", "Progressive enhancement", "Format negotiation", "Fallback chains"];
        };
        readonly dependencyManagement: {
            readonly description: "Manage asset dependencies";
            readonly tracking: readonly ["Track asset dependencies", "Build dependency graphs", "Handle dependency updates", "Detect broken dependencies", "Manage dependency versions"];
            readonly tools: readonly ["Dependency graphs", "Build systems", "Asset bundlers"];
        };
    };
    /**
     * Asset Versioning
     */
    readonly versioning: {
        readonly strategies: {
            readonly semantic: {
                readonly description: "Semantic versioning for assets";
                readonly format: "major.minor.patch (e.g., 1.2.3)";
                readonly major: "Breaking changes (style change, format change)";
                readonly minor: "Additions (new variants, new animations)";
                readonly patch: "Fixes (bug fixes, optimizations)";
            };
            readonly timestamp: {
                readonly description: "Timestamp-based versioning";
                readonly format: "YYYY-MM-DD_HH-MM-SS or timestamp";
                readonly useCases: readonly ["Frequent updates", "Simple versioning", "Temporary assets"];
            };
            readonly hash: {
                readonly description: "Content-based versioning (hash)";
                readonly format: "MD5 or SHA hash of file content";
                readonly useCases: readonly ["Cache busting", "Unique identification", "Duplicate detection"];
            };
        };
        readonly versionControl: {
            readonly description: "Version control for assets";
            readonly strategies: readonly ["Git LFS for large assets", "Asset versioning system", "Version metadata in files", "External version control", "Cloud storage with versioning"];
            readonly bestPractices: readonly ["Track all asset versions", "Document changes in versions", "Maintain change history", "Enable rollback", "Avoid version conflicts"];
        };
        readonly variants: {
            readonly description: "Manage asset variants";
            readonly types: readonly ["Color variants", "Size variants", "Style variants", "Animation variants", "Resolution variants (1x, 2x, 3x)"];
            readonly management: readonly ["Track variant relationships", "Generate variants from base", "Maintain variant consistency", "Update all variants together"];
        };
        readonly abTesting: {
            readonly description: "A/B testing for assets";
            readonly strategies: readonly ["Maintain multiple asset versions", "Test performance impact", "Test user engagement", "Compare variants", "Select best performing"];
            readonly tools: readonly ["A/B testing frameworks", "Analytics integration", "Variant management"];
        };
        readonly rollback: {
            readonly description: "Rollback strategies for assets";
            readonly strategies: readonly ["Maintain previous versions", "Quick rollback mechanism", "Version tagging", "Backup before changes", "Staged rollouts"];
        };
    };
    /**
     * Asset Metadata
     */
    readonly metadata: {
        readonly schemas: {
            readonly standard: {
                readonly id: "Unique identifier";
                readonly name: "Human-readable name";
                readonly category: "Asset category";
                readonly type: "Specific asset type";
                readonly path: "File system path";
                readonly version: "Version string";
                readonly tags: "Array of tags";
                readonly dimensions: "Width and height";
                readonly fileSize: "File size in bytes";
                readonly format: "File format";
                readonly license: "License information";
                readonly source: "Source URL or reference";
                readonly author: "Author name";
                readonly createdAt: "Creation timestamp";
                readonly modifiedAt: "Modification timestamp";
                readonly dependencies: "Array of dependent asset IDs";
                readonly usage: "Array of usage locations";
            };
        };
        readonly tagging: {
            readonly description: "Tag-based metadata system";
            readonly tagCategories: readonly ["Category tags (sprites, backgrounds, ui)", "Style tags (pixel-art, hand-drawn)", "Theme tags (fantasy, sci-fi)", "State tags (idle, walking)", "Size tags (16x16, 32x32)", "Usage tags (combat, ui)", "Quality tags (low, medium, high)", "Status tags (draft, final, deprecated)"];
            readonly benefits: readonly ["Flexible categorization", "Multiple tags per asset", "Easy searching and filtering", "Dynamic organization"];
        };
        readonly search: {
            readonly description: "Asset search and discovery";
            readonly searchMethods: readonly ["Name search", "Tag search", "Category search", "Metadata search", "Full-text search", "Visual search (similarity)"];
            readonly indexing: readonly ["Index metadata", "Index tags", "Index content (if applicable)", "Maintain search index", "Fast search queries"];
        };
        readonly usageTracking: {
            readonly description: "Track asset usage";
            readonly tracking: readonly ["Track where assets are used", "Count usage frequency", "Identify unused assets", "Impact analysis for changes", "Usage statistics"];
            readonly benefits: readonly ["Identify unused assets", "Impact analysis", "Optimization opportunities", "Documentation"];
        };
    };
    /**
     * Asset Libraries
     */
    readonly libraries: {
        readonly componentLibraries: {
            readonly description: "Component libraries for assets";
            readonly patterns: readonly ["Reusable asset components", "Asset templates", "Asset variations", "Asset inheritance"];
            readonly benefits: readonly ["Consistency", "Reusability", "Faster creation", "Easy updates"];
        };
        readonly templates: {
            readonly description: "Asset templates";
            readonly types: readonly ["Sprite templates", "Icon templates", "UI element templates", "Background templates", "Animation templates"];
            readonly usage: readonly ["Start from template", "Customize template", "Maintain template library", "Update templates"];
        };
        readonly reusablePatterns: {
            readonly description: "Reusable asset patterns";
            readonly patterns: readonly ["Common sprite patterns", "Animation patterns", "Effect patterns", "UI patterns"];
            readonly benefits: readonly ["Consistency", "Faster development", "Proven patterns", "Easy maintenance"];
        };
        readonly inheritance: {
            readonly description: "Asset inheritance system";
            readonly patterns: readonly ["Base assets with variations", "Asset families", "Style inheritance", "Component inheritance"];
            readonly benefits: readonly ["Consistency", "Easy updates", "Reduced duplication", "Maintainability"];
        };
    };
    /**
     * Performance Optimization
     */
    readonly performance: {
        readonly bundling: {
            readonly description: "Asset bundling strategies";
            readonly strategies: readonly ["Bundle by feature", "Bundle by screen", "Bundle by category", "Lazy load bundles", "Code splitting for assets"];
            readonly benefits: readonly ["Reduced initial load", "On-demand loading", "Better caching", "Optimized delivery"];
        };
        readonly lazyLoading: {
            readonly description: "Lazy load assets";
            readonly strategies: readonly ["Load on demand", "Load on visibility", "Preload critical assets", "Progressive loading", "Placeholder assets"];
            readonly patterns: readonly ["Image lazy loading", "Audio lazy loading", "Font lazy loading", "Asset bundle lazy loading"];
        };
        readonly compression: {
            readonly description: "Asset compression";
            readonly strategies: readonly ["Format optimization (PNG → WebP)", "Quality optimization", "Size reduction", "Sprite sheet packing", "Texture compression"];
            readonly targets: {
                readonly images: "Optimize file size while maintaining quality";
                readonly audio: "Compress audio files appropriately";
                readonly fonts: "Subset fonts, use font-display";
            };
        };
        readonly spriteSheetOptimization: {
            readonly description: "Optimize sprite sheets";
            readonly strategies: readonly ["Efficient packing algorithms", "Remove unused space", "Power-of-2 dimensions", "Optimal cell sizes", "Group related sprites"];
            readonly tools: readonly ["TexturePacker", "LibGDX TexturePacker", "Custom tools"];
        };
        readonly caching: {
            readonly description: "Asset caching strategies";
            readonly strategies: readonly ["Browser caching (Cache-Control headers)", "Service worker caching", "CDN caching", "Memory caching", "Application-level caching"];
            readonly cacheStrategies: readonly ["Cache-first for static assets", "Network-first for dynamic assets", "Stale-while-revalidate", "Cache with versioning"];
        };
    };
};
/**
 * Validate asset metadata
 */
export declare function validateAssetMetadata(metadata: Partial<AssetMetadata>): {
    valid: boolean;
    errors: string[];
};
/**
 * Get organization pattern by name
 */
export declare function getOrganizationPattern(patternName: string): AssetOrganizationPattern | undefined;
/**
 * Type exports
 */
export type { AssetMetadata, AssetCategory, AssetOrganizationPattern, AssetVersion };
//# sourceMappingURL=layer-32-asset-management.d.ts.map