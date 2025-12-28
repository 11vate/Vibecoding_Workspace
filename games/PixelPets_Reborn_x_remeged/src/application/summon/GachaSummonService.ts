import { BasePet } from '@/domain/entities/BasePet';
import { Pet } from '@/domain/entities/Pet';
import { Rarity, RARITY_CONFIG } from '@/shared/types/rarity';
import type { IBasePetRepository } from '@/domain/repositories/IBasePetRepository';
import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import type { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import { PetId, AbilityId } from '@/shared/types/brands';
import { Stats } from '../../domain/valueObjects/Stats';
import { Ability } from '../../domain/entities/Ability';

export class GachaSummonService {
  private readonly SUMMON_COST = 10; // Data Keys
  private readonly PITY_THRESHOLD = 90; // Guaranteed Legendary at 90
  private readonly SOFT_PITY_THRESHOLD = 10; // Guaranteed SR+ at 10

  constructor(
    private playerRepository: IPlayerRepository,
    private basePetRepository: IBasePetRepository,
    private petRepository: IPetRepository
  ) {}

  /**
   * Perform a batch summon (10x)
   */
  async summonBatch(playerId: string, count: number = 10): Promise<Pet[]> {
    const player = await this.playerRepository.findById(playerId);
    if (!player) throw new Error('Player not found');

    const totalCost = this.SUMMON_COST * count;
    if (!player.hasEnoughKeys(totalCost)) {
      throw new Error(`Insufficient Data Keys. Need ${totalCost}, have ${player.dataKeys}`);
    }

    const pets: Pet[] = [];
    for (let i = 0; i < count; i++) {
      // We process each summon individually to handle pity updates correctly per pull
      // Note: This is slightly inefficient database-wise but safer for logic
      const pet = await this.summon(playerId); 
      pets.push(pet);
    }
    return pets;
  }

  /**
   * Perform a single summon
   */
  async summon(playerId: string): Promise<Pet> {
    const player = await this.playerRepository.findById(playerId);
    if (!player) throw new Error('Player not found');

    if (!player.hasEnoughKeys(this.SUMMON_COST)) {
      throw new Error('Insufficient Data Keys');
    }

    // Update player currency
    const updatedPlayer = player.withCurrencies(
      player.dataKeys - this.SUMMON_COST,
      player.corruptedBytes
    );
    
    // Determine rarity based on pity and RNG
    const rarity = this.determineRarity(updatedPlayer.pityCounter);
    
    // Reset pity if Legendary, otherwise increment
    const newPity = rarity >= Rarity.LEGENDARY ? 0 : updatedPlayer.pityCounter + 1;
    await this.playerRepository.save(updatedPlayer.withPityCounter(newPity));

    // Select a random pet of the determined rarity
    const basePet = await this.getRandomBasePet(rarity);
    
    // Create pet
    const pet = await this.createSummonedPet(basePet, rarity, false, playerId);
    await this.petRepository.save(pet);

    return pet;
  }

  /**
   * Determine the rarity of the summon
   */
  private determineRarity(pityCounter: number): Rarity {
    // Hard Pity: Guaranteed Legendary
    if (pityCounter >= this.PITY_THRESHOLD - 1) {
      return Rarity.LEGENDARY;
    }

    // Soft Pity: Guaranteed SR+ every 10 pulls
    const isSoftPity = (pityCounter + 1) % this.SOFT_PITY_THRESHOLD === 0;

    const roll = Math.random();
    let cumulativeRate = 0;

    // Iterate through rarities (highest to lowest for easier logic, or standard accumulation)
    // Using the config drop rates.
    // Note: We need to normalize or ensure they sum to 1.
    // Based on RARITY_CONFIG:
    // Basic: 0.45, Rare: 0.30, SR: 0.15, Legendary: 0.08, Mythic: 0.019
    // Total ~ 0.999.

    const rarities = [
      Rarity.MYTHIC,
      Rarity.LEGENDARY,
      Rarity.SR,
      Rarity.RARE,
      Rarity.BASIC
    ];

    for (const r of rarities) {
      const config = RARITY_CONFIG[r];
      let rate = config.dropRate;

      // Boost rates for Soft Pity (simple implementation: remove Basic/Rare from pool or boost SR)
      if (isSoftPity && r < Rarity.SR) {
        rate = 0; // Cannot get Basic/Rare on soft pity
      }

      cumulativeRate += rate;
      if (roll < cumulativeRate) {
        return r;
      }
    }

    // Fallback
    return isSoftPity ? Rarity.SR : Rarity.BASIC;
  }

  /**
   * Get a random base pet of the specified rarity
   */
  private async getRandomBasePet(rarity: Rarity): Promise<BasePet> {
    const pets = await this.basePetRepository.findByRarity(rarity);
    if (pets.length === 0) {
        // Fallback if no pets of that rarity exist yet
        const lowerRarityPets = await this.basePetRepository.findByRarity(rarity - 1);
        if (lowerRarityPets.length === 0) throw new Error(`No pets found for rarity ${rarity} or lower`);
        return lowerRarityPets[Math.floor(Math.random() * lowerRarityPets.length)];
    }
    return pets[Math.floor(Math.random() * pets.length)];
  }

  /**
   * Create a runtime Pet instance from a BasePet
   */
  private async createSummonedPet(basePet: BasePet, _rarity: Rarity, _pityActive: boolean, playerId: string): Promise<Pet> {
    const id = crypto.randomUUID() as PetId;
    
    // Calculate initial stats with some variance (IVs)
    const ivs = {
        hp: Math.random() * 0.1, // 0-10% bonus
        attack: Math.random() * 0.1,
        defense: Math.random() * 0.1,
        speed: Math.random() * 0.1,
    };

    const maxHp = Math.floor(basePet.baseStats.hp * (1 + ivs.hp));
    const stats = Stats.create(
        maxHp, // Current HP
        maxHp, // Max HP
        Math.floor(basePet.baseStats.attack * (1 + ivs.attack)),
        Math.floor(basePet.baseStats.defense * (1 + ivs.defense)),
        Math.floor(basePet.baseStats.speed * (1 + ivs.speed))
    );

    // TODO: Map abilities properly. For now assuming base pet strings map to Ability objects or similar.
    // Since Pet constructor expects Ability objects, and BasePet has strings (IDs), 
    // we would typically need an AbilityRepository here to fetch them.
    // For this implementation, I will create placeholder/mock abilities or need to inject AbilityRepository.
    
    const dummyAbility = new Ability(
        'ability-scratch' as AbilityId,
        'Scratch',
        'Basic scratch attack',
        'active',
        0, // cost
        0, // cooldown
        0, // current cooldown
        [{ type: 'damage', target: 'single-enemy', value: 10 }],
        ['physical'],
        null
    );
    
    return new Pet(
        id,
        playerId,
        basePet.id,
        basePet.name,
        null, // nickname
        basePet.family,
        basePet.rarity,
        stats,
        [], // passiveAbilities
        [dummyAbility], // activeAbilities
        null, // ultimateAbility
        [], // fusionHistory
        {
            visualTags: [...basePet.visualTags],
        }, // appearance
        null, // battleStats
        Date.now(),
        false, // isHacked
        basePet.lore
    );
  }
}
