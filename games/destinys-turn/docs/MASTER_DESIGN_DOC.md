# Destiny's Turn: Master Design Document

## 1. Core Concept
**Tagline**: "Irresponsible magicians chasing curiosities around a living board."
**Fantasy**: Players walk the outer world (Circle) to shape the inner world (Square), tempting fate for wonders that don't last long enough to own—but long enough to remember.
**Victory**: No final winner. The game ends after a set duration. Success is measured in stories created, charms used, and "moments" captured.

---

## 2. The Dual Board System

### The Circle (Outer Board)
*   **Function**: The "Control Room". Players physically move here.
*   **Movement**: Roll Movement Dice.
*   **Spaces (32-40)**:
    *   **Resource**: Gain Materials, Relics, or Favors.
    *   **Interaction**: Trade, Mischief (steal/swap), Lore.
    *   **Gate**: Trigger Master Dice (Theme/State shifts).
    *   **Relic Deposit**: Embed a relic into the Square.
    *   **Rabbit Rumor**: Reveal the Rabbit's general location.

### The Square (Inner Board)
*   **Function**: The "Living World". No players stand here; they manipulate it from afar.
*   **Structure**: 8x8 Grid (64 Tiles).
*   **Tile Anatomy**:
    *   **Terrain**: Defined by Theme (Water, Vines, Glass, etc.).
    *   **Object**: Relic (Player-placed) or Hazard (Theme-generated).
    *   **Occupant**: Boss or Rabbit Cameo.
    *   **State**: Active, Dormant, Flooded, Burning, etc.

---

## 3. The Master Dice (The Engine of Change)

### Master Die A: THEME (What the world is)
1.  **Ocean Leviathans**: Water tiles, tides, boats.
2.  **Electrum Carnival**: Illusion tiles, teleportation lights.
3.  **Jungle of Thorns**: Vine tiles, growth, predators.
4.  **Velvet Observatory**: Telescopes, star maps, prophecy.
5.  **Glass Desert**: Mirage tiles, heat, sandstorms.
6.  **Clockwork City**: Conveyor belts, gears, rotation.

### Master Die B: STATE (How the world behaves)
1.  **Calm**: Standard rules.
2.  **Storm**: Movement penalties, tile drift.
3.  **Prosperity**: Double resources, helpful terrain.
4.  **Eclipse**: Rabbit visible but hazards high.
5.  **Awakening**: Dormant relics activate.
6.  **Invasion**: Boss becomes aggressive.

*Interaction*: A Theme Shift (Die A) completely redraws the board terrain. A State Shift (Die B) alters the rules/variables of the current terrain.

---

## 4. Player Personas & Resources

### Personas (The Irresponsible Magicians)
*   **Pyromancer**: Clears hazards, burns paths.
*   **Thief**: Steals resources/relics, moves unseen.
*   **Gambler**: Manipulates dice results, forces rerolls.
*   **Beast Whisperer**: Controls Boss movement, uses creatures.

### Resources
1.  **Materials**: "Fuel" for basic Square manipulation (rotate tile, push object).
2.  **Relics**: "Tools" embedded in the Square. Persistent (mostly).
    *   *Examples*: Bridge, Lure, Trap, Beacon, Teleporter.
3.  **Favors**: "Luck" currency. Modify rolls or "bribe" logic.

---

## 5. The Golden Snitch: The White Rabbit
*   **Goal**: The primary (but elusive) objective.
*   **Spawning**: Appears once per Theme Shift in a disguise (Lifeboat, Magician's Hat, Star Map).
*   **Catching**: **The Reach Check**.
    *   Players cannot walk to it.
    *   They must establish a chain of adjacency or effect from a Relic/Tile they control to the Rabbit's tile.
*   **Reward**: **Rabbit Charm**.
    *   Temporary, powerful buff (e.g., "Choose any dice result", "Ignore Bosses").

---

## 6. Bosses (Walking Landscapes)
*   **Concept**: Emergent hazards, not enemies to kill.
*   **AI**: Deterministic but chaotic.
    *   *Kraken*: Follows water/relics.
    *   *Ringmaster*: Shuffles tiles.
*   **Interaction**: Players use Relics to divert, trap, or weaponize Bosses against rivals.

---

## 7. The Game Loop (Micro & Macro)

### Micro (Turn)
1.  **Roll & Move** on Circle.
2.  **Action**: Gather, Interact, or Trigger Gate.
3.  **Manipulation**: Spend Materials/Relics to change the Square.
4.  **World Reaction**: The Square resolves (Tides flow, Boss moves).

### Macro (Session)
1.  **Theme A** (e.g., Ocean) plays out.
2.  **Gate Triggered** -> **Theme Shift** (e.g., Carnival).
    *   Board resets/transforms.
    *   Relics mutate (Boat -> Carousel).
    *   Rabbit moves.
3.  Repeat until Time/Lap limit.
