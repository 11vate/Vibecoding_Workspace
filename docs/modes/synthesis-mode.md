# Synthesis Mode

## Purpose

**Synthesis Mode** is Cursor's state for pattern extraction and concept formation. In this mode, Cursor synthesizes design concepts from research without implementing.

---

## When to Activate

Activate Synthesis Mode when:
- Research is complete
- Need to generate design concepts
- Want to explore different approaches
- Ready to move from research to design

**Activation**: Use `@Docs/prompts/synthesis-prompt.md`

---

## Mode Characteristics

### What Cursor Does

- **Extracts** principles from research
- **Synthesizes** design concepts
- **Generates** multiple approaches
- **Explains** tradeoffs
- **Evaluates** concepts against design intelligence

### What Cursor Does NOT Do

- ❌ Create blueprints
- ❌ Write code
- ❌ Make final decisions
- ❌ Implement solutions
- ❌ Skip to implementation

---

## Mode Workflow

### Step 1: Review Research

**What to review**:
- Comparative analysis
- Design patterns
- Technical feasibility
- Failure analysis

**What to extract**:
- What works
- What doesn't work
- Transferable principles
- Adaptable patterns

---

### Step 2: Reference Design Intelligence

**What to reference**:
- Experience Pillars (Layer 1) - Does it serve the fantasy?
- Player Psychology (Layer 2) - Does it respect cognitive limits?
- Core Loop (Layer 3) - Does it reinforce the loop?
- Systems Map (Layer 4) - Does it fit architecture?
- Mechanic Evolution (Layer 5) - Is it appropriate?
- UX Decision Log (Layer 6) - Is it consistent?

**Why**: Ensure concepts align with design intelligence

---

### Step 3: Generate Concepts

**What to generate**:
- 3 distinct design concepts
- Different approaches
- Different tradeoffs
- All serve core experience

**Requirements**:
- Each concept reinforces core experience
- Each uses different mechanics/approaches
- Each has clear tradeoffs

---

### Step 4: Explain Tradeoffs

**What to explain**:
- What each concept does well
- What each concept sacrifices
- When each concept works best
- When each concept doesn't work

**Why**: Enable informed decision-making

---

### Step 5: Evaluate Concepts

**What to evaluate**:
- Alignment with design intelligence
- Feasibility (technical, UX, cognitive)
- Tradeoffs and implications
- Fit with core experience

**Output**: Concept evaluation and recommendation

---

## Concept Requirements

Each concept must:

### 1. Reinforce Core Experience

- Serves the fantasy (Experience Pillars)
- Supports emotional beats
- Maintains core loop

### 2. Use Different Approaches

- Different mechanics
- Different UX patterns
- Different system designs

### 3. Have Clear Tradeoffs

- Strengths and weaknesses
- When it works
- When it doesn't

---

## Output Format

Cursor should produce:

```markdown
# Design Concepts for [FEATURE/SYSTEM]

## Concept 1: [Name]

### Approach
[How it works]

### Strengths
[What it does well]

### Weaknesses
[What it sacrifices]

### Best For
[When it works best]

### Tradeoffs
[What you gain/lose]

### Alignment
[How it aligns with design intelligence]

## Concept 2: [Name]
[Same structure]

## Concept 3: [Name]
[Same structure]

## Recommendation
[Which concept fits best and why]
```

---

## Mode Boundaries

### Stay in Synthesis Mode

**When**:
- Concepts not generated
- Tradeoffs unclear
- Alignment not evaluated
- Recommendation not made

**Action**: Continue synthesizing

---

### Exit Synthesis Mode

**When**:
- Concepts generated
- Tradeoffs explained
- Alignment evaluated
- Recommendation made

**Next Mode**: Blueprint Mode

**Transition**: Use `@Docs/prompts/blueprint-prompt.md`

---

## Integration with Design Intelligence

During Synthesis Mode:

1. **Reference design intelligence layers**
   - Ensure concepts serve fantasy
   - Respect cognitive limits
   - Reinforce core loop
   - Fit system architecture

2. **Cross-reference knowledge base**
   - Use patterns from knowledge base
   - Adapt, don't copy
   - Learn from references

---

## Success Indicators

Synthesis Mode succeeds when:

- ✅ Principles extracted from research
- ✅ 3 distinct concepts generated
- ✅ Each concept serves core experience
- ✅ Tradeoffs clearly explained
- ✅ Alignment evaluated
- ✅ Recommendation made
- ✅ No blueprint or code created

---

## Common Mistakes

### 1. Skipping Synthesis

**Problem**: Jumping from research to blueprint
**Solution**: Always synthesize concepts first

### 2. Only One Concept

**Problem**: Generating only one concept
**Solution**: Generate 3 distinct concepts with tradeoffs

### 3. Unclear Tradeoffs

**Problem**: Not explaining tradeoffs clearly
**Solution**: Explicitly state strengths, weaknesses, when it works

### 4. Ignoring Design Intelligence

**Problem**: Concepts don't align with design intelligence
**Solution**: Reference design intelligence layers, ensure alignment

---

## Next Mode

After Synthesis Mode:

**Blueprint Mode** - Create formal system/UX/mechanic blueprints

**Activation**: Use `@Docs/prompts/blueprint-prompt.md`

---

**Synthesis Mode is about concept formation. Cursor extracts principles and generates design concepts before planning implementation.**


