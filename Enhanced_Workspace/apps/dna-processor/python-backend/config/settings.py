"""
Configuration settings for DNA Annotation System
"""

from pathlib import Path
from typing import Optional

# Base directories
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
CACHE_DIR = BASE_DIR / "cache"
LOGS_DIR = BASE_DIR / "logs"

# Create directories if they don't exist
DATA_DIR.mkdir(exist_ok=True)
CACHE_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

# ClinVar configuration
CLINVAR_URL = "https://ftp.ncbi.nlm.nih.gov/pub/clinvar/tab_delimited/variant_summary.txt.gz"
CLINVAR_CACHE_FILE = CACHE_DIR / "clinvar_cache.json"

# SNPedia configuration
SNPEDIA_BASE_URL = "https://www.snpedia.com/index.php/"
SNPEDIA_CACHE_DIR = CACHE_DIR / "snpedia"
SNPEDIA_CACHE_DIR.mkdir(exist_ok=True)
SNPEDIA_CHECKPOINT_FILE = CACHE_DIR / "snpedia_checkpoint.json"
SNPEDIA_CONCURRENCY_LIMIT = 3  # Reduced to be more respectful
SNPEDIA_MAX_RETRIES = 2  # Reduced retries for 403s (they won't succeed on retry)
SNPEDIA_DELAY_BETWEEN_REQUESTS = 0.5  # Seconds between requests

# 1000 Genomes configuration
KG1_VCF_URL = "http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chr{chrom}.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz"
KG1_DB_FILE = DATA_DIR / "kg1_allele_freqs.db"

# SQLite batch operation limits
# SQLite has a default limit of 999 SQL variables per query
# Using 900 provides a safe margin below the limit
SQLITE_BATCH_CHUNK_SIZE = 900

# AI Configuration (optional)
AI_ENABLED = False
AI_PROVIDER = "openai"  # "openai", "anthropic", or "local"
AI_API_KEY: Optional[str] = None
AI_MODEL = "gpt-4"
AI_MAX_TOKENS = 4000
ANTHROPIC_API_KEY: Optional[str] = None
ANTHROPIC_MODEL = "claude-3-opus-20240229"

# Logging
LOG_LEVEL = "INFO"
LOG_FILE = LOGS_DIR / "dna_annotation.log"

