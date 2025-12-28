# Synthesis Prompt

## Purpose

Use this prompt to activate **Synthesis Mode** - Cursor extracts principles from research and synthesizes design concepts.

---

## The Prompt Template

```
@Docs/experience-pillars.md
@Docs/player-psychology.md
@Docs/core-loop.md
@Docs/research/comparative-analysis.md

Synthesize 3 distinct design concepts for [FEATURE/SYSTEM].

Each concept must:
- Reinforce the core experience
- Use different mechanics/approaches
- Have clear tradeoffs

Explain reasoning for each concept.
No implementation.
```

---

## Usage Examples

### Synthesizing Feature Concepts

```
@Docs/prompts/synthesis-prompt.md
@Docs/design-intelligence/layer-1-experience-pillars.md
@Docs/design-intelligence/layer-3-core-loop.md
@Docs/research/comparative-analysis.md

Synthesize 3 distinct concepts for a fusion mechanic.

Each concept must:
- Reinforce the core fantasy (master alchemist)
- Use different fusion approaches
- Have clear tradeoffs

Explain reasoning.
No implementation.
```

### Synthesizing System Concepts

```
@Docs/prompts/synthesis-prompt.md
@Docs/design-intelligence/layer-4-systems-map.md
@Docs/research/design-patterns.md

Synthesize 3 distinct concepts for offline state management.

Each concept must:
- Support PWA offline capability
- Use different synchronization approaches
- Have clear tradeoffs

Explain reasoning.
No implementation.
```

### Synthesizing UX Concepts

```
@Docs/prompts/synthesis-prompt.md
@Docs/design-intelligence/layer-6-ux-decision-log.md
@Docs/research/design-patterns.md

Synthesize 3 distinct concepts for collection browsing UI.

Each concept must:
- Support large collections (1000+ items)
- Use different layout approaches
- Have clear tradeoffs

Explain reasoning.
No implementation.
```

---

## What Cursor Should Synthesize

### 1. Extract Principles

From research, extract:
- What works well
- What doesn't work
- Transferable principles
- Adaptable patterns

### 2. Generate Concepts

Create 3 distinct concepts:
- Different approaches
- Different tradeoffs
- Different strengths/weaknesses
- All serve the core experience

### 3. Explain Tradeoffs

For each concept:
- What it does well
- What it sacrifices
- When it works best
- When it doesn't work

---

## Concept Requirements

Each concept must:

1. **Reinforce Core Experience**
   - Serves the fantasy
   - Supports emotional beats
   - Maintains core loop

2. **Use Different Approaches**
   - Different mechanics
   - Different UX patterns
   - Different system designs

3. **Have Clear Tradeoffs**
   - Strengths and weaknesses
   - When it works
   - When it doesn't

---

## Synthesis Process

Cursor should:

1. **Review Research**
   - Read comparative analysis
   - Review design patterns
   - Understand failures

2. **Extract Principles**
   - What works
   - What doesn't
   - What's transferable

3. **Generate Concepts**
   - 3 distinct approaches
   - Each serves core experience
   - Each has tradeoffs

4. **Explain Reasoning**
   - Why each concept
   - What it serves
   - What it sacrifices

---

## Integration with Design Intelligence

Cursor should reference:

- **Layer 1 (Experience Pillars)** - Concepts serve the fantasy
- **Layer 2 (Player Psychology)** - Concepts respect cognitive limits
- **Layer 3 (Core Loop)** - Concepts reinforce the loop
- **Research** - Concepts learn from research

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

## Concept 2: [Name]
[Same structure]

## Concept 3: [Name]
[Same structure]

## Recommendation
[Which concept fits best and why]
```

---

## Success Indicators

Synthesis succeeds when:

- ✅ Cursor extracts principles from research
- ✅ Cursor generates 3 distinct concepts
- ✅ Each concept serves core experience
- ✅ Tradeoffs are clear
- ✅ Reasoning is explained
- ✅ No implementation proposed

---

## Next Steps After Synthesis

After synthesis is complete:

1. **Select Concept** - Choose which concept to pursue
2. **Blueprint** - Use `@Docs/prompts/blueprint-prompt.md`
3. **Implementation** - Use `@Docs/prompts/implementation-gate-prompt.md`

---

**This prompt activates Synthesis Mode. Cursor extracts principles and generates design concepts before implementation.**


