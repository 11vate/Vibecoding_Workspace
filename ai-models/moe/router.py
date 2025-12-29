#!/usr/bin/env python3
"""
Mixture of Experts router for vibecoder
Automatically selects the best model for each task
"""

import subprocess
from typing import Dict, List
import sys

class ExpertRouter:
    """Route tasks to specialist models"""

    def __init__(self):
        self.experts = {
            'code': 'vibecoder',              # TypeScript/game code
            'reasoning': 'qwen2.5:32b',       # Architecture decisions (if available)
            'vision': 'minicpm-v',            # Screenshots/diagrams
            'general': 'qwen2.5-coder:7b',    # General tasks
            'math': 'qwen2.5-coder:7b',       # Game math/physics (fallback to code)
        }

        # Check which models are available
        self.available_models = self._check_available_models()

        print(f"🎯 Expert Router Initialized")
        print(f"   Available models: {len(self.available_models)}")
        for expert, model in self.experts.items():
            status = "✅" if model in self.available_models else "❌"
            print(f"   {status} {expert}: {model}")
        print()

    def _check_available_models(self) -> List[str]:
        """Check which Ollama models are installed"""
        try:
            result = subprocess.run(
                ['ollama', 'list'],
                capture_output=True,
                text=True
            )

            models = []
            for line in result.stdout.split('\n')[1:]:  # Skip header
                if line.strip():
                    model_name = line.split()[0]
                    models.append(model_name)

            return models

        except Exception as e:
            print(f"⚠️  Failed to check available models: {e}")
            return []

    def route(self, task: str, context: Dict = None) -> str:
        """Determine which expert to use"""

        task_lower = task.lower()

        # Vision tasks
        if any(word in task_lower for word in ['screenshot', 'image', 'diagram', 'mockup', 'pixel art']):
            return self.experts['vision'] if self.experts['vision'] in self.available_models else self.experts['code']

        # Math/physics tasks
        if any(word in task_lower for word in ['calculate', 'physics', 'collision', 'trajectory', 'math']):
            return self.experts['math']

        # Architecture/reasoning tasks
        if any(word in task_lower for word in ['design', 'architecture', 'should i', 'which approach', 'compare']):
            # Use reasoning model if available, otherwise fallback to code
            reasoning_model = self.experts['reasoning']
            return reasoning_model if reasoning_model in self.available_models else self.experts['code']

        # Code generation (default for vibecoding)
        if any(word in task_lower for word in ['create', 'implement', 'add', 'build', 'refactor', 'fix']):
            return self.experts['code']

        # General fallback
        return self.experts['general'] if self.experts['general'] in self.available_models else self.experts['code']

    def execute(self, task: str, model: str = None) -> str:
        """Execute task with appropriate expert"""

        if model is None:
            model = self.route(task)

        print(f"🎯 Routing to expert: {model}")
        print(f"📝 Task: {task[:100]}...")
        print()

        try:
            result = subprocess.run(
                ['ollama', 'run', model, task],
                capture_output=True,
                text=True,
                timeout=180
            )

            return result.stdout

        except subprocess.TimeoutExpired:
            print(f"❌ Model {model} timed out (180s)")
            return ""
        except Exception as e:
            print(f"❌ Error executing task: {e}")
            return ""

    def multi_expert_consensus(self, task: str, experts: List[str] = None) -> str:
        """Get consensus from multiple experts"""

        if experts is None:
            # Use code + reasoning by default
            experts = [self.experts['code']]
            if self.experts['reasoning'] in self.available_models:
                experts.append(self.experts['reasoning'])

        print(f"🤝 Consulting {len(experts)} experts...")
        print()

        responses = []
        for i, expert in enumerate(experts):
            print(f"📡 Asking expert {i+1}/{len(experts)}: {expert}")
            response = self.execute(task, model=expert)
            responses.append(response)
            print()

        if len(responses) == 1:
            return responses[0]

        # Synthesis prompt
        synthesis_task = f"""Multiple experts provided solutions to: {task}

Expert 1 ({experts[0]}):
{responses[0][:2000]}

Expert 2 ({experts[1]}):
{responses[1][:2000]}

Synthesize the BEST solution combining their insights:
- Take the best ideas from each
- Resolve any conflicts
- Provide a single, superior implementation
"""

        print("🔄 Synthesizing responses...")
        final = self.execute(synthesis_task, model=self.experts['code'])

        return final

# CLI Usage
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Vibecoder MoE Router")
        print("=" * 80)
        print()
        print("Usage:")
        print("  python router.py 'Your task here'")
        print("  python router.py --consensus 'Complex task'")
        print()
        print("Examples:")
        print("  python router.py 'Create a player movement system'")
        print("  python router.py 'Should I use ECS or inheritance?'")
        print("  python router.py --consensus 'Design an inventory system'")
        print()
        sys.exit(1)

    router = ExpertRouter()

    # Check for consensus mode
    if sys.argv[1] == '--consensus':
        task = " ".join(sys.argv[2:])
        result = router.multi_expert_consensus(task)
    else:
        task = " ".join(sys.argv[1:])
        result = router.execute(task)

    print()
    print("=" * 80)
    print("Result:")
    print("=" * 80)
    print(result)
