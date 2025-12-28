/**
 * LAYER 18 — AESTHETIC EVALUATION FRAMEWORK
 *
 * Objective aesthetic quality assessment and improvement guidance
 *
 * This layer provides systematic aesthetic evaluation across six dimensions:
 * harmony, balance, contrast, rhythm, proportion, and unity. It enables
 * objective quality assessment and provides specific improvement recommendations.
 */
/**
 * Aesthetic score - single dimension score (0-1)
 */
export interface AestheticScore {
    harmony: number;
    balance: number;
    contrast: number;
    rhythm: number;
    proportion: number;
    unity: number;
    overall: number;
}
/**
 * Quality threshold level
 */
export type AestheticLevel = "minimum" | "good" | "excellent";
/**
 * Evaluation result
 */
export interface AestheticEvaluation {
    scores: AestheticScore;
    level: AestheticLevel;
    passed: boolean;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
}
/**
 * Main aesthetic evaluation configuration
 */
export declare const AESTHETIC_EVALUATION: {
    /**
     * Aesthetic quality dimensions
     */
    readonly dimensions: {
        readonly harmony: {
            readonly name: "Harmony";
            readonly description: "Visual unity and coherence - elements work together";
            readonly factors: readonly [{
                readonly factor: "Color harmony";
                readonly weight: 0.4;
                readonly assessment: readonly ["Colors follow color theory principles (complementary, triadic, analogous)", "Color palette is cohesive", "No color conflicts or clashes", "Colors reinforce game identity"];
            }, {
                readonly factor: "Visual unity";
                readonly weight: 0.3;
                readonly assessment: readonly ["Elements share common visual language", "Consistent styling across components", "Design tokens used consistently", "Unified design system"];
            }, {
                readonly factor: "Typography harmony";
                readonly weight: 0.2;
                readonly assessment: readonly ["Typography scale is consistent", "Font pairing is harmonious", "Text hierarchy is clear", "Typography reinforces identity"];
            }, {
                readonly factor: "Style coherence";
                readonly weight: 0.1;
                readonly assessment: readonly ["Style matches game genre/tone", "Visual metaphors are consistent", "No style conflicts", "Cohesive aesthetic identity"];
            }];
            readonly calculate: (factors: Record<string, number>) => number;
        };
        readonly balance: {
            readonly name: "Balance";
            readonly description: "Visual weight distribution - elements feel stable";
            readonly factors: readonly [{
                readonly factor: "Visual weight distribution";
                readonly weight: 0.4;
                readonly assessment: readonly ["Visual weight is distributed evenly", "No single area feels too heavy or light", "Balance creates stability", "Asymmetric balance used intentionally"];
            }, {
                readonly factor: "Spatial balance";
                readonly weight: 0.3;
                readonly assessment: readonly ["White space distributed evenly", "Content density is balanced", "No cluttered or empty areas", "Spacing creates rhythm"];
            }, {
                readonly factor: "Color balance";
                readonly weight: 0.2;
                readonly assessment: readonly ["Color distribution is balanced", "No single color dominates", "Accent colors used appropriately", "Color creates visual stability"];
            }, {
                readonly factor: "Content balance";
                readonly weight: 0.1;
                readonly assessment: readonly ["Information density is balanced", "Content hierarchy is clear", "No information overload", "Content flow is natural"];
            }];
            readonly calculate: (factors: Record<string, number>) => number;
        };
        readonly contrast: {
            readonly name: "Contrast";
            readonly description: "Hierarchical contrast and accessibility";
            readonly factors: readonly [{
                readonly factor: "Hierarchical contrast";
                readonly weight: 0.4;
                readonly assessment: readonly ["Clear contrast between hierarchy levels", "Important elements stand out", "Contrast creates visual hierarchy", "Size/weight/color contrast used effectively"];
            }, {
                readonly factor: "Color contrast (accessibility)";
                readonly weight: 0.3;
                readonly assessment: readonly ["Text meets WCAG AA contrast ratios (4.5:1)", "Interactive elements have sufficient contrast", "All text is readable", "Color not only indicator (patterns/shapes too)"];
            }, {
                readonly factor: "Visual contrast";
                readonly weight: 0.2;
                readonly assessment: readonly ["Elements contrast appropriately with backgrounds", "No elements disappear into background", "Contrast supports usability", "Contrast creates interest"];
            }, {
                readonly factor: "Tonal contrast";
                readonly weight: 0.1;
                readonly assessment: readonly ["Light and dark areas create depth", "Tonal contrast supports hierarchy", "Shadows/elevation create contrast", "Contrast feels intentional"];
            }];
            readonly calculate: (factors: Record<string, number>) => number;
        };
        readonly rhythm: {
            readonly name: "Rhythm";
            readonly description: "Repetition and pattern consistency";
            readonly factors: readonly [{
                readonly factor: "Spacing rhythm";
                readonly weight: 0.4;
                readonly assessment: readonly ["Consistent spacing rhythm (8px-based)", "Spacing creates visual rhythm", "No arbitrary spacing values", "Rhythm guides eye movement"];
            }, {
                readonly factor: "Pattern repetition";
                readonly weight: 0.3;
                readonly assessment: readonly ["Components follow consistent patterns", "Similar elements styled similarly", "Design patterns repeat appropriately", "Repetition creates familiarity"];
            }, {
                readonly factor: "Visual rhythm";
                readonly weight: 0.2;
                readonly assessment: readonly ["Elements create visual rhythm", "Rhythm creates flow", "Repetition feels intentional", "Rhythm supports scanning"];
            }, {
                readonly factor: "Temporal rhythm (animations)";
                readonly weight: 0.1;
                readonly assessment: readonly ["Animation timing is consistent", "Motion creates rhythm", "Transitions feel synchronized", "Timing feels natural"];
            }];
            readonly calculate: (factors: Record<string, number>) => number;
        };
        readonly proportion: {
            readonly name: "Proportion";
            readonly description: "Size relationships and scale";
            readonly factors: readonly [{
                readonly factor: "Size relationships";
                readonly weight: 0.4;
                readonly assessment: readonly ["Size relationships follow scale (typography, spacing)", "Proportions feel harmonious", "Golden ratio applied where appropriate", "Sizes have clear relationships"];
            }, {
                readonly factor: "Typography scale";
                readonly weight: 0.3;
                readonly assessment: readonly ["Typography uses modular scale (1.25 ratio)", "Type scale creates clear hierarchy", "Size differences are meaningful", "Scale feels intentional"];
            }, {
                readonly factor: "Component proportions";
                readonly weight: 0.2;
                readonly assessment: readonly ["Components sized appropriately", "Aspect ratios are pleasing", "Proportions create balance", "Components feel properly sized"];
            }, {
                readonly factor: "Layout proportions";
                readonly weight: 0.1;
                readonly assessment: readonly ["Layout divisions use pleasing ratios", "Golden ratio applied to layout (if applicable)", "Proportions create visual interest", "Proportions feel balanced"];
            }];
            readonly calculate: (factors: Record<string, number>) => number;
        };
        readonly unity: {
            readonly name: "Unity";
            readonly description: "Cohesive design language and identity";
            readonly factors: readonly [{
                readonly factor: "Design language consistency";
                readonly weight: 0.4;
                readonly assessment: readonly ["All elements follow same design language", "Visual style is consistent", "Design tokens used throughout", "Components share common DNA"];
            }, {
                readonly factor: "Identity reinforcement";
                readonly weight: 0.3;
                readonly assessment: readonly ["Design reinforces game identity", "Visual metaphors are consistent", "Style matches game genre/tone", "Identity is clear and strong"];
            }, {
                readonly factor: "System coherence";
                readonly weight: 0.2;
                readonly assessment: readonly ["Design system is coherent", "Components work together", "No conflicting patterns", "System feels unified"];
            }, {
                readonly factor: "Conceptual unity";
                readonly weight: 0.1;
                readonly assessment: readonly ["Design concept is unified", "All elements support same concept", "No conceptual conflicts", "Unity creates strength"];
            }];
            readonly calculate: (factors: Record<string, number>) => number;
        };
    };
    /**
     * Scoring system
     */
    readonly scoring: {
        readonly calculateOverall: (scores: Omit<AestheticScore, "overall">) => number;
        readonly thresholds: {
            readonly minimum: {
                readonly description: "MVP Threshold - Minimum acceptable aesthetic quality";
                readonly overall: 0.7;
                readonly dimensions: {
                    readonly harmony: 0.7;
                    readonly balance: 0.7;
                    readonly contrast: 0.7;
                    readonly rhythm: 0.7;
                    readonly proportion: 0.7;
                    readonly unity: 0.7;
                };
            };
            readonly good: {
                readonly description: "Production Ready - Good aesthetic quality";
                readonly overall: 0.8;
                readonly dimensions: {
                    readonly harmony: 0.8;
                    readonly balance: 0.8;
                    readonly contrast: 0.8;
                    readonly rhythm: 0.8;
                    readonly proportion: 0.8;
                    readonly unity: 0.8;
                };
            };
            readonly excellent: {
                readonly description: "Best-in-Class - Excellent aesthetic quality";
                readonly overall: 0.9;
                readonly dimensions: {
                    readonly harmony: 0.9;
                    readonly balance: 0.9;
                    readonly contrast: 0.9;
                    readonly rhythm: 0.9;
                    readonly proportion: 0.9;
                    readonly unity: 0.9;
                };
            };
        };
    };
    /**
     * Improvement recommendations
     */
    readonly improvements: {
        readonly harmony: readonly ["Review color palette for harmony (use color theory)", "Ensure consistent visual language across components", "Verify typography scale is harmonious", "Check that style matches game identity", "Use design tokens for consistency"];
        readonly balance: readonly ["Redistribute visual weight more evenly", "Balance white space distribution", "Ensure color distribution is balanced", "Review content density balance", "Consider asymmetric balance for interest"];
        readonly contrast: readonly ["Increase contrast between hierarchy levels", "Verify all text meets WCAG AA contrast (4.5:1)", "Ensure interactive elements have sufficient contrast", "Use size/weight/color for hierarchical contrast", "Add visual indicators beyond color"];
        readonly rhythm: readonly ["Enforce consistent spacing rhythm (8px-based)", "Ensure similar elements styled consistently", "Create visual rhythm through repetition", "Standardize animation timing", "Use design tokens for rhythm"];
        readonly proportion: readonly ["Apply modular type scale consistently", "Use golden ratio for layout divisions (if applicable)", "Ensure size relationships follow scale", "Review component aspect ratios", "Create clear proportional relationships"];
        readonly unity: readonly ["Enforce consistent design language", "Use design tokens throughout", "Ensure components share visual DNA", "Reinforce game identity in all elements", "Remove conflicting patterns"];
    };
    /**
     * Evaluation framework
     */
    readonly evaluate: {
        /**
         * Evaluate aesthetic quality
         */
        readonly assess: (dimensionScores: Omit<AestheticScore, "overall">, targetLevel?: AestheticLevel) => AestheticEvaluation;
    };
};
/**
 * Helper function to evaluate aesthetic quality
 */
export declare function evaluateAesthetic(dimensionScores: Omit<AestheticScore, "overall">, targetLevel?: AestheticLevel): AestheticEvaluation;
/**
 * Type exports
 */
export type { AestheticScore, AestheticLevel, AestheticEvaluation };
//# sourceMappingURL=layer-18-aesthetic-evaluation.d.ts.map