# Protocol Index

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Navigate workflow protocols for systematic task execution

---

## Purpose

**When to use**: Following structured workflows, executing processes, validating compliance

**Protocols are Tier 2** - they MUST be followed when applicable

---

## Core Workflow Protocol

**The Golden Path**: Research → Design → Blueprint → Code

This is the mandatory flow for all feature development.

```
┌─────────────┐
│  Research   │ ← Understand problem, find patterns
└──────┬──────┘
       ↓
┌─────────────┐
│   Design    │ ← Consult DIS layers, create design
└──────┬──────┘
       ↓
┌─────────────┐
│  Blueprint  │ ← Formalize design, pass Blueprint Gate
└──────┬──────┘
       ↓
┌─────────────┐
│    Code     │ ← Implement, pass all gates
└─────────────┘
```

**NO SKIPPING STEPS** - Blueprint Gate enforces this.

---

## Protocol Directory

**Location**: `docs/protocols/`

### Primary Protocols

#### 1. Research Protocol
**File**: `docs/protocols/research-protocol.md`
**When**: Starting new feature or significant change
**Purpose**: Systematic research before design

**Steps**:
1. Problem definition
2. Comparative analysis (how do others solve this?)
3. Design pattern research
4. Technical feasibility assessment
5. Research artifact creation

**Output**: Research artifacts in `docs/research/`

**Gates**: None (pre-design phase)

---

#### 2. Design Protocol
**File**: `docs/protocols/design-protocol.md`
**When**: After research, before blueprint
**Purpose**: Structured design process

**Steps**:
1. Load Design Intelligence layers (1-3 mandatory)
2. Define experience intent (Layer 1)
3. Model player psychology (Layer 2)
4. Integrate with core loop (Layer 3)
5. Consult contextual layers
6. Create design document

**Output**: Design document with layer consultations

**Gates**: None (pre-blueprint phase)

---

#### 3. Blueprint Protocol
**File**: `docs/protocols/blueprint-protocol.md`
**When**: After design, before implementation
**Purpose**: Formalize design into implementable spec

**Steps**:
1. Choose blueprint template (system/mechanic/UX)
2. Complete all required sections
3. Define data structures (TypeScript)
4. Document edge cases
5. Validate against constraints
6. Document DIS layer consultations
7. Pass Blueprint Gate

**Output**: Blueprint in `docs/blueprints/`

**Gates**: **Blueprint Gate** (MANDATORY)

---

#### 4. Implementation Protocol
**File**: `docs/protocols/implementation-protocol.md`
**When**: After blueprint passes gate
**Purpose**: Systematic code implementation

**Steps**:
1. Load blueprint
2. Load architecture constraints
3. Search for reusable code/components
4. Implement following blueprint
5. Handle all edge cases
6. Write tests
7. Pass all gates

**Output**: Implemented code in `src/`

**Gates**: **Architecture Gate, Complexity Gate, Quality Gate** (MANDATORY)

---

### Asset Protocols

#### 5. Asset Ingestion Protocol
**File**: `asset-system/ingestion.md`
**When**: Creating or importing assets
**Purpose**: Bring assets into system correctly

**Steps**:
1. Pre-validate
2. Search registry (MANDATORY)
3. Justify or reuse decision
4. Format validation
5. Optimization
6. Registration
7. Integration
8. Gate validation

**Output**: Registered asset in registry

**Gates**: **Asset Gate, Reuse Gate** (MANDATORY)

#### 6. Asset Validation Protocol
**File**: `asset-system/validation.md`
**When**: Asset creation or modification
**Purpose**: Ensure asset quality

**Levels**:
1. Structural validation (file integrity)
2. Semantic validation (content quality)
3. Integration validation (workspace compliance)

**Output**: Validation report

**Gates**: **Asset Gate** (enforced)

#### 7. Asset Reuse Protocol
**File**: `asset-system/reuse-policy.md`
**When**: Before creating ANY asset
**Purpose**: "Search First, Create Second"

**Steps**:
1. ALWAYS search registry
2. Evaluate matches
3. Reuse (≥60) / Adapt (40-59) / Create (<40)
4. If creating: justify

**Output**: Reuse decision log

**Gates**: **Reuse Gate** (MANDATORY)

---

### Evolution Protocols

#### 8. Update Protocol
**File**: `evolution/UPDATE_PROTOCOL.md`
**When**: Modifying workspace files
**Purpose**: Safe workspace evolution

**Steps**:
1. Declare: Tier, Scope, Rationale
2. Check for conflicts (Constitution)
3. Update affected indexes
4. Mark old as deprecated if replacing
5. Log in evolution metrics
6. Commit with structured message

**Output**: Updated workspace + logs

#### 9. Deprecation Protocol
**File**: `evolution/DEPRECATION_RULES.md`
**When**: Replacing or removing workspace elements
**Purpose**: Graceful deprecation

**Steps**:
1. Mark as `[DEPRECATED: use X instead]`
2. Set grace period
3. Update indexes
4. Notify via evolution log
5. Remove after grace period

**Output**: Deprecated item marked

---

## Protocol Execution Matrix

| Task | Protocol | Required Gates | Output Location |
|------|----------|----------------|-----------------|
| New Feature | Research → Design → Blueprint → Implementation | Blueprint, Architecture, Complexity, Quality | `src/` |
| New Mechanic | Research → Design → Blueprint → Implementation | Blueprint, Complexity, Reuse | `src/` + `docs/blueprints/` |
| New Asset | Asset Ingestion | Asset, Reuse | `src/assets/` + registry |
| Modify Workspace | Update Protocol | None | Varies |
| Deprecate Element | Deprecation Protocol | None | Marked in-place |
| UX Flow | Design → Blueprint → Implementation | Blueprint, Complexity | `src/` + `docs/blueprints/` |

---

## Quick Protocol Selector

### "I need to build a new feature"
**Protocol**: Research → Design → Blueprint → Implementation
**Files**:
1. `docs/protocols/research-protocol.md`
2. `docs/protocols/design-protocol.md`
3. `docs/protocols/blueprint-protocol.md`
4. `docs/protocols/implementation-protocol.md`

**Gates**: Blueprint, Architecture, Complexity, Quality

### "I need to create an asset"
**Protocol**: Asset Ingestion
**File**: `asset-system/ingestion.md`
**Gates**: Asset, Reuse

### "I need to modify workspace structure"
**Protocol**: Update Protocol
**File**: `evolution/UPDATE_PROTOCOL.md`
**Gates**: None (but log in evolution)

### "I need to design a mechanic"
**Protocol**: Research → Design → Blueprint
**Files**:
1. `docs/protocols/research-protocol.md`
2. `docs/protocols/design-protocol.md`
3. `docs/protocols/blueprint-protocol.md`

**Gates**: Blueprint, Reuse (pattern search)

### "I need to validate my work"
**Protocol**: Depends on work type
**Gate Files**:
- Code: `gates/quality-gate.md`, `gates/complexity-gate.md`, `gates/architecture-gate.md`
- Blueprint: `gates/blueprint-gate.md`
- Asset: `gates/asset-gate.md`
- Pattern: `gates/reuse-gate.md`

---

## Gate Integration

All protocols integrate with gates:

### Pre-Implementation Gates
- **Reuse Gate** - Search before create (patterns, assets, code)
- **Blueprint Gate** - Design before code

### Implementation Gates
- **Architecture Gate** - System design validation
- **Complexity Gate** - Simplicity enforcement
- **Quality Gate** - Zero-tolerance quality

### Post-Creation Gates
- **Asset Gate** - Asset compliance

**Rule**: Gates run at protocol checkpoints, output rejected if fails

---

## Protocol Templates

**Directory**: `docs/protocols/templates/`

### Research Template
**File**: `docs/protocols/templates/research-template.md`
**Use**: Starting research phase

### Blueprint Templates
**Directory**: `tools/blueprint-templates/`
**Templates**:
- `system-blueprint-template.md`
- `mechanic-blueprint-template.md`
- `ux-blueprint-template.md`

**Use**: Creating blueprints

### Decision Log Template
**Format**:
```markdown
## Decision: [Name]

### Context
[What problem are we solving?]

### Options Considered
1. Option A - [pros/cons]
2. Option B - [pros/cons]

### Decision
[Chosen option]

### Rationale
[Why this option? Layer consultations?]

### Consequences
[What are the implications?]
```

---

## Protocol Adherence Tracking

**File**: `evolution/EVOLUTION_METRICS.md`

**Metrics Tracked**:
- Protocol adherence rate
- Gate pass rate
- Skip attempts (logged as violations)
- Protocol effectiveness (outcome correlation)

**Example**:
```markdown
## Protocol Adherence (Q4 2025)

- Features with full protocol: 12/15 (80%)
- Features skipping blueprint: 3/15 (20%)
- Blueprint Gate pass rate: 92%
- Implementation Gate pass rate: 88%

Correlation:
- Full protocol → 95% success rate
- Skipped blueprint → 33% success rate

Action: Enforce blueprint protocol more strictly
```

---

## Related Indexes

- **[[MASTER_INDEX.md]]** - Top-level navigation
- **[[DESIGN_INDEX.md]]** - DIS layers (used in design protocol)
- **[[PATTERN_INDEX.md]]** - Patterns (used in research protocol)
- **[[ARCHITECTURE_INDEX.md]]** - Architecture (used in implementation protocol)
- **[[TOOL_INDEX.md]]** - Automation tools

---

## Notes

- **Protocols are Tier 2 (Mandatory)** - must follow when applicable
- **Gates enforce protocols** - checkpoints are hard locks
- **Research → Design → Blueprint → Code is sacred** - no skipping
- **Asset ingestion is non-negotiable** - search first, always
- **Evolution protocols prevent chaos** - workspace stays coherent

**Protocols are your process discipline.**

**Follow the protocol. Pass the gates. Deliver quality.**
