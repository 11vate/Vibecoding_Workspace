
import { describe, it, expect } from 'vitest';
import { NoiseLibrary } from '../procedural-generation/noise';
import { TerrainGenerator } from '../procedural-generation/geometric-engine/terrain-generator';

describe('Generative Assets', () => {
  describe('Noise Library', () => {
    it('should generate consistent noise for same seed', () => {
      NoiseLibrary.seed(12345);
      const val1 = NoiseLibrary.perlin2D(0.5, 0.5);
      
      NoiseLibrary.seed(12345);
      const val2 = NoiseLibrary.perlin2D(0.5, 0.5);
      
      expect(val1).toBe(val2);
    });

    it('should generate different noise for different coordinates', () => {
      NoiseLibrary.seed(12345);
      const val1 = NoiseLibrary.perlin2D(0.5, 0.5);
      const val2 = NoiseLibrary.perlin2D(0.6, 0.6);
      
      expect(val1).not.toBe(val2);
    });
  });

  describe('Terrain Generator', () => {
    it('should generate a heightmap of correct size', () => {
      const config = {
        width: 10,
        depth: 10,
        segmentsW: 2,
        segmentsD: 2,
        maxHeight: 10,
        scale: 1,
        seed: 123
      };
      
      const heightMap = TerrainGenerator.generateHeightMap(config);
      // (segmentsW + 1) * (segmentsD + 1) = 3 * 3 = 9 vertices
      expect(heightMap.length).toBe(9);
    });

    it('should respect max height', () => {
      const config = {
        width: 10,
        depth: 10,
        segmentsW: 5,
        segmentsD: 5,
        maxHeight: 5,
        scale: 1,
        seed: 123
      };
      
      const heightMap = TerrainGenerator.generateHeightMap(config);
      for(let i = 0; i < heightMap.length; i++) {
        expect(heightMap[i]).toBeLessThanOrEqual(config.maxHeight);
        expect(heightMap[i]).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
