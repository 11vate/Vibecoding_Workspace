# PowerShell setup script for Ultimate Vibe Coding Enhancement System

Write-Host "🚀 Setting up Ultimate Vibe Coding Enhancement System..." -ForegroundColor Cyan

# Check for Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check for Python (for ChromaDB)
try {
    $pythonVersion = python --version
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
    $PYTHON_AVAILABLE = $true
} catch {
    Write-Host "⚠️  Python not found. ChromaDB setup will be skipped." -ForegroundColor Yellow
    $PYTHON_AVAILABLE = $false
}

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Cyan
    if (Test-Path "config\.env.example") {
        Copy-Item "config\.env.example" ".env"
    } else {
        @"
# API Configuration
OPENAI_API_KEY=
STABILITY_AI_API_KEY=
LEONARDO_AI_API_KEY=
SPRITE_SAGE_API_KEY=

# Vector Database
VECTOR_DB_TYPE=chroma
VECTOR_DB_CONNECTION_STRING=http://localhost:8000

# Embedding
EMBEDDING_MODEL=text-embedding-ada-002
EMBEDDING_API_KEY=
"@ | Out-File -FilePath ".env" -Encoding utf8
    }
    Write-Host "⚠️  Please edit .env file and add your API keys" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install Node.js dependencies
Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Cyan
npm install

# Install ChromaDB if Python is available
if ($PYTHON_AVAILABLE) {
    Write-Host "📦 Installing ChromaDB..." -ForegroundColor Cyan
    pip install chromadb --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ChromaDB installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Failed to install ChromaDB. You may need to install it manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Skipping ChromaDB installation (Python not found)" -ForegroundColor Yellow
}

# Install Weaviate client
Write-Host "📦 Installing Weaviate client..." -ForegroundColor Cyan
npm install weaviate-ts-client --save

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file and add your API keys"
Write-Host "2. Start ChromaDB: chroma run --path ./chroma_db --port 8000"
Write-Host "3. Or use Docker for Weaviate"
Write-Host "4. Run: npm run initialize"
Write-Host ""









