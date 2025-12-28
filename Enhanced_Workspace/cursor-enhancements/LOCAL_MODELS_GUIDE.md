# Local Models Guide - 100% Free, No API Keys Required

## Overview

The system now supports **completely free, local AI models** with no API keys required. All core functionality works offline and privately.

## Quick Start

### 1. Install Ollama

**Windows/Mac/Linux:**
```bash
# Download from https://ollama.ai
# Or use package manager:
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
```

**Start Ollama:**
```bash
ollama serve
```

**Download recommended models:**
```bash
ollama pull llama3.1:8b      # General purpose LLM
ollama pull llava:latest     # Vision model for image analysis
ollama pull mistral:latest   # Alternative LLM
```

### 2. Install Local Stable Diffusion

**Option A: ComfyUI (Recommended)**
```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
python main.py --port 8188
```

**Option B: Automatic1111**
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
./webui.sh --api
```

**Option C: Fooocus**
```bash
git clone https://github.com/lllyasviel/Fooocus.git
cd Fooocus
pip install -r requirements.txt
python launch.py --port 7865
```

### 3. Install Node.js Dependencies

```bash
npm install @xenova/transformers
```

### 4. Configure Environment

Create/update `.env`:
```env
# Enable local models (default: true)
USE_LOCAL_MODELS=true

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3.1:8b
OLLAMA_VISION_MODEL=llava:latest

# Local Stable Diffusion
SD_TYPE=comfyui
SD_BASE_URL=http://localhost:8188

# Local Embeddings
SENTENCE_TRANSFORMERS_MODEL=Xenova/all-MiniLM-L6-v2
USE_GPU=false

# API keys are now OPTIONAL (only needed for fallback)
# OPENAI_API_KEY=          # Optional fallback
# STABILITY_AI_API_KEY=    # Optional fallback
```

### 5. Initialize System

```typescript
import { initializeSystem } from './config/initialize';

const result = await initializeSystem();
console.log('Local models:', result.services.localModels);
```

## Features

### ✅ Completely Free
- No API costs ever
- No usage limits
- No rate limiting (except hardware)

### ✅ Privacy
- All data stays local
- No data sent to external services
- Perfect for sensitive projects

### ✅ Offline
- Works without internet
- No external dependencies
- Self-contained

### ✅ Customizable
- Fine-tune models for your needs
- Train custom LoRAs
- Full control over models

## Model Capabilities

### Ollama (LLM & Vision)
- **Text Generation:** Code, documentation, prompts
- **Image Analysis:** Sprite sheet analysis, metadata extraction
- **Multimodal Reasoning:** Connect visuals to code

**Recommended Models:**
- `llama3.1:8b` - Best balance of quality and speed
- `llava:latest` - Vision understanding
- `mistral:latest` - Alternative LLM
- `deepseek-r1:latest` - Advanced reasoning

### Local Stable Diffusion (Image Generation)
- **Sprite Generation:** Pixel art, game assets
- **Animation Frames:** Consistent style across frames
- **Style Control:** Fine-tuned LoRAs for pixel art

**Supported Backends:**
- ComfyUI (node-based, powerful)
- Automatic1111 (web UI, easy to use)
- Fooocus (simplified, fast)

### Sentence Transformers (Embeddings)
- **Text Embeddings:** For knowledge graph
- **Semantic Search:** Find similar assets/code
- **Fast & Local:** No API calls needed

**Recommended Models:**
- `Xenova/all-MiniLM-L6-v2` - Fast, 384 dimensions
- `Xenova/all-mpnet-base-v2` - Better quality, 768 dimensions

## Fine-Tuning Workflow

### 1. Prepare Dataset

```typescript
import { createDatasetBuilder } from './integrations/finetuning/dataset-builder';

const builder = createDatasetBuilder({
  inputDir: './sprites',
  outputDir: './dataset',
  captionStyle: "auto"
});

const items = await builder.buildDataset();
await builder.saveKohyaSSFormat(items, './dataset/kohya');
```

### 2. Train LoRA

```bash
# Using Kohya SS
cd kohya_ss
python train_network.py \
  --pretrained_model_name_or_path=stable-diffusion-v1-5 \
  --train_data_dir=../dataset/kohya \
  --output_dir=../models/lora \
  --network_module=networks.lora \
  --network_dim=16 \
  --network_alpha=32 \
  --save_model_as=safetensors \
  --training_steps=1000
```

### 3. Use Fine-Tuned Model

```typescript
import { createLocalStableDiffusionService } from './integrations/local-models/local-stable-diffusion';

const sd = createLocalStableDiffusionService({
  type: "comfyui",
  baseUrl: "http://localhost:8188"
});

// Load LoRA in ComfyUI workflow
// Or use Automatic1111 with --lora flag
```

## Performance Tips

### Hardware Requirements

**Minimum (CPU only):**
- 8GB RAM
- Works but slow

**Recommended:**
- 16GB+ RAM
- NVIDIA GPU with 6GB+ VRAM
- Much faster inference

**Optimal:**
- 32GB+ RAM
- NVIDIA GPU with 12GB+ VRAM
- Can run multiple models simultaneously

### Optimization

1. **Use smaller models** for faster inference
2. **Enable GPU** if available (`USE_GPU=true`)
3. **Batch operations** when possible
4. **Cache embeddings** to avoid recomputation

## Troubleshooting

### Ollama not found
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Or download from https://ollama.ai
```

### Local SD not responding
- Check if service is running
- Verify port in `.env` matches service port
- Check firewall settings

### Out of memory
- Use smaller models
- Reduce batch size
- Close other applications
- Use CPU mode if GPU memory limited

### Slow performance
- Enable GPU acceleration
- Use smaller/faster models
- Reduce image resolution
- Use quantization (4-bit models)

## Migration from API to Local

The system automatically falls back:
1. **Try local models first** (if `USE_LOCAL_MODELS=true`)
2. **Fallback to API** (if local fails and API key available)
3. **Error** (if both fail)

To force local-only:
```env
USE_LOCAL_MODELS=true
# Don't set any API keys
```

To use APIs only:
```env
USE_LOCAL_MODELS=false
# Set API keys
```

## Next Steps

- Read [Fine-Tuning Guide](FINETUNING_GUIDE.md) for custom models
- Check [Model Registry](config/model-registry.ts) for available models
- Review [Performance Guide](PERFORMANCE_GUIDE.md) for optimization









