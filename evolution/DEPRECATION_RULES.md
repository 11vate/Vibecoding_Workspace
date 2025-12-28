# Deprecation Rules

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Graceful deprecation without breaking changes

---

## Purpose

**Philosophy**: Delete is violent. Deprecate is civilized.

**Rule**: NEVER delete without deprecation period (except duplicates).

---

## Deprecation vs Deletion

### Deprecate When
- Replacing with better version
- Consolidating similar concepts
- Refactoring workspace structure
- Evolving patterns/protocols

### Delete Immediately When
- Exact duplicate discovered
- Created in error
- Never used (orphan, < 1 week old)
- Security vulnerability

---

## Deprecation Process

### Step 1: Mark as Deprecated

**Format** (top of file):
```markdown
# [DEPRECATED: Use X instead]
# [Original Title]

**This file has been deprecated.**
**Replacement**: [path/to/new-file.md]
**Deprecated On**: [ISO date]
**Grace Period**: Until [ISO date + grace period]
**Reason**: [Why deprecated]
**Migration**: [How to migrate]

---

[Original content remains below for reference]
```

### Step 2: Update All References

**Find all references**:
```bash
# Search for references to deprecated file
grep -r "deprecated-file.md" .
```

**Update to new file**:
- Change imports/links to new file
- Update indexes
- Update documentation

### Step 3: Set Grace Period

**Standard Grace Periods**:
- **Content Updates**: 1 month
- **Structural Changes**: 2 months
- **Architecture Changes**: 3 months
- **Constitutional Changes**: 6 months

**Grace Period = Time to migrate without breakage**

### Step 4: Log Deprecation

**File**: This file (`DEPRECATION_RULES.md`)

**Log Format**:
```markdown
## Deprecation Log

### [File Name] - Deprecated [Date]

- **File**: path/to/deprecated-file.md
- **Replacement**: path/to/new-file.md
- **Deprecated On**: 2025-12-24
- **Removal Date**: 2026-01-24 (1 month grace)
- **Reason**: Consolidated into new comprehensive gate
- **Migration**: Update imports from old → new
- **Impact**: Low (only 2 references)
- **Status**: Active (grace period ongoing)
```

### Step 5: Schedule Removal

**Automated Reminder**:
```json
{
  "deprecation_id": "DEP-2025-001",
  "file": "gates/old-quality-gate.md",
  "removal_date": "2026-01-24",
  "status": "active",
  "references_remaining": 0
}
```

**Manual Review**:
- Check if grace period passed
- Verify zero references remaining
- Confirm no one using deprecated item
- Delete safely

---

## Deprecation Markers

### File Deprecation
```markdown
# [DEPRECATED: Use X instead]
```

### Function/Class Deprecation (in code)
```typescript
/**
 * @deprecated Use newFunction() instead. Will be removed in v2.0
 */
function oldFunction() {
  // ...
}
```

### Pattern Deprecation
```markdown
## PATTERN-OLD-001 [DEPRECATED]

**Deprecated**: 2025-12-24
**Replacement**: PATTERN-NEW-001
**Reason**: More effective approach discovered
```

### Tool Deprecation
```markdown
# Tool Name [DEPRECATED]

**This tool has been deprecated.**
**Use Instead**: `tools/new-tool/`
**Reason**: Functionality merged into new comprehensive tool
```

---

## Grace Period Extensions

**When to Extend**:
- High number of active references
- Complex migration required
- Stakeholder request (human users)

**Extension Process**:
1. Document reason for extension
2. Update removal date
3. Notify via evolution log
4. Provide migration support

**Example**:
```markdown
### Grace Period Extension: gates/old-quality-gate.md

**Original Removal**: 2026-01-24
**Extended To**: 2026-02-24 (+1 month)
**Reason**: 15 active references still migrating
**Support Provided**: Migration script created
```

---

## Removal Protocol

**After Grace Period**:
1. Verify zero active references
2. Create final backup (git history)
3. Delete file
4. Update indexes (remove entry)
5. Log removal in metrics
6. Commit with "[REMOVED]" prefix

**Commit Message**:
```
[REMOVED] gates/old-quality-gate.md

Removed after 1-month grace period (deprecated 2025-12-24).
All references migrated to gates/quality-gate.md.

References Remaining: 0
Grace Period: Ended 2026-01-24
Safe to Remove: Yes
```

---

## Backward Compatibility Strategies

### Strategy 1: Redirect/Alias
```typescript
// Old import still works, redirects to new
export { newFunction as oldFunction } from './new-module';
```

### Strategy 2: Adapter Pattern
```typescript
// Old interface → new implementation
class OldAPI {
  // @deprecated
  oldMethod() {
    return this.newAdapter.newMethod();
  }
}
```

### Strategy 3: Deprecation Warnings
```typescript
function oldFunction() {
  console.warn('oldFunction() is deprecated. Use newFunction() instead.');
  return newFunction();
}
```

---

## Deprecation Log

### Active Deprecations

*No active deprecations currently.*

**Format**:
```markdown
### [File Name] - Deprecated [Date]

- **File**: path
- **Replacement**: path
- **Deprecated On**: date
- **Removal Date**: date
- **Reason**: reason
- **Migration**: steps
- **References Remaining**: count
- **Status**: Active | Extended | Removed
```

---

### Completed Removals

*No completed removals yet.*

**Format**:
```markdown
### [File Name] - Removed [Date]

- **File**: path (deleted)
- **Deprecated On**: date
- **Removed On**: date
- **Grace Period**: X months
- **Final References**: 0
- **Reason**: reason
```

---

## Exemptions

**Immediate Deletion Allowed**:
- Security vulnerabilities
- Exact duplicates
- Files created in error (< 1 week old, never used)
- Emergency fixes

**Log Exemption**:
```markdown
### Exemption: Immediate Deletion

**File**: path/to/deleted-file.md
**Deleted On**: 2025-12-24
**Reason**: Exact duplicate of existing-file.md
**Exemption Type**: Duplicate
**Approved By**: [AI/Human]
```

---

## Metrics

Track deprecation health:

```markdown
## Deprecation Metrics (Quarterly)

- **Active Deprecations**: 0
- **Avg Grace Period**: N/A
- **Removals This Quarter**: 0
- **Extensions Granted**: 0
- **Immediate Deletions**: 0

**Health**: Good (low deprecation churn)
```

---

## Notes

- **Deprecation is kindness** - prevents breaking changes
- **Grace periods are mandatory** - except exemptions
- **Zero references before removal** - verify first
- **Log everything** - track deprecation lifecycle
- **Communicate clearly** - migration path must be obvious

**Deprecate gracefully. Remove safely. Maintain trust.**
