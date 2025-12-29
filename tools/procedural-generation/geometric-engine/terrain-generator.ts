/**
 * Terrain Generator
 * 
 * Uses the NoiseLibrary to generate 3D terrain heightmaps and geometry data.
 * Designed to be compatible with Three.js.
 */

import { NoiseLibrary } from '../../procedural-generation/noise';
import * as THREE from 'three';

export interface TerrainConfig {
  width: number;
  depth: number;
  segmentsW: number;
  segmentsD: number;
  maxHeight: number;
  scale: number;
  seed: number;
  exponent?: number; // To flatten valleys and sharpen peaks
}

export const TerrainGenerator = {
  /**
   * Generate a heightmap array
   */
  generateHeightMap(config: TerrainConfig): Float32Array {
    NoiseLibrary.seed(config.seed);
    const size = (config.segmentsW + 1) * (config.segmentsD + 1);
    const data = new Float32Array(size);
    
    let i = 0;
    for (let z = 0; z <= config.segmentsD; z++) {
      for (let x = 0; x <= config.segmentsW; x++) {
        // Normalize coordinates
        const nx = x / config.segmentsW;
        const nz = z / config.segmentsD;
        
        // Generate noise value (0 to 1)
        // Using multiple octaves (FBM) for detail
        let noiseVal = NoiseLibrary.fbm2D(nx * config.scale, nz * config.scale, 6, 0.5, 2.0);
        
        // Map from -1..1 to 0..1 (approximate)
        noiseVal = (noiseVal + 1) / 2;
        
        // Apply exponent if needed
        if (config.exponent) {
          noiseVal = Math.pow(noiseVal, config.exponent);
        }
        
        data[i++] = noiseVal * config.maxHeight;
      }
    }
    
    return data;
  },

  /**
   * Generate a Three.js PlaneGeometry with applied heightmap
   * Note: This returns the geometry data structure, ready to be used in a Three.js scene.
   * In a Node.js environment, we might not be able to fully instantiate WebGL objects,
   * but we can create the BufferGeometry data.
   */
  generateGeometry(config: TerrainConfig): THREE.PlaneGeometry {
    const geometry = new THREE.PlaneGeometry(
      config.width, 
      config.depth, 
      config.segmentsW, 
      config.segmentsD
    );
    
    const heightMap = this.generateHeightMap(config);
    const posAttribute = geometry.attributes.position;
    
    // Apply heightmap to z-coordinate (or y depending on orientation, standard plane is X-Y, usually rotated to X-Z)
    // Three.js PlaneGeometry is created in X-Y plane. Vertices are ordered row by row.
    // We usually want terrain on X-Z plane, so we modify the Z attribute of the X-Y plane 
    // (which becomes Y height after rotation)
    
    for (let i = 0; i < posAttribute.count; i++) {
      // The standard PlaneGeometry vertices are indexed such that we can map directly
      // Z in local space (which is 0 for a flat plane) becomes our height
      posAttribute.setZ(i, heightMap[i]);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  },

  /**
   * Generate a color texture based on height
   * Returns an array of RGB values [r, g, b, r, g, b, ...]
   */
  generateTextureMap(heightMap: Float32Array, maxHeight: number): Uint8Array {
    const size = heightMap.length;
    const data = new Uint8Array(size * 3);
    
    for (let i = 0; i < size; i++) {
      const height = heightMap[i];
      const normalizedHeight = height / maxHeight;
      
      let r = 0, g = 0, b = 0;
      
      // Simple biome coloring
      if (normalizedHeight < 0.2) {
        // Water/Sand
        r = 76; g = 164; b = 222;
      } else if (normalizedHeight < 0.4) {
        // Grass
        r = 67; g = 160; b = 71;
      } else if (normalizedHeight < 0.7) {
        // Rock
        r = 120; g = 120; b = 120;
      } else {
        // Snow
        r = 255; g = 255; b = 255;
      }
      
      const stride = i * 3;
      data[stride] = r;
      data[stride + 1] = g;
      data[stride + 2] = b;
    }
    
    return data;
  }
};
