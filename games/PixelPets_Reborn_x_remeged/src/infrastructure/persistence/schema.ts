/**
 * IndexedDB Schema
 * Defines the database structure for the game
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { PetFamily } from '@/shared/types/family';
import type { Rarity } from '@/shared/types/rarity';
import type { StoneType, StoneTier } from '@/domain/entities/Stone';

/**
 * Database schema
 */
export interface PixelPetsDB extends DBSchema {
  pets: {
    key: string;
    value: PetDTO;
    indexes: { 'by-family': PetFamily; 'by-rarity': Rarity; 'by-player': string };
  };
  stones: {
    key: string;
    value: StoneDTO;
    indexes: { 'by-type': StoneType; 'by-tier': StoneTier; 'by-player': string };
  };
  basePets: {
    key: string;
    value: BasePetDTO;
  };
  abilities: {
    key: string;
    value: AbilityDTO;
  };
  sprites: {
    key: string;
    value: SpriteDTO;
  };
  playerData: {
    key: string;
    value: PlayerDataDTO;
  };
  leaderboard: {
    key: string;
    value: LeaderboardEntryDTO;
    indexes: { 'by-rating': number; 'by-rank': number };
  };
  fusionHistory: {
    key: string;
    value: FusionHistoryDTO;
  };
  dungeons: {
    key: string;
    value: DungeonDTO;
    indexes: { 'by-floor': number; 'by-tier': number };
  };
  // @ts-expect-error - idb DBSchema type checking limitation with unknown types in BattleDTO
  battles: {
    key: string;
    value: BattleDTO;
    indexes: { 'by-complete': boolean; 'by-created': number };
  };
  pvpMatches: {
    key: string;
    value: PvPMatchDTO;
    indexes: { 'by-status': string; 'by-player1': string; 'by-player2': string };
  };
  pvpRankings: {
    key: string;
    value: PvPRankingDTO;
    indexes: { 'by-division': string; 'by-trophies': number };
  };
  blackMarketReputations: {
    key: string;
    value: BlackMarketReputationDTO;
  };
}

/**
 * Data Transfer Objects for IndexedDB storage
 */
export interface PetDTO {
  id: string;
  playerId: string;
  basePetId: string | null;
  name: string;
  nickname: string | null;
  family: PetFamily;
  rarity: Rarity;
  stats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  passiveAbilities: AbilityDTO[];
  activeAbilities: AbilityDTO[];
  ultimateAbility: AbilityDTO | null;
  fusionHistory: FusionHistoryEntryDTO[];
  appearance: PetAppearanceDTO;
  battleStats: BattleStatsDTO | null;
  collectionDate: number;
  lore: string;
}

export interface BasePetDTO {
  id: string;
  name: string;
  family: PetFamily;
  rarity: Rarity;
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  starterAbilities: string[];
  starterPassives: string[];
  visualTags: string[];
  lore: string;
}

export interface StoneDTO {
  id: string;
  playerId: string;
  type: StoneType;
  tier: StoneTier;
  statBonuses: {
    hp?: number;
    attack?: number;
    defense?: number;
    speed?: number;
  };
  elementalPower: number;
  isGlitched: boolean;
  obtainedAt: number;
}

export interface AbilityDTO {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active' | 'ultimate';
  energyCost: number | null;
  cooldown: number | null;
  currentCooldown: number | null;
  effects: AbilityEffectDTO[];
  tags: string[];
  element: string | null;
}

export interface AbilityEffectDTO {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'status' | 'special';
  target: string;
  value: number;
  element?: string;
  statusChance?: number;
  statusType?: string;
  statusDuration?: number;
  lifesteal?: number;
  scaling?: 'attack' | 'defense' | 'hp' | 'speed';
}

export interface FusionHistoryEntryDTO {
  generation: number;
  parentIds: [string, string];
  parentFamilies: [PetFamily, PetFamily];
  stonesUsed: [string, string];
  fusionSeed: string;
  mutationCount: number;
  timestamp: number;
}

export interface PetAppearanceDTO {
  baseSprite?: string;
  colorMutation?: { r: number; g: number; b: number };
  glowColor?: string;
  particleEffect?: string;
  visualTags: string[];
  visualGenome?: {
    baseForm: string;
    bodyParts: {
      head: string;
      torso: string;
      limbs: string;
      tail?: string;
      wings?: string;
      armor?: string;
    };
    elementAffinity: string[];
    rarity: number;
    mutationTraits: string[];
    paletteSeed: string;
    animationProfile: string;
    sizeModifier: number;
    visualTags: string[];
  };
}

export interface BattleStatsDTO {
  wins: number;
  losses: number;
  draws: number;
  damageDealt: number;
  damageTaken: number;
}

export interface SpriteDTO {
  id: string;
  spriteData: string;
  visualTags: string[];
  createdAt: number;
}

export interface PlayerDataDTO {
  id: string;
  username: string;
  essence: Record<Rarity, number>;
  dataKeys: number;
  corruptedBytes: number;
  pityCounter: number;
  rank: number;
  teams: unknown[];
  completedDungeons: string[];
  lastUpdated: number;
}

export interface LeaderboardEntryDTO {
  playerId: string;
  rank: number;
  rating: number;
  wins: number;
  losses: number;
  lastBattle: number;
}

export interface BattleDTO {
  id: string;
  team1: unknown; // CombatPet[] serialized
  team2: unknown; // CombatPet[] serialized
  currentTurn: number;
  turnOrder: string[];
  currentActorIndex: number;
  log: unknown; // CombatLogEntry[] serialized
  domainEffects: unknown; // DomainEffect[] serialized
  isComplete: boolean;
  winner: 'team1' | 'team2' | 'draw' | null;
  seed?: string;
  createdAt: number;
}

export interface FusionHistoryDTO {
  id: string;
  parent1Id: string;
  parent2Id: string;
  stone1Id: string;
  stone2Id: string;
  resultId: string;
  timestamp: number;
  seed: string;
}

export interface DungeonDTO {
  id: string;
  floorNumber: number;
  tier: number;
  name: string;
  description: string;
  minionWaves: MinionWaveDTO[];
  boss: BossEncounterDTO;
  rewards: DungeonRewardsDTO;
}

export interface MinionWaveDTO {
  pets: BasePetDTO[];
  difficulty: number;
}

export interface BossEncounterDTO {
  pet: BasePetDTO;
  specialAbilities: string[];
  difficultyMultiplier: number;
}

export interface DungeonRewardsDTO {
  essence: Record<Rarity, number>;
  stones?: StoneRewardDTO[];
}

export interface StoneRewardDTO {
  type: string;
  tier: number;
  chance: number;
}

export interface PvPMatchDTO {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Team: string[];
  player2Team: string[];
  battleState: unknown;
  isAsynchronous: boolean;
  createdAt: number;
  expiresAt: number;
  status: 'pending' | 'in_progress' | 'completed' | 'expired' | 'cancelled';
  winnerId: string | null;
  rewards: unknown;
}

export interface BlackMarketReputationDTO {
  playerId: string;
  level: number;
  experience: number;
  totalPurchases: number;
  favoredFamily: PetFamily | null;
  lastPurchaseAt: number;
  consecutivePurchases: number;
}

export interface PvPRankingDTO {
  playerId: string;
  trophies: number;
  division: string;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestWinStreak: number;
  lastMatchAt: number;
  favoredFamily: PetFamily | null;
}

export const DB_NAME = 'pixel_pets_reborn_x_remeged';
export const DB_VERSION = 4;

/**
 * Open database connection
 */
export async function openDatabase(): Promise<IDBPDatabase<PixelPetsDB>> {
  return openDB<PixelPetsDB>(DB_NAME, DB_VERSION, {
    upgrade(db, _oldVersion, _newVersion, transaction) {
      // Pets store
      if (!db.objectStoreNames.contains('pets')) {
        const petsStore = db.createObjectStore('pets', { keyPath: 'id' });
        petsStore.createIndex('by-family', 'family');
        petsStore.createIndex('by-rarity', 'rarity');
        petsStore.createIndex('by-player', 'playerId');
      } else {
        const petsStore = transaction.objectStore('pets');
        if (!petsStore.indexNames.contains('by-player')) {
          petsStore.createIndex('by-player', 'playerId');
        }
      }

      // Stones store
      if (!db.objectStoreNames.contains('stones')) {
        const stonesStore = db.createObjectStore('stones', { keyPath: 'id' });
        stonesStore.createIndex('by-type', 'type');
        stonesStore.createIndex('by-tier', 'tier');
        stonesStore.createIndex('by-player', 'playerId');
      } else {
        const stonesStore = transaction.objectStore('stones');
        if (!stonesStore.indexNames.contains('by-player')) {
          stonesStore.createIndex('by-player', 'playerId');
        }
      }

      // PvP Matches store
      if (!db.objectStoreNames.contains('pvpMatches')) {
        const pvpMatchesStore = db.createObjectStore('pvpMatches', { keyPath: 'id' });
        pvpMatchesStore.createIndex('by-status', 'status');
        pvpMatchesStore.createIndex('by-player1', 'player1Id');
        pvpMatchesStore.createIndex('by-player2', 'player2Id');
      }

      // PvP Rankings store
      if (!db.objectStoreNames.contains('pvpRankings')) {
        const pvpRankingsStore = db.createObjectStore('pvpRankings', { keyPath: 'playerId' });
        pvpRankingsStore.createIndex('by-division', 'division');
        pvpRankingsStore.createIndex('by-trophies', 'trophies');
      }

      // Base pets store
      if (!db.objectStoreNames.contains('basePets')) {
        db.createObjectStore('basePets', { keyPath: 'id' });
      }

      // Abilities store
      if (!db.objectStoreNames.contains('abilities')) {
        db.createObjectStore('abilities', { keyPath: 'id' });
      }

      // Sprites store
      if (!db.objectStoreNames.contains('sprites')) {
        db.createObjectStore('sprites', { keyPath: 'id' });
      }

      // Player data store
      if (!db.objectStoreNames.contains('playerData')) {
        db.createObjectStore('playerData', { keyPath: 'id' });
      }

      // Leaderboard store
      if (!db.objectStoreNames.contains('leaderboard')) {
        const leaderboardStore = db.createObjectStore('leaderboard', { keyPath: 'playerId' });
        leaderboardStore.createIndex('by-rating', 'rating');
        leaderboardStore.createIndex('by-rank', 'rank');
      }

      // Fusion history store
      if (!db.objectStoreNames.contains('fusionHistory')) {
        db.createObjectStore('fusionHistory', { keyPath: 'id' });
      }

      // Battles store (for battle history/replay)
      if (!db.objectStoreNames.contains('battles')) {
        const battlesStore = db.createObjectStore('battles', { keyPath: 'id' });
        battlesStore.createIndex('by-complete', 'isComplete');
        battlesStore.createIndex('by-created', 'createdAt');
      }

      // Dungeons store
      if (!db.objectStoreNames.contains('dungeons')) {
        const dungeonsStore = db.createObjectStore('dungeons', { keyPath: 'id' });
        dungeonsStore.createIndex('by-floor', 'floorNumber');
        dungeonsStore.createIndex('by-tier', 'tier');
      }
    },
  });
}
