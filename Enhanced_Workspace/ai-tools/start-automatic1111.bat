@echo off
REM Start Automatic1111 Stable Diffusion WebUI
echo Starting Automatic1111 Stable Diffusion WebUI...
echo.
echo This will start the web interface on http://localhost:7860
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0automatic1111"
if not exist "webui.py" (
    echo ERROR: Automatic1111 not found in automatic1111 directory
    echo Please ensure the repository is cloned correctly.
    pause
    exit /b 1
)

REM Fix: Use CompVis repository as Stability-AI repository is private/deleted
set STABLE_DIFFUSION_REPO=https://github.com/CompVis/stable-diffusion.git

python launch.py --listen --skip-torch-cuda-test --skip-python-version-check
if errorlevel 1 (
    echo.
    echo ERROR: Automatic1111 failed to start
    echo Check the error messages above for details
    pause
    exit /b 1
)

