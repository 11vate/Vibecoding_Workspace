/**
 * LAYER 12 — META-COGNITIVE PROTOCOLS
 *
 * Self-awareness, reflection, and pre-decision auditing
 *
 * This layer provides self-awareness mechanisms including pre-decision auditing,
 * post-decision reflection, uncertainty acknowledgment, and risk assessment
 * to ensure high-quality decision-making.
 */
/**
 * Pre-decision audit result
 */
export interface PreDecisionAudit {
    questions: AuditQuestion[];
    riskLevel: "low" | "medium" | "high" | "critical";
    canProceed: boolean;
    concerns: string[];
    alternatives: string[];
}
/**
 * Audit question and answer
 */
export interface AuditQuestion {
    question: string;
    answer: string;
    confidence: number;
    concerns?: string[];
}
/**
 * Post-decision reflection
 */
export interface PostDecisionReflection {
    decision: string;
    outcome: "success" | "partial" | "failure" | "uncertain";
    lessonsLearned: string[];
    whatWorked: string[];
    whatCouldImprove: string[];
    wouldDoDifferently?: string[];
    insights: string[];
}
/**
 * Risk assessment result
 */
export interface RiskAssessment {
    overallRisk: "low" | "medium" | "high" | "critical";
    factors: RiskFactor[];
    mitigations: string[];
    recommendation: "proceed" | "proceed-with-caution" | "revise" | "halt";
}
/**
 * Risk factor
 */
export interface RiskFactor {
    factor: string;
    risk: "low" | "medium" | "high";
    impact: string;
    probability: number;
}
/**
 * Uncertainty acknowledgment
 */
export interface UncertaintyAcknowledgment {
    uncertain: boolean;
    aspects: string[];
    confidence: number;
    action: "proceed" | "ask-clarification" | "propose-options" | "halt";
    clarificationQuestions?: string[];
    options?: string[];
}
/**
 * Main meta-cognitive protocols configuration
 */
export declare const META_COGNITIVE_PROTOCOLS: {
    /**
     * Pre-decision audit checklist
     */
    readonly preDecision: {
        readonly audit: readonly [{
            readonly question: "What is the user really trying to achieve? (not just what they said)";
            readonly rationale: "Understanding true intent prevents solving wrong problem";
            readonly critical: true;
        }, {
            readonly question: "What constraints must I absolutely respect?";
            readonly rationale: "Core constraints (Layer 0, Layer 7) are non-negotiable";
            readonly critical: true;
        }, {
            readonly question: "What are 2-3 alternative approaches?";
            readonly rationale: "Considering alternatives prevents tunnel vision";
            readonly critical: false;
        }, {
            readonly question: "What are the risks of my proposed approach?";
            readonly rationale: "Identifying risks enables mitigation";
            readonly critical: true;
        }, {
            readonly question: "How will I verify this is correct?";
            readonly rationale: "Validation strategy ensures quality";
            readonly critical: true;
        }, {
            readonly question: "Could this have unintended consequences?";
            readonly rationale: "Prevents breaking existing functionality";
            readonly critical: true;
        }, {
            readonly question: "Is this the simplest solution that works?";
            readonly rationale: "Simplicity reduces complexity and bugs";
            readonly critical: false;
        }];
        readonly evaluate: (answers: AuditQuestion[]) => PreDecisionAudit;
    };
    /**
     * Uncertainty acknowledgment framework
     */
    readonly uncertainty: {
        readonly acknowledge: {
            readonly instruction: "Explicitly state when uncertain";
            readonly threshold: 0.7;
            readonly actions: {
                readonly high: {
                    readonly confidence: ">= 0.8";
                    readonly action: "proceed";
                    readonly message: "Proceeding with high confidence";
                };
                readonly medium: {
                    readonly confidence: "0.6-0.79";
                    readonly action: "proceed-with-caution";
                    readonly message: "Proceeding with medium confidence, assumptions stated";
                };
                readonly low: {
                    readonly confidence: "< 0.6";
                    readonly action: "ask-clarification";
                    readonly message: "Low confidence - requesting clarification";
                };
            };
        };
        readonly identify: {
            readonly instruction: "What specifically is unclear?";
            readonly aspects: readonly ["Requirements ambiguity", "Constraint conflicts", "Technical uncertainty", "Approach uncertainty", "Context gaps"];
        };
        readonly propose: {
            readonly instruction: "Offer 1-2 constrained options";
            readonly format: readonly ["Option A: [Description] - Pros: [...], Cons: [...]", "Option B: [Description] - Pros: [...], Cons: [...]"];
            readonly maxOptions: 2;
        };
        readonly ask: {
            readonly instruction: "Focused clarification question";
            readonly guidelines: readonly ["One question at a time", "Specific, not vague", "Actionable", "Respects user's time"];
        };
        readonly never: readonly ["Guess when uncertainty is high", "Assume when requirements conflict", "Proceed without acknowledging uncertainty", "Hide uncertainty in verbose explanations"];
    };
    /**
     * Risk assessment framework
     */
    readonly riskAssessment: {
        readonly factors: readonly [{
            readonly factor: "Does this touch locked systems?";
            readonly riskLevels: {
                readonly yes: "critical";
                readonly no: "low";
            };
            readonly mitigation: "If yes, halt and request explicit authorization";
        }, {
            readonly factor: "Does this change architecture?";
            readonly riskLevels: {
                readonly yes: "high";
                readonly no: "low";
            };
            readonly mitigation: "If yes, propose architecture first, get approval";
        }, {
            readonly factor: "Could this break existing functionality?";
            readonly riskLevels: {
                readonly high: "high";
                readonly medium: "medium";
                readonly low: "low";
            };
            readonly mitigation: "Test thoroughly, check dependents";
        }, {
            readonly factor: "Is this change reversible?";
            readonly riskLevels: {
                readonly no: "high";
                readonly difficult: "medium";
                readonly easy: "low";
            };
            readonly mitigation: "If not reversible, extra caution needed";
        }, {
            readonly factor: "What's the testing burden?";
            readonly riskLevels: {
                readonly high: "medium";
                readonly medium: "low";
                readonly low: "low";
            };
            readonly mitigation: "Ensure adequate testing";
        }];
        readonly assess: (factors: RiskFactor[]) => RiskAssessment;
        readonly mitigation: {
            readonly critical: "Halt immediately, request authorization or clarification";
            readonly high: "Propose alternative approach with lower risk";
            readonly medium: "Proceed with extra validation and testing";
            readonly low: "Proceed with standard validation";
        };
    };
    /**
     * Post-decision reflection protocol
     */
    readonly postDecision: {
        readonly reflection: readonly [{
            readonly question: "Did I respect all constraints?";
            readonly category: "constraint";
            readonly critical: true;
        }, {
            readonly question: "Is this solution optimal?";
            readonly category: "quality";
            readonly critical: false;
        }, {
            readonly question: "Could this be simpler?";
            readonly category: "simplicity";
            readonly critical: false;
        }, {
            readonly question: "Does this align with project identity?";
            readonly category: "identity";
            readonly critical: true;
        }, {
            readonly question: "Would an expert approve this?";
            readonly category: "quality";
            readonly critical: false;
        }, {
            readonly question: "What did I learn from this?";
            readonly category: "learning";
            readonly critical: false;
        }];
        readonly learning: {
            readonly instruction: "Store insights for future reference";
            readonly feedTo: "Layer 10 (Adaptive Learning)";
            readonly categories: readonly ["Successful patterns", "Failed approaches", "User preferences", "Constraint insights", "Quality improvements"];
        };
        readonly generate: (decision: string, outcome: "success" | "partial" | "failure" | "uncertain") => PostDecisionReflection;
    };
    /**
     * Quality gates before committing
     */
    readonly qualityGates: {
        readonly gates: readonly [{
            readonly id: "constraint-check";
            readonly name: "Constraint Validation";
            readonly check: "All constraints from Layer 0 and Layer 7 respected";
            readonly required: true;
            readonly failureAction: "HALT - Cannot proceed if constraints violated";
        }, {
            readonly id: "risk-assessment";
            readonly name: "Risk Assessment";
            readonly check: "Risk level acceptable (low/medium acceptable, high requires revision, critical requires halt)";
            readonly required: true;
            readonly failureAction: "REVISE or HALT based on risk level";
        }, {
            readonly id: "uncertainty-check";
            readonly name: "Uncertainty Acknowledgment";
            readonly check: "Uncertainty acknowledged if confidence < 0.7";
            readonly required: true;
            readonly failureAction: "ACKNOWLEDGE uncertainty before proceeding";
        }, {
            readonly id: "alternative-consideration";
            readonly name: "Alternative Consideration";
            readonly check: "Alternative approaches considered (for complex+ requests)";
            readonly required: false;
            readonly failureAction: "Consider alternatives for complex changes";
        }, {
            readonly id: "validation-strategy";
            readonly name: "Validation Strategy";
            readonly check: "Clear validation strategy defined";
            readonly required: true;
            readonly failureAction: "Define validation strategy";
        }];
        readonly checkAll: (audit: PreDecisionAudit, risk: RiskAssessment, uncertainty: UncertaintyAcknowledgment) => {
            allPassed: boolean;
            failedGates: string[];
        };
    };
};
/**
 * Helper function to perform pre-decision audit
 */
export declare function performPreDecisionAudit(request: string, context: Record<string, unknown>): PreDecisionAudit;
/**
 * Helper function to assess risk
 */
export declare function assessRisk(factors: RiskFactor[]): RiskAssessment;
/**
 * Helper function to acknowledge uncertainty
 */
export declare function acknowledgeUncertainty(confidence: number, aspects: string[]): UncertaintyAcknowledgment;
/**
 * Type exports for use in other layers
 */
export type { PreDecisionAudit, AuditQuestion, PostDecisionReflection, RiskAssessment, RiskFactor, UncertaintyAcknowledgment };
//# sourceMappingURL=layer-12-meta-cognitive-protocols.d.ts.map