# Pattern Extraction Pipeline

## Purpose

Systematic pipeline for extracting design patterns from research, analyzing their effectiveness, and making them reusable across projects.

**This pipeline creates reusable design knowledge that improves over time.**

---

## Pipeline Stages

### Stage 1: Pattern Identification

**What to Do**:
- Scan research for recurring patterns
- Identify pattern variations
- Categorize patterns by type
- Document pattern contexts

**Output**: List of identified patterns

**Pattern Types**:
- Mechanics patterns
- UX patterns
- System patterns
- Progression patterns
- Engagement patterns

---

### Stage 2: Pattern Analysis

**What to Do**:
- Analyze pattern structure
- Document pattern components
- Identify pattern variations
- Note pattern relationships

**Output**: Detailed pattern analysis

**Analysis Template**:
```markdown
## [Pattern Name]

### Structure
[How the pattern is structured]

### Components
- [Component 1]
- [Component 2]

### Variations
- [Variation 1]: [How it differs]
- [Variation 2]: [How it differs]

### Relationships
- Related to: [Other patterns]
- Combines with: [Other patterns]
```

---

### Stage 3: Effectiveness Analysis

**What to Do**:
- Analyze when pattern works
- Identify when pattern fails
- Document success conditions
- Note failure modes

**Output**: Effectiveness analysis

**Effectiveness Format**:
```markdown
### When It Works
- [Condition 1]
- [Condition 2]

### When It Fails
- [Condition 1]
- [Condition 2]

### Success Factors
- [Factor 1]
- [Factor 2]

### Failure Modes
- [Mode 1]
- [Mode 2]
```

---

### Stage 4: Adaptation Strategies

**What to Do**:
- Document how to adapt pattern
- Note required modifications
- Identify adaptation risks
- Provide adaptation examples

**Output**: Adaptation guide

**Adaptation Format**:
```markdown
### How to Adapt
[Step-by-step adaptation process]

### Required Modifications
- [Modification 1]
- [Modification 2]

### Adaptation Risks
- [Risk 1]
- [Risk 2]

### Examples
- [Project 1]: [How it was adapted]
- [Project 2]: [How it was adapted]
```

---

### Stage 5: Pattern Documentation

**What to Do**:
- Create pattern library entry
- Document pattern thoroughly
- Add to knowledge base
- Cross-reference related patterns

**Output**: Pattern library entry

**Library Entry Format**:
```markdown
## [Pattern Name]

**Type**: [Mechanic/UX/System/etc.]
**Complexity**: [Simple/Medium/Complex]

**Description**: [What it does]

**Structure**: [How it's structured]

**When to Use**: [Use cases]

**When Not to Use**: [Anti-use cases]

**Pros**: 
- [Strength 1]
- [Strength 2]

**Cons**: 
- [Weakness 1]
- [Weakness 2]

**Adaptation Notes**: [How to adapt]

**Related Patterns**: [Links to related patterns]

**Examples**: [Project examples]
```

---

## Output Schema

### File Structure

```
knowledge-base/pattern-extraction/[pattern-name].md
```

### Required Sections

1. **Pattern Definition** - What the pattern is
2. **Structure** - How it's structured
3. **Effectiveness** - When it works/fails
4. **Adaptation** - How to adapt it
5. **Examples** - Real-world examples
6. **Related Patterns** - Connections to other patterns

---

## Quality Criteria

Pattern extraction is complete when:
- ✅ Pattern clearly defined
- ✅ Structure documented
- ✅ Effectiveness analyzed
- ✅ Adaptation strategies provided
- ✅ Examples included
- ✅ Related patterns linked
- ✅ Added to knowledge base

---

## Pattern Evolution Tracking

### Version History

**What to Track**:
- Pattern variations discovered
- Effectiveness updates
- Adaptation improvements
- Usage across projects

**Why**: Patterns evolve. Track evolution.

---

## Integration Points

### Knowledge Base
- Add to `knowledge-base/mechanics-library.md`
- Add to `knowledge-base/ui-pattern-library.md`
- Track in `knowledge-base/pattern-evolution/`

### Design Intelligence
- Inform system design
- Guide UX decisions
- Influence mechanic design

---

**This pipeline creates reusable pattern knowledge that accumulates and improves over time.**


