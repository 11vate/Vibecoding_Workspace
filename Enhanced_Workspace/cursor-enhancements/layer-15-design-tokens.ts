/**
 * LAYER 15 — DESIGN TOKEN SYSTEM
 * 
 * Systematic design tokens for consistent, scalable design implementation
 * 
 * This layer provides a comprehensive design token system that enables:
 * - Consistent design across all components
 * - Easy theming and customization
 * - Scalable design system
 * - Type-safe design values
 * - CSS variable generation
 */

/**
 * Color token structure
 */
export interface ColorTokens {
  semantic: {
    primary: {
      action: string;
      surface: string;
      text: string;
      border: string;
    };
    secondary: {
      action: string;
      surface: string;
      text: string;
      border: string;
    };
    accent: {
      action: string;
      surface: string;
      text: string;
      border: string;
    };
    background: {
      base: string;
      elevated: string;
      overlay: string;
    };
    surface: {
      base: string;
      elevated: string;
      interactive: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      inverse: string;
    };
    border: {
      default: string;
      focus: string;
      error: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  palette: {
    // Base colors from UI Canon
    cyan: string;
    magenta: string;
    teal: string;
    red: string;
    orange: string;
    green: string;
  };
  fusion: {
    unstable: string;
    energy: string;
  };
  mythic: {
    glow: string;
    prismatic: string;
    omega: string;
  };
  rarity: {
    basic: string;
    rare: string;
    sr: string;
    legendary: string;
    mythic: string;
    prismatic: string;
    omega: string;
  };
}

/**
 * Spacing token structure
 */
export interface SpacingTokens {
  scale: number[]; // 8px rhythm-based scale
  semantic: {
    xs: string;   // 4px (0.5 rhythm)
    sm: string;   // 8px (1 rhythm)
    md: string;   // 16px (2 rhythm)
    lg: string;   // 24px (3 rhythm)
    xl: string;   // 32px (4 rhythm)
    xxl: string;  // 48px (6 rhythm)
    xxxl: string; // 64px (8 rhythm)
  };
  component: {
    button: {
      paddingX: string;
      paddingY: string;
      gap: string;
    };
    card: {
      padding: string;
      gap: string;
    };
    input: {
      paddingX: string;
      paddingY: string;
    };
  };
}

/**
 * Typography token structure
 */
export interface TypographyTokens {
  fontFamily: {
    system: string;
    heading: string;
    monospace: string;
  };
  scale: {
    xs: { size: string; lineHeight: number; weight: number };
    sm: { size: string; lineHeight: number; weight: number };
    base: { size: string; lineHeight: number; weight: number };
    lg: { size: string; lineHeight: number; weight: number };
    xl: { size: string; lineHeight: number; weight: number };
    "2xl": { size: string; lineHeight: number; weight: number };
    "3xl": { size: string; lineHeight: number; weight: number };
    "4xl": { size: string; lineHeight: number; weight: number };
  };
  semantic: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    body: string;
    small: string;
    caption: string;
  };
}

/**
 * Shadow/elevation token structure
 */
export interface ShadowTokens {
  elevation: {
    none: string;
    sm: string;   // Subtle elevation (cards)
    md: string;   // Medium elevation (modals)
    lg: string;   // Large elevation (dropdowns)
    xl: string;   // Extra large (overlays)
  };
  semantic: {
    card: string;
    modal: string;
    dropdown: string;
    tooltip: string;
    focus: string;
  };
}

/**
 * Border radius token structure
 */
export interface BorderRadiusTokens {
  scale: {
    none: string;
    sm: string;   // 4px
    md: string;   // 8px
    lg: string;   // 12px
    xl: string;   // 16px
    full: string; // 50%
  };
  semantic: {
    button: string;
    card: string;
    input: string;
    modal: string;
    badge: string;
  };
}

/**
 * Animation timing token structure
 */
export interface AnimationTokens {
  duration: {
    instant: string;  // 0ms
    fast: string;     // 150ms
    normal: string;   // 300ms
    slow: string;     // 500ms
    slower: string;   // 800ms
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    elastic: string;
  };
  semantic: {
    idle: string;        // 2s
    interaction: string; // 150-300ms
    fusion: string;      // 500ms
    glitch: string;      // 100-200ms
  };
}

/**
 * Breakpoint token structure
 */
export interface BreakpointTokens {
  mobile: string;    // 0px
  tablet: string;    // 768px
  desktop: string;   // 1024px
  wide: string;      // 1280px
  ultra: string;     // 1920px
}

/**
 * Z-index scale
 */
export interface ZIndexTokens {
  scale: {
    base: number;
    elevated: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    overlay: number;
    tooltip: number;
    maximum: number;
  };
  semantic: {
    card: number;
    dropdown: number;
    modal: number;
    overlay: number;
    tooltip: number;
  };
}

/**
 * Main design token system
 */
export const DESIGN_TOKENS = {
  /**
   * Color tokens - semantic color system
   */
  color: {
    semantic: {
      primary: {
        action: "#00ffff",    // Bright Cyan - primary actions
        surface: "#16213e",   // Dark Navy - primary surfaces
        text: "#ffffff",      // White text on primary
        border: "#00ffff"     // Cyan border
      },
      secondary: {
        action: "#ff00ff",    // Bright Magenta - secondary actions
        surface: "#1a1a2e",   // Dark Navy Blue - secondary surfaces
        text: "#ffffff",      // White text
        border: "#ff00ff"     // Magenta border
      },
      accent: {
        action: "#4ecca3",    // Mint Teal - accent actions
        surface: "#0f3460",   // Deepest Blue - accent surfaces
        text: "#ffffff",      // White text
        border: "#4ecca3"     // Teal border
      },
      background: {
        base: "#1a1a2e",      // Dark Navy Blue - main background
        elevated: "#16213e",  // Darker Navy - elevated backgrounds
        overlay: "rgba(0, 0, 0, 0.8)" // Overlay backgrounds
      },
      surface: {
        base: "#16213e",      // Panel background
        elevated: "#0f3460",  // Elevated surfaces
        interactive: "rgba(0, 255, 255, 0.1)" // Interactive surface states
      },
      text: {
        primary: "#ffffff",   // White - main text
        secondary: "#cccccc", // Light Gray - secondary text
        tertiary: "#888888",  // Gray - tertiary text
        disabled: "#555555",  // Dark Gray - disabled text
        inverse: "#000000"    // Black - text on light backgrounds
      },
      border: {
        default: "rgba(255, 255, 255, 0.2)", // Default borders
        focus: "#00ffff",     // Focus border (cyan)
        error: "#ff0000"      // Error border (red)
      },
      status: {
        success: "#00ff00",   // Green
        warning: "#ffaa00",   // Orange
        error: "#ff0000",     // Red
        info: "#00ffff"       // Cyan
      }
    },
    palette: {
      cyan: "#00ffff",
      magenta: "#ff00ff",
      teal: "#4ecca3",
      red: "#ff0000",
      orange: "#ffaa00",
      green: "#00ff00"
    },
    fusion: {
      unstable: "#aa00ff",    // Violet - unstable alchemy
      energy: "#00ffff"       // Cyan - transformation energy
    },
    mythic: {
      glow: "#ff00ff",        // Magenta - off-spectrum glow
      prismatic: "#ffffff",   // White - pure light
      omega: "#ff0080"        // Pink - ultimate power
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
  } as ColorTokens,

  /**
   * Spacing tokens - 8px rhythm system
   */
  spacing: {
    scale: [4, 8, 12, 16, 24, 32, 48, 64], // 8px-based scale
    semantic: {
      xs: "4px",   // 0.5 rhythm
      sm: "8px",   // 1 rhythm
      md: "16px",  // 2 rhythm
      lg: "24px",  // 3 rhythm
      xl: "32px",  // 4 rhythm
      xxl: "48px", // 6 rhythm
      xxxl: "64px" // 8 rhythm
    },
    component: {
      button: {
        paddingX: "16px",
        paddingY: "12px",
        gap: "8px"
      },
      card: {
        padding: "16px",
        gap: "12px"
      },
      input: {
        paddingX: "12px",
        paddingY: "10px"
      }
    }
  } as SpacingTokens,

  /**
   * Typography tokens - modular type scale
   */
  typography: {
    fontFamily: {
      system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      heading: "system-ui, -apple-system, sans-serif", // Pixel-serif for headers
      monospace: "'Courier New', Courier, monospace"
    },
    scale: {
      xs: { size: "12px", lineHeight: 1.4, weight: 400 },
      sm: { size: "14px", lineHeight: 1.5, weight: 400 },
      base: { size: "16px", lineHeight: 1.5, weight: 400 },
      lg: { size: "18px", lineHeight: 1.4, weight: 500 },
      xl: { size: "20px", lineHeight: 1.4, weight: 600 },
      "2xl": { size: "24px", lineHeight: 1.3, weight: 600 },
      "3xl": { size: "32px", lineHeight: 1.2, weight: 700 },
      "4xl": { size: "48px", lineHeight: 1.1, weight: 700 }
    },
    semantic: {
      h1: "typography.scale.3xl", // 32px
      h2: "typography.scale.2xl", // 24px
      h3: "typography.scale.xl",  // 20px
      h4: "typography.scale.lg",  // 18px
      body: "typography.scale.base", // 16px
      small: "typography.scale.sm",  // 14px
      caption: "typography.scale.xs" // 12px
    }
  } as TypographyTokens,

  /**
   * Shadow/elevation tokens
   */
  shadow: {
    elevation: {
      none: "none",
      sm: "0 2px 4px rgba(0, 0, 0, 0.2)",      // Subtle elevation
      md: "0 4px 8px rgba(0, 0, 0, 0.3)",      // Medium elevation
      lg: "0 8px 16px rgba(0, 0, 0, 0.3)",     // Large elevation
      xl: "0 16px 32px rgba(0, 0, 0, 0.4)"     // Extra large elevation
    },
    semantic: {
      card: "0 4px 8px rgba(0, 0, 0, 0.3)",
      modal: "0 16px 32px rgba(0, 0, 0, 0.4)",
      dropdown: "0 8px 16px rgba(0, 0, 0, 0.3)",
      tooltip: "0 4px 8px rgba(0, 0, 0, 0.3)",
      focus: "0 0 0 3px rgba(0, 255, 255, 0.3)" // Focus ring
    }
  } as ShadowTokens,

  /**
   * Border radius tokens
   */
  borderRadius: {
    scale: {
      none: "0",
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "16px",
      full: "50%"
    },
    semantic: {
      button: "8px",
      card: "12px",
      input: "8px",
      modal: "12px",
      badge: "16px"
    }
  } as BorderRadiusTokens,

  /**
   * Animation timing tokens
   */
  animation: {
    duration: {
      instant: "0ms",
      fast: "150ms",     // Micro-interactions
      normal: "300ms",   // Standard transitions
      slow: "500ms",     // Major transitions
      slower: "800ms"    // Dramatic transitions
    },
    easing: {
      linear: "linear",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    },
    semantic: {
      idle: "2s",           // Slow breathing
      interaction: "200ms", // Elastic but restrained
      fusion: "500ms",      // Non-linear pulse
      glitch: "150ms"       // Brief distortions
    }
  } as AnimationTokens,

  /**
   * Breakpoint tokens - mobile-first
   */
  breakpoint: {
    mobile: "0px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
    ultra: "1920px"
  } as BreakpointTokens,

  /**
   * Z-index scale
   */
  zIndex: {
    scale: {
      base: 0,
      elevated: 10,
      dropdown: 100,
      sticky: 200,
      fixed: 300,
      modal: 10000,
      overlay: 9999,
      tooltip: 10001,
      maximum: 2147483647
    },
    semantic: {
      card: 0,
      dropdown: 100,
      modal: 10000,
      overlay: 9999,
      tooltip: 10001
    }
  } as ZIndexTokens,

  /**
   * Asset dimension tokens
   */
  asset: {
    sprite: {
      small: "16px",
      medium: "32px",
      large: "64px",
      xlarge: "128px"
    },
    icon: {
      xs: "16px",
      sm: "24px",
      md: "32px",
      lg: "48px",
      xl: "64px"
    },
    background: {
      small: "256px",
      medium: "512px",
      large: "1024px",
      xlarge: "2048px"
    },
    tile: {
      standard: "32px",
      large: "64px"
    }
  },

  /**
   * Sprite sheet configuration tokens
   */
  spriteSheet: {
    cellPadding: "1px",
    defaultCellSize: "32px",
    maxSheetSize: "2048px",
    powerOfTwo: true
  },

  /**
   * Animation timing tokens for game animations
   */
  gameAnimation: {
    sprite: {
      frameRate: "8-12 fps",
      idleCycle: "2s",
      walkCycle: "0.5s",
      attackDuration: "0.3s"
    },
    effect: {
      quick: "0.1s",
      normal: "0.3s",
      slow: "0.5s"
    }
  }
} as const;

/**
 * Generate CSS variables from design tokens
 */
export function generateCSSVariables(tokens: typeof DESIGN_TOKENS): string {
  const variables: string[] = [];
  
  // Color variables
  Object.entries(tokens.color.semantic).forEach(([category, values]) => {
    if (typeof values === 'object' && values !== null) {
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'string') {
          variables.push(`  --color-${category}-${key}: ${value};`);
        } else if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (typeof subValue === 'string') {
              variables.push(`  --color-${category}-${key}-${subKey}: ${subValue};`);
            }
          });
        }
      });
    }
  });
  
  // Spacing variables
  Object.entries(tokens.spacing.semantic).forEach(([key, value]) => {
    variables.push(`  --spacing-${key}: ${value};`);
  });
  
  // Typography variables
  Object.entries(tokens.typography.scale).forEach(([key, value]) => {
    variables.push(`  --font-size-${key}: ${value.size};`);
    variables.push(`  --line-height-${key}: ${value.lineHeight};`);
    variables.push(`  --font-weight-${key}: ${value.weight};`);
  });
  
  // Shadow variables
  Object.entries(tokens.shadow.semantic).forEach(([key, value]) => {
    variables.push(`  --shadow-${key}: ${value};`);
  });
  
  // Border radius variables
  Object.entries(tokens.borderRadius.semantic).forEach(([key, value]) => {
    variables.push(`  --radius-${key}: ${value};`);
  });
  
  // Animation variables
  Object.entries(tokens.animation.duration).forEach(([key, value]) => {
    variables.push(`  --duration-${key}: ${value};`);
  });
  
  Object.entries(tokens.animation.easing).forEach(([key, value]) => {
    variables.push(`  --easing-${key}: ${value};`);
  });
  
  return `:root {\n${variables.join('\n')}\n}`;
}

/**
 * Get token value by path
 * Example: getTokenValue('color.semantic.primary.action') => '#00ffff'
 */
export function getTokenValue(path: string): string | number | undefined {
  const parts = path.split('.');
  let value: any = DESIGN_TOKENS;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part as keyof typeof value];
    } else {
      return undefined;
    }
  }
  
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}

/**
 * Type exports
 */
export type { 
  ColorTokens, 
  SpacingTokens, 
  TypographyTokens, 
  ShadowTokens, 
  BorderRadiusTokens, 
  AnimationTokens, 
  BreakpointTokens, 
  ZIndexTokens 
};

