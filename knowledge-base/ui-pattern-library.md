# UI Pattern Library

## Purpose

This library catalogs **UI/UX patterns** - reusable interface patterns that Cursor can reference when designing user interfaces. Each entry includes what it does, pros/cons, and when to use it.

---

## Entry Format

Each pattern entry follows this structure:

```markdown
## [Pattern Name]

**Description**: [What it does, how it works]

**Pros**: 
- [Strength 1]
- [Strength 2]

**Cons**: 
- [Weakness 1]
- [Weakness 2]

**Best Use Cases**: 
- [When to use 1]
- [When to use 2]

**Adaptation Notes**: [How to adapt, not copy]
```

---

## Layout Patterns

### Two-Panel Comparison

**Description**: Split screen layout with selection on one side, preview/result on the other. Enables simultaneous viewing and comparison.

**Pros**: 
- Enables quick comparison
- Reduces navigation
- Shows context
- Efficient workflow

**Cons**: 
- Requires screen space
- May be cramped on mobile
- Can be overwhelming
- Requires responsive design

**Best Use Cases**: 
- Selection + preview interfaces
- Comparison tools
- Design/creation interfaces
- Desktop-focused experiences

**Adaptation Notes**: 
- Stack panels vertically on mobile
- Use collapsible panels for space
- Ensure visual connection between panels
- Provide clear selection feedback

---

### Grid Layout

**Description**: Items displayed in a grid (rows and columns), enabling visual scanning and efficient space usage.

**Pros**: 
- Shows many items at once
- Enables visual scanning
- Efficient space usage
- Familiar pattern

**Cons**: 
- May show less detail per item
- Can be overwhelming with many items
- Requires responsive design
- May not suit text-heavy content

**Best Use Cases**: 
- Visual content (images, cards)
- Collection browsing
- Media galleries
- Visual scanning focus

**Adaptation Notes**: 
- Adjust columns for screen size
- Provide detail views
- Enable filtering/sorting
- Consider infinite scroll vs. pagination

---

### List Layout

**Description**: Items displayed in a vertical list, showing more information per item but fewer items visible.

**Pros**: 
- Shows more detail per item
- Better for text content
- Familiar pattern
- Easy to scan

**Cons**: 
- Shows fewer items
- Less efficient space usage
- May require scrolling
- Less visual

**Best Use Cases**: 
- Text-heavy content
- Detailed information
- Search results
- Data tables

**Adaptation Notes**: 
- Provide compact/expanded views
- Enable sorting/filtering
- Consider virtual scrolling for long lists
- Balance detail vs. quantity

---

## Navigation Patterns

### Tab Navigation

**Description**: Horizontal or vertical tabs for switching between sections or views.

**Pros**: 
- Clear section organization
- Familiar pattern
- Easy to understand
- Quick switching

**Cons**: 
- Limited to few sections
- May not scale well
- Can be cramped
- May hide content

**Best Use Cases**: 
- Few sections (2-5)
- Clear categorization
- Quick switching
- Desktop interfaces

**Adaptation Notes**: 
- Use dropdown for many tabs
- Consider mobile alternatives
- Provide visual feedback
- Ensure accessibility

---

### Sidebar Navigation

**Description**: Vertical sidebar with navigation items, often collapsible, providing persistent navigation.

**Pros**: 
- Always visible
- Scales to many items
- Familiar pattern
- Enables quick access

**Cons**: 
- Takes horizontal space
- May be hidden on mobile
- Can be overwhelming
- Requires responsive design

**Best Use Cases**: 
- Many navigation items
- Desktop-focused interfaces
- Persistent navigation needed
- Complex navigation structures

**Adaptation Notes**: 
- Collapse on mobile
- Use hamburger menu alternative
- Provide visual hierarchy
- Ensure accessibility

---

### Breadcrumb Navigation

**Description**: Hierarchical path showing current location and enabling navigation to parent levels.

**Pros**: 
- Shows location clearly
- Enables quick navigation
- Familiar pattern
- Helps orientation

**Cons**: 
- Takes space
- May not suit flat structures
- Can be cluttered
- Less useful for few levels

**Best Use Cases**: 
- Deep hierarchies
- Location awareness
- Quick parent navigation
- Complex structures

**Adaptation Notes**: 
- Use for 3+ levels
- Provide clickable items
- Show current location clearly
- Consider mobile alternatives

---

## Interaction Patterns

### Infinite Scroll

**Description**: Content loads automatically as user scrolls, eliminating pagination.

**Pros**: 
- Reduces friction
- Continuous browsing
- No pagination clicks
- Smooth experience

**Cons**: 
- Can be disorienting
- Hard to reach footer
- May load too much
- Can impact performance

**Best Use Cases**: 
- Large content collections
- Browsing focus
- Social feeds
- Media galleries

**Adaptation Notes**: 
- Provide "load more" option
- Consider virtual scrolling
- Optimize performance
- Provide scroll-to-top

---

### Pagination

**Description**: Content divided into pages with navigation controls (next, previous, page numbers).

**Pros**: 
- Clear content boundaries
- Predictable loading
- Easy to bookmark
- Better for SEO

**Cons**: 
- Requires clicks
- Can interrupt flow
- May feel slow
- Less smooth

**Best Use Cases**: 
- Search results
- Content that needs bookmarking
- Predictable content
- SEO-important content

**Adaptation Notes**: 
- Provide page numbers
- Show total pages
- Enable keyboard navigation
- Consider hybrid approaches

---

### Modal/Dialog

**Description**: Overlay dialog that focuses attention on specific content or actions, blocking interaction with background.

**Pros**: 
- Focuses attention
- Prevents background interaction
- Clear action points
- Familiar pattern

**Cons**: 
- Blocks background
- Can be disruptive
- May feel intrusive
- Requires dismissal

**Best Use Cases**: 
- Important actions
- Confirmation dialogs
- Focused content
- Quick interactions

**Adaptation Notes**: 
- Provide clear close action
- Ensure accessibility
- Consider alternatives (inline, slide-in)
- Don't overuse

---

## Feedback Patterns

### Toast Notifications

**Description**: Temporary notifications that appear briefly to provide feedback, then disappear automatically.

**Pros**: 
- Non-intrusive
- Provides quick feedback
- Doesn't block interaction
- Familiar pattern

**Cons**: 
- May be missed
- Limited information
- Can be annoying if frequent
- May not be accessible

**Best Use Cases**: 
- Quick feedback
- Non-critical notifications
- Success/error messages
- Status updates

**Adaptation Notes**: 
- Keep messages short
- Provide dismiss option
- Ensure accessibility
- Don't overuse

---

### Progress Indicators

**Description**: Visual indicators showing progress through a process or loading state.

**Pros**: 
- Reduces perceived wait time
- Provides feedback
- Shows progress
- Familiar pattern

**Cons**: 
- May not be accurate
- Can be distracting
- May create anxiety
- Requires maintenance

**Best Use Cases**: 
- Long processes
- Loading states
- Multi-step processes
- Progress tracking

**Adaptation Notes**: 
- Provide accurate progress
- Use appropriate type (determinate/indeterminate)
- Consider alternatives (skeleton screens)
- Ensure accessibility

---

## Filtering Patterns

### Sidebar Filters

**Description**: Filters displayed in a sidebar, enabling quick filtering of content.

**Pros**: 
- Always visible
- Quick filtering
- Clear organization
- Familiar pattern

**Cons**: 
- Takes space
- May be hidden on mobile
- Can be overwhelming
- Requires responsive design

**Best Use Cases**: 
- Complex filtering
- Many filter options
- Desktop interfaces
- Persistent filtering

**Adaptation Notes**: 
- Collapse on mobile
- Use modal alternative
- Provide clear filter state
- Enable filter combination

---

### Inline Filters

**Description**: Filters integrated into content area, often as dropdowns or chips.

**Pros**: 
- Saves space
- Integrated experience
- Less overwhelming
- Mobile-friendly

**Cons**: 
- May be less visible
- Limited filter options
- Can be cluttered
- May require scrolling

**Best Use Cases**: 
- Simple filtering
- Mobile interfaces
- Space-constrained layouts
- Few filter options

**Adaptation Notes**: 
- Keep filters visible
- Provide clear filter state
- Enable easy removal
- Consider chip-based filters

---

### Faceted Search

**Description**: Multiple filter facets displayed together, enabling complex multi-dimensional filtering.

**Pros**:
- Enables complex filtering
- Shows all filter dimensions
- Familiar in e-commerce
- Powerful for large datasets

**Cons**:
- Can be overwhelming
- Requires space
- May be complex for users
- Needs careful design

**Best Use Cases**:
- E-commerce filtering
- Large datasets
- Complex search needs
- Multiple filter dimensions

**Adaptation Notes**:
- Group related facets
- Show result counts
- Enable quick filter clear
- Provide visual feedback

---

## Form Patterns

### Multi-Step Forms (Wizard)

**Description**: Long forms broken into multiple steps with progress indication.

**Pros**:
- Reduces overwhelm
- Shows progress
- Enables validation per step
- Better completion rates

**Cons**:
- More clicks required
- Can be frustrating if too many steps
- May hide important context
- Requires good navigation

**Best Use Cases**:
- Long registration forms
- Complex processes
- Step-by-step guidance
- Onboarding flows

**Adaptation Notes**:
- Show progress clearly
- Enable step skipping where possible
- Validate per step
- Allow going back

---

### Inline Validation

**Description**: Form field validation happens immediately as user types or leaves field.

**Pros**:
- Immediate feedback
- Reduces errors
- Better user experience
- Faster form completion

**Cons**:
- Can be annoying if too aggressive
- May distract during typing
- Requires careful timing
- May show premature errors

**Best Use Cases**:
- Forms with validation rules
- Password strength indicators
- Email/username uniqueness
- Data format requirements

**Adaptation Notes**:
- Validate on blur, not keystroke
- Show errors after user finishes
- Provide helpful error messages
- Indicate success state

---

### Autosave/Draft

**Description**: Forms automatically save progress, preventing data loss.

**Pros**:
- Prevents data loss
- Reduces user anxiety
- No manual saving needed
- Better user experience

**Cons**:
- May conflict with explicit save
- Can be unexpected
- May save invalid data
- Requires backend support

**Best Use Cases**:
- Long forms
- Content creation
- Critical data entry
- Preventing data loss

**Adaptation Notes**:
- Show save status clearly
- Provide manual save option
- Handle conflicts gracefully
- Consider save timing

---

### Smart Defaults

**Description**: Form fields pre-populated with intelligent default values based on context.

**Pros**:
- Reduces user effort
- Speeds up completion
- Shows expected format
- Improves accuracy

**Cons**:
- May not suit all users
- Can be incorrect
- May be overlooked
- Requires careful selection

**Best Use Cases**:
- Common values
- Format examples
- User preferences
- Context-aware forms

**Adaptation Notes**:
- Make defaults obvious
- Allow easy changing
- Base on user data
- Explain why default was chosen

---

## Data Display Patterns

### Cards

**Description**: Content grouped in visual containers (cards) with consistent structure.

**Pros**:
- Clear content grouping
- Visual hierarchy
- Flexible layout
- Familiar pattern

**Cons**:
- Can waste space
- May be overused
- Can look generic
- Requires responsive design

**Best Use Cases**:
- Mixed content types
- Visual browsing
- Dashboard widgets
- Product listings

**Adaptation Notes**:
- Ensure consistent card structure
- Provide clear actions
- Use appropriate card sizes
- Consider mobile layout

---

### Data Tables

**Description**: Structured data displayed in rows and columns with sorting, filtering, and pagination.

**Pros**:
- Shows detailed data
- Enables comparison
- Supports sorting/filtering
- Familiar pattern

**Cons**:
- Not mobile-friendly
- Can be overwhelming
- Requires horizontal space
- May need scrolling

**Best Use Cases**:
- Structured data
- Data comparison
- Admin interfaces
- Desktop applications

**Adaptation Notes**:
- Make responsive (consider card view on mobile)
- Provide sorting/filtering
- Use fixed headers for long tables
- Enable column customization

---

### Dashboard Widgets

**Description**: Small, focused UI components displaying key metrics or data on a dashboard.

**Pros**:
- Quick overview
- Customizable layout
- Focused information
- Enables at-a-glance insights

**Cons**:
- Can be cluttered
- May lack detail
- Requires good design
- Can be overwhelming

**Best Use Cases**:
- Analytics dashboards
- Admin panels
- Monitoring systems
- KPI display

**Adaptation Notes**:
- Keep widgets focused
- Provide drill-down options
- Enable customization
- Use clear visualizations

---

### Accordion/Collapse

**Description**: Collapsible sections that expand to show content, hiding content by default.

**Pros**:
- Saves space
- Organizes content
- Progressive disclosure
- Familiar pattern

**Cons**:
- Hides content
- Requires interaction
- May be missed
- Can frustrate if overused

**Best Use Cases**:
- FAQs
- Content organization
- Space-constrained layouts
- Progressive disclosure

**Adaptation Notes**:
- Show section titles clearly
- Indicate expanded/collapsed state
- Consider defaults (open/closed)
- Enable expand all/collapse all

---

### Empty States

**Description**: Special UI shown when no data or content is available, often with call-to-action.

**Pros**:
- Prevents confusion
- Guides user action
- Opportunity for onboarding
- Better than blank page

**Cons**:
- Requires design effort
- May be overlooked
- Can be patronizing
- Needs maintenance

**Best Use Cases**:
- First-time user experience
- No search results
- Empty lists/collections
- Error states

**Adaptation Notes**:
- Provide helpful message
- Suggest next action
- Use illustrations
- Make CTA clear

---

## Input Patterns

### Autocomplete/Typeahead

**Description**: Suggestions appear as user types, enabling faster selection and reducing errors.

**Pros**:
- Faster input
- Reduces errors
- Shows available options
- Better user experience

**Cons**:
- Requires backend support
- Can be distracting
- May show too many results
- Requires careful timing

**Best Use Cases**:
- Search inputs
- Form field shortcuts
- Large option sets
- Known value sets

**Adaptation Notes**:
- Show results after 2-3 characters
- Limit result count
- Highlight matching text
- Enable keyboard navigation

---

### Drag and Drop

**Description**: Users can drag elements and drop them in new locations or onto targets.

**Pros**:
- Intuitive interaction
- Visual feedback
- Powerful for reordering
- Engaging experience

**Cons**:
- Not mobile-friendly
- Requires implementation effort
- May not be discoverable
- Accessibility challenges

**Best Use Cases**:
- File uploads
- List reordering
- Visual organization
- Creative tools

**Adaptation Notes**:
- Provide visual feedback
- Show drop zones clearly
- Offer alternative (mobile, accessibility)
- Confirm destructive actions

---

### Toggle Switches

**Description**: Binary on/off controls that show current state visually.

**Pros**:
- Clear current state
- Immediate visual feedback
- Familiar pattern
- Easy to use

**Cons**:
- Limited to binary choices
- May require confirmation
- Can be accidentally toggled
- May not show state clearly

**Best Use Cases**:
- Settings toggles
- Feature enable/disable
- Binary choices
- Instant changes

**Adaptation Notes**:
- Show state clearly (color, position)
- Provide labels
- Consider confirmation for critical actions
- Ensure accessibility

---

### Search Filters/Tags

**Description**: Selected filters displayed as removable tags/chips.

**Pros**:
- Clear filter state
- Easy removal
- Visual organization
- Familiar pattern

**Cons**:
- Takes space
- Can be cluttered
- May not scale well
- Requires space management

**Best Use Cases**:
- Multiple filters
- Search refinement
- Filter visibility
- Quick filter removal

**Adaptation Notes**:
- Make removable (X button)
- Show clearly
- Limit visible tags
- Provide "clear all"

---

## Mobile Patterns

### Bottom Sheet

**Description**: Panel that slides up from bottom of screen, common in mobile interfaces.

**Pros**:
- Mobile-friendly
- Thumb-accessible
- Familiar mobile pattern
- Saves screen space

**Cons**:
- Desktop translation unclear
- Can be dismissed accidentally
- May obscure content
- Limited height

**Best Use Cases**:
- Mobile actions
- Quick selections
- Mobile menus
- Contextual options

**Adaptation Notes**:
- Provide drag handle
- Enable backdrop dismiss
- Consider height constraints
- Provide close button

---

### Pull-to-Refresh

**Description**: Users pull down on content to trigger a refresh, common in mobile apps.

**Pros**:
- Intuitive mobile gesture
- No button needed
- Familiar pattern
- Satisfying interaction

**Cons**:
- Desktop alternative needed
- May conflict with scrolling
- Can be accidentally triggered
- Requires implementation

**Best Use Cases**:
- Mobile content feeds
- Data refresh
- Social apps
- Dynamic content

**Adaptation Notes**:
- Provide visual feedback
- Set appropriate trigger threshold
- Show loading state
- Offer alternative for desktop

---

### Hamburger Menu

**Description**: Collapsible navigation menu accessed via three-line icon, common on mobile.

**Pros**:
- Saves space
- Familiar pattern
- Hides navigation
- Mobile-friendly

**Cons**:
- Hides navigation
- May reduce discoverability
- Requires extra click
- Can be overused

**Best Use Cases**:
- Mobile navigation
- Space-constrained layouts
- Secondary navigation
- Many nav items

**Adaptation Notes**:
- Use only when necessary
- Consider alternatives (bottom nav)
- Show important items prominently
- Provide clear icon

---

### Swipe Actions

**Description**: Swipe left/right on items to reveal actions (delete, archive, etc.).

**Pros**:
- Space-efficient
- Familiar mobile pattern
- Quick actions
- No extra screens needed

**Cons**:
- Not discoverable
- Desktop alternative needed
- May be accidental
- Limited action count

**Best Use Cases**:
- Mobile list actions
- Common operations
- Quick interactions
- Email/messaging apps

**Adaptation Notes**:
- Show action icons
- Provide undo option
- Limit action count
- Provide alternative access

---

## Loading Patterns

### Skeleton Screens

**Description**: Placeholder UI showing content structure while loading, better than spinners.

**Pros**:
- Reduces perceived wait
- Shows expected layout
- Better than spinners
- Modern pattern

**Cons**:
- Requires design effort
- May not match final content
- Can be jarring transition
- Needs maintenance

**Best Use Cases**:
- Content loading
- Better perceived performance
- Modern apps
- Known content structure

**Adaptation Notes**:
- Match final layout
- Use subtle animation
- Transition smoothly to content
- Don't overuse

---

### Lazy Loading/Progressive Loading

**Description**: Content loads as needed (on scroll, on demand) rather than all at once.

**Pros**:
- Faster initial load
- Saves bandwidth
- Better performance
- Scales to large content

**Cons**:
- May feel slow
- Can be jarring
- Requires implementation
- SEO considerations

**Best Use Cases**:
- Large content sets
- Image galleries
- Infinite scroll
- Performance optimization

**Adaptation Notes**:
- Provide loading indicators
- Optimize trigger timing
- Consider preloading
- Handle errors gracefully

---

### Optimistic UI

**Description**: UI updates immediately assuming success, rolling back if action fails.

**Pros**:
- Feels instant
- Better perceived performance
- Reduces waiting
- Modern pattern

**Cons**:
- Can mislead users
- Requires rollback handling
- May cause confusion on failure
- Needs careful implementation

**Best Use Cases**:
- Social interactions (likes, follows)
- Quick actions
- High success-rate operations
- Better UX

**Adaptation Notes**:
- Use for high-success actions
- Handle failures gracefully
- Provide clear feedback on failure
- Consider showing pending state

---

## Onboarding Patterns

### Tooltips/Coachmarks

**Description**: Small popups explaining features, often used in onboarding.

**Pros**:
- Contextual help
- Non-intrusive
- Guides user
- Familiar pattern

**Cons**:
- Can be annoying
- May be dismissed quickly
- Limited information
- Timing is critical

**Best Use Cases**:
- Feature introduction
- Onboarding
- Contextual help
- New UI elements

**Adaptation Notes**:
- Keep brief
- Provide dismiss option
- Don't overuse
- Target key features

---

### Tutorial Overlay

**Description**: Step-by-step guided tour of interface, often with highlighting and instructions.

**Pros**:
- Guides new users
- Highlights features
- Structured learning
- Reduces confusion

**Cons**:
- Can be intrusive
- May be skipped
- Requires maintenance
- Can frustrate experienced users

**Best Use Cases**:
- Complex interfaces
- First-time onboarding
- New features
- Critical workflows

**Adaptation Notes**:
- Allow skipping
- Keep steps short
- Save progress
- Provide restart option

---

### Progressive Disclosure

**Description**: Show only essential information first, revealing more as user needs it.

**Pros**:
- Reduces overwhelm
- Focuses attention
- Guides user journey
- Better learning curve

**Cons**:
- May hide important info
- Can frustrate experts
- Requires careful design
- May slow down power users

**Best Use Cases**:
- Complex interfaces
- New user onboarding
- Feature-rich applications
- Learning curves

**Adaptation Notes**:
- Show essentials first
- Provide clear expansion
- Enable expert mode
- Balance simplicity vs. power

---

## How to Use This Library

### When Designing UI

1. **Search for similar patterns**
2. **Review pros/cons**
3. **Check best use cases**
4. **Read adaptation notes**
5. **Adapt, don't copy**

### When Evaluating UX

1. **Compare to library entries**
2. **Consider pros/cons**
3. **Check use case fit**
4. **Review adaptation notes**

### When Adding New Entries

1. **Follow entry format**
2. **Be specific and clear**
3. **Include real examples**
4. **Note adaptation strategies**

---

**This library enables Cursor to reuse successful UI patterns while adapting them to specific projects, maintaining consistency and learning from existing solutions.**


