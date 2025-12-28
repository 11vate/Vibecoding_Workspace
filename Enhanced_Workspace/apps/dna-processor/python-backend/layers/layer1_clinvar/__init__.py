"""
Layer 1: ClinVar Annotation Layer

Purpose: Map personal variants to clinical significance (medical ground truth).

Output: RSID → {clinical_significance, phenotype_list, rcv_accession}
"""

from .annotator import ClinVarAnnotator

__all__ = ["ClinVarAnnotator"]
