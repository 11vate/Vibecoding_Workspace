import { GeometryLogic, GeometryConfig, GeometrySchema } from './logic/GeometryLogic';
import { ObjRenderer } from '../renderers/ObjRenderer';

export class GeometryGenerator {
    private logic = new GeometryLogic();
    private renderer = new ObjRenderer();

    id = this.logic.id;
    version = this.logic.version;

    generate(seed: number, config: GeometryConfig): GeometrySchema {
        return this.logic.generate(seed, config);
    }

    async render(schema: GeometrySchema): Promise<string> {
        return this.renderer.render(schema);
    }
}

export type { GeometryConfig, GeometrySchema };
