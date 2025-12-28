# Research Protocol

## Purpose

This protocol defines **how Cursor should research** - the systematic process for exploring comparable systems, patterns, and failures before designing.

---

## Protocol Overview

Research must happen **before design**. Cursor should never design without researching first.

---

## Research Layers

Cursor must research in these layers, in order:

### Layer 1: Existing Open-Source Projects

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

### Layer 2: Established Design Patterns

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

### Layer 3: Failure Analysis

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

**Output**: Failure analysis in comparative analysis

---

### Layer 4: Adaptation Strategy

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

**Output**: Adaptation notes in design patterns

---

## Research Process

### Step 1: Define Research Scope

**What to define**:
- What feature/system/pattern to research
- What aspects to focus on
- What constraints to consider
- What questions to answer

**Example**:
```
Research scope: Fusion mechanics
Focus: Combination systems, outcome calculation, UX patterns
Constraints: PWA, offline-capable, web-native
Questions: How do other games handle fusion? What UX patterns work?
```

---

### Step 2: Research Existing Projects

**How to research**:
1. Find comparable projects (games, apps, tools)
2. Analyze what they do well
3. Identify where they break
4. Extract lessons

**Where to look**:
- Open-source repositories
- Game design references
- App design references
- Framework examples

**Output**: List of comparable projects with analysis

---

### Step 3: Research Design Patterns

**How to research**:
1. Identify relevant patterns
2. Understand use cases
3. Analyze tradeoffs
4. Determine fit

**Where to look**:
- Pattern libraries
- Design system references
- Architecture patterns
- UX pattern libraries

**Output**: List of relevant patterns with analysis

---

### Step 4: Analyze Failures

**How to research**:
1. Identify common failures
2. Understand why they fail
3. Learn from mistakes
4. Extract prevention strategies

**Where to look**:
- Post-mortems
- Failure case studies
- User complaints
- Performance issues

**Output**: Failure analysis with prevention strategies

---

### Step 5: Determine Adaptation Strategy

**How to research**:
1. Evaluate what fits
2. Identify required modifications
3. Determine what to avoid
4. Plan adaptation approach

**Considerations**:
- Project constraints
- Design intelligence layers
- Core experience
- Technical feasibility

**Output**: Adaptation strategy

---

## Research Artifacts

Cursor must produce these artifacts:

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

## Research Quality Criteria

Research is complete when:

- ✅ Comparable projects identified and analyzed
- ✅ Relevant patterns identified and evaluated
- ✅ Failures analyzed and understood
- ✅ Adaptation strategy determined
- ✅ Research artifacts produced
- ✅ No design or code proposed yet

---

## Integration with Knowledge Base

During research, Cursor should:

1. **Check knowledge base first**
   - `knowledge-base/mechanics-library.md`
   - `knowledge-base/ui-pattern-library.md`
   - `knowledge-base/references/`

2. **Add to knowledge base**
   - Document new patterns found
   - Record successful adaptations
   - Note failures to avoid

---

## Research Time Limits

**Guidelines**:
- Simple features: 1-2 research cycles
- Complex systems: 3-5 research cycles
- Major features: 5+ research cycles

**Don't over-research**: Research until you have enough to make informed decisions, then move to synthesis.

---

## Common Research Mistakes

### 1. Skipping Research

**Problem**: Designing without research
**Solution**: Always research first

### 2. Over-Researching

**Problem**: Researching indefinitely
**Solution**: Set scope, research systematically, move to synthesis

### 3. Copying Instead of Adapting

**Problem**: Copying solutions directly
**Solution**: Extract principles, adapt to project

### 4. Ignoring Failures

**Problem**: Only researching successes
**Solution**: Research failures, learn from mistakes

---

## Next Steps After Research

After research is complete:

1. **Synthesis** - Use `@Docs/prompts/synthesis-prompt.md`
2. **Blueprint** - Use `@Docs/prompts/blueprint-prompt.md`
3. **Implementation** - Use `@Docs/prompts/implementation-gate-prompt.md`

---

**This protocol ensures Cursor researches systematically before designing, preventing reinvention and learning from existing solutions.**


