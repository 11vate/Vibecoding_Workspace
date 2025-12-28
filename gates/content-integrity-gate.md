# Content Integrity Gate

**Authority Tier**: 1 (Immutable Law)
**Gatekeeper**: `tools/gates/check-content-integrity.ts`

## The 4 Integrity Rules

### 1. The Generator Rule
**"No Content Without a Generator"**
*   Every asset in `src/assets/generated/` must map back to a Generator Definition in `src/content/generators/`.
*   Orphaned assets are treated as "Trash" and deleted.

### 2. The Schema Rule
**"No Sprite Without a Schema"**
*   Every visual asset must have a corresponding `.json` schema file in the `schemas` directory.
*   The Schema is the Source of Truth. The PNG is disposable.

### 3. The Seed Rule
**"No Art Without a Seed"**
*   Every schema must contain a `seed` field.
*   The output must be reproducible by re-running the generator with that seed.

### 4. The Regeneration Rule
**"No Visual That Cannot Be Regenerated"**
*   If you delete the `src/assets/generated` folder and run `npm run generate-content`, the game must return to an identical state.
*   This proves that the system is deterministic and self-contained.

## Enforcement
*   **CI/CD**: The build pipeline runs the "Regeneration Test" (Delete -> Generate -> Compare Hash).
*   **Development**: The `npm run dev` command warns if "Unmanaged Assets" are detected in the output folders.

## Failure Response
*   **Action**: If a file fails integrity checks, it is flagged as "Corrupted".
*   **Resolution**: Delete the file and regenerate it from the Schema. If Schema is missing, the asset is lost and must be recreated via Mode 1 or Mode 3.
