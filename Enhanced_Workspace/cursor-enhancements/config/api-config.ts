/**
 * API Configuration Management
 * 
 * Centralized configuration for all external API connections.
 */

/**
 * API Configuration
 */
export interface APIConfig {
  openai?: {
    apiKey: string;
    baseUrl?: string;
    maxRetries?: number;
  };
  stabilityAI?: {
    apiKey: string;
    baseUrl?: string;
    maxRetries?: number;
  };
  leonardoAI?: {
    apiKey: string;
    baseUrl?: string;
    maxRetries?: number;
  };
  spriteSage?: {
    apiKey: string;
    baseUrl?: string;
    maxRetries?: number;
  };
  comfyUI?: {
    baseUrl: string;
    clientId?: string;
    maxWaitTime?: number;
    pollInterval?: number;
  };
}

/**
 * Load API configuration from environment variables
 */
export function loadAPIConfig(): APIConfig {
  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || "",
      baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || "3")
    },
    stabilityAI: {
      apiKey: process.env.STABILITY_AI_API_KEY || "",
      baseUrl: process.env.STABILITY_AI_BASE_URL || "https://api.stability.ai/v1",
      maxRetries: parseInt(process.env.STABILITY_AI_MAX_RETRIES || "3")
    },
    leonardoAI: {
      apiKey: process.env.LEONARDO_AI_API_KEY || "",
      baseUrl: process.env.LEONARDO_AI_BASE_URL || "https://cloud.leonardo.ai/api/rest/v1",
      maxRetries: parseInt(process.env.LEONARDO_AI_MAX_RETRIES || "3")
    },
    spriteSage: {
      apiKey: process.env.SPRITE_SAGE_API_KEY || "",
      baseUrl: process.env.SPRITE_SAGE_BASE_URL || "https://api.spritesage.ai/v1",
      maxRetries: parseInt(process.env.SPRITE_SAGE_MAX_RETRIES || "3")
    },
    comfyUI: {
      baseUrl: process.env.COMFYUI_BASE_URL || "http://localhost:8188",
      clientId: process.env.COMFYUI_CLIENT_ID,
      maxWaitTime: parseInt(process.env.COMFYUI_MAX_WAIT_TIME || "120000"),
      pollInterval: parseInt(process.env.COMFYUI_POLL_INTERVAL || "1000")
    }
  };
}

/**
 * Validate API configuration
 */
export function validateAPIConfig(config: APIConfig): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // API keys are now optional - local models can be used instead
  if (config.openai && !config.openai.apiKey) {
    warnings.push("OpenAI API key not provided - will use local Ollama if available");
  }

  if (config.stabilityAI && !config.stabilityAI.apiKey) {
    warnings.push("Stability AI API key not provided - will use local Stable Diffusion if available");
  }

  if (config.leonardoAI && !config.leonardoAI.apiKey) {
    warnings.push("Leonardo AI API key not provided - optional service");
  }

  if (config.spriteSage && !config.spriteSage.apiKey) {
    warnings.push("Sprite Sage API key not provided - optional service");
  }

  if (config.comfyUI && !config.comfyUI.baseUrl) {
    warnings.push("ComfyUI base URL not provided - will use default localhost:8188");
  }

  // Only error if no local models are configured AND no API keys
  const useLocalModels = process.env.USE_LOCAL_MODELS !== "false";
  if (!useLocalModels && !config.openai?.apiKey && !config.stabilityAI?.apiKey) {
    errors.push("Either API keys or local models must be configured. Set USE_LOCAL_MODELS=true or provide API keys.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

