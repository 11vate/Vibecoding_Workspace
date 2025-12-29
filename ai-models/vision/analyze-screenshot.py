#!/usr/bin/env python3
"""
Analyze screenshots with vision + code understanding
Vibecoder can now see your game mockups and generate code
"""

import subprocess
import base64
from pathlib import Path
import json
import sys

def analyze_screenshot(image_path: str, question: str) -> str:
    """Analyze a screenshot using vision model"""

    if not Path(image_path).exists():
        print(f"❌ Image not found: {image_path}")
        return ""

    print(f"🎮 Analyzing screenshot...")
    print(f"   Image: {image_path}")
    print(f"   Question: {question}")
    print()

    # Read image
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode()

    # Create multimodal prompt
    prompt = f"""Analyze this screenshot and answer: {question}

Focus on:
- UI/UX patterns
- Visual hierarchy
- Game design elements
- Pixel art style (if applicable)
- Color palette
- Layout structure
- Interactive elements

Provide actionable implementation suggestions for Excalibur.js game development."""

    # Call Ollama vision model
    # Note: Ollama's multimodal API format
    try:
        print("🔍 Processing with vision model...")

        # Create prompt for ollama with image
        result = subprocess.run(
            ['ollama', 'run', 'minicpm-v', prompt],
            input=image_data,
            capture_output=True,
            text=True,
            timeout=60
        )

        response = result.stdout

        print("\n" + "=" * 80)
        print("Vision Analysis:")
        print("=" * 80)
        print(response)
        print("=" * 80)

        return response

    except subprocess.TimeoutExpired:
        print("❌ Vision model timed out (60s)")
        return ""
    except Exception as e:
        print(f"❌ Error analyzing screenshot: {e}")
        print("\nMake sure:")
        print("  1. Ollama is running")
        print("  2. minicpm-v model is installed (ollama pull minicpm-v)")
        return ""

def screenshot_to_code(image_path: str) -> str:
    """Convert screenshot to Excalibur.js code"""

    # Step 1: Analyze with vision model
    print("Step 1: Analyzing screenshot...")
    description = analyze_screenshot(
        image_path,
        "Describe the UI layout, components, visual style, and game mechanics visible in this screenshot. Be technical and specific."
    )

    if not description:
        return ""

    # Step 2: Generate code with vibecoder
    print("\n" + "=" * 80)
    print("Step 2: Generating code with vibecoder...")
    print("=" * 80)
    print()

    code_prompt = f"""Create Excalibur.js code for this UI based on the vision analysis:

{description}

Requirements:
- Follow Design Intelligence Stack
- Use vibecoding patterns (no magic numbers, strict types)
- Event-driven architecture
- Frame-rate independent
- Production-ready code

Generate complete implementation."""

    try:
        result = subprocess.run(
            ['ollama', 'run', 'vibecoder', code_prompt],
            capture_output=True,
            text=True,
            timeout=120
        )

        code = result.stdout

        print(code)

        return code

    except Exception as e:
        print(f"❌ Error generating code: {e}")
        return ""

# Usage
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage:")
        print("  python analyze-screenshot.py <image> <question>")
        print()
        print("Examples:")
        print("  python analyze-screenshot.py mockup.png \"Describe this UI\"")
        print("  python analyze-screenshot.py screenshot.png \"How should I implement this?\"")
        print()
        print("Generate code:")
        print("  python analyze-screenshot.py mockup.png --generate-code")
        sys.exit(1)

    image_path = sys.argv[1]

    if len(sys.argv) > 2 and sys.argv[2] == "--generate-code":
        # Full screenshot to code pipeline
        screenshot_to_code(image_path)
    else:
        # Just analysis
        question = " ".join(sys.argv[2:])
        analyze_screenshot(image_path, question)
