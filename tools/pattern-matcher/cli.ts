#!/usr/bin/env node
/**
 * Pattern Matcher CLI
 *
 * Purpose: Command-line interface for pattern matching
 * Authority: Tier 3 (Optional tooling)
 * Use: Pattern analysis from command line
 */

import { matchPatterns, matchPatternsInDirectory, generateSummary, formatReport } from './match-patterns';

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
      const results = matchPatternsInDirectory(target, recursive);
      const summary = generateSummary(results);

      console.log('='.repeat(80));
      console.log('PATTERN ANALYSIS SUMMARY');
      console.log('='.repeat(80));
      console.log('');
      console.log(`Files analyzed: ${summary.totalFiles}`);
      console.log(`Files with patterns: ${summary.filesWithPatterns}`);
      console.log(`Total patterns found: ${summary.totalMatches}`);
      console.log(`Pattern suggestions: ${summary.totalSuggestions}`);
      console.log('');

      if (summary.totalMatches > 0) {
        console.log('Patterns by Category:');
        for (const [category, count] of Object.entries(summary.patternsByCategory)) {
          if (count > 0) {
            console.log(`  ${category}: ${count}`);
          }
        }
        console.log('');

        console.log('Top Patterns:');
        for (const { pattern, count } of summary.topPatterns) {
          console.log(`  ${pattern}: ${count} occurrences`);
        }
        console.log('');
      }

      // Show detailed reports for files with patterns or suggestions
      const filesWithContent = results.filter(r => r.totalMatches > 0 || r.suggestions.length > 0);
      if (filesWithContent.length > 0 && args.includes('--verbose')) {
        console.log('Detailed Reports:');
        console.log('');
        for (const result of filesWithContent) {
          console.log(formatReport(result));
          console.log('');
        }
      }

      process.exit(0);
    } else {
      // Single file
      console.log(`Analyzing file: ${target}\n`);
      const result = matchPatterns(target);

      console.log(formatReport(result));

      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Pattern Matcher - Find and suggest reusable code patterns

USAGE:
  pattern-matcher <file|directory> [options]

OPTIONS:
  --no-recursive    Don't scan subdirectories
  --verbose         Show detailed reports for all files
  -h, --help        Show this help message

EXAMPLES:
  pattern-matcher src/
  pattern-matcher src/app.ts
  pattern-matcher . --verbose

PATTERN CATEGORIES:
  - Creational: Singleton, Factory, Builder
  - Structural: Decorator, Adapter, Facade
  - Behavioral: Observer, Strategy, Command, State
  - Architectural: MVC, Repository, Service Layer
  - Functional: Pure Function, Higher-Order Function
  - React: Custom Hook, Render Props, Compound Component
`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
