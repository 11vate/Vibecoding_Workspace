/**
 * Lineage Service
 * Calculates ancestral influence and generates lineage-based modifiers
 */

import type { Pet } from '../entities/Pet';
import { PetFamily, FAMILY_CONFIGS } from '@/shared/types/family';

export interface LineageInfluence {
  elementCounts: Record<string, number>;
  totalAncestors: number;
  dominantElement: string;
  generationDepth: number;
  diversityScore: number; // 0-1, how mixed the lineage is
}

export interface LineageModifier {
  type: 'damage_boost' | 'healing_boost' | 'defense_boost' | 'speed_boost' | 'crit_chance' | 'evasion';
  element?: string;
  value: number; // Percentage (e.g., 0.1 for 10%)
  source: string; // Name of the ancestral ability
}

export class LineageService {
  /**
   * Calculate the elemental influence of a pet's lineage
   */
  static calculateInfluence(pet: Pet): LineageInfluence {
    const elementCounts: Record<string, number> = {};
    let totalAncestors = 0;

    // Iterate through fusion history
    // Note: fusionHistory stores parents of THAT generation. 
    // A pet with 5 generations has 5 history entries, representing the fusion events that led to it.
    // Each entry has 2 parents.
    
    for (const history of pet.fusionHistory) {
      if (history.parentFamilies) {
        for (const family of history.parentFamilies) {
          const element = this.getFamilyElement(family);
          elementCounts[element] = (elementCounts[element] || 0) + 1;
          totalAncestors++;
        }
      }
    }

    // Determine dominant element
    let dominantElement = 'neutral';
    let maxCount = 0;
    
    for (const [element, count] of Object.entries(elementCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantElement = element;
      }
    }

    // Calculate diversity (unique elements / total ancestors)
    const uniqueElements = Object.keys(elementCounts).length;
    const diversityScore = totalAncestors > 0 ? uniqueElements / totalAncestors : 0;

    return {
      elementCounts,
      totalAncestors,
      dominantElement,
      generationDepth: pet.fusionHistory.length,
      diversityScore,
    };
  }

  /**
   * Get active lineage modifiers based on ancestral influence
   */
  static getLineageModifiers(pet: Pet): LineageModifier[] {
    const influence = this.calculateInfluence(pet);
    const modifiers: LineageModifier[] = [];

    // 1. Pyro-Kin (Fire) - Ancestral Ember
    // +2% Fire Damage per Fire Ancestor
    const fireCount = influence.elementCounts['Fire'] || 0;
    if (fireCount > 0) {
      modifiers.push({
        type: 'damage_boost',
        element: 'fire',
        value: 0.02 * fireCount,
        source: 'Ancestral Ember',
      });
    }

    // 2. Aqua-Born (Water) - Tidal Heritage
    // +5% Healing Power if 3+ Water Ancestors
    const waterCount = influence.elementCounts['Water'] || 0;
    if (waterCount >= 3) {
      modifiers.push({
        type: 'healing_boost',
        value: 0.05 + (waterCount - 3) * 0.02, // +2% for each additional
        source: 'Tidal Heritage',
      });
    }

    // 3. Terra-Forged (Earth) - Steadfast Lineage
    // +3% Defense per Earth Ancestor
    const earthCount = influence.elementCounts['Earth'] || 0;
    if (earthCount > 0) {
      modifiers.push({
        type: 'defense_boost',
        value: 0.03 * earthCount,
        source: 'Steadfast Lineage',
      });
    }

    // 4. Volt-Stream (Lightning) - Speed of Kin
    // +2% Speed per Lightning Ancestor
    const lightningCount = influence.elementCounts['Lightning'] || 0;
    if (lightningCount > 0) {
      modifiers.push({
        type: 'speed_boost',
        value: 0.02 * lightningCount,
        source: 'Speed of Kin',
      });
    }

    // 5. Shadow-Veil (Shadow) - Ancestral Veil
    // +1% Evasion per Shadow Ancestor (Max 15%)
    const shadowCount = influence.elementCounts['Shadow'] || 0;
    if (shadowCount > 0) {
      modifiers.push({
        type: 'evasion',
        value: Math.min(0.15, 0.01 * shadowCount),
        source: 'Ancestral Veil',
      });
    }

    // 6. Lumina (Light) - Divine Blood
    // +5% Crit Chance if Dominant Element is Light
    if (influence.dominantElement === 'Light' && influence.elementCounts['Light'] >= 3) {
      modifiers.push({
        type: 'crit_chance',
        value: 0.05 + (influence.elementCounts['Light'] * 0.01),
        source: 'Divine Blood',
      });
    }

    // 7. Ancient Lineage Bonus (Generic)
    // Small all-stat boost for deep lineages (Gen 10+)
    if (influence.generationDepth >= 10) {
      modifiers.push({
        type: 'damage_boost',
        value: 0.1,
        source: 'Ancient Bloodline',
      });
      modifiers.push({
        type: 'defense_boost',
        value: 0.1,
        source: 'Ancient Bloodline',
      });
    }

    return modifiers;
  }

  /**
   * Helper to map family to primary element
   */
  private static getFamilyElement(family: PetFamily): string {
    const config = FAMILY_CONFIGS[family];
    if (!config) return 'Neutral';
    // Use the first theme as the primary element key
    // Map themes to standard element names if needed
    const primaryTheme = config.themes[0];
    
    // Normalize to standard elements
    switch (primaryTheme) {
      case 'Fire': return 'Fire';
      case 'Water': return 'Water';
      case 'Earth': return 'Earth';
      case 'Lightning': return 'Lightning';
      case 'Shadow': return 'Shadow';
      case 'Light': return 'Light';
      case 'Metal': return 'Metal';
      case 'Arcane': return 'Arcane';
      case 'Air': return 'Air';
      case 'Chaos': return 'Chaos';
      default: return primaryTheme;
    }
  }
}
