/**
 * LAYER 19 — VISUAL QUALITY ASSESSMENT
 *
 * Comprehensive visual quality checklist and assessment
 *
 * This layer provides quality gates, professional polish standards, and quality
 * assessment frameworks to ensure all designs meet MVP-level quality standards.
 */
/**
 * Quality assessment result
 */
export interface QualityAssessment {
    overall: number;
    dimensions: QualityDimensions;
    passed: boolean;
    failures: string[];
    recommendations: string[];
}
/**
 * Quality dimensions
 */
export interface QualityDimensions {
    alignment: number;
    spacing: number;
    color: number;
    typography: number;
    animation: number;
    responsive: number;
    accessibility: number;
    consistency: number;
}
/**
 * Quality threshold levels
 */
export type QualityLevel = "minimum" | "good" | "excellent";
/**
 * Main visual quality configuration
 */
export declare const VISUAL_QUALITY: {
    /**
     * Professional polish checklist
     */
    readonly polishChecklist: {
        readonly alignment: readonly [{
            readonly check: "All elements are pixel-perfect aligned";
            readonly description: "No misaligned elements, consistent grid alignment";
            readonly critical: true;
        }, {
            readonly check: "Text baseline alignment is consistent";
            readonly description: "Text elements align to baseline grid";
            readonly critical: false;
        }, {
            readonly check: "Icons and text are properly aligned";
            readonly description: "Icon-text alignment follows consistent pattern";
            readonly critical: true;
        }, {
            readonly check: "Visual elements respect grid system";
            readonly description: "Layout follows established grid system";
            readonly critical: true;
        }];
        readonly spacing: readonly [{
            readonly check: "Spacing uses design token system";
            readonly description: "All spacing values come from DESIGN_TOKENS.spacing";
            readonly critical: true;
        }, {
            readonly check: "Consistent spacing rhythm (8px-based)";
            readonly description: "Spacing follows 8px rhythm system";
            readonly critical: true;
        }, {
            readonly check: "No arbitrary spacing values";
            readonly description: "No hardcoded spacing values (e.g., 13px, 27px)";
            readonly critical: false;
        }, {
            readonly check: "Proper spacing hierarchy";
            readonly description: "Larger spacing for more important separations";
            readonly critical: true;
        }, {
            readonly check: "Adequate white space";
            readonly description: "Sufficient breathing room between elements";
            readonly critical: true;
        }];
        readonly color: readonly [{
            readonly check: "Colors use design token system";
            readonly description: "All colors come from DESIGN_TOKENS.color";
            readonly critical: true;
        }, {
            readonly check: "Color accuracy matches design";
            readonly description: "Colors match specified hex values exactly";
            readonly critical: true;
        }, {
            readonly check: "Sufficient color contrast (WCAG AA)";
            readonly description: "Text meets 4.5:1 contrast ratio minimum";
            readonly critical: true;
        }, {
            readonly check: "Color harmony is maintained";
            readonly description: "Colors work together harmoniously";
            readonly critical: true;
        }, {
            readonly check: "No color conflicts or clashes";
            readonly description: "Colors don't create visual conflicts";
            readonly critical: true;
        }];
        readonly typography: readonly [{
            readonly check: "Typography uses design token system";
            readonly description: "Font sizes, weights, line heights from tokens";
            readonly critical: true;
        }, {
            readonly check: "Typography hierarchy is clear";
            readonly description: "Clear visual hierarchy through size/weight";
            readonly critical: true;
        }, {
            readonly check: "Line height provides readability";
            readonly description: "Line height ≥ 1.4 for body text";
            readonly critical: true;
        }, {
            readonly check: "Text is readable at all sizes";
            readonly description: "Minimum 16px for body text (mobile)";
            readonly critical: true;
        }, {
            readonly check: "Font weights are used consistently";
            readonly description: "Weight choices follow typography scale";
            readonly critical: false;
        }, {
            readonly check: "Text truncation handled gracefully";
            readonly description: "Long text has ellipsis or wrapping";
            readonly critical: false;
        }];
        readonly animation: readonly [{
            readonly check: "Animations use design token timing";
            readonly description: "Duration and easing from DESIGN_TOKENS.animation";
            readonly critical: true;
        }, {
            readonly check: "Animations run at 60fps";
            readonly description: "Smooth animations without jank";
            readonly critical: true;
        }, {
            readonly check: "Animations serve a purpose";
            readonly description: "Not decorative, communicate meaning";
            readonly critical: true;
        }, {
            readonly check: "Animation timing feels natural";
            readonly description: "Timing matches UI_CANON motionLaw principles";
            readonly critical: true;
        }, {
            readonly check: "No animation conflicts";
            readonly description: "Multiple animations don't conflict";
            readonly critical: false;
        }];
        readonly responsive: readonly [{
            readonly check: "Layout works at all breakpoints";
            readonly description: "Mobile, tablet, desktop layouts functional";
            readonly critical: true;
        }, {
            readonly check: "Text scales appropriately";
            readonly description: "Typography scales for readability";
            readonly critical: true;
        }, {
            readonly check: "Touch targets are adequate (44x44px minimum)";
            readonly description: "Interactive elements large enough for touch";
            readonly critical: true;
        }, {
            readonly check: "No horizontal scrolling";
            readonly description: "Content fits within viewport width";
            readonly critical: true;
        }, {
            readonly check: "Layout adapts gracefully";
            readonly description: "No content overflow or awkward wrapping";
            readonly critical: true;
        }];
        readonly accessibility: readonly [{
            readonly check: "WCAG 2.1 AA contrast compliance";
            readonly description: "All text meets 4.5:1 contrast ratio";
            readonly critical: true;
        }, {
            readonly check: "Keyboard navigation works";
            readonly description: "All interactive elements keyboard accessible";
            readonly critical: true;
        }, {
            readonly check: "Focus indicators are visible";
            readonly description: "Clear focus states for keyboard navigation";
            readonly critical: true;
        }, {
            readonly check: "Semantic HTML used";
            readonly description: "Proper HTML elements (button, nav, etc.)";
            readonly critical: true;
        }, {
            readonly check: "ARIA labels where needed";
            readonly description: "Screen reader support for complex components";
            readonly critical: false;
        }, {
            readonly check: "Reduced motion supported";
            readonly description: "Respects prefers-reduced-motion";
            readonly critical: false;
        }];
        readonly consistency: readonly [{
            readonly check: "Design tokens used consistently";
            readonly description: "90%+ of values come from token system";
            readonly critical: true;
        }, {
            readonly check: "Component patterns followed";
            readonly description: "Components match Layer 16 patterns";
            readonly critical: true;
        }, {
            readonly check: "Visual language is cohesive";
            readonly description: "Design elements feel unified";
            readonly critical: true;
        }, {
            readonly check: "Similar elements styled consistently";
            readonly description: "Buttons, cards, inputs follow patterns";
            readonly critical: true;
        }];
    };
    /**
     * Quality thresholds
     */
    readonly thresholds: {
        readonly minimum: {
            readonly description: "MVP Threshold - Minimum acceptable quality";
            readonly overall: 0.7;
            readonly dimensions: {
                readonly alignment: 0.8;
                readonly spacing: 0.7;
                readonly color: 0.8;
                readonly typography: 0.7;
                readonly animation: 0.6;
                readonly responsive: 0.8;
                readonly accessibility: 0.8;
                readonly consistency: 0.7;
            };
            readonly checklistPassRate: 0.8;
            readonly tokenUsage: 0.9;
            readonly wcagLevel: "AA";
        };
        readonly good: {
            readonly description: "Production Ready - Good quality standards";
            readonly overall: 0.8;
            readonly dimensions: {
                readonly alignment: 0.9;
                readonly spacing: 0.8;
                readonly color: 0.9;
                readonly typography: 0.8;
                readonly animation: 0.8;
                readonly responsive: 0.9;
                readonly accessibility: 0.9;
                readonly consistency: 0.9;
            };
            readonly checklistPassRate: 0.95;
            readonly tokenUsage: 0.95;
            readonly wcagLevel: "AA+";
        };
        readonly excellent: {
            readonly description: "Best-in-Class - Excellent quality standards";
            readonly overall: 0.9;
            readonly dimensions: {
                readonly alignment: 0.95;
                readonly spacing: 0.9;
                readonly color: 0.95;
                readonly typography: 0.9;
                readonly animation: 0.9;
                readonly responsive: 0.95;
                readonly accessibility: 0.95;
                readonly consistency: 0.95;
            };
            readonly checklistPassRate: 1;
            readonly tokenUsage: 1;
            readonly wcagLevel: "AAA";
        };
    };
    /**
     * Quality gates
     */
    readonly qualityGates: {
        readonly mvp: {
            readonly description: "Must pass for MVP release";
            readonly gates: readonly ["Overall quality score ≥ 0.7", "All critical checklist items pass", "WCAG 2.1 AA compliance", "90%+ design token usage", "Responsive at all breakpoints"];
            readonly mustPass: true;
        };
        readonly production: {
            readonly description: "Must pass for production release";
            readonly gates: readonly ["Overall quality score ≥ 0.8", "95%+ checklist items pass", "WCAG 2.1 AA+ compliance", "95%+ design token usage", "All accessibility checks pass"];
            readonly mustPass: false;
        };
        readonly excellent: {
            readonly description: "Best-in-class quality";
            readonly gates: readonly ["Overall quality score ≥ 0.9", "100% checklist items pass", "WCAG 2.1 AAA compliance", "100% design token usage", "All quality dimensions ≥ 0.9"];
            readonly mustPass: false;
        };
    };
    /**
     * Assessment framework
     */
    readonly assess: {
        /**
         * Assess quality dimensions
         */
        readonly dimensions: (checks: {
            alignment: boolean[];
            spacing: boolean[];
            color: boolean[];
            typography: boolean[];
            animation: boolean[];
            responsive: boolean[];
            accessibility: boolean[];
            consistency: boolean[];
        }) => QualityDimensions;
        /**
         * Calculate overall quality score
         */
        readonly overall: (dimensions: QualityDimensions) => number;
        /**
         * Determine quality level
         */
        readonly level: (overall: number, dimensions: QualityDimensions, threshold: QualityLevel) => {
            level: QualityLevel;
            passed: boolean;
            message: string;
        };
    };
    /**
     * Improvement suggestions
     */
    readonly improvements: {
        readonly alignment: readonly ["Use CSS Grid or Flexbox for alignment", "Check vertical rhythm and baseline alignment", "Verify icon-text alignment", "Ensure consistent padding/margins"];
        readonly spacing: readonly ["Replace hardcoded values with design tokens", "Use spacing scale consistently", "Increase spacing for important separations", "Ensure adequate white space"];
        readonly color: readonly ["Use semantic color tokens", "Check contrast ratios meet WCAG AA", "Verify color harmony", "Ensure colors match design specifications"];
        readonly typography: readonly ["Use typography tokens from design system", "Establish clear hierarchy", "Ensure line height ≥ 1.4", "Verify minimum font sizes"];
        readonly animation: readonly ["Use animation timing tokens", "Ensure 60fps performance", "Remove decorative animations", "Verify animations serve purpose"];
        readonly responsive: readonly ["Test at all breakpoints", "Ensure touch targets ≥ 44x44px", "Fix horizontal scrolling issues", "Verify content scales appropriately"];
        readonly accessibility: readonly ["Add keyboard navigation support", "Improve focus indicators", "Add ARIA labels where needed", "Ensure semantic HTML"];
        readonly consistency: readonly ["Increase design token usage", "Follow component patterns", "Unify visual language", "Ensure similar elements styled consistently"];
    };
    /**
     * Industry benchmarks
     */
    readonly benchmarks: {
        readonly mvp: "Meets minimum viable product quality standards";
        readonly production: "Meets professional production standards (Material Design, Apple HIG)";
        readonly excellent: "Exceeds industry standards (AAA accessibility, pixel-perfect, best-in-class)";
    };
};
/**
 * Helper function to assess visual quality
 */
export declare function assessVisualQuality(checks: {
    alignment: boolean[];
    spacing: boolean[];
    color: boolean[];
    typography: boolean[];
    animation: boolean[];
    responsive: boolean[];
    accessibility: boolean[];
    consistency: boolean[];
}, targetLevel?: QualityLevel): QualityAssessment;
/**
 * Type exports
 */
export type { QualityAssessment, QualityDimensions, QualityLevel };
//# sourceMappingURL=layer-19-visual-quality.d.ts.map