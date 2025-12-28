#!/usr/bin/env python3
"""
Download Stable Diffusion models from Hugging Face
"""

import os
import sys
from pathlib import Path
from huggingface_hub import hf_hub_download, snapshot_download

def download_sd_model(model_name: str, output_dir: str):
    """Download a Stable Diffusion model"""
    print(f"Downloading {model_name} to {output_dir}...")
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Download the main model file (usually .safetensors or .ckpt)
        # Try to find the model file
        repo_files = snapshot_download(
            repo_id=model_name,
            local_dir=output_dir,
            local_dir_use_symlinks=False,
            resume_download=True
        )
        
        print(f"[OK] Successfully downloaded {model_name}")
        return True
    except Exception as e:
        print(f"[ERROR] Error downloading {model_name}: {e}")
        return False

if __name__ == "__main__":
    # Default: Download SD 1.5
    model_name = sys.argv[1] if len(sys.argv) > 1 else "runwayml/stable-diffusion-v1-5"
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "automatic1111/models/Stable-diffusion"
    
    # Get absolute path
    script_dir = Path(__file__).parent
    output_path = script_dir / output_dir
    
    print(f"Model: {model_name}")
    print(f"Output: {output_path}")
    print("This may take a while (model is ~4GB)...")
    print()
    
    success = download_sd_model(model_name, str(output_path))
    sys.exit(0 if success else 1)

