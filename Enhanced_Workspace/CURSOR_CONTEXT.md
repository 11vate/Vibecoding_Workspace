# Cursor Context - Enhanced Workspace

**Quick Reference for AI Assistance**

This workspace uses a comprehensive enhancement system to guide AI assistance. This document provides a quick overview and reference.

---

## Enhancement System Location

All enhancement protocols are in: `cursor-enhancements/`

---

## Essential Reading (Start Here)

1. **`cursor-enhancements/layer-0-project-directive.md`**
   - Immutable project rules
   - What can/cannot be modified
   - Core design philosophy

2. **`cursor-enhancements/charter-co-architect.md`**
   - AI's role as bounded co-architect
   - Operating principles
   - Scope of permission

3. **`cursor-enhancements/charter-professional-stack.md`**
   - Professional development standards
   - Architecture-first approach
   - MVP discipline

---

## Quick Reference by Need

### "What can AI modify?"
→ Read: `layer-0-project-directive.md` and `layer-7-system-lock.md`

### "How should I structure my request?"
→ Read: `layer-4-prompt-protocol.md`

### "What should this UI feel like?"
→ Read: `layer-2-visual-analogies.md`

### "How do I iterate on improvements?"
→ Read: `layer-5-iteration-loop.md`

### "Is this change good enough?"
→ Read: `layer-8-polish-checklist.md`

### "What colors/motion/typography should I use?"
→ Read: `layer-1-ui-canon.ts`

### "What's the narrative context for this screen?"
→ Read: `layer-6-ui-lore.ts`

### "How should UI react to game state?"
→ Read: `layer-3-ui-states.ts`

### "How does AI reason through complex requests?"
→ Read: `layer-9-reasoning-protocol.ts` (Chain-of-Thought, Tree-of-Thought)

### "How does AI learn from feedback?"
→ Read: `layer-10-adaptive-learning.ts` (Pattern recognition, feedback loops)

### "How does AI ensure code quality?"
→ Read: `layer-11-architecture-intelligence.ts` (Patterns, anti-patterns, heuristics)

### "How does AI self-reflect and assess risk?"
→ Read: `layer-12-meta-cognitive-protocols.ts` (Pre-decision audit, reflection)

### "How does AI understand codebase context?"
→ Read: `layer-13-context-retrieval.ts` (Pattern recognition, dependency analysis)

### "How are all layers coordinated?"
→ Read: `layer-14-meta-prompt-system.ts` (Orchestration, activation protocols)

### "What design values should I use?"
→ Read: `layer-15-design-tokens.ts` (Colors, spacing, typography, shadows, animations)

### "How should components be built?"
→ Read: `layer-16-component-patterns.ts` (Button, Card, Input, Navigation, Toast, Modal patterns)

### "How should layouts be structured?"
→ Read: `layer-17-composition-layout.ts` (Visual hierarchy, layout patterns, spacing, balance)

### "Is this aesthetically good?"
→ Read: `layer-18-aesthetic-evaluation.ts` (Harmony, balance, contrast, rhythm, proportion, unity)

### "Does this meet quality standards?"
→ Read: `layer-19-visual-quality.ts` (Quality checklist, quality gates, MVP standards)

### "What design references are available?"
→ Read: `layer-20-design-references.md` (Game/app references, design systems, best practices)

### "Where's the complete design system documentation?"
→ Read: `DESIGN_SYSTEM.md` (Comprehensive design system reference)

### "What code patterns should I use?"
→ Read: `layer-21-code-generation.ts` (Design patterns, algorithms, data structures)

### "How should I write tests?"
→ Read: `layer-22-testing-strategies.ts` (Testing strategies, TDD, BDD, quality gates)

### "How do I optimize performance?"
→ Read: `layer-23-performance-optimization.ts` (React, JavaScript, bundle, network, rendering optimization)

### "How do I implement security?"
→ Read: `layer-24-security-patterns.ts` (OWASP Top 10, authentication, authorization, API security)

### "How do I refactor code?"
→ Read: `layer-25-refactoring-quality.ts` (Code smells, refactoring techniques, technical debt)

### "What architecture patterns should I use?"
→ Read: `layer-26-architecture-patterns.ts` (Microservices, DDD, event-driven, hexagonal architecture)

### "How should I design APIs?"
→ Read: `layer-27-api-design.ts` (REST, GraphQL, real-time, integration patterns)

### "How should I design databases?"
→ Read: `layer-28-database-design.ts` (Schema design, query optimization, transactions, migrations)

### "How should I document code?"
→ Read: `layer-29-documentation.ts` (Code docs, API docs, architecture docs, README patterns)

### "How do I prevent bugs?"
→ Read: `layer-30-bug-prevention.ts` (Error handling, type safety, defensive programming, bug patterns)

### "Where's the complete capability reference?"
→ Read: `CAPABILITY_REFERENCE.md` (Comprehensive capability reference for all layers)

### "How do I use multimodal AI capabilities?"
→ Read: `layer-36-multimodal-core.ts` (Image analysis, generation, multimodal reasoning)

### "How do I work with game frameworks?"
→ Read: `layer-37-game-frameworks.ts` (Phaser, OpenFL, Defold, MonoGame support)

### "How does Cursor remember project context?"
→ Read: `layer-38-knowledge-graph.ts` (Persistent semantic memory, knowledge graph)

### "How does the asset pipeline work?"
→ Read: `layer-39-asset-pipeline.ts` (End-to-end asset generation and integration)

### "How do I simulate and balance games?"
→ Read: `layer-40-simulation-engine.ts` (Combat, economy, balance analysis)

### "How are advanced prompts orchestrated?"
→ Read: `layer-41-prompt-orchestration.ts` (Multimodal and game-dev prompt coordination)

---

## Current Projects

### Pixel Pets Reborn

**Location:** `games/PixelPets_Reborn_Merged/`

**Key Systems (LOCKED):**
- Fusion logic: `src/services/fusion/`
- Combat math: `src/services/combat/`
- Rarity rules: `src/utils/rarity.ts`
- Economy: `src/stores/playerStore.ts`

**Design Philosophy:**
- Fusion-only progression (no leveling/XP)
- Creation, not grinding
- Permanence and uniqueness
- Risk and creativity

---

## Before Making Changes

1. ✅ Check `layer-0-project-directive.md` - Does this respect constraints?
2. ✅ Check `layer-7-system-lock.md` - Am I modifying locked systems?
3. ✅ Reference relevant layers (1-3, 6, 15-30 based on request type)
4. ✅ Use `layer-4-prompt-protocol.md` to structure requests
5. ✅ Use design tokens (Layer 15) for all design values (if UI)
6. ✅ Follow component patterns (Layer 16) for consistency (if UI)
7. ✅ Apply composition principles (Layer 17) for layouts (if UI)
8. ✅ Use code generation patterns (Layer 21) for code (if coding)
9. ✅ Write tests (Layer 22) for code changes
10. ✅ Ensure security (Layer 24) for security-sensitive code
11. ✅ Validate with quality layers (8, 18, 19, 22, 23, 24) before finalizing

**Note:** Advanced layers (9-14) and capability layers (21-30) activate automatically based on request complexity and type. You can reference them explicitly or let AI apply them automatically.

---

## Example Prompt Template

```
[INTENT] [TARGET] [GOAL]
- Follow [RELEVANT_LAYER] for [GUIDANCE_TYPE]
- Do not modify [LOCKED_SYSTEM from layer-7]
- Reference [DESIGN_LAYER] for [FEELING/STYLE]
- Validate against layer-8-polish-checklist.md
```

**Example (Basic):**
```
Refine Fusion Lab UI to better reflect instability and alchemical creation.
- Follow layer-1-ui-canon.ts for colors and motion
- Reference layer-2-visual-analogies.md for fusion feeling
- Do not modify fusion logic (layer-7-system-lock.md)
- Use layer-5-iteration-loop.md for micro-iterations
- Validate against layer-8-polish-checklist.md
```

**Example (Advanced - leveraging new capabilities):**
```
Refine Fusion Lab UI to better reflect instability and alchemical creation.
- Follow layer-1-ui-canon.ts for colors and motion
- Use layer-15-design-tokens.ts for all design values (colors, spacing, typography)
- Follow layer-16-component-patterns.ts for component consistency
- Apply layer-17-composition-layout.ts for layout structure
- Reference layer-2-visual-analogies.md for fusion feeling
- Do not modify fusion logic (layer-7-system-lock.md)
- Use layer-5-iteration-loop.md for micro-iterations
- Validate against layer-8-polish-checklist.md, layer-18-aesthetic-evaluation.ts, and layer-19-visual-quality.ts

Advanced layers will automatically:
- Provide reasoning transparency (Layer 9)
- Apply learned patterns (Layer 10)
- Ensure code quality (Layer 11)
- Perform risk assessment (Layer 12)
- Synthesize codebase context (Layer 13)
- Coordinate all layers (Layer 14)

Design layers will ensure:
- Systematic design token usage (Layer 15)
- Component pattern consistency (Layer 16)
- Composition and layout principles (Layer 17)
- Aesthetic quality assessment (Layer 18)
- Visual quality validation (Layer 19)
- Design reference inspiration (Layer 20)

Capability layers will ensure:
- Code generation patterns (Layer 21)
- Testing strategies and coverage (Layer 22)
- Performance optimization (Layer 23)
- Security best practices (Layer 24)
- Code quality and refactoring (Layer 25)
- Architecture patterns (Layer 26)
- API design patterns (Layer 27)
- Database design optimization (Layer 28)
- Documentation standards (Layer 29)
- Bug prevention and error handling (Layer 30)
- Asset creation and generation (Layer 31)
- Asset management and organization (Layer 32)
- Free asset sourcing and licensing (Layer 33)
- Animation frameworks and systems (Layer 34)
- Game content generation (Layer 35)
```

---

## Key Principles

1. **Constraint First** - Respect boundaries, they're design assets
2. **Systems > Features** - Enhance coherence over adding new mechanics
3. **Presentation is System** - UI communicates rules and emotion
4. **Micro-Iterations** - One screen, one goal, one change
5. **Preserve Identity** - Reinforce what makes the project unique

## Advanced Capabilities (Layers 9-14)

The enhancement system now includes advanced layers that activate automatically:

- **Reasoning Transparency (Layer 9):** Step-by-step reasoning for complex requests
- **Adaptive Learning (Layer 10):** Learns from feedback to improve over time
- **Architecture Intelligence (Layer 11):** Ensures code quality and best practices
- **Meta-Cognitive Protocols (Layer 12):** Self-reflection and risk assessment
- **Context Retrieval (Layer 13):** Understands codebase patterns and dependencies
- **Meta-Prompt System (Layer 14):** Orchestrates all layers automatically

These layers enhance AI capabilities while preserving all constraint boundaries.

## Design System (Layers 15-20)

The enhancement system includes comprehensive design system layers:

- **Design Tokens (Layer 15):** Systematic design values (colors, spacing, typography, shadows, animations)
- **Component Patterns (Layer 16):** Reusable component design patterns (Button, Card, Input, Navigation, Toast, Modal, Loading, Empty State)
- **Composition & Layout (Layer 17):** Advanced composition principles (visual hierarchy, layout patterns, spacing, balance, alignment, proportions)
- **Aesthetic Evaluation (Layer 18):** Quality assessment framework (harmony, balance, contrast, rhythm, proportion, unity)
- **Visual Quality (Layer 19):** Quality checklist and gates (alignment, spacing, color, typography, animation, responsive, accessibility, consistency)
- **Design References (Layer 20):** Curated examples of aesthetic excellence (games, apps, design systems)

These layers ensure consistent, high-quality design implementation with MVP-level quality standards. See `DESIGN_SYSTEM.md` for comprehensive documentation.

## Advanced Capabilities (Layers 21-30)

The enhancement system includes comprehensive capability layers:

- **Code Generation & Patterns (Layer 21):** Design patterns, algorithms, data structures, TypeScript/React advanced patterns
- **Testing Strategies (Layer 22):** Testing pyramid, unit/integration/E2E testing, TDD/BDD, quality gates
- **Performance Optimization (Layer 23):** React performance, JavaScript optimization, bundle optimization, network performance, Core Web Vitals
- **Security Patterns (Layer 24):** OWASP Top 10, authentication/authorization, input validation, API security, data security
- **Refactoring & Code Quality (Layer 25):** Code smells, refactoring techniques, technical debt management, code quality metrics
- **Architecture Patterns (Layer 26):** Microservices, DDD, event-driven architecture, hexagonal architecture, layered architecture
- **API Design (Layer 27):** REST API design, GraphQL patterns, real-time APIs, API integration, API documentation
- **Database Design (Layer 28):** Schema design, query optimization, transaction management, migrations, database patterns
- **Documentation (Layer 29):** Code documentation, API documentation, architecture documentation, README patterns
- **Bug Prevention (Layer 30):** Error handling, type safety, defensive programming, common bug patterns, monitoring/debugging
- **Asset Creation (Layer 31):** AI-assisted generation, procedural generation, asset design patterns, generation workflows
- **Asset Management (Layer 32):** Organization patterns, versioning, metadata tracking, performance optimization, asset pipelines
- **Asset Sourcing (Layer 33):** Free asset sources, license management, compliance checking, attribution templates
- **Animation Systems (Layer 34):** Animation frameworks, sprite animation, performance optimization, animation patterns
- **Game Content (Layer 35):** Procedural generation, world building, level design, content management, content tools
- **Multimodal Core (Layer 36):** Image analysis, generation, multimodal reasoning, audio/video capabilities, code-to-asset bridging
- **Game Frameworks (Layer 37):** Phaser, OpenFL, Defold, MonoGame support, framework-specific code generation
- **Knowledge Graph (Layer 38):** Persistent semantic memory, relationship tracking, canon validation, pattern extraction
- **Asset Pipeline (Layer 39):** End-to-end asset pipeline, parametric generation, validation, code binding, integration
- **Simulation Engine (Layer 40):** Combat simulation, economy analysis, balance testing, exploit detection
- **Prompt Orchestration (Layer 41):** Multimodal prompt coordination, template selection, prompt chaining

These layers ensure comprehensive, professional-grade code generation with best practices across all domains, including advanced multimodal and game development capabilities. See `CAPABILITY_REFERENCE.md` for comprehensive documentation. See `cursor-enhancements/ASSET_CREATION_GUIDE.md` for asset creation workflows.

---

## Full Documentation

For complete details, see: `cursor-enhancements/README.md`

---

**Last Updated:** 2024

