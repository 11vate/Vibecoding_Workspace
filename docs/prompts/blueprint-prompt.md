# Blueprint Prompt

## Purpose

Use this prompt to activate **Blueprint Mode** - Cursor creates formal system/UX/mechanic blueprints before implementation.

---

## The Prompt Template

```
@Docs
@Codebase

Create a formal blueprint for [SYSTEM/UX/MECHANIC].

Include:
- Data structures
- State transitions
- UX impact
- Failure handling

Assume PWA + offline constraints.
Do not write code yet.
```

---

## Usage Examples

### Creating System Blueprint

```
@Docs/prompts/blueprint-prompt.md
@Docs/design-intelligence/layer-4-systems-map.md
@Codebase

Create a formal system blueprint for the Fusion System.

Include:
- Data structures (creature data, fusion rules)
- State transitions (selection → fusion → result)
- UX impact (what UI needs to show)
- Failure handling (invalid fusion, generation failure)

Assume PWA + offline constraints.
Do not write code yet.
```

### Creating UX Blueprint

```
@Docs/prompts/blueprint-prompt.md
@Docs/design-intelligence/layer-6-ux-decision-log.md
@Codebase

Create a formal UX blueprint for the Collection Browser.

Include:
- Screen map (layout, components)
- User actions (filter, search, select)
- Transitions (navigation, state changes)
- Feedback mechanisms (visual, audio)

Assume PWA + offline constraints.
Do not write code yet.
```

### Creating Mechanic Blueprint

```
@Docs/prompts/blueprint-prompt.md
@Docs/design-intelligence/layer-3-core-loop.md
@Codebase

Create a formal mechanic blueprint for the Fusion Mechanic.

Include:
- Player intent (what users want to do)
- System response (how system responds)
- Risk/reward (what users gain/lose)
- Progression impact (how it advances)

Assume PWA + offline constraints.
Do not write code yet.
```

---

## Blueprint Types

### 1. System Blueprint

**For**: Technical systems, data flows, architecture

**Must Include**:
- Purpose
- Inputs/Outputs
- Data structures
- State transitions
- Dependencies
- Edge cases
- Failure handling
- Scaling hooks

**Template**: `tools/blueprint-templates/system-blueprint.md`

---

### 2. UX Blueprint

**For**: User interfaces, screens, flows

**Must Include**:
- Screen map
- User actions
- Transitions
- Feedback mechanisms
- Accessibility considerations
- State management

**Template**: `tools/blueprint-templates/ux-blueprint.md`

---

### 3. Mechanic Blueprint

**For**: Game/app mechanics, rules, interactions

**Must Include**:
- Player intent
- System response
- Risk/reward
- Progression impact
- Emergent behavior potential
- Balancing considerations

**Template**: `tools/blueprint-templates/mechanic-blueprint.md`

---

## Blueprint Requirements

Every blueprint must:

1. **Define Purpose**
   - What it does
   - Why it exists
   - What problem it solves

2. **Specify Data**
   - Data structures
   - State management
   - Data flow

3. **Document Behavior**
   - How it works
   - State transitions
   - Edge cases

4. **Consider Failure**
   - Failure modes
   - Error handling
   - Recovery paths

5. **Plan Integration**
   - Dependencies
   - UX impact
   - System interactions

---

## Integration with Design Intelligence

Cursor should reference:

- **Layer 1 (Experience Pillars)** - Blueprint serves the fantasy
- **Layer 2 (Player Psychology)** - Blueprint respects cognitive limits
- **Layer 3 (Core Loop)** - Blueprint reinforces the loop
- **Layer 4 (Systems Map)** - Blueprint fits system architecture
- **Layer 5 (Mechanic Evolution)** - Blueprint supports evolution
- **Layer 6 (UX Decision Log)** - Blueprint aligns with UX decisions

---

## Blueprint Validation

Before implementation, validate:

1. **Completeness** - All required sections present
2. **Clarity** - Clear and unambiguous
3. **Feasibility** - Technically feasible
4. **Alignment** - Aligns with design docs
5. **Constraints** - Respects PWA/offline constraints

**Use**: `tools/validation/blueprint-validator.md`

---

## Output Location

Blueprints should be saved to:

- `/docs/blueprints/system-[name].md` - For system blueprints
- `/docs/blueprints/ux-[flow].md` - For UX blueprints
- `/docs/blueprints/mechanic-[name].md` - For mechanic blueprints

---

## Success Indicators

Blueprint succeeds when:

- ✅ All required sections present
- ✅ Data structures defined
- ✅ State transitions documented
- ✅ Failure handling specified
- ✅ UX impact considered
- ✅ Constraints respected
- ✅ No code written yet

---

## Next Steps After Blueprint

After blueprint is complete:

1. **Validate** - Check completeness with validator
2. **Review** - Ensure alignment with design docs
3. **Implement** - Use `@Docs/prompts/implementation-gate-prompt.md`

---

**This prompt activates Blueprint Mode. Cursor creates formal plans before implementation.**


