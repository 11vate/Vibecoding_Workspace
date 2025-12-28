# Asset Specification Template

**Authority Tier**: 2 (Mandatory Process)
**Usage**: Required for ANY asset creation or retrieval request.

## Asset Request Spec

### 1. Context
*   **Project**: [Project Name]
*   **Mechanic Binding**: [Which game mechanic requires this?]
*   **Entity**: [Name of entity, e.g., "Player", "Enemy_Slime"]

### 2. Sourcing
*   **Requested Mode**: [Mode 1 | Mode 2 | Mode 3]
*   **Justification**: [Why this mode?]

### 3. Technical Specifications
*   **Type**: [Sprite | Audio | Model | Texture]
*   **Format**: [PNG | WAV | GLB]
*   **Dimensions/Duration**: [e.g., 64x64px]
*   **Grid/Unit Size**: [e.g., 32px]

### 4. Visual/Audio Requirements
*   **Style**: [Pixel Art | Vector | Low Poly | Realistic]
*   **Palette**: [Hex codes or Palette Name]
*   **States Required**:
    *   [State 1, e.g., Idle] (Frames: X, Loop: Yes/No)
    *   [State 2, e.g., Run] (Frames: Y, Loop: Yes/No)
*   **Reference**: [Optional reference description]

### 5. Normalization Rules
*   **Anchor Point**: [Center | Bottom-Center | Top-Left]
*   **Padding**: [Pixels]
*   **Collision Shape**: [Box | Circle | Polygon]

---
**Approval Status**: [Pending | Approved | Rejected]
