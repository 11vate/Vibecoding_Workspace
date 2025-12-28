#!/bin/bash

# LoRA Training Script for Pixel Art Sprites
# This script sets up and runs LoRA training using Kohya SS

echo "🎨 Setting up LoRA training for pixel art sprites..."

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required for LoRA training"
    exit 1
fi

# Check for Kohya SS
if [ ! -d "kohya_ss" ]; then
    echo "📦 Installing Kohya SS..."
    git clone https://github.com/bmaltais/kohya_ss.git
    cd kohya_ss
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
else
    echo "✅ Kohya SS found"
fi

# Check for dataset
if [ ! -d "datasets/pixel_art_sprites" ]; then
    echo "⚠️  Dataset not found at datasets/pixel_art_sprites"
    echo "   Create dataset using the dataset-builder utility"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To train LoRA:"
echo "1. Prepare your dataset in datasets/pixel_art_sprites/"
echo "2. Configure training parameters in train_config.json"
echo "3. Run: cd kohya_ss && python train_network.py --config ../train_config.json"
echo ""









