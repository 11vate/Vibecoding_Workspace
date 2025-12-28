# Quick Start Guide

## Installation Complete ✅

All dependencies have been installed in the virtual environment.

## Running the Application

### Option 1: Run GUI Application

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run GUI
python main.py
```

### Option 2: Use Pipeline Programmatically

```python
from pipeline import DNAAnnotationPipeline
from pathlib import Path

# Create pipeline instance
pipeline = DNAAnnotationPipeline()

# Process a DNA file
result_df = pipeline.process_file(Path("path/to/your/file.txt"))

# Display results
print(result_df)
```

## Testing Your Installation

Run the test suite:

```bash
.\venv\Scripts\python.exe -m pytest tests/ -v
```

## First Run Notes

On first run, the application will:

1. **Download ClinVar data** (~500MB) - one-time download, cached locally
2. **Create cache directories** for SNPedia and other data sources
3. **Set up SQLite database** for allele frequencies

**Note:** The 1000 Genomes VCF files are large (~100GB per chromosome). These are downloaded only when needed and only for specific chromosomes.

## Processing Your DNA File

1. Launch the GUI: `python main.py`
2. Click "Select File"
3. Choose your DNA file (23andMe .txt format or similar)
4. Wait for processing to complete
5. View results in the table

The pipeline will:
- Normalize your file
- Annotate with ClinVar clinical significance
- Select candidate variants
- Expand with SNPedia knowledge (may take time)
- Add population frequencies
- Display unified results

## Next Steps

- See `ARCHITECTURE.md` for system design details
- See `IMPLEMENTATION_STATUS.md` for feature status
- See `README.md` for full documentation









