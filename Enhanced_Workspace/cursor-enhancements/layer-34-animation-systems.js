/**
 * LAYER 34 — ANIMATION FRAMEWORKS & SYSTEMS
 *
 * Comprehensive animation frameworks, patterns, and systems for game animations
 *
 * This layer provides animation frameworks, patterns, optimization strategies,
 * and best practices for creating smooth, performant game animations.
 */
/**
 * Main animation systems configuration
 */
export const ANIMATION_SYSTEMS = {
    /**
     * Animation Types
     */
    animationTypes: {
        spriteSheet: {
            name: "Sprite Sheet Animation",
            type: "sprite-sheet",
            description: "Animation using sprite sheets with frame sequences",
            useCases: [
                "Character animations",
                "Object animations",
                "Effect animations",
                "2D game animations"
            ],
            implementation: [
                "Load sprite sheet",
                "Define frame sequences",
                "Set frame timing",
                "Loop or play once",
                "Handle animation states"
            ],
            performance: "high"
        },
        cssKeyframe: {
            name: "CSS Keyframe Animation",
            type: "css-keyframe",
            description: "CSS-based animations using @keyframes",
            useCases: [
                "UI animations",
                "Simple object animations",
                "Hover effects",
                "Loading animations"
            ],
            implementation: [
                "Define @keyframes",
                "Apply animation property",
                "Set duration and timing",
                "Handle animation events"
            ],
            performance: "high"
        },
        canvas: {
            name: "Canvas Animation",
            type: "canvas",
            description: "Programmatic animations using Canvas API",
            useCases: [
                "Procedural animations",
                "Particle effects",
                "Custom rendering",
                "Complex animations"
            ],
            implementation: [
                "Get canvas context",
                "Clear and redraw each frame",
                "Use requestAnimationFrame",
                "Handle animation loop",
                "Optimize rendering"
            ],
            performance: "medium"
        },
        webgl: {
            name: "WebGL Animation",
            type: "webgl",
            description: "GPU-accelerated animations using WebGL",
            useCases: [
                "3D animations",
                "Complex particle systems",
                "Shader-based animations",
                "High-performance animations"
            ],
            implementation: [
                "Set up WebGL context",
                "Create shaders",
                "Animate in GPU",
                "Use requestAnimationFrame",
                "Optimize for GPU"
            ],
            performance: "high"
        },
        svg: {
            name: "SVG Animation",
            type: "svg",
            description: "SVG-based animations",
            useCases: [
                "Vector animations",
                "Icon animations",
                "Scalable animations",
                "UI element animations"
            ],
            implementation: [
                "Use SVG elements",
                "Animate attributes",
                "Use SMIL or JavaScript",
                "CSS animations on SVG"
            ],
            performance: "medium"
        },
        procedural: {
            name: "Procedural Animation",
            type: "procedural",
            description: "Algorithm-based animations",
            useCases: [
                "Physics-based animations",
                "Procedural effects",
                "Dynamic animations",
                "Generated animations"
            ],
            implementation: [
                "Define animation algorithm",
                "Calculate frame-by-frame",
                "Use mathematical functions",
                "Handle state transitions"
            ],
            performance: "medium"
        }
    },
    /**
     * Animation Frameworks
     */
    frameworks: {
        gsap: {
            name: "GSAP",
            description: "GreenSock Animation Platform - powerful animation library",
            useCases: [
                "Complex animations",
                "Timeline-based animations",
                "Advanced easing",
                "Performance-critical animations"
            ],
            features: [
                "Timeline control",
                "Advanced easing",
                "Plugin system",
                "Performance optimized",
                "Cross-browser compatibility",
                "ScrollTrigger",
                "Morphing",
                "Physics"
            ],
            performance: "high",
            bundleSize: "medium",
            learningCurve: "medium"
        },
        framerMotion: {
            name: "Framer Motion",
            description: "React animation library with declarative API",
            useCases: [
                "React component animations",
                "Layout animations",
                "Gesture animations",
                "React-based games"
            ],
            features: [
                "Declarative API",
                "Layout animations",
                "Gesture support",
                "React integration",
                "Variants",
                "AnimatePresence",
                "Motion components"
            ],
            performance: "high",
            bundleSize: "medium",
            learningCurve: "easy"
        },
        lottie: {
            name: "Lottie",
            description: "JSON-based animations from After Effects",
            useCases: [
                "Complex animations from After Effects",
                "UI animations",
                "Logo animations",
                "Designer-created animations"
            ],
            features: [
                "After Effects export",
                "JSON format",
                "Small file sizes",
                "Vector animations",
                "Interactivity support",
                "React integration"
            ],
            performance: "high",
            bundleSize: "small",
            learningCurve: "easy"
        },
        threejs: {
            name: "Three.js",
            description: "3D animation and rendering library",
            useCases: [
                "3D animations",
                "3D games",
                "Complex 3D scenes",
                "WebGL animations"
            ],
            features: [
                "3D rendering",
                "Animation system",
                "Material animations",
                "Camera animations",
                "Physics integration",
                "Shader support"
            ],
            performance: "high",
            bundleSize: "large",
            learningCurve: "hard"
        },
        phaser: {
            name: "Phaser",
            description: "Game framework with built-in animation system",
            useCases: [
                "2D game animations",
                "Sprite animations",
                "Game development",
                "Full game framework"
            ],
            features: [
                "Sprite animations",
                "Timeline system",
                "Tween system",
                "Animation manager",
                "Game framework integration"
            ],
            performance: "high",
            bundleSize: "large",
            learningCurve: "medium"
        },
        css: {
            name: "CSS",
            description: "Native CSS animations and transitions",
            useCases: [
                "Simple animations",
                "UI animations",
                "Hover effects",
                "Performance-critical animations"
            ],
            features: [
                "No JavaScript required",
                "GPU acceleration",
                "Browser optimized",
                "Declarative",
                "Small bundle impact"
            ],
            performance: "high",
            bundleSize: "small",
            learningCurve: "easy"
        },
        canvas: {
            name: "Canvas",
            description: "HTML5 Canvas API for animations",
            useCases: [
                "Custom animations",
                "Particle effects",
                "Procedural animations",
                "Full control animations"
            ],
            features: [
                "Full control",
                "Custom rendering",
                "Flexible",
                "No dependencies"
            ],
            performance: "medium",
            bundleSize: "small",
            learningCurve: "medium"
        },
        custom: {
            name: "Custom",
            description: "Custom animation system",
            useCases: [
                "Project-specific needs",
                "Lightweight solutions",
                "Full control required",
                "Optimized for specific use case"
            ],
            features: [
                "Full control",
                "Lightweight",
                "Optimized for needs",
                "No external dependencies"
            ],
            performance: "high",
            bundleSize: "small",
            learningCurve: "hard"
        }
    },
    /**
     * Animation Patterns
     */
    patterns: {
        stateBased: {
            name: "State-Based Animation",
            description: "Animations triggered by state changes",
            useCases: [
                "Character state animations (idle, walking, attacking)",
                "UI state animations (hover, active, disabled)",
                "Game state animations"
            ],
            implementation: [
                "Define animation states",
                "Map states to animations",
                "Trigger on state change",
                "Handle state transitions",
                "Smooth state switching"
            ],
            benefits: [
                "Organized animations",
                "Clear state management",
                "Easy to maintain",
                "Predictable behavior"
            ]
        },
        timelineBased: {
            name: "Timeline-Based Animation",
            description: "Animations controlled by timelines",
            useCases: [
                "Complex sequences",
                "Synchronized animations",
                "Cutscenes",
                "Coordinated effects"
            ],
            implementation: [
                "Create timeline",
                "Add animations to timeline",
                "Set timing and delays",
                "Play/pause/seek timeline",
                "Handle timeline events"
            ],
            benefits: [
                "Precise timing control",
                "Synchronization",
                "Complex sequences",
                "Reusable timelines"
            ]
        },
        easing: {
            name: "Easing Functions",
            description: "Control animation acceleration/deceleration",
            types: {
                linear: "Constant speed",
                "ease-in": "Start slow, end fast",
                "ease-out": "Start fast, end slow",
                "ease-in-out": "Start slow, fast middle, end slow",
                "cubic-bezier": "Custom curve",
                spring: "Spring physics",
                elastic: "Elastic bounce",
                bounce: "Bounce effect"
            },
            useCases: [
                "Natural motion",
                "UI animations",
                "Character movement",
                "Effect animations"
            ]
        },
        composition: {
            name: "Animation Composition",
            description: "Combine multiple animations",
            techniques: [
                "Parallel animations (run simultaneously)",
                "Sequential animations (run one after another)",
                "Staggered animations (delayed start)",
                "Chained animations (trigger next on complete)"
            ],
            useCases: [
                "Complex animations",
                "Multi-element animations",
                "Coordinated effects",
                "Sophisticated sequences"
            ]
        },
        sequencing: {
            name: "Animation Sequencing",
            description: "Play animations in sequence",
            implementation: [
                "Define animation sequence",
                "Play animations in order",
                "Handle completion callbacks",
                "Loop sequences",
                "Handle interruptions"
            ],
            useCases: [
                "Animation sequences",
                "Character action chains",
                "Effect sequences",
                "UI reveal sequences"
            ]
        },
        parallel: {
            name: "Parallel Animations",
            description: "Run multiple animations simultaneously",
            implementation: [
                "Start multiple animations",
                "Synchronize timing",
                "Handle completion",
                "Coordinate effects"
            ],
            useCases: [
                "Multi-element animations",
                "Coordinated effects",
                "Complex scenes",
                "Synchronized animations"
            ]
        }
    },
    /**
     * Sprite Animation
     */
    spriteAnimation: {
        spriteSheetParsing: {
            description: "Parse sprite sheets for animation",
            methods: [
                "Grid-based parsing (uniform cells)",
                "JSON metadata (Exported from tools)",
                "XML metadata (TexturePacker format)",
                "Custom format"
            ],
            dataStructures: [
                "Frame definitions (x, y, width, height)",
                "Animation sequences (frame order, timing)",
                "Animation states (idle, walking, etc.)"
            ]
        },
        frameTiming: {
            description: "Control frame timing for sprite animations",
            strategies: [
                "Fixed frame rate (same duration per frame)",
                "Variable frame rate (different durations)",
                "Time-based (independent of frame rate)",
                "Speed multiplier (faster/slower playback)"
            ],
            implementation: [
                "Track elapsed time",
                "Calculate current frame",
                "Handle frame wrapping",
                "Support pause/resume"
            ]
        },
        animationStates: {
            description: "Manage animation states",
            states: [
                "Idle",
                "Walking",
                "Running",
                "Attacking",
                "Defending",
                "Hurt",
                "Dying",
                "Victory"
            ],
            management: [
                "Define state machine",
                "Map states to animations",
                "Handle state transitions",
                "Prevent invalid transitions"
            ]
        },
        blendModes: {
            description: "Blend modes for sprite rendering",
            modes: [
                "Normal",
                "Multiply",
                "Screen",
                "Overlay",
                "Add",
                "Subtract",
                "Difference"
            ],
            useCases: [
                "Visual effects",
                "Lighting effects",
                "Particle effects",
                "Special effects"
            ]
        },
        animationEvents: {
            description: "Events during animation playback",
            events: [
                "On frame change",
                "On animation start",
                "On animation complete",
                "On loop",
                "On state change"
            ],
            useCases: [
                "Sound effects on frames",
                "Effects on animation events",
                "State changes",
                "Callback handling"
            ]
        },
        loopHandling: {
            description: "Handle animation looping",
            strategies: [
                "No loop (play once)",
                "Loop infinite",
                "Loop N times",
                "Ping-pong (forward then backward)",
                "Loop with delay"
            ],
            implementation: [
                "Track loop count",
                "Reset to start on loop",
                "Handle completion after loops",
                "Support ping-pong mode"
            ]
        }
    },
    /**
     * Performance Optimization
     */
    performance: {
        bestPractices: {
            description: "Animation performance best practices",
            practices: [
                "Use GPU-accelerated properties (transform, opacity)",
                "Avoid animating layout properties (width, height, margin)",
                "Use will-change sparingly",
                "Batch DOM reads and writes",
                "Use requestAnimationFrame",
                "Limit simultaneous animations",
                "Use object pooling for particles",
                "Optimize sprite sheets",
                "Reduce animation complexity",
                "Use appropriate frame rates"
            ]
        },
        gpuAcceleration: {
            description: "GPU-accelerated animations",
            properties: [
                "transform (translate, scale, rotate)",
                "opacity",
                "filter (sparingly)",
                "will-change (hint browser)"
            ],
            avoid: [
                "width, height (triggers layout)",
                "margin, padding (triggers layout)",
                "top, left (use transform instead)",
                "background-color (use opacity + transform)"
            ],
            benefits: [
                "Smoother animations",
                "Better performance",
                "60fps achievable",
                "Lower CPU usage"
            ]
        },
        animationPooling: {
            description: "Object pooling for animations",
            useCases: [
                "Particle effects",
                "Frequently created/destroyed animations",
                "Performance-critical animations",
                "Many simultaneous animations"
            ],
            implementation: [
                "Create pool of animation objects",
                "Reuse objects from pool",
                "Return to pool when done",
                "Initialize pool size appropriately"
            ],
            benefits: [
                "Reduced garbage collection",
                "Better performance",
                "Lower memory usage",
                "Smoother animations"
            ]
        },
        frameRateManagement: {
            description: "Manage animation frame rates",
            strategies: [
                "Target 60fps for smooth animations",
                "Reduce frame rate for non-critical animations",
                "Use delta time for frame-rate independence",
                "Adaptive frame rate",
                "Pause off-screen animations"
            ],
            frameRates: {
                "60fps": "Smooth, preferred for all animations",
                "30fps": "Acceptable for background animations",
                "15fps": "Minimum for visible animations"
            }
        },
        animationLOD: {
            description: "Level of Detail for animations",
            strategies: [
                "Reduce animation complexity at distance",
                "Simplify particle effects",
                "Lower frame rate for distant objects",
                "Disable non-visible animations",
                "Use simpler animations for background"
            ],
            useCases: [
                "Large scenes",
                "Many animated objects",
                "Performance optimization",
                "Scalable animations"
            ]
        }
    },
    /**
     * Animation Tools
     */
    tools: {
        animationEditors: {
            description: "Tools for creating animations",
            tools: [
                "Aseprite (pixel art animations)",
                "Spriter (sprite animations)",
                "Spine (2D skeletal animation)",
                "DragonBones (2D skeletal animation)",
                "After Effects (complex animations, export to Lottie)"
            ]
        },
        timelineTools: {
            description: "Timeline-based animation tools",
            features: [
                "Visual timeline",
                "Keyframe editing",
                "Easing curve editing",
                "Animation preview",
                "Export capabilities"
            ]
        },
        easingCurveEditors: {
            description: "Tools for creating easing curves",
            tools: [
                "Cubic-bezier.com (CSS easing)",
                "Easing functions library",
                "Custom curve editors"
            ]
        },
        previewSystems: {
            description: "Animation preview and testing",
            features: [
                "Real-time preview",
                "Frame-by-frame playback",
                "Speed control",
                "Loop toggle",
                "Performance profiling"
            ]
        }
    }
};
/**
 * Get animation framework by name
 */
export function getAnimationFramework(framework) {
    return ANIMATION_SYSTEMS.frameworks[framework.toLowerCase().replace(/\s+/g, "")];
}
/**
 * Get animation pattern by name
 */
export function getAnimationPattern(patternName) {
    const patterns = ANIMATION_SYSTEMS.patterns;
    return patterns[patternName];
}
/**
 * Recommend animation framework
 */
export function recommendAnimationFramework(useCase) {
    const recommendations = [];
    // Simple logic for recommendations
    if (useCase.includes("React")) {
        recommendations.push(ANIMATION_SYSTEMS.frameworks.framerMotion);
    }
    if (useCase.includes("complex") || useCase.includes("timeline")) {
        recommendations.push(ANIMATION_SYSTEMS.frameworks.gsap);
    }
    if (useCase.includes("simple") || useCase.includes("UI")) {
        recommendations.push(ANIMATION_SYSTEMS.frameworks.css);
    }
    if (useCase.includes("3D")) {
        recommendations.push(ANIMATION_SYSTEMS.frameworks.threejs);
    }
    if (useCase.includes("game") || useCase.includes("sprite")) {
        recommendations.push(ANIMATION_SYSTEMS.frameworks.phaser);
    }
    return recommendations.length > 0 ? recommendations : [ANIMATION_SYSTEMS.frameworks.css];
}
//# sourceMappingURL=layer-34-animation-systems.js.map