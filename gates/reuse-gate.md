# Reuse Gate

**Authority Tier**: 2 (Mandatory Process)
**Gate Type**: Hard Lock
**Applies To**: All creations (patterns, assets, code, utilities)
**Validation Tool**: `tools/pattern-matcher/check-reuse.ts`

---

## Purpose

Enforce systematic reuse and prevent the "reinvent every time" anti-pattern.

**Prime Directive**: **Search First, Create Second**

**Philosophy**: Every time you create instead of reuse, you fork the knowledge base. Fork = maintenance nightmare.

---

## Gate Checks

This gate **MUST** pass before creating any pattern, asset, code utility, or component.

### Check 1: Pattern Search (MANDATORY)

**Rule**: AI MUST search knowledge base for existing patterns before creating new ones.

**Rationale**: Patterns already exist for 80% of problems. Find them first.

**Validation**:
```typescript
// When pattern creation is requested
const problem = extractProblem(request);
const existingPatterns = searchPatternLibrary(problem);

if (existingPatterns.length > 0 && request.isCreatingNew) {
  require_justification_or_adapt(existingPatterns);
}

// Log search was performed
logSearch({
  query: problem,
  resultsFound: existingPatterns.length,
  action: request.isCreatingNew ? 'create-new' : 'reuse'
});
```

**Where to Search**:
1. `/knowledge-base/mechanics-library.md`
2. `/knowledge-base/ui-pattern-library.md`
3. `/knowledge-base/progression-systems.md`
4. `/knowledge-base/pattern-language/patterns/`
5. `/knowledge-base/accumulated-wisdom/successful-patterns.md`

**Search Strategy**:
```
1. Exact match (pattern name)
2. Category match (mechanic type, UI type)
3. Tag match (fusion, collection, etc.)
4. Semantic match (similar problem description)
5. Cross-reference (related patterns)
```

**Failure Response**:
- Output: REJECTED
- Action: Search pattern library first
- Provide: List of matching patterns
- Require: Justification if not reusing

**Example Violation**:
```
User: "Design a progression system for collecting items"
AI: [Creates new progression-collection.md without searching]
```

**Example Pass**:
```
User: "Design a progression system for collecting items"
AI:
1. Searching pattern library...
2. Found 3 relevant patterns:
   - PATTERN-FUSION-001: Fusion-based collection progression
   - PATTERN-IDLE-COLLECTION-001: Passive collection progression
   - PATTERN-CRAFTING-001: Recipe-based collection progression
3. Recommendation: Adapt PATTERN-FUSION-001 (88% success rate, 5 projects)
4. Customization: Adjust rarity curve for your context
5. Creating: mechanic-collection-fusion-adapted.md (adapted, not new)
```

---

### Check 2: Asset Search (MANDATORY)

**Rule**: AI MUST search `ASSET_REGISTRY.md` before requesting/creating assets.

**This check is also part of Asset Gate - enforced at both levels**

**Validation**:
```typescript
const assetRequest = extractAssetRequest(request);
const registry = loadAssetRegistry();
const existingAssets = searchAssetRegistry(registry, assetRequest);

if (existingAssets.length > 0 && request.isCreatingNew) {
  require_justification_or_reuse(existingAssets);
}
```

**See**: `/gates/asset-gate.md` for full asset reuse protocol

---

### Check 3: Code Utility Search (MANDATORY)

**Rule**: AI MUST search codebase for existing utilities before writing new ones.

**Rationale**: Utility duplication = maintenance horror. DRY principle.

**Validation**:
```typescript
// When utility creation is requested
const utilityPurpose = extractUtilityPurpose(request);
const existingUtils = searchCodebase(utilityPurpose, 'utils');

if (existingUtils.length > 0) {
  suggest_reuse_or_extend(existingUtils);
}

// Common duplicates to check
const commonUtils = [
  'formatDate',
  'generateId',
  'clamp',
  'shuffle',
  'debounce',
  'throttle',
  'deepClone'
];

for (const util of commonUtils) {
  if (utilityPurpose.includes(util)) {
    const existing = findExistingUtility(util);
    if (existing) {
      fail(`Utility "${util}" already exists at ${existing.path}. Reuse it.`);
    }
  }
}
```

**Failure Response**:
- Output: REJECTED
- Action: Reuse existing utility
- If inadequate: Extend existing, don't duplicate

**Example Violation**:
```typescript
// ❌ FAIL - Duplicating existing utility
// src/utils/helpers.ts already has generateId()
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
```

**Example Pass**:
```typescript
// ✅ PASS - Reusing existing utility
import { generateId } from '@/utils/helpers';

const newPet = {
  id: generateId(),
  // ...
};
```

---

### Check 4: Component Search (For UI)

**Rule**: Search for existing UI components before creating new ones.

**Validation**:
```typescript
const componentRequest = extractComponentRequest(request);
const existingComponents = searchComponents(componentRequest);

if (existingComponents.length > 0) {
  suggest_reuse_or_composition(existingComponents);
}

// Check component library
const componentLibraries = [
  'src/components/',
  'src/ui/',
  'src/shared/components/'
];

for (const lib of componentLibraries) {
  const matches = searchDirectory(lib, componentRequest.name);
  if (matches.length > 0) {
    warn(`Similar components found in ${lib}: ${matches.join(', ')}`);
  }
}
```

**Reuse Strategies**:
1. **Exact Reuse** - Use component as-is
2. **Composition** - Combine existing components
3. **Extension** - Extend existing component with new props
4. **Variant** - Create variant of existing component (not duplicate)

**Example**:
```typescript
// ❌ FAIL - Creating duplicate button
function FusionButton() {
  return <button className="fusion-btn">Fuse</button>;
}

// ✅ PASS - Reusing with variant
import { Button } from '@/components';
function FusionButton() {
  return <Button variant="fusion">Fuse</Button>;
}
```

---

### Check 5: Justification Quality (If Creating New)

**Rule**: If creating something new when similar exists, justification must be strong.

**Validation**:
```typescript
// If reuse possible but creating new
if (existingSimilar.length > 0 && request.isCreatingNew) {
  const justification = request.justification;

  if (!justification || justification.length < 30) {
    fail('Must justify why not reusing existing solution (min 30 chars)');
  }

  // Check justification quality
  const validReasons = [
    'different-context',
    'performance-optimization',
    'different-constraints',
    'existing-inadequate',
    'different-scale'
  ];

  const reasonMatch = matchJustification(justification, validReasons);

  if (reasonMatch.confidence < 0.7) {
    warn('Justification may be weak. Strongly consider reusing existing solution.');
  }
}
```

**Good Justifications**:
- "Existing pattern assumes combat, our game has no combat"
- "Current utility doesn't handle edge case X, and extending breaks Y"
- "Performance: existing approach is O(n²), need O(n) for our scale"
- "Different domain: can't adapt game pattern to tool context"

**Bad Justifications**:
- "I prefer doing it differently"
- "Easier to write new than understand existing"
- "Want to try a new approach"
- "Not sure if existing works"
- (No justification)

**Failure Response**:
- Output: REJECTED
- Action: Strengthen justification or reuse existing
- Review: Discuss with team/arbiter if unclear

---

### Check 6: Reuse Metrics Tracking

**Rule**: All reuse decisions must be tracked for metrics.

**Validation**:
```typescript
// Track reuse decision
logReuseDecision({
  type: request.type, // 'pattern', 'asset', 'code', 'component'
  query: request.query,
  existingFound: existingSolutions.length,
  action: request.action, // 'reuse', 'adapt', 'create-new'
  justification: request.justification,
  timestamp: new Date()
});

// Update metrics
updateReuseMetrics({
  totalRequests: incrementCounter('total-requests'),
  reuseCount: request.action === 'reuse' ? incrementCounter('reuse') : 0,
  adaptCount: request.action === 'adapt' ? incrementCounter('adapt') : 0,
  createCount: request.action === 'create-new' ? incrementCounter('create') : 0
});
```

**Metrics Logged in**: `/evolution/EVOLUTION_METRICS.md`

---

## Validation Execution

### Automated Validation

```bash
# Run reuse gate
npm run gate:reuse

# Or for specific request
node tools/pattern-matcher/check-reuse.ts --type pattern --query "collection progression"

# Expected output:
# Searching knowledge base...
# Found 3 existing patterns matching "collection progression"
#
# 1. PATTERN-FUSION-001 (88% success, 5 projects)
#    Match: 92%
#    Recommendation: REUSE (high match, proven success)
#
# 2. PATTERN-IDLE-COLLECTION-001 (75% success, 3 projects)
#    Match: 78%
#    Recommendation: Consider if passive collection
#
# 3. PATTERN-CRAFTING-001 (82% success, 4 projects)
#    Match: 65%
#    Recommendation: Adapt if recipe-based
#
# Action: Reuse PATTERN-FUSION-001
# GATE STATUS: PASSED (reuse chosen)
```

### Manual Validation

1. Check search was performed
2. Review search results quality
3. Verify reuse decision or justification
4. Log decision for metrics
5. Track outcomes

---

## Failure Handling

### If Gate Fails:

1. **Immediate Stop** - Cannot create without search
2. **Generate Report** - Show search results
3. **Suggest Reuse** - Recommend best match
4. **Require Justification** - If still creating new
5. **Log Decision** - Track for metrics

### Example Failure Report:

```
❌ REUSE GATE: FAILED

Request: Create new fusion mechanic pattern

Violations:
1. No Search Performed
   - Must search pattern library before creating
   - Action: Run pattern search first

Search Performed:
Found 1 existing pattern:
  - PATTERN-FUSION-001 (mechanic-fusion.md)
    Match: 95%
    Used in: 5 projects
    Success rate: 88%
    Recommendation: REUSE (extremely high match)

Decision: Creating new pattern "mechanic-fusion-v2.md"
Justification: "want different approach"

Justification Quality: WEAK (15% confidence)
  - Bad reason: preference-based, not need-based
  - Suggested action: Reuse PATTERN-FUSION-001

Gate Status: FAILED
Recommendation: Reuse existing pattern or provide stronger justification
```

---

## Reuse Strategies

### 1. Exact Reuse
Use existing solution without modification.

**When**: Problem exactly matches existing pattern
**Example**: Using button component as-is

### 2. Parameterized Reuse
Use existing solution with configuration.

**When**: Same pattern, different parameters
**Example**: Fusion mechanic with different rarity curves

### 3. Composition
Combine multiple existing solutions.

**When**: Complex problem = sum of solved sub-problems
**Example**: New feature = existing pattern A + existing pattern B

### 4. Adaptation
Modify existing solution for new context.

**When**: Similar problem, different constraints
**Example**: Game pattern adapted for tool use

### 5. Extension
Add to existing solution without duplicating.

**When**: Existing is 80% there, need 20% more
**Example**: Extend existing utility with new optional parameter

### 6. Create New (Last Resort)
Only when above strategies truly don't work.

**When**: Genuinely novel problem, strong justification
**Example**: Fundamentally different approach required

---

## Integration Points

**Enforced By**:
- Pattern creation requests
- Code review (check for duplicates)
- Asset creation (via Asset Gate)

**Tools**:
- `tools/pattern-matcher/check-reuse.ts` (primary)
- `tools/pattern-matcher/search-patterns.ts` (search engine)
- `tools/asset-intelligence/reuse-suggester.ts` (asset reuse)
- `tools/redundancy-detector/` (find duplicates in codebase)

**Logs**:
- Reuse decisions: `/evolution/EVOLUTION_METRICS.md`
- Failures: `/evolution/GATE_FAILURES_LOG.md`

**References**:
- Pattern libraries: `/knowledge-base/`
- Asset registry: `/asset-system/ASSET_REGISTRY.md`
- Reuse metrics: `/evolution/EVOLUTION_METRICS.md`

---

## Success Metrics

Track reuse effectiveness:

- **Pattern Reuse Rate**: Target > 70%
- **Asset Reuse Rate**: Target > 60%
- **Code Reuse Rate**: Target > 80%
- **Average Searches Per Request**: Target > 1.5
- **Justification Quality**: Target > 70% confidence

**Quarterly Review**:
```
Q4 2025 Reuse Metrics:
- Pattern Reuse: 76% (up from 20% pre-gate)
- Asset Reuse: 72% (up from 15%)
- Code Reuse: 85% (up from 55%)
- Avg Searches: 2.1 per request
- Strong Justifications: 82%

Impact:
- 40% reduction in pattern proliferation
- 60% reduction in duplicate code
- Maintenance burden decreased
```

---

## Exemptions

This gate has **NO exemptions** for the search requirement.

**MUST search. Always.**

Rare exemptions for creation when similar exists:
- Genuinely novel problem (documented in ARBITRATION_LOG)
- Existing solution fundamentally broken (with fix attempt first)
- Different domain requires different approach (documented)

---

**Remember**: Every creation without reuse is a maintenance burden gift to future you. Future you is not grateful.

**Search First. Create Last.**

**Gates are locks, not warnings.**
