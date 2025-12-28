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
    successRate: number;
    useCount: number;
    lastUsed: string;
    lastSuccess: string;
    examples: string[];
}
/**
 * User feedback
 */
export interface Feedback {
    id: string;
    changeId: string;
    timestamp: string;
    response: "approved" | "modified" | "rejected" | "clarified";
    feedback?: string;
    patterns: string[];
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
        timeToCompletion?: number;
    };
}
/**
 * Pattern match result
 */
export interface PatternMatch {
    pattern: LearningPattern;
    similarity: number;
    reason: string;
    confidence: number;
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
export declare const ADAPTIVE_LEARNING: {
    /**
     * Pattern recognition - what to track
     */
    readonly patternRecognition: {
        readonly track: readonly [{
            readonly category: "UI Enhancement Patterns";
            readonly patterns: readonly ["Successful UI enhancement approaches", "Animation patterns that worked well", "Color usage patterns", "Layout improvement patterns"];
        }, {
            readonly category: "Code Patterns";
            readonly patterns: readonly ["Component structure patterns", "State management patterns", "Styling approaches", "TypeScript patterns"];
        }, {
            readonly category: "User Preferences";
            readonly patterns: readonly ["Preferred animation styles", "Preferred complexity levels", "Feedback patterns", "Approval patterns"];
        }, {
            readonly category: "Constraint Patterns";
            readonly patterns: readonly ["Successful constraint-respecting solutions", "Common constraint violations to avoid", "Approaches that preserve project identity"];
        }, {
            readonly category: "Quality Patterns";
            readonly patterns: readonly ["Approaches that consistently pass polish checklist", "Iteration patterns that minimize refinements", "Quality improvement techniques"];
        }];
        readonly apply: {
            readonly instruction: "When similar context appears, reference successful patterns";
            readonly priority: "High-success-rate patterns (> 0.8) preferred";
            readonly adaptation: "Adapt patterns to current context while preserving core approach";
        };
        readonly update: {
            readonly instruction: "After user feedback, update pattern success rates";
            readonly method: "Increment useCount, update successRate based on feedback, update lastUsed/lastSuccess";
        };
    };
    /**
     * Feedback integration
     */
    readonly feedbackIntegration: {
        readonly feedbackLoops: {
            readonly immediate: {
                readonly description: "Track user corrections and approvals in real-time";
                readonly actions: readonly ["Record feedback immediately after change", "Update pattern success rates", "Adjust pattern confidence based on feedback"];
            };
            readonly shortTerm: {
                readonly description: "Identify patterns in last 10 interactions";
                readonly window: 10;
                readonly actions: readonly ["Analyze recent feedback patterns", "Identify trends in user preferences", "Adjust pattern recommendations"];
            };
            readonly longTerm: {
                readonly description: "Build knowledge base of successful approaches";
                readonly actions: readonly ["Maintain pattern database", "Track success rates over time", "Identify consistently successful patterns", "Archive outdated or low-success patterns"];
            };
        };
        readonly adaptation: {
            readonly preserve: {
                readonly rule: "Never adapt in ways that violate core constraints";
                readonly check: "All adaptations must pass Layer 0 and Layer 7 validation";
            };
            readonly refine: {
                readonly instruction: "Subtly improve approach based on feedback";
                readonly method: "Adjust pattern parameters, not core approach";
            };
            readonly learn: {
                readonly instruction: "Recognize when user preferences differ from defaults";
                readonly method: "Track user-specific patterns and preferences";
            };
        };
    };
    /**
     * Success metrics tracking
     */
    readonly successMetrics: {
        readonly quality: {
            readonly factors: readonly [{
                readonly metric: "passedPolishChecklist";
                readonly weight: 0.3;
                readonly description: "Does change pass Layer 8 polish checklist?";
            }, {
                readonly metric: "constraintRespected";
                readonly weight: 0.4;
                readonly description: "Were all constraints from Layer 0 and Layer 7 respected?";
            }, {
                readonly metric: "designAligned";
                readonly weight: 0.3;
                readonly description: "Does change align with design layers (1-3, 6)?";
            }];
        };
        readonly alignment: {
            readonly factors: readonly [{
                readonly metric: "userApprovedWithoutModification";
                readonly weight: 0.5;
                readonly description: "Did user approve without requesting changes?";
            }, {
                readonly metric: "userModifications";
                readonly weight: 0.3;
                readonly description: "What modifications did user request? (lower is better)";
            }, {
                readonly metric: "userRejected";
                readonly weight: 0.2;
                readonly description: "Was change rejected? (lower is better, but feedback is valuable)";
            }];
        };
        readonly constraint: {
            readonly factors: readonly [{
                readonly metric: "allConstraintsRespected";
                readonly weight: 1;
                readonly description: "Critical - all constraints must be respected";
                readonly critical: true;
            }];
        };
        readonly efficiency: {
            readonly factors: readonly [{
                readonly metric: "iterationsNeeded";
                readonly weight: 0.4;
                readonly description: "Number of iterations (lower is better)";
            }, {
                readonly metric: "refinementsNeeded";
                readonly weight: 0.4;
                readonly description: "Number of refinements (lower is better)";
            }, {
                readonly metric: "timeToCompletion";
                readonly weight: 0.2;
                readonly description: "Time to completion (lower is better, if tracked)";
            }];
        };
        readonly calculateOverall: (metrics: SuccessMetrics) => number;
    };
    /**
     * Pattern matching
     */
    readonly patternMatching: {
        readonly factors: readonly [{
            readonly factor: "Request similarity";
            readonly weight: 0.4;
            readonly description: "How similar is the current request to pattern examples?";
        }, {
            readonly factor: "Context similarity";
            readonly weight: 0.3;
            readonly description: "How similar is the context (component type, complexity)?";
        }, {
            readonly factor: "Success rate";
            readonly weight: 0.2;
            readonly description: "What's the pattern's historical success rate?";
        }, {
            readonly factor: "Recency";
            readonly weight: 0.1;
            readonly description: "How recently was this pattern successfully used?";
        }];
        readonly threshold: {
            readonly high: 0.7;
            readonly medium: 0.5;
            readonly low: 0.3;
        };
        readonly match: (request: string, context: Record<string, unknown>, patterns: LearningPattern[]) => PatternMatch[];
    };
    /**
     * Learning storage configuration
     */
    readonly learningStorage: {
        readonly location: "cursor-enhancements/.learning-patterns.json";
        readonly format: "JSON";
        readonly schema: {
            readonly version: "1.0";
            readonly patterns: "Array of LearningPattern";
            readonly feedback: "Array of Feedback";
            readonly metrics: "Array of SuccessMetrics";
            readonly statistics: "LearningStatistics object";
        };
        readonly privacy: {
            readonly local: true;
            readonly synced: false;
            readonly shared: false;
        };
        readonly backup: "Recommended: User should backup this file periodically";
    };
};
/**
 * Helper function to update pattern success rate
 */
export declare function updatePatternSuccessRate(pattern: LearningPattern, feedback: Feedback): LearningPattern;
/**
 * Helper function to find matching patterns
 */
export declare function findMatchingPatterns(request: string, context: {
    requestType?: string;
    componentType?: string;
    complexity?: string;
}, patterns: LearningPattern[]): PatternMatch[];
/**
 * Helper function to initialize learning storage
 */
export declare function initializeLearningStorage(): LearningStorage;
/**
 * Type exports for use in other layers
 */
export type { LearningPattern, Feedback, SuccessMetrics, PatternMatch, LearningStorage };
//# sourceMappingURL=layer-10-adaptive-learning.d.ts.map