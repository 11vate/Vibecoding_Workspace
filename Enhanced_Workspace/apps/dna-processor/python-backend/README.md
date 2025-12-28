# DNA Annotation System - Python Backend

Local-first DNA annotation system with strict layered architecture.

## Architecture

10-layer system with strict separation of concerns:

1. **Layer 0:** Input Normalization (23andMe .txt → canonical variant table)
2. **Layer 1:** ClinVar Annotation (RSID → clinical significance)
3. **Layer 2:** Candidate Selection (filter biologically relevant variants)
4. **Layer 3:** SNPedia Expansion (async knowledge lookup)
5. **Layer 4:** Population Context (1000 Genomes frequency data)
6. **Layer 5:** Annotation Synthesis (merge all knowledge)
7. **Layer 6:** Interpretive AI (optional, bounded summaries)
8. **Layer 7:** GUI (Qt-based workbench)
9. **Layer 8:** Persistence (caching, checkpointing)

## Installation

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Usage

```bash
python -m layers.layer7_gui.main
```

## Development

Follow the strict build order:
1. Input parser
2. Folder parser
3. ClinVar downloader + cache
4. Candidate selection
5. SNPedia async fetch + cache
6. Annotation merge
7. CSV/JSON export
8. SQLite allele DB
9. AF attachment
10. GUI shell
11. Thread-safe pipeline
12. AI layer

## Data Sources

- **ClinVar:** https://ftp.ncbi.nlm.nih.gov/pub/clinvar/tab_delimited/variant_summary.txt.gz
- **SNPedia:** https://www.snpedia.com/index.php/
- **1000 Genomes:** http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/









