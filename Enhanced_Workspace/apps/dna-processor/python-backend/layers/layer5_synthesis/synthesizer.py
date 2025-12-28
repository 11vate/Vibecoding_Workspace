"""
Annotation Synthesis Layer

Merges all annotation sources into single coherent DataFrame.

Invariants:
- Missing fields must exist but be empty
- Output must serialize cleanly to CSV and JSON
- Column names must be stable
"""

import pandas as pd
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)


class AnnotationSynthesizer:
    """
    Synthesizes all annotation data into unified DataFrame.
    
    Output columns:
    - rsid
    - genotype (from user data)
    - clinical_significance (from ClinVar)
    - phenotypes (from ClinVar)
    - snpedia_narrative (from SNPedia)
    - snpedia_categories (from SNPedia)
    - population_frequency (from 1000 Genomes)
    """
    
    OUTPUT_COLUMNS = [
        'rsid',
        'chrom',
        'pos',
        'genotype',
        'clinical_significance',
        'phenotypes',
        'rcv_accession',
        'snpedia_narrative',
        'snpedia_categories',
        'snpedia_url',
        'population_frequency'
    ]
    
    def synthesize(
        self,
        variants_df: pd.DataFrame,
        clinvar_annotations: Dict[str, Dict[str, str]],
        snpedia_data: Dict[str, Dict],
        frequency_data: Dict[str, float]
    ) -> pd.DataFrame:
        """
        Merge all annotation data.
        
        Args:
            variants_df: DataFrame with rsid and genotype (from Layer 0)
            clinvar_annotations: Dict mapping rsid → {clinical_significance, phenotype_list, rcv_accession}
            snpedia_data: Dict mapping rsid → {extract, categories, url, source}
            frequency_data: Dict mapping rsid → frequency (float or None)
            
        Returns:
            DataFrame with all annotations merged
        """
        # Start with variants DataFrame (include chrom and pos if available)
        if 'chrom' in variants_df.columns and 'pos' in variants_df.columns:
            result = variants_df[['rsid', 'chrom', 'pos', 'genotype']].copy()
        else:
            result = variants_df[['rsid', 'genotype']].copy()
            result['chrom'] = ''
            result['pos'] = 0
        
        # Add ClinVar annotations
        result['clinical_significance'] = result['rsid'].map(
            lambda x: clinvar_annotations.get(x, {}).get('clinical_significance', '')
        )
        result['phenotypes'] = result['rsid'].map(
            lambda x: clinvar_annotations.get(x, {}).get('phenotype_list', '')
        )
        result['rcv_accession'] = result['rsid'].map(
            lambda x: clinvar_annotations.get(x, {}).get('rcv_accession', '')
        )
        
        # Add SNPedia data
        result['snpedia_narrative'] = result['rsid'].map(
            lambda x: snpedia_data.get(x, {}).get('extract', '')
        )
        result['snpedia_categories'] = result['rsid'].map(
            lambda x: ', '.join(snpedia_data.get(x, {}).get('categories', []))
        )
        result['snpedia_url'] = result['rsid'].map(
            lambda x: snpedia_data.get(x, {}).get('url', '')
        )
        
        # Add population frequency
        result['population_frequency'] = result['rsid'].map(
            lambda x: frequency_data.get(x)
        )
        
        # Ensure all required columns exist (fill with empty/defaults)
        for col in self.OUTPUT_COLUMNS:
            if col not in result.columns:
                result[col] = '' if col != 'population_frequency' else None
        
        # Reorder columns to match OUTPUT_COLUMNS
        result = result[self.OUTPUT_COLUMNS]
        
        # Ensure string columns are strings (not object dtype with None)
        string_cols = ['rsid', 'chrom', 'genotype', 'clinical_significance', 'phenotypes',
                      'rcv_accession', 'snpedia_narrative', 'snpedia_categories', 'snpedia_url']
        for col in string_cols:
            if col in result.columns:
                result[col] = result[col].fillna('').astype(str)
        
        # Ensure pos is integer
        if 'pos' in result.columns:
            result['pos'] = pd.to_numeric(result['pos'], errors='coerce').fillna(0).astype(int)
        
        logger.info(f"Synthesized {len(result)} annotated variants")
        
        return result
    
    def export_to_csv(self, df: pd.DataFrame, output_path: str) -> None:
        """
        Export DataFrame to CSV.
        
        Args:
            df: DataFrame to export
            output_path: Path to output CSV file
        """
        df.to_csv(output_path, index=False)
        logger.info(f"Exported {len(df)} variants to {output_path}")
    
    def export_to_json(self, df: pd.DataFrame, output_path: str) -> None:
        """
        Export DataFrame to JSON (records format).
        
        Args:
            df: DataFrame to export
            output_path: Path to output JSON file
        """
        # Convert to records format for JSON
        df_clean = df.copy()
        
        # Convert None to null for JSON
        df_clean['population_frequency'] = df_clean['population_frequency'].fillna(None)
        
        df_clean.to_json(output_path, orient='records', indent=2)
        logger.info(f"Exported {len(df)} variants to {output_path}")

