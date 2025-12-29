#!/usr/bin/env python3
"""
ULTIMATE VIBECODER
Combines all enhancements into one unified system

Features:
- RAG (codebase knowledge)
- Persistent Memory
- Multi-Modal Vision
- MoE Routing
- Enhanced Context
"""

from pathlib import Path
import sys
import subprocess

# Add subdirectories to path
sys.path.insert(0, str(Path(__file__).parent))

class UltimateVibecoder:
    """
    The complete vibecoder system with all enhancements
    """

    def __init__(self, enable_memory=True, enable_rag=True):
        self.enable_memory = enable_memory
        self.enable_rag = enable_rag

        print("🎮 Ultimate Vibecoder Initializing...")
        print("=" * 80)

        # Initialize memory system
        self.memory = None
        if enable_memory:
            try:
                from memory.vibecoder_memory import VibecoderMemory
                self.memory = VibecoderMemory()
                print("✅ Persistent Memory (Learns from all interactions)")
            except Exception as e:
                print(f"⚠️  Memory system unavailable: {e}")
                print("   Install: pip install mem0ai pyyaml")

        # Initialize RAG system
        self.rag_available = False
        if enable_rag:
            try:
                from rag.query_rag import get_rag_context
                self.get_rag_context = get_rag_context
                rag_db = Path(__file__).parent / "rag" / "rag-db"
                if rag_db.exists():
                    self.rag_available = True
                    print("✅ RAG System (Codebase Knowledge)")
                else:
                    print("⚠️  RAG database not found - run: python rag/index-codebase.py")
            except Exception as e:
                print(f"⚠️  RAG system unavailable: {e}")

        # Initialize MoE router
        self.router = None
        try:
            from moe.router import ExpertRouter
            self.router = ExpertRouter()
        except Exception as e:
            print(f"⚠️  MoE router unavailable: {e}")

        print("=" * 80)
        print()

    def process(self, task: str, mode: str = 'auto', use_rag: bool = None, use_memory: bool = None) -> str:
        """
        Process a task with enhancement stack

        Modes:
        - 'auto': Intelligent routing (default)
        - 'code': Force code model
        - 'reasoning': Force reasoning model
        - 'vision': Force vision model
        - 'consensus': Multi-expert consensus
        """

        if use_rag is None:
            use_rag = self.enable_rag
        if use_memory is None:
            use_memory = self.enable_memory

        print(f"\n🎯 Task: {task[:100]}{'...' if len(task) > 100 else ''}")
        print(f"📋 Mode: {mode}")
        print()

        # Step 1: Retrieve relevant memories
        memory_context = ""
        if use_memory and self.memory:
            print("💭 Recalling relevant context...")
            try:
                memories = self.memory.recall(task, limit=3)
                if memories:
                    print(f"   Found {len(memories)} relevant memories")
                    memory_context = "# Previous relevant context:\n"
                    memory_context += "\n".join(f"- {m}" for m in memories)
                    memory_context += "\n\n"
            except Exception as e:
                print(f"   ⚠️  Memory recall failed: {e}")

        # Step 2: Search codebase with RAG (if relevant)
        rag_context = ""
        if use_rag and self.rag_available:
            # Use RAG for questions about existing code
            if any(word in task.lower() for word in ['how', 'where', 'find', 'exists', 'current', 'show me']):
                print("🔍 Searching codebase...")
                try:
                    rag_context = self.get_rag_context(task, n_results=3)
                    if rag_context:
                        print("   Found relevant code")
                except Exception as e:
                    print(f"   ⚠️  RAG search failed: {e}")

        # Step 3: Build enhanced prompt
        enhanced_task = ""
        if memory_context:
            enhanced_task += memory_context
        if rag_context:
            enhanced_task += rag_context
        enhanced_task += f"# Current task:\n{task}"

        # Step 4: Execute with appropriate model
        result = ""

        if mode == 'consensus' and self.router:
            print("🤝 Using multi-expert consensus...")
            result = self.router.multi_expert_consensus(enhanced_task)

        elif self.router:
            # Auto-routing or specific model
            model = None
            if mode == 'code':
                model = self.router.experts['code']
            elif mode == 'reasoning':
                model = self.router.experts['reasoning']
            elif mode == 'vision':
                model = self.router.experts['vision']

            result = self.router.execute(enhanced_task, model=model)

        else:
            # Fallback to direct vibecoder call
            print("🎮 Using vibecoder...")
            try:
                proc = subprocess.run(
                    ['ollama', 'run', 'vibecoder', enhanced_task],
                    capture_output=True,
                    text=True,
                    timeout=180
                )
                result = proc.stdout
            except Exception as e:
                print(f"❌ Error: {e}")
                return ""

        # Step 5: Store interaction in memory
        if use_memory and self.memory and result:
            try:
                self.memory.add_interaction(task, result)
            except Exception as e:
                print(f"\n⚠️  Failed to store memory: {e}")

        return result

# CLI Usage
if __name__ == "__main__":
    print("🎮 Ultimate Vibecoder")
    print("=" * 80)
    print()

    # Check if RAG and memory are set up
    rag_ready = (Path(__file__).parent / "rag" / "rag-db").exists()
    memory_ready = True  # We'll try to initialize

    if not rag_ready:
        print("💡 Tip: Set up RAG for codebase knowledge")
        print("   cd rag && pip install -r requirements.txt && python index-codebase.py")
        print()

    # Initialize
    vibecoder = UltimateVibecoder(
        enable_memory=memory_ready,
        enable_rag=rag_ready
    )

    # Interactive REPL
    if len(sys.argv) == 1:
        print("Interactive Mode")
        print()
        print("Commands:")
        print("  /auto     - Auto-routing mode (default)")
        print("  /code     - Force code model")
        print("  /reasoning - Force reasoning model")
        print("  /consensus - Multi-expert consensus")
        print("  /rag      - Toggle RAG (currently: {})".format("ON" if vibecoder.enable_rag else "OFF"))
        print("  /memory   - Toggle memory (currently: {})".format("ON" if vibecoder.enable_memory else "OFF"))
        print("  /exit     - Exit")
        print()

        mode = 'auto'

        while True:
            try:
                user_input = input(f"\n[{mode}] You: ")

                if user_input.lower() in ['/exit', '/quit']:
                    print("\n👋 Session ended")
                    break

                # Mode switching
                if user_input.startswith('/'):
                    cmd = user_input.lower()
                    if cmd == '/auto':
                        mode = 'auto'
                        print("Switched to auto mode")
                        continue
                    elif cmd == '/code':
                        mode = 'code'
                        print("Switched to code mode")
                        continue
                    elif cmd == '/reasoning':
                        mode = 'reasoning'
                        print("Switched to reasoning mode")
                        continue
                    elif cmd == '/consensus':
                        mode = 'consensus'
                        print("Switched to consensus mode")
                        continue
                    elif cmd == '/rag':
                        vibecoder.enable_rag = not vibecoder.enable_rag
                        print(f"RAG: {'ON' if vibecoder.enable_rag else 'OFF'}")
                        continue
                    elif cmd == '/memory':
                        vibecoder.enable_memory = not vibecoder.enable_memory
                        print(f"Memory: {'ON' if vibecoder.enable_memory else 'OFF'}")
                        continue

                if not user_input.strip():
                    continue

                # Process task
                result = vibecoder.process(user_input, mode=mode)

                print()
                print("=" * 80)
                print("Vibecoder:")
                print("=" * 80)
                print(result)

            except KeyboardInterrupt:
                print("\n\n👋 Session ended")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}\n")

    else:
        # Single command mode
        task = " ".join(sys.argv[1:])
        result = vibecoder.process(task)

        print()
        print("=" * 80)
        print("Result:")
        print("=" * 80)
        print(result)
