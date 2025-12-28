/**
 * Element Interaction System
 * Defines how elements interact to create new concepts and effects
 * Used in fusion naming, ability generation, and combat
 */

export interface ElementInteraction {
  element1: string;
  element2: string;
  result: string; // Resulting element/concept
  abilityThemes: string[]; // Ability themes for this interaction
  namePrefixes: string[]; // Name prefixes
  nameSuffixes: string[]; // Name suffixes
  description: string; // Description of the interaction
  combatBonus?: {
    damageMultiplier?: number;
    statusEffect?: string;
    specialEffect?: string;
  };
}

/**
 * Comprehensive element interaction definitions
 */
export const ELEMENT_INTERACTIONS: ElementInteraction[] = [
  {
    element1: 'fire',
    element2: 'water',
    result: 'steam',
    abilityThemes: ['pressure', 'expansion', 'heat_transfer', 'condensation', 'vapor'],
    namePrefixes: ['Steam', 'Vapor', 'Mist', 'Fog'],
    nameSuffixes: ['the Boiler', 'the Evaporator', 'the Condenser', 'the Turbine'],
    description: 'Fire and Water combine to create Steam, a force of pressure and expansion.',
    combatBonus: {
      damageMultiplier: 1.1,
      statusEffect: 'slow',
      specialEffect: 'reduces_accuracy',
    },
  },
  {
    element1: 'fire',
    element2: 'earth',
    result: 'lava',
    abilityThemes: ['molten', 'eruption', 'solidification', 'pressure', 'volcanic'],
    namePrefixes: ['Magma', 'Volcanic', 'Molten', 'Igneous'],
    nameSuffixes: ['the Eruptor', 'the Forge', 'the Caldera', 'the Furnace'],
    description: 'Fire and Earth merge into Lava, a destructive force of molten rock.',
    combatBonus: {
      damageMultiplier: 1.2,
      statusEffect: 'burn',
      specialEffect: 'ignores_defense',
    },
  },
  {
    element1: 'water',
    element2: 'earth',
    result: 'mud',
    abilityThemes: ['absorption', 'erosion', 'solidification', 'fertility', 'quicksand'],
    namePrefixes: ['Mud', 'Clay', 'Silt', 'Mire'],
    nameSuffixes: ['the Swamp', 'the Quagmire', 'the Mire', 'the Bog'],
    description: 'Water and Earth combine to form Mud, a substance of absorption and erosion.',
    combatBonus: {
      damageMultiplier: 0.9,
      statusEffect: 'slow',
      specialEffect: 'reduces_defense',
    },
  },
  {
    element1: 'lightning',
    element2: 'water',
    result: 'storm',
    abilityThemes: ['electrocution', 'conduction', 'turbulence', 'discharge', 'thunder'],
    namePrefixes: ['Storm', 'Tempest', 'Thunder', 'Squall'],
    nameSuffixes: ['the Tempest', 'the Thunderhead', 'the Squall', 'the Cyclone'],
    description: 'Lightning and Water create Storm, a chaotic force of thunder and rain.',
    combatBonus: {
      damageMultiplier: 1.15,
      statusEffect: 'shock',
      specialEffect: 'chains_damage',
    },
  },
  {
    element1: 'fire',
    element2: 'lightning',
    result: 'plasma',
    abilityThemes: ['ionization', 'energy', 'explosion', 'discharge', 'fusion'],
    namePrefixes: ['Plasma', 'Ion', 'Arc', 'Bolt'],
    nameSuffixes: ['the Ionizer', 'the Arc', 'the Discharger', 'the Fusion'],
    description: 'Fire and Lightning merge into Plasma, a state of ionized energy.',
    combatBonus: {
      damageMultiplier: 1.25,
      statusEffect: 'shock',
      specialEffect: 'explosive',
    },
  },
  {
    element1: 'shadow',
    element2: 'light',
    result: 'twilight',
    abilityThemes: ['balance', 'duality', 'transition', 'merging', 'harmony'],
    namePrefixes: ['Twilight', 'Dusk', 'Dawn', 'Equinox'],
    nameSuffixes: ['the Balance', 'the Duality', 'the Transition', 'the Harmony'],
    description: 'Shadow and Light merge into Twilight, a state of perfect balance between opposites.',
    combatBonus: {
      damageMultiplier: 1.0,
      statusEffect: 'balance',
      specialEffect: 'adaptive_damage',
    },
  },
  {
    element1: 'fire',
    element2: 'shadow',
    result: 'ash',
    abilityThemes: ['corruption', 'decay', 'smoke', 'obscuration', 'void'],
    namePrefixes: ['Ash', 'Ember', 'Smoke', 'Void'],
    nameSuffixes: ['the Corruptor', 'the Decayer', 'the Obscurer', 'the Void'],
    description: 'Fire and Shadow combine to create Ash, a substance of corruption and decay.',
    combatBonus: {
      damageMultiplier: 1.1,
      statusEffect: 'corruption',
      specialEffect: 'reduces_healing',
    },
  },
  {
    element1: 'water',
    element2: 'light',
    result: 'prism',
    abilityThemes: ['refraction', 'rainbow', 'spectrum', 'illumination', 'clarity'],
    namePrefixes: ['Prism', 'Rainbow', 'Spectrum', 'Luminous'],
    nameSuffixes: ['the Refractor', 'the Spectrum', 'the Illuminator', 'the Clarity'],
    description: 'Water and Light merge into Prism, a force of refraction and illumination.',
    combatBonus: {
      damageMultiplier: 1.0,
      statusEffect: 'illuminated',
      specialEffect: 'reveals_stealth',
    },
  },
  {
    element1: 'earth',
    element2: 'lightning',
    result: 'crystal',
    abilityThemes: ['resonance', 'amplification', 'refraction', 'energy', 'focus'],
    namePrefixes: ['Crystal', 'Quartz', 'Prism', 'Gem'],
    nameSuffixes: ['the Resonator', 'the Prism', 'the Amplifier', 'the Focus'],
    description: 'Earth and Lightning form Crystal, a structure that amplifies and focuses energy.',
    combatBonus: {
      damageMultiplier: 1.0,
      statusEffect: 'resonance',
      specialEffect: 'amplifies_abilities',
    },
  },
  {
    element1: 'earth',
    element2: 'nature',
    result: 'grove',
    abilityThemes: ['growth', 'fertility', 'roots', 'life', 'nourishment'],
    namePrefixes: ['Grove', 'Forest', 'Root', 'Life'],
    nameSuffixes: ['the Grower', 'the Nourisher', 'the Root', 'the Life'],
    description: 'Earth and Nature combine to create Grove, a place of growth and fertility.',
    combatBonus: {
      damageMultiplier: 0.9,
      statusEffect: 'regeneration',
      specialEffect: 'heals_over_time',
    },
  },
  {
    element1: 'lightning',
    element2: 'nature',
    result: 'wild_storm',
    abilityThemes: ['wild', 'chaos', 'growth', 'energy', 'vitality'],
    namePrefixes: ['Wild', 'Chaos', 'Vital', 'Storm'],
    nameSuffixes: ['the Wild', 'the Chaos', 'the Vital', 'the Storm'],
    description: 'Lightning and Nature merge into Wild Storm, a force of wild growth and chaos.',
    combatBonus: {
      damageMultiplier: 1.15,
      statusEffect: 'energized',
      specialEffect: 'random_effects',
    },
  },
  {
    element1: 'shadow',
    element2: 'earth',
    result: 'void',
    abilityThemes: ['absorption', 'entropy', 'decay', 'nothingness', 'void'],
    namePrefixes: ['Void', 'Abyss', 'Null', 'Void'],
    nameSuffixes: ['the Void', 'the Abyss', 'the Null', 'the Emptiness'],
    description: 'Shadow and Earth combine to create Void, a force of absorption and entropy.',
    combatBonus: {
      damageMultiplier: 1.1,
      statusEffect: 'void',
      specialEffect: 'absorbs_energy',
    },
  },
  {
    element1: 'light',
    element2: 'nature',
    result: 'radiance',
    abilityThemes: ['growth', 'healing', 'purity', 'life', 'blessing'],
    namePrefixes: ['Radiant', 'Blessed', 'Pure', 'Luminous'],
    nameSuffixes: ['the Radiant', 'the Blessed', 'the Pure', 'the Luminous'],
    description: 'Light and Nature merge into Radiance, a force of healing and growth.',
    combatBonus: {
      damageMultiplier: 0.9,
      statusEffect: 'blessed',
      specialEffect: 'enhances_healing',
    },
  },
];

/**
 * Find element interaction between two elements
 */
export function findElementInteraction(
  element1: string,
  element2: string
): ElementInteraction | null {
  const e1 = element1.toLowerCase();
  const e2 = element2.toLowerCase();

  return (
    ELEMENT_INTERACTIONS.find(
      (interaction) =>
        (interaction.element1 === e1 && interaction.element2 === e2) ||
        (interaction.element1 === e2 && interaction.element2 === e1)
    ) || null
  );
}

/**
 * Get fused element from two elements
 */
export function getFusedElement(element1: string, element2: string): string {
  const interaction = findElementInteraction(element1, element2);
  if (interaction) {
    return interaction.result;
  }
  // Default: use primary element
  return element1.toLowerCase();
}

/**
 * Check if two elements are opposites (paradox)
 */
export function areElementsOpposite(element1: string, element2: string): boolean {
  const opposites: Array<[string, string]> = [
    ['fire', 'water'],
    ['light', 'shadow'],
    ['earth', 'air'],
    ['ice', 'fire'],
    ['nature', 'shadow'],
  ];

  const e1 = element1.toLowerCase();
  const e2 = element2.toLowerCase();

  return opposites.some(
    ([a, b]) => (a === e1 && b === e2) || (a === e2 && b === e1)
  );
}

/**
 * Check if two elements have perfect synergy
 */
export function areElementsSynergistic(element1: string, element2: string): boolean {
  const synergies: Array<[string, string]> = [
    ['fire', 'lightning'],
    ['water', 'ice'],
    ['earth', 'nature'],
    ['light', 'nature'],
    ['shadow', 'earth'],
    ['fire', 'earth'],
    ['lightning', 'water'],
  ];

  const e1 = element1.toLowerCase();
  const e2 = element2.toLowerCase();

  return synergies.some(
    ([a, b]) => (a === e1 && b === e2) || (a === e2 && b === e1)
  );
}

/**
 * Get interaction result name
 */
export function getInteractionResultName(
  element1: string,
  element2: string
): string | null {
  const interaction = findElementInteraction(element1, element2);
  return interaction ? interaction.result : null;
}

/**
 * Get ability themes for an element interaction
 */
export function getInteractionAbilityThemes(
  element1: string,
  element2: string
): string[] {
  const interaction = findElementInteraction(element1, element2);
  return interaction ? interaction.abilityThemes : [];
}

/**
 * Get name suggestions for an element interaction
 */
export function getInteractionNameSuggestions(
  element1: string,
  element2: string
): { prefixes: string[]; suffixes: string[] } {
  const interaction = findElementInteraction(element1, element2);
  if (interaction) {
    return {
      prefixes: interaction.namePrefixes,
      suffixes: interaction.nameSuffixes,
    };
  }
  return { prefixes: [], suffixes: [] };
}







