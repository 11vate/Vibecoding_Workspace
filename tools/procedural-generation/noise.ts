/**
 * Noise Library Wrapper
 * 
 * Wraps the fast noisejs library for efficient noise generation.
 * Replaces manual Perlin implementation where performance is critical.
 */

// @ts-ignore - noisejs doesn't have types
import { Noise } from 'noisejs';

// Create a singleton instance
const noiseInstance = new Noise(Math.random());

export const NoiseLibrary = {
  /**
   * Seed the noise generator
   * @param value Seed value
   */
  seed(value: number) {
    noiseInstance.seed(value);
  },

  /**
   * Generate 2D Perlin noise
   * @param x X coordinate
   * @param y Y coordinate
   * @returns Value between -1 and 1
   */
  perlin2D(x: number, y: number): number {
    return noiseInstance.perlin2(x, y);
  },

  /**
   * Generate 3D Perlin noise
   * @param x X coordinate
   * @param y Y coordinate
   * @param z Z coordinate
   * @returns Value between -1 and 1
   */
  perlin3D(x: number, y: number, z: number): number {
    return noiseInstance.perlin3(x, y, z);
  },

  /**
   * Generate 2D Simplex noise
   * @param x X coordinate
   * @param y Y coordinate
   * @returns Value between -1 and 1
   */
  simplex2D(x: number, y: number): number {
    return noiseInstance.simplex2(x, y);
  },

  /**
   * Generate 3D Simplex noise
   * @param x X coordinate
   * @param y Y coordinate
   * @param z Z coordinate
   * @returns Value between -1 and 1
   */
  simplex3D(x: number, y: number, z: number): number {
    return noiseInstance.simplex3(x, y, z);
  },

  /**
   * Generate a height map using 2D Perlin noise
   * @param width Width of the map
   * @param height Height of the map
   * @param scale Scale of the noise
   * @returns 2D array of values
   */
  generateHeightMap(width: number, height: number, scale: number): number[][] {
    const map: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const value = this.perlin2D(x / scale, y / scale);
        row.push(value);
      }
      map.push(row);
    }
    return map;
  },

  /**
   * Generate a multi-octave noise value (FBM)
   * @param x X coordinate
   * @param y Y coordinate
   * @param octaves Number of octaves
   * @param persistence Persistence value (amplitude decay)
   * @param lacunarity Lacunarity value (frequency growth)
   * @returns Combined noise value
   */
  fbm2D(x: number, y: number, octaves: number = 4, persistence: number = 0.5, lacunarity: number = 2): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;  // Used for normalizing result to 0.0 - 1.0

    for (let i = 0; i < octaves; i++) {
      total += this.perlin2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }
};
