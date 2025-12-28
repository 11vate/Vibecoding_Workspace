"""
AI Provider implementations for different AI services.

Supports OpenAI, Anthropic, and provides interface for local models.
"""

import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, List, Optional
import pandas as pd

logger = logging.getLogger(__name__)


class AIProvider(ABC):
    """Base class for AI providers."""
    
    @abstractmethod
    def generate_summary(self, variants: List[Dict]) -> Dict[str, str]:
        """
        Generate summaries for variants.
        
        Args:
            variants: List of variant dictionaries
            
        Returns:
            Dictionary mapping rsid → summary text
        """
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if provider is available (API key set, etc.)."""
        pass


class OpenAIProvider(AIProvider):
    """OpenAI API provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4", max_tokens: int = 4000):
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self._client = None
        
        if api_key:
            try:
                import openai
                self._client = openai.OpenAI(api_key=api_key)
            except ImportError:
                logger.warning("openai package not installed. Install with: pip install openai")
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {e}")
    
    def is_available(self) -> bool:
        """Check if OpenAI is available."""
        return self._client is not None and self.api_key is not None
    
    def generate_summary(self, variants: List[Dict]) -> Dict[str, str]:
        """Generate summaries using OpenAI API."""
        if not self.is_available():
            logger.warning("OpenAI provider not available")
            return {}
        
        try:
            prompt = self._build_prompt(variants)
            
            response = self._client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a genomics information assistant. Provide brief, factual summaries of genetic variants based on the provided clinical data. Do not diagnose or provide medical advice."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            content = response.choices[0].message.content
            return self._parse_response(content)
            
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            return {}
    
    def _build_prompt(self, variants: List[Dict]) -> str:
        """Build prompt for AI."""
        prompt = """Provide brief, factual summaries for the following genetic variants.

Rules:
- Summarize only the provided clinical significance and phenotypes
- Do NOT diagnose or provide medical advice
- Do NOT invent facts not present in the data
- Keep summaries concise (1-2 sentences per variant)
- Mark summaries clearly as interpretive

Variants (JSON format):
{}

Please respond with a JSON object mapping each RSID to its summary:
{{
  "rs123": "Brief summary here...",
  "rs456": "Brief summary here..."
}}""".format(json.dumps(variants, indent=2))
        
        return prompt
    
    def _parse_response(self, response: str) -> Dict[str, str]:
        """Parse AI response JSON."""
        try:
            data = json.loads(response)
            if isinstance(data, dict):
                return {str(k): str(v) for k, v in data.items()}
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
        
        return {}


class AnthropicProvider(AIProvider):
    """Anthropic (Claude) API provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "claude-3-opus-20240229", max_tokens: int = 4000):
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self._client = None
        
        if api_key:
            try:
                import anthropic
                self._client = anthropic.Anthropic(api_key=api_key)
            except ImportError:
                logger.warning("anthropic package not installed. Install with: pip install anthropic")
            except Exception as e:
                logger.error(f"Failed to initialize Anthropic client: {e}")
    
    def is_available(self) -> bool:
        """Check if Anthropic is available."""
        return self._client is not None and self.api_key is not None
    
    def generate_summary(self, variants: List[Dict]) -> Dict[str, str]:
        """Generate summaries using Anthropic API."""
        if not self.is_available():
            logger.warning("Anthropic provider not available")
            return {}
        
        try:
            prompt = self._build_prompt(variants)
            
            message = self._client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=0.3,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            content = message.content[0].text if message.content else ""
            return self._parse_response(content)
            
        except Exception as e:
            logger.error(f"Anthropic API call failed: {e}")
            return {}
    
    def _build_prompt(self, variants: List[Dict]) -> str:
        """Build prompt for AI."""
        prompt = """Provide brief, factual summaries for the following genetic variants.

Rules:
- Summarize only the provided clinical significance and phenotypes
- Do NOT diagnose or provide medical advice
- Do NOT invent facts not present in the data
- Keep summaries concise (1-2 sentences per variant)
- Mark summaries clearly as interpretive
- Respond with valid JSON only

Variants (JSON format):
{}

Please respond with a JSON object mapping each RSID to its summary:
{{
  "rs123": "Brief summary here...",
  "rs456": "Brief summary here..."
}}""".format(json.dumps(variants, indent=2))
        
        return prompt
    
    def _parse_response(self, response: str) -> Dict[str, str]:
        """Parse AI response JSON."""
        try:
            # Try to extract JSON from response (may have markdown code blocks)
            if "```json" in response:
                start = response.find("```json") + 7
                end = response.find("```", start)
                response = response[start:end].strip()
            elif "```" in response:
                start = response.find("```") + 3
                end = response.find("```", start)
                response = response[start:end].strip()
            
            data = json.loads(response)
            if isinstance(data, dict):
                return {str(k): str(v) for k, v in data.items()}
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Failed to parse Anthropic response as JSON: {e}")
        
        return {}


class LocalProvider(AIProvider):
    """Local model provider (placeholder for future implementation)."""
    
    def __init__(self):
        logger.info("Local AI provider is not yet implemented")
    
    def is_available(self) -> bool:
        """Local provider not yet available."""
        return False
    
    def generate_summary(self, variants: List[Dict]) -> Dict[str, str]:
        """Generate summaries using local model (not implemented)."""
        logger.warning("Local AI provider not implemented")
        return {}


def create_provider(provider_name: str, **kwargs) -> AIProvider:
    """
    Create AI provider instance.
    
    Args:
        provider_name: Name of provider ("openai", "anthropic", "local")
        **kwargs: Provider-specific arguments
        
    Returns:
        AIProvider instance
    """
    if provider_name.lower() == "openai":
        return OpenAIProvider(
            api_key=kwargs.get("api_key"),
            model=kwargs.get("model", "gpt-4"),
            max_tokens=kwargs.get("max_tokens", 4000)
        )
    elif provider_name.lower() == "anthropic":
        return AnthropicProvider(
            api_key=kwargs.get("api_key"),
            model=kwargs.get("model", "claude-3-opus-20240229"),
            max_tokens=kwargs.get("max_tokens", 4000)
        )
    elif provider_name.lower() == "local":
        return LocalProvider()
    else:
        logger.warning(f"Unknown provider: {provider_name}, using OpenAI")
        return OpenAIProvider(**kwargs)









