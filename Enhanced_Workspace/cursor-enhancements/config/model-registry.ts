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
export const MODEL_REGISTRY: Record<string, ModelDefinition> = {
  // LLM Models
  "llama3.1:8b": {
    id: "llama3.1:8b",
    name: "Llama 3.1 8B",
    type: "llm",
    provider: "ollama",
    size: "4.7GB",
    description: "High-quality general purpose language model, great for code generation",
    recommended: true,
    useCases: ["code generation", "documentation", "prompt engineering"],
    requirements: {
      ram: "8GB",
      vram: "6GB (optional)"
    }
  },
  "mistral:latest": {
    id: "mistral:latest",
    name: "Mistral",
    type: "llm",
    provider: "ollama",
    size: "4.1GB",
    description: "Efficient and fast language model",
    recommended: true,
    useCases: ["quick responses", "code completion"],
    requirements: {
      ram: "8GB"
    }
  },
  "deepseek-r1:latest": {
    id: "deepseek-r1:latest",
    name: "DeepSeek R1",
    type: "llm",
    provider: "ollama",
    size: "~7GB",
    description: "Advanced reasoning model for complex tasks",
    recommended: false,
    useCases: ["complex reasoning", "problem solving"],
    requirements: {
      ram: "16GB",
      vram: "8GB (recommended)"
    }
  },

  // Vision Models
  "llava:latest": {
    id: "llava:latest",
    name: "LLaVA",
    type: "vision",
    provider: "ollama",
    size: "4.7GB",
    description: "Vision-language model for image understanding",
    recommended: true,
    useCases: ["sprite analysis", "image description", "metadata extraction"],
    requirements: {
      ram: "8GB",
      vram: "6GB (recommended)"
    }
  },
  "bakllava:latest": {
    id: "bakllava:latest",
    name: "BakLLaVA",
    type: "vision",
    provider: "ollama",
    size: "~5GB",
    description: "Alternative vision model",
    recommended: false,
    useCases: ["image analysis"],
    requirements: {
      ram: "8GB"
    }
  },

  // Embedding Models
  "Xenova/all-MiniLM-L6-v2": {
    id: "Xenova/all-MiniLM-L6-v2",
    name: "all-MiniLM-L6-v2",
    type: "embedding",
    provider: "transformers",
    size: "80MB",
    description: "Fast, efficient embeddings (384 dimensions)",
    recommended: true,
    useCases: ["semantic search", "knowledge graph", "similarity matching"],
    requirements: {
      ram: "2GB"
    }
  },
  "Xenova/all-mpnet-base-v2": {
    id: "Xenova/all-mpnet-base-v2",
    name: "all-mpnet-base-v2",
    type: "embedding",
    provider: "transformers",
    size: "420MB",
    description: "Higher quality embeddings (768 dimensions)",
    recommended: false,
    useCases: ["high-quality semantic search"],
    requirements: {
      ram: "4GB"
    }
  },

  // Image Generation (Local SD)
  "comfyui": {
    id: "comfyui",
    name: "ComfyUI",
    type: "image-gen",
    provider: "local",
    description: "Node-based Stable Diffusion interface",
    recommended: true,
    useCases: ["sprite generation", "complex workflows", "LoRA support"],
    requirements: {
      ram: "8GB",
      vram: "6GB (recommended)",
      disk: "10GB+"
    }
  },
  "automatic1111": {
    id: "automatic1111",
    name: "Automatic1111",
    type: "image-gen",
    provider: "local",
    description: "Web UI for Stable Diffusion",
    recommended: false,
    useCases: ["easy setup", "web interface"],
    requirements: {
      ram: "8GB",
      vram: "6GB (recommended)"
    }
  },
  "fooocus": {
    id: "fooocus",
    name: "Fooocus",
    type: "image-gen",
    provider: "local",
    description: "Simplified Stable Diffusion interface",
    recommended: false,
    useCases: ["quick setup", "simplified workflow"],
    requirements: {
      ram: "8GB",
      vram: "6GB (recommended)"
    }
  }
};

/**
 * Get recommended models for a use case
 */
export function getRecommendedModels(useCase: string): ModelDefinition[] {
  return Object.values(MODEL_REGISTRY).filter(
    model => model.recommended && model.useCases.includes(useCase)
  );
}

/**
 * Get all recommended models
 */
export function getAllRecommendedModels(): ModelDefinition[] {
  return Object.values(MODEL_REGISTRY).filter(model => model.recommended);
}

/**
 * Get model by ID
 */
export function getModel(id: string): ModelDefinition | undefined {
  return MODEL_REGISTRY[id];
}









