# Pixel Pets Reborn x Remeged: The Polished Edition

**"Infinite Evolution, Eternal Memory"**

> **[📄 READ THE MASTER CONCEPT DOC](docs/MASTER_CONCEPT_REDEFINED.md)** - The comprehensive vision for the polished game.

## Description

Pixel Pets Reborn x Remeged is a mobile-first Progressive Web App (PWA) that redefines the creature collector genre. It combines **generative AI**, **strategic depth**, and **retro-glitch aesthetics** into a cohesive experience where every pet is truly unique.

This is not just a remake; it is a **Remerge** of classic mechanics with modern technology.

## The 4 Pillars of Polish

1.  **AI-Powered Fusion (The Brain)**
    *   Generates unique lore, names, and abilities based on parent traits and "Fusion Intent".
    *   *System Doc*: [`docs/CONTENT/AI_FUSION_SYSTEM.md`](docs/CONTENT/AI_FUSION_SYSTEM.md)

2.  **Glitch Mechanics (The Twist)**
    *   Chaos Stones introduce risk/reward "Glitch" effects.
    *   Rule-breaking abilities (e.g., "Ignore Defense", "Reality Break").
    *   *System Doc*: [`docs/CONTENT/GLITCHED_FUSION_MECHANICS.md`](docs/CONTENT/GLITCHED_FUSION_MECHANICS.md)

3.  **Lineage & Memory (The Soul)**
    *   Pets remember their ancestors.
    *   "Fusion Signatures" track every genetic decision.
    *   Ancestral abilities grow stronger over generations.
    *   *System Doc*: [`docs/CONTENT/FUSION_SIGNATURE_LINEAGE_MEMORY.md`](docs/CONTENT/FUSION_SIGNATURE_LINEAGE_MEMORY.md)

4.  **Domain Warfare (The Battlefield)**
    *   4v4 Grid Combat with front/back row tactics.
    *   Dynamic "Domains" that transform the battlefield visuals and rules.
    *   *System Doc*: [`docs/CONTENT/COMBAT_SYSTEM.md`](docs/CONTENT/COMBAT_SYSTEM.md)

## Key Features

- **150+ Base "Prime" Pets**: The genetic foundation across 10 families.
- **Uniqueness Scoring**: Every pet gets a 0-100 score based on its rarity and innovation.
- **Hybrid Content**: Hand-crafted quality + AI-generated infinite variety.
- **Offline-First**: Full game loop works without internet (using local heuristic fallbacks or local LLM).
- **PWA**: Installable app experience.

## Tech Stack

- React 19 + TypeScript 5.9+
- Vite 7
- Zustand 5 (state management)
- React Router 7 (routing)
- IndexedDB (via idb library)
- Ollama (local LLM for AI fusion)
- Zod (runtime validation)
- Vitest (testing)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## Project Structure

```
src/
├── domain/                   # Domain layer (business logic)
│   ├── entities/            # Core entities (Pet, Stone, etc.)
│   ├── valueObjects/        # Value objects (Stats, Rarity, etc.)
│   ├── repositories/        # Repository interfaces
│   └── services/            # Domain services
├── application/              # Application layer (use cases)
│   ├── fusion/              # Fusion use cases
│   ├── combat/              # Combat use cases
│   ├── dungeon/             # Dungeon use cases
│   └── collection/          # Collection use cases
├── infrastructure/           # Infrastructure layer
│   ├── persistence/         # Database implementations
│   ├── ai/                  # AI service implementations
│   ├── sprites/             # Sprite generation
│   └── events/              # Event system
├── presentation/             # Presentation layer
│   ├── components/          # React components
│   ├── hooks/               # React hooks
│   ├── stores/              # State management (Zustand)
│   └── routes/              # Routing configuration
└── shared/                   # Shared utilities
    ├── types/               # Shared TypeScript types
    ├── utils/               # Utility functions
    └── constants/           # Constants and configs
```

## Architecture

This project uses **Hexagonal Architecture** (ports and adapters) with clear separation between:

- **Domain Layer**: Business logic and entities (no dependencies on infrastructure)
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Technical implementations (database, AI, sprites)
- **Presentation Layer**: UI components and state management

## AI Fusion

The game uses Ollama (local LLM) for AI-powered pet fusion. If Ollama is not available, it falls back to procedural generation.

### Setting up Ollama

1. Install Ollama from https://ollama.ai
2. Pull a model: `ollama pull llama3.2`
3. Start Ollama service
4. The game will automatically detect and use Ollama when available

## License

ISC





















