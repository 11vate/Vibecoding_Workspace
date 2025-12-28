# Asset Registry

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Maintained By**: `tools/asset-validator/` (automated)

---

## Purpose

Central registry of all workspace assets. **AI must query this registry before creating any asset.**

**Prime Directive**: Reuse Before Creation

---

## Registry Format

Each asset entry contains complete metadata for discovery and reuse:

```json
{
  "id": "ASSET-2025-001",
  "path": "src/assets/sprites/button-primary.png",
  "type": "sprite",
  "format": "png",
  "size_kb": 12,
  "dimensions": "64x32",
  "projects_used_in": ["pixelpets-reborn"],
  "reuse_count": 1,
  "tags": ["button", "ui", "primary", "pixel-art"],
  "created": "2025-01-15",
  "last_used": "2025-12-24",
  "description": "Primary button style, pixel art, 64x32px",
  "alternatives": [],
  "sprite_sheet": null,
  "optimization_level": "high"
}
```

---

## Current Assets

### Sprites

*No sprites registered yet. This registry will be populated as assets are created following the asset lifecycle.*

### Audio

*No audio files registered yet.*

### Fonts

*No fonts registered yet.*

### Data Files

*No data files registered yet.*

---

## Usage

### For AI Models

**Before creating any asset:**
1. Search this registry using `tools/asset-intelligence/reuse-suggester.ts`
2. If similar asset exists: REUSE it (increment reuse_count)
3. If no match: Create new asset and register it here
4. Asset Gate enforces this flow

### For Humans

**Search registry:**
```bash
# Search by tag
node tools/asset-intelligence/reuse-suggester.ts --tags "button,primary"

# Search by type
node tools/asset-intelligence/reuse-suggester.ts --type sprite

# Search by project
node tools/asset-intelligence/reuse-suggester.ts --project pixelpets-reborn
```

**Add new asset:**
```bash
# Automated via asset-validator
node tools/asset-validator/register-asset.ts --path src/assets/sprites/new-asset.png
```

---

## Registry Schema

### Required Fields

- **id**: Unique identifier (ASSET-YYYY-NNN format)
- **path**: Relative path from workspace root
- **type**: Asset category (sprite, audio, font, data, etc.)
- **format**: File format (png, jpg, svg, mp3, wav, ttf, json, etc.)
- **size_kb**: File size in kilobytes
- **projects_used_in**: Array of project IDs using this asset
- **reuse_count**: Number of times asset has been reused
- **tags**: Searchable tags
- **created**: ISO date of creation
- **last_used**: ISO date of last usage
- **description**: Human-readable description

### Optional Fields

- **dimensions**: For images (WxH)
- **duration**: For audio (seconds)
- **sample_rate**: For audio (Hz)
- **alternatives**: IDs of similar/alternative assets
- **sprite_sheet**: Parent spritesheet ID if part of one
- **optimization_level**: "none", "medium", "high"
- **license**: License information if relevant
- **attribution**: Creator attribution if needed

---

## Asset Types

Categorization for organization and search:

### Visual Assets
- `sprite` - Individual sprite images
- `spritesheet` - Combined sprite sheets
- `icon` - UI icons
- `background` - Background images
- `texture` - Textures for effects

### Audio Assets
- `sfx` - Sound effects
- `music` - Background music
- `voice` - Voice samples

### Font Assets
- `font` - Font files (TTF, WOFF, WOFF2)

### Data Assets
- `json` - JSON data files
- `csv` - CSV data files
- `config` - Configuration files

---

## Reuse Metrics

Track asset reuse effectiveness:

```markdown
## Reuse Statistics (Updated Weekly)

- **Total Assets**: 0
- **Average Reuse Count**: 0
- **Most Reused Asset**: N/A
- **Reuse Rate**: 0% (target: > 60%)
- **Asset Proliferation**: 0 assets/month

### Top 10 Most Reused Assets
*Registry empty - to be populated*
```

---

## Maintenance

### Automated Updates
- `tools/asset-validator/` automatically updates this registry
- Reuse counts incremented when assets are referenced
- Last used dates updated on each use
- New entries added when assets pass Asset Gate

### Manual Review
- **Quarterly**: Review unused assets (reuse_count = 0)
- **Annually**: Archive assets from deprecated projects
- **As Needed**: Update descriptions, tags for discoverability

---

## Integration

### With Asset Gate
Asset Gate (`/gates/asset-gate.md`) enforces:
1. Search this registry before creation
2. Justify if creating when similar exists
3. Register all new assets
4. Use symbolic references only

### With Tools
- `tools/asset-intelligence/reuse-suggester.ts` - Search and suggest reuse
- `tools/asset-intelligence/usage-tracker.ts` - Track usage metrics
- `tools/asset-validator/validate.ts` - Validate compliance
- `tools/asset-validator/register-asset.ts` - Add new entries

---

## Notes

- This registry is the single source of truth for all workspace assets
- DO NOT create assets without registering them here
- DO NOT reference assets by direct path (use asset registry imports)
- Keep metadata current for effective reuse

**Reuse Before Creation. Always.**
