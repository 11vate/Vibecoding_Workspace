# Asset Gate

**Authority Tier**: 2 (Mandatory Process)
**Gate Type**: Hard Lock
**Applies To**: All assets (images, audio, sprites, fonts, data files)
**Validation Tool**: `tools/asset-validator/validate.ts`

---

## Purpose

Enforce systematic asset management and prevent the "generate every time" anti-pattern.

**Prime Directive**: **Reuse Before Creation**

**Philosophy**: AI models default to novelty. This gate defaults to reuse. Growing library beats chaotic regeneration.

---

## Gate Checks

This gate **MUST** pass before any asset is created or referenced.

### Check 1: Asset Registry Search (MANDATORY)

**Rule**: AI MUST search `ASSET_REGISTRY.md` before requesting/creating any asset.

**Rationale**: If a similar asset exists, reuse it. If not, track the new one.

**Validation**:
```typescript
// Before asset creation
const searchQuery = extractAssetQuery(request);
const registry = loadAssetRegistry();
const existingAssets = searchRegistry(registry, searchQuery);

if (existingAssets.length > 0) {
  // Similar assets exist
  require_justification_or_reuse(existingAssets);
}
```

**Failure Response**:
- Output: REJECTED
- Action: Search registry first
- Provide: List of similar existing assets
- Require: Justification if still creating new

**Example Violation**:
```
User: "Create a pixel art button for the fusion screen"
AI: [Generates new button.png without checking registry]
```

**Example Pass**:
```
User: "Create a pixel art button for the fusion screen"
AI:
1. Searching ASSET_REGISTRY.md...
2. Found: button-primary.png, button-secondary.png, button-fusion.png
3. Recommendation: Reuse button-primary.png (used in 3 projects, 92% satisfaction)
4. Alternative: Create new if fusion button needs unique styling
5. If creating: Will register as button-fusion-special.png
```

---

### Check 2: Registry Compliance

**Rule**: All assets must be registered in `ASSET_REGISTRY.md` with complete metadata.

**Rationale**: Unregistered assets = invisible to reuse system = chaos.

**Validation**:
```typescript
// After asset creation, before integration
const assetPath = getAssetPath(asset);
const registry = loadAssetRegistry();
const isRegistered = registry.assets.some(a => a.path === assetPath);

if (!isRegistered) {
  fail(`Asset "${assetPath}" not registered in ASSET_REGISTRY.md`);
}

// Check metadata completeness
const entry = registry.assets.find(a => a.path === assetPath);
const requiredFields = ['id', 'path', 'type', 'projects_used_in', 'reuse_count', 'tags'];

const missingFields = requiredFields.filter(field => !entry[field]);
if (missingFields.length > 0) {
  fail(`Asset registry entry missing fields: ${missingFields.join(', ')}`);
}
```

**Registry Entry Schema**:
```json
{
  "id": "ASSET-2025-001",
  "path": "src/assets/sprites/button-primary.png",
  "type": "sprite",
  "format": "png",
  "size_kb": 12,
  "dimensions": "64x32",
  "projects_used_in": ["pixelpets-reborn", "project-x"],
  "reuse_count": 5,
  "tags": ["button", "ui", "primary", "pixel-art"],
  "created": "2025-01-15",
  "last_used": "2025-12-24",
  "description": "Primary button style, pixel art, 64x32",
  "alternatives": ["ASSET-2025-002", "ASSET-2025-003"]
}
```

**Failure Response**:
- Output: REJECTED
- Action: Register asset with complete metadata
- Tool: `tools/asset-validator/register-asset.ts`

---

### Check 3: Symbolic References Only

**Rule**: NO direct file paths. All asset references must be symbolic.

**Rationale**: Direct paths break when assets move. Symbolic refs = future-proof.

**Validation**:
```typescript
// Scan code for asset references
const assetRefs = findAssetReferences(code);

const directPathRefs = assetRefs.filter(ref =>
  ref.type === 'string-literal' &&
  (ref.value.includes('/assets/') || ref.value.includes('\\assets\\'))
);

if (directPathRefs.length > 0) {
  fail(`Found ${directPathRefs.length} direct asset paths. Use symbolic references.`);
}
```

**Example Violation**:
```typescript
// ❌ FAIL - Direct path
import buttonImage from '../assets/sprites/button-primary.png';

// ❌ FAIL - String literal path
const sprite = loadSprite('src/assets/sprites/button-primary.png');
```

**Example Pass**:
```typescript
// ✅ PASS - Symbolic reference via registry
import { Sprites } from '@/assets';
const sprite = Sprites.ButtonPrimary;

// Or via asset registry
import { Assets } from '@/assets/registry';
const sprite = Assets.getSprite('button-primary');
```

---

### Check 4: Asset Location Compliance

**Rule**: All assets MUST be in `/src/assets/` or subdirectories.

**Rationale**: Centralized asset location. No assets scattered across codebase.

**Validation**:
```typescript
const assetPath = getAssetPath(asset);

if (!assetPath.startsWith('src/assets/')) {
  fail(`Asset "${assetPath}" not in /src/assets/ directory`);
}

// Check proper subdirectory
const assetType = getAssetType(asset);
const expectedSubdir = getExpectedSubdirectory(assetType);

if (!assetPath.includes(expectedSubdir)) {
  warn(`Asset type "${assetType}" typically belongs in /src/assets/${expectedSubdir}`);
}
```

**Expected Structure**:
```
src/assets/
├── sprites/          # Sprite images
├── spritesheets/     # Combined spritesheets
├── audio/            # Sound effects, music
├── fonts/            # Font files
├── data/             # JSON/CSV data files
└── index.ts          # Asset registry export
```

**Failure Response**:
- Output: REJECTED
- Action: Move asset to `/src/assets/[type]/`
- Update: All references after move

---

### Check 5: Reuse Justification (If Creating Duplicate)

**Rule**: If creating asset similar to existing, must provide justification.

**Rationale**: Prevent asset proliferation. Similar ≠ reusable is a code smell.

**Validation**:
```typescript
// After registry search finds similar assets
const similarAssets = searchRegistry(registry, searchQuery);

if (similarAssets.length > 0 && request.isCreatingNew) {
  const justification = request.justification;

  if (!justification || justification.length < 20) {
    fail('Must justify creating new asset when similar exists');
  }

  // Valid justifications:
  // - "Existing buttons are 64px, need 32px version"
  // - "Different art style for new game area"
  // - "Performance optimization (spritesheet vs individual)"

  const validJustifications = [
    'different-size',
    'different-style',
    'performance',
    'different-format',
    'project-specific'
  ];

  if (!matchesAnyJustification(justification, validJustifications)) {
    warn('Justification may be weak. Consider reusing existing asset.');
  }
}
```

**Good Justifications**:
- Different dimensions required (32px vs 64px)
- Different art style (pixel art vs vector)
- Performance (individual vs spritesheet)
- Format requirement (PNG vs SVG)
- Project-specific branding

**Bad Justifications**:
- "I want a fresh one"
- "Easier to generate than adapt"
- "Not sure if existing works"
- (No justification)

---

## Validation Execution

### Automated Validation

```bash
# Run asset gate validator
npm run gate:asset

# Or manually
node tools/asset-validator/validate.ts --gate

# Expected output:
# ✅ PASS: All assets registered
# ✅ PASS: No direct path references
# ✅ PASS: All assets in /src/assets/
# ✅ PASS: Reuse checks completed
#
# GATE STATUS: PASSED
```

### Manual Validation

1. Check `ASSET_REGISTRY.md` for new entries
2. Verify asset metadata is complete
3. Check code for symbolic references
4. Confirm assets are in `/src/assets/`
5. Review justifications for new assets

---

## Asset Lifecycle Integration

This gate enforces the full asset lifecycle:

```
1. Asset Request
    ↓
2. [GATE CHECK] Search ASSET_REGISTRY.md
    ↓
    ├─ Exists? → Reuse + increment counter → PASS
    │
    └─ Not exists? → Continue ↓

3. Create Asset
    ↓
4. [GATE CHECK] Validate format/size
    ↓
5. Optimize (compress, spritesheet)
    ↓
6. [GATE CHECK] Register in ASSET_REGISTRY.md
    ↓
7. [GATE CHECK] Place in /src/assets/[type]/
    ↓
8. [GATE CHECK] Use symbolic reference
    ↓
9. GATE PASSED
```

---

## Failure Handling

### If Gate Fails:

1. **Immediate Stop** - Do not integrate asset
2. **Generate Report** - Show specific violations
3. **Log Failure** - Record in `/evolution/GATE_FAILURES_LOG.md`
4. **Fix Violations** - Follow lifecycle, register, use symbolic refs
5. **Revalidate** - Re-run gate check

### Example Failure Report:

```
❌ ASSET GATE: FAILED

Violations:
1. Registry Search: No search performed
   - Fix: Search ASSET_REGISTRY.md for similar assets

2. Direct Path Reference: 3 violations found
   - src/components/Button.tsx line 12: Direct import path
   - src/systems/FusionSystem.ts line 45: String literal path
   - Fix: Use symbolic references from asset registry

3. Unregistered Asset: button-new.png
   - Asset exists but not in ASSET_REGISTRY.md
   - Fix: Register with complete metadata

Gate Status: FAILED
Next Step: Fix violations and re-run gate check
```

---

## Reuse Metrics

Track asset reuse to measure gate effectiveness:

**Metrics** (in `/evolution/EVOLUTION_METRICS.md`):
- **Reuse Rate**: `(assets_reused / total_asset_requests) * 100%`
- **Target**: > 60% reuse rate
- **Registry Size**: Number of assets in registry
- **Average Reuse Count**: How often each asset is reused
- **Asset Proliferation**: Growth rate of unique assets

**Review**:
```
Q4 2025 Metrics:
- Reuse Rate: 72% (up from 15% pre-gate)
- Registry Size: 245 assets
- Average Reuse: 3.4 projects per asset
- Asset Proliferation: +8 assets/month (down from +45)
```

---

## Integration Points

**Enforced By**:
- Blueprint validation (asset references)
- Code review (before commit)
- Asset creation workflow (automated)

**Tools**:
- `tools/asset-validator/validate.ts` (primary gate validator)
- `tools/asset-validator/register-asset.ts` (registration helper)
- `tools/asset-intelligence/reuse-suggester.ts` (reuse recommendations)
- `tools/asset-intelligence/usage-tracker.ts` (track reuse metrics)

**Logs**:
- Failures: `/evolution/GATE_FAILURES_LOG.md`
- Registry: `/asset-system/ASSET_REGISTRY.md`
- Metrics: `/evolution/EVOLUTION_METRICS.md`

**References**:
- Asset system: `/asset-system/` (ingestion, validation, reuse-policy)
- Asset intelligence: `docs/asset-intelligence/`
- Symbolic references: `docs/code-patterns/asset-patterns.md`

---

## Exemptions

This gate has **NO exemptions** for the prime directive (reuse before creation).

Temporary exemptions possible for:
- Asset format (with justification)
- Asset location (migration in progress)

All exemptions must be logged in `/evolution/ARBITRATION_LOG.md`.

---

## Success Metrics

**Good Asset Hygiene**:
- ✅ 100% of assets registered
- ✅ 100% symbolic references
- ✅ > 60% reuse rate
- ✅ Assets centralized in `/src/assets/`
- ✅ Complete metadata for all assets

**Review**: Weekly during active development

---

**Remember**: Every generated asset is a potential orphan. Every reused asset is validated value.

**Prime Directive: Reuse Before Creation**

**Gates are locks, not warnings.**
