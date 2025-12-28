# Asset Validation Rules

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Enforced By**: `tools/asset-validator/validate.ts`

---

## Purpose

Defines comprehensive validation rules for all workspace assets to ensure quality, compliance, and maintainability.

**Philosophy**: Invalid assets create technical debt. Validate early, reject immediately.

---

## Validation Levels

Assets must pass **all three levels** of validation:

### Level 1: Structural Validation
Basic file integrity and format compliance.

### Level 2: Semantic Validation
Correctness of content and metadata.

### Level 3: Integration Validation
Compliance with workspace standards and gates.

---

## Level 1: Structural Validation

### File System Checks

```typescript
interface FileSystemValidation {
  exists: boolean;
  readable: boolean;
  writable: boolean;
  validPath: boolean;
  correctLocation: boolean;
}

function validateFileSystem(assetPath: string): FileSystemValidation {
  return {
    exists: fs.existsSync(assetPath),
    readable: fs.accessSync(assetPath, fs.constants.R_OK),
    writable: fs.accessSync(assetPath, fs.constants.W_OK),
    validPath: isValidAssetPath(assetPath),
    correctLocation: isInAssetsDirectory(assetPath)
  };
}

function isValidAssetPath(path: string): boolean {
  // Must be in src/assets/
  // Must have valid extension
  // Must not contain special characters
  // Must follow naming conventions
  return /^src\/assets\/[\w\-\/]+\.\w+$/.test(path);
}
```

**Rules**:
- ✅ File must exist
- ✅ File must be readable
- ✅ File must be writable (for optimization)
- ✅ Path must be valid (no special chars, proper structure)
- ✅ Must be in `src/assets/` directory

**Failure Response**: REJECT with specific file system issue

---

### Format-Specific Structural Validation

#### Image Files (PNG, JPG, SVG, WebP)

```typescript
interface ImageStructuralValidation {
  isValidImage: boolean;
  notCorrupted: boolean;
  hasDimensions: boolean;
  hasColorData: boolean;
  format: string;
}

async function validateImageStructure(imagePath: string): Promise<ImageStructuralValidation> {
  try {
    const image = await loadImage(imagePath);

    return {
      isValidImage: image !== null,
      notCorrupted: !hasCorruptedData(image),
      hasDimensions: image.width > 0 && image.height > 0,
      hasColorData: hasValidColorData(image),
      format: getImageFormat(imagePath)
    };
  } catch (error) {
    return {
      isValidImage: false,
      notCorrupted: false,
      hasDimensions: false,
      hasColorData: false,
      format: 'unknown'
    };
  }
}
```

**Rules**:
- ✅ Image can be loaded by image library
- ✅ No corrupted data blocks
- ✅ Valid dimensions (> 0)
- ✅ Has color data
- ✅ Format matches file extension

**Specific Format Rules**:

**PNG**:
- Must have valid PNG signature
- Must have IHDR chunk
- Must have IDAT chunk
- Color type must be valid (0, 2, 3, 4, 6)

**JPEG**:
- Must have valid JPEG markers (SOI, EOI)
- Must have valid Huffman tables
- No truncated data

**SVG**:
- Must be valid XML
- Must have `<svg>` root element
- Must have valid viewBox or width/height

**WebP**:
- Must have valid RIFF container
- Must have valid WebP header

#### Audio Files (MP3, WAV, OGG)

```typescript
interface AudioStructuralValidation {
  isValidAudio: boolean;
  notCorrupted: boolean;
  hasDuration: boolean;
  hasSampleRate: boolean;
  format: string;
}

async function validateAudioStructure(audioPath: string): Promise<AudioStructuralValidation> {
  try {
    const audio = await loadAudio(audioPath);

    return {
      isValidAudio: audio !== null,
      notCorrupted: !hasCorruptedFrames(audio),
      hasDuration: audio.duration > 0,
      hasSampleRate: audio.sampleRate > 0,
      format: getAudioFormat(audioPath)
    };
  } catch (error) {
    return {
      isValidAudio: false,
      notCorrupted: false,
      hasDuration: false,
      hasSampleRate: false,
      format: 'unknown'
    };
  }
}
```

**Rules**:
- ✅ Audio can be loaded by audio library
- ✅ No corrupted frames
- ✅ Valid duration (> 0)
- ✅ Valid sample rate
- ✅ Format matches file extension

**Specific Format Rules**:

**MP3**:
- Must have valid ID3 tags (optional but recommended)
- Must have valid frame headers
- Bit rate must be standard (128, 192, 256, 320 kbps)

**WAV**:
- Must have valid RIFF header
- Must have fmt chunk
- Must have data chunk
- Sample rate must be standard (44100, 48000 Hz)

**OGG**:
- Must have valid Ogg container
- Must have valid Vorbis headers

#### Font Files (TTF, WOFF, WOFF2)

```typescript
interface FontStructuralValidation {
  isValidFont: boolean;
  notCorrupted: boolean;
  hasGlyphs: boolean;
  hasMetrics: boolean;
  format: string;
}

async function validateFontStructure(fontPath: string): Promise<FontStructuralValidation> {
  try {
    const font = await loadFont(fontPath);

    return {
      isValidFont: font !== null,
      notCorrupted: !hasCorruptedTables(font),
      hasGlyphs: font.glyphs.length > 0,
      hasMetrics: font.metrics !== null,
      format: getFontFormat(fontPath)
    };
  } catch (error) {
    return {
      isValidFont: false,
      notCorrupted: false,
      hasGlyphs: false,
      hasMetrics: false,
      format: 'unknown'
    };
  }
}
```

**Rules**:
- ✅ Font can be loaded by font library
- ✅ No corrupted tables
- ✅ Has glyphs (> 0)
- ✅ Has font metrics (ascent, descent, etc.)
- ✅ Format matches file extension

#### Data Files (JSON, CSV)

```typescript
interface DataStructuralValidation {
  isValidSyntax: boolean;
  isParseable: boolean;
  notEmpty: boolean;
  format: string;
}

async function validateDataStructure(dataPath: string): Promise<DataStructuralValidation> {
  try {
    const content = await fs.readFile(dataPath, 'utf-8');
    const format = getDataFormat(dataPath);

    if (format === 'json') {
      const parsed = JSON.parse(content);
      return {
        isValidSyntax: true,
        isParseable: true,
        notEmpty: Object.keys(parsed).length > 0,
        format: 'json'
      };
    } else if (format === 'csv') {
      const parsed = parseCSV(content);
      return {
        isValidSyntax: true,
        isParseable: true,
        notEmpty: parsed.length > 0,
        format: 'csv'
      };
    }
  } catch (error) {
    return {
      isValidSyntax: false,
      isParseable: false,
      notEmpty: false,
      format: getDataFormat(dataPath)
    };
  }
}
```

**Rules**:
- ✅ Valid syntax (JSON/CSV)
- ✅ Can be parsed
- ✅ Not empty
- ✅ Format matches file extension

---

## Level 2: Semantic Validation

### Content Quality Checks

#### Image Content Validation

```typescript
interface ImageSemanticValidation {
  dimensionsValid: boolean;
  sizeAppropriate: boolean;
  colorModeCorrect: boolean;
  hasTransparency: boolean;
  resolutionSufficient: boolean;
}

function validateImageContent(image: Image): ImageSemanticValidation {
  return {
    dimensionsValid: validateDimensions(image),
    sizeAppropriate: validateFileSize(image),
    colorModeCorrect: validateColorMode(image),
    hasTransparency: image.hasAlpha,
    resolutionSufficient: validateResolution(image)
  };
}

function validateDimensions(image: Image): boolean {
  const { width, height } = image;

  // Minimum dimensions
  if (width < 8 || height < 8) return false;

  // Maximum dimensions
  if (width > 4096 || height > 4096) return false;

  // Warn if not power of 2 (for texture atlases)
  if (image.type === 'texture' && !isPowerOfTwo(width, height)) {
    warn('Texture dimensions should be power of 2 for optimal performance');
  }

  return true;
}

function validateFileSize(image: Image): boolean {
  const sizeKB = image.sizeBytes / 1024;

  // Max sizes by type
  const maxSizes = {
    'sprite': 500,      // 500 KB
    'icon': 50,         // 50 KB
    'background': 2000, // 2 MB
    'texture': 1000     // 1 MB
  };

  return sizeKB <= (maxSizes[image.type] || 5000);
}

function validateColorMode(image: Image): boolean {
  const { colorMode, format, type } = image;

  // PNG should use RGBA for transparency
  if (format === 'png' && type === 'sprite') {
    return colorMode === 'RGBA';
  }

  // JPEG doesn't support transparency
  if (format === 'jpg' || format === 'jpeg') {
    return colorMode === 'RGB';
  }

  return true;
}

function validateResolution(image: Image): boolean {
  const { width, height, type } = image;

  // Icon minimum resolution
  if (type === 'icon') {
    return width >= 16 && height >= 16;
  }

  // Sprite minimum resolution
  if (type === 'sprite') {
    return width >= 32 && height >= 32;
  }

  return true;
}
```

**Rules**:
- ✅ Dimensions: 8px - 4096px
- ✅ File size within type limits
- ✅ Color mode appropriate for format
- ✅ Transparency used correctly
- ✅ Resolution sufficient for type

#### Audio Content Validation

```typescript
interface AudioSemanticValidation {
  durationValid: boolean;
  sampleRateStandard: boolean;
  bitRateAppropriate: boolean;
  channelsCorrect: boolean;
  volumeNormalized: boolean;
}

function validateAudioContent(audio: Audio): AudioSemanticValidation {
  return {
    durationValid: validateDuration(audio),
    sampleRateStandard: validateSampleRate(audio),
    bitRateAppropriate: validateBitRate(audio),
    channelsCorrect: validateChannels(audio),
    volumeNormalized: validateVolume(audio)
  };
}

function validateDuration(audio: Audio): boolean {
  const { duration, type } = audio;

  // Max durations by type
  const maxDurations = {
    'sfx': 5,      // 5 seconds
    'voice': 30,   // 30 seconds
    'music': 300   // 5 minutes
  };

  return duration > 0 && duration <= (maxDurations[type] || 600);
}

function validateSampleRate(audio: Audio): boolean {
  const standardRates = [44100, 48000];
  return standardRates.includes(audio.sampleRate);
}

function validateBitRate(audio: Audio): boolean {
  const { bitRate, type } = audio;

  // Minimum bit rates by type
  const minBitRates = {
    'sfx': 96,    // 96 kbps
    'voice': 128, // 128 kbps
    'music': 192  // 192 kbps
  };

  return bitRate >= (minBitRates[type] || 96);
}

function validateChannels(audio: Audio): boolean {
  const { channels, type } = audio;

  // SFX should be mono to save space
  if (type === 'sfx') return channels === 1;

  // Music should be stereo
  if (type === 'music') return channels === 2;

  return channels === 1 || channels === 2;
}

function validateVolume(audio: Audio): boolean {
  const peak = audio.peakAmplitude;

  // Peak should be between -1.0 and -0.1 (normalized but not clipping)
  return peak >= -1.0 && peak <= -0.1;
}
```

**Rules**:
- ✅ Duration within type limits
- ✅ Sample rate is standard (44100 or 48000 Hz)
- ✅ Bit rate appropriate for type
- ✅ Channels correct (mono for SFX, stereo for music)
- ✅ Volume normalized (no clipping)

#### Font Content Validation

```typescript
interface FontSemanticValidation {
  hasBasicCharset: boolean;
  glyphCountSufficient: boolean;
  metricsConsistent: boolean;
  kerningPresent: boolean;
}

function validateFontContent(font: Font): FontSemanticValidation {
  return {
    hasBasicCharset: validateCharset(font),
    glyphCountSufficient: font.glyphs.length >= 128,
    metricsConsistent: validateMetrics(font),
    kerningPresent: font.kerningPairs.length > 0
  };
}

function validateCharset(font: Font): boolean {
  // Basic Latin charset (ASCII 32-126)
  const basicChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  for (const char of basicChars) {
    if (!font.hasGlyph(char)) return false;
  }

  return true;
}

function validateMetrics(font: Font): boolean {
  const { ascent, descent, lineGap } = font.metrics;

  // Metrics should be positive
  if (ascent <= 0 || descent <= 0) return false;

  // Ascent should be larger than descent
  if (ascent <= descent) return false;

  return true;
}
```

**Rules**:
- ✅ Contains basic Latin charset
- ✅ At least 128 glyphs
- ✅ Font metrics are consistent
- ✅ Kerning pairs present (optional but recommended)

#### Data Content Validation

```typescript
interface DataSemanticValidation {
  schemaValid: boolean;
  dataIntegrity: boolean;
  noMissingValues: boolean;
  typesCorrect: boolean;
}

function validateDataContent(data: any, schema?: Schema): DataSemanticValidation {
  return {
    schemaValid: schema ? validateSchema(data, schema) : true,
    dataIntegrity: validateIntegrity(data),
    noMissingValues: checkMissingValues(data),
    typesCorrect: validateTypes(data)
  };
}

function validateSchema(data: any, schema: Schema): boolean {
  // Use JSON schema validation
  const validator = new SchemaValidator();
  return validator.validate(data, schema).valid;
}

function validateIntegrity(data: any): boolean {
  // Check for common integrity issues
  if (Array.isArray(data)) {
    return data.every(item => item !== null && item !== undefined);
  }

  if (typeof data === 'object') {
    return Object.values(data).every(value => value !== null);
  }

  return true;
}
```

**Rules**:
- ✅ Matches schema (if provided)
- ✅ Data integrity (no null/undefined in arrays)
- ✅ No missing required values
- ✅ Types are correct

---

## Level 3: Integration Validation

### Workspace Compliance Checks

#### Asset Gate Compliance

```typescript
interface AssetGateValidation {
  inCorrectDirectory: boolean;
  registeredInRegistry: boolean;
  hasSymbolicReference: boolean;
  reuseSearchPerformed: boolean;
  optimizationApplied: boolean;
}

function validateAssetGate(asset: Asset): AssetGateValidation {
  return {
    inCorrectDirectory: asset.path.startsWith('src/assets/'),
    registeredInRegistry: isRegistered(asset.id),
    hasSymbolicReference: !hasDirectPaths(asset),
    reuseSearchPerformed: hasReuseSearchLog(asset.id),
    optimizationApplied: asset.optimizationLevel !== 'none'
  };
}
```

**Checks** (from gates/asset-gate.md):
1. ✅ Asset in `src/assets/` directory
2. ✅ Asset registered in ASSET_REGISTRY.md
3. ✅ Reuse search performed before creation
4. ✅ No direct file paths (symbolic references only)
5. ✅ Asset is optimized

#### Naming Convention Compliance

```typescript
interface NamingConventionValidation {
  followsKebabCase: boolean;
  descriptiveName: boolean;
  noSpecialChars: boolean;
  appropriateLength: boolean;
}

function validateNamingConvention(filename: string): NamingConventionValidation {
  return {
    followsKebabCase: /^[a-z0-9-]+$/.test(filename),
    descriptiveName: filename.length >= 3,
    noSpecialChars: !/[^a-z0-9-]/.test(filename),
    appropriateLength: filename.length <= 50
  };
}
```

**Rules**:
- ✅ kebab-case naming (lowercase, hyphens)
- ✅ Descriptive (≥ 3 characters)
- ✅ No special characters
- ✅ Reasonable length (≤ 50 characters)

**Examples**:
- ✅ `button-primary.png`
- ✅ `click-sound-01.mp3`
- ✅ `player-idle-sprite.png`
- ❌ `Button_Primary.png` (not kebab-case)
- ❌ `btn.png` (not descriptive enough)
- ❌ `button@primary!.png` (special characters)

#### Metadata Completeness

```typescript
interface MetadataValidation {
  hasDescription: boolean;
  hasTags: boolean;
  hasType: boolean;
  hasCreatedDate: boolean;
}

function validateMetadata(asset: Asset): MetadataValidation {
  return {
    hasDescription: asset.description && asset.description.length >= 10,
    hasTags: asset.tags && asset.tags.length >= 2,
    hasType: asset.type !== undefined,
    hasCreatedDate: asset.created !== undefined
  };
}
```

**Rules**:
- ✅ Description (≥ 10 characters)
- ✅ Tags (≥ 2 tags)
- ✅ Type defined
- ✅ Created date present

#### Project Integration

```typescript
interface ProjectIntegrationValidation {
  usedInProject: boolean;
  noOrphans: boolean;
  correctReferences: boolean;
}

function validateProjectIntegration(asset: Asset): ProjectIntegrationValidation {
  return {
    usedInProject: asset.projects_used_in.length > 0,
    noOrphans: !isOrphanedAsset(asset),
    correctReferences: allReferencesValid(asset)
  };
}

function isOrphanedAsset(asset: Asset): boolean {
  // Check if asset is referenced in any project files
  const references = findAssetReferences(asset.id);
  return references.length === 0;
}
```

**Rules**:
- ✅ Asset used in at least one project
- ✅ No orphaned assets (unused assets are flagged)
- ✅ All references are valid

---

## Validation Execution

### Automated Validation

```bash
# Validate single asset
node tools/asset-validator/validate.ts --asset ASSET-2025-001

# Validate all assets
node tools/asset-validator/validate.ts --all

# Validate by type
node tools/asset-validator/validate.ts --type sprite

# Validate by project
node tools/asset-validator/validate.ts --project pixelpets-reborn

# Fix auto-fixable issues
node tools/asset-validator/validate.ts --asset ASSET-2025-001 --fix
```

### Validation Report Format

```
ASSET VALIDATION REPORT
Asset: ASSET-2025-001 (button-primary.png)

┌─ Level 1: Structural Validation
│  ✅ File exists and readable
│  ✅ Valid PNG format
│  ✅ No corrupted data
│  ✅ Valid dimensions (64x32)
│  STATUS: PASSED

├─ Level 2: Semantic Validation
│  ✅ Dimensions valid (64x32)
│  ✅ File size appropriate (12 KB)
│  ✅ Color mode correct (RGBA)
│  ✅ Has transparency
│  ✅ Resolution sufficient
│  STATUS: PASSED

├─ Level 3: Integration Validation
│  ✅ In correct directory (src/assets/sprites/)
│  ✅ Registered in registry
│  ✅ Reuse search performed
│  ✅ Symbolic references only
│  ✅ Optimization applied (high)
│  ⚠️  Warning: Only 2 tags (recommend ≥ 3)
│  STATUS: PASSED (1 warning)

OVERALL STATUS: ✅ PASSED (1 warning)
Warnings can be ignored or addressed.
```

### Validation Failure Report

```
ASSET VALIDATION REPORT
Asset: ASSET-2025-005 (sprite.png)

┌─ Level 1: Structural Validation
│  ✅ File exists and readable
│  ❌ Invalid PNG format (corrupted data block)
│  STATUS: FAILED

├─ Level 2: Semantic Validation
│  SKIPPED (structural validation failed)

├─ Level 3: Integration Validation
│  ❌ Not in correct directory (temp/sprite.png)
│  ❌ Not registered in registry
│  ❌ No reuse search performed
│  ❌ Filename not descriptive (sprite.png)
│  STATUS: FAILED

OVERALL STATUS: ❌ FAILED (4 violations)

Required Actions:
1. Fix PNG corruption (re-export or use source file)
2. Move to src/assets/sprites/
3. Use descriptive filename (e.g., player-idle-sprite.png)
4. Perform reuse search before ingestion
5. Register in ASSET_REGISTRY.md after fixes
```

---

## Auto-Fix Capabilities

Some validation issues can be automatically fixed:

```typescript
interface AutoFixResult {
  fixed: string[];
  manualRequired: string[];
}

async function autoFix(asset: Asset): Promise<AutoFixResult> {
  const fixes: string[] = [];
  const manual: string[] = [];

  // Auto-fixable issues
  if (!asset.optimizationApplied) {
    await optimizeAsset(asset);
    fixes.push('Applied optimization');
  }

  if (asset.tags.length < 2) {
    asset.tags = [...asset.tags, ...inferTags(asset)];
    fixes.push('Added inferred tags');
  }

  if (!asset.description) {
    asset.description = generateDescription(asset);
    fixes.push('Generated description');
  }

  // Manual fixes required
  if (asset.corrupted) {
    manual.push('Fix corrupted data (re-export from source)');
  }

  if (!asset.inCorrectDirectory) {
    manual.push('Move to correct directory');
  }

  return { fixed: fixes, manualRequired: manual };
}
```

**Auto-fixable**:
- ✅ Missing optimization
- ✅ Missing tags (infer from filename/content)
- ✅ Missing description (generate from tags)
- ✅ File permissions
- ✅ Metadata formatting

**Manual fix required**:
- ❌ Corrupted file data
- ❌ Wrong directory location
- ❌ Invalid format
- ❌ Incorrect dimensions
- ❌ Missing registry entry (use ingestion protocol)

---

## Validation Frequency

### Continuous Validation
- **Pre-commit hook**: Validate all modified assets
- **CI/CD pipeline**: Validate all assets before merge
- **Asset ingestion**: Validation is mandatory step

### Periodic Validation
- **Daily**: Validate recently modified assets
- **Weekly**: Validate all registered assets
- **Monthly**: Full workspace asset audit

### Trigger Validation
- **On asset creation**: Immediate validation
- **On asset modification**: Re-validation required
- **On project build**: Validate project assets

---

## Integration with Gates

This validation protocol enforces:
- **Asset Gate** (gates/asset-gate.md) - All Level 3 checks
- **Quality Gate** (gates/quality-gate.md) - File integrity, optimization
- **Complexity Gate** (gates/complexity-gate.md) - File size limits

---

## Exemptions

**NO exemptions** for:
- Structural validation (Level 1)
- File corruption
- Registry registration
- Directory location

**Rare exemptions** for:
- Optimization (must document reason)
- Specific dimension requirements
- External assets (documented separately)

All exemptions logged in `/evolution/ARBITRATION_LOG.md`.

---

## Validation Metrics

Track validation effectiveness:

```markdown
## Validation Metrics (Monthly)

- **Total Validations**: 247
- **Pass Rate**: 94%
- **Auto-Fixed**: 18 (7%)
- **Manual Fixes Required**: 15 (6%)
- **Common Failures**:
  1. Missing optimization (8 cases)
  2. Wrong directory (4 cases)
  3. Insufficient tags (3 cases)

- **Average Validation Time**: 1.2 seconds
```

---

## Notes

- **Validation is NOT optional** - all assets must validate
- **Failed validation blocks ingestion** - cannot proceed
- **Auto-fix when possible** - but verify results
- **Manual fixes documented** - clear instructions provided
- **Continuous improvement** - track patterns, update rules

**Remember**: Validation prevents technical debt. Invalid assets are invisible liabilities.

**Validate Early. Validate Always.**
