/**
 * Anti-Pattern Detector - Detect design and code anti-patterns
 *
 * Purpose: Automated anti-pattern detection for early prevention
 * Authority: Tier 2 (Mandatory for quality enforcement)
 * Use: Code auditing, design validation, quality gates
 */

import * as fs from 'fs';
import * as path from 'path';

export interface AntiPatternDetectionResult {
  file: string;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  detections: AntiPatternDetection[];
  passed: boolean; // True if no critical issues
}

export interface AntiPatternDetection {
  pattern: string;
  category: AntiPatternCategory;
  severity: 'critical' | 'warning' | 'info';
  line: number;
  message: string;
  suggestion: string;
  context?: string;
}

export type AntiPatternCategory =
  | 'design'
  | 'technical'
  | 'quality'
  | 'performance'
  | 'accessibility'
  | 'maintainability';

export interface AntiPattern {
  id: string;
  name: string;
  category: AntiPatternCategory;
  severity: 'critical' | 'warning' | 'info';
  pattern: RegExp | ((code: string) => boolean);
  message: string;
  suggestion: string;
}

/**
 * Anti-Patterns Library
 * Based on complexity-gate.md and quality-gate.md
 */
const ANTI_PATTERNS_LIBRARY: AntiPattern[] = [
  // Quality Anti-Patterns (from quality-gate.md)
  {
    id: 'placeholder-todo',
    name: 'TODO Placeholder',
    category: 'quality',
    severity: 'critical',
    pattern: /\/\/\s*TODO/i,
    message: 'TODO comment found - placeholders not allowed',
    suggestion: 'Complete the implementation or remove the comment'
  },
  {
    id: 'placeholder-fixme',
    name: 'FIXME Placeholder',
    category: 'quality',
    severity: 'critical',
    pattern: /\/\/\s*FIXME/i,
    message: 'FIXME comment found - placeholders not allowed',
    suggestion: 'Fix the issue or remove the comment'
  },
  {
    id: 'placeholder-hack',
    name: 'HACK Comment',
    category: 'quality',
    severity: 'critical',
    pattern: /\/\/\s*HACK/i,
    message: 'HACK comment found - indicates poor solution',
    suggestion: 'Refactor to use proper solution'
  },
  {
    id: 'placeholder-xxx',
    name: 'XXX Placeholder',
    category: 'quality',
    severity: 'critical',
    pattern: /\/\/\s*XXX/i,
    message: 'XXX comment found - placeholders not allowed',
    suggestion: 'Complete the implementation'
  },
  {
    id: 'placeholder-tbd',
    name: 'TBD Placeholder',
    category: 'quality',
    severity: 'critical',
    pattern: /\bTBD\b/i,
    message: 'TBD found - incomplete implementation',
    suggestion: 'Determine and implement the solution'
  },
  {
    id: 'placeholder-not-implemented',
    name: 'Not Implemented Error',
    category: 'quality',
    severity: 'critical',
    pattern: /throw new Error\(['"]Not implemented['"]\)/i,
    message: 'Not implemented error - stub code not allowed',
    suggestion: 'Complete the implementation'
  },

  // TypeScript Anti-Patterns
  {
    id: 'any-type',
    name: 'Any Type Usage',
    category: 'quality',
    severity: 'critical',
    pattern: /:\s*any\b/,
    message: 'Using "any" type - all types must be explicit',
    suggestion: 'Define proper type or interface'
  },
  {
    id: 'type-assertion-any',
    name: 'Type Assertion to Any',
    category: 'quality',
    severity: 'critical',
    pattern: /as\s+any\b/,
    message: 'Type assertion to "any" - bypasses type safety',
    suggestion: 'Use proper type assertion or fix type definitions'
  },

  // Error Handling Anti-Patterns
  {
    id: 'unhandled-promise',
    name: 'Unhandled Promise',
    category: 'quality',
    severity: 'critical',
    pattern: /\.(then|catch)\([^)]+\)(?!\s*\.(?:then|catch|finally))/,
    message: 'Promise chain without error handling',
    suggestion: 'Add .catch() to handle promise rejections'
  },
  {
    id: 'empty-catch',
    name: 'Empty Catch Block',
    category: 'quality',
    severity: 'warning',
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/,
    message: 'Empty catch block - silently swallows errors',
    suggestion: 'Log error or handle it appropriately'
  },

  // Magic Numbers
  {
    id: 'magic-number',
    name: 'Magic Number',
    category: 'maintainability',
    severity: 'warning',
    pattern: /[^a-zA-Z0-9_]((?!0|1|2|10|100|-1)\d{2,})[^a-zA-Z0-9_]/,
    message: 'Magic number found - use named constant',
    suggestion: 'Extract to named constant with rationale comment'
  },

  // Performance Anti-Patterns
  {
    id: 'nested-loop',
    name: 'Nested Loop',
    category: 'performance',
    severity: 'warning',
    pattern: /for\s*\([^)]*\)\s*\{[^}]*for\s*\(/,
    message: 'Nested loop detected - potential O(n²) complexity',
    suggestion: 'Consider using Set/Map for O(n) lookup or optimize algorithm'
  },
  {
    id: 'console-log',
    name: 'Console Log',
    category: 'quality',
    severity: 'warning',
    pattern: /console\.log\(/,
    message: 'console.log found - use logger instead',
    suggestion: 'Replace with proper logger (logger.info, logger.debug)'
  },
  {
    id: 'debugger-statement',
    name: 'Debugger Statement',
    category: 'quality',
    severity: 'critical',
    pattern: /\bdebugger\b/,
    message: 'Debugger statement found - remove before commit',
    suggestion: 'Remove debugger statement'
  },

  // Code Organization Anti-Patterns
  {
    id: 'god-class-methods',
    name: 'God Class (Too Many Methods)',
    category: 'maintainability',
    severity: 'warning',
    pattern: (code: string) => {
      const methods = code.match(/^\s*(public|private|protected)?\s*(async\s+)?[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/gm);
      return methods ? methods.length > 15 : false;
    },
    message: 'Class has too many methods (>15) - violates single responsibility',
    suggestion: 'Split class by responsibility into multiple classes'
  },

  // Accessibility Anti-Patterns
  {
    id: 'img-no-alt',
    name: 'Image Without Alt Text',
    category: 'accessibility',
    severity: 'critical',
    pattern: /<img\s+(?![^>]*\balt\s*=)[^>]*>/,
    message: 'Image without alt attribute - accessibility violation',
    suggestion: 'Add alt attribute describing the image'
  },
  {
    id: 'button-no-text',
    name: 'Button Without Accessible Text',
    category: 'accessibility',
    severity: 'warning',
    pattern: /<button\s+(?![^>]*\baria-label\s*=)[^>]*>\s*<(?:i|svg|Icon)/,
    message: 'Button with icon but no accessible text',
    suggestion: 'Add aria-label or visible text for screen readers'
  },
  {
    id: 'div-as-button',
    name: 'Div as Button',
    category: 'accessibility',
    severity: 'warning',
    pattern: /<div\s+[^>]*onClick\s*=/,
    message: 'Div with onClick - not keyboard accessible',
    suggestion: 'Use <button> element or add keyboard event handlers'
  },

  // Coupling Anti-Patterns
  {
    id: 'circular-import',
    name: 'Potential Circular Import',
    category: 'technical',
    severity: 'warning',
    pattern: /import\s+.*\s+from\s+['"]\.\.\/.*['"]/,
    message: 'Relative parent import - check for circular dependencies',
    suggestion: 'Review import structure, use dependency injection if needed'
  },

  // Design Anti-Patterns
  {
    id: 'deeply-nested',
    name: 'Deeply Nested Code',
    category: 'maintainability',
    severity: 'warning',
    pattern: /\{\s*\n[^}]*\{\s*\n[^}]*\{\s*\n[^}]*\{\s*\n/,
    message: 'Code nesting depth > 3 levels - cognitive maze',
    suggestion: 'Use guard clauses or extract to functions'
  },

  // Code Smell Anti-Patterns
  {
    id: 'long-parameter-list',
    name: 'Long Parameter List',
    category: 'maintainability',
    severity: 'warning',
    pattern: /function\s+\w+\s*\([^)]*,[^)]*,[^)]*,[^)]*,[^)]*,[^)]*\)/,
    message: 'Function has >5 parameters - too complex',
    suggestion: 'Use options object to group related parameters'
  },
  {
    id: 'commented-code',
    name: 'Commented Out Code',
    category: 'maintainability',
    severity: 'info',
    pattern: /\/\/\s*(const|let|var|function|class|if|for|while)\s/,
    message: 'Commented out code - remove or commit',
    suggestion: 'Delete if unused, use version control for history'
  },
  {
    id: 'duplicate-string',
    name: 'Duplicate String Literal',
    category: 'maintainability',
    severity: 'info',
    pattern: (code: string) => {
      const strings = code.match(/['"][^'"]{10,}['"]/g);
      if (!strings) return false;
      const counts = new Map<string, number>();
      for (const str of strings) {
        counts.set(str, (counts.get(str) || 0) + 1);
      }
      return Array.from(counts.values()).some(count => count > 2);
    },
    message: 'Duplicate string literal found multiple times',
    suggestion: 'Extract to named constant'
  }
];

/**
 * Detect anti-patterns in a file
 */
export function detectAntiPatterns(filePath: string): AntiPatternDetectionResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const detections: AntiPatternDetection[] = [];

  // Run each anti-pattern check
  for (const antiPattern of ANTI_PATTERNS_LIBRARY) {
    if (typeof antiPattern.pattern === 'function') {
      // Function-based detection (for complex patterns)
      if (antiPattern.pattern(content)) {
        detections.push({
          pattern: antiPattern.id,
          category: antiPattern.category,
          severity: antiPattern.severity,
          line: 1, // Function-based checks don't have specific line
          message: `${antiPattern.name}: ${antiPattern.message}`,
          suggestion: antiPattern.suggestion
        });
      }
    } else {
      // Regex-based detection
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(antiPattern.pattern);

        if (match) {
          detections.push({
            pattern: antiPattern.id,
            category: antiPattern.category,
            severity: antiPattern.severity,
            line: i + 1,
            message: `${antiPattern.name}: ${antiPattern.message}`,
            suggestion: antiPattern.suggestion,
            context: line.trim()
          });
        }
      }
    }
  }

  // Count by severity
  const criticalIssues = detections.filter(d => d.severity === 'critical').length;
  const warningIssues = detections.filter(d => d.severity === 'warning').length;
  const infoIssues = detections.filter(d => d.severity === 'info').length;

  return {
    file: filePath,
    totalIssues: detections.length,
    criticalIssues,
    warningIssues,
    infoIssues,
    detections,
    passed: criticalIssues === 0
  };
}

/**
 * Detect anti-patterns in a directory
 */
export function detectAntiPatternsInDirectory(
  dirPath: string,
  recursive: boolean = true
): AntiPatternDetectionResult[] {
  const results: AntiPatternDetectionResult[] = [];

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && recursive) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scan(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
          try {
            results.push(detectAntiPatterns(fullPath));
          } catch (error) {
            console.error(`Failed to analyze ${fullPath}:`, error);
          }
        }
      }
    }
  }

  scan(dirPath);
  return results;
}

/**
 * Generate summary report
 */
export function generateSummary(results: AntiPatternDetectionResult[]): {
  totalFiles: number;
  filesWithIssues: number;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  passed: boolean;
  issuesByCategory: Record<AntiPatternCategory, number>;
  topAntiPatterns: Array<{ pattern: string; count: number }>;
} {
  const issuesByCategory: Record<AntiPatternCategory, number> = {
    design: 0,
    technical: 0,
    quality: 0,
    performance: 0,
    accessibility: 0,
    maintainability: 0
  };

  const patternCounts = new Map<string, number>();

  for (const result of results) {
    for (const detection of result.detections) {
      issuesByCategory[detection.category]++;
      patternCounts.set(detection.pattern, (patternCounts.get(detection.pattern) || 0) + 1);
    }
  }

  const topAntiPatterns = Array.from(patternCounts.entries())
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalFiles: results.length,
    filesWithIssues: results.filter(r => r.totalIssues > 0).length,
    totalIssues: results.reduce((sum, r) => sum + r.totalIssues, 0),
    criticalIssues: results.reduce((sum, r) => sum + r.criticalIssues, 0),
    warningIssues: results.reduce((sum, r) => sum + r.warningIssues, 0),
    infoIssues: results.reduce((sum, r) => sum + r.infoIssues, 0),
    passed: results.every(r => r.passed),
    issuesByCategory,
    topAntiPatterns
  };
}

/**
 * Filter detections by severity
 */
export function filterBySeverity(
  result: AntiPatternDetectionResult,
  severity: 'critical' | 'warning' | 'info'
): AntiPatternDetection[] {
  return result.detections.filter(d => d.severity === severity);
}

/**
 * Filter detections by category
 */
export function filterByCategory(
  result: AntiPatternDetectionResult,
  category: AntiPatternCategory
): AntiPatternDetection[] {
  return result.detections.filter(d => d.category === category);
}

/**
 * Get anti-pattern by ID
 */
export function getAntiPattern(id: string): AntiPattern | undefined {
  return ANTI_PATTERNS_LIBRARY.find(ap => ap.id === id);
}

/**
 * List all anti-patterns
 */
export function listAntiPatterns(): AntiPattern[] {
  return [...ANTI_PATTERNS_LIBRARY];
}

/**
 * Format detection report
 */
export function formatReport(result: AntiPatternDetectionResult): string {
  const lines: string[] = [];

  lines.push(`Anti-Pattern Detection Report: ${result.file}`);
  lines.push('='.repeat(80));
  lines.push('');

  if (result.totalIssues === 0) {
    lines.push('✅ No anti-patterns detected');
    return lines.join('\n');
  }

  lines.push(`Total Issues: ${result.totalIssues}`);
  lines.push(`  Critical: ${result.criticalIssues}`);
  lines.push(`  Warnings: ${result.warningIssues}`);
  lines.push(`  Info: ${result.infoIssues}`);
  lines.push('');
  lines.push(`Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'} (critical issues: ${result.criticalIssues})`);
  lines.push('');

  // Group by severity
  const critical = filterBySeverity(result, 'critical');
  const warnings = filterBySeverity(result, 'warning');
  const info = filterBySeverity(result, 'info');

  if (critical.length > 0) {
    lines.push('🔴 CRITICAL ISSUES:');
    lines.push('');
    for (const detection of critical) {
      lines.push(`  Line ${detection.line}: ${detection.message}`);
      if (detection.context) {
        lines.push(`    Context: ${detection.context}`);
      }
      lines.push(`    Fix: ${detection.suggestion}`);
      lines.push('');
    }
  }

  if (warnings.length > 0) {
    lines.push('⚠️  WARNINGS:');
    lines.push('');
    for (const detection of warnings) {
      lines.push(`  Line ${detection.line}: ${detection.message}`);
      if (detection.context) {
        lines.push(`    Context: ${detection.context}`);
      }
      lines.push(`    Fix: ${detection.suggestion}`);
      lines.push('');
    }
  }

  if (info.length > 0) {
    lines.push('ℹ️  INFO:');
    lines.push('');
    for (const detection of info) {
      lines.push(`  Line ${detection.line}: ${detection.message}`);
      if (detection.context) {
        lines.push(`    Context: ${detection.context}`);
      }
      lines.push(`    Fix: ${detection.suggestion}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}
