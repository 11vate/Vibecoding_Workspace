# Asset Enforcement System - Setup Guide

## Quick Answer

**Good news:** The core asset enforcement system requires **NO additional setup**! It uses only Node.js built-in modules and will work immediately.

## What's Already Installed

The dependencies you installed earlier are sufficient:
- ✅ Node.js built-in modules (`fs/promises`, `path`)
- ✅ TypeScript support
- ✅ All existing cursor-enhancements dependencies

## Optional Setup (For Auto-Generation)

If you want **automatic asset generation** when assets are missing, you'll need:

### 1. Local AI Models (Optional but Recommended)

The system will auto-generate missing assets using local AI if available:

#### Option A: Ollama (for LLM/Vision tasks)
```bash
# Install Ollama from https://ollama.ai
# Then pull models:
ollama pull llama3.1:8b
ollama pull llava:latest
```

#### Option B: Local Stable Diffusion (for image generation)
- **ComfyUI**: https://github.com/comfyanonymous/ComfyUI
- **Automatic1111**: https://github.com/AUTOMATIC1111/stable-diffusion-webui
- **Fooocus**: https://github.com/lllyasviel/Fooocus

Set environment variables (optional):
```bash
# .env file in cursor-enhancements/
USE_LOCAL_MODELS=true
SD_TYPE=comfyui  # or "automatic1111" or "fooocus"
SD_BASE_URL=http://localhost:8188  # ComfyUI default
```

### 2. Without Local AI Models

The system will still work! It will:
- ✅ Detect missing assets
- ✅ Block code generation (in strict mode)
- ✅ Generate placeholder assets (procedural fallback)
- ❌ Won't generate high-quality AI assets

## How It Works

1. **Automatic**: Asset registries are created automatically when needed
2. **No Config Files**: Uses project structure automatically
3. **Self-Contained**: All logic is in the codebase

## Testing the System

### 1. Verify Installation

```bash
cd cursor-enhancements
npm list --depth=0
```

Should show all dependencies installed.

### 2. Test Asset Registry

Create a test script:

```typescript
// test-asset-registry.ts
import { createAssetRegistry } from './integrations/asset-registry/asset-registry';

async function test() {
  const registry = await createAssetRegistry('./test-project');
  console.log('✅ Asset registry created successfully!');
  console.log('Registry path:', registry.registryPath);
}

test();
```

Run with:
```bash
npx tsx test-asset-registry.ts
```

### 3. Test Asset Verification

```typescript
// test-verification.ts
import { verifyProjectAssets } from './integrations/asset-registry/self-verification';

async function test() {
  const report = await verifyProjectAssets('./games/PixelPets_Reborn_x_remeged');
  console.log('Verification complete:');
  console.log('- Assets found:', report.assetsFound);
  console.log('- Assets valid:', report.assetsValid);
  console.log('- Assets missing:', report.assetsMissing);
}

test();
```

## Configuration

### Default Behavior

The system runs with these defaults:
- **Strict Mode**: `true` (blocks code generation if assets missing)
- **Auto-Generate**: `true` (automatically generates missing assets)
- **Validate On Disk**: `true` (verifies files actually exist)

### Customizing Behavior

You can customize in your code:

```typescript
import { preCodeGenerationCheck } from './layer-42-asset-enforcement';

const config = {
  projectPath: './my-project',
  framework: 'phaser',
  autoGenerate: true,      // Auto-generate missing assets
  strictMode: true,        // Block if assets missing
  validateOnDisk: true     // Verify files exist
};

const result = await preCodeGenerationCheck(code, config);
```

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: Make sure you're running from the `cursor-enhancements` directory or have proper TypeScript path resolution.

### Issue: Auto-generation not working

**Solution**: 
1. Check if local AI models are running
2. Verify environment variables are set
3. Check console for error messages
4. System will fall back to procedural generation

### Issue: Asset registry not found

**Solution**: The registry is created automatically on first use. If you see errors, check file permissions.

## Next Steps

1. ✅ **System is ready to use** - No setup needed for basic functionality
2. 🔧 **Optional**: Set up local AI models for auto-generation
3. 🧪 **Test**: Try generating code that references assets
4. 📝 **Verify**: Run asset verification on your projects

## Summary

- ✅ **Core system**: Works immediately, no setup needed
- 🔧 **Auto-generation**: Optional, requires local AI models
- 📦 **Dependencies**: Already installed
- 🚀 **Ready to use**: Start enforcing asset-first development now!







