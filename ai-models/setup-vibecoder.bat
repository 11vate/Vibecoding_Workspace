@echo off
REM Setup script for Ultimate Vibecoder AI Model (Windows)
REM Creates a custom AI specifically for vibecoding workspace

echo ================================================
echo    Ultimate Vibecoder Setup (Windows)
echo ================================================
echo.

REM Check if Ollama is installed
where ollama >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ollama not found!
    echo.
    echo Please install Ollama first:
    echo   Download from: https://ollama.com/download
    echo   Or use: winget install Ollama.Ollama
    pause
    exit /b 1
)

echo [OK] Ollama found
echo.

REM Check if base model exists
echo Checking for base model ^(qwen2.5-coder:7b^)...
ollama list | findstr /C:"qwen2.5-coder:7b" >nul
if %ERRORLEVEL% NEQ 0 (
    echo Downloading base model ^(this will take 5-10 minutes^)...
    ollama pull qwen2.5-coder:7b
) else (
    echo [OK] Base model already installed
)
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0

REM Create the custom vibecoder model
echo Creating custom vibecoder model...
ollama create vibecoder -f "%SCRIPT_DIR%Modelfile-vibecoder"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Vibecoder model created successfully!
) else (
    echo [ERROR] Failed to create model
    pause
    exit /b 1
)
echo.

REM Test the model
echo Testing vibecoder...
echo.
echo Prompt: 'Create a simple player movement system'
echo.
echo Response:
echo ----------
ollama run vibecoder "Create a simple player movement system for a 2D platformer. Keep it brief."
echo ----------
echo.

echo [OK] Setup complete!
echo.
echo Quick Start:
echo.
echo   # Interactive mode
echo   ollama run vibecoder
echo.
echo   # One-shot generation
echo   ollama run vibecoder "Your coding task here"
echo.
echo   # List all your models
echo   ollama list
echo.
echo Next steps:
echo   1. Read ai-models\CREATE_CUSTOM_MODEL.md for advanced usage
echo   2. Try: ollama run vibecoder "Design a coin collection mechanic"
echo   3. Compare to generic: ollama run qwen2.5-coder:7b "same prompt"
echo.
echo Happy vibecoding!
pause
