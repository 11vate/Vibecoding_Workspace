"""
Population Context Layer (1000 Genomes)

Stores and queries allele frequencies from 1000 Genomes project.

Invariants:
- DB must be queryable independently
- Missing AF is allowed (never guessed)
- Streaming VCF parsing (never load whole file)
- Never block GUI thread
"""

import sqlite3
import gzip
import logging
from pathlib import Path
from typing import Optional, Dict, List
import urllib.request
import tempfile
import threading

from config.settings import KG1_VCF_URL, KG1_DB_FILE, SQLITE_BATCH_CHUNK_SIZE

logger = logging.getLogger(__name__)


class PopulationFrequencyDB:
    """
    SQLite database for 1000 Genomes allele frequencies.
    
    Schema:
    allele_freqs(
        rsid TEXT PRIMARY KEY,
        ref TEXT,
        alt TEXT,
        global_af REAL
    )
    """
    
    def __init__(self, db_file: Path = KG1_DB_FILE):
        self.db_file = db_file
        self.db_file.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._ensure_schema()
    
    def _ensure_schema(self) -> None:
        """Create database schema if it doesn't exist."""
        with sqlite3.connect(self.db_file) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS allele_freqs (
                    rsid TEXT PRIMARY KEY,
                    ref TEXT,
                    alt TEXT,
                    global_af REAL
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_rsid ON allele_freqs(rsid)")
            conn.commit()
    
    def download_and_index_chromosome(self, chrom: str, force: bool = False) -> bool:
        """
        Download and index 1000 Genomes VCF for a chromosome.
        
        Args:
            chrom: Chromosome number (1-22, X, Y, MT)
            force: If True, re-download even if data exists
            
        Returns:
            True if successful
        """
        # Check if chromosome already has data
        if not force:
            with sqlite3.connect(self.db_file) as conn:
                # Check if we have any data for this chromosome
                # (We can't easily check per-chromosome without position data,
                # so we just check if DB has data at all)
                cursor = conn.execute("SELECT COUNT(*) FROM allele_freqs")
                count = cursor.fetchone()[0]
                if count > 1000:  # If we have substantial data, assume chromosome is indexed
                    logger.debug(f"Database already has {count} variants, skipping download for chrom {chrom}")
                    return True
                
                # For now, we'll download if requested
                # In a more sophisticated implementation, we'd track which chromosomes are indexed
                logger.info(f"Downloading chromosome {chrom} VCF data...")
        
        url = KG1_VCF_URL.format(chrom=chrom)
        logger.info(f"Downloading 1000 Genomes VCF for chromosome {chrom} from {url}")
        
        try:
            # Download to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.vcf.gz') as tmp_file:
                tmp_path = Path(tmp_file.name)
            
            urllib.request.urlretrieve(url, tmp_path)
            
            # Parse and index
            logger.info(f"Parsing VCF for chromosome {chrom}...")
            self._parse_vcf_streaming(tmp_path, chrom)
            
            # Clean up
            tmp_path.unlink()
            
            logger.info(f"Chromosome {chrom} indexed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to download/index chromosome {chrom}: {e}")
            if tmp_path.exists():
                tmp_path.unlink()
            return False
    
    def _parse_vcf_streaming(self, vcf_gz: Path, chrom: str) -> None:
        """
        Parse VCF file in streaming fashion.
        
        Extracts AF from INFO field or derives from AC/AN.
        Never loads whole file into memory.
        """
        batch_size = 1000
        batch = []
        
        with gzip.open(vcf_gz, 'rt', encoding='utf-8') as f, \
             sqlite3.connect(self.db_file) as conn:
            
            # Skip header lines
            for line in f:
                if line.startswith('#CHROM'):
                    break
            
            for line in f:
                if not line.strip():
                    continue
                
                try:
                    fields = line.strip().split('\t')
                    if len(fields) < 8:
                        continue
                    
                    # Extract RSID from ID field (format: rs123 or rs123;rs456)
                    rsid_field = fields[2]
                    if not rsid_field.startswith('rs'):
                        continue
                    
                    # Take first RSID if multiple
                    rsid = rsid_field.split(';')[0].strip()
                    if not rsid or not rsid.startswith('rs'):
                        continue
                    
                    ref = fields[3]
                    alt = fields[4].split(',')[0]  # Take first ALT allele
                    
                    # Extract AF from INFO field
                    info = fields[7]
                    af = self._extract_af_from_info(info)
                    
                    # If AF not found, try to derive from AC/AN
                    if af is None:
                        af = self._derive_af_from_info(info)
                    
                    if af is not None:
                        batch.append((rsid, ref, alt, af))
                        
                        if len(batch) >= batch_size:
                            self._insert_batch(conn, batch)
                            batch = []
                            conn.commit()  # Periodic commit
                
                except Exception as e:
                    logger.debug(f"Error parsing VCF line: {e}")
                    continue
            
            # Insert remaining batch
            if batch:
                self._insert_batch(conn, batch)
                conn.commit()
    
    def _extract_af_from_info(self, info: str) -> Optional[float]:
        """Extract AF (allele frequency) from INFO field."""
        # Look for AF=value pattern
        import re
        match = re.search(r'AF=([0-9.]+)', info)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                pass
        return None
    
    def _derive_af_from_info(self, info: str) -> Optional[float]:
        """Derive AF from AC (allele count) and AN (allele number)."""
        import re
        ac_match = re.search(r'AC=([0-9]+)', info)
        an_match = re.search(r'AN=([0-9]+)', info)
        
        if ac_match and an_match:
            try:
                ac = int(ac_match.group(1))
                an = int(an_match.group(1))
                if an > 0:
                    return ac / an
            except (ValueError, ZeroDivisionError):
                pass
        
        return None
    
    def _insert_batch(self, conn: sqlite3.Connection, batch: List[tuple]) -> None:
        """Insert batch of records (replace on conflict)."""
        conn.executemany("""
            INSERT OR REPLACE INTO allele_freqs (rsid, ref, alt, global_af)
            VALUES (?, ?, ?, ?)
        """, batch)
    
    def get_frequency(self, rsid: str) -> Optional[float]:
        """
        Get allele frequency for an RSID.
        
        Args:
            rsid: RSID to look up
            
        Returns:
            Allele frequency (0.0-1.0) or None if not found
        """
        with self._lock, sqlite3.connect(self.db_file) as conn:
            cursor = conn.execute(
                "SELECT global_af FROM allele_freqs WHERE rsid = ?",
                (rsid.upper(),)
            )
            result = cursor.fetchone()
            return result[0] if result else None
    
    def get_frequencies_batch(self, rsids: List[str]) -> Dict[str, Optional[float]]:
        """
        Get frequencies for multiple RSIDs.
        
        Handles large datasets by chunking queries to avoid SQLite's variable limit.
        SQLite has a default limit of 999 SQL variables per query, so we chunk at 900.
        
        Args:
            rsids: List of RSIDs (can be any size)
            
        Returns:
            Dictionary mapping RSID → frequency (or None if not found)
        """
        if not rsids:
            return {}
        
        results = {}
        chunk_size = SQLITE_BATCH_CHUNK_SIZE
        total_rsids = len(rsids)
        
        # If we have many RSIDs, log that we're chunking
        if total_rsids > chunk_size:
            logger.debug(f"Chunking {total_rsids} RSIDs into batches of {chunk_size} for SQL query")
        
        with self._lock, sqlite3.connect(self.db_file) as conn:
            # Process in chunks to avoid SQLite variable limit
            for i in range(0, total_rsids, chunk_size):
                chunk = rsids[i:i + chunk_size]
                
                # Build query with placeholders for this chunk
                placeholders = ','.join('?' * len(chunk))
                cursor = conn.execute(
                    f"SELECT rsid, global_af FROM allele_freqs WHERE rsid IN ({placeholders})",
                    [rsid.upper() for rsid in chunk]
                )
                
                # Build dict from results for this chunk
                for row in cursor.fetchall():
                    results[row[0]] = row[1]
                
                # Log progress for large batches
                if total_rsids > chunk_size and (i + chunk_size) % (chunk_size * 10) == 0:
                    processed = min(i + chunk_size, total_rsids)
                    logger.debug(f"Processed {processed}/{total_rsids} RSIDs for frequency lookup")
            
            # Fill in None for missing RSIDs (maintain invariant: all RSIDs have entry)
            for rsid in rsids:
                rsid_upper = rsid.upper()
                if rsid_upper not in results:
                    results[rsid] = None
        
        if total_rsids > chunk_size:
            found_count = sum(1 for v in results.values() if v is not None)
            logger.debug(f"Frequency lookup complete: {found_count}/{total_rsids} RSIDs found in database")
        
        return results

