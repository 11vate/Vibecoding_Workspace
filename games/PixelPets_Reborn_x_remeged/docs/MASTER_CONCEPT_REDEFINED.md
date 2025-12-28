# Pixel Pets Reborn x Remeged: The Polished Vision

## 1. High-Level Vision: "Infinite Evolution, Eternal Memory"
Pixel Pets Reborn x Remeged is not just a creature collector; it is a **generative strategy RPG** where every decision echoes through generations. It combines the nostalgia of retro pixel art with cutting-edge **offline AI** and **blockchain-inspired lineage tracking** (without the crypto) to create a game where no two players will ever have the exact same roster.

**The Core Promise:** "Create life that has never existed before, and guide it to glory."

## 2. The Polished Player Experience

### A. The Aesthetic: "Retro-Future Glitch"
The game's visual identity blends clean, high-quality 16-bit pixel art with modern "glitch" aesthetics and dynamic lighting effects.
*   **Base World**: Clean, vibrant pixel art (think Stardew Valley meets Pokémon Gen 5).
*   **The Glitch Layer**: When Chaos stones are used or powerful abilities trigger, the reality "tears" – chromatic aberration, pixel sorting effects, and UI distortions.
*   **Domain Effects**: Combat arenas transform dynamically. A "Ruby Domain" isn't just a buff icon; the screen borders ignite, and heat waves ripple across the pixel grid.

### C. The Interface: Retro-Future Glitch
The UI is a character in itself—a high-tech OS struggling to contain the chaos.
*   **The Core Uplink**: Clean, stable, blue/cyan aesthetic for authorized actions (Summoning Primes, Standard Fusion).
*   **The Black Market**: Glitched, red/purple aesthetic with chromatic aberration and text corruption. Used for illicit trading and acquiring "Hacked" pets.
*   *Design System Doc*: [`docs/UI/DESIGN_SYSTEM.md`](docs/UI/DESIGN_SYSTEM.md)

### B. The Gameplay Loop
1.  **Scavenge & Collect**: Explore The Grid to find "Data Stones" (Ruby, Sapphire, Opal, etc.) and basic "Base Pets".
2.  **The Fusion Altar (The Core)**:
    *   Select two pets + two stones.
    *   **AI Synthesis**: The system generates a *new* entity. It doesn't just swap heads; it blends concepts. Fire + Water = Steam (not just Fire/Water type).
    *   **Signature Creation**: A unique hash is minted, locking in the pet's lineage, lore, and visual DNA.
3.  **Tactical Combat**: 4v4 battles where positioning (Front/Back) and Domain control matter more than raw stats.
4.  **Evolution & Legacy**: Pets grow, but their true value lies in their *Lineage*. Breeding a Champion isn't the end; it's the start of a powerful bloodline.

## 3. Integrated Systems Overview

### I. The AI Engine (The Brain)
*   **Offline Capability**: Uses optimized local models (or heuristic algorithms simulating AI) to ensure the game works 100% offline.
*   **Contextual Generation**:
    *   *Input*: "Emberwolf" (Parent A) + "Frosteagle" (Parent B) + Intent: "Dominance".
    *   *Output*: "Steam-Alpha". Lore: "Born from the violent collision of fire and ice, this predator hunts in the fog it creates."
    *   *Uniqueness*: Every generated asset is checked against a local "Uniqueness Score" to ensure it's not a clone.

### II. The Glitch System (The "Remeged" Factor)
*   **Chaos Stones**: The wildcard. Using an Opal stone introduces "Glitch Risk".
*   **Risk vs. Reward**:
    *   *Success*: A "Glitched" pet with rule-breaking abilities (e.g., "Ignore Defense", "Turn Reversal").
    *   *Failure*: A purely decorative glitch or a pet with unstable stats.
*   **Visuals**: Glitched pets have unstable sprites – colors shift, pixels float away, or they flicker in and out of existence.

### III. The Lineage System (The Memory)
*   **Ancestral Echoes**: Abilities that get stronger if your ancestors were strong.
    *   *Example*: "Ancient Rage" deals +10% damage for every "Fire" ancestor in the last 5 generations.
*   **Fusion Signature**: A detailed log accessible in the UI. Players can trace their Mythic pet back 10 generations to its humble "Basic" roots.
*   **Breeding Projects**: Players aren't just catching pets; they are *designing* bloodlines for specific traits.

### IV. Combat: The "Domain War"
*   **4v4 Grid**: 
    *   *Front Row*: Tanks/Bruisers (Take +20% dmg, Deal +10%).
    *   *Back Row*: DPS/Support (Take -10% dmg, Deal +20%).
*   **Domain Shifts**: Tier V stones and Ultimates create "Domains".
    *   *Strategy*: If the enemy sets up a "Lava Domain" (Fire Boost), you must counter with a "Tidal Domain" (Water) or override it with a "Chaos Domain" (Randomness).

## 4. Content Strategy: The Hybrid Model
To achieve a "Polished Level" without infinite manual labor, we use a **Hybrid Content Strategy**:
1.  **The "Primes" (Hand-Crafted)**:
    *   10 Core Families (Pyro, Aqua, Terra, etc.).
    *   ~150 Hand-designed "Anchor" pets. These set the quality bar and visual style.
2.  **The "Descendants" (Procedural/AI)**:
    *   All fusions use the Primes as genetic material.
    *   The system remixes sprites, palettes, and ability data to create the infinite variations.
    *   *Result*: The game feels "hand-crafted" at the start, but "infinitely expansive" as you play.

## 5. Technical Pillars
1.  **PWA First**: Installable, offline, persistent local storage (IndexedDB).
2.  **Hexagonal Architecture**:
    *   *Domain*: Pure game logic (Fusion, Combat).
    *   *Application*: Use cases (User flows).
    *   *Infrastructure*: Storage, AI providers.
    *   *Presentation*: React/Canvas UI.
3.  **Data-First Content**: Content is JSON. "Adding a pet" means adding a JSON entry, not writing code.

## 6. Implementation Roadmap (Refined)
*   **Phase 1: The Core (Done/In-Progress)**
    *   Basic Project Structure (Monorepo).
    *   Core Governance (Constitution).
    *   Asset System (Reuse-first).
*   **Phase 2: The Engine (Next)**
    *   Implement the "Fusion Signature" generator.
    *   Build the "Lineage Memory" data structures.
    *   Create the basic Combat Loop (4v4 state machine).
*   **Phase 3: The Content**
    *   Finalize the 10 Prime Families (JSON definitions).
    *   Implement the 8 Stone Types and their effects.
*   **Phase 4: The Polish**
    *   Add the "Glitch" shader effects.
    *   Implement the AI Text/Lore generation hooks.
    *   UI/UX Refinement (The "Vibe" check).

This document serves as the **North Star** for all future development. Every feature must answer: "Does this enhance the Infinite Evolution or the Eternal Memory?"
