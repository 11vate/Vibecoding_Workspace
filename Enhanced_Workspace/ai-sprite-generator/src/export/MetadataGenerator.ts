/**
 * Metadata Generator
 * 
 * Generates JSON metadata for sprites and sprite sheets.
 */

import type { GeneratedSprite, SpriteSheetMetadata, AnimationFrame } from '../types/index.js';

/**
 * Sprite metadata JSON format
 */
export interface SpriteMetadataJSON {
  name: string;
  type: 'sprite' | 'sprite-sheet';
  width: number;
  height: number;
  format: string;
  frames?: AnimationFrame[];
  animations?: {
    [key: string]: {
      frames: number[];
      frameRate: number;
      loop: boolean;
    };
  };
  metadata: {
    entity: string;
    style: string;
    theme?: string;
    action?: string;
    perspective: string;
    tags: string[];
    createdAt: string;
  };
}

/**
 * Phaser JSON atlas format
 */
export interface PhaserAtlasJSON {
  frames: {
    [key: string]: {
      frame: { x: number; y: number; w: number; h: number };
      rotated: boolean;
      trimmed: boolean;
      spriteSourceSize: { x: number; y: number; w: number; h: number };
      sourceSize: { w: number; h: number };
    };
  };
  meta: {
    app: string;
    version: string;
    image: string;
    format: string;
    size: { w: number; h: number };
    scale: string;
  };
}

/**
 * Metadata Generator
 * 
 * Generates metadata in various formats.
 */
export class MetadataGenerator {
  /**
   * Generate metadata for single sprite
   */
  generateSpriteMetadata(sprite: GeneratedSprite): SpriteMetadataJSON {
    return {
      name: sprite.id,
      type: 'sprite',
      width: sprite.width,
      height: sprite.height,
      format: sprite.format,
      metadata: {
        entity: sprite.metadata.entity,
        style: sprite.metadata.style,
        theme: sprite.metadata.theme,
        action: sprite.metadata.action,
        perspective: sprite.metadata.perspective,
        tags: sprite.metadata.tags,
        createdAt: sprite.metadata.createdAt,
      },
    };
  }

  /**
   * Generate metadata for sprite sheet
   */
  generateSheetMetadata(
    sprite: GeneratedSprite,
    sheetMetadata: SpriteSheetMetadata,
    animations?: { [key: string]: { frames: number[]; frameRate: number; loop: boolean } }
  ): SpriteMetadataJSON {
    return {
      name: sprite.id,
      type: 'sprite-sheet',
      width: sheetMetadata.width,
      height: sheetMetadata.height,
      format: sprite.format,
      frames: sheetMetadata.frames,
      animations,
      metadata: {
        entity: sprite.metadata.entity,
        style: sprite.metadata.style,
        theme: sprite.metadata.theme,
        action: sprite.metadata.action,
        perspective: sprite.metadata.perspective,
        tags: sprite.metadata.tags,
        createdAt: sprite.metadata.createdAt,
      },
    };
  }

  /**
   * Generate Phaser JSON atlas format
   */
  generatePhaserAtlas(
    sheetMetadata: SpriteSheetMetadata,
    imageFileName: string
  ): PhaserAtlasJSON {
    const frames: PhaserAtlasJSON['frames'] = {};

    for (const frame of sheetMetadata.frames) {
      const frameName = `frame_${frame.index}`;
      frames[frameName] = {
        frame: {
          x: frame.bounds.x,
          y: frame.bounds.y,
          w: frame.bounds.width,
          h: frame.bounds.height,
        },
        rotated: false,
        trimmed: false,
        spriteSourceSize: {
          x: 0,
          y: 0,
          w: frame.bounds.width,
          h: frame.bounds.height,
        },
        sourceSize: {
          w: frame.bounds.width,
          h: frame.bounds.height,
        },
      };
    }

    return {
      frames,
      meta: {
        app: 'ai-sprite-generator',
        version: '1.0.0',
        image: imageFileName,
        format: 'RGBA8888',
        size: {
          w: sheetMetadata.width,
          h: sheetMetadata.height,
        },
        scale: '1',
      },
    };
  }
}







