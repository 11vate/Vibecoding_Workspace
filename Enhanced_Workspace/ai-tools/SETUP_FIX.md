# Automatic1111 Setup Fix

## Changes Made

The startup script `start-automatic1111.bat` has been updated to use `launch.py` instead of `webui.py`.

### What Changed
- **Before**: `python webui.py --listen`
- **After**: `python launch.py --listen --skip-torch-cuda-test --skip-python-version-check`

### Why This Fix Works

`launch.py` is the proper entry point that:
1. Calls `prepare_environment()` first, which:
   - Creates the `repositories/` directory
   - Clones required repositories (stable-diffusion-stability-ai, k-diffusion, BLIP, etc.)
   - Installs Python dependencies
2. Then calls `start()` which launches the webui

This ensures all required repositories exist before any imports happen, preventing the AssertionError.

## Testing

To verify the fix works:

1. Run `start-automatic1111.bat`
2. A command window will open showing the startup process
3. You should see:
   - "Cloning Stable Diffusion..." messages
   - "Installing requirements..." messages
   - Eventually: "Running on local URL: http://localhost:7860"
4. The first run may take 5-10 minutes to:
   - Clone repositories
   - Install Python dependencies
   - Download models (if needed)

## Expected Behavior

- **First Run**: Takes several minutes, clones repositories, installs dependencies
- **Subsequent Runs**: Much faster, just starts the webui
- **No More Errors**: The AssertionError about missing stable-diffusion repository should be gone

## CPU vs GPU Configuration

The startup script includes `--skip-torch-cuda-test` which allows Automatic1111 to run on CPU.

### CPU Mode (Current Configuration)
- **Flag**: `--skip-torch-cuda-test`
- **Performance**: Slower but works without GPU
- **Use Case**: Systems without NVIDIA GPU or when GPU setup is problematic
- **Note**: Generation will be slower but functional

### GPU Mode (Optional)
If you have an NVIDIA GPU and want to use it:
1. Install CUDA toolkit compatible with your GPU
2. Remove `--skip-torch-cuda-test` from the startup script
3. Automatic1111 will automatically detect and use the GPU

## Python Version Requirements

### Recommended: Python 3.10.6
- Automatic1111 is tested with Python 3.10.6
- Best compatibility and stability
- See [PYTHON_SETUP.md](PYTHON_SETUP.md) for installation instructions

### Current Workaround
- The script includes `--skip-python-version-check` to suppress version warnings
- Allows Python 3.12 to run (may have compatibility issues)
- **Recommendation**: Install Python 3.10.6 for best results

### Command-Line Flags

The startup script uses these flags:
- `--listen` - Allows network access (not just localhost)
- `--skip-torch-cuda-test` - Allows CPU-only operation
- `--skip-python-version-check` - Suppresses Python version warnings

## Verification

Once Automatic1111 is running:
- Open http://localhost:7860 in your browser
- You should see the Automatic1111 web interface
- The sprite generator will automatically detect and use it

## Troubleshooting

### "Torch is not able to use GPU" Error
- **Solution**: The `--skip-torch-cuda-test` flag is already included
- This allows CPU operation
- If you want GPU, remove the flag and set up CUDA

### Python Version Warnings
- **Solution**: The `--skip-python-version-check` flag suppresses warnings
- For best compatibility, install Python 3.10.6 (see [PYTHON_SETUP.md](PYTHON_SETUP.md))

### Still Having Issues?
- Check that all dependencies are installed
- Verify Python is in your PATH
- Review the startup window for specific error messages

