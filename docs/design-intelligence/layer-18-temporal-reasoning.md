# Layer 18: Temporal Reasoning

**Authority Tier**: 3 (Conditional Heuristic - apply when time is a critical factor)
**Layer Type**: Strategic Intelligence Layer
**Integration**: Complements Layer 5 (Mechanic Evolution), Layer 17 (Contextual Adaptation)

---

## Purpose

**Temporal reasoning** is the AI's ability to make design decisions that account for time as a dimension - not just "when" to build, but how decisions made today affect the system over time.

**Philosophy**: Every design decision has a temporal signature - immediate costs, deferred costs, maintenance burden, and evolution potential. Reason about the full timeline, not just the present.

**When to Use**: Architecture decisions, technical debt tradeoffs, feature prioritization, maintenance planning, evolution roadmaps.

---

## What is Temporal Reasoning?

### Definition

**Temporal Reasoning** = Making decisions that explicitly model:
- **Present**: Immediate implementation cost and value
- **Near Future** (weeks-months): Integration debt, onboarding complexity
- **Far Future** (months-years): Technical debt, maintenance burden, evolution constraints
- **Lifecycle**: From birth to deprecation

**Example**:
```
Decision: Use third-party animation library

Temporal Analysis:
- Present (Week 1):
  - Cost: 2 hours integration
  - Value: Rich animations immediately
  - ✅ Win: Fast implementation

- Near Future (Months 1-6):
  - Cost: Team learns library quirks (+8 hours)
  - Cost: 2 breaking changes in library updates (+4 hours)
  - Value: Animations working well
  - ⚠️ Neutral: Some maintenance cost

- Far Future (Year 1+):
  - Cost: Library abandoned by maintainers
  - Cost: 40 hours to migrate to alternative or build custom
  - Cost: Delayed features due to animation tech debt
  - ❌ Loss: Migration cost > original build cost

Temporal Verdict: Build custom (10 hours) instead of integrate (2 hours)
Rationale: 10 hours now < 54 hours over lifecycle
```

**Key Insight**: Cheapest now ≠ cheapest over time.

---

## Temporal Dimensions

### Dimension 1: Implementation Time (Present)

**What**: Time to build the feature/system now

**Considerations**:
- Direct coding time
- Learning curve for new patterns/libraries
- Integration with existing systems
- Testing and validation time

**Optimization Strategy**:
- Use proven patterns (reduce learning curve)
- Reuse existing assets/code (Layer 10)
- Leverage heuristics for faster decisions
- Accept some technical debt if timeline critical

**Questions**:
- How much time do we have?
- What's the minimum viable implementation?
- Can we parallelize work?
- What can we defer to later?

---

### Dimension 2: Integration Time (Near Future: Weeks-Months)

**What**: Time for the system/feature to integrate smoothly into workflow

**Considerations**:
- Onboarding time for team/users
- Integration friction with other systems
- Documentation and knowledge transfer
- Bug fixes and refinements

**Hidden Costs**:
- "It works" → "It works smoothly" = often 2-3x initial time
- Cognitive load on team to understand new patterns
- Support burden answering questions
- Unexpected interactions discovered later

**Questions**:
- How long until this feels natural?
- What friction will this create?
- What documentation is needed?
- Will this confuse users/developers?

**Optimization Strategy**:
- Choose familiar patterns (reduce onboarding)
- Comprehensive documentation upfront
- Gradual rollout (progressive disclosure)
- Early user/dev feedback

---

### Dimension 3: Maintenance Time (Far Future: Months-Years)

**What**: Ongoing time cost to maintain the system over its lifecycle

**Considerations**:
- Bug fixes
- Dependency updates
- Adaptation to platform changes
- Refactoring as complexity grows
- Knowledge decay (original developer leaves)

**Maintenance Multipliers** (factors that increase maintenance burden):
```
High Multipliers (avoid if possible):
- External dependencies (libraries, APIs, services)
- Complex state management
- Tight coupling between systems
- Non-standard patterns
- Lack of documentation
- "Clever" code that's hard to understand

Low Multipliers (prefer):
- Simple, explicit code
- Minimal dependencies
- Loose coupling
- Standard patterns
- Comprehensive documentation
- Self-explanatory code
```

**Maintenance Cost Formula**:
```
Annual Maintenance Cost =
  (Base Complexity) ×
  (Dependency Count × 2) ×
  (Coupling Factor) ×
  (Documentation Quality^-1) ×
  (Pattern Familiarity^-1)

Where:
- Base Complexity: Lines of code / 100
- Dependency Count: # of external libraries/services
- Coupling Factor: 1 (loose) to 5 (tight)
- Documentation Quality: 0.5 (poor) to 2 (excellent)
- Pattern Familiarity: 0.5 (novel) to 2 (standard)

Example:
Feature A: 500 LOC, 3 dependencies, tight coupling (4), poor docs (0.5), standard pattern (2)
= (5) × (3×2) × (4) × (2) × (0.5) = 120 hours/year

Feature B: 800 LOC, 0 dependencies, loose coupling (1), good docs (1.5), standard pattern (2)
= (8) × (0×2) × (1) × (0.67) × (0.5) = 2.7 hours/year

Feature B is 44x cheaper to maintain despite being 60% more code!
```

**Questions**:
- What will break when we upgrade dependencies?
- How often will this need updates?
- Can a new developer understand this in 6 months?
- What happens if the original author leaves?

---

### Dimension 4: Evolution Time (Lifecycle: Years)

**What**: Ability of the system to evolve as requirements change

**Considerations**:
- How easily can this be extended?
- How tightly does this constrain future decisions?
- What future features does this enable/block?
- When should this be deprecated?

**Evolution Potential Assessment**:
```
High Evolution Potential (design for change):
- Modular architecture
- Clear extension points
- Loose coupling
- Abstract interfaces
- Configurable behavior
- Examples: Plugin systems, event-driven architectures

Low Evolution Potential (design for stability):
- Monolithic design
- Hard-coded behavior
- Tight coupling
- Concrete implementations
- Examples: Throw-away prototypes, one-off scripts
```

**Questions**:
- How might requirements change in 1 year? 2 years?
- What features might we want to add later?
- What does this design prevent us from doing?
- Is this a foundation or a feature?

**Lifecycle Stages**:
```
1. Birth (0-3 months)
   - High implementation cost
   - High learning curve
   - Low value (not mature yet)
   - Decision: Is initial investment justified?

2. Growth (3-12 months)
   - Decreasing learning curve
   - Increasing value
   - Feature additions
   - Decision: Where to invest evolution effort?

3. Maturity (1-3 years)
   - Stable, well-understood
   - High value, low maintenance
   - Few changes needed
   - Decision: Maintain or prepare for deprecation?

4. Decline (3+ years)
   - Maintenance burden increasing
   - Better alternatives exist
   - Technical debt accumulating
   - Decision: Refactor, replace, or remove?

5. Deprecation
   - Migration to replacement
   - Sunset period
   - Removal
   - Decision: When and how to retire?
```

---

## Temporal Decision Frameworks

### Framework 1: Time-to-Value Analysis

**Purpose**: Optimize for fastest valuable output

**Process**:
1. **Define "valuable"**: What's the minimum that provides user value?
2. **Identify critical path**: What must be built first?
3. **Parallelize non-critical**: What can be deferred or built later?
4. **Measure actual value delivery**: When do users benefit?

**Example**:
```
Feature: User profiles with avatars, bio, achievements, friends

Time-to-Value Analysis:
1. Valuable = Users can identify each other
   → Minimum: Name + avatar (Week 1) ✅
2. Critical path: User ID system → Profile page → Avatar upload
3. Non-critical (defer): Bio (Week 2), Achievements (Week 4), Friends (Week 6)
4. Value delivery: Week 1 (not Week 6)

Result: 6 weeks → 1 week for initial value
```

**When to use**:
- Competitive pressure (first-to-market matters)
- User feedback needed early
- Uncertain requirements (validate assumptions fast)

---

### Framework 2: Technical Debt Tradeoff Matrix

**Purpose**: Decide when to accept vs pay down technical debt

**Matrix**:
```
                    Impact on Future Work
                  Low           High
Time Pressure
High          Accept debt    Accept + Plan paydown
              (ship it)      (ship, but schedule fix)

Low           Pay now        MUST pay now
              (clean it)     (architectural)
```

**Decision Rules**:
- **Accept debt**: Low impact, high pressure → ship with known issues
- **Accept + Plan paydown**: High impact, high pressure → ship but schedule refactor
- **Pay now**: Low impact, low pressure → fix while you're here
- **MUST pay now**: High impact, low pressure → delay ship to fix architecture

**Example**:
```
Situation: Hardcoded configuration vs config file system
- Impact on future: HIGH (every new config = code change)
- Time pressure: LOW (2-week buffer)
- Decision: MUST pay now (build config system before ship)
- Rationale: 8 hours now saves 2 hours per config × 20 configs = 40 hours saved
```

---

### Framework 3: Maintenance Cost Projection

**Purpose**: Estimate total cost of ownership over lifecycle

**Formula**:
```
Total Cost of Ownership (TCO) =
  Implementation Cost +
  Integration Cost +
  (Annual Maintenance Cost × Years) +
  Evolution Cost +
  Deprecation Cost

Where:
- Implementation Cost: Initial build time
- Integration Cost: Time to integrate smoothly
- Annual Maintenance Cost: From formula in Dimension 3
- Years: Expected lifecycle length
- Evolution Cost: Estimated cost of major updates
- Deprecation Cost: Migration to replacement
```

**Example Comparison**:
```
Option A: Use third-party library
- Implementation: 4 hours
- Integration: 8 hours (learning curve)
- Annual Maintenance: 20 hours (updates, breaking changes)
- Years: 3
- Evolution: 0 (library handles it)
- Deprecation: 40 hours (migrate off if abandoned)
TCO = 4 + 8 + (20×3) + 0 + 40 = 112 hours

Option B: Build custom
- Implementation: 20 hours
- Integration: 2 hours (we control it)
- Annual Maintenance: 4 hours (simple, stable)
- Years: 3
- Evolution: 8 hours (add features as needed)
- Deprecation: 0 (we own it)
TCO = 20 + 2 + (4×3) + 8 + 0 = 42 hours

Verdict: Build custom (62% cheaper over 3 years)
```

---

### Framework 4: Reversibility Assessment

**Purpose**: Decide based on how easily we can undo the decision

**Categories**:
```
1. Easily Reversible (hours to undo)
   - UI styling, copy changes, feature flags
   - Strategy: Decide fast, iterate
   - Example: Button color, text wording

2. Reversible with effort (days to undo)
   - Library choices, data formats, API contracts
   - Strategy: Moderate deliberation, plan migration path
   - Example: Choose auth library, JSON vs Protocol Buffers

3. Hard to reverse (weeks to undo)
   - Database schema, architecture patterns, core mechanics
   - Strategy: Deep analysis, validation before commit
   - Example: SQL vs NoSQL, monolith vs microservices

4. Irreversible (months to undo, or impossible)
   - Platform choice, core technology stack, data models users depend on
   - Strategy: Exhaustive analysis, prototype validation, staged rollout
   - Example: PWA vs Native, game engine, public API design
```

**Decision Rule**: Reversibility inversely correlates with required deliberation time.

**Example**:
```
Decision: Choose game engine

Reversibility: Category 4 (irreversible - entire game built on it)
Required Deliberation: Weeks of research, prototyping, validation
Approach:
- Build small prototypes in 3 engine candidates
- Test critical features in each
- Evaluate over 2-week period
- Choose with high confidence
Rationale: 40 hours upfront << 1000+ hours to migrate later
```

---

## Temporal Anti-Patterns

### Anti-Pattern 1: "Ship Now, Fix Later" (Permanent Tech Debt)

**Problem**: Accepting tech debt with no concrete paydown plan

**Symptom**:
```
"We'll refactor this after launch"
(6 months later: tech debt still there, 10 features built on top)
```

**Consequence**: Compounding debt, eventual system collapse or costly rewrite

**Fix**:
- If you accept debt, schedule paydown NOW (specific date, specific person)
- Or don't ship - some debt is too expensive

**Test**: "When exactly will we fix this?" If answer is vague, don't ship.

---

### Anti-Pattern 2: "Future-Proofing" (Premature Abstraction)

**Problem**: Building for imagined future requirements that never materialize

**Symptom**:
```
"We might need to support 10 different payment providers someday"
(Builds complex plugin system)
(2 years later: still only 1 payment provider)
```

**Consequence**: Wasted implementation time, unnecessary complexity

**Fix**: YAGNI (You Aren't Gonna Need It)
- Build for current + validated near-term requirements
- Build for change, but don't build the changes yet
- Example: Design clean interfaces, but implement only what's needed

**Test**: "Do we have a user asking for this? Do we have a business plan requiring this?" If no, don't build it.

---

### Anti-Pattern 3: "Analysis Paralysis" (Infinite Deliberation)

**Problem**: Over-analyzing reversible decisions

**Symptom**:
```
"Should the button be blue or green?"
(3 meetings, 8 hours of discussion)
```

**Consequence**: Wasted time, delayed value

**Fix**: Apply Framework 4 (Reversibility Assessment)
- Easily reversible → decide in minutes
- Hard to reverse → deliberate thoroughly
- Match deliberation time to reversal difficulty

**Test**: "How long would it take to undo this?" If answer is "hours", decide now.

---

### Anti-Pattern 4: "Sunk Cost Fallacy" (Throwing Good Time After Bad)

**Problem**: Continuing to invest in failing approach because of past investment

**Symptom**:
```
"We've already spent 40 hours on this library integration"
(Library is fundamentally incompatible)
"Let's spend 20 more hours making it work"
(Should cut losses and try different approach)
```

**Consequence**: Escalating investment in dead end

**Fix**: Evaluate based on future cost, not past cost
- Question: "Knowing what we know now, would we start this approach?"
- If no, stop immediately
- Past time is gone; only future time matters

**Test**: "If we started today, would we choose this approach?" If no, stop.

---

### Anti-Pattern 5: "Eternal Prototype" (Never Productionizing)

**Problem**: Leaving prototypes in production indefinitely

**Symptom**:
```
"This is just a quick hack for the demo"
(2 years later: 50% of users rely on it)
(Never refactored to production quality)
```

**Consequence**: Fragile system, embarrassing code, maintenance nightmare

**Fix**: Explicit lifecycle planning
- If prototype stays, schedule production refactor
- Or remove it after demo
- No middle ground - prototype OR production, not both

**Test**: "Is this still here in 6 months?" If yes, productionize it now.

---

## Temporal Decision Templates

### Template 1: Temporal Impact Assessment

```markdown
## Temporal Impact Assessment

### Decision
[What are we deciding?]

### Time Horizon Analysis

#### Present (Week 1)
- **Implementation Cost**: [X hours]
- **Immediate Value**: [What value is delivered?]
- **Upfront Risk**: [What could go wrong now?]

#### Near Future (Months 1-6)
- **Integration Cost**: [Learning curve, friction]
- **Maintenance Cost**: [Bug fixes, updates]
- **Evolution Opportunity**: [What does this enable?]

#### Far Future (Year 1+)
- **Annual Maintenance**: [Ongoing burden]
- **Evolution Constraint**: [What does this prevent?]
- **Deprecation Risk**: [Abandonment, obsolescence]

### Total Cost of Ownership
- **Implementation**: [X hours]
- **Maintenance (3 years)**: [Y hours/year × 3]
- **Evolution**: [Z hours]
- **Deprecation**: [D hours]
- **TCO**: [Total hours]

### Temporal Verdict
- [ ] Accept: TCO is acceptable
- [ ] Reject: TCO too high, seek alternative
- [ ] Defer: Validate assumptions first
```

---

### Template 2: Technical Debt Decision Matrix

```markdown
## Technical Debt Decision

### The Debt
[What shortcut are we considering?]

### Classification
- **Impact on Future Work**: [Low/High]
  - Rationale: [Why?]
- **Time Pressure**: [Low/High]
  - Deadline: [Date]
  - Buffer: [Time available]

### Matrix Result
[Accept / Accept + Plan / Pay Now / MUST Pay Now]

### Decision
- [ ] Accept debt (if Low Impact + High Pressure)
  - Document debt location: [File:Line]
  - Known limitation: [What breaks?]

- [ ] Accept + Plan paydown (if High Impact + High Pressure)
  - Ship date: [Date]
  - Paydown scheduled: [Date]
  - Assigned to: [Person]
  - Estimated paydown cost: [Hours]

- [ ] Pay now (if Low Impact + Low Pressure)
  - Fix immediately
  - Estimated cost: [Hours]

- [ ] MUST pay now (if High Impact + Low Pressure)
  - Delay ship to fix
  - Rationale: [Why this is architectural]
  - Estimated cost: [Hours]
  - Future savings: [Hours]

### Tracking
- Debt ID: [DEBT-001]
- Created: [Date]
- Resolved: [Date] or [Scheduled Date]
```

---

### Template 3: Reversibility Assessment

```markdown
## Reversibility Assessment

### Decision
[What are we deciding?]

### Reversal Difficulty
- [ ] Easily Reversible (hours)
- [ ] Reversible with Effort (days)
- [ ] Hard to Reverse (weeks)
- [ ] Irreversible (months/impossible)

### Rationale
[Why this reversal difficulty?]
- Dependencies created: [What depends on this?]
- Coupling introduced: [What tightly couples to this?]
- User-facing commitment: [Do users see/depend on this?]

### Appropriate Deliberation Time
- Easily Reversible: 15 minutes
- Reversible with Effort: 2-4 hours
- Hard to Reverse: 1-2 days
- Irreversible: 1-2 weeks

### Validation Strategy
[If hard/irreversible, how will we validate before committing?]
- [ ] Prototype
- [ ] Spike investigation
- [ ] User testing
- [ ] Expert consultation
- [ ] Staged rollout

### Decision Confidence
- Required: [Based on reversal difficulty]
- Actual: [Current confidence level]
- Gap: [If confidence < required, what's needed?]
```

---

## Integration with Other Layers

### Integration with Layer 5 (Mechanic Evolution)

**Layer 5** defines how mechanics evolve over time (phases, triggers).
**Layer 18** adds temporal cost/benefit analysis.

**Combined Usage**:
```
Layer 5: "This mechanic should evolve in 3 phases"
Layer 18: "Phase 2 costs 40 hours, delivers value at Month 3. ROI = 2.5x. Proceed."

Layer 5: "This mechanic can branch into A or B"
Layer 18: "Branch A: high maintenance burden (60 hrs/year). Branch B: low (10 hrs/year). Choose B."
```

---

### Integration with Layer 17 (Contextual Adaptation)

**Layer 17** sets reasoning depth based on complexity/time.
**Layer 18** provides time-based decision frameworks.

**Combined Usage**:
```
Layer 17: "Tight deadline → Speed weighting"
Layer 18: "Time-to-Value Analysis → MVP in Week 1, defer non-critical to Week 4"

Layer 17: "Complex project → Deep weighting"
Layer 18: "TCO analysis → Build custom (cheaper long-term) despite higher upfront cost"
```

---

### Integration with Layer 16 (Meta-Cognitive Reasoning)

**Layer 16** validates reasoning quality.
**Layer 18** is often part of what Layer 16 validates.

**Combined Usage**:
```
Layer 16 Bias Check: "Am I exhibiting present bias?"
Layer 18 Framework: "Did I analyze TCO, or just implementation cost?"

Layer 16 Decision Quality: "Information Completeness = 6/10 (missing maintenance cost)"
Layer 18 Template: "Apply Maintenance Cost Projection formula"
```

---

### Integration with Layer 10 (Asset Intelligence)

**Layer 10** optimizes asset reuse.
**Layer 18** quantifies time savings.

**Combined Usage**:
```
Layer 10: "Reuse existing sprite"
Layer 18: "Saves 2 hours now + 0.5 hours/year maintenance = 3.5 hours over 3 years"
```

---

## Practical Examples

### Example 1: Authentication System Choice

**Decision**: Build custom auth vs use Auth0

**Temporal Analysis**:

**Option A: Auth0 (Third-Party)**
- Present (Week 1):
  - Implementation: 8 hours (integration, configuration)
  - Value: Full-featured auth immediately
- Near Future (Months 1-6):
  - Integration: 4 hours (team learns quirks)
  - Maintenance: 8 hours (library updates, breaking changes)
- Far Future (Year 1-3):
  - Annual Maintenance: 16 hours/year (updates, API changes)
  - Dependency Risk: If Auth0 acquired/shut down → 80 hours migration
  - Cost: Monthly SaaS fee × 36 months
- **TCO**: 8 + 4 + 8 + (16×3) + 80 + SaaS = 148 hours + recurring cost

**Option B: Custom Auth**
- Present (Week 1-2):
  - Implementation: 40 hours (build from scratch)
  - Value: Basic auth (no OAuth, 2FA initially)
- Near Future (Months 1-6):
  - Integration: 2 hours (we control it)
  - Maintenance: 4 hours (simple, well-understood)
- Far Future (Year 1-3):
  - Annual Maintenance: 6 hours/year (minimal, stable)
  - Evolution: 20 hours (add OAuth, 2FA when needed)
  - No dependency risk
- **TCO**: 40 + 2 + 4 + (6×3) + 20 = 84 hours

**Temporal Verdict**: Build custom
- Rationale: 84 < 148 + recurring cost
- Trade-off: Less features upfront, but cheaper long-term
- Reversibility: Hard to reverse (choose carefully)
- Confidence Required: High (prototyped both approaches)

---

### Example 2: Feature Flag System

**Decision**: When to build feature flag infrastructure?

**Present Context**:
- Currently: 5 developers, 1 feature in development
- Cost to build: 16 hours

**Temporal Analysis**:

**Option A: Build Now**
- Present: 16 hours upfront
- Near Future: 2 hours per feature to add flags (vs 0 without system)
- Far Future:
  - Benefits: Gradual rollouts, easy A/B tests, quick rollbacks
  - Cost saved: 1 rollback = 8 hours saved (vs hotfix deployment)

**Option B: Wait Until Needed**
- Present: 0 hours
- Near Future:
  - 1st emergency rollback: 8 hours (painful hotfix)
  - 2nd emergency rollback: 8 hours (now we NEED flags)
  - Then build system: 16 hours (under pressure)
  - Total: 32 hours
- Far Future: Same benefits, but delayed

**Temporal Verdict**: Build now
- Rationale: 16 hours < likely 32 hours (emergency build)
- Trigger: Once you have >3 developers or >2 simultaneous features
- Reversibility: Easily reversible (can stop using flags)
- ROI: First prevented rollback pays for system

---

### Example 3: Refactoring Timing

**Decision**: When to refactor messy but working code?

**Scenario**: A 300-line function that works but is hard to understand

**Temporal Analysis**:

**Option A: Refactor Now**
- Cost: 8 hours (break into smaller functions, add tests)
- Benefit: Future changes easier

**Option B: Refactor When Next Touched**
- Cost: 0 hours now
- Benefit: Might never need to touch it

**Option C: Never Refactor**
- Cost: 0 hours
- Risk: Each future change takes 3x longer due to complexity

**Framework: "Rule of Three"**
```
1st touch: Write messy code (exploration)
2nd touch: Note the mess, but tolerate it
3rd touch: MUST refactor before making change
```

**Temporal Verdict**: Option B (refactor when next touched)
- Rationale: Unknown if we'll touch it again
- If we do touch it, we'll need to understand it anyway (refactor then)
- If we don't touch it, refactoring now = wasted time
- Exception: If this is core architecture (high-traffic code), refactor now

---

### Example 4: Library Version Upgrade

**Decision**: Upgrade library from v2 to v3 now, or wait?

**Context**:
- v2: Works fine, but approaching end-of-life (6 months)
- v3: Breaking changes, 20 hours to migrate

**Temporal Analysis**:

**Option A: Upgrade Now**
- Present: 20 hours migration
- Near Future: 0 hours (done)
- Far Future: Security updates, new features available

**Option B: Wait Until v2 End-of-Life**
- Present: 0 hours
- Near Future:
  - 2 hours/month dealing with deprecation warnings (×6 = 12 hours)
  - Risk: Security vulnerability in v2 = forced emergency upgrade
- Far Future: 20 hours migration (under time pressure)
- **Total**: 32+ hours

**Option C: Remove Dependency**
- Present: 30 hours (build custom replacement)
- Near Future: 2 hours (simple, we control it)
- Far Future: 3 hours/year maintenance
- **TCO (3 years)**: 30 + 2 + 9 = 41 hours

**Temporal Verdict**: Depends on library importance
- If library is core/complex: Option A (upgrade now) - 20 hours
- If library is simple/peripheral: Option C (remove dependency) - 41 hours but no future risk
- If library is temporary: Option B (wait and see) - might remove feature entirely

**Rule**: Upgrade major dependencies during "slow periods", not when under deadline pressure.

---

## Success Indicators

Layer 18 succeeds when:

- ✅ Decisions explicitly consider TCO, not just implementation cost
- ✅ Technical debt has concrete paydown plans (not vague "later")
- ✅ Time-to-value is optimized (MVP delivered fast)
- ✅ Reversibility drives deliberation time (hours on easy, weeks on hard)
- ✅ Maintenance costs are projected and tracked
- ✅ "Future-proofing" is challenged (YAGNI applied)
- ✅ Sunk cost fallacy is recognized and avoided
- ✅ Lifecycle planning is explicit (birth to deprecation)

**Metrics to Track**:
- **Accuracy of time estimates**: Did TCO projections match reality?
- **Tech debt paydown rate**: Are we paying down debt as planned?
- **Time-to-value actuals**: Are we delivering value when predicted?
- **Refactor timing**: Are we following "Rule of Three"?

---

## When to Use Layer 18

### Always Use For
- **Architecture decisions** (irreversible, high TCO impact)
- **Library/dependency choices** (maintenance burden)
- **Core mechanic design** (evolution over years)
- **Technical debt decisions** (explicit tradeoff needed)

### Use When Relevant For
- **Feature prioritization** (time-to-value optimization)
- **Refactoring decisions** (when to invest time)
- **Scope decisions** (MVP vs full-featured)

### Don't Use For
- **Trivial decisions** (reversible in hours)
- **Exploratory prototypes** (learning, not building)
- **One-off scripts** (throw-away code)

**Rule of Thumb**: If decision affects >1 month of time, use Layer 18.

---

## Summary

**Layer 18: Temporal Reasoning** ensures decisions account for the full lifecycle - present, near future, far future - not just immediate cost.

**Key Principle**: Time is a dimension. Optimize across it, not just within the present moment.

**Integration**: Use for architecture, dependencies, technical debt, and evolution planning. Complements Layer 5 (evolution stages) and Layer 17 (time constraints).

**Ultimate Goal**: Minimize total cost of ownership over the system's lifetime.

---

**Remember**: The cheapest option now is rarely the cheapest option over time.

**Every decision creates a future. Layer 18 helps you choose which future to create.**
