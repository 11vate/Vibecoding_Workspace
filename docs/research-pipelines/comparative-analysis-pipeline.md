# Comparative Analysis Pipeline

## Purpose

Systematic pipeline for researching and analyzing comparable projects, extracting lessons, and building reusable knowledge.

**This pipeline ensures research accumulates knowledge across projects.**

---

## Pipeline Stages

### Stage 1: Project Identification

**What to Do**:
- Identify comparable projects (games, apps, tools)
- Categorize by similarity (mechanics, UX, constraints)
- Prioritize by relevance
- Document sources

**Output**: List of comparable projects with categorization

**Quality Criteria**:
- At least 3-5 comparable projects
- Mix of successful and failed projects
- Various approaches represented
- Sources documented

---

### Stage 2: Deep Analysis

**What to Do**:
- Analyze each project systematically
- Document what works well
- Document where it breaks
- Extract specific lessons
- Note technical approaches

**Output**: Detailed analysis for each project

**Analysis Template**:
```markdown
## [Project Name]

### What It Does Well
- [Specific strength 1]
- [Specific strength 2]

### Where It Breaks
- [Specific weakness 1]
- [Specific weakness 2]

### Lessons Extracted
- [Lesson 1]
- [Lesson 2]

### Technical Approach
- [Technical detail 1]
- [Technical detail 2]
```

---

### Stage 3: Pattern Extraction

**What to Do**:
- Identify common patterns across projects
- Note pattern variations
- Document pattern effectiveness
- Extract reusable principles

**Output**: Pattern library entries

**Pattern Format**:
```markdown
## [Pattern Name]

### Description
[What the pattern does]

### Examples
- [Project 1]: [How it's used]
- [Project 2]: [How it's used]

### Effectiveness
[When it works, when it doesn't]

### Reusability
[How to adapt for other projects]
```

---

### Stage 4: Failure Analysis

**What to Do**:
- Identify common failures
- Analyze why failures occur
- Document failure patterns
- Extract prevention strategies

**Output**: Failure analysis document

**Failure Format**:
```markdown
## [Failure Type]

### Description
[What the failure is]

### Why It Happens
[Root causes]

### How to Prevent
[Prevention strategies]

### Examples
- [Project 1]: [How it failed]
- [Project 2]: [How it failed]
```

---

### Stage 5: Synthesis

**What to Do**:
- Synthesize findings across projects
- Identify transferable principles
- Create adaptation strategies
- Document recommendations

**Output**: Comparative analysis synthesis

**Synthesis Format**:
```markdown
## Synthesis

### Key Findings
- [Finding 1]
- [Finding 2]

### Transferable Principles
- [Principle 1]
- [Principle 2]

### Adaptation Strategies
- [Strategy 1]
- [Strategy 2]

### Recommendations
- [Recommendation 1]
- [Recommendation 2]
```

---

## Output Schema

### File Structure

```
docs/research/comparative-analysis-[topic].md
```

### Required Sections

1. **Executive Summary** - Key findings at a glance
2. **Projects Analyzed** - List of projects with brief descriptions
3. **Detailed Analysis** - Deep dive into each project
4. **Pattern Extraction** - Common patterns identified
5. **Failure Analysis** - Common failures and prevention
6. **Synthesis** - Overall findings and recommendations
7. **References** - Sources and links

---

## Quality Criteria

Research is complete when:
- ✅ At least 3-5 projects analyzed
- ✅ Both successes and failures included
- ✅ Patterns extracted and documented
- ✅ Failures analyzed with prevention strategies
- ✅ Synthesis provides actionable recommendations
- ✅ All sources documented

---

## Reusability Guidelines

### Cross-Project Reuse

**How to Reuse**:
- Reference analysis in new projects
- Extract patterns for pattern library
- Learn from failures across projects
- Build knowledge base entries

**Why**: Research accumulates value over time.

---

## Integration Points

### Knowledge Base
- Add patterns to `knowledge-base/mechanics-library.md`
- Add failures to `knowledge-base/anti-patterns/`
- Add insights to `knowledge-base/accumulated-wisdom/`

### Design Intelligence
- Inform experience pillars
- Guide core loop design
- Influence systems map

---

**This pipeline ensures systematic, reusable research that accumulates knowledge across projects.**


