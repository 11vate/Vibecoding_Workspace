/**
 * Pet Stats Value Object
 * Immutable value object representing pet statistics
 */

export interface PetStats {
  readonly hp: number;
  readonly maxHp: number;
  readonly attack: number;
  readonly defense: number;
  readonly speed: number;
}

export class Stats {
  private constructor(
    public readonly hp: number,
    public readonly maxHp: number,
    public readonly attack: number,
    public readonly defense: number,
    public readonly speed: number
  ) {
    this.validate();
  }

  static create(
    hp: number,
    maxHp: number,
    attack: number,
    defense: number,
    speed: number
  ): Stats {
    return new Stats(hp, maxHp, attack, defense, speed);
  }

  static fromObject(stats: PetStats): Stats {
    return new Stats(stats.hp, stats.maxHp, stats.attack, stats.defense, stats.speed);
  }

  private validate(): void {
    if (this.hp < 0) throw new Error('HP cannot be negative');
    if (this.maxHp <= 0) throw new Error('Max HP must be positive');
    if (this.hp > this.maxHp) throw new Error('HP cannot exceed max HP');
    if (this.attack < 0) throw new Error('Attack cannot be negative');
    if (this.defense < 0) throw new Error('Defense cannot be negative');
    if (this.speed < 0) throw new Error('Speed cannot be negative');
    if (this.speed > 200) throw new Error('Speed cannot exceed 200');
  }

  withHp(hp: number): Stats {
    return new Stats(hp, this.maxHp, this.attack, this.defense, this.speed);
  }

  withMaxHp(maxHp: number): Stats {
    return new Stats(this.hp, maxHp, this.attack, this.defense, this.speed);
  }

  toObject(): PetStats {
    return {
      hp: this.hp,
      maxHp: this.maxHp,
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
    };
  }

  equals(other: Stats): boolean {
    return (
      this.hp === other.hp &&
      this.maxHp === other.maxHp &&
      this.attack === other.attack &&
      this.defense === other.defense &&
      this.speed === other.speed
    );
  }
}





















