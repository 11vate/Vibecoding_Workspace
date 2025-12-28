# Design Intelligence Layer 2: Player Psychology

## Purpose

Player Psychology defines **how the experience feels** from a cognitive and motivational perspective. This document answers: "What motivates users? What are their cognitive limits? How do they learn and engage?"

**This is where Cursor becomes dangerous (in a good way) - understanding user psychology enables intelligent design decisions.**

---

## Document Structure

Every project should have a `player-psychology.md` file that defines:

### 1. Motivation Loops

**What drives users to continue engaging** - the psychological hooks.

Common motivation loops:

- **Collection** - Gathering, completing sets, hoarding
- **Mastery** - Improving skill, optimizing, perfecting
- **Creativity** - Expressing self, customizing, creating
- **Expression** - Showing off, sharing, competing
- **Exploration** - Discovering, uncovering, learning
- **Social** - Connecting, collaborating, competing

**Example Motivation Loop Map**:
```
Primary: Collection (gathering creatures)
Secondary: Creativity (creating unique combinations)
Tertiary: Expression (showing off collection)
```

**Why it matters**: Cursor ensures features tap into these motivations, not ignore them.

---

### 2. Cognitive Load Limits

**How much complexity users can handle** - mental capacity boundaries.

Consider:
- **Information density** - How much info per screen
- **Decision complexity** - How many choices at once
- **Learning curve** - How quickly users can learn
- **Memory requirements** - What users must remember

**Example Cognitive Load Map**:
```
Maximum information per screen: 7±2 items
Maximum decisions per interaction: 3 choices
Learning curve: Gradual introduction over 5 sessions
Memory requirements: Visual recognition > Text recall
```

**Why it matters**: Cursor prevents cognitive overload by respecting these limits.

---

### 3. Reward Timing

**When and how users receive feedback** - reinforcement schedules.

Types of rewards:
- **Immediate** - Instant feedback (visual, audio)
- **Short-term** - Within session (progress, unlocks)
- **Long-term** - Across sessions (achievements, collections)

**Example Reward Schedule**:
```
Immediate: Visual/audio feedback on every action
Short-term: Unlock new fusion after 3 successful fusions
Long-term: Rare creature after 10 unique fusions
```

**Why it matters**: Cursor ensures rewards are timed to maintain engagement.

---

### 4. Failure States and Recovery

**How users experience failure** - and how they recover.

Consider:
- **Failure types** - Mistakes, bad luck, skill gaps
- **Failure feedback** - How failure is communicated
- **Recovery paths** - How users can recover
- **Failure tolerance** - How much failure is acceptable

**Example Failure Model**:
```
Failure types:
- Mistake: Wrong fusion combination (recoverable)
- Bad luck: Unfavorable outcome (acceptable)
- Skill gap: Need to learn mechanics (teachable)

Recovery:
- Mistakes: Undo or try again (low cost)
- Bad luck: Accept and try again (part of experience)
- Skill gap: Tutorial and hints (supportive)
```

**Why it matters**: Cursor ensures failure is constructive, not frustrating.

---

### 5. Short vs Long-Term Engagement

**How users engage over time** - session design and retention.

Consider:
- **Session length** - Typical play session duration
- **Session goals** - What users accomplish per session
- **Retention hooks** - What brings users back
- **Progression pacing** - How quickly users advance

**Example Engagement Model**:
```
Session length: 5-15 minutes
Session goals: Complete 1-3 fusions, discover 1 new combination
Retention hooks: Daily fusion attempts, collection building
Progression pacing: New mechanics every 5 sessions
```

**Why it matters**: Cursor designs features for both immediate and long-term engagement.

---

## Template

```markdown
# Player Psychology

## Motivation Loops

### Primary Motivation
[Main driver: Collection/Mastery/Creativity/etc.]

### Secondary Motivation
[Supporting driver]

### Tertiary Motivation
[Additional driver]

## Cognitive Load Limits

- **Information density**: [Max items per screen]
- **Decision complexity**: [Max choices per interaction]
- **Learning curve**: [How quickly users learn]
- **Memory requirements**: [What users must remember]

## Reward Timing

### Immediate Rewards
[Instant feedback mechanisms]

### Short-Term Rewards
[Within-session rewards]

### Long-Term Rewards
[Across-session rewards]

## Failure States and Recovery

### Failure Types
- [Type 1]: [How it's handled]
- [Type 2]: [How it's handled]
- [Type 3]: [How it's handled]

### Recovery Paths
[How users recover from failure]

## Short vs Long-Term Engagement

### Session Design
- **Length**: [Typical session duration]
- **Goals**: [What users accomplish per session]

### Retention
- **Hooks**: [What brings users back]
- **Pacing**: [How quickly users advance]
```

---

## How Cursor Uses This

### When Designing Mechanics

Cursor checks:
1. Does this tap into motivation loops?
2. Does this respect cognitive load limits?
3. Does this provide appropriate reward timing?
4. Does this handle failure gracefully?

### When Evaluating UI/UX

Cursor asks:
- "Is this information density acceptable?"
- "Are there too many decisions at once?"
- "Is the learning curve too steep?"
- "Will users remember this?"

### When Balancing Systems

Cursor considers:
- Reward frequency vs. value
- Failure rate vs. recovery cost
- Session length vs. engagement depth
- Progression speed vs. retention

---

## Cross-References

- **Layer 1 (Experience Pillars)**: Motivation loops support emotional beats
- **Layer 3 (Core Loop)**: Psychology drives loop design
- **Layer 4 (Systems Map)**: Systems must respect cognitive limits
- **Layer 6 (UX Decision Log)**: UI decisions reference psychology

---

## Example: Pixel Pets

```markdown
# Player Psychology: Pixel Pets

## Motivation Loops

### Primary Motivation
**Collection** - Gathering unique creatures, completing visual sets

### Secondary Motivation
**Creativity** - Creating unique combinations, expressing style

### Tertiary Motivation
**Expression** - Showing off collection, sharing discoveries

## Cognitive Load Limits

- **Information density**: Max 5 creatures visible at once
- **Decision complexity**: Max 2 creatures to fuse at once
- **Learning curve**: Core mechanics in first session, advanced in session 3-5
- **Memory requirements**: Visual recognition (creatures) > Text recall (names)

## Reward Timing

### Immediate Rewards
- Visual feedback on fusion (particles, colors)
- Audio feedback (success sounds)
- Creature appearance animation

### Short-Term Rewards
- Unlock new fusion slot after 3 successful fusions
- Discover new visual effect after 5 fusions
- Collection milestone after 10 creatures

### Long-Term Rewards
- Rare creature after 20 unique fusions
- Special visual effect after 50 fusions
- Collection completion badge after 100 creatures

## Failure States and Recovery

### Failure Types
- **Mistake**: Wrong fusion combination → Can undo (low cost)
- **Bad luck**: Unfavorable outcome → Accept and try again (part of experience)
- **Skill gap**: Don't understand mechanics → Tutorial hints (supportive)

### Recovery Paths
- Mistakes: Undo button, try again immediately
- Bad luck: Accept outcome, try different combination
- Skill gap: Contextual hints, tutorial system

## Short vs Long-Term Engagement

### Session Design
- **Length**: 5-15 minutes
- **Goals**: Complete 1-3 fusions, discover 1 new combination

### Retention
- **Hooks**: Daily fusion attempts, collection building, rare creature chances
- **Pacing**: New fusion mechanics every 5 sessions, visual variety increases over time
```

---

**This layer ensures Cursor designs for how users actually think and feel, not just what's technically possible.**


