/**
 * Model Manager
 *
 * Manages local AI models - downloading, versioning, and health checks.
 */
import { type OllamaClient } from './ollama-client';
/**
 * Model information
 */
export interface ModelInfo {
    name: string;
    type: "llm" | "vision" | "embedding" | "image-gen";
    provider: "ollama" | "local" | "transformers";
    version?: string;
    size?: number;
    status: "installed" | "available" | "downloading" | "error";
    path?: string;
}
/**
 * Model registry
 */
export interface ModelRegistry {
    models: ModelInfo[];
    lastUpdated: string;
}
/**
 * Model Manager Error
 */
export declare class ModelManagerError extends Error {
    details?: unknown | undefined;
    constructor(message: string, details?: unknown | undefined);
}
/**
 * Model Manager
 */
export declare class ModelManager {
    private ollamaClient;
    private registryPath;
    private modelsDir;
    constructor(ollamaClient?: OllamaClient, registryPath?: string, modelsDir?: string);
    /**
     * Initialize model manager
     */
    initialize(): Promise<void>;
    /**
     * Get model registry
     */
    getRegistry(): Promise<ModelRegistry>;
    /**
     * Save model registry
     */
    private saveRegistry;
    /**
     * List available Ollama models
     */
    listOllamaModels(): Promise<ModelInfo[]>;
    /**
     * Detect model type from name
     */
    private detectModelType;
    /**
     * Download Ollama model
     */
    downloadOllamaModel(modelName: string, onProgress?: (progress: string) => void): Promise<void>;
    /**
     * Check model health
     */
    checkModelHealth(modelName: string, provider: "ollama" | "local" | "transformers"): Promise<boolean>;
    /**
     * Get recommended models for game development
     */
    getRecommendedModels(): ModelInfo[];
    /**
     * Ensure recommended models are installed
     */
    ensureRecommendedModels(): Promise<void>;
}
/**
 * Create model manager
 */
export declare function createModelManager(ollamaClient?: OllamaClient, registryPath?: string, modelsDir?: string): ModelManager;
//# sourceMappingURL=model-manager.d.ts.map