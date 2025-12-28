# Asset Sourcing Gate

**Authority Tier**: 1 (Immutable Law)
**Gatekeeper**: `tools/gates/check-asset-sourcing.ts`

## Gate Rules
**NO ASSET MAY EXIST IN THE PROJECT WITHOUT:**
1.  **A Valid Spec**: Defined in `asset-system/specs/`.
2.  **A Declared Source Mode**: (Mode 1, 2, or 3).
3.  **A License Declaration**: Even for generated content (e.g., "Project Proprietary").

## Failure Conditions (Automatic Rejection)
*   **Placeholder Art**: Files named `temp.png`, `placeholder.png`, or single-color squares/circles detected.
*   **Unknown Source**: Assets in `src/assets` not registered in `ASSET_REGISTRY.json`.
*   **Hallucinated Filenames**: References in code to files that do not exist.
*   **Ambiguous Specs**: "Make it look cool" is not a spec.

## Enforcement Process
1.  **Pre-Commit**: Check new assets against registry and source modes.
2.  **Build Time**: Verify all referenced assets exist and have metadata.
3.  **Generation Time**: AI must output the Spec -> Source -> Asset chain, not just the file.

## Recovery
If this gate fails:
1.  Create an Asset Spec.
2.  Choose a valid Source Mode.
3.  Register the asset.
4.  Normalize the asset.
