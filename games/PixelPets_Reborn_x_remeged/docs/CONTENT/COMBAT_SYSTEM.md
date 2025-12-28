# Comprehensive Combat System with Domain Effects

## Overview
This document details the comprehensive combat system for Pixel Pets Reborn X Remerged. The system features 4v4 auto-battle mechanics with front/back row positioning, sophisticated domain effects from high-tier stones, and intricate elemental interactions. The combat system emphasizes strategic team composition, fusion creativity, and tactical gameplay.

## Combat System Architecture

### Battle Structure
- **Team Size**: 4 pets per team (exactly)
- **Formation**: 2x2 grid (2 Front Row, 2 Back Row)
- **Battle Type**: Auto-Battle (player team vs enemy team)
- **Turn System**: Speed-based turn order with 50-turn maximum
- **Victory Condition**: All pets on one team defeated
- **Draw Condition**: 50 turns elapsed (rare, prevents infinite battles)

### Formation System
```
Back Row (Higher Damage, Lower Defense)
[PET 3] [PET 4]

Front Row (Lower Damage, Higher Defense)  
[PET 1] [PET 2]
```

- **Front Row (Positions 1-2)**: Tanks, bruisers, defenders
  - Take 20% more damage
  - Deal 10% more damage
  - Block attacks to back row
  - Specialized for defense and control abilities

- **Back Row (Positions 3-4)**: DPS, support, healers
  - Take 10% less damage
  - Deal 20% more damage
  - Safer from frontal attacks
  - Specialized for damage and support abilities

## Turn-Based Combat Mechanics

### Battle Initialization
1. **Pet Conversion**: Pets converted to CombatPets with battle-specific stats
   - CurrentHP = MaxHP (for battle duration tracking)
   - CurrentEnergy = 50 (starting energy)
   - StatusEffects = Empty array
   - Buffs/Debuffs = Empty arrays
   - Cooldowns = Initialized to 0

2. **Turn Order Calculation**: Determined by SPD stat at battle start
   - Higher speed = acts first
   - Speed ties resolved by randomization
   - Order maintained throughout battle

3. **Position Assignment**: Pets assigned to positions 0-3
   - Index 0-1 = Front Row
   - Index 2-3 = Back Row

### Turn Execution Flow
For each turn:

1. **Actor Selection**: Select next actor from turn order
2. **Life Check**: Verify actor HP > 0
3. **Status Tick**: Apply DoT, HoT, and duration decrements
4. **Status Effect**: Apply status effect triggered abilities
5. **Stun Check**: Skip turn if stunned/frozen
6. **Domain Application**: Apply active domain effects
7. **Passive Activation**: Apply start-of-turn passive abilities
8. **Cooldown Reduction**: Decrease all cooldowns by 1
9. **Ability Selection**: AI selects appropriate ability
10. **Ability Execution**: Execute selected ability
11. **Effect Processing**: Process damage, healing, status effects
12. **Energy Management**: Spend cost + gain 20 energy
13. **Victory Check**: Check if battle continues
14. **Turn Rotation**: Move to next actor

### End-of-Turn Mechanics
- **Energy Regeneration**: +20 energy per turn (capped at 100)
- **Cooldown Reduction**: -1 from all ability cooldowns
- **Status Duration**: -1 from all active status effects
- **Turn Tracking**: Increment turn counter when all actors acted

## Core Combat Stats

### Primary Stats
1. **HP (Health Points)**
   - Formula: BaseHP × (1 + StoneHP%) + FamilyBonuses
   - When HP reaches 0, pet is defeated
   - Current HP tracked per pet in battle
   - Cannot go below 0 (no negative HP)

2. **ATK (Attack Power)**
   - Physical or Elemental damage scaling factor
   - Used in damage calculations
   - Scales with ability power multipliers
   - Affected by buffs/debuffs

3. **DEF (Defense)**
   - Damage reduction stat
   - Formula: DEF% = DEF / (DEF + 100) (soft cap)
   - Reduces incoming damage
   - Physical and Magic DEF separate

4. **SPD (Speed)**
   - Turn order priority (0-200 range)
   - Higher speed = acts first
   - Determines turn order at battle start
   - Can be modified by effects

### Secondary Stats
5. **Energy System**
   - Start: 50 energy per pet
   - Gain: +20 energy per turn
   - Max: 100 energy
   - Abilities cost energy (varies by ability)
   - Cannot use ability if insufficient energy

6. **Cooldown System**
   - Active abilities have cooldowns (1-8 turns)
   - Cooldowns decrease by 1 each turn
   - Cannot use ability if on cooldown
   - Ultimate abilities have longer cooldowns

7. **CRIT (Critical Hit Chance)**
   - % chance (cap at 50%)
   - Formula: 1.5x damage on crit (or custom formula)
   - Affected by buffs/debuffs
   - Can be modified by abilities

8. **RES (Resistance)**
   - Status effect resistance (cap at 60%)
   - Reduces chance of status effects
   - Applied to status-inflicting abilities
   - Can be modified by abilities

## Damage Calculation System

### Basic Damage Formula
```
Final Damage = (Base Ability Power × ATK Modifier × Element Multiplier × Position Modifier) 
              × (1 - Target DEF%) 
              × (1 - Target RES if status-based) 
              × (1.5 if critical hit) 
              × (Domain Multiplier if applicable)
```

### Element Effectiveness
```
Attacker → Defender | Fire | Water | Earth | Lightning | Shadow | Light
Fire                  | 1.0  | 0.5   | 1.5   | 1.0       | 1.0    | 1.0
Water                 | 1.5  | 1.0   | 1.5   | 0.5       | 1.0    | 1.0
Earth                 | 0.5  | 0.5   | 1.0   | 1.5       | 1.0    | 1.0
Lightning             | 1.0  | 1.5   | 0.5   | 1.0       | 1.5    | 1.0
Shadow                | 1.0  | 1.0   | 1.0   | 0.5       | 1.0    | 1.5
Light                 | 1.0  | 1.0   | 1.0   | 1.0       | 1.5    | 1.0
```

### Position Modifiers
- **Front Row to Front**: +10% damage, +20% damage received
- **Front Row to Back**: -10% damage, +0% damage received
- **Back Row to Front**: +20% damage, -10% damage received
- **Back Row to Back**: +10% damage, -15% damage received

## Ability System

### Ability Categories

#### 1. Passive Abilities
- **Always Active**: No energy cost, no cooldown
- **Trigger Types**:
  - On-turn (start/end)
  - On-damage (take/receive)
  - On-status (apply/receive)
  - On-ability (use/be affected)
- **Effect Types**:
  - Stat modifications
  - Aura effects
  - Conditional triggers
  - Counter mechanisms

#### 2. Active Abilities
- **Energy Cost**: 20-80 energy points
- **Cooldown**: 1-6 turns
- **Targeting**: Single/multi/area of effect
- **Effect Types**:
  - Direct damage
  - Healing support
  - Buff/debuff application
  - Status effects

#### 3. Ultimate Abilities
- **High Energy Cost**: 80-100 energy points
- **Long Cooldown**: 5-10 turns
- **Powerful Effects**: Battle-changing abilities
- **Available Tiers**:
  - Legendary: 1 ultimate ability
  - Mythic: 1 ultimate ability
  - Prismatic: 2 ultimate abilities
  - Omega: 3 ultimate abilities

### Ability Slot Structure by Rarity

| Rarity | Passives | Actives | Ultimates | Total |
|--------|----------|---------|-----------|-------|
| Basic  | 0        | 2       | 0         | 2     |
| Rare   | 1        | 2       | 0         | 3     |
| SR     | 2        | 2       | 0         | 4     |
| Legendary | 2     | 3       | 1         | 6     |
| Mythic | 3        | 3       | 1         | 7     |
| Prismatic | 4     | 4       | 2         | 10    |
| Omega  | 5        | 5       | 3         | 13    |

### Ability Priority AI System

#### Tier 1: Emergency Abilities
- Healing when HP < 30%
- Defensive when ally in critical condition
- Revival abilities when ally deceased
- Shield when damage incoming

#### Tier 2: Field Modification
- Domain creation abilities
- Terrain control abilities
- Team-wide buff abilities
- Debuff removal abilities

#### Tier 3: High-Impact Actives
- High-damage abilities
- Important buffs/debuffs
- Status effect application
- Energy drain/gain abilities

#### Tier 4: Basic Actives
- Standard damage abilities
- Basic healing
- Minor stat modifications
- Energy efficiency abilities

## Status Effect System

### Status Categories

#### Positive Status Effects
1. **Haste** - Speed increased by 50% for 2 turns
2. **Empower** - Attack increased by 30% for 3 turns
3. **Shield** - Damage reduction by 40% for 2 turns
4. **Regen** - Heal 15% max HP per turn for 3 turns
5. **Focus** - Critical chance increased by 25% for 2 turns
6. **Resist** - Status resistance increased by 40% for 3 turns

#### Negative Status Effects
1. **Burn** - Take 10% of max HP as fire damage per turn for 3 turns
2. **Poison** - Take 8% of max HP as nature damage per turn for 3 turns
3. **Freeze** - Skip turn (60% chance) for 2 turns
4. **Stun** - Skip turn for 1 turn (immediate)
5. **Bleed** - Take 12% of max HP as physical damage per turn for 2 turns
6. **Slow** - Speed reduced by 40% for 2 turns
7. **Curse** - All stats reduced by 25% for 3 turns
8. **Blind** - Accuracy reduced by 50% for 2 turns
9. **Confusion** - 30% chance to attack random target for 2 turns
10. **Silence** - Cannot use abilities for 2 turns
11. **Sleep** - Skip turn for 2 turns (wakes when damaged)
12. **Fear** - 50% chance to do nothing instead of action for 2 turns

#### Special Status Effects
1. **Charm** - Attack allies instead of enemies for 1 turn
2. **Taunt** - Forced to attack this pet for 2 turns
3. **Invisible** - Cannot be targeted for 1 turn
4. **Protected** - Blocked first incoming attack
5. **Enraged** - Attack increased by 50%, defense reduced by 20% for 2 turns

## Domain Effects System

### Definition
Domain effects are persistent battlefield modifications that last for the duration of the battle or specified turns, triggered by Tier V stones or ultimate abilities.

### Stone-Triggered Domains
Domains activate when both Tier V stones of the same type are present (from fused pets with such stones).

#### 1. Ruby Domain (Fire)
- **Trigger**: Both pets with Tier V Ruby stones active
- **Duration**: 3 turns (renewable)
- **Effects**:
  - All fire abilities deal +30% damage
  - All fire abilities have +15% crit chance
  - Burn effects last +1 turn
- **Visual**: Orange-red battlefield glow

#### 2. Sapphire Domain (Water)
- **Trigger**: Both pets with Tier V Sapphire stones active
- **Duration**: 3 turns (renewable)
- **Effects**:
  - All allies heal 5% max HP per turn
  - All allies gain +10% resistance to status effects
  - Healing abilities are 20% more effective
- **Visual**: Blue water-like energy patterns

#### 3. Emerald Domain (Nature)
- **Trigger**: Both pets with Tier V Emerald stones active
- **Duration**: 3 turns (renewable)
- **Effects**:
  - All allies regenerate 20% energy per turn
  - All allies gain 25% damage reduction
  - Poison and bleed effects reduced by 50%
- **Visual**: Green growing plant patterns

#### 4. Topaz Domain (Lightning)
- **Trigger**: Both pets with Tier V Topaz stones active
- **Duration**: 3 turns (renewable)
- **Effects**:
  - All allies gain +25% speed
  - Lightning abilities chain to 1 additional target
  - Cooldowns reduced by 1 turn for all allies
- **Visual**: Yellow electrical energy patterns

#### 5. Amethyst Domain (Shadow)
- **Trigger**: Both pets with Tier V Amethyst stones active
- **Duration**: 3 turns (renewable)
- **Effects**:
  - All enemies take +20% shadow damage
  - All allies gain +30% resistance to light damage
  - Critical hit chance increased by 20% for all allies
- **Visual**: Purple shadow patterns

#### 6. Pearl Domain (Light)
- **Trigger**: Both pets with Tier V Pearl stones active
- **Duration**: 3 turns (renewable)
- **Effects**:
  - All allies gain +15% damage reduction
  - All allies gain immunity to 1 status effect per turn
  - Healing abilities are 30% more effective
- **Visual**: White/purple radiant light

#### 7. Onyx Domain (Void)
- **Trigger**: Both pets with Tier V Onyx stones active
- **Duration**: 3 turns (renewable)
- **Effects**:
  - All enemies lose 5% max HP per turn
  - All shadow abilities have +25% damage
  - Enemy ultimate abilities require +20 energy to use
- **Visual**: Black void energy patterns

#### 8. Opal Domain (Chaos)
- **Trigger**: Both pets with Tier V Opal stones active
- **Duration**: 3 turns (renewable)
- **Effects**:
  - Random effects trigger each turn
  - All damage dealt has ±20% variance
  - 25% chance for any ability to have double effect
- **Visual**: All colors shifting randomly

### Ultimate Ability Domains
Special domain effects created by ultimate abilities:

#### 1. Lava Domain
- **Creator**: Igneous Titan ultimate
- **Duration**: 3 turns
- **Effects**:
  - All fire abilities +30% damage
  - All fire abilities ignore 20% defense
  - Burn effects can't be cleansed
- **Visual**: Orange-red molten battlefield

#### 2. Blizzard Domain
- **Creator**: Frostwyrm ultimate
- **Duration**: 3 turns
- **Effects**:
  - All ice abilities +25% damage
  - All enemies lose 10% speed
  - Freeze effects last +1 turn
- **Visual**: White/blue icy battlefield

#### 3. Tidal Domain
- **Creator**: Various water ultimates
- **Duration**: 3 turns
- **Effects**:
  - All allies heal 5% max HP per turn
  - Water abilities heal allies for 10% of damage dealt
  - Enemies lose 5% accuracy
- **Visual**: Blue water flow patterns

#### 4. Lightning Domain
- **Creator**: Various lightning ultimates
- **Duration**: 3 turns
- **Effects**:
  - All allies gain +15% speed
  - Lightning abilities chain to 2 additional targets
  - Cooldowns reduced by 1 turn
- **Visual**: Yellow electrical patterns

#### 5. Shadow Domain
- **Creator**: Voidbringer ultimate
- **Duration**: 3 turns
- **Effects**:
  - All enemies take +20% shadow damage
  - All allies gain immunity to fear and blind
  - Allies ignore 25% of non-shadow damage
- **Visual**: Purple/black shadow patterns

#### 6. Light Domain
- **Creator**: Seraphlight ultimate
- **Duration**: 3 turns
- **Effects**:
  - All allies gain +25% damage reduction
  - All allies immune to status effects
  - Healing abilities heal 40% more
- **Visual**: White/golden radiant patterns

#### 7. Steel Domain
- **Creator**: Mechanized Titan ultimate
- **Duration**: 3 turns
- **Effects**:
  - All allies gain +30% defense
  - All physical abilities gain +20% damage
  - Immunity to critical hits for all allies
- **Visual**: Gray/silver metallic patterns

#### 8. Arcane Domain
- **Creator**: Archmage ultimate
- **Duration**: 3 turns
- **Effects**:
  - All arcane abilities +30% damage
  - All allies gain +25% resistance to magic
  - Ability cooldowns reduced by 2 turns
- **Visual**: Purple/magenta magical patterns

#### 9. Air Domain
- **Creator**: Stormbringer ultimate
- **Duration**: 3 turns
- **Effects**:
  - All allies gain +20% speed
  - All air abilities +25% accuracy
  - Back row pets gain 5% damage reduction
- **Visual**: Light blue/aqua wind patterns

#### 10. Chaos Domain
- **Creator**: Chaos Lord ultimate
- **Duration**: 3 turns
- **Effects**:
  - Random effects trigger each turn
  - All abilities have ±25% damage variance
  - 30% chance for any effect to trigger twice
- **Visual**: All colors randomly shifting

## Combat AI System

### Target Selection AI
1. **Threat Assessment**: Prioritize targets by threat level
2. **HP-Based**: Focus on lowest HP targets when possible
3. **Ability Synergy**: Target for ability-specific effects
4. **Position Exploitation**: Target back row when front row blocked

### Ability Selection AI
1. **Situational Awareness**: Assess battle state for optimal ability
2. **Team Coordination**: Consider teammate positions and statuses
3. **Risk Assessment**: Evaluate damage vs. safety trade-offs
4. **Cooldown Management**: Plan ability usage around cooldowns

### Team Composition AI
1. **Front/Back Balance**: Maintain proper front-to-back ratio
2. **Element Coverage**: Ensure elemental advantage coverage
3. **Synergy Optimization**: Build abilities that work together
4. **Backup Planning**: Have alternatives if key pets downed

## Victory Conditions & Rewards

### Victory Determination
- **Win**: Defeat all enemy pets
- **Loss**: Defeat of all player pets
- **Draw**: 50 turns elapsed without decisive victory (rare)

### Victory Rewards
- **Experience Points**: For pet leveling (if applicable)
- **Items**: Stone fragments, essence, etc.
- **Achievements**: Battle completion medals
- **Ranking**: PvP rating adjustment

### Performance Metrics
- **Turns Survived**: How long the battle lasted
- **Damage Dealt**: Total damage output
- **Healing Provided**: Total healing for support pets
- **Status Effects Applied**: Total status effects inflicted

## Team Building System

### Formation Strategy
- **Tank Support**: Front row protection for back row
- **DPS Protection**: Back row safety from enemy focus
- **Element Coverage**: Defense against all element types
- **Synergy Building**: Abilities that enhance each other

### Position Optimization
- **Tank Positioning**: Strongest front-line pets in positions 1-2
- **DPS Positioning**: Highest damage dealers in positions 3-4
- **Support Positioning**: Healers and buffers where protected
- **Utility Positioning**: Field control abilities where effective

## Battle UI Elements

### Health Display
- **Individual HP Bars**: For each pet with color coding
- **Team HP Summary**: Overall team health visualization
- **Damage Numbers**: Floating numbers for damage/healing
- **Status Icons**: Visual indicators for active statuses

### Action Display
- **Turn Indicator**: Shows current actor
- **Ability Cooldowns**: Visual cooldown indicators
- **Energy Bars**: Current energy levels
- **Status Effects**: Active status effect display

### Domain Visualization
- **Domain Timer**: Shows remaining domain duration
- **Domain Effects**: Visual overlays showing active domains
- **Domain Origin**: Shows which pets created the domain
- **Domain Strength**: Visual intensity scaling

## Advanced Combat Mechanics

### Combo System
- **Ability Chains**: Abilities that trigger other abilities
- **Combo Bonuses**: Extra effects for specific ability sequences
- **Chain Reactions**: Status effects that trigger additional effects
- **Synergy Effects**: Abilities enhanced by specific ally presence

### Momentum System
- **Battle Flow**: Advantage shifts based on performance
- **Momentum Bonuses**: Temporary stat boosts for good performance
- **Streak Effects**: Consecutive successful actions enhance abilities
- **Recovery Mechanics**: Bonus effects when turning tide

### Environmental Effects
- **Weather Systems**: Battle conditions affecting combat
- **Terrain Advantages**: Position-based bonuses
- **Time Effects**: Battle duration affecting pet performance
- **Field Hazards**: Temporary battlefield obstacles

## Balancing Considerations

### Power Scaling
- **Rarity Balance**: Higher rarity pets have appropriate advantages
- **Element Balance**: No element is overpowered in all situations
- **Domain Balance**: Domain effects enhance but don't dominate
- **Ability Balance**: Powerful abilities have appropriate costs/limits

### Counter Strategies
- **Element Counters**: Every element has weaknesses
- **Domain Counters**: Ways to mitigate domain effects
- **Team Counters**: Team compositions that counter specific strategies
- **Ability Counters**: Abilities that counter other abilities

### Skill Expression
- **Team Building**: Strategic team composition matters
- **Positioning**: Pet placement affects battle outcomes
- **Timing**: When abilities are used affects effectiveness
- **Adaptation**: Teams that adapt to opponents perform better

---

This completes the design specification for the comprehensive combat system with domain effects in Pixel Pets Reborn X Remerged. The system provides strategic depth through team composition, positioning, elemental interactions, and domain effects while maintaining accessibility for new players.