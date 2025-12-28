# Refactoring Patterns

## Purpose

Library of common refactoring patterns, enabling systematic code improvement.

**Refactoring patterns enable systematic improvement.**

---

## Pattern Entry Format

```markdown
## [Pattern Name]

**Category**: [Extract/Inline/Replace/etc.]
**Complexity**: [Simple/Medium/Complex]

**Description**: [What the pattern does]

**When to Use**: [Use cases]

**Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Example**:
\`\`\`typescript
// Before
// After
\`\`\`

**Why It Works**: [Why this pattern is good]
```

---

## Common Patterns

### Extract Function

**Pattern**: Extract code into separate function.

**When to Use**: Code duplication, complex logic, unclear intent.

**Steps**:
1. Identify code to extract
2. Create new function
3. Replace code with function call
4. Test

---

### Extract Class

**Pattern**: Extract code into separate class.

**When to Use**: Large class, multiple responsibilities, unclear structure.

**Steps**:
1. Identify code to extract
2. Create new class
3. Move code to class
4. Update references
5. Test

---

### Replace Magic Number

**Pattern**: Replace magic number with named constant.

**When to Use**: Magic numbers present, unclear meaning.

**Steps**:
1. Identify magic number
2. Create named constant
3. Replace magic number
4. Test

---

### Simplify Conditional

**Pattern**: Simplify complex conditional logic.

**When to Use**: Complex conditionals, unclear logic.

**Steps**:
1. Identify complex conditional
2. Simplify logic
3. Extract conditions if needed
4. Test

---

## Integration Points

### Refactoring Triggers
- Patterns address triggers
- Triggers guide pattern selection
- Patterns resolve triggers

### Knowledge Base
- Patterns documented
- Patterns referenced
- Patterns accumulated

---

**This library enables systematic refactoring through proven patterns.**


