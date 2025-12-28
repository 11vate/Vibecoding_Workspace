"""
SNPedia Knowledge Expansion Layer

Fetches biological context from SNPedia for RSIDs.

Invariants:
- Never crash pipeline due to SNPedia failures
- Cache results permanently
- Maintain checkpoint for resumability
- Respect concurrency limits
"""

import asyncio
import aiohttp
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Set
import re
from bs4 import BeautifulSoup
import time

from config.settings import (
    SNPEDIA_BASE_URL,
    SNPEDIA_CACHE_DIR,
    SNPEDIA_CHECKPOINT_FILE,
    SNPEDIA_CONCURRENCY_LIMIT,
    SNPEDIA_MAX_RETRIES,
    SNPEDIA_DELAY_BETWEEN_REQUESTS
)

logger = logging.getLogger(__name__)


class SNPediaExpander:
    """
    Expands RSIDs with SNPedia knowledge.
    
    Uses async HTTP with retry and fallback to HTML parsing.
    """
    
    def __init__(
        self,
        cache_dir: Path = SNPEDIA_CACHE_DIR,
        checkpoint_file: Path = SNPEDIA_CHECKPOINT_FILE,
        concurrency_limit: int = SNPEDIA_CONCURRENCY_LIMIT,
        max_retries: int = SNPEDIA_MAX_RETRIES,
        delay_between_requests: float = SNPEDIA_DELAY_BETWEEN_REQUESTS
    ):
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.checkpoint_file = checkpoint_file
        self.concurrency_limit = concurrency_limit
        self.max_retries = max_retries
        self.delay_between_requests = delay_between_requests
        self._session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        """Async context manager entry."""
        # Add headers to appear more like a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        self._session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers=headers
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self._session:
            await self._session.close()
    
    def get_cache_file(self, rsid: str) -> Path:
        """Get cache file path for an RSID."""
        return self.cache_dir / f"{rsid.upper()}.json"
    
    def load_checkpoint(self) -> Set[str]:
        """Load checkpoint of processed RSIDs."""
        if not self.checkpoint_file.exists():
            return set()
        
        try:
            with open(self.checkpoint_file, 'r') as f:
                data = json.load(f)
                return set(data.get('processed_rsids', []))
        except Exception as e:
            logger.warning(f"Failed to load checkpoint: {e}")
            return set()
    
    def save_checkpoint(self, processed_rsids: Set[str]) -> None:
        """Save checkpoint of processed RSIDs."""
        try:
            checkpoint_tmp = self.checkpoint_file.with_suffix('.tmp')
            with open(checkpoint_tmp, 'w') as f:
                json.dump({'processed_rsids': list(processed_rsids)}, f)
            checkpoint_tmp.replace(self.checkpoint_file)  # Atomic move
        except Exception as e:
            logger.warning(f"Failed to save checkpoint: {e}")
    
    def get_cached(self, rsid: str) -> Optional[Dict]:
        """Get cached data for RSID."""
        cache_file = self.get_cache_file(rsid)
        if not cache_file.exists():
            return None
        
        try:
            with open(cache_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Failed to load cache for {rsid}: {e}")
            return None
    
    def save_cache(self, rsid: str, data: Dict) -> None:
        """Save data to cache (atomic write)."""
        cache_file = self.get_cache_file(rsid)
        cache_tmp = cache_file.with_suffix('.tmp')
        
        try:
            with open(cache_tmp, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            cache_tmp.replace(cache_file)  # Atomic move
        except Exception as e:
            logger.error(f"Failed to save cache for {rsid}: {e}")
            if cache_tmp.exists():
                cache_tmp.unlink()
    
    async def expand_rsid(self, rsid: str) -> Dict:
        """
        Expand single RSID with SNPedia data.
        
        Returns:
            Dict with keys: extract, categories, url, source
            All values are strings/lists, empty if not found
        """
        # Check cache first
        cached = self.get_cached(rsid)
        if cached:
            return cached
        
        # Try API first, then HTML fallback
        result = await self._fetch_from_api(rsid)
        if result and result.get('source') == 'live':
            self.save_cache(rsid, result)
            return result
        
        # Fallback to HTML parsing
        result = await self._fetch_from_html(rsid)
        if result:
            self.save_cache(rsid, result)
            return result
        
        # Return empty result if both fail
        empty_result = {
            "extract": "",
            "categories": [],
            "url": f"{SNPEDIA_BASE_URL}{rsid}",
            "source": "failed"
        }
        self.save_cache(rsid, empty_result)
        return empty_result
    
    async def _fetch_from_api(self, rsid: str) -> Optional[Dict]:
        """Fetch from SNPedia API (if available)."""
        if not self._session:
            return None
        
        # SNPedia doesn't have a public API, so this is a placeholder
        # In practice, we'd use HTML parsing (implemented below)
        return None
    
    async def _fetch_from_html(self, rsid: str) -> Optional[Dict]:
        """Fetch from SNPedia HTML page."""
        if not self._session:
            return None
        
        url = f"{SNPEDIA_BASE_URL}{rsid}"
        
        for attempt in range(self.max_retries):
            try:
                async with self._session.get(url, allow_redirects=True) as response:
                    if response.status == 200:
                        html = await response.text()
                        return self._parse_html(html, url, rsid)
                    elif response.status == 404:
                        # Not found - silently skip (expected for many RSIDs)
                        return None
                    elif response.status == 403:
                        # Forbidden - likely rate limiting or blocking
                        # Don't log every 403 as warning, just debug
                        if attempt == 0:  # Only log first attempt
                            logger.debug(f"HTTP 403 for {rsid} (may be rate-limited or blocked)")
                        # Wait longer before retry for 403s
                        if attempt < self.max_retries - 1:
                            await asyncio.sleep(5 * (attempt + 1))  # Progressive delay: 5s, 10s, 15s
                        continue
                    else:
                        logger.warning(f"HTTP {response.status} for {rsid}")
            
            except asyncio.TimeoutError:
                if attempt == 0:  # Only log first timeout
                    logger.debug(f"Timeout fetching {rsid}")
            except Exception as e:
                logger.debug(f"Error fetching {rsid}: {e}")
            
            # Exponential backoff for other errors
            if attempt < self.max_retries - 1:
                await asyncio.sleep(2 ** attempt)
        
        return None
    
    def _parse_html(self, html: str, url: str, rsid: str) -> Dict:
        """Parse SNPedia HTML page."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract main content
            extract = ""
            content_div = soup.find('div', {'id': 'mw-content-text'})
            if content_div:
                # Get first paragraph
                first_p = content_div.find('p')
                if first_p:
                    extract = first_p.get_text().strip()
            
            # Extract categories
            categories = []
            cat_links = soup.find_all('a', href=re.compile(r'/index.php/Category:'))
            for link in cat_links:
                cat_name = link.get_text().strip()
                if cat_name:
                    categories.append(cat_name)
            
            return {
                "extract": extract,
                "categories": list(set(categories)),  # Deduplicate
                "url": url,
                "source": "live"
            }
        
        except Exception as e:
            logger.warning(f"Failed to parse HTML for {rsid}: {e}")
            return {
                "extract": "",
                "categories": [],
                "url": url,
                "source": "parse_failed"
            }
    
    async def expand_batch(self, rsids: List[str]) -> Dict[str, Dict]:
        """
        Expand multiple RSIDs with concurrency control.
        
        Args:
            rsids: List of RSIDs to expand
            
        Returns:
            Dictionary mapping RSID → expansion data
        """
        # Load checkpoint
        processed = self.load_checkpoint()
        
        # Filter out already processed
        to_process = [rsid for rsid in rsids if rsid not in processed]
        
        if not to_process:
            logger.info("All RSIDs already processed")
            # Load from cache
            results = {}
            for rsid in rsids:
                cached = self.get_cached(rsid)
                if cached:
                    results[rsid] = cached
            return results
        
        logger.info(f"Expanding {len(to_process)} RSIDs (concurrency: {self.concurrency_limit})")
        
        # Process with semaphore for concurrency control
        semaphore = asyncio.Semaphore(self.concurrency_limit)
        results = {}
        
        async def process_one(rsid: str):
            async with semaphore:
                # Add delay between requests to be respectful and avoid rate limiting
                await asyncio.sleep(self.delay_between_requests)
                result = await self.expand_rsid(rsid)
                results[rsid] = result
                processed.add(rsid)
        
        # Process in batches for checkpoint saving
        batch_size = 100
        for i in range(0, len(to_process), batch_size):
            batch = to_process[i:i + batch_size]
            await asyncio.gather(*[process_one(rsid) for rsid in batch])
            
            # Save checkpoint periodically
            self.save_checkpoint(processed)
            logger.info(f"Processed {min(i + batch_size, len(to_process))}/{len(to_process)} RSIDs")
        
        # Final checkpoint save
        self.save_checkpoint(processed)
        
        return results

