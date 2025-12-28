# Intelligent AI Sprite Generator

A standalone, intelligent AI sprite generator that produces **production-ready game assets** (static and animated) that can be immediately used in real games without manual asset creation.

## Features

- **Intelligence Layer**: Understands game art requirements, not just image generation
- **AI-Powered Generation**: Stable Diffusion + LoRAs (Pixel Art XL, Cartoon, custom)
- **Animation Support**: Multi-frame animations with pose consistency
- **Complete Pipeline**: Generation → Validation → Post-Processing → Export
- **Game Engine Integration**: Phaser, PixiJS, custom engine support
- **100% Free & Local**: Uses local Stable Diffusion (ComfyUI/Automatic1111), no API keys required

## Installation

```bash
npm install
npm run build
```

## Prerequisites

- **Node.js** 18+ 
- **Python 3.10 or 3.11** (for Stable Diffusion)
- **Local Stable Diffusion**: ComfyUI or Automatic1111 running locally
  - ComfyUI: http://localhost:8188 (default)
  - Automatic1111: http://localhost:7860 (default)

## Setting Up Stable Diffusion

The sprite generator requires a local Stable Diffusion installation. See the [AI Tools Setup Guide](../ai-tools/README.md) for complete setup instructions.

**Quick Setup:**
1. Navigate to `../ai-tools/`
2. Run `node verify-setup.js` to check prerequisites
3. Start Automatic1111: `start-automatic1111.bat` (or ComfyUI: `start-comfyui.bat`)
4. Wait for the web interface to load (first startup may take several minutes)

**Note:** If Stable Diffusion is not available, the generator will automatically fall back to procedural generation.

## Quick Start

```bash
# Generate a static sprite
npm run dev generate "pixel art fire pet, side view"

# Generate an animated sprite
npm run dev generate "pixel art fire pet idle animation" --frames 8

# Generate with specific style
npm run dev generate "cartoon hero character" --style cartoon

# Generate with engine export
npm run dev generate "pixel art hero" --engine phaser --output ./assets
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## API Documentation

See [docs/API.md](docs/API.md) for API reference.

## Integration

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for integration guides, including Pixel Pets Reborn integration.

## License

ISC

