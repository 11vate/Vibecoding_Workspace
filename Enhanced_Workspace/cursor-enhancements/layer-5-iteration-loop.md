# LAYER 5 — ITERATION LOOP

**Micro-Iteration Methodology**

This protocol prevents scope explosion and ensures focused, high-quality changes.

---

## The Micro-Iteration Loop

### Core Principle

**One screen.  
One goal.  
One change.  
Test.  
Repeat.**

---

## The Loop Structure

```
1. IDENTIFY target screen/component
2. DEFINE single goal (what emotion/clarity should improve)
3. IMPLEMENT smallest change that achieves goal
4. TEST and verify goal is met
5. REFINE if needed (tighten timing, reduce excess)
6. VALIDATE against polish checklist
7. REPEAT with next goal
```

---

## Why Micro-Iterations Work

### Prevents Scope Explosion

**❌ Bad: Batch Approach**
```
"Improve the entire fusion experience"
→ Redesigns layout, adds animations, changes colors, refactors code
→ Too many changes to evaluate
→ Hard to rollback if something feels wrong
→ Cannot isolate what caused improvement/deterioration
```

**✅ Good: Micro-Iteration**
```
Goal 1: "Make fusion slots feel alive"
→ Add subtle breathing animation (2s cycle)
→ Test: Does it feel alive? Yes.
→ Done. Move to next goal.

Goal 2: "Improve compatibility feedback"
→ Add connection line between compatible pets
→ Test: Is compatibility clearer? Yes.
→ Done. Move to next goal.
```

### Enables Continuous Validation

After each change:
- **Does this improve clarity?**
- **Does this reduce cognitive load?**
- **Does this preserve mystery?**
- **Does this feel alive?**

If any answer is "no," refine or revert.

---

## Example Iteration Sequence

### Scenario: Improving Fusion Lab UI

#### Iteration 1: Add Life to Empty Slots

**Goal:** Make empty fusion slots feel alive, not dead

**Change:** Add subtle pulse animation to empty slots
- Duration: 2s cycle
- Effect: Opacity pulse 0.3 → 0.5
- Color: Cyan, very subtle

**Test:** Do slots feel alive? ✅ Yes

**Refine:** Reduce pulse amplitude (0.3 → 0.4) to be more subtle

**Result:** Empty slots now have presence

---

#### Iteration 2: Improve Filled Slot Feedback

**Goal:** When slot is filled, celebrate the selection

**Change:** Add brief scale animation (1.0 → 1.05 → 1.0) on pet selection
- Duration: 300ms
- Easing: ease-out

**Test:** Does selection feel good? ✅ Yes

**Refine:** None needed

**Result:** Selection feels intentional and rewarding

---

#### Iteration 3: Add Compatibility Indicator

**Goal:** Show compatibility without revealing exact outcome

**Change:** Add subtle glow to compatible pet pairs
- Color: Cyan, opacity 0.3
- Only when both slots filled
- No explicit "compatibility score" number

**Test:** Is compatibility clear without over-explaining? ✅ Yes

**Refine:** Reduce opacity to 0.2 for more subtlety

**Result:** Compatibility is communicated without removing mystery

---

#### Iteration 4: Enhance Fusion Button State

**Goal:** Make fusion button feel weighty and significant

**Change:** 
- Increase button size slightly when ready
- Add subtle glow pulse
- Disable state: reduce opacity and remove pulse

**Test:** Does button communicate readiness? ✅ Yes

**Refine:** Tighten pulse timing (1.5s → 1.2s)

**Result:** Fusion action feels significant and intentional

---

#### Iteration 5: Add Fusion Process Feedback

**Goal:** During fusion, show process is happening (instability state)

**Change:** Add non-linear pulse to fusion button and slots
- Duration: 500ms irregular cycle
- Color: Violet (unstable energy)
- Intensity: 0.6

**Test:** Does it feel unstable and active? ✅ Yes

**Refine:** Make pulse more irregular (vary timing ±100ms)

**Result:** Fusion process feels alive and unstable

---

### Analysis of This Sequence

**Total changes:** 5 focused iterations  
**Time per iteration:** ~10-15 minutes  
**Total time:** ~1 hour  
**Result:** Significantly improved fusion experience

**Why it worked:**
- Each change was isolated and testable
- Goals were specific and measurable
- Refinements were small and surgical
- No scope explosion
- Each iteration built on previous success

---

## When to Batch vs Isolate

### ✅ Isolate When:
- Changes affect different components
- Changes serve different goals
- You're not sure what will work
- Changes are experimental

### ✅ Batch When:
- Changes are tightly coupled (hover requires style + animation)
- Changes are all in one component
- Changes serve the same goal
- Previous iteration validated the approach

**Rule of thumb:** When in doubt, isolate.

---

## The Test-Refine Cycle

After each implementation:

### Test Phase

1. **Visual test:** Does it look right?
2. **Feeling test:** Does it feel right? (ask yourself)
3. **Clarity test:** Is it clearer?
4. **Mystery test:** Does it preserve intrigue?
5. **Performance test:** Does it run smoothly?

### Refine Phase

If any test fails:

1. **Identify the issue:** What specifically feels wrong?
2. **Determine refinement:** What small change fixes it?
3. **Apply refinement:** Make the adjustment
4. **Re-test:** Does it pass now?

### Refinement Examples

**Too subtle:** Increase intensity/opacity by 0.1-0.2  
**Too aggressive:** Reduce intensity/opacity by 0.1-0.2  
**Too fast:** Increase duration by 50-100ms  
**Too slow:** Decrease duration by 50-100ms  
**Timing feels off:** Adjust easing function  
**Color feels wrong:** Reference UI_CANON and adjust

---

## Preventing Scope Explosion

### Red Flags (Stop and Isolate)

- "While I'm at it, I'll also..."
- "This would be a good time to..."
- "I should probably also fix..."
- Change affects more than one component
- Change serves more than one goal

### Green Flags (Safe to Proceed)

- Change is focused on single component
- Change serves single, clear goal
- Change is small and testable
- Previous iterations validated approach

---

## Integration with Other Layers

### Layer 4 (Prompt Protocol)
- Each iteration should use constraint-first prompts
- State goal, constraints, and delta clearly

### Layer 8 (Polish Checklist)
- After each iteration, validate against polish checklist
- Don't proceed to next iteration if current fails checklist

### Layer 3 (UI States)
- Each iteration should consider UI sentiment
- Changes should reinforce appropriate sentiment

---

## Best Practices

1. **Start with the smallest possible change**
2. **Test immediately after implementation**
3. **Refine before moving to next iteration**
4. **Document what worked and why**
5. **Don't skip testing step**
6. **Validate against polish checklist**
7. **Celebrate small wins**

---

## Advanced: Tree-of-Thought Integration

For iterations where multiple valid approaches exist, use Tree-of-Thought (ToT) to evaluate options before committing.

### When to Use ToT

Use Tree-of-Thought when:
- Multiple valid approaches exist
- Uncertainty about which approach is best
- Complex iteration with tradeoffs
- Request explicitly asks for options

### ToT Process

**Step 1: Generate Paths**
Generate 2-3 distinct approaches to the iteration goal:

```
Path A: [Approach 1 description]
Path B: [Approach 2 description]
Path C: [Approach 3 description]
```

**Step 2: Evaluate Each Path**
Score each path on:
- Constraint alignment (0-1) - Does it respect Layer 0 and Layer 7?
- Risk (0-1, lower is better) - Risk of unintended consequences
- Complexity (0-1, lower is better) - Implementation complexity
- Quality potential (0-1) - Expected quality/impact

**Step 3: Compare and Select**
- Compare paths side-by-side
- Present pros/cons for each
- Select highest-scoring path OR present top 2-3 if ties (within 0.1 score difference)
- Explicitly explain why this path was chosen

**Example:**

```
Goal: Add visual feedback when fusion slots are compatible

Path A: Connection line between slots
  Scores: constraint=0.9, risk=0.2, complexity=0.3, quality=0.8
  Overall: 0.78
  Pros: Clear visual communication, simple implementation
  Cons: Might feel cluttered with multiple compatible pairs

Path B: Glow effect on compatible pets
  Scores: constraint=0.9, risk=0.1, complexity=0.2, quality=0.7
  Overall: 0.76
  Pros: Subtle, non-intrusive, easy to implement
  Cons: Less explicit than connection line

Path C: Animated compatibility indicator icon
  Scores: constraint=0.9, risk=0.3, complexity=0.5, quality=0.9
  Overall: 0.74
  Pros: Very clear, can show additional info
  Cons: More complex, might be too explicit

Selected: Path A (connection line) - Best balance of clarity and simplicity
```

### Integration with Reasoning Protocol

ToT in iterations integrates with Layer 9 (Reasoning Protocol):
- Use same scoring framework
- Reference constraint checks from Layer 9
- Feed evaluation results back to reasoning trace

---

## Reflection Protocol

After each iteration, perform reflection to learn and improve.

### Post-Iteration Reflection Questions

1. **What worked well?**
   - What aspects of the change succeeded?
   - What patterns or approaches were effective?
   - What made this iteration successful?

2. **What could be improved?**
   - What didn't work as expected?
   - What could have been done better?
   - What edge cases were missed?

3. **What did I learn?**
   - New patterns discovered?
   - Insights about the codebase?
   - Better approaches for similar problems?
   - User preferences or feedback patterns?

4. **Would I approach this differently next time?**
   - Different approach if starting over?
   - Earlier validation steps?
   - Different tools or techniques?

### Reflection Output

Store reflections for:
- Learning patterns (feed to Layer 10 - Adaptive Learning)
- Future reference for similar iterations
- Improving iteration planning
- Building knowledge base

**Example Reflection:**

```
Iteration: Add breathing animation to fusion slots

What worked well:
- Subtle opacity pulse achieved "alive" feeling
- 2s cycle timing felt natural
- Very low performance impact

What could be improved:
- Initial opacity range (0.3-0.5) was too subtle
- Could have tested with different timing first

What did I learn:
- UI_CANON motionLaw.idle specifications work well
- Users prefer subtle over dramatic for idle animations
- Opacity animations less noticeable than scale for idle states

Would I approach differently:
- Start with slightly larger opacity range, refine down
- Test with users earlier in process
```

---

## Learning Integration (Layer 10)

Feed iteration insights to Layer 10 (Adaptive Learning) to improve future iterations.

### What to Feed to Learning System

1. **Successful Patterns**
   - Approaches that worked well
   - Patterns that achieved goals efficiently
   - User-approved changes

2. **Iteration Metrics**
   - Number of refinements needed
   - Time to completion
   - User satisfaction (if available)

3. **Context Patterns**
   - When certain approaches work best
   - Context that predicts success
   - Patterns that match user preferences

### How Learning Improves Iterations

Layer 10 will:
- Suggest patterns from successful past iterations
- Warn about approaches that previously failed
- Recommend techniques based on context
- Adapt to user preferences over time

**Example:**

```
Next iteration request: "Add animation to pet cards"

Learning system suggests:
- Past success with opacity animations for idle states
- User preference for subtle animations (2s cycles)
- Pattern: Use UI_CANON motionLaw.idle as starting point
- Avoid: Scale animations for idle (users found distracting)

Apply these insights to iteration planning.
```

---

## Confidence Tracking

Track confidence levels across iterations to identify uncertainty and improve decision-making.

### Confidence Assessment

For each iteration, assess confidence on:
- **Requirement clarity** (0-1) - How clear is the goal?
- **Approach validity** (0-1) - Is this the right approach?
- **Implementation certainty** (0-1) - Do I know how to implement this?
- **Success likelihood** (0-1) - Will this achieve the goal?

### Confidence Levels

**High Confidence (0.8-1.0):**
- Clear goal and approach
- Similar successful patterns exist
- Implementation is straightforward
- Proceed with confidence

**Medium Confidence (0.6-0.79):**
- Goal clear but some uncertainty about approach
- Some similar patterns but need adaptation
- Implementation has some unknowns
- Proceed with explicit assumptions

**Low Confidence (< 0.6):**
- Unclear goal or approach
- No clear precedent
- Implementation uncertain
- Should ask for clarification or test first

### Tracking Confidence Across Iterations

- Note confidence at start of iteration
- Track how confidence changes during iteration
- Record final confidence after completion
- Use patterns to improve future confidence assessment

**Example Confidence Tracking:**

```
Iteration 1: Add breathing animation
  Start: 0.85 (high - clear pattern exists)
  During: 0.80 (slight uncertainty about opacity range)
  End: 0.90 (refined successfully)

Iteration 2: Improve compatibility feedback
  Start: 0.65 (medium - multiple valid approaches)
  During: 0.75 (ToT helped clarify best approach)
  End: 0.85 (selected path worked well)

Iteration 3: Enhance fusion reveal
  Start: 0.50 (low - unclear what "enhance" means)
  Action: Asked for clarification
  After clarification: 0.80 (high - now clear)
```

---

## Integration with Other Layers

### Layer 9 (Reasoning Protocol)

- Use complexity assessment to determine if ToT needed
- Apply same scoring framework for path evaluation
- Reference constraint checks from reasoning protocol
- Feed iteration results back to reasoning trace

### Layer 10 (Adaptive Learning)

- Feed successful patterns to learning system
- Apply learned patterns to new iterations
- Track metrics for pattern effectiveness
- Adapt based on user feedback

### Layer 8 (Polish Checklist)

- Validate each iteration against polish checklist
- Don't proceed to next iteration if current fails checklist
- Use checklist to guide refinement
- Ensure all iterations contribute to overall quality

### Layer 12 (Meta-Cognitive Protocols)

- Use pre-iteration audit for complex iterations
- Perform post-iteration reflection
- Assess risk before starting iteration
- Learn from reflection results

---

**END OF LAYER 5**

