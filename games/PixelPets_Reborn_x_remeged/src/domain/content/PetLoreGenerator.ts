/**
 * Pet Lore Generator
 * Procedural generation of pet backstories and lore
 */

import type { PetFamily } from '@/shared/types/family';
import type { Rarity } from '@/shared/types/rarity';

const LORE_TEMPLATES = [
  "Born in the {location}, {name} {action} {trait}.",
  "{name} emerged when {event} {detail}.",
  "Ancient legends speak of {name}, {description}.",
  "In the {location}, {name} is known for {trait}.",
  "{name} was created during {event}, forever marked by {detail}.",
  "Dwelling in the {location}, {name} {action} with {quality}.",
  "The tale of {name} begins in {location}, where {event}.",
  "{name}, {description}, has become a legend among {location}.",
  "Forged in {location}, {name} possesses {quality} beyond measure.",
  "{name} {action}, driven by {quality} and bound to {location}."
];

const TEMPLATE_VARS: Record<string, Record<PetFamily, string[]> | string[]> = {
  location: {
    PYRO_KIN: ['the volcanic depths', 'eternal flames', 'the molten core', 'ember wastes', 'infernal caverns', 'burning peaks'],
    AQUA_BORN: ['the deep ocean', 'frozen tundras', 'whirlpool abyss', 'coral sanctuaries', 'tidal caverns', 'misty depths'],
    TERRA_FORGED: ['mountain peaks', 'ancient caves', 'crystal mines', 'stone forests', 'underground ruins', 'earthen hollows'],
    VOLT_STREAM: ['storm clouds', 'lightning fields', 'electric plains', 'thunder valleys', 'charged skies', 'static peaks'],
    SHADOW_VEIL: ['twilight realm', 'dark forests', 'shadow dimension', 'void spaces', 'nocturnal depths', 'umbral planes'],
    LUMINA: ['radiant meadows', 'celestial heights', 'light realm', 'glowing gardens', 'prismatic fields', 'dawn sanctuaries'],
    STEEL_WORKS: ['mechanical forges', 'iron foundries', 'gear factories', 'metal workshops', 'industrial depths', 'clockwork cities'],
    ARCANE_RIFT: ['mystic rifts', 'magical vortexes', 'arcane libraries', 'ethereal planes', 'enchanted groves', 'spell nexuses'],
    AERO_FLIGHT: ['high skies', 'wind currents', 'cloud islands', 'aerial domains', 'tempest peaks', 'skyward realms'],
    WEIRDOS: ['glitch zones', 'anomaly fields', 'chaos realms', 'unstable dimensions', 'fractured realities', 'paradox spaces']
  },
  action: [
    'guards', 'hunts', 'wanders', 'seeks', 'defends', 'prowls', 'watches',
    'explores', 'protects', 'searches', 'patrols', 'oversees', 'survives', 'thrives',
    'battles', 'conquers', 'dominates', 'rules', 'commands'
  ],
  trait: [
    'with unmatched ferocity', 'with ancient wisdom', 'seeking redemption', 'protecting the weak',
    'challenging all who dare', 'preserving ancient secrets', 'maintaining the balance',
    'spreading tales of power', 'gathering lost knowledge', 'defending sacred grounds',
    'pursuing eternal glory', 'honoring fallen warriors', 'mastering primal forces'
  ],
  event: [
    'the stars aligned', 'chaos erupted', 'balance shattered', 'worlds collided',
    'ancient powers awakened', 'a great cataclysm struck', 'magic surged uncontrolled',
    'dimensions merged', 'time itself bent', 'reality fractured',
    'the elements clashed', 'prophecy fulfilled', 'destiny manifested'
  ],
  detail: [
    'bringing forth this creature', 'creating a legend', 'birthing chaos',
    'forging destiny', 'shattering expectations', 'defying nature',
    'transcending limits', 'awakening dormant power', 'unleashing potential',
    'binding ancient spirits', 'channeling raw energy', 'crystallizing pure essence'
  ],
  description: [
    'a being of immense power', 'guardian of forgotten realms', 'harbinger of change',
    'master of elemental forces', 'keeper of ancient secrets', 'warrior without equal',
    'entity beyond comprehension', 'survivor of countless battles', 'embodiment of primal energy',
    'champion of the lost', 'wielder of cosmic forces', 'protector of sacred bonds'
  ],
  quality: [
    'unwavering loyalty', 'fierce determination', 'boundless courage', 'infinite wisdom',
    'relentless strength', 'graceful agility', 'profound intelligence', 'mysterious aura',
    'unstoppable will', 'divine patience', 'primal instinct', 'tactical brilliance'
  ]
};

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
 * Select random from array using RNG
 */
function selectRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Generate pet lore
 */
export function generatePetLore(name: string, family: PetFamily, rarity: Rarity, seed: number): string {
  const rng = createSeededRNG(seed);

  // Select template
  let template = selectRandom(LORE_TEMPLATES, rng);

  // Higher rarities get more elaborate templates
  if (rarity >= 4) {
    // Legendary/Mythic: combine two templates
    const template2 = selectRandom(LORE_TEMPLATES, rng);
    template = `${template} ${template2}`;
  }

  // Replace placeholders
  let lore = template
    .replace(/{name}/g, name)
    .replace(/{location}/g, selectRandom((TEMPLATE_VARS.location as Record<PetFamily, string[]>)[family], rng))
    .replace(/{action}/g, selectRandom(TEMPLATE_VARS.action as string[], rng))
    .replace(/{trait}/g, selectRandom(TEMPLATE_VARS.trait as string[], rng))
    .replace(/{event}/g, selectRandom(TEMPLATE_VARS.event as string[], rng))
    .replace(/{detail}/g, selectRandom(TEMPLATE_VARS.detail as string[], rng))
    .replace(/{description}/g, selectRandom(TEMPLATE_VARS.description as string[], rng))
    .replace(/{quality}/g, selectRandom(TEMPLATE_VARS.quality as string[], rng));

  // Add rarity-specific flavor
  if (rarity === 5) {
    lore += " This mythical being transcends mortal understanding.";
  } else if (rarity === 4) {
    lore += " Few have witnessed its true power.";
  } else if (rarity === 3) {
    lore += " Stories of its deeds inspire many.";
  }

  return lore;
}

/**
 * Generate multiple unique lores
 */
export function generateUniqueLores(
  names: string[],
  family: PetFamily,
  rarity: Rarity,
  baseSeed: number = 5000
): string[] {
  return names.map((name, index) => {
    return generatePetLore(name, family, rarity, baseSeed + index);
  });
}
