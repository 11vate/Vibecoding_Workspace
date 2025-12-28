# Generator Contract

**Authority Tier**: 2 (Mandatory Process)
**Purpose**: Define the standard interface for all content generators.

## The Contract
Every generator must implement this interface (conceptually or in code):

```typescript
interface IGenerator<TConfig, TSchema, TArtifact> {
  // 1. Identification
  id: string;
  version: string;

  // 2. Generation (Pure Function)
  // Takes Seed + Config -> Returns Schema (Data)
  generate(seed: number, config: TConfig): TSchema;

  // 3. Rendering (Pure Function)
  // Takes Schema -> Returns Artifact (Visual/File)
  render(schema: TSchema): Promise<TArtifact>;
}
```

## Phases
1.  **Configuration**: Parameters set by the designer (or parent generator).
2.  **Synthesis**: The logic runs using the Seed to make decisions. Output is the **Schema**.
3.  **Validation**: The Schema is checked against rules (e.g., "Is the dungeon pathable?").
4.  **Rendering**: The Schema is baked into final assets (PNG, JSON, etc.).

## Rules
*   **No Side Effects**: Generators cannot read global state (except what is passed in config).
*   **Stability**: Small changes to config should produce predictable changes in output.
*   **Fallback**: If generation fails constraints, retry with `Seed + 1` (up to N retries).
