# Content Compiler Architecture

**The "Vibecoding" Engine**

## Concept
We treat Content Synthesis not as "AI Generation" but as **Code Compilation**.
Just as TypeScript compiles to JavaScript, **Content Schemas compile to Game Assets**.

## The Stack

### Level 1: The Source Code (Grammar & Logic)
*   **Input**: Global Seed + Generator Scripts + Config.
*   **Analogy**: `.ts` files.
*   **Location**: `src/content/generators/`

### Level 2: The AST (Abstract Syntax Tree) -> Schemas
*   **Input**: Generator Output.
*   **Artifact**: JSON Schemas (`sprite-schema.json`, `level-schema.json`).
*   **Analogy**: The AST / Intermediate Representation.
*   **Role**: The "Pure" mathematical definition of the content. Validatable.
*   **Location**: `src/content/schemas/`

### Level 3: The Bytecode (Runtime Assets)
*   **Input**: Rendered Schemas.
*   **Artifact**: PNGs, WAVs, JSON Data.
*   **Analogy**: `.js` / `.wasm` files.
*   **Role**: Optimized formats for the Engine (Phaser/React/Unity) to consume.
*   **Location**: `src/assets/generated/`

## The Compiler Pipeline (`npm run compile:content`)

1.  **Lexing/Parsing**: Read Global Config.
2.  **Semantic Analysis**: Run Generators (WFC, Grammars) to produce Schemas.
3.  **Type Checking**: Validate Schemas against Constraints (Integrity Gate).
4.  **Code Gen**: Render Schemas into Assets (Sprite Synthesis, Audio Synth).
5.  **Linking**: Bind Assets to Game Entities (Registry).

## Advantages
1.  **Type Safety for Art**: We can "unit test" our art styles.
2.  **Refactoring**: Change the "Palette" in Config, recompile, and the whole game updates.
3.  **Optimization**: The "Compiler" can choose to output 4K assets for PC or 1x assets for Mobile without changing the Source.
