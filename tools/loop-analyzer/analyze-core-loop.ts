/**
 * Core Loop Analyzer - Validate core gameplay loop timing
 *
 * Purpose: Ensure core loop completes in < 60 seconds
 * Authority: Tier 2 (Mandatory for engagement validation)
 * Use: Design validation, pacing analysis
 */

import * as fs from 'fs';
import * as path from 'path';

export interface LoopAnalysisResult {
  projectName: string;
  coreLoop: CoreLoopDefinition | null;
  estimatedDuration: number; // seconds
  passesGate: boolean; // < 60 seconds
  steps: LoopStep[];
  issues: string[];
  suggestions: string[];
  pacingScore: number; // 0-100
}

export interface CoreLoopDefinition {
  name: string;
  description: string;
  steps: LoopStep[];
  targetDuration?: number;
}

export interface LoopStep {
  name: string;
  action: string;
  estimatedSeconds: number;
  type: StepType;
  engagementLevel: 'low' | 'medium' | 'high';
}

export type StepType =
  | 'input'        // Player provides input
  | 'decision'     // Player makes decision
  | 'action'       // Player executes action
  | 'feedback'     // System provides feedback
  | 'reward'       // Player receives reward
  | 'transition';  // Moving between states

const CORE_LOOP_THRESHOLD = 60; // seconds
const IDEAL_LOOP_DURATION = 30; // seconds (sweet spot)
const MIN_LOOP_DURATION = 5; // seconds (too fast = shallow)

/**
 * Analyze core loop from blueprint or design document
 */
export function analyzeCoreLoop(blueprintPath: string): LoopAnalysisResult {
  const content = fs.readFileSync(blueprintPath, 'utf-8');

  // Extract core loop definition
  const coreLoop = extractCoreLoop(content);

  if (!coreLoop) {
    return {
      projectName: path.basename(blueprintPath, path.extname(blueprintPath)),
      coreLoop: null,
      estimatedDuration: 0,
      passesGate: false,
      steps: [],
      issues: ['No core loop definition found in blueprint'],
      suggestions: ['Define core loop in ## Core Loop section'],
      pacingScore: 0
    };
  }

  // Calculate total duration
  const estimatedDuration = coreLoop.steps.reduce((sum, step) => sum + step.estimatedSeconds, 0);

  // Analyze issues
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (estimatedDuration > CORE_LOOP_THRESHOLD) {
    issues.push(`Core loop duration (${estimatedDuration}s) exceeds 60s threshold`);
    suggestions.push('Simplify loop or split into primary and secondary loops');
  }

  if (estimatedDuration < MIN_LOOP_DURATION) {
    issues.push(`Core loop duration (${estimatedDuration}s) is too short - may feel shallow`);
    suggestions.push('Add meaningful decision points or feedback');
  }

  // Check for essential step types
  const stepTypes = new Set(coreLoop.steps.map(s => s.type));

  if (!stepTypes.has('decision')) {
    issues.push('Core loop lacks decision-making - reduces engagement');
    suggestions.push('Add meaningful player choice to increase engagement');
  }

  if (!stepTypes.has('feedback')) {
    issues.push('Core loop lacks feedback - players need to see results');
    suggestions.push('Add visual/audio feedback for player actions');
  }

  if (!stepTypes.has('reward')) {
    issues.push('Core loop lacks reward - reduces motivation');
    suggestions.push('Add reward (progression, items, unlocks) to reinforce loop');
  }

  // Check engagement distribution
  const highEngagement = coreLoop.steps.filter(s => s.engagementLevel === 'high').length;
  const totalSteps = coreLoop.steps.length;

  if (highEngagement / totalSteps < 0.3) {
    issues.push('Less than 30% of steps are highly engaging');
    suggestions.push('Increase engagement by adding challenges or choices');
  }

  // Calculate pacing score
  const pacingScore = calculatePacingScore(coreLoop, estimatedDuration);

  return {
    projectName: path.basename(blueprintPath, path.extname(blueprintPath)),
    coreLoop,
    estimatedDuration,
    passesGate: estimatedDuration <= CORE_LOOP_THRESHOLD && estimatedDuration >= MIN_LOOP_DURATION,
    steps: coreLoop.steps,
    issues,
    suggestions,
    pacingScore
  };
}

/**
 * Extract core loop from markdown blueprint
 */
function extractCoreLoop(content: string): CoreLoopDefinition | null {
  const lines = content.split('\n');

  // Find core loop section
  let inCoreLoopSection = false;
  let coreLoopLines: string[] = [];

  for (const line of lines) {
    if (/^##\s+Core\s+Loop/i.test(line)) {
      inCoreLoopSection = true;
      continue;
    }

    if (inCoreLoopSection && /^##\s+/.test(line)) {
      // End of core loop section
      break;
    }

    if (inCoreLoopSection) {
      coreLoopLines.push(line);
    }
  }

  if (coreLoopLines.length === 0) {
    return null;
  }

  const coreLoopText = coreLoopLines.join('\n');

  // Extract loop name and description
  const nameMatch = coreLoopText.match(/\*\*Name\*\*:\s*(.+)/);
  const descMatch = coreLoopText.match(/\*\*Description\*\*:\s*(.+)/);

  const name = nameMatch ? nameMatch[1].trim() : 'Unnamed Loop';
  const description = descMatch ? descMatch[1].trim() : '';

  // Extract steps (numbered list)
  const steps: LoopStep[] = [];
  const stepRegex = /^\d+\.\s+(.+?)(?:\s*\((\d+)s?\))?/gm;

  let match;
  while ((match = stepRegex.exec(coreLoopText)) !== null) {
    const stepText = match[1].trim();
    const duration = match[2] ? parseInt(match[2]) : estimateStepDuration(stepText);

    const step = parseStep(stepText, duration);
    steps.push(step);
  }

  if (steps.length === 0) {
    return null;
  }

  return {
    name,
    description,
    steps
  };
}

/**
 * Parse step text into structured step
 */
function parseStep(stepText: string, duration: number): LoopStep {
  const lowerText = stepText.toLowerCase();

  // Determine step type based on keywords
  let type: StepType = 'action';
  let engagementLevel: 'low' | 'medium' | 'high' = 'medium';

  if (lowerText.includes('choose') || lowerText.includes('decide') || lowerText.includes('select')) {
    type = 'decision';
    engagementLevel = 'high';
  } else if (lowerText.includes('tap') || lowerText.includes('click') || lowerText.includes('drag')) {
    type = 'input';
    engagementLevel = 'medium';
  } else if (lowerText.includes('see') || lowerText.includes('view') || lowerText.includes('watch')) {
    type = 'feedback';
    engagementLevel = 'low';
  } else if (lowerText.includes('earn') || lowerText.includes('gain') || lowerText.includes('unlock') || lowerText.includes('reward')) {
    type = 'reward';
    engagementLevel = 'high';
  } else if (lowerText.includes('move') || lowerText.includes('navigate') || lowerText.includes('return')) {
    type = 'transition';
    engagementLevel = 'low';
  }

  return {
    name: stepText,
    action: stepText,
    estimatedSeconds: duration,
    type,
    engagementLevel
  };
}

/**
 * Estimate step duration based on text
 */
function estimateStepDuration(stepText: string): number {
  const lowerText = stepText.toLowerCase();

  // Quick actions
  if (lowerText.includes('tap') || lowerText.includes('click')) {
    return 1;
  }

  // Decision-making
  if (lowerText.includes('choose') || lowerText.includes('decide') || lowerText.includes('select')) {
    return 5;
  }

  // Viewing/feedback
  if (lowerText.includes('see') || lowerText.includes('view') || lowerText.includes('watch')) {
    return 3;
  }

  // Complex actions
  if (lowerText.includes('drag') || lowerText.includes('combine') || lowerText.includes('fuse')) {
    return 4;
  }

  // Default
  return 3;
}

/**
 * Calculate pacing score (0-100)
 */
function calculatePacingScore(loop: CoreLoopDefinition, duration: number): number {
  let score = 100;

  // Duration scoring
  if (duration > CORE_LOOP_THRESHOLD) {
    score -= (duration - CORE_LOOP_THRESHOLD) * 2; // -2 points per second over
  } else if (duration < MIN_LOOP_DURATION) {
    score -= (MIN_LOOP_DURATION - duration) * 5; // -5 points per second under
  } else if (Math.abs(duration - IDEAL_LOOP_DURATION) <= 10) {
    score += 10; // Bonus for ideal range
  }

  // Step variety
  const stepTypes = new Set(loop.steps.map(s => s.type));
  score += stepTypes.size * 5; // +5 per unique step type

  // Engagement distribution
  const highEngagement = loop.steps.filter(s => s.engagementLevel === 'high').length;
  const engagementRatio = highEngagement / loop.steps.length;
  score += engagementRatio * 20; // Up to +20 for high engagement

  // Essential elements
  if (stepTypes.has('decision')) score += 10;
  if (stepTypes.has('reward')) score += 10;
  if (stepTypes.has('feedback')) score += 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Analyze pacing across multiple loops
 */
export function analyzePacing(results: LoopAnalysisResult[]): {
  averageDuration: number;
  averagePacingScore: number;
  loopsPassing: number;
  loopsFailing: number;
  recommendations: string[];
} {
  const validResults = results.filter(r => r.coreLoop !== null);

  if (validResults.length === 0) {
    return {
      averageDuration: 0,
      averagePacingScore: 0,
      loopsPassing: 0,
      loopsFailing: 0,
      recommendations: ['No core loops analyzed']
    };
  }

  const averageDuration = validResults.reduce((sum, r) => sum + r.estimatedDuration, 0) / validResults.length;
  const averagePacingScore = validResults.reduce((sum, r) => sum + r.pacingScore, 0) / validResults.length;
  const loopsPassing = validResults.filter(r => r.passesGate).length;
  const loopsFailing = validResults.length - loopsPassing;

  const recommendations: string[] = [];

  if (averageDuration > IDEAL_LOOP_DURATION + 10) {
    recommendations.push('Loops are averaging too long - consider simplification');
  }

  if (averagePacingScore < 70) {
    recommendations.push('Low pacing score - review engagement and variety');
  }

  if (loopsFailing > 0) {
    recommendations.push(`${loopsFailing} loop(s) failing validation - review and optimize`);
  }

  return {
    averageDuration,
    averagePacingScore,
    loopsPassing,
    loopsFailing,
    recommendations
  };
}

/**
 * Format analysis report
 */
export function formatReport(result: LoopAnalysisResult): string {
  const lines: string[] = [];

  lines.push(`Core Loop Analysis: ${result.projectName}`);
  lines.push('='.repeat(80));
  lines.push('');

  if (!result.coreLoop) {
    lines.push('❌ No core loop defined');
    lines.push('');
    for (const issue of result.issues) {
      lines.push(`  ⚠️  ${issue}`);
    }
    for (const suggestion of result.suggestions) {
      lines.push(`  💡 ${suggestion}`);
    }
    return lines.join('\n');
  }

  lines.push(`Loop Name: ${result.coreLoop.name}`);
  if (result.coreLoop.description) {
    lines.push(`Description: ${result.coreLoop.description}`);
  }
  lines.push('');

  lines.push(`Estimated Duration: ${result.estimatedDuration}s`);
  lines.push(`Target: < ${CORE_LOOP_THRESHOLD}s`);
  lines.push(`Status: ${result.passesGate ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push(`Pacing Score: ${result.pacingScore}/100`);
  lines.push('');

  lines.push('Loop Steps:');
  for (let i = 0; i < result.steps.length; i++) {
    const step = result.steps[i];
    const emoji = step.engagementLevel === 'high' ? '🔥' : step.engagementLevel === 'medium' ? '⚡' : '💤';
    lines.push(`  ${i + 1}. ${step.name} (${step.estimatedSeconds}s) ${emoji}`);
    lines.push(`     Type: ${step.type}, Engagement: ${step.engagementLevel}`);
  }
  lines.push('');

  if (result.issues.length > 0) {
    lines.push('Issues:');
    for (const issue of result.issues) {
      lines.push(`  ⚠️  ${issue}`);
    }
    lines.push('');
  }

  if (result.suggestions.length > 0) {
    lines.push('Suggestions:');
    for (const suggestion of result.suggestions) {
      lines.push(`  💡 ${suggestion}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
