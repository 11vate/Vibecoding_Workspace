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
 * Main knowledge graph configuration
 */
export const KNOWLEDGE_GRAPH = {
    /**
     * Node Types and Their Properties
     */
    nodeTypes: {
        asset: {
            description: "Visual or audio assets (sprites, backgrounds, sounds)",
            requiredProperties: ["path", "format", "dimensions"],
            commonTags: ["sprite", "background", "icon", "animation", "sound"],
            relationships: ["uses", "generates", "variant_of", "part_of"]
        },
        code: {
            description: "Code patterns, functions, classes, modules",
            requiredProperties: ["file", "language", "type"],
            commonTags: ["component", "service", "utility", "pattern"],
            relationships: ["implements", "depends_on", "extends", "references"]
        },
        mechanic: {
            description: "Game mechanics and systems",
            requiredProperties: ["name", "type"],
            commonTags: ["combat", "economy", "progression", "fusion"],
            relationships: ["uses", "depends_on", "conflicts_with"]
        },
        design: {
            description: "Design decisions and guidelines",
            requiredProperties: ["category", "rationale"],
            commonTags: ["ui", "ux", "visual", "interaction"],
            relationships: ["references", "extends", "conflicts_with"]
        },
        lore: {
            description: "Narrative and world-building content",
            requiredProperties: ["category", "content"],
            commonTags: ["story", "character", "world", "item"],
            relationships: ["references", "part_of", "similar_to"]
        },
        pattern: {
            description: "Recurring patterns extracted from code/assets",
            requiredProperties: ["patternType", "frequency"],
            commonTags: ["architectural", "design", "code", "asset"],
            relationships: ["similar_to", "extends", "variant_of"]
        },
        constraint: {
            description: "Project constraints and rules",
            requiredProperties: ["type", "enforced"],
            commonTags: ["style", "architecture", "design", "mechanical"],
            relationships: ["references", "conflicts_with"]
        },
        decision: {
            description: "Design and technical decisions",
            requiredProperties: ["decisionType", "rationale"],
            commonTags: ["architectural", "design", "technical"],
            relationships: ["references", "extends", "conflicts_with"]
        }
    },
    /**
     * Relationship Types
     */
    relationships: {
        uses: {
            description: "Node A uses Node B",
            examples: ["Code uses Asset", "Mechanic uses Code"]
        },
        generates: {
            description: "Node A generates Node B",
            examples: ["Code generates Asset", "Mechanic generates Code"]
        },
        depends_on: {
            description: "Node A depends on Node B",
            examples: ["Code depends on Asset", "Mechanic depends on Code"]
        },
        implements: {
            description: "Node A implements Node B",
            examples: ["Code implements Mechanic", "Code implements Design"]
        },
        references: {
            description: "Node A references Node B",
            examples: ["Code references Asset", "Design references Constraint"]
        },
        extends: {
            description: "Node A extends Node B",
            examples: ["Code extends Pattern", "Design extends Design"]
        },
        conflicts_with: {
            description: "Node A conflicts with Node B",
            examples: ["Design conflicts with Constraint", "Mechanic conflicts with Mechanic"]
        },
        similar_to: {
            description: "Node A is similar to Node B",
            examples: ["Asset similar to Asset", "Pattern similar to Pattern"]
        },
        variant_of: {
            description: "Node A is a variant of Node B",
            examples: ["Asset variant of Asset", "Code variant of Pattern"]
        },
        part_of: {
            description: "Node A is part of Node B",
            examples: ["Frame part of Animation", "Component part of System"]
        }
    },
    /**
     * Embedding Generation
     */
    embeddings: {
        strategies: {
            text: "Text embedding model (OpenAI, Cohere, etc.)",
            image: "Image embedding model (CLIP, etc.)",
            code: "Code embedding model (CodeBERT, etc.)",
            multimodal: "Multimodal embedding (combines text + image)"
        },
        dimensions: {
            text: 1536, // OpenAI ada-002
            image: 512, // CLIP
            code: 768, // CodeBERT
            multimodal: 2048 // Combined
        }
    },
    /**
     * Semantic Search
     */
    search: {
        strategies: {
            similarity: "Vector similarity search using embeddings",
            relationship: "Graph traversal following relationships",
            hybrid: "Combine similarity and relationship search",
            filtered: "Filter by node type, tags, or properties"
        },
        algorithms: {
            cosine: "Cosine similarity for embeddings",
            euclidean: "Euclidean distance",
            graphWalk: "Random walk or BFS/DFS traversal",
            pagerank: "PageRank for importance scoring"
        }
    },
    /**
     * Canon Validation
     */
    canonValidation: {
        checks: {
            styleDrift: {
                description: "Detect style inconsistencies",
                method: "Compare asset/style nodes against project constraints",
                threshold: 0.7 // Similarity threshold
            },
            constraintViolation: {
                description: "Detect constraint violations",
                method: "Check nodes against constraint rules",
                action: "warn" | "block"
            },
            inconsistency: {
                description: "Detect logical inconsistencies",
                method: "Check relationships for conflicts",
                action: "warn"
            },
            duplicate: {
                description: "Detect duplicate or near-duplicate nodes",
                method: "Similarity search with high threshold",
                threshold: 0.95
            }
        }
    },
    /**
     * Pattern Extraction
     */
    patternExtraction: {
        strategies: {
            frequency: "Extract frequently occurring patterns",
            clustering: "Cluster similar nodes",
            relationship: "Extract common relationship patterns",
            temporal: "Extract patterns over time"
        },
        applications: {
            codePatterns: "Extract code patterns for reuse",
            assetPatterns: "Extract asset style patterns",
            designPatterns: "Extract design decision patterns",
            mechanicPatterns: "Extract game mechanic patterns"
        }
    },
    /**
     * Integration Points
     */
    integrations: {
        vectorDatabase: {
            options: ["Milvus", "Weaviate", "Chroma", "Pinecone", "Qdrant"],
            capabilities: ["Embedding storage", "Similarity search", "Scalability"]
        },
        graphDatabase: {
            options: ["Neo4j", "ArangoDB", "Dgraph"],
            capabilities: ["Relationship storage", "Graph queries", "Traversal"]
        },
        hybrid: {
            description: "Use vector DB for embeddings + graph DB for relationships",
            benefits: ["Best of both worlds", "Flexible queries", "Scalable"]
        }
    },
    /**
     * Update Protocols
     */
    updates: {
        onAssetCreate: {
            actions: [
                "Create asset node",
                "Extract embeddings",
                "Link to related code/design nodes",
                "Validate against canon"
            ]
        },
        onCodeChange: {
            actions: [
                "Update code node",
                "Refresh embeddings if significant change",
                "Update relationships",
                "Check for pattern matches"
            ]
        },
        onDesignDecision: {
            actions: [
                "Create decision node",
                "Link to affected nodes",
                "Update constraints if needed",
                "Extract patterns"
            ]
        }
    }
};
// Global graph manager instance (would be initialized from config)
let graphManager = null;
let embeddingGenerator = null;
/**
 * Initialize knowledge graph system
 */
export async function initializeKnowledgeGraph(config) {
    try {
        const { createVectorDBClient } = require('./integrations/knowledge-graph/vector-db-client');
        const { createEmbeddingGenerator } = require('./integrations/knowledge-graph/embedding-generator');
        const { createGraphManager } = require('./integrations/knowledge-graph/graph-manager');
        // Create vector DB client
        const vectorDB = createVectorDBClient({
            type: config.vectorDBType || "chroma",
            connectionString: config.vectorDBConfig?.connectionString || "http://localhost:8000",
            apiKey: config.vectorDBConfig?.apiKey,
            dimension: 1536
        });
        // Create embedding generator
        embeddingGenerator = createEmbeddingGenerator({
            type: "text",
            model: config.embeddingModel || "text-embedding-ada-002",
            apiKey: config.embeddingApiKey || process.env.OPENAI_API_KEY
        });
        // Create graph manager
        graphManager = createGraphManager({
            vectorDB,
            embeddingGenerator
        });
        await graphManager.initialize();
    }
    catch (error) {
        throw new Error(`Failed to initialize knowledge graph: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Create knowledge node
 */
export async function createNode(type, content, metadata) {
    if (!graphManager) {
        throw new Error("Knowledge graph not initialized. Call initializeKnowledgeGraph first.");
    }
    try {
        // Generate ID
        const id = `${type}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        // Create node structure
        const nodeData = {
            id,
            type,
            name: metadata.name,
            description: metadata.description,
            tags: metadata.tags || [],
            metadata: {
                ...metadata.properties,
                source: metadata.source,
                author: metadata.author,
                confidence: metadata.confidence
            }
        };
        // Create node in graph manager (which generates embedding)
        const createdNode = await graphManager.createNode(nodeData);
        // Convert to KnowledgeNode format
        const knowledgeNode = {
            id: createdNode.id,
            type: createdNode.type,
            content,
            embeddings: createdNode.embedding, // Graph manager uses singular 'embedding'
            metadata,
            relationships: [],
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            version: 1
        };
        return knowledgeNode;
    }
    catch (error) {
        throw new Error(`Failed to create node: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Search knowledge graph
 */
export async function searchGraph(query) {
    if (!graphManager) {
        throw new Error("Knowledge graph not initialized. Call initializeKnowledgeGraph first.");
    }
    try {
        // Convert SemanticQuery to graph manager format
        const graphQuery = {
            text: query.text,
            embedding: query.embeddings?.[0], // Graph manager expects single embedding
            limit: query.limit || 10,
            threshold: query.threshold || 0.7
        };
        const results = await graphManager.search(graphQuery);
        // Convert to SearchResult format
        return results.map(result => ({
            node: {
                id: result.node.id,
                type: result.node.type,
                content: result.node.content || {},
                embeddings: result.node.embedding ? [result.node.embedding] : [],
                metadata: result.node.metadata || { name: result.node.name, tags: [], properties: {} },
                relationships: [],
                createdAt: result.node.createdAt || new Date().toISOString(),
                modifiedAt: result.node.modifiedAt || new Date().toISOString(),
                version: 1
            },
            similarity: result.similarity || 0,
            path: result.path
        }));
    }
    catch (error) {
        throw new Error(`Failed to search graph: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Create relationship between nodes
 */
export async function createRelationship(sourceId, targetId, type, strength) {
    if (!graphManager) {
        throw new Error("Knowledge graph not initialized. Call initializeKnowledgeGraph first.");
    }
    try {
        const relationshipId = `rel_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const edge = {
            from: sourceId,
            to: targetId,
            type: type,
            properties: {
                strength: strength || 1.0
            }
        };
        await graphManager.createRelationship(edge);
        const relationship = {
            id: relationshipId,
            type,
            sourceId,
            targetId,
            strength: strength || 1.0,
            metadata: {},
            createdAt: new Date().toISOString()
        };
        return relationship;
    }
    catch (error) {
        throw new Error(`Failed to create relationship: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Validate against canon
 */
export async function validateCanon(node, constraints) {
    if (!graphManager) {
        throw new Error("Knowledge graph not initialized. Call initializeKnowledgeGraph first.");
    }
    try {
        const constraintNames = constraints.map(c => c.name || c.type);
        const validation = await graphManager.validateCanon(node.id, constraintNames);
        const violations = validation.violations.map(v => ({
            nodeId: node.id,
            type: "constraint_violation",
            description: v,
            severity: "error",
            suggestedFix: "Review constraint requirements"
        }));
        return {
            valid: validation.valid,
            violations,
            suggestions: validation.violations.map(v => `Fix: ${v}`)
        };
    }
    catch (error) {
        throw new Error(`Failed to validate canon: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Extract patterns from graph
 */
export async function extractPatterns(nodeType, minFrequency) {
    if (!graphManager) {
        throw new Error("Knowledge graph not initialized. Call initializeKnowledgeGraph first.");
    }
    try {
        const minSimilarity = 0.7; // Default similarity threshold
        const clusters = await graphManager.extractPatterns(nodeType || "pattern", minSimilarity);
        const patterns = clusters.map((cluster, index) => ({
            id: `pattern_${Date.now()}_${index}`,
            name: `Pattern ${index + 1}`,
            description: `Extracted pattern from ${cluster.length} similar nodes`,
            nodeType: nodeType || "pattern",
            frequency: cluster.length,
            nodes: cluster.map(n => n.id),
            metadata: {
                similarity: minSimilarity,
                clusterSize: cluster.length
            },
            createdAt: new Date().toISOString()
        }));
        // Filter by minimum frequency if specified
        if (minFrequency) {
            return patterns.filter(p => p.frequency >= minFrequency);
        }
        return patterns;
    }
    catch (error) {
        throw new Error(`Failed to extract patterns: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Get project context
 */
export async function getProjectContext(projectId) {
    if (!graphManager) {
        throw new Error("Knowledge graph not initialized. Call initializeKnowledgeGraph first.");
    }
    try {
        // Search for all nodes related to this project
        const query = {
            text: projectId,
            limit: 1000
        };
        const searchResults = await searchGraph(query);
        const nodes = searchResults.map(r => r.node);
        // Get all relationships
        const relationships = [];
        for (const node of nodes) {
            const nodeRelationships = graphManager.getRelationships(node.id);
            for (const rel of nodeRelationships) {
                relationships.push({
                    id: `${rel.from}:${rel.to}:${rel.type}`,
                    type: rel.type,
                    sourceId: rel.from,
                    targetId: rel.to,
                    strength: 1.0,
                    metadata: rel.properties || {},
                    createdAt: new Date().toISOString()
                });
            }
        }
        // Extract patterns
        const patterns = await extractPatterns();
        // Extract constraints (nodes of type "constraint")
        const constraints = nodes
            .filter(n => n.type === "constraint")
            .map(n => ({
            id: n.id,
            name: n.metadata.name,
            type: n.metadata.properties.type || "general",
            description: n.metadata.description || "",
            enforced: true,
            metadata: n.metadata.properties
        }));
        return {
            projectId,
            nodes,
            relationships,
            patterns,
            constraints,
            lastUpdated: new Date().toISOString()
        };
    }
    catch (error) {
        throw new Error(`Failed to get project context: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Update graph with batch operations
 */
export async function updateGraph(updates) {
    if (!graphManager) {
        throw new Error("Knowledge graph not initialized. Call initializeKnowledgeGraph first.");
    }
    try {
        for (const update of updates) {
            switch (update.operation) {
                case "create":
                    if (update.node) {
                        await createNode(update.node.type, update.node.content, update.node.metadata || { name: "", tags: [], properties: {} });
                    }
                    break;
                case "update":
                    if (update.node && update.nodeId) {
                        const existingNode = await graphManager.getNode(update.nodeId);
                        if (existingNode) {
                            const updatedNode = {
                                ...existingNode,
                                ...update.node,
                                id: update.nodeId
                            };
                            await graphManager.updateNode(updatedNode);
                        }
                    }
                    break;
                case "delete":
                    if (update.nodeId) {
                        await graphManager.deleteNode(update.nodeId);
                    }
                    break;
                case "relate":
                    if (update.relationship) {
                        await createRelationship(update.relationship.sourceId || "", update.relationship.targetId || "", update.relationship.type || "references", update.relationship.strength);
                    }
                    break;
            }
        }
    }
    catch (error) {
        throw new Error(`Failed to update graph: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=layer-38-knowledge-graph.js.map