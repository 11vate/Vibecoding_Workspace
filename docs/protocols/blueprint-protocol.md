# Blueprint Protocol

**Authority Tier**: 2 (Mandatory Process)
**Gates Required**: Blueprint Gate (`gates/blueprint-gate.md`)
**Index Reference**: See `indexes/PROTOCOL_INDEX.md` for protocol navigation

## Purpose

This protocol defines **how AI models should create blueprints** - the formal system/UX/mechanic planning documents required before implementation.

---

## Protocol Overview

**No code without blueprint.** Every system, feature, or mechanic must have a formal blueprint before implementation begins.

---

## Blueprint Types

### 1. System Blueprint

**For**: Technical systems, data flows, architecture

**When to use**: When designing systems, data structures, or technical architecture

**Template**: `tools/blueprint-templates/system-blueprint.md`

---

### 2. UX Blueprint

**For**: User interfaces, screens, flows

**When to use**: When designing UI, screens, or user flows

**Template**: `tools/blueprint-templates/ux-blueprint.md`

---

### 3. Mechanic Blueprint

**For**: Game/app mechanics, rules, interactions

**When to use**: When designing mechanics, rules, or gameplay systems

**Template**: `tools/blueprint-templates/mechanic-blueprint.md`

---

## Blueprint Creation Process

### Step 1: Determine Blueprint Type

**Questions to ask**:
- Is this a technical system? → System Blueprint
- Is this a UI/screen? → UX Blueprint
- Is this a mechanic/rule? → Mechanic Blueprint

**Can use multiple**: Complex features may need multiple blueprints (system + UX, mechanic + UX, etc.)

---

### Step 2: Use Template

**How to use**:
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

**Why**: Cursor needs clear data definitions before implementation

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

**How to validate**:
1. Check completeness (all sections filled)
2. Verify clarity (unambiguous)
3. Confirm feasibility (technically possible)
4. Ensure alignment (matches design docs)
5. Check constraints (PWA/offline respected)

**Use**: `tools/validation/blueprint-validator.md`

---

## Blueprint Requirements

Every blueprint must include:

### Required Sections

1. **Purpose** - What it does, why it exists
2. **Data Structures** - How data is organized
3. **State Transitions** - How state changes
4. **Failure Handling** - How failures are handled
5. **Integration** - How it connects to other systems

### Additional Sections (as needed)

- **Performance Considerations** - Optimization needs
- **Accessibility** - Accessibility requirements
- **Security** - Security considerations
- **Scaling** - How it scales

---

## Blueprint Quality Criteria

Blueprint is ready when:

- ✅ All required sections present
- ✅ Data structures clearly defined
- ✅ State transitions documented
- ✅ Failure handling specified
- ✅ Integration planned
- ✅ Constraints respected
- ✅ Design docs referenced
- ✅ Validation passed

---

## Blueprint Storage

**Where to save**:
- `/docs/blueprints/system-[name].md` - System blueprints
- `/docs/blueprints/ux-[flow].md` - UX blueprints
- `/docs/blueprints/mechanic-[name].md` - Mechanic blueprints

**Naming convention**: Use kebab-case, descriptive names

---

## Blueprint Updates

**When to update**:
- Requirements change
- Design evolves
- Implementation reveals issues
- Integration needs change

**How to update**:
1. Update blueprint first
2. Document why change needed
3. Re-validate blueprint
4. Then update implementation

**Never**: Update implementation without updating blueprint

---

## Blueprint Review

**Before implementation**:
1. Review blueprint completeness
2. Verify alignment with design docs
3. Check technical feasibility
4. Confirm constraints respected
5. Validate with validator

**After implementation**:
1. Compare implementation to blueprint
2. Document any deviations
3. Update blueprint if needed
4. Learn from differences

---

## Common Blueprint Mistakes

### 1. Skipping Blueprint

**Problem**: Coding without blueprint
**Solution**: Always create blueprint first

### 2. Incomplete Blueprint

**Problem**: Missing required sections
**Solution**: Use template, fill all sections

### 3. Vague Blueprint

**Problem**: Unclear or ambiguous
**Solution**: Be specific, include examples

### 4. Ignoring Constraints

**Problem**: Not respecting PWA/offline constraints
**Solution**: Always consider constraints

### 5. Not Updating Blueprint

**Problem**: Blueprint becomes outdated
**Solution**: Update blueprint when requirements change

---

## Integration with Other Protocols

### Research Protocol

- Research informs blueprint
- Blueprint uses research findings
- Research artifacts referenced in blueprint

### Implementation Protocol

- Blueprint guides implementation
- Implementation follows blueprint
- Deviations require blueprint update

### Audit Protocol

- Audit reviews blueprints
- Blueprints checked for redundancy
- Simplifications may require blueprint updates

---

## Next Steps After Blueprint

After blueprint is complete:

1. **Validate** - Use blueprint validator
2. **Review** - Ensure alignment with design docs
3. **Implement** - Use `@Docs/prompts/implementation-gate-prompt.md`

---

**This protocol ensures Cursor creates formal, complete blueprints before implementation, preventing speculative code and ensuring alignment with design.**


