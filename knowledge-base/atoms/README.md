# Atomic Knowledge System

**Purpose**: Break knowledge into irreducible atomic units that can be linked, combined, and evolved independently.

**Philosophy**: "One idea, one note." Each atom contains a single, complete thought that stands alone but connects to others.

**Based on**: Zettelkasten method with Folgezettel branching IDs

---

## What is an Atomic Knowledge Unit (AKU)?

An **Atomic Knowledge Unit (AKU)** is the smallest piece of knowledge that:
- Expresses ONE complete idea
- Can stand alone (self-contained)
- Can link to other atoms (interconnected)
- Can be understood without context (but enhanced with context)

**Example**:
- ❌ NOT atomic: "Fusion mechanics and their relationship to progression systems" (two ideas)
- ✅ Atomic: "Fusion mechanic creates discovery moments" (one idea)
- ✅ Atomic: "Progression systems benefit from discovery moments" (separate, linkable idea)

---

## Atom ID System

### Format: `AKU-YYYY-NNN[branch]`

**Components**:
- `AKU`: Atomic Knowledge Unit
- `YYYY`: Year created (e.g., 2025)
- `NNN`: Sequential number (001, 002, etc.)
- `[branch]`: Optional Folgezettel branches (a, b, 1, 2, etc.)

**Examples**:
- `AKU-2025-001` - First atom of 2025
- `AKU-2025-001a` - First branch from AKU-2025-001
- `AKU-2025-001a1` - First sub-branch from AKU-2025-001a
- `AKU-2025-001a2` - Second sub-branch from AKU-2025-001a
- `AKU-2025-001b` - Alternative branch from AKU-2025-001

### Folgezettel Branching Logic

**Folgezettel** ("following notes") creates conceptual hierarchies:

```
AKU-2025-001: "Core loop defines experience"
├── AKU-2025-001a: "Core loop should be < 60 seconds"
│   ├── AKU-2025-001a1: "Short loops reduce drop-off"
│   └── AKU-2025-001a2: "Long loops require savepoints"
├── AKU-2025-001b: "Core loop reinforces fantasy"
│   └── AKU-2025-001b1: "Fantasy-loop mismatch creates dissonance"
└── AKU-2025-001c: "Multiple loops = complex game"
```

**When to branch**:
- **Letter branch (a, b, c)**: Related but distinct ideas
- **Number branch (1, 2, 3)**: Elaborations or sub-concepts
- **New root**: Completely separate concept

---

## Atom Structure

Every atom follows this template (see `_TEMPLATE.md`):

### Required Fields

1. **ID** - Unique identifier
2. **Title** - Clear, descriptive name
3. **Category** - mechanics | principles | decisions | insights | constraints | questions
4. **Tags** - Searchable keywords
5. **Created** - Date
6. **Last Modified** - Date

### Content Sections

1. **Core Idea** - The single idea (1-3 sentences)
2. **Context** - When does this apply?
3. **Evidence** - Why is this true?
4. **Implications** - What follows from this?
5. **Related Atoms** - Links to other atoms
6. **References** - Sources, projects, patterns

---

## Atom Categories

### `/mechanics/`
**Purpose**: Atomic mechanic concepts

**Examples**:
- "Fusion creates discovery moments"
- "Random rewards increase engagement"
- "Player choice increases investment"

### `/principles/`
**Purpose**: Design principles

**Examples**:
- "Serve the fantasy first"
- "Simplicity beats complexity"
- "Feedback must be immediate"

### `/decisions/`
**Purpose**: Single decisions with rationale

**Examples**:
- "Use fusion over linear collection (PixelPets)"
- "PWA over native app (constraint-driven)"
- "TypeScript strict mode mandatory"

### `/insights/`
**Purpose**: Single insights

**Examples**:
- "Players ignore tutorials, learn by doing"
- "First 30 seconds determine retention"
- "Complexity budget is real"

### `/constraints/`
**Purpose**: Single constraints

**Examples**:
- "Cognitive load limit: 3 concepts per screen"
- "PWA: No server dependencies"
- "Mobile: Touch targets ≥ 44px"

### `/questions/`
**Purpose**: Open questions

**Examples**:
- "How do we balance fusion complexity vs accessibility?"
- "Can offline-first work for multiplayer?"
- "What's the ideal core loop duration?"

---

## Creating New Atoms

### Step 1: Choose Next ID

1. Check `atom-registry.json` for last ID
2. Increment: `AKU-2025-042` → `AKU-2025-043`
3. Or branch: `AKU-2025-042` → `AKU-2025-042a`

### Step 2: Copy Template

```bash
cp atoms/_TEMPLATE.md atoms/category/AKU-2025-043.md
```

### Step 3: Fill Template

- Write ONE idea in Core Idea section
- Add context, evidence, implications
- Link to related atoms using `[[AKU-2025-XXX]]` syntax
- Add tags for searchability

### Step 4: Register Atom

Add entry to `atom-registry.json`:
```json
{
  "AKU-2025-043": {
    "title": "Fusion creates discovery moments",
    "category": "mechanics",
    "tags": ["fusion", "discovery", "engagement"],
    "created": "2025-01-24",
    "file": "atoms/mechanics/AKU-2025-043.md"
  }
}
```

---

## Linking Atoms

### Wiki-Style Links

Use `[[AKU-ID]]` syntax to link atoms:

```markdown
This mechanic creates discovery moments [[AKU-2025-043]],
which increases player engagement [[AKU-2025-044]].
```

### Link Types

Specify relationship type in parentheses:

- `[[AKU-XXX]] (supports)` - Supporting evidence
- `[[AKU-XXX]] (contradicts)` - Contradictory idea
- `[[AKU-XXX]] (extends)` - Elaboration
- `[[AKU-XXX]] (implements)` - Implementation of principle
- `[[AKU-XXX]] (inspired-by)` - Source of inspiration

**Example**:
```markdown
Core loop defines experience [[AKU-2025-001]] (principle).
Fusion mechanic implements this [[AKU-2025-001a]] (implements).
However, complexity may harm accessibility [[AKU-2025-052]] (contradicts).
```

---

## Atom Lifecycle

### 1. Birth
- Created with fresh idea
- Linked to source (pattern, project, reference)
- Registered in atom-registry

### 2. Growth
- Accumulates evidence from projects
- Gains bidirectional links from other atoms
- Spawns branches (related atoms)

### 3. Maturity
- Well-connected (5+ bidirectional links)
- Validated by multiple projects
- Referenced by tools/protocols

### 4. Evolution
- Idea refines over time
- Last Modified date updates
- May spawn contradictory atom (knowledge evolution)

### 5. Deprecation (rare)
- Idea proven wrong
- Marked as `[DEPRECATED]` in title
- Links preserved for history
- Superseded by new atom (linked)

---

## Atom Quality Standards

### ✅ Good Atoms

- **Atomic**: One complete idea
- **Self-contained**: Can understand without reading other atoms (but enhanced with context)
- **Clear**: No jargon without definition
- **Evidenced**: Includes rationale or source
- **Linked**: Connects to related atoms

### ❌ Poor Atoms

- **Multi-idea**: Covers multiple concepts
- **Vague**: Unclear or ambiguous
- **Unsupported**: No evidence or rationale
- **Orphaned**: No links to other atoms
- **Duplicate**: Idea already exists in another atom

---

## Integration with Workspace

### With Design Intelligence Layers

Atoms feed into DIS layers:
- Layer 1 (Experience Pillars): Atoms about core fantasy
- Layer 2 (Player Psychology): Atoms about motivation, cognition
- Layer 5 (Mechanic Evolution): Atoms about mechanic patterns

### With Knowledge Graph

All atoms become nodes in knowledge graph:
- Atoms = nodes
- Links = edges
- Categories = clusters
- Branches = hierarchical structure

### With Patterns

Patterns → decompose → Atoms → recombine → New Patterns

**Process**:
1. Existing pattern (e.g., "Fusion Mechanic")
2. Atomize into components (discovery, combination, rarity, progression)
3. Each component becomes atom
4. Recombine atoms in new ways
5. Discover new patterns

---

## Best Practices

### DO
- ✅ Write one idea per atom
- ✅ Use descriptive titles
- ✅ Link generously
- ✅ Add evidence from real projects
- ✅ Update atoms when insights change
- ✅ Create branches for related concepts

### DON'T
- ❌ Write essays (keep atoms atomic)
- ❌ Duplicate existing atoms (search first)
- ❌ Create orphans (always link)
- ❌ Use vague language
- ❌ Skip atom registry
- ❌ Delete atoms (deprecate instead)

---

## Tools for Atoms

### Atomizer Tool
`tools/knowledge-atomizer/` - Breaks existing patterns into atoms

### Graph Builder
`tools/graph-builder/` - Builds knowledge graph from atoms

### Atom Search
`tools/knowledge-navigator/` - Searches atoms by content, tags, links

### Atom Validator
`tools/validation/atom-validator.md` - Validates atom quality

---

## Examples

### Good Atom Example

**File**: `atoms/mechanics/AKU-2025-001.md`

```markdown
# AKU-2025-001: Fusion creates discovery moments

**Category**: mechanics
**Tags**: fusion, discovery, engagement, emergence
**Created**: 2025-01-24
**Last Modified**: 2025-01-24

## Core Idea

Fusion mechanics create discovery moments when players combine items and see unexpected results, which increases engagement through emergent gameplay.

## Context

Applies to collection-based games where players combine items. Most effective when:
- Fusion results are not fully predictable
- Some fusions yield rare/special outcomes
- Discovery is rewarded (not punished)

## Evidence

- PixelPets Reborn: Fusion mechanic had 88% success rate
- Player psychology: Discovery triggers dopamine release
- Game design: Emergent systems increase replayability

## Implications

- Fusion requires balanced randomness (too random = frustrating)
- First fusion should be guaranteed positive
- Players need hints, not spoilers
- Fusion trees should branch, not be linear

## Related Atoms

- [[AKU-2025-002]] Discovery requires controlled randomness (extends)
- [[AKU-2025-003]] Collection mechanics benefit from fusion (supports)
- [[AKU-2025-010]] Cognitive load limits fusion complexity (constrains)

## References

- Pattern: `PATTERN-FUSION-001` in knowledge-base/mechanics-library.md
- Project: PixelPets Reborn
- Layer 2: Player Psychology (discovery motivation)
```

---

## Migration Strategy

**Existing knowledge → Atoms**:

1. **Phase 1**: Create atom infrastructure (this directory)
2. **Phase 2**: Build atomizer tool
3. **Phase 3**: Atomize mechanics-library.md (50+ patterns → 200+ atoms)
4. **Phase 4**: Atomize ui-pattern-library.md
5. **Phase 5**: Atomize progression-systems.md
6. **Phase 6**: Atomize accumulated-wisdom

**Keep both systems**:
- Existing pattern libraries: High-level overviews
- Atoms: Granular, linkable components
- Both systems complement each other

---

## Success Metrics

Atomic knowledge system succeeds when:

- ✅ 100+ atoms created
- ✅ Average 5+ bidirectional links per atom
- ✅ Atoms referenced by blueprints
- ✅ New patterns emerge from atom recombination
- ✅ Knowledge navigator used regularly
- ✅ Atom quality maintained (validated)

---

## Next Steps

1. **Create atom template**: `_TEMPLATE.md`
2. **Create atom registry**: `atom-registry.json`
3. **Build atomizer tool**: `tools/knowledge-atomizer/`
4. **Atomize first pattern**: Start with fusion mechanic
5. **Build knowledge graph**: `tools/graph-builder/`
6. **Integrate with modes**: Reference atoms in blueprints

---

**Atoms are the fundamental particles of knowledge. Small enough to be precise, complete enough to be useful, linked enough to be powerful.**

**Build the atom library. Discover emergent patterns.**
