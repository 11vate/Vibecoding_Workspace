/**
 * Sentence Transformers Integration
 *
 * Local embeddings using Sentence Transformers - completely free, no API keys.
 */
import { type RetryOptions } from '../../utils/retry';
/**
 * Sentence Transformers configuration
 */
export interface SentenceTransformersConfig {
    model?: string;
    device?: "cpu" | "gpu";
    cacheDir?: string;
    retryOptions?: RetryOptions;
    enableLogging?: boolean;
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
 * Sentence Transformers Error
 */
export declare class SentenceTransformersError extends Error {
    details?: unknown | undefined;
    constructor(message: string, details?: unknown | undefined);
}
/**
 * Sentence Transformers Service
 */
export declare class SentenceTransformersService {
    private config;
    private pipeline;
    private initialized;
    private cache;
    constructor(config?: SentenceTransformersConfig);
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Initialize the model
     */
    initialize(): Promise<void>;
    /**
     * Generate text embedding
     */
    generateEmbedding(text: string): Promise<EmbeddingResult>;
    /**
     * Generate embeddings for multiple texts (batch)
     */
    generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]>;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Get cache size
     */
    getCacheSize(): number;
    /**
     * Get model dimension
     */
    getModelDimension(): Promise<number>;
}
/**
 * Create Sentence Transformers service
 */
export declare function createSentenceTransformersService(config?: SentenceTransformersConfig): SentenceTransformersService;
//# sourceMappingURL=sentence-transformers.d.ts.map