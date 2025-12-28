/**
 * LAYER 28 — DATABASE DESIGN & OPTIMIZATION
 *
 * Database design patterns and optimization strategies
 *
 * This layer provides schema design patterns, query optimization strategies,
 * transaction management, migration strategies, database patterns, and
 * performance patterns for efficient database design and operations.
 */
/**
 * Normalization level
 */
export type NormalizationLevel = "1NF" | "2NF" | "3NF" | "BCNF";
/**
 * Database pattern type
 */
export type DatabasePatternType = "repository" | "unitOfWork" | "activeRecord" | "dataMapper" | "queryBuilder";
/**
 * Query optimization strategy
 */
export interface QueryOptimizationStrategy {
    name: string;
    description: string;
    useCases: string[];
    implementation: string[];
    impact: "high" | "medium" | "low";
}
/**
 * Database pattern definition
 */
export interface DatabasePattern {
    name: string;
    type: DatabasePatternType;
    description: string;
    useCases: string[];
    benefits: string[];
    implementation: string[];
}
/**
 * Main database design configuration
 */
export declare const DATABASE_DESIGN: {
    /**
     * Schema Design
     */
    readonly schemaDesign: {
        readonly normalization: {
            readonly "1NF": {
                readonly level: NormalizationLevel;
                readonly description: "First Normal Form - Eliminate repeating groups";
                readonly rules: readonly ["Each column contains atomic values", "No repeating groups", "Each row is unique"];
                readonly example: "Split address into separate columns (street, city, state)";
            };
            readonly "2NF": {
                readonly level: NormalizationLevel;
                readonly description: "Second Normal Form - Eliminate partial dependencies";
                readonly rules: readonly ["Must be in 1NF", "All non-key attributes fully dependent on primary key"];
                readonly example: "Move customer name to customer table, reference by ID";
            };
            readonly "3NF": {
                readonly level: NormalizationLevel;
                readonly description: "Third Normal Form - Eliminate transitive dependencies";
                readonly rules: readonly ["Must be in 2NF", "No transitive dependencies (non-key depends on another non-key)"];
                readonly example: "Move category name to category table, reference by ID";
            };
            readonly BCNF: {
                readonly level: NormalizationLevel;
                readonly description: "Boyce-Codd Normal Form - Every determinant is a candidate key";
                readonly rules: readonly ["Must be in 3NF", "Every determinant is a candidate key"];
                readonly example: "Further normalization for complex dependencies";
            };
            readonly whenToDenormalize: readonly ["Performance critical queries", "Read-heavy workloads", "Complex joins expensive", "Acceptable data redundancy", "Frequent read, rare updates"];
        };
        readonly denormalization: {
            readonly description: "Intentionally introduce redundancy for performance";
            readonly strategies: readonly ["Duplicate frequently accessed data", "Pre-compute aggregations", "Store calculated values", "Flatten hierarchical data"];
            readonly tradeoffs: readonly ["Faster reads vs slower writes", "More storage vs better performance", "Data consistency challenges", "Maintenance complexity"];
            readonly whenToUse: readonly ["Read performance critical", "Writes are infrequent", "Acceptable consistency tradeoffs"];
        };
        readonly indexDesign: {
            readonly description: "Design indexes for optimal query performance";
            readonly types: readonly ["Primary key index (automatic)", "Unique index", "Composite index", "Partial index", "Covering index"];
            readonly strategies: readonly ["Index frequently queried columns", "Index foreign keys", "Composite indexes for multi-column queries", "Covering indexes for read-heavy queries", "Partial indexes for filtered queries"];
            readonly considerations: readonly ["Index overhead on writes", "Index size", "Query patterns", "Update frequency"];
            readonly bestPractices: readonly ["Don't over-index", "Monitor index usage", "Drop unused indexes", "Analyze query plans"];
        };
        readonly relationships: {
            readonly oneToOne: {
                readonly description: "One-to-one relationship";
                readonly useCases: readonly ["Optional attributes", "Separate concerns", "Performance optimization"];
                readonly implementation: readonly ["Foreign key in one table", "Unique constraint on foreign key", "Or merge into single table"];
            };
            readonly oneToMany: {
                readonly description: "One-to-many relationship";
                readonly useCases: readonly ["Parent-child relationships", "Master-detail relationships"];
                readonly implementation: readonly ["Foreign key in 'many' table", "Reference to 'one' table", "Index on foreign key"];
                readonly example: "User has many Orders, Order belongs to User";
            };
            readonly manyToMany: {
                readonly description: "Many-to-many relationship";
                readonly useCases: readonly ["Multiple associations", "Bidirectional relationships"];
                readonly implementation: readonly ["Join table (junction table)", "Foreign keys to both tables", "Composite primary key or separate ID"];
                readonly example: "Users and Roles - UserRole join table";
            };
        };
    };
    /**
     * Query Optimization
     */
    readonly queryOptimization: {
        readonly performanceAnalysis: {
            readonly description: "Analyze query performance";
            readonly tools: readonly ["EXPLAIN / EXPLAIN ANALYZE", "Query profiler", "Slow query log", "Database monitoring"];
            readonly metrics: readonly ["Execution time", "Rows examined vs returned", "Index usage", "Join performance", "Sort operations"];
        };
        readonly indexUsage: {
            readonly description: "Optimize index usage";
            readonly strategies: readonly ["Ensure indexes are used", "Create appropriate indexes", "Avoid index scans when possible", "Use covering indexes", "Monitor index usage"];
            readonly commonIssues: readonly ["Functions on indexed columns", "Type mismatches", "Leading wildcards in LIKE", "OR conditions preventing index use"];
        };
        readonly joinOptimization: {
            readonly description: "Optimize joins";
            readonly strategies: readonly ["Use appropriate join types", "Join on indexed columns", "Filter before joining", "Limit result set before joining", "Use EXISTS instead of JOIN when checking existence"];
            readonly joinTypes: readonly ["INNER JOIN - Matching rows only", "LEFT JOIN - All left rows, matching right", "RIGHT JOIN - All right rows, matching left", "FULL OUTER JOIN - All rows from both"];
        };
        readonly subqueryOptimization: {
            readonly description: "Optimize subqueries";
            readonly strategies: readonly ["Convert correlated subqueries to joins when possible", "Use EXISTS instead of IN for existence checks", "Use CTEs for complex subqueries", "Materialize subqueries if used multiple times"];
            readonly whenToUse: readonly ["Correlated subqueries: EXISTS for existence, JOIN for data", "Uncorrelated subqueries: IN for small sets, JOIN for large sets"];
        };
        readonly n1Problem: {
            readonly description: "N+1 query problem and solutions";
            readonly problem: "N+1 queries: 1 query for list + N queries for each item";
            readonly solutions: readonly ["Eager loading (JOIN or separate query)", "Batch loading", "DataLoader pattern (GraphQL)", "Denormalization", "Caching"];
            readonly implementation: readonly ["Load related data in single query", "Batch related queries", "Use application-level batching", "Cache frequently accessed data"];
        };
    };
    /**
     * Transaction Management
     */
    readonly transactions: {
        readonly acid: {
            readonly description: "ACID properties of transactions";
            readonly atomicity: "All or nothing - transaction completes fully or not at all";
            readonly consistency: "Database remains in valid state";
            readonly isolation: "Transactions don't interfere with each other";
            readonly durability: "Committed changes persist";
        };
        readonly isolationLevels: {
            readonly readUncommitted: {
                readonly level: "READ UNCOMMITTED";
                readonly description: "Lowest isolation, can read uncommitted data";
                readonly issues: readonly ["Dirty reads", "Non-repeatable reads", "Phantom reads"];
            };
            readonly readCommitted: {
                readonly level: "READ COMMITTED";
                readonly description: "Can only read committed data";
                readonly issues: readonly ["Non-repeatable reads", "Phantom reads"];
            };
            readonly repeatableRead: {
                readonly level: "REPEATABLE READ";
                readonly description: "Same reads return same results";
                readonly issues: readonly ["Phantom reads"];
            };
            readonly serializable: {
                readonly level: "SERIALIZABLE";
                readonly description: "Highest isolation, transactions appear serial";
                readonly issues: readonly ["None, but performance impact"];
            };
        };
        readonly transactionPatterns: {
            readonly description: "Transaction management patterns";
            readonly patterns: readonly ["Keep transactions short", "Avoid long-running transactions", "Use appropriate isolation level", "Handle deadlocks", "Use savepoints for nested transactions"];
            readonly bestPractices: readonly ["Begin transaction", "Perform operations", "Commit or rollback", "Handle errors and rollback", "Close connections properly"];
        };
        readonly deadlockPrevention: {
            readonly description: "Prevent and handle deadlocks";
            readonly prevention: readonly ["Access resources in consistent order", "Keep transactions short", "Use appropriate isolation level", "Index frequently accessed columns", "Avoid unnecessary locking"];
            readonly handling: readonly ["Detect deadlocks", "Retry transaction", "Log deadlock information", "Use deadlock timeout"];
        };
    };
    /**
     * Migration Strategies
     */
    readonly migrations: {
        readonly schemaMigration: {
            readonly description: "Schema migration patterns";
            readonly strategies: readonly ["Version-controlled migrations", "Forward and backward migrations", "Migration scripts", "Migration rollback"];
            readonly bestPractices: readonly ["Make migrations reversible", "Test migrations", "Backup before migrations", "Run migrations in transactions when possible", "Version control migrations"];
        };
        readonly dataMigration: {
            readonly description: "Data migration patterns";
            readonly strategies: readonly ["Batch processing", "Incremental migration", "Dual-write pattern", "Data validation"];
            readonly bestPractices: readonly ["Validate data before migration", "Migrate in batches", "Monitor migration progress", "Test data migration", "Have rollback plan"];
        };
        readonly rollback: {
            readonly description: "Migration rollback strategies";
            readonly strategies: readonly ["Reversible migrations", "Backup and restore", "Forward-only migrations with data fix", "Feature flags for gradual rollout"];
            readonly considerations: readonly ["Data loss prevention", "Downtime minimization", "Rollback complexity", "Testing rollback"];
        };
        readonly zeroDowntime: {
            readonly description: "Zero-downtime migration strategies";
            readonly strategies: readonly ["Blue-green deployment", "Feature flags", "Dual-write pattern", "Gradual migration", "Backward-compatible changes"];
            readonly patterns: readonly ["Add new column (nullable first)", "Migrate data gradually", "Update application code", "Remove old column"];
        };
    };
    /**
     * Database Patterns
     */
    readonly patterns: {
        readonly repository: {
            readonly name: "Repository Pattern";
            readonly type: DatabasePatternType;
            readonly description: "Abstraction layer for data access";
            readonly useCases: readonly ["Decouple business logic from data access", "Testability", "Multiple data sources"];
            readonly benefits: readonly ["Testability (mock repositories)", "Flexibility", "Single Responsibility", "Easier to change data source"];
            readonly implementation: readonly ["Define repository interface", "Implement repository for data source", "Inject repository into business logic", "Use dependency injection"];
        };
        readonly unitOfWork: {
            readonly name: "Unit of Work Pattern";
            readonly type: DatabasePatternType;
            readonly description: "Track changes and coordinate writes";
            readonly useCases: readonly ["Multiple object updates in transaction", "Complex operations", "Transactional integrity"];
            readonly benefits: readonly ["Transaction management", "Change tracking", "Batch operations", "Consistency"];
            readonly implementation: readonly ["Track changes to objects", "Coordinate writes", "Handle transactions", "Commit or rollback together"];
        };
        readonly activeRecord: {
            readonly name: "Active Record Pattern";
            readonly type: DatabasePatternType;
            readonly description: "Object that wraps database row";
            readonly useCases: readonly ["Simple CRUD operations", "Rapid development", "Direct object-database mapping"];
            readonly benefits: readonly ["Simple", "Direct mapping", "Quick development"];
            readonly implementation: readonly ["Object represents database row", "Object contains data access methods", "Object knows how to save/load itself"];
        };
        readonly dataMapper: {
            readonly name: "Data Mapper Pattern";
            readonly type: DatabasePatternType;
            readonly description: "Separate objects from database mapping";
            readonly useCases: readonly ["Complex domain models", "Separation of concerns", "Testability"];
            readonly benefits: readonly ["Separation of concerns", "Testability", "Flexibility", "Complex mappings"];
            readonly implementation: readonly ["Domain objects are pure", "Separate mapper handles persistence", "Mapper knows how to map objects to database"];
        };
        readonly queryBuilder: {
            readonly name: "Query Builder Pattern";
            readonly type: DatabasePatternType;
            readonly description: "Build queries programmatically";
            readonly useCases: readonly ["Dynamic queries", "Complex query construction", "Query abstraction"];
            readonly benefits: readonly ["Type safety", "Query composition", "SQL abstraction", "Reusability"];
            readonly implementation: readonly ["Fluent interface for query building", "Method chaining", "Build query programmatically", "Execute when needed"];
        };
    };
    /**
     * Performance Patterns
     */
    readonly performance: {
        readonly connectionPooling: {
            readonly description: "Manage database connections efficiently";
            readonly benefits: readonly ["Reuse connections", "Reduce connection overhead", "Control connection count", "Better resource management"];
            readonly implementation: readonly ["Configure connection pool", "Set pool size", "Handle connection errors", "Monitor pool usage"];
            readonly considerations: readonly ["Pool size (too small = waiting, too large = resource waste)", "Connection timeout", "Idle connection handling"];
        };
        readonly readReplicas: {
            readonly description: "Use read replicas for read scaling";
            readonly useCases: readonly ["Read-heavy workloads", "Geographic distribution", "Reducing load on primary"];
            readonly implementation: readonly ["Replicate data to replicas", "Route reads to replicas", "Route writes to primary", "Handle replication lag"];
            readonly considerations: readonly ["Replication lag", "Read-after-write consistency", "Failover strategy"];
        };
        readonly caching: {
            readonly description: "Cache database queries";
            readonly strategies: readonly ["Application-level caching", "Query result caching", "Object caching", "CDN caching for static data"];
            readonly implementation: readonly ["Cache frequently accessed data", "Set appropriate TTL", "Invalidate cache on updates", "Use cache keys effectively"];
            readonly considerations: readonly ["Cache invalidation", "Cache consistency", "Memory usage", "Cache hit ratio"];
        };
        readonly partitioning: {
            readonly description: "Partition tables for performance";
            readonly strategies: readonly ["Range partitioning", "Hash partitioning", "List partitioning"];
            readonly useCases: readonly ["Large tables", "Query performance", "Data management", "Archival"];
            readonly considerations: readonly ["Partition key selection", "Query patterns", "Maintenance", "Partition pruning"];
        };
    };
    /**
     * NoSQL Patterns (if applicable)
     */
    readonly nosql: {
        readonly documentStore: {
            readonly description: "Document store patterns";
            readonly useCases: readonly ["Flexible schemas", "Document-oriented data", "Rapid iteration"];
            readonly patterns: readonly ["Embed vs reference", "Denormalization", "Document design", "Query patterns"];
        };
        readonly keyValue: {
            readonly description: "Key-value store patterns";
            readonly useCases: readonly ["Simple lookups", "Caching", "Session storage"];
            readonly patterns: readonly ["Key design", "Value serialization", "TTL management", "Key patterns"];
        };
        readonly whenToUse: {
            readonly sql: readonly ["Structured data", "Complex queries", "Transactions", "Relationships"];
            readonly nosql: readonly ["Flexible schema", "Horizontal scaling", "Simple queries", "High write throughput"];
        };
    };
};
/**
 * Get database pattern by type and name
 */
export declare function getDatabasePattern(type: DatabasePatternType, patternName: string): DatabasePattern | undefined;
/**
 * Check if normalization level is met
 */
export declare function checkNormalization(level: NormalizationLevel, schema: unknown): {
    meets: boolean;
    violations: string[];
};
/**
 * Type exports
 */
export type { DatabasePattern, DatabasePatternType, NormalizationLevel, QueryOptimizationStrategy };
//# sourceMappingURL=layer-28-database-design.d.ts.map