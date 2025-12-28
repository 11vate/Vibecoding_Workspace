# Workspace Update Protocol

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Safe evolution of workspace without entropy

---

## Purpose

**Philosophy**: Workspaces decay without discipline. This protocol prevents chaos.

**Rule**: ALL workspace modifications follow this protocol (no exceptions).

---

## Update Types

### Type 1: Content Update
**What**: Modifying existing file content
**Examples**: Updating pattern, refining layer, improving tool
**Impact**: Low (single file)

### Type 2: Structural Update
**What**: Adding/removing files or directories
**Examples**: New gate, new index, new tool
**Impact**: Medium (affects navigation)

### Type 3: Architecture Update
**What**: Changing workspace structure or hierarchy
**Examples**: New authority tier, reorganizing directories
**Impact**: High (affects everything)

### Type 4: Constitutional Update
**What**: Modifying WORKSPACE_CONSTITUTION.md
**Examples**: Adding tier, changing precedence
**Impact**: Critical (affects all governance)

---

## Update Protocol Steps

### Step 1: Declare Update

**Required Information**:
```markdown
## Update Declaration

**Type**: [Content | Structural | Architecture | Constitutional]
**Tier**: [1 | 2 | 3 | 4]
**Scope**: [Which files/systems affected]
**Rationale**: [Why this update is needed]
**Breaking**: [Yes/No - does this break existing usage?]
**Requester**: [Human | AI | System]
**Date**: [ISO date]
```

**Example**:
```markdown
## Update Declaration

**Type**: Structural
**Tier**: 2 (adding new gate)
**Scope**: /gates/performance-gate.md, /indexes/MASTER_INDEX.md
**Rationale**: Need performance validation before deployment
**Breaking**: No
**Requester**: Human (project lead)
**Date**: 2025-12-24
```

---

### Step 2: Conflict Check

**Check Against**:
1. **WORKSPACE_CONSTITUTION.md** - Tier conflicts?
2. **Existing files** - Duplicates? Overlaps?
3. **Indexes** - Navigation conflicts?
4. **Gates** - Enforcement conflicts?

**Conflict Types**:
- **Tier Conflict**: New Tier 3 contradicts Tier 1 law
- **Duplicate**: File/concept already exists
- **Precedence**: Unclear which rule applies
- **Orphan**: Update creates unreachable content

**Resolution**:
- If conflict: Log in `ARBITRATION_LOG.md` and resolve
- If no conflict: Proceed

---

### Step 3: Update Affected Indexes

**CRITICAL**: Indexes must stay current.

**Check All Indexes**:
- **MASTER_INDEX.md** - If new file/directory
- **ARCHITECTURE_INDEX.md** - If code/system change
- **DESIGN_INDEX.md** - If DIS layer change
- **PATTERN_INDEX.md** - If pattern change
- **ASSET_INDEX.md** - If asset system change
- **PROTOCOL_INDEX.md** - If protocol change
- **TOOL_INDEX.md** - If tool change

**Update Format**:
```markdown
# In affected index

## [New Section or Updated Entry]

### [New File/Concept]
**File**: path/to/new-file.md
**Purpose**: [What it does]
**When**: [When to use]
**Related**: [[Other relevant files]]
```

---

### Step 4: Handle Deprecation (If Replacing)

**If update replaces existing**:
1. Mark old as `[DEPRECATED: use X instead]`
2. Set grace period (see `DEPRECATION_RULES.md`)
3. Update all references to new
4. Log deprecation in `DEPRECATION_RULES.md`
5. Schedule removal after grace period

**Example**:
```markdown
# Old file: gates/old-quality-gate.md

# [DEPRECATED: Use gates/quality-gate.md instead]
# Quality Gate (Deprecated)

**This gate has been replaced by gates/quality-gate.md**
**Grace Period**: Until 2026-01-24
**Reason**: Consolidated with enhanced checks
```

---

### Step 5: Log Update in Metrics

**File**: `EVOLUTION_METRICS.md`

**Log Entry**:
```markdown
### Update: [Date]

- **Type**: [Type]
- **Scope**: [What changed]
- **Rationale**: [Why]
- **Impact**: [Files affected]
- **Breaking**: [Yes/No]
- **Migration Required**: [Yes/No]
```

---

### Step 6: Commit with Structured Message

**Commit Format**:
```
[TYPE] Brief description

Detailed explanation of what changed and why

Tier: X
Scope: [files/systems affected]
Breaking: [Yes/No]
Indexes Updated: [Y/N]
Deprecated: [file names if any]

Updates WORKSPACE_CONSTITUTION.md (if constitutional update)
```

**Example**:
```
[STRUCTURAL] Add Performance Gate

Added new performance gate to validate deployment readiness.
Checks: bundle size, load time, lighthouse score, core web vitals.

Tier: 2 (Mandatory Process)
Scope: /gates/performance-gate.md, /indexes/MASTER_INDEX.md
Breaking: No
Indexes Updated: Yes (MASTER_INDEX)
Deprecated: None
```

---

## Update Execution Checklist

Before committing:
- [ ] Update declaration written
- [ ] Conflict check performed
- [ ] Affected indexes updated
- [ ] Deprecation handled (if replacing)
- [ ] Evolution metrics logged
- [ ] Structured commit message ready

---

## Special Case: Constitutional Updates

**CRITICAL**: Modifying `WORKSPACE_CONSTITUTION.md` requires extra care.

**Additional Requirements**:
1. **Justification**: Why constitutional change needed?
2. **Impact Analysis**: What does this affect?
3. **Rollback Plan**: How to revert if needed?
4. **Notification**: Update `AI_INITIALIZATION.md` if tier changes
5. **Validation**: Does this create conflicts with existing Tier 1 laws?

**Example Constitutional Update**:
```markdown
## Constitutional Update: Add Tier 0

**Justification**: Need immutable workspace meta-laws above all tiers
**Impact**: All existing tiers shift down (1→2, 2→3, etc.)
**Rollback**: Revert constitution, update all tier declarations
**Notification**: Update AI_INITIALIZATION.md with new hierarchy
**Validation**: No conflicts - this is additive above existing structure
```

---

## Versioning Strategy

**Workspace Version**: Semantic versioning (MAJOR.MINOR.PATCH)

**Version Increments**:
- **MAJOR**: Constitutional updates, architecture changes
- **MINOR**: New gates, new protocols, structural changes
- **PATCH**: Content updates, bug fixes, refinements

**Current Version**: Tracked in `EVOLUTION_METRICS.md`

**Version History**: Logged in `EVOLUTION_METRICS.md`

---

## Migration Support

**When Breaking Changes**:
1. Document migration path
2. Provide migration script (if automatable)
3. Set grace period
4. Update all affected files
5. Test migration path

**Migration Document Template**:
```markdown
# Migration: [Old] → [New]

## What Changed
[Describe change]

## Impact
[Who/what is affected]

## Migration Steps
1. [Step 1]
2. [Step 2]
...

## Automated Migration
[Script path if available]

## Grace Period
[Until date]

## Support
[Where to get help]
```

---

## Backward Compatibility

**Principle**: Preserve backward compatibility when possible.

**Strategies**:
1. **Deprecation over deletion** - grace period first
2. **Adapters** - Old interface → new implementation
3. **Aliases** - Redirect old paths to new
4. **Documentation** - Clear migration guides

**When Breaking is Necessary**:
- Document thoroughly
- Provide migration path
- Set reasonable grace period
- Communicate clearly

---

## Review & Approval

**Updates Requiring Approval**:
- **Constitutional Updates**: Human approval required
- **Architecture Updates**: Human review recommended
- **Structural Updates**: AI can proceed (but log)
- **Content Updates**: AI can proceed

**Approval Log**:
```markdown
## Update Approval

**Update**: [Description]
**Requested By**: [AI/Human]
**Approved By**: [Human name]
**Date**: [ISO date]
**Conditions**: [Any conditions/restrictions]
```

---

## Automation

**Automated via Tools**:
- Index updates (after file changes)
- Deprecation markers (scripted)
- Version bumps (on commit)
- Metrics logging (on commit)

**Tool**: `tools/workspace-updater/` (future)

---

## Notes

- **All updates follow this protocol** - no shortcuts
- **Indexes must stay current** - navigation breaks otherwise
- **Constitutional updates are rare** - high bar for changing
- **Deprecation prevents breakage** - grace periods required
- **Version history tracks evolution** - learn from change patterns

**Update safely. Evolve deliberately. Maintain coherence.**
