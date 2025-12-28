# Design Intelligence System (DIS)

**Authority Tier**: 2 (Mandatory Process - consult relevant layers for all design decisions)
**Version**: 2.0 (18 layers)
**Last Updated**: 2025-01-24

---

## Overview

The **Design Intelligence System (DIS)** is an 18-layer framework for systematic design reasoning. Each layer represents a critical dimension of design thinking, from player experience to meta-cognitive validation.

**Philosophy**: Design decisions should be grounded in explicit reasoning, not intuition alone. The DIS provides the structure for rigorous, traceable design thinking.

**How to Use**:
1. **For all projects**: Consult Layers 1-3 (mandatory foundation)
2. **For specific decisions**: Consult relevant layers 4-15 as needed
3. **For complex decisions**: Apply Layer 16 (meta-cognitive validation)
4. **Adapt depth**: Use Layer 17 to determine appropriate reasoning depth
5. **Consider time**: Use Layer 18 for temporal tradeoffs

---

## Layer Categories

### Foundation Layers (1-3): ALWAYS Consult

**These layers define the core experience and must be consulted for every design decision.**

- **[[Layer 1: Experience Pillars]]** - What experience are we creating?
- **[[Layer 2: Player Psychology]]** - How do players think and feel?
- **[[Layer 3: Core Loop]]** - What is the fundamental gameplay cycle?

**Time Investment**: 30-60 minutes for major decisions

---

### Systems Layers (4-7): Consult for Technical Decisions

**These layers define system architecture, relationships, and evolution.**

- **[[Layer 4: Systems Map]]** - How do systems relate and interact?
- **[[Layer 5: Mechanic Evolution]]** - How do mechanics evolve over time?
- **[[Layer 6: UX Decision Log]]** - What UX decisions have been made and why?
- **[[Layer 7: Dependency Chain]]** - What depends on what?

**Time Investment**: 20-40 minutes per relevant layer

---

### Quality Layers (8-10): Consult for User-Facing Features

**These layers ensure player experience quality and accessibility.**

- **[[Layer 8: Progression Curve]]** - How does difficulty and reward scale?
- **[[Layer 9: Progressive Disclosure]]** - How do we introduce complexity gradually?
- **[[Layer 10: Asset Intelligence]]** - How do we manage and reuse assets?

**Time Investment**: 15-30 minutes per relevant layer

---

### Interaction Layers (11-13): Consult for Player-Facing Systems

**These layers define how players interact with the system.**

- **[[Layer 11: Failure States]]** - What can go wrong and how do we handle it?
- **[[Layer 12: Feedback Mechanisms]]** - How does the system communicate with players?
- **[[Layer 13: Offline-First Design]]** - How does it work without connectivity?

**Time Investment**: 15-25 minutes per relevant layer

---

### Polish Layers (14-15): Consult for Refinement

**These layers elevate experience from functional to delightful.**

- **[[Layer 14: Micro-Interactions]]** - What small details enhance experience?
- **[[Layer 15: Sensory Design]]** - How do visuals, audio, haptics reinforce experience?

**Time Investment**: 10-20 minutes per relevant layer

---

### Meta-Intelligence Layers (16-18): Consult for Complex/Novel Decisions

**These layers ensure reasoning quality and contextual appropriateness.**

- **[[Layer 16: Meta-Cognitive Reasoning]]** - Is my reasoning process sound?
- **[[Layer 17: Contextual Adaptation]]** - What reasoning depth is appropriate?
- **[[Layer 18: Temporal Reasoning]]** - What are the long-term implications?

**Time Investment**: 15-60 minutes based on complexity

---

## Layer Selection Guide

### "I'm designing a new mechanic..."

**Mandatory**:
- Layer 1: Does it serve the core fantasy?
- Layer 2: Does it respect player psychology?
- Layer 3: How does it integrate with the core loop?

**Strongly Recommended**:
- Layer 4: How does it interact with other systems?
- Layer 5: How will it evolve?
- Layer 8: How does it affect progression?
- Layer 11: What can fail and how do we handle it?

**Consider**:
- Layer 16: Meta-cognitive validation (if novel or high-risk)
- Layer 18: Temporal impact (maintenance burden, evolution cost)

---

### "I'm designing a UI screen..."

**Mandatory**:
- Layer 1: Does it communicate the fantasy?
- Layer 2: Does it respect cognitive limits?
- Layer 3: Does it support the core loop?

**Strongly Recommended**:
- Layer 6: Is it consistent with UX decisions?
- Layer 9: Does it progressively disclose complexity?
- Layer 12: Are feedback mechanisms clear?
- Layer 14: Are micro-interactions polished?

**Consider**:
- Layer 15: Does sensory design reinforce experience?

---

### "I'm making an architecture decision..."

**Mandatory**:
- Layer 4: How does this affect system relationships?
- Layer 7: What are the dependency implications?

**Strongly Recommended**:
- Layer 13: Does it support offline-first?
- Layer 18: What are the long-term costs? (TCO analysis)

**Consider**:
- Layer 16: Is my reasoning sound? (architecture is hard to reverse)
- Layer 17: What reasoning depth is appropriate?

---

### "I'm prioritizing features..."

**Mandatory**:
- Layer 1: Which features serve the core fantasy?
- Layer 3: Which features reinforce the core loop?

**Strongly Recommended**:
- Layer 17: What's the appropriate scope for time available?
- Layer 18: Time-to-value analysis - which delivers value fastest?

**Consider**:
- Layer 5: Which features enable future evolution?

---

## Quick Reference: Layer Relationships

```
Layer 1 (Experience Pillars)
  ↓ informs ↓
Layer 2 (Player Psychology) + Layer 3 (Core Loop)
  ↓ constrain ↓
Layer 4-15 (Specific Design Layers)
  ↓ validated by ↓
Layer 16 (Meta-Cognitive Reasoning)

Layer 17 (Contextual Adaptation)
  → weights all layers ←

Layer 18 (Temporal Reasoning)
  → considers Layer 5 (Evolution) over time ←
```

---

## Reasoning Depth Levels

### Level 1: Surface (Trivial projects)
- **Layers Used**: 1-3 only
- **Time**: 10-15 minutes
- **Validation**: "Does it serve the fantasy?"

### Level 2: First-Order (Simple projects)
- **Layers Used**: 1-6
- **Time**: 30-45 minutes
- **Validation**: "Does it satisfy core constraints?"

### Level 3: Second-Order (Moderate projects)
- **Layers Used**: 1-10
- **Time**: 60-90 minutes
- **Validation**: "Have I considered ripple effects?"

### Level 4: Third-Order (Complex projects)
- **Layers Used**: 1-15
- **Time**: 2-4 hours
- **Validation**: "Have I considered long-term evolution?"

### Level 5: Meta-Cognitive (Highly complex/novel)
- **Layers Used**: 1-16
- **Time**: 3-6 hours
- **Validation**: "Is my reasoning process itself sound?"

**Use Layer 17 to determine appropriate depth level for your project.**

---

## Integration with Workspace

### With Modes
- **[[Exploration Mode]]**: Uses DIS to validate research findings
- **[[Synthesis Mode]]**: Uses DIS layers 1-6 to evaluate design concepts
- **[[Blueprint Mode]]**: Must reference all relevant DIS layers in blueprint
- **[[Implementation Mode]]**: Validates implementation aligns with DIS-informed blueprint

### With Gates
- **[[Blueprint Gate]]**: Requires all relevant DIS layers consulted and documented
- **[[Complexity Gate]]**: References Layer 2 (cognitive limits), Layer 9 (progressive disclosure)
- **[[Architecture Gate]]**: References Layer 4 (systems map), Layer 7 (dependencies)

### With Tools
- **Decision Tracker**: Logs which DIS layers informed each decision
- **Constraint Validator**: Validates against constraints defined in DIS layers
- **Pattern Matcher**: Matches patterns to DIS layer principles

---

## Layer Index (Full List)

### Core Experience (Layers 1-3)
1. **Experience Pillars** - `layer-1-experience-pillars.md`
2. **Player Psychology** - `layer-2-player-psychology.md`
3. **Core Loop** - `layer-3-core-loop.md`

### System Architecture (Layers 4-7)
4. **Systems Map** - `layer-4-systems-map.md`
5. **Mechanic Evolution** - `layer-5-mechanic-evolution.md`
6. **UX Decision Log** - `layer-6-ux-decision-log.md`
7. **Dependency Chain** - `layer-7-dependency-chain.md`

### Player Experience (Layers 8-10)
8. **Progression Curve** - `layer-8-progression-curve.md`
9. **Progressive Disclosure** - `layer-9-progressive-disclosure.md`
10. **Asset Intelligence** - `layer-10-asset-intelligence.md`

### Interaction Design (Layers 11-13)
11. **Failure States** - `layer-11-failure-states.md`
12. **Feedback Mechanisms** - `layer-12-feedback-mechanisms.md`
13. **Offline-First Design** - `layer-13-offline-first.md`

### Sensory Experience (Layers 14-15)
14. **Micro-Interactions** - `layer-14-micro-interactions.md`
15. **Sensory Design** - `layer-15-sensory-design.md`

### Meta-Intelligence (Layers 16-18)
16. **Meta-Cognitive Reasoning** - `layer-16-meta-cognitive-reasoning.md`
17. **Contextual Adaptation** - `layer-17-contextual-adaptation.md`
18. **Temporal Reasoning** - `layer-18-temporal-reasoning.md`

---

## Version History

### Version 2.0 (2025-01-24)
- **Added**: Layer 16 (Meta-Cognitive Reasoning)
- **Added**: Layer 17 (Contextual Adaptation)
- **Added**: Layer 18 (Temporal Reasoning)
- **Change**: Reorganized into clear categories
- **Change**: Added layer selection guides

### Version 1.0 (Initial)
- **Created**: Layers 1-15
- **Established**: Foundation of Design Intelligence System

---

## How to Extend the DIS

**Adding New Layers** (rarely needed):
1. Identify gap in current layer coverage
2. Propose new layer with clear scope and integration
3. Update this README with new layer
4. Update [[WORKSPACE_CONSTITUTION.md]] if authority tier changes
5. Update [[DESIGN_INDEX.md]] with new layer

**Modifying Existing Layers**:
1. Follow [[evolution/UPDATE_PROTOCOL.md]]
2. Document rationale for change
3. Update affected tools and protocols
4. Test integration with other layers

---

## Best Practices

### DO
- ✅ Consult Layers 1-3 for every design decision
- ✅ Use Layer 17 to determine appropriate depth
- ✅ Use Layer 16 for complex/novel decisions
- ✅ Document which layers informed each blueprint
- ✅ Adapt layer usage to project context

### DON'T
- ❌ Skip foundation layers (1-3)
- ❌ Treat all layers as mandatory checklist
- ❌ Spend equal time on every layer
- ❌ Use layers as procrastination
- ❌ Ignore layer recommendations without rationale

---

## Questions?

- **"Which layers do I need?"** → See "Layer Selection Guide" above
- **"How deep should I go?"** → Use Layer 17 (Contextual Adaptation)
- **"How do I know if my reasoning is good?"** → Use Layer 16 (Meta-Cognitive)
- **"Should I consider long-term costs?"** → Use Layer 18 (Temporal Reasoning)
- **"This feels like overkill..."** → You might be right! Layer 17 prevents over-analysis.

---

**The Design Intelligence System transforms vague intuition into explicit, traceable reasoning.**

**Use it to make better decisions. Use Layer 17 to avoid over-using it.**
