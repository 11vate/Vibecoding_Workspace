/**
 * Model Manager
 *
 * Manages local AI models - downloading, versioning, and health checks.
 */
import { createOllamaClient } from './ollama-client';
import * as fs from 'fs/promises';
import * as path from 'path';
/**
 * Model Manager Error
 */
export class ModelManagerError extends Error {
    details;
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = 'ModelManagerError';
    }
}
/**
 * Model Manager
 */
export class ModelManager {
    ollamaClient;
    registryPath;
    modelsDir;
    constructor(ollamaClient, registryPath, modelsDir) {
        this.ollamaClient = ollamaClient || createOllamaClient();
        this.registryPath = registryPath || path.join(process.cwd(), '.models', 'registry.json');
        this.modelsDir = modelsDir || path.join(process.cwd(), '.models');
    }
    /**
     * Initialize model manager
     */
    async initialize() {
        // Ensure models directory exists
        await fs.mkdir(this.modelsDir, { recursive: true });
        // Initialize registry if it doesn't exist
        try {
            await fs.access(this.registryPath);
        }
        catch {
            await this.saveRegistry({ models: [], lastUpdated: new Date().toISOString() });
        }
    }
    /**
     * Get model registry
     */
    async getRegistry() {
        try {
            const data = await fs.readFile(this.registryPath, 'utf-8');
            return JSON.parse(data);
        }
        catch {
            return { models: [], lastUpdated: new Date().toISOString() };
        }
    }
    /**
     * Save model registry
     */
    async saveRegistry(registry) {
        await fs.writeFile(this.registryPath, JSON.stringify(registry, null, 2), 'utf-8');
    }
    /**
     * List available Ollama models
     */
    async listOllamaModels() {
        try {
            const models = await this.ollamaClient.listModels();
            return models.map(m => ({
                name: m.name,
                type: this.detectModelType(m.name),
                provider: "ollama",
                size: m.size,
                status: "installed"
            }));
        }
        catch (error) {
            throw new ModelManagerError(`Failed to list Ollama models: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Detect model type from name
     */
    detectModelType(name) {
        const lower = name.toLowerCase();
        if (lower.includes('llava') || lower.includes('bakllava') || lower.includes('vision')) {
            return "vision";
        }
        if (lower.includes('embedding') || lower.includes('embed')) {
            return "embedding";
        }
        if (lower.includes('sd') || lower.includes('stable') || lower.includes('diffusion')) {
            return "image-gen";
        }
        return "llm";
    }
    /**
     * Download Ollama model
     */
    async downloadOllamaModel(modelName, onProgress) {
        try {
            await this.ollamaClient.pullModel(modelName, onProgress);
            // Update registry
            const registry = await this.getRegistry();
            const existingIndex = registry.models.findIndex(m => m.name === modelName && m.provider === "ollama");
            const modelInfo = {
                name: modelName,
                type: this.detectModelType(modelName),
                provider: "ollama",
                status: "installed"
            };
            if (existingIndex >= 0) {
                registry.models[existingIndex] = modelInfo;
            }
            else {
                registry.models.push(modelInfo);
            }
            registry.lastUpdated = new Date().toISOString();
            await this.saveRegistry(registry);
        }
        catch (error) {
            throw new ModelManagerError(`Failed to download model: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Check model health
     */
    async checkModelHealth(modelName, provider) {
        try {
            if (provider === "ollama") {
                return await this.ollamaClient.hasModel(modelName);
            }
            // For local/transformers models, check if files exist
            if (provider === "transformers") {
                const modelPath = path.join(this.modelsDir, modelName);
                try {
                    await fs.access(modelPath);
                    return true;
                }
                catch {
                    return false;
                }
            }
            return false;
        }
        catch {
            return false;
        }
    }
    /**
     * Get recommended models for game development
     */
    getRecommendedModels() {
        return [
            {
                name: "llama3.1:8b",
                type: "llm",
                provider: "ollama",
                status: "available"
            },
            {
                name: "llava:latest",
                type: "vision",
                provider: "ollama",
                status: "available"
            },
            {
                name: "Xenova/all-MiniLM-L6-v2",
                type: "embedding",
                provider: "transformers",
                status: "available"
            }
        ];
    }
    /**
     * Ensure recommended models are installed
     */
    async ensureRecommendedModels() {
        const recommended = this.getRecommendedModels();
        for (const model of recommended) {
            if (model.provider === "ollama") {
                const hasModel = await this.ollamaClient.hasModel(model.name);
                if (!hasModel) {
                    console.log(`Downloading recommended model: ${model.name}`);
                    await this.downloadOllamaModel(model.name);
                }
            }
        }
    }
}
/**
 * Create model manager
 */
export function createModelManager(ollamaClient, registryPath, modelsDir) {
    return new ModelManager(ollamaClient, registryPath, modelsDir);
}
//# sourceMappingURL=model-manager.js.map