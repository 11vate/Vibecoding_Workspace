# Destiny's Turn: Implementation Roadmap

## Phase 1: Foundation (The Skeleton)
*   [ ] **Project Init**: Verify Vite/React/TS setup.
*   [ ] **Store Setup**: Initialize Zustand store with basic GameState schema.
*   [ ] **Grid Renderer**: Create a basic 8x8 grid component that renders tiles based on state.
*   [ ] **Debug Tools**: Add a panel to manually change tiles/states for testing.

## Phase 2: The Two Boards (The Body)
*   [ ] **Circle Implementation**: Create the linear/circular track data structure.
*   [ ] **Player Movement**: Implement Dice Roll & Token movement on the Circle.
*   [ ] **Theme Engine V1**: Implement the "Ocean" theme (Water tiles).
*   [ ] **State Engine V1**: Implement "Calm" vs "Storm" logic.

## Phase 3: Interaction Layer (The Hands)
*   [ ] **Resource System**: Tracking Materials, Relics, Favors.
*   [ ] **Relic Placement**: Logic for Player (on Circle) -> placing Item (on Square).
*   [ ] **Tile Manipulation**: Implement basic actions (Rotate tile, Push object).
*   [ ] **Reaction Queue**: Build the system that plays back board changes after turn end.

## Phase 4: The Living World (The Soul)
*   [ ] **Theme Switching**: Implement the "Transformation" when Master Die A is rolled.
    *   Data migration (Old Relics -> New Relics).
    *   Terrain generation.
*   [ ] **The Rabbit**: Spawning logic, hiding spots, and the "Reach Check" algorithm.
*   [ ] **Boss AI**: Basic deterministic movement for the Kraken.

## Phase 5: Visuals & Polish (The Skin)
*   [ ] **Animations**: Framer Motion for tile flips, token hops, and UI transitions.
*   [ ] **Styling**: Apply the "Magical/Abstract" aesthetic.
*   [ ] **Sound**: (Optional) Ambient tracks for themes.
*   [ ] **Turn Polish**: Smooth transitions between Player Turn -> World Reaction -> Next Player.

## Phase 6: Content Expansion (The Magic)
*   [ ] **Add Theme**: Electrum Carnival.
*   [ ] **Add Personas**: Unique abilities for Pyromancer/Thief.
*   [ ] **Save/Load**: Persist session state to LocalStorage.
