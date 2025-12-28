/**
 * Stone Lore System
 * Comprehensive lore and descriptions for all stone types
 */

import { StoneType, StoneTier } from '../entities/Stone';

export interface StoneLore {
  type: StoneType;
  name: string;
  baseDescription: string;
  tierDescriptions: Record<StoneTier, string>;
  fusionEffect: string;
  domainEffect?: string;
  originStory: string;
}

/**
 * Stone Lore Database
 */
export const STONE_LORE: Record<StoneType, StoneLore> = {
  [StoneType.RUBY]: {
    type: StoneType.RUBY,
    name: 'Ruby',
    baseDescription: 'A vibrant red gemstone pulsing with fiery energy. It burns with the essence of passion and destruction.',
    tierDescriptions: {
      [StoneTier.I]: 'A small ruby flickering with weak flames. Its power is barely contained.',
      [StoneTier.II]: 'A polished ruby glowing warmly. Flames dance within its depths.',
      [StoneTier.III]: 'A brilliant ruby radiating heat. Fire energy courses through it visibly.',
      [StoneTier.IV]: 'A masterwork ruby that seems to burn from within. The flames within are barely contained.',
      [StoneTier.V]: 'A legendary ruby that blazes with eternal fire. It burns so hot it warps the air around it.',
    },
    fusionEffect: 'Enhances fire-based abilities and increases attack power. Pets fused with Ruby gain a fiery aura.',
    domainEffect: 'The Domain of Flames: All fire abilities deal 25% increased damage. Enemies take periodic fire damage.',
    originStory: 'Forged in the heart of the Grid\'s volcanic regions, Rubies are crystallized fury given form. Legend says they are the tears of the first fire spirit.',
  },
  [StoneType.SAPPHIRE]: {
    type: StoneType.SAPPHIRE,
    name: 'Sapphire',
    baseDescription: 'A deep blue crystal that shimmers like ocean waves. It resonates with the power of water and healing.',
    tierDescriptions: {
      [StoneTier.I]: 'A pale sapphire that glimmers faintly. You can hear whispers of distant tides.',
      [StoneTier.II]: 'A clear sapphire with gentle ripples inside. Water energy flows through it.',
      [StoneTier.III]: 'A brilliant sapphire that pulses like a heartbeat. Waves crash within its core.',
      [StoneTier.IV]: 'A flawless sapphire that seems to contain an ocean. You can feel the tide pull when near it.',
      [StoneTier.V]: 'A divine sapphire that creates rainbows from its depths. It hums with the song of all waters.',
    },
    fusionEffect: 'Strengthens water abilities and enhances healing. Pets fused with Sapphire gain regenerative properties.',
    domainEffect: 'The Domain of Tides: Healing effects are doubled. Water abilities slow enemies and cleanse status effects.',
    originStory: 'Sapphires are formed from the first raindrops that fell upon the Grid. Each contains a fragment of the primordial ocean\'s memory.',
  },
  [StoneType.EMERALD]: {
    type: StoneType.EMERALD,
    name: 'Emerald',
    baseDescription: 'A vibrant green gemstone that pulses with life energy. It connects to nature and growth.',
    tierDescriptions: {
      [StoneTier.I]: 'A small emerald with a dull glow. Tiny roots seem to grow within it.',
      [StoneTier.II]: 'A polished emerald that pulses like a heartbeat. Leaves unfurl inside.',
      [StoneTier.III]: 'A brilliant emerald overflowing with life. Flowers bloom within its facets.',
      [StoneTier.IV]: 'A masterwork emerald that creates its own ecosystem. A forest grows inside its depths.',
      [StoneTier.V]: 'A legendary emerald that IS a forest. It contains an entire world of nature within.',
    },
    fusionEffect: 'Boosts nature-based abilities and increases HP. Pets fused with Emerald grow stronger over time.',
    domainEffect: 'The Domain of Growth: All allies regenerate HP each turn. Nature abilities create protective barriers.',
    originStory: 'Emeralds are seeds from the World Tree itself, crystallized over eons. Each one contains the blueprint of all living things.',
  },
  [StoneType.TOPAZ]: {
    type: StoneType.TOPAZ,
    name: 'Topaz',
    baseDescription: 'A golden yellow crystal crackling with lightning. It hums with electrical energy.',
    tierDescriptions: {
      [StoneTier.I]: 'A dim topaz that sparks occasionally. Static clings to everything near it.',
      [StoneTier.II]: 'A glowing topaz with visible currents. Small lightning arcs between its facets.',
      [StoneTier.III]: 'A brilliant topaz that crackles with energy. Lightning dances within constantly.',
      [StoneTier.IV]: 'A masterwork topaz that creates storms. Thunder rolls from its depths.',
      [StoneTier.V]: 'A legendary topaz that IS lightning. It crackles with the power of a thousand storms.',
    },
    fusionEffect: 'Amplifies lightning abilities and increases speed. Pets fused with Topaz move with electric swiftness.',
    domainEffect: 'The Domain of Storms: Speed is doubled for all allies. Lightning abilities chain between enemies.',
    originStory: 'Topazes are captured lightning bolts, frozen in time. They hold the fury of every storm that has ever raged across the Grid.',
  },
  [StoneType.AMETHYST]: {
    type: StoneType.AMETHYST,
    name: 'Amethyst',
    baseDescription: 'A deep purple crystal that whispers with shadow magic. It bends reality to its will.',
    tierDescriptions: {
      [StoneTier.I]: 'A dark amethyst that seems to absorb light. Shadows pool around it.',
      [StoneTier.II]: 'A glowing amethyst with shifting colors. The shadows it casts move on their own.',
      [StoneTier.III]: 'A brilliant amethyst that creates illusions. Reality warps near it.',
      [StoneTier.IV]: 'A masterwork amethyst that opens portals. You can see other worlds in its depths.',
      [StoneTier.V]: 'A legendary amethyst that IS a portal. It connects to the realm of shadows itself.',
    },
    fusionEffect: 'Enhances shadow abilities and increases critical chance. Pets fused with Amethyst can phase through attacks.',
    domainEffect: 'The Domain of Shadows: Critical hit chance is tripled. Shadow abilities bypass defenses entirely.',
    originStory: 'Amethysts are fragments of the void between dimensions. Each one is a tear in reality, holding infinite possibilities.',
  },
  [StoneType.PEARL]: {
    type: StoneType.PEARL,
    name: 'Pearl',
    baseDescription: 'A luminous white orb that glows with pure light energy. It radiates protection and clarity.',
    tierDescriptions: {
      [StoneTier.I]: 'A small pearl with a soft glow. It feels warm and safe to touch.',
      [StoneTier.II]: 'A polished pearl that shines brightly. Light seems to emanate from within.',
      [StoneTier.III]: 'A brilliant pearl that creates its own light. Darkness cannot touch it.',
      [StoneTier.IV]: 'A masterwork pearl that shines like the sun. It banishes all shadows.',
      [StoneTier.V]: 'A legendary pearl that IS light. It contains the essence of pure illumination.',
    },
    fusionEffect: 'Strengthens light abilities and increases defense. Pets fused with Pearl are protected by divine light.',
    domainEffect: 'The Domain of Light: All allies gain damage reduction. Light abilities purify and protect.',
    originStory: 'Pearls are the first rays of light that pierced the Grid\'s darkness. Each one is a promise of dawn.',
  },
  [StoneType.ONYX]: {
    type: StoneType.ONYX,
    name: 'Onyx',
    baseDescription: 'A pitch-black gemstone that absorbs all light. It represents earth and unbreakable defense.',
    tierDescriptions: {
      [StoneTier.I]: 'A small onyx that feels heavy. It seems to pull light into itself.',
      [StoneTier.II]: 'A polished onyx with a matte finish. It feels like holding a piece of the earth itself.',
      [StoneTier.III]: 'A brilliant onyx that weighs more than it should. The ground trembles near it.',
      [StoneTier.IV]: 'A masterwork onyx that creates gravitational anomalies. Light bends around it.',
      [StoneTier.V]: 'A legendary onyx that IS gravity. It holds the weight of mountains within its depths.',
    },
    fusionEffect: 'Boosts earth abilities and massively increases defense. Pets fused with Onyx become unbreakable fortresses.',
    domainEffect: 'The Domain of Stone: Defense is tripled. Earth abilities create protective barriers and stun enemies.',
    originStory: 'Onyxes are compressed mountain cores, forged under impossible pressure. Each one holds the strength of the earth itself.',
  },
  [StoneType.OPAL]: {
    type: StoneType.OPAL,
    name: 'Opal',
    baseDescription: 'A multicolored crystal that shifts between all elements. It represents balance and harmony.',
    tierDescriptions: {
      [StoneTier.I]: 'A small opal with faint colors. It shifts between hues slowly.',
      [StoneTier.II]: 'A polished opal that shimmers with many colors. It seems to contain all elements.',
      [StoneTier.III]: 'A brilliant opal that shifts rapidly. You can see all elements dancing within.',
      [StoneTier.IV]: 'A masterwork opal that IS all elements. It perfectly balances fire, water, earth, and air.',
      [StoneTier.V]: 'A legendary opal that transcends elements. It represents the unity of all things in perfect harmony.',
    },
    fusionEffect: 'Enhances all abilities equally and provides balanced stat boosts. Pets fused with Opal master all elements.',
    domainEffect: 'The Domain of Balance: All elemental abilities are enhanced. The battlefield enters perfect harmony.',
    originStory: 'Opals are fragments of the Grid\'s creation moment, when all elements first danced together in perfect unity.',
  },
};

/**
 * Get lore for a specific stone
 */
export function getStoneLore(type: StoneType): StoneLore {
  return STONE_LORE[type];
}

/**
 * Get tier-specific description
 */
export function getStoneTierDescription(type: StoneType, tier: StoneTier): string {
  return STONE_LORE[type].tierDescriptions[tier];
}


















