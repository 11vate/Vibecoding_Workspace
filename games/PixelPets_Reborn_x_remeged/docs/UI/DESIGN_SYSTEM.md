# UI Design System: Retro-Future Glitch

## 1. Core Aesthetic Philosophy
**"The Terminal is Alive, and it is Corrupting."**

The UI should feel like a high-tech operating system ("The Grid OS") that is struggling to contain the chaotic energy of the creatures within it.
*   **Base State**: Clean, crisp, 16-bit futuristic interface (Cyan/Dark Blue).
*   **Active State**: When interacting with powerful elements (Fusion, Combat, Black Market), the UI "glitches" — RGB shifts, pixel sorting, and data tearing.

## 2. Color Palette

### The System (Clean)
*   **Grid Black**: `#050510` (Background)
*   **Terminal Green**: `#00FF41` (Success/Safe)
*   **Holo-Cyan**: `#00F3FF` (Primary Text/Borders)
*   **Deep Navy**: `#0A1A2F` (Panel Backgrounds)

### The Glitch (Corrupt)
*   **Error Red**: `#FF003C` (Warning/Attack)
*   **Void Purple**: `#BC13FE` (Mythic/Shadow)
*   **Acid Lime**: `#CCFF00` (Glitch Accents)
*   **Static White**: `#FFFFFF` (High Contrast Highlights)

## 3. Typography
*   **Headers**: *Press Start 2P* or similar high-quality pixel font.
    *   *Usage*: Titles, Rarity Labels, Damage Numbers.
*   **Body**: *Inter* or *Rajdhani* (Tech-sans).
    *   *Usage*: Lore text, Stats, Descriptions.
    *   *Styling*: Uppercase for labels (`HP`, `ATK`), Normal case for lore.

## 4. UI Components

### Containers (The "Window")
*   **Border**: 1px solid `#00F3FF` (Cyan).
*   **Corner Accents**: 4px blocks in corners.
*   **Background**: Semi-transparent Navy (`rgba(10, 26, 47, 0.9)`) with a subtle "scanline" overlay.
*   **Shadow**: Neon glow (`box-shadow: 0 0 10px rgba(0, 243, 255, 0.2)`).

### Buttons (The "Input")
*   **Primary (System)**:
    *   Solid Cyan background, Black text.
    *   *Hover*: Inverts colors + Scanline animation.
*   **Danger (Glitch)**:
    *   Red outline, transparent background.
    *   *Hover*: Text shakes/vibrates + Chromatic aberration effect.

### Inputs
*   **Field**: Dark background, blinking block cursor (`_`).
*   **Focus**: Glows intense Cyan.

## 5. Visual Effects (FX)

### The "CRT" Layer
A global CSS overlay that adds:
1.  **Scanlines**: Subtle horizontal lines.
2.  **Vignette**: Darkened corners.
3.  **Phosphor Glow**: Slight bloom on bright elements.

### The "Glitch" Trigger
Applied to specific elements (e.g., Black Market button, Glitched Pets):
1.  **RGB Split**: Red/Blue channels offset by 2px.
2.  **Slice**: Random horizontal sections of the element shift left/right.
3.  **Noise**: Grainy texture overlay.

## 6. Layout Principles
*   **Grid-Based**: Everything aligns to a strict 8px grid.
*   **Dense Data**: Show numbers! Hex codes, ID hashes, and stat bars should be visible (like a dashboard).
*   **Minimal Padding**: Compact, efficient, maximizing screen real estate for the pixel art.

## 7. Responsive Design (PWA)
*   **Mobile**: Bottom navigation bar (thumb-accessible). Panels slide up from bottom.
*   **Desktop**: Sidebar navigation. Panels expand to fill space. "Dashboard" view.

## 8. Implementation Guide (CSS Variables)
```css
:root {
  /* Colors */
  --c-grid-black: #050510;
  --c-holo-cyan: #00F3FF;
  --c-error-red: #FF003C;
  
  /* Effects */
  --fx-crt-scanline: url('scanline.png');
  --fx-glitch-anim: glitch-skew 1s infinite linear alternate-reverse;
  
  /* Fonts */
  --font-pixel: 'Press Start 2P', monospace;
  --font-tech: 'Rajdhani', sans-serif;
}
```
