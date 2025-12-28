/**
 * LAYER 13 — CONTEXT RETRIEVAL & SYNTHESIS
 * 
 * Enhanced codebase understanding and context synthesis
 * 
 * This layer provides codebase pattern recognition, related file discovery,
 * dependency analysis, and knowledge synthesis to ensure changes are informed
 * by existing code patterns and avoid reinventing solutions.
 */

/**
 * Codebase pattern
 */
export interface CodebasePattern {
  id: string;
  type: "component" | "hook" | "utility" | "service" | "style" | "type";
  name: string;
  location: string;
  description: string;
  similarFiles?: string[];
  usage?: string[];
}

/**
 * Related file information
 */
export interface RelatedFile {
  path: string;
  relation: "imports" | "imported-by" | "similar" | "related" | "dependency";
  relevance: number; // 0-1
  reason: string;
}

/**
 * Dependency map
 */
export interface DependencyMap {
  file: string;
  imports: string[];
  importedBy: string[];
  dependencies: string[]; // External dependencies
  dependents: string[]; // Files that depend on this
}

/**
 * Context synthesis result
 */
export interface ContextSynthesis {
  patterns: CodebasePattern[];
  relatedFiles: RelatedFile[];
  dependencies: DependencyMap;
  conventions: {
    naming: string[];
    structure: string[];
    patterns: string[];
  };
  recommendations: string[];
}

/**
 * Context priority levels
 */
export type ContextPriority = "critical" | "high" | "medium" | "low";

/**
 * Main context retrieval configuration
 */
export const CONTEXT_RETRIEVAL = {
  /**
   * Before making changes, discover relevant context
   */
  beforeChange: {
    discover: [
      {
        step: "Search for similar patterns",
        description: "Find existing implementations that solve similar problems",
        methods: [
          "Semantic search for similar functionality",
          "Pattern matching for component structures",
          "Search for similar naming patterns",
          "Look for related utility functions"
        ]
      },
      {
        step: "Find all affected files",
        description: "Identify files that will be modified or are related",
        methods: [
          "Direct file modifications",
          "Files that import the target file",
          "Files imported by the target file",
          "Files in the same directory/module"
        ]
      },
      {
        step: "Check dependencies and imports",
        description: "Understand what this code depends on and what depends on it",
        methods: [
          "Parse import statements",
          "Map dependency graph",
          "Check for circular dependencies",
          "Identify external dependencies"
        ]
      },
      {
        step: "Review related components/systems",
        description: "Understand how similar components work",
        methods: [
          "Find components with similar functionality",
          "Review related services/utilities",
          "Check related type definitions",
          "Review related styling approaches"
        ]
      },
      {
        step: "Identify potential side effects",
        description: "Understand what might break if changes are made",
        methods: [
          "Check all files that import this code",
          "Review test files",
          "Check for shared state/context usage",
          "Identify exported APIs used elsewhere"
        ]
      }
    ],
    
    analyze: [
      {
        step: "Understand current implementation",
        description: "How does the current code work?",
        questions: [
          "What is the current structure?",
          "What patterns are used?",
          "What are the dependencies?",
          "What is the purpose of each part?"
        ]
      },
      {
        step: "Identify patterns and conventions",
        description: "What patterns exist in the codebase?",
        questions: [
          "How are similar components structured?",
          "What naming conventions are used?",
          "How is state managed?",
          "What styling approaches are used?"
        ]
      },
      {
        step: "Check for inconsistencies",
        description: "Are there inconsistencies to address?",
        questions: [
          "Does this code follow established patterns?",
          "Are there deviations from conventions?",
          "Are there similar implementations that differ?"
        ]
      },
      {
        step: "Verify coherence across codebase",
        description: "Does this fit with the rest of the codebase?",
        questions: [
          "Is this consistent with similar code?",
          "Does this follow the same patterns?",
          "Does this match the codebase style?"
        ]
      }
    ]
  },

  /**
   * Pattern recognition
   */
  patterns: {
    recognize: {
      component: {
        patterns: [
          "Component structure (hooks order, props, render)",
          "Styling approach (CSS Modules, styled-components, etc.)",
          "State management pattern",
          "Event handling conventions",
          "TypeScript typing patterns"
        ],
        methods: [
          "Analyze component file structure",
          "Identify common patterns in similar components",
          "Extract naming conventions",
          "Note prop patterns and interfaces"
        ]
      },
      
      hook: {
        patterns: [
          "Custom hook structure",
          "Return value patterns",
          "Parameter conventions",
          "Error handling approaches"
        ],
        methods: [
          "Review existing custom hooks",
          "Identify common patterns",
          "Note naming conventions (use* prefix)"
        ]
      },
      
      utility: {
        patterns: [
          "Function organization",
          "Parameter patterns",
          "Return value patterns",
          "Error handling"
        ],
        methods: [
          "Review utility functions",
          "Identify common patterns",
          "Note naming and organization conventions"
        ]
      },
      
      service: {
        patterns: [
          "Service structure",
          "API patterns",
          "Error handling",
          "Data transformation"
        ],
        methods: [
          "Review service files",
          "Identify common patterns",
          "Note architecture patterns"
        ]
      },
      
      style: {
        patterns: [
          "CSS organization",
          "Naming conventions (BEM, CSS Modules, etc.)",
          "Variable usage",
          "Responsive patterns"
        ],
        methods: [
          "Review style files",
          "Identify naming conventions",
          "Note organization patterns"
        ]
      },
      
      type: {
        patterns: [
          "Type organization",
          "Naming conventions",
          "Reusability patterns",
          "Utility type usage"
        ],
        methods: [
          "Review type definitions",
          "Identify common patterns",
          "Note organization approaches"
        ]
      }
    },
    
    apply: {
      instruction: "When similar context appears, reference successful patterns",
      priority: "Maintain consistency over innovation (unless explicitly requested)",
      exceptions: "Only deviate from patterns if: 1) Pattern is anti-pattern, 2) New pattern is significantly better, 3) Explicitly requested"
    }
  },

  /**
   * Related file discovery protocols
   */
  relatedFiles: {
    discover: {
      imports: {
        description: "Files that this file imports",
        method: "Parse import statements",
        relevance: "high"
      },
      
      importedBy: {
        description: "Files that import this file",
        method: "Search for imports of this file",
        relevance: "critical" // Need to understand impact
      },
      
      similar: {
        description: "Files with similar functionality or structure",
        method: "Semantic search + pattern matching",
        relevance: "high"
      },
      
      related: {
        description: "Files in same module/directory or related functionality",
        method: "Directory structure + semantic analysis",
        relevance: "medium"
      },
      
      dependency: {
        description: "External dependencies this file uses",
        method: "Parse package.json + import statements",
        relevance: "medium"
      }
    },
    
    prioritize: {
      critical: ["importedBy"], // Must understand impact
      high: ["imports", "similar"], // Important for consistency
      medium: ["related", "dependency"], // Helpful context
      low: [] // Nice to have
    }
  },

  /**
   * Dependency analysis
   */
  dependencies: {
    map: {
      description: "Understand dependency graph",
      steps: [
        "Parse all import statements",
        "Build dependency graph",
        "Identify circular dependencies",
        "Map external dependencies",
        "Identify shared dependencies"
      ]
    },
    
    impact: {
      description: "What else might be affected?",
      analysis: [
        "Direct dependencies (what this code needs)",
        "Dependents (what depends on this code)",
        "Shared dependencies (common imports)",
        "Transitive dependencies (dependencies of dependencies)"
      ]
    },
    
    test: {
      description: "Testing implications",
      considerations: [
        "What tests exist for this code?",
        "What tests might need updates?",
        "What tests should be added?",
        "Are there integration tests affected?"
      ]
    }
  },

  /**
   * Context prioritization
   */
  prioritization: {
    rules: [
      {
        priority: "critical",
        when: [
          "File is imported by many other files",
          "File exports public API",
          "Changes affect core functionality",
          "File is part of locked systems (Layer 7)"
        ],
        action: "Must review all dependents before changing"
      },
      {
        priority: "high",
        when: [
          "Similar patterns exist in codebase",
          "File is part of important feature",
          "Changes affect shared utilities"
        ],
        action: "Review similar patterns and maintain consistency"
      },
      {
        priority: "medium",
        when: [
          "File is related to change but not directly affected",
          "Patterns are somewhat similar"
        ],
        action: "Reference for context, less critical"
      },
      {
        priority: "low",
        when: [
          "File is only tangentially related",
          "Patterns are different domain"
        ],
        action: "Optional reference, low priority"
      }
    ]
  },

  /**
   * Knowledge synthesis framework
   */
  synthesis: {
    combine: {
      description: "Merge information from all relevant sources",
      steps: [
        "Gather all relevant context (patterns, files, dependencies)",
        "Identify common themes and patterns",
        "Note exceptions and edge cases",
        "Synthesize into coherent understanding"
      ]
    },
    
    prioritize: {
      description: "Focus on most relevant context first",
      order: [
        "1. Critical dependencies and dependents",
        "2. Similar patterns and implementations",
        "3. Related files and components",
        "4. General conventions and patterns",
        "5. Optional context and references"
      ]
    },
    
    verify: {
      description: "Ensure information is current and accurate",
      checks: [
        "Are the files still in the codebase?",
        "Have patterns changed recently?",
        "Are there newer implementations?",
        "Is the context still relevant?"
      ]
    },
    
    gaps: {
      description: "Identify missing context and request if critical",
      approach: [
        "Determine if missing context is critical",
        "If critical, request clarification or search more",
        "If not critical, proceed with available context",
        "Note assumptions based on missing context"
      ]
    }
  },

  /**
   * Similarity matching
   */
  similarity: {
    factors: [
      {
        factor: "Naming similarity",
        weight: 0.2,
        description: "Similar names suggest similar functionality"
      },
      {
        factor: "Structure similarity",
        weight: 0.3,
        description: "Similar file structure suggests similar patterns"
      },
      {
        factor: "Functional similarity",
        weight: 0.4,
        description: "Similar functionality is most important"
      },
      {
        factor: "Location similarity",
        weight: 0.1,
        description: "Files in same directory often related"
      }
    ],
    
    threshold: {
      high: 0.7, // Strong similarity, should definitely reference
      medium: 0.5, // Some similarity, worth reviewing
      low: 0.3 // Weak similarity, optional reference
    }
  }
} as const;

/**
 * Helper function to discover related files
 */
export function discoverRelatedFiles(
  targetFile: string,
  codebase: { files: string[] }
): RelatedFile[] {
  // Reference implementation - actual would search codebase
  const related: RelatedFile[] = [];
  
  // Would parse imports, search for similar files, etc.
  
  return related;
}

/**
 * Helper function to synthesize context
 */
export function synthesizeContext(
  patterns: CodebasePattern[],
  relatedFiles: RelatedFile[],
  dependencies: DependencyMap
): ContextSynthesis {
  return {
    patterns,
    relatedFiles,
    dependencies,
    conventions: {
      naming: [],
      structure: [],
      patterns: []
    },
    recommendations: []
  };
}

/**
 * Helper function to prioritize context
 */
export function prioritizeContext(
  context: RelatedFile[]
): Map<ContextPriority, RelatedFile[]> {
  const prioritized = new Map<ContextPriority, RelatedFile[]>();
  
  prioritized.set("critical", []);
  prioritized.set("high", []);
  prioritized.set("medium", []);
  prioritized.set("low", []);
  
  context.forEach(file => {
    // Determine priority based on relevance and relation type
    let priority: ContextPriority = "medium";
    
    if (file.relation === "imported-by" && file.relevance > 0.8) {
      priority = "critical";
    } else if (file.relevance > 0.7) {
      priority = "high";
    } else if (file.relevance < 0.4) {
      priority = "low";
    }
    
    prioritized.get(priority)?.push(file);
  });
  
  return prioritized;
}

/**
 * Type exports for use in other layers
 */
export type { CodebasePattern, RelatedFile, DependencyMap, ContextSynthesis, ContextPriority };





















