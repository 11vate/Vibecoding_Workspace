export interface ContentSchema {
    id: string;
    seed: number;
    type: string;
    [key: string]: any;
}

export interface IGenerator<TConfig, TSchema extends ContentSchema, TArtifact> {
    id: string;
    version: string;
    
    /**
     * Phase 1: Synthesis
     * Pure function: Config + Seed -> Schema (Data)
     */
    generate(seed: number, config: TConfig): TSchema;

    /**
     * Phase 2: Rendering
     * Pure function: Schema -> Artifact (Visual/File)
     */
    render(schema: TSchema): Promise<TArtifact>;
}

export abstract class BaseGenerator<TConfig, TSchema extends ContentSchema, TArtifact> implements IGenerator<TConfig, TSchema, TArtifact> {
    abstract id: string;
    abstract version: string;

    abstract generate(seed: number, config: TConfig): TSchema;
    abstract render(schema: TSchema): Promise<TArtifact>;

    protected getRandom(seed: number): () => number {
        // Simple LCG for deterministic randomness
        let state = seed;
        return () => {
            state = (state * 1664525 + 1013904223) % 4294967296;
            return state / 4294967296;
        };
    }
}
