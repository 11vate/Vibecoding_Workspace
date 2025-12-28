/**
 * LAYER 11 — ARCHITECTURE INTELLIGENCE
 * 
 * Domain-specific architectural expertise and code quality patterns
 * 
 * This layer provides React/TypeScript pattern recognition, code quality heuristics,
 * anti-pattern detection, and architecture decision trees to guide code generation
 * and ensure professional standards.
 */

/**
 * Code quality factors
 */
export interface CodeQualityFactors {
  readability: number; // 0-1
  maintainability: number; // 0-1
  performance: number; // 0-1
  testability: number; // 0-1
  overall: number; // Weighted average
}

/**
 * Anti-pattern detection result
 */
export interface AntiPatternResult {
  pattern: string;
  detected: boolean;
  location?: string;
  severity: "low" | "medium" | "high";
  suggestion: string;
}

/**
 * Architecture decision result
 */
export interface ArchitectureDecision {
  question: string;
  decision: string;
  rationale: string;
  alternatives?: string[];
  confidence: number; // 0-1
}

/**
 * Main architecture intelligence configuration
 */
export const ARCHITECTURE_INTELLIGENCE = {
  /**
   * React/TypeScript pattern library
   */
  patterns: {
    react: {
      componentStructure: {
        order: [
          "1. Imports (external libraries first, then local)",
          "2. Type definitions and interfaces",
          "3. Props interface (if needed)",
          "4. Component definition",
          "5. Hooks (in standard order: state, effects, callbacks, custom)",
          "6. Derived values (useMemo, useCallback)",
          "7. Event handlers",
          "8. Render logic (JSX)",
          "9. Export (if not default export)"
        ],
        rationale: "Standard order improves readability and maintainability"
      },
      
      stateManagement: {
        local: {
          useCase: "Component-only state",
          pattern: "useState",
          example: "const [isOpen, setIsOpen] = useState(false);",
          when: "State doesn't need to be shared with other components"
        },
        
        derived: {
          useCase: "Expensive computations from props/state",
          pattern: "useMemo",
          example: "const sortedItems = useMemo(() => items.sort(...), [items]);",
          when: "Computation is expensive or creates new references unnecessarily"
        },
        
        shared: {
          useCase: "State shared across multiple components",
          pattern: "Zustand or Jotai",
          example: "const useStore = create((set) => ({ count: 0, increment: () => set(...) }));",
          when: "State needs to be accessible from multiple components or persists across navigation"
        },
        
        server: {
          useCase: "Server data and cache management",
          pattern: "TanStack Query (React Query)",
          example: "const { data, isLoading } = useQuery(['key'], fetcher);",
          when: "Fetching, caching, and synchronizing server state"
        },
        
        form: {
          useCase: "Form state management",
          pattern: "React Hook Form",
          example: "const { register, handleSubmit } = useForm();",
          when: "Complex forms with validation and multiple fields"
        }
      },
      
      hooks: {
        order: [
          "1. useState hooks (all state declarations)",
          "2. useEffect hooks (all effects)",
          "3. useCallback hooks (memoized callbacks)",
          "4. useMemo hooks (memoized values)",
          "5. Custom hooks"
        ],
        rationale: "Grouping by type improves readability and follows React conventions"
      },
      
      performance: {
        memoization: {
          component: {
            pattern: "React.memo",
            when: "Component receives same props frequently and renders are expensive",
            example: "export default React.memo(ExpensiveComponent);"
          },
          
          callback: {
            pattern: "useCallback",
            when: "Callback passed to child components or used in dependency arrays",
            example: "const handleClick = useCallback(() => { ... }, [deps]);"
          },
          
          value: {
            pattern: "useMemo",
            when: "Expensive computation or creating new objects/arrays",
            example: "const filtered = useMemo(() => items.filter(...), [items, filter]);"
          }
        },
        
        effects: {
          dependencies: "Always include all dependencies in dependency array",
          cleanup: "Return cleanup function if effect creates subscriptions, timers, etc.",
          rationale: "Prevents bugs and ensures proper cleanup"
        },
        
        rendering: {
          avoidInlineFunctions: "Pass stable references, use useCallback for handlers",
          avoidInlineObjects: "Extract objects/arrays, use useMemo if needed",
          keyProps: "Always provide stable, unique keys for list items"
        }
      }
    },
    
    typescript: {
      types: {
        explicit: {
          preference: "Explicit types over inference when it aids clarity",
          when: "Function parameters, return types, complex types, public APIs",
          example: "function process(data: UserData): ProcessedResult { ... }"
        },
        
        inference: {
          preference: "Inference when type is obvious from context",
          when: "Local variables, simple assignments, obvious types",
          example: "const count = 0; // inferred as number"
        }
      },
      
      interfaces: {
        objectShapes: "Use interfaces for object shapes",
        example: "interface User { id: string; name: string; }"
      },
      
      types: {
        unions: "Use types for unions, primitives, intersections",
        example: "type Status = 'loading' | 'success' | 'error';"
      },
      
      generics: {
        useCase: "Reusable components and utilities",
        example: "function useApi<T>(url: string): { data: T | null; loading: boolean } { ... }"
      },
      
      utility: {
        recommendation: "Leverage TypeScript utility types",
        examples: [
          "Pick<T, K> - Select properties",
          "Omit<T, K> - Exclude properties",
          "Partial<T> - Make all properties optional",
          "Required<T> - Make all properties required",
          "Record<K, V> - Map keys to values"
        ]
      }
    },
    
    styling: {
      modules: {
        pattern: "CSS Modules for component-scoped styles",
        when: "Component-specific styles that shouldn't leak",
        example: "import styles from './Component.module.css'; <div className={styles.container}>"
      },
      
      variables: {
        pattern: "CSS variables for theming",
        when: "Global theme values, dynamic theming",
        example: ":root { --color-primary: #00ffff; } .button { background: var(--color-primary); }"
      },
      
      responsive: {
        pattern: "Mobile-first approach",
        rationale: "Easier to scale up than scale down",
        example: "@media (min-width: 768px) { /* tablet+ styles */ }"
      },
      
      accessibility: {
        semantic: "Use semantic HTML elements",
        aria: "ARIA attributes when needed for screen readers",
        contrast: "Ensure sufficient color contrast (4.5:1 minimum)"
      }
    }
  },

  /**
   * Anti-pattern detection and suggestions
   */
  antiPatterns: {
    react: [
      {
        pattern: "Prop drilling",
        description: "Passing props through multiple component layers",
        detection: "Props passed through components that don't use them",
        suggestion: "Use Context API or state management library (Zustand/Jotai)",
        severity: "medium"
      },
      {
        pattern: "God components",
        description: "Components that do too much",
        detection: "Large components with multiple responsibilities",
        suggestion: "Break into smaller, focused components",
        severity: "high"
      },
      {
        pattern: "Mixed concerns",
        description: "Business logic mixed with presentation",
        detection: "UI components contain complex business logic",
        suggestion: "Separate logic into hooks or utility functions",
        severity: "high"
      },
      {
        pattern: "Missing dependencies",
        description: "useEffect or useCallback missing dependencies",
        detection: "Dependency arrays missing values used in effect/callback",
        suggestion: "Include all dependencies or extract to separate effect",
        severity: "high"
      },
      {
        pattern: "Inline object/array creation",
        description: "Creating new objects/arrays in render",
        detection: "Objects/arrays created inline in JSX or render",
        suggestion: "Extract to constants or use useMemo",
        severity: "medium"
      },
      {
        pattern: "Unnecessary re-renders",
        description: "Components re-rendering when props/state haven't changed",
        detection: "Missing React.memo or useMemo/useCallback",
        suggestion: "Use React.memo, useMemo, or useCallback appropriately",
        severity: "low"
      }
    ],
    
    typescript: [
      {
        pattern: "Any types",
        description: "Using 'any' type defeats TypeScript's purpose",
        detection: "Explicit 'any' type or implicit any",
        suggestion: "Use proper types, 'unknown' if type truly unknown, or generics",
        severity: "high"
      },
      {
        pattern: "Type assertions without validation",
        description: "Asserting types without runtime checks",
        detection: "Type assertions (as) without validation",
        suggestion: "Validate data or use type guards",
        severity: "high"
      },
      {
        pattern: "Overly complex types",
        description: "Types that are hard to understand",
        detection: "Deeply nested types, complex intersections/unions",
        suggestion: "Break into smaller, named types",
        severity: "medium"
      }
    ],
    
    general: [
      {
        pattern: "Implicit dependencies",
        description: "Dependencies not clearly stated",
        detection: "Functions/modules with hidden dependencies",
        suggestion: "Make dependencies explicit (parameters, imports)",
        severity: "medium"
      },
      {
        pattern: "Over-engineering",
        description: "Unnecessary complexity for the problem",
        detection: "Complex solutions for simple problems",
        suggestion: "Prefer simplicity, add complexity only when needed",
        severity: "low"
      },
      {
        pattern: "Duplicate code",
        description: "Repeated code patterns",
        detection: "Similar code in multiple places",
        suggestion: "Extract to reusable functions/components",
        severity: "medium"
      }
    ],
    
    detect: (code: string, context: { fileType: "tsx" | "ts" | "css" }): AntiPatternResult[] => {
      // Reference implementation - actual implementation would analyze code
      const results: AntiPatternResult[] = [];
      
      // Example: Check for prop drilling
      // Example: Check for missing dependencies
      // Example: Check for any types
      
      return results;
    },
    
    suggest: (antiPattern: AntiPatternResult): string => {
      return `${antiPattern.suggestion} (Severity: ${antiPattern.severity})`;
    }
  },

  /**
   * Code quality heuristics
   */
  codeQuality: {
    readability: {
      factors: [
        "Clear variable and function names",
        "Single responsibility functions",
        "Appropriate comments (explain why, not what)",
        "Consistent formatting",
        "Logical code organization"
      ],
      
      score: (factors: {
        namingClarity: number;
        functionLength: number;
        commentQuality: number;
        formatting: number;
      }): number => {
        // Simple heuristic - actual would be more sophisticated
        return (
          factors.namingClarity * 0.3 +
          (factors.functionLength < 50 ? 0.3 : 0.1) +
          factors.commentQuality * 0.2 +
          factors.formatting * 0.2
        );
      }
    },
    
    maintainability: {
      factors: [
        "DRY (Don't Repeat Yourself)",
        "Separation of concerns",
        "Explicit dependencies",
        "Testable structure",
        "Documentation where needed"
      ],
      
      score: (factors: {
        duplication: number; // Lower is better
        separation: number;
        explicitness: number;
        testability: number;
      }): number => {
        return (
          (1 - factors.duplication) * 0.3 +
          factors.separation * 0.3 +
          factors.explicitness * 0.2 +
          factors.testability * 0.2
        );
      }
    },
    
    performance: {
      factors: [
        "Avoid unnecessary re-renders",
        "Optimize expensive operations",
        "Lazy loading where appropriate",
        "Bundle size awareness",
        "Memory leak prevention"
      ],
      
      score: (factors: {
        rerenders: number; // Lower is better
        optimization: number;
        lazyLoading: number;
        bundleSize: number;
        memoryManagement: number;
      }): number => {
        return (
          (1 - factors.rerenders) * 0.3 +
          factors.optimization * 0.3 +
          factors.lazyLoading * 0.2 +
          factors.bundleSize * 0.1 +
          factors.memoryManagement * 0.1
        );
      }
    },
    
    overall: (scores: {
      readability: number;
      maintainability: number;
      performance: number;
    }): number => {
      return (
        scores.readability * 0.4 +
        scores.maintainability * 0.4 +
        scores.performance * 0.2
      );
    }
  },

  /**
   * Architecture decision trees
   */
  decisionTrees: {
    stateManagement: {
      question: "Where does this state need to be accessible?",
      options: [
        {
          condition: "Component only",
          decision: "useState",
          rationale: "Simple, component-scoped state"
        },
        {
          condition: "Multiple components (siblings or distant)",
          decision: "Zustand or Jotai",
          rationale: "Lightweight, no provider needed"
        },
        {
          condition: "Server data (API responses, cache)",
          decision: "TanStack Query",
          rationale: "Handles fetching, caching, refetching, error states"
        },
        {
          condition: "Form state (validation, submission)",
          decision: "React Hook Form",
          rationale: "Optimized for forms, minimal re-renders"
        },
        {
          condition: "URL state (filters, pagination)",
          decision: "URL search params + state",
          rationale: "Persists in URL, shareable, bookmarkable"
        }
      ]
    },
    
    styling: {
      question: "What's the scope of these styles?",
      options: [
        {
          condition: "Single component",
          decision: "CSS Modules",
          rationale: "Component-scoped, no naming conflicts"
        },
        {
          condition: "Global theme (colors, spacing)",
          decision: "CSS Variables",
          rationale: "Dynamic theming, single source of truth"
        },
        {
          condition: "Utility classes (margin, padding)",
          decision: "Tailwind CSS (if used) or utility classes",
          rationale: "Consistent spacing, rapid development"
        },
        {
          condition: "Complex animations",
          decision: "Framer Motion or CSS animations",
          rationale: "More control and better performance"
        },
        {
          condition: "Inline styles needed",
          decision: "CSS-in-JS or inline styles",
          rationale: "Dynamic values, component props"
        }
      ]
    },
    
    componentStructure: {
      question: "How should this component be organized?",
      options: [
        {
          condition: "Simple presentational component",
          decision: "Single file, minimal structure",
          rationale: "Don't over-engineer simple components"
        },
        {
          condition: "Complex component with logic",
          decision: "Separate logic into custom hooks",
          rationale: "Separation of concerns, testability"
        },
        {
          condition: "Component with multiple sub-components",
          decision: "Co-locate in same directory, separate files",
          rationale: "Related components together, but not in one file"
        },
        {
          condition: "Reusable across projects",
          decision: "Standalone package or shared library",
          rationale: "Isolation, versioning, reusability"
        }
      ]
    }
  },

  /**
   * Best practice enforcement
   */
  bestPractices: {
    react: [
      "Use functional components with hooks",
      "Keep components small and focused",
      "Extract logic into custom hooks",
      "Use proper keys for list items",
      "Handle loading and error states",
      "Avoid side effects in render",
      "Clean up effects properly"
    ],
    
    typescript: [
      "Avoid 'any' type",
      "Use interfaces for object shapes",
      "Use types for unions/primitives",
      "Leverage utility types",
      "Provide types for function parameters and returns",
      "Use type guards for runtime checks"
    ],
    
    performance: [
      "Memoize expensive computations",
      "Use React.memo for expensive components",
      "Avoid creating objects/arrays in render",
      "Lazy load routes and heavy components",
      "Optimize images and assets",
      "Code split appropriately"
    ],
    
    accessibility: [
      "Use semantic HTML",
      "Provide alt text for images",
      "Ensure keyboard navigation",
      "Maintain sufficient color contrast",
      "Use ARIA attributes when needed",
      "Test with screen readers"
    ],
    
    maintainability: [
      "Follow consistent naming conventions",
      "Write self-documenting code",
      "Add comments for complex logic",
      "Keep functions small and focused",
      "Avoid deep nesting",
      "Extract magic numbers to constants"
    ]
  },

  /**
   * Integration with Advanced Capability Layers
   */
  integrations: {
    codeGeneration: {
      layer: "layer-21-code-generation.ts",
      description: "Code generation patterns and algorithms",
      usage: [
        "Apply design patterns from Layer 21",
        "Use algorithm patterns for optimization",
        "Follow code quality principles",
        "Use TypeScript/React advanced patterns"
      ]
    },
    
    security: {
      layer: "layer-24-security-patterns.ts",
      description: "Security patterns and best practices",
      usage: [
        "Apply OWASP Top 10 prevention patterns",
        "Use authentication/authorization patterns",
        "Implement input validation patterns",
        "Follow API security patterns"
      ]
    },
    
    refactoring: {
      layer: "layer-25-refactoring-quality.ts",
      description: "Refactoring techniques and code quality",
      usage: [
        "Detect and address code smells",
        "Apply refactoring techniques",
        "Manage technical debt",
        "Track code quality metrics"
      ]
    },
    
    architecture: {
      layer: "layer-26-architecture-patterns.ts",
      description: "Advanced architecture patterns",
      usage: [
        "Apply microservices patterns when appropriate",
        "Use DDD concepts for domain modeling",
        "Implement event-driven patterns",
        "Apply layered architecture patterns"
      ]
    },
    
    apiDesign: {
      layer: "layer-27-api-design.ts",
      description: "API design patterns",
      usage: [
        "Follow REST API design patterns",
        "Implement GraphQL patterns",
        "Use API integration patterns",
        "Follow API documentation patterns"
      ]
    },
    
    database: {
      layer: "layer-28-database-design.ts",
      description: "Database design patterns",
      usage: [
        "Apply schema design patterns",
        "Optimize queries",
        "Use database patterns (Repository, Unit of Work)",
        "Implement transaction management"
      ]
    },
    
    documentation: {
      layer: "layer-29-documentation.ts",
      description: "Documentation patterns",
      usage: [
        "Follow code documentation standards",
        "Document APIs properly",
        "Write architecture documentation",
        "Use self-documenting code patterns"
      ]
    }
  }
} as const;

/**
 * Helper function to make architecture decision
 */
export function makeArchitectureDecision(
  question: string,
  context: Record<string, unknown>
): ArchitectureDecision {
  // Reference implementation - actual would use decision trees
  return {
    question,
    decision: "Selected approach",
    rationale: "Based on context and best practices",
    confidence: 0.8
  };
}

/**
 * Helper function to assess code quality
 */
export function assessCodeQuality(code: string): CodeQualityFactors {
  // Reference implementation - actual would analyze code
  return {
    readability: 0.8,
    maintainability: 0.8,
    performance: 0.8,
    testability: 0.8,
    overall: 0.8
  };
}

/**
 * Type exports for use in other layers
 */
export type { CodeQualityFactors, AntiPatternResult, ArchitectureDecision };

