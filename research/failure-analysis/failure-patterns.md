# Failure Patterns Library

## Purpose

Library of recurring failure patterns, enabling Cursor to recognize and prevent common failures.

**Recognizing patterns enables prevention.**

---

## Pattern Entry Format

```markdown
## [Failure Pattern Name]

**Category**: [Design/Technical/UX/Engagement]
**Frequency**: [Common/Uncommon/Rare]
**Severity**: [High/Medium/Low]

**Description**: [What the pattern is]

**Characteristics**:
- [Characteristic 1]
- [Characteristic 2]

**Common Causes**:
- [Cause 1]
- [Cause 2]

**Early Warning Signs**:
- [Sign 1]
- [Sign 2]

**Prevention Strategies**:
- [Strategy 1]
- [Strategy 2]

**Examples**:
- [Example 1]
- [Example 2]

**Related Patterns**: [Links to related patterns]
```

---

## Common Failure Patterns

### Feature Creep

**Description**: Adding features that don't serve core experience.

**Characteristics**:
- Features accumulate
- Core experience diluted
- Complexity increases
- Focus lost

**Common Causes**:
- No clear vision
- Saying yes to everything
- No removal discipline
- Feature requests accumulate

**Prevention**:
- Maintain clear vision
- Say no to non-core features
- Regular feature audits
- Remove unused features

---

### Over-Engineering

**Description**: Building more than needed.

**Characteristics**:
- Unnecessary complexity
- Premature optimization
- Over-abstracted
- Hard to understand

**Common Causes**:
- Planning for future that doesn't come
- Perfectionism
- Lack of constraints
- No "good enough" threshold

**Prevention**:
- Build what's needed now
- Accept "good enough"
- Respect constraints
- Simplify constantly

---

### Cognitive Overload

**Description**: Too much information/choices for users.

**Characteristics**:
- Information overload
- Choice overload
- Unclear organization
- Overwhelming interface

**Common Causes**:
- Showing everything at once
- No progressive disclosure
- Poor information architecture
- Too many options

**Prevention**:
- Progressive disclosure
- Limit choices
- Organize information
- Support learning

---

### Misaligned Mental Models

**Description**: Design doesn't match user expectations.

**Characteristics**:
- Confusing interactions
- Unexpected behavior
- Learning curve too steep
- User errors

**Common Causes**:
- Ignoring conventions
- Novel for novelty's sake
- No user research
- Assumptions about users

**Prevention**:
- Follow conventions
- Research users
- Test mental models
- Provide guidance

---

## Pattern Relationships

### Pattern Combinations

**How patterns combine**:
- Feature creep + over-engineering = bloat
- Cognitive overload + misaligned models = confusion
- Multiple patterns compound

**Why**: Understanding combinations enables prevention.

---

## Usage Guidelines

### When to Reference

**Reference patterns when**:
- Designing systems
- Auditing projects
- Preventing failures
- Learning from mistakes

**Why**: Pattern recognition enables prevention.

---

### How to Prevent

**Prevention process**:
1. Recognize pattern
2. Identify causes
3. Apply prevention strategies
4. Monitor for signs
5. Act early

**Why**: Early prevention is easier than fixing.

---

## Integration Points

### Failure Taxonomy
- Patterns map to taxonomy
- Organizes patterns
- Enables systematic analysis

### Knowledge Base
- Adds to anti-patterns
- Tracks pattern occurrences
- Accumulates pattern knowledge

---

**This library enables Cursor to recognize and prevent common failure patterns.**


