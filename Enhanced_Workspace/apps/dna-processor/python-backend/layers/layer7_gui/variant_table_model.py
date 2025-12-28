"""
Custom table model for variant data with pagination support.

Provides efficient virtual scrolling for large datasets.
"""

from typing import Optional
import pandas as pd
from PyQt6.QtCore import QAbstractTableModel, Qt, QModelIndex
import logging

logger = logging.getLogger(__name__)


class VariantTableModel(QAbstractTableModel):
    """
    Table model for displaying variant data with pagination.
    
    Only loads visible page into memory for efficient rendering.
    """
    
    def __init__(self, df: pd.DataFrame, page_size: int = 100):
        """
        Initialize model.
        
        Args:
            df: Full DataFrame with variant data
            page_size: Number of rows per page
        """
        super().__init__()
        self._df = df.copy()
        self.page_size = page_size
        self.current_page = 0
        self._filtered_df: Optional[pd.DataFrame] = None
        self._filters: dict = {}  # Column name -> filter value
        
        # Calculate total pages
        self._update_filtered_data()
    
    def _update_filtered_data(self):
        """Apply current filters to DataFrame."""
        self._filtered_df = self._df.copy()
        
        # Check for global search filter (special key "_global_search")
        global_search = self._filters.pop("_global_search", None)
        
        if global_search and global_search.strip():
            # Global search: filter rows where ANY column contains the text
            search_lower = str(global_search).lower()
            mask = pd.Series([False] * len(self._filtered_df))
            for col in self._filtered_df.columns:
                col_mask = self._filtered_df[col].astype(str).str.lower().str.contains(
                    search_lower, na=False, regex=False
                )
                mask = mask | col_mask
            self._filtered_df = self._filtered_df[mask] if mask.any() else pd.DataFrame(columns=self._df.columns)
        
        # Apply column-specific filters
        for column, filter_value in self._filters.items():
            if column in self._filtered_df.columns and filter_value:
                filter_str = str(filter_value).lower()
                # Text search in string columns
                mask = self._filtered_df[column].astype(str).str.lower().str.contains(
                    filter_str, na=False, regex=False
                )
                self._filtered_df = self._filtered_df[mask]
        
        # Restore global search filter if it was removed
        if global_search:
            self._filters["_global_search"] = global_search
        
        # Reset to first page if needed
        total_pages = self._get_total_pages()
        if self.current_page >= total_pages and total_pages > 0:
            self.current_page = total_pages - 1
    
    def _get_total_pages(self) -> int:
        """Calculate total number of pages."""
        if self._filtered_df is None or len(self._filtered_df) == 0:
            return 1
        return (len(self._filtered_df) + self.page_size - 1) // self.page_size
    
    def _get_current_page_data(self) -> pd.DataFrame:
        """Get DataFrame slice for current page."""
        if self._filtered_df is None or len(self._filtered_df) == 0:
            return pd.DataFrame(columns=self._df.columns)
        
        start_idx = self.current_page * self.page_size
        end_idx = start_idx + self.page_size
        return self._filtered_df.iloc[start_idx:end_idx].copy()
    
    def rowCount(self, parent: QModelIndex = QModelIndex()) -> int:
        """Return number of rows in current page."""
        page_data = self._get_current_page_data()
        return len(page_data)
    
    def columnCount(self, parent: QModelIndex = QModelIndex()) -> int:
        """Return number of columns."""
        return len(self._df.columns)
    
    def data(self, index: QModelIndex, role: int = Qt.ItemDataRole.DisplayRole):
        """Return data for given index."""
        if not index.isValid():
            return None
        
        if role == Qt.ItemDataRole.DisplayRole or role == Qt.ItemDataRole.EditRole:
            page_data = self._get_current_page_data()
            if index.row() >= len(page_data):
                return None
            
            col_name = self._df.columns[index.column()]
            value = page_data.iloc[index.row(), index.column()]
            
            # Convert to string, handle NaN
            if pd.isna(value):
                return ""
            return str(value)
        
        return None
    
    def headerData(
        self, 
        section: int, 
        orientation: Qt.Orientation, 
        role: int = Qt.ItemDataRole.DisplayRole
    ):
        """Return header data."""
        if role == Qt.ItemDataRole.DisplayRole:
            if orientation == Qt.Orientation.Horizontal:
                if section < len(self._df.columns):
                    return self._df.columns[section]
            elif orientation == Qt.Orientation.Vertical:
                # Show actual row number from full dataset
                if self._filtered_df is not None and len(self._filtered_df) > 0:
                    start_idx = self.current_page * self.page_size
                    actual_row = start_idx + section
                    if actual_row < len(self._filtered_df):
                        return actual_row + 1  # 1-indexed for display
                return section + 1
        
        return None
    
    def flags(self, index: QModelIndex) -> Qt.ItemFlag:
        """Return item flags (read-only)."""
        return Qt.ItemFlag.ItemIsEnabled | Qt.ItemFlag.ItemIsSelectable
    
    # Pagination methods
    def go_to_page(self, page: int) -> bool:
        """
        Navigate to specific page.
        
        Returns:
            True if page changed
        """
        total_pages = self._get_total_pages()
        if 0 <= page < total_pages:
            self.current_page = page
            self.layoutChanged.emit()
            return True
        return False
    
    def next_page(self) -> bool:
        """Go to next page."""
        total_pages = self._get_total_pages()
        if self.current_page < total_pages - 1:
            self.current_page += 1
            self.layoutChanged.emit()
            return True
        return False
    
    def previous_page(self) -> bool:
        """Go to previous page."""
        if self.current_page > 0:
            self.current_page -= 1
            self.layoutChanged.emit()
            return True
        return False
    
    def get_current_page(self) -> int:
        """Get current page number (0-indexed)."""
        return self.current_page
    
    def get_total_pages(self) -> int:
        """Get total number of pages."""
        return self._get_total_pages()
    
    def get_total_rows(self) -> int:
        """Get total number of rows (filtered)."""
        if self._filtered_df is None:
            return len(self._df)
        return len(self._filtered_df)
    
    # Filtering methods
    def set_filter(self, column: str, value: str):
        """
        Set filter for a column.
        
        Args:
            column: Column name
            value: Filter value (empty string to clear filter)
        """
        if value and value.strip():
            self._filters[column] = value.strip()
        elif column in self._filters:
            del self._filters[column]
        
        self.current_page = 0  # Reset to first page
        self._update_filtered_data()
        self.layoutChanged.emit()
    
    def set_filters(self, filters: dict[str, str]):
        """
        Set multiple filters at once.
        
        Args:
            filters: Dictionary mapping column names to filter values
        """
        # Clear existing filters
        self._filters = {}
        
        # Set new filters (only non-empty values)
        for column, value in filters.items():
            if value and value.strip() and column in self._df.columns:
                self._filters[column] = value.strip()
        
        self.current_page = 0
        self._update_filtered_data()
        self.layoutChanged.emit()
    
    def clear_filters(self):
        """Clear all filters."""
        self._filters = {}
        self.current_page = 0
        self._update_filtered_data()
        self.layoutChanged.emit()
    
    def get_filtered_dataframe(self) -> pd.DataFrame:
        """Get full filtered DataFrame (not just current page)."""
        return self._filtered_df.copy() if self._filtered_df is not None else pd.DataFrame()
    
    def update_dataframe(self, df: pd.DataFrame):
        """Update the underlying DataFrame."""
        self._df = df.copy()
        self._update_filtered_data()
        self.layoutChanged.emit()
    
    # Sorting support
    def sort(self, column: int, order: Qt.SortOrder = Qt.SortOrder.AscendingOrder):
        """Sort the data by column."""
        if column < 0 or column >= len(self._df.columns):
            return
        
        col_name = self._df.columns[column]
        ascending = (order == Qt.SortOrder.AscendingOrder)
        
        self._df = self._df.sort_values(by=col_name, ascending=ascending, na_position='last')
        self._update_filtered_data()
        self.current_page = 0
        self.layoutChanged.emit()

