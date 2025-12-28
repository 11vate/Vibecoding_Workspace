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
  harmony: number;     // 0-1
  balance: number;     // 0-1
  contrast: number;    // 0-1
  rhythm: number;      // 0-1
  proportion: number;  // 0-1
  unity: number;       // 0-1
  overall: number;     // Weighted average
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
export const AESTHETIC_EVALUATION = {
  /**
   * Aesthetic quality dimensions
   */
  dimensions: {
    harmony: {
      name: "Harmony",
      description: "Visual unity and coherence - elements work together",
      factors: [
        {
          factor: "Color harmony",
          weight: 0.4,
          assessment: [
            "Colors follow color theory principles (complementary, triadic, analogous)",
            "Color palette is cohesive",
            "No color conflicts or clashes",
            "Colors reinforce game identity"
          ]
        },
        {
          factor: "Visual unity",
          weight: 0.3,
          assessment: [
            "Elements share common visual language",
            "Consistent styling across components",
            "Design tokens used consistently",
            "Unified design system"
          ]
        },
        {
          factor: "Typography harmony",
          weight: 0.2,
          assessment: [
            "Typography scale is consistent",
            "Font pairing is harmonious",
            "Text hierarchy is clear",
            "Typography reinforces identity"
          ]
        },
        {
          factor: "Style coherence",
          weight: 0.1,
          assessment: [
            "Style matches game genre/tone",
            "Visual metaphors are consistent",
            "No style conflicts",
            "Cohesive aesthetic identity"
          ]
        }
      ],
      calculate: (factors: Record<string, number>): number => {
        return (
          (factors.colorHarmony || 0) * 0.4 +
          (factors.visualUnity || 0) * 0.3 +
          (factors.typographyHarmony || 0) * 0.2 +
          (factors.styleCoherence || 0) * 0.1
        );
      }
    },
    
    balance: {
      name: "Balance",
      description: "Visual weight distribution - elements feel stable",
      factors: [
        {
          factor: "Visual weight distribution",
          weight: 0.4,
          assessment: [
            "Visual weight is distributed evenly",
            "No single area feels too heavy or light",
            "Balance creates stability",
            "Asymmetric balance used intentionally"
          ]
        },
        {
          factor: "Spatial balance",
          weight: 0.3,
          assessment: [
            "White space distributed evenly",
            "Content density is balanced",
            "No cluttered or empty areas",
            "Spacing creates rhythm"
          ]
        },
        {
          factor: "Color balance",
          weight: 0.2,
          assessment: [
            "Color distribution is balanced",
            "No single color dominates",
            "Accent colors used appropriately",
            "Color creates visual stability"
          ]
        },
        {
          factor: "Content balance",
          weight: 0.1,
          assessment: [
            "Information density is balanced",
            "Content hierarchy is clear",
            "No information overload",
            "Content flow is natural"
          ]
        }
      ],
      calculate: (factors: Record<string, number>): number => {
        return (
          (factors.visualWeight || 0) * 0.4 +
          (factors.spatialBalance || 0) * 0.3 +
          (factors.colorBalance || 0) * 0.2 +
          (factors.contentBalance || 0) * 0.1
        );
      }
    },
    
    contrast: {
      name: "Contrast",
      description: "Hierarchical contrast and accessibility",
      factors: [
        {
          factor: "Hierarchical contrast",
          weight: 0.4,
          assessment: [
            "Clear contrast between hierarchy levels",
            "Important elements stand out",
            "Contrast creates visual hierarchy",
            "Size/weight/color contrast used effectively"
          ]
        },
        {
          factor: "Color contrast (accessibility)",
          weight: 0.3,
          assessment: [
            "Text meets WCAG AA contrast ratios (4.5:1)",
            "Interactive elements have sufficient contrast",
            "All text is readable",
            "Color not only indicator (patterns/shapes too)"
          ]
        },
        {
          factor: "Visual contrast",
          weight: 0.2,
          assessment: [
            "Elements contrast appropriately with backgrounds",
            "No elements disappear into background",
            "Contrast supports usability",
            "Contrast creates interest"
          ]
        },
        {
          factor: "Tonal contrast",
          weight: 0.1,
          assessment: [
            "Light and dark areas create depth",
            "Tonal contrast supports hierarchy",
            "Shadows/elevation create contrast",
            "Contrast feels intentional"
          ]
        }
      ],
      calculate: (factors: Record<string, number>): number => {
        return (
          (factors.hierarchicalContrast || 0) * 0.4 +
          (factors.colorContrast || 0) * 0.3 +
          (factors.visualContrast || 0) * 0.2 +
          (factors.tonalContrast || 0) * 0.1
        );
      }
    },
    
    rhythm: {
      name: "Rhythm",
      description: "Repetition and pattern consistency",
      factors: [
        {
          factor: "Spacing rhythm",
          weight: 0.4,
          assessment: [
            "Consistent spacing rhythm (8px-based)",
            "Spacing creates visual rhythm",
            "No arbitrary spacing values",
            "Rhythm guides eye movement"
          ]
        },
        {
          factor: "Pattern repetition",
          weight: 0.3,
          assessment: [
            "Components follow consistent patterns",
            "Similar elements styled similarly",
            "Design patterns repeat appropriately",
            "Repetition creates familiarity"
          ]
        },
        {
          factor: "Visual rhythm",
          weight: 0.2,
          assessment: [
            "Elements create visual rhythm",
            "Rhythm creates flow",
            "Repetition feels intentional",
            "Rhythm supports scanning"
          ]
        },
        {
          factor: "Temporal rhythm (animations)",
          weight: 0.1,
          assessment: [
            "Animation timing is consistent",
            "Motion creates rhythm",
            "Transitions feel synchronized",
            "Timing feels natural"
          ]
        }
      ],
      calculate: (factors: Record<string, number>): number => {
        return (
          (factors.spacingRhythm || 0) * 0.4 +
          (factors.patternRepetition || 0) * 0.3 +
          (factors.visualRhythm || 0) * 0.2 +
          (factors.temporalRhythm || 0) * 0.1
        );
      }
    },
    
    proportion: {
      name: "Proportion",
      description: "Size relationships and scale",
      factors: [
        {
          factor: "Size relationships",
          weight: 0.4,
          assessment: [
            "Size relationships follow scale (typography, spacing)",
            "Proportions feel harmonious",
            "Golden ratio applied where appropriate",
            "Sizes have clear relationships"
          ]
        },
        {
          factor: "Typography scale",
          weight: 0.3,
          assessment: [
            "Typography uses modular scale (1.25 ratio)",
            "Type scale creates clear hierarchy",
            "Size differences are meaningful",
            "Scale feels intentional"
          ]
        },
        {
          factor: "Component proportions",
          weight: 0.2,
          assessment: [
            "Components sized appropriately",
            "Aspect ratios are pleasing",
            "Proportions create balance",
            "Components feel properly sized"
          ]
        },
        {
          factor: "Layout proportions",
          weight: 0.1,
          assessment: [
            "Layout divisions use pleasing ratios",
            "Golden ratio applied to layout (if applicable)",
            "Proportions create visual interest",
            "Proportions feel balanced"
          ]
        }
      ],
      calculate: (factors: Record<string, number>): number => {
        return (
          (factors.sizeRelationships || 0) * 0.4 +
          (factors.typographyScale || 0) * 0.3 +
          (factors.componentProportions || 0) * 0.2 +
          (factors.layoutProportions || 0) * 0.1
        );
      }
    },
    
    unity: {
      name: "Unity",
      description: "Cohesive design language and identity",
      factors: [
        {
          factor: "Design language consistency",
          weight: 0.4,
          assessment: [
            "All elements follow same design language",
            "Visual style is consistent",
            "Design tokens used throughout",
            "Components share common DNA"
          ]
        },
        {
          factor: "Identity reinforcement",
          weight: 0.3,
          assessment: [
            "Design reinforces game identity",
            "Visual metaphors are consistent",
            "Style matches game genre/tone",
            "Identity is clear and strong"
          ]
        },
        {
          factor: "System coherence",
          weight: 0.2,
          assessment: [
            "Design system is coherent",
            "Components work together",
            "No conflicting patterns",
            "System feels unified"
          ]
        },
        {
          factor: "Conceptual unity",
          weight: 0.1,
          assessment: [
            "Design concept is unified",
            "All elements support same concept",
            "No conceptual conflicts",
            "Unity creates strength"
          ]
        }
      ],
      calculate: (factors: Record<string, number>): number => {
        return (
          (factors.designLanguage || 0) * 0.4 +
          (factors.identityReinforcement || 0) * 0.3 +
          (factors.systemCoherence || 0) * 0.2 +
          (factors.conceptualUnity || 0) * 0.1
        );
      }
    }
  },

  /**
   * Scoring system
   */
  scoring: {
    calculateOverall: (scores: Omit<AestheticScore, "overall">): number => {
      // Weighted average - all dimensions equally important
      return (
        scores.harmony * 0.17 +
        scores.balance * 0.17 +
        scores.contrast * 0.17 +
        scores.rhythm * 0.17 +
        scores.proportion * 0.16 +
        scores.unity * 0.16
      );
    },
    
    thresholds: {
      minimum: {
        description: "MVP Threshold - Minimum acceptable aesthetic quality",
        overall: 0.7,
        dimensions: {
          harmony: 0.7,
          balance: 0.7,
          contrast: 0.7,
          rhythm: 0.7,
          proportion: 0.7,
          unity: 0.7
        }
      },
      good: {
        description: "Production Ready - Good aesthetic quality",
        overall: 0.8,
        dimensions: {
          harmony: 0.8,
          balance: 0.8,
          contrast: 0.8,
          rhythm: 0.8,
          proportion: 0.8,
          unity: 0.8
        }
      },
      excellent: {
        description: "Best-in-Class - Excellent aesthetic quality",
        overall: 0.9,
        dimensions: {
          harmony: 0.9,
          balance: 0.9,
          contrast: 0.9,
          rhythm: 0.9,
          proportion: 0.9,
          unity: 0.9
        }
      }
    }
  },

  /**
   * Improvement recommendations
   */
  improvements: {
    harmony: [
      "Review color palette for harmony (use color theory)",
      "Ensure consistent visual language across components",
      "Verify typography scale is harmonious",
      "Check that style matches game identity",
      "Use design tokens for consistency"
    ],
    
    balance: [
      "Redistribute visual weight more evenly",
      "Balance white space distribution",
      "Ensure color distribution is balanced",
      "Review content density balance",
      "Consider asymmetric balance for interest"
    ],
    
    contrast: [
      "Increase contrast between hierarchy levels",
      "Verify all text meets WCAG AA contrast (4.5:1)",
      "Ensure interactive elements have sufficient contrast",
      "Use size/weight/color for hierarchical contrast",
      "Add visual indicators beyond color"
    ],
    
    rhythm: [
      "Enforce consistent spacing rhythm (8px-based)",
      "Ensure similar elements styled consistently",
      "Create visual rhythm through repetition",
      "Standardize animation timing",
      "Use design tokens for rhythm"
    ],
    
    proportion: [
      "Apply modular type scale consistently",
      "Use golden ratio for layout divisions (if applicable)",
      "Ensure size relationships follow scale",
      "Review component aspect ratios",
      "Create clear proportional relationships"
    ],
    
    unity: [
      "Enforce consistent design language",
      "Use design tokens throughout",
      "Ensure components share visual DNA",
      "Reinforce game identity in all elements",
      "Remove conflicting patterns"
    ]
  },

  /**
   * Evaluation framework
   */
  evaluate: {
    /**
     * Evaluate aesthetic quality
     */
    assess: (
      dimensionScores: Omit<AestheticScore, "overall">,
      targetLevel: AestheticLevel = "minimum"
    ): AestheticEvaluation => {
      const overall = AESTHETIC_EVALUATION.scoring.calculateOverall(dimensionScores);
      const threshold = AESTHETIC_EVALUATION.scoring.thresholds[targetLevel];
      
      const passed = overall >= threshold.overall &&
        Object.entries(dimensionScores).every(([dimension, score]) => 
          score >= threshold.dimensions[dimension as keyof typeof threshold.dimensions]
        );
      
      // Identify strengths and weaknesses
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const recommendations: string[] = [];
      
      Object.entries(dimensionScores).forEach(([dimension, score]) => {
        const thresholdScore = threshold.dimensions[dimension as keyof typeof threshold.dimensions];
        if (score >= thresholdScore) {
          strengths.push(`${dimension}: ${score.toFixed(2)} (good)`);
        } else {
          weaknesses.push(`${dimension}: ${score.toFixed(2)} (below ${thresholdScore})`);
          recommendations.push(...AESTHETIC_EVALUATION.improvements[dimension as keyof typeof AESTHETIC_EVALUATION.improvements]);
        }
      });
      
      if (overall >= threshold.overall) {
        strengths.push(`Overall score: ${overall.toFixed(2)} (meets ${targetLevel} threshold)`);
      } else {
        weaknesses.push(`Overall score: ${overall.toFixed(2)} (below ${threshold.overall} threshold)`);
      }
      
      return {
        scores: { ...dimensionScores, overall },
        level: targetLevel,
        passed,
        strengths,
        weaknesses,
        recommendations: [...new Set(recommendations)] // Remove duplicates
      };
    }
  }
} as const;

/**
 * Helper function to evaluate aesthetic quality
 */
export function evaluateAesthetic(
  dimensionScores: Omit<AestheticScore, "overall">,
  targetLevel: AestheticLevel = "minimum"
): AestheticEvaluation {
  return AESTHETIC_EVALUATION.evaluate.assess(dimensionScores, targetLevel);
}

/**
 * Type exports
 */
export type { AestheticScore, AestheticLevel, AestheticEvaluation };





















