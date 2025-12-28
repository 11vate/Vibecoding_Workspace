# Pattern Index

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Navigate pattern libraries for research and reuse

---

## Purpose

**When to use**: Pattern research, design ideation, reuse validation

**CRITICAL**: Always search patterns BEFORE creating new ones (Reuse Gate enforces this)

---

## Pattern Libraries

### Primary Pattern Libraries

#### 1. Mechanics Library
**File**: `knowledge-base/mechanics-library.md`
**Content**: Game/app mechanics patterns
**Categories**:
- Collection mechanics
- Progression mechanics
- Discovery mechanics
- Crafting/fusion mechanics
- Idle/passive mechanics

**When to use**:
- Designing new mechanics
- Finding proven patterns
- Validating mechanic ideas

#### 2. UI Pattern Library
**File**: `knowledge-base/ui-pattern-library.md`
**Content**: User interface patterns
**Categories**:
- Navigation patterns
- Input patterns
- Feedback patterns
- Layout patterns
- Accessibility patterns

**When to use**:
- Designing UI flows
- Solving UX problems
- Ensuring consistency

#### 3. Progression Systems
**File**: `knowledge-base/progression-systems.md`
**Content**: Player/user progression patterns
**Categories**:
- Linear progression
- Branching progression
- Gated progression
- Skill trees
- Unlock systems

**When to use**:
- Designing progression
- Balancing difficulty curves
- Planning content gating

#### 4. Successful Patterns
**File**: `knowledge-base/accumulated-wisdom/successful-patterns.md`
**Content**: Proven patterns from past projects
**Metadata**: Success rates, project usage, outcomes

**When to use**:
- High-stakes decisions
- Validating pattern choice
- Learning from history

---

## Pattern Search Strategy

### Step 1: Define Problem
```markdown
Problem: Need to design a collection progression mechanic
Context: Casual mobile game, discovery-focused
Constraints: Simple controls, 60-second sessions
```

### Step 2: Search Pattern Libraries

**Search Order**:
1. **Successful Patterns** first (proven in your projects)
2. **Mechanics Library** second (domain-specific)
3. **Related libraries** third (UI, progression, etc.)

**Search Dimensions**:
- Category match
- Tag overlap
- Problem similarity
- Context compatibility

### Step 3: Evaluate Matches

```typescript
interface PatternMatch {
  pattern_id: string;
  pattern_name: string;
  match_score: number; // 0-100
  match_reasons: string[];
  success_rate?: number;
  projects_used?: number;
  recommendation: 'perfect' | 'good' | 'adaptable' | 'poor';
}
```

**Evaluation Criteria**:
- Problem alignment (30%)
- Context fit (25%)
- Success history (20%)
- Complexity match (15%)
- Constraint compatibility (10%)

### Step 4: Decision Matrix

| Match Score | Recommendation | Action |
|-------------|----------------|--------|
| 80-100 | Perfect | Reuse as-is |
| 60-79 | Good | Reuse with minor adaptation |
| 40-59 | Adaptable | Adapt to context |
| 20-39 | Poor | Use as inspiration, create variant |
| 0-19 | No Match | Create new (with justification) |

---

## Pattern Categories

### Mechanic Patterns

**File locations**:
- `knowledge-base/mechanics-library.md`
- `knowledge-base/pattern-language/patterns/mechanic-*.md`

**Common Patterns**:
- **PATTERN-FUSION-001**: Fusion-based collection progression
- **PATTERN-IDLE-001**: Passive/idle collection systems
- **PATTERN-CRAFTING-001**: Recipe-based crafting
- **PATTERN-DISCOVERY-001**: Exploration-driven discovery
- **PATTERN-MATCHING-001**: Match-3 style mechanics

**Pattern Structure**:
```markdown
## Pattern ID: PATTERN-FUSION-001

### Problem
Need engaging collection progression with discovery element

### Context
Casual games, collection-focused, discovery mechanics

### Solution
Combine existing items to create new, rarer items
Players collect base items, fuse them to discover unknowns

### Consequences
+ High engagement (discovery dopamine)
+ Scalable content (combinatorial explosion)
+ Natural progression curve
- Risk of overwhelming complexity
- Requires balancing rarity curves

### Success Rate
88% (5 projects successfully implemented)

### Examples
- PixelPets Reborn (fusion mechanic)
- [Other projects...]
```

### UI Patterns

**File locations**:
- `knowledge-base/ui-pattern-library.md`
- `knowledge-base/pattern-language/patterns/ui-*.md`

**Common Patterns**:
- **PATTERN-MODAL-001**: Modal dialog patterns
- **PATTERN-NAV-001**: Bottom navigation (mobile)
- **PATTERN-FEEDBACK-001**: Visual feedback systems
- **PATTERN-TUTORIAL-001**: Progressive disclosure tutorials
- **PATTERN-GESTURE-001**: Touch gesture patterns

### Progression Patterns

**File locations**:
- `knowledge-base/progression-systems.md`
- `knowledge-base/pattern-language/patterns/progression-*.md`

**Common Patterns**:
- **PATTERN-LINEAR-001**: Linear level progression
- **PATTERN-BRANCH-001**: Branching skill trees
- **PATTERN-UNLOCK-001**: Sequential unlocks
- **PATTERN-MILESTONE-001**: Milestone-based progression
- **PATTERN-ACHIEVEMENT-001**: Achievement systems

---

## Pattern Language Grammar

**File**: `knowledge-base/pattern-language/grammar.md`

### Pattern Relationships

**Relationship Types**:
- **Requires**: Pattern A requires Pattern B to work
- **Enhances**: Pattern A is better with Pattern B
- **Complements**: Patterns work well together
- **Conflicts**: Patterns should not be used together
- **Extends**: Pattern A is specialized version of Pattern B

**Example**:
```
PATTERN-FUSION-001 (Fusion Mechanic)
  ├─ Requires: PATTERN-COLLECTION-001 (base items to fuse)
  ├─ Enhances: PATTERN-DISCOVERY-001 (discovery element)
  ├─ Complements: PATTERN-RARITY-001 (rarity tiers)
  ├─ Conflicts: PATTERN-SIMPLE-TAP-001 (too complex for ultra-casual)
  └─ Extends: PATTERN-COMBINATION-001 (generic combination pattern)
```

### Pattern Composition

**Composing Multiple Patterns**:
```markdown
Goal: Collection game with discovery and progression

Selected Patterns:
1. PATTERN-COLLECTION-001 (base mechanic)
2. PATTERN-FUSION-001 (adds discovery)
3. PATTERN-UNLOCK-001 (adds progression)

Composition Check:
✅ FUSION requires COLLECTION (satisfied)
✅ UNLOCK complements both
❌ No conflicts detected

Result: Valid composition
```

---

## Tools for Pattern Work

### Pattern Matcher Tool
**Path**: `tools/pattern-matcher/`
**Usage**:
```bash
node tools/pattern-matcher/search-patterns.ts --problem "collection progression" --context "casual mobile"
```
**Output**: Ranked list of matching patterns

### Pattern Sequence Generator
**Path**: `tools/pattern-sequence-generator/`
**Usage**:
```bash
node tools/pattern-sequence-generator/generate-sequence.ts --goal "PATTERN-FUSION-001"
```
**Output**: Implementation sequence with dependencies

### Pattern Composer
**Path**: `tools/pattern-composer/`
**Usage**:
```bash
node tools/pattern-composer/compose.ts --patterns "PATTERN-FUSION-001,PATTERN-RARITY-001"
```
**Output**: Composite blueprint

---

## Reuse Protocol (CRITICAL)

**Enforced by**: Reuse Gate (`gates/reuse-gate.md`)

### Mandatory Steps

**1. ALWAYS Search First**
```bash
# Before creating ANY pattern
node tools/pattern-matcher/search-patterns.ts --query "[your problem]"
```

**2. Evaluate Results**
- Score ≥ 60: REUSE existing
- Score 40-59: ADAPT existing
- Score < 40: CREATE NEW (with justification)

**3. Document Decision**
```markdown
## Pattern Reuse Decision

### Search Performed: ✅
- Query: "collection progression mechanic"
- Results: 3 patterns found
- Best Match: PATTERN-FUSION-001 (score: 88)

### Decision: REUSE PATTERN-FUSION-001
Rationale: Perfect alignment with requirements,
proven success rate (88%), used in 5 projects

### Adaptation: Minor
- Adjust rarity curve for mobile context
- Simplify UI for smaller screens
```

**4. If Creating New**
```markdown
## Justification for New Pattern

### Existing Patterns Considered:
1. PATTERN-FUSION-001 - Score: 45 (too complex)
2. PATTERN-CRAFTING-001 - Score: 35 (wrong context)

### Why Inadequate:
Existing patterns assume desktop/longer sessions.
This project requires sub-30-second sessions on mobile.
Existing patterns cannot be simplified without losing core value.

### New Pattern: PATTERN-QUICK-FUSION-001
Rationale: Simplified fusion for ultra-casual mobile
```

---

## Pattern Success Metrics

Track pattern effectiveness:

```markdown
## Pattern Performance (Quarterly Review)

### Top 5 Most Used Patterns
1. PATTERN-FUSION-001 (88% success, 5 projects)
2. PATTERN-COLLECTION-001 (92% success, 8 projects)
3. PATTERN-TUTORIAL-001 (85% success, 7 projects)
4. PATTERN-MODAL-001 (95% success, 12 projects)
5. PATTERN-RARITY-001 (80% success, 6 projects)

### Pattern Reuse Rate
- Total Pattern Requests: 45
- Reused Existing: 32 (71%)
- Adapted Existing: 8 (18%)
- Created New: 5 (11%)

Target: > 70% reuse → ✅ Met
```

---

## Cross-Domain Patterns

**Directory**: `knowledge-base/cross-domain-patterns/`

### Patterns from Other Domains

**Sources**:
- Architecture (Christopher Alexander)
- Biology (evolutionary patterns)
- Psychology (cognitive patterns)
- Economics (market patterns)
- Music (compositional patterns)

**Example Transfer**:
```markdown
Source Pattern: Distributed Computing (Tech)
Core Principle: Partition work, aggregate results
Transfer to: Game Design
Application: Idle game workers collecting resources
Pattern ID: PATTERN-IDLE-WORKERS-001
```

**File**: `knowledge-base/cross-domain-patterns/transfer-index.json`

---

## Meta-Patterns

**Directory**: `knowledge-base/meta-patterns/`

**What are Meta-Patterns?**
Patterns about patterns - structural similarities across pattern families

**Example Meta-Pattern**:
```markdown
META-PATTERN: Resource Transformation

Common Structure across patterns:
1. Input resources (varied types)
2. Transformation process (varied mechanics)
3. Output resources (varied results)
4. Feedback loop (varied timing)

Instances:
- PATTERN-FUSION-001 (pets → fusion → new pet)
- PATTERN-CRAFTING-001 (items → crafting → new item)
- PATTERN-COOKING-001 (ingredients → cooking → dish)
- PATTERN-ALCHEMY-001 (elements → transmute → potion)

Common Design Decisions:
- Input selection UX
- Transformation timing (instant vs time-based)
- Output randomness vs determinism
- Feedback presentation
```

---

## Pattern Evolution Tracking

**File**: `knowledge-base/pattern-evolution-tracker/`

Track how patterns evolve over time:

```markdown
## Pattern Evolution: PATTERN-FUSION-001

### Version History
- v1.0 (2023-05): Initial creation
- v1.1 (2023-08): Added element matching bonus
- v2.0 (2024-01): Refactored for mobile (simplified UI)
- v2.1 (2024-06): Added cooldown mechanic

### Evolution Trends
- Increasing: Simplicity (mobile adaptation)
- Decreasing: Complexity (streamlined for casual)
- Stable: Core mechanic (fusion concept unchanged)

### Lifecycle Stage: Mature
Pattern is stable, proven, widely used
```

---

## Quick Reference: Task → Patterns

### "Design collection mechanic"
1. Search: `mechanics-library.md` → Collection section
2. Match: PATTERN-COLLECTION-001, PATTERN-FUSION-001
3. Tool: `pattern-matcher/search-patterns.ts`
4. Reuse: Score ≥ 60

### "Design UI flow"
1. Search: `ui-pattern-library.md` → Navigation/Flow section
2. Match: PATTERN-NAV-001, PATTERN-MODAL-001
3. Tool: `pattern-matcher/search-patterns.ts`
4. Reuse: Score ≥ 60

### "Design progression"
1. Search: `progression-systems.md`
2. Match: PATTERN-LINEAR-001, PATTERN-UNLOCK-001
3. Tool: `pattern-matcher/search-patterns.ts`
4. Reuse: Score ≥ 60

### "Validate pattern choice"
1. Load: `accumulated-wisdom/successful-patterns.md`
2. Check: Success rate, project usage
3. Consult: Project Memory (Layer 15)

---

## Related Indexes

- **[[MASTER_INDEX.md]]** - Top-level navigation
- **[[DESIGN_INDEX.md]]** - Design intelligence layers
- **[[TOOL_INDEX.md]]** - Pattern tools
- **[[PROTOCOL_INDEX.md]]** - Pattern protocols

---

## Gates Required

Before using or creating patterns:

1. **Reuse Gate** - Pattern search MANDATORY
2. **Blueprint Gate** - Pattern integration in blueprint

---

## Notes

- **Search is MANDATORY** - Reuse Gate enforces
- **Success rates guide decisions** - proven patterns preferred
- **Pattern composition is powerful** - combine don't duplicate
- **Meta-patterns reveal structure** - learn from clusters
- **Evolution tracking informs** - patterns mature over time

**Pattern libraries are compressed wisdom from past projects.**

**Search first. Reuse when possible. Create with justification.**
