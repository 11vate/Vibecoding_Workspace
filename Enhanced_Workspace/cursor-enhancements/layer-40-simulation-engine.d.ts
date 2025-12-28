/**
 * LAYER 40 — SIMULATION ENGINE
 *
 * Automated gameplay simulation and balance analysis.
 *
 * This layer provides simulation capabilities for testing game mechanics,
 * analyzing balance, detecting exploits, and providing actionable insights.
 */
/**
 * Simulation type
 */
export type SimulationType = "combat" | "economy" | "progression" | "balance" | "exploit-detection" | "performance";
/**
 * Simulation result
 */
export interface SimulationResult {
    type: SimulationType;
    iterations: number;
    duration: number;
    metrics: SimulationMetrics;
    insights: Insight[];
    recommendations: Recommendation[];
    data: SimulationData;
}
/**
 * Simulation metrics
 */
export interface SimulationMetrics {
    winRate?: number;
    averageDamage?: number;
    resourceFlow?: ResourceFlow[];
    progressionCurve?: ProgressionPoint[];
    balanceScore?: number;
    exploitCount?: number;
}
/**
 * Resource flow
 */
export interface ResourceFlow {
    resource: string;
    inflow: number;
    outflow: number;
    net: number;
    balance: number[];
}
/**
 * Progression point
 */
export interface ProgressionPoint {
    level: number;
    time: number;
    power: number;
    resources: Record<string, number>;
}
/**
 * Insight from simulation
 */
export interface Insight {
    type: "balance" | "exploit" | "performance" | "design";
    severity: "critical" | "high" | "medium" | "low";
    description: string;
    evidence: string;
    confidence: number;
}
/**
 * Recommendation
 */
export interface Recommendation {
    type: "parameter-adjustment" | "mechanic-change" | "optimization";
    target: string;
    action: string;
    expectedImpact: string;
    priority: "high" | "medium" | "low";
}
/**
 * Simulation data
 */
export interface SimulationData {
    raw: unknown[];
    aggregated: Record<string, unknown>;
    distributions: Distribution[];
    correlations: Correlation[];
}
/**
 * Distribution
 */
export interface Distribution {
    metric: string;
    values: number[];
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
}
/**
 * Correlation
 */
export interface Correlation {
    metric1: string;
    metric2: string;
    coefficient: number;
    significance: number;
}
/**
 * Combat simulation config
 */
export interface CombatSimulationConfig {
    iterations: number;
    teams: TeamConfig[];
    aiLevel?: "random" | "optimal" | "adaptive";
    recordDetails?: boolean;
}
/**
 * Team configuration
 */
export interface TeamConfig {
    id: string;
    units: UnitConfig[];
    strategy?: "aggressive" | "defensive" | "balanced";
}
/**
 * Unit configuration
 */
export interface UnitConfig {
    id: string;
    stats: UnitStats;
    abilities: string[];
    level?: number;
}
/**
 * Unit stats
 */
export interface UnitStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    [key: string]: number;
}
/**
 * Economy simulation config
 */
export interface EconomySimulationConfig {
    duration: number;
    initialResources: Record<string, number>;
    sources: ResourceSource[];
    sinks: ResourceSink[];
    players?: number;
}
/**
 * Resource source
 */
export interface ResourceSource {
    type: string;
    rate: number;
    conditions?: string[];
}
/**
 * Resource sink
 */
export interface ResourceSink {
    type: string;
    cost: number | ((resources: Record<string, number>) => number);
    frequency: number;
}
/**
 * Balance analysis config
 */
export interface BalanceAnalysisConfig {
    parameters: ParameterRange[];
    targetMetrics: TargetMetric[];
    iterations: number;
}
/**
 * Parameter range
 */
export interface ParameterRange {
    name: string;
    min: number;
    max: number;
    step?: number;
    current: number;
}
/**
 * Target metric
 */
export interface TargetMetric {
    name: string;
    target: number;
    tolerance: number;
    weight: number;
}
/**
 * Main simulation engine configuration
 */
export declare const SIMULATION_ENGINE: {
    /**
     * Simulation Types
     */
    readonly types: {
        readonly combat: {
            readonly description: "Combat system simulation";
            readonly capabilities: readonly ["Auto-battle simulation", "Win rate analysis", "Damage distribution", "Ability effectiveness", "Team composition analysis"];
            readonly metrics: readonly ["winRate", "averageDamage", "turnCount", "abilityUsage"];
        };
        readonly economy: {
            readonly description: "Economy and resource flow simulation";
            readonly capabilities: readonly ["Resource flow analysis", "Balance tracking", "Sink/source analysis", "Inflation detection", "Progression curves"];
            readonly metrics: readonly ["resourceBalance", "flowRate", "inflation", "progression"];
        };
        readonly progression: {
            readonly description: "Player progression simulation";
            readonly capabilities: readonly ["Leveling curves", "Unlock timing", "Power progression", "Time-to-completion", "Bottleneck detection"];
            readonly metrics: readonly ["levelTime", "powerCurve", "unlockTiming", "bottlenecks"];
        };
        readonly balance: {
            readonly description: "Game balance analysis";
            readonly capabilities: readonly ["Parameter sensitivity", "Balance scoring", "Optimal parameter finding", "Edge case detection"];
            readonly metrics: readonly ["balanceScore", "sensitivity", "optimalParams"];
        };
        readonly exploitDetection: {
            readonly description: "Exploit and abuse detection";
            readonly capabilities: readonly ["Infinite loop detection", "Resource exploitation", "Unintended interactions", "Power scaling issues"];
            readonly metrics: readonly ["exploitCount", "severity", "reproducibility"];
        };
        readonly performance: {
            readonly description: "Performance profiling";
            readonly capabilities: readonly ["Frame rate analysis", "Memory usage", "Load time", "Bottleneck identification"];
            readonly metrics: readonly ["fps", "memory", "loadTime", "bottlenecks"];
        };
    };
    /**
     * Simulation Algorithms
     */
    readonly algorithms: {
        readonly monteCarlo: {
            readonly description: "Monte Carlo simulation for statistical analysis";
            readonly useCases: readonly ["Combat", "Economy", "Progression"];
            readonly iterations: 10000;
        };
        readonly parameterSweep: {
            readonly description: "Parameter sweep for balance analysis";
            readonly useCases: readonly ["Balance", "Sensitivity"];
            readonly strategy: "Grid search or random sampling";
        };
        readonly geneticAlgorithm: {
            readonly description: "Genetic algorithm for optimization";
            readonly useCases: readonly ["Balance optimization", "Parameter tuning"];
            readonly generations: 100;
        };
        readonly reinforcementLearning: {
            readonly description: "RL agents for playtesting";
            readonly useCases: readonly ["Exploit detection", "Strategy analysis"];
            readonly episodes: 1000;
        };
    };
    /**
     * Analysis Methods
     */
    readonly analysis: {
        readonly statistical: {
            readonly description: "Statistical analysis of simulation results";
            readonly methods: readonly ["Mean", "Median", "StdDev", "Percentiles", "Distributions"];
        };
        readonly comparative: {
            readonly description: "Compare different configurations";
            readonly methods: readonly ["A/B testing", "Multi-variant", "Before/after"];
        };
        readonly predictive: {
            readonly description: "Predict outcomes based on parameters";
            readonly methods: readonly ["Regression", "Machine learning", "Extrapolation"];
        };
        readonly visual: {
            readonly description: "Visualize simulation data";
            readonly methods: readonly ["Charts", "Graphs", "Heatmaps", "Distributions"];
        };
    };
    /**
     * Reporting
     */
    readonly reporting: {
        readonly formats: readonly ["json", "csv", "html", "markdown"];
        readonly sections: readonly ["Executive Summary", "Metrics", "Insights", "Recommendations", "Raw Data", "Visualizations"];
    };
};
/**
 * Run combat simulation
 */
export declare function runCombatSimulation(config: CombatSimulationConfig): Promise<SimulationResult>;
/**
 * Run economy simulation
 */
export declare function runEconomySimulation(config: EconomySimulationConfig): Promise<SimulationResult>;
/**
 * Run balance analysis
 */
export declare function runBalanceAnalysis(config: BalanceAnalysisConfig): Promise<SimulationResult>;
/**
 * Detect exploits
 */
export declare function detectExploits(gameState: unknown, iterations: number): Promise<Insight[]>;
/**
 * Generate recommendations
 */
export declare function generateRecommendations(result: SimulationResult): Recommendation[];
/**
 * Type exports
 */
export type { SimulationType, SimulationResult, CombatSimulationConfig, EconomySimulationConfig, BalanceAnalysisConfig, Insight, Recommendation };
//# sourceMappingURL=layer-40-simulation-engine.d.ts.map