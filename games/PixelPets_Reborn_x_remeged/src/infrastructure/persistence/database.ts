/**
 * Database connection manager
 */

import { openDatabase, DB_NAME } from './schema';

let dbInstance: Awaited<ReturnType<typeof openDatabase>> | null = null;

export async function getDatabase() {
  if (!dbInstance) {
    try {
      console.log('[DB] Opening database...');
      dbInstance = await openDatabase();
      console.log('[DB] Database opened, version:', dbInstance.version);
    } catch (error) {
      console.error('[DB] Failed to open database:', error);
      throw error;
    }
  }
  return dbInstance;
}

export async function resetDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
  const deleteReq = indexedDB.deleteDatabase(DB_NAME);
  return new Promise<void>((resolve, reject) => {
    deleteReq.onsuccess = () => resolve();
    deleteReq.onerror = () => reject(deleteReq.error);
  });
}





