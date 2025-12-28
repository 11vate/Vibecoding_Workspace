/**
 * Embedding Generator
 *
 * Generates embeddings for text, images, and code using various models.
 */
import { retry } from '../../utils/retry';
/**
 * Embedding Generator Error
 */
export class EmbeddingGeneratorError extends Error {
    statusCode;
    details;
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'EmbeddingGeneratorError';
    }
}
/**
 * Embedding Generator
 */
export class EmbeddingGenerator {
    config;
    cache = new Map();
    constructor(config) {
        this.config = {
            dimension: 1536, // Default for OpenAI ada-002
            ...config
        };
    }
    /**
     * Generate text embedding
     */
    async generateTextEmbedding(text) {
        // Check cache
        const cacheKey = `text:${this.config.model}:${text.substring(0, 100)}`;
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            return { ...cached, cached: true };
        }
        try {
            let embedding;
            // Try local Sentence Transformers first (free, no API key)
            if (this.config.model.includes("sentence-transformers") ||
                this.config.model.includes("Xenova") ||
                this.config.model.includes("all-MiniLM") ||
                this.config.model.includes("all-mpnet")) {
                embedding = await this.generateSentenceTransformerEmbedding(text);
            }
            else if (this.config.model.startsWith("text-embedding-ada-002") || this.config.model.includes("openai")) {
                // Fallback to OpenAI if API key available
                if (this.config.apiKey) {
                    embedding = await this.generateOpenAIEmbedding(text);
                }
                else {
                    // No API key, use local as fallback
                    this.log('No OpenAI API key, using local Sentence Transformers');
                    embedding = await this.generateSentenceTransformerEmbedding(text);
                }
            }
            else {
                // Default to local
                embedding = await this.generateSentenceTransformerEmbedding(text);
            }
            const result = {
                embedding,
                dimension: embedding.length,
                model: this.config.model,
                cached: false
            };
            // Cache result
            this.cache.set(cacheKey, result);
            return result;
        }
        catch (error) {
            throw new EmbeddingGeneratorError(`Failed to generate text embedding: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, error);
        }
    }
    /**
     * Generate image embedding (CLIP)
     */
    async generateImageEmbedding(imageBuffer) {
        const cacheKey = `image:${this.config.model}:${imageBuffer.length}`;
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            return { ...cached, cached: true };
        }
        try {
            // For CLIP embeddings, we'd typically use a local model or API
            // This is a placeholder that would call a CLIP API or local model
            throw new EmbeddingGeneratorError("Image embedding not yet implemented - requires CLIP model integration");
        }
        catch (error) {
            if (error instanceof EmbeddingGeneratorError) {
                throw error;
            }
            throw new EmbeddingGeneratorError(`Failed to generate image embedding: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, error);
        }
    }
    /**
     * Generate code embedding
     */
    async generateCodeEmbedding(code, language) {
        const cacheKey = `code:${language}:${this.config.model}:${code.substring(0, 200)}`;
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            return { ...cached, cached: true };
        }
        try {
            // Code embeddings can use CodeBERT or similar models
            // For now, use text embedding as fallback
            const codeWithLanguage = `// ${language}\n${code}`;
            return this.generateTextEmbedding(codeWithLanguage);
        }
        catch (error) {
            throw new EmbeddingGeneratorError(`Failed to generate code embedding: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, error);
        }
    }
    /**
     * Generate OpenAI embedding
     */
    async generateOpenAIEmbedding(text) {
        if (!this.config.apiKey) {
            throw new EmbeddingGeneratorError("OpenAI API key required for text embeddings");
        }
        const retryOptions = this.config.retryOptions || {
            maxAttempts: 3,
            initialDelay: 1000
        };
        const result = await retry(async () => {
            const response = await fetch("https://api.openai.com/v1/embeddings", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.config.model || "text-embedding-ada-002",
                    input: text
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new EmbeddingGeneratorError(errorData.error?.message || `API error: ${response.statusText}`, response.status, errorData);
            }
            const data = await response.json();
            return data.data[0].embedding;
        }, retryOptions);
        if (!result.success || !result.result) {
            throw result.error || new EmbeddingGeneratorError('Failed to generate embedding after retries');
        }
        return result.result;
    }
    /**
     * Generate Sentence Transformer embedding
     */
    async generateSentenceTransformerEmbedding(text) {
        try {
            // Import Sentence Transformers service
            const { createSentenceTransformersService } = require('../../local-models/sentence-transformers');
            const stService = createSentenceTransformersService({
                model: this.config.model.includes("MiniLM")
                    ? "Xenova/all-MiniLM-L6-v2"
                    : this.config.model.includes("mpnet")
                        ? "Xenova/all-mpnet-base-v2"
                        : this.config.model,
                enableLogging: false
            });
            const result = await stService.generateEmbedding(text);
            return result.embedding;
        }
        catch (error) {
            throw new EmbeddingGeneratorError(`Failed to generate local embedding: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, error);
        }
    }
    /**
     * Log message if logging is enabled
     */
    log(message, data) {
        // Simple logging - can be enhanced
        if (process.env.ENABLE_LOGGING === "true") {
            console.log(`[EmbeddingGenerator] ${message}`, data || '');
        }
    }
    /**
     * Batch generate embeddings
     */
    async generateBatchEmbeddings(items) {
        const results = [];
        for (const item of items) {
            if (item.text) {
                results.push(await this.generateTextEmbedding(item.text));
            }
            else if (item.image) {
                results.push(await this.generateImageEmbedding(item.image));
            }
            else if (item.code) {
                results.push(await this.generateCodeEmbedding(item.code, item.language || "typescript"));
            }
        }
        return results;
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache size
     */
    getCacheSize() {
        return this.cache.size;
    }
}
/**
 * Create embedding generator
 */
export function createEmbeddingGenerator(config) {
    return new EmbeddingGenerator(config);
}
//# sourceMappingURL=embedding-generator.js.map