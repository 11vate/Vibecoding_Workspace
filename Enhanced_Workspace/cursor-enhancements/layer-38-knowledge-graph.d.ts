/**
 * LAYER 38 — KNOWLEDGE GRAPH
 *
 * Persistent semantic memory for projects - remember assets, code patterns, design decisions.
 *
 * This layer provides a knowledge graph system that stores and retrieves semantic information
 * about projects, enabling Cursor to remember context across sessions, maintain consistency,
 * and reason about relationships between assets, code, mechanics, and design decisions.
 */
/**
 * Knowledge node type
 */
export type KnowledgeNodeType = "asset" | "code" | "mechanic" | "design" | "lore" | "pattern" | "constraint" | "decision";
/**
 * Relationship type
 */
export type RelationshipType = "uses" | "generates" | "depends_on" | "implements" | "references" | "extends" | "conflicts_with" | "similar_to" | "variant_of" | "part_of";
/**
 * Knowledge node
 */
export interface KnowledgeNode {
    id: string;
    type: KnowledgeNodeType;
    content: unknown;
    embeddings: number[];
    metadata: NodeMetadata;
    relationships: Relationship[];
    createdAt: string;
    modifiedAt: string;
    version: number;
}
/**
 * Node metadata
 */
export interface NodeMetadata {
    name: string;
    description?: string;
    tags: string[];
    properties: Record<string, unknown>;
    source?: string;
    author?: string;
    confidence?: number;
}
/**
 * Relationship between nodes
 */
export interface Relationship {
    id: string;
    type: RelationshipType;
    sourceId: string;
    targetId: string;
    strength: number;
    metadata: Record<string, unknown>;
    createdAt: string;
}
/**
 * Semantic search query
 */
export interface SemanticQuery {
    text?: string;
    embeddings?: number[];
    nodeTypes?: KnowledgeNodeType[];
    tags?: string[];
    relationships?: RelationshipType[];
    limit?: number;
    threshold?: number;
}
/**
 * Search result
 */
export interface SearchResult {
    node: KnowledgeNode;
    similarity: number;
    path?: Relationship[];
}
/**
 * Graph update operation
 */
export interface GraphUpdate {
    operation: "create" | "update" | "delete" | "relate";
    node?: Partial<KnowledgeNode>;
    relationship?: Partial<Relationship>;
    nodeId?: string;
    relationshipId?: string;
}
/**
 * Canon validation result
 */
export interface CanonValidation {
    valid: boolean;
    violations: CanonViolation[];
    suggestions: string[];
}
/**
 * Canon violation
 */
export interface CanonViolation {
    nodeId: string;
    type: "style_drift" | "constraint_violation" | "inconsistency" | "duplicate";
    description: string;
    severity: "error" | "warning" | "info";
    suggestedFix?: string;
}
/**
 * Project context
 */
export interface ProjectContext {
    projectId: string;
    nodes: KnowledgeNode[];
    relationships: Relationship[];
    patterns: Pattern[];
    constraints: Constraint[];
    lastUpdated: string;
}
/**
 * Pattern extracted from nodes
 */
export interface Pattern {
    id: string;
    name: string;
    description: string;
    nodeIds: string[];
    frequency: number;
    confidence: number;
    examples: string[];
}
/**
 * Constraint definition
 */
export interface Constraint {
    id: string;
    type: "style" | "architecture" | "design" | "mechanical";
    description: string;
    rules: ConstraintRule[];
    enforced: boolean;
}
/**
 * Constraint rule
 */
export interface ConstraintRule {
    condition: string;
    action: "allow" | "warn" | "block";
    message: string;
}
/**
 * Main knowledge graph configuration
 */
export declare const KNOWLEDGE_GRAPH: {
    /**
     * Node Types and Their Properties
     */
    readonly nodeTypes: {
        readonly asset: {
            readonly description: "Visual or audio assets (sprites, backgrounds, sounds)";
            readonly requiredProperties: readonly ["path", "format", "dimensions"];
            readonly commonTags: readonly ["sprite", "background", "icon", "animation", "sound"];
            readonly relationships: readonly ["uses", "generates", "variant_of", "part_of"];
        };
        readonly code: {
            readonly description: "Code patterns, functions, classes, modules";
            readonly requiredProperties: readonly ["file", "language", "type"];
            readonly commonTags: readonly ["component", "service", "utility", "pattern"];
            readonly relationships: readonly ["implements", "depends_on", "extends", "references"];
        };
        readonly mechanic: {
            readonly description: "Game mechanics and systems";
            readonly requiredProperties: readonly ["name", "type"];
            readonly commonTags: readonly ["combat", "economy", "progression", "fusion"];
            readonly relationships: readonly ["uses", "depends_on", "conflicts_with"];
        };
        readonly design: {
            readonly description: "Design decisions and guidelines";
            readonly requiredProperties: readonly ["category", "rationale"];
            readonly commonTags: readonly ["ui", "ux", "visual", "interaction"];
            readonly relationships: readonly ["references", "extends", "conflicts_with"];
        };
        readonly lore: {
            readonly description: "Narrative and world-building content";
            readonly requiredProperties: readonly ["category", "content"];
            readonly commonTags: readonly ["story", "character", "world", "item"];
            readonly relationships: readonly ["references", "part_of", "similar_to"];
        };
        readonly pattern: {
            readonly description: "Recurring patterns extracted from code/assets";
            readonly requiredProperties: readonly ["patternType", "frequency"];
            readonly commonTags: readonly ["architectural", "design", "code", "asset"];
            readonly relationships: readonly ["similar_to", "extends", "variant_of"];
        };
        readonly constraint: {
            readonly description: "Project constraints and rules";
            readonly requiredProperties: readonly ["type", "enforced"];
            readonly commonTags: readonly ["style", "architecture", "design", "mechanical"];
            readonly relationships: readonly ["references", "conflicts_with"];
        };
        readonly decision: {
            readonly description: "Design and technical decisions";
            readonly requiredProperties: readonly ["decisionType", "rationale"];
            readonly commonTags: readonly ["architectural", "design", "technical"];
            readonly relationships: readonly ["references", "extends", "conflicts_with"];
        };
    };
    /**
     * Relationship Types
     */
    readonly relationships: {
        readonly uses: {
            readonly description: "Node A uses Node B";
            readonly examples: readonly ["Code uses Asset", "Mechanic uses Code"];
        };
        readonly generates: {
            readonly description: "Node A generates Node B";
            readonly examples: readonly ["Code generates Asset", "Mechanic generates Code"];
        };
        readonly depends_on: {
            readonly description: "Node A depends on Node B";
            readonly examples: readonly ["Code depends on Asset", "Mechanic depends on Code"];
        };
        readonly implements: {
            readonly description: "Node A implements Node B";
            readonly examples: readonly ["Code implements Mechanic", "Code implements Design"];
        };
        readonly references: {
            readonly description: "Node A references Node B";
            readonly examples: readonly ["Code references Asset", "Design references Constraint"];
        };
        readonly extends: {
            readonly description: "Node A extends Node B";
            readonly examples: readonly ["Code extends Pattern", "Design extends Design"];
        };
        readonly conflicts_with: {
            readonly description: "Node A conflicts with Node B";
            readonly examples: readonly ["Design conflicts with Constraint", "Mechanic conflicts with Mechanic"];
        };
        readonly similar_to: {
            readonly description: "Node A is similar to Node B";
            readonly examples: readonly ["Asset similar to Asset", "Pattern similar to Pattern"];
        };
        readonly variant_of: {
            readonly description: "Node A is a variant of Node B";
            readonly examples: readonly ["Asset variant of Asset", "Code variant of Pattern"];
        };
        readonly part_of: {
            readonly description: "Node A is part of Node B";
            readonly examples: readonly ["Frame part of Animation", "Component part of System"];
        };
    };
    /**
     * Embedding Generation
     */
    readonly embeddings: {
        readonly strategies: {
            readonly text: "Text embedding model (OpenAI, Cohere, etc.)";
            readonly image: "Image embedding model (CLIP, etc.)";
            readonly code: "Code embedding model (CodeBERT, etc.)";
            readonly multimodal: "Multimodal embedding (combines text + image)";
        };
        readonly dimensions: {
            readonly text: 1536;
            readonly image: 512;
            readonly code: 768;
            readonly multimodal: 2048;
        };
    };
    /**
     * Semantic Search
     */
    readonly search: {
        readonly strategies: {
            readonly similarity: "Vector similarity search using embeddings";
            readonly relationship: "Graph traversal following relationships";
            readonly hybrid: "Combine similarity and relationship search";
            readonly filtered: "Filter by node type, tags, or properties";
        };
        readonly algorithms: {
            readonly cosine: "Cosine similarity for embeddings";
            readonly euclidean: "Euclidean distance";
            readonly graphWalk: "Random walk or BFS/DFS traversal";
            readonly pagerank: "PageRank for importance scoring";
        };
    };
    /**
     * Canon Validation
     */
    readonly canonValidation: {
        readonly checks: {
            readonly styleDrift: {
                readonly description: "Detect style inconsistencies";
                readonly method: "Compare asset/style nodes against project constraints";
                readonly threshold: 0.7;
            };
            readonly constraintViolation: {
                readonly description: "Detect constraint violations";
                readonly method: "Check nodes against constraint rules";
                readonly action: number;
            };
            readonly inconsistency: {
                readonly description: "Detect logical inconsistencies";
                readonly method: "Check relationships for conflicts";
                readonly action: "warn";
            };
            readonly duplicate: {
                readonly description: "Detect duplicate or near-duplicate nodes";
                readonly method: "Similarity search with high threshold";
                readonly threshold: 0.95;
            };
        };
    };
    /**
     * Pattern Extraction
     */
    readonly patternExtraction: {
        readonly strategies: {
            readonly frequency: "Extract frequently occurring patterns";
            readonly clustering: "Cluster similar nodes";
            readonly relationship: "Extract common relationship patterns";
            readonly temporal: "Extract patterns over time";
        };
        readonly applications: {
            readonly codePatterns: "Extract code patterns for reuse";
            readonly assetPatterns: "Extract asset style patterns";
            readonly designPatterns: "Extract design decision patterns";
            readonly mechanicPatterns: "Extract game mechanic patterns";
        };
    };
    /**
     * Integration Points
     */
    readonly integrations: {
        readonly vectorDatabase: {
            readonly options: readonly ["Milvus", "Weaviate", "Chroma", "Pinecone", "Qdrant"];
            readonly capabilities: readonly ["Embedding storage", "Similarity search", "Scalability"];
        };
        readonly graphDatabase: {
            readonly options: readonly ["Neo4j", "ArangoDB", "Dgraph"];
            readonly capabilities: readonly ["Relationship storage", "Graph queries", "Traversal"];
        };
        readonly hybrid: {
            readonly description: "Use vector DB for embeddings + graph DB for relationships";
            readonly benefits: readonly ["Best of both worlds", "Flexible queries", "Scalable"];
        };
    };
    /**
     * Update Protocols
     */
    readonly updates: {
        readonly onAssetCreate: {
            readonly actions: readonly ["Create asset node", "Extract embeddings", "Link to related code/design nodes", "Validate against canon"];
        };
        readonly onCodeChange: {
            readonly actions: readonly ["Update code node", "Refresh embeddings if significant change", "Update relationships", "Check for pattern matches"];
        };
        readonly onDesignDecision: {
            readonly actions: readonly ["Create decision node", "Link to affected nodes", "Update constraints if needed", "Extract patterns"];
        };
    };
};
/**
 * Initialize knowledge graph system
 */
export declare function initializeKnowledgeGraph(config: {
    vectorDBType?: "chroma" | "weaviate";
    vectorDBConfig?: {
        connectionString: string;
        apiKey?: string;
    };
    embeddingModel?: string;
    embeddingApiKey?: string;
}): Promise<void>;
/**
 * Create knowledge node
 */
export declare function createNode(type: KnowledgeNodeType, content: unknown, metadata: NodeMetadata): Promise<KnowledgeNode>;
/**
 * Search knowledge graph
 */
export declare function searchGraph(query: SemanticQuery): Promise<SearchResult[]>;
/**
 * Create relationship between nodes
 */
export declare function createRelationship(sourceId: string, targetId: string, type: RelationshipType, strength?: number): Promise<Relationship>;
/**
 * Validate against canon
 */
export declare function validateCanon(node: KnowledgeNode, constraints: Constraint[]): Promise<CanonValidation>;
/**
 * Extract patterns from graph
 */
export declare function extractPatterns(nodeType?: KnowledgeNodeType, minFrequency?: number): Promise<Pattern[]>;
/**
 * Get project context
 */
export declare function getProjectContext(projectId: string): Promise<ProjectContext>;
/**
 * Update graph with batch operations
 */
export declare function updateGraph(updates: GraphUpdate[]): Promise<void>;
/**
 * Type exports
 */
export type { KnowledgeNode, KnowledgeNodeType, Relationship, RelationshipType, SemanticQuery, SearchResult, CanonValidation, ProjectContext, Pattern, Constraint };
//# sourceMappingURL=layer-38-knowledge-graph.d.ts.map