/**
 * Complexity Analyzer - Calculate code complexity metrics
 *
 * Purpose: Measure cyclomatic complexity, cognitive complexity, and coupling
 * Authority: Tier 2 (Mandatory for quality enforcement)
 * Use: Complexity gate validation, code quality assessment
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ComplexityResult {
  file: string;
  totalLines: number;
  codeLines: number;
  commentLines: number;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  functions: FunctionComplexity[];
  maxComplexity: number;
  averageComplexity: number;
  issues: string[];
}

export interface FunctionComplexity {
  name: string;
  line: number;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  parameters: number;
  lines: number;
}

const COMPLEXITY_THRESHOLD = 10; // From complexity-gate.md
const FUNCTION_LENGTH_THRESHOLD = 50;
const PARAMETER_THRESHOLD = 5;

/**
 * Analyze file complexity
 */
export function analyzeComplexity(filePath: string): ComplexityResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const result: ComplexityResult = {
    file: filePath,
    totalLines: lines.length,
    codeLines: 0,
    commentLines: 0,
    cyclomaticComplexity: 1, // Base complexity
    cognitiveComplexity: 0,
    functions: [],
    maxComplexity: 0,
    averageComplexity: 0,
    issues: []
  };

  // Count line types
  let inBlockComment = false;
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('/*')) inBlockComment = true;
    if (inBlockComment) {
      result.commentLines++;
      if (trimmed.endsWith('*/')) inBlockComment = false;
      continue;
    }

    if (trimmed.startsWith('//')) {
      result.commentLines++;
    } else if (trimmed.length > 0) {
      result.codeLines++;
    }
  }

  // Analyze functions
  result.functions = extractFunctions(content);

  // Calculate file-level complexity
  result.cyclomaticComplexity = calculateCyclomaticComplexity(content);
  result.cognitiveComplexity = calculateCognitiveComplexity(content);

  // Calculate function-level stats
  if (result.functions.length > 0) {
    result.maxComplexity = Math.max(...result.functions.map(f => f.cyclomaticComplexity));
    result.averageComplexity =
      result.functions.reduce((sum, f) => sum + f.cyclomaticComplexity, 0) / result.functions.length;
  }

  // Identify issues
  result.issues = identifyComplexityIssues(result);

  return result;
}

/**
 * Extract functions from code
 */
function extractFunctions(content: string): FunctionComplexity[] {
  const functions: FunctionComplexity[] = [];
  const lines = content.split('\n');

  // Simple regex patterns for function declarations
  const patterns = [
    /function\s+(\w+)\s*\((.*?)\)/g, // function name(params)
    /(\w+)\s*=\s*function\s*\((.*?)\)/g, // name = function(params)
    /(\w+)\s*=\s*\((.*?)\)\s*=>/g, // name = (params) =>
    /(\w+)\s*\((.*?)\)\s*{/g, // name(params) {
    /async\s+function\s+(\w+)\s*\((.*?)\)/g // async function name(params)
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const pattern of patterns) {
      pattern.lastIndex = 0; // Reset regex
      const match = pattern.exec(line);

      if (match) {
        const name = match[1];
        const params = match[2] ? match[2].split(',').filter(p => p.trim().length > 0) : [];

        // Find function body
        const functionBody = extractFunctionBody(lines, i);

        functions.push({
          name,
          line: i + 1,
          cyclomaticComplexity: calculateCyclomaticComplexity(functionBody),
          cognitiveComplexity: calculateCognitiveComplexity(functionBody),
          parameters: params.length,
          lines: functionBody.split('\n').length
        });

        break;
      }
    }
  }

  return functions;
}

/**
 * Extract function body
 */
function extractFunctionBody(lines: string[], startLine: number): string {
  let braceCount = 0;
  let started = false;
  const bodyLines: string[] = [];

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];

    for (const char of line) {
      if (char === '{') {
        braceCount++;
        started = true;
      } else if (char === '}') {
        braceCount--;
      }
    }

    if (started) {
      bodyLines.push(line);
    }

    if (started && braceCount === 0) {
      break;
    }
  }

  return bodyLines.join('\n');
}

/**
 * Calculate cyclomatic complexity
 */
function calculateCyclomaticComplexity(code: string): number {
  let complexity = 1; // Base complexity

  // Count decision points
  const patterns = [
    /\bif\b/g, // if statements
    /\belse\s+if\b/g, // else if
    /\bwhile\b/g, // while loops
    /\bfor\b/g, // for loops
    /\bcase\b/g, // switch cases
    /\bcatch\b/g, // try-catch
    /\b\&\&\b/g, // logical AND
    /\b\|\|\b/g, // logical OR
    /\?\s*.*?\s*:/g // ternary operator
  ];

  for (const pattern of patterns) {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  }

  return complexity;
}

/**
 * Calculate cognitive complexity
 */
function calculateCognitiveComplexity(code: string): number {
  let complexity = 0;
  let nestingLevel = 0;

  const lines = code.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Increase nesting
    if (trimmed.match(/\b(if|for|while|switch)\b/)) {
      complexity += 1 + nestingLevel;
      nestingLevel++;
    }

    // Decrease nesting
    if (trimmed === '}') {
      nestingLevel = Math.max(0, nestingLevel - 1);
    }

    // Logical operators increase complexity
    const andMatches = trimmed.match(/&&/g);
    const orMatches = trimmed.match(/\|\|/g);
    if (andMatches) complexity += andMatches.length;
    if (orMatches) complexity += orMatches.length;
  }

  return complexity;
}

/**
 * Identify complexity issues
 */
function identifyComplexityIssues(result: ComplexityResult): string[] {
  const issues: string[] = [];

  // File-level issues
  if (result.cyclomaticComplexity > COMPLEXITY_THRESHOLD * 5) {
    issues.push(`File complexity (${result.cyclomaticComplexity}) exceeds recommended limit`);
  }

  if (result.codeLines > 500) {
    issues.push(`File is very long (${result.codeLines} lines) - consider splitting`);
  }

  // Function-level issues
  for (const func of result.functions) {
    if (func.cyclomaticComplexity > COMPLEXITY_THRESHOLD) {
      issues.push(
        `Function "${func.name}" at line ${func.line}: complexity ${func.cyclomaticComplexity} exceeds threshold ${COMPLEXITY_THRESHOLD}`
      );
    }

    if (func.lines > FUNCTION_LENGTH_THRESHOLD) {
      issues.push(
        `Function "${func.name}" at line ${func.line}: ${func.lines} lines exceeds threshold ${FUNCTION_LENGTH_THRESHOLD}`
      );
    }

    if (func.parameters > PARAMETER_THRESHOLD) {
      issues.push(
        `Function "${func.name}" at line ${func.line}: ${func.parameters} parameters exceeds threshold ${PARAMETER_THRESHOLD}`
      );
    }
  }

  return issues;
}

/**
 * Analyze directory
 */
export function analyzeDirectory(
  dirPath: string,
  recursive: boolean = true
): ComplexityResult[] {
  const results: ComplexityResult[] = [];

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
        if (['.ts', '.js', '.tsx', '.jsx'].includes(ext)) {
          try {
            results.push(analyzeComplexity(fullPath));
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
export function generateSummary(results: ComplexityResult[]): {
  totalFiles: number;
  totalIssues: number;
  avgComplexity: number;
  maxComplexity: number;
  filesAboveThreshold: number;
} {
  return {
    totalFiles: results.length,
    totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
    avgComplexity:
      results.reduce((sum, r) => sum + r.cyclomaticComplexity, 0) / (results.length || 1),
    maxComplexity: Math.max(...results.map(r => r.cyclomaticComplexity)),
    filesAboveThreshold: results.filter(r => r.cyclomaticComplexity > COMPLEXITY_THRESHOLD * 5).length
  };
}
