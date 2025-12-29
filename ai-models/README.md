# AI Models - Custom Vibecoder

Create your own AI model that's specifically designed for vibecoding and better than generic models for your workspace.

## 🚀 Quick Setup (3 Commands)

### Windows

```cmd
cd C:\Users\11vat\OneDrive\Desktop\Ultimate_Cursor_Vibecoding_Workspace\ai-models
setup-vibecoder.bat
ollama run vibecoder
```

### macOS/Linux

```bash
cd ~/Ultimate_Cursor_Vibecoding_Workspace/ai-models
chmod +x setup-vibecoder.sh
./setup-vibecoder.sh
ollama run vibecoder
```

That's it! You now have a custom AI that:
- ✅ Always reasons through Design Intelligence Stack
- ✅ Follows vibecoding workspace patterns
- ✅ Knows Excalibur.js, Zustand, Vite, PWA
- ✅ Enforces quality standards (no magic numbers, strict types)
- ✅ Costs $0 forever

## 📁 Files in This Directory

| File | Purpose |
|------|---------|
| `Modelfile-vibecoder` | Custom model configuration with vibecoding patterns |
| `CREATE_CUSTOM_MODEL.md` | Complete guide for creating and fine-tuning models |
| `setup-vibecoder.sh` | Auto-setup script (macOS/Linux) |
| `setup-vibecoder.bat` | Auto-setup script (Windows) |
| `training-data/` | Training examples for fine-tuning (optional) |
| `README.md` | This file |

## 💡 Usage Examples

### Basic Usage

```bash
# Interactive mode - chat with your vibecoder
ollama run vibecoder

# One-shot generation
ollama run vibecoder "Create an enemy AI patrol system"

# Pipe output to file
ollama run vibecoder "Create a jump mechanic" > jump.ts
```

### Design Intelligence Stack Prompts

```bash
# The model will automatically reason through all layers
ollama run vibecoder "Design a coin collection system"

# Output includes:
# 1. Experience Intent
# 2. Player Psychology
# 3. Core Loop
# 4. Mechanics & Systems
# 5. Data & State
# 6. Implementation
```

### Compare to Generic Model

```bash
# Generic model (basic response)
ollama run qwen2.5-coder:7b "Add player movement"

# Your vibecoder (DIS reasoning + quality code)
ollama run vibecoder "Add player movement"

# See the difference!
```

### Workspace-Specific Patterns

```bash
# Your model knows Excalibur.js patterns
ollama run vibecoder "Create a scene transition system"

# It knows Zustand patterns
ollama run vibecoder "Create state management for inventory"

# It knows PWA patterns
ollama run vibecoder "Set up offline data persistence"
```

## 🎯 What Makes Vibecoder Special?

### Generic Model (qwen2.5-coder:7b)

```typescript
// Prompt: "Add jump"
function jump() {
  player.y -= 10
}
```

**Problems:**
- ❌ No design reasoning
- ❌ Magic number
- ❌ Not frame-rate independent
- ❌ No types

### Your Vibecoder

```typescript
// Prompt: "Add jump"

// First provides Design Intelligence analysis...
// Then implements:

const PHYSICS = {
  JUMP_FORCE: -400, // pixels per second
  GRAVITY: 1200,
  COYOTE_TIME: 0.1, // seconds
} as const

class Player extends Actor {
  private velocityY = 0
  private coyoteTimeRemaining = 0

  onPreUpdate(engine: Engine, delta: number): void {
    const dt = delta / 1000

    if (this.isGrounded) {
      this.coyoteTimeRemaining = PHYSICS.COYOTE_TIME
    } else {
      this.coyoteTimeRemaining = Math.max(0, this.coyoteTimeRemaining - dt)
    }

    if (engine.input.keyboard.wasPressed(Keys.Space) && this.coyoteTimeRemaining > 0) {
      this.velocityY = PHYSICS.JUMP_FORCE
      this.coyoteTimeRemaining = 0
      this.emit('jumped')
    }

    this.velocityY += PHYSICS.GRAVITY * dt
    this.pos.y += this.velocityY * dt
  }
}
```

**Wins:**
- ✅ Design reasoning first
- ✅ Named constants
- ✅ Frame-rate independent
- ✅ Fully typed
- ✅ Includes juice (coyote time)
- ✅ Event-driven

## 🔧 Customization

### Edit the Modelfile

Want to change behavior? Edit `Modelfile-vibecoder`:

```bash
# Open in editor
nano Modelfile-vibecoder

# Make changes (add your own patterns, adjust temperature, etc.)

# Recreate model
ollama create vibecoder -f Modelfile-vibecoder

# Test changes
ollama run vibecoder "Test prompt"
```

### Add Your Own Patterns

Add to the SYSTEM section in `Modelfile-vibecoder`:

```
SYSTEM """
... existing patterns ...

# My Custom Patterns

When creating UI components:
- Always use a CSS-in-JS approach
- Follow atomic design principles
- Include accessibility attributes

When creating game entities:
- Always extend Actor class
- Use composition over inheritance
- Implement IPoolable for frequently spawned objects
"""
```

## 📚 Advanced: Fine-Tuning

Want a model actually trained on your code? See `CREATE_CUSTOM_MODEL.md` for:

- **Method 2:** LoRA fine-tuning (30 min training)
- **Method 3:** Continuous learning (auto-improves)

## 🎮 Integration with Workspace

### Use in Terminal

```bash
# Generate components
ollama run vibecoder "Create a health bar UI component"

# Get help with patterns
ollama run vibecoder "Explain ECS architecture for my game"

# Debug code
ollama run vibecoder "Find issues in this code: [paste code]"
```

### Use with Cursor

1. Cursor Settings → Models
2. Add custom model:
   - Provider: "OpenAI Compatible"
   - Base URL: `http://localhost:11434/v1`
   - Model: `vibecoder`

Now Cursor uses your custom model!

### Use in Scripts

```bash
#!/bin/bash
# auto-generate-component.sh

COMPONENT_NAME=$1
ollama run vibecoder "Create an Excalibur.js component for: $COMPONENT_NAME" > "src/components/$COMPONENT_NAME.ts"

echo "Component generated: src/components/$COMPONENT_NAME.ts"
```

## 🆚 Comparison Table

| Feature | Generic Model | Your Vibecoder |
|---------|--------------|----------------|
| **Design reasoning** | No | Always DIS |
| **Workspace patterns** | Generic | Your exact patterns |
| **Code quality** | Variable | Always high |
| **TypeScript strict** | Sometimes | Always |
| **Magic numbers** | Often | Never |
| **Frame-rate independent** | Sometimes | Always |
| **Event-driven** | Rarely | Always |
| **Cost** | $0 | $0 |
| **Privacy** | Local | Local |
| **Customizable** | No | Fully |

## 💰 Cost Savings

### Commercial AI Services

- OpenAI GPT-4: $20-200/month
- GitHub Copilot: $10-19/month
- Claude Pro: $20/month
- **Total:** $50-239/month

### Your Vibecoder

- Setup time: 10 minutes
- Cost: **$0/month forever**
- **Annual savings:** $600-2,868

## 🚀 Next Steps

1. **Create your model:**
   ```bash
   ./setup-vibecoder.bat  # Windows
   ./setup-vibecoder.sh   # Mac/Linux
   ```

2. **Test it:**
   ```bash
   ollama run vibecoder "Create a player class"
   ```

3. **Compare to generic:**
   ```bash
   ollama run qwen2.5-coder:7b "Create a player class"
   ollama run vibecoder "Create a player class"
   ```

4. **Integrate everywhere:**
   - Terminal
   - Cursor
   - Scripts
   - CI/CD

5. **Keep improving:**
   - Add more patterns to Modelfile
   - Collect training data
   - Fine-tune when ready

## 📖 Full Documentation

See `CREATE_CUSTOM_MODEL.md` for:
- Complete customization guide
- Fine-tuning instructions
- Continuous learning setup
- Advanced techniques

## ❓ Troubleshooting

**Model not found:**
```bash
ollama list  # Check if vibecoder exists
ollama create vibecoder -f Modelfile-vibecoder  # Recreate
```

**Generic responses:**
```bash
# Check the Modelfile is being used
ollama show vibecoder

# Recreate with fresh Modelfile
ollama create vibecoder -f Modelfile-vibecoder --force
```

**Out of memory:**
```bash
# Use smaller base model
# Edit Modelfile-vibecoder, change FROM to:
FROM phi3:mini
```

---

**You now have an AI that thinks like you, costs nothing, and gets better over time! 🎉**

**Happy vibecoding! 🎮✨**
