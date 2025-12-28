/**
 * Base Pet Seed Data
 * All 150 base pets across 10 families
 * Generated from docs/CONTENT/PET_DESIGNS.md
 */

import { PetFamily } from '@/shared/types/family';
import { Rarity } from '@/shared/types/rarity';
import { BasePet, BasePetStats } from '@/domain/entities/BasePet';
import { brandBasePetId } from '@/shared/types/brands';

// Helper to create BasePet instances
function createBasePet(data: {
  id: any;
  name: string;
  family: PetFamily;
  rarity: Rarity;
  baseStats: BasePetStats;
  starterAbilities: string[];
  starterPassives: string[];
  visualTags: string[];
  lore: string;
}): BasePet {
  return {
    id: data.id,
    name: data.name,
    family: data.family,
    rarity: data.rarity,
    baseStats: data.baseStats,
    starterAbilities: data.starterAbilities,
    starterPassives: data.starterPassives,
    visualTags: data.visualTags,
    lore: data.lore
  };
}

// PYRO_KIN - Fire family (15 pets)
const PYRO_KIN_BASIC: any[] = [
  createBasePet({
    id: brandBasePetId('BASE-PYRO-001'),
    name: 'Emberling',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 525, attack: 47, defense: 37, speed: 62 },
    starterAbilities: ['ember-shot'],
    starterPassives: [],
    visualTags: ['fire', 'small', 'glowing'],
    lore: 'A small, energetic creature made of living embers that follows people around like a friendly flame.',
  }),
  createBasePet({
    id: brandBasePetId('BASE-PYRO-002'),
    name: 'Flamepup',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 545, attack: 49, defense: 39, speed: 64 },
    starterAbilities: ['puppy-flames'],
    starterPassives: [],
    visualTags: ['fire', 'canine', 'warm'],
    lore: 'A playful fire spirit in the shape of a loyal companion, full of energy and warmth.',
  }),
  {
    id: brandBasePetId('BASE-PYRO-003'),
    name: 'Cindermane',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 565, attack: 51, defense: 41, speed: 66 },
    starterAbilities: ['scorching-mane'],
    starterPassives: [],
    visualTags: ['fire', 'majestic', 'burning-mane'],
    lore: 'A majestic creature with a mane of ever-burning flames that protects its territory.',
  },
  {
    id: brandBasePetId('BASE-PYRO-004'),
    name: 'Sparkwhisper',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 535, attack: 48, defense: 38, speed: 67 },
    starterAbilities: ['ignition-spark'],
    starterPassives: [],
    visualTags: ['fire', 'tiny', 'sparkling'],
    lore: 'A tiny flame spirit that dwells in the spaces between thoughts, igniting passion and courage.',
  },
  {
    id: brandBasePetId('BASE-PYRO-005'),
    name: 'Torchbeetle',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 555, attack: 50, defense: 42, speed: 63 },
    starterAbilities: ['firelight'],
    starterPassives: [],
    visualTags: ['fire', 'insect', 'glowing'],
    lore: 'A beetle made of compressed flame that glows steadily, lighting the way for travelers.',
  },
];

const PYRO_KIN_RARE: any[] = [
  {
    id: brandBasePetId('BASE-PYRO-006'),
    name: 'Pyroclast',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.RARE,
    baseStats: { hp: 900, attack: 80, defense: 65, speed: 72 },
    starterAbilities: ['molten-burst'],
    starterPassives: ['heat-resonance'],
    visualTags: ['fire', 'magma', 'explosive'],
    lore: 'A chunk of living magma that rumbles and flows with intense heat, leaving scorch marks wherever it goes.',
  },
  {
    id: brandBasePetId('BASE-PYRO-007'),
    name: 'Flarephoenix',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.RARE,
    baseStats: { hp: 930, attack: 83, defense: 67, speed: 75 },
    starterAbilities: ['rebirth-flame'],
    starterPassives: ['phoenix-blood'],
    visualTags: ['fire', 'bird', 'mythical'],
    lore: 'A smaller version of the legendary phoenix, embodying renewal and resilience through flame.',
  },
  {
    id: brandBasePetId('BASE-PYRO-008'),
    name: 'Cinderhowl',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.RARE,
    baseStats: { hp: 920, attack: 85, defense: 70, speed: 74 },
    starterAbilities: ['heatwave-howl'],
    starterPassives: ['flaming-aura'],
    visualTags: ['fire', 'canine', 'fierce'],
    lore: 'A wolf-like creature made of swirling flames that can melt metal with its roar.',
  },
];

const PYRO_KIN_SR: any[] = [
  {
    id: brandBasePetId('BASE-PYRO-009'),
    name: 'Magmawolf',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.SR,
    baseStats: { hp: 1475, attack: 127, defense: 107, speed: 82 },
    starterAbilities: ['lava-pounce'],
    starterPassives: ['magma-veins', 'combustion-core'],
    visualTags: ['fire', 'canine', 'molten'],
    lore: 'A powerful fire spirit that takes the form of a great wolf made of molten rock and flame.',
  },
  {
    id: brandBasePetId('BASE-PYRO-010'),
    name: 'Infernobat',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.SR,
    baseStats: { hp: 1525, attack: 132, defense: 112, speed: 87 },
    starterAbilities: ['blazing-dive'],
    starterPassives: ['combustion-core', 'heat-resonance'],
    visualTags: ['fire', 'bat', 'swift'],
    lore: 'A bat-like creature with wings of pure flame that soars through the hottest regions of The Grid.',
  },
  {
    id: brandBasePetId('BASE-PYRO-011'),
    name: 'Solflare',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.SR,
    baseStats: { hp: 1495, attack: 129, defense: 109, speed: 84 },
    starterAbilities: ['sunburn'],
    starterPassives: ['flaming-aura', 'heat-resonance'],
    visualTags: ['fire', 'radiant', 'bright'],
    lore: 'A miniature sun that follows its master, casting a warm glow and radiating intense heat.',
  },
];

const PYRO_KIN_LEGENDARY: any[] = [
  {
    id: brandBasePetId('BASE-PYRO-012'),
    name: 'Drakflame',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 2350, attack: 190, defense: 170, speed: 92 },
    starterAbilities: ['dragon-fire'],
    starterPassives: ['magma-veins', 'combustion-core', 'heat-resonance'],
    visualTags: ['fire', 'dragon', 'ancient'],
    lore: 'A dragon made of living flame, the embodiment of fire\'s primal power and ancient wisdom.',
  },
  {
    id: brandBasePetId('BASE-PYRO-013'),
    name: 'Igneous Titan',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 2550, attack: 197, defense: 185, speed: 90 },
    starterAbilities: ['magma-shell'],
    starterPassives: ['flaming-aura', 'heat-resonance', 'phoenix-blood'],
    visualTags: ['fire', 'massive', 'volcanic'],
    lore: 'A massive being of living magma and flame, so hot it warms entire sectors of The Grid.',
  },
];

const PYRO_KIN_MYTHIC: any[] = [
  {
    id: brandBasePetId('BASE-PYRO-014'),
    name: 'Eternal Phoenix',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 3750, attack: 300, defense: 260, speed: 102 },
    starterAbilities: ['rebirth-cycle'],
    starterPassives: ['phoenix-blood', 'heat-resonance', 'magma-veins', 'combustion-core'],
    visualTags: ['fire', 'phoenix', 'immortal'],
    lore: 'The mythical phoenix of The Grid, embodying the eternal cycle of destruction and renewal. Its flame never dies and its wisdom is ancient.',
  },
  {
    id: brandBasePetId('BASE-PYRO-015'),
    name: 'Plasma Incarnate',
    family: PetFamily.PYRO_KIN,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 4050, attack: 320, defense: 280, speed: 107 },
    starterAbilities: ['plasma-infusion'],
    starterPassives: ['combustion-core', 'heat-resonance', 'flaming-aura', 'magma-veins'],
    visualTags: ['fire', 'electric', 'energy'],
    lore: 'The ultimate fusion of fire and lightning, a being of pure plasma energy that exists at the boundary between elements.',
  },
];

// AQUA_BORN - Water family (15 pets)
const AQUA_BORN_BASIC: any[] = [
  {
    id: brandBasePetId('BASE-AQUA-001'),
    name: 'Droplet',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 525, attack: 47, defense: 40, speed: 64 },
    starterAbilities: ['water-droplet'],
    starterPassives: [],
    visualTags: ['water', 'tiny', 'flowing'],
    lore: 'A sentient drop of pure water that flows through The Grid, connecting data streams like water connects rivers.',
  },
  {
    id: brandBasePetId('BASE-AQUA-002'),
    name: 'Mistling',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 545, attack: 48, defense: 38, speed: 67 },
    starterAbilities: ['vapor-screen'],
    starterPassives: [],
    visualTags: ['water', 'vapor', 'ethereal'],
    lore: 'A wispy creature made of condensed vapor that drifts through The Grid, barely substantial but persistent.',
  },
  {
    id: brandBasePetId('BASE-AQUA-003'),
    name: 'Ripplepaw',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 560, attack: 50, defense: 42, speed: 65 },
    starterAbilities: ['ripple-strike'],
    starterPassives: [],
    visualTags: ['water', 'mammal', 'swift'],
    lore: 'An otter-like creature whose paws create ripples of pure data when they touch surfaces.',
  },
  {
    id: brandBasePetId('BASE-AQUA-004'),
    name: 'Tidecrawler',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 535, attack: 46, defense: 41, speed: 63 },
    starterAbilities: ['tidal-surge'],
    starterPassives: [],
    visualTags: ['water', 'crustacean', 'armored'],
    lore: 'A crustacean made of crystallized water that moves with the rhythm of invisible tides.',
  },
  {
    id: brandBasePetId('BASE-AQUA-005'),
    name: 'Bubblesnail',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.BASIC,
    baseStats: { hp: 555, attack: 45, defense: 43, speed: 59 },
    starterAbilities: ['bubble-shield'],
    starterPassives: [],
    visualTags: ['water', 'snail', 'protective'],
    lore: 'A gentle snail surrounded by protective bubbles that it uses to shield itself and allies.',
  },
];

const AQUA_BORN_RARE: any[] = [
  {
    id: brandBasePetId('BASE-AQUA-006'),
    name: 'Torrentwolf',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.RARE,
    baseStats: { hp: 900, attack: 80, defense: 68, speed: 75 },
    starterAbilities: ['torrent-strike'],
    starterPassives: ['tidal-flow'],
    visualTags: ['water', 'canine', 'powerful'],
    lore: 'A water spirit in the form of a wolf that moves with the force of a raging torrent.',
  },
  {
    id: brandBasePetId('BASE-AQUA-007'),
    name: 'Crystalline Siren',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.RARE,
    baseStats: { hp: 920, attack: 78, defense: 66, speed: 77 },
    starterAbilities: ['siren-song'],
    starterPassives: ['healing-waters'],
    visualTags: ['water', 'enchanting', 'melodic'],
    lore: 'A water spirit whose songs can heal wounds and calm troubled minds.',
  },
  {
    id: brandBasePetId('BASE-AQUA-008'),
    name: 'Icewhale',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.RARE,
    baseStats: { hp: 940, attack: 82, defense: 70, speed: 71 },
    starterAbilities: ['ice-breath'],
    starterPassives: ['aquatic-resilience'],
    visualTags: ['water', 'ice', 'massive'],
    lore: 'A colossal whale-like creature made of ice and water that rules the frozen depths.',
  },
];

const AQUA_BORN_SR: any[] = [
  {
    id: brandBasePetId('BASE-AQUA-009'),
    name: 'Abyssal Leviathan',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.SR,
    baseStats: { hp: 1525, attack: 128, defense: 110, speed: 80 },
    starterAbilities: ['abyss-pressure'],
    starterPassives: ['tidal-flow', 'aquatic-resilience'],
    visualTags: ['water', 'serpent', 'deep'],
    lore: 'A serpent from the deepest parts of The Grid, wielding the pressure of the abyss.',
  },
  {
    id: brandBasePetId('BASE-AQUA-010'),
    name: 'Stormtide Drake',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.SR,
    baseStats: { hp: 1495, attack: 130, defense: 108, speed: 85 },
    starterAbilities: ['storm-surge'],
    starterPassives: ['healing-waters', 'flow-state'],
    visualTags: ['water', 'drake', 'tempestuous'],
    lore: 'A dragon-like creature that embodies the fury of storms and the calm of still waters.',
  },
  {
    id: brandBasePetId('BASE-AQUA-011'),
    name: 'Coral Guardian',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.SR,
    baseStats: { hp: 1535, attack: 126, defense: 115, speed: 79 },
    starterAbilities: ['coral-fortress'],
    starterPassives: ['aqueous-shield', 'healing-waters'],
    visualTags: ['water', 'protector', 'living-reef'],
    lore: 'A living coral structure that protects and heals all creatures within its reach.',
  },
];

const AQUA_BORN_LEGENDARY: any[] = [
  {
    id: brandBasePetId('BASE-AQUA-012'),
    name: 'Poseidon\'s Trident',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 2400, attack: 185, defense: 175, speed: 88 },
    starterAbilities: ['trident-strike'],
    starterPassives: ['tidal-flow', 'healing-waters', 'aquatic-resilience'],
    visualTags: ['water', 'legendary', 'divine'],
    lore: 'A water god\'s avatar, wielding the power of tides and control over all aquatic life.',
  },
  {
    id: brandBasePetId('BASE-AQUA-013'),
    name: 'Tsunami Titan',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 2350, attack: 192, defense: 168, speed: 86 },
    starterAbilities: ['tsunami-wave'],
    starterPassives: ['aqueous-shield', 'flow-state', 'healing-waters'],
    visualTags: ['water', 'massive', 'destructive'],
    lore: 'A colossal water elemental that can swallow entire regions with a single wave.',
  },
];

const AQUA_BORN_MYTHIC: any[] = [
  {
    id: brandBasePetId('BASE-AQUA-014'),
    name: 'Eternal Leviathan',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 3850, attack: 305, defense: 275, speed: 100 },
    starterAbilities: ['primordial-flood'],
    starterPassives: ['tidal-flow', 'healing-waters', 'aquatic-resilience', 'flow-state'],
    visualTags: ['water', 'ancient', 'world-eater'],
    lore: 'The primordial serpent from before The Grid was formed, containing the memory of all oceans.',
  },
  {
    id: brandBasePetId('BASE-AQUA-015'),
    name: 'Morphic Tidecaller',
    family: PetFamily.AQUA_BORN,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 3950, attack: 310, defense: 285, speed: 105 },
    starterAbilities: ['water-rewrite'],
    starterPassives: ['healing-waters', 'aqueous-shield', 'flow-state', 'aquatic-resilience'],
    visualTags: ['water', 'shapeshifter', 'adaptable'],
    lore: 'A water spirit that can take any form and rewrite reality with its flowing essence.',
  },
];

// TERRA_FORGED - Earth family (15 pets)
const TERRA_FORGED_BASIC: any[] = [
  {
    id: brandBasePetId('BASE-TERRA-001'),
    name: 'Rockpebble',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.BASIC,
    baseStats: { hp: 560, attack: 44, defense: 45, speed: 58 },
    starterAbilities: ['rock-throw'],
    starterPassives: [],
    visualTags: ['earth', 'rock', 'solid'],
    lore: 'A tiny sentient stone that rolls through data streams, seeking connection with the earth.',
  },
  {
    id: brandBasePetId('BASE-TERRA-002'),
    name: 'Mudling',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.BASIC,
    baseStats: { hp: 550, attack: 45, defense: 43, speed: 60 },
    starterAbilities: ['mudslide'],
    starterPassives: [],
    visualTags: ['earth', 'clay', 'malleable'],
    lore: 'A creature of soft earth and clay that can reshape itself to adapt to any situation.',
  },
  {
    id: brandBasePetId('BASE-TERRA-003'),
    name: 'Rootstalker',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.BASIC,
    baseStats: { hp: 570, attack: 46, defense: 46, speed: 59 },
    starterAbilities: ['vine-entangle'],
    starterPassives: [],
    visualTags: ['earth', 'plant', 'rooted'],
    lore: 'A plant creature with powerful roots that can anchor itself and entangle enemies.',
  },
  {
    id: brandBasePetId('BASE-TERRA-004'),
    name: 'Dust Elemental',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.BASIC,
    baseStats: { hp: 540, attack: 47, defense: 42, speed: 62 },
    starterAbilities: ['dust-storm'],
    starterPassives: [],
    visualTags: ['earth', 'dust', 'dispersible'],
    lore: 'A swirling collection of earth and dust that moves with surprising grace.',
  },
  {
    id: brandBasePetId('BASE-TERRA-005'),
    name: 'Crystalmite',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.BASIC,
    baseStats: { hp: 555, attack: 45, defense: 44, speed: 61 },
    starterAbilities: ['crystal-shard'],
    starterPassives: [],
    visualTags: ['earth', 'crystal', 'geometric'],
    lore: 'A small crystalline structure that refracts earth energy into different frequencies.',
  },
];

const TERRA_FORGED_RARE: any[] = [
  {
    id: brandBasePetId('BASE-TERRA-006'),
    name: 'Stonewraith',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.RARE,
    baseStats: { hp: 950, attack: 77, defense: 75, speed: 68 },
    starterAbilities: ['stone-barrage'],
    starterPassives: ['stone-skin'],
    visualTags: ['earth', 'rock', 'haunting'],
    lore: 'A living stone spirit that haunts quarries and mineral deposits, protecting them from misuse.',
  },
  {
    id: brandBasePetId('BASE-TERRA-007'),
    name: 'Earthshaper',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.RARE,
    baseStats: { hp: 930, attack: 76, defense: 74, speed: 70 },
    starterAbilities: ['earth-quake'],
    starterPassives: ['rooted-strength'],
    visualTags: ['earth', 'powerful', 'reshaping'],
    lore: 'A being that can reshape the very ground beneath your feet with intent and power.',
  },
  {
    id: brandBasePetId('BASE-TERRA-008'),
    name: 'Treeking',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.RARE,
    baseStats: { hp: 960, attack: 75, defense: 76, speed: 66 },
    starterAbilities: ['forest-surge'],
    starterPassives: ['mineral-boost'],
    visualTags: ['earth', 'nature', 'ancient-tree'],
    lore: 'A wise ancient tree creature that commands the growth of forests with a thought.',
  },
];

const TERRA_FORGED_SR: any[] = [
  {
    id: brandBasePetId('BASE-TERRA-009'),
    name: 'Granite Golem',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.SR,
    baseStats: { hp: 1580, attack: 125, defense: 130, speed: 75 },
    starterAbilities: ['granite-crush'],
    starterPassives: ['stone-skin', 'rooted-strength'],
    visualTags: ['earth', 'golem', 'monumental'],
    lore: 'A massive golem carved from a single piece of granite that grows stronger with each passing season.',
  },
  {
    id: brandBasePetId('BASE-TERRA-010'),
    name: 'Crystal Titan',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.SR,
    baseStats: { hp: 1560, attack: 128, defense: 128, speed: 77 },
    starterAbilities: ['crystal-fortress'],
    starterPassives: ['mineral-boost', 'crystalline-fortitude'],
    visualTags: ['earth', 'crystal', 'prismatic'],
    lore: 'A being of pure crystalline structure that refracts energy into devastating focused beams.',
  },
  {
    id: brandBasePetId('BASE-TERRA-011'),
    name: 'Groundbreaker',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.SR,
    baseStats: { hp: 1540, attack: 130, defense: 125, speed: 80 },
    starterAbilities: ['fault-line'],
    starterPassives: ['geological-stability', 'rooted-strength'],
    visualTags: ['earth', 'destructive', 'seismic'],
    lore: 'A creature that splits the earth asunder, creating new valleys and canyons with its passage.',
  },
];

const TERRA_FORGED_LEGENDARY: any[] = [
  {
    id: brandBasePetId('BASE-TERRA-012'),
    name: 'Terramancer',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 2450, attack: 182, defense: 190, speed: 85 },
    starterAbilities: ['earth-magic'],
    starterPassives: ['stone-skin', 'rooted-strength', 'geological-stability'],
    visualTags: ['earth', 'wizard', 'arcane'],
    lore: 'A master of earth magic who has shaped mountains and valleys across entire continents.',
  },
  {
    id: brandBasePetId('BASE-TERRA-013'),
    name: 'Titan of Stone',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 2500, attack: 188, defense: 195, speed: 82 },
    starterAbilities: ['world-shift'],
    starterPassives: ['mineral-boost', 'crystalline-fortitude', 'geological-stability'],
    visualTags: ['earth', 'enormous', 'world-shaping'],
    lore: 'An ancient being as old as mountains, capable of shifting continents with a mere gesture.',
  },
];

const TERRA_FORGED_MYTHIC: any[] = [
  {
    id: brandBasePetId('BASE-TERRA-014'),
    name: 'Eternal Crag',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 3950, attack: 295, defense: 310, speed: 90 },
    starterAbilities: ['bedrock-foundation'],
    starterPassives: ['stone-skin', 'rooted-strength', 'geological-stability', 'crystalline-fortitude'],
    visualTags: ['earth', 'timeless', 'unbreakable'],
    lore: 'A mountain given sentience, containing the geological record of an entire world\'s history.',
  },
  {
    id: brandBasePetId('BASE-TERRA-015'),
    name: 'Void Carver',
    family: PetFamily.TERRA_FORGED,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 4000, attack: 305, defense: 300, speed: 95 },
    starterAbilities: ['reality-sculpt'],
    starterPassives: ['mineral-boost', 'geological-stability', 'rooted-strength', 'stone-skin'],
    visualTags: ['earth', 'reality-bending', 'ancient'],
    lore: 'A being that carves through the very fabric of reality itself, reshaping existence with its will.',
  },
];

// VOLT_STREAM - Lightning family (15 pets)
const VOLT_STREAM_BASIC: any[] = [
  {
    id: brandBasePetId('BASE-VOLT-001'),
    name: 'Sparklet',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.BASIC,
    baseStats: { hp: 515, attack: 48, defense: 36, speed: 68 },
    starterAbilities: ['spark-bolt'],
    starterPassives: [],
    visualTags: ['lightning', 'tiny', 'energetic'],
    lore: 'A small spark of pure electrical energy, zipping through The Grid at incredible speeds.',
  },
  {
    id: brandBasePetId('BASE-VOLT-002'),
    name: 'Zephyrling',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.BASIC,
    baseStats: { hp: 530, attack: 49, defense: 37, speed: 70 },
    starterAbilities: ['lightning-dash'],
    starterPassives: [],
    visualTags: ['lightning', 'swift', 'aerodynamic'],
    lore: 'A creature made of condensed lightning that moves like the wind itself.',
  },
  {
    id: brandBasePetId('BASE-VOLT-003'),
    name: 'Conductorm',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.BASIC,
    baseStats: { hp: 545, attack: 50, defense: 38, speed: 66 },
    starterAbilities: ['chain-lightning'],
    starterPassives: [],
    visualTags: ['lightning', 'conductive', 'metal'],
    lore: 'A creature whose body conducts electricity with perfect efficiency, spreading it in chains.',
  },
  {
    id: brandBasePetId('BASE-VOLT-004'),
    name: 'Voltmoth',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.BASIC,
    baseStats: { hp: 520, attack: 47, defense: 35, speed: 72 },
    starterAbilities: ['static-flutter'],
    starterPassives: [],
    visualTags: ['lightning', 'moth', 'shimmering'],
    lore: 'A moth made entirely of electrical energy that attracts and repels other electrical creatures.',
  },
  {
    id: brandBasePetId('BASE-VOLT-005'),
    name: 'Amperage Sprite',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.BASIC,
    baseStats: { hp: 535, attack: 48, defense: 36, speed: 71 },
    starterAbilities: ['voltage-surge'],
    starterPassives: [],
    visualTags: ['lightning', 'sprite', 'glowing'],
    lore: 'A magical creature born from electrical storms, carrying the memory of lightning strikes.',
  },
];

const VOLT_STREAM_RARE: any[] = [
  {
    id: brandBasePetId('BASE-VOLT-006'),
    name: 'Thunderhawk',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.RARE,
    baseStats: { hp: 880, attack: 84, defense: 62, speed: 78 },
    starterAbilities: ['thunder-strike'],
    starterPassives: ['electrical-conductor'],
    visualTags: ['lightning', 'bird', 'fierce'],
    lore: 'A hawk made of crackling electricity that hunts through the sky with precision.',
  },
  {
    id: brandBasePetId('BASE-VOLT-007'),
    name: 'Lightningfish',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.RARE,
    baseStats: { hp: 900, attack: 82, defense: 64, speed: 76 },
    starterAbilities: ['electric-current'],
    starterPassives: ['voltage-amplifier'],
    visualTags: ['lightning', 'fish', 'aquatic-electric'],
    lore: 'A fish that swims through the air on currents of pure electricity.',
  },
  {
    id: brandBasePetId('BASE-VOLT-008'),
    name: 'Stormseeker',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.RARE,
    baseStats: { hp: 920, attack: 86, defense: 66, speed: 74 },
    starterAbilities: ['storm-call'],
    starterPassives: ['rapid-discharge'],
    visualTags: ['lightning', 'weather', 'powerful'],
    lore: 'A creature that calls down storms wherever it travels, riding the bolts of lightning.',
  },
];

const VOLT_STREAM_SR: BasePet[] = [
  {
    id: brandBasePetId('BASE-VOLT-009'),
    name: 'Voltstrider',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.SR,
    baseStats: { hp: 1450, attack: 135, defense: 105, speed: 90 },
    starterAbilities: ['electric-stride'],
    starterPassives: ['electrical-conductor', 'rapid-discharge'],
    visualTags: ['lightning', 'swift', 'dimensional'],
    lore: 'A creature that moves between moments through electrical pathways, appearing and disappearing.',
  },
  {
    id: brandBasePetId('BASE-VOLT-010'),
    name: 'Tempest Dragon',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.SR,
    baseStats: { hp: 1480, attack: 138, defense: 108, speed: 88 },
    starterAbilities: ['tempest-fury'],
    starterPassives: ['voltage-amplifier', 'rapid-discharge'],
    visualTags: ['lightning', 'dragon', 'stormy'],
    lore: 'A dragon wreathed in eternal storms, calling lightning from clear skies.',
  },
  {
    id: brandBasePetId('BASE-VOLT-011'),
    name: 'Plasma Predator',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.SR,
    baseStats: { hp: 1420, attack: 140, defense: 102, speed: 92 },
    starterAbilities: ['plasma-strike'],
    starterPassives: ['static-field', 'surge-buffer'],
    visualTags: ['lightning', 'plasma', 'dangerous'],
    lore: 'A creature of pure plasma that hunts through electrical systems, devouring energy.',
  },
];

const VOLT_STREAM_LEGENDARY: BasePet[] = [
  {
    id: brandBasePetId('BASE-VOLT-012'),
    name: 'Zeus Prime',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 2300, attack: 200, defense: 165, speed: 95 },
    starterAbilities: ['god-bolt'],
    starterPassives: ['electrical-conductor', 'voltage-amplifier', 'rapid-discharge'],
    visualTags: ['lightning', 'divine', 'godly'],
    lore: 'The avatar of the lightning god, commanding the fury of a thousand storms.',
  },
  {
    id: brandBasePetId('BASE-VOLT-013'),
    name: 'Galactic Discharge',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 2350, attack: 205, defense: 168, speed: 93 },
    starterAbilities: ['cosmic-lightning'],
    starterPassives: ['static-field', 'surge-buffer', 'electrical-conductor'],
    visualTags: ['lightning', 'cosmic', 'galactic'],
    lore: 'A being born from the lightning of dying stars, carrying cosmic electrical power.',
  },
];

const VOLT_STREAM_MYTHIC: any[] = [
  {
    id: brandBasePetId('BASE-VOLT-014'),
    name: 'Eternal Storm',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 3700, attack: 315, defense: 260, speed: 110 },
    starterAbilities: ['infinite-tempest'],
    starterPassives: ['electrical-conductor', 'voltage-amplifier', 'rapid-discharge', 'static-field'],
    visualTags: ['lightning', 'eternal', 'cataclysmic'],
    lore: 'A storm that has raged since the beginning of time, never ceasing, ever growing stronger.',
  },
  {
    id: brandBasePetId('BASE-VOLT-015'),
    name: 'Singularity Arc',
    family: PetFamily.VOLT_STREAM,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 3800, attack: 325, defense: 270, speed: 108 },
    starterAbilities: ['void-discharge'],
    starterPassives: ['surge-buffer', 'static-field', 'rapid-discharge', 'voltage-amplifier'],
    visualTags: ['lightning', 'void', 'reality-warping'],
    lore: 'A singularity of electrical energy that warps space and time around itself.',
  },
];

// Combining all base pets
export const ALL_BASE_PETS: BasePet[] = [
  // PYRO_KIN
  ...PYRO_KIN_BASIC,
  ...PYRO_KIN_RARE,
  ...PYRO_KIN_SR,
  ...PYRO_KIN_LEGENDARY,
  ...PYRO_KIN_MYTHIC,
  // AQUA_BORN
  ...AQUA_BORN_BASIC,
  ...AQUA_BORN_RARE,
  ...AQUA_BORN_SR,
  ...AQUA_BORN_LEGENDARY,
  ...AQUA_BORN_MYTHIC,
  // TERRA_FORGED
  ...TERRA_FORGED_BASIC,
  ...TERRA_FORGED_RARE,
  ...TERRA_FORGED_SR,
  ...TERRA_FORGED_LEGENDARY,
  ...TERRA_FORGED_MYTHIC,
  // VOLT_STREAM
  ...VOLT_STREAM_BASIC,
  ...VOLT_STREAM_RARE,
  ...VOLT_STREAM_SR,
  ...VOLT_STREAM_LEGENDARY,
  ...VOLT_STREAM_MYTHIC,
];

export const seedBasePets = async (repo: any) => {
  for (const basePet of ALL_BASE_PETS) {
    await repo.save(basePet);
  }
};
