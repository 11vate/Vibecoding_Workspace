/**
 * Database Configuration Management
 *
 * Centralized configuration for vector databases and knowledge graph storage.
 */
/**
 * Vector Database Configuration
 */
export interface VectorDBConfig {
    type: "chroma" | "weaviate" | "milvus" | "pinecone" | "qdrant";
    connectionString: string;
    apiKey?: string;
    collectionName?: string;
    dimension?: number;
    options?: Record<string, unknown>;
}
/**
 * Embedding Model Configuration
 */
export interface EmbeddingConfig {
    type: "text" | "image" | "code";
    model: string;
    apiKey?: string;
    baseUrl?: string;
    dimension?: number;
}
/**
 * Knowledge Graph Configuration
 */
export interface KnowledgeGraphConfig {
    vectorDB: VectorDBConfig;
    embedding: EmbeddingConfig;
    enableCaching?: boolean;
    cacheSize?: number;
}
/**
 * Load database configuration from environment variables
 */
export declare function loadDatabaseConfig(): KnowledgeGraphConfig;
/**
 * Validate database configuration
 */
export declare function validateDatabaseConfig(config: KnowledgeGraphConfig): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=database-config.d.ts.map