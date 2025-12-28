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
 * Main code generation patterns library
 */
export const CODE_GENERATION_PATTERNS = {
    /**
     * Design Pattern Library (GoF + Modern Patterns)
     */
    designPatterns: {
        creational: {
            singleton: {
                name: "Singleton",
                category: "creational",
                description: "Ensures a class has only one instance",
                problem: "Need to ensure only one instance of a class exists",
                solution: "Create a single instance and provide global access",
                usage: {
                    whenToUse: ["Need single instance (logger, cache, config)", "Global state management"],
                    whenNotToUse: ["Testability concerns", "Multi-threaded environments", "Global state anti-pattern"],
                    alternatives: ["Dependency Injection", "Factory Pattern"],
                    example: "Logger instance, application configuration"
                }
            },
            factory: {
                name: "Factory Method",
                category: "creational",
                description: "Creates objects without specifying exact classes",
                problem: "Need to create objects but exact type unknown at compile time",
                solution: "Define interface for creating objects, let subclasses decide which class to instantiate",
                usage: {
                    whenToUse: ["Object creation logic is complex", "Need to support multiple types", "Decouple creation from usage"],
                    whenNotToUse: ["Simple object creation", "Only one type needed"],
                    alternatives: ["Builder Pattern", "Abstract Factory"],
                    example: "Creating different UI components based on props"
                }
            },
            builder: {
                name: "Builder",
                category: "creational",
                description: "Constructs complex objects step by step",
                problem: "Complex object construction with many parameters",
                solution: "Separate construction from representation, allow step-by-step construction",
                usage: {
                    whenToUse: ["Complex object construction", "Many optional parameters", "Immutability desired"],
                    whenNotToUse: ["Simple object creation", "Fixed parameter sets"],
                    alternatives: ["Factory Pattern", "Constructor with options object"],
                    example: "Building query objects, configuration objects"
                }
            },
            repository: {
                name: "Repository",
                category: "modern",
                description: "Abstracts data access logic",
                problem: "Need to decouple business logic from data access",
                solution: "Create abstraction layer for data access operations",
                usage: {
                    whenToUse: ["Decouple business logic from data access", "Easier testing", "Multiple data sources"],
                    whenNotToUse: ["Simple CRUD operations", "No need for abstraction"],
                    alternatives: ["Active Record Pattern", "Data Access Object (DAO)"],
                    example: "Data access layer for database operations"
                }
            },
            unitOfWork: {
                name: "Unit of Work",
                category: "modern",
                description: "Maintains list of objects affected by transaction",
                problem: "Need to coordinate changes across multiple objects",
                solution: "Track all objects affected by transaction and coordinate writes",
                usage: {
                    whenToUse: ["Multiple object updates in transaction", "Need transactional integrity", "Complex data operations"],
                    whenNotToUse: ["Simple single-object operations", "No transaction requirements"],
                    alternatives: ["Repository Pattern", "Transaction Script"],
                    example: "Coordinating database updates across multiple entities"
                }
            }
        },
        structural: {
            adapter: {
                name: "Adapter",
                category: "structural",
                description: "Allows incompatible interfaces to work together",
                problem: "Need to use class with incompatible interface",
                solution: "Create adapter class that translates between interfaces",
                usage: {
                    whenToUse: ["Integrating incompatible interfaces", "Using third-party libraries", "Legacy code integration"],
                    whenNotToUse: ["Interfaces already compatible", "Can modify source code"],
                    alternatives: ["Facade Pattern", "Bridge Pattern"],
                    example: "Adapting external API to internal interface"
                }
            },
            decorator: {
                name: "Decorator",
                category: "structural",
                description: "Adds behavior to objects dynamically",
                problem: "Need to add behavior to objects without modifying structure",
                solution: "Wrap object with decorator that adds behavior",
                usage: {
                    whenToUse: ["Need to add behavior dynamically", "Avoid class explosion", "Composition over inheritance"],
                    whenNotToUse: ["Fixed behavior", "Simple extension"],
                    alternatives: ["Strategy Pattern", "Composition"],
                    example: "React Higher-Order Components, middleware"
                }
            },
            facade: {
                name: "Facade",
                category: "structural",
                description: "Provides simplified interface to complex subsystem",
                problem: "Complex subsystem with many classes",
                solution: "Create facade that provides simple interface to subsystem",
                usage: {
                    whenToUse: ["Simplify complex subsystems", "Reduce coupling", "Provide convenient interface"],
                    whenNotToUse: ["Need fine-grained control", "Simple subsystems"],
                    alternatives: ["Adapter Pattern", "Direct subsystem access"],
                    example: "API client wrapping HTTP operations"
                }
            }
        },
        behavioral: {
            strategy: {
                name: "Strategy",
                category: "behavioral",
                description: "Defines family of algorithms, makes them interchangeable",
                problem: "Need to vary algorithm independently of clients",
                solution: "Define algorithm interface, encapsulate each algorithm",
                usage: {
                    whenToUse: ["Multiple ways to perform task", "Want to avoid conditional logic", "Algorithm selection at runtime"],
                    whenNotToUse: ["Single algorithm", "Simple conditional logic"],
                    alternatives: ["Template Method", "Function parameters"],
                    example: "Payment processing strategies, sorting algorithms"
                }
            },
            observer: {
                name: "Observer",
                category: "behavioral",
                description: "Defines one-to-many dependency between objects",
                problem: "Need to notify multiple objects about state changes",
                solution: "Define subject and observers, notify observers of changes",
                usage: {
                    whenToUse: ["State changes affect multiple objects", "Loose coupling desired", "Event-driven systems"],
                    whenNotToUse: ["Tight coupling acceptable", "Simple state management"],
                    alternatives: ["Pub/Sub Pattern", "Event Emitter"],
                    example: "React state updates, event systems"
                }
            },
            command: {
                name: "Command",
                category: "behavioral",
                description: "Encapsulates request as object",
                problem: "Need to parameterize objects with requests",
                solution: "Encapsulate request as object, allowing queuing, logging, undo",
                usage: {
                    whenToUse: ["Need to queue requests", "Need undo/redo", "Need to log requests", "Decouple invoker from receiver"],
                    whenNotToUse: ["Simple function calls", "No need for queuing/logging"],
                    alternatives: ["Function calls", "Strategy Pattern"],
                    example: "Undo/redo functionality, command queues"
                }
            },
            templateMethod: {
                name: "Template Method",
                category: "behavioral",
                description: "Defines algorithm skeleton, lets subclasses override steps",
                problem: "Algorithm with steps, some vary",
                solution: "Define algorithm in base class, let subclasses override specific steps",
                usage: {
                    whenToUse: ["Algorithm with invariant and variant parts", "Code reuse desired", "Framework development"],
                    whenNotToUse: ["Algorithm completely varies", "Simple functions"],
                    alternatives: ["Strategy Pattern", "Composition"],
                    example: "React lifecycle methods, framework hooks"
                }
            }
        }
    },
    /**
     * Algorithm Patterns
     */
    algorithms: {
        sorting: {
            quickSort: {
                name: "Quick Sort",
                description: "Divide and conquer sorting algorithm",
                complexity: {
                    time: "O(n log n) average, O(n²) worst",
                    space: "O(log n)",
                    averageCase: "O(n log n)",
                    worstCase: "O(n²)"
                },
                useCases: ["General-purpose sorting", "In-place sorting needed", "Average case performance important"],
                codeExample: "Use Array.sort() for most cases"
            },
            mergeSort: {
                name: "Merge Sort",
                description: "Stable divide and conquer sorting",
                complexity: {
                    time: "O(n log n)",
                    space: "O(n)",
                    worstCase: "O(n log n)"
                },
                useCases: ["Stable sort needed", "Consistent performance required", "Can afford extra space"],
                codeExample: "Use for stable sorting requirements"
            }
        },
        searching: {
            binarySearch: {
                name: "Binary Search",
                description: "Search in sorted array",
                complexity: {
                    time: "O(log n)",
                    space: "O(1)",
                    bestCase: "O(1)",
                    worstCase: "O(log n)"
                },
                useCases: ["Sorted arrays", "Fast search needed", "Large datasets"],
                codeExample: "Searching in sorted arrays or trees"
            },
            linearSearch: {
                name: "Linear Search",
                description: "Sequential search through array",
                complexity: {
                    time: "O(n)",
                    space: "O(1)",
                    bestCase: "O(1)",
                    worstCase: "O(n)"
                },
                useCases: ["Unsorted arrays", "Small datasets", "Simple implementation"],
                codeExample: "Array.find(), Array.includes()"
            }
        },
        graph: {
            depthFirstSearch: {
                name: "Depth-First Search (DFS)",
                description: "Explore graph by going deep",
                complexity: {
                    time: "O(V + E)",
                    space: "O(V)"
                },
                useCases: ["Path finding", "Cycle detection", "Topological sorting"],
                codeExample: "Tree traversal, maze solving"
            },
            breadthFirstSearch: {
                name: "Breadth-First Search (BFS)",
                description: "Explore graph level by level",
                complexity: {
                    time: "O(V + E)",
                    space: "O(V)"
                },
                useCases: ["Shortest path (unweighted)", "Level-order traversal", "Social network analysis"],
                codeExample: "Finding shortest path, level-order tree traversal"
            }
        },
        dynamicProgramming: {
            memoization: {
                name: "Memoization",
                description: "Cache results of expensive function calls",
                complexity: {
                    time: "Reduces from exponential to polynomial",
                    space: "O(n) for cache"
                },
                useCases: ["Overlapping subproblems", "Optimal substructure", "Recursive functions"],
                codeExample: "Fibonacci, factorial with caching"
            }
        }
    },
    /**
     * Data Structure Patterns
     */
    dataStructures: {
        array: {
            name: "Array",
            description: "Contiguous memory allocation",
            operations: {
                access: "O(1)",
                search: "O(n)",
                insert: "O(n)",
                delete: "O(n)"
            },
            useCases: ["Indexed access", "Simple collections", "Fixed size known"],
            codeExample: "const arr: number[] = [1, 2, 3];"
        },
        linkedList: {
            name: "Linked List",
            description: "Nodes connected by references",
            operations: {
                access: "O(n)",
                search: "O(n)",
                insert: "O(1) at head, O(n) elsewhere",
                delete: "O(1) at head, O(n) elsewhere"
            },
            useCases: ["Frequent insertions/deletions", "Dynamic size", "Memory efficient"],
            codeExample: "Use when frequent insertions/deletions at head"
        },
        hashTable: {
            name: "Hash Table",
            description: "Key-value pairs with hash function",
            operations: {
                access: "O(1) average",
                search: "O(1) average",
                insert: "O(1) average",
                delete: "O(1) average"
            },
            useCases: ["Fast lookups", "Key-value storage", "Caching"],
            codeExample: "Map, Set, object as hash table"
        },
        tree: {
            name: "Tree",
            description: "Hierarchical data structure",
            operations: {
                access: "O(log n) balanced",
                search: "O(log n) balanced",
                insert: "O(log n) balanced",
                delete: "O(log n) balanced"
            },
            useCases: ["Hierarchical data", "Search operations", "Sorted data"],
            codeExample: "Binary search tree, DOM tree, file system"
        },
        graph: {
            name: "Graph",
            description: "Nodes and edges",
            operations: {
                access: "O(V + E)",
                search: "O(V + E)",
                insert: "O(1)",
                delete: "O(E)"
            },
            useCases: ["Relationships", "Networks", "Social graphs"],
            codeExample: "Social networks, routing, dependencies"
        }
    },
    /**
     * TypeScript/React Advanced Patterns
     */
    typescriptReact: {
        hooks: {
            customHooksComposition: {
                name: "Custom Hooks Composition",
                description: "Compose multiple custom hooks for complex logic",
                pattern: "Combine multiple hooks in custom hook for reusable logic",
                example: "useAuth, usePermissions composed into useAuthPermissions",
                benefits: ["Reusability", "Separation of concerns", "Testability"]
            },
            hookOptimization: {
                name: "Hook Optimization Patterns",
                description: "Optimize hook dependencies and re-renders",
                patterns: [
                    "useMemo for expensive computations",
                    "useCallback for stable function references",
                    "useRef for mutable values that don't trigger re-renders",
                    "Dependency array optimization"
                ],
                benefits: ["Performance", "Reduced re-renders", "Memory efficiency"]
            }
        },
        renderOptimization: {
            reactMemo: {
                name: "React.memo",
                description: "Memoize component to prevent unnecessary re-renders",
                whenToUse: ["Expensive components", "Props rarely change", "Performance critical"],
                whenNotToUse: ["Props change frequently", "Simple components", "Premature optimization"]
            },
            useMemo: {
                name: "useMemo",
                description: "Memoize expensive computations",
                whenToUse: ["Expensive calculations", "Derived values", "Object/array creation in render"],
                whenNotToUse: ["Simple calculations", "Primitive values", "Always changing values"]
            },
            useCallback: {
                name: "useCallback",
                description: "Memoize function references",
                whenToUse: ["Functions passed to child components", "Dependency in other hooks", "Prevent unnecessary re-renders"],
                whenNotToUse: ["Local functions", "Simple functions", "Not passed as props"]
            }
        },
        stateManagement: {
            zustandAdvanced: {
                name: "Zustand Advanced Patterns",
                patterns: [
                    "Slice pattern for state organization",
                    "Middleware for persistence/logging",
                    "Selective subscriptions",
                    "Actions as separate functions"
                ],
                benefits: ["Scalability", "DevTools support", "Type safety"]
            },
            jotaiPatterns: {
                name: "Jotai Patterns",
                patterns: [
                    "Atom composition",
                    "Derived atoms",
                    "Async atoms",
                    "Atom families"
                ],
                benefits: ["Fine-grained reactivity", "Composability", "Type safety"]
            }
        },
        componentComposition: {
            compoundComponents: {
                name: "Compound Components",
                description: "Components that work together",
                pattern: "Parent component manages state, children receive via context",
                example: "Select + Option components",
                benefits: ["Flexibility", "API simplicity", "Composability"]
            },
            renderProps: {
                name: "Render Props",
                description: "Component receives function as prop to render content",
                pattern: "Component accepts render function prop",
                example: "Data fetching component with render prop",
                benefits: ["Code reuse", "Flexibility", "Separation of concerns"]
            },
            higherOrderComponents: {
                name: "Higher-Order Components (HOC)",
                description: "Function that takes component and returns enhanced component",
                pattern: "HOC wraps component with additional functionality",
                example: "withAuth, withRouter",
                benefits: ["Code reuse", "Cross-cutting concerns", "Component enhancement"]
            }
        },
        typeLevelProgramming: {
            utilityTypes: {
                name: "Utility Types",
                description: "TypeScript built-in utility types",
                types: [
                    "Partial<T> - Make all properties optional",
                    "Required<T> - Make all properties required",
                    "Pick<T, K> - Select properties",
                    "Omit<T, K> - Exclude properties",
                    "Record<K, V> - Object type with keys and values",
                    "Exclude<T, U> - Exclude types from union",
                    "Extract<T, U> - Extract types from union",
                    "NonNullable<T> - Exclude null and undefined",
                    "ReturnType<T> - Extract return type",
                    "Parameters<T> - Extract function parameters"
                ],
                benefits: ["Type safety", "Code reuse", "Type transformations"]
            },
            conditionalTypes: {
                name: "Conditional Types",
                description: "Types that depend on conditions",
                pattern: "T extends U ? X : Y",
                useCases: ["Type narrowing", "Overload resolution", "Type transformations"],
                benefits: ["Advanced type safety", "Type-level logic"]
            },
            mappedTypes: {
                name: "Mapped Types",
                description: "Create new types by transforming properties",
                pattern: "{ [K in keyof T]: NewType }",
                useCases: ["Making properties readonly", "Adding modifiers", "Transforming properties"],
                benefits: ["Type transformations", "Code reuse"]
            }
        }
    },
    /**
     * Code Quality Principles
     */
    codeQuality: {
        cleanCode: {
            principles: [
                "Meaningful names (variables, functions, classes)",
                "Small functions (do one thing well)",
                "Single Responsibility Principle",
                "Don't Repeat Yourself (DRY)",
                "Comments explain why, not what",
                "Error handling",
                "Avoid deep nesting",
                "Fail fast"
            ]
        },
        solid: {
            singleResponsibility: "A class/function should have one reason to change",
            openClosed: "Open for extension, closed for modification",
            liskovSubstitution: "Derived classes must be substitutable for base classes",
            interfaceSegregation: "Clients shouldn't depend on interfaces they don't use",
            dependencyInversion: "Depend on abstractions, not concretions"
        },
        dry: {
            principle: "Don't Repeat Yourself",
            whenToApply: ["Duplicate logic", "Similar patterns", "Repeated code blocks"],
            howToApply: ["Extract functions", "Create utilities", "Use abstractions"]
        },
        kiss: {
            principle: "Keep It Simple, Stupid",
            whenToApply: ["Choosing between solutions", "Design decisions", "Implementation"],
            howToApply: ["Choose simplest solution that works", "Avoid over-engineering", "Refactor when needed"]
        },
        yagni: {
            principle: "You Aren't Gonna Need It",
            whenToApply: ["Feature planning", "Abstraction decisions", "Future-proofing"],
            howToApply: ["Implement only what's needed", "Avoid premature optimization", "Add complexity when needed"]
        }
    },
    /**
     * Code Generation Strategies
     */
    generationStrategies: {
        templateBased: {
            description: "Use templates for common code patterns",
            whenToUse: ["Repetitive code", "Standard patterns", "Boilerplate"],
            examples: ["Component templates", "Hook templates", "Type definitions"]
        },
        patternBased: {
            description: "Compose code using design patterns",
            whenToUse: ["Complex logic", "Need for flexibility", "Well-known problems"],
            examples: ["Strategy pattern for algorithms", "Factory for object creation"]
        },
        refinement: {
            description: "Start with simple implementation, refine iteratively",
            whenToUse: ["Uncertain requirements", "Iterative development", "Learning"],
            examples: ["MVP first, add features", "Simple then optimize"]
        },
        transformation: {
            description: "Transform code from one form to another",
            whenToUse: ["Code refactoring", "Migration", "Optimization"],
            examples: ["Refactoring patterns", "Code modernization"]
        }
    }
};
/**
 * Get design pattern by name
 */
export function getDesignPattern(category, patternName) {
    const categoryPatterns = CODE_GENERATION_PATTERNS.designPatterns[category];
    if (!categoryPatterns)
        return undefined;
    return categoryPatterns[patternName];
}
/**
 * Get algorithm pattern by name
 */
export function getAlgorithmPattern(category, algorithmName) {
    const categoryAlgorithms = CODE_GENERATION_PATTERNS.algorithms[category];
    if (!categoryAlgorithms)
        return undefined;
    return categoryAlgorithms[algorithmName];
}
/**
 * Get data structure pattern by name
 */
export function getDataStructurePattern(structureName) {
    return CODE_GENERATION_PATTERNS.dataStructures[structureName];
}
//# sourceMappingURL=layer-21-code-generation.js.map