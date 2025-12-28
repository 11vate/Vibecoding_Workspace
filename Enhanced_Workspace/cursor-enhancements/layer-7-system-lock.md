# LAYER 7 — SYSTEM LOCK

**Hard System Boundaries**

This document explicitly lists systems that **CANNOT** be modified by AI assistance without explicit authorization.

---

## LOCKED SYSTEMS

The following systems are **PROHIBITED** from modification:

### Fusion System

**Locked Files:**
- `games/PixelPets_Reborn_Merged/src/services/fusion/enhancedFusionEngine.ts`
- `games/PixelPets_Reborn_Merged/src/services/fusion/fusionEngine.ts`
- `games/PixelPets_Reborn_Merged/src/services/fusion/proceduralFusion.ts`
- `games/PixelPets_Reborn_Merged/src/services/fusion/rarityConstraints.ts`
- `games/PixelPets_Reborn_Merged/src/services/fusion/stoneEffects.ts`

**Locked Rules:**

1. **Fusion Requirements:**
   - Must require exactly 2 pets + 2 stones
   - Parents are consumed permanently
   - No exceptions, no single-input fusions

2. **Rarity Escalation Formula:**
   ```
   Base Tier = round((PetA Tier + PetB Tier) / 2)
   + Stone Bonus (Tier I: +0, Tier II: +0.25, Tier III: +0.5, Tier IV: +1, Tier V: +1.5)
   + Same-rarity bonus: +10% upgrade chance if parents are same rarity
   + Chaos variance: 3-7% glitch chance
   ```

3. **Fusion Outcomes:**
   - Result is always unique (no duplicates)
   - Fusion is irreversible
   - No rerolls or undo
   - No preview of exact outcome

4. **Ability Generation:**
   - Must follow rarity constraints
   - Cannot exceed slot limits per rarity
   - Must maintain uniqueness

**Allowed Modifications:**
- UI presentation of fusion process
- Visual feedback and animations
- UX flow improvements
- Error messages and validation UI

---

### Combat System

**Locked Files:**
- `games/PixelPets_Reborn_Merged/src/services/combat/combatEngine.ts`
- `games/PixelPets_Reborn_Merged/src/services/combat/statCalculator.ts`
- `games/PixelPets_Reborn_Merged/src/services/combat/abilityProcessor.ts`
- `games/PixelPets_Reborn_Merged/src/services/combat/elementalSystem.ts`
- `games/PixelPets_Reborn_Merged/src/services/combat/statusEffects.ts`
- `games/PixelPets_Reborn_Merged/src/services/combat/domainEffects.ts`

**Locked Rules:**

1. **Damage Calculation:**
   - Formulas are deterministic and fixed
   - Elemental effectiveness chart cannot be changed
   - Stat calculations follow fixed formulas

2. **Turn Order:**
   - Based on speed stat
   - Cannot be modified without affecting game balance

3. **Status Effects:**
   - Effect rules and durations are fixed
   - Stacking rules are locked
   - Removal conditions are fixed

4. **Field Effects:**
   - Field modification rules are locked
   - Interaction between fields is fixed

**Allowed Modifications:**
- Visual representation of combat
- Animation timing and effects
- UI feedback and indicators
- Battle result presentation

---

### Pet Rarity System

**Locked Files:**
- `games/PixelPets_Reborn_Merged/src/utils/rarity.ts`
- `games/PixelPets_Reborn_Merged/src/types/pet.ts` (rarity-related types)

**Locked Rules:**

1. **Rarity Configuration:**
   - Stat ranges per rarity are fixed (see `RARITY_CONFIG`)
   - Ability slot counts per rarity are fixed
   - Rarity colors are fixed

2. **Rarity Progression:**
   - Summon costs per rarity are fixed
   - Higher rarity = lower essence cost (design lock)
   - Drop rates are fixed

3. **Rarity Enum:**
   - BASIC, RARE, SR, LEGENDARY, MYTHIC, PRISMATIC, OMEGA
   - Cannot add or remove rarities

**Allowed Modifications:**
- Visual presentation of rarity
- Rarity indicator UI components
- Color gradients and effects (presentation only)

---

### Ability Generation System

**Locked Files:**
- `games/PixelPets_Reborn_Merged/src/services/fusion/creativeAbilityGeneration.ts`
- `games/PixelPets_Reborn_Merged/src/services/fusion/abilityGrammar.ts`
- `games/PixelPets_Reborn_Merged/src/services/fusion/abilityMutator.ts`
- `games/PixelPets_Reborn_Merged/src/data/abilities.ts`

**Locked Rules:**

1. **Ability Constraints:**
   - Must respect rarity slot limits
   - Cannot exceed maximum slots per type
   - Must maintain uniqueness

2. **Ability Generation:**
   - Fusion modifies abilities within constraints
   - Cannot generate abilities outside rarity bounds
   - Must follow ability grammar rules

**Allowed Modifications:**
- Ability display and formatting
- Ability tooltip UI
- Ability icon presentation

---

### AI Generation Pipeline

**Locked Files:**
- `games/PixelPets_Reborn_Merged/src/services/ai/ollamaService.ts`
- `games/PixelPets_Reborn_Merged/src/services/ai/aiValidator.ts`
- `games/PixelPets_Reborn_Merged/src/services/ai/fusionPrompts.ts`

**Locked Rules:**

1. **AI Validation:**
   - Validation rules cannot be relaxed
   - Uniqueness constraints must be maintained
   - Fallback to procedural generation must always work

2. **AI Prompts:**
   - Core prompt structure is locked
   - Validation requirements are fixed

**Allowed Modifications:**
- Error handling UI
- Loading states and feedback
- Caching presentation

---

### Economy System

**Locked Files:**
- `games/PixelPets_Reborn_Merged/src/stores/playerStore.ts`
- Economy-related logic in stores

**Locked Rules:**

1. **Essence System:**
   - Essence can only be obtained from dungeons
   - Essence costs are fixed per rarity
   - No direct essence purchases

2. **Economy Values:**
   - Summon costs are fixed
   - No pay-to-win mechanics
   - Economy balance cannot be changed

**Allowed Modifications:**
- Essence display UI
- Cost presentation
- Transaction feedback

---

### PvP Matchmaking

**Locked Files:**
- `games/PixelPets_Reborn_Merged/src/services/pvp/opponentGenerator.ts`
- PvP rating calculation logic

**Locked Rules:**

1. **Matchmaking Logic:**
   - Rating-based matching is fixed
   - Opponent generation rules are locked

2. **Rating System:**
   - Rating calculation formulas are fixed
   - Win/loss adjustments are locked

**Allowed Modifications:**
- Matchmaking UI
- Rating display
- Opponent preview presentation

---

## PRESENTATION-ONLY MODIFICATION RULE

**AI may modify:**
- UI components and styling
- Visual feedback and animations
- UX flow and navigation
- Data presentation and formatting
- Error messages and validation UI
- Loading states and transitions

**AI may NOT modify:**
- Core game logic
- Balance formulas
- System rules and constraints
- Data models and schemas
- Business logic and algorithms

---

## HOW TO REQUEST SYSTEM CHANGES

If a system change is genuinely needed:

1. **Identify the specific system** and locked file
2. **State the reason** for the change
3. **Explain the impact** on game balance/design
4. **Propose the change** with clear rationale
5. **Wait for explicit authorization** before proceeding

**Do not:**
- Make "small" system changes "while you're at it"
- Work around locks by modifying related files
- Assume permission from vague requests

---

## ENFORCEMENT

When reviewing AI-suggested changes:

1. Check if changes touch locked files
2. Verify changes are presentation-only
3. Confirm no system rules are modified
4. Validate that constraints are respected

If a change violates system locks:
- Reject the change
- Explain which lock was violated
- Suggest presentation-only alternatives

---

**END OF LAYER 7**

