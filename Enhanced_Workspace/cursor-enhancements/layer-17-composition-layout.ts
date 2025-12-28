/**
 * LAYER 17 — COMPOSITION & LAYOUT PRINCIPLES
 * 
 * Advanced composition and layout guidelines for aesthetic excellence
 * 
 * This layer provides comprehensive composition principles including visual
 * hierarchy, layout patterns, spacing composition, balance, alignment,
 * proportions, and content density guidelines.
 */

import { DESIGN_TOKENS } from './layer-15-design-tokens';

/**
 * Visual hierarchy level
 */
export type HierarchyLevel = "primary" | "secondary" | "tertiary" | "quaternary";

/**
 * Layout pattern type
 */
export type LayoutPattern = "single-column" | "two-column" | "three-column" | "grid" | "flex" | "masonry";

/**
 * Balance type
 */
export type BalanceType = "symmetric" | "asymmetric" | "radial";

/**
 * Visual hierarchy definition
 */
export interface VisualHierarchy {
  primary: {
    elements: string[];
    methods: string[];
    principles: string[];
  };
  secondary: {
    elements: string[];
    methods: string[];
    principles: string[];
  };
  tertiary: {
    elements: string[];
    methods: string[];
    principles: string[];
  };
}

/**
 * Layout pattern definition
 */
export interface LayoutPatternDef {
  name: LayoutPattern;
  description: string;
  structure: string[];
  useCases: string[];
  responsive: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  codeExample?: string;
}

/**
 * Composition principles configuration
 */
export const COMPOSITION_LAYOUT = {
  /**
   * Visual hierarchy principles
   */
  visualHierarchy: {
    primary: {
      elements: [
        "Main heading (H1)",
        "Primary call-to-action",
        "Most important content",
        "Key interactive elements"
      ],
      methods: [
        "Largest size (typography scale 3xl-4xl)",
        "Highest contrast",
        "Boldest weight (700)",
        "Primary color",
        "Prominent position (top-left, center)",
        "Most space around"
      ],
      principles: [
        "One primary element per screen",
        "Clear focal point",
        "User knows where to look first"
      ]
    },
    
    secondary: {
      elements: [
        "Section headings (H2-H3)",
        "Secondary actions",
        "Important supporting content",
        "Navigation items"
      ],
      methods: [
        "Medium size (typography scale xl-2xl)",
        "Medium contrast",
        "Medium weight (500-600)",
        "Secondary/accident colors",
        "Supporting positions",
        "Moderate spacing"
      ],
      principles: [
        "Supports primary without competing",
        "Clear relationship to primary",
        "Guides user flow"
      ]
    },
    
    tertiary: {
      elements: [
        "Body text",
        "Helper text",
        "Metadata",
        "Less important actions"
      ],
      methods: [
        "Smaller size (typography scale base-sm)",
        "Lower contrast",
        "Lighter weight (400)",
        "Muted colors",
        "Supporting positions",
        "Minimal spacing"
      ],
      principles: [
        "Doesn't distract from primary/secondary",
        "Provides context and details",
        "Completes information hierarchy"
      ]
    },
    
    emphasis: {
      methods: [
        "Size (larger = more important)",
        "Weight (bolder = more important)",
        "Color (brighter/higher contrast = more important)",
        "Position (top/left = more important in LTR)",
        "Spacing (more space = more important)",
        "Motion (animated = draws attention)"
      ],
      rule: "Use 2-3 methods per level, don't rely on single method"
    },
    
    grouping: {
      proximity: "Related items grouped together (Gestalt principle)",
      similarity: "Similar items styled similarly",
      closure: "Complete shapes/containers for grouping",
      continuity: "Aligned items form visual groups"
    },
    
    flow: {
      description: "How the eye moves through the interface",
      patterns: [
        "Z-pattern: Top-left → top-right → bottom-left → bottom-right",
        "F-pattern: Horizontal scan lines (for text-heavy content)",
        "Diagonal: Top-left to bottom-right (for dynamic content)"
      ],
      principles: [
        "Primary element at start of flow",
        "Clear path through content",
        "Important actions along flow path"
      ]
    }
  },

  /**
   * Layout patterns
   */
  layoutPatterns: {
    singleColumn: {
      name: "single-column",
      description: "Vertical stack of content",
      structure: ["header", "content (stacked)", "footer"],
      useCases: [
        "Mobile layouts",
        "Simple content pages",
        "Form layouts",
        "Card collections"
      ],
      responsive: {
        mobile: "Full width, stacked",
        tablet: "Full width, stacked",
        desktop: "Centered, max-width constraint"
      }
    },
    
    twoColumn: {
      name: "two-column",
      description: "Sidebar + main content",
      structure: ["header", "sidebar (left/right)", "main content", "footer"],
      useCases: [
        "Settings pages",
        "Detail views with navigation",
        "Desktop layouts",
        "Dashboard layouts"
      ],
      responsive: {
        mobile: "Stacked (sidebar → content)",
        tablet: "Sidebar collapsible/drawer",
        desktop: "Side-by-side columns"
      }
    },
    
    threeColumn: {
      name: "three-column",
      description: "Sidebar + main + sidebar layout",
      structure: ["header", "left sidebar", "main content", "right sidebar", "footer"],
      useCases: [
        "Complex dashboards",
        "Documentation layouts",
        "Desktop-only layouts"
      ],
      responsive: {
        mobile: "Single column, sidebars hidden",
        tablet: "Two column (one sidebar + main)",
        desktop: "Three column layout"
      }
    },
    
    grid: {
      name: "grid",
      description: "CSS Grid layout system",
      structure: ["grid container", "grid items"],
      useCases: [
        "Card grids",
        "Image galleries",
        "Data tables",
        "Complex layouts"
      ],
      responsive: {
        mobile: "1-2 columns",
        tablet: "2-3 columns",
        desktop: "3-4+ columns"
      }
    },
    
    flex: {
      name: "flex",
      description: "Flexbox layout system",
      structure: ["flex container", "flex items"],
      useCases: [
        "Navigation bars",
        "Button groups",
        "Simple layouts",
        "Component internals"
      ],
      responsive: {
        mobile: "Column direction",
        tablet: "Row direction (if space)",
        desktop: "Row direction"
      }
    },
    
    masonry: {
      name: "masonry",
      description: "Pinterest-style staggered grid",
      structure: ["masonry container", "variable-height items"],
      useCases: [
        "Image galleries",
        "Card collections with varying content",
        "Pinterest-style layouts"
      ],
      responsive: {
        mobile: "1-2 columns",
        tablet: "2-3 columns",
        desktop: "3-4+ columns"
      }
    }
  } as Record<LayoutPattern, LayoutPatternDef>,

  /**
   * Spacing composition
   */
  spacingComposition: {
    proximity: {
      principle: "Related items closer together",
      rule: "Use smaller spacing (sm-md) for related elements",
      example: "Icon and label: DESIGN_TOKENS.spacing.semantic.xs"
    },
    
    rhythm: {
      principle: "8px-based spacing rhythm",
      rule: "All spacing multiples of 8px",
      scale: DESIGN_TOKENS.spacing.scale,
      rationale: "Creates visual consistency and harmony"
    },
    
    breathingRoom: {
      principle: "Adequate white space for clarity",
      rule: "Minimum spacing: DESIGN_TOKENS.spacing.semantic.sm (8px)",
      recommended: "DESIGN_TOKENS.spacing.semantic.md (16px) for sections",
      rationale: "Prevents visual clutter, improves readability"
    },
    
    density: {
      comfortable: {
        spacing: "DESIGN_TOKENS.spacing.semantic.md-lg",
        description: "Comfortable spacing for readability",
        useCase: "Content-heavy screens, forms"
      },
      compact: {
        spacing: "DESIGN_TOKENS.spacing.semantic.sm-md",
        description: "Tighter spacing for efficiency",
        useCase: "Data-dense screens, lists"
      },
      spacious: {
        spacing: "DESIGN_TOKENS.spacing.semantic.lg-xl",
        description: "Generous spacing for emphasis",
        useCase: "Hero sections, important content"
      }
    },
    
    hierarchy: {
      principle: "Larger spacing for more important separations",
      rule: "Primary sections: lg-xl, Secondary: md, Tertiary: sm",
      example: "Page sections: 32px, Card spacing: 16px, Item spacing: 8px"
    }
  },

  /**
   * Balance principles
   */
  balance: {
    symmetric: {
      description: "Mirrored balance around center axis",
      useCase: "Formal, stable layouts",
      example: "Centered content, equal sidebars",
      whenToUse: [
        "Hero sections",
        "Centered modals",
        "Form layouts"
      ]
    },
    
    asymmetric: {
      description: "Visual weight balanced but not mirrored",
      useCase: "Dynamic, interesting layouts",
      example: "Large image left, text right",
      whenToUse: [
        "Content-rich layouts",
        "Feature sections",
        "Modern, dynamic designs"
      ]
    },
    
    radial: {
      description: "Balance around central point",
      useCase: "Circular/radial layouts",
      example: "Circular navigation, radial menus",
      whenToUse: [
        "Special navigation patterns",
        "Circular interfaces",
        "Rare, specific use cases"
      ]
    },
    
    visualWeight: {
      factors: [
        "Size (larger = heavier)",
        "Color (brighter/darker = heavier)",
        "Position (top/left = heavier in LTR)",
        "Density (more content = heavier)",
        "Isolation (isolated elements = heavier)"
      ],
      principle: "Balance heavy and light elements for stability"
    }
  },

  /**
   * Alignment systems
   */
  alignment: {
    grid: {
      description: "Align to invisible grid system",
      rule: "All elements align to 8px grid",
      benefit: "Clean, organized appearance"
    },
    
    optical: {
      description: "Visual alignment accounting for optical illusions",
      rule: "Sometimes slight adjustments needed for visual balance",
      example: "Centered circles may need slight upward adjustment"
    },
    
    baseline: {
      description: "Text baseline alignment",
      rule: "Text elements align to baseline grid",
      benefit: "Consistent vertical rhythm"
    },
    
    edge: {
      description: "Edge alignment",
      types: [
        "Left align: Text, labels (LTR languages)",
        "Right align: Numbers, actions",
        "Center align: Headings, buttons, cards"
      ],
      principles: [
        "Consistent alignment creates order",
        "Mixed alignment for hierarchy",
        "Text typically left-aligned for readability"
      ]
    }
  },

  /**
   * Proportion principles
   */
  proportion: {
    goldenRatio: {
      description: "1.618 ratio (phi)",
      application: [
        "Layout divisions (sidebar:main = 1:1.618)",
        "Typography scale",
        "Image aspect ratios",
        "Spacing relationships"
      ],
      example: "If sidebar is 300px, main content ≈ 485px"
    },
    
    ruleOfThirds: {
      description: "Divide space into 3x3 grid",
      application: [
        "Place important elements at intersection points",
        "Horizon lines at 1/3 or 2/3",
        "Focal points at grid intersections"
      ],
      useCase: "Image composition, hero sections"
    },
    
    modularScale: {
      description: "Typography scale based on ratio",
      ratio: "1.25 (Major Third) - from DESIGN_TOKENS",
      application: "Typography hierarchy, spacing relationships"
    },
    
    relationships: {
      principle: "Related sizes should have clear relationships",
      rule: "Use scale ratios (2x, 1.5x, 1.25x) rather than arbitrary sizes",
      example: "Card padding: 16px, Card gap: 24px (1.5x)"
    }
  },

  /**
   * White space utilization
   */
  whiteSpace: {
    active: {
      description: "White space used intentionally to create emphasis",
      principle: "Space is an element, not emptiness",
      useCase: "Isolating important content, creating focus"
    },
    
    passive: {
      description: "White space as natural spacing between elements",
      principle: "Necessary breathing room",
      useCase: "Standard spacing, readability"
    },
    
    micro: {
      description: "Small spaces between closely related elements",
      size: "4-8px",
      example: "Icon and label, list items"
    },
    
    macro: {
      description: "Large spaces separating major sections",
      size: "32-64px",
      example: "Page sections, major content blocks"
    },
    
    negative: {
      description: "When elements overlap intentionally",
      useCase: "Layering effects, creative compositions",
      caution: "Use sparingly, maintain readability"
    }
  },

  /**
   * Content density guidelines
   */
  contentDensity: {
    comfortable: {
      description: "Generous spacing, easy to scan",
      spacing: "DESIGN_TOKENS.spacing.semantic.lg",
      lineHeight: 1.5,
      useCase: "Content-focused screens, reading"
    },
    
    standard: {
      description: "Balanced spacing and content",
      spacing: "DESIGN_TOKENS.spacing.semantic.md",
      lineHeight: 1.4,
      useCase: "Most screens, general use"
    },
    
    compact: {
      description: "Tighter spacing, more information visible",
      spacing: "DESIGN_TOKENS.spacing.semantic.sm",
      lineHeight: 1.3,
      useCase: "Data-dense screens, expert users"
    },
    
    principles: [
      "Match density to user needs",
      "More important content gets more space",
      "Consistent density within sections",
      "Allow user preference when possible"
    ]
  },

  /**
   * Grid system
   */
  gridSystem: {
    base: {
      columns: 12,
      gutter: DESIGN_TOKENS.spacing.semantic.md, // 16px
      margin: DESIGN_TOKENS.spacing.semantic.lg, // 24px (mobile)
      rationale: "12 columns divisible by 2, 3, 4, 6 - flexible layouts"
    },
    
    breakpoints: {
      mobile: {
        columns: 4,
        gutter: DESIGN_TOKENS.spacing.semantic.sm,
        margin: DESIGN_TOKENS.spacing.semantic.md
      },
      tablet: {
        columns: 8,
        gutter: DESIGN_TOKENS.spacing.semantic.md,
        margin: DESIGN_TOKENS.spacing.semantic.lg
      },
      desktop: {
        columns: 12,
        gutter: DESIGN_TOKENS.spacing.semantic.md,
        margin: DESIGN_TOKENS.spacing.semantic.xl
      }
    },
    
    usage: {
      principle: "Align elements to grid columns",
      rule: "Components span multiple columns as needed",
      example: "Card: 12 columns (mobile), 6 columns (tablet), 4 columns (desktop)"
    }
  }
} as const;

/**
 * Helper function to determine visual hierarchy level
 */
export function determineHierarchyLevel(
  element: string,
  context: {
    isHeading?: boolean;
    isAction?: boolean;
    importance?: "high" | "medium" | "low";
  }
): HierarchyLevel {
  if (context.importance === "high" || context.isHeading) {
    return "primary";
  } else if (context.isAction || context.importance === "medium") {
    return "secondary";
  } else {
    return "tertiary";
  }
}

/**
 * Helper function to get layout pattern recommendation
 */
export function recommendLayoutPattern(
  contentType: "cards" | "form" | "dashboard" | "content" | "gallery",
  screenSize: "mobile" | "tablet" | "desktop"
): LayoutPattern {
  const recommendations: Record<string, LayoutPattern> = {
    "cards-mobile": "single-column",
    "cards-tablet": "grid",
    "cards-desktop": "grid",
    "form-mobile": "single-column",
    "form-tablet": "two-column",
    "form-desktop": "two-column",
    "dashboard-mobile": "single-column",
    "dashboard-tablet": "two-column",
    "dashboard-desktop": "three-column",
    "content-mobile": "single-column",
    "content-tablet": "single-column",
    "content-desktop": "two-column",
    "gallery-mobile": "grid",
    "gallery-tablet": "masonry",
    "gallery-desktop": "masonry"
  };
  
  return recommendations[`${contentType}-${screenSize}`] || "single-column";
}

/**
 * Type exports
 */
export type { VisualHierarchy, LayoutPatternDef, LayoutPattern, BalanceType, HierarchyLevel };





















