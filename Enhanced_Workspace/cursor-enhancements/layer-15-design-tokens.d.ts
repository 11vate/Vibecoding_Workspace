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
    scale: number[];
    semantic: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        xxxl: string;
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
        xs: {
            size: string;
            lineHeight: number;
            weight: number;
        };
        sm: {
            size: string;
            lineHeight: number;
            weight: number;
        };
        base: {
            size: string;
            lineHeight: number;
            weight: number;
        };
        lg: {
            size: string;
            lineHeight: number;
            weight: number;
        };
        xl: {
            size: string;
            lineHeight: number;
            weight: number;
        };
        "2xl": {
            size: string;
            lineHeight: number;
            weight: number;
        };
        "3xl": {
            size: string;
            lineHeight: number;
            weight: number;
        };
        "4xl": {
            size: string;
            lineHeight: number;
            weight: number;
        };
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
        sm: string;
        md: string;
        lg: string;
        xl: string;
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
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
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
        instant: string;
        fast: string;
        normal: string;
        slow: string;
        slower: string;
    };
    easing: {
        linear: string;
        easeIn: string;
        easeOut: string;
        easeInOut: string;
        elastic: string;
    };
    semantic: {
        idle: string;
        interaction: string;
        fusion: string;
        glitch: string;
    };
}
/**
 * Breakpoint token structure
 */
export interface BreakpointTokens {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
    ultra: string;
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
export declare const DESIGN_TOKENS: {
    /**
     * Color tokens - semantic color system
     */
    readonly color: ColorTokens;
    /**
     * Spacing tokens - 8px rhythm system
     */
    readonly spacing: SpacingTokens;
    /**
     * Typography tokens - modular type scale
     */
    readonly typography: TypographyTokens;
    /**
     * Shadow/elevation tokens
     */
    readonly shadow: ShadowTokens;
    /**
     * Border radius tokens
     */
    readonly borderRadius: BorderRadiusTokens;
    /**
     * Animation timing tokens
     */
    readonly animation: AnimationTokens;
    /**
     * Breakpoint tokens - mobile-first
     */
    readonly breakpoint: BreakpointTokens;
    /**
     * Z-index scale
     */
    readonly zIndex: ZIndexTokens;
    /**
     * Asset dimension tokens
     */
    readonly asset: {
        readonly sprite: {
            readonly small: "16px";
            readonly medium: "32px";
            readonly large: "64px";
            readonly xlarge: "128px";
        };
        readonly icon: {
            readonly xs: "16px";
            readonly sm: "24px";
            readonly md: "32px";
            readonly lg: "48px";
            readonly xl: "64px";
        };
        readonly background: {
            readonly small: "256px";
            readonly medium: "512px";
            readonly large: "1024px";
            readonly xlarge: "2048px";
        };
        readonly tile: {
            readonly standard: "32px";
            readonly large: "64px";
        };
    };
    /**
     * Sprite sheet configuration tokens
     */
    readonly spriteSheet: {
        readonly cellPadding: "1px";
        readonly defaultCellSize: "32px";
        readonly maxSheetSize: "2048px";
        readonly powerOfTwo: true;
    };
    /**
     * Animation timing tokens for game animations
     */
    readonly gameAnimation: {
        readonly sprite: {
            readonly frameRate: "8-12 fps";
            readonly idleCycle: "2s";
            readonly walkCycle: "0.5s";
            readonly attackDuration: "0.3s";
        };
        readonly effect: {
            readonly quick: "0.1s";
            readonly normal: "0.3s";
            readonly slow: "0.5s";
        };
    };
};
/**
 * Generate CSS variables from design tokens
 */
export declare function generateCSSVariables(tokens: typeof DESIGN_TOKENS): string;
/**
 * Get token value by path
 * Example: getTokenValue('color.semantic.primary.action') => '#00ffff'
 */
export declare function getTokenValue(path: string): string | number | undefined;
/**
 * Type exports
 */
export type { ColorTokens, SpacingTokens, TypographyTokens, ShadowTokens, BorderRadiusTokens, AnimationTokens, BreakpointTokens, ZIndexTokens };
//# sourceMappingURL=layer-15-design-tokens.d.ts.map