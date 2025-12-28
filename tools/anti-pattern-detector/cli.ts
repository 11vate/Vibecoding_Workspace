#!/usr/bin/env node
/**
 * Anti-Pattern Detector CLI
 *
 * Purpose: Command-line interface for anti-pattern detection
 * Authority: Tier 3 (Optional tooling)
 * Use: Code auditing from command line
 */

import { detectAntiPatterns, detectAntiPatternsInDirectory, generateSummary, formatReport } from './detect-patterns';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const target = args[0];
  const recursive = !args.includes('--no-recursive');

  try {
    const fs = require('fs');
    const stat = fs.statSync(target);

    if (stat.isDirectory()) {
      console.log(`Scanning directory: ${target}\n`);
      const results = detectAntiPatternsInDirectory(target, recursive);
      const summary = generateSummary(results);

      console.log('='.repeat(80));
      console.log('ANTI-PATTERN DETECTION SUMMARY');
      console.log('='.repeat(80));
      console.log('');
      console.log(`Files analyzed: ${summary.totalFiles}`);
      console.log(`Files with issues: ${summary.filesWithIssues}`);
      console.log(`Total issues: ${summary.totalIssues}`);
      console.log(`  Critical: ${summary.criticalIssues}`);
      console.log(`  Warnings: ${summary.warningIssues}`);
      console.log(`  Info: ${summary.infoIssues}`);
      console.log('');
      console.log(`Status: ${summary.passed ? '✅ PASSED' : '❌ FAILED'}`);
      console.log('');

      if (summary.totalIssues > 0) {
        console.log('Issues by Category:');
        for (const [category, count] of Object.entries(summary.issuesByCategory)) {
          if (count > 0) {
            console.log(`  ${category}: ${count}`);
          }
        }
        console.log('');

        console.log('Top Anti-Patterns:');
        for (const { pattern, count } of summary.topAntiPatterns) {
          console.log(`  ${pattern}: ${count} occurrences`);
        }
        console.log('');
      }

      // Show detailed reports for files with critical issues
      const filesWithCritical = results.filter(r => r.criticalIssues > 0);
      if (filesWithCritical.length > 0) {
        console.log('Files with CRITICAL issues:');
        console.log('');
        for (const result of filesWithCritical) {
          console.log(formatReport(result));
          console.log('');
        }
      }

      process.exit(summary.passed ? 0 : 1);
    } else {
      // Single file
      console.log(`Analyzing file: ${target}\n`);
      const result = detectAntiPatterns(target);

      console.log(formatReport(result));

      process.exit(result.passed ? 0 : 1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Anti-Pattern Detector - Detect design and code anti-patterns

USAGE:
  anti-pattern-detector <file|directory> [options]

OPTIONS:
  --no-recursive    Don't scan subdirectories
  -h, --help        Show this help message

EXAMPLES:
  anti-pattern-detector src/
  anti-pattern-detector src/app.ts
  anti-pattern-detector . --no-recursive

EXIT CODES:
  0 - No critical issues found
  1 - Critical issues found or error occurred
`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
