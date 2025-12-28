/**
 * Layered Sprite Generator (Build-Time)
 *
 * 4-Layer Anatomical Compositing System for Pet Sprites
 * Uses workspace procedural generation tools (node-canvas)
 *
 * Layer 1: Base Body (symmetry generator)
 * Layer 2: Features (wings, horns, tails, armor)
 * Layer 3: Details (Perlin noise textures, patterns)
 * Layer 4: Animation States (sprite sheet builder)
 *
 * NOTE: This is for BUILD-TIME generation only (Node.js environment)
 * For browser runtime, use SpriteGenerator.ts
 */

import { resolve, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import type { PetFamily } from '@/shared/types/family';
import type { PetVisualGenome } from '@/domain/entities/VisualGenome';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Workspace root is 5 levels up from src/infrastructure/sprite/
// src/ -> games/ -> PixelPets_Reborn_x_remeged/ -> Ultimate_Cursor_Vibecoding_Workspace/
const WORKSPACE_ROOT = resolve(__dirname, '../../../../../');

// Helper to convert Windows paths to file:// URLs for ESM imports
function toFileURL(path: string): string {
  return pathToFileURL(path).href;
}

// Dynamic imports for workspace tools
const symmetryGeneratorPath = join(WORKSPACE_ROOT, 'tools/procedural-generation/pixel-art-engine/symmetry-generator.ts');
const noiseTexturePath = join(WORKSPACE_ROOT, 'tools/procedural-generation/texture-engine/perlin-noise.ts');
const spriteSheetBuilderPath = join(WORKSPACE_ROOT, 'tools/procedural-generation/animation-engine/sprite-sheet-builder.ts');

export interface LayeredSpriteSpec {
  family: PetFamily;
  rarity: number;
  visualTags: string[];
  visualGenome?: PetVisualGenome;
  seed: number;
  width?: number;
  height?: number;
}

export interface LayeredSpriteResult {
  idle: Buffer;
  attack: Buffer;
  hit: Buffer;
  ultimate: Buffer;
  death: Buffer;
  spriteSheet: Buffer;
  metadata: {
    frameWidth: number;
    frameHeight: number;
    animations: Record<string, { startFrame: number; frameCount: number; fps: number }>;
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
 * Layered Sprite Generator Class
 */
export class LayeredSpriteGenerator {
  private static readonly DEFAULT_WIDTH = 128;
  private static readonly DEFAULT_HEIGHT = 128;

  /**
   * Generate complete sprite with all animation states
   */
  async generateSprite(spec: LayeredSpriteSpec): Promise<LayeredSpriteResult> {
    const width = spec.width || LayeredSpriteGenerator.DEFAULT_WIDTH;
    const height = spec.height || LayeredSpriteGenerator.DEFAULT_HEIGHT;

    // Import workspace tools dynamically
    const { generateSymmetricalSprite } = await import(toFileURL(symmetryGeneratorPath)) as any;
    const { generateNoiseTexture } = await import(toFileURL(noiseTexturePath)) as any;
    const { buildSpriteSheet } = await import(toFileURL(spriteSheetBuilderPath)) as any;

    // Get palette for family
    const palette = FAMILY_PALETTES[spec.family];

    // LAYER 1: Generate Base Body using symmetry generator
    const baseBody = await this.generateLayer1_BaseBody(
      generateSymmetricalSprite,
      width,
      height,
      palette,
      spec.rarity,
      spec.seed,
      spec.visualGenome
    );

    // LAYER 2: Add Features (wings, horns, tails)
    const withFeatures = await this.generateLayer2_Features(
      baseBody,
      width,
      height,
      spec.visualGenome,
      spec.seed
    );

    // LAYER 3: Add Details (textures, patterns via Perlin noise)
    const withDetails = await this.generateLayer3_Details(
      generateNoiseTexture,
      withFeatures,
      width,
      height,
      palette,
      spec.family,
      spec.seed
    );

    // LAYER 4: Generate Animation States
    const animations = await this.generateLayer4_AnimationStates(
      withDetails,
      width,
      height,
      spec.visualGenome,
      spec.seed
    );

    // Build sprite sheet
    const frames = [
      { image: animations.idle, name: 'idle' },
      { image: animations.attack, name: 'attack' },
      { image: animations.hit, name: 'hit' },
      { image: animations.ultimate, name: 'ultimate' },
      { image: animations.death, name: 'death' }
    ];

    const spriteSheet = await buildSpriteSheet({
      frames,
      frameWidth: width,
      frameHeight: height,
      layout: 'horizontal',
      padding: 2
    });

    return {
      idle: animations.idle,
      attack: animations.attack,
      hit: animations.hit,
      ultimate: animations.ultimate,
      death: animations.death,
      spriteSheet: spriteSheet.image,
      metadata: {
        frameWidth: width,
        frameHeight: height,
        animations: {
          idle: { startFrame: 0, frameCount: 6, fps: 12 },
          attack: { startFrame: 6, frameCount: 8, fps: 16 },
          hit: { startFrame: 14, frameCount: 4, fps: 12 },
          ultimate: { startFrame: 18, frameCount: 12, fps: 20 },
          death: { startFrame: 30, frameCount: 8, fps: 10 }
        }
      }
    };
  }

  /**
   * LAYER 1: Generate base body using symmetry generator
   */
  private async generateLayer1_BaseBody(
    generateSymmetricalSprite: any,
    width: number,
    height: number,
    palette: string[],
    rarity: number,
    seed: number,
    visualGenome?: PetVisualGenome
  ): Promise<Buffer> {
    const baseForm = visualGenome?.baseForm || 'biped';

    // Determine symmetry type based on base form
    let symmetry: 'vertical' | 'horizontal' | 'quad' = 'vertical';
    if (baseForm === 'quadruped') symmetry = 'horizontal';
    if (baseForm === 'floating') symmetry = 'quad';

    // Generate symmetrical sprite (returns Buffer directly)
    const buffer = generateSymmetricalSprite({
      width,
      height,
      palette,
      symmetry,
      density: 0.5 + (rarity * 0.1), // Higher rarity = denser sprites
      seed
    });

    return buffer;
  }

  /**
   * LAYER 2: Add features (wings, horns, tails, armor)
   */
  private async generateLayer2_Features(
    baseLayer: Buffer,
    width: number,
    height: number,
    visualGenome?: PetVisualGenome,
    seed?: number
  ): Promise<Buffer> {
    // Load base layer into canvas
    const { createCanvas, loadImage } = await import('canvas');
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw base layer
    const baseImage = await loadImage(baseLayer);
    ctx.drawImage(baseImage, 0, 0);

    // Add features based on visual genome
    const bodyParts = visualGenome?.bodyParts;

    if (bodyParts?.wings) {
      this.drawWings(ctx, width, height, seed || 0);
    }

    if (bodyParts?.head === 'horned') {
      this.drawHorns(ctx, width, height, seed || 0);
    }

    if (bodyParts?.tail) {
      this.drawTail(ctx, width, height, bodyParts.tail, seed || 0);
    }

    if (bodyParts?.armor) {
      this.drawArmor(ctx, width, height, seed || 0);
    }

    return canvas.toBuffer('image/png');
  }

  /**
   * LAYER 3: Add details (textures, patterns via Perlin noise)
   */
  private async generateLayer3_Details(
    generateNoiseTexture: any,
    baseLayer: Buffer,
    width: number,
    height: number,
    palette: string[],
    _family: PetFamily,
    seed: number
  ): Promise<Buffer> {
    // Generate texture overlay using Perlin noise
    const textureColorMap = (value: number): string => {
      const index = Math.floor(value * (palette.length - 1));
      return palette[index] || palette[0];
    };

    const textureBuffer = generateNoiseTexture({
      width,
      height,
      scale: 0.1,
      octaves: 3,
      persistence: 0.5,
      seed,
      colorMap: textureColorMap
    });

    // Composite texture over base
    const { createCanvas, loadImage } = await import('canvas');
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw base layer
    const baseImage = await loadImage(baseLayer);
    ctx.drawImage(baseImage, 0, 0);

    // Draw texture overlay with transparency
    const textureImage = await loadImage(textureBuffer);
    ctx.globalAlpha = 0.3; // 30% opacity for texture
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(textureImage, 0, 0);

    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';

    return canvas.toBuffer('image/png');
  }

  /**
   * LAYER 4: Generate animation states
   */
  private async generateLayer4_AnimationStates(
    baseLayer: Buffer,
    width: number,
    height: number,
    _visualGenome?: PetVisualGenome,
    _seed?: number
  ): Promise<Record<'idle' | 'attack' | 'hit' | 'ultimate' | 'death', Buffer>> {
    const { loadImage } = await import('canvas');

    // For now, return variations of the base sprite
    // In production, would generate actual animation frames
    const baseImage = await loadImage(baseLayer);

    const animations = {
      idle: await this.generateIdleFrame(baseImage, width, height),
      attack: await this.generateAttackFrame(baseImage, width, height),
      hit: await this.generateHitFrame(baseImage, width, height),
      ultimate: await this.generateUltimateFrame(baseImage, width, height),
      death: await this.generateDeathFrame(baseImage, width, height)
    };

    return animations;
  }

  /**
   * Helper: Draw wings
   */
  private drawWings(ctx: any, width: number, height: number, _seed: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const wingWidth = width * 0.3;
    const wingHeight = height * 0.4;

    ctx.fillStyle = 'rgba(200, 200, 200, 0.7)';

    // Left wing
    ctx.beginPath();
    ctx.ellipse(centerX - wingWidth, centerY, wingWidth / 2, wingHeight / 2, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.ellipse(centerX + wingWidth, centerY, wingWidth / 2, wingHeight / 2, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Helper: Draw horns
   */
  private drawHorns(ctx: any, width: number, height: number, _seed: number): void {
    const centerX = width / 2;
    const hornHeight = height * 0.15;

    ctx.fillStyle = 'rgba(100, 100, 100, 0.9)';
    ctx.strokeStyle = 'rgba(50, 50, 50, 1)';
    ctx.lineWidth = 2;

    // Left horn
    ctx.beginPath();
    ctx.moveTo(centerX - 20, height * 0.2);
    ctx.lineTo(centerX - 30, height * 0.2 - hornHeight);
    ctx.lineTo(centerX - 25, height * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right horn
    ctx.beginPath();
    ctx.moveTo(centerX + 20, height * 0.2);
    ctx.lineTo(centerX + 30, height * 0.2 - hornHeight);
    ctx.lineTo(centerX + 25, height * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Helper: Draw tail
   */
  private drawTail(ctx: any, width: number, height: number, tailType: string, _seed: number): void {
    const startX = width / 2;
    const startY = height * 0.8;

    ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    if (tailType === 'long') {
      // Curved tail
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(startX + 20, startY + 30, startX + 10, startY + 50);
      ctx.stroke();
    } else if (tailType === 'spiked') {
      // Spiky tail
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let i = 0; i < 3; i++) {
        ctx.lineTo(startX + (i % 2 === 0 ? 5 : -5), startY + i * 15);
      }
      ctx.stroke();
    }
  }

  /**
   * Helper: Draw armor
   */
  private drawArmor(ctx: any, width: number, height: number, _seed: number): void {
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.strokeStyle = 'rgba(150, 150, 150, 0.9)';
    ctx.lineWidth = 3;

    // Chest plate
    ctx.beginPath();
    ctx.rect(centerX - 20, centerY - 10, 40, 30);
    ctx.stroke();

    // Shoulder plates
    ctx.beginPath();
    ctx.arc(centerX - 25, centerY - 15, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX + 25, centerY - 15, 10, 0, Math.PI * 2);
    ctx.stroke();
  }

  /**
   * Animation frame generators (simplified - would be more complex in production)
   */
  private async generateIdleFrame(baseImage: any, width: number, height: number): Promise<Buffer> {
    const { createCanvas } = await import('canvas');
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(baseImage, 0, 0);
    return canvas.toBuffer('image/png');
  }

  private async generateAttackFrame(baseImage: any, width: number, height: number): Promise<Buffer> {
    const { createCanvas } = await import('canvas');
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Shift forward slightly for attack pose
    ctx.translate(5, 0);
    ctx.drawImage(baseImage, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

    return canvas.toBuffer('image/png');
  }

  private async generateHitFrame(baseImage: any, width: number, height: number): Promise<Buffer> {
    const { createCanvas } = await import('canvas');
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Add red flash for hit
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1.0;
    ctx.drawImage(baseImage, 0, 0);

    return canvas.toBuffer('image/png');
  }

  private async generateUltimateFrame(baseImage: any, width: number, height: number): Promise<Buffer> {
    const { createCanvas } = await import('canvas');
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Add glow for ultimate
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FFD700';
    ctx.drawImage(baseImage, 0, 0);

    return canvas.toBuffer('image/png');
  }

  private async generateDeathFrame(baseImage: any, width: number, height: number): Promise<Buffer> {
    const { createCanvas } = await import('canvas');
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fade out for death
    ctx.globalAlpha = 0.3;
    ctx.drawImage(baseImage, 0, 0);

    return canvas.toBuffer('image/png');
  }
}
