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
    readability: number;
    maintainability: number;
    performance: number;
    testability: number;
    overall: number;
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
    confidence: number;
}
/**
 * Main architecture intelligence configuration
 */
export declare const ARCHITECTURE_INTELLIGENCE: {
    /**
     * React/TypeScript pattern library
     */
    readonly patterns: {
        readonly react: {
            readonly componentStructure: {
                readonly order: readonly ["1. Imports (external libraries first, then local)", "2. Type definitions and interfaces", "3. Props interface (if needed)", "4. Component definition", "5. Hooks (in standard order: state, effects, callbacks, custom)", "6. Derived values (useMemo, useCallback)", "7. Event handlers", "8. Render logic (JSX)", "9. Export (if not default export)"];
                readonly rationale: "Standard order improves readability and maintainability";
            };
            readonly stateManagement: {
                readonly local: {
                    readonly useCase: "Component-only state";
                    readonly pattern: "useState";
                    readonly example: "const [isOpen, setIsOpen] = useState(false);";
                    readonly when: "State doesn't need to be shared with other components";
                };
                readonly derived: {
                    readonly useCase: "Expensive computations from props/state";
                    readonly pattern: "useMemo";
                    readonly example: "const sortedItems = useMemo(() => items.sort(...), [items]);";
                    readonly when: "Computation is expensive or creates new references unnecessarily";
                };
                readonly shared: {
                    readonly useCase: "State shared across multiple components";
                    readonly pattern: "Zustand or Jotai";
                    readonly example: "const useStore = create((set) => ({ count: 0, increment: () => set(...) }));";
                    readonly when: "State needs to be accessible from multiple components or persists across navigation";
                };
                readonly server: {
                    readonly useCase: "Server data and cache management";
                    readonly pattern: "TanStack Query (React Query)";
                    readonly example: "const { data, isLoading } = useQuery(['key'], fetcher);";
                    readonly when: "Fetching, caching, and synchronizing server state";
                };
                readonly form: {
                    readonly useCase: "Form state management";
                    readonly pattern: "React Hook Form";
                    readonly example: "const { register, handleSubmit } = useForm();";
                    readonly when: "Complex forms with validation and multiple fields";
                };
            };
            readonly hooks: {
                readonly order: readonly ["1. useState hooks (all state declarations)", "2. useEffect hooks (all effects)", "3. useCallback hooks (memoized callbacks)", "4. useMemo hooks (memoized values)", "5. Custom hooks"];
                readonly rationale: "Grouping by type improves readability and follows React conventions";
            };
            readonly performance: {
                readonly memoization: {
                    readonly component: {
                        readonly pattern: "React.memo";
                        readonly when: "Component receives same props frequently and renders are expensive";
                        readonly example: "export default React.memo(ExpensiveComponent);";
                    };
                    readonly callback: {
                        readonly pattern: "useCallback";
                        readonly when: "Callback passed to child components or used in dependency arrays";
                        readonly example: "const handleClick = useCallback(() => { ... }, [deps]);";
                    };
                    readonly value: {
                        readonly pattern: "useMemo";
                        readonly when: "Expensive computation or creating new objects/arrays";
                        readonly example: "const filtered = useMemo(() => items.filter(...), [items, filter]);";
                    };
                };
                readonly effects: {
                    readonly dependencies: "Always include all dependencies in dependency array";
                    readonly cleanup: "Return cleanup function if effect creates subscriptions, timers, etc.";
                    readonly rationale: "Prevents bugs and ensures proper cleanup";
                };
                readonly rendering: {
                    readonly avoidInlineFunctions: "Pass stable references, use useCallback for handlers";
                    readonly avoidInlineObjects: "Extract objects/arrays, use useMemo if needed";
                    readonly keyProps: "Always provide stable, unique keys for list items";
                };
            };
        };
        readonly typescript: {
            readonly types: {
                readonly unions: "Use types for unions, primitives, intersections";
                readonly example: "type Status = 'loading' | 'success' | 'error';";
            };
            readonly interfaces: {
                readonly objectShapes: "Use interfaces for object shapes";
                readonly example: "interface User { id: string; name: string; }";
            };
            readonly generics: {
                readonly useCase: "Reusable components and utilities";
                readonly example: "function useApi<T>(url: string): { data: T | null; loading: boolean } { ... }";
            };
            readonly utility: {
                readonly recommendation: "Leverage TypeScript utility types";
                readonly examples: readonly ["Pick<T, K> - Select properties", "Omit<T, K> - Exclude properties", "Partial<T> - Make all properties optional", "Required<T> - Make all properties required", "Record<K, V> - Map keys to values"];
            };
        };
        readonly styling: {
            readonly modules: {
                readonly pattern: "CSS Modules for component-scoped styles";
                readonly when: "Component-specific styles that shouldn't leak";
                readonly example: "import styles from './Component.module.css'; <div className={styles.container}>";
            };
            readonly variables: {
                readonly pattern: "CSS variables for theming";
                readonly when: "Global theme values, dynamic theming";
                readonly example: ":root { --color-primary: #00ffff; } .button { background: var(--color-primary); }";
            };
            readonly responsive: {
                readonly pattern: "Mobile-first approach";
                readonly rationale: "Easier to scale up than scale down";
                readonly example: "@media (min-width: 768px) { /* tablet+ styles */ }";
            };
            readonly accessibility: {
                readonly semantic: "Use semantic HTML elements";
                readonly aria: "ARIA attributes when needed for screen readers";
                readonly contrast: "Ensure sufficient color contrast (4.5:1 minimum)";
            };
        };
    };
    /**
     * Anti-pattern detection and suggestions
     */
    readonly antiPatterns: {
        readonly react: readonly [{
            readonly pattern: "Prop drilling";
            readonly description: "Passing props through multiple component layers";
            readonly detection: "Props passed through components that don't use them";
            readonly suggestion: "Use Context API or state management library (Zustand/Jotai)";
            readonly severity: "medium";
        }, {
            readonly pattern: "God components";
            readonly description: "Components that do too much";
            readonly detection: "Large components with multiple responsibilities";
            readonly suggestion: "Break into smaller, focused components";
            readonly severity: "high";
        }, {
            readonly pattern: "Mixed concerns";
            readonly description: "Business logic mixed with presentation";
            readonly detection: "UI components contain complex business logic";
            readonly suggestion: "Separate logic into hooks or utility functions";
            readonly severity: "high";
        }, {
            readonly pattern: "Missing dependencies";
            readonly description: "useEffect or useCallback missing dependencies";
            readonly detection: "Dependency arrays missing values used in effect/callback";
            readonly suggestion: "Include all dependencies or extract to separate effect";
            readonly severity: "high";
        }, {
            readonly pattern: "Inline object/array creation";
            readonly description: "Creating new objects/arrays in render";
            readonly detection: "Objects/arrays created inline in JSX or render";
            readonly suggestion: "Extract to constants or use useMemo";
            readonly severity: "medium";
        }, {
            readonly pattern: "Unnecessary re-renders";
            readonly description: "Components re-rendering when props/state haven't changed";
            readonly detection: "Missing React.memo or useMemo/useCallback";
            readonly suggestion: "Use React.memo, useMemo, or useCallback appropriately";
            readonly severity: "low";
        }];
        readonly typescript: readonly [{
            readonly pattern: "Any types";
            readonly description: "Using 'any' type defeats TypeScript's purpose";
            readonly detection: "Explicit 'any' type or implicit any";
            readonly suggestion: "Use proper types, 'unknown' if type truly unknown, or generics";
            readonly severity: "high";
        }, {
            readonly pattern: "Type assertions without validation";
            readonly description: "Asserting types without runtime checks";
            readonly detection: "Type assertions (as) without validation";
            readonly suggestion: "Validate data or use type guards";
            readonly severity: "high";
        }, {
            readonly pattern: "Overly complex types";
            readonly description: "Types that are hard to understand";
            readonly detection: "Deeply nested types, complex intersections/unions";
            readonly suggestion: "Break into smaller, named types";
            readonly severity: "medium";
        }];
        readonly general: readonly [{
            readonly pattern: "Implicit dependencies";
            readonly description: "Dependencies not clearly stated";
            readonly detection: "Functions/modules with hidden dependencies";
            readonly suggestion: "Make dependencies explicit (parameters, imports)";
            readonly severity: "medium";
        }, {
            readonly pattern: "Over-engineering";
            readonly description: "Unnecessary complexity for the problem";
            readonly detection: "Complex solutions for simple problems";
            readonly suggestion: "Prefer simplicity, add complexity only when needed";
            readonly severity: "low";
        }, {
            readonly pattern: "Duplicate code";
            readonly description: "Repeated code patterns";
            readonly detection: "Similar code in multiple places";
            readonly suggestion: "Extract to reusable functions/components";
            readonly severity: "medium";
        }];
        readonly detect: (code: string, context: {
            fileType: "tsx" | "ts" | "css";
        }) => AntiPatternResult[];
        readonly suggest: (antiPattern: AntiPatternResult) => string;
    };
    /**
     * Code quality heuristics
     */
    readonly codeQuality: {
        readonly readability: {
            readonly factors: readonly ["Clear variable and function names", "Single responsibility functions", "Appropriate comments (explain why, not what)", "Consistent formatting", "Logical code organization"];
            readonly score: (factors: {
                namingClarity: number;
                functionLength: number;
                commentQuality: number;
                formatting: number;
            }) => number;
        };
        readonly maintainability: {
            readonly factors: readonly ["DRY (Don't Repeat Yourself)", "Separation of concerns", "Explicit dependencies", "Testable structure", "Documentation where needed"];
            readonly score: (factors: {
                duplication: number;
                separation: number;
                explicitness: number;
                testability: number;
            }) => number;
        };
        readonly performance: {
            readonly factors: readonly ["Avoid unnecessary re-renders", "Optimize expensive operations", "Lazy loading where appropriate", "Bundle size awareness", "Memory leak prevention"];
            readonly score: (factors: {
                rerenders: number;
                optimization: number;
                lazyLoading: number;
                bundleSize: number;
                memoryManagement: number;
            }) => number;
        };
        readonly overall: (scores: {
            readability: number;
            maintainability: number;
            performance: number;
        }) => number;
    };
    /**
     * Architecture decision trees
     */
    readonly decisionTrees: {
        readonly stateManagement: {
            readonly question: "Where does this state need to be accessible?";
            readonly options: readonly [{
                readonly condition: "Component only";
                readonly decision: "useState";
                readonly rationale: "Simple, component-scoped state";
            }, {
                readonly condition: "Multiple components (siblings or distant)";
                readonly decision: "Zustand or Jotai";
                readonly rationale: "Lightweight, no provider needed";
            }, {
                readonly condition: "Server data (API responses, cache)";
                readonly decision: "TanStack Query";
                readonly rationale: "Handles fetching, caching, refetching, error states";
            }, {
                readonly condition: "Form state (validation, submission)";
                readonly decision: "React Hook Form";
                readonly rationale: "Optimized for forms, minimal re-renders";
            }, {
                readonly condition: "URL state (filters, pagination)";
                readonly decision: "URL search params + state";
                readonly rationale: "Persists in URL, shareable, bookmarkable";
            }];
        };
        readonly styling: {
            readonly question: "What's the scope of these styles?";
            readonly options: readonly [{
                readonly condition: "Single component";
                readonly decision: "CSS Modules";
                readonly rationale: "Component-scoped, no naming conflicts";
            }, {
                readonly condition: "Global theme (colors, spacing)";
                readonly decision: "CSS Variables";
                readonly rationale: "Dynamic theming, single source of truth";
            }, {
                readonly condition: "Utility classes (margin, padding)";
                readonly decision: "Tailwind CSS (if used) or utility classes";
                readonly rationale: "Consistent spacing, rapid development";
            }, {
                readonly condition: "Complex animations";
                readonly decision: "Framer Motion or CSS animations";
                readonly rationale: "More control and better performance";
            }, {
                readonly condition: "Inline styles needed";
                readonly decision: "CSS-in-JS or inline styles";
                readonly rationale: "Dynamic values, component props";
            }];
        };
        readonly componentStructure: {
            readonly question: "How should this component be organized?";
            readonly options: readonly [{
                readonly condition: "Simple presentational component";
                readonly decision: "Single file, minimal structure";
                readonly rationale: "Don't over-engineer simple components";
            }, {
                readonly condition: "Complex component with logic";
                readonly decision: "Separate logic into custom hooks";
                readonly rationale: "Separation of concerns, testability";
            }, {
                readonly condition: "Component with multiple sub-components";
                readonly decision: "Co-locate in same directory, separate files";
                readonly rationale: "Related components together, but not in one file";
            }, {
                readonly condition: "Reusable across projects";
                readonly decision: "Standalone package or shared library";
                readonly rationale: "Isolation, versioning, reusability";
            }];
        };
    };
    /**
     * Best practice enforcement
     */
    readonly bestPractices: {
        readonly react: readonly ["Use functional components with hooks", "Keep components small and focused", "Extract logic into custom hooks", "Use proper keys for list items", "Handle loading and error states", "Avoid side effects in render", "Clean up effects properly"];
        readonly typescript: readonly ["Avoid 'any' type", "Use interfaces for object shapes", "Use types for unions/primitives", "Leverage utility types", "Provide types for function parameters and returns", "Use type guards for runtime checks"];
        readonly performance: readonly ["Memoize expensive computations", "Use React.memo for expensive components", "Avoid creating objects/arrays in render", "Lazy load routes and heavy components", "Optimize images and assets", "Code split appropriately"];
        readonly accessibility: readonly ["Use semantic HTML", "Provide alt text for images", "Ensure keyboard navigation", "Maintain sufficient color contrast", "Use ARIA attributes when needed", "Test with screen readers"];
        readonly maintainability: readonly ["Follow consistent naming conventions", "Write self-documenting code", "Add comments for complex logic", "Keep functions small and focused", "Avoid deep nesting", "Extract magic numbers to constants"];
    };
    /**
     * Integration with Advanced Capability Layers
     */
    readonly integrations: {
        readonly codeGeneration: {
            readonly layer: "layer-21-code-generation.ts";
            readonly description: "Code generation patterns and algorithms";
            readonly usage: readonly ["Apply design patterns from Layer 21", "Use algorithm patterns for optimization", "Follow code quality principles", "Use TypeScript/React advanced patterns"];
        };
        readonly security: {
            readonly layer: "layer-24-security-patterns.ts";
            readonly description: "Security patterns and best practices";
            readonly usage: readonly ["Apply OWASP Top 10 prevention patterns", "Use authentication/authorization patterns", "Implement input validation patterns", "Follow API security patterns"];
        };
        readonly refactoring: {
            readonly layer: "layer-25-refactoring-quality.ts";
            readonly description: "Refactoring techniques and code quality";
            readonly usage: readonly ["Detect and address code smells", "Apply refactoring techniques", "Manage technical debt", "Track code quality metrics"];
        };
        readonly architecture: {
            readonly layer: "layer-26-architecture-patterns.ts";
            readonly description: "Advanced architecture patterns";
            readonly usage: readonly ["Apply microservices patterns when appropriate", "Use DDD concepts for domain modeling", "Implement event-driven patterns", "Apply layered architecture patterns"];
        };
        readonly apiDesign: {
            readonly layer: "layer-27-api-design.ts";
            readonly description: "API design patterns";
            readonly usage: readonly ["Follow REST API design patterns", "Implement GraphQL patterns", "Use API integration patterns", "Follow API documentation patterns"];
        };
        readonly database: {
            readonly layer: "layer-28-database-design.ts";
            readonly description: "Database design patterns";
            readonly usage: readonly ["Apply schema design patterns", "Optimize queries", "Use database patterns (Repository, Unit of Work)", "Implement transaction management"];
        };
        readonly documentation: {
            readonly layer: "layer-29-documentation.ts";
            readonly description: "Documentation patterns";
            readonly usage: readonly ["Follow code documentation standards", "Document APIs properly", "Write architecture documentation", "Use self-documenting code patterns"];
        };
    };
};
/**
 * Helper function to make architecture decision
 */
export declare function makeArchitectureDecision(question: string, context: Record<string, unknown>): ArchitectureDecision;
/**
 * Helper function to assess code quality
 */
export declare function assessCodeQuality(code: string): CodeQualityFactors;
/**
 * Type exports for use in other layers
 */
export type { CodeQualityFactors, AntiPatternResult, ArchitectureDecision };
//# sourceMappingURL=layer-11-architecture-intelligence.d.ts.map