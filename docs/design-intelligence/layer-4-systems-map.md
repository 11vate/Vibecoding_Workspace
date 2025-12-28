# Design Intelligence Layer 4: Systems Map

## Purpose

The Systems Map is **a graph, not a list** - it defines how systems interconnect, depend on each other, and interact. This document answers: "How do systems relate? What are the dependencies? How do failures propagate?"

**Cursor becomes extremely good when systems are explicitly interconnected.**

---

## Document Structure

Every project should have a `systems-map.md` file that defines each system with:

### 1. System Identification

For each system:
- **Name** - Clear, descriptive name
- **Purpose** - What it does, why it exists
- **Scope** - What it's responsible for

---

### 2. Inputs and Outputs

**What data flows in and out** - system boundaries.

- **Inputs** - What the system receives
- **Outputs** - What the system produces
- **Data format** - How data is structured

**Why it matters**: Cursor understands system boundaries and data flow.

---

### 3. Dependencies

**What other systems this depends on** - and what depends on it.

- **Dependencies** - Systems this system needs
- **Dependents** - Systems that need this system
- **Optional vs Required** - Which dependencies are critical

**Why it matters**: Cursor understands system order and can't break dependencies.

---

### 4. Failure Modes

**How this system can fail** - and how failures are handled.

- **Failure types** - What can go wrong
- **Failure detection** - How failures are identified
- **Recovery mechanisms** - How failures are handled
- **Failure propagation** - How failures affect other systems

**Why it matters**: Cursor designs robust systems with proper error handling.

---

### 5. Scaling Paths

**How this system grows** - evolution and expansion.

- **Current capacity** - What it handles now
- **Scaling triggers** - When it needs to scale
- **Scaling strategies** - How it can grow
- **Limits** - What it cannot scale beyond

**Why it matters**: Cursor designs systems that can evolve without breaking.

---

## Template

```markdown
# Systems Map

## [System Name]

### Purpose
[What it does, why it exists]

### Scope
[What it's responsible for]

### Inputs
- [Input 1]: [Description, format]
- [Input 2]: [Description, format]

### Outputs
- [Output 1]: [Description, format]
- [Output 2]: [Description, format]

### Dependencies
- **Required**: [System 1], [System 2]
- **Optional**: [System 3]

### Dependents
- [System A] depends on this
- [System B] depends on this

### Failure Modes
- **Failure Type 1**: [How it fails, how it's detected, how it's handled]
- **Failure Type 2**: [How it fails, how it's detected, how it's handled]

### Failure Propagation
[How failures affect other systems]

### Scaling Paths
- **Current capacity**: [What it handles now]
- **Scaling triggers**: [When it needs to scale]
- **Scaling strategies**: [How it can grow]
- **Limits**: [What it cannot scale beyond]

---

## [Next System]

[Repeat structure]
```

---

## System Relationship Visualization

Use diagrams to show relationships:

```
[System A] → [System B] → [System C]
     ↓           ↓           ↓
[System D] ← [System E] ← [System F]
```

Or dependency graph:

```
Core Systems (no dependencies)
    ↓
Feature Systems (depend on core)
    ↓
UI Systems (depend on features)
```

---

## How Cursor Uses This

### When Designing New Systems

Cursor checks:
1. What systems does this depend on?
2. What systems will depend on this?
3. How do failures propagate?
4. How does this scale?

### When Modifying Systems

Cursor asks:
- "Will this break dependencies?"
- "How does this affect failure modes?"
- "Does this change scaling paths?"
- "What systems need to be updated?"

### When Removing Systems

Cursor considers:
- What systems depend on this?
- How do we handle the gap?
- What functionality is lost?
- What needs to be replaced?

---

## System Categories

### 1. Core Systems

**Foundation systems** - everything depends on these.

Examples:
- State management
- Event system
- Asset loading
- Core loop

**Characteristics**:
- No dependencies (or minimal)
- Many dependents
- Must be stable
- Hard to change

---

### 2. Feature Systems

**Gameplay/app systems** - depend on core.

Examples:
- Fusion system
- Combat system
- Economy system
- Progression system

**Characteristics**:
- Depend on core systems
- May depend on other features
- Can be added/removed
- Easier to modify

---

### 3. UI Systems

**Presentation systems** - depend on features.

Examples:
- UI components
- Screen management
- Input handling
- Visual feedback

**Characteristics**:
- Depend on feature systems
- Present data, don't modify it
- Can be swapped/replaced
- User-facing

---

## Cross-References

- **Layer 3 (Core Loop)**: Systems support the loop
- **Layer 5 (Mechanic Evolution)**: Systems evolve over time
- **Layer 6 (UX Decision Log)**: UI systems connect to UX decisions

---

## Example: Pixel Pets

```markdown
# Systems Map: Pixel Pets

## Fusion System

### Purpose
Handles creature fusion logic, outcome calculation, visual effect assignment

### Scope
- Fusion compatibility checking
- Outcome calculation
- Visual effect assignment
- Fusion history tracking

### Inputs
- **Creature A**: Creature data (id, properties, visual)
- **Creature B**: Creature data (id, properties, visual)
- **Fusion rules**: Compatibility matrix, outcome probabilities

### Outputs
- **New creature**: Generated creature data
- **Fusion result**: Success/failure, visual effects
- **Collection update**: New creature added to collection

### Dependencies
- **Required**: Creature System, Visual System, Collection System
- **Optional**: Rarity System

### Dependents
- UI System (displays fusion interface)
- Collection System (receives new creatures)
- Progression System (tracks fusion milestones)

### Failure Modes
- **Invalid fusion**: Incompatible creatures → Reject with error message
- **Generation failure**: Cannot create creature → Retry or fallback creature
- **Data corruption**: Invalid creature data → Validate and sanitize

### Failure Propagation
- Fusion failure → UI shows error, collection unchanged
- Generation failure → User can retry, no progress lost
- Data corruption → System validates, prevents bad data

### Scaling Paths
- **Current capacity**: 1000 creatures, 100 fusion rules
- **Scaling triggers**: Collection size > 1000, fusion rules > 100
- **Scaling strategies**: Optimize lookup tables, cache results, lazy loading
- **Limits**: Browser memory, performance constraints

---

## Collection System

### Purpose
Manages user's creature collection, storage, retrieval

### Scope
- Collection storage (IndexedDB)
- Collection queries
- Collection statistics
- Collection persistence

### Inputs
- **New creatures**: From Fusion System
- **Collection queries**: Filter, sort, search requests
- **Storage operations**: Save, load, update

### Outputs
- **Collection data**: Creature list, statistics
- **Storage events**: Save/load completion
- **Collection updates**: Change notifications

### Dependencies
- **Required**: Storage System, Creature System
- **Optional**: None

### Dependents
- Fusion System (needs collection for fusion)
- UI System (displays collection)
- Progression System (tracks collection milestones)

### Failure Modes
- **Storage failure**: IndexedDB unavailable → Fallback to memory, warn user
- **Load failure**: Corrupted data → Validate, recover what's possible
- **Query failure**: Invalid query → Return empty result, log error

### Failure Propagation
- Storage failure → Collection works in memory, data not persisted
- Load failure → Start with empty collection, attempt recovery
- Query failure → UI shows empty state, system continues

### Scaling Paths
- **Current capacity**: 10,000 creatures in collection
- **Scaling triggers**: Collection size > 10,000, slow queries
- **Scaling strategies**: Indexing, pagination, virtual scrolling
- **Limits**: Browser storage limits, performance

---

## Visual System

### Purpose
Handles creature visuals, animations, effects

### Scope
- Sprite loading and management
- Animation playback
- Visual effect rendering
- Asset optimization

### Inputs
- **Creature data**: Visual properties, sprite references
- **Animation requests**: Play, stop, loop commands
- **Effect requests**: Particle effects, transitions

### Outputs
- **Rendered visuals**: Canvas/WebGL output
- **Animation events**: Start, complete, loop
- **Performance metrics**: FPS, memory usage

### Dependencies
- **Required**: Asset System, Rendering System
- **Optional**: None

### Dependents
- Fusion System (needs visuals for fusion results)
- UI System (displays creatures)
- Collection System (shows collection visuals)

### Failure Modes
- **Asset load failure**: Missing sprite → Show placeholder, retry load
- **Render failure**: Canvas/WebGL error → Fallback to simpler rendering
- **Performance failure**: Low FPS → Reduce quality, optimize

### Failure Propagation
- Asset load failure → Placeholder shown, system continues
- Render failure → Fallback rendering, functionality preserved
- Performance failure → Quality reduced, experience degraded

### Scaling Paths
- **Current capacity**: 50 creatures on screen, 60 FPS
- **Scaling triggers**: FPS < 30, memory usage high
- **Scaling strategies**: Object pooling, LOD, culling
- **Limits**: Browser performance, device capabilities
```

---

## Anti-Patterns

### 1. Circular Dependencies

System A depends on B, B depends on A:
- **Problem**: Can't initialize, deadlock risk
- **Solution**: Extract shared dependency, invert dependency

### 2. Hidden Dependencies

Dependencies not documented:
- **Problem**: Breaking changes aren't obvious
- **Solution**: Document all dependencies explicitly

### 3. Tight Coupling

Systems directly access each other's internals:
- **Problem**: Changes break other systems
- **Solution**: Use interfaces, events, data contracts

---

**This layer ensures Cursor understands system relationships and can design robust, scalable architectures.**


