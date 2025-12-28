/**
 * LAYER 26 — ADVANCED ARCHITECTURE PATTERNS
 *
 * Advanced architectural patterns and design approaches
 *
 * This layer provides microservices patterns, domain-driven design, event-driven
 * architecture, hexagonal architecture, layered architecture, and component-based
 * architecture patterns for building scalable, maintainable systems.
 */
/**
 * Architecture pattern category
 */
export type ArchitectureCategory = "microservices" | "ddd" | "event-driven" | "hexagonal" | "layered" | "component-based" | "serverless";
/**
 * Architecture pattern definition
 */
export interface ArchitecturePattern {
    name: string;
    category: ArchitectureCategory;
    description: string;
    useCases: string[];
    benefits: string[];
    challenges: string[];
    implementation: string[];
}
/**
 * DDD concept definition
 */
export interface DDDConcept {
    name: string;
    description: string;
    characteristics: string[];
    examples: string[];
}
/**
 * Event pattern definition
 */
export interface EventPattern {
    name: string;
    description: string;
    useCases: string[];
    implementation: string[];
    benefits: string[];
}
/**
 * Main architecture patterns configuration
 */
export declare const ARCHITECTURE_PATTERNS: {
    /**
     * Microservices Patterns
     */
    readonly microservices: {
        readonly serviceDecomposition: {
            readonly name: "Service Decomposition";
            readonly category: ArchitectureCategory;
            readonly description: "Strategies for decomposing monolith into services";
            readonly useCases: readonly ["Large monolith", "Independent scaling needed", "Team autonomy"];
            readonly benefits: readonly ["Independent deployment", "Technology diversity", "Team autonomy", "Scalability"];
            readonly challenges: readonly ["Distributed system complexity", "Data consistency", "Network latency", "Service coordination"];
            readonly implementation: readonly ["Decompose by business capability", "Decompose by domain", "Database per service", "API Gateway for clients"];
        };
        readonly apiGateway: {
            readonly name: "API Gateway";
            readonly category: ArchitectureCategory;
            readonly description: "Single entry point for client requests";
            readonly useCases: readonly ["Multiple microservices", "Need unified API", "Cross-cutting concerns"];
            readonly benefits: readonly ["Single entry point", "Request routing", "Load balancing", "Authentication/authorization", "Rate limiting", "Response aggregation"];
            readonly challenges: readonly ["Single point of failure", "Potential bottleneck", "Additional network hop"];
            readonly implementation: readonly ["Route requests to appropriate service", "Handle authentication", "Aggregate responses", "Implement rate limiting", "Handle service discovery"];
        };
        readonly circuitBreaker: {
            readonly name: "Circuit Breaker";
            readonly category: ArchitectureCategory;
            readonly description: "Prevent cascade failures by stopping requests to failing service";
            readonly useCases: readonly ["Service calls", "External dependencies", "Unreliable services"];
            readonly benefits: readonly ["Prevents cascade failures", "Fails fast", "Allows service recovery", "Graceful degradation"];
            readonly challenges: readonly ["Configuration complexity", "Determining failure thresholds", "Fallback logic"];
            readonly implementation: readonly ["Monitor failure rate", "Open circuit on threshold", "Return cached/fallback response", "Attempt recovery periodically", "Close circuit when healthy"];
            readonly states: readonly ["Closed (normal)", "Open (failing)", "Half-open (testing recovery)"];
        };
        readonly saga: {
            readonly name: "Saga Pattern";
            readonly category: ArchitectureCategory;
            readonly description: "Manage distributed transactions across services";
            readonly useCases: readonly ["Multi-service transactions", "Long-running processes", "Eventual consistency"];
            readonly benefits: readonly ["No distributed locks", "Eventual consistency", "Works across services"];
            readonly challenges: readonly ["Complexity", "Compensating transactions", "Orchestration/Choreography"];
            readonly implementation: readonly ["Orchestration: Central coordinator", "Choreography: Services coordinate via events", "Compensating transactions for rollback", "Idempotent operations"];
        };
        readonly cqrs: {
            readonly name: "CQRS (Command Query Responsibility Segregation)";
            readonly category: ArchitectureCategory;
            readonly description: "Separate read and write models";
            readonly useCases: readonly ["Different read/write patterns", "High read/write ratio", "Complex queries"];
            readonly benefits: readonly ["Optimize reads and writes independently", "Scale independently", "Complex querying", "Event sourcing compatibility"];
            readonly challenges: readonly ["Complexity", "Eventual consistency", "Synchronization"];
            readonly implementation: readonly ["Separate command and query models", "Command side: Write operations", "Query side: Read operations", "Synchronize via events"];
        };
        readonly eventSourcing: {
            readonly name: "Event Sourcing";
            readonly category: ArchitectureCategory;
            readonly description: "Store events instead of current state";
            readonly useCases: readonly ["Audit requirements", "Temporal queries", "Complex domain logic"];
            readonly benefits: readonly ["Complete audit trail", "Time travel", "Replay events", "Eventual consistency"];
            readonly challenges: readonly ["Complexity", "Event versioning", "Snapshot management", "Query performance"];
            readonly implementation: readonly ["Store events as source of truth", "Replay events to rebuild state", "Use snapshots for performance", "Project events to read models"];
        };
    };
    /**
     * Domain-Driven Design (DDD)
     */
    readonly ddd: {
        readonly boundedContext: {
            readonly name: "Bounded Context";
            readonly description: "Explicit boundary where domain model applies";
            readonly characteristics: readonly ["Defines context for domain model", "Prevents model confusion", "Team ownership", "Clear boundaries"];
            readonly examples: readonly ["Order context vs Shipping context", "Customer context vs Billing context", "Product context vs Inventory context"];
        };
        readonly entities: {
            readonly name: "Entities";
            readonly description: "Objects with unique identity";
            readonly characteristics: readonly ["Have identity (ID)", "Mutable", "Equality by identity", "Lifecycle"];
            readonly examples: readonly ["User entity (identified by userId)", "Order entity (identified by orderId)", "Product entity (identified by productId)"];
        };
        readonly valueObjects: {
            readonly name: "Value Objects";
            readonly description: "Objects defined by attributes, not identity";
            readonly characteristics: readonly ["No identity", "Immutable", "Equality by value", "Replaceable"];
            readonly examples: readonly ["Money (amount + currency)", "Address", "Email", "Date range"];
        };
        readonly aggregates: {
            readonly name: "Aggregates";
            readonly description: "Cluster of entities and value objects with consistency boundary";
            readonly characteristics: readonly ["Consistency boundary", "Single aggregate root", "References by identity", "Transactional boundary"];
            readonly examples: readonly ["Order aggregate (Order root + OrderItems)", "Customer aggregate (Customer root + Addresses)", "Cart aggregate (Cart root + CartItems)"];
        };
        readonly domainEvents: {
            readonly name: "Domain Events";
            readonly description: "Events that occurred in the domain";
            readonly characteristics: readonly ["Represent past events", "Immutable", "Named in past tense", "Published by aggregate"];
            readonly examples: readonly ["OrderPlaced", "PaymentProcessed", "UserRegistered", "ProductShipped"];
        };
        readonly repository: {
            readonly name: "Repository Pattern";
            readonly description: "Abstraction for data access";
            readonly characteristics: readonly ["Collection-like interface", "Encapsulates data access", "Domain model focused", "Testable"];
            readonly examples: readonly ["OrderRepository.findByCustomerId()", "UserRepository.save(user)", "ProductRepository.findAll()"];
        };
        readonly domainServices: {
            readonly name: "Domain Services";
            readonly description: "Operations that don't belong to a single entity";
            readonly characteristics: readonly ["Stateless", "Domain logic", "Not entity or value object", "Operates on domain objects"];
            readonly examples: readonly ["TransferMoneyService (involves multiple accounts)", "PricingService (complex pricing logic)", "RecommendationService (complex recommendations)"];
        };
    };
    /**
     * Event-Driven Architecture
     */
    readonly eventDriven: {
        readonly pubSub: {
            readonly name: "Publish-Subscribe";
            readonly description: "Publishers emit events, subscribers consume events";
            readonly useCases: readonly ["Decoupled systems", "Multiple consumers", "Event broadcasting"];
            readonly implementation: readonly ["Event bus/message broker", "Publishers emit events", "Subscribers subscribe to event types", "Asynchronous processing"];
            readonly benefits: readonly ["Loose coupling", "Scalability", "Flexibility", "Multiple consumers"];
        };
        readonly eventStreaming: {
            readonly name: "Event Streaming";
            readonly description: "Continuous stream of events";
            readonly useCases: readonly ["Real-time processing", "Event log", "Event replay"];
            readonly implementation: readonly ["Event stream platform (Kafka, etc.)", "Producers write events", "Consumers read from stream", "Event retention", "Event replay capability"];
            readonly benefits: readonly ["Real-time processing", "Event history", "Multiple consumers", "Replay capability"];
        };
        readonly eventSourcingIntegration: {
            readonly name: "Event Sourcing Integration";
            readonly description: "Combine event sourcing with event-driven architecture";
            readonly useCases: readonly ["Audit requirements", "Complex domain", "Event replay"];
            readonly implementation: readonly ["Store events as source of truth", "Publish events to event bus", "Project events to read models", "Replay events for state reconstruction"];
            readonly benefits: readonly ["Complete event history", "Event-driven architecture benefits", "Temporal queries", "Audit trail"];
        };
        readonly cqrsIntegration: {
            readonly name: "CQRS with Events";
            readonly description: "Use events to synchronize CQRS read/write models";
            readonly useCases: readonly ["CQRS pattern", "Event synchronization", "Read model updates"];
            readonly implementation: readonly ["Commands update write model", "Events published from write model", "Event handlers update read models", "Eventual consistency"];
            readonly benefits: readonly ["CQRS benefits", "Loose coupling", "Scalability", "Event-driven benefits"];
        };
    };
    /**
     * Hexagonal Architecture
     */
    readonly hexagonal: {
        readonly portsAdapters: {
            readonly name: "Ports and Adapters";
            readonly category: ArchitectureCategory;
            readonly description: "Separate application core from external concerns";
            readonly useCases: readonly ["Testability", "Framework independence", "Multiple interfaces"];
            readonly benefits: readonly ["Testable (mock adapters)", "Framework independent", "Multiple interfaces", "Clear boundaries"];
            readonly challenges: readonly ["Additional abstraction", "Complexity", "Learning curve"];
            readonly implementation: readonly ["Core (business logic)", "Ports (interfaces)", "Adapters (implementations)", "Driving adapters (UI, API)", "Driven adapters (Database, External services)"];
        };
        readonly dependencyInversion: {
            readonly name: "Dependency Inversion";
            readonly description: "Depend on abstractions, not concretions";
            readonly useCases: readonly ["Testability", "Flexibility", "Loose coupling"];
            readonly benefits: readonly ["Testability", "Flexibility", "Loose coupling", "Inversion of control"];
            readonly implementation: readonly ["Define interfaces (ports)", "Implement interfaces (adapters)", "Inject dependencies", "Core depends on interfaces"];
        };
        readonly testingStrategies: {
            readonly name: "Testing in Hexagonal Architecture";
            readonly description: "Test core independently from adapters";
            readonly strategies: readonly ["Unit test core with mock adapters", "Integration test with test adapters", "Test adapters independently", "E2E test with real adapters"];
            readonly benefits: readonly ["Fast unit tests", "Isolated testing", "Easy mocking", "Clear test boundaries"];
        };
    };
    /**
     * Layered Architecture
     */
    readonly layered: {
        readonly presentation: {
            readonly name: "Presentation Layer";
            readonly description: "User interface and interaction";
            readonly responsibilities: readonly ["User interface", "Input validation", "Request/response handling", "View rendering"];
            readonly examples: readonly ["React components", "API controllers", "GraphQL resolvers"];
        };
        readonly application: {
            readonly name: "Application Layer";
            readonly description: "Application logic and orchestration";
            readonly responsibilities: readonly ["Use cases", "Orchestration", "Transaction management", "Application services"];
            readonly examples: readonly ["OrderService.placeOrder()", "UserService.registerUser()", "PaymentService.processPayment()"];
        };
        readonly domain: {
            readonly name: "Domain Layer";
            readonly description: "Business logic and domain model";
            readonly responsibilities: readonly ["Business rules", "Domain entities", "Domain services", "Domain events"];
            readonly examples: readonly ["Order entity", "Pricing rules", "Business validations", "Domain events"];
        };
        readonly infrastructure: {
            readonly name: "Infrastructure Layer";
            readonly description: "Technical concerns and external systems";
            readonly responsibilities: readonly ["Database access", "External APIs", "Message queues", "File system", "Caching"];
            readonly examples: readonly ["Database repositories", "HTTP clients", "Email services", "Cache implementations"];
        };
        readonly principles: readonly ["Dependencies point inward", "Domain layer is independent", "Infrastructure depends on domain", "Presentation depends on application"];
    };
    /**
     * Component-Based Architecture
     */
    readonly componentBased: {
        readonly componentComposition: {
            readonly name: "Component Composition";
            readonly category: ArchitectureCategory;
            readonly description: "Build systems from reusable components";
            readonly useCases: readonly ["UI components", "Shared libraries", "Design systems"];
            readonly benefits: readonly ["Reusability", "Consistency", "Maintainability", "Testability"];
            readonly challenges: readonly ["Component design", "Versioning", "Dependency management"];
            readonly implementation: readonly ["Design reusable components", "Component libraries", "Composition patterns", "Component versioning"];
        };
        readonly sharedLibraries: {
            readonly name: "Shared Component Libraries";
            readonly description: "Share components across projects";
            readonly strategies: readonly ["Monorepo for shared code", "Package libraries", "Component registry", "Version management"];
            readonly considerations: readonly ["Breaking changes", "Version compatibility", "Dependency management", "Testing strategy"];
        };
        readonly componentVersioning: {
            readonly name: "Component Versioning";
            readonly description: "Version components for compatibility";
            readonly strategies: readonly ["Semantic versioning", "Breaking change management", "Deprecation policies", "Migration guides"];
            readonly benefits: readonly ["Stable APIs", "Gradual adoption", "Backward compatibility"];
        };
    };
    /**
     * Serverless Patterns
     */
    readonly serverless: {
        readonly functionComposition: {
            readonly name: "Function Composition";
            readonly category: ArchitectureCategory;
            readonly description: "Compose serverless functions to build applications";
            readonly useCases: readonly ["Event processing", "API endpoints", "Background jobs"];
            readonly benefits: readonly ["Auto-scaling", "Pay per use", "No server management", "Event-driven"];
            readonly challenges: readonly ["Cold starts", "Statelessness", "Timeout limits", "Vendor lock-in"];
            readonly implementation: readonly ["Small, focused functions", "Event triggers", "Function orchestration", "State management"];
        };
        readonly eventDrivenFunctions: {
            readonly name: "Event-Driven Functions";
            readonly description: "Functions triggered by events";
            readonly triggers: readonly ["HTTP requests", "Database changes", "Message queue messages", "File uploads", "Scheduled events"];
            readonly patterns: readonly ["Event sourcing", "CQRS", "Pub/Sub", "Event streaming"];
        };
        readonly stateManagement: {
            readonly name: "State Management in Serverless";
            readonly description: "Manage state in stateless functions";
            readonly strategies: readonly ["External state stores (databases, cache)", "Stateless functions", "Session state in client", "State machines for workflows"];
            readonly considerations: readonly ["Stateless design", "External storage", "State synchronization", "Consistency"];
        };
    };
};
/**
 * Get architecture pattern by category and name
 */
export declare function getArchitecturePattern(category: ArchitectureCategory, patternName: string): ArchitecturePattern | undefined;
/**
 * Get DDD concept by name
 */
export declare function getDDDConcept(conceptName: string): DDDConcept | undefined;
/**
 * Type exports
 */
export type { ArchitecturePattern, ArchitectureCategory, DDDConcept, EventPattern };
//# sourceMappingURL=layer-26-architecture-patterns.d.ts.map