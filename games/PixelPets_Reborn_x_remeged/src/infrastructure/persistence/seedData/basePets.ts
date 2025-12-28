/**
 * Base Pet Seed Data
 * Complete library of all 150 base pets across 10 families
 * Extracted from docs/CONTENT/PET_DESIGNS.md
 */

import { Rarity } from '@/shared/types/rarity';
import type { BasePet } from '@/domain/entities/BasePet';
import { generateId } from '@/shared/utils/idGenerator';

// Type for creating pets with proper ID generation
export const createBasePet = (
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
 * PYRO_KIN Family (Fire) - 15 pets
 */
export const PYRO_KIN_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Emberling',
    'PYRO_KIN',
    Rarity.BASIC,
    { hp: 525, attack: 47, defense: 37, speed: 62 },
    ['Ember Shot'],
    ['Combustion Core'],
    'A small, energetic creature made of living embers that follows people around like a friendly flame.',
    ['fire', 'small', 'warm']
  ),
  createBasePet(
    'Flamepup',
    'PYRO_KIN',
    Rarity.BASIC,
    { hp: 545, attack: 49, defense: 39, speed: 64 },
    ['Puppy Flames'],
    ['Flaming Aura'],
    'A playful fire spirit in the shape of a loyal companion, full of energy and warmth.',
    ['fire', 'friendly', 'playful']
  ),
  createBasePet(
    'Cindermane',
    'PYRO_KIN',
    Rarity.BASIC,
    { hp: 565, attack: 51, defense: 41, speed: 66 },
    ['Scorching Mane'],
    ['Heat Resonance'],
    'A majestic creature with a mane of ever-burning flames that protects its territory.',
    ['fire', 'majestic', 'protector']
  ),
  createBasePet(
    'Sparkwhisper',
    'PYRO_KIN',
    Rarity.BASIC,
    { hp: 535, attack: 48, defense: 38, speed: 67 },
    ['Ignition Spark'],
    ['Phoenix Blood'],
    'A tiny flame spirit that dwells in the spaces between thoughts, igniting passion and courage.',
    ['fire', 'spark', 'mystical']
  ),
  createBasePet(
    'Torchbeetle',
    'PYRO_KIN',
    Rarity.BASIC,
    { hp: 555, attack: 50, defense: 42, speed: 63 },
    ['Firelight'],
    ['Magma Veins'],
    'A beetle made of compressed flame that glows steadily, lighting the way for travelers.',
    ['fire', 'insect', 'bright']
  ),

  // Rare Tier (3)
  createBasePet(
    'Pyroclast',
    'PYRO_KIN',
    Rarity.RARE,
    { hp: 900, attack: 80, defense: 65, speed: 72 },
    ['Molten Burst'],
    ['Combustion Core', 'Heat Resonance'],
    'A chunk of living magma that rumbles and flows with intense heat, leaving scorch marks wherever it goes.',
    ['fire', 'magma', 'powerful']
  ),
  createBasePet(
    'Flarephoenix',
    'PYRO_KIN',
    Rarity.RARE,
    { hp: 930, attack: 83, defense: 67, speed: 75 },
    ['Rebirth Flame'],
    ['Phoenix Blood', 'Flaming Aura'],
    'A smaller version of the legendary phoenix, embodying renewal and resilience through flame.',
    ['fire', 'bird', 'mythical']
  ),
  createBasePet(
    'Cinderhowl',
    'PYRO_KIN',
    Rarity.RARE,
    { hp: 920, attack: 85, defense: 70, speed: 74 },
    ['Heatwave Howl'],
    ['Heat Resonance', 'Magma Veins'],
    'A wolf-like creature made of swirling flames that can melt metal with its roar.',
    ['fire', 'wolf', 'fierce']
  ),

  // SR Tier (3)
  createBasePet(
    'Magmawolf',
    'PYRO_KIN',
    Rarity.SR,
    { hp: 1475, attack: 127, defense: 107, speed: 82 },
    ['Lava Pounce'],
    ['Combustion Core', 'Heat Resonance', 'Flaming Aura'],
    'A powerful fire spirit that takes the form of a great wolf made of molten rock and flame.',
    ['fire', 'wolf', 'legendary']
  ),
  createBasePet(
    'Infernobat',
    'PYRO_KIN',
    Rarity.SR,
    { hp: 1525, attack: 132, defense: 112, speed: 87 },
    ['Blazing Dive'],
    ['Phoenix Blood', 'Magma Veins'],
    'A bat-like creature with wings of pure flame that soars through the hottest regions of The Grid.',
    ['fire', 'bat', 'swift']
  ),
  createBasePet(
    'Solflare',
    'PYRO_KIN',
    Rarity.SR,
    { hp: 1495, attack: 129, defense: 109, speed: 84 },
    ['Sunburn'],
    ['Heat Resonance', 'Flaming Aura', 'Combustion Core'],
    'A miniature sun that follows its master, casting a warm glow and radiating intense heat.',
    ['fire', 'sun', 'bright']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Drakflame',
    'PYRO_KIN',
    Rarity.LEGENDARY,
    { hp: 2350, attack: 190, defense: 170, speed: 92 },
    ['Dragon Fire'],
    ['Phoenix Blood', 'Combustion Core', 'Heat Resonance', 'Flaming Aura'],
    'A dragon made of living flame, the embodiment of fire\'s primal power and ancient wisdom.',
    ['fire', 'dragon', 'legendary', 'ultimate']
  ),
  createBasePet(
    'Igneous Titan',
    'PYRO_KIN',
    Rarity.LEGENDARY,
    { hp: 2550, attack: 197, defense: 185, speed: 90 },
    ['Magma Shell'],
    ['Magma Veins', 'Heat Resonance', 'Flaming Aura'],
    'A massive being of living magma and flame, so hot it warms entire sectors of The Grid.',
    ['fire', 'titan', 'legendary', 'massive']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Eternal Phoenix',
    'PYRO_KIN',
    Rarity.MYTHIC,
    { hp: 3750, attack: 300, defense: 260, speed: 102 },
    ['Rebirth Cycle'],
    ['Phoenix Blood', 'Combustion Core', 'Heat Resonance', 'Flaming Aura', 'Magma Veins'],
    'The mythical phoenix of The Grid, embodying the eternal cycle of destruction and renewal. Its flame never dies and its wisdom is ancient.',
    ['fire', 'phoenix', 'mythic', 'eternal']
  ),
  createBasePet(
    'Plasma Incarnate',
    'PYRO_KIN',
    Rarity.MYTHIC,
    { hp: 4050, attack: 320, defense: 280, speed: 107 },
    ['Plasma Infusion'],
    ['Combustion Core', 'Heat Resonance', 'Magma Veins'],
    'The ultimate fusion of fire and lightning, a being of pure plasma energy that exists at the boundary between elements.',
    ['fire', 'plasma', 'mythic', 'hybrid']
  ),
];

/**
 * AQUA_BORN Family (Water) - 15 pets
 */
export const AQUA_BORN_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Droplet',
    'AQUA_BORN',
    Rarity.BASIC,
    { hp: 525, attack: 47, defense: 40, speed: 64 },
    ['Water Splash'],
    ['Tidal Flow'],
    'A sentient drop of pure water that flows through The Grid, connecting data streams like water connects rivers.',
    ['water', 'small', 'pure']
  ),
  createBasePet(
    'Mistling',
    'AQUA_BORN',
    Rarity.BASIC,
    { hp: 545, attack: 48, defense: 38, speed: 67 },
    ['Vapor Screen'],
    ['Aquatic Resilience'],
    'A wispy creature made of condensed vapor that drifts through The Grid, barely substantial but persistent.',
    ['water', 'ghost', 'ethereal']
  ),
  createBasePet(
    'Ripplepaw',
    'AQUA_BORN',
    Rarity.BASIC,
    { hp: 535, attack: 49, defense: 39, speed: 66 },
    ['Puddle Splash'],
    ['Healing Waters'],
    'A small aquatic creature with paws like a cat but gills like a fish, living in the wetter parts of The Grid.',
    ['water', 'cat-like', 'cute']
  ),
  createBasePet(
    'Streamlet',
    'AQUA_BORN',
    Rarity.BASIC,
    { hp: 555, attack: 50, defense: 41, speed: 65 },
    ['Flowing Current'],
    ['Aqueous Shield'],
    'A tiny stream of consciousness that carries information through The Grid\'s data channels.',
    ['water', 'flow', 'intelligent']
  ),
  createBasePet(
    'Dewdrop',
    'AQUA_BORN',
    Rarity.BASIC,
    { hp: 515, attack: 46, defense: 42, speed: 63 },
    ['Condensation'],
    ['Healing Waters', 'Tidal Flow'],
    'A perfect sphere of water that forms at dawn in The Grid, embodying purity and renewal.',
    ['water', 'pure', 'dawn']
  ),

  // Rare Tier (3)
  createBasePet(
    'Icecrystal',
    'AQUA_BORN',
    Rarity.RARE,
    { hp: 900, attack: 77, defense: 70, speed: 72 },
    ['Frost Shard'],
    ['Aquatic Resilience', 'Healing Waters'],
    'A perfectly formed ice crystal that grows in the coldest sectors of The Grid, sharp and beautiful.',
    ['water', 'ice', 'sharp']
  ),
  createBasePet(
    'Tidewhisper',
    'AQUA_BORN',
    Rarity.RARE,
    { hp: 930, attack: 80, defense: 68, speed: 75 },
    ['Healing Tide'],
    ['Healing Waters', 'Tidal Flow', 'Aquatic Resilience'],
    'A gentle spirit of the tides that flows through The Grid\'s data streams, bringing healing and balance.',
    ['water', 'tide', 'healing']
  ),
  createBasePet(
    'Streamwyrm',
    'AQUA_BORN',
    Rarity.RARE,
    { hp: 920, attack: 83, defense: 65, speed: 77 },
    ['Coiling Current'],
    ['Flow State', 'Aqueous Shield'],
    'A serpentine aquatic creature that navigates The Grid\'s data rivers with fluid grace.',
    ['water', 'serpent', 'graceful']
  ),

  // SR Tier (3)
  createBasePet(
    'Frostbark',
    'AQUA_BORN',
    Rarity.SR,
    { hp: 1475, attack: 122, defense: 117, speed: 82 },
    ['Glacial Shield'],
    ['Aquatic Resilience', 'Healing Waters', 'Tidal Flow'],
    'A creature made of living ice and bark, embodying the strength of frozen forests in The Grid.',
    ['water', 'ice', 'protective']
  ),
  createBasePet(
    'Tsunamite',
    'AQUA_BORN',
    Rarity.SR,
    { hp: 1525, attack: 132, defense: 107, speed: 84 },
    ['Mini Tsunami'],
    ['Aqueous Shield', 'Flow State'],
    'A concentrated wave of water energy that carries the power of the great tsunamis in miniature form.',
    ['water', 'wave', 'powerful']
  ),
  createBasePet(
    'Aquadracon',
    'AQUA_BORN',
    Rarity.SR,
    { hp: 1495, attack: 127, defense: 112, speed: 85 },
    ['Aqua Breath'],
    ['Healing Waters', 'Tidal Flow', 'Aquatic Resilience'],
    'A dragon-like creature made of pressurized water, capable of breathing streams that can cut through steel.',
    ['water', 'dragon', 'fierce']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Frostwyrm',
    'AQUA_BORN',
    Rarity.LEGENDARY,
    { hp: 2350, attack: 185, defense: 185, speed: 92 },
    ['Absolute Zero'],
    ['Aquatic Resilience', 'Healing Waters', 'Tidal Flow', 'Aqueous Shield'],
    'A mighty ice dragon from the deepest frozen sectors of The Grid, whose presence lowers temperatures around it.',
    ['water', 'ice', 'dragon', 'legendary']
  ),
  createBasePet(
    'Leviathian',
    'AQUA_BORN',
    Rarity.LEGENDARY,
    { hp: 2650, attack: 190, defense: 195, speed: 87 },
    ['Tidal Crush'],
    ['Flow State', 'Healing Waters', 'Aqueous Shield'],
    'A massive water spirit that takes the form of a leviathan, embodying the power and mystery of the deep.',
    ['water', 'leviathan', 'legendary', 'massive']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Eternal Tide',
    'AQUA_BORN',
    Rarity.MYTHIC,
    { hp: 3850, attack: 295, defense: 270, speed: 102 },
    ['Tidal Cycle'],
    ['Tidal Flow', 'Healing Waters', 'Aquatic Resilience', 'Aqueous Shield', 'Flow State'],
    'The embodiment of the eternal tides themselves, an ancient force of The Grid that controls all water flows.',
    ['water', 'tide', 'mythic', 'eternal']
  ),
  createBasePet(
    'Cryosphere',
    'AQUA_BORN',
    Rarity.MYTHIC,
    { hp: 4150, attack: 310, defense: 290, speed: 97 },
    ['Absolute Freeze'],
    ['Aquatic Resilience', 'Healing Waters', 'Aqueous Shield'],
    'A planet-sized ice crystal that exists in The Grid\'s core, maintaining the system\'s thermal balance.',
    ['water', 'ice', 'mythic', 'cosmic']
  ),
];

/**
 * TERRA_FORGED Family (Earth) - 15 pets
 */
export const TERRA_FORGED_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Pebble',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 575, attack: 47, defense: 44, speed: 62 },
    ['Rock Throw'],
    ['Stone Stability'],
    'A simple stone with a spark of life, the most basic form of earth consciousness in The Grid.',
    ['earth', 'stone', 'simple']
  ),
  createBasePet(
    'Mossling',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 555, attack: 45, defense: 47, speed: 63 },
    ['Growth Spurt'],
    ['Life Essence'],
    'A tiny moss creature that slowly spreads across surfaces in The Grid, bringing life to sterile areas.',
    ['earth', 'plant', 'growing']
  ),
  createBasePet(
    'Claymation',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 585, attack: 48, defense: 45, speed: 61 },
    ['Mud Slide'],
    ['Stone Stability', 'Life Essence'],
    'A small animate clay figure that can reshape itself, embodying the plasticity of earth.',
    ['earth', 'clay', 'malleable']
  ),
  createBasePet(
    'Crystallite',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 545, attack: 50, defense: 42, speed: 64 },
    ['Prism Refraction'],
    ['Mineral Armor'],
    'A tiny crystal that bends light, a fragment of the crystalline structures in The Grid\'s core.',
    ['earth', 'crystal', 'reflective']
  ),
  createBasePet(
    'Shalepaw',
    'TERRA_FORGED',
    Rarity.BASIC,
    { hp: 565, attack: 49, defense: 43, speed: 65 },
    ['Ground Pound'],
    ['Stone Stability'],
    'A stone creature with paws that walks softly but strikes hard, a guardian of The Grid\'s foundations.',
    ['earth', 'stone', 'strong']
  ),

  // Rare Tier (3)
  createBasePet(
    'Stoneguard',
    'TERRA_FORGED',
    Rarity.RARE,
    { hp: 950, attack: 117, defense: 132, speed: 80 },
    ['Stone Wall'],
    ['Stone Stability', 'Mineral Armor', 'Life Essence'],
    'A guardian made of ancient stone that stands firm against all attacks, protecting the foundations of The Grid.',
    ['earth', 'stone', 'protective']
  ),
  createBasePet(
    'Crystalspire',
    'TERRA_FORGED',
    Rarity.RARE,
    { hp: 920, attack: 132, defense: 117, speed: 84 },
    ['Crystal Spike'],
    ['Mineral Armor', 'Stone Stability'],
    'A towering crystal formation that channels earth energy, focusing it into devastating attacks.',
    ['earth', 'crystal', 'sharp']
  ),
  createBasePet(
    'Ironbark',
    'TERRA_FORGED',
    Rarity.RARE,
    { hp: 960, attack: 122, defense: 137, speed: 79 },
    ['Metallic Resin'],
    ['Life Essence', 'Stone Stability', 'Mineral Armor'],
    'A fusion of metal and wood, creating an incredibly durable protector of The Grid\'s infrastructure.',
    ['earth', 'wood', 'durable']
  ),

  // SR Tier (3)
  createBasePet(
    'Stoneguardian',
    'TERRA_FORGED',
    Rarity.SR,
    { hp: 1575, attack: 117, defense: 132, speed: 80 },
    ['Stone Mastery'],
    ['Stone Stability', 'Mineral Armor', 'Life Essence'],
    'A guardian made of ancient stone that stands firm against all attacks.',
    ['earth', 'stone', 'legendary']
  ),
  createBasePet(
    'Crystalwarden',
    'TERRA_FORGED',
    Rarity.SR,
    { hp: 1525, attack: 132, defense: 117, speed: 84 },
    ['Crystal Mastery'],
    ['Mineral Armor', 'Stone Stability'],
    'A towering crystal formation that channels earth energy.',
    ['earth', 'crystal', 'powerful']
  ),
  createBasePet(
    'Earthshell',
    'TERRA_FORGED',
    Rarity.SR,
    { hp: 1595, attack: 122, defense: 137, speed: 79 },
    ['Metallic Shell'],
    ['Life Essence', 'Stone Stability', 'Mineral Armor'],
    'A fusion of metal and earth, creating an incredibly durable protector.',
    ['earth', 'metal', 'strong']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Golemancer',
    'TERRA_FORGED',
    Rarity.LEGENDARY,
    { hp: 2550, attack: 180, defense: 205, speed: 87 },
    ['Stone Mastery'],
    ['Stone Stability', 'Mineral Armor', 'Life Essence'],
    'A master of all earth elements, capable of controlling stone, metal, crystal, and minerals.',
    ['earth', 'golem', 'legendary']
  ),
  createBasePet(
    'Quakeheart',
    'TERRA_FORGED',
    Rarity.LEGENDARY,
    { hp: 2750, attack: 185, defense: 215, speed: 84 },
    ['Seismic Slam'],
    ['Stone Stability', 'Life Essence'],
    'The heart of the mountains themselves, causing tremors throughout The Grid with each beat.',
    ['earth', 'titan', 'legendary']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Mountain Titan',
    'TERRA_FORGED',
    Rarity.MYTHIC,
    { hp: 4250, attack: 280, defense: 300, speed: 92 },
    ['Impenetrable'],
    ['Stone Stability', 'Mineral Armor', 'Life Essence'],
    'The living embodiment of a mountain range, so large and old it forms the backbone of The Grid itself.',
    ['earth', 'titan', 'mythic']
  ),
  createBasePet(
    'Earthshaper',
    'TERRA_FORGED',
    Rarity.MYTHIC,
    { hp: 4450, attack: 300, defense: 320, speed: 90 },
    ['Terraforming'],
    ['Life Essence', 'Stone Stability', 'Mineral Armor'],
    'The ultimate earth master, capable of reshaping the very foundations of reality within The Grid.',
    ['earth', 'god', 'mythic']
  ),
];

/**
 * VOLT_STREAM Family (Lightning) - 15 pets
 */
export const VOLT_STREAM_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Staticpaw',
    'VOLT_STREAM',
    Rarity.BASIC,
    { hp: 505, attack: 52, defense: 37, speed: 77 },
    ['Lightning Bolt'],
    ['Static Aura'],
    'A small creature that constantly crackles with static electricity, often startling other pets in The Grid.',
    ['lightning', 'electric', 'small']
  ),
  createBasePet(
    'Sparklet',
    'VOLT_STREAM',
    Rarity.BASIC,
    { hp: 495, attack: 54, defense: 35, speed: 80 },
    ['Electric Jolt'],
    ['Energy Generation'],
    'A tiny being of pure electrical energy that zips around The Grid, leaving trails of light.',
    ['lightning', 'spark', 'fast']
  ),
  createBasePet(
    'Surgepup',
    'VOLT_STREAM',
    Rarity.BASIC,
    { hp: 515, attack: 53, defense: 36, speed: 79 },
    ['Puppy Lightning'],
    ['Static Aura', 'Energy Generation'],
    'An energetic lightning spirit that behaves like an excited puppy, full of electrical energy.',
    ['lightning', 'dog', 'playful']
  ),
  createBasePet(
    'Flashwisp',
    'VOLT_STREAM',
    Rarity.BASIC,
    { hp: 485, attack: 55, defense: 34, speed: 82 },
    ['Lightning Flash'],
    ['Crit Surge'],
    'A wisp of concentrated electrical energy that glows brightly before disappearing again.',
    ['lightning', 'ghost', 'bright']
  ),
  createBasePet(
    'Zapling',
    'VOLT_STREAM',
    Rarity.BASIC,
    { hp: 510, attack: 56, defense: 37, speed: 78 },
    ['Chain Zap'],
    ['Static Aura', 'Energy Generation'],
    'A creature made of crackling energy that connects other electrical entities in The Grid.',
    ['lightning', 'connector', 'electric']
  ),

  // Rare Tier (3)
  createBasePet(
    'Bolter',
    'VOLT_STREAM',
    Rarity.RARE,
    { hp: 870, attack: 90, defense: 60, speed: 87 },
    ['Thunderbolt'],
    ['Static Aura', 'Energy Generation', 'Crit Surge'],
    'A lightning rod spirit that attracts and controls electrical energy, channeling it with precision.',
    ['lightning', 'bolt', 'powerful']
  ),
  createBasePet(
    'Stormwhisper',
    'VOLT_STREAM',
    Rarity.RARE,
    { hp: 900, attack: 87, defense: 63, speed: 89 },
    ['Lightning Boost'],
    ['Energy Generation', 'Static Aura'],
    'A gentle spirit that carries the energy of distant storms, spreading vitality through The Grid.',
    ['lightning', 'storm', 'energizing']
  ),
  createBasePet(
    'Voltage',
    'VOLT_STREAM',
    Rarity.RARE,
    { hp: 850, attack: 93, defense: 57, speed: 90 },
    ['Overcharge'],
    ['Crit Surge', 'Energy Generation'],
    'A high-voltage entity that carries so much electrical energy it constantly crackles and sparks.',
    ['lightning', 'power', 'intense']
  ),

  // SR Tier (3)
  createBasePet(
    'Lightningdrake',
    'VOLT_STREAM',
    Rarity.SR,
    { hp: 1425, attack: 142, defense: 97, speed: 92 },
    ['Lightning Breath'],
    ['Static Aura', 'Energy Generation', 'Crit Surge'],
    'A dragon-like creature made of pure electrical energy, flying through The Grid with electric wings.',
    ['lightning', 'dragon', 'swift']
  ),
  createBasePet(
    'Electrosphere',
    'VOLT_STREAM',
    Rarity.SR,
    { hp: 1455, attack: 137, defense: 102, speed: 94 },
    ['Electric Field'],
    ['Energy Generation', 'Static Aura'],
    'A sphere of concentrated electromagnetic energy that pulses with the rhythm of The Grid\'s power systems.',
    ['lightning', 'sphere', 'energetic']
  ),
  createBasePet(
    'Thunderclap',
    'VOLT_STREAM',
    Rarity.SR,
    { hp: 1475, attack: 147, defense: 92, speed: 90 },
    ['Thunder Strike'],
    ['Crit Surge', 'Static Aura', 'Energy Generation'],
    'An embodiment of the sound and fury of thunder, striking with overwhelming force.',
    ['lightning', 'thunder', 'loud']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Stormcaller',
    'VOLT_STREAM',
    Rarity.LEGENDARY,
    { hp: 2250, attack: 205, defense: 150, speed: 97 },
    ['Lightning Storm'],
    ['Static Aura', 'Energy Generation', 'Crit Surge'],
    'A master of all electrical forces in The Grid, capable of summoning great electrical storms.',
    ['lightning', 'storm', 'legendary']
  ),
  createBasePet(
    'Plasma Wraith',
    'VOLT_STREAM',
    Rarity.LEGENDARY,
    { hp: 2350, attack: 210, defense: 140, speed: 100 },
    ['Ionization'],
    ['Energy Generation', 'Static Aura'],
    'A creature of pure plasma energy that exists between solid and energy states, making it nearly untouchable.',
    ['lightning', 'plasma', 'legendary']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Lightning Incarnate',
    'VOLT_STREAM',
    Rarity.MYTHIC,
    { hp: 3650, attack: 330, defense: 220, speed: 112 },
    ['Lightning Speed'],
    ['Static Aura', 'Energy Generation', 'Crit Surge'],
    'The ultimate embodiment of electrical energy, moving at light speed and wielding the power of gods.',
    ['lightning', 'god', 'mythic']
  ),
  createBasePet(
    'Thunder Incarnate',
    'VOLT_STREAM',
    Rarity.MYTHIC,
    { hp: 3850, attack: 340, defense: 230, speed: 107 },
    ['Thunder God'],
    ['Energy Generation', 'Static Aura'],
    'The living embodiment of thunder itself, whose very presence creates shockwaves through The Grid.',
    ['lightning', 'god', 'mythic']
  ),
];

/**
 * SHADOW_VEIL Family (Shadow/Dark) - 15 pets
 */
export const SHADOW_VEIL_PETS: BasePet[] = [
  // Basic Tier (5)
  createBasePet(
    'Shadowing',
    'SHADOW_VEIL',
    Rarity.BASIC,
    { hp: 505, attack: 54, defense: 37, speed: 72 },
    ['Shadow Strike'],
    ['Shadow Step'],
    'A small winged shadow that flutters in dark corners of The Grid, barely visible but always watching.',
    ['shadow', 'dark', 'stealth']
  ),
  createBasePet(
    'Umbralite',
    'SHADOW_VEIL',
    Rarity.BASIC,
    { hp: 485, attack: 56, defense: 35, speed: 74 },
    ['Dark Echo'],
    ['Dark Empathy'],
    'A fragment of shadow essence that echoes with the whispers of The Grid\'s forgotten data.',
    ['shadow', 'dark', 'whisper']
  ),
  createBasePet(
    'Nightwhisper',
    'SHADOW_VEIL',
    Rarity.BASIC,
    { hp: 525, attack: 52, defense: 40, speed: 70 },
    ['Whispered Fear'],
    ['Shadow Step', 'Dark Empathy'],
    'A gentle spirit of darkness that speaks only in whispers, causing unease rather than harm.',
    ['shadow', 'fear', 'gentle']
  ),
  createBasePet(
    'Darkling',
    'SHADOW_VEIL',
    Rarity.BASIC,
    { hp: 495, attack: 55, defense: 34, speed: 73 },
    ['Twilight Claws'],
    ['Dark Mastery'],
    'A small creature of darkness that scampers through shadowed networks in The Grid.',
    ['shadow', 'dark', 'small']
  ),
  createBasePet(
    'Voidling',
    'SHADOW_VEIL',
    Rarity.BASIC,
    { hp: 475, attack: 53, defense: 36, speed: 75 },
    ['Void Touch'],
    ['Energy Drain'],
    'A tiny fragment of the void itself, a living absence of light and data.',
    ['shadow', 'void', 'dark']
  ),

  // Rare Tier (3)
  createBasePet(
    'Shadowstep',
    'SHADOW_VEIL',
    Rarity.RARE,
    { hp: 850, attack: 93, defense: 63, speed: 87 },
    ['Shadow Step'],
    ['Shadow Step', 'Dark Empathy', 'Energy Drain'],
    'A master of shadow movement that can step through darkness itself, appearing where least expected.',
    ['shadow', 'stealth', 'evasive']
  ),
  createBasePet(
    'Duskhowl',
    'SHADOW_VEIL',
    Rarity.RARE,
    { hp: 880, attack: 90, defense: 65, speed: 84 },
    ['Nightmare Howl'],
    ['Dark Mastery', 'Shadow Step'],
    'A wolf-like creature made of concentrated dusk, whose howl echoes with the fears of The Grid.',
    ['shadow', 'wolf', 'fearsome']
  ),
  createBasePet(
    'Darkrend',
    'SHADOW_VEIL',
    Rarity.RARE,
    { hp: 870, attack: 95, defense: 60, speed: 86 },
    ['Shadow Rend'],
    ['Energy Drain', 'Dark Empathy', 'Dark Mastery'],
    'A creature that tears through the fabric of light itself, creating rents in reality.',
    ['shadow', 'rend', 'powerful']
  ),

  // SR Tier (3)
  createBasePet(
    'Nightmare',
    'SHADOW_VEIL',
    Rarity.SR,
    { hp: 1455, attack: 137, defense: 112, speed: 87 },
    ['Nightmare Realm'],
    ['Dark Mastery', 'Shadow Step', 'Dark Empathy'],
    'A creature that exists in the space between dreams and reality, feeding on fear and uncertainty.',
    ['shadow', 'dream', 'fearful']
  ),
  createBasePet(
    'Soulreaper',
    'SHADOW_VEIL',
    Rarity.SR,
    { hp: 1475, attack: 142, defense: 107, speed: 89 },
    ['Soul Drain'],
    ['Energy Drain', 'Dark Mastery'],
    'A grim reaper of digital souls in The Grid, harvesting energy from defeated data streams.',
    ['shadow', 'reaper', 'dark']
  ),
  createBasePet(
    'Shadowdancer',
    'SHADOW_VEIL',
    Rarity.SR,
    { hp: 1425, attack: 147, defense: 102, speed: 92 },
    ['Dance of Shadows'],
    ['Shadow Step', 'Dark Empathy', 'Energy Drain'],
    'A graceful shadow that moves like liquid darkness, attaching itself to opponents and weakening them.',
    ['shadow', 'dancer', 'graceful']
  ),

  // Legendary Tier (2)
  createBasePet(
    'Voidbringer',
    'SHADOW_VEIL',
    Rarity.LEGENDARY,
    { hp: 2450, attack: 195, defense: 170, speed: 92 },
    ['Void Touch'],
    ['Dark Mastery', 'Shadow Step', 'Energy Drain', 'Dark Empathy'],
    'A harbinger of the void itself, capable of erasing data and matter from existence.',
    ['shadow', 'void', 'legendary']
  ),
  createBasePet(
    'Shadowlord',
    'SHADOW_VEIL',
    Rarity.LEGENDARY,
    { hp: 2550, attack: 190, defense: 180, speed: 90 },
    ['Shadow Mastery'],
    ['Dark Mastery', 'Shadow Step'],
    'The master of all shadows in The Grid, controlling darkness as a force of nature.',
    ['shadow', 'lord', 'legendary']
  ),

  // Mythic Tier (2)
  createBasePet(
    'Nothingness',
    'SHADOW_VEIL',
    Rarity.MYTHIC,
    { hp: 4050, attack: 290, defense: 270, speed: 97 },
    ['Existence Erasure'],
    ['Dark Mastery', 'Shadow Step', 'Energy Drain', 'Dark Empathy'],
    'The embodiment of absolute void and nothingness, a force of anti-existence.',
    ['shadow', 'void', 'mythic']
  ),
  createBasePet(
    'Nightmarelord',
    'SHADOW_VEIL',
    Rarity.MYTHIC,
    { hp: 4250, attack: 310, defense: 280, speed: 95 },
    ['Nightmare Mastery'],
    ['Dark Mastery', 'Shadow Step'],
    'A being of pure nightmares that feeds on fear and despair throughout The Grid.',
    ['shadow', 'nightmare', 'mythic']
  ),
];

/**
 * ALL_BASE_PETS - Complete collection
 */
export const ALL_BASE_PETS: BasePet[] = [
  ...PYRO_KIN_PETS,
  ...AQUA_BORN_PETS,
  ...TERRA_FORGED_PETS,
  ...VOLT_STREAM_PETS,
  ...SHADOW_VEIL_PETS,
];

export const BASE_PET_COUNT = ALL_BASE_PETS.length;
