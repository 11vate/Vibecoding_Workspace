"""
Layer 6: Interpretive AI Layer (Strictly Bounded, Optional)

Purpose: Translate structured data into plain-language summaries.

AI is allowed to: summarize, rephrase, group traits, suggest follow-up
AI is NOT allowed to: diagnose, prescribe, invent facts, override source data
"""

from .interpreter import AIInterpreter
from .providers import AIProvider, OpenAIProvider, AnthropicProvider, LocalProvider, create_provider

__all__ = ["AIInterpreter", "AIProvider", "OpenAIProvider", "AnthropicProvider", "LocalProvider", "create_provider"]

