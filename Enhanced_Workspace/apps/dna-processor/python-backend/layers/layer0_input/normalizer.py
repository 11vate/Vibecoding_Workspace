"""
Input Normalization Layer

Converts consumer DNA files (23andMe-style .txt) into canonical variant table.

Invariants:
- RSIDs must start with "rs"
- Positions must be integers
- Duplicate RSIDs collapse to one row
- Empty result must not crash downstream
"""

import re
import pandas as pd
from pathlib import Path
from typing import List, Optional, Dict
import logging

logger = logging.getLogger(__name__)


class InputNormalizer:
    """
    Normalizes consumer DNA files into canonical format.
    
    Expected input format (23andMe-style):
    # comment lines starting with #
    rsid	chromosome	position	genotype
    rs123	1	12345	AA
    """
    
    REQUIRED_COLUMNS = ["rsid", "chrom", "pos", "genotype"]
    
    def __init__(self):
        # RSID pattern: starts with 'rs' (case-insensitive) followed by digits
        self.rsid_pattern = re.compile(r'^rs\d+$', re.IGNORECASE)
    
    def normalize_file(self, file_path: Path) -> pd.DataFrame:
        """
        Normalize a single DNA file to canonical format.
        
        Args:
            file_path: Path to input file (typically .txt)
            
        Returns:
            DataFrame with columns [rsid, chrom, pos, genotype]
            Empty DataFrame if file is invalid or empty
        """
        try:
            # Read file, skipping comment lines
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = []
                for line in f:
                    line = line.strip()
                    # Skip empty lines and comments
                    if line and not line.startswith('#'):
                        lines.append(line)
            
            if not lines:
                logger.warning(f"File {file_path} contains no data")
                return self._empty_dataframe()
            
            # Try to parse as TSV first (common for 23andMe)
            df = pd.read_csv(
                file_path,
                sep='\t',
                comment='#',
                header=0,
                dtype=str,
                on_bad_lines='skip'
            )
            
            # If TSV failed or wrong shape, try CSV
            if df.empty or len(df.columns) < 3:
                df = pd.read_csv(
                    file_path,
                    sep=',',
                    comment='#',
                    header=0,
                    dtype=str,
                    on_bad_lines='skip'
                )
            
            return self._normalize_dataframe(df, file_path.name)
            
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
            return self._empty_dataframe()
    
    def normalize_folder(self, folder_path: Path, pattern: str = "*.txt") -> pd.DataFrame:
        """
        Normalize all matching files in a folder and combine them.
        
        Args:
            folder_path: Path to folder containing DNA files
            pattern: File pattern to match (default: *.txt)
            
        Returns:
            Combined DataFrame with all variants, deduplicated
        """
        all_dfs: List[pd.DataFrame] = []
        
        for file_path in folder_path.glob(pattern):
            if file_path.is_file():
                df = self.normalize_file(file_path)
                if not df.empty:
                    all_dfs.append(df)
                    logger.info(f"Processed {file_path.name}: {len(df)} variants")
        
        if not all_dfs:
            logger.warning(f"No valid files found in {folder_path}")
            return self._empty_dataframe()
        
        # Combine and deduplicate
        combined = pd.concat(all_dfs, ignore_index=True)
        return self._deduplicate(combined)
    
    def _normalize_dataframe(self, df: pd.DataFrame, source_name: str) -> pd.DataFrame:
        """
        Normalize raw DataFrame to canonical format.
        
        Maps various column name formats to standard columns.
        """
        if df.empty:
            return self._empty_dataframe()
        
        # Normalize column names (case-insensitive, strip whitespace)
        df.columns = df.columns.str.strip().str.lower()
        
        # Map common column name variations
        column_mapping = self._detect_column_mapping(df.columns)
        
        # Create normalized DataFrame
        normalized = pd.DataFrame()
        
        # Extract rsid
        rsid_col = column_mapping.get('rsid')
        if rsid_col and rsid_col in df.columns:
            normalized['rsid'] = df[rsid_col].astype(str).str.strip()
        else:
            logger.warning(f"Could not find rsid column in {source_name}")
            return self._empty_dataframe()
        
        # Extract chromosome
        chrom_col = column_mapping.get('chrom')
        if chrom_col and chrom_col in df.columns:
            normalized['chrom'] = df[chrom_col].astype(str).str.strip()
        else:
            # Try to infer from rsid if available
            normalized['chrom'] = ''
        
        # Extract position
        pos_col = column_mapping.get('pos')
        if pos_col and pos_col in df.columns:
            normalized['pos'] = pd.to_numeric(df[pos_col], errors='coerce').fillna(0).astype(int)
        else:
            normalized['pos'] = 0
        
        # Extract genotype
        genotype_col = column_mapping.get('genotype')
        if genotype_col and genotype_col in df.columns:
            normalized['genotype'] = df[genotype_col].astype(str).str.strip().str.upper()
        else:
            # Try to find any remaining column that might be genotype
            remaining_cols = [c for c in df.columns if c not in column_mapping.values()]
            if remaining_cols:
                normalized['genotype'] = df[remaining_cols[0]].astype(str).str.strip().str.upper()
            else:
                normalized['genotype'] = ''
        
        # Validate and filter
        normalized = self._validate_and_filter(normalized)
        
        # Deduplicate
        normalized = self._deduplicate(normalized)
        
        return normalized
    
    def _detect_column_mapping(self, columns: pd.Index) -> Dict[str, str]:
        """Detect mapping from source columns to canonical columns."""
        mapping = {}
        
        # RSID variations
        rsid_patterns = ['rsid', 'rs_id', 'rs#', 'snp', 'variant']
        for pattern in rsid_patterns:
            for col in columns:
                if pattern in col:
                    mapping['rsid'] = col
                    break
            if 'rsid' in mapping:
                break
        
        # Chromosome variations
        chrom_patterns = ['chrom', 'chromosome', 'chr', 'contig']
        for pattern in chrom_patterns:
            for col in columns:
                if pattern in col:
                    mapping['chrom'] = col
                    break
            if 'chrom' in mapping:
                break
        
        # Position variations
        pos_patterns = ['pos', 'position', 'start', 'location', 'bp']
        for pattern in pos_patterns:
            for col in columns:
                if pattern in col:
                    mapping['pos'] = col
                    break
            if 'pos' in mapping:
                break
        
        # Genotype variations
        genotype_patterns = ['genotype', 'genotypes', 'call', 'allele', 'alleles']
        for pattern in genotype_patterns:
            for col in columns:
                if pattern in col:
                    mapping['genotype'] = col
                    break
            if 'genotype' in mapping:
                break
        
        # If no explicit mapping found, try positional (first 4 columns)
        if len(mapping) < 4 and len(columns) >= 4:
            if 'rsid' not in mapping:
                mapping['rsid'] = columns[0]
            if 'chrom' not in mapping:
                mapping['chrom'] = columns[1] if len(columns) > 1 else columns[0]
            if 'pos' not in mapping:
                mapping['pos'] = columns[2] if len(columns) > 2 else columns[1]
            if 'genotype' not in mapping:
                mapping['genotype'] = columns[3] if len(columns) > 3 else columns[2]
        
        return mapping
    
    def _validate_and_filter(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Validate DataFrame against invariants.
        
        Invariants:
        - RSIDs must start with "rs"
        - Positions must be integers (or 0 if missing)
        - Remove invalid rows
        """
        if df.empty:
            return df
        
        # Filter: RSIDs must match pattern (start with rs)
        mask = df['rsid'].str.match(self.rsid_pattern, na=False)
        invalid_count = (~mask).sum()
        if invalid_count > 0:
            logger.warning(f"Filtered {invalid_count} rows with invalid RSIDs")
        df = df[mask].copy()
        
        # Ensure positions are integers (already done in _normalize_dataframe)
        # But ensure no negative positions
        df = df[df['pos'] >= 0].copy()
        
        # Remove rows with empty rsid
        df = df[df['rsid'].notna() & (df['rsid'] != '')].copy()
        
        return df
    
    def _deduplicate(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Deduplicate by RSID.
        
        If duplicate RSIDs exist, keep the first occurrence.
        This maintains determinism.
        """
        if df.empty:
            return df
        
        original_count = len(df)
        df = df.drop_duplicates(subset=['rsid'], keep='first').copy()
        duplicate_count = original_count - len(df)
        
        if duplicate_count > 0:
            logger.info(f"Removed {duplicate_count} duplicate RSIDs")
        
        # Reset index for determinism (no index dependencies)
        df = df.reset_index(drop=True)
        
        return df
    
    def _empty_dataframe(self) -> pd.DataFrame:
        """Return empty DataFrame with correct schema."""
        return pd.DataFrame(columns=self.REQUIRED_COLUMNS)

