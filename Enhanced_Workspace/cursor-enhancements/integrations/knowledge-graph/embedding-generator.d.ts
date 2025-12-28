/**
 * Embedding Generator
 *
 * Generates embeddings for text, images, and code using various models.
 */
import { type RetryOptions } from '../../utils/retry';
/**
 * Embedding type
 */
export type EmbeddingType = "text" | "image" | "code";
/**
 * Embedding model configuration
 */
export interface EmbeddingModelConfig {
    type: EmbeddingType;
    model: string;
    apiKey?: string;
    baseUrl?: string;
    dimension?: number;
    retryOptions?: RetryOptions;
}
/**
 * Embedding result
 */
export interface EmbeddingResult {
    embedding: number[];
    dimension: number;
    model: string;
    cached: boolean;
}
/**
 * Embedding Generator Error
 */
export declare class EmbeddingGeneratorError extends Error {
    statusCode?: number | undefined;
    details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, details?: unknown | undefined);
}
/**
 * Embedding Generator
 */
export declare class EmbeddingGenerator {
    private config;
    private cache;
    constructor(config: EmbeddingModelConfig);
    /**
     * Generate text embedding
     */
    generateTextEmbedding(text: string): Promise<EmbeddingResult>;
    /**
     * Generate image embedding (CLIP)
     */
    generateImageEmbedding(imageBuffer: Buffer): Promise<EmbeddingResult>;
    /**
     * Generate code embedding
     */
    generateCodeEmbedding(code: string, language: string): Promise<EmbeddingResult>;
    /**
     * Generate OpenAI embedding
     */
    private generateOpenAIEmbedding;
    /**
     * Generate Sentence Transformer embedding
     */
    private generateSentenceTransformerEmbedding;
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Batch generate embeddings
     */
    generateBatchEmbeddings(items: Array<{
        text?: string;
        image?: Buffer;
        code?: string;
        language?: string;
    }>): Promise<EmbeddingResult[]>;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Get cache size
     */
    getCacheSize(): number;
}
/**
 * Create embedding generator
 */
export declare function createEmbeddingGenerator(config: EmbeddingModelConfig): EmbeddingGenerator;
//# sourceMappingURL=embedding-generator.d.ts.map