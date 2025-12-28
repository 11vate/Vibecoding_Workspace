/**
 * LAYER 23 — PERFORMANCE OPTIMIZATION
 *
 * Comprehensive performance optimization strategies
 *
 * This layer provides React performance patterns, JavaScript optimization,
 * bundle optimization, network performance, rendering performance, and
 * performance metrics to ensure optimal application performance.
 */
/**
 * Performance metric type
 */
export type PerformanceMetric = "LCP" | "FID" | "CLS" | "FCP" | "TTI" | "TBT";
/**
 * Performance budget
 */
export interface PerformanceBudget {
    metric: PerformanceMetric | string;
    target: number;
    unit: string;
    description: string;
}
/**
 * Optimization strategy
 */
export interface OptimizationStrategy {
    name: string;
    description: string;
    whenToUse: string[];
    implementation: string[];
    impact: "high" | "medium" | "low";
}
/**
 * Main performance optimization configuration
 */
export declare const PERFORMANCE_OPTIMIZATION: {
    /**
     * React Performance
     */
    readonly react: {
        readonly renderOptimization: {
            readonly reactMemo: {
                readonly name: "React.memo";
                readonly description: "Memoize component to prevent unnecessary re-renders";
                readonly whenToUse: readonly ["Component renders with same props frequently", "Component rendering is expensive", "Props are primitive or stable references"];
                readonly implementation: readonly ["Wrap component with React.memo", "Use shallow comparison (default) or custom comparison", "Ensure props are stable references"];
                readonly impact: "high";
                readonly codeExample: "export default React.memo(ExpensiveComponent);";
            };
            readonly useMemo: {
                readonly name: "useMemo";
                readonly description: "Memoize expensive computations";
                readonly whenToUse: readonly ["Expensive calculations", "Derived values", "Object/array creation in render", "Avoid unnecessary recalculations"];
                readonly implementation: readonly ["Wrap expensive computation in useMemo", "Provide dependency array", "Ensure dependencies are stable"];
                readonly impact: "high";
                readonly codeExample: "const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);";
            };
            readonly useCallback: {
                readonly name: "useCallback";
                readonly description: "Memoize function references";
                readonly whenToUse: readonly ["Functions passed to child components", "Functions in dependency arrays", "Prevent unnecessary re-renders", "Stable function references needed"];
                readonly implementation: readonly ["Wrap function in useCallback", "Provide dependency array", "Ensure dependencies are correct"];
                readonly impact: "medium";
                readonly codeExample: "const handleClick = useCallback(() => { /* ... */ }, [deps]);";
            };
            readonly strategies: readonly ["Memoize expensive components", "Memoize expensive computations", "Memoize function references", "Avoid creating objects/arrays in render", "Use key prop correctly for lists"];
        };
        readonly lazyLoading: {
            readonly description: "Lazy load components and routes";
            readonly patterns: readonly ["React.lazy for code splitting", "Suspense for loading states", "Route-based code splitting", "Component-based code splitting"];
            readonly implementation: readonly ["Use React.lazy(() => import('./Component'))", "Wrap in Suspense with fallback", "Split by route or feature", "Preload critical components"];
            readonly impact: "high";
            readonly benefits: readonly ["Reduced initial bundle size", "Faster initial load", "Load code on demand"];
        };
        readonly codeSplitting: {
            readonly description: "Split code into smaller chunks";
            readonly strategies: readonly ["Route-based splitting", "Component-based splitting", "Vendor splitting", "Dynamic imports"];
            readonly implementation: readonly ["Use dynamic imports", "Configure webpack/vite code splitting", "Split vendor bundles", "Optimize chunk sizes"];
            readonly impact: "high";
            readonly targets: {
                readonly initial: "Under 200KB gzipped";
                readonly chunks: "Under 100KB each";
                readonly total: "Minimize total bundle size";
            };
        };
        readonly virtualization: {
            readonly description: "Virtualize long lists for performance";
            readonly useCases: readonly ["Long lists (100+ items)", "Large tables", "Infinite scroll", "Performance-critical lists"];
            readonly tools: readonly ["react-window", "react-virtualized", "react-virtual"];
            readonly implementation: readonly ["Render only visible items", "Reuse DOM elements", "Virtual scrolling", "Window-based rendering"];
            readonly impact: "high";
            readonly benefits: readonly ["Constant render time", "Reduced DOM nodes", "Smooth scrolling", "Better memory usage"];
        };
    };
    /**
     * JavaScript Performance
     */
    readonly javascript: {
        readonly algorithmComplexity: {
            readonly description: "Understand and optimize algorithm complexity";
            readonly bigONotation: {
                readonly "O(1)": "Constant time - best";
                readonly "O(log n)": "Logarithmic - excellent";
                readonly "O(n)": "Linear - good";
                readonly "O(n log n)": "Linearithmic - acceptable";
                readonly "O(n\u00B2)": "Quadratic - poor";
                readonly "O(2\u207F)": "Exponential - very poor";
            };
            readonly optimization: readonly ["Choose appropriate data structures", "Optimize nested loops", "Use hash tables for O(1) lookups", "Avoid unnecessary iterations", "Use algorithms with better complexity"];
        };
        readonly optimizationStrategies: {
            readonly reduceIterations: {
                readonly name: "Reduce Iterations";
                readonly description: "Minimize loop iterations and array operations";
                readonly strategies: readonly ["Break early from loops when possible", "Combine multiple iterations", "Use efficient array methods", "Avoid nested loops when possible", "Cache loop-invariant computations"];
                readonly impact: "high";
            };
            readonly memoization: {
                readonly name: "Memoization";
                readonly description: "Cache results of expensive function calls";
                readonly useCases: readonly ["Recursive functions", "Expensive calculations", "Functions with same inputs", "Dynamic programming"];
                readonly implementation: readonly ["Use Map/WeakMap for cache", "Check cache before computation", "Store results in cache", "Clear cache when needed"];
                readonly impact: "high";
            };
            readonly caching: {
                readonly name: "Caching";
                readonly description: "Cache frequently accessed data";
                readonly strategies: readonly ["Browser caching (HTTP cache headers)", "Memory caching (in-memory stores)", "Application-level caching", "Service worker caching"];
                readonly implementation: readonly ["Set appropriate cache headers", "Use cache APIs", "Implement cache invalidation", "Use cache-control directives"];
                readonly impact: "medium";
            };
        };
        readonly memoryManagement: {
            readonly description: "Manage memory efficiently";
            readonly patterns: readonly ["Avoid memory leaks", "Release references", "Use weak references where appropriate", "Monitor memory usage", "Clean up event listeners", "Clear intervals/timeouts"];
            readonly detection: readonly ["Memory profiler", "Monitor memory growth", "Check for closures holding references", "Verify cleanup functions"];
            readonly impact: "medium";
        };
        readonly garbageCollection: {
            readonly description: "Understand and optimize for garbage collection";
            readonly awareness: readonly ["Avoid creating unnecessary objects", "Reuse objects when possible", "Be aware of GC pauses", "Use object pooling for high-frequency objects", "Minimize object creation in hot paths"];
            readonly impact: "low";
        };
    };
    /**
     * Bundle Optimization
     */
    readonly bundle: {
        readonly treeShaking: {
            readonly description: "Remove unused code from bundle";
            readonly strategies: readonly ["Use ES modules", "Avoid side effects in modules", "Use specific imports", "Configure bundler for tree shaking"];
            readonly implementation: readonly ["Use import { specific } from 'module'", "Avoid import * from 'module'", "Mark modules as side-effect free", "Configure bundler settings"];
            readonly impact: "high";
        };
        readonly dynamicImports: {
            readonly description: "Load code dynamically";
            readonly strategies: readonly ["Route-based code splitting", "Feature-based code splitting", "Conditional imports", "Lazy loading"];
            readonly implementation: readonly ["Use import() for dynamic imports", "Split by route or feature", "Preload critical chunks", "Optimize chunk sizes"];
            readonly impact: "high";
        };
        readonly bundleSizeAnalysis: {
            readonly description: "Analyze and optimize bundle size";
            readonly tools: readonly ["webpack-bundle-analyzer", "source-map-explorer", "vite-bundle-visualizer"];
            readonly strategies: readonly ["Identify large dependencies", "Find duplicate code", "Analyze chunk sizes", "Optimize imports", "Remove unused code"];
            readonly targets: {
                readonly initial: "Under 200KB gzipped";
                readonly total: "Under 500KB gzipped";
                readonly chunks: "Under 100KB each";
            };
            readonly impact: "high";
        };
        readonly assetOptimization: {
            readonly images: {
                readonly description: "Optimize images";
                readonly strategies: readonly ["Use appropriate image formats (WebP, AVIF)", "Implement responsive images", "Lazy load images", "Compress images", "Use CDN for images", "Serve appropriately sized images"];
                readonly impact: "high";
            };
            readonly fonts: {
                readonly description: "Optimize fonts";
                readonly strategies: readonly ["Use font-display: swap", "Subset fonts", "Preload critical fonts", "Use system fonts when possible", "Use variable fonts", "Limit font weights/styles"];
                readonly impact: "medium";
            };
        };
    };
    /**
     * Network Performance
     */
    readonly network: {
        readonly apiOptimization: {
            readonly batching: {
                readonly name: "Request Batching";
                readonly description: "Batch multiple requests into one";
                readonly useCases: readonly ["Multiple related requests", "N+1 query problem", "Related data"];
                readonly implementation: readonly ["Batch API requests", "Use GraphQL for flexible queries", "Implement request batching middleware", "Combine related requests"];
                readonly impact: "high";
            };
            readonly pagination: {
                readonly name: "Pagination";
                readonly description: "Load data in pages";
                readonly strategies: readonly ["Cursor-based pagination", "Offset-based pagination", "Infinite scroll", "Virtual scrolling"];
                readonly implementation: readonly ["Implement pagination on server", "Load data incrementally", "Cache paginated results", "Prefetch next page"];
                readonly impact: "medium";
            };
            readonly caching: {
                readonly name: "API Caching";
                readonly description: "Cache API responses";
                readonly strategies: readonly ["HTTP cache headers", "Service worker caching", "In-memory caching", "Cache invalidation strategies"];
                readonly implementation: readonly ["Set cache-control headers", "Use stale-while-revalidate", "Implement cache layer", "Handle cache invalidation"];
                readonly impact: "high";
            };
        };
        readonly requestDeduplication: {
            readonly description: "Prevent duplicate requests";
            readonly strategies: readonly ["Deduplicate identical requests", "Use request queue", "Cache in-flight requests", "Cancel duplicate requests"];
            readonly implementation: readonly ["Track in-flight requests", "Return same promise for duplicates", "Use request deduplication library", "Implement request queue"];
            readonly impact: "medium";
        };
        readonly prefetching: {
            readonly description: "Prefetch resources before needed";
            readonly strategies: readonly ["Link prefetching", "Route prefetching", "Data prefetching", "Resource hints"];
            readonly implementation: readonly ["Use <link rel='prefetch'>", "Prefetch on hover", "Prefetch critical routes", "Use resource hints (dns-prefetch, preconnect)"];
            readonly impact: "medium";
        };
        readonly serviceWorker: {
            readonly description: "Service worker for offline and caching";
            readonly strategies: readonly ["Cache static assets", "Cache API responses", "Offline fallbacks", "Background sync"];
            readonly implementation: readonly ["Register service worker", "Implement caching strategies", "Handle offline scenarios", "Update cache strategies"];
            readonly impact: "high";
        };
    };
    /**
     * Rendering Performance
     */
    readonly rendering: {
        readonly cssOptimization: {
            readonly description: "Optimize CSS for rendering";
            readonly gpuAccelerated: readonly ["transform (translate, scale, rotate)", "opacity", "filter (sparingly)", "will-change (use sparingly)"];
            readonly avoid: readonly ["width, height (causes layout recalculation)", "margin, padding (causes layout recalculation)", "top, left (use transform instead)", "Changing layout properties in animations"];
            readonly impact: "high";
        };
        readonly animationPerformance: {
            readonly description: "Optimize animations";
            readonly strategies: readonly ["Use requestAnimationFrame", "Use CSS animations/transitions", "Use transform and opacity", "Avoid layout-triggering properties", "Use will-change sparingly"];
            readonly implementation: readonly ["Use CSS for simple animations", "Use requestAnimationFrame for JS animations", "Use transform for movement", "Use opacity for fade", "60fps target"];
            readonly impact: "high";
        };
        readonly layoutThrashing: {
            readonly description: "Prevent layout thrashing";
            readonly prevention: readonly ["Batch DOM reads and writes", "Read layout properties together", "Write layout properties together", "Use requestAnimationFrame", "Avoid forced synchronous layout"];
            readonly impact: "high";
        };
        readonly paintOptimization: {
            readonly description: "Optimize paint operations";
            readonly strategies: readonly ["Reduce paint areas", "Use layers (transform, opacity)", "Avoid expensive paint properties", "Use contain CSS property", "Optimize repaints"];
            readonly impact: "medium";
        };
    };
    /**
     * Performance Metrics
     */
    readonly metrics: {
        readonly coreWebVitals: {
            readonly lcp: {
                readonly metric: PerformanceMetric;
                readonly name: "Largest Contentful Paint";
                readonly target: 2.5;
                readonly unit: "seconds";
                readonly description: "Time to render largest content element";
                readonly optimization: readonly ["Optimize images", "Reduce server response time", "Optimize CSS", "Remove render-blocking resources"];
            };
            readonly fid: {
                readonly metric: PerformanceMetric;
                readonly name: "First Input Delay";
                readonly target: 100;
                readonly unit: "milliseconds";
                readonly description: "Time from first interaction to response";
                readonly optimization: readonly ["Reduce JavaScript execution time", "Code splitting", "Defer non-critical JavaScript", "Optimize event handlers"];
            };
            readonly cls: {
                readonly metric: PerformanceMetric;
                readonly name: "Cumulative Layout Shift";
                readonly target: 0.1;
                readonly unit: "score";
                readonly description: "Visual stability metric";
                readonly optimization: readonly ["Size images and videos", "Reserve space for ads/embeds", "Avoid inserting content above existing content", "Use font-display: swap"];
            };
            readonly fcp: {
                readonly metric: PerformanceMetric;
                readonly name: "First Contentful Paint";
                readonly target: 1.8;
                readonly unit: "seconds";
                readonly description: "Time to first content render";
                readonly optimization: readonly ["Optimize critical rendering path", "Minimize render-blocking resources", "Optimize server response time", "Use resource hints"];
            };
            readonly tti: {
                readonly metric: PerformanceMetric;
                readonly name: "Time to Interactive";
                readonly target: 3.8;
                readonly unit: "seconds";
                readonly description: "Time until page is fully interactive";
                readonly optimization: readonly ["Reduce JavaScript execution", "Code splitting", "Defer non-critical JavaScript", "Optimize bundle size"];
            };
            readonly tbt: {
                readonly metric: PerformanceMetric;
                readonly name: "Total Blocking Time";
                readonly target: 200;
                readonly unit: "milliseconds";
                readonly description: "Total time page is blocked";
                readonly optimization: readonly ["Reduce long tasks", "Code splitting", "Defer non-critical JavaScript", "Optimize JavaScript execution"];
            };
        };
        readonly lighthouse: {
            readonly description: "Lighthouse performance scoring";
            readonly targets: {
                readonly performance: 90;
                readonly accessibility: 90;
                readonly bestPractices: 90;
                readonly seo: 90;
            };
            readonly metrics: readonly ["Performance score", "Core Web Vitals", "Opportunities", "Diagnostics"];
        };
        readonly performanceBudgets: {
            readonly initialLoad: {
                readonly metric: "Initial Bundle Size";
                readonly target: 200;
                readonly unit: "KB (gzipped)";
                readonly description: "Maximum initial bundle size";
            };
            readonly totalSize: {
                readonly metric: "Total Bundle Size";
                readonly target: 500;
                readonly unit: "KB (gzipped)";
                readonly description: "Maximum total bundle size";
            };
            readonly imageSize: {
                readonly metric: "Image Size";
                readonly target: 200;
                readonly unit: "KB";
                readonly description: "Maximum individual image size";
            };
            readonly apiResponse: {
                readonly metric: "API Response Time";
                readonly target: 200;
                readonly unit: "milliseconds";
                readonly description: "Maximum API response time";
            };
        };
        readonly monitoring: {
            readonly description: "Monitor performance in production";
            readonly tools: readonly ["Web Vitals", "Lighthouse CI", "Real User Monitoring (RUM)", "Synthetic monitoring"];
            readonly strategies: readonly ["Monitor Core Web Vitals", "Track performance budgets", "Set up alerts", "Analyze performance trends", "Monitor real user metrics"];
        };
    };
};
/**
 * Get optimization strategy by name
 */
export declare function getOptimizationStrategy(name: string): OptimizationStrategy | undefined;
/**
 * Check performance budget
 */
export declare function checkPerformanceBudget(metric: string, value: number, budget: PerformanceBudget): {
    passed: boolean;
    difference: number;
    percentage: number;
};
/**
 * Type exports
 */
export type { PerformanceBudget, PerformanceMetric, OptimizationStrategy };
//# sourceMappingURL=layer-23-performance-optimization.d.ts.map