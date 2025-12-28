# Blueprint Mode

## Purpose

**Blueprint Mode** is Cursor's state for formal system and UX planning. In this mode, Cursor creates detailed blueprints before implementation.

---

## When to Activate

Activate Blueprint Mode when:
- Design concept selected
- Ready to plan implementation
- Need formal system/UX/mechanic specification
- About to implement

**Activation**: Use `@Docs/prompts/blueprint-prompt.md`

---

## Mode Characteristics

### What Cursor Does

- **Creates** formal blueprints
- **Defines** data structures
- **Documents** state transitions
- **Plans** failure handling
- **Specifies** integration points

### What Cursor Does NOT Do

- ❌ Write code
- ❌ Implement solutions
- ❌ Skip to implementation
- ❌ Create placeholders
- ❌ Make assumptions

---

## Mode Workflow

### Step 1: Determine Blueprint Type

**What to determine**:
- System Blueprint (technical systems)
- UX Blueprint (user interfaces)
- Mechanic Blueprint (game/app mechanics)

**Can use multiple**: Complex features may need multiple blueprints

---

### Step 2: Use Template

**What to do**:
1. Copy template from `tools/blueprint-templates/`
2. Fill in all required sections
3. Reference design intelligence layers
4. Include all necessary details

**Templates ensure**: Completeness, consistency, quality

---

### Step 3: Reference Design Docs

**What to reference**:
- Experience Pillars (Layer 1)
- Player Psychology (Layer 2)
- Core Loop (Layer 3)
- Systems Map (Layer 4)
- Mechanic Evolution (Layer 5)
- UX Decision Log (Layer 6)

**Why**: Ensure blueprint aligns with design intelligence

---

### Step 4: Define Data Structures

**What to define**:
- Data types
- Data relationships
- State structures
- Data flow

**Why**: Cursor needs clear data definitions

---

### Step 5: Document State Transitions

**What to document**:
- State changes
- Transition triggers
- State validation
- Error states

**Why**: Cursor needs to understand state management

---

### Step 6: Consider Failure Modes

**What to consider**:
- How system can fail
- Error handling
- Recovery paths
- User feedback

**Why**: Robust systems handle failures gracefully

---

### Step 7: Plan Integration

**What to plan**:
- Dependencies
- System interactions
- UX impact
- Data flow

**Why**: Systems don't exist in isolation

---

### Step 8: Validate Blueprint

**What to validate**:
1. Completeness (all sections filled)
2. Clarity (unambiguous)
3. Feasibility (technically possible)
4. Alignment (matches design docs)
5. Constraints (PWA/offline respected)

**Use**: `tools/validation/blueprint-validator.md`

---

## Blueprint Types

### System Blueprint

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

### UX Blueprint

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

### Mechanic Blueprint

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

## Mode Boundaries

### Stay in Blueprint Mode

**When**:
- Blueprint incomplete
- Sections missing
- Validation failed
- Alignment issues

**Action**: Complete blueprint, fix issues

---

### Exit Blueprint Mode

**When**:
- Blueprint complete
- All sections filled
- Validation passed
- Alignment confirmed

**Next Mode**: Implementation Mode

**Transition**: Use `@Docs/prompts/implementation-gate-prompt.md`

---

## Integration with Design Intelligence

During Blueprint Mode:

1. **Reference design intelligence layers**
   - Ensure blueprint serves fantasy
   - Respects cognitive limits
   - Reinforces core loop
   - Fits system architecture

2. **Check systems map**
   - Verify dependencies
   - Check integration points
   - Ensure no conflicts

---

## Success Indicators

Blueprint Mode succeeds when:

- ✅ Blueprint type determined
- ✅ Template used
- ✅ All sections filled
- ✅ Data structures defined
- ✅ State transitions documented
- ✅ Failure handling specified
- ✅ Integration planned
- ✅ Validation passed
- ✅ No code written

---

## Common Mistakes

### 1. Skipping Blueprint

**Problem**: Jumping to implementation without blueprint
**Solution**: Always create blueprint first

### 2. Incomplete Blueprint

**Problem**: Missing required sections
**Solution**: Use template, fill all sections

### 3. Vague Blueprint

**Problem**: Unclear or ambiguous
**Solution**: Be specific, include examples

### 4. Not Validating

**Problem**: Blueprint not validated
**Solution**: Always validate before implementation

---

## Next Mode

After Blueprint Mode:

**Implementation Mode** - Implement code exactly as specified

**Activation**: Use `@Docs/prompts/implementation-gate-prompt.md`

---

**Blueprint Mode is about formal planning. Cursor creates detailed specifications before implementation.**


