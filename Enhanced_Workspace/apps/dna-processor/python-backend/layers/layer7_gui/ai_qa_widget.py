"""
AI Q&A Interface Widget

Provides chat-style interface for asking questions about variant data.
"""

import logging
from typing import Optional, List, Dict
import pandas as pd
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QTextEdit, QLineEdit,
    QPushButton, QLabel, QScrollArea
)
from PyQt6.QtCore import QThread, pyqtSignal, Qt
from PyQt6.QtGui import QTextCharFormat, QColor

from layers.layer6_ai.interpreter import AIInterpreter
from config.settings import AI_ENABLED, AI_PROVIDER

logger = logging.getLogger(__name__)


class AIQAResponseWorker(QThread):
    """Worker thread for generating AI responses."""
    
    response_ready = pyqtSignal(str, bool)  # message, is_user
    
    def __init__(self, question: str, context_df: pd.DataFrame, ai_interpreter: AIInterpreter):
        super().__init__()
        self.question = question
        self.context_df = context_df
        self.ai_interpreter = ai_interpreter
    
    def run(self):
        """Generate AI response in background."""
        try:
            # Build context from DataFrame
            context = self._build_context()
            
            # Generate response (simplified - in real implementation, would use question + context)
            # For now, we'll use the AI interpreter to summarize the variants as context
            response = self._generate_response(self.question, context)
            
            self.response_ready.emit(response, False)
            
        except Exception as e:
            logger.error(f"AI Q&A error: {e}", exc_info=True)
            self.response_ready.emit(
                f"Error generating response: {str(e)}\n\nNote: AI Q&A requires API key configuration.",
                False
            )
    
    def _build_context(self) -> str:
        """Build context string from DataFrame."""
        if self.context_df.empty:
            return "No variant data available."
        
        # Summarize the data
        total = len(self.context_df)
        sig_count = len(self.context_df[self.context_df['clinical_significance'].notna() & 
                                       (self.context_df['clinical_significance'] != '')])
        
        context = f"Analyzing {total} variants, {sig_count} with clinical significance data.\n\n"
        
        # Add sample of significant variants
        sig_variants = self.context_df[
            self.context_df['clinical_significance'].notna() & 
            (self.context_df['clinical_significance'] != '')
        ].head(10)
        
        if not sig_variants.empty:
            context += "Sample of significant variants:\n"
            for _, row in sig_variants.iterrows():
                rsid = row.get('rsid', '')
                sig = row.get('clinical_significance', '')
                context += f"- {rsid}: {sig}\n"
        
        return context
    
    def _generate_response(self, question: str, context: str) -> str:
        """Generate AI response to question."""
        if not self.ai_interpreter.enabled:
            return (
                "AI Q&A is not enabled. Please configure an API key in settings.\n\n"
                "Example questions you can ask:\n"
                "- Which variants are most significant?\n"
                "- What phenotypes are associated with these variants?\n"
                "- How many variants have clinical significance?"
            )
        
        # Simplified response generation
        # In a full implementation, this would use the AI provider's chat/completion API
        # with the question and context
        
        response = f"[AI Response - Placeholder]\n\n"
        response += f"Question: {question}\n\n"
        response += f"Context: {context}\n\n"
        response += "Note: Full AI Q&A integration requires provider-specific chat API implementation."
        response += " The AI interpreter is configured and ready for summarization tasks."
        
        return response


class AIQAWidget(QWidget):
    """Widget for AI Q&A interface."""
    
    def __init__(self, ai_interpreter: Optional[AIInterpreter] = None):
        super().__init__()
        self.ai_interpreter = ai_interpreter or AIInterpreter()
        self.conversation_history: List[Dict[str, str]] = []
        self.current_context_df: Optional[pd.DataFrame] = None
        self.response_worker: Optional[AIQAResponseWorker] = None
        
        self._setup_ui()
    
    def _setup_ui(self):
        """Setup AI Q&A widget UI."""
        layout = QVBoxLayout()
        layout.setContentsMargins(5, 5, 5, 5)
        
        # Title
        title = QLabel("AI Q&A - Ask Questions About Your Variants")
        title.setStyleSheet("font-weight: bold; font-size: 12pt;")
        layout.addWidget(title)
        
        # Info label
        info_label = QLabel(
            "Note: Responses are interpretive and should not be used for medical decisions. "
            "Always verify information with qualified professionals."
        )
        info_label.setWordWrap(True)
        info_label.setStyleSheet("color: #666; font-style: italic;")
        layout.addWidget(info_label)
        
        # Conversation area
        self.conversation_area = QTextEdit()
        self.conversation_area.setReadOnly(True)
        self.conversation_area.setPlaceholderText("Ask a question about your variant data...")
        layout.addWidget(self.conversation_area)
        
        # Input area
        input_layout = QHBoxLayout()
        
        self.input_field = QLineEdit()
        self.input_field.setPlaceholderText("Ask a question... (e.g., 'Which variants are most significant?')")
        self.input_field.returnPressed.connect(self._send_question)
        input_layout.addWidget(self.input_field)
        
        self.send_button = QPushButton("Send")
        self.send_button.clicked.connect(self._send_question)
        self.send_button.setEnabled(self.ai_interpreter.enabled)
        input_layout.addWidget(self.send_button)
        
        layout.addLayout(input_layout)
        
        # Example questions
        examples_label = QLabel("Example questions:")
        examples_label.setStyleSheet("font-weight: bold;")
        layout.addWidget(examples_label)
        
        example_questions = [
            "Which variants are most clinically significant?",
            "What phenotypes are associated with these variants?",
            "How many variants have population frequency data?",
            "Show me variants with pathogenic significance"
        ]
        
        for example in example_questions:
            example_btn = QPushButton(example)
            example_btn.setFlat(True)
            example_btn.setStyleSheet("text-align: left; color: #0066cc;")
            example_btn.clicked.connect(lambda checked, q=example: self._set_question(q))
            layout.addWidget(example_btn)
        
        self.setLayout(layout)
        
        # Add welcome message
        if self.ai_interpreter.enabled:
            self._add_message(
                "AI Assistant",
                "Hello! I can help you explore your variant data. Ask me questions about clinical significance, phenotypes, or any other aspect of your variants.",
                is_user=False
            )
        else:
            self._add_message(
                "System",
                "AI Q&A is not enabled. Please configure an API key in the settings to use this feature.",
                is_user=False
            )
    
    def _set_question(self, question: str):
        """Set question in input field."""
        self.input_field.setText(question)
        self.input_field.setFocus()
    
    def _send_question(self):
        """Send question to AI."""
        question = self.input_field.text().strip()
        if not question:
            return
        
        if self.current_context_df is None or self.current_context_df.empty:
            self._add_message(
                "System",
                "No variant data available. Please process a file first.",
                is_user=False
            )
            return
        
        # Disable input while processing
        self.input_field.setEnabled(False)
        self.send_button.setEnabled(False)
        
        # Add user message
        self._add_message("You", question, is_user=True)
        self.input_field.clear()
        
        # Start worker thread
        context_df = self.current_context_df if self.current_context_df is not None else pd.DataFrame()
        self.response_worker = AIQAResponseWorker(question, context_df, self.ai_interpreter)
        self.response_worker.response_ready.connect(self._on_response_ready)
        self.response_worker.finished.connect(lambda: self._on_worker_finished())
        self.response_worker.start()
    
    def _on_response_ready(self, response: str, is_user: bool):
        """Handle AI response."""
        self._add_message("AI Assistant", response, is_user=False)
    
    def _on_worker_finished(self):
        """Handle worker thread completion."""
        self.input_field.setEnabled(True)
        self.send_button.setEnabled(self.ai_interpreter.enabled)
    
    def _add_message(self, sender: str, message: str, is_user: bool = False):
        """Add message to conversation."""
        # Format message
        if is_user:
            formatted = f"<b>{sender}:</b> {message}<br><br>"
            color = QColor(0, 100, 200)
        else:
            formatted = f"<b>{sender}:</b> {message}<br><br>"
            color = QColor(50, 50, 50)
        
        # Add to conversation area
        self.conversation_area.append(formatted)
        
        # Scroll to bottom
        scrollbar = self.conversation_area.verticalScrollBar()
        scrollbar.setValue(scrollbar.maximum())
        
        # Store in history
        self.conversation_history.append({
            "sender": sender,
            "message": message,
            "is_user": is_user
        })
    
    def update_context(self, df: pd.DataFrame):
        """Update the context DataFrame for Q&A."""
        self.current_context_df = df.copy()
        logger.debug(f"Updated AI Q&A context with {len(df)} variants")
    
    def clear_conversation(self):
        """Clear conversation history."""
        self.conversation_area.clear()
        self.conversation_history = []
        self._add_message(
            "System",
            "Conversation cleared.",
            is_user=False
        )

