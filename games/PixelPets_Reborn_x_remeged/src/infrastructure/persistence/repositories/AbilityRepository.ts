/**
 * Ability Repository Implementation (IndexedDB)
 */

import type { IAbilityRepository } from '@/domain/repositories/IAbilityRepository';
import type { Ability } from '@/domain/entities/Ability';
import type { AbilityId } from '@/shared/types/brands';
import { openDatabase } from '../schema';
import { abilityToDTO, dtoToAbility } from '../mappers/AbilityMapper';

export class AbilityRepository implements IAbilityRepository {
  async findById(id: AbilityId): Promise<Ability | null> {
    const db = await openDatabase();
    const dto = await db.get('abilities', id);
    return dto ? dtoToAbility(dto) : null;
  }

  async findAll(): Promise<Ability[]> {
    const db = await openDatabase();
    const dtos = await db.getAll('abilities');
    return dtos.map(dtoToAbility);
  }

  async findByType(type: 'passive' | 'active' | 'ultimate'): Promise<Ability[]> {
    const db = await openDatabase();
    const allAbilities = await db.getAll('abilities');
    return allAbilities.filter((dto) => dto.type === type).map(dtoToAbility);
  }

  async findByElement(element: string): Promise<Ability[]> {
    const db = await openDatabase();
    const allAbilities = await db.getAll('abilities');
    return allAbilities.filter((dto) => dto.element === element).map(dtoToAbility);
  }

  async findByTags(tags: string[]): Promise<Ability[]> {
    const db = await openDatabase();
    const allAbilities = await db.getAll('abilities');
    return allAbilities
      .filter((dto) => tags.some((tag) => dto.tags.includes(tag)))
      .map(dtoToAbility);
  }

  async findByName(name: string): Promise<Ability | null> {
    const db = await openDatabase();
    const allAbilities = await db.getAll('abilities');
    const dto = allAbilities.find((a) => a.name === name);
    return dto ? dtoToAbility(dto) : null;
  }

  async save(ability: Ability): Promise<void> {
    const db = await openDatabase();
    const dto = abilityToDTO(ability);
    await db.put('abilities', dto);
  }

  async delete(id: AbilityId): Promise<void> {
    const db = await openDatabase();
    await db.delete('abilities', id);
  }

  async exists(id: AbilityId): Promise<boolean> {
    const db = await openDatabase();
    const dto = await db.get('abilities', id);
    return dto !== undefined;
  }

  async count(): Promise<number> {
    const db = await openDatabase();
    return db.count('abilities');
  }
}



