# Fine-Tuning Guide

## Overview

Fine-tune Stable Diffusion models to create custom pixel art generators optimized for your game's style.

## Quick Start

### 1. Prepare Dataset

```typescript
import { createDatasetBuilder } from './integrations/finetuning/dataset-builder';

const builder = createDatasetBuilder({
  inputDir: './sprites',
  outputDir: './dataset',
  captionStyle: "auto"
});

// Build dataset from sprite images
const items = await builder.buildDataset();

// Save in Kohya SS format
await builder.saveKohyaSSFormat(items, './dataset/kohya');
```

### 2. Install Kohya SS

```bash
git clone https://github.com/bmaltais/kohya_ss.git
cd kohya_ss
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Training

Create `train_config.json`:
```json
{
  "pretrained_model_name_or_path": "runwayml/stable-diffusion-v1-5",
  "train_data_dir": "./dataset/kohya",
  "output_dir": "./models/lora/pixel_art",
  "network_module": "networks.lora",
  "network_dim": 16,
  "network_alpha": 32,
  "save_model_as": "safetensors",
  "training_steps": 1000,
  "learning_rate": 0.0001,
  "batch_size": 1,
  "resolution": "512,512",
  "enable_bucket": true,
  "min_bucket_reso": 256,
  "max_bucket_reso": 1024
}
```

### 4. Train LoRA

```bash
cd kohya_ss
python train_network.py --config ../train_config.json
```

### 5. Use Fine-Tuned Model

**ComfyUI:**
- Load LoRA in workflow
- Use LoRA node to apply to generation

**Automatic1111:**
- Place LoRA in `models/Lora/`
- Use `<lora:model_name:1.0>` in prompt

## Dataset Best Practices

### Image Preparation
- **Resolution:** 512x512 or higher
- **Format:** PNG with transparency
- **Style:** Consistent pixel art style
- **Count:** 50-200 images minimum

### Captioning
- **Auto-generated:** From filename
- **Manual:** More accurate, time-consuming
- **Tags:** Include style, character, action

### Organization
```
dataset/
├── pixel_art_sprites/
│   ├── character_idle_01.png
│   ├── character_idle_01.txt  # Caption file
│   ├── character_walk_01.png
│   └── character_walk_01.txt
```

## Training Tips

### For Pixel Art
- Use lower learning rate (0.0001)
- Train for 500-2000 steps
- Use LoRA rank 8-16
- Focus on style consistency

### For Characters
- Include multiple angles/poses
- Consistent color palette
- Clear character features
- 100+ images recommended

### For Animations
- Include all animation frames
- Consistent timing
- Clear action labels
- Sequence-aware captions

## Evaluation

After training, test your LoRA:

```typescript
import { createLocalStableDiffusionService } from './integrations/local-models/local-stable-diffusion';

const sd = createLocalStableDiffusionService({
  type: "comfyui",
  baseUrl: "http://localhost:8188"
});

// Generate with LoRA
const result = await sd.generateImage({
  prompt: "a pixel art character, <lora:pixel_art_lora:1.0>",
  style: "pixel-art",
  resolution: [32, 32]
});
```

## Troubleshooting

### Training Fails
- Check dataset format
- Verify model path
- Ensure enough disk space
- Check GPU memory

### Poor Results
- Increase training steps
- Improve dataset quality
- Adjust learning rate
- Try different LoRA rank

### Slow Training
- Use GPU acceleration
- Reduce batch size
- Lower resolution
- Use gradient checkpointing

## Advanced: Custom Training

For advanced users, you can customize the training process:

```typescript
import { createLoRATrainer } from './integrations/finetuning/lora-trainer';

const trainer = createLoRATrainer({
  baseModel: "runwayml/stable-diffusion-v1-5",
  datasetPath: "./dataset/kohya",
  outputPath: "./models/lora/custom",
  loraRank: 32,
  trainingSteps: 2000,
  learningRate: 0.00005
});

await trainer.train((progress) => {
  console.log(`Step ${progress.step}/${progress.totalSteps}, Loss: ${progress.loss}`);
});
```

## Resources

- **Kohya SS:** https://github.com/bmaltais/kohya_ss
- **LoRA Guide:** https://github.com/bmaltais/kohya_ss/wiki/LoRA-training
- **Pixel Art Models:** Search Hugging Face for pixel art LoRAs









