#!/usr/bin/env node
/**
 * Gate Orchestrator - Run all 8 quality gates
 *
 * Purpose: Execute complete gate validation suite
 * Authority: Tier 2 (Mandatory gate enforcement)
 * Use: Pre-commit validation, CI/CD integration
 */

import * as fs from 'fs';
import * as path from 'path';
import { runComplexityGate } from './check-complexity';
import { runQualityGate } from './check-quality';
import { runArchitectureGate } from './check-architecture';
import { runBlueprintGate } from './check-blueprint';
import { runAssetGate } from './check-asset';
import { runReuseGate } from './check-reuse';

interface GateResult {
  passed: boolean;
  violations?: string[] | any[];
  score: number;
  summary: string;
}

interface OrchestratorResult {
  passed: boolean;
  gatesRun: number;
  gatesPassed: number;
  gatesFailed: number;
  results: Map<string, GateResult>;
  overallScore: number;
}

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');

/**
 * Run all 8 quality gates
 */
async function runAllGates(config: {
  projectPath?: string;
  blueprintPath?: string;
  skipGates?: string[];
}): Promise<OrchestratorResult> {
  const projectPath = config.projectPath || WORKSPACE_ROOT;
  const blueprintPath = config.blueprintPath || path.join(projectPath, 'BLUEPRINT.md');
  const skipGates = config.skipGates || [];

  const results = new Map<string, GateResult>();

  console.log('='.repeat(80));
  console.log('RUNNING ALL QUALITY GATES');
  console.log('='.repeat(80));
  console.log('');

  // Gate 1: Complexity Gate
  if (!skipGates.includes('complexity')) {
    console.log('1/8 Running Complexity Gate...');
    try {
      const result = await runComplexityGate(projectPath);
      results.set('complexity', result);
      console.log(`    ${result.passed ? '✅' : '❌'} ${result.summary}`);
    } catch (error) {
      results.set('complexity', {
        passed: false,
        score: 0,
        summary: `❌ Complexity Gate: ERROR - ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }
    console.log('');
  }

  // Gate 2: Quality Gate
  if (!skipGates.includes('quality')) {
    console.log('2/8 Running Quality Gate...');
    try {
      const result = await runQualityGate(projectPath);
      results.set('quality', result);
      console.log(`    ${result.passed ? '✅' : '❌'} ${result.summary}`);
    } catch (error) {
      results.set('quality', {
        passed: false,
        score: 0,
        summary: `❌ Quality Gate: ERROR - ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }
    console.log('');
  }

  // Gate 3: Architecture Gate
  if (!skipGates.includes('architecture')) {
    console.log('3/8 Running Architecture Gate...');
    try {
      const result = await runArchitectureGate(projectPath);
      results.set('architecture', result);
      console.log(`    ${result.passed ? '✅' : '❌'} ${result.summary}`);
    } catch (error) {
      results.set('architecture', {
        passed: false,
        score: 0,
        summary: `❌ Architecture Gate: ERROR - ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }
    console.log('');
  }

  // Gate 4: Blueprint Gate
  if (!skipGates.includes('blueprint') && fs.existsSync(blueprintPath)) {
    console.log('4/8 Running Blueprint Gate...');
    try {
      const result = await runBlueprintGate(blueprintPath, projectPath);
      results.set('blueprint', result);
      console.log(`    ${result.passed ? '✅' : '❌'} ${result.summary}`);
    } catch (error) {
      results.set('blueprint', {
        passed: false,
        score: 0,
        summary: `❌ Blueprint Gate: ERROR - ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }
    console.log('');
  } else if (!skipGates.includes('blueprint')) {
    console.log('4/8 Skipping Blueprint Gate (no blueprint found)');
    console.log('');
  }

  // Gate 5: Asset Gate
  if (!skipGates.includes('asset')) {
    console.log('5/8 Running Asset Gate...');
    try {
      const result = await runAssetGate(projectPath);
      results.set('asset', result);
      console.log(`    ${result.passed ? '✅' : '❌'} ${result.summary}`);
    } catch (error) {
      results.set('asset', {
        passed: false,
        score: 0,
        summary: `❌ Asset Gate: ERROR - ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }
    console.log('');
  }

  // Gate 6: Reuse Gate
  if (!skipGates.includes('reuse')) {
    console.log('6/8 Running Reuse Gate...');
    try {
      const result = await runReuseGate(projectPath);
      results.set('reuse', result);
      console.log(`    ${result.passed ? '✅' : '❌'} ${result.summary}`);
    } catch (error) {
      results.set('reuse', {
        passed: false,
        score: 0,
        summary: `❌ Reuse Gate: ERROR - ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }
    console.log('');
  }

  // Gate 7 & 8: Asset Sourcing and Content Integrity (if available)
  const assetSourcingPath = path.join(__dirname, 'check-asset-sourcing.ts');
  const contentIntegrityPath = path.join(__dirname, 'check-content-integrity.ts');

  if (!skipGates.includes('asset-sourcing') && fs.existsSync(assetSourcingPath)) {
    console.log('7/8 Running Asset Sourcing Gate...');
    try {
      const { runAssetSourcingGate } = require('./check-asset-sourcing');
      const result = await runAssetSourcingGate(projectPath);
      results.set('asset-sourcing', result);
      console.log(`    ${result.passed ? '✅' : '❌'} Asset Sourcing Gate: ${result.passed ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      console.log(`    ⏭️  Asset Sourcing Gate: Skipped`);
    }
    console.log('');
  }

  if (!skipGates.includes('content-integrity') && fs.existsSync(contentIntegrityPath)) {
    console.log('8/8 Running Content Integrity Gate...');
    try {
      const { runContentIntegrityGate } = require('./check-content-integrity');
      const result = await runContentIntegrityGate(projectPath);
      results.set('content-integrity', result);
      console.log(`    ${result.passed ? '✅' : '❌'} Content Integrity Gate: ${result.passed ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      console.log(`    ⏭️  Content Integrity Gate: Skipped`);
    }
    console.log('');
  }

  // Calculate summary
  const gatesRun = results.size;
  const gatesPassed = Array.from(results.values()).filter(r => r.passed).length;
  const gatesFailed = gatesRun - gatesPassed;
  const overallScore = Math.round(
    Array.from(results.values()).reduce((sum, r) => sum + r.score, 0) / (gatesRun || 1)
  );
  const passed = gatesFailed === 0;

  return {
    passed,
    gatesRun,
    gatesPassed,
    gatesFailed,
    results,
    overallScore
  };
}

/**
 * Format final report
 */
function formatFinalReport(result: OrchestratorResult): string {
  const lines: string[] = [];

  lines.push('='.repeat(80));
  lines.push('GATE VALIDATION SUMMARY');
  lines.push('='.repeat(80));
  lines.push('');

  lines.push(`Gates Run: ${result.gatesRun}`);
  lines.push(`Gates Passed: ${result.gatesPassed} ✅`);
  lines.push(`Gates Failed: ${result.gatesFailed} ❌`);
  lines.push(`Overall Score: ${result.overallScore}/100`);
  lines.push('');

  lines.push(`FINAL STATUS: ${result.passed ? '✅ ALL GATES PASSED' : '❌ GATE FAILURES DETECTED'}`);
  lines.push('');

  if (!result.passed) {
    lines.push('Failed Gates:');
    for (const [gateName, gateResult] of result.results.entries()) {
      if (!gateResult.passed) {
        lines.push(`  ❌ ${gateName}`);
        if (gateResult.violations && gateResult.violations.length > 0) {
          for (const violation of gateResult.violations.slice(0, 3)) {
            if (typeof violation === 'string') {
              lines.push(`     - ${violation}`);
            } else if (violation.message) {
              lines.push(`     - ${violation.message}`);
            }
          }
          if (gateResult.violations.length > 3) {
            lines.push(`     ... and ${gateResult.violations.length - 3} more`);
          }
        }
      }
    }
    lines.push('');
    lines.push('Action Required: Fix violations and re-run gates');
  } else {
    lines.push('🎉 All quality gates passed! Code meets all standards.');
  }

  lines.push('');
  lines.push('='.repeat(80));

  return lines.join('\n');
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Gate Orchestrator - Run All Quality Gates

USAGE:
  run-all-gates [options]

OPTIONS:
  --project <path>      Project directory (default: workspace root)
  --blueprint <path>    Blueprint file (default: project/BLUEPRINT.md)
  --skip <gates>        Comma-separated gates to skip
  -h, --help            Show this help message

GATES:
  1. Complexity Gate      - Code complexity thresholds
  2. Quality Gate         - Zero-tolerance quality standards
  3. Architecture Gate    - Architectural standards
  4. Blueprint Gate       - Implementation matches blueprint
  5. Asset Gate           - All assets registered
  6. Reuse Gate           - Code reuse and DRY principles
  7. Asset Sourcing Gate  - Asset sourcing compliance
  8. Content Integrity    - Content consistency

EXAMPLES:
  run-all-gates
  run-all-gates --project ./my-project
  run-all-gates --skip complexity,blueprint

EXIT CODES:
  0 - All gates passed
  1 - One or more gates failed
`);
    process.exit(0);
  }

  // Parse options
  const config: {
    projectPath?: string;
    blueprintPath?: string;
    skipGates?: string[];
  } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--project' && i + 1 < args.length) {
      config.projectPath = args[i + 1];
      i++;
    } else if (args[i] === '--blueprint' && i + 1 < args.length) {
      config.blueprintPath = args[i + 1];
      i++;
    } else if (args[i] === '--skip' && i + 1 < args.length) {
      config.skipGates = args[i + 1].split(',').map(g => g.trim());
      i++;
    }
  }

  // Run gates
  const result = await runAllGates(config);

  // Display final report
  console.log(formatFinalReport(result));

  // Exit with appropriate code
  process.exit(result.passed ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

export { runAllGates, OrchestratorResult };
