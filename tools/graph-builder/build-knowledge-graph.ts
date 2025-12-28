/**
 * Knowledge Graph Builder - Main Orchestration
 *
 * Builds complete knowledge graph from workspace markdown files
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import {
  Node,
  Edge,
  Cluster,
  KnowledgeGraph,
  GraphBuilderConfig,
  BuildResult,
  ValidationReport,
  NodeType,
  EdgeType
} from './types';
import { parseLinks, resolveNodeId } from './link-parser';

/**
 * Default configuration
 */
const DEFAULT_CONFIG: GraphBuilderConfig = {
  sourceDirectories: [
    '../../knowledge-base',
    '../../docs',
    '../../tools'
  ],
  excludePatterns: [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**'
  ],
  outputDirectory: '../../knowledge-base/graph',
  clusterAlgorithm: 'louvain',
  minEdgeStrength: 0.3,
  enableSemanticSimilarity: false,
  semanticThreshold: 0.7,
  autoResolveAmbiguousLinks: true,
  validateGraph: true,
  verbose: false,
  dryRun: false
};

/**
 * Build complete knowledge graph
 */
export async function buildGraph(
  config: Partial<GraphBuilderConfig> = {}
): Promise<BuildResult> {
  const fullConfig: GraphBuilderConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();

  console.log('\n🔨 Building Knowledge Graph...\n');

  const result: BuildResult = {
    graph: {
      meta: {
        version: '1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        totalNodes: 0,
        totalEdges: 0,
        nodeTypes: {}
      },
      nodes: {},
      edges: {},
      clusters: [],
      index: {
        byType: {},
        byTag: {},
        byCategory: {},
        byYear: {},
        mostConnected: [],
        leastConnected: [],
        recentlyModified: [],
        recentlyCreated: []
      },
      metrics: {
        totalNodes: 0,
        totalEdges: 0,
        averageDegree: 0,
        clusteringCoefficient: 0,
        connectedComponents: 0,
        diameter: 0,
        density: 0
      }
    },
    validation: {
      structuralErrors: [],
      qualityWarnings: [],
      brokenLinks: [],
      ambiguousLinks: [],
      orphanedNodes: [],
      duplicateEdges: [],
      isValid: true
    },
    filesProcessed: 0,
    nodesCreated: 0,
    edgesCreated: 0,
    clustersDetected: 0,
    buildTime: 0,
    errors: []
  };

  try {
    // Step 1: Scan workspace
    console.log('📂 Scanning workspace...');
    const files = await scanWorkspace(fullConfig);
    result.filesProcessed = files.length;
    console.log(`   Found ${files.length} markdown files\n`);

    // Step 2: Extract nodes
    console.log('🔍 Extracting nodes...');
    const nodes = await extractNodes(files, fullConfig);
    result.nodesCreated = nodes.length;
    console.log(`   Created ${nodes.length} nodes\n`);

    // Add nodes to graph
    nodes.forEach(node => {
      result.graph.nodes[node.id] = node;
    });

    // Step 3: Build edges
    console.log('🔗 Building edges...');
    const edges = buildEdges(nodes, fullConfig);
    result.edgesCreated = edges.length;
    console.log(`   Created ${edges.length} edges\n`);

    // Add edges to graph
    edges.forEach(edge => {
      result.graph.edges[edge.id] = edge;
    });

    // Step 4: Calculate bidirectional links
    console.log('↔️  Calculating bidirectional links...');
    calculateBidirectionalLinks(result.graph);
    console.log(`   Updated incoming links\n`);

    // Step 5: Detect clusters
    console.log('🎯 Detecting clusters...');
    result.graph.clusters = detectClusters(result.graph, fullConfig);
    result.clustersDetected = result.graph.clusters.length;
    console.log(`   Found ${result.clustersDetected} clusters\n`);

    // Step 6: Generate indexes
    console.log('📇 Generating indexes...');
    generateIndexes(result.graph);
    console.log(`   Indexes created\n`);

    // Step 7: Calculate metrics
    console.log('📊 Calculating metrics...');
    calculateMetrics(result.graph);
    console.log(`   Metrics calculated\n`);

    // Step 8: Validate
    if (fullConfig.validateGraph) {
      console.log('✅ Validating graph...');
      result.validation = validateGraph(result.graph);
      console.log(`   Validation ${result.validation.isValid ? 'passed' : 'failed'}\n`);
    }

    // Step 9: Write output
    if (!fullConfig.dryRun) {
      console.log('💾 Writing output files...');
      await writeGraph(result.graph, fullConfig.outputDirectory);
      console.log(`   Files written to ${fullConfig.outputDirectory}\n`);
    } else {
      console.log('⚠️  Dry run mode - no files written\n');
    }

    result.buildTime = Date.now() - startTime;

    // Print summary
    printSummary(result);

    return result;

  } catch (error) {
    result.errors.push(`Graph build failed: ${error.message}`);
    console.error(`\n❌ Error: ${error.message}`);
    return result;
  }
}

/**
 * Scan workspace for markdown files
 */
async function scanWorkspace(config: GraphBuilderConfig): Promise<string[]> {
  const allFiles: string[] = [];

  for (const dir of config.sourceDirectories) {
    const pattern = path.join(__dirname, dir, '**/*.md');
    const files = glob.sync(pattern, {
      ignore: config.excludePatterns.map(p => path.join(__dirname, dir, p))
    });
    allFiles.push(...files);
  }

  return allFiles;
}

/**
 * Extract nodes from files
 */
async function extractNodes(
  files: string[],
  config: GraphBuilderConfig
): Promise<Node[]> {
  const nodes: Node[] = [];

  for (const file of files) {
    try {
      const node = extractNodeFromFile(file);
      if (node) {
        nodes.push(node);
      }
    } catch (error) {
      if (config.verbose) {
        console.warn(`   Warning: Failed to extract node from ${file}: ${error.message}`);
      }
    }
  }

  return nodes;
}

/**
 * Extract node from single file
 */
function extractNodeFromFile(filePath: string): Node | null {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Determine node type from path
  const type = inferNodeType(filePath);

  // Extract metadata
  const title = extractTitle(content);
  if (!title) return null;

  const category = extractCategory(content);
  const tags = extractTags(content);
  const id = generateNodeId(filePath, title, type);

  // Extract brief content (first paragraph)
  const briefContent = extractBriefContent(content);

  // Get file stats
  const stats = fs.statSync(filePath);
  const created = stats.birthtime.toISOString().split('T')[0];
  const lastModified = stats.mtime.toISOString().split('T')[0];

  // Parse outgoing links
  const outgoingLinks = parseLinks(content).map(link => link.text);

  return {
    id,
    type,
    title,
    category: category || 'general',
    content: briefContent,
    path: path.relative(path.join(__dirname, '../..'), filePath),
    tags: tags || [],
    created,
    lastModified,
    outgoingLinks,
    incomingLinks: [], // Populated later
    strength: 0 // Calculated later
  };
}

/**
 * Infer node type from file path
 */
function inferNodeType(filePath: string): NodeType {
  if (filePath.includes('atoms/')) return 'atom';
  if (filePath.includes('design-intelligence/')) return 'layer';
  if (filePath.includes('tools/')) return 'tool';
  if (filePath.includes('projects/')) return 'project';
  if (filePath.includes('decisions/')) return 'decision';
  if (filePath.includes('mechanics-library') || filePath.includes('ui-pattern-library')) {
    return 'pattern';
  }
  return 'doc';
}

/**
 * Generate unique node ID
 */
function generateNodeId(filePath: string, title: string, type: NodeType): string {
  // For atoms, use AKU-ID from filename
  if (type === 'atom') {
    const match = filePath.match(/AKU-\d{4}-\d{3}[a-z0-9]*/);
    if (match) return match[0];
  }

  // For layers, use Layer-N
  if (type === 'layer') {
    const match = filePath.match(/layer-(\d+)/i);
    if (match) return `Layer-${match[1]}`;
  }

  // For tools, use tool directory name
  if (type === 'tool') {
    const match = filePath.match(/tools\/([^/]+)/);
    if (match) return `TOOL-${match[1].toUpperCase()}`;
  }

  // For others, generate from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  return `${type.toUpperCase()}-${slug}`;
}

/**
 * Extract title from markdown
 */
function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract category from markdown
 */
function extractCategory(content: string): string | null {
  const match = content.match(/\*\*Category\*\*:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract tags from markdown
 */
function extractTags(content: string): string[] | null {
  const match = content.match(/\*\*Tags?\*\*:\s*(.+)$/m);
  if (!match) return null;

  return match[1].split(/,\s*/).map(t => t.trim());
}

/**
 * Extract brief content (first paragraph)
 */
function extractBriefContent(content: string): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---\n.*?\n---\n/s, '');

  // Get first paragraph after title
  const paragraphs = withoutFrontmatter.split('\n\n');
  for (const para of paragraphs) {
    if (!para.startsWith('#') && para.trim().length > 50) {
      return para.trim().slice(0, 200) + (para.length > 200 ? '...' : '');
    }
  }

  return '';
}

/**
 * Build edges from nodes
 */
function buildEdges(nodes: Node[], config: GraphBuilderConfig): Edge[] {
  const edges: Edge[] = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  for (const node of nodes) {
    const content = fs.readFileSync(path.join(__dirname, '../..', node.path), 'utf-8');
    const links = parseLinks(content);

    for (const link of links) {
      const targetId = resolveNodeId(link.text, nodes);

      if (targetId && nodeMap.has(targetId)) {
        const edgeId = `${node.id}-${targetId}`;

        edges.push({
          id: edgeId,
          from: node.id,
          to: targetId,
          type: link.type || 'references',
          context: link.context,
          strength: 1.0,
          bidirectional: false,
          created: node.created
        });
      }
    }
  }

  return edges;
}

/**
 * Calculate bidirectional links and update node strengths
 */
function calculateBidirectionalLinks(graph: KnowledgeGraph): void {
  const edgeMap = new Map<string, Edge>();

  // Build edge map
  Object.values(graph.edges).forEach(edge => {
    edgeMap.set(`${edge.from}-${edge.to}`, edge);
  });

  // Check for reverse edges and populate incoming links
  Object.values(graph.edges).forEach(edge => {
    const reverseKey = `${edge.to}-${edge.from}`;
    if (edgeMap.has(reverseKey)) {
      edge.bidirectional = true;
      edgeMap.get(reverseKey)!.bidirectional = true;
    }

    // Add to target's incoming links
    if (graph.nodes[edge.to]) {
      if (!graph.nodes[edge.to].incomingLinks.includes(edge.from)) {
        graph.nodes[edge.to].incomingLinks.push(edge.from);
      }
    }
  });

  // Calculate node strength
  Object.values(graph.nodes).forEach(node => {
    node.strength = node.outgoingLinks.length + node.incomingLinks.length;
  });
}

/**
 * Simple cluster detection (placeholder - can be enhanced with Louvain)
 */
function detectClusters(graph: KnowledgeGraph, config: GraphBuilderConfig): Cluster[] {
  // Simple clustering by tag similarity
  const tagGroups = new Map<string, Set<string>>();

  Object.values(graph.nodes).forEach(node => {
    node.tags.forEach(tag => {
      if (!tagGroups.has(tag)) {
        tagGroups.set(tag, new Set());
      }
      tagGroups.get(tag)!.add(node.id);
    });
  });

  const clusters: Cluster[] = [];
  let clusterId = 1;

  tagGroups.forEach((nodeIds, tag) => {
    if (nodeIds.size >= 3) { // Minimum cluster size
      const nodes = Array.from(nodeIds);

      clusters.push({
        id: `cluster-${clusterId++}`,
        name: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Cluster`,
        description: `Nodes tagged with "${tag}"`,
        nodes,
        size: nodes.length,
        density: 0.5, // Placeholder
        centralNodes: nodes.slice(0, 3),
        tags: [tag],
        averageCreationDate: new Date().toISOString().split('T')[0],
        mostRecentUpdate: new Date().toISOString().split('T')[0]
      });
    }
  });

  return clusters;
}

/**
 * Generate indexes
 */
function generateIndexes(graph: KnowledgeGraph): void {
  const index = graph.index;

  // By type
  Object.values(graph.nodes).forEach(node => {
    if (!index.byType[node.type]) {
      index.byType[node.type] = [];
    }
    index.byType[node.type].push(node.id);
  });

  // By tag
  Object.values(graph.nodes).forEach(node => {
    node.tags.forEach(tag => {
      if (!index.byTag[tag]) {
        index.byTag[tag] = [];
      }
      index.byTag[tag].push(node.id);
    });
  });

  // By category
  Object.values(graph.nodes).forEach(node => {
    if (!index.byCategory[node.category]) {
      index.byCategory[node.category] = [];
    }
    index.byCategory[node.category].push(node.id);
  });

  // By year
  Object.values(graph.nodes).forEach(node => {
    const year = node.created.split('-')[0];
    if (!index.byYear[year]) {
      index.byYear[year] = [];
    }
    index.byYear[year].push(node.id);
  });

  // Most/least connected
  const sortedByStrength = Object.values(graph.nodes)
    .sort((a, b) => b.strength - a.strength);

  index.mostConnected = sortedByStrength.slice(0, 50)
    .map(n => ({ id: n.id, strength: n.strength }));

  index.leastConnected = sortedByStrength.slice(-50)
    .map(n => ({ id: n.id, strength: n.strength }));

  // Recently modified/created
  const sortedByModified = Object.values(graph.nodes)
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified));

  index.recentlyModified = sortedByModified.slice(0, 30)
    .map(n => ({ id: n.id, modified: n.lastModified }));

  const sortedByCreated = Object.values(graph.nodes)
    .sort((a, b) => b.created.localeCompare(a.created));

  index.recentlyCreated = sortedByCreated.slice(0, 30)
    .map(n => ({ id: n.id, created: n.created }));
}

/**
 * Calculate graph metrics
 */
function calculateMetrics(graph: KnowledgeGraph): void {
  const metrics = graph.metrics;

  metrics.totalNodes = Object.keys(graph.nodes).length;
  metrics.totalEdges = Object.keys(graph.edges).length;

  if (metrics.totalNodes > 0) {
    metrics.averageDegree = Object.values(graph.nodes)
      .reduce((sum, n) => sum + n.strength, 0) / metrics.totalNodes;

    const maxPossibleEdges = metrics.totalNodes * (metrics.totalNodes - 1);
    metrics.density = maxPossibleEdges > 0 ? metrics.totalEdges / maxPossibleEdges : 0;
  }

  // Update meta
  graph.meta.totalNodes = metrics.totalNodes;
  graph.meta.totalEdges = metrics.totalEdges;

  const typeCounts: { [key: string]: number } = {};
  Object.values(graph.nodes).forEach(node => {
    typeCounts[node.type] = (typeCounts[node.type] || 0) + 1;
  });
  graph.meta.nodeTypes = typeCounts;
}

/**
 * Validate graph
 */
function validateGraph(graph: KnowledgeGraph): ValidationReport {
  const report: ValidationReport = {
    structuralErrors: [],
    qualityWarnings: [],
    brokenLinks: [],
    ambiguousLinks: [],
    orphanedNodes: [],
    duplicateEdges: [],
    isValid: true
  };

  // Check for orphaned nodes
  Object.values(graph.nodes).forEach(node => {
    if (node.strength === 0) {
      report.orphanedNodes.push(node.id);
    }
  });

  if (report.orphanedNodes.length > 0) {
    report.qualityWarnings.push(`${report.orphanedNodes.length} orphaned nodes found`);
  }

  // Check for broken links
  Object.values(graph.edges).forEach(edge => {
    if (!graph.nodes[edge.to]) {
      report.brokenLinks.push({
        from: edge.from,
        to: edge.to,
        text: edge.to
      });
    }
  });

  if (report.brokenLinks.length > 0) {
    report.structuralErrors.push(`${report.brokenLinks.length} broken links found`);
    report.isValid = false;
  }

  return report;
}

/**
 * Write graph to files
 */
async function writeGraph(graph: KnowledgeGraph, outputDir: string): Promise<void> {
  const fullOutputDir = path.join(__dirname, outputDir);

  if (!fs.existsSync(fullOutputDir)) {
    fs.mkdirSync(fullOutputDir, { recursive: true });
  }

  // Write nodes.json
  fs.writeFileSync(
    path.join(fullOutputDir, 'nodes.json'),
    JSON.stringify({ meta: graph.meta, nodes: graph.nodes }, null, 2),
    'utf-8'
  );

  // Write edges.json
  fs.writeFileSync(
    path.join(fullOutputDir, 'edges.json'),
    JSON.stringify({ meta: graph.meta, edges: graph.edges }, null, 2),
    'utf-8'
  );

  // Write clusters.json
  fs.writeFileSync(
    path.join(fullOutputDir, 'clusters.json'),
    JSON.stringify({ meta: graph.meta, clusters: graph.clusters }, null, 2),
    'utf-8'
  );

  // Write index.json
  fs.writeFileSync(
    path.join(fullOutputDir, 'index.json'),
    JSON.stringify({ meta: graph.meta, ...graph.index, metrics: graph.metrics }, null, 2),
    'utf-8'
  );
}

/**
 * Print summary
 */
function printSummary(result: BuildResult): void {
  console.log('\n' + '='.repeat(50));
  console.log('Graph Build Complete');
  console.log('='.repeat(50));
  console.log(`Files processed: ${result.filesProcessed}`);
  console.log(`Nodes created: ${result.nodesCreated}`);
  console.log(`Edges created: ${result.edgesCreated}`);
  console.log(`Clusters detected: ${result.clustersDetected}`);
  console.log(`Build time: ${result.buildTime}ms`);

  if (result.validation.orphanedNodes.length > 0) {
    console.log(`\n⚠️  ${result.validation.orphanedNodes.length} orphaned nodes`);
  }

  if (result.validation.brokenLinks.length > 0) {
    console.log(`❌ ${result.validation.brokenLinks.length} broken links`);
  }

  if (result.validation.isValid) {
    console.log(`\n✅ Graph validation passed`);
  } else {
    console.log(`\n❌ Graph validation failed`);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');

  buildGraph({ dryRun, verbose })
    .then(result => {
      process.exit(result.validation.isValid ? 0 : 1);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
