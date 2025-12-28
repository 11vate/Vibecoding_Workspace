/**
 * PvP Match Repository
 * Handles persistence of PvP matches in IndexedDB
 */

import { openDatabase, type PvPMatchDTO } from './schema';
import { PvPMatch, type MatchStatus, type PvPRewards } from '@/domain/entities/PvPMatch';
import type { PvPMatchId } from '@/shared/types/brands';
import { brandPvPMatchId, brandPetId } from '@/shared/types/brands';

/**
 * PvP Match Repository Interface
 */
export interface IPvPMatchRepository {
  findById(id: PvPMatchId): Promise<PvPMatch | null>;
  findByPlayer(playerId: string): Promise<PvPMatch[]>;
  findByStatus(status: MatchStatus): Promise<PvPMatch[]>;
  findActiveMatchForPlayer(playerId: string): Promise<PvPMatch | null>;
  save(match: PvPMatch): Promise<void>;
  delete(id: PvPMatchId): Promise<void>;
  getAll(): Promise<PvPMatch[]>;
}

/**
 * IndexedDB implementation of PvP Match Repository
 */
export class PvPMatchRepository implements IPvPMatchRepository {
  /**
   * Convert DTO to Domain Entity
   */
  private toDomain(dto: PvPMatchDTO): PvPMatch {
    return new PvPMatch(
      brandPvPMatchId(dto.id),
      dto.player1Id,
      dto.player2Id,
      dto.player1Team.map(id => brandPetId(id)),
      dto.player2Team.map(id => brandPetId(id)),
      dto.battleState as any, // Battle entity conversion would be needed
      dto.isAsynchronous,
      dto.createdAt,
      dto.expiresAt,
      dto.status,
      dto.winnerId,
      dto.rewards as PvPRewards | null
    );
  }

  /**
   * Convert Domain Entity to DTO
   */
  private toDTO(match: PvPMatch): PvPMatchDTO {
    return {
      id: match.id as string,
      player1Id: match.player1Id,
      player2Id: match.player2Id,
      player1Team: match.player1Team.map(id => id as string),
      player2Team: match.player2Team.map(id => id as string),
      battleState: match.battleState as any,
      isAsynchronous: match.isAsynchronous,
      createdAt: match.createdAt,
      expiresAt: match.expiresAt,
      status: match.status,
      winnerId: match.winnerId,
      rewards: match.rewards
    };
  }

  /**
   * Find match by ID
   */
  async findById(id: PvPMatchId): Promise<PvPMatch | null> {
    const db = await openDatabase();
    const dto = await db.get('pvpMatches', id as string);
    if (!dto) return null;
    return this.toDomain(dto);
  }

  /**
   * Find all matches for a player (as either player1 or player2)
   */
  async findByPlayer(playerId: string): Promise<PvPMatch[]> {
    const db = await openDatabase();
    const allMatches = await db.getAll('pvpMatches');

    // Filter matches where player is participant
    const playerMatches = allMatches.filter(
      dto => dto.player1Id === playerId || dto.player2Id === playerId
    );

    return playerMatches.map(dto => this.toDomain(dto));
  }

  /**
   * Find matches by status
   */
  async findByStatus(status: MatchStatus): Promise<PvPMatch[]> {
    const db = await openDatabase();
    const dtos = await db.getAllFromIndex('pvpMatches', 'by-status', status);
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Find active match for player (pending or in_progress)
   */
  async findActiveMatchForPlayer(playerId: string): Promise<PvPMatch | null> {
    const db = await openDatabase();
    const allMatches = await db.getAll('pvpMatches');

    // Find first match that is pending or in_progress
    const activeMatch = allMatches.find(dto =>
      (dto.player1Id === playerId || dto.player2Id === playerId) &&
      (dto.status === 'pending' || dto.status === 'in_progress')
    );

    return activeMatch ? this.toDomain(activeMatch) : null;
  }

  /**
   * Save match
   */
  async save(match: PvPMatch): Promise<void> {
    const db = await openDatabase();
    const dto = this.toDTO(match);
    await db.put('pvpMatches', dto);
  }

  /**
   * Delete match
   */
  async delete(id: PvPMatchId): Promise<void> {
    const db = await openDatabase();
    await db.delete('pvpMatches', id as string);
  }

  /**
   * Get all matches
   */
  async getAll(): Promise<PvPMatch[]> {
    const db = await openDatabase();
    const dtos = await db.getAll('pvpMatches');
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Clean up expired matches (helper method)
   */
  async cleanupExpired(): Promise<number> {
    const db = await openDatabase();
    const allMatches = await db.getAll('pvpMatches');
    const now = Date.now();

    let deletedCount = 0;
    for (const dto of allMatches) {
      if (dto.expiresAt < now && dto.status !== 'completed') {
        await db.delete('pvpMatches', dto.id);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}
