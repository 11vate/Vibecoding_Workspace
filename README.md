# Ultimate Cursor Vibecoding Workspace

**Transform Cursor from code generator into design intelligence system.**

This workspace is a cognitive exoskeleton for Cursor, designed to maximize its capabilities through structured thinking, research protocols, blueprint-first development, and comprehensive knowledge bases.

---

## What This Workspace Does

This workspace transforms how Cursor operates by:

1. **Forcing design-first thinking** - Experience → Systems → Data → Code (never reverse)
2. **Enforcing research protocols** - Research before design, compare before inventing
3. **Requiring blueprints** - No code without formal system/UX/mechanic blueprints
4. **Providing knowledge bases** - Cross-referenceable patterns and references
5. **Establishing quality gates** - Zero tolerance for placeholders, mocks, or speculative code

**Result**: Cursor stops being a chatbot and becomes a technical mind living inside your codebase.

---

## 🚀 NEW: Complete Offline AI Game Development Stack (2025)

This workspace now includes the **ultimate free, offline-capable game development stack** with zero API costs:

- **Local AI Code Generation** - Ollama with Qwen/DeepSeek models
- **Local Asset Generation** - ComfyUI with Stable Diffusion (pixel art models)
- **Optimal Game Engine** - Excalibur.js (TypeScript-native 2D)
- **State Management** - Zustand with IndexedDB persistence
- **PWA Architecture** - Complete offline capability
- **Procedural Generation** - FastNoiseLite, noise algorithms

**📖 See [COMPREHENSIVE_RESEARCH_FINDINGS_2025.md](./COMPREHENSIVE_RESEARCH_FINDINGS_2025.md) for full research**

**📋 See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for installation instructions**

**🚀 See [ai-models/ULTIMATE_VIBECODER_ENHANCEMENT_PLAN.md](./ai-models/ULTIMATE_VIBECODER_ENHANCEMENT_PLAN.md) for advanced AI enhancements**
  - Make your local AI exponentially more capable than Claude
  - RAG, Memory, Vision, Agents, Self-Improvement, MoE, MCP integration
  - 100% free, 125x context window, infinite codebase knowledge

---

## Quick Start

### For Game Development (NEW!)

1. **Set up local AI and asset generation**
   ```bash
   # Follow SETUP_GUIDE.md for:
   # - Ollama installation (local code AI)
   # - ComfyUI installation (local asset generation)
   ```

2. **Create new game project**
   ```bash
   cp -r templates/game-dev-excalibur-stack my-game
   cd my-game
   npm install
   npm run dev
   ```

3. **Customize your game**
   - Edit `/docs/vision.md` - Define game concept
   - Edit `/docs/mechanics.md` - Design mechanics
   - Create blueprints in `/docs/blueprints/`
   - Follow design intelligence stack

### For New Projects

1. Copy `templates/canonical-spine/` to your project root
2. Customize `.cursorrules` for your project
3. Fill in design intelligence docs in `/docs/`
4. Start with research, then synthesis, then blueprints, then code

### For Existing Projects

1. Review `WORKSPACE_PHILOSOPHY.md` to understand principles
2. Integrate canonical structure gradually
3. Add design intelligence docs
4. Begin using blueprint system for new features

---

## Workspace Structure

```
Ultimate_Cursor_Vibecoding_Workspace/
│
├── .cursorrules                    # Master operational law
├── README.md                       # This file
├── WORKSPACE_PHILOSOPHY.md         # Core principles
│
├── /docs                           # Workspace documentation
│   ├── /design-intelligence        # Design Intelligence Stack layers
│   ├── /prompts                    # Master prompt templates
│   ├── /protocols                  # Operational protocols
│   └── /modes                      # Cursor operation modes
│
├── /knowledge-base                 # Pattern libraries
│   ├── mechanics-library.md
│   ├── ui-pattern-library.md
│   ├── progression-systems.md
│   ├── economy-models.md
│   └── /references                 # Reference materials
│
├── /tools                          # Supporting tools
│   ├── /blueprint-templates        # Blueprint file templates
│   └── /validation                 # Validation scripts
│
└── /templates                      # Project templates
    ├── /canonical-spine            # Base project structure
    ├── /game-dev-excalibur-stack   # Optimal game dev stack (NEW!)
    └── /example-project            # Complete working example
```

---

## Core Concepts

### Design Intelligence Stack (DIS)

Five layers that Cursor must reason through:

1. **Experience Intent** - Why it exists, what fantasy it fulfills
2. **Player/User Psychology** - How it feels, motivation loops, cognitive load
3. **Mechanics & Systems** - How it works, rules and interactions
4. **Data & State** - How it persists, data structures and state management
5. **Implementation** - How it's coded, actual code

**Never skip layers. Never code without reasoning through all layers.**

### Operation Modes

Cursor has four internal modes:

- **Exploration Mode** - Idea discovery and comparison
- **Synthesis Mode** - Pattern extraction and concept formation
- **Blueprint Mode** - Formal system and UX planning
- **Implementation Mode** - Coding only after approval

### Blueprint-First Development

Before any code is written:

1. Research comparable systems
2. Synthesize design concepts
3. Create formal blueprint (system/UX/mechanic)
4. Validate blueprint completeness
5. Implement exactly as specified

---

## Key Documents

### For Understanding the Workspace

- `WORKSPACE_PHILOSOPHY.md` - Core principles and design philosophy
- `docs/vision.md` - What this workspace enables
- `docs/architecture.md` - System architecture explanation

### For Using the Workspace

- `.cursorrules` - Master operational law (read this first)
- `docs/prompts/master-design-prompt.md` - Core identity anchor
- `docs/protocols/` - How to research, blueprint, implement, audit
- `docs/modes/` - Mode-specific instructions

### For Design Intelligence

- `docs/design-intelligence/layer-1-experience-pillars.md` - Core fantasy
- `docs/design-intelligence/layer-2-player-psychology.md` - User psychology
- `docs/design-intelligence/layer-3-core-loop.md` - Core loop design
- `docs/design-intelligence/layer-4-systems-map.md` - System architecture
- `docs/design-intelligence/layer-5-mechanic-evolution.md` - System growth
- `docs/design-intelligence/layer-6-ux-decision-log.md` - UX decisions

### For Pattern Reference

- `knowledge-base/mechanics-library.md` - Game/app mechanics
- `knowledge-base/ui-pattern-library.md` - UI/UX patterns
- `knowledge-base/progression-systems.md` - Progression models
- `knowledge-base/economy-models.md` - Economic systems
- `knowledge-base/references/` - Games, apps, frameworks

---

## Example Workflow

### Adding a New Feature

1. **Exploration Mode**
   ```
   @Docs/prompts/research-prompt.md
   
   Research comparable systems for [FEATURE].
   Generate comparative analysis.
   ```

2. **Synthesis Mode**
   ```
   @Docs/experience-pillars.md
   @Docs/research/comparative-analysis.md
   
   Synthesize 3 design concepts.
   Explain tradeoffs.
   ```

3. **Blueprint Mode**
   ```
   @Docs
   @Codebase
   
   Create formal blueprint for [SYSTEM].
   Include data structures, state transitions, UX impact.
   ```

4. **Implementation Mode**
   ```
   @Docs/blueprints/system-[name].md
   
   Implement exactly as specified.
   No deviations.
   ```

---

## Framework Constraints

All projects in this workspace must be:

- **Web-native**: HTML/CSS/JavaScript/TypeScript only
- **PWA-first**: Progressive Web Apps with offline capability
- **Vite-based**: Standard build tooling
- **Local assets**: No external API dependencies
- **No engines**: No Unity, Godot, or proprietary engines
- **Offline-capable**: Service workers, local storage, IndexedDB

---

## Quality Gates

**Never allow:**
- Placeholders, TODOs, or mocks
- Speculative code without blueprints
- Magic numbers or hard-coded values
- Framework switching mid-project

**Always require:**
- Type safety (TypeScript strict mode)
- Error handling for edge cases
- Accessibility considerations
- Performance optimization
- Offline capability

---

## Success Metrics

This workspace succeeds when:

- ✅ Cursor automatically researches before designing
- ✅ Cursor generates blueprints before code
- ✅ Cursor cross-references knowledge base
- ✅ Cursor reasons from experience → systems → code
- ✅ Projects maintain architectural consistency
- ✅ No placeholders or speculative code exists

---

## Getting Help

- **Understanding principles**: Read `WORKSPACE_PHILOSOPHY.md`
- **Using prompts**: Check `docs/prompts/`
- **Following protocols**: See `docs/protocols/`
- **Finding patterns**: Browse `knowledge-base/`
- **Creating blueprints**: Use `tools/blueprint-templates/`

---

## Next Steps

1. Read `WORKSPACE_PHILOSOPHY.md` to understand the vision
2. Review `.cursorrules` to understand operational law
3. Explore `templates/example-project/` to see it in action
4. Copy `templates/canonical-spine/` to start your project
5. Begin using design intelligence layers in your docs

---

**This workspace is not about what Cursor can build. It's about building the conditions under which intelligence naturally emerges.**


#   V i b e c o d i n g _ W o r k s p a c e  
 