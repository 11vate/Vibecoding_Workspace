# Knowledge Atomizer Tool

**Purpose**: Break existing patterns and documents into atomic knowledge units (AKUs) using the Zettelkasten method with Folgezettel branching.

**Philosophy**: Knowledge locked in monolithic documents is hard to recombine. Atomized knowledge enables emergent pattern discovery.

---

## What This Tool Does

The **Knowledge Atomizer** takes existing pattern library entries and systematically breaks them into atomic concepts:

**Input**: Monolithic pattern document (e.g., `mechanics-library.md`)

**Output**:
- Multiple atomic knowledge units (one idea per file)
- Folgezettel-branched IDs creating conceptual hierarchy
- Bidirectional wiki-style links between atoms
- Updated atom-registry.json

**Example**:
```
Input: "Fusion Mechanic" pattern (1500 words, 8 concepts)

Output:
- AKU-2025-001: "Fusion creates discovery moments"
- AKU-2025-001a: "Discovery requires controlled randomness"
- AKU-2025-001a1: "Too much randomness = frustration"
- AKU-2025-001a2: "Too little randomness = boredom"
- AKU-2025-001b: "Fusion enables emergent gameplay"
- AKU-2025-001c: "Fusion balances complexity vs accessibility"
- AKU-2025-002: "Collection mechanics benefit from fusion"
- AKU-2025-003: "Fusion requires visible progression"
```

---

## Usage

### Basic Usage

```bash
# Atomize a single pattern
node atomize.ts --source="../knowledge-base/mechanics-library.md" --pattern="Fusion Mechanic"

# Atomize all patterns in a file
node atomize.ts --source="../knowledge-base/mechanics-library.md" --all

# Atomize with custom category
node atomize.ts --source="../knowledge-base/ui-pattern-library.md" --pattern="Progressive Disclosure" --category="principles"

# Dry run (preview without creating files)
node atomize.ts --source="../knowledge-base/mechanics-library.md" --pattern="Fusion Mechanic" --dry-run
```

### Advanced Usage

```bash
# Atomize and auto-link related atoms
node atomize.ts --source="../knowledge-base/mechanics-library.md" --all --auto-link

# Atomize with minimum granularity (smaller atoms)
node atomize.ts --source="..." --granularity=fine

# Atomize with custom starting ID
node atomize.ts --source="..." --start-id="AKU-2025-050"
```

---

## Tool Components

### 1. atomize.ts
**Purpose**: Main atomization orchestration

**Process**:
1. Parse source document
2. Extract pattern entries
3. For each pattern:
   - Identify core concepts (extraction-rules.ts)
   - Generate Folgezettel IDs (folgezettel.ts)
   - Create atom files (atom-templates.ts)
   - Establish links between atoms
   - Update atom-registry.json
4. Report results

**Key functions**:
```typescript
async function atomizePattern(pattern: Pattern): Promise<Atom[]>
async function atomizeDocument(sourcePath: string): Promise<AtomizationResult>
function extractConcepts(patternText: string): Concept[]
function linkAtoms(atoms: Atom[]): void
```

---

### 2. folgezettel.ts
**Purpose**: ID generation and Folgezettel hierarchy management

**Folgezettel Logic**:
- Root concept: `AKU-2025-001`
- Related but distinct: `AKU-2025-001a`, `AKU-2025-001b`
- Elaboration: `AKU-2025-001a1`, `AKU-2025-001a2`
- Alternative elaboration: `AKU-2025-001a2a`, `AKU-2025-001a2b`

**Key functions**:
```typescript
function getNextRootId(): string
function branchId(parentId: string, branchType: 'related' | 'elaboration'): string
function parseId(id: string): { year: number, sequence: number, branches: string }
function validateId(id: string): boolean
```

**Branching Strategy**:
```typescript
interface BranchingDecision {
  parentId: string;
  childConcept: Concept;
  relationship: 'related' | 'elaboration' | 'alternative';
  branchId: string; // e.g., 'a', 'a1', 'a2b'
}

function decideBranch(parent: Concept, child: Concept): BranchingDecision
```

---

### 3. atom-templates.ts
**Purpose**: Generate atom markdown files from concepts

**Template Functions**:
```typescript
function generateAtom(concept: Concept, metadata: AtomMetadata): string
function fillTemplate(template: string, data: AtomData): string
function formatCoreIdea(concept: Concept): string
function formatEvidence(concept: Concept): string
function formatImplications(concept: Concept): string
function formatLinks(relatedAtoms: Atom[]): string
```

**Output Format**: Follows `knowledge-base/atoms/_TEMPLATE.md` structure

---

### 4. extraction-rules.ts
**Purpose**: Rules for identifying atomic concepts within patterns

**Extraction Rules**:

**Rule 1: Explicit Sections**
```typescript
// If pattern has clear sections, each section = potential atom
const sectionMarkers = [
  '## Core Concept',
  '## How It Works',
  '## When To Use',
  '## Constraints',
  '## Examples'
];
```

**Rule 2: Conceptual Boundaries**
```typescript
// Identify concept boundaries by markers:
const conceptBoundaries = [
  'However,',          // Contradictory idea
  'Additionally,',     // New related idea
  'In contrast,',      // Alternative perspective
  'This enables',      // Implication or consequence
  'For example,',      // Concrete instance
];
```

**Rule 3: Granularity Levels**
```typescript
enum Granularity {
  COARSE,   // Each major section = atom (fewer, larger atoms)
  MEDIUM,   // Subsections = atoms (balanced)
  FINE      // Paragraphs = atoms (many, smaller atoms)
}
```

**Rule 4: Minimum Atom Size**
```typescript
// Atom must contain:
const minimumAtomRequirements = {
  minWords: 30,           // At least 30 words
  maxWords: 300,          // At most 300 words
  requiresCoreIdea: true, // Must express complete thought
  requiresEvidence: true  // Must include rationale
};
```

**Rule 5: Link Detection**
```typescript
// Detect implicit links between concepts
function detectLinks(concept1: Concept, concept2: Concept): LinkType | null {
  if (isContradictory(concept1, concept2)) return 'contradicts';
  if (isElaboration(concept1, concept2)) return 'extends';
  if (isExample(concept1, concept2)) return 'implements';
  if (isPrerequisite(concept1, concept2)) return 'requires';
  return null;
}
```

---

## Atomization Process

### Step 1: Parse Source Document

**Input**: Path to markdown file containing patterns

**Process**:
1. Read file contents
2. Split by pattern delimiters (typically `## Pattern Name`)
3. Extract pattern metadata (name, category, tags)
4. Parse pattern body into structured sections

**Output**: Array of `Pattern` objects

```typescript
interface Pattern {
  name: string;
  category: string;
  tags: string[];
  sections: {
    title: string;
    content: string;
  }[];
  rawText: string;
}
```

---

### Step 2: Extract Concepts

**Input**: Pattern object

**Process**:
1. Apply extraction rules (extraction-rules.ts)
2. Identify atomic concepts within pattern
3. Determine conceptual relationships
4. Assign granularity level

**Output**: Array of `Concept` objects

```typescript
interface Concept {
  id: string; // Temporary, assigned in next step
  title: string;
  coreIdea: string;
  context: string;
  evidence: string;
  implications: string;
  sourcePattern: string;
  relatedConcepts: string[]; // Temporary IDs
}
```

---

### Step 3: Generate Folgezettel IDs

**Input**: Array of concepts with relationships

**Process**:
1. Identify root concept (most central or first)
2. Assign root ID: `AKU-YYYY-NNN`
3. For each related concept:
   - Determine relationship type (related/elaboration)
   - Generate branch ID (a, b, c or 1, 2, 3)
   - Recursively assign IDs to sub-concepts
4. Build ID hierarchy tree

**Output**: Concepts with final IDs assigned

---

### Step 4: Create Atom Files

**Input**: Concepts with IDs

**Process**:
1. For each concept:
   - Fill atom template (atom-templates.ts)
   - Determine category directory
   - Write to `knowledge-base/atoms/{category}/{ID}.md`
2. Replace temporary link IDs with final IDs
3. Add wiki-style links between related atoms

**Output**: Markdown files in atoms directory

---

### Step 5: Update Registry

**Input**: Created atoms

**Process**:
1. Load `atom-registry.json`
2. For each atom:
   - Add entry with metadata
   - Update index by category
   - Update index by tag
   - Update statistics
3. Save updated registry

**Output**: Updated `atom-registry.json`

---

### Step 6: Report Results

**Output**: Summary report

```
Atomization Complete
====================
Source: knowledge-base/mechanics-library.md
Pattern: Fusion Mechanic

Atoms Created: 8
- AKU-2025-001: Fusion creates discovery moments
- AKU-2025-001a: Discovery requires controlled randomness
- AKU-2025-001a1: Too much randomness = frustration
- AKU-2025-001a2: Too little randomness = boredom
- AKU-2025-001b: Fusion enables emergent gameplay
- AKU-2025-001c: Fusion balances complexity vs accessibility
- AKU-2025-002: Collection mechanics benefit from fusion
- AKU-2025-003: Fusion requires visible progression

Links Created: 12 bidirectional links

Registry Updated: 8 new entries
Categories: mechanics (8)
Tags: fusion (8), discovery (3), emergence (2), balance (2)
```

---

## Configuration

### atomizer-config.json

```json
{
  "granularity": "medium",
  "minWordsPerAtom": 30,
  "maxWordsPerAtom": 300,
  "autoLink": true,
  "autoLinkThreshold": 0.7,
  "branchingStrategy": "semantic",
  "outputDirectory": "../knowledge-base/atoms",
  "registryPath": "../knowledge-base/atoms/atom-registry.json",
  "preserveOriginals": true,
  "dryRun": false
}
```

---

## Examples

### Example 1: Atomizing Fusion Mechanic

**Source** (`mechanics-library.md`):
```markdown
## Fusion Mechanic

Fusion mechanics allow players to combine items to create new items.
This creates discovery moments and emergent gameplay.

### Core Concept

Fusion creates engagement through:
1. Discovery (unexpected results)
2. Experimentation (trying combinations)
3. Collection completion (gotta fuse 'em all)

### Balance Considerations

Fusion must balance:
- Complexity (how many fusion rules?)
- Accessibility (can casual players engage?)
- Randomness (predictable vs surprising)

Too complex = cognitive overload
Too simple = boring

### Implementation

Fusion requires:
- Clear UI for combining items
- Visible progression (fusion tree)
- Feedback on successful fusions
```

**Atomization Result**:

**AKU-2025-001.md** (Root):
```markdown
# AKU-2025-001: Fusion creates discovery moments

**Category**: mechanics
**Tags**: fusion, discovery, engagement
**Created**: 2025-01-24

## Core Idea

Fusion mechanics create engagement through discovery when players combine
items and see unexpected results.

## Context

Applies to collection-based games where items can combine. Most effective
when results are partially unpredictable.

## Evidence

- Player psychology: Discovery triggers dopamine
- Successful examples: Pokemon fusion, crafting systems
- Engagement metrics: 88% success rate in PixelPets

## Implications

- Requires balance between predictability and surprise
- First fusion should be guaranteed positive
- Discovery rewards exploration

## Related Atoms

- [[AKU-2025-001a]] Discovery requires controlled randomness (extends)
- [[AKU-2025-001b]] Fusion enables emergent gameplay (extends)
- [[AKU-2025-002]] Collection mechanics benefit from fusion (supports)

## References

- Pattern: Fusion Mechanic (mechanics-library.md)
- Layer 2: Player Psychology
```

**AKU-2025-001a.md** (Branch - elaboration):
```markdown
# AKU-2025-001a: Discovery requires controlled randomness

**Category**: principles
**Tags**: discovery, randomness, balance
**Created**: 2025-01-24

## Core Idea

Discovery moments require controlled randomness - enough to surprise,
not so much to frustrate.

## Context

Applies when designing fusion outcomes. Balance is critical.

## Evidence

- Too random: Players feel cheated, quit
- Too predictable: No discovery, boring
- Optimal: 70-80% predictable, 20-30% surprising

## Implications

- Design fusion trees with known + unknown branches
- Provide hints, not answers
- Reward experimentation

## Related Atoms

- [[AKU-2025-001]] Fusion creates discovery moments (parent)
- [[AKU-2025-001a1]] Too much randomness = frustration (child)
- [[AKU-2025-001a2]] Too little randomness = boredom (child)

## References

- Pattern: Fusion Mechanic (mechanics-library.md)
```

**And so on for all 8 atoms...**

---

### Example 2: Auto-Linking

The tool detects relationships and creates bidirectional links:

```
AKU-2025-001 ("Fusion creates discovery")
  ↔ links to →
AKU-2025-002 ("Collection mechanics benefit from fusion")

Both files updated:
- AKU-2025-001 gets: [[AKU-2025-002]] (supports)
- AKU-2025-002 gets: [[AKU-2025-001]] (supported-by)
```

---

## Integration with Workspace

### With Atom Registry

Every atom created is registered in `atom-registry.json`:
```json
{
  "AKU-2025-001": {
    "title": "Fusion creates discovery moments",
    "category": "mechanics",
    "tags": ["fusion", "discovery"],
    "created": "2025-01-24",
    "file": "atoms/mechanics/AKU-2025-001.md",
    "outgoingLinks": ["AKU-2025-001a", "AKU-2025-002"],
    "incomingLinks": [],
    "status": "active"
  }
}
```

### With Knowledge Graph

Atoms become nodes, links become edges:
- Run graph-builder after atomization
- Atoms auto-populate graph
- Clusters emerge from atom relationships

### With Patterns

Original patterns remain as high-level overviews:
- Patterns → guide understanding
- Atoms → enable recombination
- Both systems complement each other

---

## Best Practices

### DO
- ✅ Start with high-quality source patterns
- ✅ Review atomization output before committing
- ✅ Use `--dry-run` first to preview
- ✅ Atomize incrementally (one pattern at a time initially)
- ✅ Manually adjust IDs if hierarchy doesn't fit
- ✅ Add evidence and context to generated atoms

### DON'T
- ❌ Atomize low-quality source material
- ❌ Over-atomize (too granular = noise)
- ❌ Under-atomize (too coarse = not atomic)
- ❌ Ignore generated links (review and refine)
- ❌ Delete original patterns (preserve as overviews)
- ❌ Run on entire knowledge base at once (incremental approach)

---

## Validation

### Atom Quality Checks

After atomization, validate atoms:

1. **Atomicity**: Does each atom express ONE complete idea?
2. **Self-contained**: Can you understand it without reading others?
3. **Evidence**: Does it include rationale or source?
4. **Linkage**: Are related atoms properly linked?
5. **Metadata**: Are tags, category, dates correct?

### Manual Review Process

```bash
# 1. Atomize with dry-run
node atomize.ts --source="..." --dry-run

# 2. Review proposed atoms

# 3. Atomize for real
node atomize.ts --source="..."

# 4. Review generated files
ls ../knowledge-base/atoms/mechanics/

# 5. Manually refine as needed
# Edit any atoms that need improvement

# 6. Commit
git add ../knowledge-base/atoms/
git commit -m "Atomize: [pattern name] → [N] atoms"
```

---

## Troubleshooting

### Issue: Atoms too granular (too many small atoms)

**Solution**: Increase granularity setting
```bash
node atomize.ts --source="..." --granularity=coarse
```

### Issue: Atoms too coarse (not atomic enough)

**Solution**: Decrease granularity or manually split
```bash
node atomize.ts --source="..." --granularity=fine
```

### Issue: Poor link detection

**Solution**: Use `--auto-link=false` and manually link
```bash
node atomize.ts --source="..." --auto-link=false
# Then manually add [[links]] to atoms
```

### Issue: ID hierarchy doesn't match conceptual hierarchy

**Solution**: Manually reassign IDs after generation
```bash
# Atomize, then manually rename files and update links
```

---

## Future Enhancements

### Planned Features

1. **Semantic similarity linking**: Use embeddings to detect implicit links
2. **Conflict detection**: Identify contradictory atoms
3. **Gap analysis**: Find missing concepts in atom network
4. **Batch atomization**: Atomize multiple files in one run
5. **Interactive mode**: Manual approval for each atom
6. **Merge detection**: Prevent duplicate atoms

---

## Success Metrics

Atomizer succeeds when:

- ✅ 80%+ of concepts are correctly identified
- ✅ Generated atoms pass quality validation
- ✅ Folgezettel hierarchy matches conceptual structure
- ✅ Auto-links are 70%+ accurate
- ✅ Manual refinement time < atomization time
- ✅ Atoms enable pattern recombination

---

## Next Steps

1. **Implement core atomization logic**: `atomize.ts`
2. **Implement Folgezettel system**: `folgezettel.ts`
3. **Implement extraction rules**: `extraction-rules.ts`
4. **Implement template generation**: `atom-templates.ts`
5. **Test on single pattern**: Start with Fusion Mechanic
6. **Iterate and refine**: Improve extraction rules based on results
7. **Scale to full library**: Atomize all patterns

---

**The atomizer breaks monoliths into particles. From particles, new structures emerge.**

**Atomize the knowledge. Discover emergent patterns.**
