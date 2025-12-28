# DESIGN SYSTEM DOCUMENTATION

**Comprehensive design system reference for PixelPets Reborn**

This document serves as the primary reference for the design system, tying together all design layers (1-3, 15-20) and providing usage guidelines for consistent, high-quality design implementation.

---

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Design Tokens](#design-tokens)
4. [Component Patterns](#component-patterns)
5. [Composition & Layout](#composition--layout)
6. [Aesthetic Evaluation](#aesthetic-evaluation)
7. [Visual Quality](#visual-quality)
8. [Design References](#design-references)
9. [Integration Guide](#integration-guide)
10. [Quality Standards](#quality-standards)

---

## Overview

The design system consists of multiple layers that work together to ensure consistent, high-quality design:

- **Layer 1 (UI Canon)**: Core aesthetic law and principles
- **Layer 2 (Visual Analogies)**: Emotional and experiential context
- **Layer 3 (UI States)**: State-driven theming system
- **Layer 15 (Design Tokens)**: Systematic design values
- **Layer 16 (Component Patterns)**: Reusable component designs
- **Layer 17 (Composition/Layout)**: Layout and composition principles
- **Layer 18 (Aesthetic Evaluation)**: Quality assessment framework
- **Layer 19 (Visual Quality)**: Quality gates and polish standards
- **Layer 20 (Design References)**: Inspiration and benchmarks

---

## Design Philosophy

### Core Principles

1. **Aliveness**: UI should feel responsive and alive, reacting to state changes
2. **Clarity**: Every element should communicate purpose within 1 second
3. **Hierarchy**: Visual weight guides the eye, not just size
4. **Subtlety**: Favor subtle enhancement over spectacle
5. **Meaning**: Every animation and color choice should reinforce the game's identity

### Identity

- **Genre**: Mystical creature alchemy
- **Tone**: Soft, living, unstable
- **Inspiration**: Alchemy diagrams, terrariums, pixel relics, ancient machines that breathe, cyber-vaporwave aesthetics, pixel art charm

### Forbidden Patterns

- Flat lifeless panels
- Hard sci-fi UI
- Perfect symmetry in fusion
- Over-explained outcomes
- Generic corporate design
- Excessive visual clutter
- Gratuitous effects without purpose
- Motion that doesn't communicate meaning

---

## Design Tokens

### Color System

**Semantic Colors:**
- `DESIGN_TOKENS.color.semantic.primary.*` - Primary actions and surfaces
- `DESIGN_TOKENS.color.semantic.secondary.*` - Secondary actions
- `DESIGN_TOKENS.color.semantic.accent.*` - Accent elements
- `DESIGN_TOKENS.color.semantic.background.*` - Background colors
- `DESIGN_TOKENS.color.semantic.surface.*` - Surface/panel colors
- `DESIGN_TOKENS.color.semantic.text.*` - Text colors
- `DESIGN_TOKENS.color.semantic.border.*` - Border colors
- `DESIGN_TOKENS.color.semantic.status.*` - Status colors (success, warning, error, info)

**Usage Guidelines:**
- Always use semantic colors, never hardcoded hex values
- Use semantic colors to communicate meaning
- Ensure WCAG AA contrast ratios (4.5:1 minimum for text)
- Reference `layer-15-design-tokens.ts` for all color values

### Spacing System

**8px Rhythm System:**
- `DESIGN_TOKENS.spacing.semantic.xs` - 4px (0.5 rhythm)
- `DESIGN_TOKENS.spacing.semantic.sm` - 8px (1 rhythm)
- `DESIGN_TOKENS.spacing.semantic.md` - 16px (2 rhythm)
- `DESIGN_TOKENS.spacing.semantic.lg` - 24px (3 rhythm)
- `DESIGN_TOKENS.spacing.semantic.xl` - 32px (4 rhythm)
- `DESIGN_TOKENS.spacing.semantic.xxl` - 48px (6 rhythm)
- `DESIGN_TOKENS.spacing.semantic.xxxl` - 64px (8 rhythm)

**Usage Guidelines:**
- All spacing must use design tokens
- Maintain 8px rhythm for consistency
- Use larger spacing for more important separations
- Reference `layer-15-design-tokens.ts` for spacing values

### Typography System

**Type Scale (Modular, 1.25 ratio):**
- `DESIGN_TOKENS.typography.scale.xs` - 12px
- `DESIGN_TOKENS.typography.scale.sm` - 14px
- `DESIGN_TOKENS.typography.scale.base` - 16px
- `DESIGN_TOKENS.typography.scale.lg` - 18px
- `DESIGN_TOKENS.typography.scale.xl` - 20px
- `DESIGN_TOKENS.typography.scale.2xl` - 24px
- `DESIGN_TOKENS.typography.scale.3xl` - 32px
- `DESIGN_TOKENS.typography.scale.4xl` - 48px

**Usage Guidelines:**
- Use typography scale for all text sizes
- Maintain minimum 16px for body text (mobile)
- Ensure line height ≥ 1.4 for readability
- Use semantic typography tokens (h1, h2, body, etc.)
- Reference `layer-15-design-tokens.ts` for typography values

### Animation System

**Duration Tokens:**
- `DESIGN_TOKENS.animation.duration.fast` - 150ms (micro-interactions)
- `DESIGN_TOKENS.animation.duration.normal` - 300ms (standard transitions)
- `DESIGN_TOKENS.animation.duration.slow` - 500ms (major transitions)
- `DESIGN_TOKENS.animation.semantic.idle` - 2s (slow breathing)

**Easing Tokens:**
- `DESIGN_TOKENS.animation.easing.easeOut` - Standard transitions
- `DESIGN_TOKENS.animation.easing.easeIn` - Entrances
- `DESIGN_TOKENS.animation.easing.elastic` - Elastic interactions

**Usage Guidelines:**
- Use animation tokens for all timing
- Ensure 60fps performance
- Use GPU-accelerated properties (transform, opacity)
- Reference `layer-15-design-tokens.ts` for animation values

### Shadow/Elevation System

**Elevation Levels:**
- `DESIGN_TOKENS.shadow.elevation.sm` - Subtle elevation (cards)
- `DESIGN_TOKENS.shadow.elevation.md` - Medium elevation (modals)
- `DESIGN_TOKENS.shadow.elevation.lg` - Large elevation (dropdowns)
- `DESIGN_TOKENS.shadow.semantic.focus` - Focus ring

**Usage Guidelines:**
- Use elevation to communicate hierarchy
- Higher elevation = more important/interactive
- Reference `layer-15-design-tokens.ts` for shadow values

### Border Radius

**Radius Scale:**
- `DESIGN_TOKENS.borderRadius.semantic.button` - 8px
- `DESIGN_TOKENS.borderRadius.semantic.card` - 12px
- `DESIGN_TOKENS.borderRadius.semantic.modal` - 12px

**Usage Guidelines:**
- Use semantic border radius tokens
- Consistent radius creates visual harmony
- Reference `layer-15-design-tokens.ts` for radius values

### Breakpoints

**Responsive Breakpoints:**
- `DESIGN_TOKENS.breakpoint.mobile` - 0px
- `DESIGN_TOKENS.breakpoint.tablet` - 768px
- `DESIGN_TOKENS.breakpoint.desktop` - 1024px
- `DESIGN_TOKENS.breakpoint.wide` - 1280px

**Usage Guidelines:**
- Mobile-first approach
- Use min-width media queries
- Test at all breakpoints
- Reference `layer-15-design-tokens.ts` for breakpoint values

---

## Component Patterns

### Button Component

**Variants:**
- Primary: Main actions
- Secondary: Secondary actions
- Tertiary: Less important actions
- Ghost: Minimal visual weight
- Danger: Destructive actions

**States:**
- Default: Interactive state
- Hover: Elevated, slight scale
- Active: Pressed state
- Disabled: Non-interactive
- Focus: Keyboard navigation
- Loading: Processing state

**Usage:**
- Use for user actions
- Not for links (use `<a>` tag)
- Reference `layer-16-component-patterns.ts` for complete pattern

### Card Component

**Variants:**
- Default: Standard card
- Elevated: Higher elevation
- Outlined: Border instead of shadow

**Structure:**
- Container (required)
- Header (optional)
- Content (required)
- Footer (optional)

**Usage:**
- Grouping related content
- Displaying pet information
- Presenting data in digestible chunks
- Reference `layer-16-component-patterns.ts` for complete pattern

### Input Component

**Variants:**
- Default: Standard input
- Error: Error state
- Success: Success state

**States:**
- Default: Ready for input
- Hover: Border color change
- Focus: Focus ring
- Disabled: Non-interactive
- Loading: Validating

**Accessibility:**
- Labels associated with inputs
- Error messages announced
- Keyboard navigation support
- Reference `layer-16-component-patterns.ts` for complete pattern

### Navigation Component

**Variants:**
- Tabs: Tab navigation
- Menu: Menu navigation
- Breadcrumbs: Breadcrumb navigation

**States:**
- Default: Standard nav item
- Active: Current page/item
- Hover: Interactive state
- Focus: Keyboard navigation

**Usage:**
- App-wide navigation
- Section navigation
- Tabbed interfaces
- Reference `layer-16-component-patterns.ts` for complete pattern

### Toast/Notification Component

**Variants:**
- Success: Success messages
- Error: Error messages
- Warning: Warning messages
- Info: Informational messages

**Usage:**
- Temporary notifications
- Non-blocking feedback
- Action confirmations
- Reference `layer-16-component-patterns.ts` for complete pattern

### Modal Component

**Structure:**
- Overlay (required)
- Modal container (required)
- Header (optional)
- Content (required)
- Footer (optional)

**Accessibility:**
- Focus trap within modal
- Escape key closes modal
- ARIA labels and roles
- Reference `layer-16-component-patterns.ts` for complete pattern

---

## Composition & Layout

### Visual Hierarchy

**Hierarchy Levels:**
- **Primary**: Main heading, primary CTA, most important content
  - Methods: Largest size, highest contrast, boldest weight, primary color
- **Secondary**: Section headings, secondary actions, important supporting content
  - Methods: Medium size, medium contrast, medium weight, secondary colors
- **Tertiary**: Body text, helper text, less important actions
  - Methods: Smaller size, lower contrast, lighter weight, muted colors

**Guidelines:**
- Use 2-3 methods per hierarchy level
- Clear focal point on each screen
- Reference `layer-17-composition-layout.ts` for complete principles

### Layout Patterns

**Single Column:**
- Mobile layouts
- Simple content pages
- Form layouts
- Card collections

**Two Column:**
- Settings pages
- Detail views with navigation
- Desktop layouts
- Dashboard layouts

**Grid:**
- Card grids
- Image galleries
- Data tables
- Complex layouts

**Responsive:**
- Mobile-first approach
- Stack on mobile, expand on larger screens
- Reference `layer-17-composition-layout.ts` for complete patterns

### Spacing Composition

**Proximity:**
- Related items closer together
- Use smaller spacing (sm-md) for related elements

**Rhythm:**
- 8px-based spacing rhythm
- All spacing multiples of 8px
- Creates visual consistency

**Breathing Room:**
- Minimum spacing: 8px
- Recommended: 16px for sections
- Prevents visual clutter

**Hierarchy:**
- Larger spacing for more important separations
- Primary sections: 32px
- Secondary: 16px
- Tertiary: 8px

**Reference `layer-17-composition-layout.ts` for complete spacing principles**

### Balance

**Types:**
- **Symmetric**: Mirrored balance (formal, stable)
- **Asymmetric**: Visual weight balanced but not mirrored (dynamic, interesting)
- **Radial**: Balance around central point (rare, specific use cases)

**Visual Weight Factors:**
- Size (larger = heavier)
- Color (brighter/darker = heavier)
- Position (top/left = heavier in LTR)
- Density (more content = heavier)
- Isolation (isolated elements = heavier)

**Reference `layer-17-composition-layout.ts` for complete balance principles**

### Alignment

**Grid Alignment:**
- All elements align to 8px grid
- Clean, organized appearance

**Baseline Alignment:**
- Text elements align to baseline grid
- Consistent vertical rhythm

**Edge Alignment:**
- Left align: Text, labels (LTR languages)
- Right align: Numbers, actions
- Center align: Headings, buttons, cards

**Reference `layer-17-composition-layout.ts` for complete alignment principles**

### Proportion

**Golden Ratio (1.618):**
- Layout divisions
- Typography scale
- Image aspect ratios
- Spacing relationships

**Rule of Thirds:**
- Divide space into 3x3 grid
- Place important elements at intersections
- Horizon lines at 1/3 or 2/3

**Modular Scale:**
- Typography scale based on 1.25 ratio
- Creates clear size relationships

**Reference `layer-17-composition-layout.ts` for complete proportion principles**

---

## Aesthetic Evaluation

### Quality Dimensions

**Harmony (0-1):**
- Color harmony
- Visual unity
- Typography harmony
- Style coherence

**Balance (0-1):**
- Visual weight distribution
- Spatial balance
- Color balance
- Content balance

**Contrast (0-1):**
- Hierarchical contrast
- Color contrast (accessibility)
- Visual contrast
- Tonal contrast

**Rhythm (0-1):**
- Spacing rhythm
- Pattern repetition
- Visual rhythm
- Temporal rhythm (animations)

**Proportion (0-1):**
- Size relationships
- Typography scale
- Component proportions
- Layout proportions

**Unity (0-1):**
- Design language consistency
- Identity reinforcement
- System coherence
- Conceptual unity

### Quality Thresholds

**Minimum (MVP):**
- Overall: ≥ 0.7
- All dimensions: ≥ 0.7

**Good (Production):**
- Overall: ≥ 0.8
- All dimensions: ≥ 0.8

**Excellent (Best-in-Class):**
- Overall: ≥ 0.9
- All dimensions: ≥ 0.9

**Reference `layer-18-aesthetic-evaluation.ts` for complete evaluation framework**

---

## Visual Quality

### Quality Checklist

**Alignment:**
- Pixel-perfect alignment
- Text baseline alignment
- Icon-text alignment
- Grid system respect

**Spacing:**
- Design token usage
- Consistent 8px rhythm
- No arbitrary values
- Proper hierarchy

**Color:**
- Design token usage
- Color accuracy
- WCAG AA contrast
- Color harmony

**Typography:**
- Design token usage
- Clear hierarchy
- Readable line heights
- Minimum 16px body text

**Animation:**
- Design token timing
- 60fps performance
- Purposeful animations
- Natural timing

**Responsive:**
- Works at all breakpoints
- Text scales appropriately
- Touch targets ≥ 44x44px
- No horizontal scrolling

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Focus indicators
- Semantic HTML

**Consistency:**
- 90%+ token usage (MVP)
- Component patterns followed
- Cohesive visual language
- Similar elements styled consistently

**Reference `layer-19-visual-quality.ts` for complete quality checklist**

### Quality Gates

**MVP Gate (Must Pass):**
- Overall quality score ≥ 0.7
- All critical checklist items pass
- WCAG 2.1 AA compliance
- 90%+ design token usage
- Responsive at all breakpoints

**Production Gate (Recommended):**
- Overall quality score ≥ 0.8
- 95%+ checklist items pass
- WCAG 2.1 AA+ compliance
- 95%+ design token usage
- All accessibility checks pass

**Excellent Gate (Aspirational):**
- Overall quality score ≥ 0.9
- 100% checklist items pass
- WCAG 2.1 AAA compliance
- 100% design token usage
- All quality dimensions ≥ 0.9

**Reference `layer-19-visual-quality.ts` for complete quality gates**

---

## Design References

### Game UI References

- **Dead Cells**: Fluid animations, pixel art integration, clear hierarchy
- **Hades**: Visual storytelling, cohesive art style, smooth transitions
- **Monument Valley**: Minimalist design, excellent use of whitespace
- **Gris**: Emotional design, subtle animations, color harmony
- **Cult of the Lamb**: Character in UI, playful but functional

### Mobile App References

- **Spotify**: Dark mode excellence, smooth animations
- **Discord**: Spacing rhythm, clear hierarchy
- **Linear**: Minimalism, excellent typography

### Design System References

- **Material Design 3**: Comprehensive design system, accessibility
- **Apple HIG**: Clarity, deference, depth principles
- **Ant Design**: Component library, documentation

**Reference `layer-20-design-references.md` for complete references and analysis**

---

## Integration Guide

### Design Request Flow

1. **Request Parsing**: Understand user request and complexity
2. **Context Retrieval**: Retrieve relevant design layers and patterns
3. **Token Selection**: Choose appropriate design tokens
4. **Component Selection**: Select or adapt component patterns
5. **Layout Planning**: Apply composition principles
6. **Aesthetic Evaluation**: Assess aesthetic quality
7. **Visual Quality Check**: Validate against quality checklist
8. **Reference Check**: Consult design references for inspiration
9. **Implementation**: Apply design tokens and patterns
10. **Quality Validation**: Final quality assessment

### Layer Activation

**Always Active:**
- Layer 1 (UI Canon): Core principles
- Layer 15 (Design Tokens): Design values
- Layer 19 (Visual Quality): Quality gates

**Conditionally Active:**
- Layer 16 (Component Patterns): When building components
- Layer 17 (Composition/Layout): When planning layouts
- Layer 18 (Aesthetic Evaluation): When evaluating design quality
- Layer 20 (Design References): When seeking inspiration

**Supporting Layers:**
- Layer 2 (Visual Analogies): Emotional context
- Layer 3 (UI States): State-driven theming

---

## Quality Standards

### MVP-Level Quality

**Design Consistency:**
- 90%+ design token usage
- Component patterns followed consistently
- Cohesive visual language

**Aesthetic Quality:**
- Aesthetic score ≥ 0.7 (all dimensions)
- Visual quality checklist: 80% pass rate

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Focus indicators visible

**Responsive Design:**
- Works at all breakpoints
- Touch targets ≥ 44x44px
- No horizontal scrolling

### Production-Level Quality

**Design Consistency:**
- 95%+ design token usage
- All components follow patterns
- Unified design language

**Aesthetic Quality:**
- Aesthetic score ≥ 0.8 (all dimensions)
- Visual quality checklist: 95% pass rate

**Accessibility:**
- WCAG 2.1 AA+ compliance
- Full keyboard navigation
- Screen reader support

### Best-in-Class Quality

**Design Consistency:**
- 100% design token usage
- Perfect pattern adherence
- Exceptional visual coherence

**Aesthetic Quality:**
- Aesthetic score ≥ 0.9 (all dimensions)
- Visual quality checklist: 100% pass rate

**Accessibility:**
- WCAG 2.1 AAA compliance
- Exceptional accessibility
- Universal design principles

---

## Quick Reference

### Common Patterns

**Button:**
```typescript
// Use DESIGN_TOKENS.color.semantic.primary.action
// Use DESIGN_TOKENS.spacing.component.button.padding
// Use DESIGN_TOKENS.borderRadius.semantic.button
// Reference layer-16-component-patterns.ts
```

**Card:**
```typescript
// Use DESIGN_TOKENS.color.semantic.surface.base
// Use DESIGN_TOKENS.spacing.component.card.padding
// Use DESIGN_TOKENS.shadow.semantic.card
// Use DESIGN_TOKENS.borderRadius.semantic.card
// Reference layer-16-component-patterns.ts
```

**Spacing:**
```typescript
// Use DESIGN_TOKENS.spacing.semantic.*
// Maintain 8px rhythm
// Larger spacing for more important separations
// Reference layer-15-design-tokens.ts
```

**Typography:**
```typescript
// Use DESIGN_TOKENS.typography.scale.*
// Use DESIGN_TOKENS.typography.semantic.*
// Minimum 16px for body text
// Line height ≥ 1.4
// Reference layer-15-design-tokens.ts
```

### Design Decision Tree

1. **Does this need a component pattern?**
   - Yes → Reference `layer-16-component-patterns.ts`
   - No → Continue

2. **What design tokens are needed?**
   - Colors → `DESIGN_TOKENS.color.semantic.*`
   - Spacing → `DESIGN_TOKENS.spacing.semantic.*`
   - Typography → `DESIGN_TOKENS.typography.*`
   - Animation → `DESIGN_TOKENS.animation.*`
   - Shadows → `DESIGN_TOKENS.shadow.*`

3. **Does this need layout guidance?**
   - Yes → Reference `layer-17-composition-layout.ts`
   - No → Continue

4. **Does this need aesthetic evaluation?**
   - Yes → Reference `layer-18-aesthetic-evaluation.ts`
   - No → Continue

5. **Does this pass visual quality check?**
   - Yes → Proceed
   - No → Reference `layer-19-visual-quality.ts` for improvements

---

**END OF DESIGN SYSTEM DOCUMENTATION**





















