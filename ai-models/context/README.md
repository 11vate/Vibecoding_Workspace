# Context Extension for Vibecoder

Extend vibecoder's context window from 8K to 128K+ tokens.

## Methods

### 1. Self-Extend (Easiest - Recommended)

Modify Ollama Modelfile to enable larger context:

```bash
# Edit Modelfile-vibecoder
PARAMETER num_ctx 32768  # or 65536, 131072

# Recreate model
ollama create vibecoder -f Modelfile-vibecoder
```

That's it! Self-Extend is built into modern models.

### 2. Advanced: Infini-Attention

For true infinite context, you'd need to:
1. Fine-tune the model with Infini-Attention layers
2. Use custom inference code

This is complex and requires significant compute. For 99% of use cases, increasing `num_ctx` is sufficient.

## Usage

```bash
# Test large context
ollama run vibecoder "Summarize this entire file: [paste 50K tokens]"
```

## Performance Notes

- 8K context: Fast, default
- 32K context: Recommended for most projects
- 64K context: Handles large game projects
- 128K+ context: Slower but handles massive codebases

Memory usage scales linearly with context size.
