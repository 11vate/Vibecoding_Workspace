/**
 * LAYER 29 — DOCUMENTATION & COMMUNICATION
 * 
 * Documentation patterns and code communication strategies
 * 
 * This layer provides code documentation patterns, API documentation,
 * architecture documentation, code comment guidelines, README patterns,
 * and in-code communication strategies for maintainable, well-documented code.
 */

/**
 * Documentation type
 */
export type DocumentationType = "code" | "api" | "architecture" | "readme" | "inline";

/**
 * Documentation pattern
 */
export interface DocumentationPattern {
  name: string;
  type: DocumentationType;
  description: string;
  structure: string[];
  examples: string[];
  bestPractices: string[];
}

/**
 * Comment pattern
 */
export interface CommentPattern {
  type: "inline" | "block" | "doc";
  whenToUse: string[];
  format: string;
  examples: string[];
}

/**
 * Main documentation configuration
 */
export const DOCUMENTATION = {
  /**
   * Code Documentation
   */
  codeDocumentation: {
    jsdoc: {
      name: "JSDoc/TSDoc",
      type: "code" as DocumentationType,
      description: "Document functions, classes, and types",
      structure: [
        "/**",
        " * Description",
        " * @param {type} paramName - Description",
        " * @returns {type} Description",
        " * @throws {ErrorType} Description",
        " * @example",
        " * // Example code",
        " */"
      ],
      examples: [
        "/**",
        " * Calculates the total of an array of numbers.",
        " * @param numbers - Array of numbers to sum",
        " * @returns The sum of all numbers in the array",
        " * @throws {TypeError} If numbers contains non-numeric values",
        " * @example",
        " * calculateTotal([1, 2, 3]) // returns 6",
        " */",
        "function calculateTotal(numbers: number[]): number {",
        "  return numbers.reduce((sum, num) => sum + num, 0);",
        "}"
      ],
      bestPractices: [
        "Document public APIs",
        "Include parameter descriptions",
        "Include return type and description",
        "Document exceptions/errors",
        "Provide code examples",
        "Keep documentation up to date"
      ]
    },
    
    functionDocumentation: {
      description: "Document functions effectively",
      standards: [
        "Describe what function does",
        "Document parameters (type, purpose, constraints)",
        "Document return value (type, meaning)",
        "Document exceptions/errors",
        "Provide usage examples",
        "Document side effects",
        "Document complexity if significant"
      ],
      example: `
/**
 * Sorts an array of users by their creation date.
 * 
 * @param users - Array of user objects to sort
 * @param order - Sort order: 'asc' for ascending, 'desc' for descending (default: 'asc')
 * @returns New sorted array (original array is not modified)
 * 
 * @example
 * const sorted = sortUsersByDate(users, 'desc');
 */
function sortUsersByDate(users: User[], order: 'asc' | 'desc' = 'asc'): User[] {
  // Implementation
}`
    },
    
    typeDocumentation: {
      description: "Document types and interfaces",
      standards: [
        "Describe purpose of type",
        "Document properties/fields",
        "Provide usage examples",
        "Document constraints",
        "Document relationships to other types"
      ],
      example: `
/**
 * Represents a user in the system.
 * 
 * @property id - Unique identifier for the user
 * @property email - User's email address (must be unique)
 * @property name - User's display name
 * @property role - User's role in the system (affects permissions)
 * 
 * @example
 * const user: User = {
 *   id: '123',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   role: 'admin'
 * };
 */
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}`
    },
    
    parameterDocumentation: {
      description: "Document function parameters",
      standards: [
        "Parameter name",
        "Parameter type",
        "Parameter purpose/description",
        "Constraints or valid values",
        "Default values",
        "Optional vs required"
      ],
      example: `
/**
 * @param userId - Unique identifier of the user (UUID format)
 * @param includeDeleted - Whether to include soft-deleted users (default: false)
 * @param limit - Maximum number of results to return (must be between 1 and 100, default: 10)
 */
function getUser(userId: string, includeDeleted = false, limit = 10): User | null {
  // Implementation
}`
    },
    
    returnValueDocumentation: {
      description: "Document return values",
      standards: [
        "Return type",
        "What is returned",
        "Special values (null, undefined cases)",
        "Return structure",
        "Side effects"
      ],
      example: `
/**
 * @returns User object if found, null if user doesn't exist, undefined if access denied
 */
function getUser(userId: string): User | null | undefined {
  // Implementation
}`
    },
    
    exampleCode: {
      description: "Include example code in documentation",
      bestPractices: [
        "Show common use cases",
        "Show edge cases",
        "Show error handling",
        "Keep examples simple but realistic",
        "Update examples when API changes"
      ],
      example: `
/**
 * @example
 * // Basic usage
 * const result = calculateTotal([1, 2, 3]);
 * console.log(result); // 6
 * 
 * // Empty array
 * const empty = calculateTotal([]);
 * console.log(empty); // 0
 * 
 * // With error handling
 * try {
 *   const invalid = calculateTotal(['not', 'numbers']);
 * } catch (error) {
 *   console.error('Invalid input:', error);
 * }
 */`
    }
  },

  /**
   * API Documentation
   */
  apiDocumentation: {
    endpoint: {
      description: "Document API endpoints",
      structure: [
        "Endpoint URL and method",
        "Description/purpose",
        "Authentication requirements",
        "Request parameters (path, query, body)",
        "Request body schema",
        "Response schema",
        "Status codes",
        "Error responses",
        "Example requests",
        "Example responses"
      ],
      example: `
## GET /users/:id

Get a user by ID.

**Authentication:** Required (Bearer token)

**Parameters:**
- `id` (path, required): User ID (UUID)

**Query Parameters:**
- `includeDeleted` (boolean, optional): Include soft-deleted users (default: false)

**Response:**
- 200 OK: User object
- 404 Not Found: User not found
- 401 Unauthorized: Invalid or missing token

**Example Request:**
\`\`\`bash
curl -H "Authorization: Bearer token" https://api.example.com/users/123
\`\`\`

**Example Response:**
\`\`\`json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe"
}
\`\`\`
`
    },
    
    requestResponseExamples: {
      description: "Provide request/response examples",
      bestPractices: [
        "Show complete examples",
        "Include all required fields",
        "Show different scenarios",
        "Use realistic data",
        "Include error examples"
      ]
    },
    
    errorScenarios: {
      description: "Document error scenarios",
      include: [
        "All possible error responses",
        "Error codes and messages",
        "When errors occur",
        "How to handle errors",
        "Error response format"
      ],
      example: `
**Error Responses:**
- 400 Bad Request: Invalid input
  \`\`\`json
  {
    "error": {
      "code": "INVALID_INPUT",
      "message": "Email format is invalid"
    }
  }
  \`\`\`
- 404 Not Found: User not found
- 500 Internal Server Error: Server error
`
    },
    
    authentication: {
      description: "Document authentication requirements",
      include: [
        "Authentication method",
        "How to obtain tokens",
        "Token format",
        "Token expiration",
        "Token refresh",
        "Example authenticated requests"
      ]
    }
  },

  /**
   * Architecture Documentation
   */
  architectureDocumentation: {
    adr: {
      name: "Architecture Decision Records (ADRs)",
      type: "architecture" as DocumentationType,
      description: "Document significant architecture decisions",
      structure: [
        "# [Title]",
        "",
        "## Status",
        "Proposed | Accepted | Deprecated | Superseded",
        "",
        "## Context",
        "What is the issue we're trying to address?",
        "",
        "## Decision",
        "What decision was made?",
        "",
        "## Consequences",
        "What are the positive and negative consequences?",
        "",
        "## Alternatives Considered",
        "What other options were considered?"
      ],
      bestPractices: [
        "Write ADRs for significant decisions",
        "Keep ADRs concise",
        "Update status as decisions evolve",
        "Link related ADRs",
        "Review ADRs periodically"
      ]
    },
    
    systemDiagrams: {
      description: "Document system architecture with diagrams",
      types: [
        "System context diagrams",
        "Container diagrams",
        "Component diagrams",
        "Deployment diagrams",
        "Sequence diagrams",
        "Data flow diagrams"
      ],
      tools: ["Mermaid", "PlantUML", "Draw.io", "diagrams.net"],
      bestPractices: [
        "Keep diagrams simple",
        "Use consistent notation",
        "Update diagrams when architecture changes",
        "Include legends",
        "Version control diagrams"
      ]
    },
    
    componentDiagrams: {
      description: "Document component structure",
      include: [
        "Component hierarchy",
        "Component responsibilities",
        "Component interactions",
        "Data flow",
        "Dependencies"
      ]
    },
    
    dataFlow: {
      description: "Document data flow through system",
      include: [
        "Data sources",
        "Data transformations",
        "Data storage",
        "Data consumers",
        "Data flow direction"
      ]
    }
  },

  /**
   * Code Comments
   */
  codeComments: {
    whenToComment: {
      description: "When to add comments",
      principles: [
        "Explain WHY, not WHAT",
        "Document complex logic",
        "Document non-obvious decisions",
        "Document workarounds",
        "Document assumptions",
        "Document constraints"
      ],
      dontComment: [
        "Obvious code",
        "What code does (code should be self-explanatory)",
        "Outdated information",
        "Commented-out code"
      ]
    },
    
    commentPatterns: {
      inline: {
        type: "inline" as const,
        whenToUse: [
          "Brief explanations",
          "Clarifying complex expressions",
          "Non-obvious code"
        ],
        format: "// Brief explanation",
        examples: [
          "// Sort by date descending (newest first)",
          "const result = items.sort((a, b) => b.date - a.date);",
          "",
          "// Handle edge case: empty array returns 0",
          "if (array.length === 0) return 0;"
        ]
      },
      
      block: {
        type: "block" as const,
        whenToUse: [
          "Multi-line explanations",
          "Complex logic explanation",
          "Algorithm descriptions"
        ],
        format: "/* Multi-line explanation */",
        examples: [
          "/*",
          " * This algorithm uses a two-pointer technique to find",
          " * pairs that sum to the target. We start with pointers",
          " * at both ends and move them based on the current sum.",
          " */"
        ]
      },
      
      doc: {
        type: "doc" as const,
        whenToUse: [
          "Public APIs",
          "Functions",
          "Classes",
          "Types"
        ],
        format: "/** JSDoc/TSDoc format */",
        examples: [
          "/**",
          " * Calculates the factorial of a number.",
          " * @param n - Non-negative integer",
          " * @returns Factorial of n",
          " */"
        ]
      }
    },
    
    todoFixme: {
      description: "Managing TODO/FIXME comments",
      bestPractices: [
        "Include context and date",
        "Assign to person if possible",
        "Include issue number if applicable",
        "Review regularly",
        "Remove when addressed",
        "Don't leave TODOs in production code indefinitely"
      ],
      format: [
        "// TODO(username, date): Description - Issue #123",
        "// FIXME(username, date): Description - Critical bug",
        "// HACK(username, date): Temporary workaround - Issue #456"
      ]
    },
    
    commentMaintenance: {
      description: "Maintain comments",
      bestPractices: [
        "Keep comments up to date",
        "Remove outdated comments",
        "Review comments during code review",
        "Refactor code instead of adding comments when possible",
        "Delete commented-out code"
      ]
    }
  },

  /**
   * README Patterns
   */
  readme: {
    structure: {
      description: "README structure",
      sections: [
        "# Project Name",
        "",
        "Brief description of the project",
        "",
        "## Features",
        "List of key features",
        "",
        "## Installation",
        "How to install/setup",
        "",
        "## Usage",
        "How to use the project",
        "",
        "## Development",
        "Development setup and guidelines",
        "",
        "## Testing",
        "How to run tests",
        "",
        "## Contributing",
        "How to contribute",
        "",
        "## License",
        "License information"
      ]
    },
    
    installation: {
      description: "Installation instructions",
      include: [
        "Prerequisites",
        "Installation steps",
        "Configuration",
        "Environment variables",
        "Verification steps"
      ],
      example: `
## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Copy \`.env.example\` to \`.env\` and configure
4. Run migrations: \`npm run migrate\`
5. Start development server: \`npm run dev\`
`
    },
    
    usage: {
      description: "Usage examples",
      include: [
        "Basic usage",
        "Common use cases",
        "Code examples",
        "Configuration options",
        "CLI usage if applicable"
      ]
    },
    
    contributing: {
      description: "Contributing guidelines",
      include: [
        "How to contribute",
        "Code style guidelines",
        "Testing requirements",
        "Pull request process",
        "Issue reporting"
      ]
    }
  },

  /**
   * In-Code Communication
   */
  inCodeCommunication: {
    variableNaming: {
      description: "Self-documenting variable names",
      principles: [
        "Use descriptive names",
        "Avoid abbreviations",
        "Use consistent naming conventions",
        "Reflect purpose, not type",
        "Use domain terminology"
      ],
      examples: [
        "Good: userCount, calculateTotal, isValidEmail",
        "Bad: cnt, calc, flag, temp, data"
      ]
    },
    
    functionNaming: {
      description: "Self-documenting function names",
      patterns: [
        "Use verbs for functions (get, set, calculate, validate)",
        "Be specific (getUserById, not getUser)",
        "Use boolean functions with is/has/should (isValid, hasPermission)",
        "Use consistent naming patterns"
      ],
      examples: [
        "Good: calculateTotal, validateEmail, getUserById",
        "Bad: calc, check, get"
      ]
    },
    
    typeNames: {
      description: "Clear type names",
      principles: [
        "Use PascalCase for types",
        "Be descriptive",
        "Use domain terminology",
        "Avoid generic names (Data, Info, Manager)"
      ],
      examples: [
        "Good: User, OrderItem, PaymentProcessor",
        "Bad: Data, Info, Manager, Thing"
      ]
    },
    
    codeStructure: {
      description: "Clear code structure communicates intent",
      principles: [
        "Group related code",
        "Extract complex logic to functions",
        "Use consistent formatting",
        "Organize imports logically",
        "Separate concerns"
      ],
      benefits: [
        "Easier to understand",
        "Easier to navigate",
        "Self-documenting structure"
      ]
    }
  }
} as const;

/**
 * Get documentation pattern by type and name
 */
export function getDocumentationPattern(type: DocumentationType, patternName: string): DocumentationPattern | undefined {
  // Return documentation pattern by type and name
  // This is a placeholder - would need to search through patterns
  return undefined;
}

/**
 * Validate JSDoc comment
 */
export function validateJSDoc(comment: string): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!comment.includes('*')) {
    issues.push("JSDoc should use /** format");
  }
  
  if (!comment.includes('@param') && comment.includes('function')) {
    issues.push("Functions with parameters should document @param");
  }
  
  if (!comment.includes('@returns') && comment.includes('function')) {
    issues.push("Functions should document @returns");
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Type exports
 */
export type { DocumentationPattern, DocumentationType, CommentPattern };





















