/**
 * Ability Library Seed Data
 * 50+ passive abilities for pets
 */

import { generateId } from '@/shared/utils/idGenerator';

export const createAbility = (
  name: string,
  type: 'passive' | 'active' | 'ultimate',
  element: string,
  description: string,
  effect: string,
  powerLevel: number = 1
): any => ({
  id: generateId('ABL') as any,
  name,
  type,
  element,
  description,
  effect,
  powerLevel,
});

/**
 * PASSIVE ABILITIES (50+)
 * These are always active and provide constant benefits
 */

// Fire Passives
export const FIRE_PASSIVES = [
  createAbility(
    'Magma Veins',
    'passive',
    'Fire',
    'Increases fire damage by 15% when HP is below 50%',
    'fire_damage_15_low_hp',
    1
  ),
  createAbility(
    'Combustion Core',
    'passive',
    'Fire',
    'Gains 10 energy at start of each turn',
    'energy_gain_10',
    1
  ),
  createAbility(
    'Heat Resonance',
    'passive',
    'Fire',
    'All fire abilities deal 20% more damage to heated/burned targets',
    'fire_damage_20_to_burned',
    2
  ),
  createAbility(
    'Flaming Aura',
    'passive',
    'Fire',
    'Deals 5% of own max HP as fire damage to adjacent enemies each turn',
    'aura_damage_5_percent',
    2
  ),
  createAbility(
    'Phoenix Blood',
    'passive',
    'Fire',
    'When defeated, revives with 30% HP once per battle',
    'revive_30_percent',
    3
  ),
];

// Water Passives
export const WATER_PASSIVES = [
  createAbility(
    'Tidal Flow',
    'passive',
    'Water',
    'Heals 8% of max HP when below 30% HP',
    'heal_8_low_hp',
    1
  ),
  createAbility(
    'Aquatic Resilience',
    'passive',
    'Water',
    'Reduces all status effect duration by 1 turn',
    'status_reduce_1',
    1
  ),
  createAbility(
    'Healing Waters',
    'passive',
    'Water',
    'All healing abilities used by this pet are 25% more effective',
    'healing_effectiveness_25',
    2
  ),
  createAbility(
    'Aqueous Shield',
    'passive',
    'Water',
    '20% resistance to critical hits',
    'crit_resistance_20',
    1
  ),
  createAbility(
    'Flow State',
    'passive',
    'Water',
    'When speed is reduced, automatically increases own speed by 15%',
    'auto_speed_boost_15',
    2
  ),
];

// Earth Passives
export const EARTH_PASSIVES = [
  createAbility(
    'Stone Stability',
    'passive',
    'Earth',
    'Increases defense by 15% when HP is above 75%',
    'defense_15_high_hp',
    1
  ),
  createAbility(
    'Life Essence',
    'passive',
    'Earth',
    'Heals 6% of max HP at the start of each turn',
    'auto_heal_6',
    1
  ),
  createAbility(
    'Mineral Armor',
    'passive',
    'Earth',
    'Reduces physical damage taken by 10%',
    'physical_resistance_10',
    1
  ),
  createAbility(
    'Root System',
    'passive',
    'Earth',
    'Can\'t be moved or forced back',
    'immovable',
    2
  ),
  createAbility(
    'Crystalline Body',
    'passive',
    'Earth',
    '25% chance to reflect physical attacks back to attacker',
    'reflect_physical_25',
    2
  ),
];

// Lightning Passives
export const LIGHTNING_PASSIVES = [
  createAbility(
    'Static Aura',
    'passive',
    'Lightning',
    'Deals 3% of own max HP as lightning damage to adjacent enemies each turn',
    'aura_damage_3_percent',
    1
  ),
  createAbility(
    'Energy Generation',
    'passive',
    'Lightning',
    'Gains 15 energy at start of each turn',
    'energy_gain_15',
    2
  ),
  createAbility(
    'Crit Surge',
    'passive',
    'Lightning',
    'Critical hit chance increased by 20%',
    'crit_chance_20',
    2
  ),
  createAbility(
    'Overcharge',
    'passive',
    'Lightning',
    'When using a lightning ability, gain extra 10 energy next turn',
    'energy_gain_10_after_lightning',
    2
  ),
  createAbility(
    'Lightning Speed',
    'passive',
    'Lightning',
    'Immune to speed reduction effects',
    'speed_immune',
    3
  ),
];

// Shadow Passives
export const SHADOW_PASSIVES = [
  createAbility(
    'Shadow Step',
    'passive',
    'Shadow',
    'Dodge chance increased by 15%',
    'dodge_chance_15',
    1
  ),
  createAbility(
    'Dark Empathy',
    'passive',
    'Shadow',
    'Abilities that deal shadow damage also steal 5% health from target',
    'lifesteal_5',
    2
  ),
  createAbility(
    'Energy Drain',
    'passive',
    'Shadow',
    'When attacking, steal 10 energy from target',
    'energy_steal_10',
    2
  ),
  createAbility(
    'Dark Mastery',
    'passive',
    'Shadow',
    'All shadow abilities deal 20% more damage',
    'shadow_damage_20',
    2
  ),
  createAbility(
    'Void Touch',
    'passive',
    'Shadow',
    'Attacks ignore 15% of target\'s defense',
    'ignore_defense_15',
    2
  ),
];

// Air Passives
export const AIR_PASSIVES = [
  createAbility(
    'Air Dancer',
    'passive',
    'Air',
    'Movement abilities cost 20% less energy',
    'movement_energy_20',
    1
  ),
  createAbility(
    'Speed Boost',
    'passive',
    'Air',
    'Increases speed by 15%',
    'speed_15',
    1
  ),
  createAbility(
    'Evasion',
    'passive',
    'Air',
    'Reduces incoming damage by 10%',
    'damage_reduction_10',
    1
  ),
  createAbility(
    'Zephyr Blessing',
    'passive',
    'Air',
    'When speed stat is higher than opponent, gain 10% damage boost',
    'speed_damage_boost_10',
    2
  ),
  createAbility(
    'Wind Pressure',
    'passive',
    'Air',
    'Opponents lose 10% speed',
    'opponent_speed_down_10',
    2
  ),
];

// Magic Passives
export const MAGIC_PASSIVES = [
  createAbility(
    'Mana Generation',
    'passive',
    'Magic',
    'Gains 12 mana at start of each turn',
    'mana_gain_12',
    1
  ),
  createAbility(
    'Magical Insight',
    'passive',
    'Magic',
    'Magic abilities cost 15% less energy',
    'magic_energy_15',
    1
  ),
  createAbility(
    'Spell Echo',
    'passive',
    'Magic',
    'Every third magic ability automatically triggers twice',
    'spell_echo_every_3',
    3
  ),
  createAbility(
    'Arcane Resonance',
    'passive',
    'Magic',
    'Magic damage increased by 15%',
    'magic_damage_15',
    1
  ),
  createAbility(
    'Mana Shield',
    'passive',
    'Magic',
    'Can spend mana instead of HP to reduce incoming damage',
    'mana_shield',
    2
  ),
];

// Light Passives
export const LIGHT_PASSIVES = [
  createAbility(
    'Holy Aura',
    'passive',
    'Light',
    'All allies gain 10% damage reduction in presence of this pet',
    'aura_defense_10',
    2
  ),
  createAbility(
    'Divine Protection',
    'passive',
    'Light',
    'Takes 15% less damage from dark/shadow attacks',
    'dark_resistance_15',
    1
  ),
  createAbility(
    'Healing Light',
    'passive',
    'Light',
    'Healing abilities are 20% more effective',
    'healing_20',
    1
  ),
  createAbility(
    'Radiance',
    'passive',
    'Light',
    'Illuminates darkness, reducing opponent\'s dodge chance by 10%',
    'dodge_reduction_10',
    1
  ),
  createAbility(
    'Holy Ascension',
    'passive',
    'Light',
    'When ally is defeated, healing received is increased by 30% next turn',
    'healing_30_on_ally_defeat',
    2
  ),
];

// Nature Passives
export const NATURE_PASSIVES = [
  createAbility(
    'Regrowth',
    'passive',
    'Nature',
    'Heals 10% of max HP at start of turn if damaged last turn',
    'heal_10_if_damaged',
    1
  ),
  createAbility(
    'Beast Soul',
    'passive',
    'Nature',
    'Attack power increased by 20% when fighting alone',
    'attack_20_solo',
    1
  ),
  createAbility(
    'Pack Bond',
    'passive',
    'Nature',
    'All allies gain 10% attack when this pet is on field',
    'team_attack_10',
    2
  ),
  createAbility(
    'Nature\'s Blessing',
    'passive',
    'Nature',
    'Environmental effects provide 15% boost to abilities',
    'environment_boost_15',
    2
  ),
  createAbility(
    'Wild Instinct',
    'passive',
    'Nature',
    'First action each turn has 25% chance to act again immediately',
    'double_act_25',
    3
  ),
];

// Chaotic Passives (Weirdos)
export const CHAOS_PASSIVES = [
  createAbility(
    'Unpredictable',
    'passive',
    'Chaos',
    'Incoming attacks have 20% chance to miss',
    'miss_chance_20',
    2
  ),
  createAbility(
    'Chaotic Nature',
    'passive',
    'Chaos',
    'Random chance (10-30%) to dodge attacks',
    'random_dodge_10_30',
    2
  ),
  createAbility(
    'Probability Shift',
    'passive',
    'Chaos',
    'Randomly increases stats by 5-15% at start of turn',
    'random_stat_5_15',
    2
  ),
];

/**
 * ALL_ABILITIES - Complete passive ability collection
 */
// import { Ability } from '@/domain/entities/Ability';

export const ALL_PASSIVE_ABILITIES = [
  ...FIRE_PASSIVES,
  ...WATER_PASSIVES,
  ...EARTH_PASSIVES,
  ...LIGHTNING_PASSIVES,
  ...SHADOW_PASSIVES,
  ...AIR_PASSIVES,
  ...MAGIC_PASSIVES,
  ...LIGHT_PASSIVES,
  ...NATURE_PASSIVES,
  ...CHAOS_PASSIVES,
];

export const PASSIVE_ABILITY_COUNT = ALL_PASSIVE_ABILITIES.length;

/**
 * ACTIVE ABILITIES (50+)
 * Helper function for creating active/ultimate abilities with proper structure
 */
import { Ability } from '@/domain/entities/Ability';
import type { AbilityEffect } from '@/domain/entities/Ability';

export const createActiveAbility = (
  name: string,
  type: 'active' | 'ultimate',
  element: string,
  description: string,
  energyCost: number,
  cooldown: number,
  effects: AbilityEffect[],
  tags: string[]
): Ability => {
  return new Ability(
    generateId('ABL') as any,
    name,
    description,
    type,
    energyCost,
    cooldown,
    0, // currentCooldown
    effects,
    tags,
    element
  );
};

// Fire Active Abilities
export const FIRE_ACTIVES = [
  createActiveAbility('Ember Shot', 'active', 'Fire',
    'Launch a concentrated ember projectile at a single enemy',
    50, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 40,
      element: 'Fire',
      scaling: 'attack'
    }],
    ['fire', 'projectile', 'basic']
  ),

  createActiveAbility('Puppy Flames', 'active', 'Fire',
    'Unleash playful flames that strike random enemies twice',
    60, 1,
    [{
      type: 'damage',
      target: 'random-enemies',
      value: 25,
      element: 'Fire',
      scaling: 'attack'
    }],
    ['fire', 'multi-hit', 'playful']
  ),

  createActiveAbility('Scorch', 'active', 'Fire',
    'Intense heat blast with 30% burn chance',
    70, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 55,
      element: 'Fire',
      scaling: 'attack'
    }, {
      type: 'status',
      target: 'single-enemy',
      value: 0,
      statusChance: 0.3,
      statusType: 'Burn' as any,
      statusDuration: 3
    }],
    ['fire', 'status', 'burn']
  ),

  createActiveAbility('Inferno Burst', 'active', 'Fire',
    'Explosive fire damage to all enemies',
    90, 3,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 70,
      element: 'Fire',
      scaling: 'attack'
    }],
    ['fire', 'aoe', 'burst']
  ),

  createActiveAbility('Phoenix Dive', 'active', 'Fire',
    'Dive attack that heals for 30% of damage dealt',
    80, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 65,
      element: 'Fire',
      scaling: 'attack',
      lifesteal: 0.3
    }],
    ['fire', 'lifesteal', 'dive']
  ),

  createActiveAbility('Flame Lance', 'ultimate', 'Fire',
    'Massive fire lance piercing through all enemies',
    120, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 120,
      element: 'Fire',
      scaling: 'attack'
    }],
    ['fire', 'ultimate', 'pierce']
  ),
];

// Water Active Abilities
export const WATER_ACTIVES = [
  createActiveAbility('Water Splash', 'active', 'Water',
    'Simple water projectile attack',
    45, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 35,
      element: 'Water',
      scaling: 'attack'
    }],
    ['water', 'projectile', 'basic']
  ),

  createActiveAbility('Bubble Beam', 'active', 'Water',
    'Stream of bubbles with 25% slow chance',
    65, 1,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 50,
      element: 'Water',
      scaling: 'attack'
    }, {
      type: 'status',
      target: 'single-enemy',
      value: 0,
      statusChance: 0.25,
      statusType: 'Slow' as any,
      statusDuration: 2
    }],
    ['water', 'status', 'bubble']
  ),

  createActiveAbility('Tidal Wave', 'active', 'Water',
    'Wave that damages all enemies',
    85, 3,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 60,
      element: 'Water',
      scaling: 'attack'
    }],
    ['water', 'aoe', 'wave']
  ),

  createActiveAbility('Healing Rain', 'active', 'Water',
    'Gentle rain that heals all allies',
    70, 4,
    [{
      type: 'heal',
      target: 'all-allies',
      value: 50,
      scaling: 'attack'
    }],
    ['water', 'heal', 'support']
  ),

  createActiveAbility('Frost Spear', 'active', 'Water',
    'Ice spear with high damage',
    75, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 70,
      element: 'Water',
      scaling: 'attack'
    }],
    ['water', 'ice', 'piercing']
  ),

  createActiveAbility('Oceanic Fury', 'ultimate', 'Water',
    'Massive wave engulfing all enemies with freeze chance',
    130, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 110,
      element: 'Water',
      scaling: 'attack'
    }, {
      type: 'status',
      target: 'all-enemies',
      value: 0,
      statusChance: 0.6,
      statusType: 'Freeze' as any,
      statusDuration: 2
    }],
    ['water', 'ultimate', 'freeze']
  ),
];

// Earth Active Abilities
export const EARTH_ACTIVES = [
  createActiveAbility('Rock Throw', 'active', 'Earth',
    'Hurl a rock at target enemy',
    50, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 42,
      element: 'Earth',
      scaling: 'attack'
    }],
    ['earth', 'projectile', 'basic']
  ),

  createActiveAbility('Boulder Smash', 'active', 'Earth',
    'Smash enemy with boulder, high damage',
    75, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 80,
      element: 'Earth',
      scaling: 'attack'
    }],
    ['earth', 'heavy', 'crush']
  ),

  createActiveAbility('Earthquake', 'active', 'Earth',
    'Ground quake damaging all enemies',
    90, 3,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 65,
      element: 'Earth',
      scaling: 'attack'
    }],
    ['earth', 'aoe', 'quake']
  ),

  createActiveAbility('Stone Shield', 'active', 'Earth',
    'Grant defense buff to self',
    60, 3,
    [{
      type: 'buff',
      target: 'self',
      value: 30
    }],
    ['earth', 'buff', 'defense']
  ),

  createActiveAbility('Crystal Shard', 'active', 'Earth',
    'Sharp crystal projectile',
    65, 1,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 55,
      element: 'Earth',
      scaling: 'attack'
    }],
    ['earth', 'crystal', 'sharp']
  ),

  createActiveAbility('Titan Slam', 'ultimate', 'Earth',
    'Devastating ground slam',
    125, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 125,
      element: 'Earth',
      scaling: 'attack'
    }],
    ['earth', 'ultimate', 'slam']
  ),
];

// Lightning Active Abilities
export const LIGHTNING_ACTIVES = [
  createActiveAbility('Lightning Bolt', 'active', 'Lightning',
    'Quick electric strike',
    50, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 45,
      element: 'Lightning',
      scaling: 'attack'
    }],
    ['lightning', 'bolt', 'basic']
  ),

  createActiveAbility('Static Shock', 'active', 'Lightning',
    'Electric shock with paralyze chance',
    65, 1,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 50,
      element: 'Lightning',
      scaling: 'attack'
    }, {
      type: 'status',
      target: 'single-enemy',
      value: 0,
      statusChance: 0.35,
      statusType: 'Paralyze' as any,
      statusDuration: 2
    }],
    ['lightning', 'shock', 'status']
  ),

  createActiveAbility('Chain Lightning', 'active', 'Lightning',
    'Lightning that chains between enemies',
    85, 2,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 55,
      element: 'Lightning',
      scaling: 'attack'
    }],
    ['lightning', 'chain', 'multi']
  ),

  createActiveAbility('Thunder Strike', 'active', 'Lightning',
    'Powerful single target strike',
    75, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 75,
      element: 'Lightning',
      scaling: 'attack'
    }],
    ['lightning', 'strike', 'power']
  ),

  createActiveAbility('Voltage Burst', 'active', 'Lightning',
    'Electric burst around self',
    70, 2,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 50,
      element: 'Lightning',
      scaling: 'attack'
    }],
    ['lightning', 'burst', 'aoe']
  ),

  createActiveAbility('Thunderstorm', 'ultimate', 'Lightning',
    'Devastating electrical storm',
    130, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 115,
      element: 'Lightning',
      scaling: 'attack'
    }],
    ['lightning', 'ultimate', 'storm']
  ),
];

// Shadow Active Abilities
export const SHADOW_ACTIVES = [
  createActiveAbility('Shadow Strike', 'active', 'Shadow',
    'Quick shadow tendril attack',
    50, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 40,
      element: 'Shadow',
      scaling: 'attack'
    }],
    ['shadow', 'strike', 'basic']
  ),

  createActiveAbility('Shadow Tendril', 'active', 'Shadow',
    'Grasping shadow with drain',
    70, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 55,
      element: 'Shadow',
      scaling: 'attack',
      lifesteal: 0.25
    }],
    ['shadow', 'drain', 'tendril']
  ),

  createActiveAbility('Void Bolt', 'active', 'Shadow',
    'Projectile of pure darkness',
    65, 1,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 60,
      element: 'Shadow',
      scaling: 'attack'
    }],
    ['shadow', 'void', 'projectile']
  ),

  createActiveAbility('Dark Pulse', 'active', 'Shadow',
    'Shadow wave hitting all foes',
    85, 3,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 60,
      element: 'Shadow',
      scaling: 'attack'
    }],
    ['shadow', 'pulse', 'aoe']
  ),

  createActiveAbility('Nightmare', 'active', 'Shadow',
    'Inflict fear debuff',
    75, 3,
    [{
      type: 'debuff',
      target: 'single-enemy',
      value: 25
    }],
    ['shadow', 'debuff', 'fear']
  ),

  createActiveAbility('Void Collapse', 'ultimate', 'Shadow',
    'Crushing void damage to all',
    125, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 120,
      element: 'Shadow',
      scaling: 'attack'
    }],
    ['shadow', 'ultimate', 'void']
  ),
];

// Air Active Abilities
export const AIR_ACTIVES = [
  createActiveAbility('Gust', 'active', 'Air',
    'Wind gust projectile',
    45, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 38,
      element: 'Air',
      scaling: 'attack'
    }],
    ['air', 'gust', 'basic']
  ),

  createActiveAbility('Wind Slash', 'active', 'Air',
    'Cutting wind blade',
    65, 1,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 58,
      element: 'Air',
      scaling: 'attack'
    }],
    ['air', 'slash', 'cutting']
  ),

  createActiveAbility('Cyclone', 'active', 'Air',
    'Spinning wind hitting all enemies',
    85, 3,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 62,
      element: 'Air',
      scaling: 'attack'
    }],
    ['air', 'cyclone', 'aoe']
  ),

  createActiveAbility('Tailwind', 'active', 'Air',
    'Speed buff to all allies',
    60, 4,
    [{
      type: 'buff',
      target: 'all-allies',
      value: 20
    }],
    ['air', 'buff', 'speed']
  ),

  createActiveAbility('Aerial Dive', 'active', 'Air',
    'Swift diving attack',
    70, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 68,
      element: 'Air',
      scaling: 'speed'
    }],
    ['air', 'dive', 'swift']
  ),

  createActiveAbility('Hurricane Force', 'ultimate', 'Air',
    'Devastating hurricane',
    130, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 118,
      element: 'Air',
      scaling: 'attack'
    }],
    ['air', 'ultimate', 'hurricane']
  ),
];

// Magic Active Abilities
export const MAGIC_ACTIVES = [
  createActiveAbility('Arcane Bolt', 'active', 'Magic',
    'Basic magic projectile',
    50, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 43,
      element: 'Magic',
      scaling: 'attack'
    }],
    ['magic', 'arcane', 'basic']
  ),

  createActiveAbility('Mystic Missile', 'active', 'Magic',
    'Homing magic missile',
    65, 1,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 56,
      element: 'Magic',
      scaling: 'attack'
    }],
    ['magic', 'missile', 'homing']
  ),

  createActiveAbility('Arcane Explosion', 'active', 'Magic',
    'Magic explosion hitting all foes',
    90, 3,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 68,
      element: 'Magic',
      scaling: 'attack'
    }],
    ['magic', 'explosion', 'aoe']
  ),

  createActiveAbility('Spell Barrier', 'active', 'Magic',
    'Magic shield for allies',
    70, 4,
    [{
      type: 'buff',
      target: 'all-allies',
      value: 25
    }],
    ['magic', 'barrier', 'defense']
  ),

  createActiveAbility('Mana Surge', 'active', 'Magic',
    'Powerful magic blast',
    80, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 77,
      element: 'Magic',
      scaling: 'attack'
    }],
    ['magic', 'surge', 'power']
  ),

  createActiveAbility('Arcane Apocalypse', 'ultimate', 'Magic',
    'Ultimate magical destruction',
    135, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 122,
      element: 'Magic',
      scaling: 'attack'
    }],
    ['magic', 'ultimate', 'apocalypse']
  ),
];

// Light Active Abilities
export const LIGHT_ACTIVES = [
  createActiveAbility('Light Ray', 'active', 'Light',
    'Beam of pure light',
    50, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 40,
      element: 'Light',
      scaling: 'attack'
    }],
    ['light', 'ray', 'basic']
  ),

  createActiveAbility('Holy Smite', 'active', 'Light',
    'Divine strike from above',
    70, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 65,
      element: 'Light',
      scaling: 'attack'
    }],
    ['light', 'smite', 'holy']
  ),

  createActiveAbility('Radiance', 'active', 'Light',
    'Healing light for all allies',
    75, 4,
    [{
      type: 'heal',
      target: 'all-allies',
      value: 55,
      scaling: 'attack'
    }],
    ['light', 'heal', 'radiance']
  ),

  createActiveAbility('Purifying Beam', 'active', 'Light',
    'Remove debuffs and heal',
    80, 3,
    [{
      type: 'heal',
      target: 'all-allies',
      value: 45,
      scaling: 'attack'
    }, {
      type: 'special',
      target: 'all-allies',
      value: 0
    }],
    ['light', 'purify', 'cleanse']
  ),

  createActiveAbility('Solar Flare', 'active', 'Light',
    'Blinding light attack',
    85, 2,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 64,
      element: 'Light',
      scaling: 'attack'
    }],
    ['light', 'flare', 'blind']
  ),

  createActiveAbility('Divine Judgement', 'ultimate', 'Light',
    'Ultimate holy power',
    130, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 120,
      element: 'Light',
      scaling: 'attack'
    }],
    ['light', 'ultimate', 'judgement']
  ),
];

// Nature Active Abilities
export const NATURE_ACTIVES = [
  createActiveAbility('Nature Strike', 'active', 'Nature',
    'Natural energy strike',
    50, 0,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 41,
      element: 'Nature',
      scaling: 'attack'
    }],
    ['nature', 'strike', 'basic']
  ),

  createActiveAbility('Vine Whip', 'active', 'Nature',
    'Lashing vines attack',
    65, 1,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 54,
      element: 'Nature',
      scaling: 'attack'
    }],
    ['nature', 'vine', 'whip']
  ),

  createActiveAbility('Natures Wrath', 'active', 'Nature',
    'Natural fury against all foes',
    85, 3,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 61,
      element: 'Nature',
      scaling: 'attack'
    }],
    ['nature', 'wrath', 'aoe']
  ),

  createActiveAbility('Regeneration', 'active', 'Nature',
    'Heal over time for allies',
    70, 4,
    [{
      type: 'heal',
      target: 'all-allies',
      value: 48,
      scaling: 'attack'
    }],
    ['nature', 'heal', 'regen']
  ),

  createActiveAbility('Thorn Strike', 'active', 'Nature',
    'Sharp thorn projectile',
    60, 1,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 52,
      element: 'Nature',
      scaling: 'attack'
    }],
    ['nature', 'thorn', 'sharp']
  ),

  createActiveAbility('Gaia Force', 'ultimate', 'Nature',
    'Power of the earth itself',
    125, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 117,
      element: 'Nature',
      scaling: 'attack'
    }],
    ['nature', 'ultimate', 'gaia']
  ),
];

// Chaos Active Abilities
export const CHAOS_ACTIVES = [
  createActiveAbility('Weird Slap', 'active', 'Chaos',
    'Unpredictable melee attack',
    50, 0,
    [{
      type: 'damage',
      target: 'random-enemies',
      value: 45,
      element: 'Chaos',
      scaling: 'attack'
    }],
    ['chaos', 'random', 'basic']
  ),

  createActiveAbility('Chaotic Burst', 'active', 'Chaos',
    'Random element damage',
    70, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 60,
      element: 'Chaos',
      scaling: 'attack'
    }],
    ['chaos', 'burst', 'random']
  ),

  createActiveAbility('Mutation Strike', 'active', 'Chaos',
    'Strike with random effect',
    75, 2,
    [{
      type: 'damage',
      target: 'single-enemy',
      value: 58,
      element: 'Chaos',
      scaling: 'attack'
    }, {
      type: 'special',
      target: 'single-enemy',
      value: 0
    }],
    ['chaos', 'mutation', 'random']
  ),

  createActiveAbility('Reality Warp', 'active', 'Chaos',
    'Warp reality damaging all',
    90, 3,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 66,
      element: 'Chaos',
      scaling: 'attack'
    }],
    ['chaos', 'warp', 'aoe']
  ),

  createActiveAbility('Entropy', 'active', 'Chaos',
    'Chaotic entropy debuff',
    65, 3,
    [{
      type: 'debuff',
      target: 'all-enemies',
      value: 20
    }],
    ['chaos', 'entropy', 'debuff']
  ),

  createActiveAbility('Chaos Rift', 'ultimate', 'Chaos',
    'Tear in reality itself',
    140, 5,
    [{
      type: 'damage',
      target: 'all-enemies',
      value: 125,
      element: 'Chaos',
      scaling: 'attack'
    }],
    ['chaos', 'ultimate', 'rift']
  ),
];

/**
 * ALL_ACTIVE_ABILITIES - Complete active ability collection
 */
export const ALL_ACTIVE_ABILITIES: Ability[] = [
  ...FIRE_ACTIVES,
  ...WATER_ACTIVES,
  ...EARTH_ACTIVES,
  ...LIGHTNING_ACTIVES,
  ...SHADOW_ACTIVES,
  ...AIR_ACTIVES,
  ...MAGIC_ACTIVES,
  ...LIGHT_ACTIVES,
  ...NATURE_ACTIVES,
  ...CHAOS_ACTIVES,
];

export const ACTIVE_ABILITY_COUNT = ALL_ACTIVE_ABILITIES.length;
