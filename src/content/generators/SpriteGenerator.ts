import { SpriteLogic, SpriteConfig, SpriteSchema } from './logic/SpriteLogic';
import { NodeSpriteRenderer } from '../renderers/NodeSpriteRenderer';

// Facade for Backward Compatibility and Ease of Use in Node Environment
export class SpriteGenerator {
    private logic = new SpriteLogic();
    private renderer = new NodeSpriteRenderer();

    // Re-export types
    id = this.logic.id;
    version = this.logic.version;

    generate(seed: number, config: SpriteConfig): SpriteSchema {
        return this.logic.generate(seed, config);
    }

    async render(schema: SpriteSchema): Promise<Buffer> {
        return this.renderer.render(schema);
    }
}

export type { SpriteConfig, SpriteSchema };
