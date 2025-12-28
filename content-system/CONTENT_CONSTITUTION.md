# Content Constitution

**Version**: 1.0
**Status**: Active

## 1. The Core Law: Data First

In this workspace, **Content IS Data**. Visuals, audio, and text are merely "artifacts" compiled from that data.

*   **Wrong**: "I made a sprite called `hero.png`."
*   **Right**: "I defined a `hero` schema with seed `123`, and the compiler rendered `hero.png`."

## 2. The Four Pillars

1.  **Deterministic Generation**:
    *   Input: `Seed` + `Config`
    *   Output: `Schema` (JSON) + `Artifact` (PNG/TXT)
    *   Rule: The same seed MUST always produce the same output.

2.  **Explicit Sourcing**:
    *   Every asset must have a known origin (Mode 1: Gen, Mode 2: Lib, Mode 3: Ingest).
    *   "I found it on the internet" is illegal.

3.  **The Compilation Pipeline**:
    *   We do not "save" assets; we "compile" them.
    *   The `ContentCompiler` is the engine that turns Manifests into Assets.

4.  **Integrity Gates**:
    *   No Asset without a Schema.
    *   No Schema without a Generator.

## 3. Directory Structure

*   `src/content/manifests/`: The "Source Code" of your content (JSON files).
*   `src/content/schemas/`: The "Intermediate Representation" (AST).
*   `src/content/generators/`: The "Compilers" (TypeScript classes).
*   `src/assets/generated/`: The "Binaries" (PNGs, TXTs). **Do not edit these manually.**

## 4. How to Add Content

1.  Open `src/content/manifests/core_manifest.json`.
2.  Add a new entry (e.g., a new sprite or lore).
3.  Run `npm run compile:content`.
4.  Enjoy your new asset in `src/assets/generated/`.
