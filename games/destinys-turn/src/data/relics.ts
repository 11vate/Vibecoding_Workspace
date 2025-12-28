import type { Relic } from '../types';

export const RELIC_REGISTRY: Record<string, Relic> = {
  'tide-caller': {
    id: 'tide-caller',
    name: 'Tide Caller',
    description: 'Floods the target tile and its neighbors.',
    effectId: 'FLOOD_AREA',
    rarity: 'COMMON',
    icon: '🌊',
  },
  'ember-stone': {
    id: 'ember-stone',
    name: 'Ember Stone',
    description: 'Sets the target tile on fire.',
    effectId: 'IGNITE_TILE',
    rarity: 'COMMON',
    icon: '🔥',
  },
  'void-anchor': {
    id: 'void-anchor',
    name: 'Void Anchor',
    description: 'Locks a tile, preventing it from changing themes.',
    effectId: 'LOCK_TILE',
    rarity: 'RARE',
    icon: '⚓',
  },
  'stone-wall': {
    id: 'stone-wall',
    name: 'Stone Wall',
    description: 'Creates an obstacle that blocks movement.',
    effectId: 'CREATE_OBSTACLE',
    rarity: 'COMMON',
    icon: '🧱',
  },
};
