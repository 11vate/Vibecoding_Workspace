# Python 3.10.6 Setup Guide for Automatic1111

## Why Python 3.10.6?

Automatic1111 is tested and recommended with Python 3.10.6. While newer versions (like 3.12) may work, 3.10.6 provides the best compatibility and stability.

## Installation Steps

### Option 1: Install Python 3.10.6 (Recommended)

1. **Download Python 3.10.6**
   - Visit: https://www.python.org/downloads/release/python-3106/
   - Download "Windows installer (64-bit)" for your system

2. **Run the Installer**
   - **Important**: Check "Add Python 3.10 to PATH" during installation
   - Choose "Install Now" or "Customize installation"
   - If customizing, ensure "pip" and "py launcher" are selected

3. **Verify Installation**
   ```powershell
   py -3.10 --version
   ```
   Should show: `Python 3.10.6`

### Option 2: Use Python Launcher (Multiple Versions)

If you have multiple Python versions installed, you can use the Python launcher:

1. **Check Available Versions**
   ```powershell
   py --list
   ```

2. **Use Specific Version**
   - Update `start-automatic1111.bat` to use: `py -3.10 launch.py --listen ...`
   - Or create a virtual environment with Python 3.10

## Using Python 3.10.6 with Automatic1111

### Method 1: Update Startup Script

Edit `start-automatic1111.bat` and change line 17 to:
```batch
py -3.10 launch.py --listen --skip-torch-cuda-test --skip-python-version-check
```

### Method 2: Create Virtual Environment (Recommended)

1. **Create venv with Python 3.10**
   ```powershell
   cd ai-tools\automatic1111
   py -3.10 -m venv venv
   ```

2. **Activate venv**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Update startup script to use venv**
   ```batch
   call venv\Scripts\activate.bat
   python launch.py --listen --skip-torch-cuda-test --skip-python-version-check
   ```

## Verification

After installing Python 3.10.6, verify it works:

```powershell
# Check Python version
py -3.10 --version

# Check if pip works
py -3.10 -m pip --version
```

## Troubleshooting

### "Python 3.10 not found"
- Ensure Python 3.10.6 is installed
- Check PATH environment variable includes Python 3.10
- Try using full path: `C:\Python310\python.exe`

### "Multiple Python versions conflict"
- Use `py -3.10` to explicitly call Python 3.10
- Consider using a virtual environment

### "Still getting version warning"
- The `--skip-python-version-check` flag should suppress the warning
- If it persists, ensure you're using the correct Python version

## Current Workaround

The startup script currently uses `--skip-python-version-check` to allow Python 3.12 to run. This works but may have compatibility issues. Installing Python 3.10.6 is recommended for best results.

## Resources

- **Python 3.10.6 Download**: https://www.python.org/downloads/release/python-3106/
- **Python Launcher Docs**: https://docs.python.org/3/using/windows.html#launcher
- **Virtual Environments**: https://docs.python.org/3/tutorial/venv.html



