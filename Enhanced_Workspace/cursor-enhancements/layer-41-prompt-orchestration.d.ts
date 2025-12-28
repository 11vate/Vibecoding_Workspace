/**
 * LAYER 41 — PROMPT ORCHESTRATION
 *
 * Coordinate multimodal and game-dev prompts with existing layer system.
 *
 * This layer extends the meta-prompt system (Layer 14) to coordinate
 * multimodal prompts, game development prompts, and asset generation prompts
 * with the existing enhancement layers.
 */
import type { ReasoningComplexity } from './layer-9-reasoning-protocol';
/**
 * Prompt category
 */
export type PromptCategory = "multimodal" | "game-dev" | "asset-generation" | "simulation" | "code-generation" | "design" | "standard";
/**
 * Prompt template identifier
 */
export interface PromptTemplateId {
    category: PromptCategory;
    name: string;
    version?: string;
}
/**
 * Prompt context
 */
export interface PromptContext {
    request: string;
    complexity: ReasoningComplexity;
    detectedCapabilities: DetectedCapability[];
    activeLayers: string[];
    projectContext?: ProjectContext;
    previousOutputs?: unknown[];
}
/**
 * Detected capability need
 */
export interface DetectedCapability {
    type: "multimodal" | "asset-generation" | "game-framework" | "simulation";
    confidence: number;
    parameters?: Record<string, unknown>;
}
/**
 * Project context (from Layer 38)
 */
export interface ProjectContext {
    projectId: string;
    framework?: string;
    assetStyle?: string;
    constraints?: unknown[];
}
/**
 * Prompt selection result
 */
export interface PromptSelection {
    templateId: PromptTemplateId;
    template: PromptTemplate;
    confidence: number;
    reasoning: string;
    alternatives?: PromptTemplateId[];
}
/**
 * Prompt template
 */
export interface PromptTemplate {
    id: PromptTemplateId;
    name: string;
    description: string;
    category: PromptCategory;
    systemContext: string;
    inputParameters: TemplateParameter[];
    processSteps: string[];
    outputFormat: string;
    validationCriteria: string[];
    examples: PromptExample[];
    integrationPoints: string[];
}
/**
 * Template parameter
 */
export interface TemplateParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
    constraints?: string;
    default?: unknown;
}
/**
 * Prompt example
 */
export interface PromptExample {
    input: Record<string, unknown>;
    output: unknown;
    explanation: string;
}
/**
 * Prompt execution result
 */
export interface PromptExecutionResult {
    templateId: PromptTemplateId;
    input: Record<string, unknown>;
    output: unknown;
    success: boolean;
    errors?: string[];
    validationResults?: ValidationResult[];
    nextSteps?: string[];
}
/**
 * Validation result
 */
export interface ValidationResult {
    criterion: string;
    passed: boolean;
    message?: string;
}
/**
 * Prompt chain configuration
 */
export interface PromptChain {
    id: string;
    name: string;
    steps: PromptChainStep[];
    parallel?: boolean;
}
/**
 * Prompt chain step
 */
export interface PromptChainStep {
    templateId: PromptTemplateId;
    inputMapping: Record<string, string>;
    condition?: string;
}
/**
 * Main prompt orchestration configuration
 */
export declare const PROMPT_ORCHESTRATION: {
    /**
     * Prompt Categories
     */
    readonly categories: {
        readonly multimodal: {
            readonly description: "Multimodal understanding and generation prompts";
            readonly templates: readonly ["sprite-analysis", "image-to-code", "multimodal-reasoning", "asset-generation"];
            readonly integrationLayers: readonly ["layer-36", "layer-38", "layer-39"];
        };
        readonly "game-dev": {
            readonly description: "Game development and framework prompts";
            readonly templates: readonly ["phaser-scaffold", "animation-controller", "game-mechanic", "balance-analysis"];
            readonly integrationLayers: readonly ["layer-37", "layer-40"];
        };
        readonly "asset-generation": {
            readonly description: "Asset generation and pipeline prompts";
            readonly templates: readonly ["sprite-parametric", "animation-sequence", "palette-constrained", "batch-generation"];
            readonly integrationLayers: readonly ["layer-31", "layer-36", "layer-39"];
        };
        readonly simulation: {
            readonly description: "Simulation and balance analysis prompts";
            readonly templates: readonly ["combat-simulation", "economy-analysis", "balance-optimization", "exploit-detection"];
            readonly integrationLayers: readonly ["layer-40"];
        };
        readonly "code-generation": {
            readonly description: "Code generation prompts";
            readonly templates: readonly ["framework-code", "pattern-implementation", "refactoring"];
            readonly integrationLayers: readonly ["layer-21", "layer-37"];
        };
        readonly design: {
            readonly description: "Design and UI prompts";
            readonly templates: readonly ["ui-component", "layout-design", "visual-style"];
            readonly integrationLayers: readonly ["layer-1", "layer-2", "layer-15", "layer-16"];
        };
        readonly standard: {
            readonly description: "Standard enhancement layer prompts";
            readonly templates: readonly ["code-improvement", "bug-fix", "documentation"];
            readonly integrationLayers: readonly ["layer-11", "layer-22", "layer-29"];
        };
    };
    /**
     * Capability Detection
     */
    readonly capabilityDetection: {
        readonly multimodal: {
            readonly triggers: readonly ["analyze image", "sprite sheet", "generate sprite", "visual asset", "palette", "animation frames"];
            readonly confidenceThreshold: 0.7;
        };
        readonly assetGeneration: {
            readonly triggers: readonly ["create sprite", "generate asset", "make animation", "create background"];
            readonly confidenceThreshold: 0.7;
        };
        readonly gameFramework: {
            readonly triggers: readonly ["phaser", "game scene", "animation controller", "sprite loader", "game loop"];
            readonly confidenceThreshold: 0.8;
        };
        readonly simulation: {
            readonly triggers: readonly ["simulate", "balance", "test mechanic", "analyze economy", "detect exploit"];
            readonly confidenceThreshold: 0.8;
        };
    };
    /**
     * Prompt Selection Strategy
     */
    readonly selection: {
        readonly strategies: {
            readonly exactMatch: "Exact template name match";
            readonly semanticSimilarity: "Semantic similarity to request";
            readonly capabilityBased: "Based on detected capabilities";
            readonly layerBased: "Based on active layers";
            readonly hybrid: "Combine multiple strategies";
        };
        readonly scoring: {
            readonly exactMatch: 1;
            readonly semanticSimilarity: 0.8;
            readonly capabilityMatch: 0.7;
            readonly layerIntegration: 0.6;
        };
    };
    /**
     * Prompt Chaining
     */
    readonly chaining: {
        readonly strategies: {
            readonly sequential: "Execute prompts in sequence";
            readonly parallel: "Execute prompts in parallel";
            readonly conditional: "Conditional execution based on results";
            readonly iterative: "Iterative refinement";
        };
        readonly patterns: {
            readonly "asset-to-code": readonly [{
                readonly template: "sprite-analysis";
                readonly output: "sprite-metadata";
            }, {
                readonly template: "image-to-code";
                readonly input: "sprite-metadata";
                readonly output: "code";
            }];
            readonly "design-to-implementation": readonly [{
                readonly template: "game-mechanic";
                readonly output: "mechanic-spec";
            }, {
                readonly template: "framework-code";
                readonly input: "mechanic-spec";
                readonly output: "code";
            }, {
                readonly template: "balance-analysis";
                readonly input: "code";
                readonly output: "balance-report";
            }];
        };
    };
    /**
     * Integration with Layer 14 (Meta-Prompt)
     */
    readonly metaPromptIntegration: {
        readonly phaseMapping: {
            readonly "pre-audit": readonly ["capability-detection", "template-selection"];
            readonly "context-retrieval": readonly ["project-context-loading", "related-prompt-history"];
            readonly execution: readonly ["prompt-execution", "chain-orchestration"];
            readonly validation: readonly ["output-validation", "quality-checks"];
        };
        readonly layerCoordination: {
            readonly "layer-36": "Multimodal prompts";
            readonly "layer-37": "Game framework prompts";
            readonly "layer-38": "Knowledge graph context";
            readonly "layer-39": "Asset pipeline prompts";
            readonly "layer-40": "Simulation prompts";
        };
    };
};
/**
 * Detect required capabilities from request
 */
export declare function detectCapabilities(request: string, context?: PromptContext): DetectedCapability[];
/**
 * Select appropriate prompt template
 */
export declare function selectPromptTemplate(context: PromptContext): PromptSelection;
/**
 * Execute prompt template
 */
export declare function executePrompt(templateId: PromptTemplateId, input: Record<string, unknown>): Promise<PromptExecutionResult>;
/**
 * Execute prompt chain
 */
export declare function executePromptChain(chain: PromptChain, initialInput: Record<string, unknown>): Promise<PromptExecutionResult[]>;
/**
 * Validate prompt output
 */
export declare function validatePromptOutput(output: unknown, template: PromptTemplate): ValidationResult[];
/**
 * Type exports
 */
export type { PromptCategory, PromptTemplateId, PromptContext, PromptSelection, PromptTemplate, PromptExecutionResult, PromptChain };
//# sourceMappingURL=layer-41-prompt-orchestration.d.ts.map