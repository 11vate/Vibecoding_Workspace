import { BaseGenerator, ContentSchema } from '../BaseGenerator';

export interface SpriteConfig {
    dimensions: { width: number; height: number };
    palette: string[];
    symmetry: 'none' | 'horizontal' | 'vertical' | 'quad';
    complexity: number; // 0.0 to 1.0
}

export interface SpriteSchema extends ContentSchema {
    type: 'sprite';
    dimensions: { width: number; height: number };
    palette: string[];
    pixels: number[][]; // 2D grid of palette indices (-1 for transparent)
}

// PURE LOGIC - NO CANVAS DEPENDENCY
export class SpriteLogic extends BaseGenerator<SpriteConfig, SpriteSchema, never> {
    id = 'gen_sprite_logic_v1';
    version = '1.0.0';

    generate(seed: number, config: SpriteConfig): SpriteSchema {
        const rng = this.getRandom(seed);
        const width = config.dimensions.width;
        const height = config.dimensions.height;
        const pixels: number[][] = Array(height).fill(null).map(() => Array(width).fill(-1));

        // Cellular Automata / Random Walk Logic
        // 1. Seed center
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        
        // 2. Generate half (if symmetric)
        const scanWidth = config.symmetry === 'horizontal' ? Math.ceil(width / 2) : width;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < scanWidth; x++) {
                // Determine pixel probability based on distance from center
                const dx = x - centerX;
                const dy = y - centerY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const maxDist = Math.min(width, height) / 2;
                
                const prob = 1 - (dist / maxDist);
                const noise = rng();
                
                if (noise < prob * config.complexity) {
                    // Pick a random color from palette
                    const colorIndex = Math.floor(rng() * config.palette.length);
                    pixels[y][x] = colorIndex;
                }
            }
        }

        // 3. Mirroring
        if (config.symmetry === 'horizontal') {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < scanWidth; x++) {
                    const mirrorX = width - 1 - x;
                    pixels[y][mirrorX] = pixels[y][x];
                }
            }
        }

        return {
            id: `sprite_${seed.toString(16)}`,
            seed,
            type: 'sprite',
            dimensions: config.dimensions,
            palette: config.palette,
            pixels
        };
    }

    // This generator only produces schemas (Logic), so render throws or returns null
    async render(schema: SpriteSchema): Promise<never> {
        throw new Error("SpriteLogic cannot render. Use a Renderer.");
    }
}
