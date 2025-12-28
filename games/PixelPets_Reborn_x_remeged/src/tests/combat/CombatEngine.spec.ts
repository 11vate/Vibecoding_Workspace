import { describe, it, expect, afterEach } from 'vitest';
import { CombatEngine } from '@/domain/services/CombatEngine';
import { createSeededRng } from '@/shared/utils/deterministic-rng';

// Minimal CombatPet stubs
const makePet = (id: string, attack = 10, defense = 5) => ({
  pet: { id, stats: { hp: 100, maxHp: 100, attack, defense, speed: 10 } },
  currentHp: 100,
  currentEnergy: 0,
  statusEffects: [],
  buffs: [],
  debuffs: [],
  position: 'front' as const,
});

describe('CombatEngine deterministic RNG', () => {
  afterEach(() => {
    CombatEngine.clearRng();
  });

  it('produces deterministic critical flags for a fixed seed', () => {
    const attacker = makePet('att');
    const defender = makePet('def');

    const rng1 = createSeededRng('seed-123');
    CombatEngine.setRng(() => rng1.next());
    const resultA = CombatEngine.calculateDamage(
      attacker as any,
      defender as any,
      { type: 'damage', value: 1, scaling: 'attack' } as any
    );

    CombatEngine.clearRng();

    const rng2 = createSeededRng('seed-123');
    CombatEngine.setRng(() => rng2.next());
    const resultB = CombatEngine.calculateDamage(
      attacker as any,
      defender as any,
      { type: 'damage', value: 1, scaling: 'attack' } as any
    );

    expect(resultA.finalDamage).toEqual(resultB.finalDamage);
    expect(resultA.critical).toEqual(resultB.critical);
  });
});
