# Animation Alignment Protocol

**Authority Tier**: 2 (Mandatory Process)
**Purpose**: Standardize animation timing and states across entities.

## Standard States
All sentient entities must support these base states:
1.  **Idle** (Loop)
2.  **Move/Walk** (Loop)
3.  **Attack** (One-shot)
4.  **Hit/Hurt** (One-shot)
5.  **Die** (One-shot, ends on last frame)

## Timing Standards
*   **FPS Base**: Animations are authored at **12 FPS** (Pixel Art) or **60 FPS** (Smooth).
*   **Frame Duration**:
    *   Fast Action: 2-4 frames (at 60fps) or 1 frame (at 12fps).
    *   Anticipation: 4-8 frames.
    *   Recovery: 4-8 frames.

## Synchronization
*   **Walk Cycles**: Should be normalized to **8 frames** or **4 frames** to sync with movement speed.
*   **Attack Tells**: Hit frame should be explicitly marked in metadata (e.g., `attack_frame: 3`).

## Naming Convention
`[entity_id]_[state]_[direction]_[frame_number].png`
*   Example: `hero_walk_down_01.png`

## Data Schema (JSON Sidecar)
Every animation must have a corresponding JSON definition:
```json
{
  "name": "walk",
  "fps": 12,
  "loop": true,
  "frames": [0, 1, 2, 3],
  "events": {
    "1": "footstep_sfx",
    "3": "footstep_sfx"
  }
}
```
