# Configuration Guide

This directory contains configuration management for API connections and database setups.

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual API keys and configuration.

### 2. Required API Keys

- **OpenAI API Key**: For vision models and embeddings
  - Get from: https://platform.openai.com/api-keys
  - Required for: Image analysis, text embeddings

- **Stability AI API Key**: For Stable Diffusion image generation
  - Get from: https://platform.stability.ai/
  - Required for: Image generation

- **Leonardo AI API Key** (Optional): Alternative image generation
  - Get from: https://leonardo.ai/
  - Required for: Leonardo AI image generation

- **Sprite Sage API Key** (Optional): Sprite-specific generation
  - Get from: https://spritesage.ai/
  - Required for: Sprite Sage generation

### 3. Vector Database Setup

#### Option A: ChromaDB (Recommended for local development)

```bash
# Install ChromaDB
pip install chromadb

# Start ChromaDB server
chroma run --path ./chroma_db --port 8000
```

Set in `.env`:
```
VECTOR_DB_TYPE=chroma
VECTOR_DB_CONNECTION_STRING=http://localhost:8000
```

#### Option B: Weaviate

```bash
# Using Docker
docker run -d \
  --name weaviate \
  -p 8080:8080 \
  -e QUERY_DEFAULTS_LIMIT=25 \
  -e AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true \
  -e PERSISTENCE_DATA_PATH=/var/lib/weaviate \
  semitechnologies/weaviate:latest
```

Set in `.env`:
```
VECTOR_DB_TYPE=weaviate
VECTOR_DB_CONNECTION_STRING=http://localhost:8080
```

#### Option C: Cloud Services

For production, consider:
- **Pinecone**: Managed vector database
- **Qdrant Cloud**: Managed Qdrant instance
- **Milvus Cloud**: Managed Milvus instance

### 4. ComfyUI Setup (Optional)

If using ComfyUI for advanced workflows:

```bash
# Install ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt

# Start ComfyUI
python main.py --port 8188
```

Set in `.env`:
```
COMFYUI_BASE_URL=http://localhost:8188
```

### 5. Initialize System

```typescript
import { initializeSystem } from './config/initialize';

const result = await initializeSystem();
if (result.success) {
  console.log('System initialized successfully');
  console.log('Connected services:', result.services);
} else {
  console.error('Initialization errors:', result.errors);
  console.warn('Warnings:', result.warnings);
}
```

## Configuration Options

### API Rate Limits

Adjust rate limits based on your API tier:

```env
OPENAI_RATE_LIMIT=50          # Requests per minute
STABILITY_AI_RATE_LIMIT=10    # Requests per minute
```

### Embedding Configuration

```env
EMBEDDING_MODEL=text-embedding-ada-002
EMBEDDING_DIMENSION=1536
ENABLE_EMBEDDING_CACHE=true
EMBEDDING_CACHE_SIZE=1000
```

### Vector Database Options

```env
VECTOR_DB_DIMENSION=1536       # Embedding dimension
VECTOR_DB_COLLECTION_NAME=knowledge_graph
VECTOR_DB_OPTIONS={"tenant":"default"}  # JSON string for additional options
```

## Troubleshooting

### Connection Issues

1. **ChromaDB Connection Failed**
   - Ensure ChromaDB server is running
   - Check connection string format
   - Verify port is not blocked by firewall

2. **OpenAI API Errors**
   - Verify API key is correct
   - Check API quota/limits
   - Ensure network connectivity

3. **Embedding Generation Fails**
   - Verify OpenAI API key is set
   - Check API rate limits
   - Ensure embedding model name is correct

### Database Setup Issues

1. **Collection Creation Fails**
   - Check database permissions
   - Verify dimension matches embedding dimension
   - Ensure database is not full

2. **Search Returns No Results**
   - Verify embeddings are being generated correctly
   - Check collection has data
   - Verify query embedding dimension matches collection dimension

## Production Considerations

1. **Use Environment-Specific Configs**: Don't commit `.env` files
2. **Connection Pooling**: Consider connection pooling for high traffic
3. **Health Monitoring**: Enable health checks for production
4. **Error Handling**: Implement retry logic and circuit breakers
5. **Rate Limiting**: Respect API rate limits to avoid throttling
6. **Security**: Store API keys securely (use secrets management)









