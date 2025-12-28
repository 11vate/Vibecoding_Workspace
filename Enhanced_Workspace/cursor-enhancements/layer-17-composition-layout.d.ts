/**
 * LAYER 17 — COMPOSITION & LAYOUT PRINCIPLES
 *
 * Advanced composition and layout guidelines for aesthetic excellence
 *
 * This layer provides comprehensive composition principles including visual
 * hierarchy, layout patterns, spacing composition, balance, alignment,
 * proportions, and content density guidelines.
 */
/**
 * Visual hierarchy level
 */
export type HierarchyLevel = "primary" | "secondary" | "tertiary" | "quaternary";
/**
 * Layout pattern type
 */
export type LayoutPattern = "single-column" | "two-column" | "three-column" | "grid" | "flex" | "masonry";
/**
 * Balance type
 */
export type BalanceType = "symmetric" | "asymmetric" | "radial";
/**
 * Visual hierarchy definition
 */
export interface VisualHierarchy {
    primary: {
        elements: string[];
        methods: string[];
        principles: string[];
    };
    secondary: {
        elements: string[];
        methods: string[];
        principles: string[];
    };
    tertiary: {
        elements: string[];
        methods: string[];
        principles: string[];
    };
}
/**
 * Layout pattern definition
 */
export interface LayoutPatternDef {
    name: LayoutPattern;
    description: string;
    structure: string[];
    useCases: string[];
    responsive: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    codeExample?: string;
}
/**
 * Composition principles configuration
 */
export declare const COMPOSITION_LAYOUT: {
    /**
     * Visual hierarchy principles
     */
    readonly visualHierarchy: {
        readonly primary: {
            readonly elements: readonly ["Main heading (H1)", "Primary call-to-action", "Most important content", "Key interactive elements"];
            readonly methods: readonly ["Largest size (typography scale 3xl-4xl)", "Highest contrast", "Boldest weight (700)", "Primary color", "Prominent position (top-left, center)", "Most space around"];
            readonly principles: readonly ["One primary element per screen", "Clear focal point", "User knows where to look first"];
        };
        readonly secondary: {
            readonly elements: readonly ["Section headings (H2-H3)", "Secondary actions", "Important supporting content", "Navigation items"];
            readonly methods: readonly ["Medium size (typography scale xl-2xl)", "Medium contrast", "Medium weight (500-600)", "Secondary/accident colors", "Supporting positions", "Moderate spacing"];
            readonly principles: readonly ["Supports primary without competing", "Clear relationship to primary", "Guides user flow"];
        };
        readonly tertiary: {
            readonly elements: readonly ["Body text", "Helper text", "Metadata", "Less important actions"];
            readonly methods: readonly ["Smaller size (typography scale base-sm)", "Lower contrast", "Lighter weight (400)", "Muted colors", "Supporting positions", "Minimal spacing"];
            readonly principles: readonly ["Doesn't distract from primary/secondary", "Provides context and details", "Completes information hierarchy"];
        };
        readonly emphasis: {
            readonly methods: readonly ["Size (larger = more important)", "Weight (bolder = more important)", "Color (brighter/higher contrast = more important)", "Position (top/left = more important in LTR)", "Spacing (more space = more important)", "Motion (animated = draws attention)"];
            readonly rule: "Use 2-3 methods per level, don't rely on single method";
        };
        readonly grouping: {
            readonly proximity: "Related items grouped together (Gestalt principle)";
            readonly similarity: "Similar items styled similarly";
            readonly closure: "Complete shapes/containers for grouping";
            readonly continuity: "Aligned items form visual groups";
        };
        readonly flow: {
            readonly description: "How the eye moves through the interface";
            readonly patterns: readonly ["Z-pattern: Top-left → top-right → bottom-left → bottom-right", "F-pattern: Horizontal scan lines (for text-heavy content)", "Diagonal: Top-left to bottom-right (for dynamic content)"];
            readonly principles: readonly ["Primary element at start of flow", "Clear path through content", "Important actions along flow path"];
        };
    };
    /**
     * Layout patterns
     */
    readonly layoutPatterns: Record<LayoutPattern, LayoutPatternDef>;
    /**
     * Spacing composition
     */
    readonly spacingComposition: {
        readonly proximity: {
            readonly principle: "Related items closer together";
            readonly rule: "Use smaller spacing (sm-md) for related elements";
            readonly example: "Icon and label: DESIGN_TOKENS.spacing.semantic.xs";
        };
        readonly rhythm: {
            readonly principle: "8px-based spacing rhythm";
            readonly rule: "All spacing multiples of 8px";
            readonly scale: number[];
            readonly rationale: "Creates visual consistency and harmony";
        };
        readonly breathingRoom: {
            readonly principle: "Adequate white space for clarity";
            readonly rule: "Minimum spacing: DESIGN_TOKENS.spacing.semantic.sm (8px)";
            readonly recommended: "DESIGN_TOKENS.spacing.semantic.md (16px) for sections";
            readonly rationale: "Prevents visual clutter, improves readability";
        };
        readonly density: {
            readonly comfortable: {
                readonly spacing: "DESIGN_TOKENS.spacing.semantic.md-lg";
                readonly description: "Comfortable spacing for readability";
                readonly useCase: "Content-heavy screens, forms";
            };
            readonly compact: {
                readonly spacing: "DESIGN_TOKENS.spacing.semantic.sm-md";
                readonly description: "Tighter spacing for efficiency";
                readonly useCase: "Data-dense screens, lists";
            };
            readonly spacious: {
                readonly spacing: "DESIGN_TOKENS.spacing.semantic.lg-xl";
                readonly description: "Generous spacing for emphasis";
                readonly useCase: "Hero sections, important content";
            };
        };
        readonly hierarchy: {
            readonly principle: "Larger spacing for more important separations";
            readonly rule: "Primary sections: lg-xl, Secondary: md, Tertiary: sm";
            readonly example: "Page sections: 32px, Card spacing: 16px, Item spacing: 8px";
        };
    };
    /**
     * Balance principles
     */
    readonly balance: {
        readonly symmetric: {
            readonly description: "Mirrored balance around center axis";
            readonly useCase: "Formal, stable layouts";
            readonly example: "Centered content, equal sidebars";
            readonly whenToUse: readonly ["Hero sections", "Centered modals", "Form layouts"];
        };
        readonly asymmetric: {
            readonly description: "Visual weight balanced but not mirrored";
            readonly useCase: "Dynamic, interesting layouts";
            readonly example: "Large image left, text right";
            readonly whenToUse: readonly ["Content-rich layouts", "Feature sections", "Modern, dynamic designs"];
        };
        readonly radial: {
            readonly description: "Balance around central point";
            readonly useCase: "Circular/radial layouts";
            readonly example: "Circular navigation, radial menus";
            readonly whenToUse: readonly ["Special navigation patterns", "Circular interfaces", "Rare, specific use cases"];
        };
        readonly visualWeight: {
            readonly factors: readonly ["Size (larger = heavier)", "Color (brighter/darker = heavier)", "Position (top/left = heavier in LTR)", "Density (more content = heavier)", "Isolation (isolated elements = heavier)"];
            readonly principle: "Balance heavy and light elements for stability";
        };
    };
    /**
     * Alignment systems
     */
    readonly alignment: {
        readonly grid: {
            readonly description: "Align to invisible grid system";
            readonly rule: "All elements align to 8px grid";
            readonly benefit: "Clean, organized appearance";
        };
        readonly optical: {
            readonly description: "Visual alignment accounting for optical illusions";
            readonly rule: "Sometimes slight adjustments needed for visual balance";
            readonly example: "Centered circles may need slight upward adjustment";
        };
        readonly baseline: {
            readonly description: "Text baseline alignment";
            readonly rule: "Text elements align to baseline grid";
            readonly benefit: "Consistent vertical rhythm";
        };
        readonly edge: {
            readonly description: "Edge alignment";
            readonly types: readonly ["Left align: Text, labels (LTR languages)", "Right align: Numbers, actions", "Center align: Headings, buttons, cards"];
            readonly principles: readonly ["Consistent alignment creates order", "Mixed alignment for hierarchy", "Text typically left-aligned for readability"];
        };
    };
    /**
     * Proportion principles
     */
    readonly proportion: {
        readonly goldenRatio: {
            readonly description: "1.618 ratio (phi)";
            readonly application: readonly ["Layout divisions (sidebar:main = 1:1.618)", "Typography scale", "Image aspect ratios", "Spacing relationships"];
            readonly example: "If sidebar is 300px, main content ≈ 485px";
        };
        readonly ruleOfThirds: {
            readonly description: "Divide space into 3x3 grid";
            readonly application: readonly ["Place important elements at intersection points", "Horizon lines at 1/3 or 2/3", "Focal points at grid intersections"];
            readonly useCase: "Image composition, hero sections";
        };
        readonly modularScale: {
            readonly description: "Typography scale based on ratio";
            readonly ratio: "1.25 (Major Third) - from DESIGN_TOKENS";
            readonly application: "Typography hierarchy, spacing relationships";
        };
        readonly relationships: {
            readonly principle: "Related sizes should have clear relationships";
            readonly rule: "Use scale ratios (2x, 1.5x, 1.25x) rather than arbitrary sizes";
            readonly example: "Card padding: 16px, Card gap: 24px (1.5x)";
        };
    };
    /**
     * White space utilization
     */
    readonly whiteSpace: {
        readonly active: {
            readonly description: "White space used intentionally to create emphasis";
            readonly principle: "Space is an element, not emptiness";
            readonly useCase: "Isolating important content, creating focus";
        };
        readonly passive: {
            readonly description: "White space as natural spacing between elements";
            readonly principle: "Necessary breathing room";
            readonly useCase: "Standard spacing, readability";
        };
        readonly micro: {
            readonly description: "Small spaces between closely related elements";
            readonly size: "4-8px";
            readonly example: "Icon and label, list items";
        };
        readonly macro: {
            readonly description: "Large spaces separating major sections";
            readonly size: "32-64px";
            readonly example: "Page sections, major content blocks";
        };
        readonly negative: {
            readonly description: "When elements overlap intentionally";
            readonly useCase: "Layering effects, creative compositions";
            readonly caution: "Use sparingly, maintain readability";
        };
    };
    /**
     * Content density guidelines
     */
    readonly contentDensity: {
        readonly comfortable: {
            readonly description: "Generous spacing, easy to scan";
            readonly spacing: "DESIGN_TOKENS.spacing.semantic.lg";
            readonly lineHeight: 1.5;
            readonly useCase: "Content-focused screens, reading";
        };
        readonly standard: {
            readonly description: "Balanced spacing and content";
            readonly spacing: "DESIGN_TOKENS.spacing.semantic.md";
            readonly lineHeight: 1.4;
            readonly useCase: "Most screens, general use";
        };
        readonly compact: {
            readonly description: "Tighter spacing, more information visible";
            readonly spacing: "DESIGN_TOKENS.spacing.semantic.sm";
            readonly lineHeight: 1.3;
            readonly useCase: "Data-dense screens, expert users";
        };
        readonly principles: readonly ["Match density to user needs", "More important content gets more space", "Consistent density within sections", "Allow user preference when possible"];
    };
    /**
     * Grid system
     */
    readonly gridSystem: {
        readonly base: {
            readonly columns: 12;
            readonly gutter: string;
            readonly margin: string;
            readonly rationale: "12 columns divisible by 2, 3, 4, 6 - flexible layouts";
        };
        readonly breakpoints: {
            readonly mobile: {
                readonly columns: 4;
                readonly gutter: string;
                readonly margin: string;
            };
            readonly tablet: {
                readonly columns: 8;
                readonly gutter: string;
                readonly margin: string;
            };
            readonly desktop: {
                readonly columns: 12;
                readonly gutter: string;
                readonly margin: string;
            };
        };
        readonly usage: {
            readonly principle: "Align elements to grid columns";
            readonly rule: "Components span multiple columns as needed";
            readonly example: "Card: 12 columns (mobile), 6 columns (tablet), 4 columns (desktop)";
        };
    };
};
/**
 * Helper function to determine visual hierarchy level
 */
export declare function determineHierarchyLevel(element: string, context: {
    isHeading?: boolean;
    isAction?: boolean;
    importance?: "high" | "medium" | "low";
}): HierarchyLevel;
/**
 * Helper function to get layout pattern recommendation
 */
export declare function recommendLayoutPattern(contentType: "cards" | "form" | "dashboard" | "content" | "gallery", screenSize: "mobile" | "tablet" | "desktop"): LayoutPattern;
/**
 * Type exports
 */
export type { VisualHierarchy, LayoutPatternDef, LayoutPattern, BalanceType, HierarchyLevel };
//# sourceMappingURL=layer-17-composition-layout.d.ts.map