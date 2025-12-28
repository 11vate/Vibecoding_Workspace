/**
 * Enhanced Black Market Service
 * Includes risk mechanics, reputation integration, and purchase failure/confiscation
 */

import type { Player } from '@/domain/entities/Player';
import type { BlackMarketReputation } from '@/domain/entities/BlackMarketReputation';
import type { Pet } from '@/domain/entities/Pet';
import type { Stone } from '@/domain/entities/Stone';
import type { Rarity } from '@/shared/types/rarity';
import type { PetFamily } from '@/shared/types/family';

export type RiskLevel = 'safe' | 'moderate' | 'dangerous';

export interface EnhancedBlackMarketListing {
  id: string;
  type: 'pet' | 'stone';
  name: string;
  basePrice: number;
  finalPrice: number; // After reputation discount
  expiresAt: number;
  rarity: Rarity;
  tier: number; // 1-5

  // Risk mechanics
  riskLevel: RiskLevel;
  failureChance: number; // 0-20% chance purchase fails
  confiscationRisk: number; // 0-10% chance item is nerfed

  // Reputation requirements
  minReputationLevel: number;
  isExclusive: boolean; // Requires favored family
  favoredFamily?: PetFamily;

  // Item data
  itemData: any; // Pet or Stone data
}

interface PurchaseResult {
  success: boolean;
  item?: Pet | Stone;
  message: string;
  bytesLost: number;
  confiscated: boolean;
}

export class EnhancedBlackMarketService {
  /**
   * Calculate risk level based on item tier and rarity
   */
  calculateRiskLevel(tier: number, rarity: Rarity): RiskLevel {
    if (tier >= 4 || rarity >= 4) return 'dangerous';
    if (tier >= 3 || rarity >= 3) return 'moderate';
    return 'safe';
  }

  /**
   * Calculate failure chance (base 0-20%)
   * Reduced by reputation level
   */
  calculateFailureChance(
    riskLevel: RiskLevel,
    reputation: BlackMarketReputation
  ): number {
    let baseChance = 0;

    switch (riskLevel) {
      case 'safe':
        baseChance = 0;
        break;
      case 'moderate':
        baseChance = 10; // 10%
        break;
      case 'dangerous':
        baseChance = 20; // 20%
        break;
    }

    // Apply reputation risk reduction
    const riskReduction = reputation.getRiskReduction();
    const adjustedChance = baseChance * (1 - riskReduction / 100);

    return Math.max(0, adjustedChance);
  }

  /**
   * Calculate confiscation risk (base 0-10%)
   */
  calculateConfiscationRisk(
    riskLevel: RiskLevel,
    reputation: BlackMarketReputation
  ): number {
    let baseRisk = 0;

    switch (riskLevel) {
      case 'safe':
        baseRisk = 0;
        break;
      case 'moderate':
        baseRisk = 5; // 5%
        break;
      case 'dangerous':
        baseRisk = 10; // 10%
        break;
    }

    // Apply reputation risk reduction
    const riskReduction = reputation.getRiskReduction();
    const adjustedRisk = baseRisk * (1 - riskReduction / 100);

    return Math.max(0, adjustedRisk);
  }

  /**
   * Calculate final price with reputation discount
   */
  calculateFinalPrice(basePrice: number, reputation: BlackMarketReputation): number {
    const discountPercentage = reputation.getDiscountPercentage();
    const discount = basePrice * (discountPercentage / 100);
    return Math.floor(basePrice - discount);
  }

  /**
   * Attempt to purchase a listing
   */
  async attemptPurchase(
    player: Player,
    listing: EnhancedBlackMarketListing,
    reputation: BlackMarketReputation
  ): Promise<PurchaseResult> {
    // Check if player has enough bytes
    if (!player.hasEnoughBytes(listing.finalPrice)) {
      return {
        success: false,
        message: 'Insufficient corrupted bytes',
        bytesLost: 0,
        confiscated: false
      };
    }

    // Check reputation level requirement
    if (!reputation.canAccessTier(listing.tier)) {
      return {
        success: false,
        message: `Requires reputation level ${listing.minReputationLevel} (${reputation.getRankTitle()})`,
        bytesLost: 0,
        confiscated: false
      };
    }

    // Check if exclusive deal requires favored family
    if (listing.isExclusive && reputation.favoredFamily !== listing.favoredFamily) {
      return {
        success: false,
        message: 'This exclusive deal is not available for your favored family',
        bytesLost: 0,
        confiscated: false
      };
    }

    // Roll for purchase failure
    const failureRoll = Math.random() * 100;
    if (failureRoll < listing.failureChance) {
      // Purchase failed - lose half the bytes
      const bytesLost = Math.floor(listing.finalPrice / 2);

      return {
        success: false,
        message: '⚠️ Transaction intercepted by security protocols! Half your bytes were confiscated.',
        bytesLost,
        confiscated: false
      };
    }

    // Purchase succeeded - create the item
    const item = this.createItemFromListing(listing);

    // Roll for confiscation (item gets nerfed)
    const confiscationRoll = Math.random() * 100;
    const wasConfiscated = confiscationRoll < listing.confiscationRisk;

    if (wasConfiscated) {
      this.applyConfiscationNerf(item);

      return {
        success: true,
        item,
        message: '⚠️ Item was flagged and nerfed by 20%! Transaction still completed.',
        bytesLost: listing.finalPrice,
        confiscated: true
      };
    }

    // Clean purchase
    return {
      success: true,
      item,
      message: `Successfully acquired ${listing.name}!`,
      bytesLost: listing.finalPrice,
      confiscated: false
    };
  }

  /**
   * Create item from listing data
   */
  private createItemFromListing(listing: EnhancedBlackMarketListing): Pet | Stone {
    // This would use the actual item creation logic from repositories
    // For now, returning the stored itemData
    return listing.itemData;
  }

  /**
   * Apply 20% stat nerf to confiscated item
   */
  private applyConfiscationNerf(item: Pet | Stone): void {
    if ('stats' in item && item.stats) {
      // Pet stats nerf
      const nerfedStats = {
        maxHp: Math.floor(item.stats.maxHp * 0.8),
        attack: Math.floor(item.stats.attack * 0.8),
        defense: Math.floor(item.stats.defense * 0.8),
        speed: Math.floor(item.stats.speed * 0.8),
        hp: Math.floor(item.stats.hp * 0.8)
      };

      // Create new Stats object
      const Stats = require('@/domain/valueObjects/Stats').Stats;
      (item as any).stats = new Stats(
        nerfedStats.maxHp,
        nerfedStats.attack,
        nerfedStats.defense,
        nerfedStats.speed
      );

      // Add confiscated visual tag
      if (item.appearance && item.appearance.visualTags) {
        item.appearance.visualTags.push('confiscated');
      }
    } else if ('statBonuses' in item && item.statBonuses) {
      // Stone stats nerf
      const stone = item as Stone;
      (stone as any).statBonuses = {
        hp: Math.floor((stone.statBonuses.hp || 0) * 0.8),
        attack: Math.floor((stone.statBonuses.attack || 0) * 0.8),
        defense: Math.floor((stone.statBonuses.defense || 0) * 0.8),
        speed: Math.floor((stone.statBonuses.speed || 0) * 0.8)
      };
    }
  }

  /**
   * Get risk indicator text
   */
  getRiskIndicatorText(riskLevel: RiskLevel): string {
    switch (riskLevel) {
      case 'safe':
        return '✓ Low Risk';
      case 'moderate':
        return '⚠️ Moderate Risk';
      case 'dangerous':
        return '🔴 High Risk';
    }
  }

  /**
   * Get risk indicator color
   */
  getRiskIndicatorColor(riskLevel: RiskLevel): string {
    switch (riskLevel) {
      case 'safe':
        return '#27AE60'; // Green
      case 'moderate':
        return '#F39C12'; // Orange
      case 'dangerous':
        return '#E74C3C'; // Red
    }
  }

  /**
   * Check if player should see warning before purchase
   */
  shouldShowWarning(listing: EnhancedBlackMarketListing): boolean {
    return listing.failureChance > 5 || listing.confiscationRisk > 3;
  }

  /**
   * Get warning message for risky purchase
   */
  getWarningMessage(listing: EnhancedBlackMarketListing): string {
    const warnings: string[] = [];

    if (listing.failureChance > 0) {
      warnings.push(
        `${listing.failureChance.toFixed(1)}% chance the transaction will fail (you'll lose half your bytes)`
      );
    }

    if (listing.confiscationRisk > 0) {
      warnings.push(
        `${listing.confiscationRisk.toFixed(1)}% chance the item will be flagged and nerfed by 20%`
      );
    }

    if (warnings.length === 0) {
      return 'This is a safe transaction.';
    }

    return `⚠️ WARNING:\n• ${warnings.join('\n• ')}`;
  }

  /**
   * Enhance listing with risk data
   */
  enhanceListing(
    baseListing: any,
    tier: number,
    reputation: BlackMarketReputation
  ): EnhancedBlackMarketListing {
    const riskLevel = this.calculateRiskLevel(tier, baseListing.rarity);
    const failureChance = this.calculateFailureChance(riskLevel, reputation);
    const confiscationRisk = this.calculateConfiscationRisk(riskLevel, reputation);
    const finalPrice = this.calculateFinalPrice(baseListing.price, reputation);

    // Determine minimum reputation level for tier
    const minReputationLevel = this.getMinReputationForTier(tier);

    // Check if this is an exclusive deal
    const isExclusive = tier >= 4 && baseListing.family !== undefined;

    return {
      id: baseListing.id,
      type: baseListing.type,
      name: baseListing.name,
      basePrice: baseListing.price,
      finalPrice,
      expiresAt: baseListing.expiresAt,
      rarity: baseListing.rarity,
      tier,
      riskLevel,
      failureChance,
      confiscationRisk,
      minReputationLevel,
      isExclusive,
      favoredFamily: baseListing.family,
      itemData: baseListing
    };
  }

  /**
   * Get minimum reputation level required for tier
   */
  private getMinReputationForTier(tier: number): number {
    const tierRequirements: Record<number, number> = {
      1: 1,
      2: 2,
      3: 4,
      4: 6,
      5: 10
    };

    return tierRequirements[tier] || 1;
  }
}
