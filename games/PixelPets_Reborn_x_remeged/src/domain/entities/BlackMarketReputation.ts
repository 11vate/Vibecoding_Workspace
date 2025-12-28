/**
 * Black Market Reputation Entity
 * Tracks player's standing with the black market
 */

import type { PetFamily } from '@/shared/types/family';

export class BlackMarketReputation {
  constructor(
    public readonly playerId: string,
    public readonly level: number, // 1-10
    public readonly experience: number, // XP towards next level
    public readonly totalPurchases: number,
    public readonly favoredFamily: PetFamily | null, // Unlocks family-specific deals
    public readonly lastPurchaseAt: number,
    public readonly consecutivePurchases: number // Streak bonus
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.playerId) throw new Error('Reputation must have a player ID');
    if (this.level < 1 || this.level > 10) {
      throw new Error('Reputation level must be between 1 and 10');
    }
    if (this.experience < 0) {
      throw new Error('Experience cannot be negative');
    }
    if (this.totalPurchases < 0) {
      throw new Error('Total purchases cannot be negative');
    }
  }

  /**
   * Check if player can access a given tier
   * Tier 1 items: Level 1+
   * Tier 2 items: Level 2+
   * Tier 3 items: Level 4+
   * Tier 4 items: Level 6+
   * Tier 5 items: Level 10 (max level)
   */
  canAccessTier(tier: number): boolean {
    const requiredLevel: Record<number, number> = {
      1: 1,
      2: 2,
      3: 4,
      4: 6,
      5: 10
    };

    return this.level >= (requiredLevel[tier] || 1);
  }

  /**
   * Get XP required for next level
   * Linear scaling: 100 * level
   */
  getExpForNextLevel(): number {
    if (this.level >= 10) return 0; // Max level
    return 100 * this.level;
  }

  /**
   * Calculate XP progress percentage
   */
  getExpProgress(): number {
    if (this.level >= 10) return 100;
    const required = this.getExpForNextLevel();
    return (this.experience / required) * 100;
  }

  /**
   * Earn reputation XP
   * @returns New reputation object if leveled up, null otherwise
   */
  earnReputation(amount: number): BlackMarketReputation {
    if (this.level >= 10) {
      // Max level, no more XP
      return this;
    }

    let newExp = this.experience + amount;
    let newLevel = this.level;
    const requiredExp = this.getExpForNextLevel();

    // Handle level ups
    while (newExp >= requiredExp && newLevel < 10) {
      newExp -= requiredExp;
      newLevel++;
    }

    return new BlackMarketReputation(
      this.playerId,
      newLevel,
      newExp,
      this.totalPurchases,
      this.favoredFamily,
      this.lastPurchaseAt,
      this.consecutivePurchases
    );
  }

  /**
   * Record a purchase
   */
  recordPurchase(itemCost: number, itemFamily?: PetFamily): BlackMarketReputation {
    // Base XP: 10 per purchase
    // Bonus: +1 XP per 10 bytes spent
    // Streak bonus: +5 XP per consecutive purchase (max 5)
    const baseXP = 10;
    const costBonus = Math.floor(itemCost / 10);
    const streakBonus = Math.min(this.consecutivePurchases, 5) * 5;
    const totalXP = baseXP + costBonus + streakBonus;

    // Check if purchase was recent (within 24 hours)
    const isConsecutive = Date.now() - this.lastPurchaseAt < 24 * 60 * 60 * 1000;
    const newConsecutivePurchases = isConsecutive ? this.consecutivePurchases + 1 : 1;

    // Update favored family (most purchased family)
    let newFavoredFamily = this.favoredFamily;
    if (itemFamily) {
      newFavoredFamily = itemFamily; // Simplified: last purchased family
    }

    const updatedRep = new BlackMarketReputation(
      this.playerId,
      this.level,
      this.experience,
      this.totalPurchases + 1,
      newFavoredFamily,
      Date.now(),
      newConsecutivePurchases
    );

    return updatedRep.earnReputation(totalXP);
  }

  /**
   * Apply inactivity decay
   * 1% XP loss per day inactive (max 7 days)
   */
  applyInactivityDecay(): BlackMarketReputation {
    if (this.lastPurchaseAt === 0) return this;

    const daysSinceLastPurchase = Math.floor(
      (Date.now() - this.lastPurchaseAt) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastPurchase === 0) return this;

    // Max 7 days of decay
    const daysToDecay = Math.min(daysSinceLastPurchase, 7);
    const decayPercentage = daysToDecay * 0.01; // 1% per day
    const newExp = Math.floor(this.experience * (1 - decayPercentage));

    return new BlackMarketReputation(
      this.playerId,
      this.level,
      Math.max(0, newExp),
      this.totalPurchases,
      this.favoredFamily,
      this.lastPurchaseAt,
      0 // Reset streak on decay
    );
  }

  /**
   * Get reputation rank title
   */
  getRankTitle(): string {
    if (this.level === 10) return 'Kingpin';
    if (this.level >= 8) return 'Crime Lord';
    if (this.level >= 6) return 'Fence';
    if (this.level >= 4) return 'Dealer';
    if (this.level >= 2) return 'Regular';
    return 'Newcomer';
  }

  /**
   * Get exclusive perks for current level
   */
  getPerks(): string[] {
    const perks: string[] = [];

    if (this.level >= 2) perks.push('Access to Tier 2 items');
    if (this.level >= 3) perks.push('5% discount on all purchases');
    if (this.level >= 4) perks.push('Access to Tier 3 items');
    if (this.level >= 5) perks.push('Exclusive family deals');
    if (this.level >= 6) perks.push('Access to Tier 4 items');
    if (this.level >= 7) perks.push('10% discount on all purchases');
    if (this.level >= 8) perks.push('Reduced risk chance');
    if (this.level >= 9) perks.push('Early access to new listings');
    if (this.level >= 10) perks.push('Access to Tier 5 items', 'Maximum discount (15%)', 'Guaranteed safe transactions');

    return perks;
  }

  /**
   * Get discount percentage based on level
   */
  getDiscountPercentage(): number {
    if (this.level >= 10) return 15;
    if (this.level >= 7) return 10;
    if (this.level >= 3) return 5;
    return 0;
  }

  /**
   * Check if player has access to exclusive family deals
   */
  hasExclusiveFamilyDeals(): boolean {
    return this.level >= 5 && this.favoredFamily !== null;
  }

  /**
   * Get risk reduction based on level
   */
  getRiskReduction(): number {
    if (this.level >= 10) return 100; // Guaranteed safe
    if (this.level >= 8) return 50; // 50% risk reduction
    return 0;
  }
}
