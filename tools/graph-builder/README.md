# Knowledge Graph Builder

**Purpose**: Build a complete bidirectional knowledge graph from all workspace markdown files, detecting nodes, edges, and clusters automatically.

**Philosophy**: Knowledge is a network. The graph reveals connections you didn't know existed.

---

## What This Tool Does

The **Graph Builder** scans all markdown files in the workspace and constructs a complete knowledge graph:

**Input**: All markdown files with wiki-style `[[links]]`

**Output**:
- `knowledge-base/graph/nodes.json` - All knowledge nodes
- `knowledge-base/graph/edges.json` - All relationships
- `knowledge-base/graph/clusters.json` - Auto-detected communities
- `knowledge-base/graph/index.json` - Fast lookup index

**Process**:
1. Scan all markdown files in workspace
2. Extract nodes (atoms, patterns, layers, tools, docs)
3. Parse `[[wiki-links]]` to create edges
4. Calculate bidirectional references (backlinks)
5. Detect clusters using community detection
6. Generate indexes for fast lookup
7. Calculate graph metrics

---

## Usage

### Basic Usage

```bash
# Build complete graph from workspace
npm run build-graph

# Build graph from specific directory
npm run build-graph -- --source="../knowledge-base"

# Build and validate
npm run build-graph -- --validate

# Dry run (preview without writing)
npm run build-graph -- --dry-run
```

### Advanced Usage

```bash
# Include semantic similarity edges
npm run build-graph -- --semantic

# Custom cluster detection algorithm
npm run build-graph -- --cluster-algorithm=louvain

# Set minimum edge strength threshold
npm run build-graph -- --min-strength=0.5

# Verbose output
npm run build-graph -- --verbose
```

---

## Tool Components

### 1. build-knowledge-graph.ts
**Purpose**: Main orchestration

**Process**:
1. Scan workspace for markdown files
2. Extract nodes from each file
3. Parse links to create edges
4. Calculate bidirectional links
5. Detect clusters
6. Generate indexes
7. Calculate metrics
8. Write output files

**Key functions**:
```typescript
async function buildGraph(config: GraphBuilderConfig): Promise<KnowledgeGraph>
async function scanWorkspace(): Promise<string[]>
async function extractNodes(files: string[]): Promise<Node[]>
async function buildEdges(nodes: Node[]): Promise<Edge[]>
async function detectClusters(nodes: Node[], edges: Edge[]): Promise<Cluster[]>
```

---

### 2. node-extractor.ts
**Purpose**: Extract knowledge nodes from markdown files

**Node Types**:
- **atom** - Atomic knowledge units (AKU-YYYY-NNN)
- **pattern** - Design patterns
- **project** - Project documentation
- **decision** - Design decisions
- **layer** - DIS layers
- **tool** - Tool documentation
- **doc** - General documentation

**Extraction**:
```typescript
interface Node {
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
  incomingLinks: string[]; // Populated after edge analysis
  strength: number; // Connection count
}
```

**Process**:
1. Read markdown file
2. Extract frontmatter or metadata
3. Extract title (first H1)
4. Extract tags
5. Extract brief summary (first paragraph)
6. Generate unique node ID
7. Parse all `[[wiki-links]]` for outgoing edges

---

### 3. link-parser.ts
**Purpose**: Parse wiki-style links from markdown

**Link Formats Supported**:
```markdown
[[AKU-2025-001]]                           # Simple reference
[[AKU-2025-001]] (supports)                # Typed relationship
[[AKU-2025-001|Display Text]]              # Custom display
[[Layer 1: Experience Pillars]]            # Human-readable reference
```

**Functions**:
```typescript
function parseLinks(markdown: string): ParsedLink[]
function resolveNodeId(linkText: string, nodes: Node[]): string | null
function inferLinkType(context: string): EdgeType
```

**Link Resolution**:
- Direct ID match: `[[AKU-2025-001]]` → `AKU-2025-001`
- Title match: `[[Layer 1]]` → Search nodes for title match
- Fuzzy match: `[[fusion mechanic]]` → Find best match by title similarity

---

### 4. cluster-detector.ts
**Purpose**: Detect communities of related nodes

**Algorithms**:
- **Louvain** (default) - Modularity optimization
- **Label Propagation** - Fast, deterministic
- **Walktrap** - Random walk based

**Process**:
1. Build adjacency matrix from edges
2. Run community detection algorithm
3. Calculate cluster metrics (density, modularity)
4. Identify central nodes (high degree within cluster)
5. Name clusters based on most common tags
6. Return cluster data

**Output**:
```typescript
interface Cluster {
  id: string;
  name: string;
  nodes: string[];
  size: number;
  density: number;
  centralNodes: string[];
  tags: string[];
}
```

---

### 5. graph-metrics.ts
**Purpose**: Calculate graph health and quality metrics

**Node Metrics**:
- **Degree**: Total connections (in + out)
- **Betweenness Centrality**: Bridge node importance
- **PageRank**: Authority based on incoming links
- **Clustering Coefficient**: How interconnected neighbors are

**Graph Metrics**:
- **Total Nodes**: Count of all nodes
- **Total Edges**: Count of all edges
- **Average Degree**: Mean connections per node
- **Density**: Ratio of actual to possible edges
- **Clustering Coefficient**: Overall interconnectedness
- **Connected Components**: Number of isolated subgraphs
- **Diameter**: Longest shortest path

**Health Indicators**:
```typescript
interface GraphHealth {
  orphanPercentage: number;          // < 10% is healthy
  averageLinksPerNode: number;       // > 5 is healthy
  bidirectionalLinkRatio: number;    // > 0.5 is healthy
  clusterCoverage: number;           // > 0.8 is healthy
  status: 'excellent' | 'good' | 'fair' | 'poor';
}
```

---

## Graph Building Process

### Step 1: Scan Workspace

**Directories scanned**:
```
knowledge-base/atoms/**/*.md
knowledge-base/*.md (pattern libraries)
docs/design-intelligence/**/*.md
docs/modes/**/*.md
docs/protocols/**/*.md
docs/prompts/**/*.md
docs/projects/**/*.md
docs/decisions/**/*.md
tools/**/*.md
```

**Files excluded**:
- `node_modules/`
- `.git/`
- `dist/`, `build/`
- Non-markdown files

**Output**: Array of file paths

---

### Step 2: Extract Nodes

**For each file**:
1. Read content
2. Determine node type from path:
   - `atoms/` → atom
   - `design-intelligence/` → layer
   - `tools/` → tool
   - etc.
3. Extract metadata:
   - Title from first `# heading`
   - Tags from `**Tags**: tag1, tag2`
   - Category from `**Category**: mechanics`
   - Dates from file stats or metadata
4. Generate node ID:
   - Atoms: Use AKU-ID from filename
   - Layers: `Layer-N`
   - Patterns: `PATTERN-NAME`
   - Others: Generated from title
5. Parse all `[[links]]` for outgoing edges
6. Add to nodes array

**Output**: Array of Node objects

---

### Step 3: Build Edges

**For each node**:
1. For each outgoing link:
   - Resolve link text to target node ID
   - Infer relationship type from context
   - Calculate edge strength (1.0 for explicit)
   - Create edge object
2. Add to edges array

**Edge Creation**:
```typescript
interface Edge {
  id: string; // `${from}-${to}`
  from: string; // Source node ID
  to: string; // Target node ID
  type: EdgeType; // references, extends, etc.
  context: string; // Surrounding text
  strength: number; // 0-1
  bidirectional: boolean; // Set in next step
}
```

**Output**: Array of Edge objects

---

### Step 4: Calculate Bidirectional Links

**Process**:
1. For each edge A→B:
   - Check if reverse edge B→A exists
   - If yes, mark both as bidirectional
   - Add to node's incomingLinks array
2. Calculate node strength (total links)

**Output**: Nodes with incomingLinks populated

---

### Step 5: Detect Clusters

**Process**:
1. Build adjacency matrix from edges
2. Run Louvain community detection:
   - Initialize: Each node in own community
   - Phase 1: Move nodes to maximize modularity
   - Phase 2: Aggregate communities into super-nodes
   - Repeat until modularity stops increasing
3. Calculate cluster metrics:
   - Density: Ratio of internal to possible edges
   - Central nodes: Highest degree within cluster
   - Common tags: Most frequent tags
4. Name cluster based on tags

**Output**: Array of Cluster objects

---

### Step 6: Generate Indexes

**Indexes created**:

**byType**:
```json
{
  "atom": ["AKU-2025-001", "AKU-2025-002"],
  "layer": ["Layer-1", "Layer-2"],
  ...
}
```

**byTag**:
```json
{
  "fusion": ["AKU-2025-001", "PATTERN-FUSION-001"],
  "discovery": ["AKU-2025-001", "AKU-2025-005"]
}
```

**byCategory**:
```json
{
  "mechanics": ["AKU-2025-001", "PATTERN-FUSION-001"],
  "systems": ["Layer-4", "PATTERN-SYSTEMS-001"]
}
```

**mostConnected**: Top 50 nodes by strength
**recentlyModified**: Last 30 days
**recentlyCreated**: Last 30 days

**Output**: Index object

---

### Step 7: Calculate Metrics

**Node metrics**:
- Calculate degree, betweenness, PageRank for each node

**Graph metrics**:
- Total nodes, edges
- Average degree
- Clustering coefficient
- Diameter
- Connected components

**Health metrics**:
- Orphan percentage
- Bidirectional link ratio
- Cluster coverage
- Overall status

**Output**: Metrics object

---

### Step 8: Write Output

**Files written**:

1. **nodes.json**:
```json
{
  "meta": { ... },
  "nodes": {
    "AKU-2025-001": { id, type, title, ... }
  }
}
```

2. **edges.json**:
```json
{
  "meta": { ... },
  "edges": {
    "edge-001": { from, to, type, ... }
  }
}
```

3. **clusters.json**:
```json
{
  "meta": { ... },
  "clusters": [ { id, name, nodes, ... } ]
}
```

4. **index.json**:
```json
{
  "meta": { ... },
  "byType": { ... },
  "byTag": { ... },
  ...
}
```

---

## Configuration

### graph-config.json

```json
{
  "sourceDirectories": [
    "../knowledge-base",
    "../docs",
    "../tools"
  ],
  "excludePatterns": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**"
  ],
  "outputDirectory": "../knowledge-base/graph",
  "clusterAlgorithm": "louvain",
  "minEdgeStrength": 0.3,
  "enableSemanticSimilarity": false,
  "semanticThreshold": 0.7,
  "autoResolveAmbiguousLinks": true,
  "validateGraph": true,
  "verbose": false
}
```

---

## Link Resolution

### Resolving Wiki Links

**Direct ID match**:
```
[[AKU-2025-001]] → AKU-2025-001 (exact match)
```

**Title match**:
```
[[Layer 1: Experience Pillars]]
→ Search nodes for title="Layer 1: Experience Pillars"
→ Found: Layer-1
```

**Fuzzy match**:
```
[[fusion mechanic]]
→ Search nodes for title containing "fusion" and "mechanic"
→ Candidates: PATTERN-FUSION-001, AKU-2025-001
→ Choose highest title similarity
→ Result: PATTERN-FUSION-001
```

**Ambiguous links**:
```
[[core loop]]
→ Multiple matches: Layer-3, PATTERN-LOOP-001, DOC-core-loop
→ Strategy: Prefer higher node type priority (layer > pattern > doc)
→ Result: Layer-3
→ Log ambiguity warning
```

---

## Cluster Detection

### Louvain Algorithm (Default)

**Advantages**:
- Optimizes modularity
- Hierarchical clustering
- Fast for large graphs
- Good at finding natural communities

**Process**:
1. **Phase 1**: Optimize modularity locally
   - For each node, try moving to neighbor's community
   - Accept move if modularity increases
   - Repeat until no improvement
2. **Phase 2**: Build super-graph
   - Aggregate communities into super-nodes
   - Edge weights = sum of edges between communities
3. **Repeat** phases until convergence

**Output**: Hierarchical cluster structure

**Modularity** = measure of community structure quality (higher = better separation)

---

## Graph Validation

### Validation Checks

**Structural Validation**:
- All edge targets exist as nodes
- All node IDs are unique
- All edges have valid types
- No self-loops (unless intended)
- Bidirectional flags accurate

**Quality Validation**:
- Orphan percentage < threshold
- Average degree > minimum
- Cluster coverage > threshold
- No duplicate edges

**Link Validation**:
- All wiki links resolved
- Ambiguous links logged
- Broken links identified

**Output**: Validation report with errors/warnings

---

## Integration with Workspace

### With Atomic Knowledge System

Atoms automatically become nodes:
- Atom files scanned from `knowledge-base/atoms/`
- AKU-IDs used as node IDs
- Folgezettel structure preserved in graph
- Atom links become edges

### With Knowledge Atomizer

Run after atomization:
```bash
# 1. Atomize patterns
cd tools/knowledge-atomizer
npm run atomize -- --source="../../knowledge-base/mechanics-library.md"

# 2. Build graph
cd ../graph-builder
npm run build-graph

# Result: Atoms appear in graph with links
```

### With Design Intelligence Layers

Layers become high-authority nodes:
- Each layer = node (Layer-1, Layer-2, etc.)
- References in blueprints = edges to layers
- Layers form central hub in graph

### With Tools

Tools become nodes:
- Tool READMEs scanned
- Tool integrations = edges
- Tools cluster around functionality

---

## Output Examples

### Example: Node

```json
{
  "AKU-2025-001": {
    "id": "AKU-2025-001",
    "type": "atom",
    "title": "Fusion creates discovery moments",
    "category": "mechanics",
    "content": "Fusion mechanics create engagement through discovery when players...",
    "path": "knowledge-base/atoms/mechanics/AKU-2025-001.md",
    "tags": ["fusion", "discovery", "engagement"],
    "created": "2025-01-24",
    "lastModified": "2025-01-24",
    "outgoingLinks": ["AKU-2025-001a", "AKU-2025-002", "Layer-2"],
    "incomingLinks": ["AKU-2025-003", "PATTERN-FUSION-001"],
    "strength": 5
  }
}
```

### Example: Edge

```json
{
  "AKU-2025-001-AKU-2025-001a": {
    "id": "AKU-2025-001-AKU-2025-001a",
    "from": "AKU-2025-001",
    "to": "AKU-2025-001a",
    "type": "extends",
    "context": "Discovery requires controlled randomness",
    "strength": 1.0,
    "bidirectional": true,
    "created": "2025-01-24"
  }
}
```

### Example: Cluster

```json
{
  "id": "cluster-fusion-mechanics",
  "name": "Fusion Mechanics Cluster",
  "nodes": ["AKU-2025-001", "AKU-2025-001a", "PATTERN-FUSION-001", "Layer-2"],
  "size": 12,
  "density": 0.73,
  "centralNodes": ["PATTERN-FUSION-001"],
  "tags": ["fusion", "discovery", "collection", "mechanics"]
}
```

---

## Best Practices

### DO
- ✅ Run graph builder after significant changes
- ✅ Add `[[wiki-links]]` liberally in documentation
- ✅ Use consistent node naming conventions
- ✅ Review validation warnings
- ✅ Check cluster quality (density > 0.3)
- ✅ Monitor graph health metrics

### DON'T
- ❌ Edit graph JSON files manually (use tools)
- ❌ Create links to non-existent nodes
- ❌ Ignore orphaned nodes
- ❌ Skip validation checks
- ❌ Over-link (dilutes signal)
- ❌ Create circular dependencies unintentionally

---

## Troubleshooting

### Issue: Broken links detected

**Cause**: `[[link]]` references non-existent node

**Solution**:
1. Check validation report for broken links
2. Either create the target node or fix the link
3. Rebuild graph

### Issue: Too many orphans (> 10%)

**Cause**: Nodes with no connections

**Solution**:
1. Review orphan list in index.json
2. Add `[[links]]` to connect orphans
3. Consider if orphans should be deleted

### Issue: Clusters too small or fragmented

**Cause**: Weak interconnections

**Solution**:
1. Add more cross-references between related topics
2. Use auto-linking in atomizer
3. Try different cluster algorithm

### Issue: Ambiguous link warnings

**Cause**: Multiple nodes match link text

**Solution**:
1. Use explicit IDs in links: `[[AKU-2025-001]]`
2. Or use unique titles
3. Review ambiguity log and clarify

---

## Performance

### Optimization for Large Graphs

**For 1000+ nodes**:
- Use incremental updates (only changed files)
- Enable parallel processing
- Cache similarity calculations
- Use sparse matrix for cluster detection

**For 10,000+ nodes**:
- Split into subgraphs by directory
- Use approximate algorithms
- Sample for quality metrics

---

## Success Metrics

Graph builder succeeds when:

- ✅ All markdown files scanned successfully
- ✅ 95%+ wiki links resolved
- ✅ < 5% ambiguous links
- ✅ < 10% orphaned nodes
- ✅ Average degree > 5
- ✅ Clustering coefficient > 0.3
- ✅ Graph validates without errors
- ✅ Clusters are meaningful (manually verified)

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Build graph**: `npm run build-graph`
3. **Review output**: Check `knowledge-base/graph/*.json`
4. **Fix broken links**: Address validation warnings
5. **Iterate**: Add more links, rebuild graph
6. **Visualize**: Use graph visualization tool

---

**The graph builder transforms scattered knowledge into an interconnected web. Build it. Query it. Discover emergent patterns.**

**Build the graph. See the connections.**
