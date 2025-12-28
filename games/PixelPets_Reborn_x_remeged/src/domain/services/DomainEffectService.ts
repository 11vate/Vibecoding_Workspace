/**
 * Domain Effect Service
 * Handles Tier V stone domain effects in combat
 */

import type { Pet } from '../entities/Pet';
import type { Stone } from '../entities/Stone';
import { StoneType, StoneTier } from '../entities/Stone';
import type { DomainEffect } from '../entities/Battle';
import { STONE_LORE } from '../content/StoneLore';
import type { IStoneRepository } from '../repositories/IStoneRepository';

export interface DomainEffectData {
  type: StoneType;
  name: string;
  description: string;
  effect: (battleState: any) => void; // Function to apply effect
}

/**
 * Domain Effect Service
 */
export class DomainEffectService {
  /**
   * Check if a pet has domain effects from Tier V stones
   */
  static async getDomainEffectsForPet(
    pet: Pet,
    stoneRepository: IStoneRepository
  ): Promise<DomainEffect[]> {
    const domainEffects: DomainEffect[] = [];

    // Check the most recent fusion for Tier V stones
    if (pet.fusionHistory.length === 0) {
      return domainEffects; // Base pets don't have domain effects
    }

    const latestFusion = pet.fusionHistory[pet.fusionHistory.length - 1];
    const [stone1Id, stone2Id] = latestFusion.stonesUsed;

    try {
      const stone1 = await stoneRepository.findById(stone1Id as any);
      const stone2 = await stoneRepository.findById(stone2Id as any);

      if (!stone1 || !stone2) {
        return domainEffects;
      }

      // Domain effects activate when BOTH stones are Tier V
      if (stone1.tier === StoneTier.V && stone2.tier === StoneTier.V) {
        // Both stones are Tier V - check if they're the same type
        if (stone1.type === stone2.type) {
          // Same type - create domain effect
          const lore = STONE_LORE[stone1.type];
          if (lore.domainEffect) {
            domainEffects.push({
              type: stone1.type,
              description: lore.domainEffect,
              sourcePetId: pet.id,
            });
          }
        } else {
          // Different types - create combined domain effect
          const combinedEffect = this.createCombinedDomainEffect(stone1, stone2);
          if (combinedEffect) {
            domainEffects.push({
              type: stone1.type, // Use first stone type as identifier
              description: combinedEffect,
              sourcePetId: pet.id,
            });
          }
        }
      }
    } catch (error) {
      console.warn('[DomainEffect] Failed to load stones:', error);
    }

    return domainEffects;
  }

  /**
   * Create combined domain effect description for two different Tier V stones
   */
  private static createCombinedDomainEffect(stone1: Stone, stone2: Stone): string | null {
    const lore1 = STONE_LORE[stone1.type];
    const lore2 = STONE_LORE[stone2.type];

    // Create combined effect description
    return `Combined Domain: ${lore1.name} + ${lore2.name} - ${lore1.domainEffect} Additionally, ${lore2.domainEffect}`;
  }

  /**
   * Apply domain effects to battle state
   */
  static applyDomainEffect(
    effect: DomainEffect,
    battleState: {
      team1: any[];
      team2: any[];
      domainEffects: DomainEffect[];
    }
  ): void {
    const stoneType = effect.type as StoneType;
    const lore = STONE_LORE[stoneType];

    if (!lore.domainEffect) {
      return;
    }

    // Apply effect based on stone type
    switch (stoneType) {
      case StoneType.RUBY:
        // Inferno Domain: All fire abilities +30% damage
        this.applyFireDomainEffect(battleState);
        break;

      case StoneType.SAPPHIRE:
        // Tidal Domain: All allies heal 5% HP per turn
        this.applyWaterDomainEffect(battleState);
        break;

      case StoneType.EMERALD:
        // Nature Domain: All allies regenerate energy +20%
        this.applyNatureDomainEffect(battleState);
        break;

      case StoneType.TOPAZ:
        // Storm Domain: All allies gain +15% speed
        this.applyLightningDomainEffect(battleState);
        break;

      case StoneType.AMETHYST:
        // Shadow Domain: All enemies take +20% dark damage
        this.applyShadowDomainEffect(battleState);
        break;

      case StoneType.PEARL:
        // Light Domain: All allies gain +10% damage reduction
        this.applyLightDomainEffect(battleState);
        break;

      case StoneType.ONYX:
        // Void Domain: All enemies lose 5% max HP per turn
        this.applyVoidDomainEffect(battleState);
        break;

      case StoneType.OPAL:
        // Chaos Domain: Random effects trigger each turn
        this.applyChaosDomainEffect(battleState);
        break;
    }
  }

  /**
   * Inferno Domain: All fire abilities +30% damage
   */
  private static applyFireDomainEffect(battleState: any): void {
    // This will be applied during damage calculation in CombatEngine
    // Mark all fire abilities with domain boost
    const allPets = [...battleState.team1, ...battleState.team2];
    allPets.forEach((pet) => {
      if (pet.pet.activeAbilities) {
        pet.pet.activeAbilities.forEach((ability: any) => {
          if (ability.element === 'fire') {
            // Mark for 30% damage boost (handled in damage calculation)
            if (!pet.domainBoosts) pet.domainBoosts = {};
            pet.domainBoosts.fire = 0.3;
          }
        });
      }
    });
  }

  /**
   * Tidal Domain: All allies heal 5% HP per turn
   */
  private static applyWaterDomainEffect(battleState: any): void {
    // Applied at start of each turn in CombatEngine
    // Mark for healing
    battleState.domainHealing = 0.05;
  }

  /**
   * Nature Domain: All allies regenerate energy +20%
   */
  private static applyNatureDomainEffect(battleState: any): void {
    // Applied during energy regeneration
    battleState.domainEnergyRegen = 0.2;
  }

  /**
   * Storm Domain: All allies gain +15% speed
   */
  private static applyLightningDomainEffect(battleState: any): void {
    const allPets = [...battleState.team1, ...battleState.team2];
    allPets.forEach((pet) => {
      if (!pet.domainBuffs) pet.domainBuffs = [];
      pet.domainBuffs.push({
        type: 'speed',
        value: 0.15,
        permanent: true,
      });
    });
  }

  /**
   * Shadow Domain: All enemies take +20% dark damage
   */
  private static applyShadowDomainEffect(battleState: any): void {
    // Applied during damage calculation
    battleState.domainShadowVulnerability = 0.2;
  }

  /**
   * Light Domain: All allies gain +10% damage reduction
   */
  private static applyLightDomainEffect(battleState: any): void {
    const allPets = [...battleState.team1, ...battleState.team2];
    allPets.forEach((pet) => {
      if (!pet.domainBuffs) pet.domainBuffs = [];
      pet.domainBuffs.push({
        type: 'defense',
        value: 0.1,
        permanent: true,
      });
    });
  }

  /**
   * Void Domain: All enemies lose 5% max HP per turn
   */
  private static applyVoidDomainEffect(battleState: any): void {
    // Applied at start of each turn
    battleState.domainVoidDamage = 0.05;
  }

  /**
   * Chaos Domain: Random effects trigger each turn
   */
  private static applyChaosDomainEffect(battleState: any): void {
    // Random effect each turn
    battleState.domainChaos = true;
  }
}

