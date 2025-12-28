/**
 * LAYER 16 — COMPONENT DESIGN PATTERNS
 *
 * Comprehensive component design patterns library
 *
 * This layer provides complete component design patterns including structure,
 * states, variants, accessibility requirements, and code examples for all
 * common UI components.
 */
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
export declare const COMPONENT_PATTERNS: {
    /**
     * Button component patterns
     */
    readonly button: ComponentPattern;
    /**
     * Card component patterns
     */
    readonly card: ComponentPattern;
    /**
     * Input component patterns
     */
    readonly input: ComponentPattern;
    /**
     * Navigation component patterns
     */
    readonly navigation: ComponentPattern;
    /**
     * Toast/Notification component patterns
     */
    readonly toast: ComponentPattern;
    /**
     * Modal component patterns
     */
    readonly modal: ComponentPattern;
    /**
     * Loading state patterns
     */
    readonly loading: ComponentPattern;
    /**
     * Empty state patterns
     */
    readonly emptyState: ComponentPattern;
};
/**
 * Get component pattern by name
 */
export declare function getComponentPattern(name: keyof typeof COMPONENT_PATTERNS): ComponentPattern;
/**
 * Get styles for component state
 */
export declare function getComponentStateStyles(component: keyof typeof COMPONENT_PATTERNS, state: ComponentState): Record<string, string>;
/**
 * Type exports
 */
export type { ComponentPattern, ComponentAnatomy, AccessibilityRequirements };
//# sourceMappingURL=layer-16-component-patterns.d.ts.map