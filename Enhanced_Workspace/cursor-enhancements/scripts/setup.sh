#!/bin/bash

# Setup script for Ultimate Vibe Coding Enhancement System

echo "🚀 Setting up Ultimate Vibe Coding Enhancement System..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check for Python (for ChromaDB)
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found. ChromaDB setup will be skipped."
    PYTHON_AVAILABLE=false
else
    echo "✅ Python found: $(python3 --version)"
    PYTHON_AVAILABLE=true
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp config/.env.example .env 2>/dev/null || echo "# API Configuration
OPENAI_API_KEY=
STABILITY_AI_API_KEY=
LEONARDO_AI_API_KEY=
SPRITE_SAGE_API_KEY=

# Vector Database
VECTOR_DB_TYPE=chroma
VECTOR_DB_CONNECTION_STRING=http://localhost:8000

# Embedding
EMBEDDING_MODEL=text-embedding-ada-002
EMBEDDING_API_KEY=" > .env
    echo "⚠️  Please edit .env file and add your API keys"
else
    echo "✅ .env file already exists"
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install ChromaDB if Python is available
if [ "$PYTHON_AVAILABLE" = true ]; then
    echo "📦 Installing ChromaDB..."
    pip3 install chromadb --quiet || echo "⚠️  Failed to install ChromaDB. You may need to install it manually."
else
    echo "⚠️  Skipping ChromaDB installation (Python not found)"
fi

# Install Weaviate client
echo "📦 Installing Weaviate client..."
npm install weaviate-ts-client --save || echo "⚠️  Failed to install Weaviate client"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your API keys"
echo "2. Start ChromaDB: chroma run --path ./chroma_db --port 8000"
echo "3. Or use Docker for Weaviate: docker run -d -p 8080:8080 semitechnologies/weaviate:latest"
echo "4. Run: npm run initialize"
echo ""









