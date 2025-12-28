/**
 * Combat Engine Service
 * Core combat calculations (damage, healing, etc.)
 */

import type { CombatPet, CombatAction, CombatActionResult, CombatLogEntry } from '../entities/Battle';
import { Battle } from '../entities/Battle';
import type { AbilityEffect, Ability } from '../entities/Ability';
import type { Pet } from '../entities/Pet';
import type { PetId } from '@/shared/types/brands';
import { GlitchedPetService } from './GlitchedPetService';

export interface DamageCalculation {
  baseDamage: number;
  finalDamage: number;
  critical: boolean;
  blocked: boolean;
  elementMultiplier: number;
  positionMultiplier: number;
  buffMultiplier: number;
  debuffMultiplier: number;
}

export interface HealingCalculation {
  baseHealing: number;
  finalHealing: number;
  overheal: number;
}

/**
 * AI Decision making interface
 */
export interface AIDecision {
  ability: CombatAction['ability'];
  targetIds: string[];
  score: number;
}

/**
 * Combat Engine - handles combat calculations
 */
export class CombatEngine {
  // Optional RNG provider: if set, use this for deterministic randomness in tests/simulations
  private static rngProvider: (() => number) | null = null;

  static setRng(provider: () => number): void {
    this.rngProvider = provider;
  }

  static clearRng(): void {
    this.rngProvider = null;
  }

  static random(): number {
    return this.rngProvider ? this.rngProvider() : Math.random();
  }

  /**
   * Calculate damage dealt by an ability
   */
  static calculateDamage(
    attacker: CombatPet,
    defender: CombatPet,
    effect: AbilityEffect,
    attackerElement?: string | null
  ): DamageCalculation {
    if (effect.type !== 'damage') {
      throw new Error('Effect must be damage type');
    }

    // Base damage from ability value
    const baseMultiplier = effect.value;
    const scaling = effect.scaling || 'attack';
    const basePower = scaling === 'attack' ? attacker.pet.stats.attack : attacker.pet.stats.attack;

    const baseDamage = basePower * baseMultiplier;

    // Apply buffs/debuffs
    let attackModifier = 1.0;
    attacker.buffs.forEach((buff) => {
      if (buff.type === 'attack') attackModifier += buff.value / 100;
    });
    attacker.debuffs.forEach((debuff) => {
      if (debuff.type === 'attack') attackModifier -= debuff.value / 100;
    });

    let defenseModifier = 1.0;
    defender.buffs.forEach((buff) => {
      if (buff.type === 'defense') defenseModifier += buff.value / 100;
    });
    defender.debuffs.forEach((debuff) => {
      if (debuff.type === 'defense') defenseModifier -= debuff.value / 100;
    });

    // Position modifier (front row takes more damage)
    const positionMultiplier = defender.position === 'front' ? 1.5 : 0.75;

    // Elemental multiplier (full elemental effectiveness chart)
    // Get defender element from pet's abilities or family
    const defenderElement = this.getPetElement(defender.pet);
    const elementMultiplier = this.getElementalMultiplier(
      attackerElement || null,
      effect.element || null,
      defenderElement
    );

    // Check for elemental interactions (Fire+Water=Steam, etc.)
    const interaction = this.getElementalInteraction(
      effect.element || attackerElement || null,
      defenderElement
    );
    
    // Apply interaction effects if present
    let interactionMultiplier = 1.0;
    if (interaction) {
      // Steam: reduces accuracy, applies slow
      if (interaction === 'steam') {
        interactionMultiplier = 1.1; // Slight damage boost
      }
      // Lava: applies burn, ignores some defense
      else if (interaction === 'lava') {
        interactionMultiplier = 1.2;
      }
      // Inferno: spreads to adjacent, higher damage
      else if (interaction === 'inferno') {
        interactionMultiplier = 1.3;
      }
      // Mud: applies slow, reduces defense
      else if (interaction === 'mud') {
        interactionMultiplier = 1.1;
      }
      // Electrified: applies shock, chains
      else if (interaction === 'electrified') {
        interactionMultiplier = 1.25;
      }
      // Storm: AoE, chains
      else if (interaction === 'storm') {
        interactionMultiplier = 1.2;
      }
      // Twilight: balanced, heals and damages
      else if (interaction === 'twilight') {
        interactionMultiplier = 1.15;
      }
      // Void: ignores defenses
      else if (interaction === 'void') {
        interactionMultiplier = 1.3;
      }
      // Other interactions
      else {
        interactionMultiplier = 1.1;
      }
    }

    // Defense calculation
    let defenseValue = defender.pet.stats.defense * 0.5 * defenseModifier;
    
    // Check if attacker is a glitched Bypass Specialist (ignores defense)
    const isDefenseIgnored = GlitchedPetService.getGlitchedClass(attacker.pet) === 'bypass-specialist';
    if (isDefenseIgnored) {
      defenseValue = 0; // Glitched pets ignore all defense
    }
    
    const damageAfterDefense = baseDamage * attackModifier - defenseValue;

    // Apply domain effects
    let domainMultiplier = 1.0;
    
    // Check for fire domain boost (Inferno Domain)
    if (effect.element === 'fire' && attacker.domainBoosts?.fire) {
      domainMultiplier += attacker.domainBoosts.fire; // +30% for fire abilities
    }
    
    // Check for shadow domain vulnerability (Shadow Domain)
    if (effect.element === 'shadow' && defender.domainVulnerability?.shadow) {
      domainMultiplier += defender.domainVulnerability.shadow; // +20% damage taken
    }

    // Apply multipliers (including elemental interaction and domain effects)
    const damageBeforeCrit = Math.max(1, damageAfterDefense * positionMultiplier * elementMultiplier * interactionMultiplier * domainMultiplier);

    // Critical hit (5% base chance, can be modified)
    const critical = this.random() < 0.05;
    let finalDamage = Math.round(critical ? damageBeforeCrit * 1.5 : damageBeforeCrit);
    
    // Apply Chaos Engine random multiplier if attacker is Chaos Engine glitched pet
    const chaosClass = GlitchedPetService.getGlitchedClass(attacker.pet);
    if (chaosClass === 'chaos-engine') {
      // Random multiplier between 0.5x and 2.5x based on glitch intensity
      const minMultiplier = 0.5;
      const maxMultiplier = 2.5;
      const chaosMultiplier = minMultiplier + (this.random() * (maxMultiplier - minMultiplier));
      finalDamage = Math.round(finalDamage * chaosMultiplier);
    }

    return {
      baseDamage,
      finalDamage,
      critical,
      blocked: false, // Can be enhanced with shield logic
      elementMultiplier,
      positionMultiplier,
      buffMultiplier: attackModifier,
      debuffMultiplier: defenseModifier,
    };
  }

  /**
   * Calculate healing amount
   */
  static calculateHealing(
    healer: CombatPet,
    target: CombatPet,
    effect: AbilityEffect
  ): HealingCalculation {
    if (effect.type !== 'heal') {
      throw new Error('Effect must be heal type');
    }

    const scaling = effect.scaling || 'hp';
    const basePower = scaling === 'hp' ? healer.pet.stats.hp : healer.pet.stats.hp;
    const baseHealing = basePower * effect.value;

    // Healing can be affected by buffs
    let healingModifier = 1.0;
    healer.buffs.forEach(() => {
      // Healing-specific buffs can be added here
    });

    const finalHealing = Math.round(baseHealing * healingModifier);
    const maxHealable = target.pet.stats.hp - target.currentHp;
    const actualHealing = Math.min(finalHealing, maxHealable);
    const overheal = Math.max(0, finalHealing - maxHealable);

    return {
      baseHealing,
      finalHealing: actualHealing,
      overheal,
    };
  }

  /**
   * Elemental effectiveness chart
   * Format: [attacker][defender] = multiplier
   */
  private static readonly ELEMENTAL_EFFECTIVENESS: Record<string, Record<string, number>> = {
    fire: {
      fire: 1.0,
      water: 0.5,
      earth: 1.5,
      lightning: 1.0,
      shadow: 1.0,
      light: 1.0,
      metal: 1.5,
      arcane: 1.0,
      air: 1.2,
      chaos: 1.0,
    },
    water: {
      fire: 1.5,
      water: 1.0,
      earth: 1.5,
      lightning: 0.5,
      shadow: 1.0,
      light: 1.0,
      metal: 0.8,
      arcane: 1.0,
      air: 1.0,
      chaos: 1.0,
    },
    earth: {
      fire: 0.5,
      water: 0.5,
      earth: 1.0,
      lightning: 1.5,
      shadow: 1.0,
      light: 1.0,
      metal: 0.8,
      arcane: 1.0,
      air: 1.5,
      chaos: 1.0,
    },
    lightning: {
      fire: 1.0,
      water: 1.5,
      earth: 0.5,
      lightning: 1.0,
      shadow: 1.5,
      light: 1.0,
      metal: 1.5,
      arcane: 1.2,
      air: 0.8,
      chaos: 1.0,
    },
    shadow: {
      fire: 1.0,
      water: 1.0,
      earth: 1.0,
      lightning: 0.5,
      shadow: 1.0,
      light: 0.5,
      metal: 1.0,
      arcane: 1.5,
      air: 1.0,
      chaos: 1.2,
    },
    light: {
      fire: 1.0,
      water: 1.0,
      earth: 1.0,
      lightning: 1.0,
      shadow: 1.5,
      light: 1.0,
      metal: 1.0,
      arcane: 1.0,
      air: 1.0,
      chaos: 1.5,
    },
    metal: {
      fire: 0.8,
      water: 1.2,
      earth: 1.2,
      lightning: 0.8,
      shadow: 1.0,
      light: 1.0,
      metal: 1.0,
      arcane: 0.8,
      air: 1.0,
      chaos: 1.0,
    },
    arcane: {
      fire: 1.0,
      water: 1.0,
      earth: 1.0,
      lightning: 1.2,
      shadow: 1.5,
      light: 1.0,
      metal: 1.2,
      arcane: 1.0,
      air: 1.0,
      chaos: 0.8,
    },
    air: {
      fire: 0.8,
      water: 1.0,
      earth: 0.5,
      lightning: 1.2,
      shadow: 1.0,
      light: 1.0,
      metal: 1.0,
      arcane: 1.0,
      air: 1.0,
      chaos: 1.0,
    },
    chaos: {
      fire: 1.0,
      water: 1.0,
      earth: 1.0,
      lightning: 1.0,
      shadow: 1.2,
      light: 0.8,
      metal: 1.0,
      arcane: 1.2,
      air: 1.0,
      chaos: 1.0,
    },
  };

  /**
   * Elemental interactions (combining elements creates new effects)
   * Enhanced with ElementInteractions service
   */
  private static readonly ELEMENTAL_INTERACTIONS: Record<string, Record<string, string>> = {
    fire: {
      water: 'steam', // Fire + Water = Steam (reduces accuracy, applies slow)
      earth: 'lava', // Fire + Earth = Lava (applies burn, ignores some defense)
      air: 'inferno', // Fire + Air = Inferno (spreads to adjacent, higher damage)
      lightning: 'plasma', // Fire + Lightning = Plasma (explosive, shock)
      shadow: 'ash', // Fire + Shadow = Ash (corruption, decay)
    },
    water: {
      fire: 'steam',
      earth: 'mud', // Water + Earth = Mud (applies slow, reduces defense)
      lightning: 'storm', // Water + Lightning = Storm (chains damage, shock)
      ice: 'freeze', // Water + Ice = Freeze (applies freeze)
      light: 'prism', // Water + Light = Prism (illumination, reveals stealth)
    },
    earth: {
      fire: 'lava',
      water: 'mud',
      lightning: 'crystal', // Earth + Lightning = Crystal (increases defense, reflects damage)
      metal: 'alloy', // Earth + Metal = Alloy (increases all stats)
    },
    lightning: {
      water: 'electrified',
      earth: 'crystal',
      air: 'storm', // Lightning + Air = Storm (AoE, chains)
      metal: 'magnetic', // Lightning + Metal = Magnetic (pulls enemies, stuns)
    },
    shadow: {
      light: 'twilight', // Shadow + Light = Twilight (balanced, heals and damages)
      arcane: 'void', // Shadow + Arcane = Void (ignores defenses)
      chaos: 'entropy', // Shadow + Chaos = Entropy (random effects)
    },
    light: {
      shadow: 'twilight',
      arcane: 'divine', // Light + Arcane = Divine (massive healing, removes debuffs)
      chaos: 'purification', // Light + Chaos = Purification (removes all status effects)
    },
    metal: {
      earth: 'alloy',
      lightning: 'magnetic',
      fire: 'molten', // Metal + Fire = Molten (applies burn, reduces defense)
    },
    arcane: {
      shadow: 'void',
      light: 'divine',
      chaos: 'reality', // Arcane + Chaos = Reality (random powerful effects)
    },
    air: {
      fire: 'inferno',
      lightning: 'storm',
      water: 'mist', // Air + Water = Mist (reduces accuracy, applies stealth)
    },
    chaos: {
      shadow: 'entropy',
      light: 'purification',
      arcane: 'reality',
      fire: 'anomaly', // Chaos + Fire = Anomaly (random fire effects)
      water: 'flux', // Chaos + Water = Flux (random water effects)
    },
  };

  /**
   * Get elemental multiplier based on attacker and defender elements
   */
  private static getElementalMultiplier(
    attackerElement: string | null,
    abilityElement: string | null,
    defenderElement: string | null
  ): number {
    // Use ability element if available, otherwise attacker element
    const effectiveElement = abilityElement || attackerElement;
    
    if (!effectiveElement || !defenderElement) {
      return 1.0;
    }

    const attackerKey = effectiveElement.toLowerCase();
    const defenderKey = defenderElement.toLowerCase();

    // Check if we have effectiveness data for these elements
    if (
      this.ELEMENTAL_EFFECTIVENESS[attackerKey] &&
      this.ELEMENTAL_EFFECTIVENESS[attackerKey][defenderKey] !== undefined
    ) {
      return this.ELEMENTAL_EFFECTIVENESS[attackerKey][defenderKey];
    }

    // Default to 1.0 if elements not found
    return 1.0;
  }

  /**
   * Get elemental interaction effect (Fire+Water=Steam, etc.)
   */
  private static getElementalInteraction(
    element1: string | null,
    element2: string | null
  ): string | null {
    if (!element1 || !element2) return null;

    const key1 = element1.toLowerCase();
    const key2 = element2.toLowerCase();

    // Check both directions
    if (
      this.ELEMENTAL_INTERACTIONS[key1] &&
      this.ELEMENTAL_INTERACTIONS[key1][key2]
    ) {
      return this.ELEMENTAL_INTERACTIONS[key1][key2];
    }

    if (
      this.ELEMENTAL_INTERACTIONS[key2] &&
      this.ELEMENTAL_INTERACTIONS[key2][key1]
    ) {
      return this.ELEMENTAL_INTERACTIONS[key2][key1];
    }

    return null;
  }

  /**
   * Check if ability hits (accuracy check)
   */
  static checkHit(_attacker: CombatPet, defender: CombatPet): boolean {
    // Base accuracy is 100% - can be modified by status effects
    if (defender.statusEffects.some((s) => s.type === 'STEALTH')) {
      return this.random() < 0.5; // 50% chance to hit stealth targets
    }
    return true;
  }

  /**
   * Apply status effect chance
   */
  static checkStatusApplication(chance: number): boolean {
    return this.random() < chance / 100;
  }

  /**
   * Process an ability and apply its effects
   * Note: This mutates the combat pets in place
   */
  static processAbility(
    action: CombatAction,
    team1: CombatPet[],
    team2: CombatPet[]
  ): CombatActionResult[] {
    const results: CombatActionResult[] = [];
    const attacker = this.findCombatPet(team1, team2, action.petId);

    if (!attacker || attacker.currentHp <= 0) {
      return results; // Attacker is dead or not found
    }

    // Process each effect in the ability
    for (const effect of action.ability.effects) {
      const targets = this.resolveTargets(
        effect.target, 
        action.targetIds.map(id => id as string), 
        team1, 
        team2, 
        action.petId as string
      );
      
      for (const targetId of targets) {
        const target = this.findCombatPet(team1, team2, targetId as PetId);
        if (!target || target.currentHp <= 0) continue;

        let result: CombatActionResult = {
          targetId: targetId as PetId,
          missed: false,
          critical: false,
        };

        switch (effect.type) {
          case 'damage': {
            const damageCalc = this.calculateDamage(attacker, target, effect, action.ability.element || null);
            result.damage = damageCalc.finalDamage;
            result.critical = damageCalc.critical;
            target.currentHp = Math.max(0, target.currentHp - damageCalc.finalDamage);
            break;
          }

          case 'heal': {
            const healCalc = this.calculateHealing(attacker, target, effect);
            result.healing = healCalc.finalHealing;
            target.currentHp = Math.min(target.pet.stats.hp, target.currentHp + healCalc.finalHealing);
            break;
          }

          case 'buff':
            if (effect.statusType) {
              // Apply buff
              const buff = {
                type: effect.scaling as 'attack' | 'defense' | 'speed' | 'shield' | 'haste',
                value: effect.value,
                duration: effect.statusDuration || 3,
                source: action.petId,
              };
              result.buffApplied = buff;
              target.buffs = [...target.buffs, buff];
            }
            break;

          case 'debuff':
            if (effect.statusType) {
              // Apply debuff
              const debuff = {
                type: effect.scaling as 'attack' | 'defense' | 'speed' | 'slow',
                value: effect.value,
                duration: effect.statusDuration || 3,
                source: action.petId,
              };
              result.debuffApplied = debuff;
              target.debuffs = [...target.debuffs, debuff];
            }
            break;

          case 'status':
            if (effect.statusType && effect.statusChance) {
              const applied = this.checkStatusApplication(effect.statusChance);
              if (applied) {
                result.statusApplied = effect.statusType;
                target.statusEffects = [
                  ...target.statusEffects,
                  {
                    type: effect.statusType,
                    duration: effect.statusDuration || 2,
                    value: effect.value,
                    source: action.petId,
                  },
                ];
              }
            }
            break;
        }

        results.push(result);
      }
    }

    return results;
  }

  /**
   * Execute a single turn in battle
   * Returns updated battle state
   */
  static executeTurn(battle: Battle): Battle {
    // Create mutable copies of teams for processing
    const team1 = [...battle.team1];
    const team2 = [...battle.team2];

    // Apply domain effects at start of turn
    this.applyDomainEffectsAtTurnStart(battle, team1, team2);

    // Get current actor
    const currentActorId = battle.turnOrder[battle.currentActorIndex];
    const actor = this.findCombatPet(team1, team2, currentActorId);

    if (!actor || actor.currentHp <= 0) {
      // Skip dead pets - advance turn
      return this.createNextTurnBattle(battle, team1, team2, []);
    }

    // Smart AI decision making for ability selection and targeting
    const decision = this.makeAIDecision(actor, team1, team2);

    if (!decision || !decision.ability) {
      // No ability available, skip turn
      return this.createNextTurnBattle(battle, team1, team2, []);
    }

    const availableAbility = decision.ability;
    const actionTargetIds = decision.targetIds;

    // Create action
    const action: CombatAction = {
      petId: actor.pet.id,
      ability: availableAbility,
      targetIds: actionTargetIds.map(id => id as PetId),
      timestamp: Date.now(),
    };

    // Process ability (mutates team1/team2)
    const results = this.processAbility(action, team1, team2);

    // Create log entry
    const logEntry: CombatLogEntry = {
      turn: battle.currentTurn,
      action,
      results,
      timestamp: Date.now(),
    };

    // Check win conditions and create next battle state
    return this.createNextTurnBattle(battle, team1, team2, [...battle.log, logEntry]);
  }

  /**
   * Apply domain effects at the start of each turn
   * Domain effects are created by Tier V stones in fusion history
   */
  private static applyDomainEffectsAtTurnStart(
    battle: Battle,
    team1: CombatPet[],
    team2: CombatPet[]
  ): void {
    if (!battle.domainEffects || battle.domainEffects.length === 0) {
      return; // No domain effects to apply
    }

    const allPets = [...team1, ...team2];

    for (const domainEffect of battle.domainEffects) {
      const stoneType = domainEffect.type.toUpperCase();

      switch (stoneType) {
        case 'RUBY':
          // Inferno Domain: All fire abilities +30% damage
          // This is handled in calculateDamage via domainBoosts
          allPets.forEach((pet) => {
            if (!pet.domainBoosts) {
              const petCast = pet as Partial<CombatPet>;
              petCast.domainBoosts = {};
            }
            if (pet.domainBoosts) {
              (pet.domainBoosts as Record<string, number>).fire = 0.3;
            }
          });
          break;

        case 'SAPPHIRE':
          // Tidal Domain: All allies heal 5% HP per turn
          allPets.forEach((pet) => {
            if (pet.currentHp > 0) {
              const healAmount = Math.floor(pet.pet.stats.maxHp * 0.05);
              pet.currentHp = Math.min(pet.pet.stats.maxHp, pet.currentHp + healAmount);
            }
          });
          break;

        case 'EMERALD':
          // Nature Domain: All allies regenerate energy +20%
          allPets.forEach((pet) => {
            if (pet.currentHp > 0) {
              const energyRegen = Math.floor(pet.currentEnergy * 0.2);
              pet.currentEnergy = Math.min(100, pet.currentEnergy + energyRegen);
            }
          });
          break;

        case 'TOPAZ':
          // Storm Domain: All allies gain +15% speed (via speed multiplier)
          allPets.forEach((pet) => {
            // Store speed boost in domainBoosts for use in turn order calculations
            if (!pet.domainBoosts) {
              (pet as Partial<CombatPet>).domainBoosts = {};
            }
            if (pet.domainBoosts) {
              pet.domainBoosts.speed = 0.15;
            }
          });
          break;

        case 'AMETHYST': {
          // Shadow Domain: All enemies take +20% dark damage
          // This is handled in calculateDamage via domainVulnerability
          const sourcePet = this.findCombatPet(team1, team2, domainEffect.sourcePetId);
          if (sourcePet) {
            const isSourceTeam1 = team1.includes(sourcePet);
            const enemies = isSourceTeam1 ? team2 : team1;
            enemies.forEach((enemy) => {
              if (!enemy.domainVulnerability) {
                (enemy as Partial<CombatPet>).domainVulnerability = {};
              }
              if (enemy.domainVulnerability) {
                enemy.domainVulnerability.shadow = 0.2;
              }
            });
          }
          break;
        }

        case 'PEARL':
          // Light Domain: All allies gain +10% damage reduction  
          allPets.forEach((pet) => {
            // Store defense boost in domainBoosts
            if (!pet.domainBoosts) {
              (pet as Partial<CombatPet>).domainBoosts = {};
            }
            if (pet.domainBoosts) {
              pet.domainBoosts.defense = 0.1;
            }
          });
          break;

        case 'ONYX': {
          // Void Domain: All enemies lose 5% max HP per turn
          const sourcePetOnyx = this.findCombatPet(team1, team2, domainEffect.sourcePetId);
          if (sourcePetOnyx) {
            const isSourceTeam1Onyx = team1.includes(sourcePetOnyx);
            const enemiesOnyx = isSourceTeam1Onyx ? team2 : team1;
            enemiesOnyx.forEach((enemy) => {
              if (enemy.currentHp > 0) {
                const voidDamage = Math.floor(enemy.pet.stats.maxHp * 0.05);
                enemy.currentHp = Math.max(1, enemy.currentHp - voidDamage);
              }
            });
          }
          break;
        }

        case 'OPAL': {
          // Chaos Domain: Random effects trigger each turn
          // Apply a random effect to a random pet
          if (allPets.length > 0) {
            const randomPet = allPets[Math.floor(this.random() * allPets.length)];
            const randomEffect = Math.floor(this.random() * 4);
            switch (randomEffect) {
              case 0: {
                // Random heal
                const healAmount = Math.floor(randomPet.pet.stats.maxHp * 0.1);
                randomPet.currentHp = Math.min(randomPet.pet.stats.maxHp, randomPet.currentHp + healAmount);
                break;
              }
              case 1: {
                // Random damage
                const damageAmount = Math.floor(randomPet.pet.stats.maxHp * 0.05);
                randomPet.currentHp = Math.max(1, randomPet.currentHp - damageAmount);
                break;
              }
              case 2:
                // Random energy boost
                randomPet.currentEnergy = Math.min(100, randomPet.currentEnergy + 20);
                break;
              case 3:
                // Random buff (stored as boost instead)
                if (!randomPet.domainBoosts) {
                  (randomPet as Partial<CombatPet>).domainBoosts = {};
                }
                if (randomPet.domainBoosts) {
                  randomPet.domainBoosts.attack = 0.1;
                }
                break;
            }
          }
          break;
        }
      }
    }
  }

  /**
   * Create next turn battle state
   */
  private static createNextTurnBattle(
    currentBattle: Battle,
    team1: CombatPet[],
    team2: CombatPet[],
    log: CombatLogEntry[]
  ): Battle {
    // Check win conditions
    const team1Alive = team1.filter((p) => p.currentHp > 0).length;
    const team2Alive = team2.filter((p) => p.currentHp > 0).length;

    let winner: 'team1' | 'team2' | 'draw' | null = null;
    let isComplete = false;

    if (team1Alive === 0 && team2Alive === 0) {
      winner = 'draw';
      isComplete = true;
    } else if (team1Alive === 0) {
      winner = 'team2';
      isComplete = true;
    } else if (team2Alive === 0) {
      winner = 'team1';
      isComplete = true;
    }

    // Calculate next turn
    const nextActorIndex = (currentBattle.currentActorIndex + 1) % currentBattle.turnOrder.length;
    const nextTurn = nextActorIndex === 0
      ? currentBattle.currentTurn + 1
      : currentBattle.currentTurn;

    // Create new battle state (Battle is immutable, so we recreate)
    return new Battle(
      currentBattle.id,
      team1,
      team2,
      nextTurn,
      currentBattle.turnOrder,
      nextActorIndex,
      log,
      currentBattle.domainEffects,
      isComplete,
      winner || currentBattle.winner,
      currentBattle.createdAt
    );
  }

  /**
   * Find combat pet by ID
   */
  private static findCombatPet(team1: CombatPet[], team2: CombatPet[], petId: PetId): CombatPet | undefined {
    return [...team1, ...team2].find((p) => p.pet.id === petId);
  }

  /**
   * Resolve targets based on target type
   */
  private static resolveTargets(
    targetType: string,
    explicitTargets: readonly string[],
    team1: CombatPet[],
    team2: CombatPet[],
    sourcePetId: string
  ): string[] {
    const sourcePet = this.findCombatPet(team1, team2, sourcePetId as PetId);
    if (!sourcePet) return [];

    const sourceTeam = team1.includes(sourcePet) ? team1 : team2;
    const enemyTeam = team1.includes(sourcePet) ? team2 : team1;

    switch (targetType) {
      case 'single-enemy': {
        const aliveEnemies = enemyTeam.filter((p) => p.currentHp > 0);
        
        // Check if source is Reality Distorter (warps target)
        const isRealityDistorter = GlitchedPetService.getGlitchedClass(sourcePet.pet) === 'reality-distorter';
        if (isRealityDistorter && aliveEnemies.length > 1) {
          // Randomly select a different target
          const randomIndex = Math.floor(this.random() * aliveEnemies.length);
          return [aliveEnemies[randomIndex].pet.id];
        }
        
        return explicitTargets.length > 0
          ? [explicitTargets[0]]
          : aliveEnemies.slice(0, 1).map((p) => p.pet.id);
      }

      case 'all-enemies':
        return enemyTeam.filter((p) => p.currentHp > 0).map((p) => p.pet.id);

      case 'random-enemies': {
        const aliveEnemies = enemyTeam.filter((p) => p.currentHp > 0);
        const count = Math.min(explicitTargets.length || 1, aliveEnemies.length);
        return aliveEnemies.slice(0, count).map((p) => p.pet.id);
      }

      case 'random-ally': {
        const aliveAllies = sourceTeam.filter((p) => p.currentHp > 0 && p.pet.id !== sourcePetId);
        return aliveAllies.length > 0
          ? [aliveAllies[Math.floor(this.random() * aliveAllies.length)].pet.id]
          : [sourcePetId];
      }

      default:
        return explicitTargets.slice();
    }
  }

  /**
   * Get pet's primary element from abilities or family
   */
  private static getPetElement(pet: Pet): string | null {
    // Try to get element from active abilities first
    if (pet.activeAbilities && pet.activeAbilities.length > 0) {
      const firstAbility = pet.activeAbilities[0];
      if (firstAbility.element) {
        return firstAbility.element;
      }
    }

    // Try ultimate ability
    if (pet.ultimateAbility && pet.ultimateAbility.element) {
      return pet.ultimateAbility.element;
    }

    // Map family to element (fallback)
    const familyToElement: Record<string, string> = {
      PYRO_KIN: 'fire',
      AQUA_BORN: 'water',
      TERRA_FORGED: 'earth',
      VOLT_STREAM: 'lightning',
      SHADOW_VEIL: 'shadow',
      LUMINA: 'light',
      STEEL_WORKS: 'metal',
      ARCANE_RIFT: 'arcane',
      AERO_WISP: 'air',
      CHAOS_CORE: 'chaos',
    };

    if (pet.family && familyToElement[pet.family]) {
      return familyToElement[pet.family];
    }

    return null;
  }

  /**
   * Make AI decision for ability selection and targeting
   */
  private static makeAIDecision(
    actor: CombatPet,
    team1: CombatPet[],
    team2: CombatPet[]
  ): AIDecision | null {
    const isTeam1 = team1.includes(actor);
    const allies = isTeam1 ? team1 : team2;
    const enemies = isTeam1 ? team2 : team1;
    const aliveAllies = allies.filter((p) => p.currentHp > 0);
    const aliveEnemies = enemies.filter((p) => p.currentHp > 0);

    if (aliveEnemies.length === 0) {
      return null; // Battle won
    }

    // Get all available abilities (active + ultimate if energy allows)
    // System Override glitched pets ignore energy requirements
    const isSystemOverride = GlitchedPetService.getGlitchedClass(actor.pet) === 'system-override';
    
    const availableAbilities = [
      ...actor.pet.activeAbilities.filter((a) => isSystemOverride || a.isAvailable(actor.currentEnergy)),
      ...(actor.pet.ultimateAbility && (isSystemOverride || actor.pet.ultimateAbility.isAvailable(actor.currentEnergy))
        ? [actor.pet.ultimateAbility]
        : []),
    ];

    if (availableAbilities.length === 0) {
      return null; // No abilities available
    }

    // Evaluate each ability and find best option
    let bestDecision: AIDecision | null = null;
    let bestScore = -Infinity;

    for (const ability of availableAbilities) {
      const decision = this.evaluateAbility(ability, actor, aliveAllies, aliveEnemies);
      if (decision) {
        // Boost score heavily for glitched pets - they're unpredictable and powerful
        const glitchClass = GlitchedPetService.getGlitchedClass(actor.pet);
        if (glitchClass) {
          decision.score += 50; // Heavy weighting for all glitched abilities
        }
        
        if (decision.score > bestScore) {
          bestScore = decision.score;
          bestDecision = decision;
        }
      }
    }

    return bestDecision;
  }  /**
   * Evaluate an ability and return best decision
   */
  private static evaluateAbility(
    ability: Ability,
    actor: CombatPet,
    allies: CombatPet[],
    enemies: CombatPet[]
  ): AIDecision | null {
    let bestTargets: string[] = [];
    let bestScore = -Infinity;

    // Determine ability type and evaluate accordingly
    const hasDamage = ability.effects.some((e: AbilityEffect) => e.type === 'damage');
    const hasHeal = ability.effects.some((e: AbilityEffect) => e.type === 'heal');
    const hasBuff = ability.effects.some((e: AbilityEffect) => e.type === 'buff');
    const hasDebuff = ability.effects.some((e: AbilityEffect) => e.type === 'debuff');
    const hasStatus = ability.effects.some((e: AbilityEffect) => e.type === 'status');

    // Get target type from first effect
    const targetType = ability.effects[0]?.target || 'single-enemy';

    // Evaluate based on target type
    if (targetType === 'single-enemy' || targetType === 'all-enemies') {
      // Damage/offensive ability
      if (hasDamage || hasDebuff || hasStatus) {
        const targets = this.selectBestTargets(ability, actor, enemies, targetType);
        const score = this.scoreOffensiveAbility(ability, actor, enemies, targets);
        if (score > bestScore) {
          bestScore = score;
          bestTargets = targets;
        }
      }
    }

    if (targetType === 'self' || targetType === 'random-ally' || targetType === 'all-allies') {
      // Support/healing ability
      if (hasHeal || hasBuff) {
        const targets = this.selectBestSupportTargets(ability, actor, allies, targetType);
        const score = this.scoreSupportAbility(ability, actor, allies, targets);
        if (score > bestScore) {
          bestScore = score;
          bestTargets = targets;
        }
      }
    }

    if (bestTargets.length === 0) {
      // Fallback: use default targeting
      if (targetType.includes('enemy')) {
        bestTargets = enemies.length > 0 ? [enemies[0].pet.id] : [];
      } else if (targetType.includes('ally')) {
        bestTargets = allies.length > 0 ? [allies[0].pet.id] : [];
      } else {
        bestTargets = [actor.pet.id];
      }
    }

    return bestTargets.length > 0
      ? {
          ability,
          targetIds: bestTargets,
          score: bestScore,
        }
      : null;
  }

  /**
   * Select best targets for offensive abilities
   */
  private static selectBestTargets(
    ability: Ability,
    actor: CombatPet,
    enemies: CombatPet[],
    targetType: string
  ): string[] {
    if (targetType === 'all-enemies') {
      return enemies.map((e) => e.pet.id);
    }

    // Single target - prioritize:
    // 1. Low HP enemies (finish them off)
    // 2. High threat enemies (high attack)
    // 3. Elemental effectiveness
    const scoredEnemies = enemies.map((enemy) => {
      let score = 0;

      // Low HP priority (finish off)
      const hpPercent = enemy.currentHp / enemy.pet.stats.maxHp;
      score += (1 - hpPercent) * 100; // Higher score for lower HP

      // High threat priority (high attack)
      const threat = enemy.pet.stats.attack / 100;
      score += threat * 20;

      // Elemental effectiveness
      const actorElement = this.getPetElement(actor.pet);
      const enemyElement = this.getPetElement(enemy.pet);
      if (actorElement && enemyElement && ability.element) {
        const effectiveness = this.getElementalMultiplier(
          actorElement,
          ability.element,
          enemyElement
        );
        score += (effectiveness - 1) * 50; // Bonus for super-effective
      }

      // Status effect value
      if (ability.effects.some((e: AbilityEffect) => e.type === 'status')) {
        // Prioritize enemies without status effects
        if (enemy.statusEffects.length === 0) {
          score += 30;
        }
      }

      return { enemy, score };
    });

    // Sort by score and pick best
    scoredEnemies.sort((a, b) => b.score - a.score);
    return scoredEnemies.length > 0 ? [scoredEnemies[0].enemy.pet.id] : [];
  }

  /**
   * Select best targets for support abilities
   */
  private static selectBestSupportTargets(
    ability: Ability,
    actor: CombatPet,
    allies: CombatPet[],
    targetType: string
  ): string[] {
    if (targetType === 'all-allies') {
      return allies.map((a) => a.pet.id);
    }

    if (targetType === 'self') {
      return [actor.pet.id];
    }

    // Single ally - prioritize:
    // 1. Low HP allies (heal them)
    // 2. High value allies (high stats, important abilities)
    const scoredAllies = allies.map((ally) => {
      let score = 0;

      // Low HP priority (heal them)
      const hpPercent = ally.currentHp / ally.pet.stats.maxHp;
      score += (1 - hpPercent) * 150; // Much higher priority for healing

      // High value (high stats)
      const value = (ally.pet.stats.attack + ally.pet.stats.defense) / 100;
      score += value * 10;

      // Missing buffs
      if (ability.effects.some((e: AbilityEffect) => e.type === 'buff')) {
        if (ally.buffs.length === 0) {
          score += 50;
        }
      }

      return { ally, score };
    });

    scoredAllies.sort((a, b) => b.score - a.score);
    return scoredAllies.length > 0 ? [scoredAllies[0].ally.pet.id] : [];
  }

  /**
   * Score offensive ability
   */
  private static scoreOffensiveAbility(
    ability: Ability,
    actor: CombatPet,
    enemies: CombatPet[],
    targets: string[]
  ): number {
    let score = 0;

    // Base damage potential
    const damageEffect = ability.effects.find((e: AbilityEffect) => e.type === 'damage');
    if (damageEffect) {
      const baseDamage = actor.pet.stats.attack * damageEffect.value;
      score += baseDamage / 10; // Scale down for scoring

      // Elemental effectiveness bonus
      const actorElement = this.getPetElement(actor.pet);
      for (const targetId of targets) {
        const target = enemies.find((e) => e.pet.id === targetId);
        if (target) {
          const enemyElement = this.getPetElement(target.pet);
          if (actorElement && enemyElement && ability.element) {
            const effectiveness = this.getElementalMultiplier(
              actorElement,
              ability.element,
              enemyElement
            );
            score += (effectiveness - 1) * 100;
          }
        }
      }
    }

    // Energy efficiency (lower cost = better)
    const energyCost = ability.energyCost || 0;
    score -= energyCost * 0.5;

    // Status effect value
    const statusEffect = ability.effects.find((e: AbilityEffect) => e.type === 'status');
    if (statusEffect && statusEffect.statusChance !== undefined) {
      score += statusEffect.statusChance * 50;
    }

    // Debuff value
    const debuffEffect = ability.effects.find((e: AbilityEffect) => e.type === 'debuff');
    if (debuffEffect) {
      score += 30;
    }

    // AoE bonus (hits multiple targets)
    if (targets.length > 1) {
      score += targets.length * 20;
    }

    return score;
  }

  /**
   * Score support ability
   */
  private static scoreSupportAbility(
    ability: Ability,
    _actor: CombatPet,
    allies: CombatPet[],
    targets: string[]
  ): number {
    let score = 0;

    // Healing value
    const healEffect = ability.effects.find((e: AbilityEffect) => e.type === 'heal');
    if (healEffect) {
      const avgHp = allies.reduce((sum, a) => sum + a.pet.stats.maxHp, 0) / allies.length;
      const healAmount = avgHp * healEffect.value;
      score += healAmount / 10;

      // Prioritize if allies are low on HP
      const avgHpPercent =
        allies.reduce((sum, a) => sum + a.currentHp / a.pet.stats.maxHp, 0) / allies.length;
      if (avgHpPercent < 0.5) {
        score += 100; // Urgent healing needed
      }
    }

    // Buff value
    const buffEffect = ability.effects.find((e: AbilityEffect) => e.type === 'buff');
    if (buffEffect) {
      score += 40;
    }

    // Energy efficiency
    const energyCost = ability.energyCost || 0;
    score -= energyCost * 0.3;

    // AoE bonus
    if (targets.length > 1) {
      score += targets.length * 15;
    }

    return score;
  }

}




