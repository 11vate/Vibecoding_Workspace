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
export declare const API_DESIGN: {
    /**
     * REST API Design
     */
    readonly rest: {
        readonly resourceNaming: {
            readonly description: "RESTful resource naming conventions";
            readonly conventions: readonly ["Use nouns, not verbs (/users not /getUsers)", "Use plural nouns for collections (/users)", "Use hierarchical structure (/users/123/posts)", "Use lowercase with hyphens (/user-profiles)", "Avoid file extensions (/users not /users.json)", "Be consistent"];
            readonly examples: readonly ["GET /users - List users", "GET /users/123 - Get user", "POST /users - Create user", "PUT /users/123 - Update user", "DELETE /users/123 - Delete user"];
        };
        readonly httpMethods: {
            readonly GET: {
                readonly method: HTTPMethod;
                readonly description: "Retrieve resource(s)";
                readonly useCases: readonly ["Read operations", "List resources", "Get single resource"];
                readonly idempotent: true;
                readonly safe: true;
                readonly requestBody: false;
                readonly examples: readonly ["GET /users - List users", "GET /users/123 - Get user"];
            };
            readonly POST: {
                readonly method: HTTPMethod;
                readonly description: "Create new resource";
                readonly useCases: readonly ["Create operations", "Non-idempotent actions"];
                readonly idempotent: false;
                readonly safe: false;
                readonly requestBody: true;
                readonly examples: readonly ["POST /users - Create user", "POST /users/123/activate - Activate user"];
            };
            readonly PUT: {
                readonly method: HTTPMethod;
                readonly description: "Replace entire resource";
                readonly useCases: readonly ["Full updates", "Idempotent updates"];
                readonly idempotent: true;
                readonly safe: false;
                readonly requestBody: true;
                readonly examples: readonly ["PUT /users/123 - Replace user (full update)"];
            };
            readonly PATCH: {
                readonly method: HTTPMethod;
                readonly description: "Partially update resource";
                readonly useCases: readonly ["Partial updates", "Efficient updates"];
                readonly idempotent: false;
                readonly safe: false;
                readonly requestBody: true;
                readonly examples: readonly ["PATCH /users/123 - Update user fields"];
            };
            readonly DELETE: {
                readonly method: HTTPMethod;
                readonly description: "Delete resource";
                readonly useCases: readonly ["Delete operations"];
                readonly idempotent: true;
                readonly safe: false;
                readonly requestBody: false;
                readonly examples: readonly ["DELETE /users/123 - Delete user"];
            };
        };
        readonly statusCodes: {
            readonly success: {
                readonly "200": "OK - Successful GET, PUT, PATCH";
                readonly "201": "Created - Successful POST";
                readonly "202": "Accepted - Request accepted for processing";
                readonly "204": "No Content - Successful DELETE";
            };
            readonly clientError: {
                readonly "400": "Bad Request - Invalid request";
                readonly "401": "Unauthorized - Authentication required";
                readonly "403": "Forbidden - Insufficient permissions";
                readonly "404": "Not Found - Resource not found";
                readonly "409": "Conflict - Resource conflict";
                readonly "422": "Unprocessable Entity - Validation error";
            };
            readonly serverError: {
                readonly "500": "Internal Server Error - Server error";
                readonly "502": "Bad Gateway - Invalid response from upstream";
                readonly "503": "Service Unavailable - Service temporarily unavailable";
            };
        };
        readonly versioning: {
            readonly strategies: readonly ["URL versioning (/v1/users)", "Header versioning (Accept: application/vnd.api+json;version=1)", "Query parameter versioning (?version=1)"];
            readonly bestPractices: readonly ["Version from the start", "Maintain backward compatibility when possible", "Deprecate old versions with timeline", "Document versioning strategy"];
            readonly recommendation: "URL versioning is simplest and clearest";
        };
        readonly pagination: {
            readonly cursorBased: {
                readonly description: "Use cursor for pagination (recommended)";
                readonly advantages: readonly ["Efficient", "Works with dynamic data", "No offset issues"];
                readonly implementation: readonly ["Use cursor (e.g., last item ID or timestamp)", "Return next_cursor in response", "Client sends cursor for next page"];
                readonly example: "GET /users?cursor=abc123&limit=20";
            };
            readonly offsetBased: {
                readonly description: "Use offset and limit for pagination";
                readonly advantages: readonly ["Simple", "Easy to implement"];
                readonly disadvantages: readonly ["Inefficient for large offsets", "Inconsistent with data changes"];
                readonly implementation: readonly ["Use offset and limit parameters", "Return total count if needed", "Calculate total pages"];
                readonly example: "GET /users?offset=0&limit=20";
            };
            readonly bestPractices: readonly ["Include pagination metadata (total, has_next, etc.)", "Set reasonable default limits", "Allow client to specify limit (with max)", "Use cursor-based for large datasets"];
        };
        readonly filteringSorting: {
            readonly filtering: {
                readonly description: "Filter resources by criteria";
                readonly patterns: readonly ["Query parameters for filters", "Use operators (=, >, <, in, contains)", "Document filter options"];
                readonly example: "GET /users?status=active&age_min=18";
            };
            readonly sorting: {
                readonly description: "Sort resources";
                readonly patterns: readonly ["sort parameter with field and direction", "Multiple sort fields", "Document sortable fields"];
                readonly example: "GET /users?sort=created_at:desc,name:asc";
            };
        };
        readonly errorResponseFormat: {
            readonly description: "Consistent error response format";
            readonly format: ErrorResponseFormat;
            readonly bestPractices: readonly ["Consistent error format", "Include error codes", "Human-readable messages", "Details for debugging (dev) or user guidance (prod)", "Include request path", "Don't expose sensitive information"];
        };
    };
    /**
     * GraphQL Patterns
     */
    readonly graphql: {
        readonly schemaDesign: {
            readonly description: "Design GraphQL schemas";
            readonly principles: readonly ["Start with types, not queries", "Use meaningful type names", "Use enums for fixed sets of values", "Use interfaces for shared fields", "Use unions for different types", "Keep schemas focused"];
            readonly bestPractices: readonly ["Version schema (if needed)", "Document with descriptions", "Use non-null types appropriately", "Design for client needs"];
        };
        readonly queryOptimization: {
            readonly description: "Optimize GraphQL queries";
            readonly strategies: readonly ["Use DataLoader for N+1 problem", "Implement query complexity analysis", "Use field-level resolvers efficiently", "Batch database queries", "Cache resolver results"];
            readonly n1Problem: {
                readonly description: "N+1 query problem in GraphQL";
                readonly solution: "Use DataLoader to batch and cache queries";
                readonly implementation: readonly ["Create DataLoader instances", "Use DataLoader in resolvers", "Batch database queries", "Cache results"];
            };
        };
        readonly mutationPatterns: {
            readonly description: "Design GraphQL mutations";
            readonly patterns: readonly ["Use descriptive mutation names", "Return affected resource", "Handle errors properly", "Use input types for complex inputs", "Make mutations idempotent when possible"];
            readonly example: "\nmutation {\n  createUser(input: { name: \"John\", email: \"john@example.com\" }) {\n    user {\n      id\n      name\n      email\n    }\n    errors {\n      field\n      message\n    }\n  }\n}";
        };
        readonly subscriptionPatterns: {
            readonly description: "Design GraphQL subscriptions";
            readonly useCases: readonly ["Real-time updates", "Live data", "Notifications", "Collaborative features"];
            readonly implementation: readonly ["Use WebSocket or SSE", "Subscribe to specific events", "Handle connection management", "Implement subscription filters"];
        };
    };
    /**
     * Real-Time APIs
     */
    readonly realTime: {
        readonly websocket: {
            readonly description: "WebSocket for bidirectional communication";
            readonly useCases: readonly ["Real-time chat", "Live updates", "Collaborative editing", "Gaming"];
            readonly patterns: readonly ["Connection management", "Message protocol", "Heartbeat/ping-pong", "Reconnection logic", "Error handling"];
            readonly implementation: readonly ["Establish WebSocket connection", "Handle connection events", "Send/receive messages", "Handle disconnections", "Implement reconnection"];
        };
        readonly serverSentEvents: {
            readonly description: "Server-Sent Events for server-to-client streaming";
            readonly useCases: readonly ["Live updates", "Notifications", "Progress updates", "One-way streaming"];
            readonly patterns: readonly ["Event streaming", "Event types", "Reconnection", "Event IDs"];
            readonly implementation: readonly ["Set up SSE endpoint", "Stream events to client", "Handle reconnection", "Include event IDs for replay"];
        };
        readonly longPolling: {
            readonly description: "Long polling for real-time updates";
            readonly useCases: readonly ["Fallback for WebSocket", "Simple real-time needs", "Firewall-friendly"];
            readonly patterns: readonly ["Extended HTTP request", "Return when data available", "Client immediately polls again"];
            readonly disadvantages: readonly ["Higher latency", "More HTTP overhead", "Connection management"];
        };
    };
    /**
     * API Integration Patterns
     */
    readonly integration: {
        readonly retryStrategies: {
            readonly exponentialBackoff: {
                readonly description: "Exponential backoff for retries";
                readonly implementation: readonly ["Start with initial delay", "Double delay on each retry", "Cap maximum delay", "Limit maximum retries", "Jitter to avoid thundering herd"];
                readonly useCases: readonly ["Transient failures", "Rate limiting", "Service unavailability"];
            };
            readonly strategies: readonly ["Exponential backoff", "Linear backoff", "Fixed interval", "Circuit breaker integration"];
        };
        readonly circuitBreaker: {
            readonly description: "Circuit breaker pattern for API calls";
            readonly states: readonly ["Closed (normal)", "Open (failing)", "Half-open (testing)"];
            readonly implementation: readonly ["Track failure rate", "Open circuit on threshold", "Return cached/fallback response", "Attempt recovery periodically", "Close circuit when healthy"];
            readonly useCases: readonly ["External API calls", "Unreliable services", "Prevent cascade failures"];
        };
        readonly rateLimiting: {
            readonly description: "Handle rate limiting from APIs";
            readonly strategies: readonly ["Respect rate limit headers", "Implement request queuing", "Use exponential backoff", "Cache responses when possible", "Prioritize requests"];
            readonly headers: readonly ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset", "Retry-After"];
        };
        readonly requestResponseTransformation: {
            readonly description: "Transform requests and responses";
            readonly useCases: readonly ["API format conversion", "Data normalization", "Field mapping", "Response enrichment"];
            readonly implementation: readonly ["Transform request before sending", "Transform response after receiving", "Handle transformation errors", "Cache transformations when possible"];
        };
        readonly errorHandling: {
            readonly description: "Handle API errors gracefully";
            readonly strategies: readonly ["Retry transient errors", "Handle rate limiting", "Provide fallback responses", "Log errors appropriately", "User-friendly error messages", "Error classification (transient vs permanent)"];
            readonly errorTypes: {
                readonly transient: readonly ["Network errors", "5xx errors", "Rate limiting"];
                readonly permanent: readonly ["4xx errors (except rate limiting)", "Authentication errors"];
            };
        };
    };
    /**
     * API Documentation
     */
    readonly documentation: {
        readonly openAPI: {
            readonly description: "OpenAPI/Swagger documentation";
            readonly benefits: readonly ["Standard format", "Interactive documentation", "Code generation", "Testing tools"];
            readonly patterns: readonly ["Define schemas", "Document endpoints", "Include examples", "Document errors", "Version documentation"];
        };
        readonly bestPractices: {
            readonly description: "API documentation best practices";
            readonly practices: readonly ["Document all endpoints", "Include request/response examples", "Document error responses", "Include authentication requirements", "Document rate limits", "Provide code examples", "Keep documentation updated", "Use interactive documentation"];
        };
        readonly codeExamples: {
            readonly description: "Provide code examples";
            readonly languages: readonly ["JavaScript", "TypeScript", "cURL", "Python"];
            readonly examples: readonly ["Show common use cases", "Include error handling", "Show authentication", "Provide copy-paste examples"];
        };
    };
    /**
     * API Testing
     */
    readonly testing: {
        readonly contractTesting: {
            readonly description: "Test API contracts";
            readonly benefits: readonly ["Ensure API compatibility", "Catch breaking changes", "Document API contracts", "Enable independent development"];
            readonly tools: readonly ["Pact", "OpenAPI contract testing"];
            readonly implementation: readonly ["Define contracts", "Test provider against contract", "Test consumer against contract", "Verify compatibility"];
        };
        readonly integrationTesting: {
            readonly description: "Test API integration";
            readonly patterns: readonly ["Test happy paths", "Test error scenarios", "Test edge cases", "Test authentication", "Test rate limiting"];
            readonly tools: readonly ["Supertest", "MSW", "Nock"];
            readonly bestPractices: readonly ["Use test database", "Clean up test data", "Mock external APIs", "Test with realistic data"];
        };
        readonly mockServices: {
            readonly description: "Mock API services for testing";
            readonly strategies: readonly ["MSW (Mock Service Worker)", "Nock for HTTP mocking", "API mocking services", "In-memory mocks"];
            readonly useCases: readonly ["Unit testing", "Development", "Offline development", "Testing error scenarios"];
        };
    };
};
/**
 * Get API pattern by style and name
 */
export declare function getAPIPattern(style: APIStyle, patternName: string): APIPattern | undefined;
/**
 * Validate REST resource name
 */
export declare function validateRESTResourceName(name: string): {
    valid: boolean;
    issues: string[];
};
/**
 * Type exports
 */
export type { APIPattern, APIStyle, HTTPMethod, ErrorResponseFormat };
//# sourceMappingURL=layer-27-api-design.d.ts.map