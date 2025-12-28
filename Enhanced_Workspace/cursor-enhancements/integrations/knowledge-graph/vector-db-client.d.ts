/**
 * Vector Database Client
 *
 * Abstract interface for vector database operations.
 * Supports multiple backends: Milvus, Weaviate, Chroma, Pinecone, Qdrant.
 */
import type { KnowledgeNode, SemanticQuery, SearchResult } from '../../layer-38-knowledge-graph';
/**
 * Vector database type
 */
export type VectorDBType = "milvus" | "weaviate" | "chroma" | "pinecone" | "qdrant";
/**
 * Vector database configuration
 */
export interface VectorDBConfig {
    type: VectorDBType;
    connectionString: string;
    apiKey?: string;
    collectionName?: string;
    dimension?: number;
}
/**
 * Vector database client interface
 */
export interface VectorDBClient {
    /**
     * Initialize connection
     */
    connect(): Promise<void>;
    /**
     * Create collection/index
     */
    createCollection(name: string, dimension: number): Promise<void>;
    /**
     * Insert node
     */
    insert(node: KnowledgeNode): Promise<void>;
    /**
     * Insert multiple nodes
     */
    insertBatch(nodes: KnowledgeNode[]): Promise<void>;
    /**
     * Search similar nodes
     */
    search(query: SemanticQuery): Promise<SearchResult[]>;
    /**
     * Get node by ID
     */
    getById(id: string): Promise<KnowledgeNode | null>;
    /**
     * Update node
     */
    update(node: KnowledgeNode): Promise<void>;
    /**
     * Delete node
     */
    delete(id: string): Promise<void>;
    /**
     * Close connection
     */
    close(): Promise<void>;
}
/**
 * Create vector database client
 */
export declare function createVectorDBClient(config: VectorDBConfig): VectorDBClient;
//# sourceMappingURL=vector-db-client.d.ts.map