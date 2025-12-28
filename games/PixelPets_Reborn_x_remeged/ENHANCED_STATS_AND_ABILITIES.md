# Enhanced Stats & Abilities Design Document

**Purpose**: Comprehensive stat rebalancing and ability library expansion for Pixel Pets Reborn x Remeged

---

## 1. Enhanced Stat Ranges

### Current vs. Enhanced Comparison

| Rarity | Stat | Current Range | Enhanced Range | Multiplier |
|--------|------|---------------|----------------|------------|
| **BASIC** | HP | 120-180 | **500-750** | ~4.2x |
| | ATK | 18-28 | **45-65** | ~2.3x |
| | DEF | 12-22 | **35-50** | ~2.3x |
| | SPD | 55-75 | **60-80** | ~1.1x |
| **RARE** | HP | 200-280 | **850-1200** | ~4.3x |
| | ATK | 35-50 | **75-100** | ~2.1x |
| | DEF | 28-45 | **60-85** | ~2.0x |
| | SPD | 65-85 | **70-90** | ~1.1x |
| **SR** | HP | 320-440 | **1400-1900** | ~4.3x |
| | ATK | 55-78 | **120-160** | ~2.1x |
| | DEF | 48-70 | **100-140** | ~2.0x |
| | SPD | 75-95 | **80-100** | ~1.1x |
| **LEGENDARY** | HP | 550-750 | **2200-3000** | ~4.0x |
| | ATK | 88-120 | **180-240** | ~2.0x |
| | DEF | 75-110 | **160-220** | ~2.0x |
| | SPD | 85-105 | **90-110** | ~1.0x |
| **MYTHIC** | HP | 950-1300 | **3500-4800** | ~3.7x |
| | ATK | 140-185 | **280-360** | ~2.0x |
| | DEF | 120-165 | **240-320** | ~2.0x |
| | SPD | 95-115 | **100-120** | ~1.0x |
| **PRISMATIC** | HP | 1400-1800 | **5000-6500** | ~3.6x |
| | ATK | 200-260 | **400-520** | ~2.0x |
| | DEF | 180-230 | **360-480** | ~2.0x |
| | SPD | 110-125 | **110-130** | ~1.0x |
| **OMEGA** | HP | 2000-2500 | **7000-9000** | ~3.5x |
| | ATK | 300-400 | **600-800** | ~2.0x |
| | DEF | 250-350 | **500-700** | ~2.0x |
| | SPD | 130-150 | **130-150** | ~1.0x |

### Complete Enhanced RARITY_CONFIG

```typescript
export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  [Rarity.BASIC]: {
    name: 'Basic',
    color: '#808080',
    hpRange: [500, 750],      // Enhanced from [120, 180]
    attackRange: [45, 65],    // Enhanced from [18, 28]
    defenseRange: [35, 50],   // Enhanced from [12, 22]
    speedRange: [60, 80],      // Enhanced from [55, 75]
    passiveCount: 0,
    activeCount: 2,
    ultimateCount: 0,
    summonCost: 50,
    dropRate: 0.45,
  },
  [Rarity.RARE]: {
    name: 'Rare',
    color: '#0088ff',
    hpRange: [850, 1200],     // Enhanced from [200, 280]
    attackRange: [75, 100],   // Enhanced from [35, 50]
    defenseRange: [60, 85],   // Enhanced from [28, 45]
    speedRange: [70, 90],     // Enhanced from [65, 85]
    passiveCount: 1,
    activeCount: 2,
    ultimateCount: 0,
    summonCost: 30,
    dropRate: 0.30,
  },
  [Rarity.SR]: {
    name: 'SR',
    color: '#aa00ff',
    hpRange: [1400, 1900],    // Enhanced from [320, 440]
    attackRange: [120, 160],  // Enhanced from [55, 78]
    defenseRange: [100, 140], // Enhanced from [48, 70]
    speedRange: [80, 100],    // Enhanced from [75, 95]
    passiveCount: 2,
    activeCount: 2,
    ultimateCount: 0,
    summonCost: 20,
    dropRate: 0.15,
  },
  [Rarity.LEGENDARY]: {
    name: 'Legendary',
    color: '#ffaa00',
    hpRange: [2200, 3000],    // Enhanced from [550, 750]
    attackRange: [180, 240],  // Enhanced from [88, 120]
    defenseRange: [160, 220], // Enhanced from [75, 110]
    speedRange: [90, 110],    // Enhanced from [85, 105]
    passiveCount: 2,
    activeCount: 3,
    ultimateCount: 1,
    summonCost: 15,
    dropRate: 0.08,
  },
  [Rarity.MYTHIC]: {
    name: 'Mythic',
    color: '#ff00ff',
    hpRange: [3500, 4800],    // Enhanced from [950, 1300]
    attackRange: [280, 360],  // Enhanced from [140, 185]
    defenseRange: [240, 320], // Enhanced from [120, 165]
    speedRange: [100, 120],   // Enhanced from [95, 115]
    passiveCount: 3,
    activeCount: 3,
    ultimateCount: 1,
    summonCost: 10,
    dropRate: 0.019,
  },
  [Rarity.PRISMATIC]: {
    name: 'Prismatic',
    color: '#ffffff',
    hpRange: [5000, 6500],    // Enhanced from [1400, 1800]
    attackRange: [400, 520],  // Enhanced from [200, 260]
    defenseRange: [360, 480], // Enhanced from [180, 230]
    speedRange: [110, 130],   // Enhanced from [110, 125]
    passiveCount: 4,
    activeCount: 4,
    ultimateCount: 2,
    summonCost: 0,
    dropRate: 0.001,
  },
  [Rarity.OMEGA]: {
    name: 'Omega',
    color: '#ff0080',
    hpRange: [7000, 9000],     // Enhanced from [2000, 2500]
    attackRange: [600, 800],  // Enhanced from [300, 400]
    defenseRange: [500, 700],  // Enhanced from [250, 350]
    speedRange: [130, 150],   // Enhanced from [130, 150]
    passiveCount: 5,
    activeCount: 5,
    ultimateCount: 3,
    summonCost: 0,
    dropRate: 0.0001,
  },
};
```

### Design Rationale

1. **HP Scaling**: ~4x multiplier creates more meaningful health pools for engaging combat
2. **ATK/DEF Scaling**: ~2x multiplier maintains balance while making damage feel impactful
3. **SPD Scaling**: Minimal increase maintains speed as a differentiating stat
4. **Power Curve**: Maintains exponential growth between rarities for clear progression
5. **Combat Feel**: Higher numbers make abilities and damage feel more substantial

---

## 2. Expanded Ability Library (200+ Templates)

### 2.1 Passive Abilities (50+ Templates)

#### Stat Enhancement Passives

1. **Fortress** - Increases defense by 25% (enhanced from 20%)
2. **Berserker** - Increases attack by 20% when HP < 50% (enhanced from 15%)
3. **Swift Strike** - Increases speed by 15% (enhanced from 10%)
4. **Vitality** - Increases max HP by 30%
5. **Iron Will** - Reduces incoming damage by 15%
6. **Bloodlust** - Increases attack by 10% for each defeated enemy
7. **Guardian** - Increases defense by 20% when an ally is below 50% HP
8. **Momentum** - Increases speed by 5% for each turn passed
9. **Adaptive Defense** - Defense increases by 10% for each status effect on self
10. **Overcharge** - Attack increases by 15% when energy is above 80

#### Regeneration & Sustain

11. **Regeneration** - Restores 5% max HP each turn (existing, enhanced)
12. **Lifesteal Aura** - 10% of damage dealt heals self
13. **Second Wind** - Restores 20% HP when falling below 25% HP (once per battle)
14. **Phoenix Blood** - When defeated, revive with 30% HP (once per battle)
15. **Absorption** - 15% of damage taken is converted to energy
16. **Energy Siphon** - Gain 5 extra energy per turn
17. **Rejuvenation** - Restores 3% HP and 10 energy at start of each turn
18. **Soul Link** - 20% of damage taken is redirected to random ally
19. **Vampiric** - 25% of damage dealt heals self
20. **Meditation** - Restores 15% HP when not using abilities for a turn

#### Status & Effect Passives

21. **Status Immunity** - Immune to all status effects
22. **Status Absorption** - Each status effect increases attack by 5%
23. **Cleanse Aura** - All allies remove one status effect at start of turn
24. **Burning Rage** - When burned, attack increases by 25%
25. **Frozen Heart** - When frozen, defense increases by 50%
26. **Shock Absorber** - When shocked, speed increases by 30%
27. **Poison Resistance** - Reduces poison damage by 50%
28. **Stun Recovery** - When stunned, immediately remove stun and gain 20 energy
29. **Status Master** - Status effects last 1 turn longer on enemies
30. **Purification** - Remove one debuff at start of each turn

#### Conditional & Trigger Passives

31. **Counter Attack** - 30% chance to counter when taking damage
32. **Retaliation** - When taking critical hit, counter with 150% attack
33. **Last Stand** - When HP < 25%, all stats increase by 30%
34. **Desperation** - When HP < 50%, abilities cost 20% less energy
35. **Fury** - Attack increases by 5% for each 10% HP lost
36. **Protective Instinct** - When ally takes fatal damage, intercept and take damage instead
37. **Battle Cry** - At start of battle, all allies gain 10% attack for 3 turns
38. **Rally** - When an ally is defeated, gain 50 energy and 20% attack
39. **Synergy** - When using same element as ally, both gain 15% damage
40. **Harmony** - When all allies are alive, all stats increase by 10%

#### Elemental & Special Passives

41. **Elemental Mastery** - All elemental abilities deal 20% more damage
42. **Fire Affinity** - Fire abilities deal 30% more damage, immune to burn
43. **Water Affinity** - Water abilities deal 30% more damage, immune to freeze
44. **Earth Affinity** - Earth abilities deal 30% more damage, immune to stun
45. **Lightning Affinity** - Lightning abilities deal 30% more damage, immune to shock
46. **Shadow Affinity** - Shadow abilities deal 30% more damage, immune to fear
47. **Light Affinity** - Light abilities deal 30% more damage, immune to blind
48. **Chaos Resonance** - Random stat boost each turn (10-30%)
49. **Elemental Balance** - All elemental resistances increase by 20%
50. **Prismatic Core** - Randomly gain one elemental affinity each turn

### 2.2 Active Abilities (120+ Templates)

#### Single-Target Damage (Elemental Variants)

**Fire Element**:
1. **Fire Blast** - Deals 1.3x attack as fire damage (enhanced from 1.2x)
2. **Flame Strike** - Deals 1.5x attack as fire damage, 40% chance to burn
3. **Inferno Lance** - Deals 1.8x attack as fire damage, ignores 30% defense
4. **Molten Strike** - Deals 1.4x attack as fire damage, applies burn for 3 turns
5. **Phoenix Dive** - Deals 1.6x attack as fire damage, heals self for 20% damage dealt

**Water Element**:
6. **Ice Shard** - Deals 1.1x attack as ice damage, 30% chance to freeze (existing)
7. **Tidal Wave** - Deals 1.4x attack as water damage, pushes target back
8. **Frostbite** - Deals 1.2x attack as ice damage, applies slow for 2 turns
9. **Aqua Cutter** - Deals 1.5x attack as water damage, 50% chance to freeze
10. **Tsunami** - Deals 1.7x attack as water damage to target and adjacent enemies

**Earth Element**:
11. **Stone Slam** - Deals 1.3x attack as earth damage, 30% chance to stun
12. **Quake** - Deals 1.2x attack as earth damage, reduces target speed by 20%
13. **Crystal Spike** - Deals 1.6x attack as earth damage, ignores 25% defense
14. **Mudslide** - Deals 1.4x attack as earth damage, applies slow and reduces accuracy
15. **Mountain Crush** - Deals 1.8x attack as earth damage, stuns for 1 turn

**Lightning Element**:
16. **Thunderbolt** - Deals 1.4x attack as lightning damage, 40% chance to shock
17. **Chain Lightning** - Deals 1.2x attack as lightning damage, chains to 2 additional enemies
18. **Electric Surge** - Deals 1.5x attack as lightning damage, increases own speed by 20%
19. **Storm Strike** - Deals 1.6x attack as lightning damage, applies shock for 2 turns
20. **Volt Rush** - Deals 1.3x attack as lightning damage, gains 30 energy

**Shadow Element**:
21. **Shadow Bolt** - Deals 1.3x attack as shadow damage, 30% chance to apply fear
22. **Dark Strike** - Deals 1.5x attack as shadow damage, heals self for 15% damage
23. **Void Slash** - Deals 1.4x attack as shadow damage, ignores 40% defense
24. **Soul Drain** - Deals 1.2x attack as shadow damage, steals 20 energy from target
25. **Necrotic Touch** - Deals 1.3x attack as shadow damage, applies poison for 3 turns

**Light Element**:
26. **Holy Strike** - Deals 1.4x attack as light damage, heals self for 10% damage
27. **Divine Smite** - Deals 1.6x attack as light damage, 50% more damage to shadow
28. **Radiant Beam** - Deals 1.5x attack as light damage, removes one debuff from self
29. **Purifying Light** - Deals 1.3x attack as light damage, removes all status effects from target
30. **Celestial Strike** - Deals 1.7x attack as light damage, grants shield to self

**Metal Element**:
31. **Steel Strike** - Deals 1.3x attack as metal damage, reduces target defense by 15%
32. **Iron Bash** - Deals 1.5x attack as metal damage, 30% chance to stun
33. **Razor Edge** - Deals 1.4x attack as metal damage, applies bleed for 2 turns
34. **Titanium Slam** - Deals 1.6x attack as metal damage, increases own defense by 20%
35. **Alloy Strike** - Deals 1.3x attack as metal damage, gains 25 energy

**Arcane Element**:
36. **Arcane Blast** - Deals 1.4x attack as arcane damage, 30% chance to confuse
37. **Mystic Bolt** - Deals 1.5x attack as arcane damage, ignores 30% resistance
38. **Reality Rift** - Deals 1.3x attack as arcane damage, applies random status effect
39. **Spell Weave** - Deals 1.2x attack as arcane damage, reduces target energy by 20
40. **Chaos Bolt** - Deals 1.0-2.0x attack as arcane damage (random)

**Air Element**:
41. **Wind Slash** - Deals 1.3x attack as air damage, increases own speed by 15%
42. **Gale Force** - Deals 1.4x attack as air damage, pushes target back
43. **Tornado** - Deals 1.2x attack as air damage to target and adjacent enemies
44. **Sky Strike** - Deals 1.6x attack as air damage, gains 20 energy
45. **Aerial Assault** - Deals 1.5x attack as air damage, applies slow for 2 turns

**Chaos Element**:
46. **Chaos Blast** - Deals 1.0-1.8x attack as chaos damage (random)
47. **Reality Break** - Deals 1.3x attack as chaos damage, applies random status
48. **Entropy Strike** - Deals 1.4x attack as chaos damage, random effect triggers
49. **Void Rift** - Deals 1.2x attack as chaos damage, ignores all defenses
50. **Anomaly** - Random effect: damage, heal, buff, or debuff

#### Multi-Target Damage

51. **Firestorm** - Deals 1.0x attack as fire damage to all enemies
52. **Blizzard** - Deals 0.9x attack as ice damage to all enemies, 20% chance to freeze each
53. **Earthquake** - Deals 1.1x attack as earth damage to all enemies, 30% chance to stun each
54. **Thunderstorm** - Deals 1.0x attack as lightning damage to all enemies, chains between enemies
55. **Shadow Wave** - Deals 0.9x attack as shadow damage to all enemies, heals self for 10% total damage
56. **Divine Wrath** - Deals 1.2x attack as light damage to all enemies
57. **Metal Shrapnel** - Deals 1.0x attack as metal damage to all enemies, applies bleed
58. **Arcane Explosion** - Deals 1.1x attack as arcane damage to all enemies, 30% chance to confuse each
59. **Hurricane** - Deals 1.0x attack as air damage to all enemies, reduces speed by 15%
60. **Chaos Storm** - Deals 0.8-1.4x attack as chaos damage to all enemies (random per target)

#### Chain & Spread Abilities

61. **Chain Fire** - Deals 1.2x attack as fire damage, chains to 3 enemies (damage reduces by 20% per chain)
62. **Lightning Rod** - Deals 1.3x attack as lightning damage, chains to all enemies
63. **Poison Spread** - Deals 1.0x attack as nature damage, applies poison that spreads to adjacent enemies
64. **Shadow Link** - Deals 1.1x attack as shadow damage, links all enemies (damage shared)
65. **Ripple Effect** - Deals 1.2x attack as water damage, spreads to adjacent enemies

#### Healing & Support

66. **Healing Wave** - Restores 30% max HP to all allies (existing, enhanced)
67. **Single Heal** - Restores 50% max HP to target ally
68. **Regeneration Field** - All allies restore 5% HP per turn for 3 turns
69. **Emergency Heal** - Restores 40% HP to lowest HP ally
70. **Mass Cleanse** - Removes all status effects from all allies
71. **Shield Wall** - Grants 30% max HP as shield to all allies
72. **Revitalize** - Restores 25% HP and 30 energy to target ally
73. **Life Transfer** - Transfers 20% of own HP to target ally
74. **Protective Barrier** - Grants 50% damage reduction to target ally for 2 turns
75. **Energy Surge** - All allies gain 40 energy

#### Buffs & Debuffs

76. **Power Boost** - Increases target ally's attack by 30% for 3 turns
77. **Fortify** - Increases target ally's defense by 40% for 3 turns
78. **Haste** - Increases target ally's speed by 25% for 3 turns
79. **Enrage** - Increases target ally's attack by 50% but reduces defense by 25% for 2 turns
80. **Weaken** - Reduces target enemy's attack by 30% for 3 turns
81. **Armor Break** - Reduces target enemy's defense by 40% for 3 turns
82. **Slow** - Reduces target enemy's speed by 30% for 3 turns
83. **Vulnerability** - Target enemy takes 25% more damage for 3 turns
84. **Marked** - Target enemy takes 20% more damage and cannot evade for 3 turns
85. **Taunt** - Forces target enemy to attack caster for 2 turns

#### Status Application

86. **Burn Strike** - Deals 1.2x attack as fire damage, applies burn for 3 turns
87. **Freeze Ray** - Deals 1.0x attack as ice damage, 60% chance to freeze for 2 turns
88. **Poison Dart** - Deals 0.8x attack as nature damage, applies poison for 4 turns
89. **Stun Blow** - Deals 1.1x attack as physical damage, 50% chance to stun for 1 turn
90. **Shock Touch** - Deals 1.0x attack as lightning damage, applies shock for 2 turns
91. **Bleed Strike** - Deals 1.2x attack as physical damage, applies bleed for 3 turns
92. **Fear Gaze** - Deals 0.9x attack as shadow damage, applies fear for 2 turns
93. **Blind Flash** - Deals 0.8x attack as light damage, applies blind for 2 turns
94. **Confusion Wave** - Deals 1.0x attack as arcane damage, applies confusion for 2 turns
95. **Paralyze** - Deals 1.1x attack as lightning damage, applies paralysis for 1 turn

#### Utility & Special

96. **Lifesteal Strike** - Deals 1.2x attack, heals self for 30% damage (existing, enhanced)
97. **Energy Drain** - Deals 1.0x attack, steals 30 energy from target
98. **Counter Shield** - Grants shield equal to 50% max HP, reflects 25% damage
99. **Teleport Strike** - Deals 1.4x attack, caster cannot be targeted next turn
100. **Phase Shift** - Becomes untargetable for 1 turn, next attack deals 150% damage
101. **Time Warp** - Reduces all cooldowns by 1 turn for all allies
102. **Mirror Image** - Creates copy that takes 50% of damage for 2 turns
103. **Dispel** - Removes all buffs from target enemy
104. **Silence** - Prevents target from using abilities for 2 turns
105. **Steal Buff** - Removes one buff from target and applies to self

#### Combination Abilities

106. **Fire & Ice** - Deals 1.3x attack as fire damage, then 1.0x as ice damage (steam effect)
107. **Lightning Storm** - Deals 1.2x attack as lightning damage, applies shock, then chains
108. **Shadow & Light** - Deals 1.4x attack as twilight damage (balanced element)
109. **Earth & Water** - Deals 1.2x attack as earth damage, applies mud (slow + defense reduction)
110. **Chaos Fusion** - Random combination of two elements, unpredictable effects

#### Advanced Mechanics

111. **Execute** - Deals 2.0x attack if target HP < 30%, otherwise 1.0x
112. **Combo Strike** - Deals 1.2x attack, if used again within 2 turns, deals 1.5x
113. **Momentum Build** - Deals 1.0x attack, each use increases damage by 0.2x (max 2.0x)
114. **Critical Focus** - Deals 1.3x attack, 100% critical hit chance
115. **Piercing Strike** - Deals 1.4x attack, ignores all defense
116. **Overkill** - Deals 1.5x attack, excess damage heals self
117. **Revenge** - Deals damage equal to damage taken last turn × 1.5
118. **Sacrifice** - Deals 2.0x attack, lose 20% max HP
119. **Berserk** - Deals 1.8x attack, lose 15% max HP, gain 30% attack for 2 turns
120. **Final Stand** - When HP < 25%, deals 2.5x attack, cannot be used otherwise

### 2.3 Ultimate Abilities (30+ Templates)

#### Massive Damage Ultimates

1. **Inferno** - Deals 2.5x attack as fire damage to all enemies (enhanced from 2.0x)
2. **Obliteration** - Deals 4.0x attack to single enemy (enhanced from 3.0x)
3. **Armageddon** - Deals 2.0x attack as chaos damage to all enemies, applies random status to each
4. **Meteor Strike** - Deals 3.0x attack as fire/earth damage to all enemies, stuns for 1 turn
5. **Void Collapse** - Deals 2.5x attack as shadow damage to all enemies, ignores all defenses
6. **Divine Judgment** - Deals 3.5x attack as light damage to single enemy, 2x damage to shadow
7. **Thunder God's Wrath** - Deals 2.8x attack as lightning damage to all enemies, chains infinitely
8. **Tidal Annihilation** - Deals 2.2x attack as water damage to all enemies, freezes all for 2 turns
9. **Earth Shatter** - Deals 2.5x attack as earth damage to all enemies, reduces defense by 50%
10. **Prismatic Burst** - Deals 2.0x attack as all elements to all enemies

#### Team-Wide Effects

11. **Divine Protection** - All allies gain 50% damage reduction and 50% max HP heal (enhanced)
12. **Battle Cry** - All allies gain 40% attack, 30% speed, and 30 energy
13. **Guardian's Blessing** - All allies gain shield equal to 100% max HP and remove all debuffs
14. **Time Stop** - All enemies skip next turn, all allies gain 50 energy
15. **Mass Resurrection** - Revive all defeated allies with 50% HP
16. **Overcharge** - All allies gain 100 energy and abilities cost 50% less for 2 turns
17. **Synergy Field** - All allies share 20% of damage taken, gain 30% all stats
18. **Harmony** - All allies restore 40% HP, remove all status effects, gain 30% all stats for 3 turns

#### Battlefield Modification

19. **Domain Expansion** - Creates elemental domain matching caster's element for 5 turns
20. **Reality Warp** - Battlefield effects: random element each turn, unpredictable
21. **Sanctuary** - All allies in back row gain 60% damage reduction
22. **Killing Field** - All enemies take 10% max HP damage per turn for 3 turns
23. **Healing Spring** - All allies restore 15% HP per turn for 5 turns
24. **Storm Field** - All lightning abilities chain, all allies gain 20% speed

#### Transformation Ultimates

25. **Dragon Form** - Transform for 3 turns: gain 50% all stats, fire abilities deal 2x damage
26. **Titan Mode** - Transform for 3 turns: gain 100% HP, 200% defense, but -50% speed
27. **Speed Demon** - Transform for 3 turns: gain 200% speed, attack twice per turn
28. **Elemental Fusion** - Transform for 3 turns: gain all elemental affinities, abilities are multi-element

#### Combination Ultimates

29. **Final Fusion** - Combine with ally: both gain 100% all stats, share HP pool for 3 turns
30. **Omega Strike** - Requires 3 turns to charge: deals 5.0x attack to all enemies, ignores everything

---

## 3. Implementation Notes

### Stat Rebalancing
- Update `src/shared/types/rarity.ts` with new RARITY_CONFIG
- Ensure all stat calculations use new ranges
- Update fusion stat calculations if needed
- Test combat balance with new stat ranges

### Ability Library Expansion
- Add all templates to `src/domain/services/AbilityTemplate.ts`
- Organize by category for easier maintenance
- Ensure elemental coverage across all families
- Balance energy costs and cooldowns appropriately
- Test ability combinations and synergies

### Power Scaling
- Abilities should scale with new stat ranges
- Damage multipliers may need adjustment
- Healing percentages should feel impactful
- Status effects should remain balanced

---

## 4. Balance Considerations

1. **Stat Progression**: Maintain clear power differences between rarities
2. **Ability Power**: Higher rarity abilities should feel more powerful
3. **Energy Costs**: Balance around 100 max energy (abilities cost 25-100)
4. **Cooldowns**: Active abilities 2-4 turns, Ultimates 5-7 turns
5. **Status Effects**: Duration 1-3 turns typically, ultimates can be longer
6. **Synergies**: Design abilities that work well together
7. **Counters**: Ensure no single strategy dominates

---

**Next Steps**: Implement enhanced stats in rarity.ts, then expand ability template library systematically.









