@echo off
REM Setup RAG system for vibecoder

echo ================================================
echo    Vibecoder RAG System Setup
echo ================================================
echo.

echo Installing dependencies...
pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ================================================
echo Setup complete!
echo.
echo Next step: Index your codebase
echo   python index-codebase.py
echo.
echo Then query it:
echo   python query-rag.py "How is X implemented?"
echo ================================================
pause
