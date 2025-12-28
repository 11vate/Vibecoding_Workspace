/**
 * LAYER 21 — ADVANCED CODE GENERATION & PATTERNS
 *
 * Advanced code generation patterns, algorithms, and data structures
 *
 * This layer provides comprehensive pattern libraries for design patterns,
 * algorithms, data structures, and code generation strategies to enable
 * high-quality, maintainable code generation.
 */
/**
 * Design pattern category
 */
export type PatternCategory = "creational" | "structural" | "behavioral" | "modern";
/**
 * Pattern usage context
 */
export interface PatternUsage {
    whenToUse: string[];
    whenNotToUse: string[];
    alternatives: string[];
    example: string;
}
/**
 * Design pattern definition
 */
export interface DesignPattern {
    name: string;
    category: PatternCategory;
    description: string;
    problem: string;
    solution: string;
    usage: PatternUsage;
    codeExample?: string;
}
/**
 * Algorithm complexity
 */
export interface AlgorithmComplexity {
    time: string;
    space: string;
    bestCase?: string;
    averageCase?: string;
    worstCase?: string;
}
/**
 * Algorithm pattern definition
 */
export interface AlgorithmPattern {
    name: string;
    description: string;
    complexity: AlgorithmComplexity;
    useCases: string[];
    codeExample?: string;
}
/**
 * Data structure pattern definition
 */
export interface DataStructurePattern {
    name: string;
    description: string;
    operations: {
        access: string;
        search: string;
        insert: string;
        delete: string;
    };
    useCases: string[];
    codeExample?: string;
}
/**
 * Main code generation patterns library
 */
export declare const CODE_GENERATION_PATTERNS: {
    /**
     * Design Pattern Library (GoF + Modern Patterns)
     */
    readonly designPatterns: {
        readonly creational: {
            readonly singleton: {
                readonly name: "Singleton";
                readonly category: PatternCategory;
                readonly description: "Ensures a class has only one instance";
                readonly problem: "Need to ensure only one instance of a class exists";
                readonly solution: "Create a single instance and provide global access";
                readonly usage: {
                    readonly whenToUse: readonly ["Need single instance (logger, cache, config)", "Global state management"];
                    readonly whenNotToUse: readonly ["Testability concerns", "Multi-threaded environments", "Global state anti-pattern"];
                    readonly alternatives: readonly ["Dependency Injection", "Factory Pattern"];
                    readonly example: "Logger instance, application configuration";
                };
            };
            readonly factory: {
                readonly name: "Factory Method";
                readonly category: PatternCategory;
                readonly description: "Creates objects without specifying exact classes";
                readonly problem: "Need to create objects but exact type unknown at compile time";
                readonly solution: "Define interface for creating objects, let subclasses decide which class to instantiate";
                readonly usage: {
                    readonly whenToUse: readonly ["Object creation logic is complex", "Need to support multiple types", "Decouple creation from usage"];
                    readonly whenNotToUse: readonly ["Simple object creation", "Only one type needed"];
                    readonly alternatives: readonly ["Builder Pattern", "Abstract Factory"];
                    readonly example: "Creating different UI components based on props";
                };
            };
            readonly builder: {
                readonly name: "Builder";
                readonly category: PatternCategory;
                readonly description: "Constructs complex objects step by step";
                readonly problem: "Complex object construction with many parameters";
                readonly solution: "Separate construction from representation, allow step-by-step construction";
                readonly usage: {
                    readonly whenToUse: readonly ["Complex object construction", "Many optional parameters", "Immutability desired"];
                    readonly whenNotToUse: readonly ["Simple object creation", "Fixed parameter sets"];
                    readonly alternatives: readonly ["Factory Pattern", "Constructor with options object"];
                    readonly example: "Building query objects, configuration objects";
                };
            };
            readonly repository: {
                readonly name: "Repository";
                readonly category: PatternCategory;
                readonly description: "Abstracts data access logic";
                readonly problem: "Need to decouple business logic from data access";
                readonly solution: "Create abstraction layer for data access operations";
                readonly usage: {
                    readonly whenToUse: readonly ["Decouple business logic from data access", "Easier testing", "Multiple data sources"];
                    readonly whenNotToUse: readonly ["Simple CRUD operations", "No need for abstraction"];
                    readonly alternatives: readonly ["Active Record Pattern", "Data Access Object (DAO)"];
                    readonly example: "Data access layer for database operations";
                };
            };
            readonly unitOfWork: {
                readonly name: "Unit of Work";
                readonly category: PatternCategory;
                readonly description: "Maintains list of objects affected by transaction";
                readonly problem: "Need to coordinate changes across multiple objects";
                readonly solution: "Track all objects affected by transaction and coordinate writes";
                readonly usage: {
                    readonly whenToUse: readonly ["Multiple object updates in transaction", "Need transactional integrity", "Complex data operations"];
                    readonly whenNotToUse: readonly ["Simple single-object operations", "No transaction requirements"];
                    readonly alternatives: readonly ["Repository Pattern", "Transaction Script"];
                    readonly example: "Coordinating database updates across multiple entities";
                };
            };
        };
        readonly structural: {
            readonly adapter: {
                readonly name: "Adapter";
                readonly category: PatternCategory;
                readonly description: "Allows incompatible interfaces to work together";
                readonly problem: "Need to use class with incompatible interface";
                readonly solution: "Create adapter class that translates between interfaces";
                readonly usage: {
                    readonly whenToUse: readonly ["Integrating incompatible interfaces", "Using third-party libraries", "Legacy code integration"];
                    readonly whenNotToUse: readonly ["Interfaces already compatible", "Can modify source code"];
                    readonly alternatives: readonly ["Facade Pattern", "Bridge Pattern"];
                    readonly example: "Adapting external API to internal interface";
                };
            };
            readonly decorator: {
                readonly name: "Decorator";
                readonly category: PatternCategory;
                readonly description: "Adds behavior to objects dynamically";
                readonly problem: "Need to add behavior to objects without modifying structure";
                readonly solution: "Wrap object with decorator that adds behavior";
                readonly usage: {
                    readonly whenToUse: readonly ["Need to add behavior dynamically", "Avoid class explosion", "Composition over inheritance"];
                    readonly whenNotToUse: readonly ["Fixed behavior", "Simple extension"];
                    readonly alternatives: readonly ["Strategy Pattern", "Composition"];
                    readonly example: "React Higher-Order Components, middleware";
                };
            };
            readonly facade: {
                readonly name: "Facade";
                readonly category: PatternCategory;
                readonly description: "Provides simplified interface to complex subsystem";
                readonly problem: "Complex subsystem with many classes";
                readonly solution: "Create facade that provides simple interface to subsystem";
                readonly usage: {
                    readonly whenToUse: readonly ["Simplify complex subsystems", "Reduce coupling", "Provide convenient interface"];
                    readonly whenNotToUse: readonly ["Need fine-grained control", "Simple subsystems"];
                    readonly alternatives: readonly ["Adapter Pattern", "Direct subsystem access"];
                    readonly example: "API client wrapping HTTP operations";
                };
            };
        };
        readonly behavioral: {
            readonly strategy: {
                readonly name: "Strategy";
                readonly category: PatternCategory;
                readonly description: "Defines family of algorithms, makes them interchangeable";
                readonly problem: "Need to vary algorithm independently of clients";
                readonly solution: "Define algorithm interface, encapsulate each algorithm";
                readonly usage: {
                    readonly whenToUse: readonly ["Multiple ways to perform task", "Want to avoid conditional logic", "Algorithm selection at runtime"];
                    readonly whenNotToUse: readonly ["Single algorithm", "Simple conditional logic"];
                    readonly alternatives: readonly ["Template Method", "Function parameters"];
                    readonly example: "Payment processing strategies, sorting algorithms";
                };
            };
            readonly observer: {
                readonly name: "Observer";
                readonly category: PatternCategory;
                readonly description: "Defines one-to-many dependency between objects";
                readonly problem: "Need to notify multiple objects about state changes";
                readonly solution: "Define subject and observers, notify observers of changes";
                readonly usage: {
                    readonly whenToUse: readonly ["State changes affect multiple objects", "Loose coupling desired", "Event-driven systems"];
                    readonly whenNotToUse: readonly ["Tight coupling acceptable", "Simple state management"];
                    readonly alternatives: readonly ["Pub/Sub Pattern", "Event Emitter"];
                    readonly example: "React state updates, event systems";
                };
            };
            readonly command: {
                readonly name: "Command";
                readonly category: PatternCategory;
                readonly description: "Encapsulates request as object";
                readonly problem: "Need to parameterize objects with requests";
                readonly solution: "Encapsulate request as object, allowing queuing, logging, undo";
                readonly usage: {
                    readonly whenToUse: readonly ["Need to queue requests", "Need undo/redo", "Need to log requests", "Decouple invoker from receiver"];
                    readonly whenNotToUse: readonly ["Simple function calls", "No need for queuing/logging"];
                    readonly alternatives: readonly ["Function calls", "Strategy Pattern"];
                    readonly example: "Undo/redo functionality, command queues";
                };
            };
            readonly templateMethod: {
                readonly name: "Template Method";
                readonly category: PatternCategory;
                readonly description: "Defines algorithm skeleton, lets subclasses override steps";
                readonly problem: "Algorithm with steps, some vary";
                readonly solution: "Define algorithm in base class, let subclasses override specific steps";
                readonly usage: {
                    readonly whenToUse: readonly ["Algorithm with invariant and variant parts", "Code reuse desired", "Framework development"];
                    readonly whenNotToUse: readonly ["Algorithm completely varies", "Simple functions"];
                    readonly alternatives: readonly ["Strategy Pattern", "Composition"];
                    readonly example: "React lifecycle methods, framework hooks";
                };
            };
        };
    };
    /**
     * Algorithm Patterns
     */
    readonly algorithms: {
        readonly sorting: {
            readonly quickSort: {
                readonly name: "Quick Sort";
                readonly description: "Divide and conquer sorting algorithm";
                readonly complexity: {
                    readonly time: "O(n log n) average, O(n²) worst";
                    readonly space: "O(log n)";
                    readonly averageCase: "O(n log n)";
                    readonly worstCase: "O(n²)";
                };
                readonly useCases: readonly ["General-purpose sorting", "In-place sorting needed", "Average case performance important"];
                readonly codeExample: "Use Array.sort() for most cases";
            };
            readonly mergeSort: {
                readonly name: "Merge Sort";
                readonly description: "Stable divide and conquer sorting";
                readonly complexity: {
                    readonly time: "O(n log n)";
                    readonly space: "O(n)";
                    readonly worstCase: "O(n log n)";
                };
                readonly useCases: readonly ["Stable sort needed", "Consistent performance required", "Can afford extra space"];
                readonly codeExample: "Use for stable sorting requirements";
            };
        };
        readonly searching: {
            readonly binarySearch: {
                readonly name: "Binary Search";
                readonly description: "Search in sorted array";
                readonly complexity: {
                    readonly time: "O(log n)";
                    readonly space: "O(1)";
                    readonly bestCase: "O(1)";
                    readonly worstCase: "O(log n)";
                };
                readonly useCases: readonly ["Sorted arrays", "Fast search needed", "Large datasets"];
                readonly codeExample: "Searching in sorted arrays or trees";
            };
            readonly linearSearch: {
                readonly name: "Linear Search";
                readonly description: "Sequential search through array";
                readonly complexity: {
                    readonly time: "O(n)";
                    readonly space: "O(1)";
                    readonly bestCase: "O(1)";
                    readonly worstCase: "O(n)";
                };
                readonly useCases: readonly ["Unsorted arrays", "Small datasets", "Simple implementation"];
                readonly codeExample: "Array.find(), Array.includes()";
            };
        };
        readonly graph: {
            readonly depthFirstSearch: {
                readonly name: "Depth-First Search (DFS)";
                readonly description: "Explore graph by going deep";
                readonly complexity: {
                    readonly time: "O(V + E)";
                    readonly space: "O(V)";
                };
                readonly useCases: readonly ["Path finding", "Cycle detection", "Topological sorting"];
                readonly codeExample: "Tree traversal, maze solving";
            };
            readonly breadthFirstSearch: {
                readonly name: "Breadth-First Search (BFS)";
                readonly description: "Explore graph level by level";
                readonly complexity: {
                    readonly time: "O(V + E)";
                    readonly space: "O(V)";
                };
                readonly useCases: readonly ["Shortest path (unweighted)", "Level-order traversal", "Social network analysis"];
                readonly codeExample: "Finding shortest path, level-order tree traversal";
            };
        };
        readonly dynamicProgramming: {
            readonly memoization: {
                readonly name: "Memoization";
                readonly description: "Cache results of expensive function calls";
                readonly complexity: {
                    readonly time: "Reduces from exponential to polynomial";
                    readonly space: "O(n) for cache";
                };
                readonly useCases: readonly ["Overlapping subproblems", "Optimal substructure", "Recursive functions"];
                readonly codeExample: "Fibonacci, factorial with caching";
            };
        };
    };
    /**
     * Data Structure Patterns
     */
    readonly dataStructures: {
        readonly array: {
            readonly name: "Array";
            readonly description: "Contiguous memory allocation";
            readonly operations: {
                readonly access: "O(1)";
                readonly search: "O(n)";
                readonly insert: "O(n)";
                readonly delete: "O(n)";
            };
            readonly useCases: readonly ["Indexed access", "Simple collections", "Fixed size known"];
            readonly codeExample: "const arr: number[] = [1, 2, 3];";
        };
        readonly linkedList: {
            readonly name: "Linked List";
            readonly description: "Nodes connected by references";
            readonly operations: {
                readonly access: "O(n)";
                readonly search: "O(n)";
                readonly insert: "O(1) at head, O(n) elsewhere";
                readonly delete: "O(1) at head, O(n) elsewhere";
            };
            readonly useCases: readonly ["Frequent insertions/deletions", "Dynamic size", "Memory efficient"];
            readonly codeExample: "Use when frequent insertions/deletions at head";
        };
        readonly hashTable: {
            readonly name: "Hash Table";
            readonly description: "Key-value pairs with hash function";
            readonly operations: {
                readonly access: "O(1) average";
                readonly search: "O(1) average";
                readonly insert: "O(1) average";
                readonly delete: "O(1) average";
            };
            readonly useCases: readonly ["Fast lookups", "Key-value storage", "Caching"];
            readonly codeExample: "Map, Set, object as hash table";
        };
        readonly tree: {
            readonly name: "Tree";
            readonly description: "Hierarchical data structure";
            readonly operations: {
                readonly access: "O(log n) balanced";
                readonly search: "O(log n) balanced";
                readonly insert: "O(log n) balanced";
                readonly delete: "O(log n) balanced";
            };
            readonly useCases: readonly ["Hierarchical data", "Search operations", "Sorted data"];
            readonly codeExample: "Binary search tree, DOM tree, file system";
        };
        readonly graph: {
            readonly name: "Graph";
            readonly description: "Nodes and edges";
            readonly operations: {
                readonly access: "O(V + E)";
                readonly search: "O(V + E)";
                readonly insert: "O(1)";
                readonly delete: "O(E)";
            };
            readonly useCases: readonly ["Relationships", "Networks", "Social graphs"];
            readonly codeExample: "Social networks, routing, dependencies";
        };
    };
    /**
     * TypeScript/React Advanced Patterns
     */
    readonly typescriptReact: {
        readonly hooks: {
            readonly customHooksComposition: {
                readonly name: "Custom Hooks Composition";
                readonly description: "Compose multiple custom hooks for complex logic";
                readonly pattern: "Combine multiple hooks in custom hook for reusable logic";
                readonly example: "useAuth, usePermissions composed into useAuthPermissions";
                readonly benefits: readonly ["Reusability", "Separation of concerns", "Testability"];
            };
            readonly hookOptimization: {
                readonly name: "Hook Optimization Patterns";
                readonly description: "Optimize hook dependencies and re-renders";
                readonly patterns: readonly ["useMemo for expensive computations", "useCallback for stable function references", "useRef for mutable values that don't trigger re-renders", "Dependency array optimization"];
                readonly benefits: readonly ["Performance", "Reduced re-renders", "Memory efficiency"];
            };
        };
        readonly renderOptimization: {
            readonly reactMemo: {
                readonly name: "React.memo";
                readonly description: "Memoize component to prevent unnecessary re-renders";
                readonly whenToUse: readonly ["Expensive components", "Props rarely change", "Performance critical"];
                readonly whenNotToUse: readonly ["Props change frequently", "Simple components", "Premature optimization"];
            };
            readonly useMemo: {
                readonly name: "useMemo";
                readonly description: "Memoize expensive computations";
                readonly whenToUse: readonly ["Expensive calculations", "Derived values", "Object/array creation in render"];
                readonly whenNotToUse: readonly ["Simple calculations", "Primitive values", "Always changing values"];
            };
            readonly useCallback: {
                readonly name: "useCallback";
                readonly description: "Memoize function references";
                readonly whenToUse: readonly ["Functions passed to child components", "Dependency in other hooks", "Prevent unnecessary re-renders"];
                readonly whenNotToUse: readonly ["Local functions", "Simple functions", "Not passed as props"];
            };
        };
        readonly stateManagement: {
            readonly zustandAdvanced: {
                readonly name: "Zustand Advanced Patterns";
                readonly patterns: readonly ["Slice pattern for state organization", "Middleware for persistence/logging", "Selective subscriptions", "Actions as separate functions"];
                readonly benefits: readonly ["Scalability", "DevTools support", "Type safety"];
            };
            readonly jotaiPatterns: {
                readonly name: "Jotai Patterns";
                readonly patterns: readonly ["Atom composition", "Derived atoms", "Async atoms", "Atom families"];
                readonly benefits: readonly ["Fine-grained reactivity", "Composability", "Type safety"];
            };
        };
        readonly componentComposition: {
            readonly compoundComponents: {
                readonly name: "Compound Components";
                readonly description: "Components that work together";
                readonly pattern: "Parent component manages state, children receive via context";
                readonly example: "Select + Option components";
                readonly benefits: readonly ["Flexibility", "API simplicity", "Composability"];
            };
            readonly renderProps: {
                readonly name: "Render Props";
                readonly description: "Component receives function as prop to render content";
                readonly pattern: "Component accepts render function prop";
                readonly example: "Data fetching component with render prop";
                readonly benefits: readonly ["Code reuse", "Flexibility", "Separation of concerns"];
            };
            readonly higherOrderComponents: {
                readonly name: "Higher-Order Components (HOC)";
                readonly description: "Function that takes component and returns enhanced component";
                readonly pattern: "HOC wraps component with additional functionality";
                readonly example: "withAuth, withRouter";
                readonly benefits: readonly ["Code reuse", "Cross-cutting concerns", "Component enhancement"];
            };
        };
        readonly typeLevelProgramming: {
            readonly utilityTypes: {
                readonly name: "Utility Types";
                readonly description: "TypeScript built-in utility types";
                readonly types: readonly ["Partial<T> - Make all properties optional", "Required<T> - Make all properties required", "Pick<T, K> - Select properties", "Omit<T, K> - Exclude properties", "Record<K, V> - Object type with keys and values", "Exclude<T, U> - Exclude types from union", "Extract<T, U> - Extract types from union", "NonNullable<T> - Exclude null and undefined", "ReturnType<T> - Extract return type", "Parameters<T> - Extract function parameters"];
                readonly benefits: readonly ["Type safety", "Code reuse", "Type transformations"];
            };
            readonly conditionalTypes: {
                readonly name: "Conditional Types";
                readonly description: "Types that depend on conditions";
                readonly pattern: "T extends U ? X : Y";
                readonly useCases: readonly ["Type narrowing", "Overload resolution", "Type transformations"];
                readonly benefits: readonly ["Advanced type safety", "Type-level logic"];
            };
            readonly mappedTypes: {
                readonly name: "Mapped Types";
                readonly description: "Create new types by transforming properties";
                readonly pattern: "{ [K in keyof T]: NewType }";
                readonly useCases: readonly ["Making properties readonly", "Adding modifiers", "Transforming properties"];
                readonly benefits: readonly ["Type transformations", "Code reuse"];
            };
        };
    };
    /**
     * Code Quality Principles
     */
    readonly codeQuality: {
        readonly cleanCode: {
            readonly principles: readonly ["Meaningful names (variables, functions, classes)", "Small functions (do one thing well)", "Single Responsibility Principle", "Don't Repeat Yourself (DRY)", "Comments explain why, not what", "Error handling", "Avoid deep nesting", "Fail fast"];
        };
        readonly solid: {
            readonly singleResponsibility: "A class/function should have one reason to change";
            readonly openClosed: "Open for extension, closed for modification";
            readonly liskovSubstitution: "Derived classes must be substitutable for base classes";
            readonly interfaceSegregation: "Clients shouldn't depend on interfaces they don't use";
            readonly dependencyInversion: "Depend on abstractions, not concretions";
        };
        readonly dry: {
            readonly principle: "Don't Repeat Yourself";
            readonly whenToApply: readonly ["Duplicate logic", "Similar patterns", "Repeated code blocks"];
            readonly howToApply: readonly ["Extract functions", "Create utilities", "Use abstractions"];
        };
        readonly kiss: {
            readonly principle: "Keep It Simple, Stupid";
            readonly whenToApply: readonly ["Choosing between solutions", "Design decisions", "Implementation"];
            readonly howToApply: readonly ["Choose simplest solution that works", "Avoid over-engineering", "Refactor when needed"];
        };
        readonly yagni: {
            readonly principle: "You Aren't Gonna Need It";
            readonly whenToApply: readonly ["Feature planning", "Abstraction decisions", "Future-proofing"];
            readonly howToApply: readonly ["Implement only what's needed", "Avoid premature optimization", "Add complexity when needed"];
        };
    };
    /**
     * Code Generation Strategies
     */
    readonly generationStrategies: {
        readonly templateBased: {
            readonly description: "Use templates for common code patterns";
            readonly whenToUse: readonly ["Repetitive code", "Standard patterns", "Boilerplate"];
            readonly examples: readonly ["Component templates", "Hook templates", "Type definitions"];
        };
        readonly patternBased: {
            readonly description: "Compose code using design patterns";
            readonly whenToUse: readonly ["Complex logic", "Need for flexibility", "Well-known problems"];
            readonly examples: readonly ["Strategy pattern for algorithms", "Factory for object creation"];
        };
        readonly refinement: {
            readonly description: "Start with simple implementation, refine iteratively";
            readonly whenToUse: readonly ["Uncertain requirements", "Iterative development", "Learning"];
            readonly examples: readonly ["MVP first, add features", "Simple then optimize"];
        };
        readonly transformation: {
            readonly description: "Transform code from one form to another";
            readonly whenToUse: readonly ["Code refactoring", "Migration", "Optimization"];
            readonly examples: readonly ["Refactoring patterns", "Code modernization"];
        };
    };
};
/**
 * Get design pattern by name
 */
export declare function getDesignPattern(category: PatternCategory, patternName: string): DesignPattern | undefined;
/**
 * Get algorithm pattern by name
 */
export declare function getAlgorithmPattern(category: keyof typeof CODE_GENERATION_PATTERNS.algorithms, algorithmName: string): AlgorithmPattern | undefined;
/**
 * Get data structure pattern by name
 */
export declare function getDataStructurePattern(structureName: string): DataStructurePattern | undefined;
/**
 * Type exports
 */
export type { DesignPattern, PatternCategory, PatternUsage, AlgorithmPattern, AlgorithmComplexity, DataStructurePattern };
//# sourceMappingURL=layer-21-code-generation.d.ts.map