/**
 * Graph Manager
 *
 * Manages knowledge graph operations including CRUD, relationships, and semantic search.
 */
import type { KnowledgeNode, KnowledgeGraphEdge, SemanticQuery, SearchResult } from '../../layer-38-knowledge-graph';
import type { VectorDBClient } from './vector-db-client';
import type { EmbeddingGenerator } from './embedding-generator';
/**
 * Graph manager configuration
 */
export interface GraphManagerConfig {
    vectorDB: VectorDBClient;
    embeddingGenerator: EmbeddingGenerator;
    collectionName?: string;
}
/**
 * Graph Manager Error
 */
export declare class GraphManagerError extends Error {
    details?: unknown | undefined;
    constructor(message: string, details?: unknown | undefined);
}
/**
 * Graph Manager
 */
export declare class GraphManager {
    private config;
    private edges;
    private nodes;
    constructor(config: GraphManagerConfig);
    /**
     * Initialize graph (create collection if needed)
     */
    initialize(): Promise<void>;
    /**
     * Create node with embedding
     */
    createNode(node: Omit<KnowledgeNode, 'embedding'>): Promise<KnowledgeNode>;
    /**
     * Get node by ID
     */
    getNode(id: string): Promise<KnowledgeNode | null>;
    /**
     * Update node
     */
    updateNode(node: KnowledgeNode): Promise<void>;
    /**
     * Delete node
     */
    deleteNode(id: string): Promise<void>;
    /**
     * Create relationship
     */
    createRelationship(edge: KnowledgeGraphEdge): Promise<void>;
    /**
     * Get relationships for a node
     */
    getRelationships(nodeId: string, type?: string): KnowledgeGraphEdge[];
    /**
     * Semantic search
     */
    search(query: SemanticQuery): Promise<SearchResult[]>;
    /**
     * Validate canon (check constraints)
     */
    validateCanon(nodeId: string, constraints: string[]): Promise<{
        valid: boolean;
        violations: string[];
    }>;
    /**
     * Extract patterns (clustering similar nodes)
     */
    extractPatterns(nodeType: string, minSimilarity?: number): Promise<KnowledgeNode[][]>;
    /**
     * Extract text content from node for embedding
     */
    private extractTextContent;
    /**
     * Calculate cosine similarity
     */
    private cosineSimilarity;
    /**
     * Close connections
     */
    close(): Promise<void>;
}
/**
 * Create graph manager
 */
export declare function createGraphManager(config: GraphManagerConfig): GraphManager;
//# sourceMappingURL=graph-manager.d.ts.map