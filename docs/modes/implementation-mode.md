# Implementation Mode

## Purpose

**Implementation Mode** is Cursor's state for coding. In this mode, Cursor implements code exactly as specified in blueprints, with no deviations.

---

## When to Activate

Activate Implementation Mode when:
- Blueprint complete and validated
- Ready to implement
- All planning done
- About to write code

**Activation**: Use `@Docs/prompts/implementation-gate-prompt.md`

---

## Mode Characteristics

### What Cursor Does

- **Implements** code exactly as specified
- **Explains** architecture decisions inline
- **Handles** all edge cases
- **Ensures** quality gates
- **Respects** constraints

### What Cursor Does NOT Do

- ❌ Deviate from blueprint
- ❌ Skip quality gates
- ❌ Use placeholders
- ❌ Make assumptions
- ❌ Skip error handling

---

## Mode Workflow

### Step 1: Verify Blueprint

**What to verify**:
- Blueprint exists
- Blueprint complete
- Blueprint validated
- Blueprint aligns with design docs

**If missing**: Stop, create blueprint first

---

### Step 2: Read and Understand Blueprint

**What to understand**:
- Purpose and scope
- Data structures
- State transitions
- Failure handling
- Integration points

**Take time**: Understand blueprint fully before coding

---

### Step 3: Plan Implementation

**What to plan**:
- Implementation steps
- Dependencies order
- Error handling approach
- Testing strategy
- Performance considerations

**Break down**: Large systems into smaller steps

---

### Step 4: Implement

**How to implement**:
1. Follow blueprint exactly
2. Explain architecture decisions inline
3. Handle all edge cases
4. Ensure quality gates
5. Respect constraints

**No deviations**: If deviation needed, update blueprint first

---

### Step 5: Validate Implementation

**What to validate**:
- Matches blueprint
- Quality gates met
- Error handling complete
- Constraints respected
- No placeholders

**Compare**: Implementation vs blueprint

---

## Implementation Requirements

### 1. Follow Blueprint Exactly

**Requirements**:
- Implement as specified
- Use defined data structures
- Follow state transitions
- Respect failure handling
- Maintain integration points

**No deviations**: Unless blueprint updated first

---

### 2. Explain Decisions Inline

**What to explain**:
- Architecture decisions
- Design choices
- Tradeoffs made
- Why this approach

**Format**: Comments explaining reasoning

---

### 3. Respect Quality Gates

**Quality requirements**:
- Type safety (TypeScript strict)
- Error handling (all edge cases)
- Accessibility (semantic HTML, ARIA)
- Performance (optimized, efficient)
- Offline capability (service workers, local storage)

**No shortcuts**: All quality gates must be met

---

### 4. No Placeholders

**Prohibited**:
- TODOs
- FIXMEs
- Placeholder code
- Mock data in production
- Speculative code

**Complete**: All code must be production-ready

---

## Code Quality Standards

### TypeScript

- Strict mode enabled
- Proper types throughout
- No `any` types
- Type safety enforced

### Error Handling

- Try-catch for async operations
- Input validation
- Graceful degradation
- User-friendly error messages

### Performance

- Optimize for PWA constraints
- Lazy loading where appropriate
- Efficient data structures
- Minimize bundle size

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader support

### Offline Capability

- Service worker integration
- Local storage fallbacks
- Offline state handling
- Sync when online

---

## Mode Boundaries

### Stay in Implementation Mode

**When**:
- Implementation incomplete
- Quality gates not met
- Edge cases not handled
- Constraints not respected

**Action**: Complete implementation, fix issues

---

### Exit Implementation Mode

**When**:
- Implementation complete
- Matches blueprint
- Quality gates met
- Constraints respected
- No placeholders

**Next Action**: Test, review, audit

---

## When Deviations Are Needed

**If implementation requires deviation**:

1. **Stop implementation**
2. **Update blueprint first**
3. **Document why deviation needed**
4. **Get approval**
5. **Then implement**

**Never**: Deviate without blueprint update

---

## Integration with Design Docs

During Implementation Mode:

1. **Reference design intelligence layers**
   - Ensure implementation serves fantasy
   - Respects cognitive limits
   - Reinforces core loop
   - Fits system architecture

2. **Check systems map**
   - Verify dependencies
   - Check integration points
   - Ensure no conflicts

---

## Success Indicators

Implementation Mode succeeds when:

- ✅ Code matches blueprint exactly
- ✅ All quality gates met
- ✅ Architecture decisions explained
- ✅ Error handling complete
- ✅ No placeholders or mocks
- ✅ Constraints respected

---

## Common Mistakes

### 1. Skipping Blueprint

**Problem**: Implementing without blueprint
**Solution**: Always create blueprint first

### 2. Deviating Without Update

**Problem**: Changing implementation without updating blueprint
**Solution**: Update blueprint first, then implement

### 3. Ignoring Quality Gates

**Problem**: Skipping error handling, accessibility, etc.
**Solution**: All quality gates must be met

### 4. Using Placeholders

**Problem**: TODOs, mocks, placeholders in code
**Solution**: Complete implementation, no placeholders

---

## Next Actions

After Implementation Mode:

1. **Test** - Verify functionality
2. **Review** - Check against blueprint
3. **Document** - Update docs if needed
4. **Audit** - Use `@Docs/prompts/audit-prompt.md`

---

**Implementation Mode is about coding. Cursor implements exactly as specified, with no deviations, maintaining quality throughout.**


