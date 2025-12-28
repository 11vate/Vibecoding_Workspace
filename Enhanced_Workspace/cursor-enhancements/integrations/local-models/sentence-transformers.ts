/**
 * Sentence Transformers Integration
 * 
 * Local embeddings using Sentence Transformers - completely free, no API keys.
 */

import { retry, type RetryOptions } from '../../utils/retry';

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
export class SentenceTransformersError extends Error {
  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SentenceTransformersError';
  }
}

/**
 * Sentence Transformers Service
 */
export class SentenceTransformersService {
  private config: Required<Omit<SentenceTransformersConfig, 'retryOptions' | 'cacheDir'>> & {
    retryOptions?: RetryOptions;
    cacheDir?: string;
  };
  private pipeline: any; // Transformers pipeline
  private initialized = false;
  private cache: Map<string, EmbeddingResult> = new Map();

  constructor(config: SentenceTransformersConfig = {}) {
    this.config = {
      model: config.model || process.env.SENTENCE_TRANSFORMERS_MODEL || "Xenova/all-MiniLM-L6-v2",
      device: config.device || (process.env.USE_GPU === "true" ? "gpu" : "cpu"),
      cacheDir: config.cacheDir || process.env.MODEL_CACHE_DIR,
      enableLogging: config.enableLogging || process.env.ENABLE_LOGGING === "true",
      retryOptions: config.retryOptions
    };
  }

  /**
   * Log message if logging is enabled
   */
  private log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[SentenceTransformers] ${message}`, data || '');
    }
  }

  /**
   * Initialize the model
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      this.log('Initializing Sentence Transformers model', { model: this.config.model });

      // Dynamic import of @xenova/transformers
      let transformers: any;
      try {
        transformers = await import('@xenova/transformers');
      } catch (importError) {
        throw new SentenceTransformersError(
          'Transformers library not found. Install it with: npm install @xenova/transformers\n' +
          'Or use a different embedding method.'
        );
      }

      // Create pipeline
      this.pipeline = await transformers.pipeline(
        'feature-extraction',
        this.config.model,
        {
          device: this.config.device,
          cache_dir: this.config.cacheDir
        }
      );

      this.initialized = true;
      this.log('Model initialized successfully');
    } catch (error) {
      throw new SentenceTransformersError(
        `Failed to initialize model: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Generate text embedding
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    // Check cache
    const cacheKey = `${this.config.model}:${text.substring(0, 200)}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return { ...cached, cached: true };
    }

    try {
      if (!this.initialized) {
        await this.initialize();
      }

      this.log('Generating embedding', { textLength: text.length });

      // Generate embedding
      const output = await this.pipeline(text, {
        pooling: 'mean',
        normalize: true
      });

      // Extract embedding array
      let embedding: number[];
      if (output.data) {
        embedding = Array.from(output.data);
      } else if (Array.isArray(output)) {
        embedding = output.flat();
      } else if (output instanceof Float32Array || output instanceof Float64Array) {
        embedding = Array.from(output);
      } else {
        throw new SentenceTransformersError('Unexpected output format from model');
      }

      const result: EmbeddingResult = {
        embedding,
        dimension: embedding.length,
        model: this.config.model,
        cached: false
      };

      // Cache result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      throw new SentenceTransformersError(
        `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Generate embeddings for multiple texts (batch)
   */
  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      this.log('Generating batch embeddings', { count: texts.length });

      // Process in batches to avoid memory issues
      const batchSize = 32;
      const results: EmbeddingResult[] = [];

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(text => this.generateEmbedding(text))
        );
        results.push(...batchResults);
      }

      return results;
    } catch (error) {
      throw new SentenceTransformersError(
        `Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Get model dimension
   */
  async getModelDimension(): Promise<number> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Test with a small text to get dimension
    const testResult = await this.generateEmbedding("test");
    return testResult.dimension;
  }
}

/**
 * Create Sentence Transformers service
 */
export function createSentenceTransformersService(
  config?: SentenceTransformersConfig
): SentenceTransformersService {
  return new SentenceTransformersService(config);
}









