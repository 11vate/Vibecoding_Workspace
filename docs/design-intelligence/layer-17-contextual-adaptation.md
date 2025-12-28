# Layer 17: Contextual Adaptation

**Authority Tier**: 3 (Conditional Heuristic - apply based on context)
**Layer Type**: Meta-Intelligence Layer
**Integration**: Dynamically weights all layers 1-16 based on project context

---

## Purpose

**Contextual adaptation** is the AI's ability to adjust reasoning depth and layer emphasis based on project context - simple projects need lighter reasoning, complex projects need deeper analysis.

**Philosophy**: Not all decisions deserve equal cognitive investment. Match reasoning depth to problem complexity.

**When to Use**: At project start to classify context, then continuously to adapt reasoning approach.

---

## What is Contextual Adaptation?

### Definition

**Contextual Adaptation** = Dynamically adjusting which DIS layers to emphasize and how deeply to reason based on:
- Project complexity
- Time constraints
- Resource availability
- Risk tolerance
- Novelty vs familiarity

**Example**:
```
Simple Landing Page:
- Layers 1-3: Light touch (10 min total)
- Layers 4-15: Skip most, reference only when conflicts arise
- Layer 16: Quick validation (5 min)

Complex Game Mechanic:
- Layers 1-3: Deep dive (60 min)
- Layers 4-15: Thorough consultation (120 min)
- Layer 16: Full meta-cognitive analysis (20 min)
```

**Key Insight**: Same framework, different depth based on context.

---

## Context Classification

### Dimension 1: Project Complexity

**Classification Scale**:
```
1 - Trivial
  - Examples: Simple UI tweak, copy change, color adjustment
  - Layer Usage: Layers 1-3 only, 5-10 min total
  - Reasoning Depth: Surface level

2 - Simple
  - Examples: Standard CRUD feature, basic UI component, known pattern implementation
  - Layer Usage: Layers 1-6, 20-30 min total
  - Reasoning Depth: First-order effects only

3 - Moderate
  - Examples: New feature with some novelty, integration between 2-3 systems
  - Layer Usage: Layers 1-10, 60-90 min total
  - Reasoning Depth: Second-order effects

4 - Complex
  - Examples: Core mechanic, multi-system architecture, novel pattern
  - Layer Usage: Layers 1-15, 2-4 hours total
  - Reasoning Depth: Third-order effects

5 - Highly Complex
  - Examples: Entire game/app architecture, research-driven innovation
  - Layer Usage: All layers 1-16, days of reasoning
  - Reasoning Depth: Full depth including meta-cognitive validation
```

**Classification Questions**:
1. **Novelty**: Is this familiar or novel? (Familiar = lower, Novel = higher)
2. **Scope**: How many systems affected? (1 = lower, 5+ = higher)
3. **Reversibility**: Can we easily undo this? (Yes = lower, No = higher)
4. **Risk**: What's the cost of failure? (Low = lower, High = higher)
5. **Dependencies**: How many dependencies? (Few = lower, Many = higher)

**Classification Algorithm**:
```typescript
function classifyComplexity(project: ProjectContext): ComplexityLevel {
  let score = 0;

  // Novelty (0-2 points)
  if (project.novelty === 'never-done-before') score += 2;
  else if (project.novelty === 'adaptation') score += 1;

  // Scope (0-2 points)
  if (project.systemsAffected >= 5) score += 2;
  else if (project.systemsAffected >= 2) score += 1;

  // Reversibility (0-2 points)
  if (project.reversibility === 'irreversible') score += 2;
  else if (project.reversibility === 'difficult') score += 1;

  // Risk (0-2 points)
  if (project.failureCost === 'critical') score += 2;
  else if (project.failureCost === 'significant') score += 1;

  // Dependencies (0-2 points)
  if (project.dependencies >= 10) score += 2;
  else if (project.dependencies >= 5) score += 1;

  // Total: 0-10 points
  if (score <= 2) return 'trivial';
  if (score <= 4) return 'simple';
  if (score <= 6) return 'moderate';
  if (score <= 8) return 'complex';
  return 'highly-complex';
}
```

---

### Dimension 2: Time Constraints

**Classification**:
```
1 - No Deadline
  - Reasoning: Full depth, optimize for quality
  - Layer Weighting: Standard (all layers equal weight)

2 - Flexible Deadline
  - Reasoning: Thorough but time-aware
  - Layer Weighting: Prioritize layers 1-6 (core experience)

3 - Moderate Deadline
  - Reasoning: Satisficing over optimizing
  - Layer Weighting: Layers 1-3 mandatory, 4+ as time permits

4 - Tight Deadline
  - Reasoning: Heuristic-driven, pattern matching
  - Layer Weighting: Layers 1-3 only, heuristics database for speed

5 - Emergency
  - Reasoning: Minimal viable reasoning
  - Layer Weighting: Layer 1 only (does it serve core fantasy?)
```

**Time-Complexity Matrix**:
```
                Time Available
              No    Flex   Mod   Tight  Emerg
Complexity
Trivial       Full  Full   Full  Full   Skip
Simple        Full  Full   Full  Quick  Skip
Moderate      Full  Full   Quick Quick  Core
Complex       Full  Quick  Quick Core   Core
Highly Comp.  Full  Quick  Core  Core   Defer
```

Legend:
- **Full**: All applicable layers, full depth
- **Quick**: Key layers only (1-6), first-order reasoning
- **Core**: Layers 1-3 only, pattern matching
- **Skip**: Minimal/no formal reasoning (direct implementation)
- **Defer**: Don't do it - complexity too high for time available

---

### Dimension 3: Resource Availability

**Resource Types**:
1. **Cognitive Budget**: AI token limits, human attention capacity
2. **Technical Budget**: Memory, processing power, bandwidth
3. **Financial Budget**: API costs, development costs

**Adaptation Strategies**:

**Low Cognitive Budget**:
- Use indexes aggressively (load only critical files)
- Leverage heuristics over first-principles reasoning
- Pattern-match instead of deep analysis
- Skip Layer 16 (meta-cognition) for simple tasks

**Low Technical Budget**:
- Emphasize Layer 9 (Progressive Disclosure) - start minimal
- Layer 13 (Offline-First) - reduce server dependency
- Layer 10 (Asset Intelligence) - aggressive reuse

**Low Financial Budget**:
- Use smaller AI models (Haiku instead of Opus)
- Batch decision-making (fewer, deeper sessions)
- Increase heuristic reliance (less reasoning per decision)

---

### Dimension 4: Risk Tolerance

**Classification**:
```
1 - High Risk Tolerance
  - Experimentation encouraged
  - Layer 16 optional (learn from failures)
  - Rapid iteration, less planning

2 - Moderate Risk Tolerance
  - Balanced approach
  - Standard layer weighting
  - Blueprint before implementation

3 - Low Risk Tolerance
  - Conservative decisions
  - Layer 16 mandatory (validate reasoning)
  - Extensive planning, simulation before implementation

4 - Zero Risk Tolerance
  - Production critical systems
  - All layers 1-16 mandatory
  - Multiple validation passes
  - Formal verification where possible
```

---

## Layer Weighting Algorithms

### Standard Weighting (Balanced Projects)

**Weighting**:
```
Tier 1 (Mandatory - Always Consult):
- Layer 1: Experience Pillars (10%)
- Layer 2: Player Psychology (10%)
- Layer 3: Core Loop (10%)

Tier 2 (Contextual - Consult When Relevant):
- Layer 4-15: 5% each (60% total)

Tier 3 (Meta - Complex Decisions Only):
- Layer 16: Meta-Cognitive (10%)
```

**Time Allocation** (for Moderate complexity, Flexible deadline):
- Tier 1: 30 minutes (30% of 100-minute session)
- Tier 2: 60 minutes (60%)
- Tier 3: 10 minutes (10%)

---

### Speed Weighting (Tight Deadlines)

**Weighting**:
```
Core Only:
- Layer 1: 40%
- Layer 2: 30%
- Layer 3: 30%
- Layers 4-16: Skip (use heuristics instead)
```

**Time Allocation** (30-minute session):
- Layer 1: 12 minutes
- Layer 2: 9 minutes
- Layer 3: 9 minutes
- Heuristic lookup: 5 minutes (replace layers 4-16)

---

### Deep Weighting (High Complexity, Low Risk Tolerance)

**Weighting**:
```
Comprehensive:
- Layers 1-3: 5% each (15%)
- Layers 4-15: 5% each (60%)
- Layer 16: 25% (extensive meta-cognitive validation)
```

**Time Allocation** (4-hour session):
- Layers 1-3: 36 minutes (15%)
- Layers 4-15: 144 minutes (60%)
- Layer 16: 60 minutes (25%)

---

### Prototype Weighting (Experimental, High Risk Tolerance)

**Weighting**:
```
Experience-Focused:
- Layer 1: 50% (what experience are we testing?)
- Layer 3: 30% (how does it feel in the loop?)
- Layer 5: 20% (can it evolve?)
- Layers 2,4,6-16: Defer until prototype validated
```

**Time Allocation** (1-hour session):
- Layer 1: 30 minutes (define experience)
- Layer 3: 18 minutes (rough core loop)
- Layer 5: 12 minutes (evolution potential)

---

## Complexity-Based Reasoning Depth

### Depth Levels

**Level 1: Surface Reasoning**
- **When**: Trivial/Simple projects, tight deadlines
- **Process**:
  1. Identify core experience (Layer 1)
  2. Check for obvious constraint violations
  3. Pattern match to existing solution
  4. Implement
- **Validation**: Does it serve the fantasy? (yes/no)

**Level 2: First-Order Reasoning**
- **When**: Simple/Moderate projects, moderate deadlines
- **Process**:
  1. Consult Layers 1-3
  2. Consider immediate effects
  3. Check for pattern fit
  4. Light constraint validation
- **Validation**: Does it satisfy core constraints?

**Level 3: Second-Order Reasoning**
- **When**: Moderate/Complex projects, flexible deadlines
- **Process**:
  1. Consult Layers 1-10
  2. Consider immediate + ripple effects
  3. Evaluate alternatives (2-3 options)
  4. Constraint validation + risk assessment
- **Validation**: Have I considered ripple effects?

**Level 4: Third-Order Reasoning**
- **When**: Complex/Highly-complex projects, no deadline pressure
- **Process**:
  1. Consult Layers 1-15
  2. Consider immediate + ripple + long-term effects
  3. Evaluate alternatives (4+ options)
  4. Comprehensive constraint validation
  5. Risk + mitigation planning
- **Validation**: Have I considered long-term evolution?

**Level 5: Meta-Cognitive Reasoning**
- **When**: Highly-complex projects, low risk tolerance, novel patterns
- **Process**:
  1. Perform Level 4 reasoning
  2. Apply Layer 16 meta-cognitive validation
  3. Validate reasoning quality
  4. Detect and correct biases
  5. Assess decision quality
- **Validation**: Is my reasoning process itself sound?

---

## Adaptation Templates

### Template 1: Project Initialization

```markdown
## Contextual Adaptation Assessment

### Project Classification
- **Complexity**: [1-5] - [Rationale]
- **Time Constraint**: [1-5] - [Deadline info]
- **Resource Budget**: [High/Medium/Low] - [Specifics]
- **Risk Tolerance**: [1-4] - [Rationale]

### Reasoning Approach Selected
- **Depth Level**: [1-5]
- **Layer Weighting**: [Standard/Speed/Deep/Prototype]
- **Time Allocation**: [Total time budget]

### Layer Usage Plan
- **Mandatory**: Layers [X, Y, Z]
- **Contextual**: Layers [A, B, C] (if time permits)
- **Skipped**: Layers [M, N] (rationale: [why])

### Adaptation Rationale
[Why this approach fits this context]

### Validation Criteria
[How will I know if this approach is working?]
```

---

### Template 2: Mid-Project Re-Assessment

```markdown
## Context Shift Check

### Original Assessment
- Complexity: [Original]
- Time: [Original]
- Resources: [Original]

### Current Reality
- Complexity: [Current] - [What changed?]
- Time: [Current] - [Ahead/behind schedule?]
- Resources: [Current] - [Over/under budget?]

### Adaptation Required?
- [ ] No change needed
- [ ] Increase reasoning depth (discovered complexity)
- [ ] Decrease reasoning depth (simpler than expected)
- [ ] Shift layer emphasis (different aspects matter)
- [ ] Change validation criteria

### Updated Approach
[If adaptation required, what changes?]
```

---

## Integration with Other Layers

### How Layer 17 Affects Layer Usage

**Layer 1 (Experience Pillars)**:
- Simple projects: Quick reference ("Does it serve fantasy?" yes/no)
- Complex projects: Deep dive into each pillar, validate alignment

**Layer 2 (Player Psychology)**:
- Prototype weighting: Skip (test real behavior instead)
- Deep weighting: Extensive consultation (25% of time)

**Layer 3 (Core Loop)**:
- Always consulted, but depth varies
- Trivial: "Does it fit in the loop?"
- Complex: "How does it transform the loop experience?"

**Layers 4-15**:
- Speed weighting: Skip, use heuristics
- Standard weighting: Consult when relevant
- Deep weighting: Comprehensive consultation

**Layer 16 (Meta-Cognitive)**:
- Trivial/Simple: Skip
- Moderate: Quick validation (5-10 min)
- Complex/Highly-complex: Full meta-cognitive analysis (20-60 min)

---

## Practical Examples

### Example 1: Simple Button Redesign

**Context**:
- Complexity: 1 (Trivial)
- Time: Tight deadline (1 hour)
- Resources: Low cognitive budget
- Risk: Low (easily reversible)

**Adaptation**:
- **Reasoning Depth**: Level 1 (Surface)
- **Layer Weighting**: Core Only
- **Layers Used**: Layer 1 (5 min), Layer 6 (UX Decision Log - 5 min)
- **Process**:
  1. Does new button serve fantasy? (Layer 1 - yes)
  2. Is it consistent with existing UX? (Layer 6 - check decision log)
  3. Implement
- **Total Time**: 15 minutes (including implementation)

**Outcome**: Fast, consistent, aligned with core experience.

---

### Example 2: New Progression Mechanic

**Context**:
- Complexity: 4 (Complex)
- Time: Flexible deadline (2 weeks)
- Resources: High cognitive budget
- Risk: Moderate (affects core loop)

**Adaptation**:
- **Reasoning Depth**: Level 4 (Third-Order)
- **Layer Weighting**: Deep
- **Layers Used**: All layers 1-16
- **Process**:
  1. Layers 1-3: 60 min (define experience, psychology, core loop impact)
  2. Layer 5: 30 min (mechanic evolution planning)
  3. Layer 8: 20 min (progression curve design)
  4. Layer 4, 7, 9-15: 90 min (systems integration, dependencies)
  5. Layer 16: 40 min (meta-cognitive validation)
- **Total Time**: 4 hours reasoning + implementation

**Outcome**: Thoroughly validated mechanic with long-term evolution plan.

---

### Example 3: Emergency Bug Fix

**Context**:
- Complexity: 2 (Simple fix, but critical)
- Time: Emergency (30 minutes)
- Resources: Very low time budget
- Risk: Zero tolerance (production down)

**Adaptation**:
- **Reasoning Depth**: Level 1 (Surface)
- **Layer Weighting**: Emergency Override
- **Layers Used**: Layer 11 (Failure States) only
- **Process**:
  1. Identify failure state (5 min)
  2. Implement minimum viable fix (20 min)
  3. Validate fix works (5 min)
  4. Defer deeper analysis to post-mortem
- **Total Time**: 30 minutes

**Outcome**: System restored quickly; schedule proper redesign later.

---

### Example 4: Prototype Validation

**Context**:
- Complexity: 3 (Moderate - experimental mechanic)
- Time: Moderate deadline (3 days)
- Resources: Medium budget
- Risk: High tolerance (prototype, expect failure)

**Adaptation**:
- **Reasoning Depth**: Level 2 (First-Order)
- **Layer Weighting**: Prototype
- **Layers Used**: Layers 1, 3, 5 heavily; skip most others
- **Process**:
  1. Layer 1: 60 min (what experience to test?)
  2. Layer 3: 40 min (rough core loop integration)
  3. Layer 5: 20 min (does it have evolution potential?)
  4. Skip validation, build prototype
  5. Test with users
  6. If successful, THEN do deep analysis (Layers 2,4,6-16)
- **Total Time**: 2 hours reasoning, 6 hours implementation

**Outcome**: Fast learning, defer investment until validation.

---

## Adaptation Anti-Patterns

### Anti-Pattern 1: Under-Reasoning Complex Projects

**Problem**: Treating complex project as simple to save time
**Symptom**: "Let's just build it and see what happens" for core mechanic
**Consequence**: Wasted implementation time, fundamental redesign needed
**Fix**: Complexity classification is mandatory, not optional

### Anti-Pattern 2: Over-Reasoning Simple Projects

**Problem**: Full meta-cognitive analysis for button color change
**Symptom**: 2 hours of reasoning for 5-minute task
**Consequence**: Analysis paralysis, wasted resources
**Fix**: Match reasoning depth to actual complexity

### Anti-Pattern 3: Ignoring Context Shifts

**Problem**: Discovered complexity but didn't adapt approach
**Symptom**: "We're 80% done" but scope tripled
**Consequence**: Poor quality, missed constraints
**Fix**: Mid-project re-assessment when complexity changes

### Anti-Pattern 4: Rigid Layer Adherence

**Problem**: "I must consult all 16 layers for everything"
**Symptom**: Treating framework as checklist, not reasoning guide
**Consequence**: Cognitive overload, diminishing returns
**Fix**: Layer 17 exists to prevent this - adapt!

### Anti-Pattern 5: Permanent Emergency Mode

**Problem**: Always using "tight deadline" weighting
**Symptom**: Never doing deep reasoning, pattern-matching everything
**Consequence**: Technical debt accumulation, brittle systems
**Fix**: Honest time assessment; sometimes "no" is the right answer

---

## When to Use Layer 17

### Always Use (Project Start)
- **Action**: Classify project context
- **Output**: Adaptation template filled out
- **Time**: 10-15 minutes
- **Why**: Sets reasoning approach for entire project

### Periodically Use (Mid-Project)
- **Action**: Re-assess context if scope/time/resources change
- **Output**: Updated adaptation or confirmation
- **Time**: 5-10 minutes
- **Why**: Prevents approach/reality mismatch

### Use After Retrospectives
- **Action**: Did our reasoning depth match actual complexity?
- **Output**: Calibration adjustments for future classifications
- **Time**: 10 minutes
- **Why**: Improves classification accuracy over time

### DON'T Use
- During implementation (context set at start)
- For every single decision (set at project level, not decision level)
- As procrastination ("I need to re-classify this task...")

---

## Integration with Orchestration Mode

**How Orchestration Uses Layer 17**:

1. **Workflow Selection**:
   - Simple project → Lightweight workflow (research → implement)
   - Complex project → Full workflow (research → synthesis → blueprint → simulate → implement)

2. **Step Depth**:
   - Orchestration passes complexity level to each step
   - Research step adapts depth based on complexity
   - Blueprint step skipped for trivial projects

3. **Resource Allocation**:
   - Orchestration allocates AI tokens based on complexity
   - Simple: Use Haiku model
   - Complex: Use Opus model with extended context

**Example Orchestration Adaptation**:
```typescript
function selectWorkflow(context: ProjectContext): Workflow {
  const complexity = classifyComplexity(context);

  if (complexity === 'trivial' || complexity === 'simple') {
    return {
      steps: ['research', 'implement'],
      model: 'haiku',
      reasoning_depth: 'surface'
    };
  }

  if (complexity === 'moderate') {
    return {
      steps: ['research', 'synthesis', 'blueprint', 'implement'],
      model: 'sonnet',
      reasoning_depth: 'first-order'
    };
  }

  if (complexity === 'complex' || complexity === 'highly-complex') {
    return {
      steps: ['research', 'synthesis', 'blueprint', 'simulate', 'implement', 'validate'],
      model: 'opus',
      reasoning_depth: 'third-order-with-meta-cognition'
    };
  }
}
```

---

## Success Indicators

Layer 17 succeeds when:

- ✅ Projects classified before reasoning begins
- ✅ Reasoning depth matches actual complexity
- ✅ Simple projects completed quickly (not over-analyzed)
- ✅ Complex projects receive thorough analysis (not rushed)
- ✅ Time budgets respected
- ✅ Resource budgets respected
- ✅ Context shifts trigger re-assessment
- ✅ Retrospectives validate classification accuracy

**Metrics to Track**:
- Classification accuracy: Did estimated complexity match actual?
- Time efficiency: Did we over/under-invest reasoning time?
- Quality outcomes: Did adapted approach produce good results?
- Resource usage: Did we stay within budgets?

---

## Summary

**Layer 17: Contextual Adaptation** enables the AI to be **intelligently lazy** - investing reasoning effort where it matters, moving quickly where it doesn't.

**Key Principle**: The framework is a tool, not a ritual. Match the tool to the task.

**Integration**: Use at project start to classify context and select appropriate reasoning approach. Re-assess if context changes.

**Ultimate Goal**: Maximum quality per unit of reasoning invested.

---

**Remember**: It's not about using all 18 layers all the time. It's about using the RIGHT layers at the RIGHT depth for the RIGHT context.

**Layer 17 makes the entire Design Intelligence Stack practical for real-world projects.**
