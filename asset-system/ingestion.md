# Asset Ingestion Protocol

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Enforced By**: `tools/asset-validator/ingest-asset.ts`

---

## Purpose

Defines the mandatory process for bringing new assets into the workspace ecosystem.

**Prime Directive**: No asset is "done" until it passes all gates and is registered.

---

## Ingestion Pipeline

Every asset must flow through this pipeline:

```
Asset Creation/Import
    ↓
1. Pre-Validation
    ↓
2. Search Existing Registry (MANDATORY)
    ↓
3. Justify or Reuse Decision
    ↓
4. Format Validation
    ↓
5. Optimization
    ↓
6. Registration
    ↓
7. Integration
    ↓
8. Gate Validation
    ↓
✅ Asset Active
```

---

## Step 1: Pre-Validation

### Purpose
Quick sanity check before investing time in processing.

### Checks
```typescript
// Basic asset pre-validation
function preValidate(assetPath: string): ValidationResult {
  const checks = [
    fileExists(assetPath),
    isReadable(assetPath),
    hasValidExtension(assetPath),
    sizeWithinLimits(assetPath)
  ];

  return {
    passed: checks.every(c => c === true),
    violations: checks.filter(c => c === false)
  };
}
```

### Rules
- **File must exist** and be readable
- **Extension must be approved**:
  - Images: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`
  - Audio: `.mp3`, `.wav`, `.ogg`
  - Fonts: `.ttf`, `.woff`, `.woff2`
  - Data: `.json`, `.csv`
- **Size limits**:
  - Images: < 5MB (before optimization)
  - Audio: < 10MB
  - Fonts: < 2MB
  - Data: < 50MB

### Failure Response
- Output: REJECTED at pre-validation
- Action: Fix basic issues before proceeding
- Do not proceed to next steps

---

## Step 2: Search Existing Registry (MANDATORY)

### Purpose
Enforce "Reuse Before Creation" - the foundational principle of asset intelligence.

### Process
```typescript
// MANDATORY registry search
const assetRequest = {
  type: extractType(assetPath),
  format: extractFormat(assetPath),
  tags: inferTags(assetPath),
  description: getDescription(assetPath)
};

const registry = loadAssetRegistry();
const existingAssets = searchRegistry(registry, assetRequest);

if (existingAssets.length > 0) {
  presentReuseOptions(existingAssets);
  requireJustificationOrReuse();
}
```

### Search Strategy
1. **Exact match**: Same name, same type, same format
2. **Similar match**: Same type, similar tags, similar dimensions
3. **Semantic match**: Similar description or purpose
4. **Visual similarity** (for images): Perceptual hash comparison

### Reuse Decision Tree
```
Similar assets found?
    ↓
  YES → Present matches to user/AI
    ↓
    Choose:
    - Reuse existing (increment reuse_count)
    - Justify new creation
    ↓
  NO → Proceed to validation
```

### Justification Requirements
If creating new when similar exists:
- **Minimum 30 characters**
- **Valid reasons**:
  - Different dimensions/resolution needed
  - Different style/theme required
  - Existing has quality issues
  - Different project context
  - Performance optimization (smaller variant)
- **Invalid reasons**:
  - "Didn't look for existing"
  - "Easier to create new"
  - "Prefer my own version"
  - (No justification)

**Failure Response**: Rejected if justification weak, must reuse existing

---

## Step 3: Format Validation

### Purpose
Ensure asset meets technical specifications.

### Image Validation
```typescript
interface ImageValidation {
  format: 'png' | 'jpg' | 'jpeg' | 'svg' | 'webp';
  maxWidth: 4096;
  maxHeight: 4096;
  minWidth: 8;
  minHeight: 8;
  colorMode: 'RGB' | 'RGBA' | 'Grayscale';
  hasTransparency?: boolean;
}
```

**Checks**:
- Dimensions within limits
- No corrupted data
- Color mode appropriate for format
- DPI appropriate for use case

### Audio Validation
```typescript
interface AudioValidation {
  format: 'mp3' | 'wav' | 'ogg';
  sampleRate: 44100 | 48000;
  bitRate: number; // kbps
  channels: 1 | 2; // mono or stereo
  duration: number; // seconds
}
```

**Checks**:
- Sample rate is standard
- Bit rate appropriate for use
- No audio corruption
- Duration within expected range

### Font Validation
```typescript
interface FontValidation {
  format: 'ttf' | 'woff' | 'woff2';
  glyphs: number;
  hasBasicCharset: boolean;
  fileSize: number;
}
```

**Checks**:
- Contains basic Latin character set
- Glyphs are renderable
- No font corruption

### Data Validation
```typescript
interface DataValidation {
  format: 'json' | 'csv';
  isValidSyntax: boolean;
  schema?: any;
  recordCount?: number;
}
```

**Checks**:
- Valid JSON/CSV syntax
- Schema validation (if schema provided)
- Data integrity

**Failure Response**: If validation fails, reject with specific issues

---

## Step 4: Optimization

### Purpose
Minimize file size while maintaining quality.

### Image Optimization
```typescript
async function optimizeImage(imagePath: string): Promise<OptimizationResult> {
  const type = getImageType(imagePath);

  switch (type) {
    case 'png':
      return await optimizePNG(imagePath, {
        compressionLevel: 9,
        stripMetadata: true,
        quantize: false // preserve quality
      });

    case 'jpg':
    case 'jpeg':
      return await optimizeJPEG(imagePath, {
        quality: 85,
        progressive: true,
        stripMetadata: true
      });

    case 'svg':
      return await optimizeSVG(imagePath, {
        removeComments: true,
        removeMetadata: true,
        minifyStyles: true
      });

    case 'webp':
      return await optimizeWebP(imagePath, {
        quality: 85,
        method: 6
      });
  }
}
```

**Optimization Levels**:
- **None**: Keep as-is (rare)
- **Medium**: Lossless compression only
- **High**: Aggressive compression (default)

**Targets**:
- PNG: 50-70% size reduction
- JPEG: 30-50% size reduction
- SVG: 20-40% size reduction

### Audio Optimization
```typescript
async function optimizeAudio(audioPath: string): Promise<OptimizationResult> {
  const type = getAudioType(audioPath);

  // Convert to appropriate format based on use
  if (type === 'sfx') {
    return await convertToMP3(audioPath, {
      bitRate: 128, // kbps
      sampleRate: 44100,
      channels: 1 // mono for SFX
    });
  } else if (type === 'music') {
    return await convertToMP3(audioPath, {
      bitRate: 192, // higher quality for music
      sampleRate: 48000,
      channels: 2 // stereo for music
    });
  }
}
```

### Font Optimization
```typescript
async function optimizeFont(fontPath: string): Promise<OptimizationResult> {
  return await subsettingFont(fontPath, {
    subsets: ['latin', 'latin-ext'],
    removeHinting: false,
    formats: ['woff2', 'woff'] // modern formats
  });
}
```

**Targets**:
- Font size: 50-80% reduction via subsetting

### Spritesheet Consolidation

**When to create spritesheet**:
- Multiple small images (< 128x128)
- Same category/theme
- Used together in same context

```typescript
async function considerSpritesheet(images: string[]): Promise<boolean> {
  const smallImages = images.filter(img => {
    const dims = getDimensions(img);
    return dims.width <= 128 && dims.height <= 128;
  });

  if (smallImages.length >= 5) {
    // Suggest creating spritesheet
    return await createSpritesheet(smallImages, {
      padding: 2,
      powerOfTwo: true,
      maxSize: 2048
    });
  }

  return false;
}
```

**Optimization Report**:
```
Original Size: 245 KB
Optimized Size: 87 KB
Reduction: 64.5%
Method: PNG compression level 9 + metadata strip
Quality Loss: None (lossless)
```

---

## Step 5: Registration

### Purpose
Add asset to central registry for discoverability and reuse tracking.

### Generate Asset ID
```typescript
function generateAssetID(): string {
  const year = new Date().getFullYear();
  const lastID = getLastAssetID(year);
  const nextNum = (lastID?.number || 0) + 1;
  return `ASSET-${year}-${String(nextNum).padStart(3, '0')}`;
}

// Example: ASSET-2025-001, ASSET-2025-002, etc.
```

### Create Registry Entry
```typescript
interface AssetRegistryEntry {
  id: string;                    // ASSET-YYYY-NNN
  path: string;                  // Relative from workspace root
  type: AssetType;               // sprite, audio, font, data, etc.
  format: string;                // png, mp3, ttf, json, etc.
  size_kb: number;               // File size in kilobytes
  projects_used_in: string[];    // Project IDs
  reuse_count: number;           // Times reused (starts at 0)
  tags: string[];                // Searchable tags
  created: string;               // ISO date
  last_used: string;             // ISO date
  description: string;           // Human-readable

  // Type-specific fields
  dimensions?: string;           // For images (WxH)
  duration?: number;             // For audio (seconds)
  sample_rate?: number;          // For audio (Hz)
  alternatives?: string[];       // IDs of similar assets
  sprite_sheet?: string;         // Parent spritesheet ID
  optimization_level: 'none' | 'medium' | 'high';
  license?: string;
  attribution?: string;
}
```

### Tag Generation
```typescript
function generateTags(assetPath: string, type: AssetType): string[] {
  const tags: string[] = [];

  // Extract from filename
  const filename = path.basename(assetPath, path.extname(assetPath));
  tags.push(...filename.split(/[-_]/).filter(t => t.length > 2));

  // Add type tag
  tags.push(type);

  // Add format tag
  tags.push(path.extname(assetPath).slice(1));

  // Infer semantic tags
  if (type === 'sprite') {
    if (filename.includes('button')) tags.push('ui', 'interactive');
    if (filename.includes('icon')) tags.push('ui', 'icon');
    if (filename.includes('background')) tags.push('environment');
  }

  return [...new Set(tags)]; // Remove duplicates
}
```

### Update Registry
```typescript
async function registerAsset(entry: AssetRegistryEntry): Promise<void> {
  const registry = await loadAssetRegistry();

  // Add entry
  registry.entries.push(entry);

  // Update metrics
  registry.metrics.total_assets++;
  registry.metrics.last_updated = new Date().toISOString();

  // Save
  await saveAssetRegistry(registry);

  // Log
  logAssetRegistration(entry.id, entry.path);
}
```

---

## Step 6: Integration

### Purpose
Connect asset to project and ensure it's usable.

### Move to Correct Location
```typescript
function getAssetDestination(type: AssetType, format: string): string {
  const base = 'src/assets/';

  switch (type) {
    case 'sprite':
    case 'icon':
    case 'background':
    case 'texture':
      return `${base}sprites/`;

    case 'spritesheet':
      return `${base}spritesheets/`;

    case 'sfx':
    case 'music':
    case 'voice':
      return `${base}audio/`;

    case 'font':
      return `${base}fonts/`;

    case 'json':
    case 'csv':
    case 'config':
      return `${base}data/`;

    default:
      return `${base}misc/`;
  }
}
```

### Create Symbolic Reference
```typescript
// ❌ BAD - Direct file path
const sprite = 'src/assets/sprites/button-primary.png';

// ✅ GOOD - Registry reference
import { getAsset } from '@/asset-system/registry';
const sprite = getAsset('ASSET-2025-001');

// Or use asset manifest
import assets from '@/assets/manifest.json';
const sprite = assets['button-primary'];
```

### Generate Asset Manifest
```typescript
// Auto-generated manifest for easy imports
// File: src/assets/manifest.json
{
  "button-primary": {
    "id": "ASSET-2025-001",
    "path": "/assets/sprites/button-primary.png",
    "type": "sprite",
    "dimensions": "64x32"
  },
  "click-sound": {
    "id": "ASSET-2025-002",
    "path": "/assets/audio/click.mp3",
    "type": "sfx",
    "duration": 0.15
  }
}
```

### Update Project Dependencies
```typescript
// Add to project's asset usage tracking
interface ProjectAssetUsage {
  project_id: string;
  assets_used: string[]; // Asset IDs
  last_updated: string;
}

async function trackProjectUsage(
  projectId: string,
  assetId: string
): Promise<void> {
  const usage = await loadProjectAssetUsage(projectId);

  if (!usage.assets_used.includes(assetId)) {
    usage.assets_used.push(assetId);
    usage.last_updated = new Date().toISOString();
    await saveProjectAssetUsage(usage);
  }

  // Also update asset registry
  await incrementAssetUsage(assetId, projectId);
}
```

---

## Step 7: Gate Validation

### Purpose
Final check that asset passes all quality gates.

### Run Asset Gate
```bash
node tools/asset-validator/validate.ts --asset ASSET-2025-001
```

### Gate Checks (from asset-gate.md)
1. ✅ Asset located in `/src/assets/`
2. ✅ Asset registered in `ASSET_REGISTRY.md`
3. ✅ Reuse search was performed
4. ✅ Symbolic references only (no direct paths)
5. ✅ Format is optimized
6. ✅ Metadata is complete

### Failure Response
If gate fails:
- **Output**: REJECTED
- **Action**: Fix violations
- **Re-run**: Gate validation after fixes

---

## Step 8: Asset Active

### Confirmation
```
✅ ASSET INGESTION COMPLETE

Asset ID: ASSET-2025-001
Path: src/assets/sprites/button-primary.png
Type: sprite
Size: 12 KB (optimized from 35 KB)
Tags: button, ui, primary, pixel-art
Projects: pixelpets-reborn
Status: ACTIVE

Registry Updated: ✅
Asset Gate Passed: ✅
Ready for Use: ✅
```

### Post-Ingestion
- Asset is discoverable via registry search
- Asset is tracked for reuse metrics
- Asset is available via manifest imports
- Asset usage is logged per project

---

## Automated Ingestion Tool

### CLI Usage
```bash
# Ingest single asset
node tools/asset-validator/ingest-asset.ts --path path/to/asset.png

# Ingest multiple assets
node tools/asset-validator/ingest-asset.ts --batch path/to/assets/

# Skip optimization (use original)
node tools/asset-validator/ingest-asset.ts --path asset.png --no-optimize

# Force ingestion (skip reuse check - requires justification)
node tools/asset-validator/ingest-asset.ts --path asset.png --force --reason "Unique style required"
```

### Programmatic Usage
```typescript
import { ingestAsset } from '@/tools/asset-validator/ingest-asset';

const result = await ingestAsset({
  path: 'temp/new-sprite.png',
  skipReuseCheck: false,
  optimize: true,
  tags: ['character', 'player', 'idle'],
  description: 'Player character idle sprite'
});

if (result.success) {
  console.log(`Asset ingested: ${result.assetId}`);
} else {
  console.error(`Ingestion failed: ${result.errors.join(', ')}`);
}
```

---

## Exception Handling

### External Assets (from libraries/CDN)
```typescript
// External assets are NOT ingested into registry
// They are documented separately in external-assets.md

// Example: Font from Google Fonts
const fontLink = 'https://fonts.googleapis.com/css2?family=Roboto';

// Document in external-assets.md with justification:
// - Why external? (Google Fonts CDN faster than self-host)
// - Fallback strategy? (System font if CDN fails)
// - License? (Open Font License)
```

### Generated Assets (procedural/dynamic)
```typescript
// Assets generated at runtime are tracked differently
// Register in generated-assets.json with generation parameters

{
  "id": "GEN-001",
  "type": "procedural-texture",
  "generator": "perlin-noise",
  "parameters": {
    "seed": 12345,
    "octaves": 4,
    "scale": 0.1
  },
  "cacheable": true
}
```

---

## Integration with Reuse Gate

Ingestion protocol directly enforces Reuse Gate (gates/reuse-gate.md) Check 2:
- **Mandatory registry search** (Step 2)
- **Justification required** if similar exists (Step 3)
- **Metrics tracked** (reuse_count updated)

---

## Metrics Tracking

Track ingestion effectiveness:

```markdown
## Ingestion Metrics (Monthly)

- **Total Ingestions**: 15
- **Reuse Decisions**: 8 (53%)
- **New Creations**: 7 (47%)
- **Average Justification Quality**: 78%
- **Optimization Savings**: 2.3 MB (avg 64% reduction)
- **Failed Ingestions**: 2 (validation errors)
```

---

## Notes

- **Every asset** goes through this pipeline - no exceptions
- **Reuse check is mandatory** - cannot be skipped
- **Optimization is default** - can be disabled only with reason
- **Registration is automatic** - tool handles it
- **Gate validation is final** - must pass to be active

**Remember**: An unregistered asset is an invisible asset. Ingestion makes assets discoverable and reusable.

**Reuse Before Creation. Always.**
