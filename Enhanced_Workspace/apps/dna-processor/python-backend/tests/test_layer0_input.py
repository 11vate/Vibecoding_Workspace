"""
Tests for Layer 0: Input Normalization
"""

import pytest
import pandas as pd
from pathlib import Path
import tempfile
import os

from layers.layer0_input import InputNormalizer


def test_empty_file():
    """Empty file should return empty DataFrame, not crash."""
    normalizer = InputNormalizer()
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write("# Header comment\n")
        f.write("# Another comment\n")
        temp_path = Path(f.name)
    
    try:
        result = normalizer.normalize_file(temp_path)
        assert isinstance(result, pd.DataFrame)
        assert len(result) == 0
        assert list(result.columns) == ['rsid', 'chrom', 'pos', 'genotype']
    finally:
        os.unlink(temp_path)


def test_23andme_format():
    """Test parsing 23andMe-style format."""
    normalizer = InputNormalizer()
    
    content = """# This file contains raw genotype data
# rsid	chromosome	position	genotype
rs123	1	12345	AA
rs456	2	67890	GT
rs789	X	11111	--"""
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(content)
        temp_path = Path(f.name)
    
    try:
        result = normalizer.normalize_file(temp_path)
        assert len(result) == 3
        assert list(result.columns) == ['rsid', 'chrom', 'pos', 'genotype']
        assert result['rsid'].iloc[0] == 'rs123'
        assert result['pos'].iloc[0] == 12345
        assert result['genotype'].iloc[0] == 'AA'
    finally:
        os.unlink(temp_path)


def test_invalid_rsid_filtering():
    """Invalid RSIDs should be filtered out."""
    normalizer = InputNormalizer()
    
    content = """rs123	1	12345	AA
invalid_rsid	2	67890	GT
rs789	X	11111	--"""
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(content)
        temp_path = Path(f.name)
    
    try:
        result = normalizer.normalize_file(temp_path)
        assert len(result) == 2  # invalid_rsid filtered out
        assert all(result['rsid'].str.startswith('rs'))
    finally:
        os.unlink(temp_path)


def test_deduplication():
    """Duplicate RSIDs should collapse to one row."""
    normalizer = InputNormalizer()
    
    content = """rs123	1	12345	AA
rs123	1	12345	AA
rs456	2	67890	GT"""
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(content)
        temp_path = Path(f.name)
    
    try:
        result = normalizer.normalize_file(temp_path)
        assert len(result) == 2  # duplicate removed
        assert result['rsid'].nunique() == 2
    finally:
        os.unlink(temp_path)


def test_column_name_variations():
    """Should handle various column name formats."""
    normalizer = InputNormalizer()
    
    # Test with different column names
    content = """RS_ID	Chromosome	Position	Genotype
rs123	1	12345	AA
rs456	2	67890	GT"""
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(content)
        temp_path = Path(f.name)
    
    try:
        result = normalizer.normalize_file(temp_path)
        assert len(result) == 2
        assert list(result.columns) == ['rsid', 'chrom', 'pos', 'genotype']
    finally:
        os.unlink(temp_path)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])









