"""
Interpretive AI Layer

Provides optional AI-powered summaries of variant annotations.

Constraints:
- Optional (requires API key)
- Chunk input to avoid token overflow
- Must request structured JSON output
- Must validate JSON
- Must gracefully degrade on failure
"""

import json
import logging
from typing import Dict, List, Optional
import pandas as pd

from config.settings import (
    AI_ENABLED, AI_PROVIDER, AI_API_KEY, AI_MODEL, AI_MAX_TOKENS,
    ANTHROPIC_API_KEY, ANTHROPIC_MODEL
)
from layers.layer6_ai.providers import create_provider, AIProvider

logger = logging.getLogger(__name__)


class AIInterpreter:
    """
    Provides AI interpretation of variant annotations.
    
    Output is clearly marked as interpretive.
    Supports multiple AI providers (OpenAI, Anthropic, local).
    """
    
    def __init__(
        self,
        provider_name: Optional[str] = None,
        api_key: Optional[str] = None,
        model: Optional[str] = None
    ):
        """
        Initialize AI interpreter.
        
        Args:
            provider_name: Provider name ("openai", "anthropic", "local")
            api_key: API key (provider-specific)
            model: Model name (provider-specific)
        """
        self.provider_name = provider_name or AI_PROVIDER
        self.api_key = api_key or AI_API_KEY
        self.model = model or (AI_MODEL if self.provider_name == "openai" else ANTHROPIC_MODEL)
        self.max_tokens = AI_MAX_TOKENS
        
        # Determine API key based on provider
        if self.provider_name == "anthropic":
            provider_key = ANTHROPIC_API_KEY or self.api_key
        else:
            provider_key = self.api_key
        
        # Create provider
        self.provider: AIProvider = create_provider(
            self.provider_name,
            api_key=provider_key,
            model=self.model,
            max_tokens=self.max_tokens
        )
        
        self.enabled = AI_ENABLED and self.provider.is_available()
        
        if not self.enabled:
            logger.info(f"AI Interpreter is disabled (provider: {self.provider_name}, available: {self.provider.is_available()})")
    
    def summarize_variants(
        self,
        variants_df: pd.DataFrame,
        chunk_size: int = 50
    ) -> Dict[str, str]:
        """
        Generate AI summaries for variants.
        
        Args:
            variants_df: DataFrame with variant annotations
            chunk_size: Number of variants per chunk
            
        Returns:
            Dictionary mapping rsid → summary (or empty if disabled/failed)
        """
        if not self.enabled:
            return {}
        
        summaries = {}
        
        # Process in chunks
        for i in range(0, len(variants_df), chunk_size):
            chunk = variants_df.iloc[i:i + chunk_size]
            chunk_summaries = self._summarize_chunk(chunk)
            summaries.update(chunk_summaries)
        
        return summaries
    
    def _summarize_chunk(self, chunk_df: pd.DataFrame) -> Dict[str, str]:
        """
        Summarize a chunk of variants using the configured provider.
        
        Returns empty dict on failure (graceful degradation).
        """
        try:
            # Convert chunk to records for provider
            records = chunk_df.to_dict('records')
            
            # Use provider to generate summaries
            summaries = self.provider.generate_summary(records)
            return summaries
            
        except Exception as e:
            logger.warning(f"AI summarization failed: {e}")
        
        return {}
    
    def is_enabled(self) -> bool:
        """Check if AI interpreter is enabled."""
        return self.enabled

