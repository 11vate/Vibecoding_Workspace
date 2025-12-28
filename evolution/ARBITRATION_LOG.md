# Arbitration Log

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Log conflicts and their resolutions

---

## Purpose

**Philosophy**: Conflicts reveal edge cases. Resolutions become wisdom.

**Rule**: ALL conflicts logged here with resolution rationale.

---

## What Gets Logged

### Conflict Types

**1. Tier Conflicts**
- Tier 3 recommendation contradicts Tier 1 law
- Unclear which tier applies
- Multiple tier 2 processes conflict

**2. Gate Conflicts**
- Multiple gates give contradictory guidance
- Gate requirements impossible to satisfy simultaneously
- Gate vs manual judgment disagreement

**3. Pattern Conflicts**
- Multiple patterns recommended with mutual exclusivity
- Pattern A requires Pattern B, but B conflicts with context
- Cross-domain pattern transfer ambiguity

**4. Design Conflicts**
- DIS layers give contradictory guidance
- Design conflicts with implementation constraints
- Multiple valid design approaches

**5. Tool Conflicts**
- Multiple tools suggest different actions
- Tool output vs human judgment
- Tool validation vs manual review

---

## Log Format

```markdown
## Conflict: [ID] - [Brief Description]

**Date**: [ISO date]
**Type**: [Tier | Gate | Pattern | Design | Tool]
**Severity**: [Low | Medium | High | Critical]
**Context**: [What task/situation]

### Conflict Description
[Detailed description of the conflict]

### Conflicting Parties
1. **Party A**: [What it says/requires]
   - Source: [File/rule/tool]
   - Tier: [If applicable]

2. **Party B**: [What it says/requires]
   - Source: [File/rule/tool]
   - Tier: [If applicable]

### Resolution
**Decision**: [What was decided]
**Rationale**: [Why this resolution]
**Resolved By**: [Human | AI | Consensus]
**Precedence Used**: [Which tier/rule took priority]

### Outcome
**Result**: [What happened after resolution]
**Learned**: [What wisdom extracted]
**Heuristic**: [New heuristic added? Yes/No]

### Related
- **Similar Conflicts**: [Links to related conflicts]
- **Affected Files**: [Files updated as result]
- **Gate Updates**: [Any gates modified]
```

---

## Example Conflicts

### Example 1: Tier Conflict

```markdown
## Conflict: ARB-2025-001 - Complexity Gate vs Accessibility

**Date**: 2025-12-24
**Type**: Tier
**Severity**: Medium
**Context**: Implementing tutorial with accessibility features

### Conflict Description
Complexity Gate (Tier 2) requires ≤ 3 new concepts per screen.
Accessibility requirements (Tier 1, from .cursorrules) require ARIA labels, keyboard nav, screen reader support.
Tutorial screen introduces: (1) fusion mechanic, (2) selection UI, (3) result preview.
Adding full accessibility adds 2 more concepts: (4) keyboard shortcuts, (5) screen reader instructions.
Total: 5 concepts → violates Complexity Gate.

### Conflicting Parties
1. **Complexity Gate (Tier 2)**
   - Requires: ≤ 3 new concepts per screen
   - Source: gates/complexity-gate.md
   - Tier: 2

2. **Accessibility Requirement (Tier 1)**
   - Requires: Full keyboard nav + screen reader support
   - Source: .cursorrules lines 113-115
   - Tier: 1

### Resolution
**Decision**: Tier 1 overrides Tier 2. Implement full accessibility.
**Rationale**: Constitution precedence hierarchy - Tier 1 > Tier 2.
Accessibility is immutable law, Complexity Gate is process.
Complexity Gate must be met *within accessibility constraints*.
**Resolved By**: Constitution (automatic)
**Precedence Used**: Tier 1 > Tier 2

### Outcome
**Result**: Implemented full accessibility (5 concepts).
Tutorial split into 2 screens to reduce cognitive load:
  - Screen 1: Fusion mechanic + selection UI (2 concepts)
  - Screen 2: Result preview + keyboard/screen reader (3 concepts)
Both screens now pass Complexity Gate while maintaining accessibility.

**Learned**: Tier 1 laws are constraints, not guidelines.
Design must satisfy Tier 1 first, then optimize within those bounds.

**Heuristic**: Added to heuristic database:
"When Tier 1 accessibility conflicts with Complexity Gate, split into multiple screens/steps to satisfy both."
```

---

### Example 2: Pattern Conflict

```markdown
## Conflict: ARB-2025-002 - Fusion Pattern vs Simple Tap

**Date**: 2025-12-25
**Type**: Pattern
**Severity**: Low
**Context**: Designing collection mechanic for ultra-casual mobile game

### Conflict Description
Pattern search returned two high-scoring patterns:
- PATTERN-FUSION-001 (score: 85) - Proven success, high engagement
- PATTERN-SIMPLE-TAP-001 (score: 80) - Better for ultra-casual, faster sessions

Fusion requires: selection UI, combination logic, discovery element (complex)
Simple Tap requires: single tap action (very simple)

Target: Ultra-casual, 30-second sessions
Fusion: Typical session 45-60 seconds
Simple Tap: Typical session 20-30 seconds

### Conflicting Parties
1. **PATTERN-FUSION-001**
   - Pros: 88% success rate, high engagement, proven
   - Cons: Too complex for ultra-casual, session too long
   - Source: knowledge-base/mechanics-library.md

2. **PATTERN-SIMPLE-TAP-001**
   - Pros: Perfect session length, ultra-casual friendly
   - Cons: Lower engagement, less proven (60% success rate)
   - Source: knowledge-base/mechanics-library.md

### Resolution
**Decision**: Create adapted pattern PATTERN-QUICK-FUSION-001
**Rationale**: Neither pattern perfect as-is.
Fusion too complex, Simple Tap too simple.
Adapt fusion for ultra-casual: automatic selection + single tap.
Maintains fusion discovery, reduces interaction complexity.
**Resolved By**: Human (designer)
**Precedence Used**: Context-specific adaptation (Tier 3)

### Outcome
**Result**: Created PATTERN-QUICK-FUSION-001:
- Auto-selects compatible pets
- Single tap to fuse
- Discovery element preserved
- Session time: 25-35 seconds (target met)

**Learned**: High-success patterns can be adapted to new contexts.
Context (ultra-casual) trumps pattern purity.
Adaptation > Abandonment when core value can be preserved.

**Heuristic**: Added:
"When pattern score high but context mismatches, adapt pattern to context rather than choosing lower-score alternative."
```

---

## Conflict Resolution Strategies

### Strategy 1: Tier Precedence (Automatic)
**When**: Clear tier hierarchy applies
**Resolution**: Higher tier wins
**Example**: Tier 1 accessibility > Tier 2 complexity

### Strategy 2: Context Adaptation
**When**: Multiple valid approaches, context decides
**Resolution**: Adapt to context constraints
**Example**: Pattern adaptation for ultra-casual

### Strategy 3: Constraint Satisfaction
**When**: Both requirements are valid
**Resolution**: Redesign to satisfy both
**Example**: Split into multiple screens

### Strategy 4: Domain Expert Judgment
**When**: Technical expertise required
**Resolution**: Human arbitration
**Example**: Performance vs feature trade-off

### Strategy 5: User Impact Priority
**When**: Unclear which rule more important
**Resolution**: Prioritize user experience
**Example**: Accessibility > aesthetic preference

---

## Conflict Patterns

Track recurring conflicts to update rules:

```markdown
## Recurring Conflict Patterns

### Pattern: Accessibility vs Complexity
**Frequency**: 3 occurrences
**Resolution**: Always split into steps to satisfy both
**Action**: Update Complexity Gate to note accessibility exemption

### Pattern: Reuse vs Perfect Fit
**Frequency**: 5 occurrences
**Resolution**: Usually adapt existing over create new
**Action**: Update Reuse Gate guidance

[Add more as conflicts repeat]
```

---

## Arbitration Log (Chronological)

### 2025 Conflicts

*No conflicts logged yet.*

**Future entries will appear here in chronological order using the format above.**

---

## Metrics

```markdown
## Conflict Metrics (Quarterly)

- **Total Conflicts**: 0
- **By Type**:
  - Tier: 0
  - Gate: 0
  - Pattern: 0
  - Design: 0
  - Tool: 0

- **By Severity**:
  - Critical: 0
  - High: 0
  - Medium: 0
  - Low: 0

- **By Resolution**:
  - Tier Precedence: 0
  - Context Adaptation: 0
  - Constraint Satisfaction: 0
  - Human Judgment: 0

- **Heuristics Generated**: 0

**Health**: N/A (no conflicts yet)
```

---

## Notes

- **Conflicts are learning opportunities** - not failures
- **Resolution rationale matters** - becomes future wisdom
- **Patterns reveal system gaps** - update rules when conflicts repeat
- **Transparency builds trust** - log everything, hide nothing
- **Heuristics compound** - today's resolution informs tomorrow's decision

**Log conflicts. Extract wisdom. Improve system.**
