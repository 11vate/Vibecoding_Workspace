/**
 * Base Pet Seed Data - Remaining Families (Part 2)
 * Families 6-10: AERO_FLIGHT, ARCANE_RIFT, LUMINA, WEIRDOS, TERRA_FORGED
 * Extracted from docs/CONTENT/PET_DESIGNS.md
 */

import { Rarity } from '@/shared/types/rarity';
import type { BasePet } from '@/domain/entities/BasePet';
import { generateId } from '@/shared/utils/idGenerator';

const createBasePet = (
  name: string,
  family: any,
  rarity: any,
  baseStats: { hp: number; attack: number; defense: number; speed: number },
  starterAbilities: string[],
  starterPassives: string[],
  lore: string,
  visualTags: string[] = []
): BasePet => ({
  id: generateId('BPET') as any,
  name,
  family,
  rarity,
  baseStats,
  starterAbilities,
  starterPassives,
  lore,
  visualTags,
});

/**
 * AERO_FLIGHT Family (Air/Wind) - 15 pets
 */
export const AERO_FLIGHT_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Windpuff',
    'AERO_FLIGHT',
    Rarity.BASIC,
    { hp: 490, attack: 50, defense: 35, speed: 80 },
    ['Gust'],
    ['Air Dancer'],
    'A small creature made of swirling wind that hovers gracefully through The Grid.',
    ['air', 'wind', 'light']
  ),
  createBasePet(
    'Breezeeling',
    'AERO_FLIGHT',
    Rarity.BASIC,
    { hp: 500, attack: 48, defense: 38, speed: 78 },
    ['Gentle Breeze'],
    ['Speed Boost'],
    'A tiny air spirit that brings refreshing breezes wherever it goes.',
    ['air', 'breeze', 'gentle']
  ),
  createBasePet(
    'Skywing',
    'AERO_FLIGHT',
    Rarity.BASIC,
    { hp: 510, attack: 52, defense: 36, speed: 82 },
    ['Sky Slash'],
    ['Air Dancer', 'Speed Boost'],
    'A winged creature that glides through The Grid\'s digital skies with ease.',
    ['air', 'wing', 'swift']
  ),
  createBasePet(
    'Mistdancer',
    'AERO_FLIGHT',
    Rarity.BASIC,
    { hp: 495, attack: 51, defense: 34, speed: 83 },
    ['Mist Cloud'],
    ['Evasion'],
    'A ghostly air spirit that can vanish in mist when threatened.',
    ['air', 'mist', 'evasive']
  ),
  createBasePet(
    'Zephyrling',
    'AERO_FLIGHT',
    Rarity.BASIC,
    { hp: 505, attack: 49, defense: 37, speed: 81 },
    ['Zephyr Blow'],
    ['Air Dancer', 'Evasion'],
    'A small wind elemental that embodies the spirit of gentle zephyrs.',
    ['air', 'zephyr', 'gentle']
  ),

  // Rare Tier (3)
  createBasePet(
    'Stormrider',
    'AERO_FLIGHT',
    Rarity.RARE,
    { hp: 840, attack: 88, defense: 62, speed: 92 },
    ['Storm Ride'],
    ['Speed Boost', 'Air Dancer', 'Evasion'],
    'A creature that rides the winds of great storms with fearless grace.',
    ['air', 'storm', 'brave']
  ),
  createBasePet(
    'Tornadoling',
    'AERO_FLIGHT',
    Rarity.RARE,
    { hp: 870, attack: 92, defense: 58, speed: 94 },
    ['Mini Tornado'],
    ['Air Dancer', 'Speed Boost'],
    'A swirling tornado in miniature form, capable of significant destruction.',
    ['air', 'tornado', 'destructive']
  ),
  createBasePet(
    'Skyravage',
    'AERO_FLIGHT',
    Rarity.RARE,
    { hp: 850, attack: 90, defense: 60, speed: 93 },
    ['Sky Rend'],
    ['Evasion', 'Air Dancer'],
    'A creature that tears through the skies with destructive force.',
    ['air', 'sky', 'fierce']
  ),

  // SR Tier (3)
  createBasePet(
    'Windwarden',
    'AERO_FLIGHT',
    Rarity.SR,
    { hp: 1400, attack: 135, defense: 95, speed: 95 },
    ['Wind Guardian'],
    ['Speed Boost', 'Air Dancer', 'Evasion'],
    'A guardian spirit of the winds that protects those who respect the air.',
    ['air', 'guardian', 'protective']
  ),
  createBasePet(
    'Cyclondrake',
    'AERO_FLIGHT',
    Rarity.SR,
    { hp: 1450, attack: 140, defense: 90, speed: 97 },
    ['Cyclone Breath'],
    ['Air Dancer', 'Speed Boost'],
    'A dragon-like creature made of spinning cyclones.',
    ['air', 'dragon', 'spinning']
  ),
  createBasePet(
    'Cloudwalker',
    'AERO_FLIGHT',
    Rarity.SR,
    { hp: 1420, attack: 138, defense: 92, speed: 96 },
    ['Cloud Walk'],
    ['Evasion', 'Air Dancer', 'Speed Boost'],
    'A creature that can walk on clouds as if they were solid ground.',
    ['air', 'cloud', 'ethereal']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Skycaller',
    'AERO_FLIGHT',
    Rarity.LEGENDARY,
    { hp: 2200, attack: 200, defense: 140, speed: 100 },
    ['Sky Storm'],
    ['Speed Boost', 'Air Dancer', 'Evasion'],
    'A master of the winds capable of summoning great aerial storms.',
    ['air', 'storm', 'legendary']
  ),
  createBasePet(
    'Hurricane Heart',
    'AERO_FLIGHT',
    Rarity.LEGENDARY,
    { hp: 2300, attack: 205, defense: 135, speed: 102 },
    ['Hurricane'],
    ['Air Dancer', 'Speed Boost'],
    'The embodiment of hurricanes themselves, a force of nature incarnate.',
    ['air', 'hurricane', 'legendary']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Wind Incarnate',
    'AERO_FLIGHT',
    Rarity.MYTHIC,
    { hp: 3600, attack: 320, defense: 200, speed: 115 },
    ['Wind Mastery'],
    ['Speed Boost', 'Air Dancer', 'Evasion'],
    'The ultimate embodiment of wind and air, faster than thought.',
    ['air', 'god', 'mythic']
  ),
  createBasePet(
    'Sky God',
    'AERO_FLIGHT',
    Rarity.MYTHIC,
    { hp: 3800, attack: 330, defense: 210, speed: 110 },
    ['Sky Dominion'],
    ['Air Dancer', 'Speed Boost'],
    'A divine being that rules all of The Grid\'s skies.',
    ['air', 'god', 'mythic']
  ),
];

/**
 * ARCANE_RIFT Family (Magic/Arcane) - 15 pets
 */
export const ARCANE_RIFT_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Spellling',
    'ARCANE_RIFT',
    Rarity.BASIC,
    { hp: 510, attack: 48, defense: 40, speed: 70 },
    ['Magic Missile'],
    ['Mana Generation'],
    'A tiny mage sprite that glows with magical energy.',
    ['magic', 'arcane', 'small']
  ),
  createBasePet(
    'Rune Sprite',
    'ARCANE_RIFT',
    Rarity.BASIC,
    { hp: 520, attack: 46, defense: 42, speed: 68 },
    ['Rune Cast'],
    ['Magical Insight'],
    'A small creature made of magical runes that constantly glow.',
    ['magic', 'rune', 'mystical']
  ),
  createBasePet(
    'Orblet',
    'ARCANE_RIFT',
    Rarity.BASIC,
    { hp: 530, attack: 50, defense: 38, speed: 72 },
    ['Orb Blast'],
    ['Mana Generation', 'Magical Insight'],
    'A floating magical orb that crackles with arcane energy.',
    ['magic', 'orb', 'glowing']
  ),
  createBasePet(
    'Glyphling',
    'ARCANE_RIFT',
    Rarity.BASIC,
    { hp: 505, attack: 49, defense: 39, speed: 71 },
    ['Glyph Strike'],
    ['Spell Echo'],
    'A creature inscribed with magical glyphs that grant it power.',
    ['magic', 'glyph', 'ancient']
  ),
  createBasePet(
    'Aetherwing',
    'ARCANE_RIFT',
    Rarity.BASIC,
    { hp: 515, attack: 47, defense: 41, speed: 69 },
    ['Aether Touch'],
    ['Mana Generation', 'Spell Echo'],
    'A small winged spirit made of pure aetheric energy.',
    ['magic', 'aether', 'ethereal']
  ),

  // Rare Tier (3)
  createBasePet(
    'Spellweaver',
    'ARCANE_RIFT',
    Rarity.RARE,
    { hp: 860, attack: 85, defense: 65, speed: 82 },
    ['Weave Spell'],
    ['Mana Generation', 'Magical Insight', 'Spell Echo'],
    'A master of weaving spells from pure arcane essence.',
    ['magic', 'weaver', 'powerful']
  ),
  createBasePet(
    'Rune Master',
    'ARCANE_RIFT',
    Rarity.RARE,
    { hp: 890, attack: 82, defense: 68, speed: 80 },
    ['Master Rune'],
    ['Magical Insight', 'Mana Generation'],
    'A creature that has mastered the ancient runes of power.',
    ['magic', 'rune', 'wise']
  ),
  createBasePet(
    'Orbcaster',
    'ARCANE_RIFT',
    Rarity.RARE,
    { hp: 870, attack: 88, defense: 62, speed: 84 },
    ['Orb Cascade'],
    ['Spell Echo', 'Magical Insight'],
    'A spellcaster that hurls cascades of magical orbs.',
    ['magic', 'caster', 'intense']
  ),

  // SR Tier (3)
  createBasePet(
    'Archmage',
    'ARCANE_RIFT',
    Rarity.SR,
    { hp: 1480, attack: 128, defense: 110, speed: 85 },
    ['Arcane Mastery'],
    ['Mana Generation', 'Magical Insight', 'Spell Echo'],
    'An ancient archmage who has studied magic for countless ages.',
    ['magic', 'mage', 'powerful']
  ),
  createBasePet(
    'Spell Sage',
    'ARCANE_RIFT',
    Rarity.SR,
    { hp: 1510, attack: 130, defense: 108, speed: 87 },
    ['Sage Knowledge'],
    ['Magical Insight', 'Mana Generation'],
    'A sage that holds the wisdom of all magical knowledge.',
    ['magic', 'sage', 'wise']
  ),
  createBasePet(
    'Rift Walker',
    'ARCANE_RIFT',
    Rarity.SR,
    { hp: 1450, attack: 135, defense: 105, speed: 86 },
    ['Rift Walk'],
    ['Spell Echo', 'Magical Insight', 'Mana Generation'],
    'A creature that walks between the rifts of magical dimensions.',
    ['magic', 'walker', 'mysterious']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Arcane Sovereign',
    'ARCANE_RIFT',
    Rarity.LEGENDARY,
    { hp: 2380, attack: 175, defense: 165, speed: 92 },
    ['Arcane Dominion'],
    ['Mana Generation', 'Magical Insight', 'Spell Echo'],
    'A sovereign ruler of all arcane magic within The Grid.',
    ['magic', 'sovereign', 'legendary']
  ),
  createBasePet(
    'Rift Guardian',
    'ARCANE_RIFT',
    Rarity.LEGENDARY,
    { hp: 2420, attack: 180, defense: 160, speed: 90 },
    ['Rift Guard'],
    ['Magical Insight', 'Mana Generation'],
    'The eternal guardian of the magical rifts in The Grid.',
    ['magic', 'guardian', 'legendary']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Arcane Incarnate',
    'ARCANE_RIFT',
    Rarity.MYTHIC,
    { hp: 3950, attack: 285, defense: 250, speed: 98 },
    ['Arcane Godhood'],
    ['Mana Generation', 'Magical Insight', 'Spell Echo'],
    'The ultimate embodiment of all arcane magic.',
    ['magic', 'god', 'mythic']
  ),
  createBasePet(
    'Cosmic Mage',
    'ARCANE_RIFT',
    Rarity.MYTHIC,
    { hp: 4100, attack: 300, defense: 260, speed: 95 },
    ['Cosmic Magic'],
    ['Magical Insight', 'Mana Generation'],
    'A being that wields the magic of the cosmos itself.',
    ['magic', 'cosmic', 'mythic']
  ),
];

/**
 * LUMINA Family (Light/Celestial) - 15 pets
 */
export const LUMINA_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Lightling',
    'LUMINA',
    Rarity.BASIC,
    { hp: 520, attack: 48, defense: 42, speed: 72 },
    ['Light Beam'],
    ['Holy Aura'],
    'A small creature made of pure light that glows warmly.',
    ['light', 'holy', 'bright']
  ),
  createBasePet(
    'Celestial Spark',
    'LUMINA',
    Rarity.BASIC,
    { hp: 530, attack: 46, defense: 44, speed: 70 },
    ['Celestial Flame'],
    ['Divine Protection'],
    'A spark of celestial energy that brings hope.',
    ['light', 'celestial', 'holy']
  ),
  createBasePet(
    'Starling',
    'LUMINA',
    Rarity.BASIC,
    { hp: 540, attack: 50, defense: 40, speed: 74 },
    ['Star Bolt'],
    ['Holy Aura', 'Divine Protection'],
    'A creature that glows like a tiny star.',
    ['light', 'star', 'shining']
  ),
  createBasePet(
    'Aureolin',
    'LUMINA',
    Rarity.BASIC,
    { hp: 515, attack: 49, defense: 41, speed: 73 },
    ['Golden Touch'],
    ['Healing Light'],
    'A golden being that brings warmth and healing.',
    ['light', 'gold', 'warm']
  ),
  createBasePet(
    'Luminifly',
    'LUMINA',
    Rarity.BASIC,
    { hp: 525, attack: 47, defense: 43, speed: 71 },
    ['Luminous Glow'],
    ['Holy Aura', 'Healing Light'],
    'A flying creature of pure luminescence.',
    ['light', 'fly', 'glowing']
  ),

  // Rare Tier (3)
  createBasePet(
    'Sanctifier',
    'LUMINA',
    Rarity.RARE,
    { hp: 880, attack: 85, defense: 70, speed: 84 },
    ['Sanctify'],
    ['Holy Aura', 'Divine Protection', 'Healing Light'],
    'A creature that sanctifies and purifies everything it touches.',
    ['light', 'holy', 'powerful']
  ),
  createBasePet(
    'Stellar Guard',
    'LUMINA',
    Rarity.RARE,
    { hp: 910, attack: 82, defense: 73, speed: 82 },
    ['Stellar Shield'],
    ['Divine Protection', 'Holy Aura'],
    'A guardian made of stellar light.',
    ['light', 'guard', 'protective']
  ),
  createBasePet(
    'Dawnbringer',
    'LUMINA',
    Rarity.RARE,
    { hp: 890, attack: 88, defense: 68, speed: 86 },
    ['Bring Dawn'],
    ['Healing Light', 'Divine Protection'],
    'A being that brings the light of dawn wherever it goes.',
    ['light', 'dawn', 'bright']
  ),

  // SR Tier (3)
  createBasePet(
    'Holy Warden',
    'LUMINA',
    Rarity.SR,
    { hp: 1530, attack: 128, defense: 125, speed: 87 },
    ['Holy Barrier'],
    ['Holy Aura', 'Divine Protection', 'Healing Light'],
    'A warden of holy light that protects the innocent.',
    ['light', 'warden', 'protective']
  ),
  createBasePet(
    'Stellar Sage',
    'LUMINA',
    Rarity.SR,
    { hp: 1560, attack: 130, defense: 123, speed: 89 },
    ['Stellar Wisdom'],
    ['Divine Protection', 'Healing Light'],
    'A sage blessed with stellar wisdom.',
    ['light', 'sage', 'wise']
  ),
  createBasePet(
    'Radiant Phoenix',
    'LUMINA',
    Rarity.SR,
    { hp: 1510, attack: 135, defense: 120, speed: 88 },
    ['Radiant Flame'],
    ['Healing Light', 'Holy Aura', 'Divine Protection'],
    'A phoenix made of radiant celestial light.',
    ['light', 'phoenix', 'bright']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Divine Guardian',
    'LUMINA',
    Rarity.LEGENDARY,
    { hp: 2480, attack: 175, defense: 180, speed: 94 },
    ['Divine Guardian'],
    ['Holy Aura', 'Divine Protection', 'Healing Light'],
    'A divine being that guards all of The Grid.',
    ['light', 'divine', 'legendary']
  ),
  createBasePet(
    'Celestial Sovereign',
    'LUMINA',
    Rarity.LEGENDARY,
    { hp: 2520, attack: 180, defense: 175, speed: 92 },
    ['Celestial Dominion'],
    ['Divine Protection', 'Healing Light'],
    'A celestial sovereign that rules with light and justice.',
    ['light', 'sovereign', 'legendary']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Light Incarnate',
    'LUMINA',
    Rarity.MYTHIC,
    { hp: 4050, attack: 285, defense: 270, speed: 100 },
    ['Light Godhood'],
    ['Holy Aura', 'Divine Protection', 'Healing Light'],
    'The ultimate embodiment of light and goodness.',
    ['light', 'god', 'mythic']
  ),
  createBasePet(
    'Celestial God',
    'LUMINA',
    Rarity.MYTHIC,
    { hp: 4200, attack: 300, defense: 280, speed: 98 },
    ['Celestial Ascension'],
    ['Divine Protection', 'Healing Light'],
    'A god of the celestial realms.',
    ['light', 'god', 'mythic']
  ),
];

/**
 * WEIRDOS Family (Chaotic/Unique) - 15 pets
 */
export const WEIRDOS_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Oddling',
    'WEIRDOS',
    Rarity.BASIC,
    { hp: 540, attack: 50, defense: 40, speed: 65 },
    ['Weird Slap'],
    ['Unpredictable'],
    'A creature that defies classification and acts in unexpected ways.',
    ['weird', 'chaotic', 'odd']
  ),
  createBasePet(
    'Glitch Sprite',
    'WEIRDOS',
    Rarity.BASIC,
    { hp: 550, attack: 52, defense: 38, speed: 68 },
    ['Glitch Pulse'],
    ['Chaotic Nature'],
    'A small being made of glitched code that shouldn\'t exist.',
    ['weird', 'glitch', 'broken']
  ),
  createBasePet(
    'Nonsenseling',
    'WEIRDOS',
    Rarity.BASIC,
    { hp: 535, attack: 48, defense: 42, speed: 66 },
    ['Nonsense Attack'],
    ['Unpredictable', 'Chaotic Nature'],
    'A creature that follows no logic whatsoever.',
    ['weird', 'chaotic', 'silly']
  ),
  createBasePet(
    'Random Critter',
    'WEIRDOS',
    Rarity.BASIC,
    { hp: 545, attack: 51, defense: 39, speed: 67 },
    ['Random Burst'],
    ['Probability Shift'],
    'A being whose very nature is based on randomness.',
    ['weird', 'random', 'strange']
  ),
  createBasePet(
    'Absurdling',
    'WEIRDOS',
    Rarity.BASIC,
    { hp: 555, attack: 49, defense: 41, speed: 64 },
    ['Absurd Strike'],
    ['Unpredictable', 'Probability Shift'],
    'A creature that exists in pure absurdity.',
    ['weird', 'absurd', 'silly']
  ),

  // Rare Tier (3)
  createBasePet(
    'Chaos Dancer',
    'WEIRDOS',
    Rarity.RARE,
    { hp: 900, attack: 92, defense: 60, speed: 88 },
    ['Chaos Dance'],
    ['Chaotic Nature', 'Unpredictable', 'Probability Shift'],
    'A dancer that moves in impossibly chaotic ways.',
    ['weird', 'chaos', 'dancer']
  ),
  createBasePet(
    'Glitch Lord',
    'WEIRDOS',
    Rarity.RARE,
    { hp: 920, attack: 90, defense: 62, speed: 86 },
    ['Glitch Flood'],
    ['Chaotic Nature', 'Probability Shift'],
    'A being made entirely of corrupted code.',
    ['weird', 'glitch', 'powerful']
  ),
  createBasePet(
    'Paradox Beast',
    'WEIRDOS',
    Rarity.RARE,
    { hp: 910, attack: 94, defense: 58, speed: 87 },
    ['Paradox'],
    ['Unpredictable', 'Chaotic Nature'],
    'A creature that exists and doesn\'t exist simultaneously.',
    ['weird', 'paradox', 'strange']
  ),

  // SR Tier (3)
  createBasePet(
    'Chaos Lord',
    'WEIRDOS',
    Rarity.SR,
    { hp: 1550, attack: 140, defense: 100, speed: 90 },
    ['Chaos Reign'],
    ['Chaotic Nature', 'Unpredictable', 'Probability Shift'],
    'A lord of chaos that rules the absurd.',
    ['weird', 'chaos', 'powerful']
  ),
  createBasePet(
    'Glitch Phoenix',
    'WEIRDOS',
    Rarity.SR,
    { hp: 1540, attack: 145, defense: 95, speed: 92 },
    ['Glitch Rebirth'],
    ['Probability Shift', 'Chaotic Nature'],
    'A phoenix made entirely of glitches.',
    ['weird', 'glitch', 'rebirth']
  ),
  createBasePet(
    'Absurdity Embodied',
    'WEIRDOS',
    Rarity.SR,
    { hp: 1560, attack: 138, defense: 102, speed: 88 },
    ['Pure Absurdity'],
    ['Unpredictable', 'Chaotic Nature', 'Probability Shift'],
    'The living embodiment of pure absurdity.',
    ['weird', 'absurd', 'silly']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Chaos Incarnate',
    'WEIRDOS',
    Rarity.LEGENDARY,
    { hp: 2500, attack: 200, defense: 140, speed: 96 },
    ['Absolute Chaos'],
    ['Chaotic Nature', 'Unpredictable', 'Probability Shift'],
    'The very embodiment of chaos itself.',
    ['weird', 'chaos', 'legendary']
  ),
  createBasePet(
    'Glitch God',
    'WEIRDOS',
    Rarity.LEGENDARY,
    { hp: 2450, attack: 205, defense: 135, speed: 98 },
    ['Divine Glitch'],
    ['Probability Shift', 'Chaotic Nature'],
    'A god made of glitched code that shouldn\'t exist but does.',
    ['weird', 'glitch', 'legendary']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Chaos God',
    'WEIRDOS',
    Rarity.MYTHIC,
    { hp: 4100, attack: 320, defense: 180, speed: 105 },
    ['Chaos Godhood'],
    ['Chaotic Nature', 'Unpredictable', 'Probability Shift'],
    'A god of absolute chaos whose nature defies comprehension.',
    ['weird', 'chaos', 'mythic']
  ),
  createBasePet(
    'Impossible Being',
    'WEIRDOS',
    Rarity.MYTHIC,
    { hp: 4300, attack: 340, defense: 170, speed: 103 },
    ['Impossibility Manifest'],
    ['Unpredictable', 'Probability Shift'],
    'A being so weird and impossible that it shouldn\'t exist in any reality.',
    ['weird', 'impossible', 'mythic']
  ),
];

/**
 * TERRA_FORGED Family (Nature/Primal) - 15 pets
 */
export const TERRA_FORGED_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Sprout',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 560, attack: 48, defense: 46, speed: 60 },
    ['Vine Whip'],
    ['Regrowth'],
    'A small plant creature full of growing potential.',
    ['nature', 'plant', 'growth']
  ),
  createBasePet(
    'Wildling',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 570, attack: 50, defense: 44, speed: 62 },
    ['Wild Claw'],
    ['Beast Soul'],
    'A wild creature that embodies untamed nature.',
    ['nature', 'wild', 'primal']
  ),
  createBasePet(
    'Rootling',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 580, attack: 46, defense: 48, speed: 58 },
    ['Root Strike'],
    ['Regrowth', 'Beast Soul'],
    'A creature with deep roots connecting it to nature.',
    ['nature', 'root', 'grounded']
  ),
  createBasePet(
    'Faunaling',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 550, attack: 52, defense: 42, speed: 64 },
    ['Fauna Strike'],
    ['Pack Bond'],
    'A small animal spirit full of natural instinct.',
    ['nature', 'animal', 'instinct']
  ),
  createBasePet(
    'Growthling',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 565, attack: 49, defense: 45, speed: 61 },
    ['Growth Pulse'],
    ['Regrowth', 'Pack Bond'],
    'A creature that embodies nature\'s constant growth.',
    ['nature', 'growth', 'vital']
  ),

  // Rare Tier (3)
  createBasePet(
    'Nature Guardian',
    'TERRA_FORGED',
    Rarity.RARE,
    { hp: 930, attack: 85, defense: 75, speed: 78 },
    ['Guardian Bond'],
    ['Regrowth', 'Beast Soul', 'Pack Bond'],
    'A guardian spirit that protects nature itself.',
    ['nature', 'guardian', 'protective']
  ),
  createBasePet(
    'Primal Beast',
    'TERRA_FORGED',
    Rarity.RARE,
    { hp: 950, attack: 88, defense: 72, speed: 80 },
    ['Primal Fury'],
    ['Beast Soul', 'Pack Bond'],
    'An ancient primal beast of immense power.',
    ['nature', 'beast', 'fierce']
  ),
  createBasePet(
    'Forest King',
    'TERRA_FORGED',
    Rarity.RARE,
    { hp: 920, attack: 86, defense: 74, speed: 79 },
    ['Forest Reign'],
    ['Regrowth', 'Pack Bond', 'Beast Soul'],
    'The king of all forests in The Grid.',
    ['nature', 'forest', 'royal']
  ),

  // SR Tier (3)
  createBasePet(
    'Ecosystemlink',
    'TERRA_FORGED',
    Rarity.SR,
    { hp: 1600, attack: 128, defense: 130, speed: 80 },
    ['Eco System'],
    ['Regrowth', 'Beast Soul', 'Pack Bond'],
    'A creature that links entire ecosystems together.',
    ['nature', 'ecosystem', 'powerful']
  ),
  createBasePet(
    'Alpha Predator',
    'TERRA_FORGED',
    Rarity.SR,
    { hp: 1570, attack: 140, defense: 120, speed: 85 },
    ['Alpha Roar'],
    ['Beast Soul', 'Pack Bond'],
    'An alpha predator at the top of the food chain.',
    ['nature', 'predator', 'fierce']
  ),
  createBasePet(
    'Nature\'s Wrath',
    'TERRA_FORGED',
    Rarity.SR,
    { hp: 1590, attack: 135, defense: 125, speed: 82 },
    ['Nature Fury'],
    ['Regrowth', 'Pack Bond', 'Beast Soul'],
    'Nature\'s wrath made manifest.',
    ['nature', 'wrath', 'powerful']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Gaia Guardian',
    'TERRA_FORGED',
    Rarity.LEGENDARY,
    { hp: 2580, attack: 175, defense: 190, speed: 88 },
    ['Gaia\'s Embrace'],
    ['Regrowth', 'Beast Soul', 'Pack Bond'],
    'A guardian of Gaia herself, protecting all of nature.',
    ['nature', 'gaia', 'legendary']
  ),
  createBasePet(
    'Primal God',
    'TERRA_FORGED',
    Rarity.LEGENDARY,
    { hp: 2520, attack: 180, defense: 185, speed: 90 },
    ['Primal Power'],
    ['Beast Soul', 'Pack Bond'],
    'A god of primal nature itself.',
    ['nature', 'god', 'legendary']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Nature Incarnate',
    'TERRA_FORGED',
    Rarity.MYTHIC,
    { hp: 4150, attack: 285, defense: 290, speed: 95 },
    ['Nature Godhood'],
    ['Regrowth', 'Beast Soul', 'Pack Bond'],
    'The ultimate embodiment of all nature.',
    ['nature', 'god', 'mythic']
  ),
  createBasePet(
    'World Tree',
    'TERRA_FORGED',
    Rarity.MYTHIC,
    { hp: 4400, attack: 270, defense: 310, speed: 92 },
    ['World\'s Heart'],
    ['Regrowth', 'Pack Bond'],
    'The world tree itself, the heart of all existence.',
    ['nature', 'tree', 'mythic']
  ),
];

/**
 * ALL_REMAINING_PETS - Complete collection of families 6-10
 */
export const ALL_REMAINING_PETS: BasePet[] = [
  ...AERO_FLIGHT_PETS,
  ...ARCANE_RIFT_PETS,
  ...LUMINA_PETS,
  ...WEIRDOS_PETS,
  ...TERRA_FORGED_PETS,
];

export const REMAINING_PET_COUNT = ALL_REMAINING_PETS.length;
