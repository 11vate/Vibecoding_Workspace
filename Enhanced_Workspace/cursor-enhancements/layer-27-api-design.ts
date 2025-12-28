/**
 * LAYER 27 — API DESIGN & INTEGRATION
 * 
 * API design patterns and integration strategies
 * 
 * This layer provides REST API design patterns, GraphQL patterns, real-time
 * API patterns, API integration patterns, documentation patterns, and API
 * testing patterns for building robust, well-designed APIs.
 */

/**
 * API style
 */
export type APIStyle = "REST" | "GraphQL" | "gRPC" | "WebSocket" | "SSE";

/**
 * HTTP method
 */
export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

/**
 * API pattern definition
 */
export interface APIPattern {
  name: string;
  description: string;
  useCases: string[];
  implementation: string[];
  bestPractices: string[];
}

/**
 * Error response format
 */
export interface ErrorResponseFormat {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp?: string;
    path?: string;
  };
}

/**
 * Main API design configuration
 */
export const API_DESIGN = {
  /**
   * REST API Design
   */
  rest: {
    resourceNaming: {
      description: "RESTful resource naming conventions",
      conventions: [
        "Use nouns, not verbs (/users not /getUsers)",
        "Use plural nouns for collections (/users)",
        "Use hierarchical structure (/users/123/posts)",
        "Use lowercase with hyphens (/user-profiles)",
        "Avoid file extensions (/users not /users.json)",
        "Be consistent"
      ],
      examples: [
        "GET /users - List users",
        "GET /users/123 - Get user",
        "POST /users - Create user",
        "PUT /users/123 - Update user",
        "DELETE /users/123 - Delete user"
      ]
    },
    
    httpMethods: {
      GET: {
        method: "GET" as HTTPMethod,
        description: "Retrieve resource(s)",
        useCases: ["Read operations", "List resources", "Get single resource"],
        idempotent: true,
        safe: true,
        requestBody: false,
        examples: [
          "GET /users - List users",
          "GET /users/123 - Get user"
        ]
      },
      
      POST: {
        method: "POST" as HTTPMethod,
        description: "Create new resource",
        useCases: ["Create operations", "Non-idempotent actions"],
        idempotent: false,
        safe: false,
        requestBody: true,
        examples: [
          "POST /users - Create user",
          "POST /users/123/activate - Activate user"
        ]
      },
      
      PUT: {
        method: "PUT" as HTTPMethod,
        description: "Replace entire resource",
        useCases: ["Full updates", "Idempotent updates"],
        idempotent: true,
        safe: false,
        requestBody: true,
        examples: [
          "PUT /users/123 - Replace user (full update)"
        ]
      },
      
      PATCH: {
        method: "PATCH" as HTTPMethod,
        description: "Partially update resource",
        useCases: ["Partial updates", "Efficient updates"],
        idempotent: false,
        safe: false,
        requestBody: true,
        examples: [
          "PATCH /users/123 - Update user fields"
        ]
      },
      
      DELETE: {
        method: "DELETE" as HTTPMethod,
        description: "Delete resource",
        useCases: ["Delete operations"],
        idempotent: true,
        safe: false,
        requestBody: false,
        examples: [
          "DELETE /users/123 - Delete user"
        ]
      }
    },
    
    statusCodes: {
      success: {
        "200": "OK - Successful GET, PUT, PATCH",
        "201": "Created - Successful POST",
        "202": "Accepted - Request accepted for processing",
        "204": "No Content - Successful DELETE"
      },
      clientError: {
        "400": "Bad Request - Invalid request",
        "401": "Unauthorized - Authentication required",
        "403": "Forbidden - Insufficient permissions",
        "404": "Not Found - Resource not found",
        "409": "Conflict - Resource conflict",
        "422": "Unprocessable Entity - Validation error"
      },
      serverError: {
        "500": "Internal Server Error - Server error",
        "502": "Bad Gateway - Invalid response from upstream",
        "503": "Service Unavailable - Service temporarily unavailable"
      }
    },
    
    versioning: {
      strategies: [
        "URL versioning (/v1/users)",
        "Header versioning (Accept: application/vnd.api+json;version=1)",
        "Query parameter versioning (?version=1)"
      ],
      bestPractices: [
        "Version from the start",
        "Maintain backward compatibility when possible",
        "Deprecate old versions with timeline",
        "Document versioning strategy"
      ],
      recommendation: "URL versioning is simplest and clearest"
    },
    
    pagination: {
      cursorBased: {
        description: "Use cursor for pagination (recommended)",
        advantages: ["Efficient", "Works with dynamic data", "No offset issues"],
        implementation: [
          "Use cursor (e.g., last item ID or timestamp)",
          "Return next_cursor in response",
          "Client sends cursor for next page"
        ],
        example: "GET /users?cursor=abc123&limit=20"
      },
      
      offsetBased: {
        description: "Use offset and limit for pagination",
        advantages: ["Simple", "Easy to implement"],
        disadvantages: ["Inefficient for large offsets", "Inconsistent with data changes"],
        implementation: [
          "Use offset and limit parameters",
          "Return total count if needed",
          "Calculate total pages"
        ],
        example: "GET /users?offset=0&limit=20"
      },
      
      bestPractices: [
        "Include pagination metadata (total, has_next, etc.)",
        "Set reasonable default limits",
        "Allow client to specify limit (with max)",
        "Use cursor-based for large datasets"
      ]
    },
    
    filteringSorting: {
      filtering: {
        description: "Filter resources by criteria",
        patterns: [
          "Query parameters for filters",
          "Use operators (=, >, <, in, contains)",
          "Document filter options"
        ],
        example: "GET /users?status=active&age_min=18"
      },
      
      sorting: {
        description: "Sort resources",
        patterns: [
          "sort parameter with field and direction",
          "Multiple sort fields",
          "Document sortable fields"
        ],
        example: "GET /users?sort=created_at:desc,name:asc"
      }
    },
    
    errorResponseFormat: {
      description: "Consistent error response format",
      format: {
        error: {
          code: "ERROR_CODE",
          message: "Human-readable error message",
          details: {},
          timestamp: "ISO 8601 timestamp",
          path: "/api/users/123"
        }
      } as ErrorResponseFormat,
      bestPractices: [
        "Consistent error format",
        "Include error codes",
        "Human-readable messages",
        "Details for debugging (dev) or user guidance (prod)",
        "Include request path",
        "Don't expose sensitive information"
      ]
    }
  },

  /**
   * GraphQL Patterns
   */
  graphql: {
    schemaDesign: {
      description: "Design GraphQL schemas",
      principles: [
        "Start with types, not queries",
        "Use meaningful type names",
        "Use enums for fixed sets of values",
        "Use interfaces for shared fields",
        "Use unions for different types",
        "Keep schemas focused"
      ],
      bestPractices: [
        "Version schema (if needed)",
        "Document with descriptions",
        "Use non-null types appropriately",
        "Design for client needs"
      ]
    },
    
    queryOptimization: {
      description: "Optimize GraphQL queries",
      strategies: [
        "Use DataLoader for N+1 problem",
        "Implement query complexity analysis",
        "Use field-level resolvers efficiently",
        "Batch database queries",
        "Cache resolver results"
      ],
      n1Problem: {
        description: "N+1 query problem in GraphQL",
        solution: "Use DataLoader to batch and cache queries",
        implementation: [
          "Create DataLoader instances",
          "Use DataLoader in resolvers",
          "Batch database queries",
          "Cache results"
        ]
      }
    },
    
    mutationPatterns: {
      description: "Design GraphQL mutations",
      patterns: [
        "Use descriptive mutation names",
        "Return affected resource",
        "Handle errors properly",
        "Use input types for complex inputs",
        "Make mutations idempotent when possible"
      ],
      example: `
mutation {
  createUser(input: { name: "John", email: "john@example.com" }) {
    user {
      id
      name
      email
    }
    errors {
      field
      message
    }
  }
}`
    },
    
    subscriptionPatterns: {
      description: "Design GraphQL subscriptions",
      useCases: [
        "Real-time updates",
        "Live data",
        "Notifications",
        "Collaborative features"
      ],
      implementation: [
        "Use WebSocket or SSE",
        "Subscribe to specific events",
        "Handle connection management",
        "Implement subscription filters"
      ]
    }
  },

  /**
   * Real-Time APIs
   */
  realTime: {
    websocket: {
      description: "WebSocket for bidirectional communication",
      useCases: [
        "Real-time chat",
        "Live updates",
        "Collaborative editing",
        "Gaming"
      ],
      patterns: [
        "Connection management",
        "Message protocol",
        "Heartbeat/ping-pong",
        "Reconnection logic",
        "Error handling"
      ],
      implementation: [
        "Establish WebSocket connection",
        "Handle connection events",
        "Send/receive messages",
        "Handle disconnections",
        "Implement reconnection"
      ]
    },
    
    serverSentEvents: {
      description: "Server-Sent Events for server-to-client streaming",
      useCases: [
        "Live updates",
        "Notifications",
        "Progress updates",
        "One-way streaming"
      ],
      patterns: [
        "Event streaming",
        "Event types",
        "Reconnection",
        "Event IDs"
      ],
      implementation: [
        "Set up SSE endpoint",
        "Stream events to client",
        "Handle reconnection",
        "Include event IDs for replay"
      ]
    },
    
    longPolling: {
      description: "Long polling for real-time updates",
      useCases: [
        "Fallback for WebSocket",
        "Simple real-time needs",
        "Firewall-friendly"
      ],
      patterns: [
        "Extended HTTP request",
        "Return when data available",
        "Client immediately polls again"
      ],
      disadvantages: [
        "Higher latency",
        "More HTTP overhead",
        "Connection management"
      ]
    }
  },

  /**
   * API Integration Patterns
   */
  integration: {
    retryStrategies: {
      exponentialBackoff: {
        description: "Exponential backoff for retries",
        implementation: [
          "Start with initial delay",
          "Double delay on each retry",
          "Cap maximum delay",
          "Limit maximum retries",
          "Jitter to avoid thundering herd"
        ],
        useCases: [
          "Transient failures",
          "Rate limiting",
          "Service unavailability"
        ]
      },
      
      strategies: [
        "Exponential backoff",
        "Linear backoff",
        "Fixed interval",
        "Circuit breaker integration"
      ]
    },
    
    circuitBreaker: {
      description: "Circuit breaker pattern for API calls",
      states: ["Closed (normal)", "Open (failing)", "Half-open (testing)"],
      implementation: [
        "Track failure rate",
        "Open circuit on threshold",
        "Return cached/fallback response",
        "Attempt recovery periodically",
        "Close circuit when healthy"
      ],
      useCases: [
        "External API calls",
        "Unreliable services",
        "Prevent cascade failures"
      ]
    },
    
    rateLimiting: {
      description: "Handle rate limiting from APIs",
      strategies: [
        "Respect rate limit headers",
        "Implement request queuing",
        "Use exponential backoff",
        "Cache responses when possible",
        "Prioritize requests"
      ],
      headers: [
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
        "Retry-After"
      ]
    },
    
    requestResponseTransformation: {
      description: "Transform requests and responses",
      useCases: [
        "API format conversion",
        "Data normalization",
        "Field mapping",
        "Response enrichment"
      ],
      implementation: [
        "Transform request before sending",
        "Transform response after receiving",
        "Handle transformation errors",
        "Cache transformations when possible"
      ]
    },
    
    errorHandling: {
      description: "Handle API errors gracefully",
      strategies: [
        "Retry transient errors",
        "Handle rate limiting",
        "Provide fallback responses",
        "Log errors appropriately",
        "User-friendly error messages",
        "Error classification (transient vs permanent)"
      ],
      errorTypes: {
        transient: ["Network errors", "5xx errors", "Rate limiting"],
        permanent: ["4xx errors (except rate limiting)", "Authentication errors"]
      }
    }
  },

  /**
   * API Documentation
   */
  documentation: {
    openAPI: {
      description: "OpenAPI/Swagger documentation",
      benefits: [
        "Standard format",
        "Interactive documentation",
        "Code generation",
        "Testing tools"
      ],
      patterns: [
        "Define schemas",
        "Document endpoints",
        "Include examples",
        "Document errors",
        "Version documentation"
      ]
    },
    
    bestPractices: {
      description: "API documentation best practices",
      practices: [
        "Document all endpoints",
        "Include request/response examples",
        "Document error responses",
        "Include authentication requirements",
        "Document rate limits",
        "Provide code examples",
        "Keep documentation updated",
        "Use interactive documentation"
      ]
    },
    
    codeExamples: {
      description: "Provide code examples",
      languages: ["JavaScript", "TypeScript", "cURL", "Python"],
      examples: [
        "Show common use cases",
        "Include error handling",
        "Show authentication",
        "Provide copy-paste examples"
      ]
    }
  },

  /**
   * API Testing
   */
  testing: {
    contractTesting: {
      description: "Test API contracts",
      benefits: [
        "Ensure API compatibility",
        "Catch breaking changes",
        "Document API contracts",
        "Enable independent development"
      ],
      tools: ["Pact", "OpenAPI contract testing"],
      implementation: [
        "Define contracts",
        "Test provider against contract",
        "Test consumer against contract",
        "Verify compatibility"
      ]
    },
    
    integrationTesting: {
      description: "Test API integration",
      patterns: [
        "Test happy paths",
        "Test error scenarios",
        "Test edge cases",
        "Test authentication",
        "Test rate limiting"
      ],
      tools: ["Supertest", "MSW", "Nock"],
      bestPractices: [
        "Use test database",
        "Clean up test data",
        "Mock external APIs",
        "Test with realistic data"
      ]
    },
    
    mockServices: {
      description: "Mock API services for testing",
      strategies: [
        "MSW (Mock Service Worker)",
        "Nock for HTTP mocking",
        "API mocking services",
        "In-memory mocks"
      ],
      useCases: [
        "Unit testing",
        "Development",
        "Offline development",
        "Testing error scenarios"
      ]
    }
  }
} as const;

/**
 * Get API pattern by style and name
 */
export function getAPIPattern(style: APIStyle, patternName: string): APIPattern | undefined {
  // Return API pattern by style and name
  // This is a placeholder - would need to search through patterns
  return undefined;
}

/**
 * Validate REST resource name
 */
export function validateRESTResourceName(name: string): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!/^[a-z-]+$/.test(name)) {
    issues.push("Resource name should be lowercase with hyphens");
  }
  
  if (/\s/.test(name)) {
    issues.push("Resource name should not contain spaces");
  }
  
  if (name.endsWith('-') || name.startsWith('-')) {
    issues.push("Resource name should not start or end with hyphen");
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Type exports
 */
export type { APIPattern, APIStyle, HTTPMethod, ErrorResponseFormat };





















