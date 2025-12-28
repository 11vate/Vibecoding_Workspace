# Asset Sourcing Modes

**Authority Tier**: 1 (Immutable Law)
**Enforced By**: `gates/asset-sourcing-gate.md`

## The 4 Sourcing Modes
The workspace recognizes EXACTLY four valid modes for acquiring assets. Any asset not traceable to one of these modes is **illegal**.

### Mode 1: Deterministic Generation (AI-Native)
*   **Definition**: Assets generated entirely by AI/Procedural algorithms within the workspace.
*   **Use Case**: Prototypes, placeholder art, abstract visuals, procedural textures.
*   **Requirements**:
    *   Must use a declared generator/prompt.
    *   Must be reproducible (seed-based).
    *   Output dimensions and format must be fixed.
*   **Status**: PREFERRED for new content.

### Mode 2: Curated Open Libraries (Authoritative)
*   **Definition**: Assets fetched from pre-approved, open-license external repositories.
*   **Use Case**: High-quality generic assets (UI icons, standard sound effects).
*   **Requirements**:
    *   Source must be in `asset-system/sources/OPEN_ASSET_SOURCES.md`.
    *   License must be compatible (CC0, MIT, CC-BY).
    *   Attribution must be logged.
*   **Status**: ACCEPTED for standard elements.

### Mode 3: Local Asset Ingestion (Human-in-the-Loop)
*   **Definition**: Assets manually provided by a human user (e.g., custom art, purchased packs).
*   **Use Case**: Hero assets, specific artistic direction, purchased content.
*   **Requirements**:
    *   Must pass `asset-system/ingestion/` pipeline.
    *   Must be normalized upon entry.
    *   Metadata must be generated.
*   **Status**: ACCEPTED for specialized content.

### Mode 4: Commission / Purchase Boundary (Explicitly Blocked)
*   **Definition**: Any requirement for assets that cannot be fulfilled by Modes 1-3.
*   **Action**: The AI is **forbidden** from scraping, guessing, or hallucinating.
*   **Output**: The AI must emit a **Purchase Spec** or **Commission Request**.
*   **Status**: BLOCKED (Requires Human Intervention).

---

## Decision Logic
When an asset is needed:
1.  Can I generate it deterministically? -> **Mode 1**
2.  Is it a standard common asset (e.g., "save icon") available in open sources? -> **Mode 2**
3.  Do I have it in the `local_ingest` folder? -> **Mode 3**
4.  If NONE of above: Emit **Mode 4 Spec**.
