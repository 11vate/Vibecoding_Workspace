# Asset Generation Gate

**Authority Tier**: 2 (Mandatory Process)
**Purpose**: Validate all procedurally generated assets meet quality standards
**Enforced By**: `tools/gates/check-asset-generation.ts`

---

## Overview

This gate ensures that autonomously generated assets meet workspace quality standards. It validates technical compliance, visual quality, and registration completeness.

**All generated assets MUST pass this gate before use.**

---

## Validation Checks

### 1. Technical Compliance ✓

**File Format**:
- PNG files: 32-bit with alpha channel, sRGB color space
- SVG files: Valid XML, no external dependencies
- File extension matches actual format

**Dimensions**:
- Matches specification exactly
- Grid-aligned (multiple of 8, 16, or 32)
- Within reasonable limits (8px - 4096px)

**File Size**:
- Sprites: < 100KB
- Sprite sheets: < 500KB
- Textures: < 1MB
- No unnecessary bloat

**Code**:
```typescript
// Technical validation pseudo-code
function validateTechnical(asset: Asset, spec: AssetSpecification): boolean {
  // Format check
  if (!isValidFormat(asset.path, spec.technical.format)) {
    return fail("Format mismatch");
  }

  // Dimension check
  const dimensions = getImageDimensions(asset.path);
  if (dimensions.width !== spec.visual.dimensions.width ||
      dimensions.height !== spec.visual.dimensions.height) {
    return fail("Dimension mismatch");
  }

  // File size check
  const fileSize = getFileSize(asset.path);
  if (fileSize > spec.technical.maxFileSize) {
    return fail("File too large");
  }

  return true;
}
```

---

### 2. Visual Quality ✓

**Transparency Requirements**:
- Background fully transparent (alpha = 0) if specified
- No semi-transparent edges (causes bleed)
- Clean alpha channel

**Color Compliance**:
- Uses specified palette (if provided)
- Color count within limits
- No unexpected colors

**Pixel Perfection** (for pixel art):
- No anti-aliasing (unless specified)
- Crisp edges
- Consistent pixel grid

**Code**:
```typescript
function validateVisual(asset: Asset, spec: AssetSpecification): boolean {
  const imageData = loadImage(asset.path);

  // Transparency check
  if (spec.visual.transparency) {
    if (!hasTransparentBackground(imageData)) {
      return fail("Background not transparent");
    }
  }

  // Palette check
  if (spec.visual.colors?.palette) {
    const usedColors = extractColors(imageData);
    if (!colorsMatchPalette(usedColors, spec.visual.colors.palette)) {
      return fail("Colors outside palette");
    }
  }

  // Pixel art check
  if (spec.visual.style === "pixel_art") {
    if (hasAntiAliasing(imageData)) {
      return fail("Pixel art has anti-aliasing");
    }
  }

  return true;
}
```

---

### 3. Normalization Standards ✓

**Sprite Standards** (from `/asset-system/normalization/sprite-normalization.md`):
- Grid-aligned dimensions
- Correct anchor points
- Proper padding (sprite sheets)

**Anchor Points**:
- Ground entities: Bottom-center (x: 0.5, y: 1.0)
- Flying entities: Center (x: 0.5, y: 0.5)
- UI elements: Center or top-left (depends on type)

**Padding** (sprite sheets):
- 2px between frames
- Prevents texture bleeding

**Code**:
```typescript
function validateNormalization(asset: Asset, spec: AssetSpecification): boolean {
  // Grid alignment
  if (spec.visual.dimensions.width % 8 !== 0 ||
      spec.visual.dimensions.height % 8 !== 0) {
    return fail("Not grid-aligned");
  }

  // Sprite sheet padding
  if (spec.type === "sprite_sheet") {
    if (!hasCorrectPadding(asset.path, 2)) {
      return fail("Incorrect sprite sheet padding");
    }
  }

  return true;
}
```

---

### 4. Generation Method Validation ✓

**Allowed Methods Only**:
- Must use approved generation method
- No external API calls
- No copyrighted source assets

**Determinism**:
- Seed-based generation recorded
- Reproducible with same seed
- Documented in metadata

**Code**:
```typescript
function validateGenerationMethod(asset: Asset, spec: AssetSpecification): boolean {
  const allowedMethods = [
    "geometric",
    "pixel_art_symmetry",
    "pixel_art_ca",
    "texture_perlin",
    "texture_simplex",
    "svg_code",
    "font_render"
  ];

  if (!allowedMethods.includes(spec.generation.method)) {
    return fail("Invalid generation method");
  }

  // Ensure no API calls were made
  if (spec.generation.method.includes("api")) {
    return fail("API-based generation not allowed");
  }

  // Check seed is recorded
  if (!spec.generation.seed) {
    return fail("No seed recorded for reproducibility");
  }

  return true;
}
```

---

### 5. Registry Integration ✓

**Registration Required**:
- Entry in ASSET_REGISTRY.md
- Entry in ASSET_REGISTRY.json
- Complete metadata
- Tagged appropriately

**Metadata Completeness**:
- ID, path, type, format
- Dimensions, size, dates
- Generation method, seed
- Tags for discoverability

**Code**:
```typescript
function validateRegistration(asset: Asset): boolean {
  // Check in registry
  const registryEntry = findInRegistry(asset.id);
  if (!registryEntry) {
    return fail("Not registered in ASSET_REGISTRY.md");
  }

  // Check metadata completeness
  const requiredFields = [
    "id", "path", "type", "format", "size_kb",
    "dimensions", "created", "generation_method", "seed", "tags"
  ];

  for (const field of requiredFields) {
    if (!registryEntry[field]) {
      return fail(`Missing required field: ${field}`);
    }
  }

  return true;
}
```

---

### 6. Specification Compliance ✓

**Must-Have Criteria**:
- All required features present
- Quality threshold met
- No forbidden elements

**Validation Criteria Match**:
- Checks all spec.validation.mustHave items
- Ensures none of spec.validation.mustNotHave items present

**Code**:
```typescript
function validateSpecificationCompliance(
  asset: Asset,
  spec: AssetSpecification
): boolean {
  // Must-have checks
  for (const requirement of spec.validation.mustHave) {
    if (!assetHas(asset, requirement)) {
      return fail(`Missing requirement: ${requirement}`);
    }
  }

  // Must-not-have checks
  for (const forbidden of spec.validation.mustNotHave) {
    if (assetHas(asset, forbidden)) {
      return fail(`Forbidden element present: ${forbidden}`);
    }
  }

  // Quality threshold
  if (spec.validation.qualityThreshold) {
    const quality = calculateQuality(asset);
    if (quality < spec.validation.qualityThreshold) {
      return fail(`Quality ${quality} below threshold ${spec.validation.qualityThreshold}`);
    }
  }

  return true;
}
```

---

## Gate Execution

### When to Run
- **Mandatory**: After every asset generation
- **Mandatory**: Before asset registration
- **Optional**: Manual validation via CLI

### How to Run

**Automatic** (during generation):
```typescript
// In generation pipeline
const asset = await generateAsset(spec);
const gateResult = await runAssetGenerationGate(asset, spec);

if (!gateResult.passed) {
  throw new Error(`Asset Generation Gate Failed: ${gateResult.failures.join(', ')}`);
}
```

**Manual** (CLI):
```bash
# Validate single asset
node tools/gates/check-asset-generation.ts src/assets/generated/hero-sprite.png

# Validate all generated assets
node tools/gates/check-asset-generation.ts --all

# Validate with specification
node tools/gates/check-asset-generation.ts hero-sprite.png --spec hero-spec.json
```

---

## Gate Report Format

### Success Report
```
✅ Asset Generation Gate: PASSED

Asset: hero-sprite-walk.png
Specification: hero-walk-spec.json

Checks:
  ✅ Technical Compliance (format, dimensions, file size)
  ✅ Visual Quality (transparency, colors, pixel-perfect)
  ✅ Normalization Standards (grid-aligned, proper padding)
  ✅ Generation Method (allowed, deterministic, documented)
  ✅ Registry Integration (registered, complete metadata)
  ✅ Specification Compliance (all requirements met)

Quality Score: 0.92 / 1.0
Generation Time: 487ms
File Size: 2.3 KB

Asset ready for use.
```

### Failure Report
```
❌ Asset Generation Gate: FAILED

Asset: button-primary.png
Specification: button-spec.json

Failures:
  ❌ Technical Compliance
     - File size 127KB exceeds limit of 100KB

  ❌ Visual Quality
     - Background not fully transparent (alpha=15 detected)

  ⚠️  Normalization Standards (WARNING)
     - Dimensions 121x41 not grid-aligned (should be multiple of 8)

Passed:
  ✅ Generation Method
  ✅ Registry Integration
  ✅ Specification Compliance

Action Required:
  1. Optimize PNG to reduce file size
  2. Ensure fully transparent background
  3. Adjust dimensions to 120x40 (grid-aligned)

Recommended: Try fallback method or regenerate with adjusted parameters.
```

---

## Failure Handling

### On Gate Failure

**Automatic Response**:
1. Log failure to `GATE_FAILURES_LOG.md`
2. Try fallback generation method (if specified)
3. If fallback fails, try simplest method (geometric)
4. If all fail, create specification document for manual creation

**Never**:
- Use asset that failed gate
- Skip registration
- Ignore quality issues

**Always**:
- Document failure reason
- Attempt recovery
- Log for future improvement

### Fallback Chain
```
Primary Method Fails
    ↓
Try Fallback Method (from spec)
    ↓
Fallback Fails
    ↓
Try Geometric (simplest, most reliable)
    ↓
Geometric Fails
    ↓
Create Manual Specification Document
    ↓
Continue Project with Placeholder
```

---

## Integration Points

### With Asset Registry
- Gate validates before registration
- Failed assets not registered
- Successful assets added with metadata

### With Generation Pipeline
- Gate runs automatically in pipeline
- Pipeline halts on failure
- Fallback methods triggered automatically

### With Evolution System
- Failures logged to GATE_FAILURES_LOG.md
- Patterns analyzed quarterly
- Improvements suggested to generation methods

---

## Quality Metrics

### Target Metrics
- **Pass Rate**: > 95%
- **Average Quality Score**: > 0.85
- **Fallback Usage**: < 10%
- **Manual Spec Creation**: < 1%

### Current Metrics
*(To be populated after operational use)*

- **Total Assets Validated**: 0
- **Pass Rate**: N/A
- **Average Quality Score**: N/A
- **Common Failures**: N/A

---

## Examples

### Example 1: Pixel Art Sprite Validation

**Input**:
- Asset: `hero-idle-001.png`
- Specification: 32x32 pixel art, 5-color palette, transparent background

**Validation**:
```
✅ Dimensions: 32x32 ✓
✅ Format: PNG 32-bit ✓
✅ Transparency: Fully transparent background ✓
✅ Palette: 5 colors, all from specified palette ✓
✅ Pixel-perfect: No anti-aliasing ✓
✅ Grid-aligned: 32 is multiple of 8 ✓
✅ Registered: Entry in ASSET_REGISTRY.md ✓

Result: PASSED (Quality: 0.94)
```

### Example 2: Button Generation Validation (Failure)

**Input**:
- Asset: `btn-primary-hover.png`
- Specification: 120x40 geometric button with gradient

**Validation**:
```
✅ Dimensions: 120x40 ✓
✅ Format: PNG 32-bit ✓
❌ File Size: 132KB (limit: 100KB) ✗
✅ Transparency: Correct ✓
✅ Grid-aligned: 120x40 valid ✓
❌ Colors: 7 colors found, 5 expected ✗

Result: FAILED (2 issues)

Action: Regenerate with:
  - PNG optimization enabled
  - Color quantization to 5 colors
```

---

## Maintenance

**Review Frequency**: Monthly
**Metrics Analysis**: Quarterly
**Standard Updates**: Via UPDATE_PROTOCOL.md

---

## Notes

- This gate is specific to **generated** assets (not sourced or ingested assets)
- Complements Asset Gate (which validates all assets)
- Ensures workspace maintains "zero external dependencies" principle
- Validates AI autonomy works correctly

---

**Generated assets that pass this gate are production-ready and fully autonomous.**
