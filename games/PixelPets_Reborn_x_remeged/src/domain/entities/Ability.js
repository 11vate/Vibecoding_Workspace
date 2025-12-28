/**
 * Ability Entity
 * Represents a pet ability (passive, active, or ultimate)
 */
export class Ability {
    id;
    name;
    description;
    type;
    energyCost;
    cooldown;
    currentCooldown;
    effects;
    tags;
    element;
    constructor(id, name, description, type, energyCost, cooldown, currentCooldown, effects, tags, element) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.energyCost = energyCost;
        this.cooldown = cooldown;
        this.currentCooldown = currentCooldown;
        this.effects = effects;
        this.tags = tags;
        this.element = element;
        this.validate();
    }
    validate() {
        if (!this.id)
            throw new Error('Ability must have an ID');
        if (!this.name)
            throw new Error('Ability must have a name');
        if (!this.description)
            throw new Error('Ability must have a description');
        if (this.type === 'passive' && this.energyCost !== null) {
            throw new Error('Passive abilities cannot have energy cost');
        }
        if (this.type === 'passive' && this.cooldown !== null) {
            throw new Error('Passive abilities cannot have cooldown');
        }
        if (this.type !== 'passive' && this.energyCost === null) {
            throw new Error('Active and ultimate abilities must have energy cost');
        }
        if (this.energyCost !== null && this.energyCost < 0) {
            throw new Error('Energy cost cannot be negative');
        }
        if (this.cooldown !== null && this.cooldown < 0) {
            throw new Error('Cooldown cannot be negative');
        }
        if (this.effects.length === 0) {
            throw new Error('Ability must have at least one effect');
        }
    }
    /**
     * Check if ability is available (cooldown ready, has energy)
     */
    isAvailable(currentEnergy) {
        if (this.type === 'passive')
            return true;
        if (this.energyCost !== null && currentEnergy < this.energyCost)
            return false;
        if (this.currentCooldown !== null && this.currentCooldown > 0)
            return false;
        return true;
    }
    /**
     * Create a copy with updated cooldown
     */
    withCooldown(cooldown) {
        return new Ability(this.id, this.name, this.description, this.type, this.energyCost, this.cooldown, cooldown, this.effects, this.tags, this.element);
    }
    /**
     * Create a copy with cooldown reduced
     */
    reduceCooldown(amount = 1) {
        if (this.currentCooldown === null)
            return this;
        const newCooldown = Math.max(0, this.currentCooldown - amount);
        return this.withCooldown(newCooldown);
    }
}
//# sourceMappingURL=Ability.js.map