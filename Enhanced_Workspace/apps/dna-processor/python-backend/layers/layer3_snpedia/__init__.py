"""
Layer 3: SNPedia Knowledge Expansion Layer (Async)

Purpose: Add biological and trait-level context from SNPedia.

Data collected: {extract, categories, url, source}
"""

from .expander import SNPediaExpander

__all__ = ["SNPediaExpander"]









