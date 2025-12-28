/**
 * Pet Name Generator
 * Procedural generation of unique pet names based on family and seed
 */

import type { PetFamily } from '@/shared/types/family';

const NAME_PREFIXES: Record<PetFamily, string[]> = {
  PYRO_KIN: [
    'Blaze', 'Ember', 'Inferno', 'Cinder', 'Pyre', 'Flame', 'Scorch', 'Ash',
    'Vulcan', 'Ignis', 'Comb', 'Furnace', 'Lava', 'Magma', 'Coal', 'Spark'
  ],
  AQUA_BORN: [
    'Aqua', 'Tide', 'Coral', 'Stream', 'Wave', 'Marina', 'Depth', 'Reef',
    'Hydro', 'Cascade', 'Splash', 'Bubble', 'Pearl', 'Kelp', 'Fin', 'Surf'
  ],
  TERRA_FORGED: [
    'Terra', 'Quake', 'Boulder', 'Granite', 'Mesa', 'Stone', 'Geo', 'Clay',
    'Crystal', 'Ore', 'Shard', 'Rock', 'Crag', 'Pebble', 'Flint', 'Basalt'
  ],
  VOLT_STREAM: [
    'Volt', 'Spark', 'Thunder', 'Surge', 'Storm', 'Bolt', 'Arc', 'Charge',
    'Static', 'Pulse', 'Shock', 'Zap', 'Watt', 'Amp', 'Circuit', 'Current'
  ],
  SHADOW_VEIL: [
    'Shadow', 'Umbra', 'Dusk', 'Void', 'Eclipse', 'Shade', 'Nox', 'Phantom',
    'Gloom', 'Murk', 'Obsidian', 'Raven', 'Twilight', 'Darkness', 'Abyss', 'Nocturne'
  ],
  LUMINA: [
    'Lux', 'Aurora', 'Radiant', 'Prism', 'Halo', 'Gleam', 'Beam', 'Dawn',
    'Lumin', 'Celestia', 'Glow', 'Shine', 'Ray', 'Corona', 'Flash', 'Bright'
  ],
  STEEL_WORKS: [
    'Steel', 'Chrome', 'Alloy', 'Gear', 'Mech', 'Iron', 'Forge', 'Rivet',
    'Titanium', 'Cobalt', 'Zinc', 'Brass', 'Bronze', 'Metal', 'Plate', 'Bolt'
  ],
  ARCANE_RIFT: [
    'Arcane', 'Mystic', 'Rune', 'Ethereal', 'Phantom', 'Spell', 'Hex', 'Charm',
    'Enigma', 'Oracle', 'Myst', 'Aether', 'Enchant', 'Cipher', 'Glymph', 'Sigil'
  ],
  AERO_FLIGHT: [
    'Aero', 'Zephyr', 'Gale', 'Breeze', 'Nimbus', 'Cirrus', 'Sky', 'Wind',
    'Tempest', 'Cumulus', 'Gust', 'Squall', 'Drift', 'Float', 'Soar', 'Glide'
  ],
  WEIRDOS: [
    'Glitch', 'Chaos', 'Quirk', 'Bizarre', 'Anomaly', 'Odd', 'Strange', 'Weird',
    'Glimmer', 'Fuzz', 'Wobble', 'Jitter', 'Twist', 'Warp', 'Flux', 'Scramble'
  ]
};

const NAME_SUFFIXES = [
  'ling', 'beast', 'drake', 'wyrm', 'spirit', 'guardian', 'hound', 'titan',
  'cub', 'fang', 'tail', 'wing', 'claw', 'scale', 'horn', 'paw',
  'eye', 'mind', 'heart', 'soul', 'wisp', 'shade', 'walker', 'runner',
  'flyer', 'swimmer', 'crawler', 'leaper', 'stalker', 'hunter'
];

/**
 * Create seeded RNG
 */
function createSeededRNG(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Generate pet name based on family and seed
 */
export function generatePetName(family: PetFamily, seed: number): string {
  const rng = createSeededRNG(seed);
  const prefixes = NAME_PREFIXES[family];
  const prefix = prefixes[Math.floor(rng() * prefixes.length)];
  const suffix = NAME_SUFFIXES[Math.floor(rng() * NAME_SUFFIXES.length)];
  return `${prefix}${suffix}`;
}

/**
 * Generate multiple unique names for a family
 */
export function generateUniqueNames(family: PetFamily, count: number, baseSeed: number = 1000): string[] {
  const names = new Set<string>();
  let seed = baseSeed;
  let attempts = 0;
  const maxAttempts = count * 10; // Safety limit

  while (names.size < count && attempts < maxAttempts) {
    const name = generatePetName(family, seed);
    names.add(name);
    seed++;
    attempts++;
  }

  return Array.from(names);
}
