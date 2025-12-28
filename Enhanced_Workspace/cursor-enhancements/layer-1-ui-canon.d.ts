/**
 * LAYER 1 — UI CANON
 *
 * Aesthetic Law encoded as TypeScript
 * This is not decoration - this is how UI should reason about itself
 *
 * Enhanced with design token integration and advanced design principles
 */
export declare const UI_CANON: {
    readonly identity: {
        readonly genre: "mystical creature alchemy";
        readonly tone: "soft, living, unstable";
        readonly inspiration: readonly ["alchemy diagrams", "terrariums", "pixel relics", "ancient machines that breathe", "cyber-vaporwave aesthetics", "pixel art charm"];
    };
    readonly colorPhilosophy: {
        readonly background: {
            readonly primary: "#1a1a2e";
            readonly panel: "#16213e";
            readonly accent: "#0f3460";
            readonly rationale: "Deep twilight gradients that create depth without overwhelming";
        };
        readonly primary: {
            readonly cyan: "#00ffff";
            readonly magenta: "#ff00ff";
            readonly teal: "#4ecca3";
            readonly rationale: "Life energy colors - vibrant and energetic, representing creation and transformation";
        };
        readonly fusion: {
            readonly unstable: "#aa00ff";
            readonly cyan: "#00ffff";
            readonly rationale: "Unstable alchemy colors - represent the chaotic, creative nature of fusion";
        };
        readonly danger: {
            readonly entropy: "#ff0000";
            readonly warning: "#ffaa00";
            readonly rationale: "Entropy red - used sparingly, represents danger and irreversible actions";
        };
        readonly mythic: {
            readonly glow: "#ff00ff";
            readonly prismatic: "#ffffff";
            readonly omega: "#ff0080";
            readonly rationale: "Off-spectrum colors that feel slightly illegal, beyond normal constraints";
        };
        readonly status: {
            readonly success: "#00ff00";
            readonly warning: "#ffaa00";
            readonly error: "#ff0000";
            readonly info: "#00ffff";
        };
        readonly text: {
            readonly primary: "#ffffff";
            readonly secondary: "#cccccc";
            readonly muted: "#888888";
        };
        readonly rarity: {
            readonly basic: "#808080";
            readonly rare: "#0088ff";
            readonly sr: "#aa00ff";
            readonly legendary: "#ffaa00";
            readonly mythic: "#ff00ff";
            readonly prismatic: "#ffffff";
            readonly omega: "#ff0080";
        };
    };
    readonly motionLaw: {
        readonly idle: {
            readonly description: "slow breathing";
            readonly duration: "2s";
            readonly frequency: "low";
            readonly rationale: "Elements should feel alive, not static. Idle animations create presence.";
        };
        readonly interaction: {
            readonly description: "elastic but restrained";
            readonly duration: "150-300ms";
            readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly rationale: "Feedback should feel responsive but not bouncy. Elasticity shows reactivity without being playful.";
        };
        readonly fusion: {
            readonly description: "non-linear pulse";
            readonly duration: "500ms";
            readonly easing: "cubic-bezier(0.4, 0, 1, 1)";
            readonly rationale: "Fusion is transformation - it should feel unstable and unpredictable, building tension";
        };
        readonly glitch: {
            readonly description: "brief, rule-breaking distortions";
            readonly duration: "100-200ms";
            readonly frequency: "rare";
            readonly rationale: "Chaos elements should feel slightly wrong, like reality breaking. Used sparingly for impact.";
        };
    };
    readonly typography: {
        readonly fontFamily: {
            readonly system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
            readonly rationale: "System fonts for native performance, excellent readability, and mobile optimization";
        };
        readonly headers: {
            readonly style: "pixel-serif, mystical";
            readonly rationale: "Headers should feel special and distinctive, not generic";
        };
        readonly body: {
            readonly style: "clean pixel sans";
            readonly rationale: "Body text must be highly readable and accessible";
        };
        readonly numbers: {
            readonly style: "monospace, ritualistic";
            readonly rationale: "Numbers (stats, costs, timers) should feel precise and intentional";
        };
        readonly scale: {
            readonly h1: {
                readonly size: "32px";
                readonly weight: 700;
                readonly lineHeight: 1.2;
            };
            readonly h2: {
                readonly size: "24px";
                readonly weight: 600;
                readonly lineHeight: 1.3;
            };
            readonly h3: {
                readonly size: "20px";
                readonly weight: 600;
                readonly lineHeight: 1.4;
            };
            readonly h4: {
                readonly size: "18px";
                readonly weight: 500;
                readonly lineHeight: 1.4;
            };
            readonly body: {
                readonly size: "16px";
                readonly weight: 400;
                readonly lineHeight: 1.5;
            };
            readonly small: {
                readonly size: "14px";
                readonly weight: 400;
                readonly lineHeight: 1.5;
            };
            readonly caption: {
                readonly size: "12px";
                readonly weight: 400;
                readonly lineHeight: 1.4;
            };
        };
        readonly rules: {
            readonly minSize: "16px";
            readonly maxLineLength: "75 characters";
            readonly contrastRatio: "4.5:1 minimum";
            readonly scaleSupport: "up to 200%";
        };
    };
    readonly spacingRules: {
        readonly rhythm: 8;
        readonly density: "comfortable, never cramped";
        readonly hierarchy: "visual weight before size";
        readonly scale: {
            readonly xs: "4px";
            readonly sm: "8px";
            readonly md: "16px";
            readonly lg: "24px";
            readonly xl: "32px";
            readonly xxl: "48px";
        };
        readonly rationale: "8px rhythm creates consistent spacing that feels natural. Visual hierarchy guides the eye more than size.";
    };
    readonly timing: {
        readonly fast: "150ms";
        readonly normal: "300ms";
        readonly slow: "500ms";
        readonly dramatic: "800ms";
    };
    readonly forbidden: readonly ["flat lifeless panels", "hard sci-fi UI", "perfect symmetry in fusion", "over-explained outcomes", "generic corporate design", "excessive visual clutter", "gratuitous effects without purpose", "motion that doesn't communicate meaning"];
    readonly principles: {
        readonly aliveness: "UI should feel responsive and alive, reacting to state changes";
        readonly clarity: "Every element should communicate purpose within 1 second";
        readonly hierarchy: "Visual weight guides the eye, not just size";
        readonly subtlety: "Favor subtle enhancement over spectacle";
        readonly meaning: "Every animation and color choice should reinforce the game's identity";
    };
    /**
     * Design Token Integration
     *
     * UI Canon values map to design tokens for systematic consistency
     * Use DESIGN_TOKENS for actual implementation values
     */
    readonly tokenIntegration: {
        readonly colors: {
            readonly background: {
                readonly primary: "DESIGN_TOKENS.color.semantic.background.base";
                readonly panel: "DESIGN_TOKENS.color.semantic.surface.base";
                readonly accent: "DESIGN_TOKENS.color.semantic.surface.elevated";
            };
            readonly primary: {
                readonly cyan: "DESIGN_TOKENS.color.semantic.primary.action";
                readonly magenta: "DESIGN_TOKENS.color.semantic.secondary.action";
                readonly teal: "DESIGN_TOKENS.color.semantic.accent.action";
            };
            readonly text: {
                readonly primary: "DESIGN_TOKENS.color.semantic.text.primary";
                readonly secondary: "DESIGN_TOKENS.color.semantic.text.secondary";
                readonly muted: "DESIGN_TOKENS.color.semantic.text.tertiary";
            };
        };
        readonly spacing: {
            readonly rhythm: number;
            readonly scale: {
                readonly xs: string;
                readonly sm: string;
                readonly md: string;
                readonly lg: string;
                readonly xl: string;
                readonly xxl: string;
            };
        };
        readonly typography: {
            readonly fontFamily: string;
            readonly scale: {
                xs: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                sm: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                base: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                lg: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                xl: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                "2xl": {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                "3xl": {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                "4xl": {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
            };
            readonly semantic: {
                h1: string;
                h2: string;
                h3: string;
                h4: string;
                body: string;
                small: string;
                caption: string;
            };
        };
        readonly animation: {
            readonly timing: {
                instant: string;
                fast: string;
                normal: string;
                slow: string;
                slower: string;
            };
            readonly easing: {
                linear: string;
                easeIn: string;
                easeOut: string;
                easeInOut: string;
                elastic: string;
            };
            readonly semantic: {
                idle: string;
                interaction: string;
                fusion: string;
                glitch: string;
            };
        };
        readonly shadow: import("./layer-15-design-tokens").ShadowTokens;
        readonly borderRadius: import("./layer-15-design-tokens").BorderRadiusTokens;
        readonly breakpoint: import("./layer-15-design-tokens").BreakpointTokens;
        readonly zIndex: import("./layer-15-design-tokens").ZIndexTokens;
    };
    /**
     * Advanced Color Theory
     */
    readonly advancedColorTheory: {
        readonly harmony: {
            readonly complementary: {
                readonly description: "Colors opposite on color wheel create high contrast";
                readonly example: "Cyan (#00ffff) + Red (#ff0000)";
                readonly usage: "Use sparingly for emphasis, can be jarring if overused";
            };
            readonly triadic: {
                readonly description: "Three evenly spaced colors on color wheel";
                readonly example: "Cyan, Magenta, Yellow (primary colors)";
                readonly usage: "Vibrant, energetic combinations - good for game UI";
            };
            readonly analogous: {
                readonly description: "Adjacent colors on color wheel";
                readonly example: "Blue → Cyan → Teal gradients";
                readonly usage: "Harmonious, soothing - good for backgrounds";
            };
            readonly splitComplementary: {
                readonly description: "Base color + two colors adjacent to its complement";
                readonly usage: "High contrast with less tension than complementary";
            };
        };
        readonly contrastRatios: {
            readonly minimum: {
                readonly largeText: 3;
                readonly normalText: 4.5;
                readonly description: "WCAG 2.1 AA minimum requirements";
            };
            readonly enhanced: {
                readonly largeText: 4.5;
                readonly normalText: 7;
                readonly description: "WCAG 2.1 AAA enhanced requirements";
            };
            readonly calculate: (color1: string, color2: string) => number;
        };
        readonly accessibility: {
            readonly textOnBackground: {
                readonly primary: "DESIGN_TOKENS.color.semantic.text.primary on DESIGN_TOKENS.color.semantic.background.base";
                readonly contrast: "4.5:1 (WCAG AA)";
                readonly validated: true;
            };
            readonly primaryAction: {
                readonly text: "DESIGN_TOKENS.color.semantic.text.primary on DESIGN_TOKENS.color.semantic.primary.action";
                readonly contrast: "4.5:1 (WCAG AA)";
                readonly validated: true;
            };
        };
    };
    /**
     * Expanded Typography System
     */
    readonly expandedTypography: {
        readonly typeScale: {
            readonly description: "Modular type scale based on 1.25 ratio (Major Third)";
            readonly base: 16;
            readonly ratio: 1.25;
            readonly scale: {
                xs: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                sm: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                base: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                lg: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                xl: {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                "2xl": {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                "3xl": {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
                "4xl": {
                    size: string;
                    lineHeight: number;
                    weight: number;
                };
            };
        };
        readonly fontPairing: {
            readonly heading: {
                readonly primary: string;
                readonly fallback: string;
                readonly rationale: "Distinctive headers that feel special";
            };
            readonly body: {
                readonly primary: string;
                readonly rationale: "Highly readable system fonts";
            };
            readonly monospace: {
                readonly primary: string;
                readonly usage: "Numbers, code, precise values";
            };
        };
        readonly hierarchy: {
            readonly h1: {
                readonly size: string;
                readonly weight: number;
                readonly lineHeight: number;
                readonly usage: "Page titles, major headings";
            };
            readonly h2: {
                readonly size: string;
                readonly weight: number;
                readonly usage: "Section headings";
            };
            readonly h3: {
                readonly size: string;
                readonly weight: number;
                readonly usage: "Subsection headings";
            };
            readonly body: {
                readonly size: string;
                readonly weight: number;
                readonly usage: "Body text, paragraphs";
            };
        };
    };
    /**
     * Shadow/Elevation System
     */
    readonly shadowElevation: {
        readonly system: import("./layer-15-design-tokens").ShadowTokens;
        readonly rationale: "Elevation communicates hierarchy and interactivity";
        readonly usage: {
            readonly card: "DESIGN_TOKENS.shadow.semantic.card - Subtle elevation for cards";
            readonly modal: "DESIGN_TOKENS.shadow.semantic.modal - Strong elevation for modals";
            readonly dropdown: "DESIGN_TOKENS.shadow.semantic.dropdown - Medium elevation";
            readonly focus: "DESIGN_TOKENS.shadow.semantic.focus - Focus ring for accessibility";
        };
        readonly principles: {
            readonly elevation: "Higher elevation = more important, more interactive";
            readonly depth: "Shadows create sense of depth and layering";
            readonly consistency: "Similar elements use same elevation level";
        };
    };
    /**
     * Responsive Design Tokens
     */
    readonly responsiveDesign: {
        readonly breakpoints: import("./layer-15-design-tokens").BreakpointTokens;
        readonly mobileFirst: {
            readonly description: "Design for mobile first, enhance for larger screens";
            readonly approach: "Start with mobile, use min-width media queries";
        };
        readonly fluidTypography: {
            readonly min: "16px (mobile)";
            readonly max: "18px (desktop)";
            readonly description: "Typography scales between breakpoints for optimal readability";
        };
        readonly touchTargets: {
            readonly minimum: "44x44px";
            readonly recommended: "48x48px";
            readonly description: "WCAG touch target size for mobile interactions";
        };
    };
    /**
     * Advanced Animation Principles
     */
    readonly advancedAnimation: {
        readonly springPhysics: {
            readonly description: "Natural motion using spring physics";
            readonly formula: "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            readonly usage: "Elastic, bouncy interactions (restrained)";
        };
        readonly easingCurves: {
            readonly standard: string;
            readonly entrance: string;
            readonly exit: string;
            readonly emphasis: string;
        };
        readonly performance: {
            readonly gpuAccelerated: readonly ["transform (translate, scale, rotate)", "opacity", "filter (sparingly)"];
            readonly avoid: readonly ["width, height (causes layout recalculation)", "margin, padding (causes layout recalculation)", "top, left (use transform instead)"];
            readonly target: "60fps - 16.67ms per frame";
        };
        readonly choreography: {
            readonly stagger: {
                readonly description: "Sequential animation delays for related elements";
                readonly delay: "50-100ms between elements";
                readonly usage: "List items, card reveals, menu items";
            };
            readonly orchestration: {
                readonly description: "Coordinated animations that work together";
                readonly principle: "One primary animation, others support it";
            };
        };
    };
    /**
     * Asset Creation Guidelines
     */
    readonly assetCreation: {
        readonly spriteGuidelines: {
            readonly description: "Guidelines for creating game sprites";
            readonly style: readonly ["Pixel art aesthetic", "Consistent pixel density", "Clear silhouettes", "Readable at small sizes"];
            readonly dimensions: readonly ["Power-of-2 sizes (16, 32, 64, 128)", "Consistent size within category", "Appropriate detail level for size"];
            readonly color: readonly ["Use UI Canon color palette", "Maintain color harmony", "Contrast for readability", "Support game rarity system"];
            readonly animation: readonly ["Frame-based animations", "Smooth transitions", "Consistent timing", "Meaningful motion"];
        };
        readonly backgroundGuidelines: {
            readonly description: "Guidelines for creating backgrounds";
            readonly style: readonly ["Atmospheric and moody", "Support game tone (soft, living, unstable)", "Layered for depth", "Tileable when needed"];
            readonly composition: readonly ["Deep twilight color scheme", "Subtle details", "Clear foreground/background separation", "Support UI overlay readability"];
        };
        readonly iconGuidelines: {
            readonly description: "Guidelines for creating icons";
            readonly style: readonly ["Simple and clear", "Recognizable at small sizes", "Consistent style", "Pixel art aesthetic"];
            readonly sizing: readonly ["Standard sizes: 16x16, 24x24, 32x32", "Scalable design", "Clear outlines", "High contrast"];
        };
        readonly animationGuidelines: {
            readonly description: "Guidelines for game animations";
            readonly principles: readonly ["Follow motion law (idle, interaction, fusion)", "Meaningful motion (not decoration)", "Performance optimized (60fps target)", "GPU-accelerated properties"];
            readonly timing: readonly ["Idle: 2s cycles (slow breathing)", "Interaction: 150-300ms (elastic but restrained)", "Fusion: Non-linear pulse (unstable)", "State transitions: 300-500ms"];
        };
        readonly styleConsistency: {
            readonly description: "Maintain style consistency across assets";
            readonly requirements: readonly ["Use UI Canon color palette", "Follow pixel art aesthetic", "Maintain consistent detail level", "Support game identity (mystical, alchemical)", "Reinforce game tone (soft, living, unstable)"];
        };
    };
};
/**
 * Utility type for accessing UI Canon values
 */
export type UICanon = typeof UI_CANON;
/**
 * Helper to check if a design pattern is forbidden
 */
export declare function isForbiddenPattern(pattern: string): boolean;
//# sourceMappingURL=layer-1-ui-canon.d.ts.map