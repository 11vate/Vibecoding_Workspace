# Asset Index

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Navigate asset system for asset creation, search, and reuse

---

## Purpose

**When to use**: Before creating, searching, or managing ANY asset

**CRITICAL**: ALWAYS search registry BEFORE creating assets (Asset Gate + Reuse Gate enforce this)

---

## Asset Registry (START HERE)

**File**: `asset-system/ASSET_REGISTRY.md`

**THIS IS YOUR FIRST STOP FOR ALL ASSET TASKS**

### What's In The Registry
- All workspace assets cataloged
- Asset metadata (type, format, size, tags)
- Reuse metrics (reuse_count, projects_used_in)
- Asset relationships (alternatives, sprite_sheets)
- Searchable by: type, tags, dimensions, project

### How To Use
```bash
# Search registry (MANDATORY before creating)
node tools/asset-intelligence/reuse-suggester.ts --tags "button,primary"

# Or read directly
Read: asset-system/ASSET_REGISTRY.md → Current Assets section
```

---

## Asset System Files

### 1. Asset Registry
**File**: `asset-system/ASSET_REGISTRY.md`
**Purpose**: Central catalog of all assets
**When**: EVERY asset task (search first!)

### 2. Ingestion Protocol
**File**: `asset-system/ingestion.md`
**Purpose**: How assets enter the system
**When**: Creating new assets
**Steps**: Pre-validate → Search → Justify → Validate → Optimize → Register → Integrate → Gate check

### 3. Validation Rules
**File**: `asset-system/validation.md`
**Purpose**: Asset quality standards
**When**: Asset creation or modification
**Levels**: Structural → Semantic → Integration

### 4. Reuse Policy
**File**: `asset-system/reuse-policy.md`
**Purpose**: "Reuse Before Creation" enforcement
**When**: Before creating any asset
**Rule**: Search first, reuse score ≥ 60

---

## Asset Categories

### Visual Assets

**Location**: `src/assets/sprites/`

**Types**:
- **sprite** - Individual sprites
- **spritesheet** - Combined sprite sheets
- **icon** - UI icons
- **background** - Background images
- **texture** - Textures for effects

**Formats**: PNG, JPG, SVG, WebP

**Registry Section**: `ASSET_REGISTRY.md` → Sprites

### Audio Assets

**Location**: `src/assets/audio/`

**Types**:
- **sfx** - Sound effects
- **music** - Background music
- **voice** - Voice samples

**Formats**: MP3, WAV, OGG

**Registry Section**: `ASSET_REGISTRY.md` → Audio

### Font Assets

**Location**: `src/assets/fonts/`

**Types**:
- **font** - Font files

**Formats**: TTF, WOFF, WOFF2

**Registry Section**: `ASSET_REGISTRY.md` → Fonts

### Data Assets

**Location**: `src/assets/data/`

**Types**:
- **json** - JSON data files
- **csv** - CSV data files
- **config** - Configuration files

**Formats**: JSON, CSV

**Registry Section**: `ASSET_REGISTRY.md` → Data Files

---

## Asset Workflow

### Creating New Asset

**MANDATORY FLOW**:
```
1. SEARCH REGISTRY (ALWAYS FIRST)
   ↓
2. Evaluate Matches
   ├─ Score ≥ 60? → REUSE existing
   ├─ Score 40-59? → ADAPT existing
   └─ Score < 40? → CREATE NEW (justify)
   ↓
3. If Creating:
   ├─ Follow ingestion protocol
   ├─ Validate format/quality
   ├─ Optimize
   ├─ Register
   └─ Pass Asset Gate
```

**Tools**:
```bash
# Search before creating (MANDATORY)
node tools/asset-intelligence/reuse-suggester.ts --query "primary button sprite"

# Ingest new asset
node tools/asset-validator/ingest-asset.ts --path new-sprite.png

# Validate asset
node tools/asset-validator/validate.ts --asset ASSET-2025-001
```

### Reusing Existing Asset

**PREFERRED FLOW**:
```
1. Search Registry
   ↓
2. Find Match (score ≥ 60)
   ↓
3. Import Asset
   ├─ via manifest: `import assets from '@/assets/manifest.json'`
   ├─ via registry: `getAsset('ASSET-2025-001')`
   └─ Increment reuse_count (automatic)
```

**Benefits**:
- Zero creation time
- Proven quality
- Visual/audio consistency
- Smaller bundle size

---

## Asset Search Strategies

### By Type
```bash
node tools/asset-intelligence/reuse-suggester.ts --type sprite
```
**Registry**: Search `ASSET_REGISTRY.md` → type: "sprite"

### By Tags
```bash
node tools/asset-intelligence/reuse-suggester.ts --tags "button,primary,ui"
```
**Registry**: Search `ASSET_REGISTRY.md` → tags array

### By Dimensions (Images)
```bash
node tools/asset-intelligence/reuse-suggester.ts --dimensions "64x32"
```
**Registry**: Search `ASSET_REGISTRY.md` → dimensions field

### By Project
```bash
node tools/asset-intelligence/reuse-suggester.ts --project pixelpets-reborn
```
**Registry**: Search `ASSET_REGISTRY.md` → projects_used_in array

### Semantic Search
```bash
node tools/asset-intelligence/reuse-suggester.ts --description "primary action button"
```
**Registry**: Search `ASSET_REGISTRY.md` → description field

---

## Asset Tools

**Directory**: `tools/asset-intelligence/` and `tools/asset-validator/`

### Reuse Suggester
**Path**: `tools/asset-intelligence/reuse-suggester.ts`
**Purpose**: Find reusable assets before creating
**Usage**: `node reuse-suggester.ts --tags "button,primary"`

### Usage Tracker
**Path**: `tools/asset-intelligence/usage-tracker.ts`
**Purpose**: Track where assets are used
**Usage**: `node usage-tracker.ts --asset ASSET-2025-001`

### Asset Validator
**Path**: `tools/asset-validator/validate.ts`
**Purpose**: Validate asset compliance
**Usage**: `node validate.ts --asset ASSET-2025-001`

### Asset Ingestor
**Path**: `tools/asset-validator/ingest-asset.ts`
**Purpose**: Ingest new assets into system
**Usage**: `node ingest-asset.ts --path new-asset.png`

### Asset Registrar
**Path**: `tools/asset-validator/register-asset.ts`
**Purpose**: Register assets in registry
**Usage**: `node register-asset.ts --path src/assets/sprites/new.png`

---

## Asset Naming Conventions

**Format**: kebab-case (lowercase, hyphens only)

**Examples**:
- ✅ `button-primary.png`
- ✅ `click-sound-01.mp3`
- ✅ `player-idle-sprite.png`
- ❌ `Button_Primary.png` (not kebab-case)
- ❌ `btn.png` (not descriptive)
- ❌ `button@primary.png` (special characters)

**Rules**:
- Descriptive (≥ 3 characters)
- No special characters
- Reasonable length (≤ 50 characters)

---

## Asset Optimization

**Automatic During Ingestion**:

**Images**:
- PNG: Lossless compression, strip metadata
- JPEG: Quality 85, progressive, strip metadata
- SVG: Minify, remove comments
- Target: 50-70% size reduction

**Audio**:
- SFX: 128 kbps, mono
- Music: 192 kbps, stereo
- Sample rate: 44100 or 48000 Hz

**Fonts**:
- Subsetting (Latin charset)
- WOFF2 conversion
- Target: 50-80% size reduction

**Tool**: Optimization runs during `ingest-asset.ts`

---

## Asset Gate Compliance

**File**: `gates/asset-gate.md`

**Checks**:
1. ✅ Asset in `src/assets/` directory
2. ✅ Asset registered in `ASSET_REGISTRY.md`
3. ✅ Reuse search performed
4. ✅ Symbolic references only (no direct paths)
5. ✅ Asset optimized

**Validation**:
```bash
node tools/asset-validator/validate.ts --asset ASSET-2025-001
```

**Failure**: Asset rejected, cannot be used until compliant

---

## Reuse Metrics

**Tracked In**: `ASSET_REGISTRY.md` → Reuse Statistics

**Key Metrics**:
- **Total Assets**: Asset count
- **Average Reuse Count**: Times each asset reused
- **Most Reused Asset**: Asset ID with highest reuse_count
- **Reuse Rate**: % of asset requests that reuse existing
- **Asset Proliferation**: New assets per month

**Target**:
- Reuse Rate: > 60%
- Avg Reuse Count: > 3.0
- Orphaned Assets: 0
- Asset Growth: < 15/month

---

## Quick Reference: Task → Files

### "Need an asset"
1. **SEARCH**: `asset-system/ASSET_REGISTRY.md`
2. **Tool**: `reuse-suggester.ts --query "[description]"`
3. **Decision**: Reuse (≥60) or Create (<60 with justification)

### "Create new asset"
1. **Search First**: Registry (MANDATORY)
2. **Follow**: `asset-system/ingestion.md`
3. **Tool**: `ingest-asset.ts --path [file]`
4. **Validate**: Asset Gate

### "Validate asset"
1. **Load**: `asset-system/validation.md`
2. **Tool**: `validate.ts --asset [ID]`
3. **Fix**: Auto-fix or manual fixes
4. **Re-validate**: Until passing

### "Track asset usage"
1. **Tool**: `usage-tracker.ts --asset [ID]`
2. **Registry**: Check `projects_used_in` and `reuse_count`

---

## Related Indexes

- **[[MASTER_INDEX.md]]** - Top-level navigation
- **[[TOOL_INDEX.md]]** - Asset tools
- **[[PROTOCOL_INDEX.md]]** - Asset protocols

---

## Gates Required

1. **Asset Gate** - Asset compliance
2. **Reuse Gate** - Search before create
3. **Quality Gate** - Optimization, validation

---

## Notes

- **Registry search is MANDATORY** - no exceptions
- **Reuse saves 38-62 minutes per asset** - proven ROI
- **Every asset created is a commitment** - maintenance burden
- **Symbolic references only** - no direct file paths
- **Asset Gate enforces compliance** - locks not warnings

**The registry is your asset map. Use it.**

**Search first. Reuse when possible. Create with justification.**
