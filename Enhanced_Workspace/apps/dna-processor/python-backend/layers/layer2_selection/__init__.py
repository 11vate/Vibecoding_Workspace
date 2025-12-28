"""
Layer 2: Candidate Selection Engine

Purpose: Critical intelligence gate - reduce variants to biologically relevant subset.

Output: Sorted list of RSIDs to expand further.
"""

from .selector import CandidateSelector

__all__ = ["CandidateSelector"]
