"""
Persistence and Checkpointing Layer

Provides atomic saves, caching, and checkpoint resumability.

Invariants:
- Atomic JSON saves (write to temp, then rename)
- No silent overwrites
- Deterministic outputs
- All failures logged
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional
import shutil
from datetime import datetime

logger = logging.getLogger(__name__)


class PersistenceManager:
    """
    Manages atomic file operations and checkpointing.
    
    All file writes are atomic to prevent corruption.
    """
    
    def __init__(self, base_dir: Path):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)
    
    def save_json_atomic(
        self,
        data: Any,
        file_path: Path,
        create_backup: bool = True
    ) -> bool:
        """
        Save data to JSON file atomically.
        
        Args:
            data: Data to save (must be JSON-serializable)
            file_path: Destination file path
            create_backup: If True, create backup of existing file
            
        Returns:
            True if successful
        """
        file_path = Path(file_path)
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Create backup if file exists
        if create_backup and file_path.exists():
            backup_path = file_path.with_suffix(f'.backup.{datetime.now().strftime("%Y%m%d_%H%M%S")}')
            try:
                shutil.copy2(file_path, backup_path)
            except Exception as e:
                logger.warning(f"Failed to create backup: {e}")
        
        # Write to temporary file first
        temp_path = file_path.with_suffix('.tmp')
        
        try:
            with open(temp_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            # Atomic move
            temp_path.replace(file_path)
            
            logger.debug(f"Atomically saved JSON to {file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save JSON to {file_path}: {e}")
            if temp_path.exists():
                temp_path.unlink()
            return False
    
    def load_json(self, file_path: Path, default: Optional[Any] = None) -> Any:
        """
        Load data from JSON file.
        
        Args:
            file_path: Path to JSON file
            default: Default value if file doesn't exist or fails to load
            
        Returns:
            Loaded data or default
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            logger.debug(f"JSON file not found: {file_path}")
            return default
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load JSON from {file_path}: {e}")
            return default
    
    def save_checkpoint(
        self,
        checkpoint_name: str,
        data: Dict[str, Any]
    ) -> bool:
        """
        Save checkpoint data.
        
        Args:
            checkpoint_name: Name of checkpoint
            data: Checkpoint data
            
        Returns:
            True if successful
        """
        checkpoint_file = self.base_dir / f"{checkpoint_name}.checkpoint.json"
        
        # Add timestamp to checkpoint data
        checkpoint_data = {
            'timestamp': datetime.now().isoformat(),
            'data': data
        }
        
        return self.save_json_atomic(checkpoint_data, checkpoint_file)
    
    def load_checkpoint(
        self,
        checkpoint_name: str
    ) -> Optional[Dict[str, Any]]:
        """
        Load checkpoint data.
        
        Args:
            checkpoint_name: Name of checkpoint
            
        Returns:
            Checkpoint data or None
        """
        checkpoint_file = self.base_dir / f"{checkpoint_name}.checkpoint.json"
        
        checkpoint_data = self.load_json(checkpoint_file)
        if checkpoint_data and isinstance(checkpoint_data, dict):
            return checkpoint_data.get('data')
        
        return None
    
    def ensure_deterministic_output(self, data: Any) -> Any:
        """
        Ensure output is deterministic (sorted keys, etc.).
        
        For JSON outputs, ensures consistent ordering.
        """
        if isinstance(data, dict):
            # Sort keys for determinism
            return {k: self.ensure_deterministic_output(v) for k, v in sorted(data.items())}
        elif isinstance(data, list):
            return [self.ensure_deterministic_output(item) for item in data]
        else:
            return data









