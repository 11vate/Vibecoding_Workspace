# Seed Model

**Authority Tier**: 2 (Mandatory Process)
**Purpose**: Ensure global determinism across the project.

## The Seed Hierarchy

### 1. Global Project Seed
*   **Scope**: The entire game universe instance.
*   **Usage**: All sub-seeds are derived from this.
*   **Example**: `0xCAFEBABE`

### 2. Domain Seeds (Derived)
*   `Seed_World = Hash(Global_Seed + "WORLD")`
*   `Seed_Items = Hash(Global_Seed + "ITEMS")`
*   `Seed_NPCs  = Hash(Global_Seed + "NPCS")`

### 3. Entity Seeds (Instance)
*   Every unique entity has its own seed.
*   `Seed_Orc_42 = Hash(Seed_NPCs + 42)`

## Implementation Strategy
*   Use a PRNG (Pseudo-Random Number Generator) like **PCG32** or **Xorshift** (NOT `Math.random()`).
*   State must be savable/loadable.

## Replay & Debugging
*   To debug a specific bug: Log the `Global_Seed` and the specific `Entity_Seed`.
*   To fix: Re-run the generator with that exact seed.
