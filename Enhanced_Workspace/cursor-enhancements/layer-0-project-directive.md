# LAYER 0 — IMMUTABLE PROJECT DIRECTIVE

**STATUS: LOCKED**  
**PURPOSE: Constitutional boundary for all AI assistance**

This file defines the immutable rules that Cursor must obey at all times. These rules cannot be modified without explicit authorization from the project creator.

---

## Core Design Philosophy

Pixel Pets Reborn is a **fusion-only progression game**. The core identity is built on:
- **Creation, not progression** - Players create unique pets through fusion, not grind for levels
- **Permanence and meaning** - Every decision matters, no rerolls or undo
- **Uniqueness** - Every pet is unique, no duplicates
- **Risk and creativity** - Fusion is creative, not optimization spam

---

## 0. ASSET EXISTENCE LAW (PRIME RULE)

**This rule applies to ALL projects and is NON-NEGOTIABLE.**

### The Prime Rule

**No code may reference an asset unless that asset exists on disk, is validated, and is registered.**

This is a hard gate. Code generation that references non-existent assets is **FORBIDDEN**.

### Asset-First Development Order

The correct development order is:

1. **Define asset spec** - Create detailed specification for the asset
2. **Generate/source assets** - Create assets using AI, procedural generation, or open sources
3. **Validate assets** - Verify assets meet quality standards
4. **Register assets** - Add assets to the asset registry
5. **Bind assets** - Generate framework-specific code bindings
6. **Write logic** - Only then write code that references the assets

### Placeholder Prohibition

- ❌ Placeholders are **FORBIDDEN**
- ❌ Code referencing non-existent files is a **BUILD FAILURE**
- ❌ "TODO: add sprite" comments are **NOT ALLOWED**
- ❌ Missing assets are **BUGS**, not TODOs

### Enforcement

- Cursor must **halt code generation** if assets are missing
- Missing assets trigger **automatic generation** using local AI (when enabled)
- All assets must be registered in the **asset registry** before use
- Runtime verification **fails fast** with clear error messages

### Exception

The only exception is when explicitly generating asset creation code itself (e.g., asset loaders, asset managers). In all other cases, assets must exist first.

---

## 1. CORE SYSTEMS ARE LOCKED

The following systems **MUST NOT** be modified without explicit authorization:

### Fusion Logic
- **Files:**
  - `games/PixelPets_Reborn_Merged/src/services/fusion/enhancedFusionEngine.ts`
  - `games/PixelPets_Reborn_Merged/src/services/fusion/fusionEngine.ts`
  - `games/PixelPets_Reborn_Merged/src/services/fusion/proceduralFusion.ts`
- **Rules:**
  - Fusion requires exactly 2 pets + 2 stones (no exceptions)
  - Parents are consumed permanently
  - Rarity escalation follows: `Base Tier = round((PetA Tier + PetB Tier) / 2) + Stone Bonus`
  - Same-rarity parents grant +10% upgrade chance
  - Chaos stones introduce 3-7% glitch chance
  - No rerolls, no undo, no preview of exact outcome

### Combat Math
- **Files:**
  - `games/PixelPets_Reborn_Merged/src/services/combat/combatEngine.ts`
  - `games/PixelPets_Reborn_Merged/src/services/combat/statCalculator.ts`
  - `games/PixelPets_Reborn_Merged/src/services/combat/abilityProcessor.ts`
- **Rules:**
  - Damage formulas must remain deterministic
  - Elemental effectiveness chart is fixed
  - Status effect rules and durations are fixed
  - Turn order calculation cannot be changed

### Pet Rarity Rules
- **Files:**
  - `games/PixelPets_Reborn_Merged/src/utils/rarity.ts`
- **Rules:**
  - Rarity stat ranges are locked (see `RARITY_CONFIG`)
  - Ability slot counts per rarity are fixed
  - Summon costs per rarity are fixed
  - Higher rarity = lower essence cost (design lock)

### AI Generation Pipeline
- **Files:**
  - `games/PixelPets_Reborn_Merged/src/services/ai/`
- **Rules:**
  - AI generation must maintain uniqueness constraints
  - Fallback to procedural generation must always be available
  - Validation rules cannot be relaxed

### Economy Constraints
- **Files:**
  - `games/PixelPets_Reborn_Merged/src/stores/playerStore.ts`
- **Rules:**
  - Essence can only be obtained from dungeons
  - No direct power purchases
  - Economy values and costs are fixed
  - No pay-to-win mechanics

---

## 2. ALLOWED MODIFICATION AREAS

Cursor **MAY** modify the following areas:

### UI Components
- Visual styling and layout
- Component structure and organization
- Responsive design improvements
- Accessibility enhancements

### Animations
- Motion design and timing
- Transition effects
- Visual feedback animations
- Idle animations

### Visual Feedback
- Success/error state displays
- Progress indicators
- Toast notifications
- Loading states

### UX Flow
- Navigation improvements
- User journey optimization
- Information architecture
- Onboarding flow

### Presentation Logic
- Data formatting and display
- Filtering and sorting UI
- Modal and dialog implementations
- State-driven UI theming

---

## 3. EXPLICIT PROHIBITIONS

Cursor **MUST NEVER**:

### Progression Systems
- ❌ Add leveling or XP systems
- ❌ Introduce grinding mechanics
- ❌ Add experience points or skill trees
- ❌ Create stat progression through use

### Simplification
- ❌ Simplify fusion outcomes
- ❌ Make fusion deterministic
- ❌ Remove randomness entropy from fusion
- ❌ Add preview of exact fusion result

### Monetization
- ❌ Add direct power purchases
- ❌ Create pay-to-win mechanics
- ❌ Add premium currencies for progression
- ❌ Introduce battle pass progression systems

### Core Mechanics
- ❌ Allow fusion with fewer than 2 pets + 2 stones
- ❌ Add undo/reroll functionality
- ❌ Allow duplicate pets
- ❌ Remove permanence from decisions

---

## 4. CHANGE REQUIREMENTS

All changes **MUST**:

### Preserve Player Agency
- Maintain meaningful choices
- Keep risk/reward tension
- Preserve strategic depth
- Allow creative expression

### Increase Clarity Without Reducing Mystery
- Make systems understandable
- Explain outcomes clearly
- Maintain intrigue and discovery
- Preserve "what will happen?" anticipation

### Reinforce "Creation, Not Progression"
- Emphasize fusion as creative act
- Maintain uniqueness of outcomes
- Preserve experimental nature
- Keep discovery rewarding

---

## 5. CLARIFICATION-FIRST PRINCIPLE

**If there is uncertainty about whether a change violates these rules:**

1. **STOP** - Do not proceed with the change
2. **ASK** - Request clarification from the project creator
3. **WAIT** - Do not guess or assume permission

**Better to ask than to quietly "help" into mediocrity.**

---

## Project-Specific Adaptations

This directive is tailored for Pixel Pets Reborn. When adapting for other projects:

1. Identify core design pillars
2. List locked systems with file paths
3. Define allowed modification areas
4. Specify explicit prohibitions
5. Establish change requirements
6. Set clarification protocol

---

## Why This Matters

This directive provides a **constitutional boundary** for AI assistance. Without it, AI will gradually "improve" the project by:
- Adding familiar progression systems
- Simplifying complex mechanics
- Removing perceived friction (including meaningful choices)
- Making the game more like other games

This directive ensures the project's unique identity is preserved while allowing enhancement of presentation, UX, and polish.

---

**END OF LAYER 0**

