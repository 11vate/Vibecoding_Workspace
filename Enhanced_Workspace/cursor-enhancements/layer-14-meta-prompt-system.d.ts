/**
 * LAYER 14 — META-PROMPT SYSTEM
 *
 * Unified activation system that coordinates all layers (0-13)
 *
 * This is the orchestration layer that determines which layers activate when,
 * coordinates reasoning flows, synthesizes context, and ensures all quality
 * gates pass before output.
 */
import type { ReasoningComplexity } from './layer-9-reasoning-protocol';
/**
 * Layer activation result
 */
export interface LayerActivation {
    layerId: string;
    layerName: string;
    activated: boolean;
    reason?: string;
    output?: unknown;
}
/**
 * Execution phase in the meta-prompt flow
 */
export type ExecutionPhase = "pre-audit" | "context-retrieval" | "reasoning" | "constraint-check" | "architecture" | "iteration" | "design-guidance" | "execution" | "validation" | "learning" | "reflection" | "output";
/**
 * Meta-prompt execution state
 */
export interface MetaPromptState {
    request: string;
    complexity: ReasoningComplexity;
    phase: ExecutionPhase;
    activatedLayers: LayerActivation[];
    reasoningTrace?: unknown;
    confidenceScore?: number;
    consistencyChecks?: unknown[];
    qualityGates: {
        constraintCheck: boolean;
        assetEnforcement: boolean;
        designAlignment: boolean;
        codeQuality: boolean;
        polishChecklist: boolean;
    };
}
/**
 * Output format configuration
 */
export interface OutputFormat {
    includeReasoningTrace: boolean;
    includeConfidenceScore: boolean;
    includeConsistencyChecks: boolean;
    includeQualityGates: boolean;
    includeAlternatives: boolean;
    levelOfDetail: "minimal" | "standard" | "verbose";
}
/**
 * Main meta-prompt system configuration
 */
export declare const META_PROMPT_SYSTEM: {
    /**
     * Layer activation protocol
     * Determines which layers activate based on request characteristics
     */
    readonly layerActivation: {
        /**
         * Always active layers (foundation)
         */
        readonly alwaysActive: readonly [{
            readonly id: "layer-0";
            readonly name: "Project Directive";
            readonly reason: "Constitutional boundary check";
        }, {
            readonly id: "layer-7";
            readonly name: "System Lock";
            readonly reason: "System boundary validation";
        }, {
            readonly id: "layer-42";
            readonly name: "Asset Enforcement";
            readonly reason: "Asset existence validation - required for all code generation";
        }];
        /**
         * Complexity-based activation
         */
        readonly byComplexity: {
            readonly simple: readonly [{
                readonly id: "layer-8";
                readonly name: "Polish Checklist";
                readonly reason: "Quality validation";
            }, {
                readonly id: "layer-4";
                readonly name: "Prompt Protocol";
                readonly reason: "Communication interpretation";
            }];
            readonly moderate: readonly [{
                readonly id: "layer-9";
                readonly name: "Reasoning Protocol";
                readonly reason: "Structured reasoning required";
            }, {
                readonly id: "layer-8";
                readonly name: "Polish Checklist";
                readonly reason: "Quality validation";
            }, {
                readonly id: "layer-5";
                readonly name: "Iteration Loop";
                readonly reason: "Multi-step execution planning";
            }, {
                readonly id: "layer-4";
                readonly name: "Prompt Protocol";
                readonly reason: "Communication interpretation";
            }, {
                readonly id: "layer-1";
                readonly name: "UI Canon";
                readonly reason: "Design guidance (if UI related)";
            }, {
                readonly id: "layer-2";
                readonly name: "Visual Analogies";
                readonly reason: "Design guidance (if UI related)";
            }];
            readonly complex: readonly [{
                readonly id: "layer-12";
                readonly name: "Meta-Cognitive Protocols";
                readonly reason: "Pre-decision audit";
            }, {
                readonly id: "layer-13";
                readonly name: "Context Retrieval";
                readonly reason: "Enhanced context synthesis";
            }, {
                readonly id: "layer-9";
                readonly name: "Reasoning Protocol";
                readonly reason: "Advanced reasoning (CoT + ToT)";
            }, {
                readonly id: "layer-11";
                readonly name: "Architecture Intelligence";
                readonly reason: "Pattern recognition and quality";
            }, {
                readonly id: "layer-8";
                readonly name: "Polish Checklist";
                readonly reason: "Quality validation";
            }, {
                readonly id: "layer-5";
                readonly name: "Iteration Loop";
                readonly reason: "Multi-step execution planning";
            }, {
                readonly id: "layer-4";
                readonly name: "Prompt Protocol";
                readonly reason: "Communication interpretation";
            }, {
                readonly id: "layer-1";
                readonly name: "UI Canon";
                readonly reason: "Design guidance (if UI related)";
            }, {
                readonly id: "layer-2";
                readonly name: "Visual Analogies";
                readonly reason: "Design guidance (if UI related)";
            }, {
                readonly id: "layer-3";
                readonly name: "UI States";
                readonly reason: "Design guidance (if UI related)";
            }, {
                readonly id: "layer-6";
                readonly name: "UI Lore";
                readonly reason: "Design guidance (if UI related)";
            }];
            readonly architectural: readonly [{
                readonly id: "layer-12";
                readonly name: "Meta-Cognitive Protocols";
                readonly reason: "Critical pre-decision audit";
            }, {
                readonly id: "layer-13";
                readonly name: "Context Retrieval";
                readonly reason: "Comprehensive context synthesis";
            }, {
                readonly id: "layer-9";
                readonly name: "Reasoning Protocol";
                readonly reason: "Full reasoning (CoT + ToT + Self-Consistency)";
            }, {
                readonly id: "layer-11";
                readonly name: "Architecture Intelligence";
                readonly reason: "Architecture pattern recognition";
            }, {
                readonly id: "layer-10";
                readonly name: "Adaptive Learning";
                readonly reason: "Apply learned patterns";
            }, {
                readonly id: "layer-8";
                readonly name: "Polish Checklist";
                readonly reason: "Comprehensive quality validation";
            }, {
                readonly id: "layer-5";
                readonly name: "Iteration Loop";
                readonly reason: "Phased execution planning";
            }, {
                readonly id: "layer-4";
                readonly name: "Prompt Protocol";
                readonly reason: "Communication interpretation";
            }, {
                readonly id: "charter-professional";
                readonly name: "Professional Stack Charter";
                readonly reason: "Architecture standards";
            }, {
                readonly id: "charter-co-architect";
                readonly name: "Co-Architect Charter";
                readonly reason: "Role and principles";
            }];
        };
        /**
         * Context-based activation (additional layers based on request content)
         */
        readonly byContext: {
            readonly uiRelated: readonly [{
                readonly id: "layer-1";
                readonly name: "UI Canon";
                readonly reason: "UI design decisions";
            }, {
                readonly id: "layer-2";
                readonly name: "Visual Analogies";
                readonly reason: "Visual feeling and emotion";
            }, {
                readonly id: "layer-3";
                readonly name: "UI States";
                readonly reason: "State-driven UI theming";
            }, {
                readonly id: "layer-6";
                readonly name: "UI Lore";
                readonly reason: "Screen narrative context";
            }];
            readonly codeRelated: readonly [{
                readonly id: "layer-11";
                readonly name: "Architecture Intelligence";
                readonly reason: "Code patterns and quality";
            }, {
                readonly id: "charter-professional";
                readonly name: "Professional Stack Charter";
                readonly reason: "Development standards";
            }];
            readonly assetCreation: readonly [{
                readonly id: "layer-36";
                readonly name: "Multimodal Core";
                readonly reason: "Multimodal asset generation and analysis";
            }, {
                readonly id: "layer-39";
                readonly name: "Asset Pipeline";
                readonly reason: "End-to-end asset pipeline orchestration";
            }, {
                readonly id: "layer-31";
                readonly name: "Asset Creation & Generation";
                readonly reason: "Asset creation guidance";
            }, {
                readonly id: "layer-32";
                readonly name: "Asset Management & Organization";
                readonly reason: "Asset organization and management";
            }, {
                readonly id: "layer-1";
                readonly name: "UI Canon";
                readonly reason: "Asset style guidelines";
            }, {
                readonly id: "layer-15";
                readonly name: "Design Tokens";
                readonly reason: "Asset dimension and style tokens";
            }];
            readonly multimodal: readonly [{
                readonly id: "layer-36";
                readonly name: "Multimodal Core";
                readonly reason: "Multimodal understanding and generation";
            }, {
                readonly id: "layer-38";
                readonly name: "Knowledge Graph";
                readonly reason: "Semantic context and memory";
            }, {
                readonly id: "layer-41";
                readonly name: "Prompt Orchestration";
                readonly reason: "Multimodal prompt coordination";
            }, {
                readonly id: "layer-13";
                readonly name: "Context Retrieval";
                readonly reason: "Enhanced context with visual understanding";
            }];
            readonly gameFramework: readonly [{
                readonly id: "layer-37";
                readonly name: "Game Frameworks";
                readonly reason: "Framework-specific code generation";
            }, {
                readonly id: "layer-36";
                readonly name: "Multimodal Core";
                readonly reason: "Asset-to-code bridging";
            }, {
                readonly id: "layer-39";
                readonly name: "Asset Pipeline";
                readonly reason: "Asset integration";
            }, {
                readonly id: "layer-21";
                readonly name: "Code Generation";
                readonly reason: "Code generation patterns";
            }];
            readonly simulation: readonly [{
                readonly id: "layer-40";
                readonly name: "Simulation Engine";
                readonly reason: "Game simulation and balance analysis";
            }, {
                readonly id: "layer-11";
                readonly name: "Architecture Intelligence";
                readonly reason: "System analysis";
            }, {
                readonly id: "layer-22";
                readonly name: "Testing Strategies";
                readonly reason: "Gameplay testing";
            }];
            readonly assetSourcing: readonly [{
                readonly id: "layer-33";
                readonly name: "Free Asset Sourcing & Licensing";
                readonly reason: "Asset sourcing and license compliance";
            }, {
                readonly id: "layer-32";
                readonly name: "Asset Management & Organization";
                readonly reason: "Asset organization and tracking";
            }, {
                readonly id: "layer-29";
                readonly name: "Documentation";
                readonly reason: "License documentation";
            }];
            readonly animation: readonly [{
                readonly id: "layer-34";
                readonly name: "Animation Frameworks & Systems";
                readonly reason: "Animation system guidance";
            }, {
                readonly id: "layer-1";
                readonly name: "UI Canon";
                readonly reason: "Animation principles";
            }, {
                readonly id: "layer-23";
                readonly name: "Performance Optimization";
                readonly reason: "Animation performance optimization";
            }];
            readonly gameContent: readonly [{
                readonly id: "layer-35";
                readonly name: "Game Content Generation";
                readonly reason: "Game content generation patterns";
            }, {
                readonly id: "layer-21";
                readonly name: "Code Generation";
                readonly reason: "Generation algorithms";
            }, {
                readonly id: "layer-26";
                readonly name: "Architecture Patterns";
                readonly reason: "Content architecture";
            }];
            readonly refactoring: readonly [{
                readonly id: "layer-13";
                readonly name: "Context Retrieval";
                readonly reason: "Find similar patterns";
            }, {
                readonly id: "layer-11";
                readonly name: "Architecture Intelligence";
                readonly reason: "Pattern recognition";
            }, {
                readonly id: "layer-25";
                readonly name: "Refactoring & Code Quality";
                readonly reason: "Refactoring techniques";
            }, {
                readonly id: "layer-10";
                readonly name: "Adaptive Learning";
                readonly reason: "Apply learned patterns";
            }];
            readonly codeGeneration: readonly [{
                readonly id: "layer-21";
                readonly name: "Code Generation & Patterns";
                readonly reason: "Design patterns and algorithms";
            }, {
                readonly id: "layer-11";
                readonly name: "Architecture Intelligence";
                readonly reason: "Code quality patterns";
            }, {
                readonly id: "layer-30";
                readonly name: "Bug Prevention";
                readonly reason: "Error handling patterns";
            }];
            readonly testing: readonly [{
                readonly id: "layer-22";
                readonly name: "Testing Strategies";
                readonly reason: "Testing patterns and quality gates";
            }, {
                readonly id: "layer-30";
                readonly name: "Bug Prevention";
                readonly reason: "Bug prevention testing";
            }];
            readonly performance: readonly [{
                readonly id: "layer-23";
                readonly name: "Performance Optimization";
                readonly reason: "Performance patterns and metrics";
            }, {
                readonly id: "layer-19";
                readonly name: "Visual Quality";
                readonly reason: "Performance quality gates";
            }];
            readonly security: readonly [{
                readonly id: "layer-24";
                readonly name: "Security Patterns";
                readonly reason: "Security best practices";
            }, {
                readonly id: "layer-19";
                readonly name: "Visual Quality";
                readonly reason: "Security quality gates";
            }];
            readonly architecture: readonly [{
                readonly id: "layer-26";
                readonly name: "Architecture Patterns";
                readonly reason: "Advanced architecture patterns";
            }, {
                readonly id: "layer-11";
                readonly name: "Architecture Intelligence";
                readonly reason: "Architecture decision support";
            }];
            readonly apiDesign: readonly [{
                readonly id: "layer-27";
                readonly name: "API Design";
                readonly reason: "API design patterns";
            }, {
                readonly id: "layer-22";
                readonly name: "Testing Strategies";
                readonly reason: "API testing patterns";
            }, {
                readonly id: "layer-24";
                readonly name: "Security Patterns";
                readonly reason: "API security";
            }];
            readonly database: readonly [{
                readonly id: "layer-28";
                readonly name: "Database Design";
                readonly reason: "Database patterns and optimization";
            }, {
                readonly id: "layer-23";
                readonly name: "Performance Optimization";
                readonly reason: "Query optimization";
            }, {
                readonly id: "layer-27";
                readonly name: "API Design";
                readonly reason: "Data access patterns";
            }];
            readonly documentation: readonly [{
                readonly id: "layer-29";
                readonly name: "Documentation";
                readonly reason: "Documentation patterns";
            }, {
                readonly id: "layer-11";
                readonly name: "Architecture Intelligence";
                readonly reason: "Documentation requirements";
            }];
            readonly bugPrevention: readonly [{
                readonly id: "layer-30";
                readonly name: "Bug Prevention";
                readonly reason: "Bug prevention and error handling";
            }, {
                readonly id: "layer-22";
                readonly name: "Testing Strategies";
                readonly reason: "Bug prevention testing";
            }];
        };
    };
    /**
     * Execution flow - order of phase execution
     */
    readonly executionFlow: readonly [{
        readonly phase: "pre-audit";
        readonly layer: "layer-12";
        readonly description: "Meta-cognitive pre-decision audit";
        readonly required: false;
        readonly outputs: readonly ["riskAssessment", "uncertaintyAcknowledgment", "alternativeApproaches"];
    }, {
        readonly phase: "context-retrieval";
        readonly layer: "layer-13";
        readonly description: "Retrieve and synthesize codebase context";
        readonly required: false;
        readonly outputs: readonly ["codebasePatterns", "relatedFiles", "dependencyMap", "contextSynthesis"];
    }, {
        readonly phase: "reasoning";
        readonly layer: "layer-9";
        readonly description: "Apply reasoning protocols (CoT/ToT)";
        readonly required: false;
        readonly outputs: readonly ["reasoningTrace", "selectedPath", "confidenceScore"];
    }, {
        readonly phase: "constraint-check";
        readonly layers: readonly ["layer-0", "layer-7"];
        readonly description: "Validate against project constraints";
        readonly required: true;
        readonly outputs: readonly ["constraintValidation", "allowedModifications"];
    }, {
        readonly phase: "asset-validation";
        readonly layer: "layer-42";
        readonly description: "Validate asset existence and enforce asset-first development";
        readonly required: true;
        readonly outputs: readonly ["assetValidation", "missingAssets", "generatedAssets", "assetRegistry"];
    }, {
        readonly phase: "architecture";
        readonly layer: "layer-11";
        readonly description: "Apply architecture intelligence";
        readonly required: false;
        readonly outputs: readonly ["codePatterns", "qualityHeuristics", "antiPatternDetection"];
    }, {
        readonly phase: "code-generation";
        readonly layers: readonly ["layer-21", "layer-30"];
        readonly description: "Apply code generation patterns and bug prevention";
        readonly required: false;
        readonly outputs: readonly ["codePatterns", "errorHandling", "typeSafety"];
    }, {
        readonly phase: "testing";
        readonly layer: "layer-22";
        readonly description: "Apply testing strategies";
        readonly required: false;
        readonly outputs: readonly ["testPatterns", "testPlan", "qualityGates"];
    }, {
        readonly phase: "performance";
        readonly layer: "layer-23";
        readonly description: "Apply performance optimization";
        readonly required: false;
        readonly outputs: readonly ["performancePatterns", "optimizationStrategies", "performanceMetrics"];
    }, {
        readonly phase: "security";
        readonly layer: "layer-24";
        readonly description: "Apply security patterns";
        readonly required: false;
        readonly outputs: readonly ["securityPatterns", "vulnerabilityPrevention", "securityGates"];
    }, {
        readonly phase: "api-design";
        readonly layer: "layer-27";
        readonly description: "Apply API design patterns";
        readonly required: false;
        readonly outputs: readonly ["apiPatterns", "apiDocumentation", "integrationPatterns"];
    }, {
        readonly phase: "database";
        readonly layer: "layer-28";
        readonly description: "Apply database design patterns";
        readonly required: false;
        readonly outputs: readonly ["schemaDesign", "queryOptimization", "databasePatterns"];
    }, {
        readonly phase: "documentation";
        readonly layer: "layer-29";
        readonly description: "Apply documentation patterns";
        readonly required: false;
        readonly outputs: readonly ["documentationPatterns", "codeComments", "apiDocumentation"];
    }, {
        readonly phase: "iteration";
        readonly layer: "layer-5";
        readonly description: "Plan iteration approach";
        readonly required: false;
        readonly outputs: readonly ["iterationPlan", "testPlan"];
    }, {
        readonly phase: "design-guidance";
        readonly layers: readonly ["layer-1", "layer-2", "layer-3", "layer-6"];
        readonly description: "Apply design guidance layers";
        readonly required: false;
        readonly outputs: readonly ["designDecisions", "visualGuidance", "narrativeContext"];
    }, {
        readonly phase: "execution";
        readonly layers: readonly ["all"];
        readonly description: "Execute code generation/changes";
        readonly required: true;
        readonly outputs: readonly ["codeChanges", "fileModifications"];
    }, {
        readonly phase: "validation";
        readonly layer: "layer-8";
        readonly description: "Validate against polish checklist";
        readonly required: true;
        readonly outputs: readonly ["qualityValidation", "checklistResults"];
    }, {
        readonly phase: "learning";
        readonly layer: "layer-10";
        readonly description: "Integrate feedback and learn patterns";
        readonly required: false;
        readonly outputs: readonly ["patternUpdates", "feedbackIntegration"];
    }, {
        readonly phase: "reflection";
        readonly layer: "layer-12";
        readonly description: "Post-decision reflection";
        readonly required: false;
        readonly outputs: readonly ["reflection", "lessonsLearned"];
    }, {
        readonly phase: "output";
        readonly layers: readonly ["all"];
        readonly description: "Format and output final result";
        readonly required: true;
        readonly outputs: readonly ["formattedOutput"];
    }];
    /**
     * Reasoning orchestration
     * Determines which reasoning techniques to use
     */
    readonly reasoningOrchestration: {
        readonly selectTechnique: (complexity: ReasoningComplexity) => {
            chainOfThought: boolean;
            treeOfThought: boolean;
            selfConsistency: boolean;
        };
    };
    /**
     * Quality gate coordination
     * Ensures all quality gates pass before proceeding
     */
    readonly qualityGates: {
        readonly gates: readonly [{
            readonly id: "constraint-check";
            readonly name: "Constraint Validation";
            readonly layers: readonly ["layer-0", "layer-7"];
            readonly required: true;
            readonly description: "All constraints from Layer 0 and Layer 7 must be respected";
            readonly failureAction: "HALT - Request clarification or revise approach";
        }, {
            readonly id: "design-alignment";
            readonly name: "Design Alignment";
            readonly layers: readonly ["layer-1", "layer-2", "layer-3", "layer-6"];
            readonly required: false;
            readonly description: "Changes must align with design system and visual analogies";
            readonly failureAction: "REVISE - Adjust to align with design guidance";
        }, {
            readonly id: "code-quality";
            readonly name: "Code Quality";
            readonly layers: readonly ["layer-11", "charter-professional"];
            readonly required: false;
            readonly description: "Code must follow architecture patterns and quality heuristics";
            readonly failureAction: "REVISE - Improve code quality and patterns";
        }, {
            readonly id: "polish-checklist";
            readonly name: "Polish Checklist";
            readonly layers: readonly ["layer-8"];
            readonly required: true;
            readonly description: "All items in Layer 8 polish checklist must pass";
            readonly failureAction: "REVISE - Address failing checklist items";
        }];
        readonly checkAll: (state: MetaPromptState) => {
            allPassed: boolean;
            failedGates: string[];
            canProceed: boolean;
        };
    };
    /**
     * Output formatting standards
     */
    readonly outputFormatting: {
        /**
         * Default output format for different complexity levels
         */
        readonly byComplexity: {
            readonly simple: {
                readonly includeReasoningTrace: false;
                readonly includeConfidenceScore: false;
                readonly includeConsistencyChecks: false;
                readonly includeQualityGates: true;
                readonly includeAlternatives: false;
                readonly levelOfDetail: "minimal";
            };
            readonly moderate: {
                readonly includeReasoningTrace: true;
                readonly includeConfidenceScore: true;
                readonly includeConsistencyChecks: false;
                readonly includeQualityGates: true;
                readonly includeAlternatives: false;
                readonly levelOfDetail: "standard";
            };
            readonly complex: {
                readonly includeReasoningTrace: true;
                readonly includeConfidenceScore: true;
                readonly includeConsistencyChecks: true;
                readonly includeQualityGates: true;
                readonly includeAlternatives: true;
                readonly levelOfDetail: "standard";
            };
            readonly architectural: {
                readonly includeReasoningTrace: true;
                readonly includeConfidenceScore: true;
                readonly includeConsistencyChecks: true;
                readonly includeQualityGates: true;
                readonly includeAlternatives: true;
                readonly levelOfDetail: "verbose";
            };
        };
        /**
         * Format output based on configuration
         */
        readonly format: (state: MetaPromptState, format: OutputFormat) => string;
    };
    /**
     * Unified execution flow
     * Main entry point for meta-prompt system
     */
    readonly execute: {
        readonly description: "Main execution flow that orchestrates all layers";
        readonly steps: readonly ["1. Assess request complexity", "2. Determine which layers to activate", "3. Execute phases in order", "4. Check quality gates at each critical point", "5. Synthesize outputs from all layers", "6. Format final output", "7. Validate all quality gates pass", "8. Return formatted result"];
        /**
         * Execute the full meta-prompt flow
         */
        readonly flow: (request: string, context: {
            complexity?: ReasoningComplexity;
            uiRelated?: boolean;
            codeRelated?: boolean;
            refactoring?: boolean;
        }) => MetaPromptState;
    };
};
/**
 * Helper function to determine which layers should activate
 */
export declare function determineLayerActivation(complexity: ReasoningComplexity, context: {
    uiRelated?: boolean;
    codeRelated?: boolean;
    refactoring?: boolean;
}): LayerActivation[];
/**
 * Type exports for use in other layers
 */
export type { LayerActivation, ExecutionPhase, MetaPromptState, OutputFormat };
//# sourceMappingURL=layer-14-meta-prompt-system.d.ts.map