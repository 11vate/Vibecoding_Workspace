# Sprite Normalization Rules

**Authority Tier**: 2 (Mandatory Process)
**Purpose**: Ensure all sprites are plug-compatible with the game engine.

## Base Units
*   **Pixel Unit**: 1 Unit = 1 Pixel (for Pixel Art games).
*   **Grid Size**: Standard is **32x32** or **16x16**. All sprites must be multiples of the base grid.
*   **Scaling**: All assets must be exported at **1x scale**. Scaling happens at runtime.

## Anchor Points
*   **Ground Entities**: Bottom-Center (x: 0.5, y: 1.0).
*   **Flying Entities**: Center (x: 0.5, y: 0.5).
*   **UI Elements**: Center (x: 0.5, y: 0.5) or Top-Left (x: 0.0, y: 0.0) depending on widget type.
*   **Projectiles**: Center (x: 0.5, y: 0.5).

## Dimensions & Padding
*   **Power of Two**: Textures SHOULD be POT (32, 64, 128, 256) for best GPU performance, though not strictly required for modern 2D engines.
*   **Padding**:
    *   **Sprite Sheets**: 1px extrusion or 2px padding between frames to prevent bleeding.
    *   **Single Sprites**: Trim transparent whitespace unless specific pivot alignment is needed.

## Format Standards
*   **File Type**: PNG (32-bit with alpha).
*   **Color Profile**: sRGB.
*   **Metadata**: Filename should include state and frame info if not in a sheet (e.g., `player_idle_01.png`).

## Validation Checklist
1.  Is the sprite grid-aligned?
2.  Is the anchor point correctly defined in metadata?
3.  Are colors within the project palette?
4.  Is the background fully transparent?
