@echo off
REM Start ComfyUI
echo Starting ComfyUI...
echo.
echo This will start the web interface on http://localhost:8188
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0comfyui"
if not exist "main.py" (
    echo ERROR: ComfyUI not found in comfyui directory
    echo Please ensure the repository is cloned correctly.
    pause
    exit /b 1
)

python main.py --listen
pause



