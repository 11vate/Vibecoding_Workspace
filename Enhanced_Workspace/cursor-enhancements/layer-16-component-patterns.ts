/**
 * LAYER 16 — COMPONENT DESIGN PATTERNS
 * 
 * Comprehensive component design patterns library
 * 
 * This layer provides complete component design patterns including structure,
 * states, variants, accessibility requirements, and code examples for all
 * common UI components.
 */

import { DESIGN_TOKENS } from './layer-15-design-tokens';

/**
 * Component variant
 */
export type ComponentVariant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";

/**
 * Component size
 */
export type ComponentSize = "small" | "medium" | "large";

/**
 * Component state
 */
export type ComponentState = "default" | "hover" | "active" | "disabled" | "focus" | "loading";

/**
 * Component anatomy structure
 */
export interface ComponentAnatomy {
  structure: string[];
  required: string[];
  optional: string[];
  slots?: string[];
}

/**
 * Accessibility requirements
 */
export interface AccessibilityRequirements {
  keyboard: string[];
  screenReader: string[];
  focus: string[];
  aria?: {
    roles?: string[];
    attributes?: Record<string, string>;
  };
}

/**
 * Component pattern definition
 */
export interface ComponentPattern {
  name: string;
  description: string;
  anatomy: ComponentAnatomy;
  variants?: ComponentVariant[];
  sizes?: ComponentSize[];
  states: Record<ComponentState, {
    styles: Record<string, string>;
    description: string;
  }>;
  accessibility: AccessibilityRequirements;
  usage: {
    when: string[];
    whenNot: string[];
    examples: string[];
  };
  codeExample?: string;
}

/**
 * Main component patterns library
 */
export const COMPONENT_PATTERNS = {
  /**
   * Button component patterns
   */
  button: {
    name: "Button",
    description: "Interactive button for user actions",
    anatomy: {
      structure: ["container", "icon (optional)", "label", "loading indicator (optional)"],
      required: ["container", "label"],
      optional: ["icon", "loading indicator"],
      slots: ["startIcon", "endIcon", "children"]
    },
    variants: ["primary", "secondary", "tertiary", "ghost", "danger"],
    sizes: ["small", "medium", "large"],
    states: {
      default: {
        styles: {
          backgroundColor: "DESIGN_TOKENS.color.semantic.primary.action",
          color: "DESIGN_TOKENS.color.semantic.text.primary",
          padding: "DESIGN_TOKENS.spacing.component.button.paddingY DESIGN_TOKENS.spacing.component.button.paddingX",
          borderRadius: "DESIGN_TOKENS.borderRadius.semantic.button",
          border: "none",
          cursor: "pointer"
        },
        description: "Default interactive state"
      },
      hover: {
        styles: {
          opacity: "0.9",
          transform: "translateY(-2px)",
          boxShadow: "DESIGN_TOKENS.shadow.semantic.card"
        },
        description: "Hover state with slight elevation"
      },
      active: {
        styles: {
          opacity: "0.8",
          transform: "translateY(0)"
        },
        description: "Pressed state"
      },
      disabled: {
        styles: {
          opacity: "0.5",
          cursor: "not-allowed",
          pointerEvents: "none"
        },
        description: "Disabled state - non-interactive"
      },
      focus: {
        styles: {
          outline: "2px solid DESIGN_TOKENS.color.semantic.border.focus",
          outlineOffset: "2px"
        },
        description: "Focus state for keyboard navigation"
      },
      loading: {
        styles: {
          opacity: "0.7",
          cursor: "wait"
        },
        description: "Loading state with spinner"
      }
    },
    accessibility: {
      keyboard: [
        "Enter or Space activates button",
        "Focus visible with outline",
        "Disabled buttons not focusable"
      ],
      screenReader: [
        "Button has accessible label",
        "Loading state announced",
        "Disabled state announced"
      ],
      focus: [
        "Visible focus indicator",
        "Focus ring uses DESIGN_TOKENS.shadow.semantic.focus"
      ],
      aria: {
        roles: ["button"],
        attributes: {
          "aria-disabled": "true when disabled",
          "aria-busy": "true when loading"
        }
      }
    },
    usage: {
      when: [
        "User needs to trigger an action",
        "Confirming or submitting forms",
        "Navigating to new views",
        "Primary and secondary actions"
      ],
      whenNot: [
        "For links (use <a> tag)",
        "For toggle states (use checkbox/toggle)",
        "For navigation (use nav links)"
      ],
      examples: [
        "Submit fusion",
        "Start dungeon",
        "Confirm action",
        "Cancel operation"
      ]
    }
  } as ComponentPattern,

  /**
   * Card component patterns
   */
  card: {
    name: "Card",
    description: "Container for related content with elevation",
    anatomy: {
      structure: ["container", "header (optional)", "content", "footer (optional)"],
      required: ["container", "content"],
      optional: ["header", "footer", "image", "actions"],
      slots: ["header", "content", "footer", "actions"]
    },
    variants: ["default", "elevated", "outlined"],
    sizes: ["small", "medium", "large"],
    states: {
      default: {
        styles: {
          backgroundColor: "DESIGN_TOKENS.color.semantic.surface.base",
          borderRadius: "DESIGN_TOKENS.borderRadius.semantic.card",
          padding: "DESIGN_TOKENS.spacing.component.card.padding",
          boxShadow: "DESIGN_TOKENS.shadow.semantic.card"
        },
        description: "Default card appearance"
      },
      hover: {
        styles: {
          boxShadow: "DESIGN_TOKENS.shadow.elevation.md",
          transform: "translateY(-4px)"
        },
        description: "Elevated on hover (if clickable)"
      },
      active: {
        styles: {
          boxShadow: "DESIGN_TOKENS.shadow.elevation.sm"
        },
        description: "Pressed state (if clickable)"
      },
      disabled: {
        styles: {
          opacity: "0.6",
          pointerEvents: "none"
        },
        description: "Disabled state"
      },
      focus: {
        styles: {
          outline: "2px solid DESIGN_TOKENS.color.semantic.border.focus",
          outlineOffset: "2px"
        },
        description: "Focus state for keyboard navigation"
      },
      loading: {
        styles: {
          opacity: "0.7"
        },
        description: "Loading content state"
      }
    },
    accessibility: {
      keyboard: [
        "If clickable, Enter or Space activates",
        "Tab navigates to interactive elements inside"
      ],
      screenReader: [
        "Card has semantic structure",
        "Heading hierarchy maintained",
        "Content groups labeled appropriately"
      ],
      focus: [
        "Focus moves to first interactive element",
        "Card container focusable if entire card is clickable"
      ]
    },
    usage: {
      when: [
        "Grouping related content",
        "Displaying pet information",
        "Showing collection items",
        "Presenting data in digestible chunks"
      ],
      whenNot: [
        "For simple containers (use div)",
        "For modals (use modal pattern)",
        "For lists (use list pattern)"
      ],
      examples: [
        "Pet card",
        "Fusion slot card",
        "Team member card",
        "Dungeon floor card"
      ]
    }
  } as ComponentPattern,

  /**
   * Input component patterns
   */
  input: {
    name: "Input",
    description: "Text input field for user data entry",
    anatomy: {
      structure: ["container", "label", "input", "helper text (optional)", "error message (optional)"],
      required: ["container", "input"],
      optional: ["label", "helper text", "error message", "icon"],
      slots: ["startIcon", "endIcon", "label", "helperText", "errorMessage"]
    },
    variants: ["default", "error", "success"],
    sizes: ["small", "medium", "large"],
    states: {
      default: {
        styles: {
          backgroundColor: "DESIGN_TOKENS.color.semantic.background.base",
          border: "1px solid DESIGN_TOKENS.color.semantic.border.default",
          borderRadius: "DESIGN_TOKENS.borderRadius.semantic.input",
          padding: "DESIGN_TOKENS.spacing.component.input.paddingY DESIGN_TOKENS.spacing.component.input.paddingX",
          color: "DESIGN_TOKENS.color.semantic.text.primary"
        },
        description: "Default input state"
      },
      hover: {
        styles: {
          borderColor: "DESIGN_TOKENS.color.semantic.primary.action"
        },
        description: "Hover state"
      },
      active: {
        styles: {
          borderColor: "DESIGN_TOKENS.color.semantic.primary.action",
          outline: "none"
        },
        description: "Active/focused state"
      },
      disabled: {
        styles: {
          opacity: "0.5",
          cursor: "not-allowed",
          backgroundColor: "DESIGN_TOKENS.color.semantic.surface.base"
        },
        description: "Disabled state"
      },
      focus: {
        styles: {
          borderColor: "DESIGN_TOKENS.color.semantic.border.focus",
          boxShadow: "DESIGN_TOKENS.shadow.semantic.focus"
        },
        description: "Focus state with ring"
      },
      loading: {
        styles: {
          opacity: "0.7"
        },
        description: "Loading/validating state"
      }
    },
    accessibility: {
      keyboard: [
        "Tab navigates to input",
        "Arrow keys navigate options (if select/autocomplete)",
        "Escape closes dropdown (if applicable)"
      ],
      screenReader: [
        "Label associated with input (for/id or aria-label)",
        "Helper text associated with aria-describedby",
        "Error message announced",
        "Required state announced"
      ],
      focus: [
        "Clear focus indicator",
        "Focus ring visible"
      ],
      aria: {
        roles: ["textbox", "combobox", "searchbox"],
        attributes: {
          "aria-required": "true if required",
          "aria-invalid": "true if error",
          "aria-describedby": "ID of helper/error text"
        }
      }
    },
    usage: {
      when: [
        "User needs to enter text",
        "Form data entry",
        "Search functionality",
        "Filtering or sorting"
      ],
      whenNot: [
        "For selecting from predefined options (use select)",
        "For toggles (use checkbox/switch)",
        "For dates (use date picker)"
      ],
      examples: [
        "Team name input",
        "Search pets",
        "Filter collection",
        "Fusion intent input"
      ]
    }
  } as ComponentPattern,

  /**
   * Navigation component patterns
   */
  navigation: {
    name: "Navigation",
    description: "Navigation menu for app sections",
    anatomy: {
      structure: ["nav container", "nav items", "active indicator"],
      required: ["nav container", "nav items"],
      optional: ["active indicator", "badge", "icon"],
      slots: ["items", "item"]
    },
    variants: ["tabs", "menu", "breadcrumbs"],
    sizes: ["small", "medium", "large"],
    states: {
      default: {
        styles: {
          backgroundColor: "DESIGN_TOKENS.color.semantic.background.elevated",
          display: "flex",
          gap: "DESIGN_TOKENS.spacing.semantic.sm"
        },
        description: "Default navigation appearance"
      },
      hover: {
        styles: {
          backgroundColor: "DESIGN_TOKENS.color.semantic.surface.interactive"
        },
        description: "Nav item hover state"
      },
      active: {
        styles: {
          backgroundColor: "DESIGN_TOKENS.color.semantic.accent.surface",
          color: "DESIGN_TOKENS.color.semantic.accent.action",
          borderBottom: "2px solid DESIGN_TOKENS.color.semantic.accent.action"
        },
        description: "Active/current page indicator"
      },
      disabled: {
        styles: {
          opacity: "0.5",
          pointerEvents: "none"
        },
        description: "Disabled nav item"
      },
      focus: {
        styles: {
          outline: "2px solid DESIGN_TOKENS.color.semantic.border.focus",
          outlineOffset: "2px"
        },
        description: "Focus state for keyboard navigation"
      },
      loading: {
        styles: {
          opacity: "0.7"
        },
        description: "Loading navigation state"
      }
    },
    accessibility: {
      keyboard: [
        "Tab navigates between items",
        "Arrow keys navigate within navigation",
        "Enter or Space activates item",
        "Home/End jump to first/last item"
      ],
      screenReader: [
        "Nav element with aria-label",
        "Current page indicated with aria-current='page'",
        "Item labels clear and descriptive"
      ],
      focus: [
        "Visible focus indicator",
        "Focus order follows visual order"
      ],
      aria: {
        roles: ["navigation"],
        attributes: {
          "aria-label": "Navigation purpose",
          "aria-current": "page for current item"
        }
      }
    },
    usage: {
      when: [
        "App-wide navigation",
        "Section navigation",
        "Tabbed interfaces",
        "Breadcrumb trails"
      ],
      whenNot: [
        "For actions (use buttons)",
        "For dropdowns (use menu component)",
        "For single links (use anchor tag)"
      ],
      examples: [
        "Main app navigation",
        "Collection/Fusion/Battle tabs",
        "Breadcrumb navigation",
        "Tab navigation"
      ]
    }
  } as ComponentPattern,

  /**
   * Toast/Notification component patterns
   */
  toast: {
    name: "Toast",
    description: "Temporary notification message",
    anatomy: {
      structure: ["container", "icon (optional)", "message", "close button (optional)"],
      required: ["container", "message"],
      optional: ["icon", "close button", "action button"],
      slots: ["icon", "message", "action", "close"]
    },
    variants: ["success", "error", "warning", "info"],
    sizes: ["small", "medium"],
    states: {
      default: {
        styles: {
          backgroundColor: "DESIGN_TOKENS.color.semantic.surface.elevated",
          borderRadius: "DESIGN_TOKENS.borderRadius.semantic.modal",
          padding: "DESIGN_TOKENS.spacing.semantic.md",
          boxShadow: "DESIGN_TOKENS.shadow.semantic.modal",
          color: "DESIGN_TOKENS.color.semantic.text.primary"
        },
        description: "Default toast appearance"
      },
      hover: {
        styles: {
          boxShadow: "DESIGN_TOKENS.shadow.elevation.lg"
        },
        description: "Hover state (if interactive)"
      },
      active: {
        styles: {},
        description: "Active state"
      },
      disabled: {
        styles: {},
        description: "N/A for toast"
      },
      focus: {
        styles: {
          outline: "2px solid DESIGN_TOKENS.color.semantic.border.focus"
        },
        description: "Focus state (if closeable)"
      },
      loading: {
        styles: {},
        description: "N/A for toast"
      }
    },
    accessibility: {
      keyboard: [
        "Escape closes toast",
        "Close button focusable with keyboard"
      ],
      screenReader: [
        "Toast announced when appears",
        "Role='alert' or 'status'",
        "Message content read aloud"
      ],
      focus: [
        "Focus moves to toast (or stays in context)",
        "Close button focusable"
      ],
      aria: {
        roles: ["alert", "status"],
        attributes: {
          "aria-live": "polite for info, assertive for errors"
        }
      }
    },
    usage: {
      when: [
        "Temporary success/error messages",
        "Action feedback",
        "Non-blocking notifications",
        "System status updates"
      ],
      whenNot: [
        "For critical errors (use modal)",
        "For complex content (use modal)",
        "For persistent messages (use banner)"
      ],
      examples: [
        "Fusion successful",
        "Error saving team",
        "Pet summoned",
        "Dungeon completed"
      ]
    }
  } as ComponentPattern,

  /**
   * Modal component patterns
   */
  modal: {
    name: "Modal",
    description: "Overlay dialog for focused interactions",
    anatomy: {
      structure: ["overlay", "modal container", "header", "content", "footer (optional)"],
      required: ["overlay", "modal container", "content"],
      optional: ["header", "footer", "close button"],
      slots: ["header", "content", "footer", "close"]
    },
    variants: ["default", "fullscreen", "drawer"],
    sizes: ["small", "medium", "large"],
    states: {
      default: {
        styles: {
          overlay: {
            backgroundColor: "DESIGN_TOKENS.color.semantic.background.overlay",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "DESIGN_TOKENS.zIndex.semantic.overlay"
          },
          modal: {
            backgroundColor: "DESIGN_TOKENS.color.semantic.surface.base",
            borderRadius: "DESIGN_TOKENS.borderRadius.semantic.modal",
            boxShadow: "DESIGN_TOKENS.shadow.semantic.modal",
            zIndex: "DESIGN_TOKENS.zIndex.semantic.modal",
            maxHeight: "90vh",
            overflow: "auto"
          }
        },
        description: "Default modal appearance"
      },
      hover: {
        styles: {},
        description: "N/A"
      },
      active: {
        styles: {},
        description: "N/A"
      },
      disabled: {
        styles: {},
        description: "N/A"
      },
      focus: {
        styles: {
          outline: "2px solid DESIGN_TOKENS.color.semantic.border.focus"
        },
        description: "Focus trap within modal"
      },
      loading: {
        styles: {
          opacity: "0.7"
        },
        description: "Loading content state"
      }
    },
    accessibility: {
      keyboard: [
        "Escape closes modal",
        "Tab cycles within modal (focus trap)",
        "Shift+Tab cycles backward",
        "Focus returns to trigger on close"
      ],
      screenReader: [
        "Modal has aria-label or aria-labelledby",
        "aria-modal='true'",
        "Focus moves to modal on open",
        "Overlay content hidden from screen readers (aria-hidden)"
      ],
      focus: [
        "Focus trap - cannot tab outside modal",
        "Initial focus on first interactive element",
        "Close button always accessible"
      ],
      aria: {
        roles: ["dialog"],
        attributes: {
          "aria-modal": "true",
          "aria-labelledby": "ID of modal title",
          "aria-describedby": "ID of modal description (if any)"
        }
      }
    },
    usage: {
      when: [
        "Critical user decisions",
        "Detailed information display",
        "Complex forms",
        "Confirmations"
      ],
      whenNot: [
        "For simple messages (use toast)",
        "For navigation (use navigation)",
        "For non-critical info (use tooltip)"
      ],
      examples: [
        "Pet detail modal",
        "Fusion confirmation",
        "Settings modal",
        "Error dialog"
      ]
    }
  } as ComponentPattern,

  /**
   * Loading state patterns
   */
  loading: {
    name: "Loading State",
    description: "Feedback during async operations",
    anatomy: {
      structure: ["container", "spinner/skeleton", "message (optional)"],
      required: ["container", "spinner/skeleton"],
      optional: ["message", "progress indicator"],
      slots: ["spinner", "message", "progress"]
    },
    variants: ["spinner", "skeleton", "progress"],
    sizes: ["small", "medium", "large"],
    states: {
      default: {
        styles: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "DESIGN_TOKENS.spacing.semantic.sm"
        },
        description: "Default loading appearance"
      },
      hover: {
        styles: {},
        description: "N/A"
      },
      active: {
        styles: {},
        description: "N/A"
      },
      disabled: {
        styles: {},
        description: "N/A"
      },
      focus: {
        styles: {},
        description: "N/A"
      },
      loading: {
        styles: {},
        description: "Loading is the state"
      }
    },
    accessibility: {
      keyboard: [],
      screenReader: [
        "aria-busy='true' on loading element",
        "aria-label describes what's loading",
        "Loading state announced"
      ],
      focus: [],
      aria: {
        attributes: {
          "aria-busy": "true",
          "aria-label": "Loading description"
        }
      }
    },
    usage: {
      when: [
        "Fetching data",
        "Processing requests",
        "Saving changes",
        "Initial page load"
      ],
      whenNot: [
        "For instant actions",
        "For cached content"
      ],
      examples: [
        "Loading pets",
        "Fusion in progress",
        "Saving team",
        "Fetching dungeon data"
      ]
    }
  } as ComponentPattern,

  /**
   * Empty state patterns
   */
  emptyState: {
    name: "Empty State",
    description: "Display when no content available",
    anatomy: {
      structure: ["container", "icon/illustration", "heading", "description", "action (optional)"],
      required: ["container", "heading"],
      optional: ["icon", "description", "action button"],
      slots: ["icon", "heading", "description", "action"]
    },
    variants: ["default", "error", "noResults"],
    sizes: ["small", "medium", "large"],
    states: {
      default: {
        styles: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "DESIGN_TOKENS.spacing.semantic.md",
          padding: "DESIGN_TOKENS.spacing.semantic.xxl",
          textAlign: "center"
        },
        description: "Default empty state appearance"
      },
      hover: {
        styles: {},
        description: "N/A"
      },
      active: {
        styles: {},
        description: "N/A"
      },
      disabled: {
        styles: {},
        description: "N/A"
      },
      focus: {
        styles: {},
        description: "Action button focusable"
      },
      loading: {
        styles: {},
        description: "N/A"
      }
    },
    accessibility: {
      keyboard: [
        "Action button keyboard accessible"
      ],
      screenReader: [
        "Empty state clearly described",
        "Action available if provided"
      ],
      focus: [],
      aria: {}
    },
    usage: {
      when: [
        "No items in collection",
        "No search results",
        "Error state",
        "First-time user experience"
      ],
      whenNot: [
        "For loading states (use loading component)",
        "For hidden content (just don't render)"
      ],
      examples: [
        "Empty pet collection",
        "No fusion history",
        "No teams created",
        "Search returned no results"
      ]
    }
  } as ComponentPattern
} as const;

/**
 * Get component pattern by name
 */
export function getComponentPattern(name: keyof typeof COMPONENT_PATTERNS): ComponentPattern {
  return COMPONENT_PATTERNS[name] as ComponentPattern;
}

/**
 * Get styles for component state
 */
export function getComponentStateStyles(
  component: keyof typeof COMPONENT_PATTERNS,
  state: ComponentState
): Record<string, string> {
  const pattern = COMPONENT_PATTERNS[component];
  return pattern.states[state]?.styles || {};
}

/**
 * Type exports
 */
export type { ComponentPattern, ComponentAnatomy, AccessibilityRequirements };





















