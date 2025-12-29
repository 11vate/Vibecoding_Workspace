#!/bin/bash

# Setup script for Ultimate Vibecoder AI Model
# Creates a custom AI specifically for vibecoding workspace

set -e

echo "🎮 Ultimate Vibecoder Setup"
echo "============================"
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not found!"
    echo ""
    echo "Please install Ollama first:"
    echo "  Windows: https://ollama.com/download"
    echo "  Mac: brew install ollama"
    echo "  Linux: curl -fsSL https://ollama.com/install.sh | sh"
    exit 1
fi

echo "✅ Ollama found"
echo ""

# Check if base model exists
echo "📥 Checking for base model (qwen2.5-coder:7b)..."
if ! ollama list | grep -q "qwen2.5-coder:7b"; then
    echo "⬇️  Downloading base model (this will take 5-10 minutes)..."
    ollama pull qwen2.5-coder:7b
else
    echo "✅ Base model already installed"
fi
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create the custom vibecoder model
echo "🔨 Creating custom vibecoder model..."
if ollama create vibecoder -f "$SCRIPT_DIR/Modelfile-vibecoder"; then
    echo "✅ Vibecoder model created successfully!"
else
    echo "❌ Failed to create model"
    exit 1
fi
echo ""

# Test the model
echo "🧪 Testing vibecoder..."
echo ""
echo "Prompt: 'Create a simple player movement system'"
echo ""
echo "Response:"
echo "----------"
ollama run vibecoder "Create a simple player movement system for a 2D platformer. Keep it brief." | head -n 30
echo "----------"
echo ""

echo "✅ Setup complete!"
echo ""
echo "🚀 Quick Start:"
echo ""
echo "  # Interactive mode"
echo "  ollama run vibecoder"
echo ""
echo "  # One-shot generation"
echo "  ollama run vibecoder \"Your coding task here\""
echo ""
echo "  # List all your models"
echo "  ollama list"
echo ""
echo "📚 Next steps:"
echo "  1. Read ai-models/CREATE_CUSTOM_MODEL.md for advanced usage"
echo "  2. Try: ollama run vibecoder \"Design a coin collection mechanic\""
echo "  3. Compare to generic: ollama run qwen2.5-coder:7b \"same prompt\""
echo ""
echo "Happy vibecoding! 🎮✨"
