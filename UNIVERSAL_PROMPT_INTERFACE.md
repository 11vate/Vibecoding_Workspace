# Universal Prompt Interface for Multi-Model Design Intelligence

## Overview

This interface standardizes how different AI models interact with the Ultimate Design Intelligence Workspace while preserving the unique strengths of each model. All prompts follow the same underlying structure and principles but can be adapted for specific model capabilities.

## Core Interface Principles

### 1. Universal Prompt Structure
All prompts must contain these elements:
- **Context** (`@Docs`, `@Codebase`, reference documents)
- **Task Definition** (Clear, specific objective)
- **Process Guidance** (Methodology to follow)
- **Output Requirements** (Specific deliverables expected)

### 2. Design Intelligence Stack Integration
All prompts must reference the 15-layer Design Intelligence Stack as appropriate:
- Layer 1-3: Experience, Psychology, Core Loop
- Layer 4-6: Systems, Evolution, UX Decisions
- Layer 7-15: Advanced design considerations

### 3. Model-Agnostic Format
Prompts use a format that works across different AI models by focusing on:
- Clear instructions
- Structured context
- Specific requirements
- Quality gates

## Universal Prompt Templates

### Research Phase Prompt Template
```
CONTEXT:
@Docs/design-intelligence/layer-1-experience-pillars.md
@Docs/design-intelligence/layer-2-player-psychology.md
[Additional context files as needed]

TASK:
Research comparable systems for [FEATURE/SYSTEM/MODULE].
Compare with similar implementations in the knowledge base.

PROCESS:
1. Identify 3-5 similar systems from knowledge base
2. Analyze their strengths and weaknesses
3. Document failure patterns to avoid
4. Create adaptation strategy for this project

OUTPUT REQUIREMENTS:
- Comparative analysis document
- Pattern extraction from successful examples
- Risk assessment for this approach
- Adaptation strategy summary
```

### Synthesis Phase Prompt Template
```
CONTEXT:
@Docs/design-intelligence/layer-3-core-loop.md
@Docs/design-intelligence/layer-4-systems-map.md
@Docs/research/[comparative-analysis-file].md

TASK:
Synthesize 2-3 design concepts for [FEATURE/SYSTEM/MODULE].

PROCESS:
1. Apply design intelligence layers 3-4 reasoning
2. Generate multiple valid approaches
3. Explain tradeoffs for each concept
4. Consider integration with existing systems

OUTPUT REQUIREMENTS:
- 2-3 distinct design concepts
- Tradeoff analysis for each
- Integration considerations
- Recommended approach with reasoning
```

### Blueprint Phase Prompt Template
```
CONTEXT:
@Docs/design-intelligence/layer-5-mechanic-evolution.md
@Docs/design-intelligence/layer-6-ux-decision-log.md
@Docs/blueprint-templates/[appropriate-template].md

TASK:
Create formal blueprint for [SYSTEM/UX/MODULE] following template structure.

PROCESS:
1. Complete all sections of the blueprint template
2. Reference relevant design intelligence layers
3. Define all data structures and state transitions
4. Document edge cases and error conditions

OUTPUT REQUIREMENTS:
- Complete formal blueprint document
- All template sections filled
- Data structure definitions
- State transition diagrams if applicable
- Edge case handling specifications
```

### Implementation Phase Prompt Template
```
CONTEXT:
@Docs/blueprints/[system-name].md
@Docs/implementation-standards.md
[Relevant codebase files]

TASK:
Implement exactly as specified in the blueprint document.

PROCESS:
1. Follow blueprint specifications exactly
2. Apply quality gates and constraints
3. Maintain architectural consistency
4. Include proper error handling and documentation

OUTPUT REQUIREMENTS:
- Implementation matching blueprint exactly
- Proper error handling
- Type safety compliance
- Performance considerations
- Accessibility compliance
```

## Model-Specific Adaptations

### For GPT Models
- Use more conversational framing
- Include reasoning explanations in prompts
- Emphasize step-by-step processes

### For Claude Models
- Use direct, clear instructions
- Focus on safety and thoroughness
- Emphasize documentation and audit trails

### For Google Models
- Use structured, logical progressions
- Include data-driven decision making
- Emphasize efficiency and optimization

### For Anthropic Models
- Focus on helpful, harmless, honest guidelines
- Emphasize user well-being in design
- Include ethical considerations

## Integration Points

### With Existing Systems
- Compatible with current `/docs/prompts/` directory
- Integrates with operation modes (Exploration, Synthesis, etc.)
- Works with blueprint validation systems
- Connects with knowledge base cross-references

### With Quality Systems
- Enforces existing quality gates
- Maintains framework constraints
- Preserves architectural integrity
- Supports self-auditing protocols

## Mode Activation Interface

### Exploration Mode Activation
```
ACTIVATE EXPLORATION MODE:
- Research comparable systems
- Identify patterns and failures  
- Generate research artifacts
- No code, no design yet
- Follow @Docs/protocols/research-protocol.md
```

### Synthesis Mode Activation
```
ACTIVATE SYNTHESIS MODE:
- Extract principles from research
- Generate multiple design concepts
- Explain tradeoffs
- No implementation yet
- Apply @Docs/design-intelligence/layers-3-4
```

### Blueprint Mode Activation
```
ACTIVATE BLUEPRINT MODE:
- Create formal system/UX/mechanic blueprints
- Define data structures and state transitions
- Document edge cases and failure modes
- No code yet
- Use @Tools/blueprint-templates/
```

### Implementation Mode Activation
```
ACTIVATE IMPLEMENTATION MODE:
- Code exactly as specified in blueprints
- Explain architecture decisions inline
- No deviations without blueprint update
- Code only after blueprint approval
- Apply quality gates
```

## Cross-Model Consistency Mechanisms

### 1. Standardized Context References
All models use the same `@Docs` and `@Codebase` references to maintain consistency.

### 2. Template Compliance Verification
Output templates ensure all models produce compatible results.

### 3. Process Adherence Monitoring
All models must follow the same process steps regardless of internal implementation.

### 4. Quality Gate Enforcement
Same quality standards apply to outputs from any model.

## Error Handling and Recovery

### If Model Deviates from Process
```
CORRECTION PROTOCOL:
1. Identify the deviation
2. Return to the correct phase
3. Reapply the proper process
4. Document the correction needed
5. Continue with integrity preserved
```

### If Model Produces Inadequate Output
```
QUALITY RECOVERY:
1. Identify quality gaps
2. Return to appropriate phase
3. Re-process with corrected parameters
4. Validate output quality
5. Continue if standards met
```

## Success Metrics (Universal)

The interface succeeds when:
- ✅ All models follow the same process flow
- ✅ Outputs are consistent across models
- ✅ Design intelligence layers are properly applied
- ✅ Quality gates are maintained regardless of model
- ✅ Knowledge base is properly cross-referenced
- ✅ Architectural consistency is preserved

## Migration Path

### For Existing Workflows
- Current prompts in `/docs/prompts/` remain functional
- New universal interface provides additional flexibility
- Gradual adoption of standardized approach
- Backwards compatibility maintained

### For New Model Integration
- Use universal templates as starting point
- Adapt for model-specific strengths
- Maintain core structure and constraints
- Test with sample workflows

## Documentation Cross-References

- Use with `@Docs/design-intelligence/` for layer application
- Integrate with `@Knowledge-base/` for pattern matching  
- Connect to `@Tools/blueprint-templates/` for standardization
- Link to `@Docs/protocols/` for process guidance
- Reference `@Docs/modes/` for operational context

---

**This universal prompt interface ensures that regardless of which AI model is used, the design intelligence process remains consistent, thorough, and aligned with the workspace's core philosophy of Experience → Systems → Data → Code. All original functionality and constraints are preserved while enabling multi-model compatibility.**