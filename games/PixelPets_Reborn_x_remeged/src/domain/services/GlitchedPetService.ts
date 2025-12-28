/**
 * Glitched Pet Service
 * Defines and manages 4 glitched pet classes with rule-breaking abilities
 */

import type { Pet } from '@/domain/entities/Pet';
import type { CombatPet, CombatAction } from '@/domain/entities/Battle';
import type { AbilityEffect } from '@/domain/entities/Ability';

/**
 * Glitched Pet Classes - 4 rule-breaking variants
 */
export enum GlitchedClass {
  BYPASS_SPECIALIST = 'bypass-specialist',      // Ignores defense calculations
  REALITY_DISTORTER = 'reality-distorter',      // Warps target selection
  CHAOS_ENGINE = 'chaos-engine',                // Random stat multipliers
  SYSTEM_OVERRIDE = 'system-override',          // Bypasses cooldown/energy costs
}

/**
 * Glitched ability effect types
 */
export interface GlitchedAbilityEffect extends AbilityEffect {
  glitchedType?: 'defense-ignore' | 'target-warp' | 'stat-chaos' | 'cooldown-bypass';
  glitchIntensity?: number; // 0.0-1.0, how strong the glitch is
}

/**
 * Glitched Pet metadata
 */
export interface GlitchedPetMetadata {
  glitchedClass: GlitchedClass;
  glitchLevel: number; // 1-5, determines ability potency
  isStable: boolean; // False = random behavior, True = predictable glitch
  glitchSignature: string; // Unique identifier for this glitch variant
}

/**
 * Service for managing glitched pet mechanics
 */
export class GlitchedPetService {
  /**
   * Check if a pet is glitched
   */
  static isGlitchedPet(pet: Pet): boolean {
    const petExtended = pet as Pet & { glitchedMetadata?: GlitchedPetMetadata };
    return !!petExtended.glitchedMetadata;
  }

  /**
   * Get glitched class of a pet
   */
  static getGlitchedClass(pet: Pet): GlitchedClass | null {
    const petExtended = pet as Pet & { glitchedMetadata?: GlitchedPetMetadata };
    const metadata = petExtended.glitchedMetadata;
    return metadata?.glitchedClass || null;
  }

  /**
   * Create a glitched variant of a base pet (fusion with Chaos/Glitched stone)
   */
  static createGlitchedVariant(
    basePet: Pet,
    glitchClassParam: GlitchedClass,
    glitchLevel: number = 1,
    isStable: boolean = false
  ): Pet {
    const glitchSignature = `${basePet.id}-glitch-${glitchClassParam}-L${glitchLevel}-${Date.now()}`;
    const metadata: GlitchedPetMetadata = {
      glitchedClass: glitchClassParam,
      glitchLevel: Math.max(1, Math.min(5, glitchLevel)), // Clamp 1-5
      isStable,
      glitchSignature,
    };

    return {
      ...basePet,
      name: `[GLITCH] ${basePet.name}`,
      lore: this.generateGlitchLore(basePet.name, glitchClassParam, glitchLevel),
      glitchedMetadata: metadata,
    } as Pet & { glitchedMetadata: GlitchedPetMetadata };
  }

  /**
   * Generate lore for glitched pets
   */
  private static generateGlitchLore(petName: string, glitchClass: GlitchedClass, level: number): string {
    const baseTexts: Record<GlitchedClass, string> = {
      [GlitchedClass.BYPASS_SPECIALIST]: `${petName} has phased through the fabric of reality. Its attacks bypass all known defenses, corrupting the very concept of protection.`,
      [GlitchedClass.REALITY_DISTORTER]: `${petName} exists in multiple places simultaneously. Its targets shift unpredictably, warping the battlefield with each action.`,
      [GlitchedClass.CHAOS_ENGINE]: `${petName} is a malfunctioning construct of pure chaos. Its power fluctuates wildly, occasionally unleashing catastrophic bursts of strength.`,
      [GlitchedClass.SYSTEM_OVERRIDE]: `${petName} has broken free from energy constraints. It acts with unnatural frequency, ignoring the laws that govern all other pets.`,
    };

    const intensity = level >= 4 ? 'severely' : level >= 2 ? 'heavily' : 'slightly';
    return `${baseTexts[glitchClass]} Corruption level: ${intensity} (Lvl ${level}/5)`;
  }

  /**
   * Apply glitched ability effect in combat
   * Returns modified effect if glitch applies, or null if standard effect should apply
   */
  static applyGlitchEffect(
    attacker: CombatPet,
    _defender: CombatPet,
    effect: AbilityEffect,
    _action: CombatAction
  ): { modifiedEffect: AbilityEffect; glitchApplied: boolean } | null {
    const attackerGlitch = this.getGlitchedClass(attacker.pet);
    if (!attackerGlitch) {
      return null; // Attacker not glitched, standard effect
    }

    const petExtended = attacker.pet as Pet & { glitchedMetadata?: GlitchedPetMetadata };
    const metadata = petExtended.glitchedMetadata;
    if (!metadata) return null;
    
    const intensityMultiplier = 0.2 + metadata.glitchLevel * 0.16; // 0.36 at L1, 1.0 at L5

    let modifiedEffect = { ...effect } as GlitchedAbilityEffect;

    switch (attackerGlitch) {
      case GlitchedClass.BYPASS_SPECIALIST: {
        // Ignore defense: multiply damage by (1 + glitch intensity)
        if (effect.type === 'damage') {
          modifiedEffect.value = (effect.value || 1.0) * (1 + intensityMultiplier);
          modifiedEffect.glitchedType = 'defense-ignore';
          modifiedEffect.glitchIntensity = intensityMultiplier;
        }
        break;
      }

      case GlitchedClass.REALITY_DISTORTER: {
        // Warp targets: randomly select different valid target
        // This is handled in resolveTargets(), just mark it
        if (effect.target) {
          modifiedEffect.glitchedType = 'target-warp';
          modifiedEffect.glitchIntensity = intensityMultiplier;
        }
        break;
      }

      case GlitchedClass.CHAOS_ENGINE: {
        // Random stat multiplier: apply random boost to effectiveness
        // 50% chance at low intensity, 100% at high intensity
        const triggerChance = 0.5 + intensityMultiplier * 0.5;
        if (Math.random() < triggerChance) {
          const boost = 0.5 + Math.random() * (intensityMultiplier * 1.5); // 0.5x to 2.5x
          modifiedEffect.value = (effect.value || 1.0) * boost;
          modifiedEffect.glitchedType = 'stat-chaos';
          modifiedEffect.glitchIntensity = boost;
        }
        break;
      }

      case GlitchedClass.SYSTEM_OVERRIDE: {
        // Cooldown bypass: no energy cost, can chain actions
        // Mark effect as free (energy cost = 0)
        modifiedEffect.glitchedType = 'cooldown-bypass';
        modifiedEffect.glitchIntensity = intensityMultiplier;
        // Actual energy bypass handled in ProcessAbility
        break;
      }
    }

    return {
      modifiedEffect,
      glitchApplied: modifiedEffect.glitchedType !== undefined,
    };
  }

  /**
   * Check if glitched pet can bypass energy cost (SYSTEM_OVERRIDE)
   */
  static canBypassEnergyCost(attacker: CombatPet): boolean {
    const glitchClass = this.getGlitchedClass(attacker.pet);
    return glitchClass === GlitchedClass.SYSTEM_OVERRIDE;
  }

  /**
   * Get glitched ability set for a glitched pet
   * Returns special abilities based on glitch class
   */
  static getGlitchedAbilities(glitchClass: GlitchedClass): GlitchedAbilityEffect[] {
    switch (glitchClass) {
      case GlitchedClass.BYPASS_SPECIALIST:
        return this.getBypassSpecialistAbilities();
      case GlitchedClass.REALITY_DISTORTER:
        return this.getRealityDistorterAbilities();
      case GlitchedClass.CHAOS_ENGINE:
        return this.getChaosEngineAbilities();
      case GlitchedClass.SYSTEM_OVERRIDE:
        return this.getSystemOverrideAbilities();
    }
  }

  /**
   * Bypass Specialist Abilities - Ignore DEF
   */
  private static getBypassSpecialistAbilities(): GlitchedAbilityEffect[] {
    return [
      {
        type: 'damage',
        target: 'single-enemy',
        value: 1.5, // 150% damage
        scaling: 'attack',
        element: 'void',
        glitchedType: 'defense-ignore',
        glitchIntensity: 0.8,
      },
      {
        type: 'damage',
        target: 'all-enemies',
        value: 1.0, // 100% damage
        scaling: 'attack',
        element: 'void',
        glitchedType: 'defense-ignore',
        glitchIntensity: 0.6,
      },
    ];
  }

  /**
   * Reality Distorter Abilities - Warp targets
   */
  private static getRealityDistorterAbilities(): GlitchedAbilityEffect[] {
    return [
      {
        type: 'damage',
        target: 'random-enemies',
        value: 1.3, // 130% damage
        scaling: 'attack',
        element: 'chaos',
        glitchedType: 'target-warp',
        glitchIntensity: 0.7,
      },
      {
        type: 'damage',
        target: 'single-enemy',
        value: 2.0, // 200% damage but random target
        scaling: 'attack',
        element: 'chaos',
        glitchedType: 'target-warp',
        glitchIntensity: 1.0,
      },
    ];
  }

  /**
   * Chaos Engine Abilities - Random multipliers
   */
  private static getChaosEngineAbilities(): GlitchedAbilityEffect[] {
    return [
      {
        type: 'damage',
        target: 'single-enemy',
        value: 1.5, // Base 150%, randomly multiplied
        scaling: 'attack',
        element: 'chaos',
        glitchedType: 'stat-chaos',
        glitchIntensity: 1.2,
      },
      {
        type: 'damage',
        target: 'all-enemies',
        value: 0.8, // Base 80%, randomly amplified per target
        scaling: 'attack',
        element: 'chaos',
        glitchedType: 'stat-chaos',
        glitchIntensity: 0.9,
      },
    ];
  }

  /**
   * System Override Abilities - Cooldown bypass
   */
  private static getSystemOverrideAbilities(): GlitchedAbilityEffect[] {
    return [
      {
        type: 'damage',
        target: 'single-enemy',
        value: 1.2, // 120% damage
        scaling: 'attack',
        element: 'electric',
        glitchedType: 'cooldown-bypass',
        glitchIntensity: 1.0,
      },
      {
        type: 'damage',
        target: 'single-enemy',
        value: 1.1, // 110% damage
        scaling: 'attack',
        element: 'electric',
        glitchedType: 'cooldown-bypass',
        glitchIntensity: 0.8,
      },
    ];
  }

  /**
   * Visual indicator for glitched pets (for UI)
   */
  static getGlitchVisualIndicator(glitchClass: GlitchedClass): { icon: string; color: string } {
    switch (glitchClass) {
      case GlitchedClass.BYPASS_SPECIALIST:
        return { icon: '⚡🛡️', color: '#FF00FF' }; // Magenta - bypassing
      case GlitchedClass.REALITY_DISTORTER:
        return { icon: '🌀✨', color: '#00FFFF' }; // Cyan - warping
      case GlitchedClass.CHAOS_ENGINE:
        return { icon: '💥🎲', color: '#FFFF00' }; // Yellow - chaotic
      case GlitchedClass.SYSTEM_OVERRIDE:
        return { icon: '⚙️🔥', color: '#FF6600' }; // Orange - overriding
    }
  }

  /**
   * Check if glitch makes pet unstable (random behavior)
   */
  static isUnstable(pet: Pet): boolean {
    const petExtended = pet as Pet & { glitchedMetadata?: GlitchedPetMetadata };
    const metadata = petExtended.glitchedMetadata;
    return metadata ? !metadata.isStable : false;
  }

  /**
   * Get glitch severity (1-10 scale)
   */
  static getGlitchSeverity(pet: Pet): number {
    const petExtended = pet as Pet & { glitchedMetadata?: GlitchedPetMetadata };
    const metadata = petExtended.glitchedMetadata;
    if (!metadata) return 0;
    return metadata.glitchLevel * 2; // 2-10 scale
  }
}
