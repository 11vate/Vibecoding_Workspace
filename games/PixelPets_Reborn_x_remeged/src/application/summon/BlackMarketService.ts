import { Pet } from '@/domain/entities/Pet';
import { BasePet } from '@/domain/entities/BasePet';
import { Stone, StoneType, StoneTier, StoneStatBonuses } from '@/domain/entities/Stone';
import { Rarity, RARITY_CONFIG } from '@/shared/types/rarity';
import { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import { IBasePetRepository } from '@/domain/repositories/IBasePetRepository';
import { IPetRepository } from '@/domain/repositories/IPetRepository';
import { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import { PetId, BasePetId, AbilityId, StoneId } from '@/shared/types/brands';
import { Stats } from '@/domain/valueObjects/Stats';
import { Ability } from '@/domain/entities/Ability';
import { PetVisualGenome } from '@/domain/entities/VisualGenome';
import { VisualGenomeGenerator } from '@/domain/services/VisualGenomeGenerator';

export type ListingType = 'pet' | 'stone';

export interface BlackMarketListing {
  id: string;
  type: ListingType;
  name: string;
  price: number;
  expiresAt: number;
  rarity: Rarity; // For display purposes

  // Pet specific
  basePetId?: string;
  family?: string;
  visualTags?: string[];
  visualGenome?: PetVisualGenome;
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };

  // Stone specific
  stoneType?: StoneType;
  stoneTier?: StoneTier;
  stoneStats?: StoneStatBonuses;
  elementalPower?: number;
}

export class BlackMarketService {
  constructor(
    private playerRepository: IPlayerRepository,
    private basePetRepository: IBasePetRepository,
    private petRepository: IPetRepository,
    private stoneRepository: IStoneRepository
  ) {}

  /**
   * Get daily listings based on seed (Date)
   */
  async getDailyListings(): Promise<BlackMarketListing[]> {
    const today = new Date().toISOString().split('T')[0];
    const seed = this.stringToNumber(today);
    const rng = this.createRNG(seed);

    const allPets = await this.basePetRepository.findAll();
    const listings: BlackMarketListing[] = [];
    
    // Generate 3-5 Pet listings
    if (allPets.length > 0) {
      const petCount = 3 + Math.floor(rng() * 3);
      for (let i = 0; i < petCount; i++) {
        const basePet = allPets[Math.floor(rng() * allPets.length)];
        const mutationFactor = 1.2 + (rng() * 0.5); // 20% to 70% stat boost

        // Generate visual genome for the hacked pet
        const visualGenome = VisualGenomeGenerator.generateFromBase(
          basePet,
          `hacked-${today}-${i}`,
          ['glitched', 'hacked']
        );

        listings.push({
          id: `listing-${today}-pet-${i}`,
          type: 'pet',
          basePetId: basePet.id,
          name: `Glitch-${basePet.name}`,
          rarity: basePet.rarity,
          family: basePet.family,
          visualTags: ['glitched', 'hacked'],
          visualGenome,
          price: Math.floor(RARITY_CONFIG[basePet.rarity].summonCost * 10 * mutationFactor),
          stats: {
            hp: Math.floor(basePet.baseStats.hp * mutationFactor),
            attack: Math.floor(basePet.baseStats.attack * mutationFactor),
            defense: Math.floor(basePet.baseStats.defense * (mutationFactor * 0.8)), // Defense penalty for hacked pets
            speed: Math.floor(basePet.baseStats.speed * mutationFactor),
          },
          expiresAt: new Date().setHours(23, 59, 59, 999)
        });
      }
    }

    // Generate 1-2 Stone listings
    const stoneCount = 1 + Math.floor(rng() * 2);
    for (let i = 0; i < stoneCount; i++) {
      const tier = rng() > 0.8 ? StoneTier.V : (rng() > 0.5 ? StoneTier.IV : StoneTier.III);
      const types = Object.values(StoneType);
      const type = types[Math.floor(rng() * types.length)];
      
      const stats: StoneStatBonuses = {};
      if (rng() > 0.5) stats.attack = Math.floor(rng() * 5 * tier);
      if (rng() > 0.5) stats.defense = Math.floor(rng() * 5 * tier);
      if (rng() > 0.5) stats.speed = Math.floor(rng() * 5 * tier);
      if (rng() > 0.5) stats.hp = Math.floor(rng() * 20 * tier);

      // Map Tier to Rarity for display
      const rarity = tier === StoneTier.V ? 5 : (tier === StoneTier.IV ? 4 : 3);

      listings.push({
        id: `listing-${today}-stone-${i}`,
        type: 'stone',
        name: `Illegal ${type} Core`,
        rarity: rarity as Rarity,
        price: 500 * tier * (1 + rng()), // Expensive
        stoneType: type,
        stoneTier: tier,
        stoneStats: stats,
        elementalPower: 10 * tier,
        expiresAt: new Date().setHours(23, 59, 59, 999)
      });
    }

    return listings;
  }

  /**
   * Purchase a listing from the Black Market
   */
  async purchaseListing(playerId: string, listingId: string): Promise<Pet | Stone> {
    const player = await this.playerRepository.findById(playerId);
    if (!player) throw new Error('Player not found');

    const listings = await this.getDailyListings();
    const listing = listings.find(l => l.id === listingId);

    if (!listing) throw new Error('Listing not available');
    if (!player.hasEnoughBytes(listing.price)) throw new Error('Insufficient Corrupted Bytes');

    // Deduct currency
    const updatedPlayer = player.withCurrencies(
      player.dataKeys,
      player.corruptedBytes - listing.price
    );
    await this.playerRepository.save(updatedPlayer);

    if (listing.type === 'pet') {
      // Create the Hacked Pet
      const basePet = await this.basePetRepository.findById(listing.basePetId as BasePetId);
      if (!basePet) throw new Error('Base pet not found');
      const newPet = await this.createHackedPet(basePet, listing, playerId);
      await this.petRepository.save(newPet);
      return newPet;
    } else {
      // Create the Illegal Stone
      const stone = new Stone(
        crypto.randomUUID() as StoneId,
        playerId,
        listing.stoneType!,
        listing.stoneTier!,
        listing.stoneStats!,
        listing.elementalPower!,
        true, // isGlitched
        Date.now()
      );
      await this.stoneRepository.save(stone);
      return stone;
    }
  }

  private stringToNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private createRNG(seed: number): () => number {
    return function() {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  }

  private async createHackedPet(basePet: BasePet, listing: BlackMarketListing, ownerId: string): Promise<Pet> {
    const id = crypto.randomUUID() as PetId;
    
    // Use the boosted stats from the listing
    const stats = Stats.create(
      listing.stats!.hp, // Current HP
      listing.stats!.hp, // Max HP
      listing.stats!.attack,
      listing.stats!.defense,
      listing.stats!.speed
    );

    const dummyAbility = new Ability(
        'ability-glitch-strike' as AbilityId,
        'Glitch Strike',
        'Unstable attack',
        'active',
        10, // cost
        2, // cooldown
        0, // current cooldown
        [{ type: 'damage', target: 'single-enemy', value: 25 }],
              ['glitched'],
              null
          );

    return new Pet(
      id,
      ownerId,
      basePet.id,
      `Glitch-${basePet.name}`, // Hacked name prefix
      null, // nickname
      basePet.family,
      basePet.rarity,
      stats,
      [], // placeholders
      [dummyAbility],
      null,
      [],
      {
        visualTags: [...basePet.visualTags, 'glitched', 'hacked'],
        particleEffect: 'glitch_sparks',
        visualGenome: listing.visualGenome
      },
      null,
      Date.now(),
      true, // isHacked = true
      "Illegally modified genetic code. Unstable but powerful."
    );
  }
}
