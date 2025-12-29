@echo off
REM Master setup script for Ultimate Vibecoder

echo ================================================
echo    Ultimate Vibecoder Setup
echo ================================================
echo.
echo This will set up:
echo   - RAG System (codebase knowledge)
echo   - Memory System (persistent learning)
echo   - Vision System (screenshot analysis)
echo   - MoE Router (expert model routing)
echo.
echo Estimated time: 15-30 minutes
echo.
pause

echo.
echo ================================================
echo PHASE 1: RAG System Setup
echo ================================================
echo.

cd rag
if exist requirements.txt (
    echo Installing RAG dependencies...
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] RAG dependencies failed to install
        pause
    ) else (
        echo [OK] RAG dependencies installed
        echo.
        echo Indexing your codebase...
        python index-codebase.py
        if %ERRORLEVEL% EQU 0 (
            echo [OK] Codebase indexed!
        ) else (
            echo [WARNING] Indexing failed
        )
    )
) else (
    echo [WARNING] RAG requirements.txt not found
)

cd ..

echo.
echo ================================================
echo PHASE 2: Memory System Setup
echo ================================================
echo.

cd memory
if exist requirements.txt (
    echo Installing Memory dependencies...
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] Memory dependencies failed to install
        pause
    ) else (
        echo [OK] Memory dependencies installed
        echo.
        echo Pulling embedding model for memory...
        ollama pull nomic-embed-text
        if %ERRORLEVEL% EQU 0 (
            echo [OK] Embedding model installed!
        ) else (
            echo [WARNING] Embedding model pull failed
        )
    )
) else (
    echo [WARNING] Memory requirements.txt not found
)

cd ..

echo.
echo ================================================
echo PHASE 3: Vision System Setup
echo ================================================
echo.

echo Pulling vision model (this may take 5-10 minutes)...
ollama pull minicpm-v
if %ERRORLEVEL% EQU 0 (
    echo [OK] Vision model installed!
) else (
    echo [WARNING] Vision model pull failed
)

echo.
echo ================================================
echo PHASE 4: Enhanced Context
echo ================================================
echo.

echo Updating vibecoder model with larger context window...
echo.

REM Create updated Modelfile with larger context
copy /Y Modelfile-vibecoder Modelfile-vibecoder-enhanced 2>NUL
if %ERRORLEVEL% EQU 0 (
    REM Update context parameter
    powershell -Command "(Get-Content Modelfile-vibecoder-enhanced) -replace 'PARAMETER num_ctx 8192', 'PARAMETER num_ctx 32768' | Set-Content Modelfile-vibecoder-enhanced"

    echo Recreating vibecoder with 32K context...
    ollama create vibecoder -f Modelfile-vibecoder-enhanced

    if %ERRORLEVEL% EQU 0 (
        echo [OK] Vibecoder updated with 32K context!
        del Modelfile-vibecoder-enhanced 2>NUL
    ) else (
        echo [WARNING] Failed to update vibecoder model
    )
) else (
    echo [WARNING] Modelfile-vibecoder not found
)

echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo ✅ Your vibecoder is now enhanced with:
echo    - RAG System (instant codebase knowledge)
echo    - Persistent Memory (learns from all interactions)
echo    - Vision System (screenshot analysis)
echo    - MoE Routing (auto-select best model)
echo    - Enhanced Context (32K tokens)
echo.
echo 🚀 Try it now:
echo    python ultimate-vibecoder.py
echo.
echo Or use individual systems:
echo    python rag/query-rag.py "How is X implemented?"
echo    python memory/vibecoder-memory.py
echo    python vision/analyze-screenshot.py image.png "Describe this"
echo    python moe/router.py "Your task here"
echo.
echo 📖 Read ULTIMATE_VIBECODER_ENHANCEMENT_PLAN.md for details
echo.
echo ================================================
pause
