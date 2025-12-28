# Design Intelligence Layer 1: Experience Pillars

## Purpose

Experience Pillars define the **emotional contract** between your project and its users. This document answers: "What fantasy does this fulfill? What emotional journey does it create?"

**This is the foundation of all design decisions.**

---

## Document Structure

Every project should have an `experience-pillars.md` file that defines:

### 1. Core Fantasy

**What the user believes they are doing** - not what they're technically doing.

Example:
- **Core Fantasy**: "I am a master alchemist creating unique creatures through experimentation"
- **Not**: "I am clicking buttons to combine data structures"

**Why it matters**: Cursor uses this to ensure every feature reinforces the fantasy, not breaks it.

---

### 2. Emotional Beats

The emotional journey users experience:

- **Discovery** - Moments of "aha!" and learning
- **Tension** - Moments of challenge and uncertainty
- **Mastery** - Moments of skill demonstration
- **Reward** - Moments of achievement and recognition

**Example Emotional Beat Map**:
```
Discovery: Finding a new fusion combination
Tension: Risking valuable creatures in fusion
Mastery: Creating the perfect creature through skill
Reward: Unlocking rare visual effects
```

**Why it matters**: Cursor ensures features create these emotional moments, not just functionality.

---

### 3. What the Experience Must Never Become

**Anti-patterns and boundaries** - what would break the fantasy.

Examples:
- "Must never become a grind" - No mindless repetition
- "Must never become pay-to-win" - No monetization gates
- "Must never become overwhelming" - No cognitive overload
- "Must never become boring" - No filler content

**Why it matters**: Cursor uses this to reject features that would break the experience.

---

### 4. Reference Inspirations

**Games, apps, or systems** that capture similar feelings.

For each reference:
- **What it does well** - Specific mechanics or feelings
- **What it does poorly** - Where it fails
- **What can be adapted** - How to learn from it (not copy)

**Why it matters**: Cursor uses analogical reasoning to learn from successful systems.

---

## Template

```markdown
# Experience Pillars

## Core Fantasy

[What the user believes they are doing]

## Emotional Beats

### Discovery
[What creates "aha!" moments]

### Tension
[What creates challenge and uncertainty]

### Mastery
[What demonstrates skill]

### Reward
[What provides achievement and recognition]

## What This Must Never Become

- [Anti-pattern 1]
- [Anti-pattern 2]
- [Anti-pattern 3]

## Reference Inspirations

### [Reference 1]
- **What it does well**: [Specific mechanics/feelings]
- **What it does poorly**: [Where it fails]
- **What can be adapted**: [How to learn from it]

### [Reference 2]
- **What it does well**: [Specific mechanics/feelings]
- **What it does poorly**: [Where it fails]
- **What can be adapted**: [How to learn from it]
```

---

## How Cursor Uses This

### When Designing Features

Cursor checks:
1. Does this reinforce the core fantasy?
2. Does this create an emotional beat?
3. Does this violate any "must never become" rules?
4. Can we learn from reference inspirations?

### When Evaluating Ideas

Cursor asks:
- "Does this idea serve the core fantasy?"
- "Which emotional beat does this create?"
- "Does this risk becoming [anti-pattern]?"

### When Making Tradeoffs

Cursor prioritizes:
- Features that reinforce fantasy > Features that are just functional
- Emotional beats > Technical features
- Avoiding anti-patterns > Adding features

---

## Cross-References

- **Layer 2 (Player Psychology)**: Emotional beats map to motivation loops
- **Layer 3 (Core Loop)**: Core fantasy drives the loop design
- **Layer 4 (Systems Map)**: Systems must serve the fantasy
- **Layer 5 (Mechanic Evolution)**: Evolution must preserve the fantasy

---

## Example: Pixel Pets

```markdown
# Experience Pillars: Pixel Pets

## Core Fantasy

"I am a master alchemist creating unique creatures through experimentation and creativity. Each creature I create is permanent, unique, and mine."

## Emotional Beats

### Discovery
- Finding unexpected fusion combinations
- Discovering rare visual effects
- Learning which creatures fuse well

### Tension
- Risking valuable creatures in fusion
- Uncertainty of fusion outcomes
- Resource scarcity decisions

### Mastery
- Creating the perfect creature through skill
- Understanding fusion mechanics deeply
- Building a collection strategically

### Reward
- Unlocking rare visual effects
- Creating a unique creature
- Building a personal collection

## What This Must Never Become

- A grind (no mindless repetition)
- Pay-to-win (no monetization gates)
- Overwhelming (no cognitive overload)
- Boring (no filler content)

## Reference Inspirations

### Pokemon Fusion
- **What it does well**: Visual creativity, permanent results
- **What it does poorly**: Can become repetitive
- **What can be adapted**: Fusion mechanics, visual variety

### Alchemy Games
- **What it does well**: Experimentation, discovery
- **What it does poorly**: Can become overwhelming
- **What can be adapted**: Simple rules, complex outcomes
```

---

**This layer is the foundation. All other design layers build on this emotional contract.**


