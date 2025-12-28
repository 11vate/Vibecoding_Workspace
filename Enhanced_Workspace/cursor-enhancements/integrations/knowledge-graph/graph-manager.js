/**
 * Graph Manager
 *
 * Manages knowledge graph operations including CRUD, relationships, and semantic search.
 */
/**
 * Graph Manager Error
 */
export class GraphManagerError extends Error {
    details;
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = 'GraphManagerError';
    }
}
/**
 * Graph Manager
 */
export class GraphManager {
    config;
    edges = new Map();
    nodes = new Map();
    constructor(config) {
        this.config = {
            collectionName: "knowledge_graph",
            ...config
        };
    }
    /**
     * Initialize graph (create collection if needed)
     */
    async initialize() {
        try {
            await this.config.vectorDB.connect();
            await this.config.vectorDB.createCollection(this.config.collectionName, 1536 // Default embedding dimension
            );
        }
        catch (error) {
            throw new GraphManagerError(`Failed to initialize graph: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Create node with embedding
     */
    async createNode(node) {
        try {
            // Generate embedding from node content
            const textContent = this.extractTextContent(node);
            const embeddingResult = await this.config.embeddingGenerator.generateTextEmbedding(textContent);
            const fullNode = {
                ...node,
                embedding: embeddingResult.embedding
            };
            // Store in vector DB
            await this.config.vectorDB.insert(fullNode);
            // Store in local cache
            this.nodes.set(node.id, fullNode);
            return fullNode;
        }
        catch (error) {
            throw new GraphManagerError(`Failed to create node: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Get node by ID
     */
    async getNode(id) {
        // Check cache first
        if (this.nodes.has(id)) {
            return this.nodes.get(id);
        }
        try {
            const node = await this.config.vectorDB.getById(id);
            if (node) {
                this.nodes.set(id, node);
            }
            return node;
        }
        catch (error) {
            throw new GraphManagerError(`Failed to get node: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Update node
     */
    async updateNode(node) {
        try {
            // Regenerate embedding if content changed
            const existingNode = await this.getNode(node.id);
            if (existingNode) {
                const newTextContent = this.extractTextContent(node);
                const oldTextContent = this.extractTextContent(existingNode);
                if (newTextContent !== oldTextContent) {
                    const embeddingResult = await this.config.embeddingGenerator.generateTextEmbedding(newTextContent);
                    node.embedding = embeddingResult.embedding;
                }
            }
            await this.config.vectorDB.update(node);
            this.nodes.set(node.id, node);
        }
        catch (error) {
            throw new GraphManagerError(`Failed to update node: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Delete node
     */
    async deleteNode(id) {
        try {
            await this.config.vectorDB.delete(id);
            this.nodes.delete(id);
            // Remove edges connected to this node
            const edgesToRemove = [];
            for (const [edgeId, edges] of this.edges.entries()) {
                const filtered = edges.filter(e => e.from !== id && e.to !== id);
                if (filtered.length !== edges.length) {
                    this.edges.set(edgeId, filtered);
                    edgesToRemove.push(edgeId);
                }
            }
        }
        catch (error) {
            throw new GraphManagerError(`Failed to delete node: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Create relationship
     */
    async createRelationship(edge) {
        // Validate nodes exist
        const fromNode = await this.getNode(edge.from);
        const toNode = await this.getNode(edge.to);
        if (!fromNode || !toNode) {
            throw new GraphManagerError(`Cannot create relationship: one or both nodes do not exist`);
        }
        // Store edge
        const edgeKey = `${edge.from}:${edge.to}:${edge.type}`;
        if (!this.edges.has(edgeKey)) {
            this.edges.set(edgeKey, []);
        }
        this.edges.get(edgeKey).push(edge);
    }
    /**
     * Get relationships for a node
     */
    getRelationships(nodeId, type) {
        const allEdges = [];
        for (const edges of this.edges.values()) {
            for (const edge of edges) {
                if ((edge.from === nodeId || edge.to === nodeId) && (!type || edge.type === type)) {
                    allEdges.push(edge);
                }
            }
        }
        return allEdges;
    }
    /**
     * Semantic search
     */
    async search(query) {
        try {
            // Generate query embedding if not provided
            if (!query.embedding) {
                const embeddingResult = await this.config.embeddingGenerator.generateTextEmbedding(query.text);
                query.embedding = embeddingResult.embedding;
            }
            // Search vector DB
            const results = await this.config.vectorDB.search(query);
            return results;
        }
        catch (error) {
            throw new GraphManagerError(`Failed to search graph: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Validate canon (check constraints)
     */
    async validateCanon(nodeId, constraints) {
        const node = await this.getNode(nodeId);
        if (!node) {
            return { valid: false, violations: ["Node not found"] };
        }
        const violations = [];
        // Check constraints (simplified - would need actual constraint checking logic)
        for (const constraint of constraints) {
            // This would check against actual constraint rules
            // For now, just a placeholder
        }
        return {
            valid: violations.length === 0,
            violations
        };
    }
    /**
     * Extract patterns (clustering similar nodes)
     */
    async extractPatterns(nodeType, minSimilarity = 0.7) {
        try {
            // Get all nodes of this type
            const allNodes = [];
            for (const node of this.nodes.values()) {
                if (node.type === nodeType) {
                    allNodes.push(node);
                }
            }
            // Cluster by similarity (simplified - would use proper clustering algorithm)
            const clusters = [];
            const processed = new Set();
            for (const node of allNodes) {
                if (processed.has(node.id))
                    continue;
                const cluster = [node];
                processed.add(node.id);
                for (const otherNode of allNodes) {
                    if (processed.has(otherNode.id))
                        continue;
                    const similarity = this.cosineSimilarity(node.embedding, otherNode.embedding);
                    if (similarity >= minSimilarity) {
                        cluster.push(otherNode);
                        processed.add(otherNode.id);
                    }
                }
                if (cluster.length > 1) {
                    clusters.push(cluster);
                }
            }
            return clusters;
        }
        catch (error) {
            throw new GraphManagerError(`Failed to extract patterns: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
        }
    }
    /**
     * Extract text content from node for embedding
     */
    extractTextContent(node) {
        const parts = [node.name];
        if ('description' in node && node.description) {
            parts.push(node.description);
        }
        if ('tags' in node && node.tags) {
            parts.push(...node.tags);
        }
        if ('metadata' in node && node.metadata) {
            parts.push(JSON.stringify(node.metadata));
        }
        return parts.join(' ');
    }
    /**
     * Calculate cosine similarity
     */
    cosineSimilarity(a, b) {
        if (a.length !== b.length) {
            return 0;
        }
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    /**
     * Close connections
     */
    async close() {
        await this.config.vectorDB.close();
        this.nodes.clear();
        this.edges.clear();
    }
}
/**
 * Create graph manager
 */
export function createGraphManager(config) {
    return new GraphManager(config);
}
//# sourceMappingURL=graph-manager.js.map