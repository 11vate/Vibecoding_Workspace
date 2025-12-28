# Quick Start Guide

Get up and running with the Ultimate Vibe Coding Enhancement System in minutes.

## Prerequisites

- Node.js 18+ installed
- Python 3.8+ (for ChromaDB, optional)
- API keys for services you want to use

## 1. Initial Setup

### Option A: Automated Setup (Recommended)

**Linux/Mac:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Windows:**
```powershell
.\scripts\setup.ps1
```

### Option B: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   npm install weaviate-ts-client --save
   ```

2. **Create `.env` file:**
   ```bash
   cp config/.env.example .env
   # Or create manually
   ```

3. **Add your API keys to `.env`:**
   ```env
   OPENAI_API_KEY=sk-your-key-here
   STABILITY_AI_API_KEY=your-key-here
   ```

## 2. Database Setup

### ChromaDB (Local Development)

```bash
# Install ChromaDB
pip install chromadb

# Start ChromaDB server
chroma run --path ./chroma_db --port 8000
```

Update `.env`:
```env
VECTOR_DB_TYPE=chroma
VECTOR_DB_CONNECTION_STRING=http://localhost:8000
```

### Weaviate (Docker)

```bash
docker run -d \
  --name weaviate \
  -p 8080:8080 \
  -e QUERY_DEFAULTS_LIMIT=25 \
  -e AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true \
  semitechnologies/weaviate:latest
```

Update `.env`:
```env
VECTOR_DB_TYPE=weaviate
VECTOR_DB_CONNECTION_STRING=http://localhost:8080
```

## 3. Initialize System

Create an initialization script:

```typescript
// scripts/init.ts
import { initializeSystem, initializeKnowledgeGraph } from '../config/initialize';

async function main() {
  console.log('Initializing system...');
  
  const result = await initializeSystem();
  
  if (result.success) {
    console.log('✅ System initialized successfully!');
    console.log('Connected APIs:', result.services.apis);
    console.log('Database connected:', result.services.database);
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(w => console.log('  -', w));
    }
    
    // Initialize knowledge graph
    try {
      await initializeKnowledgeGraph();
      console.log('✅ Knowledge graph initialized');
    } catch (error) {
      console.error('❌ Failed to initialize knowledge graph:', error);
    }
  } else {
    console.error('❌ Initialization failed:');
    result.errors.forEach(e => console.error('  -', e));
    process.exit(1);
  }
}

main();
```

Run it:
```bash
npx tsx scripts/init.ts
```

## 4. Test Connections

```typescript
// test-connections.ts
import { createOpenAIVisionService } from './integrations/multimodal-models/openai-vision';
import { createStableDiffusionService } from './integrations/multimodal-models/stable-diffusion';

// Test OpenAI Vision
const visionService = createOpenAIVisionService({
  apiKey: process.env.OPENAI_API_KEY!
});

try {
  // Test with a simple image
  const result = await visionService.analyzeImage({
    image: Buffer.from('test'), // Replace with actual image
    prompt: "Describe this image"
  });
  console.log('✅ OpenAI Vision connected');
} catch (error) {
  console.error('❌ OpenAI Vision failed:', error);
}

// Test Stable Diffusion
const sdService = createStableDiffusionService({
  apiKey: process.env.STABILITY_AI_API_KEY!
});

try {
  // Test connection (won't generate, just check API)
  console.log('✅ Stable Diffusion service ready');
} catch (error) {
  console.error('❌ Stable Diffusion failed:', error);
}
```

## 5. Usage Examples

### Generate a Sprite

```typescript
import { executePipeline } from './layer-39-asset-pipeline';

const result = await executePipeline(
  {
    prompt: "a small fire elemental",
    style: "pixel-art",
    resolution: [32, 32],
    frameCount: 4,
    entity: "elemental",
    theme: "fantasy"
  },
  {
    generationSource: "ai",
    validationEnabled: true,
    codeBindingEnabled: true,
    targetFramework: "phaser",
    standards: {
      allowedFormats: ["png"],
      minDimensions: { width: 16, height: 16 },
      maxDimensions: { width: 512, height: 512 },
      requiredMetadata: ["id", "name", "format"]
    },
    autoIntegrate: false
  }
);

console.log('Generated asset:', result.asset.metadata.name);
```

### Search Knowledge Graph

```typescript
import { searchGraph } from './layer-38-knowledge-graph';

const results = await searchGraph({
  text: "player movement sprite",
  limit: 5
});

results.forEach(result => {
  console.log(`Found: ${result.node.name} (similarity: ${result.similarity})`);
});
```

### Run Simulation

```typescript
import { runCombatSimulation } from './layer-40-simulation-engine';

const result = await runCombatSimulation({
  iterations: 1000,
  teams: [
    {
      id: "team1",
      units: [
        {
          id: "unit1",
          stats: { health: 100, attack: 20, defense: 10, speed: 5 },
          abilities: ["attack"]
        }
      ]
    },
    {
      id: "team2",
      units: [
        {
          id: "unit2",
          stats: { health: 100, attack: 20, defense: 10, speed: 5 },
          abilities: ["attack"]
        }
      ]
    }
  ]
});

console.log(`Win rate: ${result.metrics.winRate}`);
```

## Troubleshooting

### "API key is required" errors
- Check your `.env` file has the correct keys
- Ensure environment variables are loaded (use `dotenv` package)

### "ChromaDB client not found"
- Install ChromaDB: `pip install chromadb`
- Or switch to Weaviate in `.env`

### "Connection refused" errors
- Ensure database server is running
- Check connection string in `.env`
- Verify firewall/port settings

### Rate limit errors
- Reduce `RATE_LIMIT` values in `.env`
- Add delays between requests
- Upgrade API tier if needed

## Next Steps

- Read [Configuration Guide](config/README.md) for advanced setup
- Check [Implementation Summary](IMPLEMENTATION_SUMMARY.md) for feature overview
- Review [Layer Documentation](README.md) for system architecture









