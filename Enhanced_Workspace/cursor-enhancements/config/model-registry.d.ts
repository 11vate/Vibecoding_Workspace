/**
 * Model Registry
 *
 * Registry of available models and their configurations.
 */
/**
 * Model definition
 */
export interface ModelDefinition {
    id: string;
    name: string;
    type: "llm" | "vision" | "embedding" | "image-gen";
    provider: "ollama" | "transformers" | "local";
    size?: string;
    description: string;
    recommended: boolean;
    useCases: string[];
    requirements?: {
        ram?: string;
        vram?: string;
        disk?: string;
    };
}
/**
 * Model Registry
 */
export declare const MODEL_REGISTRY: Record<string, ModelDefinition>;
/**
 * Get recommended models for a use case
 */
export declare function getRecommendedModels(useCase: string): ModelDefinition[];
/**
 * Get all recommended models
 */
export declare function getAllRecommendedModels(): ModelDefinition[];
/**
 * Get model by ID
 */
export declare function getModel(id: string): ModelDefinition | undefined;
//# sourceMappingURL=model-registry.d.ts.map