/**
 * Validate Fusion Use Case
 * Validates that a fusion can be performed
 */

import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';

export interface FusionValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate Fusion Use Case
 */
export class ValidateFusion {
  constructor(
    private petRepository: IPetRepository,
    private stoneRepository: IStoneRepository
  ) {}

  async execute(
    parent1Id: string,
    parent2Id: string,
    stone1Id: string,
    stone2Id: string
  ): Promise<FusionValidationResult> {
    const errors: string[] = [];

    // Check that IDs are different
    if (parent1Id === parent2Id) {
      errors.push('Cannot fuse a pet with itself');
    }

    // Check that stones are different
    if (stone1Id === stone2Id) {
      errors.push('Cannot use the same stone twice');
    }

    // Check that pets exist
    const parent1 = await this.petRepository.findById(parent1Id as any);
    const parent2 = await this.petRepository.findById(parent2Id as any);

    if (!parent1) {
      errors.push(`Parent 1 (${parent1Id}) not found`);
    }

    if (!parent2) {
      errors.push(`Parent 2 (${parent2Id}) not found`);
    }

    // Check that stones exist
    const stone1 = await this.stoneRepository.findById(stone1Id as any);
    const stone2 = await this.stoneRepository.findById(stone2Id as any);

    if (!stone1) {
      errors.push(`Stone 1 (${stone1Id}) not found`);
    }

    if (!stone2) {
      errors.push(`Stone 2 (${stone2Id}) not found`);
    }

    // Additional validations if pets and stones exist
    if (parent1 && parent2 && stone1 && stone2) {
      // Check if pets are different (already checked above, but ensure they're different entities)
      if (parent1.id === parent2.id) {
        errors.push('Cannot fuse a pet with itself');
      }

      // Check that pets are owned (they should exist in repository, so this is implicit)
      // Future: Could check if pets are locked or in active teams
    }

    // Validate that all inputs are provided
    if (!parent1Id || !parent2Id || !stone1Id || !stone2Id) {
      errors.push('All fusion inputs (2 pets, 2 stones) must be provided');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}





