/**
 * LAYER 14 — META-PROMPT SYSTEM
 * 
 * Unified activation system that coordinates all layers (0-13)
 * 
 * This is the orchestration layer that determines which layers activate when,
 * coordinates reasoning flows, synthesizes context, and ensures all quality
 * gates pass before output.
 */

import type { ReasoningComplexity } from './layer-9-reasoning-protocol';

/**
 * Layer activation result
 */
export interface LayerActivation {
  layerId: string;
  layerName: string;
  activated: boolean;
  reason?: string;
  output?: unknown;
}

/**
 * Execution phase in the meta-prompt flow
 */
export type ExecutionPhase =
  | "pre-audit"           // Meta-cognitive pre-decision audit
  | "context-retrieval"   // Gather codebase context
  | "reasoning"           // Apply reasoning protocols
  | "constraint-check"    // Validate against constraints
  | "architecture"        // Apply architecture intelligence
  | "iteration"           // Plan iteration approach
  | "design-guidance"     // Apply design layers (1-3, 6)
  | "execution"           // Code generation/execution
  | "validation"          // Polish checklist validation
  | "learning"            // Adaptive learning integration
  | "reflection"          // Post-decision reflection
  | "output";             // Final output formatting

/**
 * Meta-prompt execution state
 */
export interface MetaPromptState {
  request: string;
  complexity: ReasoningComplexity;
  phase: ExecutionPhase;
  activatedLayers: LayerActivation[];
  reasoningTrace?: unknown;
  confidenceScore?: number;
  consistencyChecks?: unknown[];
  qualityGates: {
    constraintCheck: boolean;
    assetEnforcement: boolean; // Asset existence validation
    designAlignment: boolean;
    codeQuality: boolean;
    polishChecklist: boolean;
  };
}

/**
 * Output format configuration
 */
export interface OutputFormat {
  includeReasoningTrace: boolean;
  includeConfidenceScore: boolean;
  includeConsistencyChecks: boolean;
  includeQualityGates: boolean;
  includeAlternatives: boolean;
  levelOfDetail: "minimal" | "standard" | "verbose";
}

/**
 * Main meta-prompt system configuration
 */
export const META_PROMPT_SYSTEM = {
  /**
   * Layer activation protocol
   * Determines which layers activate based on request characteristics
   */
  layerActivation: {
    /**
     * Always active layers (foundation)
     */
    alwaysActive: [
      { id: "layer-0", name: "Project Directive", reason: "Constitutional boundary check" },
      { id: "layer-7", name: "System Lock", reason: "System boundary validation" },
      { id: "layer-42", name: "Asset Enforcement", reason: "Asset existence validation - required for all code generation" }
    ],
    
    /**
     * Complexity-based activation
     */
    byComplexity: {
      simple: [
        { id: "layer-8", name: "Polish Checklist", reason: "Quality validation" },
        { id: "layer-4", name: "Prompt Protocol", reason: "Communication interpretation" }
      ],
      
      moderate: [
        { id: "layer-9", name: "Reasoning Protocol", reason: "Structured reasoning required" },
        { id: "layer-8", name: "Polish Checklist", reason: "Quality validation" },
        { id: "layer-5", name: "Iteration Loop", reason: "Multi-step execution planning" },
        { id: "layer-4", name: "Prompt Protocol", reason: "Communication interpretation" },
        { id: "layer-1", name: "UI Canon", reason: "Design guidance (if UI related)" },
        { id: "layer-2", name: "Visual Analogies", reason: "Design guidance (if UI related)" }
      ],
      
      complex: [
        { id: "layer-12", name: "Meta-Cognitive Protocols", reason: "Pre-decision audit" },
        { id: "layer-13", name: "Context Retrieval", reason: "Enhanced context synthesis" },
        { id: "layer-9", name: "Reasoning Protocol", reason: "Advanced reasoning (CoT + ToT)" },
        { id: "layer-11", name: "Architecture Intelligence", reason: "Pattern recognition and quality" },
        { id: "layer-8", name: "Polish Checklist", reason: "Quality validation" },
        { id: "layer-5", name: "Iteration Loop", reason: "Multi-step execution planning" },
        { id: "layer-4", name: "Prompt Protocol", reason: "Communication interpretation" },
        { id: "layer-1", name: "UI Canon", reason: "Design guidance (if UI related)" },
        { id: "layer-2", name: "Visual Analogies", reason: "Design guidance (if UI related)" },
        { id: "layer-3", name: "UI States", reason: "Design guidance (if UI related)" },
        { id: "layer-6", name: "UI Lore", reason: "Design guidance (if UI related)" }
      ],
      
      architectural: [
        { id: "layer-12", name: "Meta-Cognitive Protocols", reason: "Critical pre-decision audit" },
        { id: "layer-13", name: "Context Retrieval", reason: "Comprehensive context synthesis" },
        { id: "layer-9", name: "Reasoning Protocol", reason: "Full reasoning (CoT + ToT + Self-Consistency)" },
        { id: "layer-11", name: "Architecture Intelligence", reason: "Architecture pattern recognition" },
        { id: "layer-10", name: "Adaptive Learning", reason: "Apply learned patterns" },
        { id: "layer-8", name: "Polish Checklist", reason: "Comprehensive quality validation" },
        { id: "layer-5", name: "Iteration Loop", reason: "Phased execution planning" },
        { id: "layer-4", name: "Prompt Protocol", reason: "Communication interpretation" },
        { id: "charter-professional", name: "Professional Stack Charter", reason: "Architecture standards" },
        { id: "charter-co-architect", name: "Co-Architect Charter", reason: "Role and principles" }
      ]
    },
    
    /**
     * Context-based activation (additional layers based on request content)
     */
    byContext: {
      uiRelated: [
        { id: "layer-1", name: "UI Canon", reason: "UI design decisions" },
        { id: "layer-2", name: "Visual Analogies", reason: "Visual feeling and emotion" },
        { id: "layer-3", name: "UI States", reason: "State-driven UI theming" },
        { id: "layer-6", name: "UI Lore", reason: "Screen narrative context" }
      ],
      
      codeRelated: [
        { id: "layer-11", name: "Architecture Intelligence", reason: "Code patterns and quality" },
        { id: "charter-professional", name: "Professional Stack Charter", reason: "Development standards" }
      ],
      
      assetCreation: [
        { id: "layer-36", name: "Multimodal Core", reason: "Multimodal asset generation and analysis" },
        { id: "layer-39", name: "Asset Pipeline", reason: "End-to-end asset pipeline orchestration" },
        { id: "layer-31", name: "Asset Creation & Generation", reason: "Asset creation guidance" },
        { id: "layer-32", name: "Asset Management & Organization", reason: "Asset organization and management" },
        { id: "layer-1", name: "UI Canon", reason: "Asset style guidelines" },
        { id: "layer-15", name: "Design Tokens", reason: "Asset dimension and style tokens" }
      ],
      
      multimodal: [
        { id: "layer-36", name: "Multimodal Core", reason: "Multimodal understanding and generation" },
        { id: "layer-38", name: "Knowledge Graph", reason: "Semantic context and memory" },
        { id: "layer-41", name: "Prompt Orchestration", reason: "Multimodal prompt coordination" },
        { id: "layer-13", name: "Context Retrieval", reason: "Enhanced context with visual understanding" }
      ],
      
      gameFramework: [
        { id: "layer-37", name: "Game Frameworks", reason: "Framework-specific code generation" },
        { id: "layer-36", name: "Multimodal Core", reason: "Asset-to-code bridging" },
        { id: "layer-39", name: "Asset Pipeline", reason: "Asset integration" },
        { id: "layer-21", name: "Code Generation", reason: "Code generation patterns" }
      ],
      
      simulation: [
        { id: "layer-40", name: "Simulation Engine", reason: "Game simulation and balance analysis" },
        { id: "layer-11", name: "Architecture Intelligence", reason: "System analysis" },
        { id: "layer-22", name: "Testing Strategies", reason: "Gameplay testing" }
      ],
      
      assetSourcing: [
        { id: "layer-33", name: "Free Asset Sourcing & Licensing", reason: "Asset sourcing and license compliance" },
        { id: "layer-32", name: "Asset Management & Organization", reason: "Asset organization and tracking" },
        { id: "layer-29", name: "Documentation", reason: "License documentation" }
      ],
      
      animation: [
        { id: "layer-34", name: "Animation Frameworks & Systems", reason: "Animation system guidance" },
        { id: "layer-1", name: "UI Canon", reason: "Animation principles" },
        { id: "layer-23", name: "Performance Optimization", reason: "Animation performance optimization" }
      ],
      
      gameContent: [
        { id: "layer-35", name: "Game Content Generation", reason: "Game content generation patterns" },
        { id: "layer-21", name: "Code Generation", reason: "Generation algorithms" },
        { id: "layer-26", name: "Architecture Patterns", reason: "Content architecture" }
      ],
      
      refactoring: [
        { id: "layer-13", name: "Context Retrieval", reason: "Find similar patterns" },
        { id: "layer-11", name: "Architecture Intelligence", reason: "Pattern recognition" },
        { id: "layer-25", name: "Refactoring & Code Quality", reason: "Refactoring techniques" },
        { id: "layer-10", name: "Adaptive Learning", reason: "Apply learned patterns" }
      ],
      
      codeGeneration: [
        { id: "layer-21", name: "Code Generation & Patterns", reason: "Design patterns and algorithms" },
        { id: "layer-11", name: "Architecture Intelligence", reason: "Code quality patterns" },
        { id: "layer-30", name: "Bug Prevention", reason: "Error handling patterns" }
      ],
      
      testing: [
        { id: "layer-22", name: "Testing Strategies", reason: "Testing patterns and quality gates" },
        { id: "layer-30", name: "Bug Prevention", reason: "Bug prevention testing" }
      ],
      
      performance: [
        { id: "layer-23", name: "Performance Optimization", reason: "Performance patterns and metrics" },
        { id: "layer-19", name: "Visual Quality", reason: "Performance quality gates" }
      ],
      
      security: [
        { id: "layer-24", name: "Security Patterns", reason: "Security best practices" },
        { id: "layer-19", name: "Visual Quality", reason: "Security quality gates" }
      ],
      
      architecture: [
        { id: "layer-26", name: "Architecture Patterns", reason: "Advanced architecture patterns" },
        { id: "layer-11", name: "Architecture Intelligence", reason: "Architecture decision support" }
      ],
      
      apiDesign: [
        { id: "layer-27", name: "API Design", reason: "API design patterns" },
        { id: "layer-22", name: "Testing Strategies", reason: "API testing patterns" },
        { id: "layer-24", name: "Security Patterns", reason: "API security" }
      ],
      
      database: [
        { id: "layer-28", name: "Database Design", reason: "Database patterns and optimization" },
        { id: "layer-23", name: "Performance Optimization", reason: "Query optimization" },
        { id: "layer-27", name: "API Design", reason: "Data access patterns" }
      ],
      
      documentation: [
        { id: "layer-29", name: "Documentation", reason: "Documentation patterns" },
        { id: "layer-11", name: "Architecture Intelligence", reason: "Documentation requirements" }
      ],
      
      bugPrevention: [
        { id: "layer-30", name: "Bug Prevention", reason: "Bug prevention and error handling" },
        { id: "layer-22", name: "Testing Strategies", reason: "Bug prevention testing" }
      ]
    }
  },

  /**
   * Execution flow - order of phase execution
   */
  executionFlow: [
    {
      phase: "pre-audit",
      layer: "layer-12",
      description: "Meta-cognitive pre-decision audit",
      required: false, // Only for complex+ requests
      outputs: ["riskAssessment", "uncertaintyAcknowledgment", "alternativeApproaches"]
    },
    {
      phase: "context-retrieval",
      layer: "layer-13",
      description: "Retrieve and synthesize codebase context",
      required: false, // Only for complex+ requests
      outputs: ["codebasePatterns", "relatedFiles", "dependencyMap", "contextSynthesis"]
    },
    {
      phase: "reasoning",
      layer: "layer-9",
      description: "Apply reasoning protocols (CoT/ToT)",
      required: false, // Only for moderate+ requests
      outputs: ["reasoningTrace", "selectedPath", "confidenceScore"]
    },
    {
      phase: "constraint-check",
      layers: ["layer-0", "layer-7"],
      description: "Validate against project constraints",
      required: true,
      outputs: ["constraintValidation", "allowedModifications"]
    },
    {
      phase: "asset-validation",
      layer: "layer-42",
      description: "Validate asset existence and enforce asset-first development",
      required: true, // Always required for code generation
      outputs: ["assetValidation", "missingAssets", "generatedAssets", "assetRegistry"]
    },
    {
      phase: "architecture",
      layer: "layer-11",
      description: "Apply architecture intelligence",
      required: false, // Only for code-related requests
      outputs: ["codePatterns", "qualityHeuristics", "antiPatternDetection"]
    },
    {
      phase: "code-generation",
      layers: ["layer-21", "layer-30"],
      description: "Apply code generation patterns and bug prevention",
      required: false, // Only for code generation requests
      outputs: ["codePatterns", "errorHandling", "typeSafety"]
    },
    {
      phase: "testing",
      layer: "layer-22",
      description: "Apply testing strategies",
      required: false, // Only when testing needed
      outputs: ["testPatterns", "testPlan", "qualityGates"]
    },
    {
      phase: "performance",
      layer: "layer-23",
      description: "Apply performance optimization",
      required: false, // Only when performance critical
      outputs: ["performancePatterns", "optimizationStrategies", "performanceMetrics"]
    },
    {
      phase: "security",
      layer: "layer-24",
      description: "Apply security patterns",
      required: false, // Only when security critical
      outputs: ["securityPatterns", "vulnerabilityPrevention", "securityGates"]
    },
    {
      phase: "api-design",
      layer: "layer-27",
      description: "Apply API design patterns",
      required: false, // Only for API design requests
      outputs: ["apiPatterns", "apiDocumentation", "integrationPatterns"]
    },
    {
      phase: "database",
      layer: "layer-28",
      description: "Apply database design patterns",
      required: false, // Only for database requests
      outputs: ["schemaDesign", "queryOptimization", "databasePatterns"]
    },
    {
      phase: "documentation",
      layer: "layer-29",
      description: "Apply documentation patterns",
      required: false, // Only when documentation needed
      outputs: ["documentationPatterns", "codeComments", "apiDocumentation"]
    },
    {
      phase: "iteration",
      layer: "layer-5",
      description: "Plan iteration approach",
      required: false, // Only for multi-step requests
      outputs: ["iterationPlan", "testPlan"]
    },
    {
      phase: "design-guidance",
      layers: ["layer-1", "layer-2", "layer-3", "layer-6"],
      description: "Apply design guidance layers",
      required: false, // Only for UI-related requests
      outputs: ["designDecisions", "visualGuidance", "narrativeContext"]
    },
    {
      phase: "execution",
      layers: ["all"],
      description: "Execute code generation/changes",
      required: true,
      outputs: ["codeChanges", "fileModifications"]
    },
    {
      phase: "validation",
      layer: "layer-8",
      description: "Validate against polish checklist",
      required: true,
      outputs: ["qualityValidation", "checklistResults"]
    },
    {
      phase: "learning",
      layer: "layer-10",
      description: "Integrate feedback and learn patterns",
      required: false, // Only if adaptive learning enabled
      outputs: ["patternUpdates", "feedbackIntegration"]
    },
    {
      phase: "reflection",
      layer: "layer-12",
      description: "Post-decision reflection",
      required: false, // Only for complex+ requests
      outputs: ["reflection", "lessonsLearned"]
    },
    {
      phase: "output",
      layers: ["all"],
      description: "Format and output final result",
      required: true,
      outputs: ["formattedOutput"]
    }
  ],

  /**
   * Reasoning orchestration
   * Determines which reasoning techniques to use
   */
  reasoningOrchestration: {
    selectTechnique: (complexity: ReasoningComplexity): {
      chainOfThought: boolean;
      treeOfThought: boolean;
      selfConsistency: boolean;
    } => {
      switch (complexity) {
        case "simple":
          return {
            chainOfThought: false,
            treeOfThought: false,
            selfConsistency: true // Always check consistency
          };
        case "moderate":
          return {
            chainOfThought: true,
            treeOfThought: false,
            selfConsistency: true
          };
        case "complex":
          return {
            chainOfThought: true,
            treeOfThought: true, // Recommended
            selfConsistency: true
          };
        case "architectural":
          return {
            chainOfThought: true,
            treeOfThought: true, // Required
            selfConsistency: true
          };
      }
    }
  },

  /**
   * Quality gate coordination
   * Ensures all quality gates pass before proceeding
   */
  qualityGates: {
    gates: [
      {
        id: "constraint-check",
        name: "Constraint Validation",
        layers: ["layer-0", "layer-7"],
        required: true,
        description: "All constraints from Layer 0 and Layer 7 must be respected",
        failureAction: "HALT - Request clarification or revise approach"
      },
      {
        id: "design-alignment",
        name: "Design Alignment",
        layers: ["layer-1", "layer-2", "layer-3", "layer-6"],
        required: false, // Only for UI-related changes
        description: "Changes must align with design system and visual analogies",
        failureAction: "REVISE - Adjust to align with design guidance"
      },
      {
        id: "code-quality",
        name: "Code Quality",
        layers: ["layer-11", "charter-professional"],
        required: false, // Only for code-related changes
        description: "Code must follow architecture patterns and quality heuristics",
        failureAction: "REVISE - Improve code quality and patterns"
      },
      {
        id: "polish-checklist",
        name: "Polish Checklist",
        layers: ["layer-8"],
        required: true,
        description: "All items in Layer 8 polish checklist must pass",
        failureAction: "REVISE - Address failing checklist items"
      }
    ],
    
    checkAll: (state: MetaPromptState): {
      allPassed: boolean;
      failedGates: string[];
      canProceed: boolean;
    } => {
      const failedGates: string[] = [];
      let allPassed = true;
      
      // Check constraint gate (always required)
      if (!state.qualityGates.constraintCheck) {
        failedGates.push("constraint-check");
        allPassed = false;
      }
      
      // Check design alignment (conditional)
      // Check code quality (conditional)
      // Check polish checklist (always required)
      if (!state.qualityGates.polishChecklist) {
        failedGates.push("polish-checklist");
        allPassed = false;
      }
      
      return {
        allPassed,
        failedGates,
        canProceed: allPassed
      };
    }
  },

  /**
   * Output formatting standards
   */
  outputFormatting: {
    /**
     * Default output format for different complexity levels
     */
    byComplexity: {
      simple: {
        includeReasoningTrace: false,
        includeConfidenceScore: false,
        includeConsistencyChecks: false,
        includeQualityGates: true,
        includeAlternatives: false,
        levelOfDetail: "minimal"
      },
      
      moderate: {
        includeReasoningTrace: true,
        includeConfidenceScore: true,
        includeConsistencyChecks: false,
        includeQualityGates: true,
        includeAlternatives: false,
        levelOfDetail: "standard"
      },
      
      complex: {
        includeReasoningTrace: true,
        includeConfidenceScore: true,
        includeConsistencyChecks: true,
        includeQualityGates: true,
        includeAlternatives: true,
        levelOfDetail: "standard"
      },
      
      architectural: {
        includeReasoningTrace: true,
        includeConfidenceScore: true,
        includeConsistencyChecks: true,
        includeQualityGates: true,
        includeAlternatives: true,
        levelOfDetail: "verbose"
      }
    },
    
    /**
     * Format output based on configuration
     */
    format: (state: MetaPromptState, format: OutputFormat): string => {
      const sections: string[] = [];
      
      // Reasoning trace
      if (format.includeReasoningTrace && state.reasoningTrace) {
        sections.push("## Reasoning Trace\n\n[Reasoning steps...]");
      }
      
      // Confidence score
      if (format.includeConfidenceScore && state.confidenceScore !== undefined) {
        sections.push(`## Confidence Score\n\n${state.confidenceScore.toFixed(2)}`);
      }
      
      // Consistency checks
      if (format.includeConsistencyChecks && state.consistencyChecks) {
        sections.push("## Consistency Checks\n\n[Check results...]");
      }
      
      // Quality gates
      if (format.includeQualityGates) {
        sections.push("## Quality Gates\n\n[Gate status...]");
      }
      
      // Implementation
      sections.push("## Implementation\n\n[Code changes...]");
      
      return sections.join("\n\n");
    }
  },

  /**
   * Unified execution flow
   * Main entry point for meta-prompt system
   */
  execute: {
    description: "Main execution flow that orchestrates all layers",
    steps: [
      "1. Assess request complexity",
      "2. Determine which layers to activate",
      "3. Execute phases in order",
      "4. Check quality gates at each critical point",
      "5. Synthesize outputs from all layers",
      "6. Format final output",
      "7. Validate all quality gates pass",
      "8. Return formatted result"
    ],
    
    /**
     * Execute the full meta-prompt flow
     */
    flow: (request: string, context: {
      complexity?: ReasoningComplexity;
      uiRelated?: boolean;
      codeRelated?: boolean;
      refactoring?: boolean;
    }): MetaPromptState => {
      // This is a reference implementation
      // Actual implementation would execute each phase
      
      const complexity = context.complexity || "moderate";
      
      return {
        request,
        complexity,
        phase: "pre-audit",
        activatedLayers: [],
        qualityGates: {
          constraintCheck: false,
          assetEnforcement: false,
          designAlignment: false,
          codeQuality: false,
          polishChecklist: false
        }
      };
    }
  }
} as const;

/**
 * Helper function to determine which layers should activate
 */
export function determineLayerActivation(
  complexity: ReasoningComplexity,
  context: {
    uiRelated?: boolean;
    codeRelated?: boolean;
    refactoring?: boolean;
  }
): LayerActivation[] {
  const activations: LayerActivation[] = [];
  
  // Always active layers
  META_PROMPT_SYSTEM.layerActivation.alwaysActive.forEach(layer => {
    activations.push({
      layerId: layer.id,
      layerName: layer.name,
      activated: true,
      reason: layer.reason
    });
  });
  
  // Complexity-based activation
  const complexityLayers = META_PROMPT_SYSTEM.layerActivation.byComplexity[complexity];
  complexityLayers.forEach(layer => {
    activations.push({
      layerId: layer.id,
      layerName: layer.name,
      activated: true,
      reason: layer.reason
    });
  });
  
  // Context-based activation
  if (context.uiRelated) {
    META_PROMPT_SYSTEM.layerActivation.byContext.uiRelated.forEach(layer => {
      if (!activations.find(a => a.layerId === layer.id)) {
        activations.push({
          layerId: layer.id,
          layerName: layer.name,
          activated: true,
          reason: layer.reason
        });
      }
    });
  }
  
  if (context.codeRelated) {
    META_PROMPT_SYSTEM.layerActivation.byContext.codeRelated.forEach(layer => {
      if (!activations.find(a => a.layerId === layer.id)) {
        activations.push({
          layerId: layer.id,
          layerName: layer.name,
          activated: true,
          reason: layer.reason
        });
      }
    });
  }
  
  if (context.assetCreation) {
    META_PROMPT_SYSTEM.layerActivation.byContext.assetCreation.forEach(layer => {
      if (!activations.find(a => a.layerId === layer.id)) {
        activations.push({
          layerId: layer.id,
          layerName: layer.name,
          activated: true,
          reason: layer.reason
        });
      }
    });
  }
  
  if (context.assetSourcing) {
    META_PROMPT_SYSTEM.layerActivation.byContext.assetSourcing.forEach(layer => {
      if (!activations.find(a => a.layerId === layer.id)) {
        activations.push({
          layerId: layer.id,
          layerName: layer.name,
          activated: true,
          reason: layer.reason
        });
      }
    });
  }
  
  if (context.animation) {
    META_PROMPT_SYSTEM.layerActivation.byContext.animation.forEach(layer => {
      if (!activations.find(a => a.layerId === layer.id)) {
        activations.push({
          layerId: layer.id,
          layerName: layer.name,
          activated: true,
          reason: layer.reason
        });
      }
    });
  }
  
  if (context.gameContent) {
    META_PROMPT_SYSTEM.layerActivation.byContext.gameContent.forEach(layer => {
      if (!activations.find(a => a.layerId === layer.id)) {
        activations.push({
          layerId: layer.id,
          layerName: layer.name,
          activated: true,
          reason: layer.reason
        });
      }
    });
  }
  
  if (context.refactoring) {
    META_PROMPT_SYSTEM.layerActivation.byContext.refactoring.forEach(layer => {
      if (!activations.find(a => a.layerId === layer.id)) {
        activations.push({
          layerId: layer.id,
          layerName: layer.name,
          activated: true,
          reason: layer.reason
        });
      }
    });
  }
  
  return activations;
}

/**
 * Type exports for use in other layers
 */
export type { LayerActivation, ExecutionPhase, MetaPromptState, OutputFormat };

