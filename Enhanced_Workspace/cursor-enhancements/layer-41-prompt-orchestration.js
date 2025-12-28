/**
 * LAYER 41 — PROMPT ORCHESTRATION
 *
 * Coordinate multimodal and game-dev prompts with existing layer system.
 *
 * This layer extends the meta-prompt system (Layer 14) to coordinate
 * multimodal prompts, game development prompts, and asset generation prompts
 * with the existing enhancement layers.
 */
/**
 * Main prompt orchestration configuration
 */
export const PROMPT_ORCHESTRATION = {
    /**
     * Prompt Categories
     */
    categories: {
        multimodal: {
            description: "Multimodal understanding and generation prompts",
            templates: [
                "sprite-analysis",
                "image-to-code",
                "multimodal-reasoning",
                "asset-generation"
            ],
            integrationLayers: ["layer-36", "layer-38", "layer-39"]
        },
        "game-dev": {
            description: "Game development and framework prompts",
            templates: [
                "phaser-scaffold",
                "animation-controller",
                "game-mechanic",
                "balance-analysis"
            ],
            integrationLayers: ["layer-37", "layer-40"]
        },
        "asset-generation": {
            description: "Asset generation and pipeline prompts",
            templates: [
                "sprite-parametric",
                "animation-sequence",
                "palette-constrained",
                "batch-generation"
            ],
            integrationLayers: ["layer-31", "layer-36", "layer-39"]
        },
        simulation: {
            description: "Simulation and balance analysis prompts",
            templates: [
                "combat-simulation",
                "economy-analysis",
                "balance-optimization",
                "exploit-detection"
            ],
            integrationLayers: ["layer-40"]
        },
        "code-generation": {
            description: "Code generation prompts",
            templates: [
                "framework-code",
                "pattern-implementation",
                "refactoring"
            ],
            integrationLayers: ["layer-21", "layer-37"]
        },
        design: {
            description: "Design and UI prompts",
            templates: [
                "ui-component",
                "layout-design",
                "visual-style"
            ],
            integrationLayers: ["layer-1", "layer-2", "layer-15", "layer-16"]
        },
        standard: {
            description: "Standard enhancement layer prompts",
            templates: [
                "code-improvement",
                "bug-fix",
                "documentation"
            ],
            integrationLayers: ["layer-11", "layer-22", "layer-29"]
        }
    },
    /**
     * Capability Detection
     */
    capabilityDetection: {
        multimodal: {
            triggers: [
                "analyze image",
                "sprite sheet",
                "generate sprite",
                "visual asset",
                "palette",
                "animation frames"
            ],
            confidenceThreshold: 0.7
        },
        assetGeneration: {
            triggers: [
                "create sprite",
                "generate asset",
                "make animation",
                "create background"
            ],
            confidenceThreshold: 0.7
        },
        gameFramework: {
            triggers: [
                "phaser",
                "game scene",
                "animation controller",
                "sprite loader",
                "game loop"
            ],
            confidenceThreshold: 0.8
        },
        simulation: {
            triggers: [
                "simulate",
                "balance",
                "test mechanic",
                "analyze economy",
                "detect exploit"
            ],
            confidenceThreshold: 0.8
        }
    },
    /**
     * Prompt Selection Strategy
     */
    selection: {
        strategies: {
            exactMatch: "Exact template name match",
            semanticSimilarity: "Semantic similarity to request",
            capabilityBased: "Based on detected capabilities",
            layerBased: "Based on active layers",
            hybrid: "Combine multiple strategies"
        },
        scoring: {
            exactMatch: 1.0,
            semanticSimilarity: 0.8,
            capabilityMatch: 0.7,
            layerIntegration: 0.6
        }
    },
    /**
     * Prompt Chaining
     */
    chaining: {
        strategies: {
            sequential: "Execute prompts in sequence",
            parallel: "Execute prompts in parallel",
            conditional: "Conditional execution based on results",
            iterative: "Iterative refinement"
        },
        patterns: {
            "asset-to-code": [
                { template: "sprite-analysis", output: "sprite-metadata" },
                { template: "image-to-code", input: "sprite-metadata", output: "code" }
            ],
            "design-to-implementation": [
                { template: "game-mechanic", output: "mechanic-spec" },
                { template: "framework-code", input: "mechanic-spec", output: "code" },
                { template: "balance-analysis", input: "code", output: "balance-report" }
            ]
        }
    },
    /**
     * Integration with Layer 14 (Meta-Prompt)
     */
    metaPromptIntegration: {
        phaseMapping: {
            "pre-audit": ["capability-detection", "template-selection"],
            "context-retrieval": ["project-context-loading", "related-prompt-history"],
            "execution": ["prompt-execution", "chain-orchestration"],
            "validation": ["output-validation", "quality-checks"]
        },
        layerCoordination: {
            "layer-36": "Multimodal prompts",
            "layer-37": "Game framework prompts",
            "layer-38": "Knowledge graph context",
            "layer-39": "Asset pipeline prompts",
            "layer-40": "Simulation prompts"
        }
    }
};
/**
 * Detect required capabilities from request
 */
export function detectCapabilities(request, context) {
    const capabilities = [];
    const lowerRequest = request.toLowerCase();
    // Detect multimodal needs
    if (lowerRequest.includes("analyze") && (lowerRequest.includes("image") || lowerRequest.includes("sprite"))) {
        capabilities.push({
            type: "multimodal",
            confidence: 0.9,
            parameters: { analysisType: "image" }
        });
    }
    // Detect asset generation needs
    if (lowerRequest.includes("generate") && (lowerRequest.includes("sprite") || lowerRequest.includes("asset"))) {
        capabilities.push({
            type: "asset-generation",
            confidence: 0.85,
            parameters: { assetType: "sprite" }
        });
    }
    // Detect game framework needs
    if (lowerRequest.includes("phaser") || lowerRequest.includes("game") || lowerRequest.includes("animation")) {
        capabilities.push({
            type: "game-framework",
            confidence: 0.8,
            parameters: { framework: lowerRequest.includes("phaser") ? "phaser" : undefined }
        });
    }
    // Detect simulation needs
    if (lowerRequest.includes("simulate") || lowerRequest.includes("balance") || lowerRequest.includes("test")) {
        capabilities.push({
            type: "simulation",
            confidence: 0.75,
            parameters: { simulationType: lowerRequest.includes("combat") ? "combat" : "balance" }
        });
    }
    return capabilities;
}
/**
 * Select appropriate prompt template
 */
export function selectPromptTemplate(context) {
    const templates = PROMPT_ORCHESTRATION.templates;
    let bestTemplate = null;
    let bestScore = 0;
    const alternatives = [];
    // Score templates based on detected capabilities
    for (const template of Object.values(templates)) {
        let score = 0;
        // Match category with detected capabilities
        for (const capability of context.detectedCapabilities) {
            if (template.category === "multimodal" && capability.type === "multimodal") {
                score += capability.confidence * 10;
            }
            if (template.category === "asset-generation" && capability.type === "asset-generation") {
                score += capability.confidence * 10;
            }
            if (template.category === "game-dev" && capability.type === "game-framework") {
                score += capability.confidence * 10;
            }
            if (template.category === "simulation" && capability.type === "simulation") {
                score += capability.confidence * 10;
            }
        }
        // Match with active layers
        for (const layerId of context.activeLayers) {
            if (template.integrationPoints.includes(layerId)) {
                score += 5;
            }
        }
        // Match with request keywords
        const lowerRequest = context.request.toLowerCase();
        if (template.name.toLowerCase().includes(lowerRequest.split(" ")[0])) {
            score += 3;
        }
        if (score > bestScore) {
            if (bestTemplate) {
                alternatives.push(bestTemplate.id);
            }
            bestScore = score;
            bestTemplate = template;
        }
        else if (score > 0) {
            alternatives.push(template.id);
        }
    }
    if (!bestTemplate) {
        // Fallback to standard template
        bestTemplate = templates["universal-context-primer"];
    }
    return {
        templateId: bestTemplate.id,
        template: bestTemplate,
        confidence: Math.min(1, bestScore / 20),
        reasoning: `Selected based on detected capabilities: ${context.detectedCapabilities.map(c => c.type).join(", ")}`,
        alternatives: alternatives.slice(0, 3)
    };
}
/**
 * Execute prompt template
 */
export async function executePrompt(templateId, input) {
    const templates = PROMPT_ORCHESTRATION.templates;
    const templateKey = `${templateId.category}:${templateId.name}`;
    const template = templates[templateKey];
    if (!template) {
        return {
            templateId,
            input,
            output: null,
            success: false,
            errors: [`Template not found: ${templateKey}`]
        };
    }
    try {
        // Validate required parameters
        const missingParams = [];
        for (const param of template.inputParameters) {
            if (param.required && !(param.name in input)) {
                missingParams.push(param.name);
            }
        }
        if (missingParams.length > 0) {
            return {
                templateId,
                input,
                output: null,
                success: false,
                errors: [`Missing required parameters: ${missingParams.join(", ")}`]
            };
        }
        // Build prompt from template
        let prompt = template.systemContext + "\n\n";
        prompt += "Input Parameters:\n";
        for (const [key, value] of Object.entries(input)) {
            prompt += `${key}: ${JSON.stringify(value)}\n`;
        }
        // Execute prompt (in production, this would call LLM API)
        // For now, return a placeholder result
        const output = {
            result: "Prompt executed successfully",
            generated: true
        };
        // Validate output
        const validationResults = validatePromptOutput(output, template);
        const hasErrors = validationResults.some(v => !v.passed);
        return {
            templateId,
            input,
            output,
            success: !hasErrors,
            errors: hasErrors ? validationResults.filter(v => !v.passed).map(v => v.message || v.criterion) : undefined,
            validationResults,
            nextSteps: template.processSteps.slice(1) // Remaining steps
        };
    }
    catch (error) {
        return {
            templateId,
            input,
            output: null,
            success: false,
            errors: [error instanceof Error ? error.message : "Unknown error"]
        };
    }
}
/**
 * Execute prompt chain
 */
export async function executePromptChain(chain, initialInput) {
    const results = [];
    let currentInput = { ...initialInput };
    const outputs = {};
    if (chain.parallel) {
        // Execute all steps in parallel
        const promises = chain.steps.map(step => {
            const stepInput = mapInputs(step.inputMapping, outputs, currentInput);
            return executePrompt(step.templateId, stepInput);
        });
        const parallelResults = await Promise.all(promises);
        results.push(...parallelResults);
        // Store outputs
        for (let i = 0; i < chain.steps.length; i++) {
            const step = chain.steps[i];
            const result = parallelResults[i];
            outputs[step.templateId.name] = result.output;
        }
    }
    else {
        // Execute steps sequentially
        for (const step of chain.steps) {
            // Check condition if present
            if (step.condition) {
                const shouldExecute = evaluateCondition(step.condition, outputs, currentInput);
                if (!shouldExecute) {
                    continue;
                }
            }
            // Map inputs from previous outputs
            const stepInput = mapInputs(step.inputMapping, outputs, currentInput);
            // Execute step
            const result = await executePrompt(step.templateId, stepInput);
            results.push(result);
            // Store output for next steps
            outputs[step.templateId.name] = result.output;
            // Stop chain if step failed
            if (!result.success) {
                break;
            }
        }
    }
    return results;
}
/**
 * Map inputs from previous outputs
 */
function mapInputs(inputMapping, outputs, currentInput) {
    const mapped = {};
    for (const [targetKey, sourcePath] of Object.entries(inputMapping)) {
        if (sourcePath.startsWith("output.")) {
            const sourceKey = sourcePath.substring(7);
            mapped[targetKey] = outputs[sourceKey];
        }
        else if (sourcePath.startsWith("input.")) {
            const sourceKey = sourcePath.substring(6);
            mapped[targetKey] = currentInput[sourceKey];
        }
        else {
            mapped[targetKey] = sourcePath;
        }
    }
    return mapped;
}
/**
 * Evaluate condition (simplified)
 */
function evaluateCondition(condition, outputs, currentInput) {
    // Simplified condition evaluation
    // In production, would use a proper expression evaluator
    try {
        // Replace variables with values
        let evalCondition = condition;
        for (const [key, value] of Object.entries(outputs)) {
            evalCondition = evalCondition.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), JSON.stringify(value));
        }
        for (const [key, value] of Object.entries(currentInput)) {
            evalCondition = evalCondition.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), JSON.stringify(value));
        }
        // Evaluate (simplified - in production would be safer)
        return eval(evalCondition);
    }
    catch {
        return true; // Default to true if evaluation fails
    }
}
/**
 * Validate prompt output
 */
export function validatePromptOutput(output, template) {
    const results = [];
    for (const criterion of template.validationCriteria) {
        let passed = false;
        let message;
        // Check output format
        if (criterion.includes("JSON")) {
            if (typeof output === "object" && output !== null) {
                passed = true;
            }
            else {
                message = "Output is not a JSON object";
            }
        }
        // Check output type
        if (criterion.includes("string")) {
            passed = typeof output === "string";
            if (!passed) {
                message = "Output is not a string";
            }
        }
        // Check required fields (if output is object)
        if (criterion.includes("required fields")) {
            if (typeof output === "object" && output !== null) {
                // Extract required field names from criterion
                const requiredFields = template.inputParameters
                    .filter(p => p.required)
                    .map(p => p.name);
                const outputObj = output;
                const missingFields = requiredFields.filter(field => !(field in outputObj));
                if (missingFields.length === 0) {
                    passed = true;
                }
                else {
                    message = `Missing required fields: ${missingFields.join(", ")}`;
                }
            }
            else {
                message = "Output is not an object";
            }
        }
        // Default: check if output exists
        if (!criterion.includes("JSON") && !criterion.includes("string") && !criterion.includes("required")) {
            passed = output !== null && output !== undefined;
            if (!passed) {
                message = "Output is null or undefined";
            }
        }
        results.push({
            criterion,
            passed,
            message
        });
    }
    return results;
}
//# sourceMappingURL=layer-41-prompt-orchestration.js.map