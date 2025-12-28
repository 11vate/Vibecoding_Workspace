/**
 * Code Binding Generator
 * 
 * Generates engine-specific code bindings for sprites.
 */

import type { SpriteSheetMetadata } from '../types/index.js';

/**
 * Code binding result
 */
export interface CodeBinding {
  language: 'typescript' | 'javascript';
  code: string;
  filePath: string;
}

/**
 * Code Binding Generator
 * 
 * Generates code bindings for game engines.
 */
export class CodeBindingGenerator {
  /**
   * Generate Phaser animation code
   */
  generatePhaserAnimation(
    spriteName: string,
    _sheetMetadata: SpriteSheetMetadata,
    animations: { [key: string]: { frames: number[]; frameRate: number; loop: boolean } }
  ): CodeBinding {
    const animationKeys = Object.keys(animations);
    const animationCode = animationKeys.map(key => {
      const anim = animations[key];
      const frameKeys = anim.frames.map(f => `'${spriteName}_${f}'`).join(', ');
      return `    this.anims.create({
      key: '${key}',
      frames: [${frameKeys}],
      frameRate: ${anim.frameRate},
      repeat: ${anim.loop ? -1 : 0}
    });`;
    }).join('\n');

    const code = `// Phaser animation configuration for ${spriteName}
export function create${this.toPascalCase(spriteName)}Animations(scene: Phaser.Scene): void {
${animationCode}
}
`;

    return {
      language: 'typescript',
      code,
      filePath: `src/animations/${spriteName}Animations.ts`,
    };
  }

  /**
   * Generate PixiJS sprite loader code
   */
  generatePixiJSLoader(
    spriteName: string,
    sheetMetadata: SpriteSheetMetadata
  ): CodeBinding {
    const code = `// PixiJS sprite loader for ${spriteName}
import { Texture, BaseTexture, Rectangle } from 'pixi.js';

export function load${this.toPascalCase(spriteName)}SpriteSheet(
  baseTexture: BaseTexture
): Texture[] {
  const textures: Texture[] = [];
  
  ${sheetMetadata.frames.map((frame, index) => {
    return `  // Frame ${index}
  textures[${index}] = new Texture(
    baseTexture,
    new Rectangle(${frame.bounds.x}, ${frame.bounds.y}, ${frame.bounds.width}, ${frame.bounds.height})
  );`;
  }).join('\n\n')}
  
  return textures;
}
`;

    return {
      language: 'typescript',
      code,
      filePath: `src/loaders/${spriteName}Loader.ts`,
    };
  }

  /**
   * Generate custom engine binding template
   */
  generateCustomBinding(
    spriteName: string,
    sheetMetadata: SpriteSheetMetadata
  ): CodeBinding {
    const code = `// Custom engine binding for ${spriteName}
export interface ${this.toPascalCase(spriteName)}SpriteSheet {
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
  frames: Array<{
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export const ${spriteName}Sheet: ${this.toPascalCase(spriteName)}SpriteSheet = {
  width: ${sheetMetadata.width},
  height: ${sheetMetadata.height},
  frameWidth: ${sheetMetadata.frameWidth},
  frameHeight: ${sheetMetadata.frameHeight},
  frames: [
${sheetMetadata.frames.map(frame => `    {
      index: ${frame.index},
      x: ${frame.bounds.x},
      y: ${frame.bounds.y},
      width: ${frame.bounds.width},
      height: ${frame.bounds.height},
    }`).join(',\n')}
  ],
};
`;

    return {
      language: 'typescript',
      code,
      filePath: `src/sprites/${spriteName}Sheet.ts`,
    };
  }

  /**
   * Convert to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

