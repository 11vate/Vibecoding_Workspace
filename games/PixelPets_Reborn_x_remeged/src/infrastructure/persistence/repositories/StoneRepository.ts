/**
 * Stone Repository Implementation (IndexedDB)
 */

import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import type { Stone, StoneType, StoneTier } from '@/domain/entities/Stone';
import type { StoneId } from '@/shared/types/brands';
import { openDatabase } from '../schema';
import type { StoneDTO } from '../schema';
import { Stone as StoneEntity } from '@/domain/entities/Stone';
import { brandStoneId } from '@/shared/types/brands';

export class StoneRepository implements IStoneRepository {
  async findById(id: StoneId): Promise<Stone | null> {
    const db = await openDatabase();
    const dto = await db.get('stones', id);
    return dto ? this.dtoToStone(dto) : null;
  }

  async findAll(): Promise<Stone[]> {
    const db = await openDatabase();
    const dtos = await db.getAll('stones');
    return dtos.map((dto) => this.dtoToStone(dto));
  }

  async findByType(type: StoneType): Promise<Stone[]> {
    const db = await openDatabase();
    const dtos = await db.getAllFromIndex('stones', 'by-type', type);
    return dtos.map((dto) => this.dtoToStone(dto));
  }

  async findByTier(tier: StoneTier): Promise<Stone[]> {
    const db = await openDatabase();
    const dtos = await db.getAllFromIndex('stones', 'by-tier', tier);
    return dtos.map((dto) => this.dtoToStone(dto));
  }

  async findByPlayerId(playerId: string): Promise<Stone[]> {
    const db = await openDatabase();
    const dtos = await db.getAllFromIndex('stones', 'by-player', playerId);
    return dtos.map((dto) => this.dtoToStone(dto));
  }

  async save(stone: Stone): Promise<void> {
    const db = await openDatabase();
    const dto = this.stoneToDTO(stone);
    await db.put('stones', dto);
  }

  async delete(id: StoneId): Promise<void> {
    const db = await openDatabase();
    await db.delete('stones', id);
  }

  async exists(id: StoneId): Promise<boolean> {
    const db = await openDatabase();
    const dto = await db.get('stones', id);
    return dto !== undefined;
  }

  async count(): Promise<number> {
    const db = await openDatabase();
    return db.count('stones');
  }

  private stoneToDTO(stone: Stone): StoneDTO {
    return {
      id: stone.id,
      playerId: stone.playerId,
      type: stone.type,
      tier: stone.tier,
      statBonuses: { ...stone.statBonuses },
      elementalPower: stone.elementalPower,
      isGlitched: stone.isGlitched,
      obtainedAt: stone.obtainedAt,
    };
  }

  private dtoToStone(dto: StoneDTO): Stone {
    return new StoneEntity(
      brandStoneId(dto.id),
      dto.playerId,
      dto.type,
      dto.tier,
      dto.statBonuses,
      dto.elementalPower,
      dto.isGlitched,
      dto.obtainedAt
    );
  }
}



