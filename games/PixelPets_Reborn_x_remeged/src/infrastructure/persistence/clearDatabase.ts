/**
 * Database Clearing Utility
 * Clears all data from IndexedDB for fresh initialization
 *
 * Authority Tier: 2 (Mandatory Process for data migration)
 * Use Case: Reset database when seed data structure changes
 */

import { openDatabase, DB_NAME } from './schema';
import { deleteDB } from 'idb';

/**
 * Clear all data from all stores in the database
 * Preserves database structure, only clears data
 */
export async function clearAllStores(): Promise<void> {
  console.log('[clearDatabase] Clearing all data from stores...');

  try {
    const db = await openDatabase();

    const storeNames = [
      'pets',
      'stones',
      'basePets',
      'abilities',
      'sprites',
      'playerData',
      'leaderboard',
      'fusionHistory',
      'battles',
      'dungeons',
      'pvpMatches',
      'pvpRankings',
      'blackMarketReputations'
    ] as const;

    const tx = db.transaction([...storeNames], 'readwrite');

    await Promise.all([
      ...storeNames.map(storeName => {
        const store = tx.objectStore(storeName);
        return store.clear();
      }),
      tx.done
    ]);

    db.close();

    console.log('[clearDatabase] ✓ All stores cleared successfully');
  } catch (error) {
    console.error('[clearDatabase] Error clearing stores:', error);
    throw error;
  }
}

/**
 * Completely delete the database
 * This will remove the database entirely and require full re-initialization
 */
export async function deleteDatabase(): Promise<void> {
  console.log(`[clearDatabase] Deleting database: ${DB_NAME}`);

  try {
    await deleteDB(DB_NAME);
    console.log('[clearDatabase] ✓ Database deleted successfully');
    console.log('[clearDatabase] Page reload required for re-initialization');
  } catch (error) {
    console.error('[clearDatabase] Error deleting database:', error);
    throw error;
  }
}

/**
 * Reset database for fresh seed data
 * Deletes database and reloads page to trigger re-initialization
 */
export async function resetDatabaseForMigration(): Promise<void> {
  console.log('[clearDatabase] Starting database migration reset...');

  try {
    await deleteDatabase();

    // Store flag in localStorage to indicate migration in progress
    localStorage.setItem('db_migration_reset', 'true');
    localStorage.setItem('db_migration_timestamp', Date.now().toString());

    console.log('[clearDatabase] ✓ Migration reset complete');
    console.log('[clearDatabase] Reloading page...');

    // Reload page to trigger fresh database initialization
    window.location.reload();
  } catch (error) {
    console.error('[clearDatabase] Migration reset failed:', error);
    throw error;
  }
}

/**
 * Check if database needs migration reset
 * Call this on app startup to detect if migration was initiated
 */
export function checkMigrationStatus(): {
  needsReset: boolean;
  timestamp: number | null;
} {
  const resetFlag = localStorage.getItem('db_migration_reset');
  const timestamp = localStorage.getItem('db_migration_timestamp');

  if (resetFlag === 'true' && timestamp) {
    // Clear flags after checking
    localStorage.removeItem('db_migration_reset');
    localStorage.removeItem('db_migration_timestamp');

    return {
      needsReset: true,
      timestamp: parseInt(timestamp, 10)
    };
  }

  return {
    needsReset: false,
    timestamp: null
  };
}

/**
 * Get database statistics
 * Useful for debugging and verification
 */
export async function getDatabaseStats(): Promise<Record<string, number>> {
  const db = await openDatabase();

  const stats: Record<string, number> = {
    pets: await db.count('pets'),
    stones: await db.count('stones'),
    basePets: await db.count('basePets'),
    abilities: await db.count('abilities'),
    sprites: await db.count('sprites'),
    playerData: await db.count('playerData'),
    leaderboard: await db.count('leaderboard'),
    fusionHistory: await db.count('fusionHistory'),
    battles: await db.count('battles'),
    dungeons: await db.count('dungeons'),
    pvpMatches: await db.count('pvpMatches'),
    pvpRankings: await db.count('pvpRankings')
  };

  db.close();

  return stats;
}

/**
 * Verify database is properly cleared
 */
export async function verifyDatabaseCleared(): Promise<boolean> {
  const stats = await getDatabaseStats();
  const totalRecords = Object.values(stats).reduce((sum, count) => sum + count, 0);

  if (totalRecords === 0) {
    console.log('[clearDatabase] ✓ Database verified as empty');
    return true;
  } else {
    console.warn('[clearDatabase] ⚠ Database still contains data:', stats);
    return false;
  }
}
