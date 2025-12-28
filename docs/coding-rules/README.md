# Coding Rules

## Purpose

Comprehensive coding standards ensuring consistent, maintainable, high-quality code across all projects.

**Coding rules ensure code quality and consistency.**

---

## Core Rules

### 1. No Magic Numbers

**Rule**: All numeric values must be named constants or tunable parameters.

**Why**: Magic numbers are hard to understand and change.

**Example**:
```typescript
// ❌ Bad
if (score > 100) { ... }

// ✅ Good
const MAX_SCORE = 100;
if (score > MAX_SCORE) { ... }
```

---

### 2. No Hard-Coded Values

**Rule**: All configuration values must be configurable.

**Why**: Hard-coded values prevent flexibility.

**Example**:
```typescript
// ❌ Bad
const delay = 1000;

// ✅ Good
const DELAY_MS = config.get('delay', 1000);
```

---

### 3. Deterministic Logic

**Rule**: All game/app logic must be deterministic and testable.

**Why**: Deterministic logic enables testing and debugging.

**Example**:
```typescript
// ❌ Bad
const random = Math.random();

// ✅ Good
const random = rng.next(); // Seeded RNG
```

---

### 4. Modular Systems

**Rule**: All systems must be self-contained modules.

**Why**: Modularity enables maintainability and testing.

**Example**:
```typescript
// ✅ Good
export class InventorySystem {
  // Self-contained inventory logic
}
```

---

### 5. Event-Driven Architecture

**Rule**: Use events for system communication, not direct coupling.

**Why**: Events enable loose coupling and flexibility.

**Example**:
```typescript
// ❌ Bad
inventory.addItem(item);
ui.updateInventory();

// ✅ Good
eventBus.emit('item-added', item);
// UI subscribes to event
```

---

### 6. Error Handling

**Rule**: All errors must be handled gracefully.

**Why**: Error handling prevents crashes and improves UX.

**Example**:
```typescript
// ✅ Good
try {
  await loadData();
} catch (error) {
  logger.error('Failed to load data', error);
  showError('Failed to load. Please try again.');
}
```

---

### 7. Type Safety

**Rule**: Use TypeScript types for all data structures.

**Why**: Types prevent errors and improve maintainability.

**Example**:
```typescript
// ✅ Good
interface Player {
  id: string;
  name: string;
  score: number;
}
```

---

### 8. Asset Registry

**Rule**: All assets must be referenced through registry, never direct paths.

**Why**: Registry enables asset management and prevents broken paths.

**Example**:
```typescript
// ❌ Bad
const sprite = 'assets/sprites/player.png';

// ✅ Good
import { Sprites } from '@/assets';
const sprite = Sprites.player;
```

---

## Code Quality Rules

### Readability

**Rule**: Code must be readable and self-documenting.

**Requirements**:
- Clear variable names
- Clear function names
- Comments for complex logic
- Consistent formatting

---

### Maintainability

**Rule**: Code must be maintainable.

**Requirements**:
- Modular structure
- Clear dependencies
- Documented interfaces
- Testable code

---

### Performance

**Rule**: Code must meet performance targets.

**Requirements**:
- Efficient algorithms
- Minimal allocations
- Optimized rendering
- Performance monitoring

---

## Enforcement

### Pre-Commit Checks

**What to Check**:
- Code follows rules
- No magic numbers
- Error handling present
- Types are used

---

### Code Reviews

**What to Review**:
- Rule compliance
- Code quality
- Architecture alignment
- Performance considerations

---

## Integration Points

### .cursorrules
- Rules enforced in .cursorrules
- Automated checks
- Quality gates

### Knowledge Base
- Rules documented
- Patterns referenced
- Best practices shared

---

**These rules ensure code quality and consistency across all projects.**


