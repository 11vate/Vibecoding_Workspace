/**
 * Sprite Generator Service
 * Generates procedural sprites for pets with caching support (in-memory + IndexedDB)
 */

import type { PetFamily } from '@/shared/types/family';
import type { Pet } from '@/domain/entities/Pet';
import { openDatabase } from '../persistence/schema';
import type { SpriteDTO } from '../persistence/schema';

import type { PetVisualGenome } from '@/domain/entities/VisualGenome';

export interface SpriteGenerationParams {
  family: PetFamily;
  visualTags: string[];
  rarity: number;
  colorMutation?: { r: number; g: number; b: number };
  glowColor?: string;
  visualGenome?: PetVisualGenome; // Added visual genome
  width?: number;
  height?: number;
  animationState?: 'idle' | 'attack' | 'hit' | 'ultimate' | 'death';
}

export interface GeneratedSprite {
  dataUrl: string;
  width: number;
  height: number;
  cacheKey: string;
  animationStates?: {
    idle?: string;
    attack?: string;
    hit?: string;
    ultimate?: string;
    death?: string;
  };
}

/**
 * Family-based color palettes
 */
const FAMILY_PALETTES: Record<PetFamily, string[]> = {
  PYRO_KIN: ['#FF6B35', '#F7931E', '#FFD23F', '#EE4B2B', '#C21807'],
  AQUA_BORN: ['#00A8E8', '#007EA7', '#003459', '#80D4FF', '#4A90E2'],
  TERRA_FORGED: ['#8B7355', '#A0826D', '#6B5840', '#C4A676', '#9D7C52'],
  VOLT_STREAM: ['#FFD700', '#FFA500', '#FF6B00', '#FFEB3B', '#FFC107'],
  SHADOW_VEIL: ['#2C1810', '#1A1A1A', '#4A4A4A', '#6B6B6B', '#8B8B8B'],
  LUMINA: ['#FFFFFF', '#FFFACD', '#FFE4B5', '#F0F8FF', '#E6E6FA'],
  STEEL_WORKS: ['#708090', '#778899', '#B0C4DE', '#C0C0C0', '#D3D3D3'],
  ARCANE_RIFT: ['#9370DB', '#8A2BE2', '#9400D3', '#BA55D3', '#DA70D6'],
  AERO_FLIGHT: ['#87CEEB', '#87CEFA', '#B0E0E6', '#E0F6FF', '#F0F8FF'],
  WEIRDOS: ['#FF1493', '#00FF00', '#FF00FF', '#00FFFF', '#FFFF00'],
};

/**
 * Sprite Generator
 * Generates procedural pixel art sprites using canvas
 */
export class SpriteGenerator {
  public static readonly FALLBACK_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  private static readonly DEFAULT_WIDTH = 128; // Upgraded from 64
  private static readonly DEFAULT_HEIGHT = 128; // Upgraded from 64
  private cache: Map<string, GeneratedSprite> = new Map();

  /**
   * Generate sprite for a Pet entity (with all animation states)
   */
  async generateSpriteForPet(pet: Pet): Promise<string> {
    const params: SpriteGenerationParams = {
      family: pet.family,
      visualTags: pet.appearance.visualTags,
      rarity: pet.rarity,
      colorMutation: pet.appearance.colorMutation,
      glowColor: pet.appearance.glowColor,
      visualGenome: pet.appearance.visualGenome,
    };

    // Generate all animation states
    const animationStates: Record<string, string> = {};
    
    // Generate idle (default)
    const idleSprite = await this.generateSprite({ ...params, animationState: 'idle' });
    animationStates.idle = idleSprite.dataUrl;
    
    // Generate other animation states
    const states: Array<'attack' | 'hit' | 'ultimate' | 'death'> = ['attack', 'hit', 'ultimate', 'death'];
    for (const state of states) {
      const stateSprite = await this.generateSprite({ ...params, animationState: state });
      animationStates[state] = stateSprite.dataUrl;
    }

    // Return idle as default, but store all states
    return idleSprite.dataUrl;
  }

  /**
   * Generate all animation states for a pet
   */
  async generateAllAnimationStates(pet: Pet): Promise<GeneratedSprite['animationStates']> {
    const params: SpriteGenerationParams = {
      family: pet.family,
      visualTags: pet.appearance.visualTags,
      rarity: pet.rarity,
      colorMutation: pet.appearance.colorMutation,
      glowColor: pet.appearance.glowColor,
      visualGenome: pet.appearance.visualGenome,
    };

    const animationStates: GeneratedSprite['animationStates'] = {};
    
    const states: Array<'idle' | 'attack' | 'hit' | 'ultimate' | 'death'> = ['idle', 'attack', 'hit', 'ultimate', 'death'];
    for (const state of states) {
      const sprite = await this.generateSprite({ ...params, animationState: state });
      animationStates[state] = sprite.dataUrl;
    }

    return animationStates;
  }

  /**
   * Generate sprite from parameters (e.g. for previews)
   */
  async generatePreviewSprite(
    family: string,
    visualTags: string[],
    rarity: number,
    visualGenome: PetVisualGenome
  ): Promise<string> {
    const params: SpriteGenerationParams = {
      family: family as PetFamily,
      visualTags,
      rarity,
      visualGenome,
      animationState: 'idle'
    };
    const sprite = await this.generateSprite(params);
    return sprite.dataUrl;
  }

  /**
   * Generate sprite from parameters
   */
  async generateSprite(params: SpriteGenerationParams): Promise<GeneratedSprite> {
    // Create cache key
    const cacheKey = this.createCacheKey(params);

    // Check in-memory cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Check IndexedDB cache
    const dbCached = await this.getCachedSpriteFromDB(cacheKey);
    if (dbCached) {
      // Store in memory cache for faster access
      this.cache.set(cacheKey, dbCached);
      return dbCached;
    }

    // Generate new sprite
    const sprite = await this.generateProceduralSprite(params);

    // Cache in memory
    this.cache.set(cacheKey, sprite);

    // Cache in IndexedDB
    await this.cacheSpriteInDB(cacheKey, sprite, params.visualTags);

    return sprite;
  }

  /**
   * Get cached sprite from IndexedDB
   */
  private async getCachedSpriteFromDB(cacheKey: string): Promise<GeneratedSprite | null> {
    try {
      const db = await openDatabase();
      const dto = await db.get('sprites', cacheKey);
      
      if (!dto) {
        return null;
      }

      return {
        dataUrl: dto.spriteData,
        width: SpriteGenerator.DEFAULT_WIDTH,
        height: SpriteGenerator.DEFAULT_HEIGHT,
        cacheKey: dto.id,
      };
    } catch (error) {
      console.warn('[SpriteGenerator] Failed to read from IndexedDB cache:', error);
      return null;
    }
  }

  /**
   * Cache sprite in IndexedDB
   */
  private async cacheSpriteInDB(
    cacheKey: string,
    sprite: GeneratedSprite,
    visualTags: string[]
  ): Promise<void> {
    try {
      const db = await openDatabase();
      const dto: SpriteDTO = {
        id: cacheKey,
        spriteData: sprite.dataUrl,
        visualTags,
        createdAt: Date.now(),
      };
      
      await db.put('sprites', dto);
    } catch (error) {
      console.warn('[SpriteGenerator] Failed to cache sprite in IndexedDB:', error);
      // Don't throw - caching is optional, generation succeeded
    }
  }

  /**
   * Create cache key from parameters
   */
  private createCacheKey(params: SpriteGenerationParams): string {
    const tags = params.visualTags.sort().join(',');
    const mutation = params.colorMutation
      ? `${params.colorMutation.r},${params.colorMutation.g},${params.colorMutation.b}`
      : 'none';
    const glow = params.glowColor || 'none';
    const animState = params.animationState || 'idle';
    return `${params.family}-${tags}-${params.rarity}-${mutation}-${glow}-${animState}`;
  }

  /**
   * Generate procedural sprite
   */
  private async generateProceduralSprite(
    params: SpriteGenerationParams
  ): Promise<GeneratedSprite> {
    const width = params.width || SpriteGenerator.DEFAULT_WIDTH;
    const height = params.height || SpriteGenerator.DEFAULT_HEIGHT;

    // Check if we're in a browser environment
    if (typeof document === 'undefined' || typeof document.createElement === 'undefined') {
      console.error('[SpriteGenerator] Not in browser environment, cannot create canvas');
      throw new Error('Canvas generation requires browser environment');
    }

    // Create canvas
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    
    try {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });

      if (!ctx) {
        console.error('[SpriteGenerator] Failed to get 2d context from canvas');
        throw new Error('Failed to get canvas context');
      }
    } catch (error) {
      console.error('[SpriteGenerator] Error creating canvas:', error);
      throw new Error(`Failed to create canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Get base colors from family palette
    const palette = FAMILY_PALETTES[params.family];
    const baseColor = this.selectBaseColor(palette, params.rarity);

    // Apply color mutation if present
    let finalColor = baseColor;
    if (params.colorMutation) {
      finalColor = this.applyColorMutation(baseColor, params.colorMutation);
    }

    // Generate sprite based on visual tags and animation state
    this.drawSprite(ctx, width, height, finalColor, params.visualTags, params.rarity, params.animationState || 'idle');

    // Apply glow effect if present
    if (params.glowColor) {
      this.applyGlow(ctx, width, height, params.glowColor);
    }

    // Convert to data URL with error handling
    let dataUrl: string;
    try {
      dataUrl = canvas.toDataURL('image/png');
      if (!dataUrl || dataUrl === 'data:,') {
        throw new Error('Canvas toDataURL returned empty result');
      }
    } catch (error) {
      console.error('[SpriteGenerator] Error converting canvas to data URL:', error);
      // Generate fallback placeholder sprite
      return this.generateFallbackSprite(params);
    }

    return {
      dataUrl,
      width,
      height,
      cacheKey: this.createCacheKey(params),
    };
  }

  /**
   * Generate fallback placeholder sprite when main generation fails
   */
  private generateFallbackSprite(params: SpriteGenerationParams): GeneratedSprite {
    const width = params.width || SpriteGenerator.DEFAULT_WIDTH;
    const height = params.height || SpriteGenerator.DEFAULT_HEIGHT;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Ultimate fallback: return a simple data URL for a colored rectangle
        return {
          dataUrl: this.createSimplePlaceholderDataUrl(width, height, params.family),
          width,
          height,
          cacheKey: this.createCacheKey(params),
        };
      }

      // Draw a simple colored shape as placeholder
      const palette = FAMILY_PALETTES[params.family];
      const color = palette[0] || '#888888';
      
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      
      // Add a simple shape in the center
      ctx.fillStyle = this.adjustBrightness(color, 1.3);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.3, 0, Math.PI * 2);
      ctx.fill();

      const dataUrl = canvas.toDataURL('image/png');
      return {
        dataUrl,
        width,
        height,
        cacheKey: this.createCacheKey(params),
      };
    } catch (error) {
      console.error('[SpriteGenerator] Fallback sprite generation also failed:', error);
      // Last resort: return a simple colored data URL
      return {
        dataUrl: this.createSimplePlaceholderDataUrl(width, height, params.family),
        width,
        height,
        cacheKey: this.createCacheKey(params),
      };
    }
  }

  /**
   * Create a simple placeholder data URL (colored rectangle)
   */
  private createSimplePlaceholderDataUrl(_width: number, _height: number, family: string): string {
    const palette = FAMILY_PALETTES[family as keyof typeof FAMILY_PALETTES] || ['#888888'];
    const color = palette[0];
    
    // Create a minimal 1x1 pixel PNG data URL with the color
    // This is a fallback when canvas completely fails
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    
    // Create a simple 1x1 PNG data URL
    // PNG header + minimal image data
    const pngData = this.createMinimalPNG(r, g, b);
    return `data:image/png;base64,${pngData}`;
  }

  /**
   * Create minimal PNG data (1x1 pixel) as base64
   */
  private createMinimalPNG(r: number, g: number, b: number): string {
    // Try to create a real 1x1 PNG via canvas if possible
    if (typeof document !== 'undefined') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(0, 0, 1, 1);
          const dataUrl = canvas.toDataURL('image/png');
          const base64 = dataUrl.split(',')[1];
          if (base64) return base64;
        }
      } catch (e) {
        // Fall through to hardcoded fallback
      }
    }
    
    // Ultimate fallback: Return valid 1x1 PNG (red)
    return SpriteGenerator.FALLBACK_PNG;
  }

  /**
   * Select base color from palette based on rarity
   */
  private selectBaseColor(palette: string[], rarity: number): string {
    // Higher rarity uses brighter/more saturated colors
    const index = Math.min(Math.floor(rarity / 2), palette.length - 1);
    return palette[index] || palette[0];
  }

  /**
   * Apply color mutation to base color
   */
  private applyColorMutation(
    baseColor: string,
    mutation: { r: number; g: number; b: number }
  ): string {
    // Parse base color
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Apply mutation (weighted blend)
    const newR = Math.round(r * 0.7 + mutation.r * 0.3);
    const newG = Math.round(g * 0.7 + mutation.g * 0.3);
    const newB = Math.round(b * 0.7 + mutation.b * 0.3);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  /**
   * Draw procedural sprite using constructed anatomy
   */
  private drawSprite(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string,
    visualTags: string[],
    rarity: number,
    animationState: string,
    visualGenome?: PetVisualGenome
  ): void {
    const isGlitched = visualTags.includes('glitched');
    const isHacked = visualTags.includes('hacked');
    
    // Seed for deterministic generation
    const seedStr = visualTags.join(',') + color + rarity + (visualGenome?.paletteSeed || '');
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed = (seed << 5) - seed + seedStr.charCodeAt(i);
      seed |= 0;
    }
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Grid settings
    const gridSize = 32; // Increased resolution to 32x32 for better detail
    const pixelSize = Math.floor(width / gridSize);
    const offsetX = (width - (gridSize * pixelSize)) / 2;
    const offsetY = (height - (gridSize * pixelSize)) / 2;

    // Initialize grid (0 = empty, 1 = body, 2 = detail/shade, 3 = highlight)
    const grid: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    
    // Helper to set pixel with symmetry
    const setPixel = (x: number, y: number, val: number) => {
      if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        grid[y][x] = val;
        // Horizontal symmetry
        const mirrorX = gridSize - 1 - x;
        grid[y][mirrorX] = val;
      }
    };

    // --- ANATOMY GENERATION ---
    
    const baseForm = visualGenome?.baseForm || 'biped';
    const bodyParts = visualGenome?.bodyParts;

    // 1. Draw Body Core
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);

    if (baseForm === 'biped') {
      // Vertical oval
      for (let y = 8; y < 28; y++) {
        for (let x = centerX - 6; x <= centerX; x++) {
          if (random() > 0.1) setPixel(x, y, 1);
        }
      }
    } else if (baseForm === 'quadruped') {
      // Horizontal oval
      for (let y = 12; y < 24; y++) {
        for (let x = centerX - 10; x <= centerX; x++) {
           if (random() > 0.1) setPixel(x, y, 1);
        }
      }
      // Legs
      for(let l=0; l<4; l++) {
          setPixel(centerX - 8, 24+l, 1);
          setPixel(centerX - 2, 24+l, 1);
      }
    } else if (baseForm === 'floating') {
      // Circle/Diamond
      for (let y = 6; y < 26; y++) {
        for (let x = centerX - 8; x <= centerX; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          if (dx*dx + dy*dy < 64 && random() > 0.1) setPixel(x, y, 1);
        }
      }
    } else if (baseForm === 'serpentine') {
      // S-shape (simplified)
      for (let y = 4; y < 30; y++) {
        const xOff = Math.floor(Math.sin(y / 4) * 4);
        setPixel(centerX + xOff, y, 1);
        setPixel(centerX + xOff - 1, y, 1);
        setPixel(centerX + xOff - 2, y, 1);
      }
    }

    // 2. Add Head (if distinct)
    if (baseForm !== 'floating') {
        const headY = baseForm === 'quadruped' ? 12 : 8;
        for(let y = headY - 6; y < headY; y++) {
            for(let x = centerX - 4; x <= centerX; x++) {
                setPixel(x, y, 1);
            }
        }
    }

    // 3. Add Features (Wings, Horns, etc.)
    if (bodyParts?.wings) {
        for(let y = 8; y < 20; y++) {
            setPixel(centerX - 10, y, 1);
            setPixel(centerX - 11, y - 2, 1);
            setPixel(centerX - 12, y - 4, 1);
        }
    }
    
    if (bodyParts?.head === 'horned') {
        setPixel(centerX - 2, 4, 1);
        setPixel(centerX - 2, 3, 1);
        setPixel(centerX - 2, 2, 1);
    }

    // 4. Refine & Connect (Cellular Automata smoothing)
    // Simple pass to fill gaps
    for (let y = 1; y < gridSize - 1; y++) {
        for (let x = 1; x < gridSize - 1; x++) {
            if (grid[y][x] === 0) {
                const neighbors = (grid[y-1][x]>0?1:0) + (grid[y+1][x]>0?1:0) + (grid[y][x-1]>0?1:0) + (grid[y][x+1]>0?1:0);
                if (neighbors >= 3) grid[y][x] = 1;
            }
        }
    }

    // --- RENDERING ---

    // Animation offset
    let animOffsetY = 0;
    if (animationState === 'idle') {
      animOffsetY = Math.sin(Date.now() / 500) * 2;
    } else if (animationState === 'attack') {
        animOffsetY = Math.sin(Date.now() / 100) * 4;
    }

    ctx.save();
    ctx.translate(offsetX, offsetY + animOffsetY);

    // Draw pixels
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const val = grid[y][x];
        if (val > 0) {
            // Outline logic: Check neighbors
            const isEdge = x===0 || x===gridSize-1 || y===0 || y===gridSize-1 ||
                           grid[y][x-1]===0 || grid[y][x+1]===0 || grid[y-1][x]===0 || grid[y+1][x]===0;
            
            if (isEdge) {
                ctx.fillStyle = this.adjustBrightness(color, 0.5); // Dark outline
            } else {
                ctx.fillStyle = color;
                // Random shading texture
                if (random() > 0.8) ctx.fillStyle = this.adjustBrightness(color, 0.9);
                if (random() > 0.9) ctx.fillStyle = this.adjustBrightness(color, 1.1);
            }
            
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Glitch/Hacked effects
    if (isGlitched || isHacked) {
      const glitchChance = isHacked ? 0.2 : 0.1;
      if (Math.random() < glitchChance) {
        const sliceY = Math.floor(Math.random() * height);
        const sliceHeight = Math.floor(Math.random() * 10) + 2;
        const shift = (Math.random() - 0.5) * 20;
        
        try {
            const imageData = ctx.getImageData(0, sliceY, width, sliceHeight);
            ctx.putImageData(imageData, shift, sliceY);
        } catch(e) {
            // Ignore bounds errors
        }
      }
      
      // Random colored pixels for corruption
      if (isHacked) {
          ctx.fillStyle = '#00FF00';
          for(let i=0; i<5; i++) {
              const rx = Math.floor(Math.random() * width);
              const ry = Math.floor(Math.random() * height);
              ctx.fillRect(rx, ry, 4, 4);
          }
      }
    }

    ctx.restore();
  }

  /**
   * Apply glow effect
   */
  private applyGlow(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    glowColor: string
  ): void {
    // Create a copy of the canvas with glow effect
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Simple glow: brighten edges
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 0) {
          // Add glow color as overlay
          const glowR = parseInt(glowColor.substring(1, 3), 16);
          const glowG = parseInt(glowColor.substring(3, 5), 16);
          const glowB = parseInt(glowColor.substring(5, 7), 16);

          // Blend glow with existing color
          data[index] = Math.min(255, data[index] + glowR * 0.2);
          data[index + 1] = Math.min(255, data[index + 1] + glowG * 0.2);
          data[index + 2] = Math.min(255, data[index + 2] + glowB * 0.2);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Adjust color brightness
   */
  private adjustBrightness(hex: string, factor: number): string {
    // Simple hex brightness adjustment
    // (Implementation omitted for brevity, reusing existing or adding helper)
    // Assuming helper exists or implementing inline for robustness:
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.min(255, Math.max(0, Math.floor(r * factor)));
    g = Math.min(255, Math.max(0, Math.floor(g * factor)));
    b = Math.min(255, Math.max(0, Math.floor(b * factor)));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Clear in-memory cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear IndexedDB cache
   */
  async clearDBCache(): Promise<void> {
    try {
      const db = await openDatabase();
      await db.clear('sprites');
    } catch (error) {
      console.warn('[SpriteGenerator] Failed to clear IndexedDB cache:', error);
    }
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

