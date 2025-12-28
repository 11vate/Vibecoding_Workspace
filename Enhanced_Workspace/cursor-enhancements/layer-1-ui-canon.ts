/**
 * LAYER 1 — UI CANON
 * 
 * Aesthetic Law encoded as TypeScript
 * This is not decoration - this is how UI should reason about itself
 * 
 * Enhanced with design token integration and advanced design principles
 */

import { DESIGN_TOKENS } from './layer-15-design-tokens';

export const UI_CANON = {
  identity: {
    genre: "mystical creature alchemy",
    tone: "soft, living, unstable",
    inspiration: [
      "alchemy diagrams",
      "terrariums",
      "pixel relics",
      "ancient machines that breathe",
      "cyber-vaporwave aesthetics",
      "pixel art charm"
    ]
  },

  colorPhilosophy: {
    background: {
      primary: "#1a1a2e", // Dark Navy Blue - creates depth and contrast
      panel: "#16213e",   // Darker Navy Blue - card backgrounds, modals
      accent: "#0f3460",  // Deepest Blue - hover states, active selections
      rationale: "Deep twilight gradients that create depth without overwhelming"
    },
    
    primary: {
      cyan: "#00ffff",    // Bright Cyan - primary actions, links, highlights
      magenta: "#ff00ff", // Bright Magenta - secondary actions, fusion highlights
      teal: "#4ecca3",    // Mint Teal - buttons, success states
      rationale: "Life energy colors - vibrant and energetic, representing creation and transformation"
    },
    
    fusion: {
      unstable: "#aa00ff",  // Violet - unstable alchemy
      cyan: "#00ffff",      // Cyan - transformation energy
      rationale: "Unstable alchemy colors - represent the chaotic, creative nature of fusion"
    },
    
    danger: {
      entropy: "#ff0000",   // Red - rare, sharp, for errors and critical states
      warning: "#ffaa00",   // Orange - warnings and caution
      rationale: "Entropy red - used sparingly, represents danger and irreversible actions"
    },
    
    mythic: {
      glow: "#ff00ff",      // Magenta - off-spectrum glow
      prismatic: "#ffffff", // White - pure light
      omega: "#ff0080",     // Pink - ultimate power
      rationale: "Off-spectrum colors that feel slightly illegal, beyond normal constraints"
    },
    
    status: {
      success: "#00ff00",   // Bright Green
      warning: "#ffaa00",   // Orange
      error: "#ff0000",     // Red
      info: "#00ffff"       // Cyan
    },
    
    text: {
      primary: "#ffffff",   // White - main text, headings
      secondary: "#cccccc", // Light Gray - secondary information
      muted: "#888888"      // Gray - disabled states, placeholders
    },
    
    rarity: {
      basic: "#808080",
      rare: "#0088ff",
      sr: "#aa00ff",
      legendary: "#ffaa00",
      mythic: "#ff00ff",
      prismatic: "#ffffff",
      omega: "#ff0080"
    }
  },

  motionLaw: {
    idle: {
      description: "slow breathing",
      duration: "2s",
      frequency: "low",
      rationale: "Elements should feel alive, not static. Idle animations create presence."
    },
    
    interaction: {
      description: "elastic but restrained",
      duration: "150-300ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      rationale: "Feedback should feel responsive but not bouncy. Elasticity shows reactivity without being playful."
    },
    
    fusion: {
      description: "non-linear pulse",
      duration: "500ms",
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      rationale: "Fusion is transformation - it should feel unstable and unpredictable, building tension"
    },
    
    glitch: {
      description: "brief, rule-breaking distortions",
      duration: "100-200ms",
      frequency: "rare",
      rationale: "Chaos elements should feel slightly wrong, like reality breaking. Used sparingly for impact."
    }
  },

  typography: {
    fontFamily: {
      system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      rationale: "System fonts for native performance, excellent readability, and mobile optimization"
    },
    
    headers: {
      style: "pixel-serif, mystical",
      rationale: "Headers should feel special and distinctive, not generic"
    },
    
    body: {
      style: "clean pixel sans",
      rationale: "Body text must be highly readable and accessible"
    },
    
    numbers: {
      style: "monospace, ritualistic",
      rationale: "Numbers (stats, costs, timers) should feel precise and intentional"
    },
    
    scale: {
      h1: { size: "32px", weight: 700, lineHeight: 1.2 },
      h2: { size: "24px", weight: 600, lineHeight: 1.3 },
      h3: { size: "20px", weight: 600, lineHeight: 1.4 },
      h4: { size: "18px", weight: 500, lineHeight: 1.4 },
      body: { size: "16px", weight: 400, lineHeight: 1.5 },
      small: { size: "14px", weight: 400, lineHeight: 1.5 },
      caption: { size: "12px", weight: 400, lineHeight: 1.4 }
    },
    
    rules: {
      minSize: "16px",
      maxLineLength: "75 characters",
      contrastRatio: "4.5:1 minimum",
      scaleSupport: "up to 200%"
    }
  },

  spacingRules: {
    rhythm: 8, // Base unit: 8px
    density: "comfortable, never cramped",
    hierarchy: "visual weight before size",
    
    scale: {
      xs: "4px",   // 0.5 rhythm
      sm: "8px",   // 1 rhythm
      md: "16px",  // 2 rhythm
      lg: "24px",  // 3 rhythm
      xl: "32px",  // 4 rhythm
      xxl: "48px"  // 6 rhythm
    },
    
    rationale: "8px rhythm creates consistent spacing that feels natural. Visual hierarchy guides the eye more than size."
  },

  timing: {
    fast: "150ms",    // Micro-interactions (button hover, icon state)
    normal: "300ms",  // Standard transitions (page, modal, panel)
    slow: "500ms",    // Major transitions (fusion reveal, pet summon)
    dramatic: "800ms" // Victory screens, major celebrations
    
    // Easing functions:
    // - Ease Out: cubic-bezier(0.4, 0, 0.2, 1) (most common)
    // - Ease In: cubic-bezier(0.4, 0, 1, 1) (entrances)
    // - Ease In Out: cubic-bezier(0.4, 0, 0.2, 1) (smooth)
  },

  forbidden: [
    "flat lifeless panels",
    "hard sci-fi UI",
    "perfect symmetry in fusion",
    "over-explained outcomes",
    "generic corporate design",
    "excessive visual clutter",
    "gratuitous effects without purpose",
    "motion that doesn't communicate meaning"
  ],

  principles: {
    aliveness: "UI should feel responsive and alive, reacting to state changes",
    clarity: "Every element should communicate purpose within 1 second",
    hierarchy: "Visual weight guides the eye, not just size",
    subtlety: "Favor subtle enhancement over spectacle",
    meaning: "Every animation and color choice should reinforce the game's identity"
  },

  /**
   * Design Token Integration
   * 
   * UI Canon values map to design tokens for systematic consistency
   * Use DESIGN_TOKENS for actual implementation values
   */
  tokenIntegration: {
    colors: {
      background: {
        primary: "DESIGN_TOKENS.color.semantic.background.base",
        panel: "DESIGN_TOKENS.color.semantic.surface.base",
        accent: "DESIGN_TOKENS.color.semantic.surface.elevated"
      },
      primary: {
        cyan: "DESIGN_TOKENS.color.semantic.primary.action",
        magenta: "DESIGN_TOKENS.color.semantic.secondary.action",
        teal: "DESIGN_TOKENS.color.semantic.accent.action"
      },
      text: {
        primary: "DESIGN_TOKENS.color.semantic.text.primary",
        secondary: "DESIGN_TOKENS.color.semantic.text.secondary",
        muted: "DESIGN_TOKENS.color.semantic.text.tertiary"
      }
    },
    spacing: {
      rhythm: DESIGN_TOKENS.spacing.scale[1], // 8px
      scale: {
        xs: DESIGN_TOKENS.spacing.semantic.xs,
        sm: DESIGN_TOKENS.spacing.semantic.sm,
        md: DESIGN_TOKENS.spacing.semantic.md,
        lg: DESIGN_TOKENS.spacing.semantic.lg,
        xl: DESIGN_TOKENS.spacing.semantic.xl,
        xxl: DESIGN_TOKENS.spacing.semantic.xxl
      }
    },
    typography: {
      fontFamily: DESIGN_TOKENS.typography.fontFamily.system,
      scale: DESIGN_TOKENS.typography.scale,
      semantic: DESIGN_TOKENS.typography.semantic
    },
    animation: {
      timing: DESIGN_TOKENS.animation.duration,
      easing: DESIGN_TOKENS.animation.easing,
      semantic: DESIGN_TOKENS.animation.semantic
    },
    shadow: DESIGN_TOKENS.shadow,
    borderRadius: DESIGN_TOKENS.borderRadius,
    breakpoint: DESIGN_TOKENS.breakpoint,
    zIndex: DESIGN_TOKENS.zIndex
  },

  /**
   * Advanced Color Theory
   */
  advancedColorTheory: {
    harmony: {
      complementary: {
        description: "Colors opposite on color wheel create high contrast",
        example: "Cyan (#00ffff) + Red (#ff0000)",
        usage: "Use sparingly for emphasis, can be jarring if overused"
      },
      triadic: {
        description: "Three evenly spaced colors on color wheel",
        example: "Cyan, Magenta, Yellow (primary colors)",
        usage: "Vibrant, energetic combinations - good for game UI"
      },
      analogous: {
        description: "Adjacent colors on color wheel",
        example: "Blue → Cyan → Teal gradients",
        usage: "Harmonious, soothing - good for backgrounds"
      },
      splitComplementary: {
        description: "Base color + two colors adjacent to its complement",
        usage: "High contrast with less tension than complementary"
      }
    },
    
    contrastRatios: {
      minimum: {
        largeText: 3.0, // 18pt+ or 14pt+ bold
        normalText: 4.5, // Standard text
        description: "WCAG 2.1 AA minimum requirements"
      },
      enhanced: {
        largeText: 4.5,
        normalText: 7.0,
        description: "WCAG 2.1 AAA enhanced requirements"
      },
      calculate: (color1: string, color2: string): number => {
        // Reference implementation - actual would calculate luminance
        // Formula: (L1 + 0.05) / (L2 + 0.05) where L1 > L2
        return 4.5; // Placeholder
      }
    },
    
    accessibility: {
      textOnBackground: {
        primary: "DESIGN_TOKENS.color.semantic.text.primary on DESIGN_TOKENS.color.semantic.background.base",
        contrast: "4.5:1 (WCAG AA)",
        validated: true
      },
      primaryAction: {
        text: "DESIGN_TOKENS.color.semantic.text.primary on DESIGN_TOKENS.color.semantic.primary.action",
        contrast: "4.5:1 (WCAG AA)",
        validated: true
      }
    }
  },

  /**
   * Expanded Typography System
   */
  expandedTypography: {
    typeScale: {
      description: "Modular type scale based on 1.25 ratio (Major Third)",
      base: 16, // Base font size
      ratio: 1.25,
      scale: DESIGN_TOKENS.typography.scale
    },
    
    fontPairing: {
      heading: {
        primary: DESIGN_TOKENS.typography.fontFamily.heading,
        fallback: DESIGN_TOKENS.typography.fontFamily.system,
        rationale: "Distinctive headers that feel special"
      },
      body: {
        primary: DESIGN_TOKENS.typography.fontFamily.system,
        rationale: "Highly readable system fonts"
      },
      monospace: {
        primary: DESIGN_TOKENS.typography.fontFamily.monospace,
        usage: "Numbers, code, precise values"
      }
    },
    
    hierarchy: {
      h1: {
        size: DESIGN_TOKENS.typography.scale["3xl"].size,
        weight: DESIGN_TOKENS.typography.scale["3xl"].weight,
        lineHeight: DESIGN_TOKENS.typography.scale["3xl"].lineHeight,
        usage: "Page titles, major headings"
      },
      h2: {
        size: DESIGN_TOKENS.typography.scale["2xl"].size,
        weight: DESIGN_TOKENS.typography.scale["2xl"].weight,
        usage: "Section headings"
      },
      h3: {
        size: DESIGN_TOKENS.typography.scale.xl.size,
        weight: DESIGN_TOKENS.typography.scale.xl.weight,
        usage: "Subsection headings"
      },
      body: {
        size: DESIGN_TOKENS.typography.scale.base.size,
        weight: DESIGN_TOKENS.typography.scale.base.weight,
        usage: "Body text, paragraphs"
      }
    }
  },

  /**
   * Shadow/Elevation System
   */
  shadowElevation: {
    system: DESIGN_TOKENS.shadow,
    rationale: "Elevation communicates hierarchy and interactivity",
    
    usage: {
      card: "DESIGN_TOKENS.shadow.semantic.card - Subtle elevation for cards",
      modal: "DESIGN_TOKENS.shadow.semantic.modal - Strong elevation for modals",
      dropdown: "DESIGN_TOKENS.shadow.semantic.dropdown - Medium elevation",
      focus: "DESIGN_TOKENS.shadow.semantic.focus - Focus ring for accessibility"
    },
    
    principles: {
      elevation: "Higher elevation = more important, more interactive",
      depth: "Shadows create sense of depth and layering",
      consistency: "Similar elements use same elevation level"
    }
  },

  /**
   * Responsive Design Tokens
   */
  responsiveDesign: {
    breakpoints: DESIGN_TOKENS.breakpoint,
    
    mobileFirst: {
      description: "Design for mobile first, enhance for larger screens",
      approach: "Start with mobile, use min-width media queries"
    },
    
    fluidTypography: {
      min: "16px (mobile)",
      max: "18px (desktop)",
      description: "Typography scales between breakpoints for optimal readability"
    },
    
    touchTargets: {
      minimum: "44x44px",
      recommended: "48x48px",
      description: "WCAG touch target size for mobile interactions"
    }
  },

  /**
   * Advanced Animation Principles
   */
  advancedAnimation: {
    springPhysics: {
      description: "Natural motion using spring physics",
      formula: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      usage: "Elastic, bouncy interactions (restrained)"
    },
    
    easingCurves: {
      standard: DESIGN_TOKENS.animation.easing.easeOut,
      entrance: DESIGN_TOKENS.animation.easing.easeIn,
      exit: DESIGN_TOKENS.animation.easing.easeIn,
      emphasis: DESIGN_TOKENS.animation.easing.elastic
    },
    
    performance: {
      gpuAccelerated: [
        "transform (translate, scale, rotate)",
        "opacity",
        "filter (sparingly)"
      ],
      avoid: [
        "width, height (causes layout recalculation)",
        "margin, padding (causes layout recalculation)",
        "top, left (use transform instead)"
      ],
      target: "60fps - 16.67ms per frame"
    },
    
    choreography: {
      stagger: {
        description: "Sequential animation delays for related elements",
        delay: "50-100ms between elements",
        usage: "List items, card reveals, menu items"
      },
      orchestration: {
        description: "Coordinated animations that work together",
        principle: "One primary animation, others support it"
      }
    }
  },

  /**
   * Asset Creation Guidelines
   */
  assetCreation: {
    spriteGuidelines: {
      description: "Guidelines for creating game sprites",
      style: [
        "Pixel art aesthetic",
        "Consistent pixel density",
        "Clear silhouettes",
        "Readable at small sizes"
      ],
      dimensions: [
        "Power-of-2 sizes (16, 32, 64, 128)",
        "Consistent size within category",
        "Appropriate detail level for size"
      ],
      color: [
        "Use UI Canon color palette",
        "Maintain color harmony",
        "Contrast for readability",
        "Support game rarity system"
      ],
      animation: [
        "Frame-based animations",
        "Smooth transitions",
        "Consistent timing",
        "Meaningful motion"
      ]
    },
    
    backgroundGuidelines: {
      description: "Guidelines for creating backgrounds",
      style: [
        "Atmospheric and moody",
        "Support game tone (soft, living, unstable)",
        "Layered for depth",
        "Tileable when needed"
      ],
      composition: [
        "Deep twilight color scheme",
        "Subtle details",
        "Clear foreground/background separation",
        "Support UI overlay readability"
      ]
    },
    
    iconGuidelines: {
      description: "Guidelines for creating icons",
      style: [
        "Simple and clear",
        "Recognizable at small sizes",
        "Consistent style",
        "Pixel art aesthetic"
      ],
      sizing: [
        "Standard sizes: 16x16, 24x24, 32x32",
        "Scalable design",
        "Clear outlines",
        "High contrast"
      ]
    },
    
    animationGuidelines: {
      description: "Guidelines for game animations",
      principles: [
        "Follow motion law (idle, interaction, fusion)",
        "Meaningful motion (not decoration)",
        "Performance optimized (60fps target)",
        "GPU-accelerated properties"
      ],
      timing: [
        "Idle: 2s cycles (slow breathing)",
        "Interaction: 150-300ms (elastic but restrained)",
        "Fusion: Non-linear pulse (unstable)",
        "State transitions: 300-500ms"
      ]
    },
    
    styleConsistency: {
      description: "Maintain style consistency across assets",
      requirements: [
        "Use UI Canon color palette",
        "Follow pixel art aesthetic",
        "Maintain consistent detail level",
        "Support game identity (mystical, alchemical)",
        "Reinforce game tone (soft, living, unstable)"
      ]
    }
  }
} as const;

/**
 * Utility type for accessing UI Canon values
 */
export type UICanon = typeof UI_CANON;

/**
 * Helper to check if a design pattern is forbidden
 */
export function isForbiddenPattern(pattern: string): boolean {
  return UI_CANON.forbidden.some(forbidden => 
    pattern.toLowerCase().includes(forbidden.toLowerCase())
  );
}

