"""
Data visualization widgets for variant data.

Provides charts for frequency distributions, significance breakdowns, etc.
"""

import pandas as pd
import matplotlib
# Use QtAgg backend which works with both Qt5 and Qt6
matplotlib.use('QtAgg')
from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
from PyQt6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QComboBox
from PyQt6.QtCore import Qt
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class FrequencyHistogramWidget(QWidget):
    """Histogram widget for population frequency distribution."""
    
    def __init__(self):
        super().__init__()
        self.figure = Figure(figsize=(10, 6))
        self.canvas = FigureCanvas(self.figure)
        self.ax = None
        self._setup_ui()
    
    def _setup_ui(self):
        """Setup widget UI."""
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        
        title = QLabel("Population Frequency Distribution")
        title.setStyleSheet("font-weight: bold; font-size: 12pt;")
        layout.addWidget(title)
        
        layout.addWidget(self.canvas)
        self.setLayout(layout)
    
    def update_data(self, df: pd.DataFrame):
        """Update histogram with new data."""
        if df.empty or 'population_frequency' not in df.columns:
            self._clear_chart()
            return
        
        # Filter out None/NaN frequencies
        frequencies = df['population_frequency'].dropna()
        
        if len(frequencies) == 0:
            self._clear_chart()
            return
        
        self.figure.clear()
        self.ax = self.figure.add_subplot(111)
        
        # Create histogram
        self.ax.hist(frequencies, bins=50, edgecolor='black', alpha=0.7)
        self.ax.set_xlabel('Population Frequency')
        self.ax.set_ylabel('Number of Variants')
        self.ax.set_title('Distribution of Allele Frequencies')
        self.ax.grid(True, alpha=0.3)
        
        self.canvas.draw()
        logger.debug(f"Updated frequency histogram with {len(frequencies)} data points")
    
    def _clear_chart(self):
        """Clear the chart."""
        self.figure.clear()
        self.canvas.draw()


class SignificanceBreakdownWidget(QWidget):
    """Chart widget for clinical significance breakdown."""
    
    def __init__(self):
        super().__init__()
        self.figure = Figure(figsize=(10, 6))
        self.canvas = FigureCanvas(self.figure)
        self.ax = None
        self._setup_ui()
    
    def _setup_ui(self):
        """Setup widget UI."""
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        
        title = QLabel("Clinical Significance Breakdown")
        title.setStyleSheet("font-weight: bold; font-size: 12pt;")
        layout.addWidget(title)
        
        layout.addWidget(self.canvas)
        self.setLayout(layout)
    
    def update_data(self, df: pd.DataFrame):
        """Update chart with new data."""
        if df.empty or 'clinical_significance' not in df.columns:
            self._clear_chart()
            return
        
        # Count significance categories
        significance = df['clinical_significance'].fillna('Not annotated')
        significance = significance.replace('', 'Not annotated')
        
        # Get counts
        counts = significance.value_counts()
        
        if len(counts) == 0:
            self._clear_chart()
            return
        
        self.figure.clear()
        self.ax = self.figure.add_subplot(111)
        
        # Create bar chart
        counts.plot(kind='bar', ax=self.ax, color='steelblue', edgecolor='black')
        self.ax.set_xlabel('Clinical Significance')
        self.ax.set_ylabel('Number of Variants')
        self.ax.set_title('Variants by Clinical Significance')
        self.ax.tick_params(axis='x', rotation=45)
        self.ax.grid(True, alpha=0.3, axis='y')
        
        # Add value labels on bars
        for i, v in enumerate(counts):
            self.ax.text(i, v, str(v), ha='center', va='bottom')
        
        self.figure.tight_layout()
        self.canvas.draw()
        logger.debug(f"Updated significance breakdown with {len(counts)} categories")
    
    def _clear_chart(self):
        """Clear the chart."""
        self.figure.clear()
        self.canvas.draw()


class ChromosomeDistributionWidget(QWidget):
    """Chart widget for variant distribution by chromosome."""
    
    def __init__(self):
        super().__init__()
        self.figure = Figure(figsize=(10, 6))
        self.canvas = FigureCanvas(self.figure)
        self.ax = None
        self._setup_ui()
    
    def _setup_ui(self):
        """Setup widget UI."""
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        
        title = QLabel("Variants by Chromosome")
        title.setStyleSheet("font-weight: bold; font-size: 12pt;")
        layout.addWidget(title)
        
        layout.addWidget(self.canvas)
        self.setLayout(layout)
    
    def update_data(self, df: pd.DataFrame):
        """Update chart with new data."""
        if df.empty or 'chrom' not in df.columns:
            self._clear_chart()
            return
        
        # Count variants per chromosome
        chrom = df['chrom'].fillna('Unknown')
        chrom = chrom.replace('', 'Unknown')
        
        counts = chrom.value_counts().sort_index()
        
        if len(counts) == 0:
            self._clear_chart()
            return
        
        self.figure.clear()
        self.ax = self.figure.add_subplot(111)
        
        # Create bar chart
        counts.plot(kind='bar', ax=self.ax, color='coral', edgecolor='black')
        self.ax.set_xlabel('Chromosome')
        self.ax.set_ylabel('Number of Variants')
        self.ax.set_title('Variant Distribution by Chromosome')
        self.ax.tick_params(axis='x', rotation=45)
        self.ax.grid(True, alpha=0.3, axis='y')
        
        # Add value labels on bars
        for i, v in enumerate(counts):
            self.ax.text(i, v, str(v), ha='center', va='bottom')
        
        self.figure.tight_layout()
        self.canvas.draw()
        logger.debug(f"Updated chromosome distribution with {len(counts)} chromosomes")
    
    def _clear_chart(self):
        """Clear the chart."""
        self.figure.clear()
        self.canvas.draw()


class ChartsTabWidget(QWidget):
    """Tab widget containing all chart visualizations."""
    
    def __init__(self):
        super().__init__()
        self.current_df: Optional[pd.DataFrame] = None
        self._setup_ui()
    
    def _setup_ui(self):
        """Setup charts tab UI."""
        layout = QVBoxLayout()
        layout.setContentsMargins(10, 10, 10, 10)
        
        # Chart widgets
        self.freq_hist = FrequencyHistogramWidget()
        self.sig_breakdown = SignificanceBreakdownWidget()
        self.chrom_dist = ChromosomeDistributionWidget()
        
        layout.addWidget(self.freq_hist)
        layout.addWidget(self.sig_breakdown)
        layout.addWidget(self.chrom_dist)
        
        layout.addStretch()
        self.setLayout(layout)
    
    def update_data(self, df: pd.DataFrame):
        """Update all charts with new data."""
        self.current_df = df.copy()
        self.freq_hist.update_data(df)
        self.sig_breakdown.update_data(df)
        self.chrom_dist.update_data(df)
        logger.info(f"Updated all charts with {len(df)} variants")

