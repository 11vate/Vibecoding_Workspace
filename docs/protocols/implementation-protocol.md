# Implementation Protocol

**Authority Tier**: 2 (Mandatory Process)
**Gates Required**: Architecture Gate, Complexity Gate, Quality Gate (`gates/`)
**Index Reference**: See `indexes/PROTOCOL_INDEX.md` for protocol navigation

## Purpose

This protocol defines **how AI models should implement code** - the process for translating blueprints into working code while maintaining quality and alignment.

---

## Protocol Overview

**Implementation only happens after blueprint approval.** Code must match blueprints exactly, with no deviations unless blueprint is updated first.

---

## Implementation Process

### Step 1: Verify Blueprint Exists

**Check**:
- Blueprint exists in `/docs/blueprints/`
- Blueprint is complete and validated
- Blueprint aligns with design docs
- Blueprint respects constraints

**If blueprint missing**: Stop, create blueprint first

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

**Break down**: Large systems into smaller, manageable steps

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

**Compare**: Implementation vs blueprint, ensure alignment

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

**Format**: Comments explaining reasoning, not just what code does

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

**Requirements**:
- Strict mode enabled
- Proper types throughout
- No `any` types
- Type safety enforced

**Example**:
```typescript
// Good: Properly typed
interface Creature {
  id: string;
  name: string;
  properties: CreatureProperties;
}

// Bad: Using any
function processCreature(creature: any) { ... }
```

---

### Error Handling

**Requirements**:
- Try-catch for async operations
- Input validation
- Graceful degradation
- User-friendly error messages

**Example**:
```typescript
// Good: Proper error handling
async function loadCreature(id: string): Promise<Creature> {
  try {
    const data = await storage.get(id);
    if (!data) throw new Error('Creature not found');
    return validateCreature(data);
  } catch (error) {
    console.error('Failed to load creature:', error);
    throw new UserFriendlyError('Could not load creature. Please try again.');
  }
}
```

---

### Performance

**Requirements**:
- Optimize for PWA constraints
- Lazy loading where appropriate
- Efficient data structures
- Minimize bundle size

**Considerations**:
- Browser performance
- Memory usage
- Network efficiency
- Rendering performance

---

### Accessibility

**Requirements**:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader support

**Example**:
```html
<!-- Good: Accessible -->
<button aria-label="Fuse creatures" onclick="fuse()">
  <span class="sr-only">Fuse selected creatures</span>
  <Icon name="fusion" />
</button>

<!-- Bad: Not accessible -->
<div onclick="fuse()">Fuse</div>
```

---

### Offline Capability

**Requirements**:
- Service worker integration
- Local storage fallbacks
- Offline state handling
- Sync when online

**Considerations**:
- IndexedDB for complex data
- LocalStorage for simple data
- Service worker for caching
- Sync strategy for updates

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

## Implementation Validation

**Before considering complete**:

1. **Matches Blueprint**
   - All features implemented
   - Data structures match
   - State transitions correct
   - Failure handling complete

2. **Quality Gates Met**
   - Type safety verified
   - Error handling tested
   - Accessibility checked
   - Performance optimized

3. **Constraints Respected**
   - PWA-compatible
   - Offline-capable
   - Web-native only
   - No external dependencies

4. **No Placeholders**
   - No TODOs
   - No mocks
   - No placeholders
   - Production-ready

---

## Common Implementation Mistakes

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

### 5. Not Explaining Decisions

**Problem**: Code without explanation
**Solution**: Comment architecture decisions inline

---

## Integration with Other Protocols

### Blueprint Protocol

- Implementation follows blueprint
- Deviations require blueprint update
- Blueprint guides implementation

### Research Protocol

- Research informs implementation
- Implementation uses research findings
- Research artifacts referenced

### Audit Protocol

- Audit reviews implementation
- Implementation checked for quality
- Improvements recommended

---

## Next Steps After Implementation

After implementation is complete:

1. **Test** - Verify functionality
2. **Review** - Check against blueprint
3. **Document** - Update docs if needed
4. **Audit** - Use `@Docs/prompts/audit-prompt.md`

---

**This protocol ensures Cursor implements code that matches blueprints, maintains quality, and respects constraints.**


