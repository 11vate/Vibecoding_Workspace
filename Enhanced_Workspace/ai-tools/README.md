# AI Tools - Stable Diffusion Setup

This directory contains the local Stable Diffusion installations (Automatic1111 and ComfyUI) for the AI Sprite Generator.

## Directory Structure

```
ai-tools/
├── automatic1111/          # Automatic1111 WebUI
│   └── models/
│       ├── Stable-diffusion/  # Main SD models
│       └── Lora/              # LoRA models
├── comfyui/                # ComfyUI
│   └── models/
│       ├── checkpoints/        # Main SD models
│       └── controlnet/         # ControlNet models
├── models/                 # Shared model storage (optional)
├── start-automatic1111.bat # Startup script for Automatic1111
├── start-comfyui.bat       # Startup script for ComfyUI
├── verify-setup.js         # Setup verification script
└── download-model.py       # Model download helper
```

## Prerequisites

- **Python 3.10 or 3.11** (Python 3.12 may work but is not officially supported)
- **Git** for cloning repositories
- **pip** for installing Python packages

## Quick Start

### 1. Verify Setup

Run the verification script to check if everything is installed:

```bash
node verify-setup.js
```

### 2. Start Stable Diffusion

**Option A: Automatic1111 (Recommended for beginners)**
```bash
start-automatic1111.bat
```
- Web interface: http://localhost:7860
- Easier to use, web-based UI
- First startup may take several minutes to install dependencies

**Option B: ComfyUI (Advanced)**
```bash
start-comfyui.bat
```
- Web interface: http://localhost:8188
- Node-based workflow system
- More control over generation pipeline

### 3. Use with Sprite Generator

Once either service is running, the AI Sprite Generator will automatically detect and use it:

```bash
cd ../ai-sprite-generator
npm run dev generate "pixel art fire pet, side view"
```

## Model Management

### Downloading Models

Use the download script to get Stable Diffusion models:

```bash
# Download SD 1.5 (default, ~4GB)
python download-model.py runwayml/stable-diffusion-v1-5 automatic1111/models/Stable-diffusion

# Download SDXL (larger, better quality, ~7GB)
python download-model.py stabilityai/stable-diffusion-xl-base-1.0 automatic1111/models/Stable-diffusion
```

### Model Locations

- **Automatic1111**: Place `.ckpt` or `.safetensors` files in `automatic1111/models/Stable-diffusion/`
- **ComfyUI**: Place `.ckpt` or `.safetensors` files in `comfyui/models/checkpoints/`
- **LoRAs**: Place in `automatic1111/models/Lora/` or `comfyui/models/loras/`

### Recommended Models

- **SD 1.5**: `runwayml/stable-diffusion-v1-5` - Good balance of quality and speed
- **SDXL**: `stabilityai/stable-diffusion-xl-base-1.0` - Higher quality, larger files
- **Pixel Art LoRA**: Search Hugging Face for "pixel art lora" - Enhances pixel art generation

## Troubleshooting

### Python Not Found
- Ensure Python is installed and added to PATH
- Try `python --version` to verify installation
- On Windows, you may need to use `py` instead of `python`

### Port Already in Use
- Automatic1111 uses port 7860
- ComfyUI uses port 8188
- Close other applications using these ports or change ports in startup scripts

### Models Not Loading
- Verify model files are in the correct directory
- Check file extensions (`.ckpt` or `.safetensors`)
- Ensure models are fully downloaded (check file sizes)

### First Startup Takes Long
- Automatic1111 downloads dependencies on first run
- This is normal and only happens once
- Ensure stable internet connection

### Out of Memory Errors
- Use smaller models (SD 1.5 instead of SDXL)
- Reduce batch size in generation settings
- Close other applications to free RAM

## Configuration

### Environment Variables

The sprite generator reads configuration from `../ai-sprite-generator/.env`:

```env
COMFYUI_BASE_URL=http://localhost:8188
AUTOMATIC1111_BASE_URL=http://localhost:7860
ENABLE_LOGGING=true
```

### Changing Ports

Edit the startup scripts to use different ports:

**start-automatic1111.bat:**
```batch
python webui.py --listen --port 7861
```

**start-comfyui.bat:**
```batch
python main.py --listen --port 8189
```

Then update the `.env` file accordingly.

## Advanced Usage

### Running Both Services

You can run both Automatic1111 and ComfyUI simultaneously on different ports. The sprite generator will try Automatic1111 first, then ComfyUI.

### Custom Models

Download custom models from:
- Hugging Face: https://huggingface.co/models
- Civitai: https://civitai.com/ (download manually)

Place them in the appropriate `models` directory.

### LoRA Models

LoRAs (Low-Rank Adaptations) modify the base model for specific styles:
- Download from Hugging Face or Civitai
- Place in `automatic1111/models/Lora/`
- Use in prompts: `<lora:modelname:1.0>`

## Resources

- **Automatic1111**: https://github.com/AUTOMATIC1111/stable-diffusion-webui
- **ComfyUI**: https://github.com/comfyanonymous/ComfyUI
- **Hugging Face Models**: https://huggingface.co/models
- **Stable Diffusion Guide**: https://stable-diffusion-art.com/

## Support

For issues with:
- **Setup**: Run `node verify-setup.js` to diagnose
- **Models**: Check file locations and sizes
- **Services**: Verify ports are available and Python is working
- **Sprite Generator**: Check `../ai-sprite-generator/README.md`



