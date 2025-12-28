#!/usr/bin/env node
/**
 * Asset Gate Validator
 *
 * Purpose: Enforce all assets registered and sourced properly
 * Authority: Tier 2 (Mandatory gate enforcement)
 * Use: Pre-commit validation, CI/CD integration
 */

import * as fs from 'fs';
import * as path from 'path';

interface GateResult {
  passed: boolean;
  violations: string[];
  score: number;
  summary: string;
}

const GATE_NAME = 'Asset Gate';
const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const REGISTRY_PATH = path.join(WORKSPACE_ROOT, 'asset-system', 'ASSET_REGISTRY.md');

async function runAssetGate(projectPath: string): Promise<GateResult> {
  try {
    const violations: string[] = [];

    // Check registry exists
    if (!fs.existsSync(REGISTRY_PATH)) {
      violations.push('ASSET_REGISTRY.md not found');
      return {
        passed: false,
        violations,
        score: 0,
        summary: `❌ ${GATE_NAME}: Registry missing`
      };
    }

    // Scan for asset files
    const assetFiles = findAssetFiles(projectPath);

    // Read registry
    const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf-8');

    // Check each asset is registered
    for (const assetFile of assetFiles) {
      const relativePath = path.relative(WORKSPACE_ROOT, assetFile).replace(/\\/g, '/');

      if (!registryContent.includes(relativePath)) {
        violations.push(`Unregistered asset: ${relativePath}`);
      }
    }

    const score = violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 10);

    return {
      passed: violations.length === 0,
      violations,
      score,
      summary: violations.length === 0
        ? `✅ ${GATE_NAME}: PASSED`
        : `❌ ${GATE_NAME}: FAILED (${violations.length} unregistered assets)`
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

function findAssetFiles(projectPath: string): string[] {
  const assets: string[] = [];

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scan(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.mp3', '.wav', '.ogg'].includes(ext)) {
          assets.push(fullPath);
        }
      }
    }
  }

  scan(projectPath);
  return assets;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
${GATE_NAME} Validator

USAGE:
  check-asset <project-dir>

CHECKS:
  - All assets registered in ASSET_REGISTRY.md
`);
    process.exit(0);
  }

  const result = await runAssetGate(args[0]);

  console.log('='.repeat(80));
  console.log(result.summary);
  console.log('='.repeat(80));

  if (result.violations.length > 0) {
    console.log('\nViolations:');
    for (const v of result.violations.slice(0, 10)) {
      console.log(`  🔴 ${v}`);
    }
    if (result.violations.length > 10) {
      console.log(`  ... and ${result.violations.length - 10} more`);
    }
  }

  process.exit(result.passed ? 0 : 1);
}

if (require.main === module) {
  main();
}

export { runAssetGate, GateResult };
