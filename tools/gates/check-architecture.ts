#!/usr/bin/env node
/**
 * Architecture Gate Validator
 *
 * Purpose: Enforce architectural standards from architecture-gate.md
 * Authority: Tier 2 (Mandatory gate enforcement)
 * Use: Pre-commit validation, CI/CD integration
 */

import * as fs from 'fs';
import * as path from 'path';

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

const GATE_NAME = 'Architecture Gate';
const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const GATE_LOG_PATH = path.join(WORKSPACE_ROOT, 'evolution', 'GATE_FAILURES_LOG.md');

async function runArchitectureGate(targetPath: string): Promise<GateResult> {
  const violations: Violation[] = [];

  try {
    const target = path.resolve(targetPath);

    // Check 1: Canonical spine structure exists
    const spineViolations = checkCanonicalSpine(target);
    violations.push(...spineViolations);

    // Check 2: No circular dependencies
    const circularViolations = await checkCircularDependencies(target);
    violations.push(...circularViolations);

    // Check 3: Proper layer separation
    const layerViolations = checkLayerSeparation(target);
    violations.push(...layerViolations);

    const score = Math.max(0, Math.round((1 - violations.length / 10) * 100));
    const passed = violations.length === 0;

    if (!passed) {
      logGateFailure(violations);
    }

    return {
      passed,
      violations,
      score,
      summary: passed
        ? `✅ ${GATE_NAME}: PASSED`
        : `❌ ${GATE_NAME}: FAILED (${violations.length} violations)`
    };
  } catch (error) {
    return {
      passed: false,
      violations: [],
      score: 0,
      summary: `❌ ${GATE_NAME}: ERROR - ${error instanceof Error ? error.message : 'Unknown'}`
    };
  }
}

function checkCanonicalSpine(targetPath: string): Violation[] {
  const violations: Violation[] = [];

  if (!fs.statSync(targetPath).isDirectory()) {
    return violations;
  }

  const requiredDirs = ['src/core', 'src/systems', 'src/ui'];

  for (const dir of requiredDirs) {
    const fullPath = path.join(targetPath, dir);
    if (!fs.existsSync(fullPath)) {
      violations.push({
        file: targetPath,
        line: 0,
        rule: 'Canonical Spine Structure',
        message: `Missing required directory: ${dir}`,
        severity: 'warning'
      });
    }
  }

  return violations;
}

async function checkCircularDependencies(targetPath: string): Promise<Violation[]> {
  const violations: Violation[] = [];

  // Simple circular dependency check
  const importGraph = buildImportGraph(targetPath);

  for (const [file, imports] of importGraph.entries()) {
    for (const imported of imports) {
      if (importGraph.get(imported)?.includes(file)) {
        violations.push({
          file,
          line: 0,
          rule: 'No Circular Dependencies',
          message: `Circular dependency detected between ${path.basename(file)} and ${path.basename(imported)}`,
          severity: 'critical'
        });
      }
    }
  }

  return violations;
}

function buildImportGraph(targetPath: string): Map<string, string[]> {
  const graph = new Map<string, string[]>();

  function scan(dir: string) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scan(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const imports = extractImports(content, fullPath);
          graph.set(fullPath, imports);
        }
      }
    }
  }

  scan(targetPath);
  return graph;
}

function extractImports(content: string, filePath: string): string[] {
  const imports: string[] = [];
  const importRegex = /import\s+.*\s+from\s+['"](.+)['"]/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    // Only track relative imports
    if (importPath.startsWith('.')) {
      const resolvedPath = path.resolve(path.dirname(filePath), importPath);
      imports.push(resolvedPath);
    }
  }

  return imports;
}

function checkLayerSeparation(targetPath: string): Violation[] {
  const violations: Violation[] = [];

  // Check that UI doesn't import from systems (should go through core)
  const uiPath = path.join(targetPath, 'src/ui');
  const systemsPath = path.join(targetPath, 'src/systems');

  if (fs.existsSync(uiPath) && fs.existsSync(systemsPath)) {
    scanForViolations(uiPath, systemsPath, violations);
  }

  return violations;
}

function scanForViolations(fromDir: string, toDir: string, violations: Violation[]) {
  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const imports = extractImports(content, fullPath);

          for (const imp of imports) {
            if (imp.includes(toDir)) {
              violations.push({
                file: fullPath,
                line: 0,
                rule: 'Layer Separation',
                message: 'UI layer importing directly from systems layer',
                severity: 'warning'
              });
            }
          }
        }
      }
    }
  }

  scan(fromDir);
}

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

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
${GATE_NAME} Validator

USAGE:
  check-architecture <directory>

CHECKS:
  - Canonical spine structure
  - No circular dependencies
  - Proper layer separation
`);
    process.exit(0);
  }

  const result = await runArchitectureGate(args[0]);

  console.log('='.repeat(80));
  console.log(result.summary);
  console.log('='.repeat(80));

  if (result.violations.length > 0) {
    console.log('\nViolations:');
    for (const v of result.violations) {
      console.log(`  🔴 ${v.rule}: ${v.message}`);
      console.log(`     ${v.file}:${v.line}`);
    }
  }

  process.exit(result.passed ? 0 : 1);
}

if (require.main === module) {
  main();
}

export { runArchitectureGate, GateResult };
