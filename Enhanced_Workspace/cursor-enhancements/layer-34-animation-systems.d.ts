/**
 * LAYER 34 — ANIMATION FRAMEWORKS & SYSTEMS
 *
 * Comprehensive animation frameworks, patterns, and systems for game animations
 *
 * This layer provides animation frameworks, patterns, optimization strategies,
 * and best practices for creating smooth, performant game animations.
 */
/**
 * Animation type
 */
export type AnimationType = "sprite-sheet" | "css-keyframe" | "canvas" | "webgl" | "svg" | "procedural";
/**
 * Animation framework
 */
export type AnimationFramework = "GSAP" | "Framer Motion" | "Lottie" | "Three.js" | "Phaser" | "Custom" | "CSS" | "Canvas";
/**
 * Easing function type
 */
export type EasingType = "linear" | "ease-in" | "ease-out" | "ease-in-out" | "cubic-bezier" | "spring" | "elastic" | "bounce";
/**
 * Animation pattern definition
 */
export interface AnimationPattern {
    name: string;
    type: AnimationType;
    description: string;
    useCases: string[];
    implementation: string[];
    performance: "high" | "medium" | "low";
}
/**
 * Animation framework definition
 */
export interface AnimationFrameworkDef {
    name: AnimationFramework;
    description: string;
    useCases: string[];
    features: string[];
    performance: "high" | "medium" | "low";
    bundleSize: "small" | "medium" | "large";
    learningCurve: "easy" | "medium" | "hard";
}
/**
 * Main animation systems configuration
 */
export declare const ANIMATION_SYSTEMS: {
    /**
     * Animation Types
     */
    readonly animationTypes: {
        readonly spriteSheet: {
            readonly name: "Sprite Sheet Animation";
            readonly type: AnimationType;
            readonly description: "Animation using sprite sheets with frame sequences";
            readonly useCases: readonly ["Character animations", "Object animations", "Effect animations", "2D game animations"];
            readonly implementation: readonly ["Load sprite sheet", "Define frame sequences", "Set frame timing", "Loop or play once", "Handle animation states"];
            readonly performance: "high";
        };
        readonly cssKeyframe: {
            readonly name: "CSS Keyframe Animation";
            readonly type: AnimationType;
            readonly description: "CSS-based animations using @keyframes";
            readonly useCases: readonly ["UI animations", "Simple object animations", "Hover effects", "Loading animations"];
            readonly implementation: readonly ["Define @keyframes", "Apply animation property", "Set duration and timing", "Handle animation events"];
            readonly performance: "high";
        };
        readonly canvas: {
            readonly name: "Canvas Animation";
            readonly type: AnimationType;
            readonly description: "Programmatic animations using Canvas API";
            readonly useCases: readonly ["Procedural animations", "Particle effects", "Custom rendering", "Complex animations"];
            readonly implementation: readonly ["Get canvas context", "Clear and redraw each frame", "Use requestAnimationFrame", "Handle animation loop", "Optimize rendering"];
            readonly performance: "medium";
        };
        readonly webgl: {
            readonly name: "WebGL Animation";
            readonly type: AnimationType;
            readonly description: "GPU-accelerated animations using WebGL";
            readonly useCases: readonly ["3D animations", "Complex particle systems", "Shader-based animations", "High-performance animations"];
            readonly implementation: readonly ["Set up WebGL context", "Create shaders", "Animate in GPU", "Use requestAnimationFrame", "Optimize for GPU"];
            readonly performance: "high";
        };
        readonly svg: {
            readonly name: "SVG Animation";
            readonly type: AnimationType;
            readonly description: "SVG-based animations";
            readonly useCases: readonly ["Vector animations", "Icon animations", "Scalable animations", "UI element animations"];
            readonly implementation: readonly ["Use SVG elements", "Animate attributes", "Use SMIL or JavaScript", "CSS animations on SVG"];
            readonly performance: "medium";
        };
        readonly procedural: {
            readonly name: "Procedural Animation";
            readonly type: AnimationType;
            readonly description: "Algorithm-based animations";
            readonly useCases: readonly ["Physics-based animations", "Procedural effects", "Dynamic animations", "Generated animations"];
            readonly implementation: readonly ["Define animation algorithm", "Calculate frame-by-frame", "Use mathematical functions", "Handle state transitions"];
            readonly performance: "medium";
        };
    };
    /**
     * Animation Frameworks
     */
    readonly frameworks: {
        readonly gsap: {
            readonly name: AnimationFramework;
            readonly description: "GreenSock Animation Platform - powerful animation library";
            readonly useCases: readonly ["Complex animations", "Timeline-based animations", "Advanced easing", "Performance-critical animations"];
            readonly features: readonly ["Timeline control", "Advanced easing", "Plugin system", "Performance optimized", "Cross-browser compatibility", "ScrollTrigger", "Morphing", "Physics"];
            readonly performance: "high";
            readonly bundleSize: "medium";
            readonly learningCurve: "medium";
        };
        readonly framerMotion: {
            readonly name: AnimationFramework;
            readonly description: "React animation library with declarative API";
            readonly useCases: readonly ["React component animations", "Layout animations", "Gesture animations", "React-based games"];
            readonly features: readonly ["Declarative API", "Layout animations", "Gesture support", "React integration", "Variants", "AnimatePresence", "Motion components"];
            readonly performance: "high";
            readonly bundleSize: "medium";
            readonly learningCurve: "easy";
        };
        readonly lottie: {
            readonly name: AnimationFramework;
            readonly description: "JSON-based animations from After Effects";
            readonly useCases: readonly ["Complex animations from After Effects", "UI animations", "Logo animations", "Designer-created animations"];
            readonly features: readonly ["After Effects export", "JSON format", "Small file sizes", "Vector animations", "Interactivity support", "React integration"];
            readonly performance: "high";
            readonly bundleSize: "small";
            readonly learningCurve: "easy";
        };
        readonly threejs: {
            readonly name: AnimationFramework;
            readonly description: "3D animation and rendering library";
            readonly useCases: readonly ["3D animations", "3D games", "Complex 3D scenes", "WebGL animations"];
            readonly features: readonly ["3D rendering", "Animation system", "Material animations", "Camera animations", "Physics integration", "Shader support"];
            readonly performance: "high";
            readonly bundleSize: "large";
            readonly learningCurve: "hard";
        };
        readonly phaser: {
            readonly name: AnimationFramework;
            readonly description: "Game framework with built-in animation system";
            readonly useCases: readonly ["2D game animations", "Sprite animations", "Game development", "Full game framework"];
            readonly features: readonly ["Sprite animations", "Timeline system", "Tween system", "Animation manager", "Game framework integration"];
            readonly performance: "high";
            readonly bundleSize: "large";
            readonly learningCurve: "medium";
        };
        readonly css: {
            readonly name: AnimationFramework;
            readonly description: "Native CSS animations and transitions";
            readonly useCases: readonly ["Simple animations", "UI animations", "Hover effects", "Performance-critical animations"];
            readonly features: readonly ["No JavaScript required", "GPU acceleration", "Browser optimized", "Declarative", "Small bundle impact"];
            readonly performance: "high";
            readonly bundleSize: "small";
            readonly learningCurve: "easy";
        };
        readonly canvas: {
            readonly name: AnimationFramework;
            readonly description: "HTML5 Canvas API for animations";
            readonly useCases: readonly ["Custom animations", "Particle effects", "Procedural animations", "Full control animations"];
            readonly features: readonly ["Full control", "Custom rendering", "Flexible", "No dependencies"];
            readonly performance: "medium";
            readonly bundleSize: "small";
            readonly learningCurve: "medium";
        };
        readonly custom: {
            readonly name: AnimationFramework;
            readonly description: "Custom animation system";
            readonly useCases: readonly ["Project-specific needs", "Lightweight solutions", "Full control required", "Optimized for specific use case"];
            readonly features: readonly ["Full control", "Lightweight", "Optimized for needs", "No external dependencies"];
            readonly performance: "high";
            readonly bundleSize: "small";
            readonly learningCurve: "hard";
        };
    };
    /**
     * Animation Patterns
     */
    readonly patterns: {
        readonly stateBased: {
            readonly name: "State-Based Animation";
            readonly description: "Animations triggered by state changes";
            readonly useCases: readonly ["Character state animations (idle, walking, attacking)", "UI state animations (hover, active, disabled)", "Game state animations"];
            readonly implementation: readonly ["Define animation states", "Map states to animations", "Trigger on state change", "Handle state transitions", "Smooth state switching"];
            readonly benefits: readonly ["Organized animations", "Clear state management", "Easy to maintain", "Predictable behavior"];
        };
        readonly timelineBased: {
            readonly name: "Timeline-Based Animation";
            readonly description: "Animations controlled by timelines";
            readonly useCases: readonly ["Complex sequences", "Synchronized animations", "Cutscenes", "Coordinated effects"];
            readonly implementation: readonly ["Create timeline", "Add animations to timeline", "Set timing and delays", "Play/pause/seek timeline", "Handle timeline events"];
            readonly benefits: readonly ["Precise timing control", "Synchronization", "Complex sequences", "Reusable timelines"];
        };
        readonly easing: {
            readonly name: "Easing Functions";
            readonly description: "Control animation acceleration/deceleration";
            readonly types: {
                readonly linear: "Constant speed";
                readonly "ease-in": "Start slow, end fast";
                readonly "ease-out": "Start fast, end slow";
                readonly "ease-in-out": "Start slow, fast middle, end slow";
                readonly "cubic-bezier": "Custom curve";
                readonly spring: "Spring physics";
                readonly elastic: "Elastic bounce";
                readonly bounce: "Bounce effect";
            };
            readonly useCases: readonly ["Natural motion", "UI animations", "Character movement", "Effect animations"];
        };
        readonly composition: {
            readonly name: "Animation Composition";
            readonly description: "Combine multiple animations";
            readonly techniques: readonly ["Parallel animations (run simultaneously)", "Sequential animations (run one after another)", "Staggered animations (delayed start)", "Chained animations (trigger next on complete)"];
            readonly useCases: readonly ["Complex animations", "Multi-element animations", "Coordinated effects", "Sophisticated sequences"];
        };
        readonly sequencing: {
            readonly name: "Animation Sequencing";
            readonly description: "Play animations in sequence";
            readonly implementation: readonly ["Define animation sequence", "Play animations in order", "Handle completion callbacks", "Loop sequences", "Handle interruptions"];
            readonly useCases: readonly ["Animation sequences", "Character action chains", "Effect sequences", "UI reveal sequences"];
        };
        readonly parallel: {
            readonly name: "Parallel Animations";
            readonly description: "Run multiple animations simultaneously";
            readonly implementation: readonly ["Start multiple animations", "Synchronize timing", "Handle completion", "Coordinate effects"];
            readonly useCases: readonly ["Multi-element animations", "Coordinated effects", "Complex scenes", "Synchronized animations"];
        };
    };
    /**
     * Sprite Animation
     */
    readonly spriteAnimation: {
        readonly spriteSheetParsing: {
            readonly description: "Parse sprite sheets for animation";
            readonly methods: readonly ["Grid-based parsing (uniform cells)", "JSON metadata (Exported from tools)", "XML metadata (TexturePacker format)", "Custom format"];
            readonly dataStructures: readonly ["Frame definitions (x, y, width, height)", "Animation sequences (frame order, timing)", "Animation states (idle, walking, etc.)"];
        };
        readonly frameTiming: {
            readonly description: "Control frame timing for sprite animations";
            readonly strategies: readonly ["Fixed frame rate (same duration per frame)", "Variable frame rate (different durations)", "Time-based (independent of frame rate)", "Speed multiplier (faster/slower playback)"];
            readonly implementation: readonly ["Track elapsed time", "Calculate current frame", "Handle frame wrapping", "Support pause/resume"];
        };
        readonly animationStates: {
            readonly description: "Manage animation states";
            readonly states: readonly ["Idle", "Walking", "Running", "Attacking", "Defending", "Hurt", "Dying", "Victory"];
            readonly management: readonly ["Define state machine", "Map states to animations", "Handle state transitions", "Prevent invalid transitions"];
        };
        readonly blendModes: {
            readonly description: "Blend modes for sprite rendering";
            readonly modes: readonly ["Normal", "Multiply", "Screen", "Overlay", "Add", "Subtract", "Difference"];
            readonly useCases: readonly ["Visual effects", "Lighting effects", "Particle effects", "Special effects"];
        };
        readonly animationEvents: {
            readonly description: "Events during animation playback";
            readonly events: readonly ["On frame change", "On animation start", "On animation complete", "On loop", "On state change"];
            readonly useCases: readonly ["Sound effects on frames", "Effects on animation events", "State changes", "Callback handling"];
        };
        readonly loopHandling: {
            readonly description: "Handle animation looping";
            readonly strategies: readonly ["No loop (play once)", "Loop infinite", "Loop N times", "Ping-pong (forward then backward)", "Loop with delay"];
            readonly implementation: readonly ["Track loop count", "Reset to start on loop", "Handle completion after loops", "Support ping-pong mode"];
        };
    };
    /**
     * Performance Optimization
     */
    readonly performance: {
        readonly bestPractices: {
            readonly description: "Animation performance best practices";
            readonly practices: readonly ["Use GPU-accelerated properties (transform, opacity)", "Avoid animating layout properties (width, height, margin)", "Use will-change sparingly", "Batch DOM reads and writes", "Use requestAnimationFrame", "Limit simultaneous animations", "Use object pooling for particles", "Optimize sprite sheets", "Reduce animation complexity", "Use appropriate frame rates"];
        };
        readonly gpuAcceleration: {
            readonly description: "GPU-accelerated animations";
            readonly properties: readonly ["transform (translate, scale, rotate)", "opacity", "filter (sparingly)", "will-change (hint browser)"];
            readonly avoid: readonly ["width, height (triggers layout)", "margin, padding (triggers layout)", "top, left (use transform instead)", "background-color (use opacity + transform)"];
            readonly benefits: readonly ["Smoother animations", "Better performance", "60fps achievable", "Lower CPU usage"];
        };
        readonly animationPooling: {
            readonly description: "Object pooling for animations";
            readonly useCases: readonly ["Particle effects", "Frequently created/destroyed animations", "Performance-critical animations", "Many simultaneous animations"];
            readonly implementation: readonly ["Create pool of animation objects", "Reuse objects from pool", "Return to pool when done", "Initialize pool size appropriately"];
            readonly benefits: readonly ["Reduced garbage collection", "Better performance", "Lower memory usage", "Smoother animations"];
        };
        readonly frameRateManagement: {
            readonly description: "Manage animation frame rates";
            readonly strategies: readonly ["Target 60fps for smooth animations", "Reduce frame rate for non-critical animations", "Use delta time for frame-rate independence", "Adaptive frame rate", "Pause off-screen animations"];
            readonly frameRates: {
                readonly "60fps": "Smooth, preferred for all animations";
                readonly "30fps": "Acceptable for background animations";
                readonly "15fps": "Minimum for visible animations";
            };
        };
        readonly animationLOD: {
            readonly description: "Level of Detail for animations";
            readonly strategies: readonly ["Reduce animation complexity at distance", "Simplify particle effects", "Lower frame rate for distant objects", "Disable non-visible animations", "Use simpler animations for background"];
            readonly useCases: readonly ["Large scenes", "Many animated objects", "Performance optimization", "Scalable animations"];
        };
    };
    /**
     * Animation Tools
     */
    readonly tools: {
        readonly animationEditors: {
            readonly description: "Tools for creating animations";
            readonly tools: readonly ["Aseprite (pixel art animations)", "Spriter (sprite animations)", "Spine (2D skeletal animation)", "DragonBones (2D skeletal animation)", "After Effects (complex animations, export to Lottie)"];
        };
        readonly timelineTools: {
            readonly description: "Timeline-based animation tools";
            readonly features: readonly ["Visual timeline", "Keyframe editing", "Easing curve editing", "Animation preview", "Export capabilities"];
        };
        readonly easingCurveEditors: {
            readonly description: "Tools for creating easing curves";
            readonly tools: readonly ["Cubic-bezier.com (CSS easing)", "Easing functions library", "Custom curve editors"];
        };
        readonly previewSystems: {
            readonly description: "Animation preview and testing";
            readonly features: readonly ["Real-time preview", "Frame-by-frame playback", "Speed control", "Loop toggle", "Performance profiling"];
        };
    };
};
/**
 * Get animation framework by name
 */
export declare function getAnimationFramework(framework: AnimationFramework): AnimationFrameworkDef | undefined;
/**
 * Get animation pattern by name
 */
export declare function getAnimationPattern(patternName: string): AnimationPattern | undefined;
/**
 * Recommend animation framework
 */
export declare function recommendAnimationFramework(useCase: string): AnimationFrameworkDef[];
/**
 * Type exports
 */
export type { AnimationPattern, AnimationType, AnimationFramework, AnimationFrameworkDef, EasingType };
//# sourceMappingURL=layer-34-animation-systems.d.ts.map