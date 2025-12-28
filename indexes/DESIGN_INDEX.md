# Design Index

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Navigate 18-layer Design Intelligence Stack for design tasks

---

## Purpose

**When to use**: Designing mechanics, UX flows, systems, blueprints

**DO NOT** read all 18 layer files sequentially. Use this index to consult layers relevant to your design task.

---

## The 18-Layer Design Intelligence Stack

### Layer Consultation Protocol

**Mandatory Layers** (consult for EVERY design task):
1. Layer 1: Experience Pillars
2. Layer 2: Player Psychology
3. Layer 3: Core Loop

**Contextual Layers** (consult based on task):
- Layers 4-18 based on design domain

**Integration**: Blueprint Gate enforces layer consultation

---

## Layer 1: Experience Pillars (MANDATORY)

**File**: `docs/design-intelligence/layer-1-experience-pillars.md`

**When**: Every design task (always first)

**Purpose**: Define the core fantasy and experience intent

**Key Questions**:
- What fantasy does this fulfill?
- What emotion should the player feel?
- What is the experience goal?

**Use for**:
- Feature design
- Mechanic design
- UX flow design
- System design

**Decision Output**: Experience pillar alignment check

**Example**:
```markdown
Feature: Fusion Mechanic
Experience Pillar: Discovery & Creation
Fantasy: "I am a creator discovering new possibilities"
Emotion: Wonder, anticipation, surprise
```

---

## Layer 2: Player Psychology (MANDATORY)

**File**: `docs/design-intelligence/layer-2-player-psychology.md`

**When**: Every design task (consult after Layer 1)

**Purpose**: Understand player motivation and behavior

**Key Frameworks**:
- Bartle's Player Types (Achiever, Explorer, Socializer, Killer)
- Self-Determination Theory (Autonomy, Competence, Relatedness)
- Flow State Theory (Challenge vs Skill)

**Use for**:
- Motivation design
- Reward structure
- Progression pacing
- Engagement hooks

**Decision Output**: Player psychology alignment

**Example**:
```markdown
Feature: Fusion Mechanic
Target Player Type: Explorer (70%), Achiever (30%)
Motivation: Intrinsic (discovery), Extrinsic (collection completion)
Flow: Challenge = moderate, Skill ceiling = high
```

---

## Layer 3: Core Loop (MANDATORY)

**File**: `docs/design-intelligence/layer-3-core-loop.md`

**When**: Every design task (consult after Layer 2)

**Purpose**: Ensure feature integrates with core experience loop

**Core Loop Structure**:
```
Action → Feedback → Reward → Action
```

**Key Constraints**:
- Core loop duration: 15-60 seconds (.cursorrules line 271)
- Clear cause-effect relationship
- Immediate feedback (< 100ms)

**Use for**:
- Feature integration
- Pacing design
- Feedback timing
- Reward cadence

**Decision Output**: Core loop integration plan

**Example**:
```markdown
Feature: Fusion Mechanic
Loop Integration:
- Action: Select 2 pets + tap Fuse
- Feedback: Visual animation (2s)
- Reward: New pet revealed
- Next Action: View new pet → collect more
Loop Duration: 45 seconds (within 15-60s constraint)
```

---

## Layer 4: Systems Map

**File**: `docs/design-intelligence/layer-4-systems-map.md`

**When**: Designing multi-system features

**Purpose**: Map system interactions and dependencies

**Use for**:
- System architecture
- Feature integration
- Dependency management
- Complexity assessment

**Decision Output**: Systems dependency graph

**Consultation Triggers**:
- New system design
- Cross-system features
- Architecture decisions

---

## Layer 5: Mechanic Evolution

**File**: `docs/design-intelligence/layer-5-mechanic-evolution.md`

**When**: Designing mechanics or features that evolve over time

**Purpose**: Plan how mechanics grow in complexity

**Use for**:
- Tutorial design
- Difficulty progression
- Feature unlocking
- Mechanic layering

**Decision Output**: Evolution timeline

**Consultation Triggers**:
- Mechanic design
- Progression systems
- Tutorial flows

---

## Layer 6: UX Decision Log

**File**: `docs/design-intelligence/layer-6-ux-decision-log.md`

**When**: Making UX/UI decisions

**Purpose**: Document UX decisions and rationale

**Use for**:
- UI design decisions
- Interaction patterns
- Navigation structure
- Visual hierarchy

**Decision Output**: Logged UX decision with rationale

**Consultation Triggers**:
- UI design
- Navigation changes
- Interaction patterns

---

## Layer 7: Design Thinking

**File**: `docs/design-intelligence/layer-7-design-thinking.md`

**When**: Problem-solving and ideation

**Purpose**: Structured design thinking process

**Process**: Empathize → Define → Ideate → Prototype → Test

**Use for**:
- Problem framing
- Ideation sessions
- Solution exploration
- Rapid prototyping

**Decision Output**: Design thinking artifacts (personas, journey maps, etc.)

**Consultation Triggers**:
- New feature ideation
- Problem-solving
- User research

---

## Layer 8: Emotional Design

**File**: `docs/design-intelligence/layer-8-emotional-design.md`

**When**: Designing emotional experiences

**Purpose**: Craft specific emotional responses

**Emotional Palette**:
- Joy, surprise, wonder, satisfaction, pride, anticipation

**Use for**:
- Reward design
- Moment design
- Emotional arcs
- Surprise mechanics

**Decision Output**: Emotional journey map

**Consultation Triggers**:
- Reward systems
- Key moments
- Narrative design

---

## Layer 9: Cognitive Architecture

**File**: `docs/design-intelligence/layer-9-cognitive-architecture.md`

**When**: Managing cognitive load and complexity

**Purpose**: Design within cognitive constraints

**Key Principles**:
- Working memory: 3-4 items (Complexity Gate enforces ≤ 3)
- Attention span management
- Pattern recognition
- Mental model alignment

**Use for**:
- Tutorial design
- UI complexity
- Information architecture
- Onboarding flows

**Decision Output**: Cognitive load assessment

**Consultation Triggers**:
- Complex features
- Tutorial design
- Information hierarchy

---

## Layer 10: Behavioral Economics

**File**: `docs/design-intelligence/layer-10-behavioral-economics.md`

**When**: Designing choice architecture and incentives

**Purpose**: Leverage behavioral principles ethically

**Key Principles**:
- Loss aversion
- Endowment effect
- Scarcity principle
- Anchoring
- Framing effects

**Use for**:
- Economy design
- Choice presentation
- Reward framing
- Progression incentives

**Decision Output**: Behavioral framework

**Consultation Triggers**:
- Economy design
- Reward systems
- Choice mechanics

---

## Layer 11: Player Psychology Advanced

**File**: `docs/design-intelligence/layer-11-player-psychology-advanced.md`

**When**: Deep player behavior modeling

**Purpose**: Advanced psychological frameworks

**Frameworks**:
- Fogg Behavior Model (Motivation × Ability × Trigger)
- Hooked Model (Trigger → Action → Reward → Investment)
- Octalysis Framework (8 core drives)

**Use for**:
- Engagement design
- Retention mechanics
- Habit formation
- Long-term motivation

**Decision Output**: Advanced psychology model

**Consultation Triggers**:
- Retention design
- Engagement mechanics
- Long-term systems

---

## Layer 12: Motivation Systems

**File**: `docs/design-intelligence/layer-12-motivation-systems.md`

**When**: Designing progression and goals

**Purpose**: Structure intrinsic and extrinsic motivation

**Motivation Types**:
- Intrinsic: Mastery, autonomy, purpose
- Extrinsic: Rewards, achievements, status

**Use for**:
- Goal hierarchies
- Achievement systems
- Progression design
- Challenge balance

**Decision Output**: Motivation map

**Consultation Triggers**:
- Progression systems
- Achievement design
- Goal structures

---

## Layer 13: Cognitive Load Management

**File**: `docs/design-intelligence/layer-13-cognitive-load-management.md`

**When**: Optimizing information processing

**Purpose**: Minimize cognitive overhead

**Load Types**:
- Intrinsic load (task complexity)
- Extraneous load (UI/presentation)
- Germane load (schema building)

**Use for**:
- UI simplification
- Tutorial pacing
- Feature introduction
- Complexity budgeting

**Decision Output**: Cognitive load budget

**Consultation Triggers**:
- Complex UIs
- Tutorial design
- Onboarding

---

## Layer 14: Emotional Journey Mapping

**File**: `docs/design-intelligence/layer-14-emotional-journey-mapping.md`

**When**: Planning emotional arcs

**Purpose**: Choreograph emotional experience over time

**Journey Phases**:
- Onboarding: Wonder → Competence
- Mastery: Challenge → Achievement
- Endgame: Mastery → Purpose

**Use for**:
- Session design
- Narrative arcs
- Pacing
- Moment sequencing

**Decision Output**: Emotional journey map

**Consultation Triggers**:
- Narrative design
- Session structure
- Pacing design

---

## Layer 15: Project Memory

**File**: `docs/design-intelligence/layer-15-project-memory.md`

**When**: Learning from past projects

**Purpose**: Leverage accumulated project wisdom

**Content**:
- Past successes
- Past failures
- Pattern effectiveness
- Decision outcomes

**Use for**:
- Pattern selection
- Risk assessment
- Decision validation
- Anti-pattern avoidance

**Decision Output**: Historical context for decisions

**Consultation Triggers**:
- Pattern selection
- Similar features
- Risk assessment

---

## Layer 16: Meta-Cognitive Reasoning

**File**: `docs/design-intelligence/layer-16-meta-cognitive-reasoning.md`

**When**: Validating reasoning quality

**Purpose**: AI reasoning about its own design reasoning

**Use for**:
- Reasoning chain validation
- Decision quality assessment
- Bias detection
- Meta-pattern recognition

**Decision Output**: Reasoning quality report

**Consultation Triggers**:
- Complex decisions
- High-stakes design
- Novel patterns

---

## Layer 17: Contextual Adaptation

**File**: `docs/design-intelligence/layer-17-contextual-adaptation.md`

**When**: Adapting to project context

**Purpose**: Dynamic layer weighting based on project needs

**Adaptation Factors**:
- Project complexity (simple vs complex)
- Time constraints
- Resource constraints
- Audience sophistication

**Use for**:
- Layer prioritization
- Reasoning depth adjustment
- Resource allocation

**Decision Output**: Context-adapted layer weights

**Consultation Triggers**:
- Project start
- Constraint changes
- Scope adjustments

---

## Layer 18: Temporal Reasoning

**File**: `docs/design-intelligence/layer-18-temporal-reasoning.md`

**When**: Planning long-term evolution

**Purpose**: Time-dependent decision making

**Temporal Factors**:
- Time-to-market
- Technical debt accumulation
- Evolution timeline
- Maintenance cost over time

**Use for**:
- Roadmap planning
- Technical debt assessment
- Evolution strategy
- Maintenance planning

**Decision Output**: Temporal impact analysis

**Consultation Triggers**:
- Roadmap planning
- Technical debt decisions
- Evolution planning

---

## Layer Consultation Matrix

| Design Task | Mandatory Layers | Recommended Layers | Optional Layers |
|-------------|------------------|--------------------|--------------------|
| **New Mechanic** | 1, 2, 3 | 5, 8, 11, 12 | 4, 10, 15 |
| **UX Flow** | 1, 2, 3 | 6, 9, 13, 14 | 7, 8 |
| **System Architecture** | 1, 3 | 4, 16, 17 | 18 |
| **Tutorial** | 1, 2, 3 | 5, 9, 13 | 7, 14 |
| **Progression** | 1, 2, 3 | 5, 10, 11, 12 | 15, 18 |
| **Reward System** | 1, 2, 3 | 8, 10, 11, 12 | 14, 15 |
| **Onboarding** | 1, 2, 3 | 5, 9, 13, 14 | 7 |
| **Economy** | 1, 2, 3 | 10, 12 | 11, 18 |
| **Engagement** | 1, 2, 3 | 11, 12, 14 | 8, 10, 15 |

**Rule**: Always consult layers 1-3. Consult others based on task.

---

## Design Decision Template

When making design decisions, document layer consultation:

```markdown
## Design Decision: [Feature Name]

### Layer 1: Experience Pillars
- Core Fantasy: [What fantasy?]
- Experience Goal: [What should player feel?]
- Alignment: ✅ Aligned / ⚠️ Review needed

### Layer 2: Player Psychology
- Target Player Type: [Bartle type]
- Primary Motivation: [Intrinsic/Extrinsic]
- Flow Balance: [Challenge vs Skill]

### Layer 3: Core Loop
- Loop Integration: [How does this fit?]
- Loop Duration: [Seconds]
- Feedback Timing: [ms]

### [Other Consulted Layers...]

### Final Design Decision
[Decision text]

### Rationale
[Why this decision, based on layers]
```

---

## Integration with Blueprint Gate

**Blueprint Gate** (`gates/blueprint-gate.md`) enforces:
- Layers 1-3 are **MANDATORY** for all blueprints
- Relevant contextual layers must be consulted
- Layer consultation must be documented in blueprint

**Blueprint Section**:
```markdown
## Design Intelligence Layers Consulted

### Layer 1: Experience Pillars
[Consultation notes]

### Layer 2: Player Psychology
[Consultation notes]

### Layer 3: Core Loop
[Consultation notes]

[... other consulted layers ...]
```

---

## Quick Reference: Task → Layers

### "Design new mechanic"
**Load**: Layers 1, 2, 3 (mandatory)
**Load**: Layers 5, 8, 11, 12 (recommended)
**Optional**: Layers 4, 10, 15

### "Design UX flow"
**Load**: Layers 1, 2, 3 (mandatory)
**Load**: Layers 6, 9, 13, 14 (recommended)
**Optional**: Layers 7, 8

### "Design tutorial"
**Load**: Layers 1, 2, 3 (mandatory)
**Load**: Layers 5, 9, 13 (recommended)
**Optional**: Layers 7, 14

### "Design progression system"
**Load**: Layers 1, 2, 3 (mandatory)
**Load**: Layers 5, 10, 11, 12 (recommended)
**Optional**: Layers 15, 18

### "Design reward system"
**Load**: Layers 1, 2, 3 (mandatory)
**Load**: Layers 8, 10, 11, 12 (recommended)
**Optional**: Layers 14, 15

---

## Layer Dependencies

Some layers reference others:

```
Layer 1 (Experience Pillars)
  └─→ Foundation for all other layers

Layer 2 (Player Psychology)
  └─→ Informs Layers 8, 11, 12, 14

Layer 3 (Core Loop)
  └─→ Informs Layers 4, 5

Layer 9 (Cognitive Architecture)
  └─→ Informs Layer 13

Layer 11 (Advanced Psychology)
  ├─→ Extends Layer 2
  └─→ Informs Layer 12

Layer 16 (Meta-Cognitive)
  └─→ References all layers (validation)

Layer 17 (Contextual Adaptation)
  └─→ Weights all layers based on context
```

**Load dependencies** when consulting a layer that references others.

---

## Design Intelligence Stack Workflow

### 1. Problem Definition Phase
**Load**: Layer 1, Layer 2
**Output**: Problem framed in experience terms

### 2. Solution Ideation Phase
**Load**: Layer 7 (Design Thinking)
**Optional**: Layer 15 (Project Memory)
**Output**: Multiple solution candidates

### 3. Solution Design Phase
**Load**: Layer 3 (Core Loop), contextual layers
**Output**: Detailed design

### 4. Validation Phase
**Load**: Layer 16 (Meta-Cognitive), relevant gates
**Output**: Validated design ready for blueprint

### 5. Blueprint Phase
**Load**: All consulted layers
**Output**: Complete blueprint with layer documentation

---

## Related Indexes

- **[[MASTER_INDEX.md]]** - Top-level navigation
- **[[PATTERN_INDEX.md]]** - Design patterns
- **[[PROTOCOL_INDEX.md]]** - Design protocols
- **[[ARCHITECTURE_INDEX.md]]** - Implementation architecture

---

## Gates Required for Design

Before creating blueprint:

1. **Blueprint Gate** - Validates layer consultation
2. **Complexity Gate** - Validates cognitive load (≤ 3 concepts)
3. **Reuse Gate** - Pattern search performed

All gates must pass.

---

## Notes

- **Layers 1-3 are non-negotiable** - always consult
- **Context determines other layers** - use consultation matrix
- **Document all consultations** - Blueprint Gate enforces
- **Layers are compressed wisdom** - don't skip them
- **Meta-layers (16-18) are advanced** - use for complex designs

**The Design Intelligence Stack is your design reasoning framework.**

**Consult layers. Document decisions. Execute with gates.**
