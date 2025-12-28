"""
Filter widgets for table columns.

Provides UI components for filtering variant data by column.
"""

from typing import Optional, Callable
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QLineEdit, QComboBox, QLabel,
    QPushButton, QHBoxLayout
)
from PyQt6.QtCore import pyqtSignal, Qt
import pandas as pd


class ColumnFilterWidget(QWidget):
    """
    Filter widget for a single column.
    
    Supports text input for string columns and dropdown for categorical columns.
    """
    
    filter_changed = pyqtSignal(str, str)  # column_name, filter_value
    
    def __init__(self, column_name: str, column_data: pd.Series):
        """
        Initialize filter widget.
        
        Args:
            column_name: Name of the column
            column_data: Sample data from the column
        """
        super().__init__()
        self.column_name = column_name
        self.column_data = column_data
        
        self._setup_ui()
    
    def _setup_ui(self):
        """Setup filter widget UI."""
        layout = QVBoxLayout()
        layout.setContentsMargins(2, 2, 2, 2)
        
        # Column name label
        label = QLabel(self.column_name)
        label.setStyleSheet("font-weight: bold;")
        layout.addWidget(label)
        
        # Determine if column is categorical or text
        unique_values = self.column_data.dropna().unique()
        is_categorical = len(unique_values) <= 50 and len(unique_values) > 0
        
        if is_categorical:
            # Dropdown for categorical
            self.filter_combo = QComboBox()
            self.filter_combo.addItem("(All)", "")
            
            # Add unique values sorted
            for val in sorted([str(v) for v in unique_values if pd.notna(v)]):
                self.filter_combo.addItem(val, val)
            
            self.filter_combo.currentTextChanged.connect(self._on_filter_changed)
            layout.addWidget(self.filter_combo)
            self.filter_input = None
        else:
            # Text input for text/numeric columns
            self.filter_input = QLineEdit()
            self.filter_input.setPlaceholderText("Filter...")
            self.filter_input.textChanged.connect(self._on_text_filter_changed)
            layout.addWidget(self.filter_input)
            self.filter_combo = None
        
        self.setLayout(layout)
    
    def _on_filter_changed(self):
        """Handle dropdown filter change."""
        if self.filter_combo:
            current_data = self.filter_combo.currentData()
            filter_value = current_data if current_data else ""
            self.filter_changed.emit(self.column_name, filter_value)
    
    def _on_text_filter_changed(self, text: str):
        """Handle text filter change."""
        if self.filter_input:
            self.filter_changed.emit(self.column_name, text)
    
    def get_filter_value(self) -> str:
        """Get current filter value."""
        if self.filter_combo:
            return self.filter_combo.currentData() or ""
        elif self.filter_input:
            return self.filter_input.text()
        return ""
    
    def clear_filter(self):
        """Clear the filter."""
        if self.filter_combo:
            self.filter_combo.setCurrentIndex(0)
        elif self.filter_input:
            self.filter_input.clear()


class FilterPanel(QWidget):
    """
    Panel containing filter widgets for all columns.
    """
    
    filters_changed = pyqtSignal()  # Emitted when any filter changes
    
    def __init__(self, df: pd.DataFrame):
        """
        Initialize filter panel.
        
        Args:
            df: DataFrame to create filters for
        """
        super().__init__()
        self.df = df
        self.filter_widgets: dict[str, ColumnFilterWidget] = {}
        
        self._setup_ui()
    
    def _setup_ui(self):
        """Setup filter panel UI."""
        layout = QVBoxLayout()
        layout.setContentsMargins(5, 5, 5, 5)
        
        # Title
        title = QLabel("Column Filters")
        title.setStyleSheet("font-weight: bold; font-size: 12pt;")
        layout.addWidget(title)
        
        # Clear all button
        clear_btn = QPushButton("Clear All Filters")
        clear_btn.clicked.connect(self.clear_all_filters)
        layout.addWidget(clear_btn)
        
        # Create filter widget for each column
        for col in self.df.columns:
            filter_widget = ColumnFilterWidget(col, self.df[col])
            filter_widget.filter_changed.connect(self._on_filter_changed)
            self.filter_widgets[col] = filter_widget
            layout.addWidget(filter_widget)
        
        layout.addStretch()
        self.setLayout(layout)
    
    def _on_filter_changed(self, column: str, value: str):
        """Handle filter change from any widget."""
        self.filters_changed.emit()
    
    def get_filters(self) -> dict[str, str]:
        """Get all current filter values."""
        return {
            col: widget.get_filter_value()
            for col, widget in self.filter_widgets.items()
        }
    
    def clear_all_filters(self):
        """Clear all filters."""
        for widget in self.filter_widgets.values():
            widget.clear_filter()
        self.filters_changed.emit()









