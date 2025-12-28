# Audit Prompt

## Purpose

Use this prompt to activate **Self-Auditing Mode** - Cursor critiques the current design and implementation, identifying issues and recommending improvements.

---

## The Prompt Template

```
@Docs
@Codebase

Audit the current design and implementation for:
- Redundant systems
- Cognitive overload
- Feature creep
- Underused mechanics

Recommend removals and simplifications.
```

---

## Usage Examples

### Full System Audit

```
@Docs/prompts/audit-prompt.md
@Docs
@Codebase

Audit the entire project for:
- Redundant systems
- Cognitive overload
- Feature creep
- Underused mechanics

Recommend removals and simplifications.
```

### Feature-Specific Audit

```
@Docs/prompts/audit-prompt.md
@Docs/design-intelligence/layer-4-systems-map.md
@Codebase

Audit the Fusion System for:
- Redundant functionality
- Unnecessary complexity
- Unused features
- Optimization opportunities

Recommend removals and simplifications.
```

### UX Audit

```
@Docs/prompts/audit-prompt.md
@Docs/design-intelligence/layer-6-ux-decision-log.md
@Codebase

Audit the UI/UX for:
- Cognitive overload
- Unnecessary screens
- Confusing flows
- Redundant interactions

Recommend removals and simplifications.
```

---

## What Cursor Should Audit

### 1. Redundant Systems

- Duplicate functionality
- Overlapping systems
- Unused systems
- Systems that can be merged

### 2. Cognitive Overload

- Too much information
- Too many choices
- Complex interactions
- Unclear feedback

### 3. Feature Creep

- Features that don't serve core experience
- Features that break the loop
- Features that add complexity without depth
- Features that violate "must never become"

### 4. Underused Mechanics

- Mechanics users ignore
- Mechanics that don't reinforce loop
- Mechanics that add friction
- Mechanics that can be removed

---

## Audit Process

### 1. Review Design Docs

- Check experience pillars
- Review core loop
- Examine systems map
- Read UX decision log

### 2. Analyze Codebase

- Identify redundant code
- Find unused systems
- Detect complexity
- Check feature usage

### 3. Evaluate Against Principles

- Does it serve the fantasy?
- Does it reinforce the loop?
- Does it respect cognitive limits?
- Does it violate "must never become"?

### 4. Recommend Actions

- What to remove
- What to simplify
- What to merge
- What to improve

---

## Audit Output Format

Cursor should produce:

```markdown
# Design & Implementation Audit

## Redundant Systems

### [System Name]
- **Issue**: [What's redundant]
- **Recommendation**: [What to do]
- **Impact**: [What changes]

## Cognitive Overload

### [Area]
- **Issue**: [What's overwhelming]
- **Recommendation**: [How to simplify]
- **Impact**: [What improves]

## Feature Creep

### [Feature]
- **Issue**: [What doesn't serve core experience]
- **Recommendation**: [What to remove/change]
- **Impact**: [What improves]

## Underused Mechanics

### [Mechanic]
- **Issue**: [What's ignored/unused]
- **Recommendation**: [What to remove/improve]
- **Impact**: [What changes]

## Summary

### High Priority Removals
1. [Removal 1]
2. [Removal 2]

### Simplifications
1. [Simplification 1]
2. [Simplification 2]

### Recommended Actions
1. [Action 1]
2. [Action 2]
```

---

## Integration with Design Intelligence

Cursor should reference:

- **Layer 1 (Experience Pillars)** - Does it serve the fantasy?
- **Layer 2 (Player Psychology)** - Does it respect cognitive limits?
- **Layer 3 (Core Loop)** - Does it reinforce the loop?
- **Layer 4 (Systems Map)** - Is it redundant?
- **Layer 5 (Mechanic Evolution)** - Is it appropriate for stage?
- **Layer 6 (UX Decision Log)** - Does it maintain consistency?

---

## Audit Principles

### 1. Subtraction is a Senior Skill

Removing is often better than adding.

### 2. Simplicity Over Complexity

Simple solutions are usually better.

### 3. Core Experience First

Everything must serve the core experience.

### 4. Cognitive Limits Matter

Respect user cognitive capacity.

### 5. Feature Creep Kills

More features ≠ better experience.

---

## Success Indicators

Audit succeeds when:

- ✅ Redundant systems identified
- ✅ Cognitive overload detected
- ✅ Feature creep recognized
- ✅ Underused mechanics found
- ✅ Removals recommended
- ✅ Simplifications suggested

---

## Next Steps After Audit

After audit is complete:

1. **Review Recommendations** - Evaluate suggestions
2. **Prioritize** - Decide what to act on
3. **Plan Changes** - Create blueprints for changes
4. **Implement** - Make removals/simplifications

---

**This prompt activates Self-Auditing Mode. Cursor critiques itself and recommends intelligent subtraction.**


