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
export function createVectorDBClient(config: VectorDBConfig): VectorDBClient {
  switch (config.type) {
    case "chroma":
      return createChromaClient(config);
    case "weaviate":
      return createWeaviateClient(config);
    case "milvus":
      return createMilvusClient(config);
    case "pinecone":
      return createPineconeClient(config);
    case "qdrant":
      return createQdrantClient(config);
    default:
      throw new Error(`Unsupported vector database type: ${config.type}`);
  }
}

/**
 * Chroma client implementation
 */
function createChromaClient(config: VectorDBConfig): VectorDBClient {
  return new ChromaClientImpl(config);
}

/**
 * Chroma client implementation
 */
class ChromaClientImpl implements VectorDBClient {
  private config: VectorDBConfig;
  private client: any; // ChromaClient type
  private collection: any; // Collection type
  private connected = false;

  constructor(config: VectorDBConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Try to import ChromaDB client
      let ChromaClient: any;
      try {
        // Dynamic import to handle missing package gracefully
        const chromadb = await import('chromadb');
        ChromaClient = chromadb.ChromaClient;
      } catch (importError) {
        // If chromadb is not installed, provide helpful error
        throw new Error(
          'ChromaDB client not found. Install it with: npm install chromadb\n' +
          'Or set VECTOR_DB_TYPE to a different database type.'
        );
      }

      // Parse connection string
      const url = new URL(this.config.connectionString);
      
      // Create client based on connection string type
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        this.client = new ChromaClient({
          path: this.config.connectionString
        });
      } else {
        // Assume local path
        this.client = new ChromaClient({
          path: this.config.connectionString
        });
      }

      // Test connection
      await this.client.heartbeat();
      this.connected = true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to connect to Chroma: ${errorMessage}`);
    }
  }

  async createCollection(name: string, dimension: number): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      // Get or create collection
      this.collection = await this.client.getOrCreateCollection({
        name: name || this.config.collectionName || "knowledge_graph",
        metadata: {
          dimension: dimension || this.config.dimension || 1536
        }
      });
    } catch (error) {
      throw new Error(`Failed to create collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async insert(node: KnowledgeNode): Promise<void> {
    if (!this.collection) {
      await this.createCollection(
        this.config.collectionName || "knowledge_graph",
        this.config.dimension || 1536
      );
    }

    try {
      await this.collection.add({
        ids: [node.id],
        embeddings: [node.embedding],
        metadatas: [{
          type: node.type,
          name: node.name || "",
          description: node.description || "",
          tags: node.tags || [],
          ...node.metadata
        }]
      });
    } catch (error) {
      throw new Error(`Failed to insert node: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async insertBatch(nodes: KnowledgeNode[]): Promise<void> {
    if (!this.collection) {
      await this.createCollection(
        this.config.collectionName || "knowledge_graph",
        this.config.dimension || 1536
      );
    }

    try {
      // Batch insert for better performance
      await this.collection.add({
        ids: nodes.map(n => n.id),
        embeddings: nodes.map(n => n.embedding),
        metadatas: nodes.map(n => ({
          type: n.type,
          name: n.name || "",
          description: n.description || "",
          tags: n.tags || [],
          ...n.metadata
        }))
      });
    } catch (error) {
      throw new Error(`Failed to insert batch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async search(query: SemanticQuery): Promise<SearchResult[]> {
    if (!this.collection) {
      throw new Error("Collection not initialized. Call createCollection first.");
    }

    if (!query.embedding || query.embedding.length === 0) {
      throw new Error("Query embedding is required for search");
    }

    try {
      const results = await this.collection.query({
        queryEmbeddings: [query.embedding],
        nResults: query.limit || 10,
        where: query.nodeTypes ? { type: { $in: query.nodeTypes } } : undefined
      });

      return (results.ids[0] || []).map((id: string, index: number) => ({
        node: {
          id,
          type: results.metadatas[0][index]?.type || "unknown",
          name: results.metadatas[0][index]?.name || "",
          description: results.metadatas[0][index]?.description || "",
          tags: results.metadatas[0][index]?.tags || [],
          embedding: results.embeddings[0][index] || [],
          metadata: results.metadatas[0][index] || {}
        },
        similarity: results.distances[0][index] ? 1 - results.distances[0][index] : 0
      }));
    } catch (error) {
      throw new Error(`Failed to search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getById(id: string): Promise<KnowledgeNode | null> {
    if (!this.collection) {
      throw new Error("Collection not initialized. Call createCollection first.");
    }

    try {
      const result = await this.collection.get({ ids: [id] });
      
      if (!result.ids || result.ids.length === 0) {
        return null;
      }

      const metadata = result.metadatas[0] || {};
      return {
        id: result.ids[0],
        type: metadata.type || "unknown",
        name: metadata.name || "",
        description: metadata.description || "",
        tags: metadata.tags || [],
        embedding: result.embeddings[0] || [],
        metadata
      };
    } catch (error) {
      throw new Error(`Failed to get node: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(node: KnowledgeNode): Promise<void> {
    // Chroma doesn't support direct updates, so we delete and re-insert
    await this.delete(node.id);
    await this.insert(node);
  }

  async delete(id: string): Promise<void> {
    if (!this.collection) {
      throw new Error("Collection not initialized. Call createCollection first.");
    }

    try {
      await this.collection.delete({ ids: [id] });
    } catch (error) {
      throw new Error(`Failed to delete node: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async close(): Promise<void> {
    this.connected = false;
    this.collection = null;
    this.client = null;
  }
}

/**
 * Weaviate client implementation
 */
function createWeaviateClient(config: VectorDBConfig): VectorDBClient {
  return new WeaviateClientImpl(config);
}

/**
 * Weaviate client implementation
 */
class WeaviateClientImpl implements VectorDBClient {
  private config: VectorDBConfig;
  private client: any; // WeaviateClient type
  private className: string;
  private connected = false;

  constructor(config: VectorDBConfig) {
    this.config = config;
    this.className = config.collectionName || "KnowledgeNode";
  }

  async connect(): Promise<void> {
    try {
      // Try to import Weaviate client
      let weaviate: any;
      try {
        const weaviateModule = await import('weaviate-ts-client');
        weaviate = weaviateModule.default || weaviateModule;
      } catch (importError) {
        throw new Error(
          'Weaviate client not found. Install it with: npm install weaviate-ts-client\n' +
          'Or set VECTOR_DB_TYPE to a different database type.'
        );
      }

      // Parse connection string
      const url = new URL(this.config.connectionString);
      
      // Create client
      this.client = weaviate.client({
        scheme: url.protocol.replace(':', '') as 'http' | 'https',
        host: url.hostname + (url.port ? `:${url.port}` : ''),
        apiKey: this.config.apiKey ? new weaviate.ApiKey(this.config.apiKey) : undefined
      });

      // Test connection
      await this.client.misc.metaGetter().do();
      this.connected = true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to connect to Weaviate: ${errorMessage}`);
    }
  }

  async createCollection(name: string, dimension: number): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      const className = name || this.className;
      
      // Check if class already exists
      try {
        await this.client.schema.classGetter().withClassName(className).do();
        // Class exists, skip creation
        return;
      } catch {
        // Class doesn't exist, create it
      }

      // Create class schema
      await this.client.schema.classCreator()
        .withClass({
          class: className,
          vectorizer: 'none', // We provide our own vectors
          properties: [
            {
              name: 'type',
              dataType: ['string']
            },
            {
              name: 'name',
              dataType: ['string']
            },
            {
              name: 'description',
              dataType: ['text']
            },
            {
              name: 'tags',
              dataType: ['string[]']
            }
          ],
          vectorIndexType: 'hnsw',
          vectorIndexConfig: {
            distance: 'cosine'
          }
        })
        .do();
    } catch (error) {
      throw new Error(`Failed to create collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async insert(node: KnowledgeNode): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }
    
    // Ensure collection exists
    try {
      await this.client.schema.classGetter().withClassName(this.className).do();
    } catch {
      await this.createCollection(this.className, this.config.dimension || 1536);
    }

    try {
      await this.client.data.creator()
        .withClassName(this.className)
        .withId(node.id)
        .withProperties({
          type: node.type,
          name: node.name || "",
          description: node.description || "",
          tags: node.tags || [],
          ...node.metadata
        })
        .withVector(node.embedding)
        .do();
    } catch (error) {
      throw new Error(`Failed to insert node: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async insertBatch(nodes: KnowledgeNode[]): Promise<void> {
    for (const node of nodes) {
      await this.insert(node);
    }
  }

  async search(query: SemanticQuery): Promise<SearchResult[]> {
    if (!query.embedding || query.embedding.length === 0) {
      throw new Error("Query embedding is required for search");
    }

    try {
      const result = await this.client.graphql
        .get()
        .withClassName(this.className)
        .withFields('type name description tags _additional { id distance }')
        .withNearVector({
          vector: query.embedding,
          certainty: query.threshold || 0.7
        })
        .withLimit(query.limit || 10)
        .do();

      const nodes = result.data.Get[this.className] || [];
      
      return nodes.map((node: any) => ({
        node: {
          id: node._additional.id,
          type: node.type || "unknown",
          name: node.name || "",
          description: node.description || "",
          tags: node.tags || [],
          embedding: [], // Weaviate doesn't return vectors in query
          metadata: {
            type: node.type,
            name: node.name,
            description: node.description,
            tags: node.tags
          }
        },
        similarity: node._additional.distance ? 1 - node._additional.distance : 0
      }));
    } catch (error) {
      throw new Error(`Failed to search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getById(id: string): Promise<KnowledgeNode | null> {
    try {
      const result = await this.client.data.getterById()
        .withId(id)
        .withClassName(this.className)
        .do();

      if (!result) {
        return null;
      }

      return {
        id: result.id,
        type: result.properties.type || "unknown",
        name: result.properties.name || "",
        description: result.properties.description || "",
        tags: result.properties.tags || [],
        embedding: result.vector || [],
        metadata: result.properties
      };
    } catch (error) {
      // Not found returns null
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw new Error(`Failed to get node: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(node: KnowledgeNode): Promise<void> {
    await this.delete(node.id);
    await this.insert(node);
  }

  async delete(id: string): Promise<void> {
    try {
      // In production: await this.client.data.deleter().withId(id).do();
    } catch (error) {
      throw new Error(`Failed to delete node: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async close(): Promise<void> {
    this.connected = false;
    this.client = null;
  }
}

/**
 * Milvus client implementation
 */
function createMilvusClient(config: VectorDBConfig): VectorDBClient {
  // Placeholder - would use @zilliz/milvus2-sdk-node
  throw new Error("Milvus client requires @zilliz/milvus2-sdk-node package");
}

/**
 * Pinecone client implementation
 */
function createPineconeClient(config: VectorDBConfig): VectorDBClient {
  // Placeholder - would use @pinecone-database/pinecone
  throw new Error("Pinecone client requires @pinecone-database/pinecone package");
}

/**
 * Qdrant client implementation
 */
function createQdrantClient(config: VectorDBConfig): VectorDBClient {
  // Placeholder - would use @qdrant/js-client-rest
  throw new Error("Qdrant client requires @qdrant/js-client-rest package");
}

