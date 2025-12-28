/**
 * Starter Pets Seed Data
 * One representative pet from each family for new player setup
 * These 6 pets form the initial squad when a player starts the game
 */

import { createBasePet } from './basePets';

// Select the first pet from each family as starter
export const STARTER_PETS = [
  // PYRO_KIN family
  createBasePet(
    'Emberling',
    'PYRO_KIN',
    'Basic',
    { hp: 525, attack: 47, defense: 37, speed: 62 },
    ['Ember Shot'],
    ['Combustion Core'],
    'A small flame creature born from embers. Its warm glow brings comfort, though its spark can ignite passion in battle.',
    ['flame', 'small', 'warm']
  ),

  // AQUA_BORN family
  createBasePet(
    'Aquamite',
    'AQUA_BORN',
    'Basic',
    { hp: 615, attack: 42, defense: 42, speed: 55 },
    ['Water Splash'],
    ['Aquatic Flow'],
    'A small water elemental with gentle currents. Fluid and adaptable, it finds its way through any obstacle.',
    ['water', 'fluid', 'calm']
  ),

  // TERRA_FORGED family
  createBasePet(
    'Stoneling',
    'TERRA_FORGED',
    'Basic',
    { hp: 675, attack: 45, defense: 52, speed: 38 },
    ['Rock Throw'],
    ['Earth Anchor'],
    'A small rocky creature with deep roots to the earth. Solid and dependable, it provides stable ground for its allies.',
    ['earth', 'sturdy', 'ancient']
  ),

  // VOLT_STREAM family
  createBasePet(
    'Sparklet',
    'VOLT_STREAM',
    'Basic',
    { hp: 525, attack: 50, defense: 35, speed: 70 },
    ['Lightning Bolt'],
    ['Static Surge'],
    'A tiny electric creature crackling with energy. Quick and spirited, it brings excitement wherever it goes.',
    ['lightning', 'swift', 'energetic']
  ),

  // SHADOW_VEIL family
  createBasePet(
    'Shadowlet',
    'SHADOW_VEIL',
    'Basic',
    { hp: 555, attack: 48, defense: 40, speed: 60 },
    ['Shadow Strike'],
    ['Night Vision'],
    'A small shadow creature that moves between light and dark. Mysterious and clever, it sees what others miss.',
    ['shadow', 'mysterious', 'dark']
  ),

  // AERO_FLIGHT family
  createBasePet(
    'Windling',
    'AERO_FLIGHT',
    'Basic',
    { hp: 510, attack: 46, defense: 38, speed: 75 },
    ['Gust'],
    ['Wind Current'],
    'A small airborne creature riding on gentle breezes. Light and graceful, it brings a sense of freedom to the team.',
    ['air', 'light', 'swift']
  ),
];

/**
 * Export as constant array for use in seeding
 */
export const ALL_STARTER_PETS = STARTER_PETS;

export default STARTER_PETS;
