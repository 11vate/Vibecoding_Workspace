/**
 * Design Tokens
 * Centralized design system tokens for the application
 */

export const DESIGN_TOKENS = {
  /**
   * Color tokens - semantic color system
   */
  color: {
    semantic: {
      primary: {
        action: '#00ffff', // Bright Cyan - primary actions
        hover: '#00cccc',
        active: '#009999',
      },
      secondary: {
        action: '#ff00ff', // Bright Magenta - secondary actions
        hover: '#cc00cc',
        active: '#990099',
      },
      accent: {
        action: '#4ecca3', // Mint Teal - accent, success
        hover: '#3db88a',
        active: '#2d9470',
      },
      background: {
        primary: '#1a1a2e', // Dark Navy Blue - main background
        panel: '#16213e', // Darker Navy Blue - panels, cards
        accent: '#0f3460', // Deepest Blue - hover, active
        overlay: 'rgba(0, 0, 0, 0.8)',
      },
      surface: {
        base: '#16213e', // Panel background
        elevated: '#0f3460', // Elevated surfaces
        interactive: 'rgba(0, 255, 255, 0.1)', // Interactive states
      },
      text: {
        primary: '#ffffff', // White - main text
        secondary: '#cccccc', // Light Gray - secondary text
        tertiary: '#888888', // Gray - tertiary text
        disabled: '#555555', // Dark Gray - disabled
        inverse: '#000000', // Black - text on light
      },
      border: {
        default: 'rgba(255, 255, 255, 0.2)',
        focus: '#00ffff', // Focus border (cyan)
        error: '#ff0000', // Error border (red)
      },
      status: {
        success: '#00ff00', // Green
        warning: '#ffaa00', // Orange
        error: '#ff0000', // Red
        info: '#00ffff', // Cyan
      },
    },
    palette: {
      cyan: '#00ffff',
      magenta: '#ff00ff',
      teal: '#4ecca3',
      red: '#ff0000',
      orange: '#ffaa00',
      green: '#00ff00',
    },
    fusion: {
      unstable: '#aa00ff', // Violet - unstable alchemy
      energy: '#00ffff', // Cyan - transformation energy
    },
    mythic: {
      glow: '#ff00ff', // Magenta - off-spectrum glow
      prismatic: '#ffffff', // White - pure light
      omega: '#ff0080', // Pink - ultimate power
    },
    rarity: {
      basic: '#808080',
      rare: '#0088ff',
      sr: '#aa00ff',
      legendary: '#ffaa00',
      mythic: '#ff00ff',
      prismatic: '#ffffff',
      omega: '#ff0080',
    },
  },

  /**
   * Spacing tokens - 8px rhythm system
   */
  spacing: {
    scale: [4, 8, 12, 16, 24, 32, 48, 64], // 8px-based scale
    semantic: {
      xs: '4px', // 0.5 rhythm
      sm: '8px', // 1 rhythm
      md: '16px', // 2 rhythm
      lg: '24px', // 3 rhythm
      xl: '32px', // 4 rhythm
      xxl: '48px', // 6 rhythm
      xxxl: '64px', // 8 rhythm
    },
    component: {
      button: {
        paddingX: '16px',
        paddingY: '12px',
        gap: '8px',
      },
      card: {
        padding: '16px',
        gap: '12px',
      },
      input: {
        paddingX: '12px',
        paddingY: '10px',
      },
    },
  },

  /**
   * Typography tokens - modular type scale
   */
  typography: {
    scale: {
      xs: { size: '12px', lineHeight: '16px', weight: '400' },
      sm: { size: '14px', lineHeight: '20px', weight: '400' },
      md: { size: '16px', lineHeight: '24px', weight: '400' },
      lg: { size: '20px', lineHeight: '28px', weight: '500' },
      xl: { size: '24px', lineHeight: '32px', weight: '500' },
      xxl: { size: '32px', lineHeight: '40px', weight: '600' },
      xxxl: { size: '40px', lineHeight: '48px', weight: '700' },
    },
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
  },

  /**
   * Shadow tokens
   */
  shadow: {
    semantic: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 4px 8px rgba(0, 0, 0, 0.4)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.6)',
      glow: '0 0 8px rgba(0, 255, 255, 0.5)',
      glowStrong: '0 0 16px rgba(0, 255, 255, 0.8)',
    },
  },

  /**
   * Border radius tokens
   */
  borderRadius: {
    semantic: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
  },

  /**
   * Animation tokens
   */
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

/**
 * Generate CSS variables from design tokens
 */
export function generateCSSVariables(): string {
  const variables: string[] = [];

  // Color variables
  Object.entries(DESIGN_TOKENS.color.semantic).forEach(([category, values]) => {
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

  // Palette colors
  Object.entries(DESIGN_TOKENS.color.palette).forEach(([key, value]) => {
    variables.push(`  --color-palette-${key}: ${value};`);
  });

  // Fusion colors
  Object.entries(DESIGN_TOKENS.color.fusion).forEach(([key, value]) => {
    variables.push(`  --color-fusion-${key}: ${value};`);
  });

  // Mythic colors
  Object.entries(DESIGN_TOKENS.color.mythic).forEach(([key, value]) => {
    variables.push(`  --color-mythic-${key}: ${value};`);
  });

  // Rarity colors
  Object.entries(DESIGN_TOKENS.color.rarity).forEach(([key, value]) => {
    variables.push(`  --color-rarity-${key}: ${value};`);
  });

  // Spacing variables
  Object.entries(DESIGN_TOKENS.spacing.semantic).forEach(([key, value]) => {
    variables.push(`  --spacing-${key}: ${value};`);
  });

  // Component spacing
  Object.entries(DESIGN_TOKENS.spacing.component).forEach(([component, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      variables.push(`  --spacing-${component}-${key}: ${value};`);
    });
  });

  // Typography variables
  Object.entries(DESIGN_TOKENS.typography.scale).forEach(([key, value]) => {
    variables.push(`  --font-size-${key}: ${value.size};`);
    variables.push(`  --line-height-${key}: ${value.lineHeight};`);
    variables.push(`  --font-weight-${key}: ${value.weight};`);
  });

  // Font family
  variables.push(`  --font-family-primary: ${DESIGN_TOKENS.typography.fontFamily.primary};`);
  variables.push(`  --font-family-mono: ${DESIGN_TOKENS.typography.fontFamily.mono};`);

  // Shadow variables
  Object.entries(DESIGN_TOKENS.shadow.semantic).forEach(([key, value]) => {
    variables.push(`  --shadow-${key}: ${value};`);
  });

  // Border radius variables
  Object.entries(DESIGN_TOKENS.borderRadius.semantic).forEach(([key, value]) => {
    variables.push(`  --radius-${key}: ${value};`);
  });

  // Animation variables
  Object.entries(DESIGN_TOKENS.animation.duration).forEach(([key, value]) => {
    variables.push(`  --duration-${key}: ${value};`);
  });

  Object.entries(DESIGN_TOKENS.animation.easing).forEach(([key, value]) => {
    variables.push(`  --easing-${key}: ${value};`);
  });

  return `:root {\n${variables.join('\n')}\n}`;
}














