/**
 * Base Pet Repository Implementation (IndexedDB)
 */

import type { IBasePetRepository } from '@/domain/repositories/IBasePetRepository';
import type { BasePet } from '@/domain/entities/BasePet';
import type { BasePetId } from '@/shared/types/brands';
import type { Rarity } from '@/shared/types/rarity';
import type { PetFamily } from '@/shared/types/family';
import { openDatabase } from '../schema';
import { basePetToDTO, dtoToBasePet } from '../mappers/BasePetMapper';

export class BasePetRepository implements IBasePetRepository {
  async findById(id: BasePetId): Promise<BasePet | null> {
    const db = await openDatabase();
    const dto = await db.get('basePets', id);
    return dto ? dtoToBasePet(dto) : null;
  }

  async findAll(): Promise<BasePet[]> {
    const db = await openDatabase();
    const dtos = await db.getAll('basePets');
    return dtos.map(dtoToBasePet);
  }

  async findByFamily(family: PetFamily): Promise<BasePet[]> {
    const db = await openDatabase();
    const allBasePets = await db.getAll('basePets');
    return allBasePets.filter((dto) => dto.family === family).map(dtoToBasePet);
  }

  async findByRarity(rarity: Rarity): Promise<BasePet[]> {
    const db = await openDatabase();
    const allBasePets = await db.getAll('basePets');
    return allBasePets.filter((dto) => dto.rarity === rarity).map(dtoToBasePet);
  }

  async getRandomByRarity(
    rarity: Rarity,
    excludeIds: Set<BasePetId> = new Set()
  ): Promise<BasePet | null> {
    const allByRarity = await this.findByRarity(rarity);
    const available = allByRarity.filter((pet) => !excludeIds.has(pet.id));

    if (available.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  async exists(id: BasePetId): Promise<boolean> {
    const db = await openDatabase();
    const dto = await db.get('basePets', id);
    return dto !== undefined;
  }

  async count(): Promise<number> {
    const db = await openDatabase();
    return db.count('basePets');
  }

  /**
   * Save base pet (for initialization/seed data)
   */
  async save(basePet: BasePet): Promise<void> {
    const db = await openDatabase();
    const dto = basePetToDTO(basePet);
    await db.put('basePets', dto);
  }
}



