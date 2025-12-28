import fs from 'fs-extra';
import path from 'path';
import { IGenerator } from '../../src/content/generators/BaseGenerator';
import { z } from 'zod';

// Define the Lore Config Schema
export const LoreConfigSchema = z.object({
    keywords: z.array(z.string()),
    length: z.number().optional().default(50)
});

export type LoreConfig = z.infer<typeof LoreConfigSchema>;

// Define the Lore Schema (The Output Data)
export interface LoreSchema {
    id: string;
    seed: number;
    text: string;
    keywords: string[];
}

export class LoreGenerator implements IGenerator<LoreConfig, LoreSchema, string> {
    id = "gen_lore_v1";
    version = "1.0.0";

    generate(seed: number, config: LoreConfig): LoreSchema {
        // Deterministic PRNG based on seed (simple implementation for demo)
        const pseudoRandom = (offset: number) => {
            const x = Math.sin(seed + offset) * 10000;
            return x - Math.floor(x);
        };

        const templates = [
            "The [KEYWORD] of the [KEYWORD] is known for its [KEYWORD].",
            "A [KEYWORD] legend speaks of a [KEYWORD] that changed everything.",
            "Beware the [KEYWORD], for it seeks the [KEYWORD].",
            "In the land of [KEYWORD], only the [KEYWORD] survive."
        ];

        // Select template
        const templateIndex = Math.floor(pseudoRandom(0) * templates.length);
        let text = templates[templateIndex];

        // Fill keywords
        let keywordIndex = 0;
        while (text.includes("[KEYWORD]")) {
            const keyword = config.keywords[keywordIndex % config.keywords.length];
            text = text.replace("[KEYWORD]", keyword.toUpperCase());
            keywordIndex++;
        }

        return {
            id: `lore_${seed}`,
            seed,
            text,
            keywords: config.keywords
        };
    }

    async render(schema: LoreSchema): Promise<string> {
        return `ID: ${schema.id}\nSEED: ${schema.seed}\nKEYWORDS: ${schema.keywords.join(', ')}\n\n${schema.text}`;
    }
}
