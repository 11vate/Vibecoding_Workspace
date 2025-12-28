/**
 * Type definitions for Knowledge Graph Builder
 */

export type NodeType = 'atom' | 'pattern' | 'project' | 'decision' | 'layer' | 'tool' | 'doc';

export type EdgeType =
  | 'references'
  | 'contradicts'
  | 'extends'
  | 'implements'
  | 'inspired-by'
  | 'uses'
  | 'contains'
  | 'supports';

export interface Node {
  id: string;
  type: NodeType;
  title: string;
  category: string;
  content: string; // Brief excerpt
  path: string;
  tags: string[];
  created: string;
  lastModified: string;
  outgoingLinks: string[];
  incomingLinks: string[];
  strength: number; // Total connections
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  type: EdgeType;
  context: string;
  strength: number; // 0-1
  bidirectional: boolean;
  created: string;
}

export interface Cluster {
  id: string;
  name: string;
  description: string;
  nodes: string[];
  size: number;
  density: number;
  centralNodes: string[];
  tags: string[];
  averageCreationDate: string;
  mostRecentUpdate: string;
}

export interface ParsedLink {
  text: string; // Original link text
  display?: string; // Custom display text (from [[id|display]])
  type?: EdgeType; // Explicit type from ([[id]] (type))
  context: string; // Surrounding text
  resolvedId?: string; // Resolved node ID
}

export interface GraphBuilderConfig {
  sourceDirectories: string[];
  excludePatterns: string[];
  outputDirectory: string;
  clusterAlgorithm: 'louvain' | 'label-propagation' | 'walktrap';
  minEdgeStrength: number;
  enableSemanticSimilarity: boolean;
  semanticThreshold: number;
  autoResolveAmbiguousLinks: boolean;
  validateGraph: boolean;
  verbose: boolean;
  dryRun: boolean;
}

export interface KnowledgeGraph {
  meta: {
    version: string;
    lastUpdated: string;
    totalNodes: number;
    totalEdges: number;
    nodeTypes: { [key: string]: number };
  };
  nodes: { [id: string]: Node };
  edges: { [id: string]: Edge };
  clusters: Cluster[];
  index: GraphIndex;
  metrics: GraphMetrics;
}

export interface GraphIndex {
  byType: { [type: string]: string[] };
  byTag: { [tag: string]: string[] };
  byCategory: { [category: string]: string[] };
  byYear: { [year: string]: string[] };
  mostConnected: Array<{ id: string; strength: number }>;
  leastConnected: Array<{ id: string; strength: number }>;
  recentlyModified: Array<{ id: string; modified: string }>;
  recentlyCreated: Array<{ id: string; created: string }>;
}

export interface GraphMetrics {
  totalNodes: number;
  totalEdges: number;
  averageDegree: number;
  clusteringCoefficient: number;
  connectedComponents: number;
  diameter: number;
  density: number;
}

export interface GraphHealth {
  orphanPercentage: number;
  averageLinksPerNode: number;
  bidirectionalLinkRatio: number;
  clusterCoverage: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface ValidationReport {
  structuralErrors: string[];
  qualityWarnings: string[];
  brokenLinks: Array<{ from: string; to: string; text: string }>;
  ambiguousLinks: Array<{ link: string; candidates: string[] }>;
  orphanedNodes: string[];
  duplicateEdges: string[];
  isValid: boolean;
}

export interface NodeMetadata {
  title?: string;
  category?: string;
  tags?: string[];
  created?: string;
  lastModified?: string;
}

export interface ClusterMetrics {
  modularity: number;
  avgClusterSize: number;
  largestCluster: { id: string; size: number };
  smallestCluster: { id: string; size: number };
}

export interface BuildResult {
  graph: KnowledgeGraph;
  validation: ValidationReport;
  filesProcessed: number;
  nodesCreated: number;
  edgesCreated: number;
  clustersDetected: number;
  buildTime: number; // milliseconds
  errors: string[];
}
