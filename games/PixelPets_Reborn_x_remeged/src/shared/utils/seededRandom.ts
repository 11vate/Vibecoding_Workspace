/**
 * Seeded Random Number Generator
 * Provides deterministic random number generation from seed strings
 * Same seed → same sequence of random numbers
 */

/**
 * Simple seeded random number generator
 * Uses a hash-based approach for deterministic randomness
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: string | number) {
    if (typeof seed === 'string') {
      this.seed = this.hashString(seed);
    } else {
      this.seed = seed;
    }
  }

  /**
   * Hash a string to a number
   * Simple hash function for seed generation
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate next random number (0-1)
   * Linear congruential generator
   */
  next(): number {
    // LCG parameters (same as used in many implementations)
    this.seed = (this.seed * 1664525 + 1013904223) % 2 ** 32;
    return (this.seed >>> 0) / 2 ** 32;
  }

  /**
   * Generate next random integer in range [min, max)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Generate next random float in range [min, max)
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Choose a random element from an array
   */
  choice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot choose from empty array');
    }
    return array[this.nextInt(0, array.length)];
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * Returns a new shuffled array (does not modify original)
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get current seed value
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Reset to a new seed
   */
  reset(seed: string | number): void {
    if (typeof seed === 'string') {
      this.seed = this.hashString(seed);
    } else {
      this.seed = seed;
    }
  }
}

/**
 * Create a seeded random instance from a seed string
 */
export function createSeededRandom(seed: string | number): SeededRandom {
  return new SeededRandom(seed);
}

/**
 * Generate a deterministic seed from fusion inputs
 * Useful for ensuring same fusion inputs produce same results
 */
export function generateFusionSeed(
  parent1Id: string,
  parent2Id: string,
  stone1Id: string,
  stone2Id: string,
  fusionIntent?: string
): string {
  const parts = [parent1Id, parent2Id, stone1Id, stone2Id];
  if (fusionIntent) {
    parts.push(fusionIntent);
  }
  return parts.join('|');
}







