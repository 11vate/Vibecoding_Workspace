import { BaseGenerator, ContentSchema } from '../BaseGenerator';

export interface GeometryConfig {
    type: 'cube' | 'pyramid' | 'terrain';
    size: number;
    subdivisions: number; // For terrain
    roughness: number;    // For terrain height
}

export interface GeometrySchema extends ContentSchema {
    type: 'geometry';
    format: 'obj';
    vertices: number[][]; // [x, y, z]
    faces: number[][];    // [v1_index, v2_index, v3_index, ...]
}

export class GeometryLogic extends BaseGenerator<GeometryConfig, GeometrySchema, never> {
    id = 'gen_geo_logic_v1';
    version = '1.0.0';

    generate(seed: number, config: GeometryConfig): GeometrySchema {
        const rng = this.getRandom(seed);
        const vertices: number[][] = [];
        const faces: number[][] = [];

        if (config.type === 'cube') {
            const s = config.size / 2;
            // Vertices
            vertices.push([-s, -s, -s]); // 0
            vertices.push([s, -s, -s]);  // 1
            vertices.push([s, s, -s]);   // 2
            vertices.push([-s, s, -s]);  // 3
            vertices.push([-s, -s, s]);  // 4
            vertices.push([s, -s, s]);   // 5
            vertices.push([s, s, s]);    // 6
            vertices.push([-s, s, s]);   // 7

            // Faces (Quads -> Triangles for OBJ, or keep as quads)
            // OBJ supports quads.
            // Back
            faces.push([0, 1, 2, 3]);
            // Front
            faces.push([4, 5, 6, 7]);
            // Left
            faces.push([0, 3, 7, 4]);
            // Right
            faces.push([1, 5, 6, 2]);
            // Top
            faces.push([3, 2, 6, 7]);
            // Bottom
            faces.push([0, 4, 5, 1]);

        } else if (config.type === 'pyramid') {
             const s = config.size / 2;
             const h = config.size;
             
             // Base
             vertices.push([-s, 0, -s]); // 0
             vertices.push([s, 0, -s]);  // 1
             vertices.push([s, 0, s]);   // 2
             vertices.push([-s, 0, s]);  // 3
             // Tip
             vertices.push([0, h, 0]);   // 4

             // Base Face
             faces.push([0, 3, 2, 1]);
             // Sides
             faces.push([0, 1, 4]);
             faces.push([1, 2, 4]);
             faces.push([2, 3, 4]);
             faces.push([3, 0, 4]);
        }

        return {
            id: `geo_${seed.toString(16)}`,
            seed,
            type: 'geometry',
            format: 'obj',
            vertices,
            faces
        };
    }

    async render(schema: GeometrySchema): Promise<never> {
        throw new Error("GeometryLogic cannot render. Use a Renderer.");
    }
}
