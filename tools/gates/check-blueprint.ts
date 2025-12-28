#!/usr/bin/env node
/**
 * Blueprint Gate Validator
 *
 * Purpose: Enforce implementation matches blueprint
 * Authority: Tier 2 (Mandatory gate enforcement)
 * Use: Pre-commit validation, CI/CD integration
 */

import * as fs from 'fs';
import * as path from 'path';
import { detectFeatureCreep } from '../feature-creep-detector/detect-scope-creep';

interface GateResult {
  passed: boolean;
  violations: string[];
  score: number;
  summary: string;
}

const GATE_NAME = 'Blueprint Gate';

async function runBlueprintGate(blueprintPath: string, projectPath: string): Promise<GateResult> {
  try {
    if (!fs.existsSync(blueprintPath)) {
      return {
        passed: false,
        violations: ['Blueprint file not found'],
        score: 0,
        summary: `❌ ${GATE_NAME}: Blueprint not found`
      };
    }

    const analysis = detectFeatureCreep(blueprintPath, projectPath);

    const violations: string[] = [];

    if (analysis.scopeViolations > 0) {
      violations.push(`${analysis.scopeViolations} feature(s) implemented but not in blueprint`);
    }

    const coreMissing = analysis.missingFeatures.filter(f => f.category === 'core-mechanic');
    if (coreMissing.length > 0) {
      violations.push(`${coreMissing.length} core mechanic(s) from blueprint not implemented`);
    }

    const score = analysis.passed ? 100 : Math.max(0, 100 - (analysis.scopeViolations * 10));

    return {
      passed: analysis.passed && coreMissing.length === 0,
      violations,
      score,
      summary: violations.length === 0
        ? `✅ ${GATE_NAME}: PASSED`
        : `❌ ${GATE_NAME}: FAILED`
    };
  } catch (error) {
    return {
      passed: false,
      violations: [error instanceof Error ? error.message : 'Unknown error'],
      score: 0,
      summary: `❌ ${GATE_NAME}: ERROR`
    };
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2 || args.includes('--help')) {
    console.log(`
${GATE_NAME} Validator

USAGE:
  check-blueprint <blueprint.md> <project-dir>
`);
    process.exit(0);
  }

  const result = await runBlueprintGate(args[0], args[1]);

  console.log('='.repeat(80));
  console.log(result.summary);
  console.log('='.repeat(80));

  if (result.violations.length > 0) {
    console.log('\nViolations:');
    for (const v of result.violations) {
      console.log(`  🔴 ${v}`);
    }
  }

  process.exit(result.passed ? 0 : 1);
}

if (require.main === module) {
  main();
}

export { runBlueprintGate, GateResult };
