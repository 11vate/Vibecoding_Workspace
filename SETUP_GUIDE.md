# Ultimate Vibecoding Workspace - Complete Setup Guide

This guide will walk you through setting up the complete, free, offline-capable vibecoding stack.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local AI Setup (Ollama)](#local-ai-setup-ollama)
3. [Asset Generation Setup (ComfyUI)](#asset-generation-setup-comfyui)
4. [Game Development Stack](#game-development-stack)
5. [Cursor Configuration](#cursor-configuration)
6. [Verification](#verification)

---

## Prerequisites

### System Requirements

**Minimum:**
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 16GB (32GB recommended for ComfyUI)
- **GPU**: Nvidia GPU with 4GB+ VRAM (for Stable Diffusion)
- **Disk**: 20GB free space
- **CPU**: Modern quad-core processor

**Software:**
- **Node.js** 18+ and npm
- **Git** for version control
- **VS Code** or **Cursor** editor

### Install Node.js

```bash
# Download from https://nodejs.org/
# Or use package manager:

# Windows (winget)
winget install OpenJS.NodeJS

# macOS (homebrew)
brew install node

# Linux (apt)
sudo apt install nodejs npm
```

### Install Git

```bash
# Windows (winget)
winget install Git.Git

# macOS (homebrew)
brew install git

# Linux (apt)
sudo apt install git
```

---

## Local AI Setup (Ollama)

**Ollama** is the recommended local AI platform for code generation.

### Step 1: Install Ollama

**Windows:**
```bash
# Download from https://ollama.com/download
# Or use winget:
winget install Ollama.Ollama
```

**macOS:**
```bash
# Download from https://ollama.com/download
# Or use homebrew:
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Download Coding Models

```bash
# Primary coding model (7B, fast)
ollama pull qwen2.5-coder:7b

# Advanced coding model (14B, more capable)
ollama pull qwen2.5-coder:14b

# Lightweight model (3B, very fast)
ollama pull phi3:mini

# DeepSeek for complex algorithms
ollama pull deepseek-coder:6.7b
```

### Step 3: Test Ollama

```bash
# Start Ollama service (runs in background)
ollama serve

# Test in new terminal
ollama run qwen2.5-coder:7b "Write a TypeScript function to check if a number is prime"
```

### Step 4: Integrate with Cursor (Optional)

1. Open Cursor Settings
2. Go to "Models"
3. Add custom model:
   - Provider: "Ollama"
   - URL: `http://localhost:11434`
   - Model: `qwen2.5-coder:7b`

---

## Asset Generation Setup (ComfyUI)

**ComfyUI** enables local Stable Diffusion for sprite and asset generation.

### Step 1: Install ComfyUI

**Option A: ComfyUI Desktop (Easiest)**

1. Download from: https://github.com/comfyanonymous/ComfyUI/releases
2. Look for "ComfyUI_windows_portable" or Desktop version
3. Extract and run `run_nvidia_gpu.bat` (Windows) or equivalent

**Option B: Portable Build (Windows)**

```bash
# Download latest release
# https://github.com/comfyanonymous/ComfyUI/releases

# Extract with 7-Zip
# Run: run_nvidia_gpu.bat (for Nvidia GPUs)
# Or: run_cpu.bat (for CPU-only)
```

**Option C: Manual Installation**

```bash
# Clone repository
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt

# Run
python main.py
```

### Step 2: Download Base Models

1. Download Stable Diffusion v1.5:
   - URL: https://huggingface.co/runwayml/stable-diffusion-v1-5
   - File: `v1-5-pruned-emaonly.safetensors`
   - Place in: `ComfyUI/models/checkpoints/`

2. (Optional) Download SDXL:
   - URL: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
   - File: `sd_xl_base_1.0.safetensors`
   - Place in: `ComfyUI/models/checkpoints/`

### Step 3: Download Pixel Art Models

**SD_PixelArt_SpriteSheet_Generator**
```bash
# Download from:
# https://huggingface.co/Onodofthenorth/SD_PixelArt_SpriteSheet_Generator

# Place in: ComfyUI/models/checkpoints/
```

**All-In-One-Pixel-Model**
```bash
# Download from:
# https://huggingface.co/PublicPrompts/All-In-One-Pixel-Model

# Place in: ComfyUI/models/checkpoints/
```

### Step 4: Test ComfyUI

1. Start ComfyUI (runs at `http://127.0.0.1:8188`)
2. Load default workflow
3. Select your pixel art model
4. Enter prompt: "pixelsprite, warrior character, 32x32"
5. Click "Queue Prompt"
6. Wait for generation (first run is slower)

**Verification:**
- ✅ ComfyUI interface loads
- ✅ Models appear in checkpoint dropdown
- ✅ Can generate test image
- ✅ 100% offline (no internet needed after setup)

---

## Game Development Stack

### Step 1: Create New Game Project

```bash
# Navigate to workspace
cd C:\Users\11vat\OneDrive\Desktop\Ultimate_Cursor_Vibecoding_Workspace

# Copy optimal template
cp -r templates/game-dev-excalibur-stack my-game
cd my-game

# Install dependencies
npm install
```

### Step 2: Test Development Server

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:3000
# You should see the game menu
```

### Step 3: Build for Production

```bash
# Type check
npm run type-check

# Build
npm run build

# Preview production build
npm run preview
```

### Step 4: Test PWA Offline Mode

1. Build project: `npm run build`
2. Preview: `npm run preview`
3. Open DevTools (F12)
4. Go to Application → Service Workers
5. Check "Offline" checkbox
6. Reload page
7. ✅ Game should work offline!

---

## Cursor Configuration

### Step 1: Install Cursor (if not already installed)

Download from: https://cursor.com/

### Step 2: Import Game Development Rules

1. Copy the enhanced `.cursorrules` for game development
2. Place in your project root

```bash
# Copy game-dev specific rules
cp docs/cursor-rules/game-development.cursorrules my-game/.cursorrules
```

### Step 3: Configure Cursor AI

1. Open Cursor Settings (Ctrl+,)
2. Go to "Cursor" section
3. Enable:
   - ✅ Cursor Tab (autocomplete)
   - ✅ Cursor Cmd+K (inline editing)
   - ✅ Cursor Chat (sidebar)

4. (Optional) Connect to Ollama:
   - Models → Add Custom Model
   - Provider: Ollama
   - Base URL: `http://localhost:11434`
   - Model: `qwen2.5-coder:7b`

### Step 4: Test Cursor Integration

1. Open a TypeScript file
2. Type a comment: `// Create a function to calculate fibonacci`
3. Press Tab → Cursor should suggest implementation
4. Open Cursor Chat (Ctrl+L)
5. Ask: "Explain the game state management pattern"

---

## Verification Checklist

### ✅ Local AI (Ollama)

```bash
# Should return version
ollama --version

# Should list models
ollama list

# Should generate code
ollama run qwen2.5-coder:7b "Write hello world in TypeScript"
```

Expected:
- ✅ Ollama installed and running
- ✅ At least one coding model downloaded
- ✅ Can generate code locally
- ✅ No internet required (after setup)

### ✅ Asset Generation (ComfyUI)

- ✅ ComfyUI launches at http://127.0.0.1:8188
- ✅ At least one checkpoint model loaded
- ✅ Can generate test image
- ✅ Works 100% offline

### ✅ Game Development Stack

```bash
cd my-game
npm run dev      # Should start at http://localhost:3000
npm run build    # Should create dist/ folder
npm run preview  # Should serve production build
```

Expected:
- ✅ Dev server runs without errors
- ✅ Game renders in browser
- ✅ TypeScript compilation succeeds
- ✅ PWA service worker registers
- ✅ Offline mode works

### ✅ Cursor Integration

- ✅ Cursor autocomplete works (Tab)
- ✅ Cursor inline edit works (Cmd/Ctrl+K)
- ✅ Cursor chat works (Ctrl+L)
- ✅ (Optional) Ollama integration works

---

## Troubleshooting

### Ollama Issues

**"Command not found"**
```bash
# Add Ollama to PATH
# Windows: Installer should do this automatically
# macOS/Linux: Add to ~/.bashrc or ~/.zshrc
export PATH=$PATH:/usr/local/bin
```

**"Connection refused"**
```bash
# Ensure Ollama service is running
ollama serve

# Or restart Ollama
# Windows: Restart from system tray
# macOS/Linux: killall ollama && ollama serve
```

**Models not downloading**
```bash
# Check disk space
df -h

# Retry download
ollama pull qwen2.5-coder:7b
```

### ComfyUI Issues

**"CUDA out of memory"**
- Reduce image resolution (512x512 instead of 1024x1024)
- Use `--lowvram` flag
- Close other GPU-intensive applications

**"No module named..."**
```bash
# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

**Interface not loading**
- Check firewall settings
- Try different port: `python main.py --port 8189`
- Clear browser cache

### Game Development Issues

**"Module not found"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Ensure TypeScript is installed
npm install -D typescript

# Run type check
npm run type-check
```

**PWA not working**
- Build project first: `npm run build`
- PWA only works in production mode
- Check Service Worker in DevTools → Application

---

## Next Steps

1. **Create Your First Game**
   ```bash
   cd my-game
   npm run dev
   ```

2. **Customize Game Template**
   - Edit `/docs/vision.md` - Define your game concept
   - Edit `/docs/mechanics.md` - Design core mechanics
   - Create blueprints in `/docs/blueprints/`

3. **Generate Assets with ComfyUI**
   - Launch ComfyUI: `http://127.0.0.1:8188`
   - Use pixel art models
   - Save to `/src/assets/sprites/`

4. **Use AI for Coding**
   - Ask Ollama for code via terminal
   - Or use Cursor integration
   - Follow vibecoding principles

5. **Deploy Your Game**
   - Build: `npm run build`
   - Deploy `dist/` to:
     - GitHub Pages
     - Netlify
     - Vercel
     - Any static host

---

## Resources

### Official Documentation
- [Ollama Docs](https://github.com/ollama/ollama)
- [ComfyUI Docs](https://github.com/comfyanonymous/ComfyUI)
- [Excalibur.js Docs](https://excaliburjs.com/)
- [Vite PWA Docs](https://vite-pwa-org.netlify.app/)

### Community
- [Ollama Discord](https://discord.gg/ollama)
- [ComfyUI Reddit](https://reddit.com/r/StableDiffusion)
- [Excalibur.js Discord](https://discord.gg/excalibur)

### Learning
- [Comprehensive Research Findings](./COMPREHENSIVE_RESEARCH_FINDINGS_2025.md)
- [Workspace Philosophy](./WORKSPACE_PHILOSOPHY.md)
- [Design Intelligence Stack](./docs/design-intelligence/README.md)

---

**Setup complete! You now have a fully offline, AI-powered game development environment with zero API costs.**

**Happy vibecoding! 🚀**
