/**
 * Pet Stats Value Object
 * Immutable value object representing pet statistics
 */
export class Stats {
    hp;
    maxHp;
    attack;
    defense;
    speed;
    constructor(hp, maxHp, attack, defense, speed) {
        this.hp = hp;
        this.maxHp = maxHp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.validate();
    }
    static create(hp, maxHp, attack, defense, speed) {
        return new Stats(hp, maxHp, attack, defense, speed);
    }
    static fromObject(stats) {
        return new Stats(stats.hp, stats.maxHp, stats.attack, stats.defense, stats.speed);
    }
    validate() {
        if (this.hp < 0)
            throw new Error('HP cannot be negative');
        if (this.maxHp <= 0)
            throw new Error('Max HP must be positive');
        if (this.hp > this.maxHp)
            throw new Error('HP cannot exceed max HP');
        if (this.attack < 0)
            throw new Error('Attack cannot be negative');
        if (this.defense < 0)
            throw new Error('Defense cannot be negative');
        if (this.speed < 0)
            throw new Error('Speed cannot be negative');
        if (this.speed > 200)
            throw new Error('Speed cannot exceed 200');
    }
    withHp(hp) {
        return new Stats(hp, this.maxHp, this.attack, this.defense, this.speed);
    }
    withMaxHp(maxHp) {
        return new Stats(this.hp, maxHp, this.attack, this.defense, this.speed);
    }
    toObject() {
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            attack: this.attack,
            defense: this.defense,
            speed: this.speed,
        };
    }
    equals(other) {
        return (this.hp === other.hp &&
            this.maxHp === other.maxHp &&
            this.attack === other.attack &&
            this.defense === other.defense &&
            this.speed === other.speed);
    }
}
//# sourceMappingURL=Stats.js.map