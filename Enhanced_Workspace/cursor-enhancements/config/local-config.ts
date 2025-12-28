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
  enableFallback?: boolean; // Fallback to API if local fails
}

/**
 * Load local model configuration from environment
 */
export function loadLocalConfig(): LocalModelConfig {
  return {
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      defaultModel: process.env.OLLAMA_DEFAULT_MODEL || "llama3.1:8b",
      visionModel: process.env.OLLAMA_VISION_MODEL || "llava:latest",
      timeout: parseInt(process.env.OLLAMA_TIMEOUT || "300000")
    },
    stableDiffusion: {
      type: (process.env.SD_TYPE || "comfyui") as "comfyui" | "automatic1111" | "fooocus",
      baseUrl: process.env.SD_BASE_URL || "http://localhost:8188",
      modelPath: process.env.SD_MODEL_PATH,
      useGPU: process.env.USE_GPU === "true"
    },
    embeddings: {
      model: process.env.SENTENCE_TRANSFORMERS_MODEL || "Xenova/all-MiniLM-L6-v2",
      device: process.env.USE_GPU === "true" ? "gpu" : "cpu",
      cacheDir: process.env.MODEL_CACHE_DIR
    },
    enableFallback: process.env.ENABLE_API_FALLBACK !== "false"
  };
}

/**
 * Validate local model configuration
 */
export function validateLocalConfig(config: LocalModelConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if at least one local model is configured
  if (!config.ollama && !config.stableDiffusion && !config.embeddings) {
    errors.push("At least one local model type must be configured");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}









