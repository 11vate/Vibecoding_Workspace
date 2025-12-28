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
    relevance: number;
    reason: string;
}
/**
 * Dependency map
 */
export interface DependencyMap {
    file: string;
    imports: string[];
    importedBy: string[];
    dependencies: string[];
    dependents: string[];
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
export declare const CONTEXT_RETRIEVAL: {
    /**
     * Before making changes, discover relevant context
     */
    readonly beforeChange: {
        readonly discover: readonly [{
            readonly step: "Search for similar patterns";
            readonly description: "Find existing implementations that solve similar problems";
            readonly methods: readonly ["Semantic search for similar functionality", "Pattern matching for component structures", "Search for similar naming patterns", "Look for related utility functions"];
        }, {
            readonly step: "Find all affected files";
            readonly description: "Identify files that will be modified or are related";
            readonly methods: readonly ["Direct file modifications", "Files that import the target file", "Files imported by the target file", "Files in the same directory/module"];
        }, {
            readonly step: "Check dependencies and imports";
            readonly description: "Understand what this code depends on and what depends on it";
            readonly methods: readonly ["Parse import statements", "Map dependency graph", "Check for circular dependencies", "Identify external dependencies"];
        }, {
            readonly step: "Review related components/systems";
            readonly description: "Understand how similar components work";
            readonly methods: readonly ["Find components with similar functionality", "Review related services/utilities", "Check related type definitions", "Review related styling approaches"];
        }, {
            readonly step: "Identify potential side effects";
            readonly description: "Understand what might break if changes are made";
            readonly methods: readonly ["Check all files that import this code", "Review test files", "Check for shared state/context usage", "Identify exported APIs used elsewhere"];
        }];
        readonly analyze: readonly [{
            readonly step: "Understand current implementation";
            readonly description: "How does the current code work?";
            readonly questions: readonly ["What is the current structure?", "What patterns are used?", "What are the dependencies?", "What is the purpose of each part?"];
        }, {
            readonly step: "Identify patterns and conventions";
            readonly description: "What patterns exist in the codebase?";
            readonly questions: readonly ["How are similar components structured?", "What naming conventions are used?", "How is state managed?", "What styling approaches are used?"];
        }, {
            readonly step: "Check for inconsistencies";
            readonly description: "Are there inconsistencies to address?";
            readonly questions: readonly ["Does this code follow established patterns?", "Are there deviations from conventions?", "Are there similar implementations that differ?"];
        }, {
            readonly step: "Verify coherence across codebase";
            readonly description: "Does this fit with the rest of the codebase?";
            readonly questions: readonly ["Is this consistent with similar code?", "Does this follow the same patterns?", "Does this match the codebase style?"];
        }];
    };
    /**
     * Pattern recognition
     */
    readonly patterns: {
        readonly recognize: {
            readonly component: {
                readonly patterns: readonly ["Component structure (hooks order, props, render)", "Styling approach (CSS Modules, styled-components, etc.)", "State management pattern", "Event handling conventions", "TypeScript typing patterns"];
                readonly methods: readonly ["Analyze component file structure", "Identify common patterns in similar components", "Extract naming conventions", "Note prop patterns and interfaces"];
            };
            readonly hook: {
                readonly patterns: readonly ["Custom hook structure", "Return value patterns", "Parameter conventions", "Error handling approaches"];
                readonly methods: readonly ["Review existing custom hooks", "Identify common patterns", "Note naming conventions (use* prefix)"];
            };
            readonly utility: {
                readonly patterns: readonly ["Function organization", "Parameter patterns", "Return value patterns", "Error handling"];
                readonly methods: readonly ["Review utility functions", "Identify common patterns", "Note naming and organization conventions"];
            };
            readonly service: {
                readonly patterns: readonly ["Service structure", "API patterns", "Error handling", "Data transformation"];
                readonly methods: readonly ["Review service files", "Identify common patterns", "Note architecture patterns"];
            };
            readonly style: {
                readonly patterns: readonly ["CSS organization", "Naming conventions (BEM, CSS Modules, etc.)", "Variable usage", "Responsive patterns"];
                readonly methods: readonly ["Review style files", "Identify naming conventions", "Note organization patterns"];
            };
            readonly type: {
                readonly patterns: readonly ["Type organization", "Naming conventions", "Reusability patterns", "Utility type usage"];
                readonly methods: readonly ["Review type definitions", "Identify common patterns", "Note organization approaches"];
            };
        };
        readonly apply: {
            readonly instruction: "When similar context appears, reference successful patterns";
            readonly priority: "Maintain consistency over innovation (unless explicitly requested)";
            readonly exceptions: "Only deviate from patterns if: 1) Pattern is anti-pattern, 2) New pattern is significantly better, 3) Explicitly requested";
        };
    };
    /**
     * Related file discovery protocols
     */
    readonly relatedFiles: {
        readonly discover: {
            readonly imports: {
                readonly description: "Files that this file imports";
                readonly method: "Parse import statements";
                readonly relevance: "high";
            };
            readonly importedBy: {
                readonly description: "Files that import this file";
                readonly method: "Search for imports of this file";
                readonly relevance: "critical";
            };
            readonly similar: {
                readonly description: "Files with similar functionality or structure";
                readonly method: "Semantic search + pattern matching";
                readonly relevance: "high";
            };
            readonly related: {
                readonly description: "Files in same module/directory or related functionality";
                readonly method: "Directory structure + semantic analysis";
                readonly relevance: "medium";
            };
            readonly dependency: {
                readonly description: "External dependencies this file uses";
                readonly method: "Parse package.json + import statements";
                readonly relevance: "medium";
            };
        };
        readonly prioritize: {
            readonly critical: readonly ["importedBy"];
            readonly high: readonly ["imports", "similar"];
            readonly medium: readonly ["related", "dependency"];
            readonly low: readonly [];
        };
    };
    /**
     * Dependency analysis
     */
    readonly dependencies: {
        readonly map: {
            readonly description: "Understand dependency graph";
            readonly steps: readonly ["Parse all import statements", "Build dependency graph", "Identify circular dependencies", "Map external dependencies", "Identify shared dependencies"];
        };
        readonly impact: {
            readonly description: "What else might be affected?";
            readonly analysis: readonly ["Direct dependencies (what this code needs)", "Dependents (what depends on this code)", "Shared dependencies (common imports)", "Transitive dependencies (dependencies of dependencies)"];
        };
        readonly test: {
            readonly description: "Testing implications";
            readonly considerations: readonly ["What tests exist for this code?", "What tests might need updates?", "What tests should be added?", "Are there integration tests affected?"];
        };
    };
    /**
     * Context prioritization
     */
    readonly prioritization: {
        readonly rules: readonly [{
            readonly priority: "critical";
            readonly when: readonly ["File is imported by many other files", "File exports public API", "Changes affect core functionality", "File is part of locked systems (Layer 7)"];
            readonly action: "Must review all dependents before changing";
        }, {
            readonly priority: "high";
            readonly when: readonly ["Similar patterns exist in codebase", "File is part of important feature", "Changes affect shared utilities"];
            readonly action: "Review similar patterns and maintain consistency";
        }, {
            readonly priority: "medium";
            readonly when: readonly ["File is related to change but not directly affected", "Patterns are somewhat similar"];
            readonly action: "Reference for context, less critical";
        }, {
            readonly priority: "low";
            readonly when: readonly ["File is only tangentially related", "Patterns are different domain"];
            readonly action: "Optional reference, low priority";
        }];
    };
    /**
     * Knowledge synthesis framework
     */
    readonly synthesis: {
        readonly combine: {
            readonly description: "Merge information from all relevant sources";
            readonly steps: readonly ["Gather all relevant context (patterns, files, dependencies)", "Identify common themes and patterns", "Note exceptions and edge cases", "Synthesize into coherent understanding"];
        };
        readonly prioritize: {
            readonly description: "Focus on most relevant context first";
            readonly order: readonly ["1. Critical dependencies and dependents", "2. Similar patterns and implementations", "3. Related files and components", "4. General conventions and patterns", "5. Optional context and references"];
        };
        readonly verify: {
            readonly description: "Ensure information is current and accurate";
            readonly checks: readonly ["Are the files still in the codebase?", "Have patterns changed recently?", "Are there newer implementations?", "Is the context still relevant?"];
        };
        readonly gaps: {
            readonly description: "Identify missing context and request if critical";
            readonly approach: readonly ["Determine if missing context is critical", "If critical, request clarification or search more", "If not critical, proceed with available context", "Note assumptions based on missing context"];
        };
    };
    /**
     * Similarity matching
     */
    readonly similarity: {
        readonly factors: readonly [{
            readonly factor: "Naming similarity";
            readonly weight: 0.2;
            readonly description: "Similar names suggest similar functionality";
        }, {
            readonly factor: "Structure similarity";
            readonly weight: 0.3;
            readonly description: "Similar file structure suggests similar patterns";
        }, {
            readonly factor: "Functional similarity";
            readonly weight: 0.4;
            readonly description: "Similar functionality is most important";
        }, {
            readonly factor: "Location similarity";
            readonly weight: 0.1;
            readonly description: "Files in same directory often related";
        }];
        readonly threshold: {
            readonly high: 0.7;
            readonly medium: 0.5;
            readonly low: 0.3;
        };
    };
};
/**
 * Helper function to discover related files
 */
export declare function discoverRelatedFiles(targetFile: string, codebase: {
    files: string[];
}): RelatedFile[];
/**
 * Helper function to synthesize context
 */
export declare function synthesizeContext(patterns: CodebasePattern[], relatedFiles: RelatedFile[], dependencies: DependencyMap): ContextSynthesis;
/**
 * Helper function to prioritize context
 */
export declare function prioritizeContext(context: RelatedFile[]): Map<ContextPriority, RelatedFile[]>;
/**
 * Type exports for use in other layers
 */
export type { CodebasePattern, RelatedFile, DependencyMap, ContextSynthesis, ContextPriority };
//# sourceMappingURL=layer-13-context-retrieval.d.ts.map