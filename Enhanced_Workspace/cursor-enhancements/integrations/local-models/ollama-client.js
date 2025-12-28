/**
 * Ollama Client
 *
 * Local LLM client using Ollama - completely free, no API keys required.
 */
import { retry } from '../../utils/retry';
/**
 * Ollama Error
 */
export class OllamaError extends Error {
    statusCode;
    details;
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'OllamaError';
    }
}
/**
 * Ollama Client
 */
export class OllamaClient {
    config;
    baseUrl;
    constructor(config = {}) {
        this.config = {
            baseUrl: config.baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434",
            defaultModel: config.defaultModel || process.env.OLLAMA_DEFAULT_MODEL || "llama3.1:8b",
            timeout: config.timeout || parseInt(process.env.OLLAMA_TIMEOUT || "300000"),
            enableLogging: config.enableLogging || process.env.ENABLE_LOGGING === "true",
            retryOptions: config.retryOptions
        };
        this.baseUrl = this.config.baseUrl;
    }
    /**
     * Log message if logging is enabled
     */
    log(message, data) {
        if (this.config.enableLogging) {
            console.log(`[Ollama] ${message}`, data || '');
        }
    }
    /**
     * Check if Ollama is available
     */
    async checkAvailability() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            return response.ok;
        }
        catch (error) {
            this.log('Ollama not available', error);
            return false;
        }
    }
    /**
     * List available models
     */
    async listModels() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET',
                signal: AbortSignal.timeout(this.config.timeout)
            });
            if (!response.ok) {
                throw new OllamaError(`Failed to list models: ${response.statusText}`, response.status);
            }
            const data = await response.json();
            return data.models || [];
        }
        catch (error) {
            if (error instanceof OllamaError) {
                throw error;
            }
            throw new OllamaError(`Failed to list models: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, error);
        }
    }
    /**
     * Pull/download a model
     */
    async pullModel(modelName, onProgress) {
        try {
            this.log(`Pulling model: ${modelName}`);
            const response = await fetch(`${this.baseUrl}/api/pull`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: modelName }),
                signal: AbortSignal.timeout(this.config.timeout * 10) // Longer timeout for downloads
            });
            if (!response.ok) {
                throw new OllamaError(`Failed to pull model: ${response.statusText}`, response.status);
            }
            // Stream progress if available
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim());
                    for (const line of lines) {
                        try {
                            const data = JSON.parse(line);
                            if (data.status && onProgress) {
                                onProgress(data.status);
                            }
                        }
                        catch {
                            // Ignore parse errors
                        }
                    }
                }
            }
            this.log(`Model ${modelName} pulled successfully`);
        }
        catch (error) {
            if (error instanceof OllamaError) {
                throw error;
            }
            throw new OllamaError(`Failed to pull model: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, error);
        }
    }
    /**
     * Generate text using Ollama
     */
    async generate(request) {
        const retryOptions = this.config.retryOptions || {
            maxAttempts: 3,
            initialDelay: 1000,
            retryableErrors: (error) => {
                // Retry on network errors
                if (error instanceof Error) {
                    return error.message.includes('network') || error.message.includes('timeout');
                }
                return false;
            }
        };
        const result = await retry(async () => {
            this.log('Generating text', { model: request.model });
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: request.model || this.config.defaultModel,
                    prompt: request.prompt,
                    system: request.system,
                    context: request.context,
                    stream: false,
                    format: request.format,
                    options: {
                        temperature: request.options?.temperature || 0.7,
                        top_p: request.options?.top_p || 0.9,
                        top_k: request.options?.top_k || 40,
                        num_predict: request.options?.num_predict || 2048,
                        ...request.options
                    }
                }),
                signal: AbortSignal.timeout(this.config.timeout)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new OllamaError(errorData.error || `API error: ${response.statusText}`, response.status, errorData);
            }
            return await response.json();
        }, retryOptions);
        if (!result.success || !result.result) {
            throw result.error || new OllamaError('Failed to generate after retries');
        }
        return result.result;
    }
    /**
     * Generate with streaming (for long responses)
     */
    async *generateStream(request) {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...request,
                    stream: true
                }),
                signal: AbortSignal.timeout(this.config.timeout)
            });
            if (!response.ok) {
                throw new OllamaError(`API error: ${response.statusText}`, response.status);
            }
            if (!response.body) {
                throw new OllamaError('Response body is null');
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (!line.trim())
                        continue;
                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            yield data.response;
                        }
                        if (data.done) {
                            return;
                        }
                    }
                    catch {
                        // Ignore parse errors
                    }
                }
            }
        }
        catch (error) {
            throw new OllamaError(`Streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, error);
        }
    }
    /**
     * Check if model exists locally
     */
    async hasModel(modelName) {
        try {
            const models = await this.listModels();
            return models.some(m => m.name === modelName || m.name.startsWith(modelName + ':'));
        }
        catch {
            return false;
        }
    }
    /**
     * Ensure model is available (download if needed)
     */
    async ensureModel(modelName) {
        const hasModel = await this.hasModel(modelName);
        if (!hasModel) {
            this.log(`Model ${modelName} not found, pulling...`);
            await this.pullModel(modelName);
        }
    }
}
/**
 * Create Ollama client
 */
export function createOllamaClient(config) {
    return new OllamaClient(config);
}
//# sourceMappingURL=ollama-client.js.map