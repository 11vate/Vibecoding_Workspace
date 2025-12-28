# Implementation Gate Prompt

## Purpose

Use this prompt to activate **Implementation Mode** - Cursor implements code exactly as specified in blueprints, with no deviations.

---

## The Prompt Template

```
@Docs/blueprints/system-[name].md
@Docs/blueprints/ux-[flow].md
@Codebase

Implement the system exactly as specified in the blueprints.

No deviations.
Explain architecture decisions inline.
```

---

## Usage Examples

### Implementing from System Blueprint

```
@Docs/prompts/implementation-gate-prompt.md
@Docs/blueprints/system-fusion.md
@Codebase

Implement the Fusion System exactly as specified in the blueprint.

No deviations.
Explain architecture decisions inline.
```

### Implementing from UX Blueprint

```
@Docs/prompts/implementation-gate-prompt.md
@Docs/blueprints/ux-collection-browser.md
@Codebase

Implement the Collection Browser UI exactly as specified in the blueprint.

No deviations.
Explain architecture decisions inline.
```

### Implementing from Multiple Blueprints

```
@Docs/prompts/implementation-gate-prompt.md
@Docs/blueprints/system-fusion.md
@Docs/blueprints/ux-fusion-lab.md
@Codebase

Implement the Fusion System and Fusion Lab UI exactly as specified in the blueprints.

No deviations.
Explain architecture decisions inline.
```

---

## Implementation Requirements

### 1. Follow Blueprint Exactly

- Implement as specified
- No deviations without blueprint update
- Respect all constraints
- Follow data structures

### 2. Explain Decisions Inline

- Comment architecture decisions
- Explain why, not just what
- Reference blueprint sections
- Document tradeoffs

### 3. Respect Quality Gates

- Type safety (TypeScript strict)
- Error handling for edge cases
- Accessibility considerations
- Performance optimization
- Offline capability

### 4. No Placeholders

- No TODOs
- No mocks
- No placeholders
- Complete implementation

---

## Implementation Process

### 1. Read Blueprint

- Understand purpose
- Review data structures
- Check state transitions
- Note failure handling

### 2. Plan Implementation

- Break into steps
- Identify dependencies
- Plan error handling
- Consider performance

### 3. Implement

- Follow blueprint exactly
- Explain decisions inline
- Handle edge cases
- Ensure quality

### 4. Validate

- Check against blueprint
- Verify quality gates
- Test error handling
- Confirm constraints

---

## When Deviations Are Needed

If implementation requires deviation:

1. **Stop implementation**
2. **Update blueprint first**
3. **Document why deviation needed**
4. **Get approval**
5. **Then implement**

**Never deviate without blueprint update.**

---

## Integration with Design Docs

Cursor should reference:

- **Design Intelligence Layers** - Ensure alignment
- **Systems Map** - Check dependencies
- **UX Decision Log** - Maintain consistency
- **Core Loop** - Support the loop

---

## Code Quality Standards

### TypeScript

- Strict mode enabled
- Proper types
- No `any` types
- Type safety throughout

### Error Handling

- Try-catch for async operations
- Validation for inputs
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

## Success Indicators

Implementation succeeds when:

- ✅ Code matches blueprint exactly
- ✅ All quality gates met
- ✅ Architecture decisions explained
- ✅ Error handling complete
- ✅ No placeholders or mocks
- ✅ Constraints respected

---

## Next Steps After Implementation

After implementation is complete:

1. **Test** - Verify functionality
2. **Review** - Check against blueprint
3. **Document** - Update docs if needed
4. **Audit** - Use `@Docs/prompts/audit-prompt.md`

---

**This prompt activates Implementation Mode. Cursor implements exactly as specified, with no deviations.**


