/**
 * Database Seed Initializer
 * Populates the database with all base pets and abilities on first run
 */

import { getDatabase } from './database';
import { ALL_BASE_PETS, BASE_PET_COUNT } from './seedData/basePets';
import { ALL_REMAINING_PETS, REMAINING_PET_COUNT } from './seedData/basePetsRemaining';
import { ALL_PASSIVE_ABILITIES, PASSIVE_ABILITY_COUNT } from './seedData/abilities';

/**
 * Seeds the database with initial data
 * Called on app startup if database is empty
 */
export async function seedDatabase(): Promise<void> {
  try {
    const db = await getDatabase();

    // Check if already seeded
    const existingPets = await db.getAll('basePets');
    if (existingPets && existingPets.length > 0) {
      console.log('Database already seeded. Skipping initialization.');
      return;
    }

    console.log('Seeding database with initial data...');

    // Combine all pets
    const allBasePets = [...ALL_BASE_PETS, ...ALL_REMAINING_PETS];

    // Add all base pets
    for (const pet of allBasePets) {
      await db.add('basePets', {
        ...pet,
        starterAbilities: [...pet.starterAbilities],
        starterPassives: [...pet.starterPassives],
        visualTags: [...pet.visualTags]
      });
    }
    console.log(`✓ Added ${allBasePets.length} base pets (out of ${BASE_PET_COUNT + REMAINING_PET_COUNT} expected)`);

    // Add all abilities
    for (const ability of ALL_PASSIVE_ABILITIES) {
      await db.add('abilities', ability);
    }
    console.log(`✓ Added ${ALL_PASSIVE_ABILITIES.length} passive abilities (out of ${PASSIVE_ABILITY_COUNT} expected)`);

    // Seed default stones
    await seedStones(db);

    console.log('✓ Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

/**
 * Seeds stone data into the database
 */
async function seedStones(db: any): Promise<void> {
  const stones = [
    // Tier 1 - Common
    {
      id: 'stone-ember-t1',
      name: 'Ember Stone',
      type: 'Fire',
      tier: 1,
      color: '#FF4400',
      description: 'A small stone that crackles with warm fire energy.',
      fusionEffect: 'Increases fire damage by 10%',
      rarity: 'Common',
    },
    {
      id: 'stone-wave-t1',
      name: 'Wave Stone',
      type: 'Water',
      tier: 1,
      color: '#0088FF',
      description: 'A smooth stone that flows with water energy.',
      fusionEffect: 'Increases water damage by 10%',
      rarity: 'Common',
    },
    {
      id: 'stone-earth-t1',
      name: 'Earth Stone',
      type: 'Earth',
      tier: 1,
      color: '#8B6F47',
      description: 'A sturdy stone that grounds with earth energy.',
      fusionEffect: 'Increases earth damage by 10%',
      rarity: 'Common',
    },
    {
      id: 'stone-bolt-t1',
      name: 'Bolt Stone',
      type: 'Lightning',
      tier: 1,
      color: '#FFD700',
      description: 'A crackling stone that sparks with lightning energy.',
      fusionEffect: 'Increases lightning damage by 10%',
      rarity: 'Common',
    },
    {
      id: 'stone-shadow-t1',
      name: 'Shadow Stone',
      type: 'Shadow',
      tier: 1,
      color: '#6600AA',
      description: 'A dark stone that pulses with shadow energy.',
      fusionEffect: 'Increases shadow damage by 10%',
      rarity: 'Common',
    },
    {
      id: 'stone-wind-t1',
      name: 'Wind Stone',
      type: 'Air',
      tier: 1,
      color: '#87CEEB',
      description: 'A light stone that swirls with air energy.',
      fusionEffect: 'Increases air damage by 10%',
      rarity: 'Common',
    },
    {
      id: 'stone-magic-t1',
      name: 'Magic Stone',
      type: 'Magic',
      tier: 1,
      color: '#9370DB',
      description: 'A mysterious stone that glows with magical energy.',
      fusionEffect: 'Increases magic damage by 10%',
      rarity: 'Common',
    },
    {
      id: 'stone-light-t1',
      name: 'Light Stone',
      type: 'Light',
      tier: 1,
      color: '#FFFF99',
      description: 'A bright stone that shines with light energy.',
      fusionEffect: 'Increases light damage by 10%',
      rarity: 'Common',
    },

    // Tier 2 - Uncommon
    {
      id: 'stone-ember-t2',
      name: 'Inferno Stone',
      type: 'Fire',
      tier: 2,
      color: '#FF8800',
      description: 'A hotter stone that burns with greater fire intensity.',
      fusionEffect: 'Increases fire damage by 20%',
      rarity: 'Uncommon',
    },
    {
      id: 'stone-wave-t2',
      name: 'Tidal Stone',
      type: 'Water',
      tier: 2,
      color: '#00CCFF',
      description: 'A flowing stone that channels water with greater power.',
      fusionEffect: 'Increases water damage by 20%',
      rarity: 'Uncommon',
    },
    {
      id: 'stone-earth-t2',
      name: 'Mountain Stone',
      type: 'Earth',
      tier: 2,
      color: '#A0826D',
      description: 'A solid stone that anchors with earth strength.',
      fusionEffect: 'Increases earth damage by 20%',
      rarity: 'Uncommon',
    },
    {
      id: 'stone-bolt-t2',
      name: 'Storm Stone',
      type: 'Lightning',
      tier: 2,
      color: '#FFFF44',
      description: 'A charged stone that crackles with storm power.',
      fusionEffect: 'Increases lightning damage by 20%',
      rarity: 'Uncommon',
    },

    // Tier 3 - Rare
    {
      id: 'stone-ember-t3',
      name: 'Phoenix Stone',
      type: 'Fire',
      tier: 3,
      color: '#FF6600',
      description: 'A rare stone that holds the essence of rebirth through fire.',
      fusionEffect: 'Increases fire damage by 30% and grants revival once per battle',
      rarity: 'Rare',
    },
    {
      id: 'stone-wave-t3',
      name: 'Leviathan Stone',
      type: 'Water',
      tier: 3,
      color: '#0066FF',
      description: 'A rare stone that channels the power of the deep.',
      fusionEffect: 'Increases water damage by 30% and grants water healing',
      rarity: 'Rare',
    },

    // Tier 4 - Epic (Chaos Stones)
    {
      id: 'stone-chaos',
      name: 'Chaos Stone',
      type: 'Chaos',
      tier: 4,
      color: '#FF00FF',
      description: 'An unpredictable stone that defies normal rules. Using this stone with another creates a Glitched pet with rule-breaking abilities.',
      fusionEffect: 'Triggers glitch mutations (3-7% base, up to 25% with dual stones)',
      rarity: 'Chaos',
      isGlitched: false,
    },
    {
      id: 'stone-glitched-chaos',
      name: 'Glitched Chaos Stone',
      type: 'Chaos',
      tier: 4,
      color: '#FF33FF',
      description: 'An even more unstable chaos stone that guarantees glitch mutations.',
      fusionEffect: 'Always triggers powerful glitch mutations (25%+ guaranteed)',
      rarity: 'Glitched',
      isGlitched: true,
    },
  ];

  for (const stone of stones) {
    await db.add('stones', stone);
  }

  console.log(`✓ Added ${stones.length} stones`);
}

/**
 * Call this on app initialization
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}
