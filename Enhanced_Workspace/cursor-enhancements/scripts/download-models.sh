#!/bin/bash

# Download recommended models for local AI system

echo "📥 Downloading recommended models..."

# Check for Ollama
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not found. Install from https://ollama.ai"
    exit 1
fi

echo "✅ Ollama found"

# Download LLM models
echo ""
echo "📦 Downloading LLM models..."
ollama pull llama3.1:8b
ollama pull mistral:latest
ollama pull deepseek-r1:latest

# Download vision models
echo ""
echo "📦 Downloading vision models..."
ollama pull llava:latest
ollama pull bakllava:latest

# Download embedding models (handled by npm install)
echo ""
echo "📦 Embedding models will be downloaded automatically on first use"
echo "   Model: Xenova/all-MiniLM-L6-v2"

echo ""
echo "✅ Model download complete!"
echo ""
echo "Installed models:"
ollama list

echo ""
echo "💡 Tip: Use 'ollama list' to see all installed models"
echo "   Use 'ollama pull <model>' to download additional models"









