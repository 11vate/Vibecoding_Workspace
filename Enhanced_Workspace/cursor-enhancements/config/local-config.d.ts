/**
 * Local Model Configuration
 *
 * Configuration for local AI models (Ollama, local Stable Diffusion, etc.)
 */
/**
 * Local model configuration
 */
export interface LocalModelConfig {
    ollama?: {
        baseUrl?: string;
        defaultModel?: string;
        visionModel?: string;
        timeout?: number;
    };
    stableDiffusion?: {
        type: "comfyui" | "automatic1111" | "fooocus";
        baseUrl?: string;
        modelPath?: string;
        useGPU?: boolean;
    };
    embeddings?: {
        model?: string;
        device?: "cpu" | "gpu";
        cacheDir?: string;
    };
    enableFallback?: boolean;
}
/**
 * Load local model configuration from environment
 */
export declare function loadLocalConfig(): LocalModelConfig;
/**
 * Validate local model configuration
 */
export declare function validateLocalConfig(config: LocalModelConfig): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=local-config.d.ts.map