"""
Candidate Selection Engine

Filters variants to biologically relevant subset based on clinical significance.

Invariants:
- Never silently drop variants without a rule
- Must be deterministic for same input
"""

import logging
from typing import List, Set, Optional
import pandas as pd

logger = logging.getLogger(__name__)


class CandidateSelector:
    """
    Selects candidate variants for further analysis.
    
    Selection rules:
    - Include variants with clinical significance
    - Exclude clearly benign variants (optionally)
    - Optionally exclude uncertain variants
    - Allow explicit whitelisting
    """
    
    # Clinical significance categories to include by default
    SIGNIFICANT_CATEGORIES = {
        'pathogenic',
        'likely pathogenic',
        'pathogenic/likely pathogenic',
        'association',
        'affects',
        'drug response',
        'protective',
        'risk factor'
    }
    
    # Categories to exclude (clearly benign)
    BENIGN_CATEGORIES = {
        'benign',
        'likely benign',
        'benign/likely benign'
    }
    
    # Uncertain categories (can be excluded optionally)
    UNCERTAIN_CATEGORIES = {
        'uncertain significance',
        'conflicting interpretations of pathogenicity',
        'not provided',
        'other'
    }
    
    def __init__(
        self,
        exclude_benign: bool = True,
        exclude_uncertain: bool = False,
        whitelist: Optional[Set[str]] = None
    ):
        """
        Initialize selector.
        
        Args:
            exclude_benign: If True, exclude clearly benign variants
            exclude_uncertain: If True, exclude uncertain significance variants
            whitelist: Set of RSIDs to always include regardless of significance
        """
        self.exclude_benign = exclude_benign
        self.exclude_uncertain = exclude_uncertain
        self.whitelist = whitelist or set()
    
    def select_candidates(
        self,
        variants_df: pd.DataFrame,
        clinvar_annotations: pd.DataFrame
    ) -> List[str]:
        """
        Select candidate RSIDs for further expansion.
        
        Args:
            variants_df: DataFrame with 'rsid' column (from Layer 0)
            clinvar_annotations: DataFrame with 'rsid' and 'clinical_significance' columns
            
        Returns:
            Sorted list of RSIDs to expand
        """
        if variants_df.empty:
            logger.warning("Empty variants DataFrame provided")
            return []
        
        # Merge variants with ClinVar annotations
        merged = variants_df.merge(
            clinvar_annotations[['rsid', 'clinical_significance']],
            on='rsid',
            how='left'
        )
        
        # Fill missing significance with empty string
        merged['clinical_significance'] = merged['clinical_significance'].fillna('')
        
        selected_rsids = []
        exclusion_reasons = {}
        
        for _, row in merged.iterrows():
            rsid = row['rsid']
            significance = str(row['clinical_significance']).lower().strip()
            
            # Whitelist always included
            if rsid in self.whitelist:
                selected_rsids.append(rsid)
                continue
            
            # Empty significance: include (no rule to exclude)
            if not significance:
                selected_rsids.append(rsid)
                continue
            
            # Check if significant
            is_significant = any(
                cat in significance for cat in self.SIGNIFICANT_CATEGORIES
            )
            
            if is_significant:
                selected_rsids.append(rsid)
                continue
            
            # Check if benign (and should be excluded)
            is_benign = any(
                cat in significance for cat in self.BENIGN_CATEGORIES
            )
            
            if is_benign and self.exclude_benign:
                exclusion_reasons[rsid] = f"Benign: {significance}"
                continue
            
            # Check if uncertain (and should be excluded)
            is_uncertain = any(
                cat in significance for cat in self.UNCERTAIN_CATEGORIES
            )
            
            if is_uncertain and self.exclude_uncertain:
                exclusion_reasons[rsid] = f"Uncertain: {significance}"
                continue
            
            # Default: include if no exclusion rule matches
            selected_rsids.append(rsid)
        
        # Log exclusions
        if exclusion_reasons:
            logger.info(f"Excluded {len(exclusion_reasons)} variants: {list(exclusion_reasons.values())[:5]}")
        
        # Sort for determinism
        selected_rsids = sorted(set(selected_rsids))
        
        logger.info(f"Selected {len(selected_rsids)} candidate variants from {len(variants_df)} total")
        
        return selected_rsids
    
    def select_from_annotations(
        self,
        annotations_df: pd.DataFrame
    ) -> List[str]:
        """
        Select candidates directly from annotation DataFrame.
        
        Args:
            annotations_df: DataFrame with 'rsid' and 'clinical_significance' columns
            
        Returns:
            Sorted list of RSIDs
        """
        if annotations_df.empty:
            return []
        
        selected = []
        exclusion_reasons = {}
        
        for _, row in annotations_df.iterrows():
            rsid = row['rsid']
            significance = str(row.get('clinical_significance', '')).lower().strip()
            
            # Whitelist always included
            if rsid in self.whitelist:
                selected.append(rsid)
                continue
            
            # Empty: include by default
            if not significance:
                selected.append(rsid)
                continue
            
            # Check categories
            is_significant = any(
                cat in significance for cat in self.SIGNIFICANT_CATEGORIES
            )
            
            if is_significant:
                selected.append(rsid)
                continue
            
            if self.exclude_benign:
                is_benign = any(
                    cat in significance for cat in self.BENIGN_CATEGORIES
                )
                if is_benign:
                    exclusion_reasons[rsid] = f"Benign: {significance}"
                    continue
            
            if self.exclude_uncertain:
                is_uncertain = any(
                    cat in significance for cat in self.UNCERTAIN_CATEGORIES
                )
                if is_uncertain:
                    exclusion_reasons[rsid] = f"Uncertain: {significance}"
                    continue
            
            # Default: include
            selected.append(rsid)
        
        if exclusion_reasons:
            logger.info(f"Excluded {len(exclusion_reasons)} variants")
        
        return sorted(set(selected))









