/**
 * Starter Seed Data
 * Defines starter pets, stones, and initial player currency
 */

import { ALL_BASE_PETS } from './basePets';
import { ALL_REMAINING_PETS } from './basePetsRemaining';

/**
 * Starter Pet Options - One basic pet from each family for player to choose
 * Player can select one of these 10 pets to start their journey
 */
export const STARTER_PETS = [
  // Family 1: PYRO_KIN - Emberling (Basic)
  ALL_BASE_PETS.find(p => p.name === 'Emberling'),
  
  // Family 2: AQUA_BORN - Droplet (Basic)
  ALL_BASE_PETS.find(p => p.name === 'Droplet'),
  
  // Family 3: TERRA_FORGED - Pebble (Basic)
  ALL_BASE_PETS.find(p => p.name === 'Pebble'),
  
  // Family 4: VOLT_STREAM - Staticpaw (Basic)
  ALL_BASE_PETS.find(p => p.name === 'Staticpaw'),
  
  // Family 5: SHADOW_VEIL - Shadowing (Basic)
  ALL_BASE_PETS.find(p => p.name === 'Shadowing'),
  
  // Family 6: AERO_FLIGHT - Windpuff (Basic)
  ALL_REMAINING_PETS.find(p => p.name === 'Windpuff'),
  
  // Family 7: ARCANE_RIFT - Spellling (Basic)
  ALL_REMAINING_PETS.find(p => p.name === 'Spellling'),
  
  // Family 8: AETHER_TOUCH - Lightling (Basic)
  ALL_REMAINING_PETS.find(p => p.name === 'Lightling'),
  
  // Family 9: WEIRDOS - Oddling (Basic)
  ALL_REMAINING_PETS.find(p => p.name === 'Oddling'),
  
  // Family 10: PRIMAL_BOND - Sprout (Basic)
  ALL_REMAINING_PETS.find(p => p.name === 'Sprout'),
].filter(Boolean); // Remove any undefined entries

/**
 * Starter Stones - Mix of types and tiers for beginner learning
 */
export const STARTER_STONES = [
  // One of each stone type at Tier I
  {
    id: 'starter-ember-t1',
    name: 'Ember Stone',
    type: 'Fire',
    tier: 1,
    color: '#FF4400',
    description: 'A small stone that crackles with warm fire energy.',
    fusionEffect: 'Increases fire damage by 10%',
    rarity: 'Common',
  },
  {
    id: 'starter-wave-t1',
    name: 'Wave Stone',
    type: 'Water',
    tier: 1,
    color: '#0088FF',
    description: 'A smooth stone that flows with water energy.',
    fusionEffect: 'Increases water damage by 10%',
    rarity: 'Common',
  },
  {
    id: 'starter-earth-t1',
    name: 'Earth Stone',
    type: 'Earth',
    tier: 1,
    color: '#8B6F47',
    description: 'A sturdy stone that grounds with earth energy.',
    fusionEffect: 'Increases earth damage by 10%',
    rarity: 'Common',
  },
  {
    id: 'starter-bolt-t1',
    name: 'Bolt Stone',
    type: 'Lightning',
    tier: 1,
    color: '#FFD700',
    description: 'A crackling stone that sparks with lightning energy.',
    fusionEffect: 'Increases lightning damage by 10%',
    rarity: 'Common',
  },
  {
    id: 'starter-shadow-t1',
    name: 'Shadow Stone',
    type: 'Shadow',
    tier: 1,
    color: '#6600AA',
    description: 'A dark stone that pulses with shadow energy.',
    fusionEffect: 'Increases shadow damage by 10%',
    rarity: 'Common',
  },
  {
    id: 'starter-wind-t1',
    name: 'Wind Stone',
    type: 'Air',
    tier: 1,
    color: '#87CEEB',
    description: 'A light stone that swirls with air energy.',
    fusionEffect: 'Increases air damage by 10%',
    rarity: 'Common',
  },
  {
    id: 'starter-magic-t1',
    name: 'Magic Stone',
    type: 'Magic',
    tier: 1,
    color: '#9370DB',
    description: 'A mysterious stone that glows with magical energy.',
    fusionEffect: 'Increases magic damage by 10%',
    rarity: 'Common',
  },
  {
    id: 'starter-light-t1',
    name: 'Light Stone',
    type: 'Light',
    tier: 1,
    color: '#FFFF99',
    description: 'A bright stone that shines with light energy.',
    fusionEffect: 'Increases light damage by 10%',
    rarity: 'Common',
  },
];

/**
 * Starting Currency
 */
export const STARTER_CURRENCY = {
  dataKeys: 100, // Starting currency for summoning/fusion
  corruptedBytes: 0, // No black market access yet
};

/**
 * Starter inventory configuration
 */
export const STARTER_CONFIG = {
  petSlots: 3, // Can carry 3 pets initially
  stoneSlots: 10, // Can carry 10 stones initially
  teamSlots: 1, // Can use 1 pet in battle initially (unlock more through progression)
};
