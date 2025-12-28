# Workspace Architecture

## System Overview

The Ultimate Cursor Vibecoding Workspace is a **layered architecture** that guides Cursor through a design intelligence workflow. Each layer enforces specific behaviors and provides context for decision-making.

---

## Architecture Layers

### Layer 1: Operational Law (`.cursorrules`)

**Purpose**: Master rules that govern all Cursor behavior

**Key Components**:
- Prime Directive (Design before code)
- Framework constraints
- Blueprint requirements
- Quality gates
- Mode-specific rules

**Enforcement**: Hard rules that Cursor cannot violate

---

### Layer 2: Design Intelligence Stack (`docs/design-intelligence/`)

**Purpose**: Force Cursor to reason through design layers

**Components**:
1. Experience Pillars - Core fantasy and emotional contract
2. Player Psychology - User motivation and cognitive load
3. Core Loop - The heart of the experience
4. Systems Map - System interdependencies
5. Mechanic Evolution - How systems grow over time
6. UX Decision Log - Justified UI/UX decisions

**Flow**: Top → Down (Experience → Systems → Data → Code)

---

### Layer 3: Prompt System (`docs/prompts/`)

**Purpose**: Provide ready-to-use prompt templates

**Components**:
- Master Design Prompt - Core identity anchor
- Research Prompt - Exploration mode
- Synthesis Prompt - Concept formation
- Blueprint Prompt - Formal planning
- Implementation Gate Prompt - Code approval
- Audit Prompt - Self-reflection

**Usage**: Reference with `@Docs/prompts/[name].md`

---

### Layer 4: Protocols (`docs/protocols/`)

**Purpose**: Define operational procedures

**Components**:
- Research Protocol - How to research
- Blueprint Protocol - How to create blueprints
- Implementation Protocol - How to code
- Audit Protocol - How to self-audit

**Enforcement**: Guides Cursor through correct workflows

---

### Layer 5: Operation Modes (`docs/modes/`)

**Purpose**: Define Cursor's internal states

**Components**:
- Exploration Mode - Idea discovery
- Synthesis Mode - Pattern extraction
- Blueprint Mode - Formal planning
- Implementation Mode - Coding

**Flow**: Sequential (Exploration → Synthesis → Blueprint → Implementation)

---

### Layer 6: Knowledge Base (`knowledge-base/`)

**Purpose**: Provide cross-referenceable patterns

**Components**:
- Mechanics Library - Game/app mechanics
- UI Pattern Library - UI/UX patterns
- Progression Systems - Progression models
- Economy Models - Economic systems
- References - Games, apps, frameworks

**Usage**: Cross-reference before inventing

---

### Layer 7: Tools (`tools/`)

**Purpose**: Provide templates and validation

**Components**:
- Blueprint Templates - File templates for blueprints
- Validation - Blueprint completeness checker

**Usage**: Generate artifacts, validate before implementation

---

### Layer 8: Templates (`templates/`)

**Purpose**: Provide project starting points

**Components**:
- Canonical Spine - Base project structure
- Example Project - Complete working example

**Usage**: Copy to start new projects

---

## Data Flow

```
User Request
    ↓
Exploration Mode (Research)
    ↓
Synthesis Mode (Design Concepts)
    ↓
Blueprint Mode (Formal Planning)
    ↓
Blueprint Validation
    ↓
Implementation Mode (Coding)
    ↓
Quality Gates
    ↓
Complete Feature
```

---

## Integration Points

### 1. Project Structure

Every project uses the canonical spine:
- `/docs` - Design intelligence and blueprints
- `/src/core` - Core systems (state, systems, events, loop)
- `/src/ui` - User interface
- `/src/logic` - Business logic
- `/src/assets` - Asset registry

### 2. Documentation Cross-References

Design docs reference each other:
- `experience-pillars.md` → `player-psychology.md`
- `core-loop.md` → `systems-map.md`
- `systems-map.md` → `mechanic-evolution.md`

### 3. Knowledge Base Integration

Before designing, Cursor checks:
- Mechanics library for similar patterns
- UI pattern library for UX solutions
- References for inspiration

### 4. Blueprint System

Blueprints are:
- Created from templates (`tools/blueprint-templates/`)
- Validated (`tools/validation/blueprint-validator.md`)
- Stored in `/docs/blueprints/`
- Referenced during implementation

---

## Enforcement Mechanisms

### 1. `.cursorrules` Enforcement

Hard rules that Cursor cannot violate:
- No code without blueprint
- No design without research
- No placeholders allowed
- Framework constraints

### 2. Blueprint Validation

Before implementation:
- Check blueprint exists
- Validate completeness
- Verify alignment with design docs

### 3. Quality Gates

During implementation:
- Type safety (TypeScript strict)
- Error handling required
- Accessibility considered
- Performance optimized

### 4. Self-Auditing

Periodically:
- Audit for redundancy
- Check for feature creep
- Recommend removals

---

## Extensibility

The architecture is designed to be extended:

1. **Add Design Intelligence Layers**: Create new layers in `docs/design-intelligence/`
2. **Add Knowledge Base Entries**: Extend libraries in `knowledge-base/`
3. **Add Prompt Templates**: Create new prompts in `docs/prompts/`
4. **Add Protocols**: Define new workflows in `docs/protocols/`

---

## Success Metrics

The architecture succeeds when:

- ✅ Cursor follows the workflow automatically
- ✅ Blueprints are created before code
- ✅ Knowledge base is cross-referenced
- ✅ Quality gates are enforced
- ✅ Projects maintain consistency

---

## Maintenance

**Regular Updates**:
- Add successful patterns to knowledge base
- Document new protocols as they emerge
- Update prompt templates based on usage
- Refine design intelligence layers

**Version Control**:
- Track changes to `.cursorrules`
- Document architecture decisions
- Maintain backward compatibility

---

**This architecture is a cognitive exoskeleton. It doesn't replace Cursor's intelligence — it structures and amplifies it.**


