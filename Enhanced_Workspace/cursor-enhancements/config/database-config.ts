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
export function loadDatabaseConfig(): KnowledgeGraphConfig {
  const vectorDBType = (process.env.VECTOR_DB_TYPE || "chroma") as VectorDBConfig["type"];
  
  return {
    vectorDB: {
      type: vectorDBType,
      connectionString: process.env.VECTOR_DB_CONNECTION_STRING || getDefaultConnectionString(vectorDBType),
      apiKey: process.env.VECTOR_DB_API_KEY,
      collectionName: process.env.VECTOR_DB_COLLECTION_NAME || "knowledge_graph",
      dimension: parseInt(process.env.VECTOR_DB_DIMENSION || "1536"),
      options: parseOptions(process.env.VECTOR_DB_OPTIONS)
    },
    embedding: {
      type: "text",
      model: process.env.EMBEDDING_MODEL || "text-embedding-ada-002",
      apiKey: process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY,
      baseUrl: process.env.EMBEDDING_BASE_URL || "https://api.openai.com/v1",
      dimension: parseInt(process.env.EMBEDDING_DIMENSION || "1536")
    },
    enableCaching: process.env.ENABLE_EMBEDDING_CACHE !== "false",
    cacheSize: parseInt(process.env.EMBEDDING_CACHE_SIZE || "1000")
  };
}

/**
 * Get default connection string for database type
 */
function getDefaultConnectionString(type: VectorDBConfig["type"]): string {
  switch (type) {
    case "chroma":
      return "http://localhost:8000";
    case "weaviate":
      return "http://localhost:8080";
    case "milvus":
      return "localhost:19530";
    case "pinecone":
      return "https://api.pinecone.io";
    case "qdrant":
      return "http://localhost:6333";
    default:
      return "http://localhost:8000";
  }
}

/**
 * Parse options from environment variable
 */
function parseOptions(optionsStr?: string): Record<string, unknown> | undefined {
  if (!optionsStr) {
    return undefined;
  }

  try {
    return JSON.parse(optionsStr);
  } catch {
    return undefined;
  }
}

/**
 * Validate database configuration
 */
export function validateDatabaseConfig(config: KnowledgeGraphConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.vectorDB.connectionString) {
    errors.push("Vector database connection string is required");
  }

  if (config.vectorDB.dimension && config.vectorDB.dimension < 128) {
    errors.push("Vector dimension must be at least 128");
  }

  if (config.embedding.type === "text" && !config.embedding.apiKey) {
    errors.push("Embedding API key is required for text embeddings");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}









