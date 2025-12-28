#!/usr/bin/env node
/**
 * Reuse Gate Validator
 *
 * Purpose: Enforce code and asset reuse
 * Authority: Tier 2 (Mandatory gate enforcement)
 * Use: Pre-commit validation, CI/CD integration
 */

import * as fs from 'fs';
import * as path from 'path';
import { detectDuplication } from '../redundancy-detector/detect-duplication';

interface GateResult {
  passed: boolean;
  violations: string[];
  score: number;
  summary: string;
}

const GATE_NAME = 'Reuse Gate';
const MAX_DUPLICATION_PERCENT = 5;

async function runReuseGate(projectPath: string): Promise<GateResult> {
  try {
    const analysis = detectDuplication(projectPath);

    const violations: string[] = [];

    // Check duplication threshold
    const totalLines = analysis.duplicatedLines + 5000; // Estimate total project lines
    const duplicationPercent = (analysis.duplicatedLines / totalLines) * 100;

    if (duplicationPercent > MAX_DUPLICATION_PERCENT) {
      violations.push(`Code duplication ${duplicationPercent.toFixed(1)}% exceeds ${MAX_DUPLICATION_PERCENT}% threshold`);
    }

    // Check critical duplications
    const criticalDups = analysis.duplicateCode.filter(d => d.severity === 'critical');
    if (criticalDups.length > 0) {
      violations.push(`${criticalDups.length} critical code duplication(s) found`);
    }

    const score = analysis.passed ? 100 : Math.max(0, 100 - violations.length * 20);

    return {
      passed: violations.length === 0,
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

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
${GATE_NAME} Validator

USAGE:
  check-reuse <project-dir>

CHECKS:
  - Code duplication < 5%
  - No critical duplication violations
`);
    process.exit(0);
  }

  const result = await runReuseGate(args[0]);

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

export { runReuseGate, GateResult };
