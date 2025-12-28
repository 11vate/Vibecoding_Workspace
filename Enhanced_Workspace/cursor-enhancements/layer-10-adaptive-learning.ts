/**
 * LAYER 10 — ADAPTIVE LEARNING
 * 
 * Self-improvement through pattern recognition and feedback loops
 * 
 * This layer tracks successful patterns, learns from user feedback, and applies
 * learned patterns to improve future interactions while preserving core constraints.
 */

/**
 * Learning pattern
 */
export interface LearningPattern {
  id: string;
  pattern: string;
  description: string;
  context: {
    requestType?: string;
    componentType?: string;
    complexity?: string;
    tags?: string[];
  };
  successRate: number; // 0-1
  useCount: number;
  lastUsed: string; // ISO date string
  lastSuccess: string; // ISO date string
  examples: string[]; // Example requests where this pattern was successful
}

/**
 * User feedback
 */
export interface Feedback {
  id: string;
  changeId: string;
  timestamp: string; // ISO date string
  response: "approved" | "modified" | "rejected" | "clarified";
  feedback?: string; // User's feedback text
  patterns: string[]; // Pattern IDs that were used
  context: {
    request: string;
    complexity: string;
    layers: string[];
  };
}

/**
 * Success metrics
 */
export interface SuccessMetrics {
  changeId: string;
  quality: {
    passedPolishChecklist: boolean;
    constraintRespected: boolean;
    designAligned: boolean;
  };
  alignment: {
    userApprovedWithoutModification: boolean;
    userModifications: string[];
    userRejected: boolean;
  };
  constraint: {
    allConstraintsRespected: boolean;
    violations?: string[];
  };
  efficiency: {
    iterationsNeeded: number;
    refinementsNeeded: number;
    timeToCompletion?: number; // in minutes, if tracked
  };
}

/**
 * Pattern match result
 */
export interface PatternMatch {
  pattern: LearningPattern;
  similarity: number; // 0-1
  reason: string;
  confidence: number; // 0-1
}

/**
 * Learning storage structure (JSON schema)
 */
export interface LearningStorage {
  version: string;
  patterns: LearningPattern[];
  feedback: Feedback[];
  metrics: SuccessMetrics[];
  statistics: {
    totalChanges: number;
    approvedChanges: number;
    modifiedChanges: number;
    rejectedChanges: number;
    averageSuccessRate: number;
    mostUsedPatterns: string[];
    lastUpdated: string;
  };
}

/**
 * Main adaptive learning configuration
 */
export const ADAPTIVE_LEARNING = {
  /**
   * Pattern recognition - what to track
   */
  patternRecognition: {
    track: [
      {
        category: "UI Enhancement Patterns",
        patterns: [
          "Successful UI enhancement approaches",
          "Animation patterns that worked well",
          "Color usage patterns",
          "Layout improvement patterns"
        ]
      },
      {
        category: "Code Patterns",
        patterns: [
          "Component structure patterns",
          "State management patterns",
          "Styling approaches",
          "TypeScript patterns"
        ]
      },
      {
        category: "User Preferences",
        patterns: [
          "Preferred animation styles",
          "Preferred complexity levels",
          "Feedback patterns",
          "Approval patterns"
        ]
      },
      {
        category: "Constraint Patterns",
        patterns: [
          "Successful constraint-respecting solutions",
          "Common constraint violations to avoid",
          "Approaches that preserve project identity"
        ]
      },
      {
        category: "Quality Patterns",
        patterns: [
          "Approaches that consistently pass polish checklist",
          "Iteration patterns that minimize refinements",
          "Quality improvement techniques"
        ]
      }
    ],
    
    apply: {
      instruction: "When similar context appears, reference successful patterns",
      priority: "High-success-rate patterns (> 0.8) preferred",
      adaptation: "Adapt patterns to current context while preserving core approach"
    },
    
    update: {
      instruction: "After user feedback, update pattern success rates",
      method: "Increment useCount, update successRate based on feedback, update lastUsed/lastSuccess"
    }
  },

  /**
   * Feedback integration
   */
  feedbackIntegration: {
    feedbackLoops: {
      immediate: {
        description: "Track user corrections and approvals in real-time",
        actions: [
          "Record feedback immediately after change",
          "Update pattern success rates",
          "Adjust pattern confidence based on feedback"
        ]
      },
      
      shortTerm: {
        description: "Identify patterns in last 10 interactions",
        window: 10, // interactions
        actions: [
          "Analyze recent feedback patterns",
          "Identify trends in user preferences",
          "Adjust pattern recommendations"
        ]
      },
      
      longTerm: {
        description: "Build knowledge base of successful approaches",
        actions: [
          "Maintain pattern database",
          "Track success rates over time",
          "Identify consistently successful patterns",
          "Archive outdated or low-success patterns"
        ]
      }
    },
    
    adaptation: {
      preserve: {
        rule: "Never adapt in ways that violate core constraints",
        check: "All adaptations must pass Layer 0 and Layer 7 validation"
      },
      
      refine: {
        instruction: "Subtly improve approach based on feedback",
        method: "Adjust pattern parameters, not core approach"
      },
      
      learn: {
        instruction: "Recognize when user preferences differ from defaults",
        method: "Track user-specific patterns and preferences"
      }
    }
  },

  /**
   * Success metrics tracking
   */
  successMetrics: {
    quality: {
      factors: [
        {
          metric: "passedPolishChecklist",
          weight: 0.3,
          description: "Does change pass Layer 8 polish checklist?"
        },
        {
          metric: "constraintRespected",
          weight: 0.4,
          description: "Were all constraints from Layer 0 and Layer 7 respected?"
        },
        {
          metric: "designAligned",
          weight: 0.3,
          description: "Does change align with design layers (1-3, 6)?"
        }
      ]
    },
    
    alignment: {
      factors: [
        {
          metric: "userApprovedWithoutModification",
          weight: 0.5,
          description: "Did user approve without requesting changes?"
        },
        {
          metric: "userModifications",
          weight: 0.3,
          description: "What modifications did user request? (lower is better)"
        },
        {
          metric: "userRejected",
          weight: 0.2,
          description: "Was change rejected? (lower is better, but feedback is valuable)"
        }
      ]
    },
    
    constraint: {
      factors: [
        {
          metric: "allConstraintsRespected",
          weight: 1.0,
          description: "Critical - all constraints must be respected",
          critical: true
        }
      ]
    },
    
    efficiency: {
      factors: [
        {
          metric: "iterationsNeeded",
          weight: 0.4,
          description: "Number of iterations (lower is better)"
        },
        {
          metric: "refinementsNeeded",
          weight: 0.4,
          description: "Number of refinements (lower is better)"
        },
        {
          metric: "timeToCompletion",
          weight: 0.2,
          description: "Time to completion (lower is better, if tracked)"
        }
      ]
    },
    
    calculateOverall: (metrics: SuccessMetrics): number => {
      let score = 0;
      let totalWeight = 0;
      
      // Quality (30% weight)
      const qualityScore = (
        (metrics.quality.passedPolishChecklist ? 1 : 0) * 0.3 +
        (metrics.quality.constraintRespected ? 1 : 0) * 0.4 +
        (metrics.quality.designAligned ? 1 : 0) * 0.3
      );
      score += qualityScore * 0.3;
      totalWeight += 0.3;
      
      // Alignment (40% weight)
      const alignmentScore = (
        (metrics.alignment.userApprovedWithoutModification ? 1 : 0) * 0.5 +
        (1 - Math.min(metrics.alignment.userModifications.length / 5, 1)) * 0.3 +
        (metrics.alignment.userRejected ? 0 : 1) * 0.2
      );
      score += alignmentScore * 0.4;
      totalWeight += 0.4;
      
      // Constraint (critical, 20% weight but must pass)
      if (!metrics.constraint.allConstraintsRespected) {
        return 0; // Fail if constraints violated
      }
      score += 1.0 * 0.2;
      totalWeight += 0.2;
      
      // Efficiency (10% weight)
      const efficiencyScore = (
        (1 - Math.min(metrics.efficiency.iterationsNeeded / 5, 1)) * 0.4 +
        (1 - Math.min(metrics.efficiency.refinementsNeeded / 3, 1)) * 0.4 +
        (metrics.efficiency.timeToCompletion ? (1 - Math.min(metrics.efficiency.timeToCompletion / 60, 1)) * 0.2 : 0.1)
      );
      score += efficiencyScore * 0.1;
      totalWeight += 0.1;
      
      return score / totalWeight;
    }
  },

  /**
   * Pattern matching
   */
  patternMatching: {
    factors: [
      {
        factor: "Request similarity",
        weight: 0.4,
        description: "How similar is the current request to pattern examples?"
      },
      {
        factor: "Context similarity",
        weight: 0.3,
        description: "How similar is the context (component type, complexity)?"
      },
      {
        factor: "Success rate",
        weight: 0.2,
        description: "What's the pattern's historical success rate?"
      },
      {
        factor: "Recency",
        weight: 0.1,
        description: "How recently was this pattern successfully used?"
      }
    ],
    
    threshold: {
      high: 0.7, // Strong match, should definitely apply
      medium: 0.5, // Good match, worth considering
      low: 0.3 // Weak match, optional reference
    },
    
    match: (request: string, context: Record<string, unknown>, patterns: LearningPattern[]): PatternMatch[] => {
      // Reference implementation - actual would perform semantic matching
      const matches: PatternMatch[] = [];
      
      patterns.forEach(pattern => {
        // Calculate similarity based on factors
        const similarity = 0.7; // Placeholder
        const confidence = pattern.successRate * similarity;
        
        if (confidence >= ADAPTIVE_LEARNING.patternMatching.threshold.medium) {
          matches.push({
            pattern,
            similarity,
            reason: "Similar request type and context",
            confidence
          });
        }
      });
      
      return matches.sort((a, b) => b.confidence - a.confidence);
    }
  },

  /**
   * Learning storage configuration
   */
  learningStorage: {
    location: "cursor-enhancements/.learning-patterns.json",
    format: "JSON",
    schema: {
      version: "1.0",
      patterns: "Array of LearningPattern",
      feedback: "Array of Feedback",
      metrics: "Array of SuccessMetrics",
      statistics: "LearningStatistics object"
    },
    privacy: {
      local: true, // Stored locally only
      synced: false, // Never synced to cloud
      shared: false // Never shared
    },
    backup: "Recommended: User should backup this file periodically"
  }
} as const;

/**
 * Helper function to update pattern success rate
 */
export function updatePatternSuccessRate(
  pattern: LearningPattern,
  feedback: Feedback
): LearningPattern {
  const newUseCount = pattern.useCount + 1;
  
  let newSuccessRate: number;
  if (feedback.response === "approved") {
    // Successful use - increase success rate
    newSuccessRate = (pattern.successRate * pattern.useCount + 1) / newUseCount;
  } else if (feedback.response === "rejected") {
    // Failed use - decrease success rate
    newSuccessRate = (pattern.successRate * pattern.useCount + 0) / newUseCount;
  } else {
    // Modified or clarified - partial success
    newSuccessRate = (pattern.successRate * pattern.useCount + 0.5) / newUseCount;
  }
  
  return {
    ...pattern,
    useCount: newUseCount,
    successRate: Math.max(0, Math.min(1, newSuccessRate)), // Clamp 0-1
    lastUsed: new Date().toISOString(),
    lastSuccess: feedback.response === "approved" 
      ? new Date().toISOString() 
      : pattern.lastSuccess
  };
}

/**
 * Helper function to find matching patterns
 */
export function findMatchingPatterns(
  request: string,
  context: {
    requestType?: string;
    componentType?: string;
    complexity?: string;
  },
  patterns: LearningPattern[]
): PatternMatch[] {
  return ADAPTIVE_LEARNING.patternMatching.match(request, context, patterns);
}

/**
 * Helper function to initialize learning storage
 */
export function initializeLearningStorage(): LearningStorage {
  return {
    version: "1.0",
    patterns: [],
    feedback: [],
    metrics: [],
    statistics: {
      totalChanges: 0,
      approvedChanges: 0,
      modifiedChanges: 0,
      rejectedChanges: 0,
      averageSuccessRate: 0,
      mostUsedPatterns: [],
      lastUpdated: new Date().toISOString()
    }
  };
}

/**
 * Type exports for use in other layers
 */
export type { LearningPattern, Feedback, SuccessMetrics, PatternMatch, LearningStorage };





















