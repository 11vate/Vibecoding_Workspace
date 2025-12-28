"""
DNA Annotation System - Main Entry Point

Orchestrates the annotation pipeline following strict layer separation.
"""

import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/dna_annotation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


def main():
    """Main entry point - launches GUI."""
    logger.info("DNA Annotation System starting...")
    
    # Launch GUI
    from layers.layer7_gui.main_window import run_gui
    run_gui()


if __name__ == "__main__":
    main()

