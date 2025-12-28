# Destiny's Turn: Visual Style & UX Strategy

## Design Pillar: "The Toy Magic World" (Monopoly Go Inspiration)

We are adopting a **"Monopoly Go" aesthetic**: a vibrant, tactile, isometric world that feels like a living toy set.

### 1. The Layout: "The Island & The Orbit"

Instead of a flat 2D abstraction, the game is visualized as a 3D floating island.

*   **The Center (The Square)**: This is the "Island."
    *   It looks like an 8x8 grid of chunky, physical blocks (voxels or stylized 3D meshes).
    *   **Theme Shift**: When the theme changes, the blocks flip over or pop out and replace themselves (mechanical transformation).
    *   **Water**: Not just blue tiles, but actual water shaders/effects filling the gaps.
*   **The Perimeter (The Circle)**: This is the "Orbit Track."
    *   A raised, winding path that encircles the Island.
    *   It is **not** a perfect circle. It has elevation changes, bridges, and curves that frame the Island dramatically.
    *   Spaces are distinct stepping stones or platforms.

### 2. Camera & View Modes

We solve the "Dual View" problem with dynamic camera work, not split screens.

*   **Mode A: The Wanderer (Movement Phase)**
    *   **Focus**: The Player Token on the Outer Track.
    *   **Angle**: Isometric, relatively close to the token.
    *   **Background**: The Inner Square is visible in the center, constantly turning/breathing, but slightly distant. You see the *context* of the world, but your eyes are on the path.
*   **Mode B: The Meddler (Action Phase)**
    *   **Trigger**: When the player chooses to "Manipulate Square" or "Embed Relic."
    *   **Transition**: A swift "swoop" animation. The camera flies from the track into the center, hovering directly over the Square.
    *   **Interaction**: The outer track blurs or fades. The tiles of the Square become interactable (tap to rotate, drag to place relic).
*   **Mode C: The World Turn (Reaction Phase)**
    *   **Focus**: Wide shot of the whole Island.
    *   **Action**: Players watch the "machine" work. Tides rise, blocks shift, bosses march. The camera pans to follow the action.

### 3. Visual Language

*   **Tokens**: "Chunky" figurines with weight. When they land, dust pops up.
*   **Dice**: Large, 3D physics dice that roll across the screen (overlay), knocking into UI elements playfully.
*   **Relics**: Look like precious physical artifacts (gold, gem, stone) that "socket" into the terrain tiles with a satisfying *click*.
*   **The Rabbit**: A glowing, spectral white figure that contrasts with the solid "toy" world. It leaves a trail of sparkles.

### 4. UI/UX "Juice"

*   **Bouncy UI**: Buttons shouldn't just click; they should squash and stretch.
*   **Reward Ceremonies**: Getting a "Rabbit Charm" isn't a text box. It's a full-screen fanfare, cards flipping, sparkles flying.
*   **Haptic Feedback**: (If mobile) Vibration on every step and every tile placement.

### 5. Tech Implications

*   **Engine**: We are using **React Three Fiber (R3F)**.
    *   This is essential for the "Monopoly Go" 3D feel.
    *   HTML/CSS is for the HUD only. The board must be WebGL.
*   **Assets**: We need low-poly, stylized assets. (We will use geometric primitives placeholders first: Cubes for tiles, Spheres for players).

---

## Revised Tech Stack
*   **Core**: React 19 + TypeScript
*   **3D**: React Three Fiber + Drei (for the board)
*   **State**: Zustand (for the game logic)
*   **Physics**: Cannon.js (optional, for dice) or simple animation libraries (Framer Motion) for UI.
