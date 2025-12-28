# Complexity Gate

**Authority Tier**: 2 (Mandatory Process)
**Gate Type**: Hard Lock
**Applies To**: Code, UX designs, system blueprints
**Validation Tool**: `tools/code-analyzer/complexity-check.ts`

---

## Purpose

Enforce simplicity and prevent cognitive overload - both for users and maintainers.

**Philosophy**: Complexity kills clarity. Clarity enables execution. This gate is your simplicity enforcer.

---

## Gate Checks

This gate **MUST** pass before any code or design is accepted.

### Check 1: Cognitive Load Limit (UX)

**Rule**: No more than 3 new concepts introduced per screen/level/interaction.

**Rationale**: Human working memory is limited to 3-4 items. Exceeding this creates overwhelm.

**Validation**:
```typescript
// For UX designs/blueprints
const screen = loadScreen(design);
const concepts = extractNewConcepts(screen, context);

if (concepts.length > 3) {
  fail(`Screen "${screen.name}" introduces ${concepts.length} new concepts (max: 3)`);
}
```

**What Counts as a "New Concept"**:
- New mechanic explained
- New UI pattern introduced
- New goal/objective presented
- New control scheme
- New data type player must understand

**What DOESN'T Count**:
- Repeat of existing concept in new context
- Visual variation of known pattern
- Same mechanic with different theme

**Example Violation**:
```markdown
# Fusion Tutorial Screen

New concepts introduced:
1. Fusion mechanic (what it does)
2. Rarity system (how it affects fusion)
3. Element matching (bonus system)
4. Fusion cost (currency requirement)
5. Fusion cooldown (time limit)

Total: 5 concepts → ❌ FAIL (max: 3)
```

**Example Pass**:
```markdown
# Fusion Tutorial Screen 1

New concepts introduced:
1. Fusion mechanic (combine 2 pets → new pet)
2. Basic selection (tap pets to fuse)
3. Fusion button (confirm action)

Total: 3 concepts → ✅ PASS

# Fusion Tutorial Screen 2 (later)

New concepts (building on previous):
1. Rarity affects results (introduced separately)
2. Element bonuses (introduced separately)
```

**Failure Response**:
- Output: REJECTED
- Action: Split into multiple screens/steps
- Suggestion: Layer concepts across tutorial sequence

---

### Check 2: Cyclomatic Complexity (Code)

**Rule**: Function cyclomatic complexity ≤ 10.

**Rationale**: Complex functions are untestable, unmaintainable, and hide bugs.

**Validation**:
```typescript
// Analyze all functions
const functions = extractFunctions(code);

for (const func of functions) {
  const complexity = calculateCyclomaticComplexity(func);

  if (complexity > 10) {
    fail(`Function "${func.name}" has complexity ${complexity} (max: 10)`);
  }
}
```

**Cyclomatic Complexity** = number of linearly independent paths through code

**Calculation**:
- Start at 1
- +1 for each `if`, `else if`, `case`, `&&`, `||`, `?`, `while`, `for`

**Example Violation**:
```typescript
// ❌ FAIL - Complexity: 15
function calculateFusion(pet1, pet2, options) {
  if (pet1.rarity > pet2.rarity) {
    if (pet1.element === pet2.element) {
      if (options.boost) {
        // ... more nesting
      } else if (options.penalty) {
        // ...
      }
    } else if (pet1.generation > 5) {
      // ...
    }
  } else {
    if (pet2.element === 'fire') {
      // ...
    } else if (pet2.element === 'water') {
      // ...
    }
  }
  // Complexity: 15 → FAIL
}
```

**Example Pass**:
```typescript
// ✅ PASS - Complexity: 3 (simplified via decomposition)
function calculateFusion(pet1, pet2, options) {
  const baseRarity = determineBaseRarity(pet1, pet2);
  const elementBonus = calculateElementBonus(pet1, pet2);
  const optionMods = applyOptionModifiers(options);

  return combineResults(baseRarity, elementBonus, optionMods);
}
// Each helper function has complexity ≤ 5
```

**Failure Response**:
- Output: REJECTED
- Action: Refactor into smaller functions
- Suggestion: Extract decision logic into separate functions

---

### Check 3: Nesting Depth Limit

**Rule**: No more than 3 levels of conditional nesting.

**Rationale**: Deep nesting = cognitive maze. Extract logic or use guard clauses.

**Validation**:
```typescript
const nestingDepth = analyzeNestingDepth(code);

if (nestingDepth > 3) {
  fail(`Code has nesting depth ${nestingDepth} (max: 3)`);
}
```

**Example Violation**:
```typescript
// ❌ FAIL - 5 levels of nesting
function process(data) {
  if (data) {
    if (data.valid) {
      if (data.type === 'fusion') {
        if (data.pets) {
          if (data.pets.length === 2) {
            // Level 5 - too deep
          }
        }
      }
    }
  }
}
```

**Example Pass** (guard clauses):
```typescript
// ✅ PASS - Max 1 level
function process(data) {
  if (!data) return;
  if (!data.valid) return;
  if (data.type !== 'fusion') return;
  if (!data.pets) return;
  if (data.pets.length !== 2) return;

  // Main logic here - no nesting
}
```

---

### Check 4: File Length Limit

**Rule**: No file may exceed 500 lines.

**Rationale**: Long files indicate lack of modularization. Hard to navigate and maintain.

**Validation**:
```typescript
const fileLength = countLines(file);

if (fileLength > 500) {
  fail(`File "${file.name}" is ${fileLength} lines (max: 500)`);
}
```

**Exemptions** (rare, requires justification):
- Auto-generated files (must be marked as such)
- Data files (JSON, CSV)
- Configuration files with extensive options

**Failure Response**:
- Output: REJECTED
- Action: Split file into logical modules
- Suggestion: Group related functions, extract to separate files

**Example Split**:
```
// Before: FusionSystem.ts (750 lines)
src/systems/FusionSystem.ts          # Main orchestrator (150 lines)
src/systems/fusion/
  ├── FusionCalculator.ts             # Math/logic (200 lines)
  ├── FusionValidator.ts              # Validation (150 lines)
  ├── FusionEffects.ts                # Visual/audio (150 lines)
  └── FusionTypes.ts                  # Types/interfaces (100 lines)
```

---

### Check 5: Function Length Limit

**Rule**: No function may exceed 50 lines (excluding comments).

**Rationale**: Long functions do too much. Violates single responsibility principle.

**Validation**:
```typescript
const functions = extractFunctions(code);

for (const func of functions) {
  const length = countNonCommentLines(func);

  if (length > 50) {
    fail(`Function "${func.name}" is ${length} lines (max: 50)`);
  }
}
```

**Exception**: Setup/initialization functions may go to 75 lines if purely declarative.

**Failure Response**:
- Output: REJECTED
- Action: Extract logic into helper functions
- Suggestion: Each function should do ONE thing

---

### Check 6: Parameter Count Limit

**Rule**: No function may have more than 5 parameters.

**Rationale**: Too many parameters = function is doing too much or needs an object.

**Validation**:
```typescript
const functions = extractFunctions(code);

for (const func of functions) {
  const paramCount = func.parameters.length;

  if (paramCount > 5) {
    fail(`Function "${func.name}" has ${paramCount} parameters (max: 5)`);
  }
}
```

**Example Violation**:
```typescript
// ❌ FAIL - 7 parameters
function fusePets(
  pet1,
  pet2,
  useBoost,
  elementModifier,
  rarityThreshold,
  generationCap,
  preserveTraits
) {
  // ...
}
```

**Example Pass** (options object):
```typescript
// ✅ PASS - 2 parameters
interface FusionOptions {
  useBoost?: boolean;
  elementModifier?: number;
  rarityThreshold?: number;
  generationCap?: number;
  preserveTraits?: boolean;
}

function fusePets(pet1: Pet, pet2: Pet, options: FusionOptions = {}) {
  // Much clearer
}
```

---

### Check 7: Class Size Limit

**Rule**: No class may exceed 300 lines or have more than 15 methods.

**Rationale**: Large classes violate single responsibility. Hard to test and maintain.

**Validation**:
```typescript
const classes = extractClasses(code);

for (const cls of classes) {
  const lineCount = countLines(cls);
  const methodCount = cls.methods.length;

  if (lineCount > 300) {
    fail(`Class "${cls.name}" is ${lineCount} lines (max: 300)`);
  }

  if (methodCount > 15) {
    fail(`Class "${cls.name}" has ${methodCount} methods (max: 15)`);
  }
}
```

**Failure Response**:
- Output: REJECTED
- Action: Split class by responsibility
- Suggestion: Extract related methods into new classes

---

## Validation Execution

### Automated Validation

```bash
# Run complexity gate
npm run gate:complexity

# Or manually
node tools/code-analyzer/complexity-check.ts

# Expected output:
# ✅ PASS: Cognitive load check (all screens ≤ 3 concepts)
# ✅ PASS: Cyclomatic complexity (all functions ≤ 10)
# ✅ PASS: Nesting depth (max 3 levels)
# ✅ PASS: File length (all files ≤ 500 lines)
# ✅ PASS: Function length (all functions ≤ 50 lines)
# ✅ PASS: Parameter count (all functions ≤ 5 params)
# ✅ PASS: Class size (all classes ≤ 300 lines, ≤ 15 methods)
#
# GATE STATUS: PASSED
```

### Manual Validation

For designs/blueprints:
1. Count new concepts per screen
2. Check for cognitive overload points
3. Verify tutorial/onboarding layers complexity appropriately

---

## Failure Handling

### If Gate Fails:

1. **Immediate Stop** - Do not proceed
2. **Generate Report** - Show specific violations with locations
3. **Log Failure** - Record in `/evolution/GATE_FAILURES_LOG.md`
4. **Simplify** - Refactor, split, extract
5. **Revalidate** - Re-run complexity check

### Example Failure Report:

```
❌ COMPLEXITY GATE: FAILED

Violations:
1. Cyclomatic Complexity: 3 violations
   - calculateFusionResult() complexity: 15 (max: 10) [line 45]
   - validateFusion() complexity: 12 (max: 10) [line 89]
   - Fix: Extract decision logic into helper functions

2. Nesting Depth: 2 violations
   - FusionSystem.fusePets() depth: 5 (max: 3) [line 123]
   - Fix: Use guard clauses to reduce nesting

3. File Length: 1 violation
   - FusionSystem.ts: 672 lines (max: 500)
   - Fix: Split into fusion/, calculator, validator, effects

4. Cognitive Load (UX): 1 violation
   - Fusion Tutorial Screen: 5 concepts (max: 3)
   - Fix: Split into 2 tutorial screens

Gate Status: FAILED
Complexity Score: 45/100 (target: > 80)
Next Step: Simplify and re-run gate check
```

---

## Simplification Strategies

### For Code:

1. **Extract Method** - Pull logic into separate functions
2. **Guard Clauses** - Early returns to reduce nesting
3. **Options Objects** - Replace parameter lists
4. **Decompose Class** - Split by responsibility
5. **Strategy Pattern** - Replace complex conditionals

### For UX:

1. **Progressive Disclosure** - Layer concepts over time
2. **Chunking** - Group related concepts
3. **Tutorial Sequences** - Multi-step onboarding
4. **Contextual Help** - Just-in-time explanations
5. **Defaults** - Hide complexity behind sensible defaults

---

## Complexity Budget

Each project has a "complexity budget":

**Allocate Wisely**:
- **Core Loop**: Simple (< 3 cognitive load)
- **Secondary Features**: Moderate (3-5 cognitive load)
- **Advanced Features**: Complex (5+ cognitive load, but gated)

**Example Budget**:
```
Fusion Game:
- Core Fusion Mechanic: 3 concepts (budget: 3)
- Element System: 2 concepts (budget: 5)
- Breeding System: 4 concepts (budget: 10)
- Advanced Genetics: 6 concepts (budget: 20)

Total Budget Used: 15/38 (good)
```

**Rule**: Don't spend your budget early. Start simple, layer complexity.

---

## Integration Points

**Enforced By**:
- Code review (automated linting)
- CI/CD pipeline (pre-commit hooks)
- Blueprint validation (UX designs)

**Tools**:
- `tools/code-analyzer/complexity-check.ts` (primary)
- `tools/simplification-analyzer/` (suggests simplifications)
- ESLint complexity rules (cyclomatic, nesting)

**Logs**:
- Failures: `/evolution/GATE_FAILURES_LOG.md`
- Complexity metrics: `/evolution/EVOLUTION_METRICS.md`

**References**:
- Cognitive load: `docs/design-intelligence/layer-13-cognitive-load-management.md`
- Code patterns: `docs/code-patterns/simplification-patterns.md`
- UX design: `docs/design-intelligence/layer-9-cognitive-architecture.md`

---

## Success Metrics

Track complexity trends:

- **Average Cyclomatic Complexity**: Target < 5
- **Average File Length**: Target < 250 lines
- **Average Function Length**: Target < 25 lines
- **Cognitive Load Violations**: Target 0 per sprint
- **Complexity Trend**: Should decrease over time

**Review**: Every PR, every sprint retrospective

---

## Exemptions

Rare exemptions permitted for:
- Auto-generated code (mark clearly)
- Data files (non-logic)
- Migration scripts (one-time use)

All exemptions logged in `/evolution/ARBITRATION_LOG.md`.

**Complexity violations are NEVER exempt**. Simplify instead.

---

**Remember**: Complexity is technical debt's favorite hiding place. This gate exposes it early.

**Simplicity is not simple. It requires discipline.**

**Gates are locks, not warnings.**
