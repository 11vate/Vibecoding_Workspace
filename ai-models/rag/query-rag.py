#!/usr/bin/env python3
"""
Query the RAG system for code retrieval
Instant access to your codebase knowledge
"""

import chromadb
from chromadb.utils import embedding_functions
from pathlib import Path
import sys

PERSIST_DIR = Path(__file__).parent / "rag-db"
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"

def query_codebase(question: str, n_results: int = 5, verbose: bool = True):
    """Query the indexed codebase"""

    if not PERSIST_DIR.exists():
        print("❌ RAG database not found!")
        print("   Run: python index-codebase.py first")
        return None

    try:
        client = chromadb.PersistentClient(path=str(PERSIST_DIR))
        embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=EMBEDDING_MODEL
        )

        collection = client.get_collection(
            name="vibecoding_codebase",
            embedding_function=embedding_fn
        )

        # Query with semantic search
        results = collection.query(
            query_texts=[question],
            n_results=n_results
        )

        if verbose:
            print(f"\n🔍 Query: {question}")
            print("=" * 80)

        retrieved_context = []

        for i, (doc, metadata, distance) in enumerate(zip(
            results['documents'][0],
            results['metadatas'][0],
            results['distances'][0]
        )):
            relevance = 1 - distance
            retrieved_context.append({
                'content': doc,
                'source': metadata['source'],
                'relevance': relevance
            })

            if verbose:
                print(f"\n📄 Result {i+1} (relevance: {relevance:.2%})")
                print(f"   File: {metadata['source']}")
                print(f"   Type: {metadata['file_type']}")
                print(f"\n{doc[:400]}...")
                print("-" * 80)

        return retrieved_context

    except Exception as e:
        print(f"❌ Error querying RAG: {e}")
        return None

def get_rag_context(question: str, n_results: int = 3) -> str:
    """Get RAG context as formatted string for LLM input"""

    results = query_codebase(question, n_results, verbose=False)

    if not results:
        return ""

    context = "# Relevant code from your codebase:\n\n"

    for i, result in enumerate(results):
        context += f"## Source {i+1}: {result['source']} (relevance: {result['relevance']:.1%})\n\n"
        context += f"```\n{result['content']}\n```\n\n"

    return context

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python query-rag.py 'your question here'")
        print()
        print("Examples:")
        print("  python query-rag.py 'How is player movement implemented?'")
        print("  python query-rag.py 'Where is the game state managed?'")
        print("  python query-rag.py 'How do I add a new enemy type?'")
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    results = query_codebase(query)

    if results:
        print(f"\n✅ Found {len(results)} relevant code sections")
        print("\n💡 Use this context when asking vibecoder for help!")
