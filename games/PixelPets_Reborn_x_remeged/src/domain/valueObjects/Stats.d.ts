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
export declare class Stats {
    readonly hp: number;
    readonly maxHp: number;
    readonly attack: number;
    readonly defense: number;
    readonly speed: number;
    private constructor();
    static create(hp: number, maxHp: number, attack: number, defense: number, speed: number): Stats;
    static fromObject(stats: PetStats): Stats;
    private validate;
    withHp(hp: number): Stats;
    withMaxHp(maxHp: number): Stats;
    toObject(): PetStats;
    equals(other: Stats): boolean;
}
//# sourceMappingURL=Stats.d.ts.map