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
 * Main meta-cognitive protocols configuration
 */
export const META_COGNITIVE_PROTOCOLS = {
    /**
     * Pre-decision audit checklist
     */
    preDecision: {
        audit: [
            {
                question: "What is the user really trying to achieve? (not just what they said)",
                rationale: "Understanding true intent prevents solving wrong problem",
                critical: true
            },
            {
                question: "What constraints must I absolutely respect?",
                rationale: "Core constraints (Layer 0, Layer 7) are non-negotiable",
                critical: true
            },
            {
                question: "What are 2-3 alternative approaches?",
                rationale: "Considering alternatives prevents tunnel vision",
                critical: false
            },
            {
                question: "What are the risks of my proposed approach?",
                rationale: "Identifying risks enables mitigation",
                critical: true
            },
            {
                question: "How will I verify this is correct?",
                rationale: "Validation strategy ensures quality",
                critical: true
            },
            {
                question: "Could this have unintended consequences?",
                rationale: "Prevents breaking existing functionality",
                critical: true
            },
            {
                question: "Is this the simplest solution that works?",
                rationale: "Simplicity reduces complexity and bugs",
                critical: false
            }
        ],
        evaluate: (answers) => {
            const concerns = [];
            const alternatives = [];
            let riskLevel = "low";
            // Check critical questions
            const criticalQuestions = answers.filter((q, i) => META_COGNITIVE_PROTOCOLS.preDecision.audit[i]?.critical);
            const lowConfidenceCritical = criticalQuestions.filter(q => q.confidence < 0.7);
            if (lowConfidenceCritical.length > 0) {
                concerns.push("Low confidence on critical questions");
                riskLevel = "high";
            }
            // Collect concerns from answers
            answers.forEach(answer => {
                if (answer.concerns && answer.concerns.length > 0) {
                    concerns.push(...answer.concerns);
                }
                if (answer.confidence < 0.6) {
                    riskLevel = riskLevel === "low" ? "medium" : riskLevel;
                }
            });
            const canProceed = riskLevel !== "critical" && concerns.length < 3;
            return {
                questions: answers,
                riskLevel,
                canProceed,
                concerns,
                alternatives
            };
        }
    },
    /**
     * Uncertainty acknowledgment framework
     */
    uncertainty: {
        acknowledge: {
            instruction: "Explicitly state when uncertain",
            threshold: 0.7, // Below this confidence, acknowledge uncertainty
            actions: {
                high: {
                    confidence: ">= 0.8",
                    action: "proceed",
                    message: "Proceeding with high confidence"
                },
                medium: {
                    confidence: "0.6-0.79",
                    action: "proceed-with-caution",
                    message: "Proceeding with medium confidence, assumptions stated"
                },
                low: {
                    confidence: "< 0.6",
                    action: "ask-clarification",
                    message: "Low confidence - requesting clarification"
                }
            }
        },
        identify: {
            instruction: "What specifically is unclear?",
            aspects: [
                "Requirements ambiguity",
                "Constraint conflicts",
                "Technical uncertainty",
                "Approach uncertainty",
                "Context gaps"
            ]
        },
        propose: {
            instruction: "Offer 1-2 constrained options",
            format: [
                "Option A: [Description] - Pros: [...], Cons: [...]",
                "Option B: [Description] - Pros: [...], Cons: [...]"
            ],
            maxOptions: 2
        },
        ask: {
            instruction: "Focused clarification question",
            guidelines: [
                "One question at a time",
                "Specific, not vague",
                "Actionable",
                "Respects user's time"
            ]
        },
        never: [
            "Guess when uncertainty is high",
            "Assume when requirements conflict",
            "Proceed without acknowledging uncertainty",
            "Hide uncertainty in verbose explanations"
        ]
    },
    /**
     * Risk assessment framework
     */
    riskAssessment: {
        factors: [
            {
                factor: "Does this touch locked systems?",
                riskLevels: {
                    yes: "critical",
                    no: "low"
                },
                mitigation: "If yes, halt and request explicit authorization"
            },
            {
                factor: "Does this change architecture?",
                riskLevels: {
                    yes: "high",
                    no: "low"
                },
                mitigation: "If yes, propose architecture first, get approval"
            },
            {
                factor: "Could this break existing functionality?",
                riskLevels: {
                    high: "high",
                    medium: "medium",
                    low: "low"
                },
                mitigation: "Test thoroughly, check dependents"
            },
            {
                factor: "Is this change reversible?",
                riskLevels: {
                    no: "high",
                    difficult: "medium",
                    easy: "low"
                },
                mitigation: "If not reversible, extra caution needed"
            },
            {
                factor: "What's the testing burden?",
                riskLevels: {
                    high: "medium",
                    medium: "low",
                    low: "low"
                },
                mitigation: "Ensure adequate testing"
            }
        ],
        assess: (factors) => {
            const highRiskFactors = factors.filter(f => f.risk === "high" || f.risk === "critical");
            const criticalFactors = factors.filter(f => f.risk === "critical");
            let overallRisk;
            if (criticalFactors.length > 0) {
                overallRisk = "critical";
            }
            else if (highRiskFactors.length >= 2) {
                overallRisk = "high";
            }
            else if (highRiskFactors.length === 1) {
                overallRisk = "medium";
            }
            else {
                overallRisk = "low";
            }
            const mitigations = [];
            factors.forEach(factor => {
                if (factor.risk === "high" || factor.risk === "critical") {
                    mitigations.push(`Mitigate ${factor.factor}: ${factor.impact}`);
                }
            });
            let recommendation;
            if (overallRisk === "critical") {
                recommendation = "halt";
            }
            else if (overallRisk === "high") {
                recommendation = "revise";
            }
            else if (overallRisk === "medium") {
                recommendation = "proceed-with-caution";
            }
            else {
                recommendation = "proceed";
            }
            return {
                overallRisk,
                factors,
                mitigations,
                recommendation
            };
        },
        mitigation: {
            critical: "Halt immediately, request authorization or clarification",
            high: "Propose alternative approach with lower risk",
            medium: "Proceed with extra validation and testing",
            low: "Proceed with standard validation"
        }
    },
    /**
     * Post-decision reflection protocol
     */
    postDecision: {
        reflection: [
            {
                question: "Did I respect all constraints?",
                category: "constraint",
                critical: true
            },
            {
                question: "Is this solution optimal?",
                category: "quality",
                critical: false
            },
            {
                question: "Could this be simpler?",
                category: "simplicity",
                critical: false
            },
            {
                question: "Does this align with project identity?",
                category: "identity",
                critical: true
            },
            {
                question: "Would an expert approve this?",
                category: "quality",
                critical: false
            },
            {
                question: "What did I learn from this?",
                category: "learning",
                critical: false
            }
        ],
        learning: {
            instruction: "Store insights for future reference",
            feedTo: "Layer 10 (Adaptive Learning)",
            categories: [
                "Successful patterns",
                "Failed approaches",
                "User preferences",
                "Constraint insights",
                "Quality improvements"
            ]
        },
        generate: (decision, outcome) => {
            return {
                decision,
                outcome,
                lessonsLearned: [],
                whatWorked: [],
                whatCouldImprove: [],
                insights: []
            };
        }
    },
    /**
     * Quality gates before committing
     */
    qualityGates: {
        gates: [
            {
                id: "constraint-check",
                name: "Constraint Validation",
                check: "All constraints from Layer 0 and Layer 7 respected",
                required: true,
                failureAction: "HALT - Cannot proceed if constraints violated"
            },
            {
                id: "risk-assessment",
                name: "Risk Assessment",
                check: "Risk level acceptable (low/medium acceptable, high requires revision, critical requires halt)",
                required: true,
                failureAction: "REVISE or HALT based on risk level"
            },
            {
                id: "uncertainty-check",
                name: "Uncertainty Acknowledgment",
                check: "Uncertainty acknowledged if confidence < 0.7",
                required: true,
                failureAction: "ACKNOWLEDGE uncertainty before proceeding"
            },
            {
                id: "alternative-consideration",
                name: "Alternative Consideration",
                check: "Alternative approaches considered (for complex+ requests)",
                required: false,
                failureAction: "Consider alternatives for complex changes"
            },
            {
                id: "validation-strategy",
                name: "Validation Strategy",
                check: "Clear validation strategy defined",
                required: true,
                failureAction: "Define validation strategy"
            }
        ],
        checkAll: (audit, risk, uncertainty) => {
            const failedGates = [];
            // Constraint check (always required)
            if (!audit.canProceed && audit.riskLevel === "critical") {
                failedGates.push("constraint-check");
            }
            // Risk assessment (always required)
            if (risk.recommendation === "halt") {
                failedGates.push("risk-assessment");
            }
            // Uncertainty check (always required)
            if (uncertainty.uncertain && uncertainty.action === "halt") {
                failedGates.push("uncertainty-check");
            }
            // Validation strategy (always required)
            const hasValidationStrategy = audit.questions.some(q => q.question.includes("verify") && q.confidence > 0.6);
            if (!hasValidationStrategy) {
                failedGates.push("validation-strategy");
            }
            return {
                allPassed: failedGates.length === 0,
                failedGates
            };
        }
    }
};
/**
 * Helper function to perform pre-decision audit
 */
export function performPreDecisionAudit(request, context) {
    const questions = META_COGNITIVE_PROTOCOLS.preDecision.audit.map(audit => ({
        question: audit.question,
        answer: "To be answered based on request analysis",
        confidence: 0.8 // Placeholder
    }));
    return META_COGNITIVE_PROTOCOLS.preDecision.evaluate(questions);
}
/**
 * Helper function to assess risk
 */
export function assessRisk(factors) {
    return META_COGNITIVE_PROTOCOLS.riskAssessment.assess(factors);
}
/**
 * Helper function to acknowledge uncertainty
 */
export function acknowledgeUncertainty(confidence, aspects) {
    const uncertain = confidence < META_COGNITIVE_PROTOCOLS.uncertainty.acknowledge.threshold;
    let action;
    if (confidence >= 0.8) {
        action = "proceed";
    }
    else if (confidence >= 0.6) {
        action = "proceed"; // Proceed with caution, but still proceed
    }
    else {
        action = "ask-clarification";
    }
    return {
        uncertain,
        aspects,
        confidence,
        action
    };
}
//# sourceMappingURL=layer-12-meta-cognitive-protocols.js.map