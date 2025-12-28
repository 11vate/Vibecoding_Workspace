# LAYER 8 — POLISH CHECKLIST

**Self-Audit Checklist for AI and Developers**

Use this checklist before finalizing any UI/UX change. Every item should pass.

---

## Visual Hierarchy Verification

### 1-Second Rule

**Question:** Can a user understand what's important within 1 second of viewing this screen/component?

**Checklist:**
- ✅ Primary action is immediately visible
- ✅ Information hierarchy is clear (primary → secondary → tertiary)
- ✅ Visual weight guides the eye naturally
- ✅ No competing focal points
- ✅ Critical information stands out

**If fails:** Adjust contrast, size, positioning, or color to improve hierarchy.

---

## Motion Meaning Check

**Question:** Does every animation communicate meaning or provide feedback?

**Checklist:**
- ✅ Animation serves a purpose (not decorative)
- ✅ Motion reinforces state changes
- ✅ Timing feels appropriate for the action
- ✅ Easing matches the interaction type
- ✅ No gratuitous or distracting animations

**If fails:** Remove decorative motion or adjust to serve a purpose.

---

## Cognitive Load Assessment

**Question:** Is the information clear without requiring explanation?

**Checklist:**
- ✅ Visual language is consistent
- ✅ Icons/metaphors are intuitive
- ✅ Labels are clear and concise
- ✅ Grouping and organization is logical
- ✅ No information overload
- ✅ Context is provided where needed

**If fails:** Simplify, reorganize, or add subtle guidance (not explanations).

---

## Mystery Preservation Check

**Question:** Does this maintain intrigue and discovery while being clear?

**Checklist:**
- ✅ Does not reveal exact outcomes prematurely
- ✅ Hints at possibilities without spoiling
- ✅ Maintains "what will happen?" anticipation
- ✅ Preserves discovery moments
- ✅ Does not over-explain mechanics

**If fails:** Reduce specificity, remove spoilers, maintain ambiguity where appropriate.

---

## Aliveness Verification

**Question:** Does this feel responsive and alive, not static?

**Checklist:**
- ✅ Reacts to user input immediately
- ✅ Provides feedback for all interactions
- ✅ Idle states have subtle animation (where appropriate)
- ✅ State changes are visible
- ✅ Feels responsive, not sluggish

**If fails:** Add feedback, improve responsiveness, add subtle idle animations.

---

## Accessibility Verification

**Question:** Is this accessible to all users?

**Checklist:**
- ✅ Text meets 4.5:1 contrast ratio minimum
- ✅ Touch targets are at least 44×44px
- ✅ Keyboard navigation works
- ✅ Screen reader friendly (where applicable)
- ✅ Text scales up to 200% without breaking layout
- ✅ Color is not the only indicator

**If fails:** Improve contrast, increase touch targets, add keyboard support, improve semantics.

---

## Performance Check

**Question:** Does this perform well on target devices?

**Checklist:**
- ✅ Animations run at 60fps
- ✅ No layout thrashing
- ✅ GPU-accelerated properties used for animations
- ✅ Images are optimized
- ✅ No unnecessary re-renders
- ✅ Works on mobile devices

**If fails:** Optimize animations, reduce complexity, use performance best practices.

---

## Consistency Check

**Question:** Is this consistent with the rest of the application?

**Checklist:**
- ✅ Follows UI_CANON (Layer 1)
- ✅ Uses established patterns
- ✅ Matches existing visual language
- ✅ Consistent with similar components
- ✅ Follows spacing and typography rules

**If fails:** Reference UI_CANON, align with existing patterns, use design system.

---

## Identity Reinforcement

**Question:** Does this reinforce the game's unique identity?

**Checklist:**
- ✅ Feels like the game, not generic UI
- ✅ Reinforces core themes (alchemy, creation, uniqueness)
- ✅ Matches the game's tone
- ✅ Uses appropriate visual metaphors
- ✅ Avoids generic corporate design

**If fails:** Reference visual analogies (Layer 2), strengthen thematic connections, avoid generic patterns.

---

## Constraint Compliance

**Question:** Does this respect all project constraints?

**Checklist:**
- ✅ Does not modify locked systems (Layer 7)
- ✅ Follows project directive (Layer 0)
- ✅ Preserves player agency
- ✅ Maintains mystery where appropriate
- ✅ Reinforces "creation, not progression"

**If fails:** Review Layer 0 and Layer 7, adjust to respect constraints.

---

## Before-Commit Verification

Before committing any change, verify:

1. ✅ All checklist items pass
2. ✅ Change is focused and testable
3. ✅ No scope creep or unrelated changes
4. ✅ Documentation updated if needed
5. ✅ Tested on target devices/browsers
6. ✅ No console errors or warnings
7. ✅ TypeScript/types are correct
8. ✅ Follows coding standards

---

## Quick Reference

**Use this quick checklist for rapid validation:**

- [ ] Clear hierarchy (1 second rule)
- [ ] Motion has meaning
- [ ] Low cognitive load
- [ ] Mystery preserved
- [ ] Feels alive
- [ ] Accessible
- [ ] Performant
- [ ] Consistent
- [ ] Reinforces identity
- [ ] Respects constraints

**All items must pass before finalizing.**

---

**END OF LAYER 8**

