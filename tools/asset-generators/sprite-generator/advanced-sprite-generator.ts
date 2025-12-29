/**
 * Advanced Sprite Generator
 * 
 * Combines Cellular Automata (shapes), Noise (textures), and Symmetry (structure)
 * to generate high-quality pixel art sprites.
 */

import { createCanvas, Canvas } from 'canvas';
import { NoiseLibrary } from '../../procedural-generation/noise';
import { PALETTES } from '../../procedural-generation/pixel-art-engine/palette-engine';

export interface SpriteConfig {
  width: number;
  height: number;
  type: 'character' | 'item' | 'monster' | 'spaceship';
  palette: string; // Key from PALETTES or 'random'
  seed: number;
  complexity: number; // 0-1
  outline: boolean;
}

export class AdvancedSpriteGenerator {
  
  /**
   * Generate a sprite based on configuration
   */
  generateSprite(config: SpriteConfig): Buffer {
    const { width, height, type, seed, complexity, outline } = config;
    
    // 1. Setup Canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // 2. Determine Palette
    const paletteKey = config.palette === 'random' 
      ? Object.keys(PALETTES)[Math.floor(Math.random() * Object.keys(PALETTES).length)]
      : config.palette;
    
    const colors = PALETTES[paletteKey]?.colors || PALETTES.fantasy.colors;
    
    // 3. Generate Base Mask (Shape)
    const mask = this.generateShapeMask(width, height, type, seed, complexity);
    
    // 4. Render Pixels
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    NoiseLibrary.seed(seed);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (mask[y][x] === 1) {
          // Use noise to select color index
          // This gives texture to the sprite
          const noiseVal = (NoiseLibrary.perlin2D(x * 0.2, y * 0.2) + 1) / 2;
          const colorIndex = Math.floor(noiseVal * colors.length);
          const safeIndex = Math.min(colors.length - 1, Math.max(0, colorIndex));
          
          const color = this.hexToColor(colors[safeIndex]);
          
          const idx = (y * width + x) * 4;
          data[idx] = color.r;
          data[idx+1] = color.g;
          data[idx+2] = color.b;
          data[idx+3] = 255;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // 5. Add Outline (Optional)
    if (outline) {
      this.addOutline(ctx, width, height, '#000000');
    }
    
    return canvas.toBuffer('image/png');
  }

  /**
   * Generate 0/1 mask for the sprite shape
   * Uses symmetry and cellular automata concepts
   */
  private generateShapeMask(width: number, height: number, type: string, seed: number, complexity: number): number[][] {
    const mask: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));
    const halfWidth = Math.ceil(width / 2);
    
    // Initialize random state for left half
    // We use a simple hash of coordinates + seed
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < halfWidth; x++) {
        // Different logic per type
        let isSolid = false;
        
        const nx = x / width; // normalized x (0-0.5)
        const ny = y / height; // normalized y (0-1)
        
        // Pseudo-random value
        const rand = Math.abs(Math.sin(seed + x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        
        if (type === 'spaceship') {
           // Spaceships are solid in middle, tapered at top/bottom
           const centerDist = Math.abs(ny - 0.5);
           isSolid = rand > (0.2 + centerDist);
        } else if (type === 'character') {
           // Characters: Head (top), Body (mid), Legs (bot)
           if (ny < 0.25) isSolid = rand > 0.3 && nx < 0.3; // Head
           else if (ny < 0.6) isSolid = rand > 0.2 && nx < 0.4; // Body
           else isSolid = rand > 0.4 && nx < 0.2; // Legs
        } else {
           // Monsters/Items: More random blobs
           const distFromCenter = Math.sqrt(Math.pow(nx, 2) + Math.pow(ny - 0.5, 2));
           isSolid = rand > (0.3 + distFromCenter);
        }
        
        // Fill mask with symmetry
        if (isSolid) {
          mask[y][x] = 1;
          mask[y][width - 1 - x] = 1; // Mirror
        }
      }
    }
    
    // Cleanup: Remove isolated pixels (Cellular Automata step)
    // Run a few smoothing passes
    return this.smoothMask(mask, width, height);
  }

  /**
   * Smooth the mask to remove noise and make it "sprite-like"
   */
  private smoothMask(mask: number[][], width: number, height: number): number[][] {
    const newMask = mask.map(row => [...row]);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        // Count neighbors
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            neighbors += mask[y+dy][x+dx];
          }
        }
        
        if (mask[y][x] === 1) {
          // Die if lonely
          if (neighbors < 2) newMask[y][x] = 0;
        } else {
          // Born if crowded
          if (neighbors > 4) newMask[y][x] = 1;
        }
      }
    }
    return newMask;
  }

  private addOutline(ctx: any, width: number, height: number, color: string) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const outlineData = ctx.createImageData(width, height);
    const oData = outlineData.data;
    
    const getAlpha = (x: number, y: number) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return 0;
      return data[(y * width + x) * 4 + 3];
    };
    
    const outlineColor = this.hexToColor(color);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = getAlpha(x, y);
        if (alpha === 0) {
          // Check neighbors
          if (getAlpha(x+1, y) > 0 || getAlpha(x-1, y) > 0 || 
              getAlpha(x, y+1) > 0 || getAlpha(x, y-1) > 0) {
            
            const idx = (y * width + x) * 4;
            oData[idx] = outlineColor.r;
            oData[idx+1] = outlineColor.g;
            oData[idx+2] = outlineColor.b;
            oData[idx+3] = 255;
          }
        }
      }
    }
    
    // Draw outline on top (actually, normally behind, but for simple outline this works if we composite)
    // For "Stroke", we usually draw it *around* existing pixels.
    // Here we generated a separate outline layer. Let's draw it first then the sprite.
    // But since we already drew the sprite, let's just draw this ON TOP? No, that covers the sprite.
    // Proper way: clear, draw outline, draw sprite.
    // Or: draw outline under.
    
    // Simple approach: Composite
    const tempCanvas = createCanvas(width, height);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(outlineData, 0, 0);
    
    ctx.globalCompositeOperation = 'destination-over'; // Draw BEHIND existing content
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; // Reset
  }

  private hexToColor(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
}
