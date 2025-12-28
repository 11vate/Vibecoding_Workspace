"""
Layer 8: Persistence, Caching, and Checkpointing

Purpose: Ensure data safety and resumability.

Mandatory: Atomic JSON saves, caching everywhere, checkpoint resumability
Forbidden: Hidden state, implicit globals, unlogged failures
"""

from .persistence import PersistenceManager

__all__ = ["PersistenceManager"]









