"""
Layer 0: Input Normalization Layer

Purpose: Convert messy consumer DNA files into canonical variant table.

Output: pandas DataFrame with columns [rsid, chrom, pos, genotype]
"""

from .normalizer import InputNormalizer

__all__ = ["InputNormalizer"]









