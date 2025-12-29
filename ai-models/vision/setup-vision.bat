@echo off
REM Setup vision model for vibecoder

echo ================================================
echo    Vibecoder Vision System Setup
echo ================================================
echo.

echo Pulling vision model (MiniCPM-V)...
echo This may take 5-10 minutes...
echo.

ollama pull minicpm-v

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to pull vision model
    pause
    exit /b 1
)

echo.
echo ================================================
echo Setup complete!
echo.
echo Test it:
echo   python analyze-screenshot.py screenshot.png "Describe this UI"
echo ================================================
pause
