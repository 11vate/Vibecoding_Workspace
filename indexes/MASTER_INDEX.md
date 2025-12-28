# Master Index

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Top-level navigation for AI models entering the workspace

---

## Purpose

**This is your entry point.** Don't crawl 33,909 files. Start here, navigate deliberately.

**Philosophy**: Compression over chaos. Indexes over exploration.

---

## How to Use This Index

### For AI Models (Claude, GPT, etc.)

**ALWAYS**:
1. Load `WORKSPACE_CONSTITUTION.md` first (authority hierarchy)
2. Come here (MASTER_INDEX.md)
3. Identify your task category below
4. Load the specific index for that category
5. Follow that index to the critical files
6. **Never** scan entire directories

**NEVER**:
- Crawl all markdown files in docs/
- Search blindly through knowledge-base/
- Load entire directories
- Guess where things are

**This index = your map. Use it.**

---

## Task Categories → Indexes

### 1. Implementation Tasks
**When**: Writing code, building features, fixing bugs

**Load**: [[ARCHITECTURE_INDEX.md]]
- System architecture
- Critical code files
- Integration points
- State management

**Also Load**: [[TOOL_INDEX.md]] for development tools

---

### 2. Design Tasks
**When**: Designing mechanics, UX flows, blueprints

**Load**: [[DESIGN_INDEX.md]]
- 18 Design Intelligence layers
- When to consult each layer
- Layer dependencies
- Design decision framework

**Also Load**: [[PATTERN_INDEX.md]] for reusable patterns

---

### 3. Asset Tasks
**When**: Creating, optimizing, organizing assets

**Load**: [[ASSET_INDEX.md]]
- Asset registry location
- Asset lifecycle
- Asset categories
- Reuse protocol

**Gates Required**: Asset Gate, Reuse Gate

---

### 4. Research/Planning Tasks
**When**: Researching patterns, planning features, analyzing problems

**Load**: [[PATTERN_INDEX.md]]
- Pattern libraries
- Pattern search strategy
- Meta-patterns
- Cross-domain patterns

**Also Load**: [[DESIGN_INDEX.md]] for design layers

---

### 5. Protocol/Process Tasks
**When**: Following workflows, executing protocols

**Load**: [[PROTOCOL_INDEX.md]]
- Research → Design → Blueprint → Code flow
- Gate validation protocols
- Asset lifecycle protocols
- Evolution protocols

**Also Load**: [[TOOL_INDEX.md]] for automation

---

### 6. Tool/Automation Tasks
**When**: Using or building tools

**Load**: [[TOOL_INDEX.md]]
- All 40+ tools categorized
- Which tool for which task
- Tool dependencies
- Tool integration

---

## Critical Files (Load These First)

Regardless of task, these are foundational:

### Governance
1. **`/WORKSPACE_CONSTITUTION.md`** - Supreme law (4-tier hierarchy)
   - **When**: Always first
   - **Why**: Defines all authority and precedence

### Quality Gates
2. **`/gates/`** - 6 hard gates that enforce quality
   - `architecture-gate.md` - System design validation
   - `asset-gate.md` - Asset compliance
   - `complexity-gate.md` - Simplicity enforcement
   - `blueprint-gate.md` - Design-before-code
   - `reuse-gate.md` - Search-before-create
   - `quality-gate.md` - Zero-tolerance quality
   - **When**: Before any output (code, design, blueprint)
   - **Why**: Gates are locks, not warnings

### Asset System
3. **`/asset-system/ASSET_REGISTRY.md`** - All workspace assets
   - **When**: Before creating/requesting any asset
   - **Why**: Reuse before creation (mandatory)

### Core Rules
4. **`.cursorrules`** - Framework constraints and operational rules
   - **When**: During implementation
   - **Why**: Tier 1 laws (PWA-first, no placeholders, etc.)

---

## Quick Task → File Mapping

### "I need to implement a feature"
1. Load [[ARCHITECTURE_INDEX.md]]
2. Load relevant blueprint from `docs/blueprints/`
3. Check [[PROTOCOL_INDEX.md]] → Implementation Protocol
4. Run relevant gates before output
5. Use [[TOOL_INDEX.md]] for code analyzer, pattern matcher

### "I need to design a mechanic"
1. Load [[DESIGN_INDEX.md]]
2. Load [[PATTERN_INDEX.md]]
3. Consult layers 1-3 (mandatory): Experience Pillars, Player Psychology, Core Loop
4. Search pattern library for existing mechanics
5. Follow Blueprint Protocol
6. Create blueprint in `docs/blueprints/`
7. Run Blueprint Gate

### "I need an asset (sprite, audio, font)"
1. Load [[ASSET_INDEX.md]]
2. **SEARCH** `asset-system/ASSET_REGISTRY.md` first (MANDATORY)
3. If exists: Reuse (increment counter)
4. If not: Follow ingestion protocol
5. Run Asset Gate
6. Register in registry

### "I need to find a pattern"
1. Load [[PATTERN_INDEX.md]]
2. Search `knowledge-base/mechanics-library.md`
3. Search `knowledge-base/ui-pattern-library.md`
4. Use `tools/pattern-matcher/` if needed
5. Follow Reuse Gate protocol

### "I need to follow a protocol"
1. Load [[PROTOCOL_INDEX.md]]
2. Identify: Research? Design? Blueprint? Implementation?
3. Load specific protocol from `docs/protocols/`
4. Follow step-by-step
5. Run applicable gates

### "I need to run a tool"
1. Load [[TOOL_INDEX.md]]
2. Find tool by category or task
3. Check tool README for usage
4. Check tool dependencies
5. Execute tool

---

## Directory Structure (High-Level)

```
Ultimate_Cursor_Vibecoding_Workspace/
├── .cursorrules                    # Framework constraints (Tier 1)
├── WORKSPACE_CONSTITUTION.md       # Supreme law (Tier 1)
├── README.md                       # Workspace overview
│
├── /gates/                         # 6 hard gates (Tier 2)
│   ├── architecture-gate.md
│   ├── asset-gate.md
│   ├── complexity-gate.md
│   ├── blueprint-gate.md
│   ├── reuse-gate.md
│   └── quality-gate.md
│
├── /asset-system/                  # Asset intelligence (Tier 2)
│   ├── ASSET_REGISTRY.md           # ← Search this first!
│   ├── ingestion.md
│   ├── validation.md
│   └── reuse-policy.md
│
├── /indexes/                       # Navigation indexes (you are here)
│   ├── MASTER_INDEX.md             # ← Start here
│   ├── ARCHITECTURE_INDEX.md
│   ├── DESIGN_INDEX.md
│   ├── PATTERN_INDEX.md
│   ├── ASSET_INDEX.md
│   ├── PROTOCOL_INDEX.md
│   └── TOOL_INDEX.md
│
├── /evolution/                     # Workspace evolution (Tier 2)
│   ├── UPDATE_PROTOCOL.md
│   ├── DEPRECATION_RULES.md
│   ├── ARBITRATION_LOG.md
│   ├── GATE_FAILURES_LOG.md
│   └── EVOLUTION_METRICS.md
│
├── /docs/                          # Documentation
│   ├── /blueprints/                # Feature blueprints
│   ├── /design-intelligence/       # 18 DIS layers
│   ├── /modes/                     # AI operating modes
│   ├── /prompts/                   # Prompt library
│   ├── /protocols/                 # Process protocols
│   └── /research/                  # Research artifacts
│
├── /knowledge-base/                # Knowledge repository
│   ├── mechanics-library.md
│   ├── ui-pattern-library.md
│   ├── progression-systems.md
│   ├── /accumulated-wisdom/
│   ├── /constraints/
│   ├── /heuristics/
│   └── /pattern-language/
│
├── /tools/                         # 40+ development tools
│   ├── /asset-intelligence/
│   ├── /asset-validator/
│   ├── /blueprint-generator/
│   ├── /code-analyzer/
│   ├── /pattern-matcher/
│   └── [37 more tool directories...]
│
└── /src/                           # Project source code
    └── /assets/                    # All assets live here
```

---

## Index Hierarchy

This index sits at the top of a hierarchy:

```
MASTER_INDEX.md (you are here)
    ├─→ ARCHITECTURE_INDEX.md → Critical architecture files
    ├─→ DESIGN_INDEX.md → 18 DIS layers
    ├─→ PATTERN_INDEX.md → Pattern libraries
    ├─→ ASSET_INDEX.md → Asset registry & categories
    ├─→ PROTOCOL_INDEX.md → Workflow protocols
    └─→ TOOL_INDEX.md → All tools categorized
```

**Navigation flow**:
1. Start: MASTER_INDEX.md
2. Route: Task-specific index
3. Target: Critical files only
4. Execute: With gates enforced

---

## Context Budget Management

**Problem**: 33,909 files = context overload

**Solution**: Deliberate navigation via indexes

**Budget Allocation**:
- **Constitution**: 1 file (always load)
- **Task Index**: 1 file (route to task)
- **Critical Files**: 3-5 files (index points here)
- **Related Context**: 2-3 files (as needed)
- **Total**: 7-10 files loaded (not 33,909)

**Example** (Implementation Task):
1. WORKSPACE_CONSTITUTION.md (governance)
2. MASTER_INDEX.md (routing)
3. ARCHITECTURE_INDEX.md (task-specific)
4. `docs/blueprints/mechanic-fusion.md` (feature blueprint)
5. `.cursorrules` (framework constraints)
6. `gates/architecture-gate.md` (validation)
7. `gates/quality-gate.md` (validation)

**Total: 7 files loaded** instead of scanning thousands

---

## Related Indexes

Each index below provides deep navigation for its domain:

- **[[ARCHITECTURE_INDEX.md]]** - System architecture & critical code
- **[[DESIGN_INDEX.md]]** - 18-layer Design Intelligence Stack
- **[[PATTERN_INDEX.md]]** - Pattern libraries & search strategy
- **[[ASSET_INDEX.md]]** - Asset registry & lifecycle
- **[[PROTOCOL_INDEX.md]]** - Process workflows & protocols
- **[[TOOL_INDEX.md]]** - All tools categorized by task

---

## AI Model Initialization

When you (AI model) enter this workspace:

### Step 1: Load Governance
```
Read: /WORKSPACE_CONSTITUTION.md
Understand: 4-tier authority hierarchy
Internalize: Tier 1 > Tier 2 > Tier 3 > Tier 4
```

### Step 2: Load This Index
```
Read: /indexes/MASTER_INDEX.md
Understand: Navigation strategy
Internalize: Indexes > Crawling
```

### Step 3: Identify Task
```
Question: What is the user asking for?
Categories:
- Implementation → ARCHITECTURE_INDEX
- Design → DESIGN_INDEX
- Assets → ASSET_INDEX
- Research → PATTERN_INDEX
- Process → PROTOCOL_INDEX
- Tools → TOOL_INDEX
```

### Step 4: Navigate via Index
```
Load: Appropriate index from /indexes/
Follow: Index to critical files
Load: Only what index points to
```

### Step 5: Execute with Gates
```
Perform: Task following protocols
Validate: Run applicable gates
Report: Gate status with output
```

### Step 6: Log & Learn
```
Log: Decisions in ARBITRATION_LOG if conflicts
Log: Failures in GATE_FAILURES_LOG if gate fails
Update: EVOLUTION_METRICS with outcomes
```

---

## Validation

You are navigating correctly if you can answer:

- ✅ What are the 4 authority tiers?
- ✅ Which index do I load for my current task?
- ✅ What are the 6 hard gates?
- ✅ Where is the asset registry?
- ✅ How many files should I load? (Answer: 7-10, not thousands)

If you cannot answer these, re-read WORKSPACE_CONSTITUTION.md and this index.

---

## Notes

- **This index is mandatory for AI models** - not optional
- **Indexes compress knowledge** - use them to manage context
- **Deliberate navigation beats blind exploration** - always
- **33,909 files exist** - you don't need to read them all
- **7-10 files** is usually sufficient for any task

---

## Maintenance

**Update Frequency**:
- Daily: If new critical files added
- Weekly: If directory structure changes
- Monthly: Comprehensive review

**Update Protocol**: See `/evolution/UPDATE_PROTOCOL.md`

**Ownership**: Maintained by workspace governance (automatic)

---

**Remember**: You don't navigate 33,909 files. You navigate 7 indexes. The indexes navigate the files.

**Start here. Route via indexes. Execute with gates.**

**Indexes over crawling. Always.**
