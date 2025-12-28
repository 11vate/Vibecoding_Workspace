/**
 * Refactoring Detector - Detect refactoring opportunities
 *
 * Purpose: Identify code that needs refactoring
 * Authority: Tier 2 (Mandatory for code quality)
 * Use: Code review, technical debt management
 */

import * as fs from 'fs';
import * as path from 'path';

export interface RefactoringAnalysis {
  projectPath: string;
  opportunities: RefactoringOpportunity[];
  totalOpportunities: number;
  estimatedEffort: number; // hours
  prioritizedList: RefactoringOpportunity[];
}

export interface RefactoringOpportunity {
  type: RefactoringType;
  file: string;
  line: number;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  benefit: string;
  effort: number; // hours
  impact: 'high' | 'medium' | 'low';
  suggestion: string;
  example?: string;
}

export type RefactoringType =
  | 'extract-method'
  | 'extract-class'
  | 'rename'
  | 'move-method'
  | 'introduce-parameter-object'
  | 'replace-conditional-with-polymorphism'
  | 'decompose-conditional'
  | 'consolidate-duplicate-conditional'
  | 'remove-dead-code'
  | 'simplify-conditional'
  | 'extract-constant'
  | 'inline-temp';

/**
 * Detect refactoring opportunities
 */
export function detectOpportunities(projectPath: string): RefactoringAnalysis {
  const opportunities: RefactoringOpportunity[] = [];

  // Scan project files
  const files = collectCodeFiles(projectPath);

  for (const file of files) {
    opportunities.push(...analyzeFile(file.path, file.content));
  }

  // Calculate total effort
  const totalEffort = opportunities.reduce((sum, opp) => sum + opp.effort, 0);

  // Prioritize opportunities
  const prioritizedList = prioritizeOpportunities(opportunities);

  return {
    projectPath,
    opportunities,
    totalOpportunities: opportunities.length,
    estimatedEffort: totalEffort,
    prioritizedList
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
 * Analyze single file for refactoring opportunities
 */
function analyzeFile(filePath: string, content: string): RefactoringOpportunity[] {
  const opportunities: RefactoringOpportunity[] = [];
  const lines = content.split('\n');

  // Detect long methods (Extract Method)
  const longMethods = detectLongMethods(content, lines);
  opportunities.push(...longMethods.map(lm => ({
    type: 'extract-method' as RefactoringType,
    file: filePath,
    line: lm.line,
    severity: 'warning' as const,
    description: `Method has ${lm.lines} lines`,
    benefit: 'Improves readability and testability',
    effort: 1,
    impact: 'medium' as const,
    suggestion: 'Extract logical blocks into separate methods'
  })));

  // Detect long parameter lists (Introduce Parameter Object)
  const longParams = detectLongParameterLists(content, lines);
  opportunities.push(...longParams.map(lp => ({
    type: 'introduce-parameter-object' as RefactoringType,
    file: filePath,
    line: lp.line,
    severity: 'warning' as const,
    description: `Function has ${lp.count} parameters`,
    benefit: 'Simplifies function signature',
    effort: 0.5,
    impact: 'medium' as const,
    suggestion: 'Group related parameters into object',
    example: 'Instead of fn(a, b, c, d, e), use fn({ a, b, c, d, e })'
  })));

  // Detect magic numbers (Extract Constant)
  const magicNumbers = detectMagicNumbers(content, lines);
  opportunities.push(...magicNumbers.map(mn => ({
    type: 'extract-constant' as RefactoringType,
    file: filePath,
    line: mn.line,
    severity: 'info' as const,
    description: `Magic number: ${mn.value}`,
    benefit: 'Improves code clarity',
    effort: 0.1,
    impact: 'low' as const,
    suggestion: `const ${mn.suggestedName} = ${mn.value};`
  })));

  // Detect complex conditionals (Decompose Conditional)
  const complexConditionals = detectComplexConditionals(content, lines);
  opportunities.push(...complexConditionals.map(cc => ({
    type: 'decompose-conditional' as RefactoringType,
    file: filePath,
    line: cc.line,
    severity: 'warning' as const,
    description: 'Complex conditional expression',
    benefit: 'Improves readability',
    effort: 0.5,
    impact: 'medium' as const,
    suggestion: 'Extract condition into well-named variable or method'
  })));

  // Detect dead code (Remove Dead Code)
  const deadCode = detectDeadCode(content, lines);
  opportunities.push(...deadCode.map(dc => ({
    type: 'remove-dead-code' as RefactoringType,
    file: filePath,
    line: dc.line,
    severity: 'info' as const,
    description: 'Unused code detected',
    benefit: 'Reduces clutter and confusion',
    effort: 0.1,
    impact: 'low' as const,
    suggestion: 'Remove unused code'
  })));

  // Detect switch statements (Replace Conditional with Polymorphism)
  const switchStatements = detectSwitchStatements(content, lines);
  opportunities.push(...switchStatements.map(ss => ({
    type: 'replace-conditional-with-polymorphism' as RefactoringType,
    file: filePath,
    line: ss.line,
    severity: 'info' as const,
    description: `Switch statement with ${ss.cases} cases`,
    benefit: 'More extensible and maintainable',
    effort: 3,
    impact: 'high' as const,
    suggestion: 'Consider using strategy pattern or polymorphism'
  })));

  return opportunities;
}

/**
 * Detect long methods
 */
function detectLongMethods(
  content: string,
  lines: string[]
): Array<{ line: number; lines: number }> {
  const results: Array<{ line: number; lines: number }> = [];

  const functionRegex = /^\s*(?:async\s+)?(?:function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>)/;

  for (let i = 0; i < lines.length; i++) {
    if (functionRegex.test(lines[i])) {
      // Find function end
      let braceCount = 0;
      let started = false;
      let endLine = i;

      for (let j = i; j < lines.length; j++) {
        for (const char of lines[j]) {
          if (char === '{') {
            braceCount++;
            started = true;
          } else if (char === '}') {
            braceCount--;
          }
        }

        if (started && braceCount === 0) {
          endLine = j;
          break;
        }
      }

      const functionLength = endLine - i + 1;

      if (functionLength > 50) {
        results.push({ line: i + 1, lines: functionLength });
      }
    }
  }

  return results;
}

/**
 * Detect long parameter lists
 */
function detectLongParameterLists(
  content: string,
  lines: string[]
): Array<{ line: number; count: number }> {
  const results: Array<{ line: number; count: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/function\s+\w+\s*\(([^)]+)\)/);

    if (match) {
      const params = match[1].split(',').filter(p => p.trim().length > 0);

      if (params.length > 5) {
        results.push({ line: i + 1, count: params.length });
      }
    }
  }

  return results;
}

/**
 * Detect magic numbers
 */
function detectMagicNumbers(
  content: string,
  lines: string[]
): Array<{ line: number; value: number; suggestedName: string }> {
  const results: Array<{ line: number; value: number; suggestedName: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip if line is a constant declaration
    if (/const\s+\w+\s*=\s*\d+/.test(line)) {
      continue;
    }

    // Find numbers
    const numberMatches = line.matchAll(/[^a-zA-Z0-9_](\d{2,})[^a-zA-Z0-9_]/g);

    for (const match of numberMatches) {
      const value = parseInt(match[1]);

      // Skip common values
      if ([0, 1, 2, 10, 100, -1].includes(value)) {
        continue;
      }

      results.push({
        line: i + 1,
        value,
        suggestedName: `CONSTANT_${value}`
      });
    }
  }

  return results;
}

/**
 * Detect complex conditionals
 */
function detectComplexConditionals(
  content: string,
  lines: string[]
): Array<{ line: number }> {
  const results: Array<{ line: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Count logical operators in if statements
    if (/if\s*\(/.test(line)) {
      const logicalOps = (line.match(/&&|\|\|/g) || []).length;

      if (logicalOps >= 2) {
        results.push({ line: i + 1 });
      }
    }
  }

  return results;
}

/**
 * Detect dead code
 */
function detectDeadCode(
  content: string,
  lines: string[]
): Array<{ line: number }> {
  const results: Array<{ line: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Commented out code
    if (/^\/\/\s*(const|let|var|function|class|if|for|while)/.test(line)) {
      results.push({ line: i + 1 });
    }

    // Unreachable code after return
    if (/return\s/.test(line)) {
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine.length > 0 && !nextLine.startsWith('}') && !nextLine.startsWith('//')) {
          results.push({ line: j + 1 });
          break;
        }
      }
    }
  }

  return results;
}

/**
 * Detect switch statements
 */
function detectSwitchStatements(
  content: string,
  lines: string[]
): Array<{ line: number; cases: number }> {
  const results: Array<{ line: number; cases: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/switch\s*\(/.test(line)) {
      // Count cases
      let cases = 0;
      for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
        if (/case\s+/.test(lines[j])) {
          cases++;
        }
        if (lines[j].trim() === '}') {
          break;
        }
      }

      if (cases >= 3) {
        results.push({ line: i + 1, cases });
      }
    }
  }

  return results;
}

/**
 * Prioritize refactoring opportunities
 */
function prioritizeOpportunities(
  opportunities: RefactoringOpportunity[]
): RefactoringOpportunity[] {
  return [...opportunities].sort((a, b) => {
    // Sort by: severity > impact > effort (ascending)
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const impactOrder = { high: 0, medium: 1, low: 2 };

    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }

    if (impactOrder[a.impact] !== impactOrder[b.impact]) {
      return impactOrder[a.impact] - impactOrder[b.impact];
    }

    return a.effort - b.effort; // Lower effort first
  });
}

/**
 * Format analysis report
 */
export function formatReport(analysis: RefactoringAnalysis): string {
  const lines: string[] = [];

  lines.push('Refactoring Opportunities Analysis');
  lines.push('='.repeat(80));
  lines.push('');

  lines.push(`Total Opportunities: ${analysis.totalOpportunities}`);
  lines.push(`Estimated Total Effort: ${analysis.estimatedEffort.toFixed(1)} hours`);
  lines.push('');

  // Group by type
  const byType = new Map<RefactoringType, number>();
  for (const opp of analysis.opportunities) {
    byType.set(opp.type, (byType.get(opp.type) || 0) + 1);
  }

  lines.push('By Type:');
  for (const [type, count] of byType.entries()) {
    lines.push(`  ${type}: ${count}`);
  }
  lines.push('');

  lines.push('TOP PRIORITIES:');
  lines.push('');

  const top = analysis.prioritizedList.slice(0, 15);
  for (const opp of top) {
    const severityEmoji = opp.severity === 'critical' ? '🔴' : opp.severity === 'warning' ? '🟡' : '🟢';
    const impactEmoji = opp.impact === 'high' ? '⚡' : opp.impact === 'medium' ? '💫' : '✨';

    lines.push(`  ${severityEmoji} ${impactEmoji} ${opp.type}`);
    lines.push(`     ${opp.description}`);
    lines.push(`     File: ${opp.file}:${opp.line}`);
    lines.push(`     Benefit: ${opp.benefit}`);
    lines.push(`     Effort: ${opp.effort}h`);
    lines.push(`     💡 ${opp.suggestion}`);
    if (opp.example) {
      lines.push(`     Example: ${opp.example}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
