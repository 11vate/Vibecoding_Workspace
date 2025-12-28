/**
 * PvP Ranking Repository
 * Handles persistence of player PvP rankings in IndexedDB
 */

import { openDatabase, type PvPRankingDTO } from './schema';
import { PvPRanking, Division } from '@/domain/entities/PvPRanking';
import type { PetFamily } from '@/shared/types/family';

/**
 * PvP Ranking Repository Interface
 */
export interface IPvPRankingRepository {
  findByPlayerId(playerId: string): Promise<PvPRanking | null>;
  findByDivision(division: Division): Promise<PvPRanking[]>;
  findInTrophyRange(minTrophies: number, maxTrophies: number): Promise<PvPRanking[]>;
  getLeaderboard(limit?: number): Promise<PvPRanking[]>;
  initializePlayerRanking(playerId: string): Promise<PvPRanking>;
  save(ranking: PvPRanking): Promise<void>;
  delete(playerId: string): Promise<void>;
  getAll(): Promise<PvPRanking[]>;
}

/**
 * IndexedDB implementation of PvP Ranking Repository
 */
export class PvPRankingRepository implements IPvPRankingRepository {
  /**
   * Convert DTO to Domain Entity
   */
  private toDomain(dto: PvPRankingDTO): PvPRanking {
    return new PvPRanking(
      dto.playerId,
      dto.trophies,
      dto.division as Division,
      dto.wins,
      dto.losses,
      dto.draws,
      dto.winStreak,
      dto.bestWinStreak,
      dto.lastMatchAt,
      dto.favoredFamily as PetFamily | null
    );
  }

  /**
   * Convert Domain Entity to DTO
   */
  private toDTO(ranking: PvPRanking): PvPRankingDTO {
    return {
      playerId: ranking.playerId,
      trophies: ranking.trophies,
      division: ranking.division,
      wins: ranking.wins,
      losses: ranking.losses,
      draws: ranking.draws,
      winStreak: ranking.winStreak,
      bestWinStreak: ranking.bestWinStreak,
      lastMatchAt: ranking.lastMatchAt,
      favoredFamily: ranking.favoredFamily
    };
  }

  /**
   * Find ranking by player ID
   */
  async findByPlayerId(playerId: string): Promise<PvPRanking | null> {
    const db = await openDatabase();
    const dto = await db.get('pvpRankings', playerId);
    if (!dto) return null;
    return this.toDomain(dto);
  }

  /**
   * Find all rankings in a division
   */
  async findByDivision(division: Division): Promise<PvPRanking[]> {
    const db = await openDatabase();
    const dtos = await db.getAllFromIndex('pvpRankings', 'by-division', division);
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Find rankings in trophy range (for matchmaking)
   */
  async findInTrophyRange(minTrophies: number, maxTrophies: number): Promise<PvPRanking[]> {
    const db = await openDatabase();
    const allRankings = await db.getAll('pvpRankings');

    // Filter rankings within trophy range
    const inRange = allRankings.filter(
      dto => dto.trophies >= minTrophies && dto.trophies <= maxTrophies
    );

    return inRange.map(dto => this.toDomain(dto));
  }

  /**
   * Get leaderboard (top players sorted by trophies)
   */
  async getLeaderboard(limit: number = 100): Promise<PvPRanking[]> {
    const db = await openDatabase();
    const allRankings = await db.getAll('pvpRankings');

    // Sort by trophies descending
    const sorted = allRankings.sort((a, b) => b.trophies - a.trophies);

    // Take top N
    const top = sorted.slice(0, limit);

    return top.map(dto => this.toDomain(dto));
  }

  /**
   * Save ranking
   */
  async save(ranking: PvPRanking): Promise<void> {
    const db = await openDatabase();
    const dto = this.toDTO(ranking);
    await db.put('pvpRankings', dto);
  }

  /**
   * Delete ranking
   */
  async delete(playerId: string): Promise<void> {
    const db = await openDatabase();
    await db.delete('pvpRankings', playerId);
  }

  /**
   * Get all rankings
   */
  async getAll(): Promise<PvPRanking[]> {
    const db = await openDatabase();
    const dtos = await db.getAll('pvpRankings');
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Initialize ranking for new player
   */
  async initializePlayerRanking(playerId: string): Promise<PvPRanking> {
    const existingRanking = await this.findByPlayerId(playerId);
    if (existingRanking) return existingRanking;

    const newRanking = new PvPRanking(
      playerId,
      1000, // Starting trophies (Silver division)
      Division.SILVER,
      0, // wins
      0, // losses
      0, // draws
      0, // winStreak
      0, // bestWinStreak
      Date.now(),
      null // favoredFamily
    );

    await this.save(newRanking);
    return newRanking;
  }

  /**
   * Apply decay to inactive players (called periodically)
   */
  async applyInactivityDecay(): Promise<number> {
    const db = await openDatabase();
    const allRankings = await db.getAll('pvpRankings');
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    let decayedCount = 0;

    for (const dto of allRankings) {
      if (dto.lastMatchAt < sevenDaysAgo && dto.trophies > 1000) {
        // Decay 1% of trophies per day inactive (max 7 days = 7%)
        const daysInactive = Math.min(7, Math.floor((Date.now() - dto.lastMatchAt) / (24 * 60 * 60 * 1000)));
        const decayAmount = Math.floor(dto.trophies * 0.01 * daysInactive);
        const newTrophies = Math.max(1000, dto.trophies - decayAmount);

        if (newTrophies !== dto.trophies) {
          dto.trophies = newTrophies;
          dto.division = PvPRanking.getDivisionFromTrophies(newTrophies);
          await db.put('pvpRankings', dto);
          decayedCount++;
        }
      }
    }

    return decayedCount;
  }
}
