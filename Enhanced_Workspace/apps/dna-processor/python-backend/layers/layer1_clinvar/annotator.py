"""
ClinVar Annotation Layer

Maps RSIDs to clinical significance from ClinVar database.

Invariants:
- Missing data returns empty strings, not None
- Cache writes must be atomic
- Lookup must be O(1)
"""

import json
import gzip
import shutil
import logging
import re
from pathlib import Path
from typing import Dict, Optional
import urllib.request
import tempfile
import pandas as pd

from config.settings import CLINVAR_URL, CLINVAR_CACHE_FILE

logger = logging.getLogger(__name__)


class ClinVarAnnotator:
    """
    Annotates variants with ClinVar clinical significance.
    
    Downloads and caches ClinVar variant_summary.txt.gz locally.
    Provides O(1) lookup by RSID.
    """
    
    def __init__(self, cache_file: Path = CLINVAR_CACHE_FILE):
        self.cache_file = cache_file
        self._annotation_cache: Dict[str, Dict[str, str]] = {}
        self._loaded = False
    
    def ensure_data_downloaded(self, force_download: bool = False) -> bool:
        """
        Download ClinVar data if not cached.
        
        Args:
            force_download: If True, re-download even if cache exists
            
        Returns:
            True if data is available (cached or downloaded)
        """
        if not force_download and self.cache_file.exists():
            logger.info(f"Using cached ClinVar data: {self.cache_file}")
            return True
        
        logger.info(f"Downloading ClinVar data from {CLINVAR_URL}")
        
        try:
            # Download to temporary file first (atomic write)
            with tempfile.NamedTemporaryFile(delete=False, suffix='.gz') as tmp_file:
                tmp_path = Path(tmp_file.name)
            
            # Download
            urllib.request.urlretrieve(CLINVAR_URL, tmp_path)
            
            # Extract and parse
            logger.info("Extracting and parsing ClinVar data...")
            self._parse_and_cache(tmp_path)
            
            # Clean up temp file
            tmp_path.unlink()
            
            logger.info(f"ClinVar data cached to {self.cache_file}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to download ClinVar data: {e}")
            return False
    
    def _parse_and_cache(self, gz_file: Path) -> None:
        """
        Parse ClinVar gzipped file and cache as JSON.
        
        Heuristically detects relevant columns.
        Maps RSID to clinical metadata.
        """
        # Read gzipped file
        with gzip.open(gz_file, 'rt', encoding='utf-8') as f:
            # Read first few lines to detect columns
            header_line = f.readline().strip()
            columns = header_line.split('\t')
            
            logger.info(f"Detected {len(columns)} columns in ClinVar file")
            # Log first 15 columns to help with debugging
            logger.info(f"First columns: {', '.join(columns[:15])}")
            
            # Find relevant column indices - try multiple possible column name patterns
            # ClinVar uses various formats like "RS# (dbSNP)", "RS#", "rsid", etc.
            rsid_patterns = [
                'rs# (dbsnp)', 'rs#', 'rs_id', 'rsid', 'snp', 'rs (dbsnp)', 
                'rs(dbsnp)', 'reference snp', 'refsnp_id', 'dbsnp rs', 'rs number'
            ]
            rsid_idx = self._find_column_index(columns, rsid_patterns)
            
            significance_patterns = [
                'clinicalsignificance', 'clinical significance', 'clinical_significance', 
                'significance', 'clinical significance (last reviewed)', 'review status'
            ]
            significance_idx = self._find_column_index(columns, significance_patterns)
            
            phenotype_patterns = [
                'phenotypelist', 'phenotype list', 'phenotype_list', 'phenotypes', 
                'condition', 'disease name', 'condition/disease', 'disease/phenotype'
            ]
            phenotype_idx = self._find_column_index(columns, phenotype_patterns)
            
            rcv_patterns = [
                'rcvaccession', 'rcv accession', 'rcv_accession', 'accession',
                'rcv', 'review accession', 'variant accession'
            ]
            rcv_idx = self._find_column_index(columns, rcv_patterns)
            
            if rsid_idx is None:
                # Log available columns to help debug
                logger.error(f"Could not find RSID column in ClinVar file")
                logger.error(f"Available columns: {columns}")
                logger.error("Tried patterns: " + ", ".join(rsid_patterns))
                raise ValueError("Could not find RSID column in ClinVar file. Please check column names.")
            
            # Parse file and build cache
            cache = {}
            line_count = 0
            
            for line in f:
                line_count += 1
                if line_count % 100000 == 0:
                    logger.info(f"Processed {line_count} lines...")
                
                fields = line.strip().split('\t')
                if len(fields) <= rsid_idx:
                    continue
                
                rsid = fields[rsid_idx].strip()
                if not rsid:
                    continue
                
                # Handle RSIDs that might be in format "rs123" or "rs123 (dbSNP)" or just "123"
                # Remove parenthetical content like "(dbSNP)"
                rsid = re.sub(r'\s*\([^)]*\)', '', rsid).strip()
                
                # Ensure it starts with 'rs'
                if not rsid.startswith('rs'):
                    # If it's just a number, add 'rs' prefix
                    if rsid.isdigit():
                        rsid = f'rs{rsid}'
                    else:
                        # Try to extract number from string like "12345" or "SNP123"
                        number_match = re.search(r'\d+', rsid)
                        if number_match:
                            rsid = f'rs{number_match.group()}'
                        else:
                            continue  # Skip if can't extract valid RSID
                
                # Normalize RSID (uppercase)
                rsid = rsid.upper()
                
                # Extract metadata (empty strings if not found)
                significance = fields[significance_idx].strip() if significance_idx and significance_idx < len(fields) else ""
                phenotype = fields[phenotype_idx].strip() if phenotype_idx and phenotype_idx < len(fields) else ""
                rcv = fields[rcv_idx].strip() if rcv_idx and rcv_idx < len(fields) else ""
                
                # Store (if multiple entries for same RSID, keep first non-empty)
                if rsid not in cache or not cache[rsid].get('clinical_significance'):
                    cache[rsid] = {
                        "clinical_significance": significance,
                        "phenotype_list": phenotype,
                        "rcv_accession": rcv
                    }
            
            logger.info(f"Extracted {len(cache)} unique RSIDs from ClinVar")
            
            # Atomic write to cache file
            cache_file_tmp = self.cache_file.with_suffix('.tmp')
            with open(cache_file_tmp, 'w', encoding='utf-8') as f:
                json.dump(cache, f, indent=2)
            cache_file_tmp.replace(self.cache_file)  # Atomic move
    
    def _find_column_index(self, columns: list, possible_names: list) -> Optional[int]:
        """
        Find column index by matching possible names (case-insensitive, partial matching).
        
        Tries exact match first, then partial match (contains).
        """
        columns_lower = [c.lower().strip() for c in columns]
        
        # Try exact match first
        for name in possible_names:
            name_lower = name.lower().strip()
            if name_lower in columns_lower:
                return columns_lower.index(name_lower)
        
        # Try partial match (column name contains the pattern)
        for name in possible_names:
            name_lower = name.lower().strip()
            for idx, col in enumerate(columns_lower):
                if name_lower in col or col in name_lower:
                    logger.debug(f"Found column match: '{columns[idx]}' matches pattern '{name}'")
                    return idx
        
        return None
    
    def load_cache(self) -> None:
        """Load annotation cache from disk."""
        if self._loaded:
            return
        
        if not self.cache_file.exists():
            logger.warning(f"ClinVar cache file not found: {self.cache_file}")
            self._annotation_cache = {}
            self._loaded = True
            return
        
        try:
            with open(self.cache_file, 'r', encoding='utf-8') as f:
                self._annotation_cache = json.load(f)
            logger.info(f"Loaded {len(self._annotation_cache)} ClinVar annotations from cache")
            self._loaded = True
        except Exception as e:
            logger.error(f"Failed to load ClinVar cache: {e}")
            self._annotation_cache = {}
            self._loaded = True
    
    def annotate(self, rsid: str) -> Dict[str, str]:
        """
        Get ClinVar annotation for an RSID.
        
        Args:
            rsid: RSID to look up (e.g., "rs123" or "RS123")
            
        Returns:
            Dictionary with keys: clinical_significance, phenotype_list, rcv_accession
            All values are strings (empty string if not found)
        """
        if not self._loaded:
            self.load_cache()
        
        # Normalize RSID
        rsid_upper = rsid.upper().strip()
        
        # O(1) lookup
        result = self._annotation_cache.get(rsid_upper, {})
        
        # Ensure all keys exist with empty string defaults
        return {
            "clinical_significance": result.get("clinical_significance", ""),
            "phenotype_list": result.get("phenotype_list", ""),
            "rcv_accession": result.get("rcv_accession", "")
        }
    
    def annotate_batch(self, rsids: list) -> Dict[str, Dict[str, str]]:
        """
        Annotate multiple RSIDs at once.
        
        Args:
            rsids: List of RSIDs to annotate
            
        Returns:
            Dictionary mapping RSID → annotation dict
        """
        if not self._loaded:
            self.load_cache()
        
        results = {}
        for rsid in rsids:
            results[rsid] = self.annotate(rsid)
        
        return results

