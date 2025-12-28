/**
 * Database Initialization Hook
 * Initializes the database on app start if needed
 * Also checks if player needs starter setup
 */

import { useEffect, useState } from 'react';
import { seedDatabase, needsSeeding } from '@/infrastructure/content/SeedService';
import { PlayerRepository } from '@/infrastructure/persistence/repositories/PlayerRepository';

export interface DatabaseInitState {
  isInitializing: boolean;
  isInitialized: boolean;
  needsPlayerSetup: boolean;
  error: string | null;
}

export function useDatabaseInit(): DatabaseInitState {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [needsPlayerSetup, setNeedsPlayerSetup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initDatabase() {
      try {
        setIsInitializing(true);
        setError(null);

        const needsSeed = await needsSeeding();
        if (needsSeed) {
          console.log('[useDatabaseInit] Database needs seeding, initializing...');
          await seedDatabase();
          if (isMounted) {
            setIsInitialized(true);
          }
        } else {
          console.log('[useDatabaseInit] Database already initialized');
          if (isMounted) {
            setIsInitialized(true);
          }
        }

        // Check if current player needs setup (first login)
        try {
          const playerRepo = new PlayerRepository();
          const players = await playerRepo.findAll();
          
          if (!players || players.length === 0) {
            console.log('[useDatabaseInit] No players found, showing starter setup');
            if (isMounted) {
              setNeedsPlayerSetup(true);
            }
          }
        } catch (err) {
          console.warn('[useDatabaseInit] Could not check player status:', err);
          // Default to showing starter setup if we can't check
          if (isMounted) {
            setNeedsPlayerSetup(true);
          }
        }
      } catch (err) {
        console.error('[useDatabaseInit] Error initializing database:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize database');
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    initDatabase();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isInitializing, isInitialized, needsPlayerSetup, error };
}









