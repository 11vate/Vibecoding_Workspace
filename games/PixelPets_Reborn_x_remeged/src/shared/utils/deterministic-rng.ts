/**
 * Deterministic RNG utility (small, dependency-free)
 * Provides a seed -> PRNG mapping (Mulberry32) suitable for deterministic gameplay.
 */
export type RNG = {
  next(): number; // returns [0,1)
};

function xmur3(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t |= 0;
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRng(seed: number | string): RNG {
  const seedNum = typeof seed === 'number' ? seed >>> 0 : xmur3(String(seed));
  const fn = mulberry32(seedNum);
  return {
    next: () => fn(),
  };
}

export function randomSeed(): string {
  // Create a reasonably unique seed string for capture (timestamp + random)
  const t = Date.now();
  const r = Math.floor(Math.random() * 1e9);
  return `${t}-${r}`;
}
