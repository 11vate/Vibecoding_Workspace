#!/usr/bin/env python3
"""
Persistent memory system for vibecoder using Mem0
Vibecoder remembers everything across all sessions
"""

from mem0 import Memory
import yaml
from pathlib import Path
import subprocess
import sys

CONFIG_PATH = Path(__file__).parent / "memory-config.yaml"

class VibecoderMemory:
    """Persistent memory for vibecoder"""

    def __init__(self):
        if not CONFIG_PATH.exists():
            print("❌ Memory config not found!")
            print(f"   Expected: {CONFIG_PATH}")
            sys.exit(1)

        with open(CONFIG_PATH) as f:
            config = yaml.safe_load(f)

        try:
            self.memory = Memory.from_config(config)
            self.user_id = "vibecoder_user"
            print("✅ Memory system initialized")
        except Exception as e:
            print(f"❌ Failed to initialize memory: {e}")
            print("   Make sure Ollama is running and nomic-embed-text is available")
            print("   Run: ollama pull nomic-embed-text")
            sys.exit(1)

    def add_interaction(self, user_message: str, assistant_message: str):
        """Store conversation in memory"""
        messages = [
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": assistant_message}
        ]

        try:
            self.memory.add(messages, user_id=self.user_id)
            print(f"💾 Stored interaction in memory")
        except Exception as e:
            print(f"⚠️  Failed to store memory: {e}")

    def recall(self, query: str, limit: int = 5):
        """Retrieve relevant memories"""
        try:
            memories = self.memory.search(
                query=query,
                user_id=self.user_id,
                limit=limit
            )

            return [mem['memory'] for mem in memories]
        except Exception as e:
            print(f"⚠️  Failed to recall memories: {e}")
            return []

    def get_all_memories(self):
        """Get all stored memories"""
        try:
            return self.memory.get_all(user_id=self.user_id)
        except Exception as e:
            print(f"⚠️  Failed to get memories: {e}")
            return []

    def summarize_session(self):
        """Get summary of current session"""
        all_memories = self.get_all_memories()

        if not all_memories:
            return {
                'total_memories': 0,
                'code_patterns': [],
                'preferences': []
            }

        # Analyze patterns
        code_patterns = []
        preferences = []

        for mem in all_memories:
            content = mem.get('memory', '').lower()
            if 'prefer' in content or 'like' in content:
                preferences.append(mem['memory'])
            if 'pattern' in content or 'always' in content:
                code_patterns.append(mem['memory'])

        return {
            'total_memories': len(all_memories),
            'code_patterns': code_patterns[:5],  # Top 5
            'preferences': preferences[:5]
        }

def chat_with_memory(user_input: str, memory_system: VibecoderMemory = None) -> str:
    """Chat with vibecoder using persistent memory"""

    if memory_system is None:
        memory_system = VibecoderMemory()

    # Recall relevant memories
    print("\n💭 Recalling relevant context...")
    context_memories = memory_system.recall(user_input, limit=3)

    if context_memories:
        print(f"   Found {len(context_memories)} relevant memories")

    # Build enhanced prompt
    enhanced_prompt = f"""Previous relevant context from our conversations:
{chr(10).join('- ' + m for m in context_memories) if context_memories else '(No previous context)'}

Current request:
{user_input}
"""

    print("\n🎮 Asking vibecoder...")

    # Call Ollama
    try:
        result = subprocess.run(
            ['ollama', 'run', 'vibecoder', enhanced_prompt],
            capture_output=True,
            text=True,
            timeout=120
        )

        response = result.stdout

        # Store interaction
        memory_system.add_interaction(user_input, response)

        return response

    except subprocess.TimeoutExpired:
        print("❌ Vibecoder timed out (120s)")
        return ""
    except Exception as e:
        print(f"❌ Error calling vibecoder: {e}")
        return ""

# Interactive loop
if __name__ == "__main__":
    print("🎮 Vibecoder with Persistent Memory")
    print("=" * 80)
    print("✅ Every conversation is remembered")
    print("✅ Learns your patterns over time")
    print("✅ Gets smarter with each interaction")
    print("=" * 80)
    print()

    memory_system = VibecoderMemory()

    # Show session summary
    summary = memory_system.summarize_session()
    print(f"📊 Memory Statistics:")
    print(f"   Total memories: {summary['total_memories']}")
    if summary['code_patterns']:
        print(f"   Code patterns learned: {len(summary['code_patterns'])}")
    if summary['preferences']:
        print(f"   User preferences: {len(summary['preferences'])}")
    print()
    print("Commands: /summary, /exit")
    print()

    while True:
        try:
            user_input = input("You: ")

            if user_input.lower() in ['exit', 'quit', '/exit']:
                print("\n👋 Session ended. All memories saved.")
                break

            if user_input.lower() == '/summary':
                summary = memory_system.summarize_session()
                print(f"\n📊 Memory Summary:")
                print(f"   Total: {summary['total_memories']} memories")
                print(f"   Patterns: {len(summary['code_patterns'])}")
                print(f"   Preferences: {len(summary['preferences'])}")
                continue

            if not user_input.strip():
                continue

            response = chat_with_memory(user_input, memory_system)
            print(f"\nVibecoder: {response}\n")

        except KeyboardInterrupt:
            print("\n\n👋 Session ended. All memories saved.")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}\n")
