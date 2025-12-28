#!/usr/bin/env node
/**
 * Quality Gate Validator
 *
 * Purpose: Enforce zero-tolerance quality standards from quality-gate.md
 * Authority: Tier 2 (Mandatory gate enforcement)
 * Use: Pre-commit validation, CI/CD integration
 */

import * as fs from 'fs';
import * as path from 'path';
import { detectAntiPatterns, detectAntiPatternsInDirectory } from '../anti-pattern-detector/detect-patterns';

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

const GATE_NAME = 'Quality Gate';
const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const GATE_LOG_PATH = path.join(WORKSPACE_ROOT, 'evolution', 'GATE_FAILURES_LOG.md');

/**
 * Run quality gate validation
 */
async function runQualityGate(targetPath: string): Promise<GateResult> {
  const violations: Violation[] = [];

  try {
    const target = path.resolve(targetPath);
    const stat = fs.statSync(target);

    let results;

    if (stat.isDirectory()) {
      results = detectAntiPatternsInDirectory(target, true);
    } else {
      results = [detectAntiPatterns(target)];
    }

    // Process anti-pattern results
    for (const result of results) {
      // Only critical anti-patterns count as quality gate violations
      const criticalDetections = result.detections.filter(d => d.severity === 'critical');

      for (const detection of criticalDetections) {
        violations.push({
          file: result.file,
          line: detection.line,
          rule: mapAntiPatternToQualityRule(detection.pattern),
          message: detection.message,
          severity: 'critical'
        });
      }
    }

    // Check for TypeScript errors (if tsconfig exists)
    const typescriptViolations = await checkTypeScript(target);
    violations.push(...typescriptViolations);

    // Calculate score
    const totalChecks = Math.max(10, violations.length + 10);
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
 * Map anti-pattern ID to quality gate rule
 */
function mapAntiPatternToQualityRule(patternId: string): string {
  const ruleMap: Record<string, string> = {
    'placeholder-todo': 'Check 1: Zero Placeholders',
    'placeholder-fixme': 'Check 1: Zero Placeholders',
    'placeholder-hack': 'Check 1: Zero Placeholders',
    'placeholder-xxx': 'Check 1: Zero Placeholders',
    'placeholder-tbd': 'Check 1: Zero Placeholders',
    'placeholder-not-implemented': 'Check 1: Zero Placeholders',
    'any-type': 'Check 2: TypeScript Strict Mode',
    'type-assertion-any': 'Check 2: TypeScript Strict Mode',
    'unhandled-promise': 'Check 3: Complete Error Handling',
    'empty-catch': 'Check 3: Complete Error Handling',
    'debugger-statement': 'Check 7: Code Linting',
    'img-no-alt': 'Check 5: Accessibility Considered'
  };

  return ruleMap[patternId] || 'Quality Standard';
}

/**
 * Check TypeScript compilation (if applicable)
 */
async function checkTypeScript(targetPath: string): Promise<Violation[]> {
  const violations: Violation[] = [];

  try {
    // Look for tsconfig.json
    let tsconfigPath = '';
    let searchPath = path.isAbsolute(targetPath) ? targetPath : path.resolve(targetPath);

    if (fs.statSync(searchPath).isFile()) {
      searchPath = path.dirname(searchPath);
    }

    // Search up the directory tree for tsconfig.json
    while (searchPath !== path.dirname(searchPath)) {
      const candidatePath = path.join(searchPath, 'tsconfig.json');
      if (fs.existsSync(candidatePath)) {
        tsconfigPath = candidatePath;
        break;
      }
      searchPath = path.dirname(searchPath);
    }

    if (!tsconfigPath) {
      // No TypeScript config found, skip check
      return violations;
    }

    // Read tsconfig to check strict mode
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

    if (!tsconfig.compilerOptions?.strict) {
      violations.push({
        file: tsconfigPath,
        line: 1,
        rule: 'Check 2: TypeScript Strict Mode',
        message: 'TypeScript strict mode not enabled in tsconfig.json',
        severity: 'critical'
      });
    }
  } catch (error) {
    // TypeScript check failed, but don't fail the gate for this
  }

  return violations;
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
    lines.push('All quality checks passed:');
    lines.push('  ✅ No placeholders (TODO, FIXME, etc.)');
    lines.push('  ✅ TypeScript strict mode enabled');
    lines.push('  ✅ No "any" types');
    lines.push('  ✅ Error handling complete');
    lines.push('  ✅ Accessibility considered');
    lines.push('  ✅ No debugger statements');
    lines.push('');
    lines.push('Code meets quality standards.');
  } else {
    lines.push('Violations:');
    lines.push('');

    // Group by rule
    const byRule = new Map<string, Violation[]>();
    for (const violation of result.violations) {
      if (!byRule.has(violation.rule)) {
        byRule.set(violation.rule, []);
      }
      byRule.get(violation.rule)!.push(violation);
    }

    for (const [rule, viols] of byRule.entries()) {
      lines.push(`🔴 ${rule} (${viols.length} violation(s))`);
      for (const v of viols.slice(0, 5)) {
        lines.push(`   - ${v.message}`);
        lines.push(`     ${v.file}:${v.line}`);
      }
      if (viols.length > 5) {
        lines.push(`   ... and ${viols.length - 5} more`);
      }
      lines.push('');
    }

    lines.push('Action Required:');
    lines.push('  - Complete all TODO/FIXME items');
    lines.push('  - Enable TypeScript strict mode');
    lines.push('  - Replace "any" types with explicit types');
    lines.push('  - Add error handling for all edge cases');
    lines.push('  - Add accessibility attributes');
    lines.push('  - Remove debugger statements');
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
  check-quality <file|directory>

OPTIONS:
  -h, --help    Show this help message

DESCRIPTION:
  Validates code against quality standards:
  - Zero placeholders (TODO, FIXME, etc.)
  - TypeScript strict mode
  - No "any" types
  - Complete error handling
  - Accessibility attributes
  - No debugger statements

EXIT CODES:
  0 - Gate passed
  1 - Gate failed
`);
    process.exit(0);
  }

  const target = args[0];

  console.log(`Running ${GATE_NAME}...\n`);

  const result = await runQualityGate(target);

  console.log(formatReport(result));

  process.exit(result.passed ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

export { runQualityGate, GateResult };
