#!/usr/bin/env node
/**
 * Complexity Gate Validator
 *
 * Purpose: Enforce complexity thresholds from complexity-gate.md
 * Authority: Tier 2 (Mandatory gate enforcement)
 * Use: Pre-commit validation, CI/CD integration
 */

import * as fs from 'fs';
import * as path from 'path';
import { analyzeComplexity, analyzeDirectory } from '../code-analyzer/complexity-analyzer';

interface GateResult {
  passed: boolean;
  violations: Violation[];
  score: number;
  summary: string;
}

interface Violation {
  file: string;
  line: number;
  rule: string;
  message: string;
  severity: 'critical' | 'warning';
}

const GATE_NAME = 'Complexity Gate';
const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const GATE_LOG_PATH = path.join(WORKSPACE_ROOT, 'evolution', 'GATE_FAILURES_LOG.md');

/**
 * Run complexity gate validation
 */
async function runComplexityGate(targetPath: string): Promise<GateResult> {
  const violations: Violation[] = [];

  try {
    const target = path.resolve(targetPath);
    const stat = fs.statSync(target);

    if (stat.isDirectory()) {
      // Analyze entire directory
      const results = analyzeDirectory(target, true);

      for (const result of results) {
        // Check 1: Cyclomatic Complexity (≤ 10 per function)
        for (const func of result.functions) {
          if (func.cyclomaticComplexity > 10) {
            violations.push({
              file: result.file,
              line: func.line,
              rule: 'Check 2: Cyclomatic Complexity',
              message: `Function "${func.name}" has complexity ${func.cyclomaticComplexity} (max: 10)`,
              severity: 'critical'
            });
          }
        }

        // Check 2: File Length (≤ 500 lines)
        if (result.codeLines > 500) {
          violations.push({
            file: result.file,
            line: 1,
            rule: 'Check 4: File Length Limit',
            message: `File has ${result.codeLines} lines of code (max: 500)`,
            severity: 'critical'
          });
        }

        // Check 3: Function Length (≤ 50 lines)
        for (const func of result.functions) {
          if (func.lines > 50) {
            violations.push({
              file: result.file,
              line: func.line,
              rule: 'Check 5: Function Length Limit',
              message: `Function "${func.name}" has ${func.lines} lines (max: 50)`,
              severity: 'critical'
            });
          }
        }

        // Check 4: Parameter Count (≤ 5)
        for (const func of result.functions) {
          if (func.parameters > 5) {
            violations.push({
              file: result.file,
              line: func.line,
              rule: 'Check 6: Parameter Count Limit',
              message: `Function "${func.name}" has ${func.parameters} parameters (max: 5)`,
              severity: 'critical'
            });
          }
        }
      }
    } else {
      // Analyze single file
      const result = analyzeComplexity(target);

      // Apply same checks as above
      for (const func of result.functions) {
        if (func.cyclomaticComplexity > 10) {
          violations.push({
            file: result.file,
            line: func.line,
            rule: 'Check 2: Cyclomatic Complexity',
            message: `Function "${func.name}" has complexity ${func.cyclomaticComplexity} (max: 10)`,
            severity: 'critical'
          });
        }

        if (func.lines > 50) {
          violations.push({
            file: result.file,
            line: func.line,
            rule: 'Check 5: Function Length Limit',
            message: `Function "${func.name}" has ${func.lines} lines (max: 50)`,
            severity: 'critical'
          });
        }

        if (func.parameters > 5) {
          violations.push({
            file: result.file,
            line: func.line,
            rule: 'Check 6: Parameter Count Limit',
            message: `Function "${func.name}" has ${func.parameters} parameters (max: 5)`,
            severity: 'critical'
          });
        }
      }

      if (result.codeLines > 500) {
        violations.push({
          file: result.file,
          line: 1,
          rule: 'Check 4: File Length Limit',
          message: `File has ${result.codeLines} lines of code (max: 500)`,
          severity: 'critical'
        });
      }
    }

    // Calculate score
    const totalChecks = violations.length + 10; // Assume some passes
    const score = Math.max(0, Math.round((1 - violations.length / totalChecks) * 100));

    const passed = violations.length === 0;

    // Log failure if needed
    if (!passed) {
      logGateFailure(violations);
    }

    return {
      passed,
      violations,
      score,
      summary: passed
        ? `✅ ${GATE_NAME}: PASSED (${score}/100)`
        : `❌ ${GATE_NAME}: FAILED (${violations.length} violation(s), score: ${score}/100)`
    };
  } catch (error) {
    return {
      passed: false,
      violations: [{
        file: targetPath,
        line: 0,
        rule: 'Gate Execution',
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'critical'
      }],
      score: 0,
      summary: `❌ ${GATE_NAME}: ERROR`
    };
  }
}

/**
 * Log gate failure
 */
function logGateFailure(violations: Violation[]): void {
  try {
    const logDir = path.dirname(GATE_LOG_PATH);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const logEntry = `
## ${GATE_NAME} Failure - ${timestamp}

**Violations**: ${violations.length}

${violations.map(v => `- **${v.rule}**: ${v.message}\n  File: \`${v.file}:${v.line}\``).join('\n')}

---
`;

    fs.appendFileSync(GATE_LOG_PATH, logEntry);
  } catch (error) {
    console.error('Failed to log gate failure:', error);
  }
}

/**
 * Format gate report
 */
function formatReport(result: GateResult): string {
  const lines: string[] = [];

  lines.push('='.repeat(80));
  lines.push(result.summary);
  lines.push('='.repeat(80));
  lines.push('');

  if (result.passed) {
    lines.push('All complexity checks passed:');
    lines.push('  ✅ Cyclomatic complexity ≤ 10');
    lines.push('  ✅ File length ≤ 500 lines');
    lines.push('  ✅ Function length ≤ 50 lines');
    lines.push('  ✅ Parameter count ≤ 5');
    lines.push('');
    lines.push('Code meets complexity standards.');
  } else {
    lines.push('Violations:');
    lines.push('');

    for (const violation of result.violations) {
      const emoji = violation.severity === 'critical' ? '🔴' : '⚠️';
      lines.push(`${emoji} ${violation.rule}`);
      lines.push(`   ${violation.message}`);
      lines.push(`   Location: ${violation.file}:${violation.line}`);
      lines.push('');
    }

    lines.push('Action Required:');
    lines.push('  - Refactor complex functions');
    lines.push('  - Split long files/functions');
    lines.push('  - Use options objects for many parameters');
    lines.push('  - Re-run gate after fixes');
  }

  return lines.join('\n');
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
${GATE_NAME} Validator

USAGE:
  check-complexity <file|directory>

OPTIONS:
  -h, --help    Show this help message

DESCRIPTION:
  Validates code against complexity thresholds:
  - Cyclomatic complexity ≤ 10 per function
  - File length ≤ 500 lines
  - Function length ≤ 50 lines
  - Parameter count ≤ 5

EXIT CODES:
  0 - Gate passed
  1 - Gate failed
`);
    process.exit(0);
  }

  const target = args[0];

  console.log(`Running ${GATE_NAME}...\n`);

  const result = await runComplexityGate(target);

  console.log(formatReport(result));

  process.exit(result.passed ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

export { runComplexityGate, GateResult };
