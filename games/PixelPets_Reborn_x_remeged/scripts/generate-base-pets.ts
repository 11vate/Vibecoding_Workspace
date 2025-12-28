/**
 * Generate 150 Unique Base Pets
 * Procedural generation with unique names, lore, stats, and abilities
 */

import { generatePetName } from '../src/domain/content/PetNameGenerator';
import { generatePetLore } from '../src/domain/content/PetLoreGenerator';
import type { PetFamily } from '../src/shared/types/family';
import type { Rarity } from '../src/shared/types/rarity';
import type { BasePet } from '../src/domain/entities/Pet';

const FAMILIES: PetFamily[] = [
  'PYRO_KIN',
  'AQUA_BORN',
  'TERRA_FORGED',
  'VOLT_STREAM',
  'SHADOW_VEIL',
  'LUMINA',
  'STEEL_WORKS',
  'ARCANE_RIFT',
  'AERO_FLIGHT',
  'WEIRDOS'
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
 * Generate stats based on rarity
 */
function generateStatsForRarity(rarity: Rarity, seed: number): BasePet['baseStats'] {
  const rng = createSeededRNG(seed);

  // Base stats by rarity
  const baseRanges: Record<Rarity, { min: number; max: number }> = {
    1: { min: 40, max: 60 },   // Common
    2: { min: 60, max: 85 },   // Rare
    3: { min: 85, max: 115 },  // Super Rare
    4: { min: 115, max: 150 }, // Legendary
    5: { min: 150, max: 200 }  // Mythic
  };

  const range = baseRanges[rarity];

  // Generate stats with some variance
  const hp = Math.floor(range.min + rng() * (range.max - range.min)) * 2; // HP is 2x
  const attack = Math.floor(range.min + rng() * (range.max - range.min));
  const defense = Math.floor(range.min + rng() * (range.max - range.min));
  const speed = Math.floor(range.min + rng() * (range.max - range.min));

  return { hp, attack, defense, speed };
}

/**
 * Get ability count by rarity
 */
function getAbilityCount(rarity: Rarity): { active: number; passive: number } {
  const counts: Record<Rarity, { active: number; passive: number }> = {
    1: { active: 2, passive: 0 }, // Common: 2 active
    2: { active: 2, passive: 1 }, // Rare: 2 active, 1 passive
    3: { active: 3, passive: 1 }, // Super Rare: 3 active, 1 passive
    4: { active: 3, passive: 2 }, // Legendary: 3 active, 2 passive
    5: { active: 4, passive: 2 }  // Mythic: 4 active, 2 passive
  };

  return counts[rarity];
}

/**
 * Generate placeholder ability IDs (would need actual ability library)
 */
function generateAbilityIds(family: PetFamily, rarity: Rarity, seed: number): {
  starterAbilities: string[];
  starterPassives: string[];
} {
  const rng = createSeededRNG(seed);
  const counts = getAbilityCount(rarity);

  // Placeholder: Generate ability IDs based on family
  const familyPrefix = family.toLowerCase().replace('_', '-');

  const starterAbilities: string[] = [];
  for (let i = 0; i < counts.active; i++) {
    starterAbilities.push(`${familyPrefix}-ability-${Math.floor(rng() * 1000)}`);
  }

  const starterPassives: string[] = [];
  for (let i = 0; i < counts.passive; i++) {
    starterPassives.push(`${familyPrefix}-passive-${Math.floor(rng() * 1000)}`);
  }

  return { starterAbilities, starterPassives };
}

/**
 * Generate visual tags based on family and rarity
 */
function generateVisualTags(family: PetFamily, rarity: Rarity, seed: number): string[] {
  const rng = createSeededRNG(seed);
  const tags: string[] = [family.toLowerCase()];

  // Rarity-based tags
  if (rarity >= 4) tags.push('glowing');
  if (rarity === 5) tags.push('legendary', 'radiant');

  // Family-specific visual features
  const familyFeatures: Record<PetFamily, string[]> = {
    PYRO_KIN: ['flames', 'embers', 'burning'],
    AQUA_BORN: ['aquatic', 'flowing', 'crystalline'],
    TERRA_FORGED: ['rocky', 'armored', 'crystalline'],
    VOLT_STREAM: ['electric', 'charged', 'sparking'],
    SHADOW_VEIL: ['shadowy', 'ethereal', 'dark'],
    LUMINA: ['bright', 'radiant', 'shimmering'],
    STEEL_WORKS: ['metallic', 'mechanical', 'plated'],
    ARCANE_RIFT: ['mystical', 'ethereal', 'arcane'],
    AERO_FLIGHT: ['winged', 'feathered', 'aerial'],
    WEIRDOS: ['glitched', 'chaotic', 'unstable']
  };

  // Add 1-2 family features
  const features = familyFeatures[family];
  const featureCount = rarity >= 3 ? 2 : 1;
  for (let i = 0; i < featureCount && i < features.length; i++) {
    tags.push(features[Math.floor(rng() * features.length)]);
  }

  return Array.from(new Set(tags)); // Remove duplicates
}

/**
 * Generate a single base pet
 */
function generateBasePet(family: PetFamily, rarity: Rarity, index: number, baseSeed: number): BasePet {
  const seed = baseSeed + index;
  const name = generatePetName(family, seed);
  const lore = generatePetLore(name, family, rarity, seed + 10000);
  const baseStats = generateStatsForRarity(rarity, seed + 20000);
  const abilities = generateAbilityIds(family, rarity, seed + 30000);
  const visualTags = generateVisualTags(family, rarity, seed + 40000);

  return {
    id: `base-pet-${family}-${rarity}-${index}` as any, // Would use proper BasePetId
    name,
    family,
    rarity,
    baseStats,
    starterAbilities: abilities.starterAbilities,
    starterPassives: abilities.starterPassives,
    visualTags,
    lore
  };
}

/**
 * Generate all 150 base pets
 */
function generateAllBasePets(): BasePet[] {
  const basePets: BasePet[] = [];
  let baseSeed = 50000;

  // Distribution per family (15 pets each):
  // - 5 Common (Rarity 1)
  // - 4 Rare (Rarity 2)
  // - 3 Super Rare (Rarity 3)
  // - 2 Legendary (Rarity 4)
  // - 1 Mythic (Rarity 5)

  const distribution: Record<Rarity, number> = {
    1: 5,
    2: 4,
    3: 3,
    4: 2,
    5: 1
  };

  for (const family of FAMILIES) {
    console.log(`\nGenerating ${family} pets...`);

    for (let rarity = 1; rarity <= 5; rarity++) {
      const count = distribution[rarity as Rarity];

      for (let i = 0; i < count; i++) {
        const pet = generateBasePet(family, rarity as Rarity, basePets.length, baseSeed);
        basePets.push(pet);
        console.log(`  ✓ ${pet.name} (Rarity ${rarity})`);
      }
    }
  }

  return basePets;
}

/**
 * Save pets to JSON file
 */
function savePetsToJSON(pets: BasePet[]) {
  const fs = require('fs');
  const path = require('path');

  const outputDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'base-pets.json');
  fs.writeFileSync(outputPath, JSON.stringify(pets, null, 2));

  console.log(`\n✅ Saved ${pets.length} base pets to ${outputPath}`);
}

/**
 * Generate statistics
 */
function generateStatistics(pets: BasePet[]) {
  console.log('\n' + '='.repeat(60));
  console.log('BASE PET GENERATION STATISTICS');
  console.log('='.repeat(60));

  console.log(`\nTotal Pets: ${pets.length}`);

  // By family
  console.log('\nBy Family:');
  FAMILIES.forEach(family => {
    const count = pets.filter(p => p.family === family).length;
    console.log(`  ${family}: ${count}`);
  });

  // By rarity
  console.log('\nBy Rarity:');
  for (let rarity = 1; rarity <= 5; rarity++) {
    const count = pets.filter(p => p.rarity === rarity).length;
    const rarityNames = ['Common', 'Rare', 'Super Rare', 'Legendary', 'Mythic'];
    console.log(`  ${rarityNames[rarity - 1]}: ${count}`);
  }

  // Average stats by rarity
  console.log('\nAverage Stats by Rarity:');
  for (let rarity = 1; rarity <= 5; rarity++) {
    const petsOfRarity = pets.filter(p => p.rarity === rarity);
    if (petsOfRarity.length === 0) continue;

    const avgHp = Math.floor(petsOfRarity.reduce((sum, p) => sum + p.baseStats.hp, 0) / petsOfRarity.length);
    const avgAtk = Math.floor(petsOfRarity.reduce((sum, p) => sum + p.baseStats.attack, 0) / petsOfRarity.length);
    const avgDef = Math.floor(petsOfRarity.reduce((sum, p) => sum + p.baseStats.defense, 0) / petsOfRarity.length);
    const avgSpd = Math.floor(petsOfRarity.reduce((sum, p) => sum + p.baseStats.speed, 0) / petsOfRarity.length);

    const rarityNames = ['Common', 'Rare', 'Super Rare', 'Legendary', 'Mythic'];
    console.log(`  ${rarityNames[rarity - 1]}: HP ${avgHp}, ATK ${avgAtk}, DEF ${avgDef}, SPD ${avgSpd}`);
  }

  console.log('\n' + '='.repeat(60));
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('   PIXEL PETS - BASE PET GENERATION');
  console.log('   Procedural Generation: Names, Lore, Stats, Abilities');
  console.log('='.repeat(60));

  const startTime = Date.now();

  // Generate all pets
  const basePets = generateAllBasePets();

  // Save to JSON
  savePetsToJSON(basePets);

  // Generate statistics
  generateStatistics(basePets);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Generation complete in ${duration}s`);
}

main().catch(console.error);
