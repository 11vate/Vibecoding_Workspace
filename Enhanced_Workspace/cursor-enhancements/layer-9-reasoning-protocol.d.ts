/**
 * LAYER 9 — REASONING PROTOCOL
 *
 * Structured reasoning processes using Chain-of-Thought (CoT), Tree-of-Thought (ToT), and Self-Consistency
 *
 * This layer provides frameworks for transparent, multi-path reasoning that ensures
 * complex decisions are made with full consideration of constraints and alternatives.
 */
/**
 * Reasoning complexity levels determine which reasoning techniques to apply
 */
export type ReasoningComplexity = "simple" | "moderate" | "complex" | "architectural";
/**
 * Reasoning trace step types
 */
export type ReasoningStepType = "understanding" | "context" | "constraint" | "option" | "evaluation" | "decision" | "implementation" | "validation";
/**
 * Single reasoning step in a trace
 */
export interface ReasoningTrace {
    step: number;
    type: ReasoningStepType;
    content: string;
    confidence?: number;
    references?: string[];
}
/**
 * Complete reasoning protocol for a request
 */
export interface ReasoningProtocol {
    complexity: ReasoningComplexity;
    traces: ReasoningTrace[];
    consistencyChecks: ConsistencyCheck[];
    confidenceScore: number;
    selectedPath?: string;
    alternativePaths?: string[];
}
/**
 * Self-consistency check result
 */
export interface ConsistencyCheck {
    check: string;
    layer?: string;
    passed: boolean;
    notes?: string;
}
/**
 * Tree-of-Thought path evaluation
 */
export interface ThoughtPath {
    id: string;
    description: string;
    scores: {
        constraintAlignment: number;
        risk: number;
        complexity: number;
        qualityPotential: number;
    };
    pros: string[];
    cons: string[];
    overallScore: number;
}
/**
 * Main reasoning protocol configuration
 */
export declare const REASONING_PROTOCOL: {
    /**
     * Complexity thresholds determine reasoning depth required
     */
    readonly thresholds: {
        readonly simple: {
            readonly description: "Single-step changes, low risk, clear constraints";
            readonly maxSteps: 3;
            readonly cotRequired: false;
            readonly totRequired: false;
            readonly consistencyChecks: readonly ["constraint", "quality"];
            readonly examples: readonly ["Add a CSS animation", "Update text content", "Fix a typo", "Adjust spacing value"];
        };
        readonly moderate: {
            readonly description: "Multi-step changes, some uncertainty, standard patterns";
            readonly maxSteps: 5;
            readonly cotRequired: true;
            readonly totRequired: false;
            readonly consistencyChecks: readonly ["constraint", "quality", "pattern"];
            readonly examples: readonly ["Refactor a component", "Add a new UI feature", "Improve accessibility", "Enhance visual feedback"];
        };
        readonly complex: {
            readonly description: "Significant changes, multiple valid approaches, higher risk";
            readonly maxSteps: 8;
            readonly cotRequired: true;
            readonly totRecommended: true;
            readonly consistencyChecks: readonly ["all"];
            readonly examples: readonly ["Redesign major UI flow", "Add complex new feature", "Significant refactoring", "Multi-component changes"];
        };
        readonly architectural: {
            readonly description: "System-wide changes, multiple systems affected, critical impact";
            readonly maxSteps: 10;
            readonly cotRequired: true;
            readonly totRequired: true;
            readonly consistencyChecks: readonly ["all"];
            readonly reviewRequired: true;
            readonly examples: readonly ["Change state management approach", "Restructure project architecture", "Modify core data flow", "System-wide design changes"];
        };
    };
    /**
     * Chain-of-Thought reasoning framework
     */
    readonly chainOfThought: {
        readonly steps: {
            readonly understanding: {
                readonly question: "What is the request really asking?";
                readonly guidance: "Identify the core intent, not just surface-level requirements. What problem are we solving?";
                readonly required: true;
            };
            readonly context: {
                readonly question: "What layers, constraints, and context apply?";
                readonly guidance: "Identify relevant layers (0-8), design systems, locked systems, and codebase context";
                readonly required: true;
            };
            readonly constraint: {
                readonly question: "What cannot be changed?";
                readonly guidance: "Explicitly list hard boundaries from Layer 0 and Layer 7, plus any implicit constraints";
                readonly required: true;
            };
            readonly option: {
                readonly question: "What are 2-3 viable approaches?";
                readonly guidance: "Generate multiple solution paths, even if one seems obvious";
                readonly required: false;
            };
            readonly evaluation: {
                readonly question: "What are the pros/cons of each approach?";
                readonly guidance: "Evaluate against: constraint alignment, risk, complexity, quality potential";
                readonly required: false;
            };
            readonly decision: {
                readonly question: "Which approach best aligns with constraints and goals?";
                readonly guidance: "Justify the selection explicitly. If multiple paths tie, present options";
                readonly required: true;
            };
            readonly implementation: {
                readonly question: "What's the step-by-step execution plan?";
                readonly guidance: "Break down into concrete, testable steps. Reference Layer 5 (iteration loop) principles";
                readonly required: true;
            };
            readonly validation: {
                readonly question: "How will we verify this is correct and complete?";
                readonly guidance: "Reference Layer 8 (polish checklist) and Layer 0/7 constraint validation";
                readonly required: true;
            };
        };
    };
    /**
     * Tree-of-Thought multi-path evaluation
     */
    readonly treeOfThought: {
        readonly generate: {
            readonly instruction: "Create 2-3 distinct solution paths";
            readonly minPaths: 2;
            readonly maxPaths: 3;
        };
        readonly evaluate: {
            readonly factors: readonly [{
                readonly name: "constraintAlignment";
                readonly weight: 0.4;
                readonly description: "How well does this align with Layer 0 and Layer 7 constraints?";
            }, {
                readonly name: "risk";
                readonly weight: 0.2;
                readonly description: "What's the risk of unintended consequences? (lower is better)";
            }, {
                readonly name: "complexity";
                readonly weight: 0.1;
                readonly description: "How complex is this approach? (lower is better, but don't sacrifice quality)";
            }, {
                readonly name: "qualityPotential";
                readonly weight: 0.3;
                readonly description: "What's the potential quality/impact of this approach?";
            }];
            readonly calculateOverallScore: (scores: ThoughtPath["scores"]) => number;
        };
        readonly compare: "Compare paths side-by-side with pros/cons";
        readonly select: {
            readonly instruction: "Choose highest-scoring path OR present top options if ties (within 0.1)";
            readonly tieThreshold: 0.1;
        };
        readonly explain: "Explicitly state why this path was chosen, referencing constraint alignment and quality potential";
    };
    /**
     * Self-consistency checking framework
     */
    readonly selfConsistency: {
        readonly checks: readonly [{
            readonly check: "Does this align with Layer 0 (project directive)?";
            readonly layer: "Layer 0";
            readonly critical: true;
        }, {
            readonly check: "Does this respect Layer 7 (system locks)?";
            readonly layer: "Layer 7";
            readonly critical: true;
        }, {
            readonly check: "Does this follow Layer 1 (UI canon)?";
            readonly layer: "Layer 1";
            readonly critical: false;
        }, {
            readonly check: "Does this match Layer 2 (visual analogies)?";
            readonly layer: "Layer 2";
            readonly critical: false;
        }, {
            readonly check: "Is this consistent with similar code in codebase?";
            readonly layer: "Context";
            readonly critical: false;
        }, {
            readonly check: "Would this pass Layer 8 (polish checklist)?";
            readonly layer: "Layer 8";
            readonly critical: false;
        }, {
            readonly check: "Does this preserve project identity?";
            readonly layer: "Layer 0";
            readonly critical: true;
        }];
        readonly action: {
            readonly allPass: "Proceed with implementation";
            readonly criticalFail: "Halt immediately, revise approach or request clarification";
            readonly nonCriticalFail: "Note the inconsistency, proceed if acceptable tradeoff justified";
        };
    };
    /**
     * Confidence scoring system
     */
    readonly confidenceScoring: {
        readonly factors: {
            readonly requirementClarity: {
                readonly weight: 0.3;
                readonly description: "How clear are the requirements? (0-1)";
                readonly assessment: readonly ["0.0-0.3: Vague or ambiguous request", "0.4-0.6: Somewhat clear but needs interpretation", "0.7-0.9: Clear requirements with minor ambiguity", "0.9-1.0: Crystal clear, specific requirements"];
            };
            readonly constraintAlignment: {
                readonly weight: 0.3;
                readonly description: "How well does this align with constraints? (0-1)";
                readonly assessment: readonly ["0.0-0.3: Conflicts with constraints", "0.4-0.6: Somewhat aligned, minor concerns", "0.7-0.9: Well aligned, minor edge cases", "0.9-1.0: Perfectly aligned"];
            };
            readonly codebasePrecedent: {
                readonly weight: 0.2;
                readonly description: "Does similar code exist? (0-1)";
                readonly assessment: readonly ["0.0-0.3: No precedent, novel approach needed", "0.4-0.6: Some similar patterns, needs adaptation", "0.7-0.9: Clear precedent, straightforward application", "0.9-1.0: Exact precedent exists"];
            };
            readonly technicalFeasibility: {
                readonly weight: 0.2;
                readonly description: "Is this technically sound? (0-1)";
                readonly assessment: readonly ["0.0-0.3: Technical concerns, may not work", "0.4-0.6: Possible but uncertain", "0.7-0.9: Technically sound, minor risks", "0.9-1.0: Clearly feasible"];
            };
        };
        readonly thresholds: {
            readonly low: {
                readonly min: 0;
                readonly max: 0.59;
                readonly action: "Must ask for clarification before proceeding";
                readonly output: "Confidence: LOW - Need clarification on [specific aspects]";
            };
            readonly medium: {
                readonly min: 0.6;
                readonly max: 0.79;
                readonly action: "Proceed with caution, state assumptions explicitly";
                readonly output: "Confidence: MEDIUM - Proceeding with assumptions: [list assumptions]";
            };
            readonly high: {
                readonly min: 0.8;
                readonly max: 1;
                readonly action: "Proceed with confidence";
                readonly output: "Confidence: HIGH - All factors well understood";
            };
        };
        readonly calculate: (scores: {
            requirementClarity: number;
            constraintAlignment: number;
            codebasePrecedent: number;
            technicalFeasibility: number;
        }) => number;
    };
};
/**
 * Helper function to assess reasoning complexity
 */
export declare function assessComplexity(request: string, affectsLockedSystems: boolean, requiresArchitecture: boolean, scope: "single-component" | "multiple-components" | "system-wide"): ReasoningComplexity;
/**
 * Generate reasoning trace for a request
 */
export declare function generateReasoningTrace(complexity: ReasoningComplexity, request: string, context: {
    relevantLayers?: string[];
    constraints?: string[];
    options?: string[];
}): ReasoningTrace[];
/**
 * Perform self-consistency checks
 */
export declare function performConsistencyChecks(proposedChange: string, relevantLayers: string[]): ConsistencyCheck[];
/**
 * Calculate confidence score
 */
export declare function calculateConfidenceScore(scores: {
    requirementClarity: number;
    constraintAlignment: number;
    codebasePrecedent: number;
    technicalFeasibility: number;
}): {
    score: number;
    level: "low" | "medium" | "high";
    message: string;
};
/**
 * Type exports for use in other layers
 */
export type { ReasoningComplexity, ReasoningTrace, ReasoningProtocol, ConsistencyCheck, ThoughtPath };
//# sourceMappingURL=layer-9-reasoning-protocol.d.ts.map