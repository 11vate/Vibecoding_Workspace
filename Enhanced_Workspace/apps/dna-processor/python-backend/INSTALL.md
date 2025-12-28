# Installation Guide

## Prerequisites

- Python 3.10 or higher
- pip

## Installation Steps

1. **Create virtual environment:**

```bash
cd apps/dna-processor/python-backend
python -m venv venv
```

2. **Activate virtual environment:**

On Windows:
```bash
venv\Scripts\activate
```

On Linux/Mac:
```bash
source venv/bin/activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

## Running the Application

### GUI Application

```bash
python -m layers.layer7_gui.main_window
```

Or:

```bash
python main.py
```

### Command Line Usage

The pipeline can also be used programmatically:

```python
from pipeline import DNAAnnotationPipeline
from pathlib import Path

pipeline = DNAAnnotationPipeline()
result_df = pipeline.process_file(Path("path/to/file.txt"))
print(result_df)
```

## Data Downloads

The application will automatically download required data sources on first run:

- **ClinVar:** ~500MB (one-time download, cached)
- **1000 Genomes:** ~100GB per chromosome (download as needed)
- **SNPedia:** Fetched on-demand, cached locally

## Configuration

Edit `config/settings.py` to customize:
- Cache directories
- API endpoints
- Concurrency limits
- AI settings (optional)









