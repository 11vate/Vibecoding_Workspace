/**
 * Simplification Analyzer - Detect over-complexity and suggest simplifications
 *
 * Purpose: Identify unnecessarily complex code and suggest simpler approaches
 * Authority: Tier 2 (Mandatory for maintainability)
 * Use: Code review, complexity reduction
 */

import * as fs from 'fs';
import * as path from 'path';

export interface SimplificationAnalysis {
  projectPath: string;
  overComplexities: OverComplexity[];
  totalIssues: number;
  simplificationSavings: number; // estimated lines saved
  suggestions: SimplificationSuggestion[];
}

export interface OverComplexity {
  file: string;
  line: number;
  category: ComplexityCategory;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  currentApproach: string;
  simplerApproach: string;
  savings: number; // lines or complexity points
}

export type ComplexityCategory =
  | 'unnecessary-abstraction'
  | 'over-engineered'
  | 'premature-optimization'
  | 'verbose'
  | 'nested-logic'
  | 'complex-expression'
  | 'feature-bloat';

export interface SimplificationSuggestion {
  category: ComplexityCategory;
  locations: Array<{ file: string; line: number }>;
  suggestion: string;
  example: string;
  impact: 'high' | 'medium' | 'low';
}

/**
 * Detect over-complexity in project
 */
export function detectOverComplexity(projectPath: string): SimplificationAnalysis {
  const files = collectCodeFiles(projectPath);

  const overComplexities: OverComplexity[] = [];

  for (const file of files) {
    overComplexities.push(...analyzeFileForComplexity(file.path, file.content));
  }

  // Generate suggestions
  const suggestions = generateSimplificationSuggestions(overComplexities);

  // Calculate savings
  const savings = overComplexities.reduce((sum, oc) => sum + oc.savings, 0);

  return {
    projectPath,
    overComplexities,
    totalIssues: overComplexities.length,
    simplificationSavings: savings,
    suggestions
  };
}

/**
 * Collect code files
 */
function collectCodeFiles(projectPath: string): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = [];

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
          files.push({ path: fullPath, content });
        }
      }
    }
  }

  scan(projectPath);
  return files;
}

/**
 * Analyze file for over-complexity
 */
function analyzeFileForComplexity(filePath: string, content: string): OverComplexity[] {
  const complexities: OverComplexity[] = [];
  const lines = content.split('\n');

  // Detect unnecessary abstraction
  complexities.push(...detectUnnecessaryAbstraction(filePath, content, lines));

  // Detect over-engineering
  complexities.push(...detectOverEngineering(filePath, content, lines));

  // Detect premature optimization
  complexities.push(...detectPrematureOptimization(filePath, content, lines));

  // Detect verbose code
  complexities.push(...detectVerboseCode(filePath, content, lines));

  // Detect nested logic
  complexities.push(...detectExcessiveNesting(filePath, content, lines));

  // Detect complex expressions
  complexities.push(...detectComplexExpressions(filePath, content, lines));

  return complexities;
}

/**
 * Detect unnecessary abstraction
 */
function detectUnnecessaryAbstraction(
  filePath: string,
  content: string,
  lines: string[]
): OverComplexity[] {
  const results: OverComplexity[] = [];

  // Single-use helper functions
  const functionCalls = new Map<string, number>();
  const functionDefs = new Map<string, number>();

  const callRegex = /(\w+)\s*\(/g;
  let match;

  while ((match = callRegex.exec(content)) !== null) {
    const funcName = match[1];
    functionCalls.set(funcName, (functionCalls.get(funcName) || 0) + 1);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const funcMatch = line.match(/function\s+(\w+)\s*\(/);

    if (funcMatch) {
      const funcName = funcMatch[1];
      const calls = functionCalls.get(funcName) || 0;

      if (calls === 1) {
        // Function only called once - might be unnecessary abstraction
        results.push({
          file: filePath,
          line: i + 1,
          category: 'unnecessary-abstraction',
          severity: 'info',
          description: `Function "${funcName}" only called once`,
          currentApproach: 'Separate function for single use',
          simplerApproach: 'Inline the function body at call site',
          savings: 2
        });
      }
    }
  }

  return results;
}

/**
 * Detect over-engineering
 */
function detectOverEngineering(
  filePath: string,
  content: string,
  lines: string[]
): OverComplexity[] {
  const results: OverComplexity[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Factory for simple object creation
    if (/createFactory|makeFactory|buildFactory/i.test(line)) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'over-engineered',
        severity: 'warning',
        description: 'Factory pattern for simple object creation',
        currentApproach: 'Complex factory pattern',
        simplerApproach: 'Direct object literal or constructor',
        savings: 10
      });
    }

    // Singleton for stateless utilities
    if (/getInstance\(\)/.test(line) && /Util|Helper/.test(line)) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'over-engineered',
        severity: 'info',
        description: 'Singleton pattern for stateless utility',
        currentApproach: 'Singleton with getInstance()',
        simplerApproach: 'Simple module exports',
        savings: 5
      });
    }

    // Observer pattern for simple callbacks
    if (/subscribe|addListener|addEventListener/.test(line) && content.split('\n').length < 200) {
      const observerCount = (content.match(/subscribe|addListener/g) || []).length;

      if (observerCount <= 2) {
        results.push({
          file: filePath,
          line: i + 1,
          category: 'over-engineered',
          severity: 'info',
          description: 'Observer pattern with only 1-2 listeners',
          currentApproach: 'Full observer/pubsub system',
          simplerApproach: 'Direct callback functions',
          savings: 15
        });
      }
    }
  }

  return results;
}

/**
 * Detect premature optimization
 */
function detectPrematureOptimization(
  filePath: string,
  content: string,
  lines: string[]
): OverComplexity[] {
  const results: OverComplexity[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Object pooling in non-performance-critical code
    if (/pool|objectPool|Pool/i.test(line)) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'premature-optimization',
        severity: 'warning',
        description: 'Object pooling without measured performance need',
        currentApproach: 'Complex object pool',
        simplerApproach: 'Direct object creation (optimize later if needed)',
        savings: 20
      });
    }

    // Manual caching without clear benefit
    if (/cache|memoize/i.test(line) && !/useMemo|useCallback/.test(line)) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'premature-optimization',
        severity: 'info',
        description: 'Manual caching without profiling',
        currentApproach: 'Manual cache implementation',
        simplerApproach: 'Compute on demand, cache only if profiled',
        savings: 10
      });
    }
  }

  return results;
}

/**
 * Detect verbose code
 */
function detectVerboseCode(
  filePath: string,
  content: string,
  lines: string[]
): OverComplexity[] {
  const results: OverComplexity[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Verbose null checks
    if (/if\s*\(\s*\w+\s*!==\s*null\s*&&\s*\w+\s*!==\s*undefined\s*\)/.test(line)) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'verbose',
        severity: 'info',
        description: 'Verbose null/undefined check',
        currentApproach: 'if (x !== null && x !== undefined)',
        simplerApproach: 'if (x != null) or if (x)',
        savings: 1
      });
    }

    // Verbose boolean returns
    if (/if\s*\([^)]+\)\s*{\s*return\s+true\s*;?\s*}\s*(?:else\s*{\s*)?return\s+false/.test(content.substring(content.indexOf(line)))) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'verbose',
        severity: 'info',
        description: 'Verbose boolean return',
        currentApproach: 'if (condition) { return true; } return false;',
        simplerApproach: 'return condition;',
        savings: 2
      });
    }

    // Unnecessary intermediate variables
    if (/const\s+(\w+)\s*=\s*([^;]+);\s*return\s+\1;/.test(content.substring(content.indexOf(line)))) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'verbose',
        severity: 'info',
        description: 'Unnecessary intermediate variable',
        currentApproach: 'const x = value; return x;',
        simplerApproach: 'return value;',
        savings: 1
      });
    }
  }

  return results;
}

/**
 * Detect excessive nesting
 */
function detectExcessiveNesting(
  filePath: string,
  content: string,
  lines: string[]
): OverComplexity[] {
  const results: OverComplexity[] = [];

  for (let i = 0; i < lines.length; i++) {
    let nesting = 0;
    let maxNesting = 0;

    // Count nesting in this line and surrounding context
    for (let j = Math.max(0, i - 10); j <= i; j++) {
      for (const char of lines[j]) {
        if (char === '{') nesting++;
        if (char === '}') nesting--;
        maxNesting = Math.max(maxNesting, nesting);
      }
    }

    if (maxNesting > 4) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'nested-logic',
        severity: 'warning',
        description: `Excessive nesting (${maxNesting} levels)`,
        currentApproach: 'Deep nested if/for/while statements',
        simplerApproach: 'Use guard clauses, extract methods, or flatten logic',
        savings: 5
      });
    }
  }

  return results;
}

/**
 * Detect complex expressions
 */
function detectComplexExpressions(
  filePath: string,
  content: string,
  lines: string[]
): OverComplexity[] {
  const results: OverComplexity[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Long ternary chains
    const ternaryCount = (line.match(/\?/g) || []).length;
    if (ternaryCount >= 2) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'complex-expression',
        severity: 'warning',
        description: 'Nested ternary operators',
        currentApproach: 'condition ? (condition2 ? a : b) : c',
        simplerApproach: 'Use if-else or extract to function',
        savings: 1
      });
    }

    // Long logical expressions
    const logicalOps = (line.match(/&&|\|\|/g) || []).length;
    if (logicalOps >= 3) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'complex-expression',
        severity: 'warning',
        description: `Complex logical expression (${logicalOps} operators)`,
        currentApproach: 'a && b && c || d && e',
        simplerApproach: 'Extract to well-named boolean variables',
        savings: 1
      });
    }

    // Complex array/object operations
    if (/\.\s*map\s*\([^)]+\)\s*\.\s*filter\s*\([^)]+\)\s*\.\s*reduce/.test(line)) {
      results.push({
        file: filePath,
        line: i + 1,
        category: 'complex-expression',
        severity: 'info',
        description: 'Chained array operations',
        currentApproach: 'arr.map().filter().reduce()',
        simplerApproach: 'Use single reduce or for-loop for better performance',
        savings: 0
      });
    }
  }

  return results;
}

/**
 * Generate simplification suggestions
 */
function generateSimplificationSuggestions(
  complexities: OverComplexity[]
): SimplificationSuggestion[] {
  const suggestions: SimplificationSuggestion[] = [];

  // Group by category
  const byCategory = new Map<ComplexityCategory, OverComplexity[]>();
  for (const comp of complexities) {
    if (!byCategory.has(comp.category)) {
      byCategory.set(comp.category, []);
    }
    byCategory.get(comp.category)!.push(comp);
  }

  // Create suggestions
  for (const [category, items] of byCategory.entries()) {
    if (items.length === 0) continue;

    const locations = items.map(item => ({ file: item.file, line: item.line }));
    const firstItem = items[0];

    suggestions.push({
      category,
      locations,
      suggestion: getSuggestionForCategory(category, items.length),
      example: `${firstItem.currentApproach} → ${firstItem.simplerApproach}`,
      impact: items.length >= 5 ? 'high' : items.length >= 2 ? 'medium' : 'low'
    });
  }

  return suggestions;
}

/**
 * Get suggestion text for category
 */
function getSuggestionForCategory(category: ComplexityCategory, count: number): string {
  const suggestions = {
    'unnecessary-abstraction': `Inline ${count} single-use function(s) to reduce abstraction overhead`,
    'over-engineered': `Simplify ${count} over-engineered pattern(s) - use simpler approaches`,
    'premature-optimization': `Remove ${count} premature optimization(s) - optimize when profiled`,
    'verbose': `Simplify ${count} verbose expression(s) for better readability`,
    'nested-logic': `Flatten ${count} deeply nested block(s) using guard clauses`,
    'complex-expression': `Break down ${count} complex expression(s) into clear steps`,
    'feature-bloat': `Remove ${count} unused feature(s) to reduce complexity`
  };

  return suggestions[category] || `Simplify ${count} occurrence(s) of ${category}`;
}

/**
 * Format analysis report
 */
export function formatReport(analysis: SimplificationAnalysis): string {
  const lines: string[] = [];

  lines.push('Simplification Analysis Report');
  lines.push('='.repeat(80));
  lines.push('');

  lines.push(`Total Over-Complexities: ${analysis.totalIssues}`);
  lines.push(`Estimated Line Savings: ${analysis.simplificationSavings} lines`);
  lines.push('');

  if (analysis.totalIssues === 0) {
    lines.push('✅ No over-complexities detected - code is appropriately simple');
    return lines.join('\n');
  }

  // Group by category
  const byCategory = new Map<ComplexityCategory, OverComplexity[]>();
  for (const comp of analysis.overComplexities) {
    if (!byCategory.has(comp.category)) {
      byCategory.set(comp.category, []);
    }
    byCategory.get(comp.category)!.push(comp);
  }

  lines.push('BY CATEGORY:');
  for (const [category, items] of byCategory.entries()) {
    lines.push(`  ${category}: ${items.length}`);
  }
  lines.push('');

  lines.push('TOP SIMPLIFICATION OPPORTUNITIES:');
  lines.push('');

  // Show top 15
  const sorted = [...analysis.overComplexities].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.savings - a.savings;
  });

  for (const comp of sorted.slice(0, 15)) {
    const emoji = comp.severity === 'critical' ? '🔴' : comp.severity === 'warning' ? '🟡' : '💡';

    lines.push(`  ${emoji} ${comp.category.toUpperCase()}`);
    lines.push(`     ${comp.description}`);
    lines.push(`     File: ${comp.file}:${comp.line}`);
    lines.push(`     Current: ${comp.currentApproach}`);
    lines.push(`     Simpler: ${comp.simplerApproach}`);
    lines.push(`     Savings: ${comp.savings} lines/complexity points`);
    lines.push('');
  }

  if (analysis.suggestions.length > 0) {
    lines.push('SUMMARY SUGGESTIONS:');
    lines.push('');

    for (const suggestion of analysis.suggestions) {
      const impactEmoji = suggestion.impact === 'high' ? '⚡' : suggestion.impact === 'medium' ? '💫' : '✨';
      lines.push(`  ${impactEmoji} ${suggestion.suggestion}`);
      lines.push(`     Example: ${suggestion.example}`);
      lines.push(`     Affected locations: ${suggestion.locations.length}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}
