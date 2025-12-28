/**
 * Pet Entity
 * Core domain entity representing a pet
 */
/**
 * Pet - Runtime entity
 */
export class Pet {
    id;
    basePetId;
    name;
    nickname;
    family;
    rarity;
    stats;
    passiveAbilities;
    activeAbilities;
    ultimateAbility;
    fusionHistory;
    appearance;
    battleStats;
    collectionDate;
    lore;
    constructor(id, basePetId, name, nickname, family, rarity, stats, passiveAbilities, activeAbilities, ultimateAbility, fusionHistory, appearance, battleStats, collectionDate, lore = '' // Lore for fused pets, empty for base pets
    ) {
        this.id = id;
        this.basePetId = basePetId;
        this.name = name;
        this.nickname = nickname;
        this.family = family;
        this.rarity = rarity;
        this.stats = stats;
        this.passiveAbilities = passiveAbilities;
        this.activeAbilities = activeAbilities;
        this.ultimateAbility = ultimateAbility;
        this.fusionHistory = fusionHistory;
        this.appearance = appearance;
        this.battleStats = battleStats;
        this.collectionDate = collectionDate;
        this.lore = lore;
        this.validate();
    }
    validate() {
        if (!this.id)
            throw new Error('Pet must have an ID');
        if (this.passiveAbilities.length < 0) {
            throw new Error('Pet cannot have negative passive abilities');
        }
        if (this.activeAbilities.length < 1) {
            throw new Error('Pet must have at least one active ability');
        }
    }
    /**
     * Check if this pet is a base pet (not fused)
     */
    isBasePet() {
        return this.fusionHistory.length === 0 && this.basePetId !== null;
    }
    /**
     * Check if this pet is fused
     */
    isFused() {
        return this.fusionHistory.length > 0;
    }
    /**
     * Get generation number (0 for base pets)
     */
    getGeneration() {
        if (this.fusionHistory.length === 0)
            return 0;
        return Math.max(...this.fusionHistory.map((h) => h.generation));
    }
    /**
     * Get total mutation count from all fusions
     */
    getTotalMutations() {
        return this.fusionHistory.reduce((sum, h) => sum + h.mutationCount, 0);
    }
}
//# sourceMappingURL=Pet.js.map