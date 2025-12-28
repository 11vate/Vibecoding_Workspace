# Exploration Mode

## Purpose

**Exploration Mode** is Cursor's state for idea discovery and comparison. In this mode, Cursor researches, compares, and explores without designing or coding.

---

## When to Activate

Activate Exploration Mode when:
- Starting a new feature or system
- Need to understand comparable solutions
- Want to learn from existing patterns
- Need to research before designing

**Activation**: Use `@Docs/prompts/research-prompt.md`

---

## Mode Characteristics

### What Cursor Does

- **Researches** comparable systems and patterns
- **Compares** different approaches
- **Analyzes** what works and what doesn't
- **Extracts** transferable principles
- **Documents** research findings

### What Cursor Does NOT Do

- ❌ Design systems
- ❌ Create blueprints
- ❌ Write code
- ❌ Propose solutions
- ❌ Make decisions

---

## Mode Workflow

### Step 1: Define Research Scope

**What to define**:
- What to research
- What questions to answer
- What constraints to consider
- What aspects to focus on

**Example**:
```
Research scope: Fusion mechanics
Questions: How do other games handle fusion? What UX patterns work?
Constraints: PWA, offline-capable, web-native
Focus: Combination systems, outcome calculation, UX patterns
```

---

### Step 2: Research Existing Projects

**What to research**:
- Similar mechanics
- Similar UX flows
- Similar technical constraints
- Projects with comparable goals

**What to extract**:
- What they do well
- Where they break
- Lessons learned
- Transferable principles

**Output**: Comparative analysis

---

### Step 3: Research Design Patterns

**What to research**:
- Game loops
- UI navigation patterns
- Progression systems
- State management strategies
- Architecture patterns

**What to extract**:
- Pattern names
- Use cases
- Tradeoffs
- When to use/not use

**Output**: Design patterns document

---

### Step 4: Analyze Failures

**What to research**:
- Common pitfalls
- Why certain approaches fail
- Scalability issues
- Performance problems
- User experience failures

**What to extract**:
- What to avoid
- Why failures happen
- How to prevent failures
- Recovery strategies

**Output**: Failure analysis

---

### Step 5: Determine Adaptation Strategy

**What to research**:
- What fits this project
- What must be modified
- What should be avoided
- How to adapt patterns

**What to extract**:
- Adaptation strategies
- Modification requirements
- Constraints to consider
- Integration approaches

**Output**: Adaptation notes

---

## Research Artifacts

Cursor must produce:

### 1. Comparative Analysis

**File**: `/docs/research/comparative-analysis.md`

**Structure**:
- Similar projects (games/apps/tools)
- What they do well
- Where they break
- Lessons extracted

---

### 2. Design Patterns

**File**: `/docs/research/design-patterns.md`

**Structure**:
- Pattern name
- Use cases
- Tradeoffs
- Why it fits (or doesn't)

---

### 3. Technical Feasibility

**File**: `/docs/research/technical-feasibility.md`

**Structure**:
- Required systems
- Performance concerns
- Browser constraints
- Offline limitations
- PWA implications

---

## Mode Boundaries

### Stay in Exploration Mode

**When**:
- Research is incomplete
- Questions unanswered
- Patterns not identified
- Failures not analyzed

**Action**: Continue researching

---

### Exit Exploration Mode

**When**:
- Research complete
- Comparable systems identified
- Patterns extracted
- Failures understood
- Adaptation strategy determined

**Next Mode**: Synthesis Mode

**Transition**: Use `@Docs/prompts/synthesis-prompt.md`

---

## Integration with Knowledge Base

During Exploration Mode:

1. **Check knowledge base first**
   - `knowledge-base/mechanics-library.md`
   - `knowledge-base/ui-pattern-library.md`
   - `knowledge-base/references/`

2. **Add to knowledge base**
   - Document new patterns found
   - Record successful adaptations
   - Note failures to avoid

---

## Success Indicators

Exploration Mode succeeds when:

- ✅ Comparable projects identified
- ✅ Patterns extracted
- ✅ Failures analyzed
- ✅ Adaptation strategy determined
- ✅ Research artifacts produced
- ✅ No design or code proposed

---

## Common Mistakes

### 1. Skipping Exploration

**Problem**: Jumping to design without research
**Solution**: Always explore first

### 2. Over-Exploring

**Problem**: Researching indefinitely
**Solution**: Set scope, research systematically, move to synthesis

### 3. Designing in Exploration Mode

**Problem**: Proposing solutions while researching
**Solution**: Stay in exploration, don't design yet

---

## Next Mode

After Exploration Mode:

**Synthesis Mode** - Extract principles and generate design concepts

**Activation**: Use `@Docs/prompts/synthesis-prompt.md`

---

**Exploration Mode is about discovery and comparison. Cursor researches before designing, compares before inventing.**


