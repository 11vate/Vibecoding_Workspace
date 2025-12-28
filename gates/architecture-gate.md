# Architecture Gate

**Authority Tier**: 2 (Mandatory Process)
**Gate Type**: Hard Lock
**Applies To**: Code, system designs, architectural changes
**Validation Tool**: `tools/code-analyzer/architecture-check.ts`

---

## Purpose

Enforce architectural integrity and prevent system coupling violations, architectural debt, and state management chaos.

**Philosophy**: Architecture degradation is insidious. Stop it at the gate, not in production.

---

## Gate Checks

This gate **MUST** pass before any code or system design is accepted.

### Check 1: System Coupling Limit

**Rule**: No system may directly depend on more than 3 other systems.

**Rationale**: High coupling creates fragility, testing nightmares, and cascade failures.

**Validation**:
```typescript
// Run: tools/code-analyzer/architecture-check.ts --check-coupling
const dependencies = analyzeDependencies(system);
if (dependencies.length > 3) {
  fail(`System "${system.name}" has ${dependencies.length} dependencies (max: 3)`);
}
```

**Failure Response**:
- Output: REJECTED
- Action: Refactor to reduce coupling
- Suggestion: Use events/messaging instead of direct deps

**Example Violation**:
```typescript
// ❌ FAIL - 5 dependencies
class FusionSystem {
  constructor(
    private pets: PetSystem,
    private ui: UISystem,
    private audio: AudioSystem,
    private inventory: InventorySystem,
    private achievements: AchievementSystem
  ) {}
}
```

**Example Pass**:
```typescript
// ✅ PASS - 2 dependencies + events
class FusionSystem {
  constructor(
    private pets: PetSystem,
    private eventBus: EventBus  // Other systems communicate via events
  ) {}

  // Other systems listen to events instead of direct coupling
}
```

---

### Check 2: Core Loop Definition

**Rule**: Core loop must be defined and completable in < 60 seconds.

**Rationale**: Long core loops kill engagement. If you can't complete the loop in under a minute, it's not the core loop.

**Validation**:
```typescript
// Check 1: Core loop file exists
const coreLoop = loadFile('docs/blueprints/core-loop.md');
if (!coreLoop) {
  fail('Core loop not defined in blueprints');
}

// Check 2: Duration specified and < 60s
const duration = extractDuration(coreLoop);
if (!duration) {
  fail('Core loop duration not specified');
}
if (duration > 60) {
  fail(`Core loop duration ${duration}s exceeds 60s maximum`);
}
```

**Failure Response**:
- Output: REJECTED
- Action: Define or optimize core loop
- Suggestion: What's the ONE thing players do repeatedly?

**Core Loop Structure**:
```markdown
# Core Loop

## Loop Steps
1. [Action] - Player does X
2. [Result] - System responds with Y
3. [Reward] - Player receives Z
4. [Progress] - Player advances toward goal
5. [Motivation] - Player wants to repeat

## Duration: 30-45 seconds (target)

## Frequency: Player completes 10-20 loops per session
```

---

### Check 3: Centralized State Management

**Rule**: State management must be centralized. No scattered state across components.

**Rationale**: Scattered state = impossible debugging, race conditions, data inconsistency.

**Validation**:
```typescript
// Check for state management centralization
const stateStores = findStateDefinitions(codebase);

// Allowed: 1 state store per domain (e.g., petState, uiState, gameState)
// Not allowed: Component-level state for shared data

const violations = stateStores.filter(store =>
  store.type === 'component-local' &&
  store.isSharedData === true
);

if (violations.length > 0) {
  fail(`Found ${violations.length} components with local state for shared data`);
}
```

**Failure Response**:
- Output: REJECTED
- Action: Move state to centralized store (Zustand, Redux, Context)
- Suggestion: Components read from store, dispatch actions to modify

**Example Violation**:
```typescript
// ❌ FAIL - Shared pet data scattered across components
function PetCard() {
  const [pet, setPet] = useState(petData); // Local copy
}

function PetList() {
  const [pets, setPets] = useState(allPets); // Another copy
}
```

**Example Pass**:
```typescript
// ✅ PASS - Centralized state
// store/petStore.ts
const usePetStore = create((set) => ({
  pets: [],
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] }))
}));

// Components just read from store
function PetCard() {
  const pet = usePetStore((state) => state.pets.find(p => p.id === id));
}
```

---

### Check 4: Event-Driven Architecture

**Rule**: Systems must communicate via events, not direct method calls (except within same domain).

**Rationale**: Event-driven = decoupled, testable, maintainable. Direct calls = spaghetti.

**Validation**:
```typescript
// Check for cross-system direct calls
const crossSystemCalls = analyzeInterSystemCommunication();

const directCalls = crossSystemCalls.filter(call =>
  call.type === 'direct-method-call' &&
  call.from.domain !== call.to.domain
);

if (directCalls.length > 0) {
  fail(`Found ${directCalls.length} cross-system direct calls. Use events instead.`);
}
```

**Failure Response**:
- Output: REJECTED
- Action: Replace direct calls with event emission/listening
- Suggestion: Create event types, emit from source, listen in target

**Example Violation**:
```typescript
// ❌ FAIL - Direct cross-system call
class FusionSystem {
  fusePets(pet1, pet2) {
    const result = this.calculate(pet1, pet2);
    this.achievementSystem.unlock('first-fusion'); // Direct call to other system
  }
}
```

**Example Pass**:
```typescript
// ✅ PASS - Event-driven
class FusionSystem {
  fusePets(pet1, pet2) {
    const result = this.calculate(pet1, pet2);
    this.eventBus.emit('fusion-completed', { pet1, pet2, result });
    // AchievementSystem listens for 'fusion-completed' independently
  }
}
```

---

## Validation Execution

### Manual Validation

For architectur

al designs (blueprints, diagrams):
1. Review system diagram
2. Count dependencies per system
3. Verify core loop is defined and < 60s
4. Check state management is centralized
5. Verify communication is event-driven

### Automated Validation

For code:
```bash
# Run architecture checker
npm run gate:architecture

# Or manually
node tools/code-analyzer/architecture-check.ts

# Expected output:
# ✅ PASS: System coupling check (max 3 deps per system)
# ✅ PASS: Core loop defined (35s average)
# ✅ PASS: State management centralized
# ✅ PASS: Event-driven architecture
#
# GATE STATUS: PASSED
```

---

## Failure Handling

### If Gate Fails:

1. **Immediate Stop** - Do not proceed with implementation
2. **Generate Report** - Show specific violations
3. **Log Failure** - Record in `/evolution/GATE_FAILURES_LOG.md`
4. **Provide Fix Guidance** - Suggest refactoring approach
5. **Revalidate** - After fixes, re-run gate check

### Example Failure Report:

```
❌ ARCHITECTURE GATE: FAILED

Violations:
1. System Coupling: FusionSystem has 5 dependencies (max: 3)
   - Fix: Use EventBus for AchievementSystem and UISystem

2. Direct Cross-System Calls: 3 violations found
   - FusionSystem → AchievementSystem.unlock() (line 45)
   - InventorySystem → UISystem.showNotification() (line 123)
   - Fix: Replace with event emissions

3. Scattered State: PetData managed in 4 locations
   - PetCard.tsx (local state)
   - PetList.tsx (local state)
   - Fix: Create centralized PetStore

Gate Status: FAILED
Next Step: Fix violations and re-run gate check
```

---

## Exemptions

This gate has **NO exemptions**. Architecture violations always lead to technical debt.

If you believe an exemption is warranted:
1. Document why in `/evolution/ARBITRATION_LOG.md`
2. Propose alternative enforcement mechanism
3. Update this gate with approved exception (requires UPDATE_PROTOCOL)

---

## Integration Points

**Enforced By**:
- Blueprint validation (before implementation)
- Code review (before commit)
- CI/CD pipeline (automated)

**Tools**:
- `tools/code-analyzer/architecture-check.ts` (primary)
- `tools/blueprint-validator/architecture-validator.ts` (for designs)

**Logs**:
- Failures: `/evolution/GATE_FAILURES_LOG.md`
- Pass/fail rates: `/evolution/EVOLUTION_METRICS.md`

**References**:
- Core loop guidelines: `docs/design-intelligence/layer-3-core-loop.md`
- State management patterns: `docs/code-patterns/state-management.md`
- Event-driven architecture: `docs/code-patterns/event-patterns.md`

---

## Success Metrics

Track these metrics to measure architectural health:

- **Average System Coupling**: Target < 2.5 dependencies per system
- **Core Loop Duration**: Target 30-45 seconds
- **State Centralization**: 100% of shared state in stores
- **Event-Driven Ratio**: > 90% of cross-system comm via events

**Review Frequency**: Every sprint/iteration

---

**Remember**: Architecture degrades slowly, then catastrophically. This gate prevents the slow part.

**Gates are locks, not warnings.**
