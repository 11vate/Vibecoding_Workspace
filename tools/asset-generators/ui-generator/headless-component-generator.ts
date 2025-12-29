/**
 * Headless Component Generator
 * 
 * Generates React component code that follows "Headless" patterns (like Radix UI).
 * These components provide logic/accessibility but leave styling to the implementation (Vibe-driven).
 */

export interface ComponentConfig {
  name: string;
  type: 'button' | 'toggle' | 'modal' | 'dropdown';
  styling: 'tailwind' | 'css-modules' | 'none';
  vibe?: string; // e.g., "cyberpunk", "minimal"
}

export const HeadlessComponentGenerator = {
  /**
   * Generate a full React component string
   */
  generateComponent(config: ComponentConfig): string {
    const componentName = config.name || 'MyComponent';
    
    switch (config.type) {
      case 'button':
        return this.generateButton(componentName, config);
      case 'toggle':
        return this.generateToggle(componentName, config);
      default:
        return `// Component type ${config.type} not yet implemented`;
    }
  },

  generateButton(name: string, config: ComponentConfig): string {
    const isTailwind = config.styling === 'tailwind';
    const vibeClasses = this.getVibeClasses(config.vibe || 'default', 'button');
    
    return `
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

interface ${name}Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

/**
 * ${name}
 * 
 * A headless button component compatible with Radix UI Slot pattern.
 * Vibe: ${config.vibe}
 */
const ${name} = React.forwardRef<HTMLButtonElement, ${name}Props>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={\`${isTailwind ? vibeClasses : 'component-button'} \$\{className || ''\}\`}
        ref={ref}
        {...props}
      />
    );
  }
);

${name}.displayName = "${name}";

export { ${name} };
`;
  },

  generateToggle(name: string, config: ComponentConfig): string {
    const isTailwind = config.styling === 'tailwind';
    const vibeClasses = this.getVibeClasses(config.vibe || 'default', 'toggle');
    
    return `
import React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';

/**
 * ${name}
 * 
 * A headless toggle component based on Radix UI Toggle.
 * Vibe: ${config.vibe}
 */
const ${name} = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      className={\`${isTailwind ? vibeClasses : 'component-toggle'} \$\{className || ''\}\`}
      {...props}
    />
  )
);

${name}.displayName = TogglePrimitive.Root.displayName;

export { ${name} };
`;
  },

  /**
   * Mock "Vibe Translation" for styles
   * In a real system, this would query the Design Intelligence layer
   */
  getVibeClasses(vibe: string, element: string): string {
    if (element === 'button') {
      switch (vibe) {
        case 'cyberpunk':
          return 'bg-yellow-400 text-black font-mono border-2 border-cyan-500 hover:shadow-[0_0_10px_#00ffff] transition-all uppercase tracking-widest';
        case 'minimal':
          return 'bg-white text-black border border-gray-200 hover:bg-gray-50 rounded-sm px-4 py-2 transition-colors';
        case 'organic':
          return 'bg-green-100 text-green-900 rounded-full px-6 py-2 hover:bg-green-200 shadow-sm transition-transform hover:scale-105';
        default:
          return 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600';
      }
    }
    if (element === 'toggle') {
       switch (vibe) {
        case 'cyberpunk':
          return 'data-[state=on]:bg-cyan-500 data-[state=off]:bg-gray-800 text-yellow-400 font-mono border border-yellow-400 p-2';
        default:
          return 'data-[state=on]:bg-blue-100 data-[state=off]:bg-transparent p-2 rounded';
       }
    }
    return '';
  }
};
