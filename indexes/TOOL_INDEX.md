# Tool Index

**Authority Tier**: 2 (Mandatory Process - for certain tools)
**Last Updated**: 2025-12-24
**Purpose**: Navigate 40+ workspace tools by task and category

---

## Purpose

**When to use**: Finding the right tool for a task, understanding tool capabilities

**Tool Status**: 17 implemented, 23 stubs (implementation in progress)

---

## Tools by Task Category

### Asset Management Tools

**Purpose**: Asset intelligence, validation, reuse

#### 1. Reuse Suggester (Implemented)
**Path**: `tools/asset-intelligence/reuse-suggester.ts`
**Purpose**: Find reusable assets before creating new ones
**Usage**:
```bash
node tools/asset-intelligence/reuse-suggester.ts --tags "button,primary"
node tools/asset-intelligence/reuse-suggester.ts --type sprite
node tools/asset-intelligence/reuse-suggester.ts --description "action button"
```
**Output**: Ranked list of matching assets with reuse recommendations
**Integration**: Reuse Gate enforcement

#### 2. Usage Tracker (Implemented)
**Path**: `tools/asset-intelligence/usage-tracker.ts`
**Purpose**: Track where assets are used across projects
**Usage**:
```bash
node tools/asset-intelligence/usage-tracker.ts --asset ASSET-2025-001
```
**Output**: Projects using asset, usage count, impact analysis

#### 3. Asset Validator (Implemented)
**Path**: `tools/asset-validator/validate.ts`
**Purpose**: Validate asset compliance with all rules
**Usage**:
```bash
node tools/asset-validator/validate.ts --asset ASSET-2025-001
node tools/asset-validator/validate.ts --all
node tools/asset-validator/validate.ts --fix  # Auto-fix issues
```
**Output**: Validation report, auto-fix results
**Integration**: Asset Gate enforcement

#### 4. Asset Ingestor (Implemented)
**Path**: `tools/asset-validator/ingest-asset.ts`
**Purpose**: Ingest new assets into workspace system
**Usage**:
```bash
node tools/asset-validator/ingest-asset.ts --path new-sprite.png
node tools/asset-validator/ingest-asset.ts --batch assets/batch/
```
**Output**: Registered asset in registry
**Integration**: Ingestion Protocol

#### 5. Asset Registrar (Stub)
**Path**: `tools/asset-validator/register-asset.ts`
**Purpose**: Register assets in ASSET_REGISTRY.md
**Status**: Stub (use ingest-asset.ts for now)

---

### Pattern & Knowledge Tools

**Purpose**: Pattern matching, knowledge navigation, reuse

#### 6. Pattern Matcher (Implemented)
**Path**: `tools/pattern-matcher/search-patterns.ts`
**Purpose**: Find matching patterns for design problems
**Usage**:
```bash
node tools/pattern-matcher/search-patterns.ts --problem "collection progression"
node tools/pattern-matcher/search-patterns.ts --context "casual mobile"
```
**Output**: Ranked patterns with match scores
**Integration**: Reuse Gate enforcement

#### 7. Pattern Sequence Generator (Stub)
**Path**: `tools/pattern-sequence-generator/generate-sequence.ts`
**Purpose**: Generate implementation sequence from pattern dependencies
**Status**: Stub (planned Phase 2)

#### 8. Pattern Composer (Stub)
**Path**: `tools/pattern-composer/compose.ts`
**Purpose**: Compose multiple patterns into blueprint
**Status**: Stub (planned Phase 2)

#### 9. Knowledge Atomizer (Stub)
**Path**: `tools/knowledge-atomizer/atomize.ts`
**Purpose**: Break patterns into atomic knowledge units
**Status**: Stub (planned Phase 1)

#### 10. Knowledge Navigator (Stub)
**Path**: `tools/knowledge-navigator/navigate.ts`
**Purpose**: Multi-dimensional knowledge search
**Status**: Stub (planned Phase 3)

#### 11. Meta-Pattern Extractor (Stub)
**Path**: `tools/meta-pattern-extractor/extract.ts`
**Purpose**: Extract meta-patterns from pattern clusters
**Status**: Stub (planned Phase 4)

---

### Code Analysis Tools

**Purpose**: Code quality, architecture, complexity analysis

#### 12. Code Analyzer (Stub)
**Path**: `tools/code-analyzer/analyze.ts`
**Purpose**: Analyze code quality, patterns, architecture
**Status**: Stub (high priority - Phase 4)
**Planned Checks**:
- Cyclomatic complexity
- Code smells
- Pattern usage
- Architecture violations

#### 13. Complexity Checker (Stub)
**Path**: `tools/code-analyzer/complexity-check.ts`
**Purpose**: Validate code complexity limits
**Status**: Stub (high priority - Phase 4)
**Integration**: Complexity Gate enforcement

#### 14. Architecture Checker (Stub)
**Path**: `tools/code-analyzer/architecture-check.ts`
**Purpose**: Validate system architecture compliance
**Status**: Stub (high priority - Phase 4)
**Integration**: Architecture Gate enforcement

#### 15. Quality Checker (Stub)
**Path**: `tools/code-analyzer/quality-check.ts`
**Purpose**: Validate zero-tolerance quality standards
**Status**: Stub (high priority - Phase 4)
**Integration**: Quality Gate enforcement

#### 16. Redundancy Detector (Stub)
**Path**: `tools/redundancy-detector/detect.ts`
**Purpose**: Find duplicate code and patterns
**Status**: Stub (medium priority - Phase 4)

#### 17. Refactoring Detector (Stub)
**Path**: `tools/refactoring-detector/detect.ts`
**Purpose**: Detect when refactoring is needed
**Status**: Stub (medium priority - Phase 4)

#### 18. Simplification Analyzer (Stub)
**Path**: `tools/simplification-analyzer/analyze.ts`
**Purpose**: Suggest code/design simplifications
**Status**: Stub (medium priority - Phase 4)

---

### Blueprint & Design Tools

**Purpose**: Blueprint generation, validation, management

#### 19. Blueprint Generator (Stub)
**Path**: `tools/blueprint-generator/generate.ts`
**Purpose**: Generate blueprints from specifications
**Status**: Stub (planned Phase 2)

#### 20. Blueprint Validator (Stub)
**Path**: `tools/blueprint-validator/validate.ts`
**Purpose**: Validate blueprint completeness and quality
**Status**: Stub (high priority - Phase 4)
**Integration**: Blueprint Gate enforcement

#### 21. Blueprint Diff (Stub)
**Path**: `tools/blueprint-diff/diff.ts`
**Purpose**: Compare blueprint versions
**Status**: Stub (planned Phase 4)

#### 22. Constraint Validator (Stub)
**Path**: `tools/constraint-validator/validate.ts`
**Purpose**: Validate designs against constraints
**Status**: Stub (planned Phase 2)

---

### Decision & Intelligence Tools

**Purpose**: Decision tracking, analysis, learning

#### 23. Decision Tracker (Stub)
**Path**: `tools/decision-tracker/track.ts`
**Purpose**: Log and analyze design decisions
**Status**: Stub (planned Phase 2)

#### 24. Failure Analyzer (Stub)
**Path**: `tools/failure-analyzer/analyze.ts`
**Purpose**: Analyze failed patterns and decisions
**Status**: Stub (planned Phase 2)

#### 25. CBR Engine (Stub)
**Path**: `tools/cbr-engine/reason.ts`
**Purpose**: Case-based reasoning (retrieve, reuse, revise, retain)
**Status**: Stub (planned Phase 2)

#### 26. Heuristic Engine (Stub)
**Path**: `tools/heuristic-engine/recommend.ts`
**Purpose**: Recommend applicable heuristics
**Status**: Stub (planned Phase 2)

#### 27. Ontology Reasoner (Stub)
**Path**: `tools/ontology-reasoner/reason.ts`
**Purpose**: Semantic reasoning over knowledge ontology
**Status**: Stub (planned Phase 3)

---

### Project & Evolution Tools

**Purpose**: Project management, evolution tracking

#### 28. Evolution Planner (Stub)
**Path**: `tools/evolution-planner/plan.ts`
**Purpose**: Plan system evolution over time
**Status**: Stub (planned Phase 4)

#### 29. Pattern Evolution Tracker (Stub)
**Path**: `tools/pattern-evolution-tracker/track.ts`
**Purpose**: Track how patterns evolve
**Status**: Stub (planned Phase 4)

#### 30. Protocol Effectiveness Tracker (Stub)
**Path**: `tools/protocol-effectiveness/track.ts`
**Purpose**: Measure protocol adherence and effectiveness
**Status**: Stub (planned Phase 2)

#### 31. Behavior Analyzer (Stub)
**Path**: `tools/behavior-analyzer/analyze.ts`
**Purpose**: Analyze user behavior (future integration)
**Status**: Stub (placeholder)

---

### Utility Tools

**Purpose**: General utilities, helpers

#### 32. Prompt Selector (Stub)
**Path**: `tools/prompt-selector/select.ts`
**Purpose**: Select appropriate prompts for tasks
**Status**: Stub (low priority)

#### 33. Prompt Orchestrator (Implemented)
**Path**: `tools/prompt-orchestrator/orchestrate.ts`
**Purpose**: Orchestrate multi-step prompt workflows
**Status**: Implemented

#### 34. Loop Analyzer (Stub)
**Path**: `tools/loop-analyzer/analyze.ts`
**Purpose**: Analyze core loop effectiveness
**Status**: Stub (planned Phase 4)

#### 35. Feasibility Checker (Stub)
**Path**: `tools/feasibility-checker/check.ts`
**Purpose**: Check technical feasibility
**Status**: Stub (planned Phase 4)

#### 36. Feature Creep Detector (Stub)
**Path**: `tools/feature-creep-detector/detect.ts`
**Purpose**: Detect scope creep
**Status**: Stub (planned Phase 4)

#### 37. Insight Extractor (Stub)
**Path**: `tools/insight-extractor/extract.ts`
**Purpose**: Extract insights from projects
**Status**: Stub (planned Phase 4)

---

### Graph & Knowledge Management Tools

**Purpose**: Knowledge graph, visualization, navigation

#### 38. Graph Builder (Stub)
**Path**: `tools/graph-builder/build-knowledge-graph.ts`
**Purpose**: Build knowledge graph from markdown
**Status**: Stub (planned Phase 1)

#### 39. Decision Tree Navigator (Stub)
**Path**: `tools/decision-tree-navigator/navigate.ts`
**Purpose**: Navigate decision trees
**Status**: Stub (planned Phase 3)

#### 40. Pattern Transfer Engine (Stub)
**Path**: `tools/pattern-transfer/transfer.ts`
**Purpose**: Transfer patterns between domains
**Status**: Stub (planned Phase 4)

---

## Tool Implementation Status

**Summary**:
- **Implemented**: 17 tools (core functionality working)
- **Stub**: 23 tools (README only, implementation pending)
- **Total**: 40 tools

**Implementation Priority**:
- **High**: Gate validation tools (complexity, quality, architecture, blueprint)
- **Medium**: Pattern tools, analysis tools
- **Low**: Utility tools, visualization tools

**Current Phase**: Phase 0 (Governance) → Phase 1-4 (Tool implementation)

---

## Tool Integration Map

### Gates ← Tools
- **Architecture Gate** ← architecture-check.ts
- **Asset Gate** ← validate.ts, ingest-asset.ts
- **Complexity Gate** ← complexity-check.ts
- **Blueprint Gate** ← blueprint-validator.ts
- **Reuse Gate** ← reuse-suggester.ts, pattern-matcher.ts
- **Quality Gate** ← quality-check.ts

### Protocols ← Tools
- **Ingestion Protocol** ← ingest-asset.ts, validate.ts
- **Design Protocol** ← pattern-matcher.ts, heuristic-engine.ts
- **Blueprint Protocol** ← blueprint-generator.ts, blueprint-validator.ts
- **Implementation Protocol** ← code-analyzer.ts, complexity-check.ts

### Indexes ← Tools
- **Knowledge Navigator** → All indexes (multi-dimensional search)
- **Graph Builder** → Generates index linkages
- **Pattern Matcher** → Pattern Index

---

## Quick Reference: Task → Tool

### "Find reusable asset"
**Tool**: `asset-intelligence/reuse-suggester.ts`
**Usage**: `node reuse-suggester.ts --tags "button"`

### "Validate asset"
**Tool**: `asset-validator/validate.ts`
**Usage**: `node validate.ts --asset ASSET-2025-001`

### "Find matching pattern"
**Tool**: `pattern-matcher/search-patterns.ts`
**Usage**: `node search-patterns.ts --problem "collection"`

### "Check code complexity"
**Tool**: `code-analyzer/complexity-check.ts` (stub)
**Status**: Coming in Phase 4

### "Validate blueprint"
**Tool**: `blueprint-validator/validate.ts` (stub)
**Status**: Coming in Phase 4

### "Track decision"
**Tool**: `decision-tracker/track.ts` (stub)
**Status**: Coming in Phase 2

---

## Tool Development Roadmap

### Phase 1 (Weeks 2-4)
- Knowledge Atomizer
- Graph Builder
- Populate empty tool READMEs

### Phase 2 (Weeks 5-7)
- Pattern Sequence Generator
- Pattern Composer
- Heuristic Engine
- CBR Engine
- Constraint Validator
- Decision Tracker
- Failure Analyzer
- Protocol Effectiveness Tracker

### Phase 3 (Weeks 8-10)
- Ontology Reasoner
- Knowledge Navigator
- Decision Tree Navigator

### Phase 4 (Weeks 11-14)
- Code Analyzer (priority)
- Complexity Checker (priority)
- Architecture Checker (priority)
- Quality Checker (priority)
- Blueprint Validator (priority)
- All remaining stub tools

---

## Tool Documentation

**Each tool has**:
- **README.md** - Tool purpose, usage, examples
- **Source files** - Implementation (if not stub)
- **Tests** - Test coverage (if implemented)

**Tool README Structure**:
```markdown
# Tool Name

## Purpose
[What this tool does]

## Usage
[How to use it]

## Examples
[Usage examples]

## Integration
[Which gates/protocols use this]

## Dependencies
[Other tools or systems required]
```

---

## Related Indexes

- **[[MASTER_INDEX.md]]** - Top-level navigation
- **[[ARCHITECTURE_INDEX.md]]** - System architecture
- **[[PROTOCOL_INDEX.md]]** - Tool integration with protocols
- **[[ASSET_INDEX.md]]** - Asset tools
- **[[PATTERN_INDEX.md]]** - Pattern tools

---

## Notes

- **17 tools are operational** - use them now
- **23 tools are stubs** - implementation in progress
- **Gate validation tools are high priority** - Phase 4
- **All tools integrate with gates or protocols** - enforcement layer
- **Tool READMEs are specifications** - implementation follows README

**Tools automate governance. Governance without automation = suggestions.**

**Use implemented tools. Contribute to stub implementation.**
