/**
 * Black Market Reputation Repository
 * Handles persistence of player reputation data
 */

import { openDatabase } from './schema';
import { BlackMarketReputation } from '@/domain/entities/BlackMarketReputation';
import type { PetFamily } from '@/shared/types/family';

export interface BlackMarketReputationDTO {
  playerId: string;
  level: number;
  experience: number;
  totalPurchases: number;
  favoredFamily: PetFamily | null;
  lastPurchaseAt: number;
  consecutivePurchases: number;
}

export interface IBlackMarketReputationRepository {
  findByPlayerId(playerId: string): Promise<BlackMarketReputation | null>;
  save(reputation: BlackMarketReputation): Promise<void>;
  delete(playerId: string): Promise<void>;
  initializePlayerReputation(playerId: string): Promise<BlackMarketReputation>;
  getAllReputations(): Promise<BlackMarketReputation[]>;
}

export class BlackMarketReputationRepository implements IBlackMarketReputationRepository {
  /**
   * Convert DTO to Domain Entity
   */
  private toDomain(dto: BlackMarketReputationDTO): BlackMarketReputation {
    return new BlackMarketReputation(
      dto.playerId,
      dto.level,
      dto.experience,
      dto.totalPurchases,
      dto.favoredFamily,
      dto.lastPurchaseAt,
      dto.consecutivePurchases
    );
  }

  /**
   * Convert Domain Entity to DTO
   */
  private toDTO(reputation: BlackMarketReputation): BlackMarketReputationDTO {
    return {
      playerId: reputation.playerId,
      level: reputation.level,
      experience: reputation.experience,
      totalPurchases: reputation.totalPurchases,
      favoredFamily: reputation.favoredFamily,
      lastPurchaseAt: reputation.lastPurchaseAt,
      consecutivePurchases: reputation.consecutivePurchases
    };
  }

  /**
   * Find reputation by player ID
   */
  async findByPlayerId(playerId: string): Promise<BlackMarketReputation | null> {
    const db = await openDatabase();
    const dto = await db.get('blackMarketReputations', playerId);

    if (!dto) return null;

    return this.toDomain(dto);
  }

  /**
   * Save reputation
   */
  async save(reputation: BlackMarketReputation): Promise<void> {
    const db = await openDatabase();
    const dto = this.toDTO(reputation);
    await db.put('blackMarketReputations', dto);
  }

  /**
   * Delete reputation
   */
  async delete(playerId: string): Promise<void> {
    const db = await openDatabase();
    await db.delete('blackMarketReputations', playerId);
  }

  /**
   * Initialize new player reputation (level 1, 0 XP)
   */
  async initializePlayerReputation(playerId: string): Promise<BlackMarketReputation> {
    const newReputation = new BlackMarketReputation(
      playerId,
      1, // Starting level
      0, // Starting XP
      0, // No purchases yet
      null, // No favored family yet
      0, // No purchases yet
      0 // No streak
    );

    await this.save(newReputation);
    return newReputation;
  }

  /**
   * Get all reputations (for admin/leaderboard purposes)
   */
  async getAllReputations(): Promise<BlackMarketReputation[]> {
    const db = await openDatabase();
    const dtos = await db.getAll('blackMarketReputations');
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Get top reputations (leaderboard)
   */
  async getTopReputations(limit: number = 10): Promise<BlackMarketReputation[]> {
    const allReputations = await this.getAllReputations();

    // Sort by level (descending), then by XP (descending)
    return allReputations
      .sort((a, b) => {
        if (b.level !== a.level) {
          return b.level - a.level;
        }
        return b.experience - a.experience;
      })
      .slice(0, limit);
  }

  /**
   * Apply inactivity decay to all reputations
   * Should be called periodically (e.g., daily cron job)
   */
  async applyGlobalInactivityDecay(): Promise<void> {
    const allReputations = await this.getAllReputations();

    for (const reputation of allReputations) {
      const decayedReputation = reputation.applyInactivityDecay();

      // Only save if changed
      if (
        decayedReputation.experience !== reputation.experience ||
        decayedReputation.consecutivePurchases !== reputation.consecutivePurchases
      ) {
        await this.save(decayedReputation);
      }
    }
  }
}
