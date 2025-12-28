# LAYER 4 — PROMPT PROTOCOL

**How to Talk to Cursor Effectively**

Cursor thrives on constraints + deltas. This document shows how to communicate with Cursor for optimal results.

---

## Constraint-First Communication

**Always provide:**
1. **What** you want changed
2. **Where** it should change
3. **Why** you want it changed
4. **Constraints** (what must not change)
5. **Delta** (what specifically is different)

---

## Bad vs Good Examples

### ❌ Bad: Vague Request

```
Make the fusion UI cooler
```

**Problems:**
- No specific target
- No constraints
- "Cooler" is subjective
- No clear success criteria

### ✅ Good: Constrained Request

```
Refine the Fusion Lab UI to better reflect instability and alchemical creation.
Follow UI_CANON.
Do not change layout structure.
Add only subtle motion and feedback.
```

**Why it works:**
- Specific target (Fusion Lab UI)
- Clear intent (instability + alchemy feeling)
- References UI_CANON (provides context)
- Constraints stated (layout unchanged)
- Scope limited (subtle changes only)

---

## Elite Prompt Structure

### Format

```
[INTENT] [TARGET] [GOAL]
[CONSTRAINTS]
[DELTA] [SPECIFICS]
```

### Example: Elite Prompt

```
Add a low-frequency idle pulse to fusion slots that increases with compatibility score.
Opacity < 0.3.
No color changes.
Only affects empty slots waiting for pet selection.
Use UI_CANON timing for idle animations.
```

**Why it's elite:**
- ✅ Specific target (fusion slots)
- ✅ Clear behavior (idle pulse)
- ✅ Variable behavior (based on compatibility)
- ✅ Hard constraints (opacity limit, no color)
- ✅ Scope boundary (only empty slots)
- ✅ References standards (UI_CANON)

---

## Delta-Focused Instructions

**Delta = What Changed, Not What Exists**

### ❌ Bad: Describing Current State

```
The fusion UI has two pet slots and two stone slots. Make them glow when hovered.
```

**Problem:** Describes what exists, not what should change

### ✅ Good: Focus on Change

```
Add hover glow effect to fusion pet/stone slots.
Glow intensity should match rarity of selected item.
Use UI_CANON color philosophy for glow colors.
```

**Why it works:**
- States the change clearly
- Adds specificity (rarity-based intensity)
- References design system (UI_CANON)

---

## Scope Control Guidelines

### One Change at a Time

**❌ Bad:**
```
Redesign the fusion UI, add animations, update colors, and improve mobile layout.
```

**✅ Good:**
```
Add subtle breathing animation to fusion pet slots.
Animation should be low-frequency (2s cycle).
Only animate when slot is filled.
Reference UI_CANON motionLaw.idle for timing.
```

### When to Batch

Only batch changes when:
- They're tightly coupled (e.g., adding hover state requires hover styles + hover animation)
- They're all on the same component
- They serve the same goal

**Example of acceptable batching:**
```
Add hover state to pet cards:
- Slight scale transform (1.02x)
- Enhanced shadow
- Border glow using pet's rarity color
All transitions 200ms ease-out.
```

---

## Communication Patterns

### Pattern 1: Enhancement Request

```
Enhance [COMPONENT] to better communicate [EMOTION/CONCEPT].
Follow [DESIGN_SYSTEM].
Constraints: [WHAT_MUST_NOT_CHANGE].
Change scope: [SPECIFIC_CHANGES_ONLY].
```

### Pattern 2: Bug Fix + Enhancement

```
Fix [ISSUE] in [LOCATION].
While fixing, improve [ASPECT] to align with [DESIGN_PRINCIPLE].
Do not modify [LOCKED_SYSTEM].
```

### Pattern 3: Refinement Request

```
Refine [COMPONENT] to improve [QUALITY_METRIC].
Use [DESIGN_REFERENCE] as guide.
Keep existing [ARCHITECTURE/FUNCTIONALITY].
Only modify [PRESENTATION_LAYER].
```

---

## Advanced: Multi-Step Requests

When requesting multiple related changes:

```
Step 1: [First change] - [Why]
Step 2: [Second change] - [Why] (only if Step 1 succeeds)
Step 3: [Third change] - [Why] (only if Step 2 succeeds)

After each step, pause for confirmation before proceeding.
```

---

## What NOT to Say

### ❌ Don't Use Vague Adjectives
- "Make it better"
- "Improve the UX"
- "Polish it up"
- "Make it more intuitive"

### ❌ Don't Request Multiple Unrelated Changes
- "Fix the fusion UI and also update the battle screen"

### ❌ Don't Assume Context
- "Change that thing we talked about"
- "Make it like the other one"

### ❌ Don't Request System Changes Without Explicit Permission
- "Add leveling system"
- "Let players undo fusion"

---

## What TO Say

### ✅ Use Specific, Measurable Language
- "Increase button padding from 10px to 12px"
- "Add 200ms fade-in animation to modal"
- "Change fusion slot border color to match pet rarity"

### ✅ Reference Design Systems
- "Follow UI_CANON color philosophy"
- "Use layer-3-ui-states.ts sentiment system"
- "Reference VISUAL_STYLE_GUIDE.md for typography"

### ✅ State Constraints Explicitly
- "Do not modify fusion logic"
- "Keep existing layout structure"
- "Only change presentation, not behavior"

### ✅ Provide Context When Needed
- "The fusion UI feels static. Add subtle idle animations to make it feel alive (see layer-2-visual-analogies.md)"
- "Players don't understand fusion outcomes. Add clearer feedback without revealing exact results (preserve mystery per layer-0-project-directive.md)"

---

## Example Prompts by Use Case

### UI Polish
```
Add subtle breathing animation to pet card sprites.
Animation: 2s cycle, vertical translation ±2px.
Only when card is in collection view (not battle).
Reference UI_CANON motionLaw.idle.
```

### UX Improvement
```
Add visual feedback when fusion slots are compatible.
Show subtle connection line between compatible pets.
Line color: cyan, opacity 0.4.
Only show when both pet slots are filled.
Do not change fusion compatibility logic.
```

### Visual Enhancement
```
Enhance fusion reveal animation to feel more dramatic.
Add particle burst effect on reveal.
Particles: cyan and magenta, fade out over 500ms.
Keep existing reveal timing (500ms).
Reference UI_CANON colorPhilosophy.fusion.
```

### Accessibility
```
Improve button contrast for better accessibility.
Ensure all buttons meet 4.5:1 contrast ratio.
Use UI_CANON typography.rules.contrastRatio.
Do not change button functionality or layout.
```

---

## Advanced Techniques

### ReAct (Reasoning + Acting) Pattern

For complex requests, AI will structure responses using the ReAct pattern, interleaving reasoning steps with actions.

**How it works:**
1. **Thought:** Reasoning about what needs to be done
2. **Action:** Specific action to take (read file, analyze code, etc.)
3. **Observation:** Result of the action
4. **Thought:** Next reasoning step based on observation
5. **Action:** Next action
... (repeats until complete)

**Example:**

```
**Thought:** User wants to add breathing animation to fusion slots. I need to check UI_CANON for idle animation rules, then find the fusion slot component.

**Action:** Read layer-1-ui-canon.ts to understand idle animation specifications

**Observation:** UI_CANON specifies idle animations should be "slow breathing", 2s duration, low frequency. Rationale: "Elements should feel alive, not static."

**Thought:** Now I need to find the FusionLab component to see where slots are rendered.

**Action:** Locate and read FusionLab component file

**Observation:** Fusion slots are in FusionLab.tsx, using CSS modules. No existing idle animations.

**Action:** Add CSS animation following UI_CANON specifications...
```

**When to expect ReAct:**
- Complex requests requiring multiple steps
- When codebase exploration is needed
- When multiple layers need to be consulted
- For architectural or multi-component changes

**Benefits:**
- Transparent reasoning process
- Shows how AI arrives at decisions
- Makes it easier to catch errors early
- Provides context for each action

---

### Few-Shot Learning

Providing examples helps AI understand desired patterns and apply them consistently.

**How to provide examples:**

```
I want you to style buttons consistently. Here are examples of the style I like:

Example 1:
- Primary button: Cyan background (#00ffff), white text, 12px padding, rounded corners
- Used in: Fusion Lab "Fuse" button

Example 2:
- Secondary button: Transparent background, cyan border (#00ffff), cyan text, 10px padding
- Used in: Collection view "Details" buttons

Now apply this style to the dungeon selection buttons.
```

**What AI learns from examples:**
- Pattern recognition (what makes examples successful)
- Styling conventions
- Component structure patterns
- Naming conventions
- Code organization

**Best practices for examples:**
- Provide 2-3 clear examples (few-shot, not many-shot)
- Examples should be similar to your request
- Show both what to do and what not to do if helpful
- Reference existing code patterns when possible

**Example with pattern recognition:**

```
User: "Make the dungeon UI feel like entering ancient ruins (similar to how fusion lab feels like alchemy)"

**Pattern Recognition:**
- Fusion lab uses: Ancient machine aesthetic, unstable energy, alchemical diagrams
- Dungeon should use: Ruins aesthetic, weathered stone, discovery atmosphere
- Both should: Feel immersive, communicate narrative, use appropriate visual metaphors

**Application:**
- Reference UILORE.dungeon for narrative context
- Use darker, earthier colors (contrast with fusion's violet/cyan)
- Add subtle particle effects suggesting dust/decay
- Emphasize depth and mystery (like ruins)
```

---

### Self-Consistency Checking

AI will perform self-consistency checks before finalizing any change, ensuring alignment with all relevant layers.

**Required checks (always performed):**
1. ✅ Does this align with Layer 0 (project directive)?
2. ✅ Does this respect Layer 7 (system locks)?
3. ✅ Does this preserve project identity?

**Additional checks (for moderate+ complexity):**
4. ✅ Does this follow Layer 1 (UI canon)?
5. ✅ Does this match Layer 2 (visual analogies)?
6. ✅ Is this consistent with similar code in codebase?
7. ✅ Would this pass Layer 8 (polish checklist)?

**What to expect:**
- AI will explicitly state consistency check results
- Critical failures will halt execution
- Non-critical issues will be noted with justification
- All checks must pass before code is finalized

**Example output:**

```
## Self-Consistency Checks

✅ Layer 0 (Project Directive): PASS - Preserves fusion-only progression, no leveling added
✅ Layer 7 (System Lock): PASS - No fusion logic modified, only UI presentation
✅ Layer 1 (UI Canon): PASS - Colors follow colorPhilosophy, motion follows motionLaw
✅ Layer 8 (Polish Checklist): PASS - All checklist items verified
⚠️ Layer 2 (Visual Analogies): NOTE - Could enhance "alchemy feeling" further, but current approach acceptable

All critical checks passed. Proceeding with implementation.
```

**If checks fail:**
- AI will halt and explain which checks failed
- Will propose alternative approaches that pass checks
- Will ask for clarification if constraints conflict

---

### Confidence Acknowledgment

AI will assess confidence levels and acknowledge uncertainty when present.

**Confidence levels:**

**HIGH (0.8-1.0):**
- All factors well understood
- Clear requirements
- Good constraint alignment
- Strong codebase precedent
- Proceeds with confidence

**MEDIUM (0.6-0.79):**
- Some assumptions needed
- Minor ambiguity in requirements
- Good alignment but some edge cases
- Proceeds with explicit assumptions stated

**LOW (< 0.6):**
- Significant uncertainty
- Vague or conflicting requirements
- Must ask for clarification before proceeding

**What to expect:**

```
Confidence: MEDIUM (0.72)

Proceeding with assumptions:
- Assuming animation should use CSS (not JavaScript) based on existing patterns
- Assuming "breathing" means opacity pulse (not scale) based on UI_CANON motionLaw.idle
- If these assumptions are incorrect, please clarify.
```

**When confidence is low:**

```
Confidence: LOW (0.45)

Need clarification on:
1. Should the animation be continuous or only on hover?
2. Should all slots animate or only empty ones?
3. Do you want the same animation as pet cards, or different?

Please provide these details before I proceed.
```

**Benefits:**
- Prevents guessing when uncertain
- Makes assumptions explicit
- Allows course correction early
- Improves final output quality

---

## Integration with Advanced Layers

### Layer 9 (Reasoning Protocol)

For complex requests, Layer 9 provides structured reasoning:
- Chain-of-Thought for step-by-step transparency
- Tree-of-Thought for evaluating multiple approaches
- Self-consistency checks against all layers

**You don't need to reference Layer 9 explicitly** - it activates automatically for moderate+ complexity requests.

### Layer 12 (Meta-Cognitive Protocols)

Layer 12 performs pre-decision auditing:
- Assesses risk before proceeding
- Acknowledges uncertainty
- Generates alternative approaches

**You'll see this in action when:**
- AI pauses to assess before implementing
- Multiple approaches are presented
- Risk assessment is included in reasoning

### Layer 14 (Meta-Prompt System)

Layer 14 orchestrates all layers automatically. You'll see:
- Which layers are activated for your request
- Reasoning traces for complex changes
- Quality gate results

---

**END OF LAYER 4**

