# Quality Gate

**Authority Tier**: 2 (Mandatory Process)
**Gate Type**: Hard Lock
**Applies To**: All code
**Validation Tool**: `tools/code-analyzer/quality-check.ts`

---

## Purpose

Enforce zero-tolerance quality standards. No placeholders, no speculation, no technical debt.

**Philosophy**: Quality is not negotiable. This gate prevents "we'll fix it later" from ever entering the codebase.

**Derived From**: `.cursorrules` lines 104-121 (Quality Gates section)

---

## Gate Checks

This gate **MUST** pass before ANY code is committed.

### Check 1: Zero Placeholders

**Rule**: ZERO placeholders, TODOs, FIXMEs, or mock code allowed.

**Rationale**: Placeholders are abandoned work-in-progress. They rot.

**Validation**:
```typescript
const placeholderPatterns = [
  /\/\/\s*TODO/i,
  /\/\/\s*FIXME/i,
  /\/\/\s*HACK/i,
  /\/\/\s*XXX/i,
  /\/\/\s*NOTE:/i,
  /\/\/\s*@placeholder/i,
  /\/\*\s*TODO/i,
  /PLACEHOLDER/i,
  /TBD/i,
  /STUB/i,
  /NOT_IMPLEMENTED/i,
  /throw new Error\(['"]Not implemented['"]\)/,
  /console\.warn\(['"]TODO/i
];

const violations = [];

for (const pattern of placeholderPatterns) {
  const matches = code.match(new RegExp(pattern, 'gm'));
  if (matches) {
    violations.push(...matches);
  }
}

if (violations.length > 0) {
  fail(`Found ${violations.length} placeholder(s): ${violations.join(', ')}`);
}
```

**Example Violations**:
```typescript
// ❌ ALL OF THESE FAIL

// TODO: Add validation
function process(data) { ... }

// FIXME: This is broken
const result = calculate();

// Placeholder implementation
function fetchData() {
  throw new Error('Not implemented');
}

// @placeholder - will implement later
const config = {};

// TBD: Add error handling
processData(input);
```

**Example Pass**:
```typescript
// ✅ PASS - Complete implementation

function process(data: ProcessData): ProcessResult {
  // Validate input
  if (!data || !data.id) {
    throw new ProcessError('Invalid data: missing id');
  }

  // Process with error handling
  try {
    const result = calculate(data);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Process failed', error);
    throw new ProcessError('Processing failed', { cause: error });
  }
}
```

**Failure Response**:
- Output: REJECTED
- Action: Complete the implementation
- No partial work allowed in commits

---

### Check 2: TypeScript Strict Mode

**Rule**: All TypeScript must pass with strict mode enabled. No `any` types.

**Validation**:
```typescript
// Check tsconfig.json has strict: true
const tsConfig = loadTsConfig();

if (!tsConfig.compilerOptions?.strict) {
  fail('TypeScript strict mode not enabled in tsconfig.json');
}

// Run TypeScript compiler
const tscResult = runTypeScript('--noEmit');

if (tscResult.errors.length > 0) {
  fail(`TypeScript errors: ${tscResult.errors.length} error(s)`);
}

// Check for 'any' types
const anyUsage = findAnyTypes(code);

if (anyUsage.length > 0) {
  fail(`Found ${anyUsage.length} 'any' type(s). All types must be explicit.`);
}
```

**tsconfig.json Requirements**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**Example Violations**:
```typescript
// ❌ FAIL - Using 'any'
function process(data: any) {
  return data.value; // No type safety
}

// ❌ FAIL - Implicit 'any'
function calculate(input) { // Parameter 'input' implicitly has 'any' type
  return input * 2;
}

// ❌ FAIL - Type assertion to 'any'
const value = data as any;
```

**Example Pass**:
```typescript
// ✅ PASS - Explicit types
interface ProcessData {
  id: string;
  value: number;
}

function process(data: ProcessData): number {
  return data.value;
}

function calculate(input: number): number {
  return input * 2;
}
```

**Failure Response**:
- Output: REJECTED
- Action: Add explicit types, fix type errors
- Run: `tsc --noEmit` to see all errors

---

### Check 3: Complete Error Handling

**Rule**: All edge cases and error conditions must be handled.

**Validation**:
```typescript
// Check for unhandled promises
const unhandledPromises = findUnhandledPromises(code);

if (unhandledPromises.length > 0) {
  fail(`${unhandledPromises.length} promise(s) without error handling`);
}

// Check for try-catch around risky operations
const riskyOps = [
  'JSON.parse',
  'localStorage.getItem',
  'fetch',
  'eval',
  'parseInt',
  'parseFloat'
];

for (const op of riskyOps) {
  const usages = findUsages(code, op);

  for (const usage of usages) {
    if (!isWrappedInTryCatch(usage)) {
      warn(`${op} at line ${usage.line} not wrapped in try-catch`);
    }
  }
}

// Check for null/undefined checks
const nullableAccess = findPotentialNullAccess(code);

if (nullableAccess.length > 0) {
  fail(`${nullableAccess.length} potential null/undefined access(es)`);
}
```

**Example Violations**:
```typescript
// ❌ FAIL - No error handling
async function loadData() {
  const response = await fetch('/api/data');
  return response.json(); // What if fetch fails? What if JSON is invalid?
}

// ❌ FAIL - Unhandled promise
fetchData().then(data => process(data)); // No .catch()

// ❌ FAIL - No null check
function getName(user) {
  return user.profile.name; // What if user or profile is null?
}
```

**Example Pass**:
```typescript
// ✅ PASS - Complete error handling
async function loadData(): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error instanceof ApiError) {
      logger.error('API request failed', error);
    } else {
      logger.error('Unexpected error loading data', error);
    }
    throw new DataLoadError('Failed to load data', { cause: error });
  }
}

// ✅ PASS - Promise error handling
fetchData()
  .then(data => process(data))
  .catch(error => {
    logger.error('Fetch failed', error);
    handleError(error);
  });

// ✅ PASS - Null safety
function getName(user: User | null): string {
  if (!user || !user.profile) {
    return 'Unknown';
  }
  return user.profile.name ?? 'Unnamed';
}
```

**Failure Response**:
- Output: REJECTED
- Action: Add error handling for all edge cases
- Consider: What can go wrong? Handle it.

---

### Check 4: No Magic Numbers

**Rule**: All numeric values must be named constants with rationale comments.

**Validation**:
```typescript
const magicNumbers = findMagicNumbers(code);

// Exempt: 0, 1, -1, 2 (common)
const exemptNumbers = [0, 1, -1, 2, 10, 100];

const violations = magicNumbers.filter(num =>
  !exemptNumbers.includes(num.value) &&
  !num.hasComment
);

if (violations.length > 0) {
  fail(`Found ${violations.length} magic number(s): ${violations.map(v => v.value).join(', ')}`);
}
```

**Example Violations**:
```typescript
// ❌ FAIL - Magic numbers
if (rarity > 75) { // Why 75? What does it mean?
  return 'legendary';
}

const cooldown = 5000; // Why 5000?

function calculate(value) {
  return value * 1.5 + 32; // What are these?
}
```

**Example Pass**:
```typescript
// ✅ PASS - Named constants with rationale

// Rarity thresholds: based on drop rate balance (see docs/balance.md)
const RARITY_LEGENDARY_THRESHOLD = 75; // Top 25% of pets
const RARITY_RARE_THRESHOLD = 50;      // Top 50% of pets
const RARITY_COMMON_THRESHOLD = 0;     // All pets

if (rarity > RARITY_LEGENDARY_THRESHOLD) {
  return 'legendary';
}

// Cooldown duration: UX research shows 5s optimal for engagement
const FUSION_COOLDOWN_MS = 5000; // 5 seconds between fusions

// Fahrenheit to Celsius conversion constants
const FAHRENHEIT_MULTIPLIER = 1.5;
const FAHRENHEIT_OFFSET = 32;

function celsiusToFahrenheit(celsius: number): number {
  return celsius * FAHRENHEIT_MULTIPLIER + FAHRENHEIT_OFFSET;
}
```

**Failure Response**:
- Output: REJECTED
- Action: Extract numbers to named constants
- Add: Comment explaining why this value

---

### Check 5: Accessibility Considered

**Rule**: Accessibility must be explicitly considered (even if PWA).

**Validation**:
```typescript
// Check for common accessibility issues
const a11yIssues = [];

// Missing alt text
const images = findJSXElements(code, 'img');
for (const img of images) {
  if (!img.props.alt) {
    a11yIssues.push(`Image missing alt text at line ${img.line}`);
  }
}

// Missing labels
const inputs = findJSXElements(code, 'input');
for (const input of inputs) {
  if (!hasAssociatedLabel(input) && !input.props['aria-label']) {
    a11yIssues.push(`Input missing label at line ${input.line}`);
  }
}

// Button without text
const buttons = findJSXElements(code, 'button');
for (const button of buttons) {
  if (!hasTextContent(button) && !button.props['aria-label']) {
    a11yIssues.push(`Button without accessible text at line ${button.line}`);
  }
}

// Keyboard navigation
const interactiveElements = findInteractiveElements(code);
for (const element of interactiveElements) {
  if (!hasKeyboardHandler(element)) {
    warn(`Interactive element may not be keyboard accessible at line ${element.line}`);
  }
}

if (a11yIssues.length > 0) {
  fail(`Accessibility issues: ${a11yIssues.join('; ')}`);
}
```

**Example Violations**:
```tsx
// ❌ FAIL - Accessibility issues
<img src="pet.png" /> {/* No alt text */}

<input type="text" /> {/* No label */}

<button onClick={handleClick}>
  <Icon name="close" /> {/* Icon without text */}
</button>

<div onClick={handleClick}>Click me</div> {/* Div as button, no keyboard support */}
```

**Example Pass**:
```tsx
// ✅ PASS - Accessible
<img src="pet.png" alt="Rare fire element pet" />

<label htmlFor="pet-name">Pet Name:</label>
<input type="text" id="pet-name" />

<button onClick={handleClick} aria-label="Close dialog">
  <Icon name="close" />
  <span className="sr-only">Close</span>
</button>

<button onClick={handleClick}>
  <Icon name="close" />
  Close
</button>
```

**Failure Response**:
- Output: REJECTED (for missing alt/labels) or WARNING (for keyboard nav)
- Action: Add alt text, labels, keyboard support
- Test: Navigate with keyboard, use screen reader

---

### Check 6: Performance Optimized

**Rule**: Code must be reasonably performant. No obvious performance issues.

**Validation**:
```typescript
// Check for common performance anti-patterns
const perfIssues = [];

// Inefficient loops
const loops = findLoops(code);
for (const loop of loops) {
  if (hasExpensiveOperationInLoop(loop)) {
    perfIssues.push(`Expensive operation in loop at line ${loop.line}`);
  }
}

// Unnecessary re-renders (React)
const components = findReactComponents(code);
for (const component of components) {
  if (!usesMemo(component) && hasExpensiveComputation(component)) {
    warn(`Component may benefit from useMemo at line ${component.line}`);
  }
}

// Memory leaks
const subscriptions = findSubscriptions(code);
for (const sub of subscriptions) {
  if (!hasCleanup(sub)) {
    perfIssues.push(`Subscription without cleanup at line ${sub.line}`);
  }
}

if (perfIssues.length > 0) {
  fail(`Performance issues: ${perfIssues.join('; ')}`);
}
```

**Example Violations**:
```typescript
// ❌ FAIL - Performance issues

// Inefficient: O(n²)
function findDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j.length; j++) {
      // Nested loop on large array
    }
  }
}

// Memory leak: event listener not removed
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // No cleanup!
}, []);

// Unnecessary re-render
function ExpensiveList({ items }) {
  const processed = expensiveProcess(items); // Runs every render!
  return <div>{processed.map(...)}</div>;
}
```

**Example Pass**:
```typescript
// ✅ PASS - Optimized

// Efficient: O(n) using Set
function findDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    }
    seen.add(item);
  }

  return Array.from(duplicates);
}

// Cleanup function
useEffect(() => {
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Memoized expensive computation
function ExpensiveList({ items }: { items: Item[] }) {
  const processed = useMemo(
    () => expensiveProcess(items),
    [items]
  );

  return <div>{processed.map(...)}</div>;
}
```

**Failure Response**:
- Output: REJECTED (critical) or WARNING (optimization opportunity)
- Action: Optimize algorithm, add memoization, clean up resources
- Profile: Measure if performance critical

---

### Check 7: Code Linting

**Rule**: Code must pass all ESLint rules with zero warnings.

**Validation**:
```bash
# Run ESLint
eslint . --ext .ts,.tsx,.js,.jsx

# Must exit with code 0 (no errors, no warnings)
```

**ESLint Configuration Requirements**:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**Failure Response**:
- Output: REJECTED
- Action: Fix all lint errors and warnings
- Run: `eslint . --fix` for auto-fixable issues

---

## Validation Execution

### Automated Validation

```bash
# Run quality gate (runs all checks)
npm run gate:quality

# Or manually
node tools/code-analyzer/quality-check.ts

# Expected output:
# ✅ PASS: No placeholders found
# ✅ PASS: TypeScript strict mode (0 errors)
# ✅ PASS: Error handling complete
# ✅ PASS: No magic numbers
# ✅ PASS: Accessibility considered
# ✅ PASS: Performance optimized
# ✅ PASS: ESLint (0 errors, 0 warnings)
#
# GATE STATUS: PASSED
# Quality Score: 100/100
```

### CI/CD Integration

```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run gate:quality
      - run: npm run test
```

---

## Failure Handling

### If Gate Fails:

1. **Immediate Stop** - Do not commit
2. **Generate Report** - Show all violations
3. **Log Failure** - Record in `/evolution/GATE_FAILURES_LOG.md`
4. **Fix Violations** - Address each issue
5. **Revalidate** - Re-run quality gate

### Example Failure Report:

```
❌ QUALITY GATE: FAILED

Violations:
1. Placeholders: 3 found
   - src/systems/FusionSystem.ts:45 "// TODO: Add validation"
   - src/components/PetCard.tsx:23 "// FIXME: Handle null case"
   - src/utils/calculate.ts:12 "throw new Error('Not implemented')"

2. TypeScript Errors: 5 errors
   - Parameter 'data' implicitly has 'any' type (FusionSystem.ts:67)
   - Property 'rarity' does not exist on type 'unknown' (PetCard.tsx:34)
   - ...

3. Error Handling: 2 violations
   - Unhandled promise at line 89 (FusionSystem.ts)
   - Potential null access at line 45 (PetCard.tsx)

4. Magic Numbers: 4 violations
   - Value 75 at line 56 (no explanation)
   - Value 5000 at line 89 (no explanation)

5. Accessibility: 2 violations
   - Image without alt text (PetCard.tsx:23)
   - Input without label (FusionForm.tsx:45)

6. ESLint: 8 warnings, 2 errors
   - no-console: Unexpected console.log (line 34)
   - react-hooks/exhaustive-deps: Missing dependency 'pets' (line 67)

Gate Status: FAILED
Quality Score: 45/100 (target: > 95)
Next Step: Fix all violations and re-run gate
```

---

## Integration Points

**Enforced By**:
- Pre-commit hooks (husky)
- CI/CD pipeline (GitHub Actions)
- Code review (manual check)

**Tools**:
- `tools/code-analyzer/quality-check.ts` (primary)
- ESLint + plugins (linting)
- TypeScript compiler (type checking)
- Prettier (formatting)

**Logs**:
- Failures: `/evolution/GATE_FAILURES_LOG.md`
- Quality trends: `/evolution/EVOLUTION_METRICS.md`

**References**:
- Coding rules: `docs/coding-rules/`
- Quality standards: `docs/blueprint-standards/quality-standards.md`
- TypeScript config: `tsconfig.json`
- ESLint config: `.eslintrc.json`

---

## Success Metrics

Track quality over time:

- **Gate Pass Rate**: Target 100% (all commits pass)
- **Quality Score**: Target > 95/100
- **TypeScript Errors**: Target 0
- **ESLint Warnings**: Target 0
- **Accessibility Issues**: Target 0
- **Code Coverage**: Target > 80%

**Review**: Every PR, every sprint

---

## Exemptions

This gate has **NO exemptions**. Quality is Tier 1 Law.

**Zero tolerance for**:
- Placeholders
- Type errors
- Unhandled errors
- Magic numbers
- Missing alt text
- Lint errors

If code doesn't pass, it doesn't ship. Period.

---

**Remember**: Quality debt compounds faster than financial debt. This gate stops debt accumulation.

**"We'll fix it later" = "We'll never fix it"**

**Gates are locks, not warnings.**
