# Audit Protocol

**Authority Tier**: 2 (Mandatory Process)
**Gates Required**: Quality Gate, Complexity Gate (`gates/`)
**Index Reference**: See `indexes/PROTOCOL_INDEX.md`

## Purpose

This protocol defines **how AI models should self-audit** - the systematic process for critiquing design and implementation, identifying issues, and recommending improvements.

---

## Protocol Overview

**Periodic auditing prevents entropy.** Cursor should regularly audit the project to identify redundancy, cognitive overload, feature creep, and underused mechanics.

---

## Audit Types

### 1. Full System Audit

**When**: Major milestones, before releases, when complexity grows

**Scope**: Entire project - all systems, features, UX

**Focus**: Overall health, architecture, consistency

---

### 2. Feature-Specific Audit

**When**: After feature completion, when issues arise

**Scope**: Single feature or system

**Focus**: Feature quality, integration, usage

---

### 3. UX Audit

**When**: UI changes, user feedback, complexity increases

**Scope**: User interface, screens, flows

**Focus**: Cognitive load, clarity, consistency

---

### 4. Performance Audit

**When**: Performance issues, before optimization

**Scope**: Performance, optimization, efficiency

**Focus**: Bottlenecks, optimization opportunities

---

## Audit Process

### Step 1: Define Audit Scope

**What to define**:
- What to audit (system, feature, UX, etc.)
- What to look for (redundancy, complexity, etc.)
- What questions to answer
- What success looks like

**Example**:
```
Audit scope: Fusion System
Look for: Redundancy, complexity, underused features
Questions: Is it too complex? Are there unused features?
Success: Simpler, more focused system
```

---

### Step 2: Review Design Docs

**What to review**:
- Experience Pillars (Layer 1)
- Player Psychology (Layer 2)
- Core Loop (Layer 3)
- Systems Map (Layer 4)
- Mechanic Evolution (Layer 5)
- UX Decision Log (Layer 6)

**Questions to ask**:
- Does it serve the fantasy?
- Does it respect cognitive limits?
- Does it reinforce the loop?
- Is it appropriate for stage?

---

### Step 3: Analyze Codebase

**What to analyze**:
- Code structure
- System interactions
- Feature usage
- Complexity levels

**Tools**:
- Code analysis
- Usage tracking
- Complexity metrics
- Dependency analysis

---

### Step 4: Identify Issues

**What to identify**:

### Redundant Systems
- Duplicate functionality
- Overlapping systems
- Unused systems
- Systems that can be merged

### Cognitive Overload
- Too much information
- Too many choices
- Complex interactions
- Unclear feedback

### Feature Creep
- Features that don't serve core experience
- Features that break the loop
- Features that add complexity without depth
- Features that violate "must never become"

### Underused Mechanics
- Mechanics users ignore
- Mechanics that don't reinforce loop
- Mechanics that add friction
- Mechanics that can be removed

---

### Step 5: Evaluate Against Principles

**What to evaluate**:
- Does it serve the fantasy? (Experience Pillars)
- Does it respect cognitive limits? (Player Psychology)
- Does it reinforce the loop? (Core Loop)
- Is it redundant? (Systems Map)
- Is it appropriate? (Mechanic Evolution)
- Is it consistent? (UX Decision Log)

---

### Step 6: Recommend Actions

**What to recommend**:

### Removals
- What to remove
- Why to remove
- Impact of removal
- How to remove

### Simplifications
- What to simplify
- How to simplify
- Impact of simplification
- How to implement

### Improvements
- What to improve
- How to improve
- Impact of improvement
- How to implement

---

## Audit Output Format

Cursor should produce:

```markdown
# [Audit Type] Audit

## Redundant Systems

### [System Name]
- **Issue**: [What's redundant]
- **Recommendation**: [What to do]
- **Impact**: [What changes]
- **Priority**: [High/Medium/Low]

## Cognitive Overload

### [Area]
- **Issue**: [What's overwhelming]
- **Recommendation**: [How to simplify]
- **Impact**: [What improves]
- **Priority**: [High/Medium/Low]

## Feature Creep

### [Feature]
- **Issue**: [What doesn't serve core experience]
- **Recommendation**: [What to remove/change]
- **Impact**: [What improves]
- **Priority**: [High/Medium/Low]

## Underused Mechanics

### [Mechanic]
- **Issue**: [What's ignored/unused]
- **Recommendation**: [What to remove/improve]
- **Impact**: [What changes]
- **Priority**: [High/Medium/Low]

## Summary

### High Priority Actions
1. [Action 1]
2. [Action 2]

### Medium Priority Actions
1. [Action 1]
2. [Action 2]

### Recommended Timeline
- Immediate: [High priority actions]
- Short-term: [Medium priority actions]
- Long-term: [Low priority actions]
```

---

## Audit Principles

### 1. Subtraction is a Senior Skill

**Principle**: Removing is often better than adding

**Application**: Prioritize removals over additions

---

### 2. Simplicity Over Complexity

**Principle**: Simple solutions are usually better

**Application**: Simplify when possible

---

### 3. Core Experience First

**Principle**: Everything must serve the core experience

**Application**: Remove what doesn't serve

---

### 4. Cognitive Limits Matter

**Principle**: Respect user cognitive capacity

**Application**: Reduce cognitive load

---

### 5. Feature Creep Kills

**Principle**: More features ≠ better experience

**Application**: Remove unnecessary features

---

## Audit Frequency

**Guidelines**:
- **After major features**: Audit new features
- **Before releases**: Full system audit
- **When complexity grows**: Feature audit
- **When issues arise**: Targeted audit
- **Periodically**: Regular health checks

**Don't over-audit**: Audit when needed, not constantly

---

## Common Audit Mistakes

### 1. Not Auditing

**Problem**: Never auditing, entropy grows
**Solution**: Regular audits prevent issues

### 2. Over-Auditing

**Problem**: Auditing constantly, no progress
**Solution**: Audit when needed, not constantly

### 3. Ignoring Recommendations

**Problem**: Auditing but not acting
**Solution**: Prioritize and act on recommendations

### 4. Only Adding

**Problem**: Only recommending additions
**Solution**: Prioritize removals and simplifications

---

## Integration with Other Protocols

### Research Protocol

- Audit may trigger research
- Research informs audit recommendations
- Audit uses research findings

### Blueprint Protocol

- Audit may require blueprint updates
- Blueprints checked during audit
- Simplifications require blueprint updates

### Implementation Protocol

- Audit recommendations guide implementation
- Implementation addresses audit findings
- Audit validates implementation

---

## Next Steps After Audit

After audit is complete:

1. **Review Recommendations** - Evaluate suggestions
2. **Prioritize** - Decide what to act on
3. **Plan Changes** - Create blueprints for changes
4. **Implement** - Make removals/simplifications
5. **Re-audit** - Verify improvements

---

**This protocol ensures Cursor regularly critiques itself, identifies issues, and recommends intelligent improvements through subtraction and simplification.**


