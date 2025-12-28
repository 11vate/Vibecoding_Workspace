# Blueprint Gate

**Authority Tier**: 2 (Mandatory Process)
**Gate Type**: Hard Lock
**Applies To**: All implementation requests (features, systems, mechanics)
**Validation Tool**: `tools/blueprint-validator/validate.ts`

---

## Purpose

Enforce the foundational principle: **Design Before Code**

**Philosophy**: Code without design is speculation. Blueprints turn speculation into specification.

---

## Gate Checks

This gate **MUST** pass before ANY implementation begins.

### Check 1: Blueprint Exists

**Rule**: A formal blueprint MUST exist in `/docs/blueprints/` before implementation.

**Rationale**: No guessing. No "we'll figure it out as we code." Blueprint first.

**Validation**:
```typescript
// When implementation is requested
const feature = extractFeatureRequest(request);
const blueprintPath = findBlueprint(feature);

if (!blueprintPath) {
  fail(`No blueprint found for "${feature.name}". Create blueprint first.`);
}

// Check blueprint type matches feature type
const blueprintType = extractBlueprintType(blueprintPath);
const expectedType = determineExpectedBlueprintType(feature);

if (blueprintType !== expectedType) {
  fail(`Expected ${expectedType} blueprint, found ${blueprintType}`);
}
```

**Blueprint Types**:
1. **System Blueprint** - For systems/architecture (`system-[name].md`)
2. **Mechanic Blueprint** - For game/app mechanics (`mechanic-[name].md`)
3. **UX Blueprint** - For user flows/interfaces (`ux-[flow].md`)

**Failure Response**:
- Output: REJECTED
- Action: Create blueprint using templates from `/tools/blueprint-templates/`
- Cannot proceed: Implementation blocked until blueprint exists

**Example**:
```
User: "Implement the fusion system"

AI Checks: Blueprint exists at docs/blueprints/mechanic-fusion.md
Status: ✅ PASS - Blueprint found

User: "Add daily quest system"

AI Checks: No blueprint found
Status: ❌ FAIL - Must create mechanic-daily-quests.md first
```

---

### Check 2: Blueprint Completeness

**Rule**: Blueprint must contain ALL required sections.

**Validation**:
```typescript
const blueprint = loadBlueprint(blueprintPath);
const requiredSections = getRequiredSections(blueprint.type);

const missingSections = requiredSections.filter(section =>
  !blueprint.hasSect ion(section)
);

if (missingSections.length > 0) {
  fail(`Blueprint incomplete. Missing sections: ${missingSections.join(', ')}`);
}
```

**Required Sections by Type**:

**System Blueprint**:
- [ ] Purpose & Scope
- [ ] Components/Modules
- [ ] Data Structures
- [ ] State Management
- [ ] Event Flows
- [ ] Error Handling
- [ ] Testing Strategy
- [ ] Performance Considerations

**Mechanic Blueprint**:
- [ ] Experience Intent (why this exists)
- [ ] Player Psychology (how it feels)
- [ ] Core Interaction (what player does)
- [ ] System Rules (how it works)
- [ ] Data Model
- [ ] Edge Cases
- [ ] Balance Tuning
- [ ] UX Requirements

**UX Blueprint**:
- [ ] User Flow Diagram
- [ ] Screen/State Definitions
- [ ] Interaction Patterns
- [ ] Visual Hierarchy
- [ ] Accessibility Requirements
- [ ] Error States
- [ ] Loading States
- [ ] Success/Failure Paths

**Failure Response**:
- Output: REJECTED
- Action: Complete blueprint sections
- Provide: Section templates from `/tools/blueprint-templates/`

---

### Check 3: Constraint Validation

**Rule**: Blueprint must pass all applicable constraints from `/knowledge-base/constraints/`.

**Validation**:
```typescript
const blueprint = loadBlueprint(blueprintPath);
const constraints = loadApplicableConstraints(blueprint);

for (const constraint of constraints) {
  const validation = validateConstraint(blueprint, constraint);

  if (!validation.passes) {
    if (constraint.severity === 'error') {
      fail(`Constraint violation: ${constraint.name} - ${validation.message}`);
    } else {
      warn(`Constraint warning: ${constraint.name} - ${validation.message}`);
    }
  }
}
```

**Common Constraints Checked**:
- **CONST-001**: Cognitive Load Limit (≤ 3 concepts per screen)
- **CONST-002**: Core Loop Duration (15-60 seconds)
- **CONST-003**: System Coupling Limit (≤ 3 dependencies)
- **CONST-004**: Feedback Immediacy (< 100ms response)

**Failure Response**:
- Output: REJECTED
- Action: Revise blueprint to satisfy constraints
- Tool: Use `tools/constraint-validator/` to check

---

### Check 4: Design Intelligence Stack Consultation

**Rule**: All 18 DIS layers must be consulted and documented in blueprint.

**Validation**:
```typescript
const blueprint = loadBlueprint(blueprintPath);
const disLayers = [
  'layer-1-experience-pillars',
  'layer-2-player-psychology',
  'layer-3-core-loop',
  'layer-4-systems-map',
  'layer-5-mechanic-evolution',
  'layer-6-ux-decision-log',
  'layer-7-design-thinking',
  'layer-8-emotional-design',
  'layer-9-cognitive-architecture',
  'layer-10-behavioral-economics',
  'layer-11-player-psychology-advanced',
  'layer-12-motivation-systems',
  'layer-13-cognitive-load-management',
  'layer-14-emotional-journey-mapping',
  'layer-15-project-memory',
  'layer-16-meta-cognitive-reasoning',
  'layer-17-contextual-adaptation',
  'layer-18-temporal-reasoning'
];

const consultedLayers = blueprint.getConsultedLayers();

const missingLayers = disLayers.filter(layer =>
  !consultedLayers.includes(layer)
);

if (missingLayers.length > 0) {
  warn(`Blueprint should consult these DIS layers: ${missingLayers.join(', ')}`);
}

// At minimum, layers 1-3 are MANDATORY
const mandatoryLayers = ['layer-1', 'layer-2', 'layer-3'];
const missingMandatory = mandatoryLayers.filter(layer =>
  !consultedLayers.some(c => c.startsWith(layer))
);

if (missingMandatory.length > 0) {
  fail(`Blueprint missing MANDATORY DIS layers: ${missingMandatory.join(', ')}`);
}
```

**Blueprint Section**:
```markdown
## Design Intelligence Layers Consulted

### Layer 1: Experience Pillars
- Core fantasy: [What fantasy does this fulfill?]
- Decision: [How this blueprint serves the fantasy]

### Layer 2: Player Psychology
- Motivation: [What motivates player to engage?]
- Decision: [How this blueprint leverages motivation]

### Layer 3: Core Loop
- Integration: [How this fits into core loop]
- Duration impact: [Does this speed up or slow down loop?]

[... repeat for consulted layers ...]
```

**Failure Response**:
- Output: REJECTED
- Action: Consult missing layers and document decisions
- Reference: `/indexes/DESIGN_INDEX.md` for layer summaries

---

### Check 5: Research Artifacts (For New Features)

**Rule**: New/significant features require research artifacts in `/docs/research/`.

**Validation**:
```typescript
const feature = extractFeature(blueprint);

if (feature.isNew || feature.isSignificant) {
  const researchPath = findResearchArtifacts(feature);

  if (!researchPath) {
    fail(`New feature "${feature.name}" requires research artifacts. See research protocol.`);
  }

  // Check for required research types
  const requiredResearch = [
    'comparative-analysis.md',  // Similar implementations
    'design-patterns.md',       // Applicable patterns
    'technical-feasibility.md'  // Can we build this?
  ];

  const missingResearch = requiredResearch.filter(doc =>
    !existsInResearch(researchPath, doc)
  );

  if (missingResearch.length > 0) {
    fail(`Missing research artifacts: ${missingResearch.join(', ')}`);
  }
}
```

**Required Research Artifacts**:
1. **Comparative Analysis** - How do others solve this?
2. **Design Patterns** - What established patterns apply?
3. **Technical Feasibility** - Can we build it with our constraints?

**What Counts as "New/Significant"**:
- New core mechanic
- New system architecture
- New user interaction paradigm
- Significant change to existing system

**What Doesn't Require Research**:
- Minor UI tweaks
- Bug fixes
- Performance optimizations
- Variations of existing patterns

**Failure Response**:
- Output: REJECTED
- Action: Complete research phase first
- Protocol: See `/docs/protocols/research-protocol.md`

---

### Check 6: Data Structure Specification

**Rule**: All data structures must be fully specified with TypeScript interfaces.

**Validation**:
```typescript
const blueprint = loadBlueprint(blueprintPath);
const dataSection = blueprint.getSection('Data Structures');

if (!dataSection) {
  fail('Blueprint missing "Data Structures" section');
}

// Check for TypeScript interfaces
const interfaces = extractInterfaces(dataSection);

if (interfaces.length === 0) {
  fail('No TypeScript interfaces defined in Data Structures section');
}

// Validate each interface
for (const iface of interfaces) {
  const issues = validateInterface(iface);

  if (issues.length > 0) {
    fail(`Interface "${iface.name}" issues: ${issues.join(', ')}`);
  }
}
```

**Required in Data Structures Section**:
```markdown
## Data Structures

### Primary Data Models

\`\`\`typescript
interface Pet {
  id: string;
  name: string;
  rarity: number;
  element: 'fire' | 'water' | 'earth' | 'air';
  generation: number;
  traits: PetTrait[];
  createdAt: Date;
}

interface PetTrait {
  id: string;
  name: string;
  value: number;
  inherited: boolean;
}

interface FusionResult {
  pet: Pet;
  parents: [Pet, Pet];
  calculationLog: FusionCalculation;
}
\`\`\`

### State Structure

\`\`\`typescript
interface FusionState {
  selectedPets: Pet[];
  fusionInProgress: boolean;
  lastResult: FusionResult | null;
}
\`\`\`
```

**Failure Response**:
- Output: REJECTED
- Action: Define all data structures with TypeScript
- No `any` types allowed

---

### Check 7: Edge Case Documentation

**Rule**: All known edge cases must be documented with handling strategy.

**Validation**:
```typescript
const blueprint = loadBlueprint(blueprintPath);
const edgeCases = blueprint.getSection('Edge Cases');

if (!edgeCases || edgeCases.cases.length === 0) {
  fail('Blueprint must document edge cases');
}

// Check each edge case has a handling strategy
for (const edgeCase of edgeCases.cases) {
  if (!edgeCase.handlingStrategy) {
    fail(`Edge case "${edgeCase.name}" missing handling strategy`);
  }
}
```

**Example Edge Cases Section**:
```markdown
## Edge Cases

### Case 1: Both Pets Same ID
**Scenario**: User somehow selects same pet twice for fusion
**Handling**: Validate `pet1.id !== pet2.id`, show error if same
**Fallback**: Disable fusion button if same pet selected

### Case 2: Fusion During Network Disconnect
**Scenario**: Offline fusion in PWA
**Handling**: Queue fusion request, process when back online
**Fallback**: Show "Queued" status, process in background

### Case 3: Invalid Fusion Result (Rarity < 0)
**Scenario**: Bug in calculation produces impossible result
**Handling**: Clamp rarity to valid range [0-100], log error
**Fallback**: Use parent's average rarity if calculation fails
```

---

## Validation Execution

### Automated Validation

```bash
# Run blueprint gate
npm run gate:blueprint -- --blueprint docs/blueprints/mechanic-fusion.md

# Or manually
node tools/blueprint-validator/validate.ts docs/blueprints/mechanic-fusion.md

# Expected output:
# ✅ PASS: Blueprint exists
# ✅ PASS: All required sections present
# ✅ PASS: Constraint validation passed
# ✅ PASS: DIS layers consulted (18/18)
# ✅ PASS: Research artifacts found
# ✅ PASS: Data structures defined
# ✅ PASS: Edge cases documented
#
# GATE STATUS: PASSED
```

### Manual Validation

1. Check blueprint file exists
2. Verify all required sections present
3. Run constraint validator
4. Confirm DIS layer consultation (at least layers 1-3)
5. For new features, check research exists
6. Validate TypeScript interfaces defined
7. Review edge case coverage

---

## Failure Handling

### If Gate Fails:

1. **Immediate Stop** - Cannot proceed to implementation
2. **Generate Report** - Show missing/incomplete sections
3. **Log Failure** - Record in `/evolution/GATE_FAILURES_LOG.md`
4. **Complete Blueprint** - Fill in missing sections
5. **Revalidate** - Re-run blueprint gate

### Example Failure Report:

```
❌ BLUEPRINT GATE: FAILED

Blueprint: docs/blueprints/mechanic-daily-quests.md

Violations:
1. Missing Sections:
   - Edge Cases (required)
   - Testing Strategy (required)

2. DIS Layers Not Consulted:
   - Layer 1: Experience Pillars (MANDATORY)
   - Layer 2: Player Psychology (MANDATORY)
   - Layer 13: Cognitive Load Management (recommended)

3. Constraint Violations:
   - CONST-001: Quest UI introduces 5 concepts (max: 3)

4. Data Structures:
   - Missing TypeScript interfaces for QuestState

5. Research Artifacts:
   - New feature, but no comparative analysis found

Gate Status: FAILED
Completeness: 60% (target: 100%)
Next Step: Complete blueprint sections and re-validate
```

---

## Blueprint Templates

Use templates from `/tools/blueprint-templates/`:

- `system-blueprint-template.md` - For systems/architecture
- `mechanic-blueprint-template.md` - For game/app mechanics
- `ux-blueprint-template.md` - For user flows/interfaces

**Template includes**:
- All required sections
- DIS layer consultation prompts
- Data structure examples
- Edge case checklist

---

## Integration Points

**Enforced By**:
- Implementation requests (automatic gate check)
- Code review (verify blueprint exists)
- CI/CD (prevent merge without blueprint)

**Tools**:
- `tools/blueprint-validator/validate.ts` (primary)
- `tools/blueprint-generator/` (creates blueprints from specs)
- `tools/constraint-validator/` (checks constraints)

**Protocols**:
- Research Protocol: `/docs/protocols/research-protocol.md`
- Blueprint Protocol: `/docs/protocols/blueprint-protocol.md`
- Implementation Protocol: `/docs/protocols/implementation-protocol.md`

**References**:
- Design Intelligence Stack: `/indexes/DESIGN_INDEX.md`
- Constraints: `/knowledge-base/constraints/`
- Templates: `/tools/blueprint-templates/`

---

## Success Metrics

Track blueprint quality:

- **Blueprint Completeness**: Target 100% of sections
- **DIS Consultation**: Target 18/18 layers for major features
- **Research Artifacts**: 100% for new features
- **Implementation Variance**: Target < 10% deviation from blueprint

**Review**: Every blueprint creation, every sprint

---

## Exemptions

**NO exemptions** for:
- Blueprint existence (Tier 1 Law: Design Before Code)
- Mandatory DIS layers (1-3)
- Data structure specification

**Rare exemptions** for:
- Complete layer consultation (context-dependent)
- Research artifacts (for very minor features)

All exemptions logged in `/evolution/ARBITRATION_LOG.md`.

---

**Remember**: "We'll figure it out as we code" is how technical debt is born. Blueprints kill debt at the gate.

**No blueprint = No implementation**

**Gates are locks, not warnings.**
