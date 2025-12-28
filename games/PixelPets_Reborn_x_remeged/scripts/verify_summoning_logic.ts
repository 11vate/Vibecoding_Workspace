
// Mock Interfaces locally since we are running in a script
import { GachaSummonService } from '../src/application/summon/GachaSummonService';
import { BlackMarketService } from '../src/application/summon/BlackMarketService';
import { Player } from '../src/domain/entities/Player';
import { BasePet } from '../src/domain/entities/BasePet';
import { Pet } from '../src/domain/entities/Pet';
import { Rarity } from '../src/shared/types/rarity';

// Mock Repositories
const mockPlayerRepo = {
    findById: async (id: string) => {
        return new Player(
            id,
            "TestUser",
            { [Rarity.BASIC]: 0, [Rarity.RARE]: 0, [Rarity.SR]: 0, [Rarity.LEGENDARY]: 0, [Rarity.MYTHIC]: 0, [Rarity.PRISMATIC]: 0, [Rarity.OMEGA]: 0 },
            10000, // Data Keys
            5000, // Corrupted Bytes
            0, // Pity
            1,
            [],
            [],
            Date.now()
        );
    },
    update: async (player: Player) => {
        // console.log(`[Mock] Player updated. Keys: ${player.dataKeys}, Pity: ${player.pityCounter}`);
    },
    getById: async (id: string) => { // Alias for backward compatibility if needed by other tests not shown
        return mockPlayerRepo.findById(id);
    }
};

const mockBasePetRepo = {
    findByRarity: async (rarity: Rarity) => {
        return [{
            id: `base-${rarity}`,
            name: `BasePet-${rarity}`,
            family: 'pyro',
            rarity: rarity,
            baseStats: { hp: 100, attack: 10, defense: 10, speed: 10 },
            starterAbilities: [],
            starterPassives: [],
            visualTags: [],
            lore: "Mock Lore"
        } as unknown as BasePet];
    },
    findById: async (id: string) => {
        return {
            id: id,
            name: "MockBasePet",
            family: 'pyro',
            rarity: Rarity.BASIC,
            baseStats: { hp: 100, attack: 10, defense: 10, speed: 10 },
            starterAbilities: [],
            starterPassives: [],
            visualTags: [],
            lore: "Mock Lore"
        } as unknown as BasePet;
    },
    findAll: async () => {
         return [{
            id: `base-random`,
            name: `BasePet-Random`,
            family: 'pyro',
            rarity: Rarity.BASIC,
            baseStats: { hp: 100, attack: 10, defense: 10, speed: 10 },
            starterAbilities: [],
            starterPassives: [],
            visualTags: [],
            lore: "Mock Lore"
        } as unknown as BasePet];
    },
    // Aliases for compatibility with any old code in this script
    getByRarity: async (rarity: Rarity) => mockBasePetRepo.findByRarity(rarity),
    getById: async (id: string) => mockBasePetRepo.findById(id),
    getAll: async () => mockBasePetRepo.findAll()
};

const mockPetRepo = {
    save: async (pet: Pet) => {
        // console.log(`[Mock] Pet saved: ${pet.name} (Rarity: ${pet.rarity})`);
    }
};

async function runTests() {
    console.log("=== Starting Summoning System Verification ===");

    // 1. Gacha Test
    const gacha = new GachaSummonService(mockPlayerRepo as any, mockBasePetRepo as any, mockPetRepo as any);
    const results: Record<number, number> = {};
    
    console.log("\n--- Simulating 100 Gacha Pulls ---");
    for (let i = 0; i < 100; i++) {
        try {
            const pet = await gacha.summon("test-user");
            results[pet.rarity] = (results[pet.rarity] || 0) + 1;
        } catch (e) {
            console.error(e);
        }
    }
    console.log("Rarity Distribution:", results);

    // 2. Black Market Test
    const market = new BlackMarketService(mockPlayerRepo as any, mockBasePetRepo as any, mockPetRepo as any);
    console.log("\n--- Checking Black Market Listings ---");
    const listings = await market.getDailyListings();
    console.log(`Generated ${listings.length} listings.`);
    if (listings.length > 0) {
        console.log("Sample Listing:", listings[0]);
        
        console.log("\n--- Purchasing Item ---");
        const pet = await market.purchaseListing("test-user", listings[0].id);
        console.log(`Purchased: ${pet.name}`);
        console.log(`Is Hacked: ${pet.isHacked}`);
        console.log(`Stats: HP ${pet.stats.hp} (Base: 100)`);
    }

    console.log("\n=== Verification Complete ===");
}

runTests().catch(console.error);
