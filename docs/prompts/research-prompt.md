# Research Prompt

## Purpose

Use this prompt to activate **Exploration Mode** - Cursor researches comparable systems, patterns, and failures before designing.

---

## The Prompt Template

```
@Docs/prompts/master-design-prompt.md

Research comparable open-source projects and design patterns for [IDEA/FEATURE/SYSTEM].

Focus on:
- Systems architecture
- UX decisions
- Failure cases

Produce:
- Comparative analysis in /docs/research/comparative-analysis.md
- Extracted principles in /docs/research/design-patterns.md
- Technical feasibility in /docs/research/technical-feasibility.md

Do not propose code.
```

---

## Usage Examples

### Researching a Feature

```
@Docs/prompts/research-prompt.md

Research comparable systems for a fusion mechanic where users combine creatures.

Focus on:
- How other games handle combination mechanics
- What UX patterns work well
- Common pitfalls and failures

Produce research artifacts.
Do not propose code.
```

### Researching a System

```
@Docs/prompts/research-prompt.md

Research comparable systems for offline-first state management in PWAs.

Focus on:
- State management architectures
- Offline synchronization patterns
- Failure recovery strategies

Produce research artifacts.
Do not propose code.
```

### Researching UX Patterns

```
@Docs/prompts/research-prompt.md

Research comparable UX patterns for collection browsing interfaces.

Focus on:
- Grid vs list layouts
- Filter and search patterns
- Infinite scroll vs pagination

Produce research artifacts.
Do not propose code.
```

---

## What Cursor Should Research

### 1. Existing Open-Source Projects

- Similar mechanics
- Similar UX flows
- Similar technical constraints
- What they do well
- Where they break

### 2. Established Design Patterns

- Game loops
- UI navigation patterns
- Progression systems
- State management strategies
- What patterns fit
- What patterns don't fit

### 3. Failure Analysis

- Common pitfalls
- Why certain approaches fail
- Scalability issues
- Performance problems
- What to avoid

### 4. Adaptation Strategy

- What fits this project
- What must be modified
- What should be avoided
- How to adapt patterns

---

## Research Artifacts

Cursor should produce:

### 1. Comparative Analysis (`/docs/research/comparative-analysis.md`)

Structure:
- Similar projects (games/apps/tools)
- What they do well
- Where they break
- Lessons extracted

### 2. Design Patterns (`/docs/research/design-patterns.md`)

Structure:
- Pattern name
- Use cases
- Tradeoffs
- Why it fits (or doesn't)

### 3. Technical Feasibility (`/docs/research/technical-feasibility.md`)

Structure:
- Required systems
- Performance concerns
- Browser constraints
- Offline limitations
- PWA implications

---

## Research Layers

Cursor should research in layers:

1. **Existing Projects** - What exists, what works
2. **Design Patterns** - Established solutions
3. **Failure Analysis** - What doesn't work, why
4. **Adaptation** - What fits, what doesn't

---

## Integration with Knowledge Base

Cursor should cross-reference:

- `knowledge-base/mechanics-library.md` - For mechanics patterns
- `knowledge-base/ui-pattern-library.md` - For UX patterns
- `knowledge-base/references/` - For examples

---

## Success Indicators

Research succeeds when:

- ✅ Cursor finds comparable systems
- ✅ Cursor identifies patterns and failures
- ✅ Cursor produces research artifacts
- ✅ Cursor extracts transferable principles
- ✅ Cursor does not propose code yet

---

## Next Steps After Research

After research is complete:

1. **Synthesis** - Use `@Docs/prompts/synthesis-prompt.md`
2. **Blueprint** - Use `@Docs/prompts/blueprint-prompt.md`
3. **Implementation** - Use `@Docs/prompts/implementation-gate-prompt.md`

---

**This prompt activates Exploration Mode. Cursor researches before designing, compares before inventing.**


