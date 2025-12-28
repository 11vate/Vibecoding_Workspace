# Knowledge Graph

**Purpose**: Visualize and navigate relationships between all knowledge in the workspace.

**Philosophy**: Knowledge is a network, not a hierarchy. The graph reveals emergent patterns through connections.

---

## What is the Knowledge Graph?

The **Knowledge Graph** is a bidirectional network of all knowledge in the workspace:
- **Nodes**: Individual knowledge units (atoms, patterns, projects, decisions, layers, tools)
- **Edges**: Relationships between nodes (references, contradicts, extends, implements, inspired-by)
- **Clusters**: Auto-detected communities of related nodes

**Example**:
```
[AKU-2025-001: Fusion creates discovery]
    ├─(implements)──→ [PATTERN-FUSION-001]
    ├─(supports)────→ [Layer 2: Player Psychology]
    ├─(extends)─────→ [AKU-2025-002: Discovery requires randomness]
    └─(used-in)─────→ [Project: PixelPets Reborn]
```

---

## Graph Files

### nodes.json
**Purpose**: All knowledge nodes in the graph

**Schema**:
```json
{
  "node-id": {
    "id": "node-id",
    "type": "atom | pattern | project | decision | layer | tool | doc",
    "title": "Human-readable title",
    "category": "mechanics | systems | ux | ...",
    "content": "Brief summary or excerpt",
    "path": "relative/path/to/file.md",
    "tags": ["tag1", "tag2"],
    "created": "2025-01-24",
    "lastModified": "2025-01-24",
    "outgoingLinks": ["target-node-id-1", "target-node-id-2"],
    "incomingLinks": ["source-node-id-1"],
    "strength": 5
  }
}
```

**Node strength**: Number of bidirectional connections (incoming + outgoing)

---

### edges.json
**Purpose**: All relationships between nodes

**Schema**:
```json
{
  "edge-id": {
    "from": "source-node-id",
    "to": "target-node-id",
    "type": "references | contradicts | extends | implements | inspired-by | uses | contains",
    "context": "Brief description of relationship",
    "strength": 0.8,
    "bidirectional": false
  }
}
```

**Edge strength**: 0-1 score based on:
- Explicit vs implicit link (explicit = 1.0, inferred = 0.3-0.7)
- Frequency of co-reference
- Semantic similarity

**Edge types**:
- **references**: General reference
- **contradicts**: Opposing or contradictory idea
- **extends**: Elaborates or builds upon
- **implements**: Concrete implementation of abstract concept
- **inspired-by**: Source of inspiration
- **uses**: Practical application
- **contains**: Hierarchical containment

---

### clusters.json
**Purpose**: Auto-detected communities of related nodes

**Schema**:
```json
{
  "clusters": [
    {
      "id": "cluster-1",
      "name": "Fusion Mechanics Cluster",
      "nodes": ["AKU-2025-001", "AKU-2025-002", "PATTERN-FUSION-001"],
      "size": 12,
      "density": 0.73,
      "centralNodes": ["PATTERN-FUSION-001"],
      "tags": ["fusion", "discovery", "collection"]
    }
  ],
  "algorithmUsed": "Louvain community detection",
  "lastUpdated": "2025-01-24"
}
```

**Cluster density**: Ratio of actual connections to possible connections within cluster

**Central nodes**: Nodes with highest degree centrality within cluster

---

### index.json
**Purpose**: Fast lookup index for graph queries

**Schema**:
```json
{
  "byType": {
    "atom": ["AKU-2025-001", "AKU-2025-002"],
    "pattern": ["PATTERN-FUSION-001"],
    "project": ["PixelPets-Reborn"],
    "layer": ["Layer-1", "Layer-2"]
  },
  "byTag": {
    "fusion": ["AKU-2025-001", "PATTERN-FUSION-001"],
    "discovery": ["AKU-2025-001", "AKU-2025-005"]
  },
  "byCategory": {
    "mechanics": ["AKU-2025-001", "AKU-2025-003"],
    "systems": ["Layer-4", "PATTERN-SYSTEMS-001"]
  },
  "mostConnected": [
    {"id": "Layer-1", "strength": 45},
    {"id": "PATTERN-FUSION-001", "strength": 23}
  ],
  "recentlyModified": [
    {"id": "AKU-2025-043", "modified": "2025-01-24"}
  ]
}
```

---

## Graph Building Process

### Step 1: Node Extraction

**Source files scanned**:
- `knowledge-base/atoms/**/*.md` → atom nodes
- `knowledge-base/mechanics-library.md` → pattern nodes
- `knowledge-base/ui-pattern-library.md` → pattern nodes
- `docs/design-intelligence/**/*.md` → layer nodes
- `docs/projects/**/*.md` → project nodes
- `docs/decisions/**/*.md` → decision nodes
- `tools/**/*.md` → tool nodes

**For each file**:
1. Extract metadata (title, category, tags, dates)
2. Parse `[[wiki-links]]` for outgoing edges
3. Generate unique node ID
4. Add to `nodes.json`

### Step 2: Edge Creation

**From explicit links**:
```markdown
This mechanic [[AKU-2025-001]] (supports) creates engagement.
```
→ Creates edge: `{from: current-node, to: AKU-2025-001, type: supports}`

**From implicit links** (optional):
- Semantic similarity (NLP)
- Tag overlap
- Co-occurrence in documents

### Step 3: Bidirectional Link Discovery

**For each edge**:
1. Check if reverse edge exists
2. If yes, mark both as bidirectional
3. If no, note as unidirectional

**Example**:
```
Node A → [[Node B]] (references)
Node B → [[Node A]] (references)
→ Bidirectional reference
```

### Step 4: Cluster Detection

**Algorithm**: Louvain community detection (or similar)

**Process**:
1. Calculate modularity for all nodes
2. Iteratively group nodes to maximize modularity
3. Identify clusters
4. Name clusters based on most common tags
5. Save to `clusters.json`

### Step 5: Index Generation

**Process**:
1. Group nodes by type, tag, category
2. Rank by connection strength
3. Sort by modification date
4. Save to `index.json`

---

## Graph Visualization

### File: visualizations/graph.html

**Technology**: D3.js force-directed graph

**Features**:
- **Interactive nodes**: Click to see details and backlinks
- **Color coding**:
  - Green: Atoms
  - Blue: Patterns
  - Orange: Projects
  - Purple: Layers
  - Red: Decisions
  - Gray: Tools/Docs
- **Edge thickness**: Represents relationship strength
- **Node size**: Represents connection count
- **Filters**:
  - By node type
  - By tag
  - By cluster
  - By date range
- **Search**: Find nodes by title or content
- **Zoom & Pan**: Navigate large graphs
- **Export**: Save as PNG, SVG, or JSON

### Opening Visualization

```bash
# Open in browser
open knowledge-base/graph/visualizations/graph.html

# Or serve with simple HTTP server
cd knowledge-base/graph/visualizations
python -m http.server 8000
# Navigate to http://localhost:8000/graph.html
```

---

## Using the Knowledge Graph

### Query 1: Find All Related Nodes

**Question**: "What's related to fusion mechanics?"

**Process**:
1. Search `index.json` for tag "fusion"
2. Get node IDs
3. For each node, get outgoing + incoming links
4. Return all connected nodes

**Result**: List of atoms, patterns, projects that reference fusion

### Query 2: Find Path Between Concepts

**Question**: "How is 'cognitive load' related to 'progression systems'?"

**Process**:
1. Find nodes for both concepts
2. Run breadth-first search between them
3. Return shortest path

**Result**:
```
[Cognitive Load Constraint]
  → (constrains) → [Progressive Disclosure Layer]
  → (applies-to) → [Progression Curve Layer]
  → (defines) → [Progression Systems Pattern]
```

### Query 3: Discover Emergent Clusters

**Question**: "What unexpected connections exist?"

**Process**:
1. Load `clusters.json`
2. Find clusters with high density
3. Identify surprising co-members
4. Return insights

**Result**: "Fusion mechanics cluster includes offline-first design (unexpected connection via state management)"

### Query 4: Find Orphans

**Question**: "Which knowledge is isolated?"

**Process**:
1. Load `nodes.json`
2. Filter nodes with strength ≤ 2
3. Return orphaned nodes

**Result**: List of atoms/patterns that need linking

### Query 5: Trace Knowledge Evolution

**Question**: "How has our understanding of 'core loop' evolved?"

**Process**:
1. Find all nodes tagged "core-loop"
2. Sort by creation date
3. Follow branching Folgezettel IDs
4. Return timeline

**Result**: Genealogy of core-loop concept over time

---

## Graph Maintenance

### Automated Updates

**Trigger**: When graph-builder tool runs

**Process**:
1. Scan all markdown files
2. Extract new/modified nodes
3. Update edges
4. Recalculate clusters
5. Regenerate indexes
6. Update visualization data

**Frequency**: On-demand or scheduled (e.g., daily)

### Manual Interventions

**Rare situations**:
- Merge duplicate nodes
- Override auto-detected cluster
- Manually specify edge type
- Deprecate obsolete nodes

**Process**: Edit JSON files, document in `graph-maintenance-log.md`

---

## Graph Metrics

### Node Metrics

**Degree**: Total connections (in + out)
**Betweenness Centrality**: How often node appears on shortest paths
**PageRank**: Importance based on connections from important nodes

**Example**:
```json
{
  "Layer-1": {
    "degree": 45,
    "betweenness": 0.23,
    "pagerank": 0.034
  }
}
```

### Graph Metrics

**Total Nodes**: Count of all nodes
**Total Edges**: Count of all edges
**Average Degree**: Mean connections per node
**Clustering Coefficient**: How interconnected the graph is
**Connected Components**: Number of isolated subgraphs

**Target metrics** (healthy knowledge graph):
- Average degree: ≥ 5
- Clustering coefficient: ≥ 0.3
- Connected components: 1 (fully connected)
- Orphans: < 10%

---

## Integration with Workspace

### With Atomic Knowledge System

Atoms → become nodes
Wiki links → become edges
Folgezettel branches → hierarchical edges

### With Pattern Libraries

Patterns → become nodes
Pattern dependencies → become edges
Cross-references → become edges

### With Design Intelligence Layers

Layers → become nodes
Layer consultations in blueprints → become edges
Layer relationships → become edges

### With Tools

Tools → become nodes
Tool integration with layers/protocols → become edges
Tool usage in projects → become edges

---

## Tools for Graph

### graph-builder
`tools/graph-builder/build-knowledge-graph.ts` - Builds graph from markdown files

### knowledge-navigator
`tools/knowledge-navigator/` - Searches graph using multiple dimensions

### graph-analyzer
`tools/graph-analyzer/` - Computes metrics, finds insights

### graph-visualizer
`knowledge-base/graph/visualizations/graph.html` - Interactive visualization

---

## Best Practices

### DO
- ✅ Use wiki links `[[ID]]` liberally
- ✅ Specify relationship types when meaningful
- ✅ Rebuild graph regularly (daily or weekly)
- ✅ Review clusters for insights
- ✅ Connect orphaned nodes
- ✅ Use graph to discover patterns

### DON'T
- ❌ Edit JSON files manually (use tools)
- ❌ Create links without context
- ❌ Ignore orphaned nodes
- ❌ Over-link (dilutes signal)
- ❌ Under-link (isolates knowledge)
- ❌ Delete nodes (deprecate instead)

---

## Examples

### Example: Fusion Mechanic Subgraph

```
Nodes:
- AKU-2025-001: "Fusion creates discovery"
- AKU-2025-002: "Discovery requires randomness"
- PATTERN-FUSION-001: "Fusion mechanic pattern"
- Layer-2: "Player Psychology"
- PixelPets: "PixelPets Reborn project"

Edges:
- AKU-2025-001 → (extends) → AKU-2025-002
- AKU-2025-001 → (implements) → PATTERN-FUSION-001
- AKU-2025-001 → (supports) → Layer-2
- PATTERN-FUSION-001 → (used-in) → PixelPets
- Layer-2 → (informs) → PATTERN-FUSION-001

Cluster:
- ID: fusion-discovery
- Density: 0.73 (highly connected)
- Central node: PATTERN-FUSION-001
```

---

## Advanced Features

### Temporal Graph Evolution

Track how graph changes over time:
- Snapshot graph weekly
- Compare snapshots to see growth
- Identify trending topics (rapid node/edge creation)
- Detect knowledge decay (stale nodes)

### Semantic Similarity Edges

Use NLP to find implicit connections:
- Calculate embedding similarity between node contents
- Create "semantic-similarity" edges (strength < 1.0)
- Distinguish from explicit wiki-link edges

### Knowledge Gaps Detection

Identify missing knowledge:
- Find high-degree nodes with few outgoing edges (consumers, not producers)
- Find sparse clusters (underdeveloped topics)
- Find unbalanced bidirectional links (one-way knowledge flow)

---

## Success Metrics

Knowledge graph succeeds when:

- ✅ 100+ nodes
- ✅ Average degree ≥ 5
- ✅ Clustering coefficient ≥ 0.3
- ✅ < 10% orphaned nodes
- ✅ Emergent clusters discovered
- ✅ Graph used for research/navigation
- ✅ Visualization provides insights

---

## Next Steps

1. **Initialize graph files**: Create empty `nodes.json`, `edges.json`, `clusters.json`, `index.json`
2. **Build graph builder tool**: `tools/graph-builder/`
3. **Add wiki links to docs**: Enhance existing markdown with `[[links]]`
4. **Run first graph build**: Generate initial graph
5. **Create visualization**: Build D3.js force-directed graph
6. **Integrate with navigator**: Use graph in knowledge navigation

---

**The knowledge graph transforms scattered knowledge into an interconnected web. Navigate it. Discover emergent patterns. Let connections reveal insights you didn't know existed.**

**Build the graph. See the system.**
