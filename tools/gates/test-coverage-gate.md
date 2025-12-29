# Quality Gate #10: Test Coverage

## Purpose
Ensures that all critical systems, especially generative and algorithmic components, have automated tests verifying their correctness and stability.

## Criteria
1. **Core Utilities**: All shared utilities (like `NoiseLibrary`) must have unit tests.
2. **Generators**: All procedural generators must have deterministic outputs (seeded) verified by tests.
3. **Execution**: `npm test` must pass without errors before any major merge.

## Validation Command
```bash
npm test
```

## Failure Protocol
1. If tests fail, identifying the regression is the top priority.
2. Do not bypass this gate for "quick fixes" in core engines.
