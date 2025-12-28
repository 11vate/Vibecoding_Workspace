"""
DNA Annotation Pipeline

Orchestrates all layers in correct sequence.
Maintains strict layer separation.
"""

import logging
from pathlib import Path
from typing import Optional, Callable
import pandas as pd

from layers.layer0_input import InputNormalizer
from layers.layer1_clinvar import ClinVarAnnotator
from layers.layer2_selection import CandidateSelector
from layers.layer3_snpedia import SNPediaExpander
from layers.layer4_population import PopulationFrequencyDB
from layers.layer5_synthesis import AnnotationSynthesizer
from layers.layer6_ai import AIInterpreter
from layers.layer8_persistence import PersistenceManager

logger = logging.getLogger(__name__)


class DNAAnnotationPipeline:
    """
    Main pipeline orchestrator.
    
    Executes layers in strict sequence:
    1. Input normalization
    2. ClinVar annotation
    3. Candidate selection
    4. SNPedia expansion
    5. Population frequency lookup
    6. Annotation synthesis
    7. AI interpretation (optional)
    """
    
    def __init__(
        self,
        cache_dir: Optional[Path] = None,
        ai_enabled: bool = False
    ):
        self.cache_dir = cache_dir or Path("cache")
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize layers
        self.normalizer = InputNormalizer()
        self.clinvar = ClinVarAnnotator()
        self.selector = CandidateSelector()
        self.freq_db = PopulationFrequencyDB()
        self.synthesizer = AnnotationSynthesizer()
        self.persistence = PersistenceManager(self.cache_dir)
        self.ai_interpreter = AIInterpreter() if ai_enabled else None
    
    def process_file_with_progress(
        self, 
        file_path: Path,
        progress_callback: Optional[Callable[[str, int], None]] = None
    ) -> pd.DataFrame:
        """
        Process file with progress updates.
        
        Args:
            file_path: Path to input DNA file
            progress_callback: Callback function(message: str, percentage: int)
            
        Returns:
            Annotated DataFrame
        """
        def progress(msg: str, pct: int):
            if progress_callback:
                progress_callback(msg, pct)
            else:
                logger.info(f"[{pct}%] {msg}")
        
        return self._process_file_internal(file_path, progress)
    
    def process_file(self, file_path: Path) -> pd.DataFrame:
        """
        Process a single DNA file through the pipeline.
        
        Args:
            file_path: Path to input DNA file
            
        Returns:
            Annotated DataFrame
        """
        return self._process_file_internal(file_path, lambda msg, pct: logger.info(msg))
    
    def _process_file_internal(
        self,
        file_path: Path,
        progress: Callable[[str, int], None]
    ) -> pd.DataFrame:
        """
        Internal file processing with progress callback.
        
        Args:
            file_path: Path to input DNA file
            progress: Progress callback function(message: str, percentage: int)
            
        Returns:
            Annotated DataFrame
        """
        logger.info(f"Processing file: {file_path}")
        progress("Normalizing input file...", 10)
        
        # Layer 0: Normalize input
        variants_df = self.normalizer.normalize_file(file_path)
        if variants_df.empty:
            logger.warning("No variants found in input file")
            return pd.DataFrame()
        
        logger.info(f"Normalized {len(variants_df)} variants")
        progress(f"Normalized {len(variants_df)} variants", 20)
        
        # Layer 1: ClinVar annotation
        progress("Loading ClinVar annotations...", 30)
        self.clinvar.ensure_data_downloaded()
        self.clinvar.load_cache()
        
        clinvar_data = {}
        total_rsids = len(variants_df)
        for idx, rsid in enumerate(variants_df['rsid']):
            clinvar_data[rsid] = self.clinvar.annotate(rsid)
            if (idx + 1) % 10000 == 0:
                progress(f"Annotated {idx + 1}/{total_rsids} variants with ClinVar...", 30 + int(20 * (idx + 1) / total_rsids))
        
        logger.info(f"Annotated {len(clinvar_data)} variants with ClinVar")
        progress(f"Annotated {len(clinvar_data)} variants with ClinVar", 50)
        
        # Layer 2: Candidate selection
        progress("Selecting candidate variants...", 60)
        clinvar_df = pd.DataFrame([
            {'rsid': rsid, 'clinical_significance': data['clinical_significance']}
            for rsid, data in clinvar_data.items()
        ])
        
        candidates = self.selector.select_from_annotations(clinvar_df)
        
        if len(candidates) == len(variants_df) and len(variants_df) > 10000:
            logger.warning(
                f"All {len(candidates)} variants selected - this suggests ClinVar annotation may have failed."
            )
        
        logger.info(f"Selected {len(candidates)} candidate variants")
        progress(f"Selected {len(candidates)} candidate variants", 65)
        
        # Layer 3: SNPedia expansion (async)
        progress("Expanding with SNPedia knowledge...", 70)
        import asyncio
        snpedia_data = {}
        
        if candidates:
            max_snpedia_variants = 1000
            if len(candidates) > max_snpedia_variants:
                logger.warning(f"Limiting SNPedia expansion to {max_snpedia_variants} variants")
                candidates_with_clinvar = [
                    rsid for rsid in candidates 
                    if clinvar_data.get(rsid, {}).get('clinical_significance')
                ]
                if candidates_with_clinvar:
                    candidates_to_expand = candidates_with_clinvar[:max_snpedia_variants]
                else:
                    candidates_to_expand = candidates[:max_snpedia_variants]
            else:
                candidates_to_expand = candidates
            
            if candidates_to_expand:
                async def fetch_snpedia():
                    async with SNPediaExpander() as expander:
                        return await expander.expand_batch(candidates_to_expand)
                
                snpedia_data = asyncio.run(fetch_snpedia())
                logger.info(f"Expanded {len(snpedia_data)} variants with SNPedia")
        
        progress(f"Expanded {len(snpedia_data)} variants with SNPedia", 80)
        
        # Layer 4: Population frequency lookup
        progress("Retrieving population frequencies...", 85)
        if 'chrom' in variants_df.columns:
            unique_chroms = variants_df['chrom'].dropna().unique()
            for chrom in unique_chroms:
                chrom_str = str(chrom).strip()
                if chrom_str and chrom_str not in ['', 'Unknown', 'MT']:
                    try:
                        self.freq_db.download_and_index_chromosome(chrom_str, force=False)
                    except Exception as e:
                        logger.warning(f"Failed to ensure chromosome {chrom_str} data: {e}")
        
        frequency_data = self.freq_db.get_frequencies_batch(variants_df['rsid'].tolist())
        logger.info(f"Retrieved frequencies for {sum(1 for v in frequency_data.values() if v is not None)} variants")
        progress("Retrieved population frequencies", 90)
        
        # Layer 5: Synthesis
        progress("Synthesizing annotations...", 95)
        result_df = self.synthesizer.synthesize(
            variants_df,
            clinvar_data,
            snpedia_data,
            frequency_data
        )
        
        logger.info(f"Pipeline complete: {len(result_df)} annotated variants")
        progress("Pipeline complete!", 100)
        
        return result_df
    
    def process_folder(self, folder_path: Path, pattern: str = "*.txt") -> pd.DataFrame:
        """
        Process all matching files in a folder.
        
        Args:
            folder_path: Path to folder
            pattern: File pattern to match
            
        Returns:
            Combined annotated DataFrame
        """
        logger.info(f"Processing folder: {folder_path}")
        
        # Layer 0: Normalize all files
        variants_df = self.normalizer.normalize_folder(folder_path, pattern)
        if variants_df.empty:
            logger.warning("No variants found in folder")
            return pd.DataFrame()
        
        logger.info(f"Normalized {len(variants_df)} variants from folder")
        
        # Continue with annotation pipeline (same as process_file)
        # Layer 1: ClinVar annotation
        self.clinvar.ensure_data_downloaded()
        self.clinvar.load_cache()
        
        clinvar_data = {}
        for rsid in variants_df['rsid']:
            clinvar_data[rsid] = self.clinvar.annotate(rsid)
        
        logger.info(f"Annotated {len(clinvar_data)} variants with ClinVar")
        
        # Layer 2: Candidate selection
        clinvar_df = pd.DataFrame([
            {'rsid': rsid, 'clinical_significance': data['clinical_significance']}
            for rsid, data in clinvar_data.items()
        ])
        
        candidates = self.selector.select_from_annotations(clinvar_df)
        logger.info(f"Selected {len(candidates)} candidate variants")
        
        # Layer 3: SNPedia expansion (limited)
        import asyncio
        snpedia_data = {}
        
        if candidates:
            max_snpedia_variants = 1000
            if len(candidates) > max_snpedia_variants:
                logger.warning(f"Limiting SNPedia expansion to {max_snpedia_variants} variants")
                candidates_with_clinvar = [
                    rsid for rsid in candidates 
                    if clinvar_data.get(rsid, {}).get('clinical_significance')
                ]
                if candidates_with_clinvar:
                    candidates_to_expand = candidates_with_clinvar[:max_snpedia_variants]
                else:
                    candidates_to_expand = candidates[:max_snpedia_variants]
            else:
                candidates_to_expand = candidates
            
            if candidates_to_expand:
                async def fetch_snpedia():
                    async with SNPediaExpander() as expander:
                        return await expander.expand_batch(candidates_to_expand)
                
                snpedia_data = asyncio.run(fetch_snpedia())
                logger.info(f"Expanded {len(snpedia_data)} variants with SNPedia")
        
        # Layer 4: Population frequency lookup
        if 'chrom' in variants_df.columns:
            unique_chroms = variants_df['chrom'].dropna().unique()
            for chrom in unique_chroms:
                chrom_str = str(chrom).strip()
                if chrom_str and chrom_str not in ['', 'Unknown', 'MT']:
                    try:
                        self.freq_db.download_and_index_chromosome(chrom_str, force=False)
                    except Exception as e:
                        logger.warning(f"Failed to ensure chromosome {chrom_str} data: {e}")
        
        frequency_data = self.freq_db.get_frequencies_batch(variants_df['rsid'].tolist())
        logger.info(f"Retrieved frequencies for {sum(1 for v in frequency_data.values() if v is not None)} variants")
        
        # Layer 5: Synthesis
        result_df = self.synthesizer.synthesize(
            variants_df,
            clinvar_data,
            snpedia_data,
            frequency_data
        )
        
        logger.info(f"Pipeline complete: {len(result_df)} annotated variants from folder")
        
        return result_df

