#!/usr/bin/env python3
"""
Index your entire codebase for instant RAG retrieval
Gives vibecoder instant access to all your code patterns
"""

from pathlib import Path
import chromadb
from chromadb.utils import embedding_functions
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json
import sys

# Configuration
WORKSPACE_PATH = Path(__file__).parent.parent.parent
PERSIST_DIR = Path(__file__).parent / "rag-db"
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"

# File extensions to index
CODE_EXTENSIONS = {
    '.ts', '.tsx', '.js', '.jsx', '.py', '.md', '.json',
    '.yaml', '.yml', '.toml', '.sh', '.bat', '.css', '.html',
    '.c', '.cpp', '.h', '.rs', '.go', '.java', '.cs'
}

# Directories to skip
SKIP_DIRS = {
    'node_modules', '.git', 'dist', 'build', 'rag-db',
    '__pycache__', '.next', '.cache', 'venv', 'env',
    'target', 'out', '.vscode', '.idea'
}

def index_codebase(verbose=True):
    """Index all code files in the workspace"""

    if verbose:
        print("🎮 Vibecoder RAG Indexer")
        print("=" * 80)
        print(f"Workspace: {WORKSPACE_PATH}")
        print(f"Database: {PERSIST_DIR}")
        print()

    # Initialize ChromaDB
    client = chromadb.PersistentClient(path=str(PERSIST_DIR))

    # Use local embedding model
    embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    # Create or get collection
    try:
        client.delete_collection(name="vibecoding_codebase")
    except:
        pass

    collection = client.create_collection(
        name="vibecoding_codebase",
        embedding_function=embedding_fn,
        metadata={"description": "Full vibecoding workspace"}
    )

    # Text splitter for chunking
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )

    # Collect all code files
    files_indexed = 0
    chunks_total = 0
    errors = []

    for file_path in WORKSPACE_PATH.rglob("*"):
        # Skip non-code files and ignored directories
        if not file_path.is_file():
            continue

        if file_path.suffix not in CODE_EXTENSIONS:
            continue

        if any(part in str(file_path) for part in SKIP_DIRS):
            continue

        try:
            content = file_path.read_text(encoding='utf-8')

            # Split into chunks
            chunks = splitter.split_text(content)

            # Add to vector store
            for i, chunk in enumerate(chunks):
                collection.add(
                    documents=[chunk],
                    metadatas=[{
                        "source": str(file_path.relative_to(WORKSPACE_PATH)),
                        "chunk_id": i,
                        "file_type": file_path.suffix,
                        "total_chunks": len(chunks)
                    }],
                    ids=[f"{file_path.stem}_{file_path.suffix}_{i}_{files_indexed}"]
                )
                chunks_total += 1

            files_indexed += 1

            if verbose and files_indexed % 10 == 0:
                print(f"📚 Indexed {files_indexed} files ({chunks_total} chunks)...")

        except Exception as e:
            errors.append(f"{file_path}: {str(e)[:50]}")
            if verbose and len(errors) < 5:
                print(f"⚠️  Skipped {file_path.name}: {str(e)[:50]}")

    if verbose:
        print()
        print("=" * 80)
        print("✅ Indexing complete!")
        print(f"   Files: {files_indexed}")
        print(f"   Chunks: {chunks_total}")
        print(f"   Errors: {len(errors)}")
        print(f"   Storage: {PERSIST_DIR}")
        print()
        print("🚀 Your vibecoder now has instant access to your entire codebase!")
        print()
        print("Usage:")
        print("  python query-rag.py 'How is player movement implemented?'")
        print("=" * 80)

    return {
        'files_indexed': files_indexed,
        'chunks_total': chunks_total,
        'errors': errors
    }

if __name__ == "__main__":
    try:
        result = index_codebase(verbose=True)
    except KeyboardInterrupt:
        print("\n\n❌ Indexing cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        sys.exit(1)
