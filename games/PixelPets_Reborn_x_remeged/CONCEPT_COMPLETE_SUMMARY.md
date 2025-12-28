# Pixel Pets Reborn x Remeged - Complete Concept Summary

**Comprehensive game concept documentation to ensure full understanding before implementation**

---

## Executive Summary

**Pixel Pets Reborn x Remeged** is a **Cinematic Pixel PvP Monster Summoner** that revolutionizes progression through AI-driven fusion. The game eliminates traditional grinding (no levels, no XP, no stat training) in favor of permanent, meaningful fusion decisions. Every fused pet is mechanically, visually, and narratively unique.

**Core Innovation:** Fusion = Recompilation. Players are Compiler Operators in The Grid (a decaying super-server), transforming Data Sprites through irreversible fusion processes.

**Platform:** Mobile-first PWA (portrait orientation)  
**Primary Progression:** AI-driven fusion (2 Pets + 2 Stones → 1 Unique Pet)  
**Setting:** The Grid - a decaying super-server  
**Player Identity:** Compiler Operator  

---

## Core Philosophy (IMMUTABLE)

### Progression Philosophy

**No Traditional Progression:**
- ❌ No levels
- ❌ No XP
- ❌ No stat training
- ❌ No duplicate enhancement

**Only Three Ways Power Increases:**
1. **Higher rarity summons** (via harder dungeons)
2. **Pet + Pet + Stone + Stone fusion** (strategic creativity)
3. **Strategic team composition** & battlefield control

### Permanence Principle

- Every entity is permanent
- Every outcome has lineage
- Every generation has consequences
- Optimize for meaning density, not throughput
- The game behaves like a museum of outcomes, not a reward treadmill

### Uniqueness Enforcement

- Hash-based identity
- Lineage-recorded causality
- Cached AI outputs
- No regeneration or reroll pathways
- Duplication is treated as data corruption, not reuse

---

## World & Lore

### The Grid

**Concept:** A decaying super-server - a vast digital realm where data has taken life.

**Characteristics:**
- Decaying infrastructure
- Corrupted sectors
- Stable zones
- Experimental areas
- Glitch anomalies

**Atmosphere:**
- Twilight darkness (deep navy blues: #1a1a2e, #16213e, #0f3460)
- Neon glows (cyan #00ffff, magenta #ff00ff)
- Technical aesthetic
- Mystical undercurrents

### Compiler Operators

**Role:** Players who recompile data structures (fuse pets)

**Identity:**
- Technical but creative
- Experimenters
- Collectors
- Strategists

**Goals:**
- Discover unique fusions
- Build powerful teams
- Master The Grid
- Compile perfect pets

### Data Sprites (Pixel Pets)

**Nature:** Digital lifeforms born from code

**Characteristics:**
- Each pet is a unique data structure
- Fusion = recompilation of data
- Visual appearance = data visualization
- Abilities = compiled functions
- Lore = code comments and documentation

---

## Pet System

### Pet Families (10 Families)

Each family has **15 base pets** (150 total):
- 5 Basic
- 3 Rare
- 3 SR
- 2 Legendary
- 2 Mythic

**Families:**

1. **PYRO_KIN (Flameling Kin)** - Fire
   - Primary: #FF4400, Secondary: #FF8800, Accent: #FFCC00
   - Themes: Fire, Lava, Embers, Magma, Phoenix, Dragons

2. **AQUA_BORN** - Water
   - Primary: #0088FF, Secondary: #00CCFF, Accent: #00FFFF
   - Themes: Water, Ice, Tides, Storms, Leviathans, Serpents

3. **TERRA_FORGED** - Earth
   - Primary: #8B6F47, Secondary: #90EE90, Accent: #D2B48C
   - Themes: Earth, Stone, Crystals, Mountains, Golems, Titans

4. **VOLT_STREAM** - Lightning
   - Primary: #FFD700, Secondary: #00BFFF, Accent: #FFFF44
   - Themes: Lightning, Electricity, Storms, Sparks, Thunder

5. **SHADOW_VEIL** - Dark/Shadow
   - Primary: #6600AA, Secondary: #1a1a2e, Accent: #4B0082
   - Themes: Shadow, Void, Night, Phantoms, Reapers

6. **LUMINA** - Light
   - Primary: #FFFFFF, Secondary: #FFD700, Accent: #FFFACD
   - Themes: Light, Holy, Divine, Angels, Celestial

7. **STEEL_WORKS** - Metal
   - Primary: #C0C0C0, Secondary: #708090, Accent: #4682B4
   - Themes: Metal, Steel, Machines, Constructs, Golems

8. **ARCANE_RIFT** - Magic/Arcane
   - Primary: #AA00FF, Secondary: #FF00FF, Accent: #FF69B4
   - Themes: Magic, Arcane, Runes, Spells, Mystical

9. **AERO_FLIGHT** - Air
   - Primary: #87CEEB, Secondary: #B0E0E6, Accent: #E0F6FF
   - Themes: Air, Wind, Sky, Clouds, Wings, Flight

10. **WEIRDOS** - Chaos
    - Primary: #FF00FF, Secondary: #00FF00, Accent: #FF1493
    - Themes: Chaos, Mutant, Unpredictable, Bizarre, Experimental

### Rarity System (7 Tiers)

| Rarity | Tier | Color | HP Range | ATK Range | DEF Range | SPD Range | Passives | Actives | Ultimates | Summon Cost | Drop Rate |
|--------|------|-------|----------|-----------|-----------|-----------|----------|---------|-----------|-------------|-----------|
| BASIC | 0 | #808080 | 120-180 | 18-28 | 12-22 | 55-75 | 0 | 2 | 0 | 50 Basic | 45% |
| RARE | 1 | #0088ff | 200-280 | 35-50 | 28-45 | 65-85 | 1 | 2 | 0 | 30 Rare | 30% |
| SR | 2 | #aa00ff | 320-440 | 55-78 | 48-70 | 75-95 | 2 | 2 | 0 | 20 SR | 15% |
| LEGENDARY | 3 | #ffaa00 | 550-750 | 88-120 | 75-110 | 85-105 | 2 | 3 | 1 | 15 Legendary | 8% |
| MYTHIC | 4 | #ff00ff | 950-1300 | 140-185 | 120-165 | 95-115 | 3 | 3 | 1 | 10 Mythic | 1.9% |
| PRISMATIC | 5 | #ffffff | 1400-1800 | 200-260 | 180-230 | 110-125 | 4 | 4 | 2 | 0 (fusion-only) | 0.1% |
| OMEGA | 6 | #ff0080 | 2000-2500 | 300-400 | 250-350 | 130-150 | 5 | 5 | 3 | 0 (fusion-only) | 0.01% |

**Design Lock:** Higher rarity = Less essence needed (difficulty is in acquiring essence, not hoarding)

---

## Fusion System

### Core Formula (MANDATORY)

**2 Pets + 2 Stones → 1 Unique Pet**

**Inputs (No Exceptions):**
- Pet A (consumed permanently)
- Pet B (consumed permanently)
- Stone 1 (consumed permanently)
- Stone 2 (consumed permanently)

### Rarity Escalation Logic

```
Base Tier = round((PetA Tier + PetB Tier) / 2)
+ Stone Bonus (Tier I: +0, Tier II: +0.25, Tier III: +0.5, Tier IV: +1, Tier V: +1.5)
+ Same-rarity bonus: +10% upgrade chance if parents are same rarity
+ Chaos variance: 3-7% glitch chance (if chaos stones used)
```

**Upgrade Chance:**
- Base: 15%
- Same-rarity parents: +10%
- Tier IV+ stones: +5% each
- Chaos stones: +3-7% glitch chance (rule-breaking abilities)

### Fusion Intent System

Player-selected intent influences fusion outcome:

1. **DOMINANCE**
   - Favors: pressure, control, anti-heal
   - Ability bias: damage, control, debuff, anti-heal, pressure
   - Personality: aggressive, controlling, relentless, predatory

2. **RESILIENCE**
   - Favors: mitigation, recursion, cleanse
   - Ability bias: heal, shield, cleanse, mitigation, recursion
   - Personality: enduring, protective, adaptive, steadfast

3. **VOLATILITY**
   - Favors: burst, risk, self-damage, chaos
   - Ability bias: burst, chaos, self-damage, risk, explosive
   - Personality: unpredictable, reckless, explosive, chaotic

4. **SYMBIOSIS**
   - Favors: ally-dependent triggers
   - Ability bias: buff, share, transfer, ally-trigger, cooperative
   - Personality: cooperative, harmonious, supportive, interdependent

5. **CORRUPTION**
   - Favors: delayed payoff, curses, inversion
   - Ability bias: curse, delayed, inversion, decay, transformation
   - Personality: patient, deceptive, corrupting, transformative

### Element Interactions

Element combinations create new concepts (not just "Firewater"):

- Fire + Water = Steam (pressure, expansion, heat transfer)
- Fire + Earth = Lava (molten, eruption, solidification)
- Water + Earth = Mud (absorption, erosion, fertility)
- Lightning + Water = Storm (electrocution, turbulence, discharge)
- Fire + Lightning = Plasma (ionization, energy, explosion)
- Shadow + Light = Twilight (balance, duality, harmony)
- Fire + Shadow = Ash (corruption, decay, void)
- Water + Light = Prism (refraction, rainbow, clarity)
- And more...

### Fusion Outcomes

**Resulting Pet:**
- Inherits blended stat profiles (±15% variance)
- Gains evolved or hybrid abilities (within rarity slot limits)
- Gains new AI-generated name (linguistic blending + lore rules)
- Gains new AI-generated lore (fusion story, personality)
- Gains procedurally generated sprite (visual tag blending, family palettes)
- Has recorded fusion lineage (generation, parent IDs, stones, seed, timestamp)
- Is permanently unique (hash-based identity)

### Fusion History

Every fused pet records:
- Generation number (how many fusions deep)
- Parent IDs (both parents)
- Stones used (both stones)
- Fusion seed (for reproducibility)
- Mutation count (chaos/glitch events)
- Timestamp

### Fusion Design Pillar

- **Fusion is irreversible and meaningful**
- Every fusion is a creative decision, not optimization spam
- Parents are consumed permanently
- No rerolls, no undo
- No preview of exact outcome (only ranges)

---

## Stone System

### Stone Types (8 Elements)

| Stone Type | Element | Color | Domain Effect (Tier V) |
|------------|---------|-------|------------------------|
| Ruby | Fire | #FF0000 | Inferno Domain - All fire abilities +30% damage |
| Sapphire | Water | #0000FF | Tidal Domain - All allies heal 5% HP per turn |
| Emerald | Nature | #00FF00 | Nature Domain - All allies regenerate energy +20% |
| Topaz | Lightning | #FFFF00 | Storm Domain - All allies gain +15% speed |
| Amethyst | Dark | #8000FF | Shadow Domain - All enemies take +20% dark damage |
| Pearl | Light | #FFC0CB | Light Domain - All allies gain +10% damage reduction |
| Onyx | Shadow | #000000 | Void Domain - All enemies lose 5% max HP per turn |
| Opal | Chaos | #FF00FF | Chaos Domain - Random effects trigger each turn |

### Stone Tiers (5 Tiers)

| Tier | Name | Stat Multiplier | Elemental Power | Rarity Bonus |
|------|------|----------------|-----------------|--------------|
| I | Common | 5% | 10 | +0 |
| II | Rare | 10% | 20 | +0.25 |
| III | Epic | 15% | 30 | +0.5 |
| IV | Legendary | 20% | 40 | +1.0 |
| V | Mythic | 25% | 50 | +1.5 |

### Stone Effects in Fusion

**Stat Bonuses:**
- Formula: `Base Stat × (1 + (Stone1 Multiplier + Stone2 Multiplier) / 2)`
- Applied after parent stat averaging and variance

**Elemental Synergy:**
- **Same element:** Amplification (stronger effects)
- **Complementary:** Hybrid effects (Fire + Lightning = Overheat Chain)
- **Opposing:** Stabilization (Light + Dark = Judgement Cycle)
- **Chaos:** Mutation + glitch chance (3-7%)

**Domain Effects:**
- Triggered when both stones are Tier V
- Create persistent battlefield modifications
- Last entire battle
- Stack with other effects

### Lithosynthesis (Stone Upgrading)

Combine stones of same type to upgrade tier:
- Tier I → II: 2 stones
- Tier II → III: 3 stones
- Tier III → IV: 3 stones
- Tier IV → V: 3 stones

---

## Combat System

### Battle Structure

- **4v4 Auto-Battle** (player team vs enemy team)
- **Front Row (2):** Tanks, bruisers (take more damage)
- **Back Row (2):** DPS, support (deal more damage)
- **Turn order:** Determined by SPD stat at battle start (higher = acts first)
- **Turn limit:** 50 turns maximum (draw if exceeded)
- **Victory condition:** All pets on one team defeated

### Battle Flow

1. **Initialization:**
   - Convert pets to CombatPets (add currentHp, currentEnergy, statusEffects, buffs, debuffs)
   - Set initial energy to 50
   - Set all cooldowns to 0
   - Calculate turn order by speed
   - Assign positions (index 0-1 = front, 2-3 = back)

2. **Turn Execution:**
   - Get current actor from turn order
   - Check if alive (currentHp > 0)
   - Tick status effects (damage over time, duration decrease)
   - Check if stunned/frozen (skip turn if so)
   - Apply domain effects
   - Apply passive abilities (start of turn triggers)
   - Decrease cooldowns by 1
   - Select ability (AI prioritization)
   - Execute ability (spend energy, set cooldown)
   - Process results (damage, healing, status effects)
   - Update energy (spend cost + gain 20)
   - Check victory conditions
   - Move to next actor
   - Increment turn if all actors acted

### Core Combat Stats

1. **HP (Health Points)**
   - Formula: `BaseHP × (1 + StoneHP%)`
   - When HP reaches 0, pet is defeated
   - Current HP tracked per pet in battle

2. **ATK (Attack)**
   - Physical or Elemental damage
   - Used in damage calculations
   - Scales with ability power

3. **DEF (Defense)**
   - Flat reduction + % mitigation
   - Reduces incoming damage
   - Formula: `Final Damage × (1 - DEF%)`

4. **SPD (Speed)**
   - Turn priority (0-200)
   - Higher speed = acts first
   - Determines turn order at battle start

5. **Energy System**
   - Start: 50 energy per pet
   - Gain: +20 energy per turn
   - Max: 100 energy
   - Abilities cost energy (varies by ability)
   - Cannot use ability if insufficient energy

6. **Cooldown System**
   - Active abilities have cooldowns
   - Cooldowns decrease by 1 each turn
   - Cannot use ability if on cooldown (currentCooldown > 0)
   - Ultimate abilities have longer cooldowns (5+ turns)

7. **CRIT (Critical Hit)**
   - % chance (cap 50%)
   - Doubles damage on crit
   - Calculated per ability use

8. **RES (Resistance)**
   - Status resistance (cap 60%)
   - Reduces chance of status effects
   - Applied to status-inflicting abilities

### Damage Formula

```
Final Damage = 
  (Base Ability Power × ATK Modifier × Element Multiplier)
  × (1 − Target DEF%)
  × (1 − Target RES if status-based)
  × (1.5 if critical hit)
```

### Elemental Effectiveness Chart

| Attacker → Defender | Fire | Water | Earth | Lightning | Shadow | Light |
|---------------------|------|-------|-------|-----------|--------|-------|
| Fire | 1.0 | 0.5 | 1.5 | 1.0 | 1.0 | 1.0 |
| Water | 1.5 | 1.0 | 1.5 | 0.5 | 1.0 | 1.0 |
| Earth | 0.5 | 0.5 | 1.0 | 1.5 | 1.0 | 1.0 |
| Lightning | 1.0 | 1.5 | 0.5 | 1.0 | 1.5 | 1.0 |
| Shadow | 1.0 | 1.0 | 1.0 | 0.5 | 1.0 | 1.5 |
| Light | 1.0 | 1.0 | 1.0 | 1.0 | 1.5 | 1.0 |

### Ability System

#### Ability Types

1. **Passive Abilities**
   - Always active
   - No energy cost
   - No cooldown
   - Examples: Stat boosts, aura effects, conditional triggers

2. **Active Abilities**
   - Require energy to use
   - Have cooldowns
   - Target selection required
   - Examples: Damage, healing, buffs, debuffs

3. **Ultimate Abilities**
   - High energy cost (80-100)
   - Long cooldowns (5+ turns)
   - Powerful effects
   - Only available at Legendary+ rarity
   - Examples: Massive damage, team-wide effects, terrain modification

#### Ability Slot Structure by Rarity

| Rarity | Passives | Actives | Ultimates |
|--------|----------|---------|-----------|
| Basic | 0 | 2 | 0 |
| Rare | 1 | 2 | 0 |
| SR | 2 | 2 | 0 |
| Legendary | 2 | 3 | 1 |
| Mythic | 3 | 3 | 1 |
| Prismatic | 4 | 4 | 2 |
| Omega | 5 | 5 | 3 |

#### Status Effects

| Status | Effect | Element |
|--------|--------|---------|
| BURN | Damage over time | Fire |
| POISON | Damage over time | Nature/Dark |
| FREEZE | Skip turn | Water/Ice |
| STUN | Skip turn | Lightning |
| BLEED | Damage over time | Physical |
| SLOW | Reduced speed | Various |
| HASTE | Increased speed | Various |
| SHIELD | Damage absorption | Light/Defensive |
| STEALTH | Cannot be targeted | Shadow |
| CONFUSION | Random actions | Chaos |
| SHOCKED | Extra damage from lightning | Lightning |
| ENERGIZED | Energy regeneration | Lightning/Light |
| EMPOWERED | Stat boost | Various |
| BALANCED | Balanced stats | Various |
| UNSTABLE | Random effects | Chaos |
| HARMONIZED | Synergy boost | Support |

### Domain Effects (Field Modifications)

Certain abilities and Tier V stones create battlefield modifications:

- **Surge Field (Lightning):** Crits chain to adjacent enemies
- **Blight Field (Nature/Dark):** DoT amplification
- **Sanctum Field (Light):** Healing + cleanse
- **Glitch Field (Chaos):** Random rule mutation
- **Inferno Domain (Fire):** All fire abilities +30% damage
- **Tidal Domain (Water):** All allies heal 5% HP per turn
- **Nature Domain (Nature):** All allies regenerate energy +20%
- **Storm Domain (Lightning):** All allies gain +15% speed
- **Shadow Domain (Dark):** All enemies take +20% dark damage
- **Light Domain (Light):** All allies gain +10% damage reduction
- **Void Domain (Shadow):** All enemies lose 5% max HP per turn
- **Chaos Domain (Chaos):** Random effects trigger each turn

### Ability Priority AI

1. Emergency defensive abilities (low HP, ally in danger)
2. Field modification abilities (set up battlefield)
3. High-value actives (high damage, important buffs/debuffs)
4. Basic actives (standard attacks)

---

## Dungeon System

### Structure

- **5 Tiers** of dungeons
- **10 Floors per Tier** (50 floors total)
- **Floor 10 = Boss** in each tier

### Dungeon Tiers

| Tier | Floors | Boss Rarity | Essence Type | Essence Amount | Win Expectation |
|------|--------|-------------|--------------|----------------|-----------------|
| Basic | 1-10 | Basic | Basic Essence | 8-12 | 90% |
| Rare | 11-20 | Rare | Rare Essence | 5-8 | 70% |
| SR | 21-30 | SR | SR Essence | 3-6 | 50% |
| Legendary | 31-40 | Legendary | Legendary Essence | 2-4 | 30% |
| Mythic | 41-50 | Mythic | Mythic Essence | 1-2 | 15% |

### Boss Scaling

- Boss power scales to highest rarity pet in player roster
- Prevents early mythic brute forcing
- Forces strategic team building

### Dungeon Purpose

- **Test fusion creativity**
- **Gate summoning power**
- **Prevent brute-force progression**
- **Bosses are:**
  - Mechanically biased (anti-meta)
  - Elementally oppressive
  - Designed to punish shallow teams

### Dungeon Flow

1. Select dungeon tier
2. Progress through 9 floors of minion waves
3. Face boss on floor 10
4. Receive essence and stone rewards on victory
5. Unlock next tier on completion

---

## Summoning System

### Essence-Based Summoning

| Boss Tier | Essence Type | Essence Needed per Summon |
|-----------|--------------|---------------------------|
| Basic | Basic Essence | 50 |
| Rare | Rare Essence | 30 |
| SR | SR Essence | 20 |
| Legendary | Legendary Essence | 15 |
| Mythic | Mythic Essence | 10 |

**Critical Design Lock:** Higher rarity requires less essence (difficulty is in acquisition, not hoarding)

### Summoning Process

1. Player defeats dungeon boss
2. Receives essence reward (see dungeon table)
3. Accumulates essence of specific type
4. Spends essence to summon pet of that tier
5. Summoned pet is random from base pool for that rarity
6. Pet assigned abilities per rarity slot constraints
7. Pet saved to collection

**Prismatic and Omega:** Cannot be summoned, fusion-only

---

## Team System

### Team Composition

- **4 pets per team** (exactly)
- **Formation:** 2x2 grid
  - Front Row (2): Top positions (tanks, bruisers)
  - Back Row (2): Bottom positions (DPS, support)

### Team Building Strategy

- Element coverage (counter enemy elements)
- Ability synergy (abilities that work together)
- Stat balance (HP/ATK/DEF/SPD distribution)
- Formation optimization (front/back row placement)

### Team Features

- Save multiple teams
- Team names
- Team statistics (total power, element coverage)
- Synergy indicators

---

## PvP System

### Modes

- **Casual:** Practice matches (no rating change)
- **Ranked:** Competitive ladder (rating changes)
- **Weekly Tournaments:** Special events

### Ranking Tiers

Bronze → Silver → Gold → Platinum → Diamond → Master → Grandmaster

### Matchmaking Inputs

- Average pet rarity
- Fusion count (collection depth)
- Win/loss streak
- Current rating

### PvP Rewards

- Rating points (win/loss)
- Seasonal rewards
- Leaderboard position
- Bragging rights

---

## AI Generation Pipeline

### AI Role & Scope

**AI is not cosmetic only. It is systemic.**

### AI Responsibilities

1. **Ability Mutation & Synthesis**
   - Combines parent abilities
   - Creates new unique abilities
   - Maintains balance within rarity constraints
   - Respects fusion intent biases

2. **Passive Interaction Logic**
   - Generates passive ability effects
   - Ensures synergy with active abilities
   - Creates interesting interactions

3. **Name Generation**
   - Linguistic blending + lore rules
   - Creates unique, memorable names
   - Avoids duplicates
   - Reflects fusion intent and elements

4. **Lore Generation**
   - Creates Codex entry
   - Tells story of fusion
   - Maintains world consistency
   - Reflects fusion intent personality

5. **Visual Trait Blending** (via procedural system)
   - Pixel-art constrained
   - Combines parent visual tags
   - Incorporates stone influences
   - Family palette application

6. **Glitch Mutation Logic** (Chaos only)
   - Introduces rule-breaking abilities
   - Creates unpredictable effects
   - Maintains rarity balance

### AI Processing Pipeline

**Inputs:**
- Pet A (stats, abilities, visuals, family, lineage)
- Pet B (stats, abilities, visuals, family, lineage)
- Stone 1 (type, tier, element)
- Stone 2 (type, tier, element)
- Fusion Intent (optional player choice)

**Processing Steps:**
1. Calculate target rarity
2. Merge parent ability pools
3. Apply fusion intent biases
4. Generate new abilities (AI or procedural)
5. Calculate stats (average + variance + stone bonuses)
6. Clamp stats to rarity ranges
7. Generate name (AI or procedural)
8. Generate lore (AI or procedural)
9. Generate visual tags (procedural blending)
10. Create sprite DNA
11. Validate uniqueness (hash check)
12. Create pet entity

**Output:**
- Immutable Pet ID (hash-based)
- Cached sprite + metadata
- Fusion lineage hash
- All generated content (abilities, name, lore, sprite)

### Non-Negotiables

- **AI outputs are cached permanently**
- **No rerolls**
- **No duplicates by hash**
- **Fallback templates exist only for failure states**

### AI Service Integration

- Uses Ollama (local LLM) when available
- Falls back to procedural generation
- Validates all outputs against constraints
- Ensures uniqueness via hash checking

---

## Economy & Progression

### Economy Model

**No pay-to-win**
- Monetization = convenience + cosmetics
- Fusion outcomes never purchasable directly
- Power only comes from play, mastery, and creativity

### Progression Paths

#### Path 1: Dungeon Mastery
1. Enter Dungeon
2. Defeat Boss
3. Collect Summoning Essence + Stones
4. Unlock higher summon tiers
5. Summon stronger base pets

#### Path 2: Fusion Creativity
1. Select Pet A + Pet B
2. Select Stone 1 + Stone 2
3. Choose Fusion Intent (optional)
4. AI Recompilation
5. New fused pet added to collection
6. Parents consumed permanently

#### Path 3: Strategic Team Building
1. Build 4-pet team
2. Optimize formation + synergy
3. PvP matches
4. Leaderboard climb + seasonal rewards

### Monetization (Fair)

- Cosmetic skins
- Stone packs (non-guaranteed, convenience only)
- Battle Pass (cosmetics, convenience)
- Storage expansion
- **No direct power purchases**
- **No fusion outcome purchases**
- **No essence purchases**

---

## Art Direction & Visual Style

### Visual Style

**Enhanced Pixel Art** (matching logo quality)
- **64×64 → 128×128** sprites
- High saturation, soft shadows
- Modern effects layered on pixel base
- Chibi/cute character style (large heads, expressive features)
- Sticker-like appearance (white/colored outlines)
- Sparkle effects and polish

### Thematic Overlay

**Cyber–Vaporwave Decay**
- Glitch artifacts
- Data-stream UI metaphors
- Neon color palettes (cyan, magenta, teal)
- Retro-futuristic aesthetic

### Animation States

- **Idle:** 4-8 frames, 2s loop, subtle breathing/bounce
- **Attack:** 3-5 frames, 300ms, forward lunge
- **Hit:** 2-3 frames, 200ms, shake + flash
- **Ultimate:** 8-12 frames, 1s, dramatic pose
- **Death:** 4-6 frames, 500ms, fade out + collapse

### UI Style

- **Color Palette:**
  - Primary: #00ffff (Cyan)
  - Secondary: #ff00ff (Magenta)
  - Background: #1a1a2e (Dark blue)
  - Panel: #16213e (Darker blue)
  - Accent: #4ecca3 (Teal)
- **Typography:** Modern sans-serif, readable at mobile sizes
- **Effects:** Pixel particles, distortion shaders, data streams, sparkles

---

## Core Gameplay Loops

### Loop A: Acquisition Loop (Foundational)

**Flow:**
```
Enter Dungeon → Fight Minions → Face Boss → Collect Essence/Stones → Summon or Save
```

**Duration:** 3-6 minutes per run

**Player Motivation:**
- "I need more essence to summon"
- "I want better stones for fusion"
- "I want to unlock the next tier"

### Loop B: Creation Loop (Primary)

**Flow:**
```
Select Parents → Choose Stones → Select Intent → Preview Fusion → Execute → Reveal Result → Add to Collection
```

**Duration:** 1-2 minutes per fusion

**Player Motivation:**
- "What will this combination create?"
- "I want to see if I can get a Mythic"
- "This pet will be perfect for my team"

### Loop C: Mastery Loop (Competitive)

**Flow:**
```
Build Team → Optimize Formation → PvP Match → Analyze Results → Refine Strategy → Repeat
```

**Duration:** 2-4 minutes per match

**Player Motivation:**
- "I want to reach Master rank"
- "My team can beat anyone"
- "I need to counter the meta"

---

## Player Journey

### Phase 1: Onboarding (First Session)
- Understand core mechanics
- Complete first summon
- Complete first fusion
- Win first battle

### Phase 2: Early Game (Sessions 2-10)
- Build collection of 10-20 pets
- Complete Basic and Rare dungeons
- Understand ability synergies
- Create first Rare/SR fusion

### Phase 3: Mid Game (Sessions 11-50)
- Complete SR and Legendary dungeons
- Build competitive team
- Reach Gold+ in PvP
- Create first Legendary fusion

### Phase 4: Late Game (Sessions 51+)
- Complete Mythic dungeons
- Reach Master+ in PvP
- Create Prismatic/Omega fusions
- Complete collection goals

---

## Design Principles

1. **Permanence** - Every decision is permanent. No rerolls, no undo.
2. **Uniqueness** - Every pet is unique. No duplicates.
3. **Creativity** - Fusion is creative, not optimization.
4. **Fairness** - No pay-to-win. Skill and creativity matter.
5. **Depth** - Multiple systems interact. Team composition, fusion strategy, and combat skill all matter.
6. **Evolution** - Meta is always evolving. New strategies emerge.

---

## Technical Architecture

### Frontend Stack
- **Engine:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **State Management:** Zustand 5
- **Routing:** React Router 7
- **Styling:** CSS Modules
- **PWA:** Vite PWA Plugin

### Backend/Storage
- **Database:** IndexedDB (via idb)
- **Caching:** Browser Cache + IndexedDB
- **Offline-First:** Service Worker (PWA)

### AI
- **Primary:** Ollama (local LLM)
- **Fallback:** Procedural generation
- **Validation:** Custom validators

### Platform
- **Primary:** iOS / Android (portrait)
- **Secondary:** PC Web / PWA
- **Session Length:** 3-6 minutes (dungeon), 1-2 minutes (fusion), 2-4 minutes (PvP)

---

## Success Metrics

### Engagement Metrics
- Daily Active Users (DAU)
- Session Length
- Sessions per Day
- Retention (Day 1, 7, 30)

### Progression Metrics
- Average Fusions per Player
- Average Collection Size
- Average PvP Rank
- Dungeon Completion Rate

### Balance Metrics
- Meta Diversity (team variety)
- Win Rate Distribution
- Fusion Success Rate
- Essence Acquisition Rate

---

## Conclusion

This document captures the **complete game concept** for Pixel Pets Reborn x Remeged. Every system, mechanic, and design decision is documented to ensure full understanding before implementation.

**Key Takeaways:**
- Fusion-only progression (no traditional leveling)
- Permanent, unique fusions (no rerolls, no duplicates)
- AI-driven creation (abilities, names, lore, sprites)
- Strategic depth (team composition, fusion strategy, combat skill)
- Fair economy (no pay-to-win)
- High-quality visuals (matching logo aesthetic)

---

**END OF COMPLETE CONCEPT SUMMARY**

