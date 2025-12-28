# Open Asset Sources

**Authority Tier**: 2 (Mandatory Process)
**Purpose**: Whitelist of allowed external asset repositories.

## Allowed Sources

### 1. OpenGameArt.org
*   **URL**: `https://opengameart.org`
*   **Allowed Licenses**: CC0 (Public Domain), CC-BY (Attribution), CC-BY-SA (Share Alike - use caution).
*   **Best For**: Sprites, Tilesets, Music, SFX.

### 2. Kenney.nl
*   **URL**: `https://kenney.nl/assets`
*   **Allowed Licenses**: CC0 (Public Domain).
*   **Best For**: UI Packs, Low-poly 3D, Prototyping Sprites.
*   **Note**: The "Gold Standard" for prototyping.

### 3. Itch.io (Free & Open Only)
*   **URL**: `https://itch.io/game-assets/free`
*   **Allowed Licenses**: Must explicitly state CC0, MIT, or similar. "Free" != "Open Source". Check specific asset license.
*   **Best For**: Stylized packs, Indie aesthetics.

### 4. Google Fonts
*   **URL**: `https://fonts.google.com`
*   **Allowed Licenses**: OFL (Open Font License).
*   **Best For**: UI Fonts.

## Forbidden Sources
*   Google Image Search (Copyright risk)
*   Pinterest (Copyright risk)
*   Paid Asset Stores (unless via Mode 3 Ingestion)
*   "Abandonware" sites (Legal ambiguity)

## Usage Protocol
1.  Identify asset need.
2.  Search allowed sources.
3.  Download asset.
4.  Log in `SOURCE_REGISTRY.json`.
5.  Normalize via `asset-system/normalization/`.
