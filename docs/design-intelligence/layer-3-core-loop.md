# Design Intelligence Layer 3: Core Loop

## Purpose

The Core Loop is **the heart of all design** - the fundamental cycle that users repeat. This document answers: "What is the basic action cycle? What makes users want to repeat it?"

**Every feature must reinforce this loop. Systems that don't reinforce the loop should be removed.**

---

## Document Structure

Every project should have a `core-loop.md` file that defines:

### 1. Loop Structure

**The basic cycle** - Observe → Decide → Act → Feedback → Progress → Repeat

Each step must be defined:

- **Observe** - What users see/understand
- **Decide** - What choices users make
- **Act** - What action users take
- **Feedback** - What response the system gives
- **Progress** - What changes/advances
- **Repeat** - What makes users want to do it again

**Why it matters**: Cursor ensures every feature fits into this loop or extends it meaningfully.

---

### 2. Data Changes at Each Step

**What state/data changes** at each step of the loop.

Example:
```
Observe: Display current creatures, available fusions
Decide: Choose which creatures to fuse
Act: Execute fusion
Feedback: Show fusion result, visual/audio feedback
Progress: Update collection, unlock new possibilities
Repeat: New creatures enable new fusions
```

**Why it matters**: Cursor understands the data flow and state transitions.

---

### 3. What the Player Learns

**What knowledge/skill users gain** at each step.

Example:
```
Observe: Learn which creatures exist, which combinations are possible
Decide: Learn decision-making patterns, risk assessment
Act: Learn action execution, timing
Feedback: Learn cause-effect relationships
Progress: Learn progression systems, long-term goals
Repeat: Learn mastery, optimization
```

**Why it matters**: Cursor ensures the loop teaches and builds mastery over time.

---

### 4. Feedback Mechanisms

**What feedback is given** - visual, audio, systemic.

Types of feedback:
- **Visual** - Animations, particles, UI updates
- **Audio** - Sound effects, music changes
- **Systemic** - State changes, unlocks, progression

**Example Feedback Map**:
```
Visual: Fusion animation, creature appearance, particle effects
Audio: Fusion sound, success chime, ambient music
Systemic: Collection update, unlock notification, progress bar
```

**Why it matters**: Cursor ensures feedback is immediate, clear, and satisfying.

---

## Template

```markdown
# Core Loop

## Loop Structure

### Observe
[What users see/understand]

### Decide
[What choices users make]

### Act
[What action users take]

### Feedback
[What response the system gives]

### Progress
[What changes/advances]

### Repeat
[What makes users want to do it again]

## Data Changes at Each Step

### Observe
[What data is displayed/accessed]

### Decide
[What data influences decisions]

### Act
[What data is modified]

### Feedback
[What data drives feedback]

### Progress
[What data advances]

### Repeat
[What data enables repetition]

## What the Player Learns

### Observe
[What knowledge is gained from observation]

### Decide
[What skills are developed through decisions]

### Act
[What mastery is built through action]

### Feedback
[What understanding comes from feedback]

### Progress
[What long-term knowledge is built]

### Repeat
[What expertise develops over time]

## Feedback Mechanisms

### Visual
[Visual feedback: animations, particles, UI]

### Audio
[Audio feedback: sounds, music]

### Systemic
[System feedback: state changes, unlocks, progression]
```

---

## How Cursor Uses This

### When Designing Features

Cursor checks:
1. Does this reinforce the core loop?
2. Does this extend the loop meaningfully?
3. Does this break the loop flow?
4. Does this add unnecessary complexity?

### When Evaluating Systems

Cursor asks:
- "Does this system support the loop?"
- "Does this add steps that don't serve the loop?"
- "Does this provide appropriate feedback?"
- "Does this create progress that matters?"

### When Removing Features

Cursor considers:
- Systems that don't reinforce the loop → Remove
- Steps that break the flow → Simplify
- Feedback that's unclear → Improve
- Progress that doesn't matter → Rework

---

## Core Loop Principles

### 1. Simplicity

The loop should be simple to understand, even if the systems are complex.

### 2. Clarity

Each step should be clear - users should know what to do.

### 3. Feedback

Every action should have immediate, clear feedback.

### 4. Progress

Every iteration should create meaningful progress.

### 5. Desire to Repeat

The loop should create intrinsic motivation to repeat.

---

## Cross-References

- **Layer 1 (Experience Pillars)**: Core loop serves the fantasy
- **Layer 2 (Player Psychology)**: Loop respects cognitive limits and motivations
- **Layer 4 (Systems Map)**: Systems support the loop
- **Layer 5 (Mechanic Evolution)**: Loop evolves but remains recognizable

---

## Example: Pixel Pets

```markdown
# Core Loop: Pixel Pets

## Loop Structure

### Observe
See current collection of creatures, available fusion combinations, visual possibilities

### Decide
Choose which creatures to fuse, assess risk/reward, plan collection strategy

### Act
Execute fusion, watch the process, see the result

### Feedback
Visual fusion animation, creature appearance, audio success sound, collection update

### Progress
New creature added to collection, new fusion possibilities unlocked, visual variety increased

### Repeat
New creatures enable new fusions, collection grows, more possibilities emerge

## Data Changes at Each Step

### Observe
- Display: Current creatures, fusion combinations, collection stats
- Access: Creature data, fusion rules, visual effects

### Decide
- Input: User selection, risk assessment
- Process: Fusion compatibility check, outcome calculation

### Act
- Modify: Creature collection, fusion history
- Create: New creature, fusion record

### Feedback
- Update: UI state, collection display, progress indicators
- Trigger: Animations, sounds, notifications

### Progress
- Advance: Collection size, unlocked combinations, visual variety
- Track: Fusion count, unique creatures, milestones

### Repeat
- Enable: New fusion possibilities, expanded collection
- Motivate: Collection growth, discovery potential

## What the Player Learns

### Observe
- Which creatures exist and their properties
- Which combinations are possible
- Visual patterns and aesthetics

### Decide
- Risk assessment (valuable vs. experimental creatures)
- Strategic planning (collection goals)
- Pattern recognition (which fusions work well)

### Act
- Action execution and timing
- System interaction patterns
- Cause-effect relationships

### Feedback
- Fusion outcome patterns
- Visual effect relationships
- Collection building strategies

### Progress
- Long-term collection goals
- Progression systems and unlocks
- Mastery of fusion mechanics

### Repeat
- Optimization strategies
- Advanced fusion techniques
- Collection completion approaches

## Feedback Mechanisms

### Visual
- Fusion animation (particles, colors, transitions)
- Creature appearance (unique visuals, animations)
- UI updates (collection display, progress indicators)
- Particle effects (success, rarity, special effects)

### Audio
- Fusion sound (whoosh, pop, success chime)
- Creature sounds (idle animations, special effects)
- Ambient music (mood, intensity changes)

### Systemic
- Collection update (new creature added)
- Unlock notification (new combinations available)
- Progress tracking (fusion count, milestones)
- Visual variety increase (more unique creatures)
```

---

## Anti-Patterns

### 1. Loop Breaking

Adding steps that don't serve the loop:
- Unnecessary confirmation dialogs
- Forced tutorials mid-loop
- Complex menus between steps

### 2. Unclear Feedback

Feedback that doesn't communicate:
- Vague success/failure indicators
- Unclear progress signals
- Confusing state changes

### 3. Meaningless Progress

Progress that doesn't matter:
- Numbers that don't affect gameplay
- Unlocks that don't enable new possibilities
- Rewards that don't reinforce the loop

---

**This layer is the heart. Every feature must serve this loop or be removed.**


