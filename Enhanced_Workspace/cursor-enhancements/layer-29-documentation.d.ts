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
export declare const DOCUMENTATION: {
    /**
     * Code Documentation
     */
    codeDocumentation: {
        jsdoc: {
            name: string;
            type: DocumentationType;
            description: string;
            structure: string[];
            examples: string[];
            bestPractices: string[];
        };
        functionDocumentation: {
            description: string;
            standards: string[];
            example: string;
        };
        typeDocumentation: {
            description: string;
            standards: string[];
            example: string;
        };
        parameterDocumentation: {
            description: string;
            standards: string[];
            example: string;
        };
        returnValueDocumentation: {
            description: string;
            standards: string[];
            example: string;
        };
        exampleCode: {
            description: string;
            bestPractices: string[];
            example: string;
        };
    };
    /**
     * API Documentation
     */
    apiDocumentation: any;
}, requestResponseExamples: {
    description: "Provide request/response examples";
    bestPractices: [
        "Show complete examples",
        "Include all required fields",
        "Show different scenarios",
        "Use realistic data",
        "Include error examples"
    ];
}, errorScenarios: {
    description: "Document error scenarios";
    include: [
        "All possible error responses",
        "Error codes and messages",
        "When errors occur",
        "How to handle errors",
        "Error response format"
    ];
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
`;
}, authentication: {
    description: "Document authentication requirements";
    include: [
        "Authentication method",
        "How to obtain tokens",
        "Token format",
        "Token expiration",
        "Token refresh",
        "Example authenticated requests"
    ];
};
/**
 * Get documentation pattern by type and name
 */
export declare function getDocumentationPattern(type: DocumentationType, patternName: string): DocumentationPattern | undefined;
/**
 * Validate JSDoc comment
 */
export declare function validateJSDoc(comment: string): {
    valid: boolean;
    issues: string[];
};
/**
 * Type exports
 */
export type { DocumentationPattern, DocumentationType, CommentPattern };
//# sourceMappingURL=layer-29-documentation.d.ts.map