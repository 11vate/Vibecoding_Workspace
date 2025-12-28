/**
 * LAYER 25 — REFACTORING & CODE QUALITY
 *
 * Refactoring strategies and code quality improvement
 *
 * This layer provides code smell detection, refactoring techniques, technical
 * debt management, code quality metrics, and code review patterns to maintain
 * and improve code quality over time.
 */
/**
 * Code smell severity
 */
export type CodeSmellSeverity = "critical" | "high" | "medium" | "low";
/**
 * Code smell definition
 */
export interface CodeSmell {
    name: string;
    description: string;
    severity: CodeSmellSeverity;
    detection: string[];
    impact: string[];
    refactoring: string[];
}
/**
 * Refactoring technique
 */
export interface RefactoringTechnique {
    name: string;
    description: string;
    whenToUse: string[];
    steps: string[];
    benefits: string[];
    risks: string[];
}
/**
 * Code quality metric
 */
export interface CodeQualityMetric {
    name: string;
    description: string;
    threshold: {
        good: number;
        acceptable: number;
        poor: number;
    };
    calculation: string;
}
/**
 * Technical debt priority
 */
export type DebtPriority = "critical" | "high" | "medium" | "low";
/**
 * Technical debt item
 */
export interface TechnicalDebt {
    description: string;
    priority: DebtPriority;
    impact: string[];
    effort: string;
    remediation: string[];
}
/**
 * Main refactoring and code quality configuration
 */
export declare const REFACTORING_QUALITY: {
    /**
     * Code Smells Detection
     */
    readonly codeSmells: {
        readonly longMethods: {
            readonly name: "Long Methods/Functions";
            readonly description: "Methods that are too long and do multiple things";
            readonly severity: CodeSmellSeverity;
            readonly detection: readonly ["Methods longer than 20-30 lines", "Methods with multiple responsibilities", "Methods that are hard to understand", "Methods with deep nesting"];
            readonly impact: readonly ["Hard to understand", "Hard to test", "Hard to maintain", "Hard to reuse"];
            readonly refactoring: readonly ["Extract Method", "Extract Function", "Break into smaller methods", "Remove duplication"];
        };
        readonly largeClasses: {
            readonly name: "Large Classes/Components";
            readonly description: "Classes or components that are too large";
            readonly severity: CodeSmellSeverity;
            readonly detection: readonly ["Classes with too many methods", "Components with too many responsibilities", "Classes with too many instance variables", "Components with too many props"];
            readonly impact: readonly ["Violates Single Responsibility Principle", "Hard to understand", "Hard to test", "Hard to maintain"];
            readonly refactoring: readonly ["Extract Class", "Extract Component", "Extract Subclass", "Split responsibilities"];
        };
        readonly duplicateCode: {
            readonly name: "Duplicate Code";
            readonly description: "Same or similar code in multiple places";
            readonly severity: CodeSmellSeverity;
            readonly detection: readonly ["Copy-pasted code blocks", "Similar code patterns", "Repeated logic", "Code that looks familiar"];
            readonly impact: readonly ["Violates DRY principle", "Bugs need to be fixed in multiple places", "Changes need to be made in multiple places", "Code bloat"];
            readonly refactoring: readonly ["Extract Method/Function", "Extract Class", "Pull Up Method", "Form Template Method", "Introduce Parameter Object"];
        };
        readonly longParameterLists: {
            readonly name: "Long Parameter Lists";
            readonly description: "Functions with too many parameters";
            readonly severity: CodeSmellSeverity;
            readonly detection: readonly ["Functions with more than 3-4 parameters", "Related parameters grouped together", "Functions hard to call"];
            readonly impact: readonly ["Hard to understand", "Hard to call", "Easy to make mistakes", "Indicates missing abstraction"];
            readonly refactoring: readonly ["Introduce Parameter Object", "Replace Parameter with Method Call", "Preserve Whole Object", "Introduce Named Parameters (using objects)"];
        };
        readonly dataClumps: {
            readonly name: "Data Clumps";
            readonly description: "Groups of data that travel together";
            readonly severity: CodeSmellSeverity;
            readonly detection: readonly ["Same group of parameters in multiple methods", "Related data always together", "Missing data structure"];
            readonly impact: readonly ["Code duplication", "Missing abstraction", "Hard to change", "Poor cohesion"];
            readonly refactoring: readonly ["Introduce Parameter Object", "Extract Class", "Preserve Whole Object"];
        };
        readonly featureEnvy: {
            readonly name: "Feature Envy";
            readonly description: "Method uses more features of another class than its own";
            readonly severity: CodeSmellSeverity;
            readonly detection: readonly ["Method calls many methods of another object", "Method accesses many properties of another object", "Method seems to belong to another class"];
            readonly impact: readonly ["Poor cohesion", "Tight coupling", "Logic in wrong place"];
            readonly refactoring: readonly ["Move Method", "Extract Method and Move", "Move Field"];
        };
        readonly inappropriateIntimacy: {
            readonly name: "Inappropriate Intimacy";
            readonly description: "Classes know too much about each other's internals";
            readonly severity: CodeSmellSeverity;
            readonly detection: readonly ["Classes accessing private members", "Too many interactions between classes", "Circular dependencies"];
            readonly impact: readonly ["Tight coupling", "Hard to change", "Violates encapsulation"];
            readonly refactoring: readonly ["Move Method", "Move Field", "Change Bidirectional Association to Unidirectional", "Extract Class", "Hide Delegate"];
        };
        readonly commentsAsCodeSmell: {
            readonly name: "Comments as Code Smell";
            readonly description: "Comments that explain what code does (not why)";
            readonly severity: CodeSmellSeverity;
            readonly detection: readonly ["Comments that explain obvious code", "Commented-out code", "Comments that duplicate code", "Comments that should be code"];
            readonly impact: readonly ["Code not self-documenting", "Comments get out of sync", "Indicates unclear code"];
            readonly refactoring: readonly ["Extract Method (replace comment with method name)", "Rename Variable (make code clearer)", "Remove commented code", "Explain why, not what"];
        };
    };
    /**
     * Refactoring Techniques
     */
    readonly refactoringTechniques: {
        readonly extractMethod: {
            readonly name: "Extract Method";
            readonly description: "Extract code into a new method";
            readonly whenToUse: readonly ["Code block does one thing", "Code block is reused", "Method is too long", "Code block has a clear purpose"];
            readonly steps: readonly ["Create new method with descriptive name", "Move code block to new method", "Replace original code with method call", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Improves readability", "Enables reuse", "Easier to test", "Single responsibility"];
            readonly risks: readonly ["Need to handle variable scope", "May need to pass parameters", "May need to return values"];
        };
        readonly extractClass: {
            readonly name: "Extract Class";
            readonly description: "Extract part of a class into a new class";
            readonly whenToUse: readonly ["Class has multiple responsibilities", "Part of class can be independent", "Class is too large", "Subset of data and methods belong together"];
            readonly steps: readonly ["Create new class", "Move fields and methods to new class", "Create instance of new class in original", "Update references", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Single Responsibility Principle", "Better organization", "Easier to understand", "Easier to test"];
            readonly risks: readonly ["Need to manage references", "May create coupling issues", "May need to refactor callers"];
        };
        readonly inlineMethod: {
            readonly name: "Inline Method";
            readonly description: "Replace method call with method body";
            readonly whenToUse: readonly ["Method body is clearer than name", "Method is only called once", "Method is too simple", "Method adds no value"];
            readonly steps: readonly ["Replace method call with method body", "Remove method definition", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Simplifies code", "Removes unnecessary abstraction"];
            readonly risks: readonly ["May reduce readability", "May duplicate code"];
        };
        readonly moveMethod: {
            readonly name: "Move Method";
            readonly description: "Move method to a more appropriate class";
            readonly whenToUse: readonly ["Method uses more features of another class", "Method doesn't fit in current class", "Better cohesion in another class"];
            readonly steps: readonly ["Identify target class", "Copy method to target class", "Update method to work in new context", "Replace original calls with new calls", "Remove original method", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Better cohesion", "Reduced coupling", "More logical organization"];
            readonly risks: readonly ["May break callers", "Need to update references", "May need to pass additional parameters"];
        };
        readonly replaceTempWithQuery: {
            readonly name: "Replace Temp with Query";
            readonly description: "Replace temporary variable with method call";
            readonly whenToUse: readonly ["Temporary variable used once", "Temporary variable makes code clearer", "Temporary variable can be extracted"];
            readonly steps: readonly ["Extract expression into method", "Replace temp variable with method call", "Test that behavior is unchanged"];
            readonly benefits: readonly ["More readable", "Reusable", "Easier to test"];
            readonly risks: readonly ["May impact performance (but usually negligible)", "May need to pass parameters"];
        };
        readonly splitVariable: {
            readonly name: "Split Variable";
            readonly description: "Split variable that's assigned more than once";
            readonly whenToUse: readonly ["Variable used for multiple purposes", "Variable name doesn't reflect all uses", "Variable is confusing"];
            readonly steps: readonly ["Create new variable for each use", "Replace each assignment", "Remove original variable", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Clearer intent", "Easier to understand", "Easier to rename"];
            readonly risks: readonly ["May need to update multiple references", "May need to handle scope"];
        };
        readonly replaceMagicNumbers: {
            readonly name: "Replace Magic Numbers with Constants";
            readonly description: "Replace literal numbers with named constants";
            readonly whenToUse: readonly ["Number has meaning beyond its value", "Number is used multiple times", "Number's meaning is unclear"];
            readonly steps: readonly ["Create constant with descriptive name", "Replace number with constant", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Self-documenting", "Easier to change", "Avoids typos"];
            readonly risks: readonly ["May create many constants", "Need to choose good names"];
        };
        readonly replaceConditionalWithPolymorphism: {
            readonly name: "Replace Conditional with Polymorphism";
            readonly description: "Replace conditional logic with polymorphism";
            readonly whenToUse: readonly ["Conditional based on type", "Same conditional in multiple places", "Adding new type requires changes"];
            readonly steps: readonly ["Create base class/interface", "Create subclasses for each type", "Move conditional logic to subclasses", "Replace conditional with polymorphism", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Follows Open/Closed Principle", "Easier to extend", "Removes conditional logic"];
            readonly risks: readonly ["May be overkill for simple cases", "Adds complexity", "Need to restructure code"];
        };
        readonly introduceParameterObject: {
            readonly name: "Introduce Parameter Object";
            readonly description: "Replace multiple parameters with an object";
            readonly whenToUse: readonly ["Multiple related parameters", "Long parameter list", "Parameters often passed together"];
            readonly steps: readonly ["Create parameter object class", "Add parameters as fields", "Replace parameters with object", "Update callers", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Reduces parameter count", "Groups related data", "Easier to extend"];
            readonly risks: readonly ["Need to update all callers", "May add indirection"];
        };
        readonly replaceErrorCodeWithException: {
            readonly name: "Replace Error Code with Exception";
            readonly description: "Replace error codes with exceptions";
            readonly whenToUse: readonly ["Error codes returned from methods", "Error handling is complex", "Errors should propagate"];
            readonly steps: readonly ["Create exception classes", "Replace error codes with exceptions", "Update error handling", "Test that behavior is unchanged"];
            readonly benefits: readonly ["Clearer error handling", "Forces error handling", "Better error propagation"];
            readonly risks: readonly ["May need to update error handling everywhere", "May change error handling behavior"];
        };
    };
    /**
     * Technical Debt Management
     */
    readonly technicalDebt: {
        readonly identification: {
            readonly strategies: readonly ["Code smells", "High complexity", "Low test coverage", "Known issues", "Temporary solutions", "Commented TODOs/FIXMEs", "Performance issues", "Security vulnerabilities"];
        };
        readonly prioritization: {
            readonly factors: readonly ["Impact on users", "Impact on developers", "Risk of bugs", "Maintenance cost", "Effort to fix"];
            readonly matrix: {
                readonly critical: "High impact, any effort";
                readonly high: "High impact, low effort OR medium impact, high effort";
                readonly medium: "Medium impact, medium effort";
                readonly low: "Low impact, any effort OR any impact, low effort";
            };
        };
        readonly repayment: {
            readonly strategies: readonly ["Fix as you go (during feature work)", "Dedicated refactoring sprints", "Boy Scout Rule (leave code better than you found it)", "Allocate time for debt repayment", "Track and prioritize debt"];
            readonly boyScoutRule: "Always leave the code better than you found it - fix small issues as you encounter them";
        };
        readonly prevention: {
            readonly strategies: readonly ["Code reviews", "Pair programming", "Automated quality checks", "Regular refactoring", "Technical standards", "Test coverage requirements", "Architecture reviews"];
        };
    };
    /**
     * Code Quality Metrics
     */
    readonly codeQualityMetrics: {
        readonly cyclomaticComplexity: {
            readonly name: "Cyclomatic Complexity";
            readonly description: "Measure of code complexity based on decision points";
            readonly threshold: {
                readonly good: 10;
                readonly acceptable: 15;
                readonly poor: 20;
            };
            readonly calculation: "Number of decision points + 1";
            readonly reduction: readonly ["Extract methods", "Simplify conditionals", "Use early returns", "Reduce nesting"];
        };
        readonly codeDuplication: {
            readonly name: "Code Duplication";
            readonly description: "Percentage of duplicated code";
            readonly threshold: {
                readonly good: 0;
                readonly acceptable: 3;
                readonly poor: 5;
            };
            readonly calculation: "Percentage of duplicated lines";
            readonly reduction: readonly ["Extract common code", "Use inheritance/composition", "Create utility functions", "Use design patterns"];
        };
        readonly maintainabilityIndex: {
            readonly name: "Maintainability Index";
            readonly description: "Composite metric of maintainability";
            readonly threshold: {
                readonly good: 80;
                readonly acceptable: 65;
                readonly poor: 50;
            };
            readonly calculation: "Function of complexity, lines of code, and Halstead volume";
            readonly improvement: readonly ["Reduce complexity", "Reduce code size", "Improve readability", "Reduce duplication"];
        };
        readonly testCoverage: {
            readonly name: "Test Coverage";
            readonly description: "Percentage of code covered by tests";
            readonly threshold: {
                readonly good: 90;
                readonly acceptable: 80;
                readonly poor: 70;
            };
            readonly calculation: "Covered lines / Total lines";
            readonly improvement: readonly ["Write more tests", "Focus on critical paths", "Test edge cases", "Improve test quality"];
        };
    };
    /**
     * Code Review Patterns
     */
    readonly codeReview: {
        readonly checklist: readonly ["Does the code work?", "Is the code readable and understandable?", "Does the code follow project standards?", "Is the code well-tested?", "Are there any security concerns?", "Are there any performance issues?", "Is error handling appropriate?", "Are there any code smells?", "Is documentation adequate?", "Are there any edge cases not handled?"];
        readonly commonIssues: readonly ["Missing error handling", "Security vulnerabilities", "Performance issues", "Code smells", "Missing tests", "Poor naming", "Complex logic", "Duplicate code", "Missing documentation", "Hardcoded values"];
        readonly bestPractices: readonly ["Be constructive and respectful", "Explain why, not just what", "Suggest improvements, not just problems", "Approval should mean 'I would be happy to maintain this'", "Focus on code, not person", "Ask questions to understand context", "Balance perfectionism with practicality"];
        readonly automatedChecks: readonly ["Linting (ESLint)", "Type checking (TypeScript)", "Formatting (Prettier)", "Unit tests", "Security scanning", "Complexity analysis", "Code coverage"];
    };
};
/**
 * Detect code smells in code
 */
export declare function detectCodeSmells(code: string): CodeSmell[];
/**
 * Get refactoring technique for code smell
 */
export declare function getRefactoringForSmell(smellName: string): RefactoringTechnique[];
/**
 * Type exports
 */
export type { CodeSmell, CodeSmellSeverity, RefactoringTechnique, CodeQualityMetric, TechnicalDebt, DebtPriority };
//# sourceMappingURL=layer-25-refactoring-quality.d.ts.map