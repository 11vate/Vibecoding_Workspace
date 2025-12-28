/**
 * LAYER 40 — SIMULATION ENGINE
 *
 * Automated gameplay simulation and balance analysis.
 *
 * This layer provides simulation capabilities for testing game mechanics,
 * analyzing balance, detecting exploits, and providing actionable insights.
 */
/**
 * Main simulation engine configuration
 */
export const SIMULATION_ENGINE = {
    /**
     * Simulation Types
     */
    types: {
        combat: {
            description: "Combat system simulation",
            capabilities: [
                "Auto-battle simulation",
                "Win rate analysis",
                "Damage distribution",
                "Ability effectiveness",
                "Team composition analysis"
            ],
            metrics: ["winRate", "averageDamage", "turnCount", "abilityUsage"]
        },
        economy: {
            description: "Economy and resource flow simulation",
            capabilities: [
                "Resource flow analysis",
                "Balance tracking",
                "Sink/source analysis",
                "Inflation detection",
                "Progression curves"
            ],
            metrics: ["resourceBalance", "flowRate", "inflation", "progression"]
        },
        progression: {
            description: "Player progression simulation",
            capabilities: [
                "Leveling curves",
                "Unlock timing",
                "Power progression",
                "Time-to-completion",
                "Bottleneck detection"
            ],
            metrics: ["levelTime", "powerCurve", "unlockTiming", "bottlenecks"]
        },
        balance: {
            description: "Game balance analysis",
            capabilities: [
                "Parameter sensitivity",
                "Balance scoring",
                "Optimal parameter finding",
                "Edge case detection"
            ],
            metrics: ["balanceScore", "sensitivity", "optimalParams"]
        },
        exploitDetection: {
            description: "Exploit and abuse detection",
            capabilities: [
                "Infinite loop detection",
                "Resource exploitation",
                "Unintended interactions",
                "Power scaling issues"
            ],
            metrics: ["exploitCount", "severity", "reproducibility"]
        },
        performance: {
            description: "Performance profiling",
            capabilities: [
                "Frame rate analysis",
                "Memory usage",
                "Load time",
                "Bottleneck identification"
            ],
            metrics: ["fps", "memory", "loadTime", "bottlenecks"]
        }
    },
    /**
     * Simulation Algorithms
     */
    algorithms: {
        monteCarlo: {
            description: "Monte Carlo simulation for statistical analysis",
            useCases: ["Combat", "Economy", "Progression"],
            iterations: 10000
        },
        parameterSweep: {
            description: "Parameter sweep for balance analysis",
            useCases: ["Balance", "Sensitivity"],
            strategy: "Grid search or random sampling"
        },
        geneticAlgorithm: {
            description: "Genetic algorithm for optimization",
            useCases: ["Balance optimization", "Parameter tuning"],
            generations: 100
        },
        reinforcementLearning: {
            description: "RL agents for playtesting",
            useCases: ["Exploit detection", "Strategy analysis"],
            episodes: 1000
        }
    },
    /**
     * Analysis Methods
     */
    analysis: {
        statistical: {
            description: "Statistical analysis of simulation results",
            methods: ["Mean", "Median", "StdDev", "Percentiles", "Distributions"]
        },
        comparative: {
            description: "Compare different configurations",
            methods: ["A/B testing", "Multi-variant", "Before/after"]
        },
        predictive: {
            description: "Predict outcomes based on parameters",
            methods: ["Regression", "Machine learning", "Extrapolation"]
        },
        visual: {
            description: "Visualize simulation data",
            methods: ["Charts", "Graphs", "Heatmaps", "Distributions"]
        }
    },
    /**
     * Reporting
     */
    reporting: {
        formats: ["json", "csv", "html", "markdown"],
        sections: [
            "Executive Summary",
            "Metrics",
            "Insights",
            "Recommendations",
            "Raw Data",
            "Visualizations"
        ]
    }
};
/**
 * Run combat simulation
 */
export async function runCombatSimulation(config) {
    const startTime = Date.now();
    const results = [];
    const insights = [];
    const rawData = [];
    // Run Monte Carlo simulation
    for (let i = 0; i < config.iterations; i++) {
        const result = simulateCombat(config.teams, config.aiLevel || "random");
        results.push(result);
        rawData.push(result);
    }
    // Calculate metrics
    const team1Wins = results.filter(r => r.winner === config.teams[0].id).length;
    const winRate = team1Wins / config.iterations;
    const averageDamage = results.reduce((sum, r) => sum + r.damage, 0) / results.length;
    const averageTurns = results.reduce((sum, r) => sum + r.turns, 0) / results.length;
    // Generate insights
    if (winRate < 0.4 || winRate > 0.6) {
        insights.push({
            type: "balance",
            severity: winRate < 0.3 || winRate > 0.7 ? "critical" : "high",
            description: `Win rate imbalance: ${(winRate * 100).toFixed(1)}%`,
            evidence: `${team1Wins} wins out of ${config.iterations} iterations`,
            confidence: 0.9
        });
    }
    // Calculate distributions
    const damageValues = results.map(r => r.damage);
    const turnValues = results.map(r => r.turns);
    const duration = Date.now() - startTime;
    return {
        type: "combat",
        iterations: config.iterations,
        duration,
        metrics: {
            winRate,
            averageDamage,
            averageTurns
        },
        insights,
        recommendations: generateRecommendations({
            type: "combat",
            iterations: config.iterations,
            duration,
            metrics: { winRate, averageDamage },
            insights,
            recommendations: [],
            data: {
                raw: rawData,
                aggregated: { winRate, averageDamage, averageTurns },
                distributions: [
                    calculateDistribution(damageValues, "damage"),
                    calculateDistribution(turnValues, "turns")
                ],
                correlations: []
            }
        }),
        data: {
            raw: rawData,
            aggregated: { winRate, averageDamage, averageTurns },
            distributions: [
                calculateDistribution(damageValues, "damage"),
                calculateDistribution(turnValues, "turns")
            ],
            correlations: []
        }
    };
}
/**
 * Simulate a single combat
 */
function simulateCombat(teams, aiLevel) {
    // Simplified combat simulation
    let turn = 0;
    const maxTurns = 100;
    let totalDamage = 0;
    // Initialize unit health
    const teamHealth = {};
    for (const team of teams) {
        for (const unit of team.units) {
            teamHealth[unit.id] = unit.stats.health;
        }
    }
    while (turn < maxTurns) {
        turn++;
        // Team 1 attacks Team 2
        for (const unit1 of teams[0].units) {
            if (teamHealth[unit1.id] <= 0)
                continue;
            const target = teams[1].units[Math.floor(Math.random() * teams[1].units.length)];
            const damage = Math.max(0, unit1.stats.attack - target.stats.defense);
            teamHealth[target.id] -= damage;
            totalDamage += damage;
            if (teamHealth[target.id] <= 0) {
                // Check if team 2 is defeated
                const team2Alive = teams[1].units.some(u => teamHealth[u.id] > 0);
                if (!team2Alive) {
                    return { winner: teams[0].id, turns: turn, damage: totalDamage };
                }
            }
        }
        // Team 2 attacks Team 1
        for (const unit2 of teams[1].units) {
            if (teamHealth[unit2.id] <= 0)
                continue;
            const target = teams[0].units[Math.floor(Math.random() * teams[0].units.length)];
            const damage = Math.max(0, unit2.stats.attack - target.stats.defense);
            teamHealth[target.id] -= damage;
            totalDamage += damage;
            if (teamHealth[target.id] <= 0) {
                // Check if team 1 is defeated
                const team1Alive = teams[0].units.some(u => teamHealth[u.id] > 0);
                if (!team1Alive) {
                    return { winner: teams[1].id, turns: turn, damage: totalDamage };
                }
            }
        }
    }
    // Timeout - determine winner by remaining health
    const team1Health = teams[0].units.reduce((sum, u) => sum + Math.max(0, teamHealth[u.id]), 0);
    const team2Health = teams[1].units.reduce((sum, u) => sum + Math.max(0, teamHealth[u.id]), 0);
    return {
        winner: team1Health > team2Health ? teams[0].id : teams[1].id,
        turns: maxTurns,
        damage: totalDamage
    };
}
/**
 * Calculate distribution statistics
 */
function calculateDistribution(values, metric) {
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const median = sorted[Math.floor(sorted.length / 2)];
    return {
        metric,
        values,
        mean,
        median,
        stdDev,
        min: sorted[0],
        max: sorted[sorted.length - 1]
    };
}
/**
 * Run economy simulation
 */
export async function runEconomySimulation(config) {
    const startTime = Date.now();
    const resources = { ...config.initialResources };
    const resourceHistory = {};
    const insights = [];
    const rawData = [];
    // Initialize history
    for (const resource of Object.keys(resources)) {
        resourceHistory[resource] = [resources[resource]];
    }
    // Simulate over time
    for (let time = 0; time < config.duration; time++) {
        // Apply sources
        for (const source of config.sources) {
            if (shouldApplySource(source, resources, time)) {
                resources[source.type] = (resources[source.type] || 0) + source.rate;
            }
        }
        // Apply sinks
        for (const sink of config.sinks) {
            if (time % sink.frequency === 0) {
                const cost = typeof sink.cost === 'function' ? sink.cost(resources) : sink.cost;
                if (resources[sink.type] !== undefined && resources[sink.type] >= cost) {
                    resources[sink.type] -= cost;
                }
            }
        }
        // Record state
        for (const resource of Object.keys(resources)) {
            resourceHistory[resource].push(resources[resource]);
        }
        rawData.push({ time, resources: { ...resources } });
    }
    // Calculate resource flows
    const resourceFlows = [];
    for (const resource of Object.keys(resources)) {
        const history = resourceHistory[resource];
        const initial = history[0];
        const final = history[history.length - 1];
        const inflow = config.sources
            .filter(s => s.type === resource)
            .reduce((sum, s) => sum + s.rate * config.duration, 0);
        const outflow = config.sinks
            .filter(s => s.type === resource)
            .reduce((sum, s) => {
            const cost = typeof s.cost === 'function' ? s.cost(resources) : s.cost;
            return sum + cost * (config.duration / s.frequency);
        }, 0);
        resourceFlows.push({
            resource,
            inflow,
            outflow,
            net: final - initial,
            balance: history
        });
    }
    // Check for inflation
    for (const flow of resourceFlows) {
        if (flow.net > flow.inflow * 0.5) {
            insights.push({
                type: "balance",
                severity: "high",
                description: `Resource inflation detected: ${flow.resource}`,
                evidence: `Net gain of ${flow.net.toFixed(2)} over ${config.duration} time units`,
                confidence: 0.8
            });
        }
    }
    const duration = Date.now() - startTime;
    return {
        type: "economy",
        iterations: config.duration,
        duration,
        metrics: {
            resourceFlow: resourceFlows
        },
        insights,
        recommendations: generateRecommendations({
            type: "economy",
            iterations: config.duration,
            duration,
            metrics: { resourceFlow: resourceFlows },
            insights,
            recommendations: [],
            data: {
                raw: rawData,
                aggregated: { resources },
                distributions: [],
                correlations: []
            }
        }),
        data: {
            raw: rawData,
            aggregated: { resources },
            distributions: [],
            correlations: []
        }
    };
}
/**
 * Check if source should apply
 */
function shouldApplySource(source, resources, time) {
    if (!source.conditions || source.conditions.length === 0) {
        return true;
    }
    // Simplified condition checking
    for (const condition of source.conditions) {
        // In production, this would parse and evaluate conditions
        // For now, always return true
    }
    return true;
}
/**
 * Run balance analysis
 */
export async function runBalanceAnalysis(config) {
    const startTime = Date.now();
    const insights = [];
    const rawData = [];
    const parameterResults = {};
    // Parameter sweep
    for (const param of config.parameters) {
        const values = [];
        const step = param.step || (param.max - param.min) / 10;
        for (let value = param.min; value <= param.max; value += step) {
            // Run simulation with this parameter value
            const result = simulateWithParameter(param.name, value, config.targetMetrics);
            values.push(result.score);
            rawData.push({ parameter: param.name, value, score: result.score });
        }
        parameterResults[param.name] = values;
    }
    // Find optimal parameters
    const optimalParams = {};
    for (const param of config.parameters) {
        const results = parameterResults[param.name];
        const maxIndex = results.indexOf(Math.max(...results));
        const step = param.step || (param.max - param.min) / 10;
        optimalParams[param.name] = param.min + maxIndex * step;
    }
    // Calculate overall balance score
    const balanceScore = calculateBalanceScore(config.targetMetrics, optimalParams);
    // Generate insights
    if (balanceScore < 0.7) {
        insights.push({
            type: "balance",
            severity: balanceScore < 0.5 ? "critical" : "high",
            description: `Low balance score: ${balanceScore.toFixed(2)}`,
            evidence: "Parameter sweep indicates balance issues",
            confidence: 0.85
        });
    }
    const duration = Date.now() - startTime;
    return {
        type: "balance",
        iterations: config.iterations,
        duration,
        metrics: {
            balanceScore
        },
        insights,
        recommendations: generateRecommendations({
            type: "balance",
            iterations: config.iterations,
            duration,
            metrics: { balanceScore },
            insights,
            recommendations: [],
            data: {
                raw: rawData,
                aggregated: { optimalParams },
                distributions: [],
                correlations: []
            }
        }),
        data: {
            raw: rawData,
            aggregated: { optimalParams },
            distributions: [],
            correlations: []
        }
    };
}
/**
 * Simulate with specific parameter value
 */
function simulateWithParameter(paramName, value, targetMetrics) {
    // Simplified simulation - in production would run actual game logic
    let totalScore = 0;
    let totalWeight = 0;
    for (const metric of targetMetrics) {
        // Simulate metric value based on parameter
        const simulatedValue = simulateMetricValue(paramName, value, metric.name);
        const distance = Math.abs(simulatedValue - metric.target);
        const normalizedDistance = distance / metric.tolerance;
        const metricScore = Math.max(0, 1 - normalizedDistance);
        totalScore += metricScore * metric.weight;
        totalWeight += metric.weight;
    }
    return {
        score: totalWeight > 0 ? totalScore / totalWeight : 0
    };
}
/**
 * Simulate metric value (placeholder)
 */
function simulateMetricValue(paramName, paramValue, metricName) {
    // Simplified - in production would use actual game mechanics
    return paramValue * 0.5 + Math.random() * 0.2;
}
/**
 * Calculate balance score
 */
function calculateBalanceScore(targetMetrics, optimalParams) {
    // Simplified balance score calculation
    let totalScore = 0;
    let totalWeight = 0;
    for (const metric of targetMetrics) {
        const result = simulateWithParameter("", 0, [metric]);
        totalScore += result.score * metric.weight;
        totalWeight += metric.weight;
    }
    return totalWeight > 0 ? totalScore / totalWeight : 0;
}
/**
 * Detect exploits
 */
export async function detectExploits(gameState, iterations) {
    const insights = [];
    // Run multiple iterations to detect patterns
    const results = [];
    for (let i = 0; i < iterations; i++) {
        // Simulate game state evolution
        const result = simulateGameState(gameState);
        results.push(result);
    }
    // Check for infinite resource generation
    for (const resource of Object.keys(results[0].resources)) {
        const values = results.map(r => r.resources[resource] || 0);
        const growth = values[values.length - 1] - values[0];
        if (growth > values[0] * 10) {
            insights.push({
                type: "exploit",
                severity: "critical",
                description: `Potential infinite resource generation: ${resource}`,
                evidence: `Resource grew from ${values[0]} to ${values[values.length - 1]} in ${iterations} iterations`,
                confidence: 0.9
            });
        }
    }
    // Check for action loops
    const actionFrequencies = {};
    for (const result of results) {
        for (const action of result.actions) {
            actionFrequencies[action] = (actionFrequencies[action] || 0) + 1;
        }
    }
    for (const [action, count] of Object.entries(actionFrequencies)) {
        if (count > iterations * 0.8) {
            insights.push({
                type: "exploit",
                severity: "high",
                description: `Potential action loop: ${action}`,
                evidence: `Action executed ${count} times in ${iterations} iterations`,
                confidence: 0.8
            });
        }
    }
    return insights;
}
/**
 * Simulate game state (placeholder)
 */
function simulateGameState(initialState) {
    // Simplified simulation
    return {
        resources: { gold: 100, energy: 50 },
        actions: ["action1", "action2"]
    };
}
/**
 * Generate recommendations
 */
export function generateRecommendations(result) {
    const recommendations = [];
    // Analyze insights and generate recommendations
    for (const insight of result.insights) {
        if (insight.type === "balance" && insight.severity === "critical") {
            recommendations.push({
                type: "parameter-adjustment",
                target: "balance_parameters",
                action: "Adjust win rate parameters to target 50%",
                expectedImpact: "Improved game balance and player experience",
                priority: "high"
            });
        }
        if (insight.type === "exploit" && insight.severity === "critical") {
            recommendations.push({
                type: "mechanic-change",
                target: insight.description.split(":")[0],
                action: "Add rate limiting or cooldown to prevent exploitation",
                expectedImpact: "Prevent resource inflation and maintain game economy",
                priority: "high"
            });
        }
    }
    // Generate recommendations based on metrics
    if (result.type === "combat" && result.metrics.winRate !== undefined) {
        if (result.metrics.winRate < 0.4) {
            recommendations.push({
                type: "parameter-adjustment",
                target: "team1_stats",
                action: "Increase team 1 stats or decrease team 2 stats",
                expectedImpact: "Balance win rate closer to 50%",
                priority: "high"
            });
        }
        else if (result.metrics.winRate > 0.6) {
            recommendations.push({
                type: "parameter-adjustment",
                target: "team2_stats",
                action: "Increase team 2 stats or decrease team 1 stats",
                expectedImpact: "Balance win rate closer to 50%",
                priority: "high"
            });
        }
    }
    if (result.type === "economy" && result.metrics.resourceFlow) {
        for (const flow of result.metrics.resourceFlow) {
            if (flow.net > flow.inflow * 0.5) {
                recommendations.push({
                    type: "mechanic-change",
                    target: flow.resource,
                    action: "Increase sink costs or reduce source rates",
                    expectedImpact: "Prevent resource inflation",
                    priority: "medium"
                });
            }
        }
    }
    return recommendations;
}
//# sourceMappingURL=layer-40-simulation-engine.js.map