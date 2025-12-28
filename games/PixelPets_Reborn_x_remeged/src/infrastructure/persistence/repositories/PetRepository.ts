/**
 * Pet Repository Implementation (IndexedDB)
 */

import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import type { Pet } from '@/domain/entities/Pet';
import type { PetId, BasePetId } from '@/shared/types/brands';
import type { Rarity } from '@/shared/types/rarity';
import type { PetFamily } from '@/shared/types/family';
import { openDatabase } from '../schema';
import { petToDTO, dtoToPet } from '../mappers/PetMapper';
import { brandBasePetId } from '@/shared/types/brands';

export class PetRepository implements IPetRepository {
  async findById(id: PetId): Promise<Pet | null> {
    const db = await openDatabase();
    const dto = await db.get('pets', id);
    return dto ? dtoToPet(dto) : null;
  }

  async findAll(): Promise<Pet[]> {
    const db = await openDatabase();
    const dtos = await db.getAll('pets');
    return dtos.map(dtoToPet);
  }

  async findByFamily(family: PetFamily): Promise<Pet[]> {
    const db = await openDatabase();
    const dtos = await db.getAllFromIndex('pets', 'by-family', family);
    return dtos.map(dtoToPet);
  }

  async findByRarity(rarity: Rarity): Promise<Pet[]> {
    const db = await openDatabase();
    const dtos = await db.getAllFromIndex('pets', 'by-rarity', rarity);
    return dtos.map(dtoToPet);
  }

  async findByPlayerId(playerId: string): Promise<Pet[]> {
    const db = await openDatabase();
    const dtos = await db.getAllFromIndex('pets', 'by-player', playerId);
    return dtos.map(dtoToPet);
  }

  async save(pet: Pet): Promise<void> {
    const db = await openDatabase();
    const dto = petToDTO(pet);
    await db.put('pets', dto);
  }

  async delete(id: PetId): Promise<void> {
    const db = await openDatabase();
    await db.delete('pets', id);
  }

  async exists(id: PetId): Promise<boolean> {
    const db = await openDatabase();
    const dto = await db.get('pets', id);
    return dto !== undefined;
  }

  async count(): Promise<number> {
    const db = await openDatabase();
    return db.count('pets');
  }

  async getOwnedBasePetIds(): Promise<Set<BasePetId>> {
    const db = await openDatabase();
    const allPets = await db.getAll('pets');
    const basePetIds = new Set<BasePetId>();
    
    for (const petDto of allPets) {
      if (petDto.basePetId) {
        basePetIds.add(brandBasePetId(petDto.basePetId));
      }
    }
    
    return basePetIds;
  }
}

