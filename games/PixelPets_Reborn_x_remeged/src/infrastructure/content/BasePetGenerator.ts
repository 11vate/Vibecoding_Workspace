/**
 * Base Pet Generator
 * Generates base pet templates procedurally
 */

import { BasePet } from '@/domain/entities/BasePet';
import { brandBasePetId } from '@/shared/types/brands';
import type { PetFamily } from '@/shared/types/family';
import { Rarity } from '@/shared/types/rarity';
import { RARITY_CONFIG } from '@/shared/types/rarity';
import { FAMILY_CONFIGS } from '@/shared/types/family';

/**
 * Generate random stats for a base pet based on rarity
 */
function generateRandomStats(rarity: Rarity): { hp: number; attack: number; defense: number; speed: number } {
  const config = RARITY_CONFIG[rarity];
  
  const hp = Math.floor(
    config.hpRange[0] + Math.random() * (config.hpRange[1] - config.hpRange[0])
  );
  const attack = Math.floor(
    config.attackRange[0] + Math.random() * (config.attackRange[1] - config.attackRange[0])
  );
  const defense = Math.floor(
    config.defenseRange[0] + Math.random() * (config.defenseRange[1] - config.defenseRange[0])
  );
  const speed = Math.floor(
    config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])
  );

  return { hp, attack, defense, speed };
}

/**
 * Generate a pet name based on family
 */
function generatePetName(family: PetFamily, rarity: Rarity, index: number): string {
  const familyConfig = FAMILY_CONFIGS[family];
  const themes = familyConfig.themes;
  const theme = themes[index % themes.length];
  
  const rarityNames = ['', 'Elite', 'Master', 'Prime', 'Ancient'];
  const rarityPrefix = rarity > Rarity.BASIC && rarity <= Rarity.MYTHIC ? rarityNames[rarity] + ' ' : '';
  
  const suffixes = ['Guardian', 'Spirit', 'Beast', 'Walker', 'Warden', 'Caller'];
  const suffix = suffixes[index % suffixes.length];
  
  return `${rarityPrefix}${theme} ${suffix}`;
}

/**
 * Generate visual tags based on family and rarity
 */
function generateVisualTags(family: PetFamily, rarity: Rarity): string[] {
  const familyConfig = FAMILY_CONFIGS[family];
  const tags: string[] = [];
  
  // Family-based tags
  tags.push(family.toLowerCase());
  tags.push(...familyConfig.themes.slice(0, 2).map(t => t.toLowerCase()));
  
  // Rarity-based tags
  if (rarity >= Rarity.LEGENDARY) {
    tags.push('glowing', 'ethereal');
  }
  if (rarity >= Rarity.MYTHIC) {
    tags.push('legendary', 'shimmer');
  }
  
  // Random visual elements
  const visualElements = ['spikes', 'wings', 'horns', 'tail', 'aura', 'crown'];
  tags.push(visualElements[Math.floor(Math.random() * visualElements.length)]);
  
  return tags;
}

/**
 * Generate lore for a base pet
 */
function generateLore(name: string, family: PetFamily, rarity: Rarity): string {
  const familyConfig = FAMILY_CONFIGS[family];
  const rarityName = RARITY_CONFIG[rarity].name;
  
  const loreTemplates = [
    `${name} is a ${rarityName.toLowerCase()} ${familyConfig.name.toLowerCase()} creature, born from the ${familyConfig.description.toLowerCase()}.`,
    `The ${rarityName.toLowerCase()} ${name} embodies the essence of ${familyConfig.name.toLowerCase()}, ${familyConfig.description.toLowerCase()}.`,
    `Legends speak of ${name}, a ${rarityName.toLowerCase()} being of ${familyConfig.name.toLowerCase()} origin.`,
  ];
  
  return loreTemplates[Math.floor(Math.random() * loreTemplates.length)];
}


/**
 * Generate a single base pet
 */
export function generateBasePet(
  family: PetFamily,
  rarity: Rarity,
  index: number,
  abilities: { activeIds: string[]; passiveIds: string[] }
): BasePet {
  const id = brandBasePetId(`${family.toLowerCase()}_${rarity}_${index}`);
  const stats = generateRandomStats(rarity);
  const name = generatePetName(family, rarity, index);
  const visualTags = generateVisualTags(family, rarity);
  const lore = generateLore(name, family, rarity);
  
  return {
    id,
    name,
    family,
    rarity,
    baseStats: stats,
    starterAbilities: abilities.activeIds,
    starterPassives: abilities.passiveIds,
    visualTags,
    lore
  };
}


