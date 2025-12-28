/**
 * Ollama Client
 *
 * Local LLM client using Ollama - completely free, no API keys required.
 */
import { type RetryOptions } from '../../utils/retry';
/**
 * Ollama configuration
 */
export interface OllamaConfig {
    baseUrl?: string;
    defaultModel?: string;
    timeout?: number;
    retryOptions?: RetryOptions;
    enableLogging?: boolean;
}
/**
 * Ollama model information
 */
export interface OllamaModel {
    name: string;
    size: number;
    digest: string;
    modified_at: string;
}
/**
 * Ollama generate request
 */
export interface OllamaGenerateRequest {
    model: string;
    prompt: string;
    system?: string;
    context?: number[];
    stream?: boolean;
    format?: "json" | "text";
    options?: {
        temperature?: number;
        top_p?: number;
        top_k?: number;
        num_predict?: number;
    };
}
/**
 * Ollama generate response
 */
export interface OllamaGenerateResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
/**
 * Ollama Error
 */
export declare class OllamaError extends Error {
    statusCode?: number | undefined;
    details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, details?: unknown | undefined);
}
/**
 * Ollama Client
 */
export declare class OllamaClient {
    private config;
    private baseUrl;
    constructor(config?: OllamaConfig);
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Check if Ollama is available
     */
    checkAvailability(): Promise<boolean>;
    /**
     * List available models
     */
    listModels(): Promise<OllamaModel[]>;
    /**
     * Pull/download a model
     */
    pullModel(modelName: string, onProgress?: (progress: string) => void): Promise<void>;
    /**
     * Generate text using Ollama
     */
    generate(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse>;
    /**
     * Generate with streaming (for long responses)
     */
    generateStream(request: OllamaGenerateRequest): AsyncGenerator<string, void, unknown>;
    /**
     * Check if model exists locally
     */
    hasModel(modelName: string): Promise<boolean>;
    /**
     * Ensure model is available (download if needed)
     */
    ensureModel(modelName: string): Promise<void>;
}
/**
 * Create Ollama client
 */
export declare function createOllamaClient(config?: OllamaConfig): OllamaClient;
//# sourceMappingURL=ollama-client.d.ts.map