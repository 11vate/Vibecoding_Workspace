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
 * Main asset management configuration
 */
export const ASSET_MANAGEMENT = {
    /**
     * Asset Organization Patterns
     */
    organization: {
        directoryStructure: {
            flat: {
                name: "Flat Structure",
                description: "All assets in single directory",
                structure: [
                    "assets/",
                    "  sprite_character_hero.png",
                    "  sprite_enemy_goblin.png",
                    "  background_forest.png"
                ],
                useCases: ["Small projects", "Simple organization", "Few assets"],
                benefits: ["Simple", "Easy to find", "No nesting"]
            },
            categoryBased: {
                name: "Category-Based Structure",
                description: "Organize by asset category",
                structure: [
                    "assets/",
                    "  sprites/",
                    "    characters/",
                    "    enemies/",
                    "    objects/",
                    "  backgrounds/",
                    "  ui/",
                    "  audio/"
                ],
                useCases: ["Medium projects", "Clear categorization", "Team collaboration"],
                benefits: ["Clear organization", "Easy navigation", "Scalable"]
            },
            typeBased: {
                name: "Type-Based Structure",
                description: "Organize by asset type/format",
                structure: [
                    "assets/",
                    "  images/",
                    "  audio/",
                    "  fonts/",
                    "  data/",
                    "    images/",
                    "      sprites/",
                    "      backgrounds/"
                ],
                useCases: ["Large projects", "Multiple asset types", "Format-specific processing"],
                benefits: ["Format separation", "Processing efficiency", "Tool-specific organization"]
            },
            featureBased: {
                name: "Feature-Based Structure",
                description: "Organize by game feature/screen",
                structure: [
                    "assets/",
                    "  combat/",
                    "  fusion/",
                    "  collection/",
                    "  ui/",
                    "    combat/",
                    "    fusion/"
                ],
                useCases: ["Feature-focused development", "Modular architecture", "Feature isolation"],
                benefits: ["Feature isolation", "Easy feature removal", "Context-based organization"]
            },
            hybrid: {
                name: "Hybrid Structure",
                description: "Combine category and feature organization",
                structure: [
                    "assets/",
                    "  sprites/",
                    "    characters/",
                    "      hero/",
                    "      enemies/",
                    "    objects/",
                    "  backgrounds/",
                    "    combat/",
                    "    fusion/",
                    "  ui/",
                    "    icons/",
                    "    buttons/"
                ],
                useCases: ["Large projects", "Complex organization needs", "Team collaboration"],
                benefits: ["Flexible", "Scalable", "Clear hierarchy"]
            }
        },
        namingConventions: {
            description: "Naming conventions for assets",
            patterns: [
                "category_type_name_variant.ext",
                "category-name-variant.ext",
                "category_type_name.ext (with directory structure)",
                "PascalCase for categories, camelCase for names",
                "kebab-case for all (recommended)"
            ],
            rules: [
                "Use consistent separator (dash, underscore, or camelCase)",
                "Use lowercase for file names (case-sensitive systems)",
                "Avoid spaces in file names",
                "Include relevant descriptors (size, state, animation)",
                "Use descriptive but concise names",
                "Maintain consistency across project"
            ],
            examples: [
                "sprite-character-hero-idle.png",
                "background-forest-day.jpg",
                "icon-sword-32.png",
                "tile-grass-32.png",
                "audio-music-theme.mp3"
            ]
        },
        categorization: {
            description: "Asset categorization system",
            categories: {
                sprites: ["characters", "enemies", "npcs", "objects", "items", "effects", "particles"],
                backgrounds: ["scenery", "buildings", "sky", "ground", "dungeons", "interiors"],
                tiles: ["terrain", "walls", "floors", "decorative", "collision"],
                ui: ["icons", "buttons", "panels", "frames", "cursors", "fonts"],
                audio: ["music", "sfx", "ambience", "voice"],
                data: ["config", "localization", "levels", "save"]
            },
            tagging: {
                description: "Tag-based categorization",
                tagTypes: [
                    "Category tags (character, enemy, item)",
                    "Style tags (pixel-art, hand-drawn, minimalist)",
                    "Theme tags (fantasy, sci-fi, modern)",
                    "State tags (idle, walking, attacking)",
                    "Size tags (16x16, 32x32, 64x64)",
                    "Usage tags (combat, ui, background)"
                ],
                benefits: [
                    "Flexible categorization",
                    "Multiple categories per asset",
                    "Easy searching",
                    "Dynamic organization"
                ]
            }
        },
        metadata: {
            description: "Asset metadata systems",
            schemas: {
                basic: {
                    description: "Basic metadata schema",
                    fields: ["id", "name", "path", "category", "format", "createdAt"]
                },
                standard: {
                    description: "Standard metadata schema",
                    fields: [
                        "id", "name", "path", "category", "type", "format",
                        "dimensions", "fileSize", "tags", "version", "createdAt", "modifiedAt"
                    ]
                },
                full: {
                    description: "Full metadata schema with licensing and usage",
                    fields: [
                        "id", "name", "path", "category", "type", "format",
                        "dimensions", "fileSize", "tags", "version",
                        "license", "source", "author",
                        "dependencies", "usage", "createdAt", "modifiedAt"
                    ]
                }
            },
            storage: [
                "JSON files (per asset or per directory)",
                "Database (for large projects)",
                "Asset management system",
                "Version control metadata"
            ]
        },
        relationships: {
            description: "Asset relationships and dependencies",
            types: [
                "Parent-child (sprite sheet → individual sprites)",
                "Variants (original → variations)",
                "Dependencies (sprite → texture, animation → sprites)",
                "Usage (asset used in scenes/levels)",
                "Derived (optimized version of original)"
            ],
            tracking: [
                "Dependency graphs",
                "Usage tracking",
                "Relationship metadata",
                "Impact analysis for changes"
            ]
        }
    },
    /**
     * Asset Pipeline
     */
    pipeline: {
        import: {
            description: "Asset import workflows",
            steps: [
                "Receive asset (download, generate, create)",
                "Validate format and requirements",
                "Extract metadata",
                "Process asset (optimize, convert)",
                "Organize into structure",
                "Generate metadata",
                "Register in asset database",
                "Create preview/thumbnail"
            ],
            validation: [
                "Format check",
                "Dimension check",
                "File size check",
                "Naming convention check",
                "Metadata validation"
            ]
        },
        processing: {
            description: "Asset processing pipelines",
            operations: [
                "Format conversion (PNG → WebP, etc.)",
                "Size optimization",
                "Color depth optimization",
                "Sprite sheet packing",
                "Atlas generation",
                "Compression",
                "Metadata extraction"
            ],
            automation: [
                "Automated processing on import",
                "Batch processing scripts",
                "Watch folders for new assets",
                "CI/CD integration",
                "Asset pipeline tools"
            ]
        },
        optimization: {
            description: "Asset optimization automation",
            strategies: [
                "Automatic compression",
                "Format optimization",
                "Size reduction",
                "Sprite sheet packing",
                "Texture atlas generation",
                "Duplicate detection",
                "Unused asset detection"
            ],
            tools: ["ImageOptim", "TinyPNG", "TexturePacker", "Custom scripts"]
        },
        formatConversion: {
            description: "Format conversion workflows",
            conversions: [
                "PNG → WebP (for modern browsers)",
                "JPEG → WebP (for photos)",
                "PNG → PNG (optimized)",
                "SVG → PNG (for rasterization)",
                "Multiple formats for fallbacks"
            ],
            strategies: [
                "Generate multiple formats",
                "Progressive enhancement",
                "Format negotiation",
                "Fallback chains"
            ]
        },
        dependencyManagement: {
            description: "Manage asset dependencies",
            tracking: [
                "Track asset dependencies",
                "Build dependency graphs",
                "Handle dependency updates",
                "Detect broken dependencies",
                "Manage dependency versions"
            ],
            tools: ["Dependency graphs", "Build systems", "Asset bundlers"]
        }
    },
    /**
     * Asset Versioning
     */
    versioning: {
        strategies: {
            semantic: {
                description: "Semantic versioning for assets",
                format: "major.minor.patch (e.g., 1.2.3)",
                major: "Breaking changes (style change, format change)",
                minor: "Additions (new variants, new animations)",
                patch: "Fixes (bug fixes, optimizations)"
            },
            timestamp: {
                description: "Timestamp-based versioning",
                format: "YYYY-MM-DD_HH-MM-SS or timestamp",
                useCases: ["Frequent updates", "Simple versioning", "Temporary assets"]
            },
            hash: {
                description: "Content-based versioning (hash)",
                format: "MD5 or SHA hash of file content",
                useCases: ["Cache busting", "Unique identification", "Duplicate detection"]
            }
        },
        versionControl: {
            description: "Version control for assets",
            strategies: [
                "Git LFS for large assets",
                "Asset versioning system",
                "Version metadata in files",
                "External version control",
                "Cloud storage with versioning"
            ],
            bestPractices: [
                "Track all asset versions",
                "Document changes in versions",
                "Maintain change history",
                "Enable rollback",
                "Avoid version conflicts"
            ]
        },
        variants: {
            description: "Manage asset variants",
            types: [
                "Color variants",
                "Size variants",
                "Style variants",
                "Animation variants",
                "Resolution variants (1x, 2x, 3x)"
            ],
            management: [
                "Track variant relationships",
                "Generate variants from base",
                "Maintain variant consistency",
                "Update all variants together"
            ]
        },
        abTesting: {
            description: "A/B testing for assets",
            strategies: [
                "Maintain multiple asset versions",
                "Test performance impact",
                "Test user engagement",
                "Compare variants",
                "Select best performing"
            ],
            tools: ["A/B testing frameworks", "Analytics integration", "Variant management"]
        },
        rollback: {
            description: "Rollback strategies for assets",
            strategies: [
                "Maintain previous versions",
                "Quick rollback mechanism",
                "Version tagging",
                "Backup before changes",
                "Staged rollouts"
            ]
        }
    },
    /**
     * Asset Metadata
     */
    metadata: {
        schemas: {
            standard: {
                id: "Unique identifier",
                name: "Human-readable name",
                category: "Asset category",
                type: "Specific asset type",
                path: "File system path",
                version: "Version string",
                tags: "Array of tags",
                dimensions: "Width and height",
                fileSize: "File size in bytes",
                format: "File format",
                license: "License information",
                source: "Source URL or reference",
                author: "Author name",
                createdAt: "Creation timestamp",
                modifiedAt: "Modification timestamp",
                dependencies: "Array of dependent asset IDs",
                usage: "Array of usage locations"
            }
        },
        tagging: {
            description: "Tag-based metadata system",
            tagCategories: [
                "Category tags (sprites, backgrounds, ui)",
                "Style tags (pixel-art, hand-drawn)",
                "Theme tags (fantasy, sci-fi)",
                "State tags (idle, walking)",
                "Size tags (16x16, 32x32)",
                "Usage tags (combat, ui)",
                "Quality tags (low, medium, high)",
                "Status tags (draft, final, deprecated)"
            ],
            benefits: [
                "Flexible categorization",
                "Multiple tags per asset",
                "Easy searching and filtering",
                "Dynamic organization"
            ]
        },
        search: {
            description: "Asset search and discovery",
            searchMethods: [
                "Name search",
                "Tag search",
                "Category search",
                "Metadata search",
                "Full-text search",
                "Visual search (similarity)"
            ],
            indexing: [
                "Index metadata",
                "Index tags",
                "Index content (if applicable)",
                "Maintain search index",
                "Fast search queries"
            ]
        },
        usageTracking: {
            description: "Track asset usage",
            tracking: [
                "Track where assets are used",
                "Count usage frequency",
                "Identify unused assets",
                "Impact analysis for changes",
                "Usage statistics"
            ],
            benefits: [
                "Identify unused assets",
                "Impact analysis",
                "Optimization opportunities",
                "Documentation"
            ]
        }
    },
    /**
     * Asset Libraries
     */
    libraries: {
        componentLibraries: {
            description: "Component libraries for assets",
            patterns: [
                "Reusable asset components",
                "Asset templates",
                "Asset variations",
                "Asset inheritance"
            ],
            benefits: [
                "Consistency",
                "Reusability",
                "Faster creation",
                "Easy updates"
            ]
        },
        templates: {
            description: "Asset templates",
            types: [
                "Sprite templates",
                "Icon templates",
                "UI element templates",
                "Background templates",
                "Animation templates"
            ],
            usage: [
                "Start from template",
                "Customize template",
                "Maintain template library",
                "Update templates"
            ]
        },
        reusablePatterns: {
            description: "Reusable asset patterns",
            patterns: [
                "Common sprite patterns",
                "Animation patterns",
                "Effect patterns",
                "UI patterns"
            ],
            benefits: [
                "Consistency",
                "Faster development",
                "Proven patterns",
                "Easy maintenance"
            ]
        },
        inheritance: {
            description: "Asset inheritance system",
            patterns: [
                "Base assets with variations",
                "Asset families",
                "Style inheritance",
                "Component inheritance"
            ],
            benefits: [
                "Consistency",
                "Easy updates",
                "Reduced duplication",
                "Maintainability"
            ]
        }
    },
    /**
     * Performance Optimization
     */
    performance: {
        bundling: {
            description: "Asset bundling strategies",
            strategies: [
                "Bundle by feature",
                "Bundle by screen",
                "Bundle by category",
                "Lazy load bundles",
                "Code splitting for assets"
            ],
            benefits: [
                "Reduced initial load",
                "On-demand loading",
                "Better caching",
                "Optimized delivery"
            ]
        },
        lazyLoading: {
            description: "Lazy load assets",
            strategies: [
                "Load on demand",
                "Load on visibility",
                "Preload critical assets",
                "Progressive loading",
                "Placeholder assets"
            ],
            patterns: [
                "Image lazy loading",
                "Audio lazy loading",
                "Font lazy loading",
                "Asset bundle lazy loading"
            ]
        },
        compression: {
            description: "Asset compression",
            strategies: [
                "Format optimization (PNG → WebP)",
                "Quality optimization",
                "Size reduction",
                "Sprite sheet packing",
                "Texture compression"
            ],
            targets: {
                images: "Optimize file size while maintaining quality",
                audio: "Compress audio files appropriately",
                fonts: "Subset fonts, use font-display"
            }
        },
        spriteSheetOptimization: {
            description: "Optimize sprite sheets",
            strategies: [
                "Efficient packing algorithms",
                "Remove unused space",
                "Power-of-2 dimensions",
                "Optimal cell sizes",
                "Group related sprites"
            ],
            tools: ["TexturePacker", "LibGDX TexturePacker", "Custom tools"]
        },
        caching: {
            description: "Asset caching strategies",
            strategies: [
                "Browser caching (Cache-Control headers)",
                "Service worker caching",
                "CDN caching",
                "Memory caching",
                "Application-level caching"
            ],
            cacheStrategies: [
                "Cache-first for static assets",
                "Network-first for dynamic assets",
                "Stale-while-revalidate",
                "Cache with versioning"
            ]
        }
    }
};
/**
 * Validate asset metadata
 */
export function validateAssetMetadata(metadata) {
    const errors = [];
    if (!metadata.id)
        errors.push("Missing required field: id");
    if (!metadata.name)
        errors.push("Missing required field: name");
    if (!metadata.category)
        errors.push("Missing required field: category");
    if (!metadata.path)
        errors.push("Missing required field: path");
    if (!metadata.format)
        errors.push("Missing required field: format");
    return {
        valid: errors.length === 0,
        errors
    };
}
/**
 * Get organization pattern by name
 */
export function getOrganizationPattern(patternName) {
    const patterns = ASSET_MANAGEMENT.organization.directoryStructure;
    return patterns[patternName];
}
//# sourceMappingURL=layer-32-asset-management.js.map