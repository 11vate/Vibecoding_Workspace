import { createCanvas } from 'canvas';
import { SpriteSchema } from '../generators/logic/SpriteLogic';

export class NodeSpriteRenderer {
    async render(schema: SpriteSchema): Promise<Buffer> {
        const canvas = createCanvas(schema.dimensions.width, schema.dimensions.height);
        const ctx = canvas.getContext('2d');

        // Clear (Transparent)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Pixels
        for (let y = 0; y < schema.dimensions.height; y++) {
            for (let x = 0; x < schema.dimensions.width; x++) {
                const colorIndex = schema.pixels[y][x];
                if (colorIndex >= 0 && colorIndex < schema.palette.length) {
                    ctx.fillStyle = schema.palette[colorIndex];
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        return canvas.toBuffer('image/png');
    }
}
