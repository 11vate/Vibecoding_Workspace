/**
 * LAYER 19 — VISUAL QUALITY ASSESSMENT
 *
 * Comprehensive visual quality checklist and assessment
 *
 * This layer provides quality gates, professional polish standards, and quality
 * assessment frameworks to ensure all designs meet MVP-level quality standards.
 */
/**
 * Main visual quality configuration
 */
export const VISUAL_QUALITY = {
    /**
     * Professional polish checklist
     */
    polishChecklist: {
        alignment: [
            {
                check: "All elements are pixel-perfect aligned",
                description: "No misaligned elements, consistent grid alignment",
                critical: true
            },
            {
                check: "Text baseline alignment is consistent",
                description: "Text elements align to baseline grid",
                critical: false
            },
            {
                check: "Icons and text are properly aligned",
                description: "Icon-text alignment follows consistent pattern",
                critical: true
            },
            {
                check: "Visual elements respect grid system",
                description: "Layout follows established grid system",
                critical: true
            }
        ],
        spacing: [
            {
                check: "Spacing uses design token system",
                description: "All spacing values come from DESIGN_TOKENS.spacing",
                critical: true
            },
            {
                check: "Consistent spacing rhythm (8px-based)",
                description: "Spacing follows 8px rhythm system",
                critical: true
            },
            {
                check: "No arbitrary spacing values",
                description: "No hardcoded spacing values (e.g., 13px, 27px)",
                critical: false
            },
            {
                check: "Proper spacing hierarchy",
                description: "Larger spacing for more important separations",
                critical: true
            },
            {
                check: "Adequate white space",
                description: "Sufficient breathing room between elements",
                critical: true
            }
        ],
        color: [
            {
                check: "Colors use design token system",
                description: "All colors come from DESIGN_TOKENS.color",
                critical: true
            },
            {
                check: "Color accuracy matches design",
                description: "Colors match specified hex values exactly",
                critical: true
            },
            {
                check: "Sufficient color contrast (WCAG AA)",
                description: "Text meets 4.5:1 contrast ratio minimum",
                critical: true
            },
            {
                check: "Color harmony is maintained",
                description: "Colors work together harmoniously",
                critical: true
            },
            {
                check: "No color conflicts or clashes",
                description: "Colors don't create visual conflicts",
                critical: true
            }
        ],
        typography: [
            {
                check: "Typography uses design token system",
                description: "Font sizes, weights, line heights from tokens",
                critical: true
            },
            {
                check: "Typography hierarchy is clear",
                description: "Clear visual hierarchy through size/weight",
                critical: true
            },
            {
                check: "Line height provides readability",
                description: "Line height ≥ 1.4 for body text",
                critical: true
            },
            {
                check: "Text is readable at all sizes",
                description: "Minimum 16px for body text (mobile)",
                critical: true
            },
            {
                check: "Font weights are used consistently",
                description: "Weight choices follow typography scale",
                critical: false
            },
            {
                check: "Text truncation handled gracefully",
                description: "Long text has ellipsis or wrapping",
                critical: false
            }
        ],
        animation: [
            {
                check: "Animations use design token timing",
                description: "Duration and easing from DESIGN_TOKENS.animation",
                critical: true
            },
            {
                check: "Animations run at 60fps",
                description: "Smooth animations without jank",
                critical: true
            },
            {
                check: "Animations serve a purpose",
                description: "Not decorative, communicate meaning",
                critical: true
            },
            {
                check: "Animation timing feels natural",
                description: "Timing matches UI_CANON motionLaw principles",
                critical: true
            },
            {
                check: "No animation conflicts",
                description: "Multiple animations don't conflict",
                critical: false
            }
        ],
        responsive: [
            {
                check: "Layout works at all breakpoints",
                description: "Mobile, tablet, desktop layouts functional",
                critical: true
            },
            {
                check: "Text scales appropriately",
                description: "Typography scales for readability",
                critical: true
            },
            {
                check: "Touch targets are adequate (44x44px minimum)",
                description: "Interactive elements large enough for touch",
                critical: true
            },
            {
                check: "No horizontal scrolling",
                description: "Content fits within viewport width",
                critical: true
            },
            {
                check: "Layout adapts gracefully",
                description: "No content overflow or awkward wrapping",
                critical: true
            }
        ],
        accessibility: [
            {
                check: "WCAG 2.1 AA contrast compliance",
                description: "All text meets 4.5:1 contrast ratio",
                critical: true
            },
            {
                check: "Keyboard navigation works",
                description: "All interactive elements keyboard accessible",
                critical: true
            },
            {
                check: "Focus indicators are visible",
                description: "Clear focus states for keyboard navigation",
                critical: true
            },
            {
                check: "Semantic HTML used",
                description: "Proper HTML elements (button, nav, etc.)",
                critical: true
            },
            {
                check: "ARIA labels where needed",
                description: "Screen reader support for complex components",
                critical: false
            },
            {
                check: "Reduced motion supported",
                description: "Respects prefers-reduced-motion",
                critical: false
            }
        ],
        consistency: [
            {
                check: "Design tokens used consistently",
                description: "90%+ of values come from token system",
                critical: true
            },
            {
                check: "Component patterns followed",
                description: "Components match Layer 16 patterns",
                critical: true
            },
            {
                check: "Visual language is cohesive",
                description: "Design elements feel unified",
                critical: true
            },
            {
                check: "Similar elements styled consistently",
                description: "Buttons, cards, inputs follow patterns",
                critical: true
            }
        ]
    },
    /**
     * Quality thresholds
     */
    thresholds: {
        minimum: {
            description: "MVP Threshold - Minimum acceptable quality",
            overall: 0.7,
            dimensions: {
                alignment: 0.8,
                spacing: 0.7,
                color: 0.8,
                typography: 0.7,
                animation: 0.6,
                responsive: 0.8,
                accessibility: 0.8,
                consistency: 0.7
            },
            checklistPassRate: 0.8, // 80%
            tokenUsage: 0.9, // 90%
            wcagLevel: "AA"
        },
        good: {
            description: "Production Ready - Good quality standards",
            overall: 0.8,
            dimensions: {
                alignment: 0.9,
                spacing: 0.8,
                color: 0.9,
                typography: 0.8,
                animation: 0.8,
                responsive: 0.9,
                accessibility: 0.9,
                consistency: 0.9
            },
            checklistPassRate: 0.95, // 95%
            tokenUsage: 0.95, // 95%
            wcagLevel: "AA+"
        },
        excellent: {
            description: "Best-in-Class - Excellent quality standards",
            overall: 0.9,
            dimensions: {
                alignment: 0.95,
                spacing: 0.9,
                color: 0.95,
                typography: 0.9,
                animation: 0.9,
                responsive: 0.95,
                accessibility: 0.95,
                consistency: 0.95
            },
            checklistPassRate: 1.0, // 100%
            tokenUsage: 1.0, // 100%
            wcagLevel: "AAA"
        }
    },
    /**
     * Quality gates
     */
    qualityGates: {
        mvp: {
            description: "Must pass for MVP release",
            gates: [
                "Overall quality score ≥ 0.7",
                "All critical checklist items pass",
                "WCAG 2.1 AA compliance",
                "90%+ design token usage",
                "Responsive at all breakpoints"
            ],
            mustPass: true
        },
        production: {
            description: "Must pass for production release",
            gates: [
                "Overall quality score ≥ 0.8",
                "95%+ checklist items pass",
                "WCAG 2.1 AA+ compliance",
                "95%+ design token usage",
                "All accessibility checks pass"
            ],
            mustPass: false // Recommended but not required
        },
        excellent: {
            description: "Best-in-class quality",
            gates: [
                "Overall quality score ≥ 0.9",
                "100% checklist items pass",
                "WCAG 2.1 AAA compliance",
                "100% design token usage",
                "All quality dimensions ≥ 0.9"
            ],
            mustPass: false // Aspirational
        }
    },
    /**
     * Assessment framework
     */
    assess: {
        /**
         * Assess quality dimensions
         */
        dimensions: (checks) => {
            const calculateScore = (results) => {
                const passed = results.filter(r => r).length;
                return results.length > 0 ? passed / results.length : 0;
            };
            return {
                alignment: calculateScore(checks.alignment),
                spacing: calculateScore(checks.spacing),
                color: calculateScore(checks.color),
                typography: calculateScore(checks.typography),
                animation: calculateScore(checks.animation),
                responsive: calculateScore(checks.responsive),
                accessibility: calculateScore(checks.accessibility),
                consistency: calculateScore(checks.consistency)
            };
        },
        /**
         * Calculate overall quality score
         */
        overall: (dimensions) => {
            // Weighted average - accessibility and consistency are most important
            return (dimensions.alignment * 0.1 +
                dimensions.spacing * 0.1 +
                dimensions.color * 0.1 +
                dimensions.typography * 0.1 +
                dimensions.animation * 0.1 +
                dimensions.responsive * 0.15 +
                dimensions.accessibility * 0.2 +
                dimensions.consistency * 0.15);
        },
        /**
         * Determine quality level
         */
        level: (overall, dimensions, threshold) => {
            const thresholdValues = VISUAL_QUALITY.thresholds[threshold];
            const passed = overall >= thresholdValues.overall &&
                Object.entries(dimensions).every(([key, value]) => value >= thresholdValues.dimensions[key]);
            return {
                level: threshold,
                passed,
                message: passed
                    ? `Quality level: ${threshold} - Standards met`
                    : `Quality level: ${threshold} - Standards not met. Overall: ${overall.toFixed(2)}, required: ${thresholdValues.overall}`
            };
        }
    },
    /**
     * Improvement suggestions
     */
    improvements: {
        alignment: [
            "Use CSS Grid or Flexbox for alignment",
            "Check vertical rhythm and baseline alignment",
            "Verify icon-text alignment",
            "Ensure consistent padding/margins"
        ],
        spacing: [
            "Replace hardcoded values with design tokens",
            "Use spacing scale consistently",
            "Increase spacing for important separations",
            "Ensure adequate white space"
        ],
        color: [
            "Use semantic color tokens",
            "Check contrast ratios meet WCAG AA",
            "Verify color harmony",
            "Ensure colors match design specifications"
        ],
        typography: [
            "Use typography tokens from design system",
            "Establish clear hierarchy",
            "Ensure line height ≥ 1.4",
            "Verify minimum font sizes"
        ],
        animation: [
            "Use animation timing tokens",
            "Ensure 60fps performance",
            "Remove decorative animations",
            "Verify animations serve purpose"
        ],
        responsive: [
            "Test at all breakpoints",
            "Ensure touch targets ≥ 44x44px",
            "Fix horizontal scrolling issues",
            "Verify content scales appropriately"
        ],
        accessibility: [
            "Add keyboard navigation support",
            "Improve focus indicators",
            "Add ARIA labels where needed",
            "Ensure semantic HTML"
        ],
        consistency: [
            "Increase design token usage",
            "Follow component patterns",
            "Unify visual language",
            "Ensure similar elements styled consistently"
        ]
    },
    /**
     * Industry benchmarks
     */
    benchmarks: {
        mvp: "Meets minimum viable product quality standards",
        production: "Meets professional production standards (Material Design, Apple HIG)",
        excellent: "Exceeds industry standards (AAA accessibility, pixel-perfect, best-in-class)"
    }
};
/**
 * Helper function to assess visual quality
 */
export function assessVisualQuality(checks, targetLevel = "minimum") {
    const dimensions = VISUAL_QUALITY.assess.dimensions(checks);
    const overall = VISUAL_QUALITY.assess.overall(dimensions);
    const levelResult = VISUAL_QUALITY.assess.level(overall, dimensions, targetLevel);
    // Generate recommendations
    const recommendations = [];
    const failures = [];
    Object.entries(dimensions).forEach(([dimension, score]) => {
        const threshold = VISUAL_QUALITY.thresholds[targetLevel].dimensions[dimension];
        if (score < threshold) {
            failures.push(`${dimension} score ${score.toFixed(2)} below threshold ${threshold}`);
            recommendations.push(...(VISUAL_QUALITY.improvements[dimension] || []));
        }
    });
    return {
        overall,
        dimensions,
        passed: levelResult.passed,
        failures,
        recommendations: [...new Set(recommendations)] // Remove duplicates
    };
}
//# sourceMappingURL=layer-19-visual-quality.js.map