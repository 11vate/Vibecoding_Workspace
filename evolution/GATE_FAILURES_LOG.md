# Gate Failures Log

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Log all gate failures for pattern analysis and improvement

---

## Purpose

**Philosophy**: Failures reveal weak points. Logs reveal patterns. Patterns drive improvement.

**Rule**: ALL gate failures logged automatically with full context.

---

## What Gets Logged

### Gate Failure Events

Every time a gate fails, log:
- Which gate failed
- What was being validated
- Which checks failed
- Why they failed
- How it was fixed (or if waived)
- Time to fix

**Automatic Logging**: Tools log failures when gates run.

---

## Log Format

```markdown
## Failure: [ID] - [Gate Name]

**Date**: [ISO timestamp]
**Gate**: [Gate name]
**Entity**: [What was validated - file/asset/code]
**Severity**: [Low | Medium | High | Critical]
**Status**: [Fixed | Waived | Pending]

### Violations
[List of specific checks that failed]

1. **Check**: [Name of check]
   - **Expected**: [What should be]
   - **Actual**: [What was found]
   - **Severity**: [Error | Warning]

2. **Check**: [Name of check]
   ...

### Context
**Task**: [What was being done]
**File(s)**: [Affected files]
**User**: [Human | AI]

### Root Cause
[Why did this fail?]

### Resolution
**Action Taken**: [How fixed]
**Time to Fix**: [Duration]
**Fixed By**: [Human | AI | Auto-fix]
**Waived**: [Yes/No, if yes explain]

### Prevention
**Could This Be Prevented**: [Yes/No]
**How**: [Prevention strategy]
**Heuristic Added**: [Yes/No]
```

---

## Example Failures

### Example 1: Asset Gate Failure

```markdown
## Failure: GATE-FAIL-2025-001 - Asset Gate

**Date**: 2025-12-24T14:32:15Z
**Gate**: Asset Gate
**Entity**: src/assets/sprites/new-button.png
**Severity**: High
**Status**: Fixed

### Violations

1. **Check**: Registry Search Performed
   - **Expected**: MUST search registry before creating
   - **Actual**: No search log found
   - **Severity**: Error

2. **Check**: Asset Optimization
   - **Expected**: Optimization applied (level: high)
   - **Actual**: optimization_level: none
   - **Severity**: Error

3. **Check**: Descriptive Naming
   - **Expected**: Descriptive filename (≥ 3 chars, kebab-case)
   - **Actual**: "new-button.png" (not descriptive of purpose)
   - **Severity**: Warning

### Context
**Task**: Adding button sprite for fusion UI
**File(s)**: src/assets/sprites/new-button.png (not in registry)
**User**: AI

### Root Cause
AI created asset directly without following ingestion protocol.
Skipped registry search (violated Reuse Gate).
Did not run optimization.
Used generic filename.

### Resolution
**Action Taken**:
1. Searched registry - found ASSET-2025-001 (button-primary.png) 95% match
2. Reused existing asset instead of new one
3. Deleted new-button.png (duplicate)
4. Updated references to use ASSET-2025-001

**Time to Fix**: 15 minutes
**Fixed By**: AI (after gate rejection)
**Waived**: No

### Prevention
**Could This Be Prevented**: Yes
**How**: Enforce asset ingestion protocol in AI prompts.
Add pre-flight check before asset creation.
**Heuristic Added**: Yes -"Always search registry before creating assets, even if 'quick' creation"
```

---

### Example 2: Complexity Gate Failure

```markdown
## Failure: GATE-FAIL-2025-002 - Complexity Gate

**Date**: 2025-12-24T16:45:22Z
**Gate**: Complexity Gate
**Entity**: src/systems/FusionSystem.ts
**Severity**: Medium
**Status**: Fixed

### Violations

1. **Check**: Cyclomatic Complexity
   - **Expected**: ≤ 10
   - **Actual**: fusePets() = 15
   - **Severity**: Error

2. **Check**: Function Length
   - **Expected**: ≤ 50 lines
   - **Actual**: fusePets() = 78 lines
   - **Severity**: Error

3. **Check**: Nesting Depth
   - **Expected**: ≤ 3 levels
   - **Actual**: 5 levels (nested if statements)
   - **Severity**: Error

### Context
**Task**: Implementing fusion mechanic
**File(s)**: src/systems/FusionSystem.ts
**User**: AI

### Root Cause
All logic implemented in single function.
No decomposition into smaller functions.
Deep nesting from multiple conditionals.

### Resolution
**Action Taken**:
1. Extracted logic into helper functions:
   - `determineBaseRarity()` (complexity: 3)
   - `calculateElementBonus()` (complexity: 4)
   - `applyOptionModifiers()` (complexity: 2)
   - `combineResults()` (complexity: 2)

2. Main function now orchestrates (complexity: 3)

3. Used guard clauses to reduce nesting (depth: 1)

**Time to Fix**: 30 minutes
**Fixed By**: AI (refactored after gate rejection)
**Waived**: No

### Prevention
**Could This Be Prevented**: Yes
**How**: Design functions with single responsibility from start.
Use guard clauses over nested ifs.
Check complexity during implementation, not just at end.
**Heuristic Added**: Yes - "Complexity > 5? Extract functions immediately, don't wait for gate"
```

---

### Example 3: Blueprint Gate Failure

```markdown
## Failure: GATE-FAIL-2025-003 - Blueprint Gate

**Date**: 2025-12-24T18:12:09Z
**Gate**: Blueprint Gate
**Entity**: docs/blueprints/mechanic-daily-quests.md
**Severity**: High
**Status**: Fixed

### Violations

1. **Check**: DIS Layers Consulted
   - **Expected**: Layers 1-3 mandatory
   - **Actual**: Only Layer 3 documented
   - **Severity**: Error

2. **Check**: Edge Cases Documented
   - **Expected**: Edge cases section with handling strategies
   - **Actual**: Section missing
   - **Severity**: Error

3. **Check**: Data Structures Defined
   - **Expected**: TypeScript interfaces for all data
   - **Actual**: Data structures section incomplete
   - **Severity**: Error

### Context
**Task**: Creating blueprint for daily quests feature
**File(s)**: docs/blueprints/mechanic-daily-quests.md
**User**: AI

### Root Cause
Blueprint created without consulting full DIS stack.
Rushed to implementation without complete design.
Template sections skipped.

### Resolution
**Action Taken**:
1. Consulted Layers 1 & 2, documented in blueprint
2. Added Edge Cases section with 5 cases:
   - Quest completion during offline
   - Daily reset timing edge cases
   - Quest abandonment
   - Multiple quest completion
   - Quest reward claiming

3. Completed Data Structures section:
   - `interface Quest { ... }`
   - `interface QuestState { ... }`
   - `interface QuestReward { ... }`

**Time to Fix**: 45 minutes
**Fixed By**: Human (required design thinking)
**Waived**: No

### Prevention
**Could This Be Prevented**: Yes
**How**: Use blueprint template strictly.
Checklist for all required sections before submitting.
AI should consult DIS layers before writing blueprint, not after.
**Heuristic Added**: Yes - "Blueprint template compliance checklist before gate submission"
```

---

## Failure Patterns

Track recurring failures to identify systemic issues:

```markdown
## Recurring Failure Patterns (Updated Monthly)

### Pattern: Asset Gate - Registry Search Skipped
**Frequency**: 0 occurrences
**Trend**: N/A
**Action**: Enforce registry search in asset creation prompts

### Pattern: Complexity Gate - Single Large Function
**Frequency**: 0 occurrences
**Trend**: N/A
**Action**: Promote function decomposition earlier in implementation

### Pattern: Blueprint Gate - Missing DIS Layers
**Frequency**: 0 occurrences
**Trend**: N/A
**Action**: Template enforcement, layer consultation checklist

[Add more as patterns emerge]
```

---

## Gate Failure Log (Chronological)

### 2025 Failures

*No gate failures logged yet.*

**Future entries will appear here in chronological order using the format above.**

---

## Metrics

```markdown
## Gate Failure Metrics (Quarterly)

### Overall
- **Total Failures**: 0
- **Fixed**: 0
- **Waived**: 0
- **Pending**: 0

### By Gate
- **Architecture Gate**: 0
- **Asset Gate**: 0
- **Complexity Gate**: 0
- **Blueprint Gate**: 0
- **Reuse Gate**: 0
- **Quality Gate**: 0

### By Severity
- **Critical**: 0
- **High**: 0
- **Medium**: 0
- **Low**: 0

### Resolution
- **Avg Time to Fix**: N/A
- **Auto-Fixed**: 0
- **AI-Fixed**: 0
- **Human-Fixed**: 0
- **Waive Rate**: 0%

### Prevention
- **Heuristics Added**: 0
- **Preventable**: N/A
- **Recurring Patterns**: 0

**Health**: N/A (no failures yet)
**Target**: < 5% failure rate, < 15 min avg fix time
```

---

## Heuristics Generated from Failures

Track heuristics added as result of gate failures:

```markdown
## Failure-Derived Heuristics

*No heuristics generated yet.*

**Format**:
```
### HEUR-FAIL-001: [Name]

**Generated From**: GATE-FAIL-XXXX
**Rule**: [Heuristic rule]
**Category**: [Prevention strategy]
**Success Rate**: [Track effectiveness]
```
```

---

## Waiver Tracking

Track cases where gate failures were waived:

```markdown
## Gate Waivers (Rare)

*No waivers granted yet.*

**Waiver Log**:
```
### Waiver: [ID]

**Gate**: [Which gate]
**Violation**: [What failed]
**Waived By**: [Human name]
**Date**: [ISO date]
**Reason**: [Why waived - must be exceptional]
**Conditions**: [Any conditions/temporary nature]
**Risk**: [What risk accepted]
```
```

**Rule**: Waivers are RARE. Gates enforce quality.

---

## Notes

- **Failures are logged, not hidden** - transparency
- **Patterns drive improvement** - recurring failures update gates/heuristics
- **Time to fix matters** - fast fixes mean good gate feedback
- **Waivers are exceptional** - gates are locks, not suggestions
- **Auto-logging is critical** - humans forget, tools don't

**Log failures. Find patterns. Prevent recurrence.**

**Gates that never fail are either too weak or unused.**
