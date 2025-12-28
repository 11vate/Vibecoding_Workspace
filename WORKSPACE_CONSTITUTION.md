# Workspace Constitution

**Authority Tier**: 1 (Immutable Law)
**Last Updated**: 2025-12-24
**Modification Protocol**: See `/evolution/UPDATE_PROTOCOL.md`

---

## Preamble

This document establishes the supreme law governing the Ultimate Design Intelligence Workspace. All AI models, agents, tools, protocols, and documentation defer to this Constitution.

**Purpose**: Transform this workspace from a library of knowledge into a self-governing nervous system with enforced quality, systematic reuse, and evolutionary stability.

**Philosophy**: "You've built a library. Now build the judiciary." — Quality through enforcement, not hope.

---

## Precedence Hierarchy (Immutable)

When conflicts arise between directives, rules, or documentation, resolve in this order:

### Tier 1: Immutable Laws (NEVER violate)

These laws are absolute and may only be changed via the UPDATE_PROTOCOL.

**Defined In**:
- This Constitution
- `.cursorrules` lines 22-29 (Framework Constraints)
- `.cursorrules` lines 104-121 (Quality Gates - now enforced via `/gates/`)

**Core Immutable Laws**:

1. **No Placeholders** - Zero TODO, FIXME, placeholder, or mock code
2. **PWA-First Architecture** - All projects must be Progressive Web Apps
3. **Local Assets Only** - No external API dependencies for assets
4. **Web-Native Only** - HTML/CSS/JavaScript/TypeScript exclusively
5. **No Proprietary Engines** - No Unity, Godot, or engine lock-ins
6. **Offline-Capable** - Service workers, IndexedDB, local storage required
7. **Type Safety** - TypeScript strict mode mandatory
8. **Error Handling** - All edge cases must be handled
9. **No Magic Numbers** - All values must be named constants
10. **Accessibility** - Accessibility must be considered
11. **Constitutional Supremacy** - This document overrides all other docs

**Violation Response**: IMMEDIATE STOP. Output is invalid. Return to correct mode/protocol.

---

### Tier 2: Mandatory Processes (MUST execute)

These processes must be followed. Output that skips mandatory processes is invalid.

**Defined In**:
- `/gates/` directory - Six hard gates that must pass
- `/docs/protocols/` - Research, Blueprint, Implementation, Audit protocols
- `/asset-system/` - Asset lifecycle (ingestion → validation → registry → reuse)
- Design Intelligence Stack - All 18 layers must be consulted

**Mandatory Processes**:

1. **Gate System** (see `/gates/`)
   - Architecture Gate - System coupling, core loop, state management
   - Asset Gate - Registry compliance, symbolic references, reuse check
   - Complexity Gate - Cognitive load, cyclomatic complexity, file length
   - Blueprint Gate - Blueprint exists, constraint validation, DIS layers consulted
   - Reuse Gate - Pattern/asset/code search before creation
   - Quality Gate - Zero placeholders, type safety, edge cases

2. **Design → Code Flow** (`.cursorrules` lines 15-21)
   - Research → Synthesis → Blueprint → Implementation
   - NEVER code without blueprint
   - NEVER blueprint without research
   - NEVER research without understanding experience intent

3. **Asset Lifecycle** (see `/asset-system/`)
   - Search Registry → Reuse (if exists) OR Validate → Optimize → Register → Integrate
   - Asset Gate must pass

4. **18-Layer Design Intelligence Stack** (see `/indexes/DESIGN_INDEX.md`)
   - All 18 layers must be consulted for new features
   - Layers 1-15: Established
   - Layer 16: Meta-Cognitive Reasoning (reasoning about reasoning)
   - Layer 17: Contextual Adaptation (dynamic layer weighting)
   - Layer 18: Temporal Reasoning (time-dependent decisions)

**Violation Response**: Gate failure report generated. Output rejected. Fix violations.

---

### Tier 3: Conditional Heuristics (context-dependent)

These heuristics apply when context is relevant. AI must determine applicability.

**Defined In**:
- `/knowledge-base/heuristics/` - Design, implementation, UX, optimization heuristics
- Pattern recommendations from `/knowledge-base/pattern-language/`
- Decision tree guidance from `/knowledge-base/decision-trees/`

**When to Apply**:
- Check `when_to_apply` field in heuristic definitions
- Match project phase, type, and context
- Prioritize by success rate when multiple apply
- Track outcomes and update success rates

**Examples**:
- "Core Loop First" (HEUR-001): Design core loop before secondary systems
- "Subtract Before Adding" (HEUR-002): Remove features before adding
- "Feedback Before Complexity" (HEUR-003): Implement feedback before complex mechanics
- "Three Examples Rule" (HEUR-004): Research 3 examples before designing

**Violation Response**: Advisory. Deviation permitted with justification.

---

### Tier 4: Optional Knowledge (reference only)

This knowledge provides context and inspiration but is not binding.

**Defined In**:
- Pattern libraries (`/knowledge-base/mechanics-library.md`, etc.)
- Cross-domain examples (`/knowledge-base/cross-domain-patterns/`)
- Accumulated wisdom (`/knowledge-base/accumulated-wisdom/`)
- References (`/knowledge-base/references/`)
- Philosophical context (`WORKSPACE_PHILOSOPHY.md`)

**Purpose**:
- Inspiration and examples
- Historical context
- Philosophical grounding
- Pattern discovery

**Violation Response**: None. This is reference material.

---

## Conflict Resolution Protocol

If two directives conflict:

### Step 1: Apply Tier Precedence
- **Higher tier ALWAYS overrides lower tier**
- Tier 1 > Tier 2 > Tier 3 > Tier 4
- Example: If a heuristic (Tier 3) conflicts with a gate (Tier 2), the gate wins

### Step 2: Apply Specificity Rule
- Within the same tier, **more specific overrides general**
- Example: Project-specific blueprint gate rule overrides general blueprint gate

### Step 3: Consult Arbitration Log
- If still unclear after steps 1-2, consult `/evolution/ARBITRATION_LOG.md`
- Check if this conflict was encountered before
- Apply documented resolution pattern

### Step 4: Log New Conflict
- If no prior resolution exists, make reasoned decision
- Log the conflict and resolution in `/evolution/ARBITRATION_LOG.md`
- Include: conflict description, conflicting sources, resolution, rationale
- This becomes precedent for future conflicts

---

## Authority Delegation

### .cursorrules Relationship
- `.cursorrules` implements Tier 1 laws
- Defers to this Constitution for conflict resolution
- Authority: Tier 1 (equal to Constitution)
- Scope: Operational rules and quality gates

### Agents & AI Models
- Defer to: Constitution → Gates → Protocols → Task
- Must load: Constitution, relevant indexes, applicable gates
- Authority: Executors of higher-tier directives
- See: `/AI_INITIALIZATION.md` for initialization protocol

### Tools
- Implement: Gates and Protocols (Tier 2)
- Support: Heuristics and Knowledge application (Tier 3-4)
- Authority: Automation of mandatory processes
- See: `/indexes/TOOL_INDEX.md` for tool mapping

### Documentation
- Provides: Context, not commands (mostly Tier 4)
- Exceptions: Protocols and Gates (Tier 2)
- Must declare: Authority tier in frontmatter
- See: `/evolution/UPDATE_PROTOCOL.md` for documentation standards

---

## Gate System (Tier 2 Enforcement)

Gates are **locks, not warnings**. Output is INVALID unless ALL applicable gates pass.

### Gate Execution Order

```
Before ANY output (code, blueprint, design):

1. Determine output type (code, blueprint, design, asset)
2. Load applicable gates from /gates/
3. Run validation checks for each gate
4. If ANY gate fails → output is INVALID
5. Generate gate report with specific failures
6. Log failures to /evolution/GATE_FAILURES_LOG.md
7. Only proceed if ALL gates PASS
```

### The Six Gates

1. **Architecture Gate** (`/gates/architecture-gate.md`)
   - Applies to: Code, system designs
   - Validates: System coupling, core loop, state management, event architecture

2. **Asset Gate** (`/gates/asset-gate.md`)
   - Applies to: Assets, asset references
   - Validates: Registry compliance, symbolic refs, reuse enforcement

3. **Complexity Gate** (`/gates/complexity-gate.md`)
   - Applies to: Code, UX designs
   - Validates: Cognitive load, cyclomatic complexity, file length, nesting

4. **Blueprint Gate** (`/gates/blueprint-gate.md`)
   - Applies to: Implementation requests
   - Validates: Blueprint exists, constraint validation, DIS consultation, research artifacts

5. **Reuse Gate** (`/gates/reuse-gate.md`)
   - Applies to: All creations (patterns, assets, code)
   - Validates: Search conducted, justification if duplicating

6. **Quality Gate** (`/gates/quality-gate.md`)
   - Applies to: All code
   - Validates: Zero placeholders, type safety, edge cases, no magic numbers

### Gate Failure Response

If a gate fails:
1. Output is **rejected immediately**
2. Gate report shows specific failures
3. Failure logged to `/evolution/GATE_FAILURES_LOG.md`
4. Must fix violations before proceeding
5. No exceptions (unless explicitly approved via UPDATE_PROTOCOL)

---

## Asset Lifecycle (Tier 2 Mandatory)

All assets must follow this lifecycle. Asset Gate enforces compliance.

### Lifecycle Flow

```
Asset Request
    ↓
[1] Search ASSET_REGISTRY.md (MANDATORY)
    ↓
    ├─ Exists? → Reuse + Increment counter → Done
    │
    └─ Not Exists? ↓

[2] Validate Format
    - Check file type, size, naming
    - Run validation rules from /asset-system/validation.md
    ↓

[3] Optimize
    - Compress if needed
    - Convert to spritesheet if appropriate
    - Follow /asset-system/ingestion.md
    ↓

[4] Register in ASSET_REGISTRY.md
    - Add entry: {id, path, type, projects, reuse_count, tags}
    - Auto-updated by asset-validator tool
    ↓

[5] Integrate in Project
    - Use symbolic reference (never direct path)
    - Import via asset registry
    ↓

[6] Pass Asset Gate
    - Validates all above steps completed
```

### Prime Directive: Reuse Before Creation

- AI **MUST** search asset registry before generating/requesting assets
- If similar asset exists: **reuse or justify new**
- Justification required if creating duplicate
- Reuse metrics tracked in `/evolution/EVOLUTION_METRICS.md`

---

## Compression Layers (Cognitive Load Management)

**Problem**: 33,909+ files = AI models get lost
**Solution**: AI reads indexes first, navigates deliberately, never crawls blindly

### The 7 Indexes

All indexes located in `/indexes/`

1. **MASTER_INDEX.md** - Top-level navigation for all tasks
2. **ARCHITECTURE_INDEX.md** - Critical architecture files only
3. **DESIGN_INDEX.md** - 18 DIS layers quick lookup
4. **PATTERN_INDEX.md** - Pattern categories and search strategy
5. **ASSET_INDEX.md** - Asset categories and registry
6. **PROTOCOL_INDEX.md** - Protocol selector by task type
7. **TOOL_INDEX.md** - Tool categorization and mapping

### AI Loading Protocol

```
1. Load /WORKSPACE_CONSTITUTION.md (this file)
2. Load /AI_INITIALIZATION.md
3. Determine task type
4. Load relevant index from /indexes/
5. Follow index to critical files ONLY
6. NEVER scan entire workspace
7. NEVER crawl directories
```

**Rationale**: With 33K+ files, AI attention is finite. Indexes are survival, not convenience.

---

## Evolution System (Tier 2 for stability)

Workspace evolves safely via defined protocols. No chaos, no entropy.

### Safe Evolution Protocol

See `/evolution/UPDATE_PROTOCOL.md` for full protocol.

**Summary**:
```
Propose Change
    ↓
Declare: Tier, Scope, Rationale
    ↓
Check for conflicts (this Constitution)
    ↓
Update affected indexes
    ↓
Mark old as [DEPRECATED] if replacing
    ↓
Log in /evolution/EVOLUTION_METRICS.md
    ↓
Commit with structured message
```

### Modification of Constitution

This Constitution (WORKSPACE_CONSTITUTION.md) is **Tier 1 Immutable Law**.

**Modification requires**:
1. Explicit UPDATE_PROTOCOL.md compliance
2. Justification of why change is necessary
3. Impact analysis on all systems
4. Update to all references
5. Approval via documented consensus

**Cannot be changed**:
- Tier hierarchy structure
- Gate enforcement philosophy
- Asset lifecycle prime directive
- Conflict resolution protocol

**Can be changed** (with protocol):
- Specific gate rules (but not gate existence)
- Number of indexes (but not index philosophy)
- Specific heuristics (but not tier classification)

---

## This Document

- **Location**: `/WORKSPACE_CONSTITUTION.md` (root)
- **Authority Tier**: 1 (Immutable Law)
- **Scope**: Entire workspace governance
- **Precedence**: Supreme. Overrides all other documents.
- **Last Updated**: 2025-12-24
- **Modification**: Via `/evolution/UPDATE_PROTOCOL.md` only
- **Version**: 1.0.0

---

## Key Principles (Foundational)

These principles underpin the entire constitution:

### 1. Constitution > Gates > Protocols > Heuristics > Knowledge
Authority flows from structure, not volume.

### 2. Indexes > Crawling
Deliberate navigation beats exhaustive search.

### 3. Locks > Warnings
Gates enforce, they don't suggest.

### 4. Reuse > Create
Growing library beats chaotic regeneration.

### 5. Governance > Vibes
Discipline beats improvisation.

### 6. Less, But Sharper
Quality through constraint, not abundance.

---

## Validation Protocol

An AI model is properly initialized if it can answer:

1. **What are the 4 authority tiers?**
   - Tier 1: Immutable Laws
   - Tier 2: Mandatory Processes
   - Tier 3: Conditional Heuristics
   - Tier 4: Optional Knowledge

2. **Which tier overrides in conflict?**
   - Higher tier always overrides lower tier

3. **What happens if a gate fails?**
   - Output is INVALID. Must fix violations before proceeding.

4. **Where do I start for a design task?**
   - Load WORKSPACE_CONSTITUTION.md → Load DESIGN_INDEX.md → Follow to critical files

5. **What is the asset prime directive?**
   - Search registry before creation. Reuse > Create.

6. **Can I skip the blueprint for a small feature?**
   - NO. Blueprint Gate (Tier 2) requires blueprint for ALL features.

If you cannot answer these, re-read this Constitution.

---

## Acknowledgment

By operating in this workspace, AI models acknowledge:

- This Constitution is supreme law
- Gates are locks, not warnings
- Indexes must be used
- Asset reuse is mandatory
- Quality is enforced, not hoped for
- Governance precedes features

**The Transformation**:
- From: Library of knowledge
- To: Self-governing nervous system
- From: Advisory best practices
- To: Enforced constitutional law
- From: AI improvising with vibes
- To: AI executing with discipline

---

**This is not a repo. This is an operating system for AI-assisted creation.**

**Governance first. Features second. Always.**
