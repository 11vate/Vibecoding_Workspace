# Asset Reuse Policy

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Enforced By**: Reuse Gate (`gates/reuse-gate.md`)

---

## Purpose

Establishes the mandatory "Reuse Before Creation" principle as the cornerstone of asset management.

**Prime Directive**: **Search First, Create Second**

**Philosophy**: Every new asset created is a maintenance burden, a potential duplicate, and a lost opportunity for consistency. Reuse maximizes value, minimizes waste, and builds coherence.

---

## The Reuse Imperative

### Why Reuse Matters

#### For Quality
- **Consistency**: Reused assets maintain visual/audio coherence
- **Proven Quality**: Reused assets are battle-tested
- **Less Variance**: Fewer assets = easier quality control

#### For Performance
- **Smaller Bundles**: Fewer unique assets = smaller download sizes
- **Better Caching**: Reused assets cached once, used many times
- **Faster Loading**: Less to load, decompress, and initialize

#### For Maintenance
- **Single Point of Update**: Fix once, benefits all uses
- **Less Technical Debt**: Fewer orphaned, unused assets
- **Easier Refactoring**: Clear dependency tracking

#### For Discovery
- **Findable**: Registry makes assets discoverable
- **Trackable**: Usage metrics show what's working
- **Improvable**: Popular assets get optimization priority

### The Cost of Not Reusing

```
Creating New Asset (when similar exists):
- Development Time: 15-30 minutes
- Optimization Time: 5-10 minutes
- Testing Time: 10-15 minutes
- Documentation Time: 5 minutes
- Future Maintenance: 2-5 minutes per update
- Cognitive Load: "Which button asset should I use?"

Total Cost: 40-65 minutes + ongoing maintenance

Reusing Existing Asset:
- Search Registry: 1-2 minutes
- Verify Suitability: 1 minute
- Increment Counter: 0 minutes (automatic)

Total Cost: 2-3 minutes

Savings: 38-62 minutes per asset decision
```

**With 100 asset decisions per project**: 63-103 hours saved via reuse

---

## Mandatory Reuse Protocol

### Step 1: ALWAYS Search First

**Rule**: You MUST search the asset registry before creating ANY asset.

**No Exceptions**.

```typescript
// REQUIRED before creating any asset
const searchQuery = {
  type: 'sprite',
  tags: ['button', 'primary'],
  description: 'Primary action button for UI'
};

const registry = await loadAssetRegistry();
const existingAssets = await searchRegistry(registry, searchQuery);

if (existingAssets.length === 0) {
  // Only NOW can you proceed to create new asset
  await createNewAsset();
} else {
  // Present options: Reuse or Justify
  await handleExistingAssets(existingAssets);
}
```

**Search Dimensions**:
1. **By Type**: Same asset category (sprite, audio, font, etc.)
2. **By Tags**: Overlapping tags
3. **By Description**: Semantic similarity
4. **By Dimensions** (images): Similar size
5. **By Duration** (audio): Similar length
6. **By Project**: Used in related projects

**Search Thoroughness**:
- **Minimum**: Type + 1 tag match
- **Recommended**: Type + 2 tags + description similarity
- **Thorough**: All dimensions + visual/audio preview

### Step 2: Evaluate Matches

When existing assets are found, evaluate each:

```typescript
interface AssetMatch {
  asset: Asset;
  matchScore: number;      // 0-100
  matchReasons: string[];  // Why it matched
  suitability: 'perfect' | 'good' | 'adaptable' | 'poor';
  reuseRecommendation: 'reuse' | 'adapt' | 'create-new';
}

function evaluateMatch(existingAsset: Asset, request: AssetRequest): AssetMatch {
  let score = 0;
  const reasons = [];

  // Type match (required)
  if (existingAsset.type === request.type) {
    score += 30;
    reasons.push('Same type');
  }

  // Tag overlap
  const tagOverlap = intersection(existingAsset.tags, request.tags);
  score += tagOverlap.length * 10;
  reasons.push(`${tagOverlap.length} matching tags`);

  // Description similarity (semantic)
  const descSimilarity = calculateSimilarity(existingAsset.description, request.description);
  score += descSimilarity * 20;
  if (descSimilarity > 0.7) {
    reasons.push('Similar purpose');
  }

  // Dimension similarity (for images)
  if (existingAsset.dimensions && request.dimensions) {
    const dimSimilarity = calculateDimensionSimilarity(
      existingAsset.dimensions,
      request.dimensions
    );
    score += dimSimilarity * 15;
  }

  // Usage history (popular assets are proven)
  if (existingAsset.reuse_count > 5) {
    score += 10;
    reasons.push(`Proven asset (used ${existingAsset.reuse_count} times)`);
  }

  // Determine suitability
  let suitability: string;
  let recommendation: string;

  if (score >= 80) {
    suitability = 'perfect';
    recommendation = 'reuse';
  } else if (score >= 60) {
    suitability = 'good';
    recommendation = 'reuse';
  } else if (score >= 40) {
    suitability = 'adaptable';
    recommendation = 'adapt';
  } else {
    suitability = 'poor';
    recommendation = 'create-new';
  }

  return {
    asset: existingAsset,
    matchScore: score,
    matchReasons: reasons,
    suitability,
    reuseRecommendation: recommendation
  };
}
```

### Step 3: Decision Matrix

Based on match evaluation:

| Match Score | Suitability | Action | Justification Required |
|------------|-------------|--------|------------------------|
| 80-100 | Perfect | **REUSE** | No - perfect match |
| 60-79 | Good | **REUSE** | No - good match |
| 40-59 | Adaptable | **ADAPT or REUSE** | Optional - explain adaptation |
| 20-39 | Poor | **CREATE NEW** | Yes - explain why inadequate |
| 0-19 | No Match | **CREATE NEW** | Yes - explain difference |

**Reuse Decision Flow**:
```
Search Registry
    ↓
Match Score ≥ 60?
    ↓
  YES → REUSE existing
    ├─ Increment reuse_count
    ├─ Update last_used date
    ├─ Add project to projects_used_in
    └─ ✅ Done
    ↓
  NO → Match Score ≥ 40?
    ↓
  YES → ADAPT existing
    ├─ Modify copy of existing
    ├─ Register as new (linked to original)
    ├─ Document adaptation
    └─ ✅ Done
    ↓
  NO → CREATE NEW
    ├─ Provide justification (MANDATORY)
    ├─ Validate justification quality
    ├─ If weak: REJECT, reconsider reuse
    ├─ If strong: Proceed to creation
    └─ ✅ Done
```

---

## Reuse Strategies

### Strategy 1: Exact Reuse (Score: 80-100)

**When**: Perfect match for requirements

**Action**: Use existing asset without modification

**Example**:
```typescript
// Request: Primary button sprite
// Found: ASSET-2025-001 (button-primary.png)
// Match Score: 95 (same type, same tags, same dimensions)

// ✅ Reuse
import { getAsset } from '@/asset-system/registry';
const buttonSprite = getAsset('ASSET-2025-001');

// Automatically:
// - Increment reuse_count (now 6)
// - Update last_used (2025-12-24)
// - Add project to projects_used_in
```

**Benefits**:
- Zero creation time
- Proven quality
- Maximum consistency
- Smallest bundle impact

### Strategy 2: Parameterized Reuse (Score: 60-79)

**When**: Good match, minor customization needed via parameters

**Action**: Reuse with runtime configuration

**Example**:
```typescript
// Request: Secondary button (different color)
// Found: ASSET-2025-001 (button-primary.png)
// Match Score: 75 (same type, same structure, different styling)

// ✅ Reuse with CSS/shader customization
import { getAsset } from '@/asset-system/registry';
const buttonSprite = getAsset('ASSET-2025-001');

// Apply color filter at runtime
const secondaryButton = applyColorFilter(buttonSprite, 'secondary');
```

**Benefits**:
- Still reusing asset
- Runtime flexibility
- Consistency maintained
- Single source of truth

### Strategy 3: Variation Creation (Score: 40-59)

**When**: Adaptable match, needs modification

**Action**: Create variation based on existing, link to original

**Example**:
```typescript
// Request: Large button (128x64 instead of 64x32)
// Found: ASSET-2025-001 (button-primary.png, 64x32)
// Match Score: 55 (same type, same style, different dimensions)

// ✅ Create variation (not from scratch)
const variation = await createVariation({
  baseAsset: 'ASSET-2025-001',
  modifications: {
    dimensions: '128x64',
    scaling: 'vector-upscale' // maintain quality
  }
});

// Register as ASSET-2025-015
// - type: sprite
// - tags: button, primary, large
// - alternatives: ['ASSET-2025-001'] ← link to original
// - description: "Large variant of primary button"
```

**Benefits**:
- Faster than creating from scratch
- Visual consistency maintained
- Clear relationship documented
- Original not duplicated

### Strategy 4: Composition (Score: Varies)

**When**: Need combination of existing assets

**Action**: Compose multiple existing assets into new one

**Example**:
```typescript
// Request: Notification badge (icon + number)
// Found:
//   - ASSET-2025-010 (notification-icon.png)
//   - ASSET-2025-022 (number-badge.png)
// Combined Score: 70

// ✅ Compose from existing
const badge = composeAssets([
  { asset: 'ASSET-2025-010', position: 'base' },
  { asset: 'ASSET-2025-022', position: 'overlay' }
]);

// Register composition as ASSET-2025-030
// - type: sprite
// - composed_from: ['ASSET-2025-010', 'ASSET-2025-022']
// - description: "Notification badge composed from icon + number"
```

**Benefits**:
- Maximum reuse
- Modular approach
- Easy to update (change components)
- Clear dependencies

### Strategy 5: Asset Family (Score: 40-100)

**When**: Multiple related assets needed (e.g., button states)

**Action**: Create family of related assets, reuse structure

**Example**:
```typescript
// Request: Button states (normal, hover, pressed, disabled)
// Found: ASSET-2025-001 (button-primary.png, normal state)
// Match Score: 45 (same structure, need additional states)

// ✅ Create asset family
const buttonFamily = await createAssetFamily({
  baseAsset: 'ASSET-2025-001',
  family: 'button-primary',
  states: ['normal', 'hover', 'pressed', 'disabled']
});

// Register as:
// - ASSET-2025-001 (normal) ← already exists
// - ASSET-2025-016 (hover)
// - ASSET-2025-017 (pressed)
// - ASSET-2025-018 (disabled)
// All tagged with 'button-primary-family'
```

**Benefits**:
- Structural consistency
- Clear relationships
- Easy to find related assets
- Batch operations possible

### Strategy 6: Justifiable Creation (Score: 0-39)

**When**: No suitable match exists OR existing is inadequate

**Action**: Create new asset with strong justification

**Example**:
```typescript
// Request: Pixel art character sprite
// Found: ASSET-2025-050 (realistic character sprite)
// Match Score: 25 (same type, completely different art style)

// ❌ Cannot reuse (different art style)
// ✅ CREATE NEW with justification

const justification = `
Existing character sprites (ASSET-2025-050) use realistic art style.
This project requires pixel art aesthetic (16x16, 8-bit color palette).
Art styles are incompatible - cannot adapt realistic to pixel art.
Creating new pixel art character sprite.
`;

const newAsset = await createAsset({
  type: 'sprite',
  justification: justification,
  justification_quality: 'strong' // validated
});
```

**Justification Requirements**:
- **Minimum 30 characters**
- **Explains why existing is inadequate**
- **Explains what's different**
- **No weak reasons** ("prefer my own", "didn't look", etc.)

---

## Justification Quality

### Strong Justifications (Acceptable)

✅ **Different Art Style**
```
"Existing sprites use realistic style. Project requires
pixel art aesthetic (8-bit). Styles incompatible."
```

✅ **Different Constraints**
```
"Existing audio is 192kbps stereo. Mobile version
requires 96kbps mono to meet 5MB bundle limit."
```

✅ **Different Context**
```
"Existing UI buttons designed for desktop (large click targets).
Mobile version requires smaller, thumb-optimized buttons."
```

✅ **Performance Requirements**
```
"Existing sprite is 512x512. Game runs at 60fps on mobile,
need 128x128 version to maintain performance."
```

✅ **Feature Incompatibility**
```
"Existing button sprite is static PNG. Need animated SVG
for loading state animation."
```

### Weak Justifications (Rejected)

❌ **Preference-Based**
```
"I prefer creating my own assets."
→ REJECTED: Not a technical reason
```

❌ **Laziness**
```
"Easier to create new than search existing."
→ REJECTED: Violates search-first principle
```

❌ **Ignorance**
```
"Didn't know if existing assets would work."
→ REJECTED: Should evaluate before deciding
```

❌ **Vague**
```
"Existing isn't quite right."
→ REJECTED: Not specific enough, explain what's wrong
```

❌ **No Justification**
```
(empty justification field)
→ REJECTED: Justification is mandatory
```

### Justification Validation

```typescript
function validateJustification(justification: string): ValidationResult {
  // Length check
  if (justification.length < 30) {
    return {
      valid: false,
      reason: 'Justification too short (min 30 chars)'
    };
  }

  // Weak reason detection
  const weakReasons = [
    /prefer/i,
    /easier/i,
    /didn't (know|look|check)/i,
    /not sure/i,
    /just want/i
  ];

  for (const pattern of weakReasons) {
    if (pattern.test(justification)) {
      return {
        valid: false,
        reason: 'Weak justification detected (preference/laziness)'
      };
    }
  }

  // Strong reason detection
  const strongReasons = [
    /different (style|context|constraints|requirements)/i,
    /performance/i,
    /incompatible/i,
    /technical (limitation|requirement)/i
  ];

  const hasStrongReason = strongReasons.some(pattern => pattern.test(justification));

  return {
    valid: hasStrongReason,
    reason: hasStrongReason
      ? 'Strong technical justification'
      : 'Justification should explain technical reason'
  };
}
```

---

## Reuse Metrics & Tracking

### Automatic Tracking

Every asset reuse is automatically logged:

```typescript
interface ReuseEvent {
  asset_id: string;
  project_id: string;
  timestamp: string;
  reuse_type: 'exact' | 'parameterized' | 'variation' | 'composition';
}

async function logReuse(assetId: string, projectId: string, type: string) {
  // Update asset registry
  await incrementReuseCount(assetId);
  await updateLastUsed(assetId);
  await addProjectUsage(assetId, projectId);

  // Log event
  await logReuseEvent({
    asset_id: assetId,
    project_id: projectId,
    timestamp: new Date().toISOString(),
    reuse_type: type
  });
}
```

### Reuse Metrics

Track reuse effectiveness in `ASSET_REGISTRY.md`:

```markdown
## Reuse Statistics (Updated Weekly)

- **Total Assets**: 127
- **Average Reuse Count**: 3.2
- **Most Reused Asset**: ASSET-2025-001 (button-primary.png, 47 uses)
- **Reuse Rate**: 68% (target: > 60%)
- **Asset Proliferation**: 12 assets/month (target: < 15)
- **Orphaned Assets**: 5 (target: 0)

### Top 10 Most Reused Assets

1. ASSET-2025-001 - button-primary.png (47 uses, 12 projects)
2. ASSET-2025-010 - click-sound.mp3 (38 uses, 9 projects)
3. ASSET-2025-022 - icon-star.svg (31 uses, 8 projects)
...
```

### Reuse Goals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Reuse Rate | 68% | > 60% | ✅ On Track |
| Avg Reuse Count | 3.2 | > 3.0 | ✅ On Track |
| Orphaned Assets | 5 | 0 | ⚠️ Needs Work |
| Asset Growth | 12/mo | < 15/mo | ✅ On Track |
| Justification Quality | 78% | > 70% | ✅ On Track |

### Reuse Leaderboard

Encourage reuse with visibility:

```markdown
## Projects by Reuse Rate

1. **Project Alpha**: 87% reuse rate (excellent)
2. **Project Beta**: 76% reuse rate (good)
3. **Project Gamma**: 62% reuse rate (acceptable)
4. **Project Delta**: 43% reuse rate (needs improvement)

Projects with >70% reuse rate demonstrate excellent asset discipline.
```

---

## Reuse Rewards

### Benefits of High Reuse

**For Projects**:
- ✅ Faster development (less asset creation time)
- ✅ Smaller bundle sizes (fewer unique assets)
- ✅ Better performance (cached assets)
- ✅ Visual consistency (coherent aesthetic)
- ✅ Easier maintenance (fewer assets to update)

**For Assets**:
- ✅ High-reuse assets get optimization priority
- ✅ Popular assets get better documentation
- ✅ Proven assets become recommended defaults
- ✅ Reuse count serves as quality signal

**For Workspace**:
- ✅ Knowledge compounds (best assets rise to top)
- ✅ Technical debt reduced (less proliferation)
- ✅ Onboarding easier (smaller asset library)
- ✅ Quality improves (focus on fewer, better assets)

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: "Quick Create"
**Problem**: Creating asset without searching
```typescript
// ❌ BAD
const button = await createAsset('button.png'); // No search!

// ✅ GOOD
const existing = await searchAssetRegistry({ type: 'sprite', tags: ['button'] });
const button = existing.length > 0 ? reuseAsset(existing[0]) : createAsset('button.png');
```

### ❌ Anti-Pattern 2: "Slightly Different"
**Problem**: Creating new asset for minor variation
```typescript
// ❌ BAD - Creating 5 nearly identical buttons
createAsset('button-primary.png');
createAsset('button-primary-hover.png');  // Just a color change!
createAsset('button-primary-active.png'); // Just a color change!
createAsset('button-secondary.png');      // Just a color change!
createAsset('button-disabled.png');       // Just a color change!

// ✅ GOOD - Reuse with parameterization
const button = getAsset('ASSET-2025-001');
applyState(button, 'hover');    // Runtime CSS/shader
applyState(button, 'active');   // Runtime CSS/shader
applyColor(button, 'secondary'); // Runtime color filter
```

### ❌ Anti-Pattern 3: "Per-Project Assets"
**Problem**: Duplicating assets per project instead of sharing
```typescript
// ❌ BAD - Each project has own copy
project-a/assets/button.png
project-b/assets/button.png  // Duplicate!
project-c/assets/button.png  // Duplicate!

// ✅ GOOD - Shared asset registry
src/assets/sprites/button.png (ASSET-2025-001)
// Used by: project-a, project-b, project-c
// Reuse count: 3
```

### ❌ Anti-Pattern 4: "Archive Hoarding"
**Problem**: Keeping unused assets "just in case"
```typescript
// ❌ BAD - 500 assets, 400 unused
Total Assets: 500
Used Assets: 100
Orphaned Assets: 400 (80%)

// ✅ GOOD - Regular cleanup
Total Assets: 120
Used Assets: 115
Orphaned Assets: 5 (4%)
// Quarterly review removes unused assets
```

---

## Enforcement

### Automated Enforcement

**Pre-Commit Hook**:
```bash
# Reject commits with unregistered assets
git hook: pre-commit
- Check for new files in src/assets/
- Validate all new assets are registered
- Ensure reuse search was performed
- REJECT if violations found
```

**CI/CD Pipeline**:
```yaml
# .github/workflows/asset-validation.yml
- name: Validate Asset Reuse
  run: |
    node tools/asset-validator/check-reuse.ts
    # Fails if:
    # - Assets not registered
    # - Reuse search not performed
    # - Weak justifications
```

**Reuse Gate** (`gates/reuse-gate.md`):
- Enforces search-first protocol
- Validates justification quality
- Tracks reuse metrics
- Blocks output if violations

---

## Manual Review

**Quarterly Asset Audit**:
1. Review all assets with `reuse_count = 0`
2. Identify potential duplicates (similar assets)
3. Consolidate where possible
4. Archive/delete orphaned assets
5. Update registry and metrics

**Annual Asset Health Check**:
1. Full registry validation
2. Check all links and references
3. Verify all assets still used
4. Update optimization for high-reuse assets
5. Refactor asset families if needed

---

## Integration with Tools

### Reuse Suggester Tool
```bash
# Before creating, ask the suggester
node tools/asset-intelligence/reuse-suggester.ts --query "primary button sprite"

# Output:
# Found 2 similar assets:
# 1. ASSET-2025-001 (button-primary.png) - 95% match
#    Recommendation: REUSE
# 2. ASSET-2025-045 (button-main.png) - 78% match
#    Recommendation: REUSE or CONSOLIDATE
#
# Suggested Action: Reuse ASSET-2025-001
```

### Usage Tracker Tool
```bash
# Track where asset is used
node tools/asset-intelligence/usage-tracker.ts --asset ASSET-2025-001

# Output:
# Asset: ASSET-2025-001 (button-primary.png)
# Projects Using: 12
# Total Uses: 47
# Last Used: 2025-12-24
# Impact: HIGH (used extensively, update carefully)
```

---

## Summary

**The Reuse Policy in One Page**:

1. **ALWAYS search registry first** (no exceptions)
2. **Evaluate matches** (use decision matrix)
3. **Reuse when possible** (score ≥ 60)
4. **Adapt when appropriate** (score 40-59)
5. **Justify when creating** (strong technical reason)
6. **Track everything** (metrics drive improvement)
7. **Review regularly** (quarterly audits)

**Success = High Reuse Rate + Low Asset Growth + Zero Orphans**

---

**Reuse Before Creation. Always.**

**Every asset created is a commitment. Every asset reused is a win.**
