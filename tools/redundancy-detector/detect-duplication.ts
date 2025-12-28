/**
 * Redundancy Detector - Detect code and logic duplication
 *
 * Purpose: Identify duplicate code and suggest DRY refactorings
 * Authority: Tier 2 (Mandatory for code quality)
 * Use: Code review, refactoring identification
 */

import * as fs from 'fs';
import * as path from 'path';

export interface RedundancyAnalysis {
  projectPath: string;
  duplicateCode: CodeDuplication[];
  duplicateLogic: LogicDuplication[];
  totalDuplications: number;
  duplicatedLines: number;
  suggestions: DRYSuggestion[];
  passed: boolean; // < 5% duplication
}

export interface CodeDuplication {
  snippet: string;
  locations: CodeLocation[];
  lines: number;
  severity: 'critical' | 'warning' | 'info';
}

export interface LogicDuplication {
  pattern: string;
  description: string;
  locations: CodeLocation[];
  severity: 'critical' | 'warning' | 'info';
}

export interface CodeLocation {
  file: string;
  startLine: number;
  endLine: number;
  context: string;
}

export interface DRYSuggestion {
  type: 'extract-function' | 'extract-class' | 'use-utility' | 'create-constant';
  description: string;
  locations: CodeLocation[];
  example?: string;
}

const MIN_DUPLICATE_LINES = 3; // Minimum lines to consider duplication
const MAX_DUPLICATION_PERCENT = 5; // Maximum allowed % of duplicated code

/**
 * Detect code and logic duplication
 */
export function detectDuplication(projectPath: string): RedundancyAnalysis {
  const files = collectCodeFiles(projectPath);

  // Detect exact code duplication
  const duplicateCode = findDuplicateCode(files);

  // Detect logic duplication (similar patterns)
  const duplicateLogic = findDuplicateLogic(files);

  // Calculate metrics
  const totalLines = files.reduce((sum, f) => sum + f.lines.length, 0);
  const duplicatedLines = duplicateCode.reduce((sum, d) => sum + (d.lines * d.locations.length), 0);
  const duplicationPercent = (duplicatedLines / totalLines) * 100;

  // Generate suggestions
  const suggestions = generateDRYSuggestions(duplicateCode, duplicateLogic);

  return {
    projectPath,
    duplicateCode,
    duplicateLogic,
    totalDuplications: duplicateCode.length + duplicateLogic.length,
    duplicatedLines,
    suggestions,
    passed: duplicationPercent < MAX_DUPLICATION_PERCENT
  };
}

/**
 * Collect code files from project
 */
function collectCodeFiles(projectPath: string): CodeFile[] {
  const files: CodeFile[] = [];

  function scan(dir: string) {
    if (!fs.existsSync(dir)) {
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
          files.push({
            path: fullPath,
            lines: content.split('\n'),
            content
          });
        }
      }
    }
  }

  scan(projectPath);
  return files;
}

interface CodeFile {
  path: string;
  lines: string[];
  content: string;
}

/**
 * Find exact code duplication
 */
function findDuplicateCode(files: CodeFile[]): CodeDuplication[] {
  const duplications: CodeDuplication[] = [];
  const snippetMap = new Map<string, CodeLocation[]>();

  // Extract all code snippets
  for (const file of files) {
    for (let i = 0; i < file.lines.length - MIN_DUPLICATE_LINES; i++) {
      const snippet = file.lines.slice(i, i + MIN_DUPLICATE_LINES)
        .map(line => line.trim())
        .join('\n');

      // Skip if mostly whitespace or comments
      if (isTrivia(snippet)) {
        continue;
      }

      const hash = hashSnippet(snippet);

      if (!snippetMap.has(hash)) {
        snippetMap.set(hash, []);
      }

      snippetMap.get(hash)!.push({
        file: file.path,
        startLine: i + 1,
        endLine: i + MIN_DUPLICATE_LINES,
        context: snippet
      });
    }
  }

  // Find duplicates (snippets appearing multiple times)
  for (const [hash, locations] of snippetMap.entries()) {
    if (locations.length > 1) {
      const snippet = locations[0].context;
      const lines = snippet.split('\n').length;

      let severity: 'critical' | 'warning' | 'info' = 'info';
      if (lines >= 10) {
        severity = 'critical';
      } else if (lines >= 5) {
        severity = 'warning';
      }

      duplications.push({
        snippet,
        locations,
        lines,
        severity
      });
    }
  }

  // Sort by severity and lines
  duplications.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.lines - a.lines;
  });

  return duplications.slice(0, 50); // Top 50 duplications
}

/**
 * Find logic duplication (similar patterns, not exact matches)
 */
function findDuplicateLogic(files: CodeFile[]): LogicDuplication[] {
  const duplications: LogicDuplication[] = [];

  // Pattern 1: Similar function signatures
  const functionPatterns = new Map<string, CodeLocation[]>();

  for (const file of files) {
    const functionRegex = /function\s+(\w+)\s*\(([^)]*)\)/g;
    let match;

    while ((match = functionRegex.exec(file.content)) !== null) {
      const name = match[1];
      const params = match[2];

      // Create pattern based on parameter count
      const paramCount = params.split(',').filter(p => p.trim().length > 0).length;
      const pattern = `function-${paramCount}-params`;

      if (!functionPatterns.has(pattern)) {
        functionPatterns.set(pattern, []);
      }

      const lineNumber = file.content.substring(0, match.index).split('\n').length;

      functionPatterns.get(pattern)!.push({
        file: file.path,
        startLine: lineNumber,
        endLine: lineNumber,
        context: match[0]
      });
    }
  }

  // Report functions with same signature appearing multiple times
  for (const [pattern, locations] of functionPatterns.entries()) {
    if (locations.length >= 3) {
      duplications.push({
        pattern,
        description: `${locations.length} functions with similar signature`,
        locations,
        severity: 'warning'
      });
    }
  }

  // Pattern 2: Repeated validation logic
  const validationPattern = /if\s*\(\s*!(\w+)\s*(?:\|\||&&)/;
  const validations = new Map<string, CodeLocation[]>();

  for (const file of files) {
    for (let i = 0; i < file.lines.length; i++) {
      const line = file.lines[i];
      if (validationPattern.test(line)) {
        const key = 'validation-pattern';

        if (!validations.has(key)) {
          validations.set(key, []);
        }

        validations.get(key)!.push({
          file: file.path,
          startLine: i + 1,
          endLine: i + 1,
          context: line.trim()
        });
      }
    }
  }

  for (const [pattern, locations] of validations.entries()) {
    if (locations.length >= 5) {
      duplications.push({
        pattern,
        description: `${locations.length} similar validation patterns`,
        locations,
        severity: 'warning'
      });
    }
  }

  // Pattern 3: Repeated error handling
  const errorHandling = new Map<string, CodeLocation[]>();

  for (const file of files) {
    for (let i = 0; i < file.lines.length; i++) {
      const line = file.lines[i];
      if (/try\s*\{/.test(line)) {
        // Look for catch block
        for (let j = i + 1; j < Math.min(i + 20, file.lines.length); j++) {
          if (/catch\s*\(/.test(file.lines[j])) {
            const key = 'try-catch-pattern';

            if (!errorHandling.has(key)) {
              errorHandling.set(key, []);
            }

            errorHandling.get(key)!.push({
              file: file.path,
              startLine: i + 1,
              endLine: j + 1,
              context: file.lines.slice(i, j + 1).map(l => l.trim()).join('\n')
            });

            break;
          }
        }
      }
    }
  }

  for (const [pattern, locations] of errorHandling.entries()) {
    if (locations.length >= 4) {
      duplications.push({
        pattern,
        description: `${locations.length} similar try-catch patterns`,
        locations,
        severity: 'info'
      });
    }
  }

  return duplications;
}

/**
 * Generate DRY (Don't Repeat Yourself) suggestions
 */
function generateDRYSuggestions(
  duplicateCode: CodeDuplication[],
  duplicateLogic: LogicDuplication[]
): DRYSuggestion[] {
  const suggestions: DRYSuggestion[] = [];

  // Suggest extracting duplicated code to functions
  for (const dup of duplicateCode) {
    if (dup.severity === 'critical' || dup.severity === 'warning') {
      suggestions.push({
        type: 'extract-function',
        description: `Extract ${dup.lines}-line duplicate into shared function`,
        locations: dup.locations,
        example: `function extracted() {\n${dup.snippet}\n}`
      });
    }
  }

  // Suggest utility functions for repeated patterns
  for (const dup of duplicateLogic) {
    if (dup.pattern.includes('validation')) {
      suggestions.push({
        type: 'use-utility',
        description: 'Create validation utility to reduce duplication',
        locations: dup.locations,
        example: 'function validate(value, conditions) { ... }'
      });
    }

    if (dup.pattern.includes('try-catch')) {
      suggestions.push({
        type: 'use-utility',
        description: 'Create error handling wrapper to reduce try-catch boilerplate',
        locations: dup.locations,
        example: 'function withErrorHandling(fn) { try { return fn(); } catch(e) { ... } }'
      });
    }
  }

  return suggestions;
}

/**
 * Check if snippet is mostly trivia (whitespace/comments)
 */
function isTrivia(snippet: string): boolean {
  const lines = snippet.split('\n');
  const nonTriviaLines = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 0 &&
           !trimmed.startsWith('//') &&
           !trimmed.startsWith('/*') &&
           !trimmed.startsWith('*') &&
           trimmed !== '{' &&
           trimmed !== '}' &&
           trimmed !== '};';
  });

  return nonTriviaLines.length < 2;
}

/**
 * Hash snippet for comparison
 */
function hashSnippet(snippet: string): string {
  // Normalize whitespace and create hash
  const normalized = snippet
    .replace(/\s+/g, ' ')
    .trim();

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return hash.toString(36);
}

/**
 * Format analysis report
 */
export function formatReport(analysis: RedundancyAnalysis): string {
  const lines: string[] = [];

  lines.push('Redundancy Detection Report');
  lines.push('='.repeat(80));
  lines.push('');

  lines.push(`Total Duplications: ${analysis.totalDuplications}`);
  lines.push(`  Code Duplications: ${analysis.duplicateCode.length}`);
  lines.push(`  Logic Duplications: ${analysis.duplicateLogic.length}`);
  lines.push(`Duplicated Lines: ${analysis.duplicatedLines}`);
  lines.push('');
  lines.push(`Status: ${analysis.passed ? '✅ PASSED' : '❌ FAILED'} (< 5% duplication threshold)`);
  lines.push('');

  if (analysis.duplicateCode.length > 0) {
    lines.push('🔴 CODE DUPLICATIONS:');
    lines.push('');

    // Show top 10
    for (const dup of analysis.duplicateCode.slice(0, 10)) {
      lines.push(`  ${dup.severity.toUpperCase()}: ${dup.lines} lines duplicated ${dup.locations.length} times`);
      lines.push('  Locations:');
      for (const loc of dup.locations) {
        lines.push(`    - ${loc.file}:${loc.startLine}-${loc.endLine}`);
      }
      lines.push('  Snippet:');
      const snippetLines = dup.snippet.split('\n').slice(0, 5);
      for (const line of snippetLines) {
        lines.push(`    ${line}`);
      }
      if (dup.snippet.split('\n').length > 5) {
        lines.push('    ...');
      }
      lines.push('');
    }
  }

  if (analysis.duplicateLogic.length > 0) {
    lines.push('⚠️  LOGIC DUPLICATIONS:');
    lines.push('');

    for (const dup of analysis.duplicateLogic) {
      lines.push(`  ${dup.description}`);
      lines.push(`  Pattern: ${dup.pattern}`);
      lines.push(`  Occurrences: ${dup.locations.length}`);
      lines.push('');
    }
  }

  if (analysis.suggestions.length > 0) {
    lines.push('💡 DRY SUGGESTIONS:');
    lines.push('');

    for (const suggestion of analysis.suggestions.slice(0, 10)) {
      lines.push(`  ${suggestion.type.toUpperCase()}: ${suggestion.description}`);
      if (suggestion.example) {
        lines.push(`  Example:`);
        lines.push(`    ${suggestion.example}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Analyze directory
 */
export function analyzeDirectory(dirPath: string): RedundancyAnalysis {
  return detectDuplication(dirPath);
}
