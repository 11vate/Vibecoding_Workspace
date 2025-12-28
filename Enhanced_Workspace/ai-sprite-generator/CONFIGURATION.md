# Sprite Generator Configuration

## ✅ Current Status

The sprite generator is **properly configured and working**!

### What's Working:
- ✅ Dependencies installed
- ✅ Project built successfully
- ✅ CLI is functional
- ✅ Procedural fallback is working (generates sprites even without AI)

### Current Configuration:
- **Stable Diffusion Type**: Automatic1111 (default)
- **Base URL**: http://localhost:7860
- **Fallback**: Procedural generation (active when AI is unavailable)

## Configuration Options

### Environment Variables

The generator uses these environment variables (optional, has defaults):

```env
# Automatic1111 Configuration (default)
AUTOMATIC1111_BASE_URL=http://localhost:7860

# ComfyUI Configuration (alternative)
COMFYUI_BASE_URL=http://localhost:8188

# Enable detailed logging
ENABLE_LOGGING=false
```

### Default Behavior

- If no environment variables are set, the generator defaults to:
  - Automatic1111 at `http://localhost:7860`
  - If Automatic1111 is not available, it automatically falls back to procedural generation
  - This ensures the generator always works, even without AI services

## Usage Examples

### Basic Generation
```bash
npm run dev generate "pixel art fire pet, side view"
```

### With Output Directory
```bash
npm run dev generate "pixel art fire pet, side view" --output ./test-output
```

### Animated Sprite
```bash
npm run dev generate "pixel art fire pet idle animation" --frames 8
```

### With Style
```bash
npm run dev generate "cartoon hero character" --style cartoon
```

### With Game Engine Export
```bash
npm run dev generate "pixel art hero" --engine phaser --output ./assets
```

## Enabling AI Generation

To use AI-powered generation instead of procedural fallback:

1. **Start Automatic1111**:
   ```bash
   cd ../ai-tools
   start-automatic1111.bat
   ```
   Wait for the web interface to load at http://localhost:7860

2. **Verify it's running**:
   Open http://localhost:7860 in your browser

3. **Run the generator**:
   ```bash
   cd ../ai-sprite-generator
   npm run dev generate "pixel art fire pet, side view"
   ```

The generator will automatically detect and use Automatic1111 when available.

## Configuration Files

- **Styles**: `config/styles.json` - Defines available art styles
- **Asset Registry**: `asset_registry.json` - Tracks generated assets

## Troubleshooting

### AI Not Available
- **Symptom**: See "[AIGenerator] AI not available, using procedural fallback"
- **Solution**: Start Automatic1111 or ComfyUI, or continue using procedural generation

### Port Already in Use
- **Symptom**: Cannot connect to Automatic1111
- **Solution**: Change port in startup script or update `AUTOMATIC1111_BASE_URL` environment variable

### Generation Fails
- **Check**: Ensure Node.js 18+ is installed
- **Check**: Verify all dependencies are installed (`npm install`)
- **Check**: Ensure project is built (`npm run build`)

## Next Steps

1. ✅ Generator is configured and working
2. ⏭️ Optionally start Automatic1111 for AI generation
3. ⏭️ Generate sprites for your game project
4. ⏭️ Integrate with game engine using `--engine` option



