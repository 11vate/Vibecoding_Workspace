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
export const REFACTORING_QUALITY = {
  /**
   * Code Smells Detection
   */
  codeSmells: {
    longMethods: {
      name: "Long Methods/Functions",
      description: "Methods that are too long and do multiple things",
      severity: "high" as CodeSmellSeverity,
      detection: [
        "Methods longer than 20-30 lines",
        "Methods with multiple responsibilities",
        "Methods that are hard to understand",
        "Methods with deep nesting"
      ],
      impact: [
        "Hard to understand",
        "Hard to test",
        "Hard to maintain",
        "Hard to reuse"
      ],
      refactoring: [
        "Extract Method",
        "Extract Function",
        "Break into smaller methods",
        "Remove duplication"
      ]
    },
    
    largeClasses: {
      name: "Large Classes/Components",
      description: "Classes or components that are too large",
      severity: "high" as CodeSmellSeverity,
      detection: [
        "Classes with too many methods",
        "Components with too many responsibilities",
        "Classes with too many instance variables",
        "Components with too many props"
      ],
      impact: [
        "Violates Single Responsibility Principle",
        "Hard to understand",
        "Hard to test",
        "Hard to maintain"
      ],
      refactoring: [
        "Extract Class",
        "Extract Component",
        "Extract Subclass",
        "Split responsibilities"
      ]
    },
    
    duplicateCode: {
      name: "Duplicate Code",
      description: "Same or similar code in multiple places",
      severity: "medium" as CodeSmellSeverity,
      detection: [
        "Copy-pasted code blocks",
        "Similar code patterns",
        "Repeated logic",
        "Code that looks familiar"
      ],
      impact: [
        "Violates DRY principle",
        "Bugs need to be fixed in multiple places",
        "Changes need to be made in multiple places",
        "Code bloat"
      ],
      refactoring: [
        "Extract Method/Function",
        "Extract Class",
        "Pull Up Method",
        "Form Template Method",
        "Introduce Parameter Object"
      ]
    },
    
    longParameterLists: {
      name: "Long Parameter Lists",
      description: "Functions with too many parameters",
      severity: "medium" as CodeSmellSeverity,
      detection: [
        "Functions with more than 3-4 parameters",
        "Related parameters grouped together",
        "Functions hard to call"
      ],
      impact: [
        "Hard to understand",
        "Hard to call",
        "Easy to make mistakes",
        "Indicates missing abstraction"
      ],
      refactoring: [
        "Introduce Parameter Object",
        "Replace Parameter with Method Call",
        "Preserve Whole Object",
        "Introduce Named Parameters (using objects)"
      ]
    },
    
    dataClumps: {
      name: "Data Clumps",
      description: "Groups of data that travel together",
      severity: "low" as CodeSmellSeverity,
      detection: [
        "Same group of parameters in multiple methods",
        "Related data always together",
        "Missing data structure"
      ],
      impact: [
        "Code duplication",
        "Missing abstraction",
        "Hard to change",
        "Poor cohesion"
      ],
      refactoring: [
        "Introduce Parameter Object",
        "Extract Class",
        "Preserve Whole Object"
      ]
    },
    
    featureEnvy: {
      name: "Feature Envy",
      description: "Method uses more features of another class than its own",
      severity: "medium" as CodeSmellSeverity,
      detection: [
        "Method calls many methods of another object",
        "Method accesses many properties of another object",
        "Method seems to belong to another class"
      ],
      impact: [
        "Poor cohesion",
        "Tight coupling",
        "Logic in wrong place"
      ],
      refactoring: [
        "Move Method",
        "Extract Method and Move",
        "Move Field"
      ]
    },
    
    inappropriateIntimacy: {
      name: "Inappropriate Intimacy",
      description: "Classes know too much about each other's internals",
      severity: "medium" as CodeSmellSeverity,
      detection: [
        "Classes accessing private members",
        "Too many interactions between classes",
        "Circular dependencies"
      ],
      impact: [
        "Tight coupling",
        "Hard to change",
        "Violates encapsulation"
      ],
      refactoring: [
        "Move Method",
        "Move Field",
        "Change Bidirectional Association to Unidirectional",
        "Extract Class",
        "Hide Delegate"
      ]
    },
    
    commentsAsCodeSmell: {
      name: "Comments as Code Smell",
      description: "Comments that explain what code does (not why)",
      severity: "low" as CodeSmellSeverity,
      detection: [
        "Comments that explain obvious code",
        "Commented-out code",
        "Comments that duplicate code",
        "Comments that should be code"
      ],
      impact: [
        "Code not self-documenting",
        "Comments get out of sync",
        "Indicates unclear code"
      ],
      refactoring: [
        "Extract Method (replace comment with method name)",
        "Rename Variable (make code clearer)",
        "Remove commented code",
        "Explain why, not what"
      ]
    }
  },

  /**
   * Refactoring Techniques
   */
  refactoringTechniques: {
    extractMethod: {
      name: "Extract Method",
      description: "Extract code into a new method",
      whenToUse: [
        "Code block does one thing",
        "Code block is reused",
        "Method is too long",
        "Code block has a clear purpose"
      ],
      steps: [
        "Create new method with descriptive name",
        "Move code block to new method",
        "Replace original code with method call",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Improves readability",
        "Enables reuse",
        "Easier to test",
        "Single responsibility"
      ],
      risks: [
        "Need to handle variable scope",
        "May need to pass parameters",
        "May need to return values"
      ]
    },
    
    extractClass: {
      name: "Extract Class",
      description: "Extract part of a class into a new class",
      whenToUse: [
        "Class has multiple responsibilities",
        "Part of class can be independent",
        "Class is too large",
        "Subset of data and methods belong together"
      ],
      steps: [
        "Create new class",
        "Move fields and methods to new class",
        "Create instance of new class in original",
        "Update references",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Single Responsibility Principle",
        "Better organization",
        "Easier to understand",
        "Easier to test"
      ],
      risks: [
        "Need to manage references",
        "May create coupling issues",
        "May need to refactor callers"
      ]
    },
    
    inlineMethod: {
      name: "Inline Method",
      description: "Replace method call with method body",
      whenToUse: [
        "Method body is clearer than name",
        "Method is only called once",
        "Method is too simple",
        "Method adds no value"
      ],
      steps: [
        "Replace method call with method body",
        "Remove method definition",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Simplifies code",
        "Removes unnecessary abstraction"
      ],
      risks: [
        "May reduce readability",
        "May duplicate code"
      ]
    },
    
    moveMethod: {
      name: "Move Method",
      description: "Move method to a more appropriate class",
      whenToUse: [
        "Method uses more features of another class",
        "Method doesn't fit in current class",
        "Better cohesion in another class"
      ],
      steps: [
        "Identify target class",
        "Copy method to target class",
        "Update method to work in new context",
        "Replace original calls with new calls",
        "Remove original method",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Better cohesion",
        "Reduced coupling",
        "More logical organization"
      ],
      risks: [
        "May break callers",
        "Need to update references",
        "May need to pass additional parameters"
      ]
    },
    
    replaceTempWithQuery: {
      name: "Replace Temp with Query",
      description: "Replace temporary variable with method call",
      whenToUse: [
        "Temporary variable used once",
        "Temporary variable makes code clearer",
        "Temporary variable can be extracted"
      ],
      steps: [
        "Extract expression into method",
        "Replace temp variable with method call",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "More readable",
        "Reusable",
        "Easier to test"
      ],
      risks: [
        "May impact performance (but usually negligible)",
        "May need to pass parameters"
      ]
    },
    
    splitVariable: {
      name: "Split Variable",
      description: "Split variable that's assigned more than once",
      whenToUse: [
        "Variable used for multiple purposes",
        "Variable name doesn't reflect all uses",
        "Variable is confusing"
      ],
      steps: [
        "Create new variable for each use",
        "Replace each assignment",
        "Remove original variable",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Clearer intent",
        "Easier to understand",
        "Easier to rename"
      ],
      risks: [
        "May need to update multiple references",
        "May need to handle scope"
      ]
    },
    
    replaceMagicNumbers: {
      name: "Replace Magic Numbers with Constants",
      description: "Replace literal numbers with named constants",
      whenToUse: [
        "Number has meaning beyond its value",
        "Number is used multiple times",
        "Number's meaning is unclear"
      ],
      steps: [
        "Create constant with descriptive name",
        "Replace number with constant",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Self-documenting",
        "Easier to change",
        "Avoids typos"
      ],
      risks: [
        "May create many constants",
        "Need to choose good names"
      ]
    },
    
    replaceConditionalWithPolymorphism: {
      name: "Replace Conditional with Polymorphism",
      description: "Replace conditional logic with polymorphism",
      whenToUse: [
        "Conditional based on type",
        "Same conditional in multiple places",
        "Adding new type requires changes"
      ],
      steps: [
        "Create base class/interface",
        "Create subclasses for each type",
        "Move conditional logic to subclasses",
        "Replace conditional with polymorphism",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Follows Open/Closed Principle",
        "Easier to extend",
        "Removes conditional logic"
      ],
      risks: [
        "May be overkill for simple cases",
        "Adds complexity",
        "Need to restructure code"
      ]
    },
    
    introduceParameterObject: {
      name: "Introduce Parameter Object",
      description: "Replace multiple parameters with an object",
      whenToUse: [
        "Multiple related parameters",
        "Long parameter list",
        "Parameters often passed together"
      ],
      steps: [
        "Create parameter object class",
        "Add parameters as fields",
        "Replace parameters with object",
        "Update callers",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Reduces parameter count",
        "Groups related data",
        "Easier to extend"
      ],
      risks: [
        "Need to update all callers",
        "May add indirection"
      ]
    },
    
    replaceErrorCodeWithException: {
      name: "Replace Error Code with Exception",
      description: "Replace error codes with exceptions",
      whenToUse: [
        "Error codes returned from methods",
        "Error handling is complex",
        "Errors should propagate"
      ],
      steps: [
        "Create exception classes",
        "Replace error codes with exceptions",
        "Update error handling",
        "Test that behavior is unchanged"
      ],
      benefits: [
        "Clearer error handling",
        "Forces error handling",
        "Better error propagation"
      ],
      risks: [
        "May need to update error handling everywhere",
        "May change error handling behavior"
      ]
    }
  },

  /**
   * Technical Debt Management
   */
  technicalDebt: {
    identification: {
      strategies: [
        "Code smells",
        "High complexity",
        "Low test coverage",
        "Known issues",
        "Temporary solutions",
        "Commented TODOs/FIXMEs",
        "Performance issues",
        "Security vulnerabilities"
      ]
    },
    
    prioritization: {
      factors: [
        "Impact on users",
        "Impact on developers",
        "Risk of bugs",
        "Maintenance cost",
        "Effort to fix"
      ],
      matrix: {
        critical: "High impact, any effort",
        high: "High impact, low effort OR medium impact, high effort",
        medium: "Medium impact, medium effort",
        low: "Low impact, any effort OR any impact, low effort"
      }
    },
    
    repayment: {
      strategies: [
        "Fix as you go (during feature work)",
        "Dedicated refactoring sprints",
        "Boy Scout Rule (leave code better than you found it)",
        "Allocate time for debt repayment",
        "Track and prioritize debt"
      ],
      boyScoutRule: "Always leave the code better than you found it - fix small issues as you encounter them"
    },
    
    prevention: {
      strategies: [
        "Code reviews",
        "Pair programming",
        "Automated quality checks",
        "Regular refactoring",
        "Technical standards",
        "Test coverage requirements",
        "Architecture reviews"
      ]
    }
  },

  /**
   * Code Quality Metrics
   */
  codeQualityMetrics: {
    cyclomaticComplexity: {
      name: "Cyclomatic Complexity",
      description: "Measure of code complexity based on decision points",
      threshold: {
        good: 10,
        acceptable: 15,
        poor: 20
      },
      calculation: "Number of decision points + 1",
      reduction: [
        "Extract methods",
        "Simplify conditionals",
        "Use early returns",
        "Reduce nesting"
      ]
    },
    
    codeDuplication: {
      name: "Code Duplication",
      description: "Percentage of duplicated code",
      threshold: {
        good: 0,
        acceptable: 3,
        poor: 5
      },
      calculation: "Percentage of duplicated lines",
      reduction: [
        "Extract common code",
        "Use inheritance/composition",
        "Create utility functions",
        "Use design patterns"
      ]
    },
    
    maintainabilityIndex: {
      name: "Maintainability Index",
      description: "Composite metric of maintainability",
      threshold: {
        good: 80,
        acceptable: 65,
        poor: 50
      },
      calculation: "Function of complexity, lines of code, and Halstead volume",
      improvement: [
        "Reduce complexity",
        "Reduce code size",
        "Improve readability",
        "Reduce duplication"
      ]
    },
    
    testCoverage: {
      name: "Test Coverage",
      description: "Percentage of code covered by tests",
      threshold: {
        good: 90,
        acceptable: 80,
        poor: 70
      },
      calculation: "Covered lines / Total lines",
      improvement: [
        "Write more tests",
        "Focus on critical paths",
        "Test edge cases",
        "Improve test quality"
      ]
    }
  },

  /**
   * Code Review Patterns
   */
  codeReview: {
    checklist: [
      "Does the code work?",
      "Is the code readable and understandable?",
      "Does the code follow project standards?",
      "Is the code well-tested?",
      "Are there any security concerns?",
      "Are there any performance issues?",
      "Is error handling appropriate?",
      "Are there any code smells?",
      "Is documentation adequate?",
      "Are there any edge cases not handled?"
    ],
    
    commonIssues: [
      "Missing error handling",
      "Security vulnerabilities",
      "Performance issues",
      "Code smells",
      "Missing tests",
      "Poor naming",
      "Complex logic",
      "Duplicate code",
      "Missing documentation",
      "Hardcoded values"
    ],
    
    bestPractices: [
      "Be constructive and respectful",
      "Explain why, not just what",
      "Suggest improvements, not just problems",
      "Approval should mean 'I would be happy to maintain this'",
      "Focus on code, not person",
      "Ask questions to understand context",
      "Balance perfectionism with practicality"
    ],
    
    automatedChecks: [
      "Linting (ESLint)",
      "Type checking (TypeScript)",
      "Formatting (Prettier)",
      "Unit tests",
      "Security scanning",
      "Complexity analysis",
      "Code coverage"
    ]
  }
} as const;

/**
 * Detect code smells in code
 */
export function detectCodeSmells(code: string): CodeSmell[] {
  const detected: CodeSmell[] = [];
  // Simplified detection - in practice would use AST analysis
  // This is a placeholder for actual code smell detection logic
  
  // Example: Check for long methods (line count)
  const lines = code.split('\n').length;
  if (lines > 50) {
    detected.push(REFACTORING_QUALITY.codeSmells.longMethods);
  }
  
  return detected;
}

/**
 * Get refactoring technique for code smell
 */
export function getRefactoringForSmell(smellName: string): RefactoringTechnique[] {
  const smell = (REFACTORING_QUALITY.codeSmells as Record<string, CodeSmell>)[smellName];
  if (!smell) return [];
  
  // Map code smells to refactoring techniques
  const techniques: RefactoringTechnique[] = [];
  smell.refactoring.forEach(refactoringName => {
    const technique = (REFACTORING_QUALITY.refactoringTechniques as Record<string, RefactoringTechnique>)[refactoringName.toLowerCase().replace(/\s+/g, '')];
    if (technique) {
      techniques.push(technique);
    }
  });
  
  return techniques;
}

/**
 * Type exports
 */
export type { CodeSmell, CodeSmellSeverity, RefactoringTechnique, CodeQualityMetric, TechnicalDebt, DebtPriority };





















