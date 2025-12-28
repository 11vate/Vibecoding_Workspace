"""
Main GUI Window

Qt-based interface for DNA annotation pipeline.
All background work via threads/asyncio.
Communication via Qt signals only.
"""

import sys
import logging
from pathlib import Path
from typing import Optional
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QFileDialog, QTableView,
    QTextEdit, QLabel, QProgressBar, QMessageBox, QSpinBox,
    QLineEdit, QSplitter, QToolBar, QTabWidget
)
from PyQt6.QtCore import QThread, pyqtSignal, Qt
import pandas as pd

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from pipeline import DNAAnnotationPipeline
from layers.layer7_gui.variant_table_model import VariantTableModel
from layers.layer7_gui.filter_widget import FilterPanel
from layers.layer7_gui.charts import ChartsTabWidget
from layers.layer7_gui.ai_qa_widget import AIQAWidget

logger = logging.getLogger(__name__)


class PipelineWorker(QThread):
    """
    Worker thread for running annotation pipeline.
    
    All heavy processing happens here to keep GUI responsive.
    """
    
    # Signals for communication with GUI
    progress_update = pyqtSignal(str)
    progress_percentage = pyqtSignal(int)
    finished = pyqtSignal(pd.DataFrame)
    error = pyqtSignal(str)
    
    def __init__(self, file_path: Path, pipeline: DNAAnnotationPipeline):
        super().__init__()
        self.file_path = file_path
        self.pipeline = pipeline
    
    def run(self):
        """Execute pipeline in background thread."""
        try:
            self.progress_update.emit("Normalizing input file...")
            result_df = self.pipeline.process_file(self.file_path)
            
            if result_df.empty:
                self.error.emit("No variants found in file")
                return
            
            self.progress_update.emit("Processing complete!")
            self.finished.emit(result_df)
            
        except Exception as e:
            logger.error(f"Pipeline error: {e}", exc_info=True)
            self.error.emit(str(e))


class MainWindow(QMainWindow):
    """
    Main application window.
    
    Provides file selection, progress display, results table, and logging.
    """
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("DNA Annotation System")
        self.setGeometry(100, 100, 1200, 800)
        
        # Initialize pipeline
        self.pipeline = DNAAnnotationPipeline()
        self.current_data: Optional[pd.DataFrame] = None
        self.worker: Optional[PipelineWorker] = None
        self.table_model: Optional[VariantTableModel] = None
        
        # Setup UI
        self._setup_ui()
        
        logger.info("GUI initialized")
    
    def _setup_ui(self):
        """Setup user interface."""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # File selection area
        file_layout = QHBoxLayout()
        self.file_label = QLabel("No file selected")
        file_btn = QPushButton("Select File")
        file_btn.clicked.connect(self._select_file)
        folder_btn = QPushButton("Select Folder")
        folder_btn.clicked.connect(self._select_folder)
        
        file_layout.addWidget(self.file_label)
        file_layout.addWidget(file_btn)
        file_layout.addWidget(folder_btn)
        file_layout.addStretch()
        
        layout.addLayout(file_layout)
        
        # Progress bar
        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        self.progress_bar.setVisible(False)
        layout.addWidget(self.progress_bar)
        
        # Progress label
        self.progress_label = QLabel("")
        layout.addWidget(self.progress_label)
        
        # Create toolbar
        toolbar = QToolBar()
        toolbar.setMovable(False)
        
        # Filter toggle button
        self.filter_toggle_btn = QPushButton("Show Filters")
        self.filter_toggle_btn.setCheckable(True)
        self.filter_toggle_btn.clicked.connect(self._toggle_filters)
        self.filter_toggle_btn.setEnabled(False)
        toolbar.addWidget(self.filter_toggle_btn)
        
        toolbar.addSeparator()
        
        # Export buttons
        self.export_csv_btn = QPushButton("Export CSV")
        self.export_csv_btn.clicked.connect(self._export_csv)
        self.export_csv_btn.setEnabled(False)
        toolbar.addWidget(self.export_csv_btn)
        
        self.export_json_btn = QPushButton("Export JSON")
        self.export_json_btn.clicked.connect(self._export_json)
        self.export_json_btn.setEnabled(False)
        toolbar.addWidget(self.export_json_btn)
        
        toolbar.addSeparator()
        
        # Search bar
        toolbar.addWidget(QLabel("Search:"))
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Search all columns...")
        self.search_input.textChanged.connect(self._on_search_changed)
        toolbar.addWidget(self.search_input)
        
        layout.addWidget(toolbar)
        
        # Create horizontal splitter for filters and table
        main_splitter = QSplitter(Qt.Orientation.Horizontal)
        layout.addWidget(main_splitter)
        
        # Filter panel (initially hidden, will be shown when data is loaded)
        self.filter_panel = None
        filter_container = QWidget()
        filter_container.setMaximumWidth(250)
        filter_container.setVisible(False)
        self.filter_container = filter_container
        main_splitter.addWidget(filter_container)
        
        # Create tab widget for table and charts
        self.tabs = QTabWidget()
        main_splitter.addWidget(self.tabs)
        
        # Table tab
        table_tab = QWidget()
        table_layout = QVBoxLayout()
        table_tab.setLayout(table_layout)
        
        # Create vertical splitter for table and pagination
        table_splitter = QSplitter(Qt.Orientation.Vertical)
        table_layout.addWidget(table_splitter)
        
        # Results table with custom model
        self.table = QTableView()
        self.table.setSortingEnabled(True)
        self.table.setSelectionBehavior(QTableView.SelectionBehavior.SelectRows)
        table_splitter.addWidget(self.table)
        
        # Pagination controls
        pagination_widget = QWidget()
        pagination_layout = QHBoxLayout()
        pagination_widget.setLayout(pagination_layout)
        
        self.prev_page_btn = QPushButton("◀ Previous")
        self.prev_page_btn.clicked.connect(self._previous_page)
        self.prev_page_btn.setEnabled(False)
        pagination_layout.addWidget(self.prev_page_btn)
        
        pagination_layout.addStretch()
        
        self.page_info_label = QLabel("Page 1 of 1")
        pagination_layout.addWidget(self.page_info_label)
        
        pagination_layout.addStretch()
        
        self.page_size_label = QLabel("Page size:")
        pagination_layout.addWidget(self.page_size_label)
        
        self.page_size_spin = QSpinBox()
        self.page_size_spin.setMinimum(50)
        self.page_size_spin.setMaximum(1000)
        self.page_size_spin.setSingleStep(50)
        self.page_size_spin.setValue(100)
        self.page_size_spin.valueChanged.connect(self._on_page_size_changed)
        pagination_layout.addWidget(self.page_size_spin)
        
        pagination_layout.addStretch()
        
        self.next_page_btn = QPushButton("Next ▶")
        self.next_page_btn.clicked.connect(self._next_page)
        self.next_page_btn.setEnabled(False)
        pagination_layout.addWidget(self.next_page_btn)
        
        table_splitter.addWidget(pagination_widget)
        self.tabs.addTab(table_tab, "Table")
        
        # Charts tab
        self.charts_tab = ChartsTabWidget()
        self.tabs.addTab(self.charts_tab, "Charts")
        
        # AI Q&A tab
        self.ai_qa_tab = AIQAWidget()
        self.tabs.addTab(self.ai_qa_tab, "AI Q&A")
        
        # Log output
        log_label = QLabel("Log Output:")
        layout.addWidget(log_label)
        
        self.log_output = QTextEdit()
        self.log_output.setReadOnly(True)
        self.log_output.setMaximumHeight(200)
        layout.addWidget(self.log_output)
        
        # Setup logging to text widget
        log_handler = TextEditLogHandler(self.log_output)
        log_handler.setLevel(logging.INFO)
        logger.addHandler(log_handler)
    
    def _select_file(self):
        """Open file dialog to select DNA file."""
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select DNA File",
            "",
            "DNA Files (*.txt *.csv);;All Files (*)"
        )
        
        if file_path:
            self.file_label.setText(Path(file_path).name)
            self._process_file(Path(file_path))
    
    def _select_folder(self):
        """Open folder dialog to select folder with DNA files."""
        folder_path = QFileDialog.getExistingDirectory(
            self,
            "Select Folder with DNA Files"
        )
        
        if folder_path:
            self.file_label.setText(f"Folder: {Path(folder_path).name}")
            self._process_folder(Path(folder_path))
    
    def _process_folder(self, folder_path: Path):
        """Start folder processing in background thread."""
        if self.worker and self.worker.isRunning():
            QMessageBox.warning(
                self,
                "Processing",
                "Another operation is currently being processed"
            )
            return
        
        # Reset UI
        self.table.setModel(None)
        self.table_model = None
        self.current_data = None
        self.export_csv_btn.setEnabled(False)
        self.export_json_btn.setEnabled(False)
        self.filter_toggle_btn.setEnabled(False)
        self.search_input.clear()
        
        # Show progress
        self.progress_bar.setValue(0)
        self.progress_bar.setVisible(True)
        self.progress_label.setText("Processing folder...")
        
        # Process folder (using same worker pattern)
        # For now, we'll use a simple approach - process synchronously in worker
        # In a more sophisticated implementation, we could process files in parallel
        self.worker = PipelineWorker(folder_path, self.pipeline, is_folder=True)
        self.worker.progress_update.connect(self._on_progress_update)
        self.worker.progress_percentage.connect(self._on_progress_percentage)
        self.worker.finished.connect(self._on_pipeline_finished)
        self.worker.error.connect(self._on_pipeline_error)
        self.worker.start()
    
    def _process_file(self, file_path: Path):
        """Start pipeline processing in background thread."""
        if self.worker and self.worker.isRunning():
            QMessageBox.warning(
                self,
                "Processing",
                "Another file is currently being processed"
            )
            return
        
        # Reset UI
        self.table.setModel(None)  # Clear model
        self.table_model = None
        self.current_data = None
        self.export_csv_btn.setEnabled(False)
        self.export_json_btn.setEnabled(False)
        self.search_input.clear()
        self._update_pagination_controls()
        
        # Show progress
        self.progress_bar.setValue(0)
        self.progress_bar.setVisible(True)
        self.progress_label.setText("Processing...")
        
        # Start worker thread
        self.worker = PipelineWorker(file_path, self.pipeline)
        self.worker.progress_update.connect(self._on_progress_update)
        self.worker.progress_percentage.connect(self._on_progress_percentage)
        self.worker.finished.connect(self._on_pipeline_finished)
        self.worker.error.connect(self._on_pipeline_error)
        self.worker.start()
    
    def _on_progress_update(self, message: str):
        """Handle progress update from worker."""
        self.progress_label.setText(message)
        logger.info(message)
    
    def _on_progress_percentage(self, percentage: int):
        """Handle progress percentage update."""
        self.progress_bar.setValue(percentage)
    
    def _on_pipeline_finished(self, result_df: pd.DataFrame):
        """Handle pipeline completion."""
        self.progress_bar.setValue(100)
        self.progress_bar.setVisible(False)
        self.progress_label.setText("Processing complete!")
        
        self.current_data = result_df
        self._display_results(result_df)
        
        logger.info(f"Displayed {len(result_df)} annotated variants")
    
    def _on_pipeline_error(self, error_message: str):
        """Handle pipeline error."""
        self.progress_bar.setVisible(False)
        self.progress_label.setText("Error occurred")
        
        QMessageBox.critical(self, "Processing Error", error_message)
        logger.error(f"Pipeline error: {error_message}")
    
    def _display_results(self, df: pd.DataFrame):
        """Display results in table using paginated model."""
        if df.empty:
            return
        
        # Create model with pagination
        page_size = self.page_size_spin.value()
        self.table_model = VariantTableModel(df, page_size=page_size)
        
        # Create filter panel
        filter_layout = QVBoxLayout()
        filter_layout.setContentsMargins(0, 0, 0, 0)
        self.filter_panel = FilterPanel(df)
        self.filter_panel.filters_changed.connect(self._on_filters_changed)
        filter_layout.addWidget(self.filter_panel)
        self.filter_container.setLayout(filter_layout)
        self.filter_container.setVisible(False)
        
        # Set model on table view
        self.table.setModel(self.table_model)
        
        # Update pagination controls
        self._update_pagination_controls()
        
        # Enable export buttons and filter toggle
        self.export_csv_btn.setEnabled(True)
        self.export_json_btn.setEnabled(True)
        self.filter_toggle_btn.setEnabled(True)
        
        # Update charts
        self.charts_tab.update_data(df)
        
        # Update AI Q&A context
        self.ai_qa_tab.update_context(df)
        
        # Resize columns to content
        self.table.resizeColumnsToContents()
        
        logger.info(f"Displayed {len(df)} variants in paginated table (page size: {page_size})")
    
    def _update_pagination_controls(self):
        """Update pagination control states and labels."""
        if self.table_model is None:
            return
        
        current_page = self.table_model.get_current_page()
        total_pages = self.table_model.get_total_pages()
        total_rows = self.table_model.get_total_rows()
        
        # Update buttons
        self.prev_page_btn.setEnabled(current_page > 0)
        self.next_page_btn.setEnabled(current_page < total_pages - 1)
        
        # Update label
        if total_rows > 0:
            start_row = current_page * self.table_model.page_size + 1
            end_row = min((current_page + 1) * self.table_model.page_size, total_rows)
            self.page_info_label.setText(
                f"Page {current_page + 1} of {total_pages} "
                f"(Rows {start_row}-{end_row} of {total_rows})"
            )
        else:
            self.page_info_label.setText("No data")
    
    def _previous_page(self):
        """Navigate to previous page."""
        if self.table_model and self.table_model.previous_page():
            self._update_pagination_controls()
    
    def _next_page(self):
        """Navigate to next page."""
        if self.table_model and self.table_model.next_page():
            self._update_pagination_controls()
    
    def _on_page_size_changed(self, value: int):
        """Handle page size change."""
        if self.table_model:
            self.table_model.page_size = value
            self.table_model.current_page = 0
            self.table_model.layoutChanged.emit()
            self._update_pagination_controls()
    
    def _on_search_changed(self, text: str):
        """Handle search text change - global search across all columns."""
        if not self.table_model:
            return
        
        # Set global search filter
        if text.strip():
            self.table_model.set_filter("_global_search", text.strip())
        else:
            # Clear global search filter only
            if "_global_search" in self.table_model._filters:
                del self.table_model._filters["_global_search"]
                self.table_model.current_page = 0
                self.table_model._update_filtered_data()
                self.table_model.layoutChanged.emit()
        
        self._update_pagination_controls()
        
        # Update charts with filtered data
        if self.current_data is not None and self.table_model:
            filtered_df = self.table_model.get_filtered_dataframe()
            self.charts_tab.update_data(filtered_df)
    
    def _export_csv(self):
        """Export current data to CSV."""
        if self.current_data is None or self.current_data.empty:
            QMessageBox.warning(self, "Export", "No data to export")
            return
        
        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Export to CSV",
            "",
            "CSV Files (*.csv);;All Files (*)"
        )
        
        if file_path:
            try:
                # Export filtered data if filters are active, otherwise all data
                if self.table_model:
                    export_df = self.table_model.get_filtered_dataframe()
                else:
                    export_df = self.current_data
                
                export_df.to_csv(file_path, index=False)
                QMessageBox.information(
                    self,
                    "Export Successful",
                    f"Exported {len(export_df)} variants to {file_path}"
                )
            except Exception as e:
                QMessageBox.critical(self, "Export Error", f"Failed to export: {e}")
    
    def _export_json(self):
        """Export current data to JSON."""
        if self.current_data is None or self.current_data.empty:
            QMessageBox.warning(self, "Export", "No data to export")
            return
        
        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Export to JSON",
            "",
            "JSON Files (*.json);;All Files (*)"
        )
        
        if file_path:
            try:
                # Export filtered data if filters are active, otherwise all data
                if self.table_model:
                    export_df = self.table_model.get_filtered_dataframe()
                else:
                    export_df = self.current_data
                
                # Convert to records format
                export_df.to_json(file_path, orient='records', indent=2)
                QMessageBox.information(
                    self,
                    "Export Successful",
                    f"Exported {len(export_df)} variants to {file_path}"
                )
            except Exception as e:
                QMessageBox.critical(self, "Export Error", f"Failed to export: {e}")
    
    def _toggle_filters(self, checked: bool):
        """Toggle filter panel visibility."""
        if self.filter_container:
            self.filter_container.setVisible(checked)
            self.filter_toggle_btn.setText("Hide Filters" if checked else "Show Filters")
    
    def _on_filters_changed(self):
        """Handle filter changes from filter panel."""
        if self.filter_panel and self.table_model:
            filters = self.filter_panel.get_filters()
            self.table_model.set_filters(filters)
            self._update_pagination_controls()
            
            # Update charts with filtered data
            if self.current_data is not None:
                filtered_df = self.table_model.get_filtered_dataframe()
                self.charts_tab.update_data(filtered_df)


class TextEditLogHandler(logging.Handler):
    """Log handler that writes to QTextEdit widget."""
    
    def __init__(self, text_edit):
        super().__init__()
        self.text_edit = text_edit
    
    def emit(self, record):
        """Emit log record to text edit."""
        msg = self.format(record)
        self.text_edit.append(msg)


def run_gui():
    """Run GUI application."""
    app = QApplication(sys.argv)
    
    window = MainWindow()
    window.show()
    
    sys.exit(app.exec())


if __name__ == "__main__":
    run_gui()

