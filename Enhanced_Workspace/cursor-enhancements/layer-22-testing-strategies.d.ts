/**
 * LAYER 22 — TESTING STRATEGIES & QUALITY ASSURANCE
 *
 * Comprehensive testing strategies and quality assurance protocols
 *
 * This layer provides testing pyramid strategy, unit testing patterns,
 * integration testing, E2E testing, TDD/BDD methodologies, and quality
 * gates to ensure comprehensive test coverage and quality assurance.
 */
/**
 * Test level
 */
export type TestLevel = "unit" | "integration" | "e2e" | "contract";
/**
 * Test type
 */
export type TestType = "functional" | "performance" | "security" | "accessibility" | "visual";
/**
 * Test structure pattern
 */
export interface TestStructure {
    arrange: string;
    act: string;
    assert: string;
    description: string;
}
/**
 * Test pattern definition
 */
export interface TestPattern {
    name: string;
    description: string;
    structure: TestStructure;
    useCases: string[];
    bestPractices: string[];
    codeExample?: string;
}
/**
 * Testing methodology
 */
export interface TestingMethodology {
    name: string;
    description: string;
    workflow: string[];
    benefits: string[];
    whenToUse: string[];
}
/**
 * Quality gate definition
 */
export interface QualityGate {
    metric: string;
    threshold: number;
    level: TestLevel;
    description: string;
}
/**
 * Main testing strategies configuration
 */
export declare const TESTING_STRATEGIES: {
    /**
     * Testing Pyramid
     */
    readonly testingPyramid: {
        readonly unit: {
            readonly proportion: "70%";
            readonly description: "Fast, isolated tests of individual units";
            readonly characteristics: readonly ["Fast execution", "Isolated", "Many tests", "Test individual functions/components"];
            readonly tools: readonly ["Jest", "Vitest", "Mocha"];
        };
        readonly integration: {
            readonly proportion: "20%";
            readonly description: "Test interactions between units";
            readonly characteristics: readonly ["Moderate speed", "Test integrations", "Fewer tests", "Test component interactions"];
            readonly tools: readonly ["Jest", "React Testing Library", "Supertest"];
        };
        readonly e2e: {
            readonly proportion: "10%";
            readonly description: "Test complete user workflows";
            readonly characteristics: readonly ["Slow execution", "Full stack", "Few tests", "Test user journeys"];
            readonly tools: readonly ["Playwright", "Cypress", "Puppeteer"];
        };
        readonly strategy: "More unit tests (fast, cheap), fewer integration tests (moderate), even fewer E2E tests (slow, expensive)";
    };
    /**
     * Unit Testing Patterns
     */
    readonly unitTesting: {
        readonly structure: {
            readonly aaa: {
                readonly name: "AAA Pattern";
                readonly description: "Arrange, Act, Assert structure";
                readonly structure: {
                    readonly arrange: "Set up test data and dependencies";
                    readonly act: "Execute the code under test";
                    readonly assert: "Verify the expected outcome";
                    readonly description: "Clear structure for all unit tests";
                };
                readonly useCases: readonly ["All unit tests"];
                readonly bestPractices: readonly ["One assertion per test (when possible)", "Clear test names (describe what is being tested)", "Arrange section sets up all necessary data", "Act section performs single operation", "Assert section verifies outcome"];
                readonly codeExample: "\ndescribe('calculateTotal', () => {\n  it('should return sum of array elements', () => {\n    // Arrange\n    const numbers = [1, 2, 3, 4, 5];\n    const expected = 15;\n    \n    // Act\n    const result = calculateTotal(numbers);\n    \n    // Assert\n    expect(result).toBe(expected);\n  });\n});";
            };
        };
        readonly mocking: {
            readonly description: "Mock dependencies in unit tests";
            readonly strategies: readonly ["Mock external dependencies (APIs, databases)", "Mock functions that have side effects", "Mock time-dependent functions", "Use Jest mocks or manual mocks", "Mock only what's necessary"];
            readonly patterns: {
                readonly jestMock: "jest.mock() or jest.fn()";
                readonly manualMock: "Create __mocks__ directory";
                readonly spy: "jest.spyOn() to spy on methods";
                readonly mockImplementation: "Provide mock implementation";
            };
            readonly bestPractices: readonly ["Mock external dependencies only", "Don't mock code under test", "Use real implementations when possible", "Verify mock calls when important", "Reset mocks between tests"];
        };
        readonly testIsolation: {
            readonly description: "Tests should be independent";
            readonly principles: readonly ["Each test should run independently", "No shared state between tests", "Tests can run in any order", "Clean up after each test", "Use beforeEach/afterEach for setup/teardown"];
            readonly patterns: readonly ["Use beforeEach to set up test data", "Use afterEach to clean up", "Avoid global state", "Reset mocks between tests", "Use factories for test data"];
        };
        readonly coverageTargets: {
            readonly unit: {
                readonly minimum: 80;
                readonly target: 90;
                readonly description: "Unit test coverage should be high";
                readonly critical: readonly ["Business logic", "Utility functions", "Core algorithms"];
                readonly optional: readonly ["Simple getters/setters", "Trivial functions"];
            };
            readonly integration: {
                readonly minimum: 60;
                readonly target: 75;
                readonly description: "Integration test coverage for critical paths";
                readonly critical: readonly ["API endpoints", "Component interactions", "Data flow"];
                readonly optional: readonly ["Edge cases", "Error scenarios"];
            };
        };
    };
    /**
     * Integration Testing
     */
    readonly integrationTesting: {
        readonly api: {
            readonly description: "Test API integrations";
            readonly patterns: readonly ["Test API endpoints with real requests", "Use test database", "Test request/response formats", "Test error handling", "Test authentication/authorization"];
            readonly tools: readonly ["Supertest", "MSW (Mock Service Worker)", "Nock"];
            readonly bestPractices: readonly ["Use test database (not production)", "Clean up test data", "Test happy paths and error cases", "Test with realistic data", "Mock external APIs"];
        };
        readonly component: {
            readonly description: "Test component integrations";
            readonly patterns: readonly ["Test component interactions", "Test data flow between components", "Test context providers", "Test component composition", "Test event handling"];
            readonly tools: readonly ["React Testing Library", "Enzyme"];
            readonly bestPractices: readonly ["Test user interactions, not implementation", "Use queries that users would use", "Test accessibility", "Test error states", "Test loading states"];
        };
        readonly database: {
            readonly description: "Test database integrations";
            readonly patterns: readonly ["Test database queries", "Test transactions", "Test data migrations", "Test data integrity", "Use test database"];
            readonly tools: readonly ["Database test utilities", "Migration test tools"];
            readonly bestPractices: readonly ["Use separate test database", "Use transactions for isolation", "Seed test data", "Clean up after tests", "Test with realistic data volumes"];
        };
    };
    /**
     * E2E Testing Strategies
     */
    readonly e2eTesting: {
        readonly playwright: {
            readonly description: "Playwright for E2E testing";
            readonly features: readonly ["Cross-browser testing", "Auto-waiting", "Network interception", "Screenshot/video recording", "Mobile device emulation"];
            readonly patterns: readonly ["Test critical user journeys", "Test across browsers", "Use page object model", "Test on multiple devices", "Test authentication flows"];
        };
        readonly cypress: {
            readonly description: "Cypress for E2E testing";
            readonly features: readonly ["Time travel debugging", "Real browser testing", "Network stubbing", "Automatic screenshots", "Test runner UI"];
            readonly patterns: readonly ["Test user workflows", "Test critical paths", "Use custom commands", "Test error scenarios", "Test responsive design"];
        };
        readonly userJourneys: {
            readonly description: "Test complete user journeys";
            readonly examples: readonly ["User registration → Login → Profile update", "Product search → Add to cart → Checkout", "Content creation → Publishing → Viewing"];
            readonly bestPractices: readonly ["Test happy paths", "Test error scenarios", "Test edge cases", "Keep tests focused", "Use realistic data"];
        };
        readonly criticalPaths: {
            readonly description: "Focus E2E tests on critical paths";
            readonly examples: readonly ["User authentication", "Payment processing", "Data submission", "Critical workflows"];
            readonly rationale: "E2E tests are slow - focus on what matters most";
        };
    };
    /**
     * Testing Methodologies
     */
    readonly methodologies: {
        readonly tdd: {
            readonly name: "Test-Driven Development (TDD)";
            readonly description: "Write tests before implementation";
            readonly workflow: readonly ["1. Write failing test (Red)", "2. Write minimal code to pass (Green)", "3. Refactor code (Refactor)", "4. Repeat"];
            readonly benefits: readonly ["Better design (tests drive design)", "Higher test coverage", "Faster feedback", "Documentation through tests", "Confidence to refactor"];
            readonly whenToUse: readonly ["New feature development", "Bug fixes", "Refactoring", "Complex logic"];
        };
        readonly bdd: {
            readonly name: "Behavior-Driven Development (BDD)";
            readonly description: "Tests describe behavior in natural language";
            readonly workflow: readonly ["1. Write feature in Gherkin syntax", "2. Write step definitions", "3. Implement feature", "4. Run tests"];
            readonly benefits: readonly ["Shared understanding", "Living documentation", "Non-technical stakeholders can read tests", "Focus on behavior, not implementation"];
            readonly whenToUse: readonly ["Business-critical features", "Complex workflows", "Cross-team collaboration", "Requirement validation"];
            readonly gherkinExample: "\nFeature: User login\n  Scenario: Successful login\n    Given a user exists with email \"user@example.com\"\n    When the user logs in with email \"user@example.com\" and password \"password\"\n    Then the user should be redirected to the dashboard";
        };
        readonly propertyBased: {
            readonly name: "Property-Based Testing";
            readonly description: "Test properties that should hold for all inputs";
            readonly workflow: readonly ["1. Define property that should always hold", "2. Generate random inputs", "3. Verify property holds for all inputs", "4. Shrink failing cases"];
            readonly benefits: readonly ["Find edge cases automatically", "Test with many inputs", "Discover unexpected bugs", "Better coverage"];
            readonly whenToUse: readonly ["Mathematical functions", "Data transformations", "Algorithms", "Complex logic"];
            readonly tools: readonly ["fast-check", "jsverify"];
        };
        readonly mutation: {
            readonly name: "Mutation Testing";
            readonly description: "Test quality by introducing bugs";
            readonly workflow: readonly ["1. Run test suite", "2. Introduce mutations (bugs)", "3. Run tests again", "4. Measure mutation score"];
            readonly benefits: readonly ["Measure test quality", "Find weak tests", "Improve test suite", "Ensure tests actually test code"];
            readonly whenToUse: readonly ["Critical code", "Improving test quality", "Test suite evaluation"];
            readonly tools: readonly ["Stryker"];
        };
    };
    /**
     * Testing Best Practices
     */
    readonly bestPractices: {
        readonly naming: {
            readonly description: "Test naming conventions";
            readonly patterns: readonly ["describe('Component/Function name')", "it('should do something when condition')", "Use descriptive test names", "Test names should read like specifications"];
            readonly examples: readonly ["describe('calculateTotal', () => {", "it('should return 0 for empty array', () => {", "it('should throw error for negative numbers', () => {"];
        };
        readonly organization: {
            readonly description: "Test organization and structure";
            readonly patterns: readonly ["Group related tests with describe blocks", "Use nested describe for sub-groups", "Keep test files close to source files", "Use test utilities and helpers", "Share setup code in beforeEach"];
            readonly structure: readonly ["src/", "  component/", "    Component.tsx", "    Component.test.tsx", "    Component.test-utils.ts"];
        };
        readonly fixtures: {
            readonly description: "Test data fixtures";
            readonly patterns: readonly ["Create factories for test data", "Use builders for complex objects", "Share fixtures across tests", "Make fixtures realistic", "Use faker libraries for random data"];
            readonly tools: readonly ["@faker-js/faker", "factory-bot"];
            readonly example: "const user = createUser({ email: 'test@example.com' });";
        };
        readonly asyncTesting: {
            readonly description: "Testing async operations";
            readonly patterns: readonly ["Use async/await in tests", "Wait for async operations", "Use waitFor for React Testing Library", "Mock async functions", "Test promise rejections"];
            readonly example: "\nit('should load user data', async () => {\n  const { getByText } = render(<UserProfile userId=\"123\" />);\n  await waitFor(() => {\n    expect(getByText('John Doe')).toBeInTheDocument();\n  });\n});";
        };
        readonly errorScenarios: {
            readonly description: "Testing error scenarios";
            readonly patterns: readonly ["Test error handling", "Test error messages", "Test error states", "Test error recovery", "Test error logging"];
            readonly examples: readonly ["Test API error responses", "Test validation errors", "Test network failures", "Test permission errors"];
        };
    };
    /**
     * Quality Gates
     */
    readonly qualityGates: {
        readonly coverage: {
            readonly unit: {
                readonly metric: "Unit test coverage";
                readonly threshold: 80;
                readonly level: TestLevel;
                readonly description: "Minimum 80% unit test coverage";
            };
            readonly integration: {
                readonly metric: "Integration test coverage";
                readonly threshold: 60;
                readonly level: TestLevel;
                readonly description: "Minimum 60% integration test coverage";
            };
        };
        readonly testQuality: {
            readonly allTestsPass: {
                readonly metric: "All tests pass";
                readonly threshold: 100;
                readonly level: TestLevel;
                readonly description: "100% of tests must pass";
            };
            readonly noSkippedTests: {
                readonly metric: "No skipped tests";
                readonly threshold: 0;
                readonly level: TestLevel;
                readonly description: "No tests should be skipped (unless temporary)";
            };
        };
        readonly performance: {
            readonly testExecutionTime: {
                readonly metric: "Test execution time";
                readonly threshold: 60;
                readonly level: TestLevel;
                readonly description: "Unit tests should complete in under 60 seconds";
            };
        };
    };
};
/**
 * Get test pattern by name
 */
export declare function getTestPattern(patternName: string): TestPattern | undefined;
/**
 * Check if quality gates are met
 */
export declare function checkQualityGates(coverage: {
    unit: number;
    integration: number;
}, allTestsPass: boolean): {
    passed: boolean;
    failures: string[];
};
/**
 * Type exports
 */
export type { TestPattern, TestLevel, TestType, TestStructure, TestingMethodology, QualityGate };
//# sourceMappingURL=layer-22-testing-strategies.d.ts.map