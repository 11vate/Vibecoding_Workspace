#!/bin/bash

# Setup script for local AI models

echo "🤖 Setting up local AI models..."

# Check for Ollama
if command -v ollama &> /dev/null; then
    echo "✅ Ollama found: $(ollama --version)"
    
    # Pull recommended models
    echo "📥 Downloading recommended models..."
    ollama pull llama3.1:8b
    ollama pull llava:latest
    ollama pull mistral:latest
    
    echo "✅ Ollama models ready"
else
    echo "⚠️  Ollama not found. Install from: https://ollama.ai"
    echo "   Then run: ollama pull llama3.1:8b"
    echo "            ollama pull llava:latest"
fi

# Check for Python (for Stable Diffusion)
if command -v python3 &> /dev/null; then
    echo "✅ Python found: $(python3 --version)"
    
    # Check for ComfyUI
    if [ -d "ComfyUI" ]; then
        echo "✅ ComfyUI directory found"
    else
        echo "📦 To set up ComfyUI:"
        echo "   git clone https://github.com/comfyanonymous/ComfyUI.git"
        echo "   cd ComfyUI"
        echo "   pip install -r requirements.txt"
        echo "   python main.py --port 8188"
    fi
else
    echo "⚠️  Python not found. Required for Stable Diffusion."
fi

# Install Node.js dependencies for local models
echo "📦 Installing Node.js dependencies for local models..."
npm install @xenova/transformers --save

echo ""
echo "✅ Local models setup complete!"
echo ""
echo "Next steps:"
echo "1. Start Ollama: ollama serve (if not running)"
echo "2. Start ComfyUI: cd ComfyUI && python main.py --port 8188"
echo "3. Set USE_LOCAL_MODELS=true in .env"
echo ""









