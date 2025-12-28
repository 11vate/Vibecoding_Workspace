/**
 * Pattern Matcher - Find and suggest reusable code patterns
 *
 * Purpose: Identify reusable patterns and suggest their application
 * Authority: Tier 2 (Mandatory for code quality)
 * Use: Code analysis, pattern reuse, refactoring guidance
 */

import * as fs from 'fs';
import * as path from 'path';

export interface PatternMatchResult {
  file: string;
  matches: PatternMatch[];
  totalMatches: number;
  suggestions: PatternSuggestion[];
}

export interface PatternMatch {
  patternId: string;
  patternName: string;
  line: number;
  category: PatternCategory;
  confidence: number; // 0-100
  context: string;
  benefits: string[];
}

export interface PatternSuggestion {
  location: string;
  line: number;
  suggestion: string;
  patternId: string;
  reasoning: string;
  example?: string;
}

export type PatternCategory =
  | 'creational'
  | 'structural'
  | 'behavioral'
  | 'architectural'
  | 'functional'
  | 'react';

export interface CodePattern {
  id: string;
  name: string;
  category: PatternCategory;
  matcher: RegExp | ((code: string) => PatternMatch[]);
  benefits: string[];
  description: string;
  example?: string;
}

/**
 * Code Patterns Library
 * Based on workspace coding patterns and best practices
 */
const CODE_PATTERNS_LIBRARY: CodePattern[] = [
  // Creational Patterns
  {
    id: 'singleton',
    name: 'Singleton Pattern',
    category: 'creational',
    matcher: /class\s+(\w+)\s*\{[^}]*private\s+static\s+instance[^}]*getInstance\s*\(/,
    benefits: [
      'Single instance guaranteed',
      'Global access point',
      'Lazy initialization'
    ],
    description: 'Ensures a class has only one instance and provides global access'
  },
  {
    id: 'factory',
    name: 'Factory Pattern',
    category: 'creational',
    matcher: /(?:create|make|build)(\w+)\s*\([^)]*\)\s*:\s*\w+\s*\{/,
    benefits: [
      'Decouples object creation',
      'Flexible instantiation',
      'Easy to extend'
    ],
    description: 'Creates objects without specifying exact class'
  },
  {
    id: 'builder',
    name: 'Builder Pattern',
    category: 'creational',
    matcher: /class\s+(\w+)Builder\s*\{[^}]*with(\w+)\s*\([^)]*\)\s*:\s*this/,
    benefits: [
      'Fluent interface',
      'Step-by-step construction',
      'Immutable objects'
    ],
    description: 'Constructs complex objects step by step'
  },

  // Structural Patterns
  {
    id: 'decorator',
    name: 'Decorator Pattern',
    category: 'structural',
    matcher: /class\s+(\w+)Decorator\s+(?:extends|implements)\s+\w+/,
    benefits: [
      'Adds behavior dynamically',
      'Alternative to subclassing',
      'Single responsibility'
    ],
    description: 'Attaches additional responsibilities to objects dynamically'
  },
  {
    id: 'adapter',
    name: 'Adapter Pattern',
    category: 'structural',
    matcher: /class\s+(\w+)Adapter\s+implements\s+\w+/,
    benefits: [
      'Converts interfaces',
      'Enables compatibility',
      'Reuses existing code'
    ],
    description: 'Converts interface of a class into another interface'
  },
  {
    id: 'facade',
    name: 'Facade Pattern',
    category: 'structural',
    matcher: /class\s+(\w+)Facade\s*\{/,
    benefits: [
      'Simplifies complex subsystems',
      'Reduces dependencies',
      'Easier to use'
    ],
    description: 'Provides simplified interface to complex subsystem'
  },

  // Behavioral Patterns
  {
    id: 'observer',
    name: 'Observer Pattern',
    category: 'behavioral',
    matcher: /(?:subscribe|addListener|on)\s*\([^)]*\)\s*(?::\s*(?:void|Subscription))?/,
    benefits: [
      'Loose coupling',
      'Event-driven architecture',
      'One-to-many dependencies'
    ],
    description: 'Defines dependency between objects for automatic updates'
  },
  {
    id: 'strategy',
    name: 'Strategy Pattern',
    category: 'behavioral',
    matcher: /class\s+(\w+)Strategy\s+implements\s+\w+Strategy/,
    benefits: [
      'Interchangeable algorithms',
      'Eliminates conditionals',
      'Easy to extend'
    ],
    description: 'Defines family of algorithms and makes them interchangeable'
  },
  {
    id: 'command',
    name: 'Command Pattern',
    category: 'behavioral',
    matcher: /class\s+(\w+)Command\s+implements\s+Command/,
    benefits: [
      'Encapsulates requests',
      'Supports undo/redo',
      'Queues operations'
    ],
    description: 'Encapsulates request as an object'
  },
  {
    id: 'state',
    name: 'State Pattern',
    category: 'behavioral',
    matcher: /class\s+(\w+)State\s+implements\s+State/,
    benefits: [
      'Clean state transitions',
      'Eliminates state conditionals',
      'Easy to add states'
    ],
    description: 'Alters object behavior when internal state changes'
  },

  // Architectural Patterns
  {
    id: 'mvc',
    name: 'MVC Pattern',
    category: 'architectural',
    matcher: /(Model|View|Controller)\s*\{/,
    benefits: [
      'Separates concerns',
      'Independent development',
      'Testable components'
    ],
    description: 'Separates application into Model-View-Controller'
  },
  {
    id: 'repository',
    name: 'Repository Pattern',
    category: 'architectural',
    matcher: /class\s+(\w+)Repository\s*\{/,
    benefits: [
      'Abstracts data layer',
      'Centralized data access',
      'Easy to test'
    ],
    description: 'Mediates between domain and data mapping layers'
  },
  {
    id: 'service-layer',
    name: 'Service Layer Pattern',
    category: 'architectural',
    matcher: /class\s+(\w+)Service\s*\{/,
    benefits: [
      'Business logic isolation',
      'Reusable services',
      'Transaction boundaries'
    ],
    description: 'Defines application boundary with business operations'
  },

  // Functional Patterns
  {
    id: 'pure-function',
    name: 'Pure Function',
    category: 'functional',
    matcher: (code: string) => {
      const matches: PatternMatch[] = [];
      const lines = code.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Look for functions with no side effects (no this, no mutations)
        if (
          /function\s+\w+\s*\([^)]*\)\s*:\s*\w+/.test(line) &&
          !line.includes('this.') &&
          !line.includes('=') &&
          !line.includes('push') &&
          !line.includes('pop')
        ) {
          matches.push({
            patternId: 'pure-function',
            patternName: 'Pure Function',
            line: i + 1,
            category: 'functional',
            confidence: 70,
            context: line.trim(),
            benefits: [
              'Predictable output',
              'Easy to test',
              'No side effects'
            ]
          });
        }
      }

      return matches;
    },
    benefits: [
      'Predictable output',
      'Easy to test',
      'No side effects'
    ],
    description: 'Function with no side effects, returns same output for same input'
  },
  {
    id: 'higher-order-function',
    name: 'Higher-Order Function',
    category: 'functional',
    matcher: /function\s+\w+\s*\([^)]*callback[^)]*\)/,
    benefits: [
      'Function composition',
      'Code reuse',
      'Abstraction'
    ],
    description: 'Function that takes or returns functions'
  },
  {
    id: 'immutable-update',
    name: 'Immutable Update Pattern',
    category: 'functional',
    matcher: /\{\s*\.\.\.(\w+),\s*(\w+):\s*[^}]+\}/,
    benefits: [
      'Prevents mutations',
      'Predictable state',
      'Easy debugging'
    ],
    description: 'Updates objects/arrays without mutation using spread'
  },

  // React Patterns
  {
    id: 'custom-hook',
    name: 'Custom Hook',
    category: 'react',
    matcher: /function\s+use[A-Z]\w+\s*\(/,
    benefits: [
      'Reusable logic',
      'Separation of concerns',
      'Composable'
    ],
    description: 'Extracts component logic into reusable function'
  },
  {
    id: 'render-props',
    name: 'Render Props Pattern',
    category: 'react',
    matcher: /\{?(\w+)\s*\(\s*(?:props|\{[^}]+\})\s*\)/,
    benefits: [
      'Flexible rendering',
      'Share code',
      'Inversion of control'
    ],
    description: 'Component with prop that is a function for rendering'
  },
  {
    id: 'compound-component',
    name: 'Compound Component',
    category: 'react',
    matcher: /(\w+)\.(\w+)\s*=\s*(?:function|\()/,
    benefits: [
      'Flexible composition',
      'Shared state',
      'Clear API'
    ],
    description: 'Group of components that work together'
  },
  {
    id: 'controlled-component',
    name: 'Controlled Component',
    category: 'react',
    matcher: /value\s*=\s*\{[^}]+\}\s*onChange\s*=\s*\{/,
    benefits: [
      'Single source of truth',
      'Predictable state',
      'Easy validation'
    ],
    description: 'Form element controlled by React state'
  }
];

/**
 * Match patterns in a file
 */
export function matchPatterns(filePath: string): PatternMatchResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const matches: PatternMatch[] = [];

  // Run each pattern matcher
  for (const pattern of CODE_PATTERNS_LIBRARY) {
    if (typeof pattern.matcher === 'function') {
      // Function-based matching (for complex patterns)
      const functionMatches = pattern.matcher(content);
      matches.push(...functionMatches);
    } else {
      // Regex-based matching
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(pattern.matcher);

        if (match) {
          matches.push({
            patternId: pattern.id,
            patternName: pattern.name,
            line: i + 1,
            category: pattern.category,
            confidence: 90, // High confidence for regex matches
            context: line.trim(),
            benefits: pattern.benefits
          });
        }
      }
    }
  }

  // Generate suggestions based on code analysis
  const suggestions = generateSuggestions(content, lines, matches);

  return {
    file: filePath,
    matches,
    totalMatches: matches.length,
    suggestions
  };
}

/**
 * Generate pattern suggestions for code improvement
 */
function generateSuggestions(
  content: string,
  lines: string[],
  existingMatches: PatternMatch[]
): PatternSuggestion[] {
  const suggestions: PatternSuggestion[] = [];

  // Suggest factory pattern for complex object creation
  if (/new\s+\w+\([^)]{30,}\)/.test(content)) {
    suggestions.push({
      location: 'Complex constructors',
      line: 0,
      suggestion: 'Consider using Factory Pattern',
      patternId: 'factory',
      reasoning: 'Complex object creation detected - factory pattern can simplify',
      example: 'createPet({ type, rarity, element }) instead of new Pet(...)'
    });
  }

  // Suggest observer pattern for event handling
  const eventListeners = content.match(/addEventListener|on\w+\s*=/g);
  if (eventListeners && eventListeners.length > 3) {
    suggestions.push({
      location: 'Multiple event listeners',
      line: 0,
      suggestion: 'Consider using Observer/PubSub Pattern',
      patternId: 'observer',
      reasoning: 'Multiple event handlers detected - centralized event bus can help',
      example: 'eventBus.subscribe("petFused", handler)'
    });
  }

  // Suggest strategy pattern for complex conditionals
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Multiple if-else or switch cases
    if (/if\s*\([^)]*type\s*===/.test(line)) {
      let typeChecks = 1;
      for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
        if (/else\s+if\s*\([^)]*type\s*===/.test(lines[j])) {
          typeChecks++;
        }
      }

      if (typeChecks >= 3) {
        suggestions.push({
          location: `Line ${i + 1}`,
          line: i + 1,
          suggestion: 'Consider using Strategy Pattern',
          patternId: 'strategy',
          reasoning: `${typeChecks} type-based conditionals - strategy pattern eliminates them`,
          example: 'const strategy = strategies[type]; strategy.execute()'
        });
      }
    }
  }

  // Suggest builder pattern for objects with many optional parameters
  const functionParams = content.match(/function\s+\w+\s*\(([^)]{50,})\)/);
  if (functionParams) {
    suggestions.push({
      location: 'Function with many parameters',
      line: 0,
      suggestion: 'Consider using Builder Pattern',
      patternId: 'builder',
      reasoning: 'Long parameter list - builder provides fluent interface',
      example: 'new PetBuilder().withType("fire").withRarity(5).build()'
    });
  }

  // Suggest custom hook for repeated React logic
  if (content.includes('useState') && content.includes('useEffect')) {
    const useStateCount = (content.match(/useState/g) || []).length;
    const useEffectCount = (content.match(/useEffect/g) || []).length;

    if (useStateCount >= 3 && useEffectCount >= 2) {
      suggestions.push({
        location: 'Component with complex state logic',
        line: 0,
        suggestion: 'Consider extracting Custom Hook',
        patternId: 'custom-hook',
        reasoning: 'Complex state management - custom hook improves reusability',
        example: 'const { pets, loading, error } = usePets()'
      });
    }
  }

  // Suggest repository pattern for data access
  if (/fetch\(|axios\.|http\./g.test(content) && !/Repository/.test(content)) {
    const apiCalls = (content.match(/fetch\(|axios\.|http\./g) || []).length;

    if (apiCalls >= 2) {
      suggestions.push({
        location: 'Multiple API calls',
        line: 0,
        suggestion: 'Consider using Repository Pattern',
        patternId: 'repository',
        reasoning: 'Multiple data access points - repository centralizes access',
        example: 'petRepository.getAll(), petRepository.getById(id)'
      });
    }
  }

  return suggestions;
}

/**
 * Match patterns in a directory
 */
export function matchPatternsInDirectory(
  dirPath: string,
  recursive: boolean = true
): PatternMatchResult[] {
  const results: PatternMatchResult[] = [];

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
            results.push(matchPatterns(fullPath));
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
export function generateSummary(results: PatternMatchResult[]): {
  totalFiles: number;
  totalMatches: number;
  totalSuggestions: number;
  patternsByCategory: Record<PatternCategory, number>;
  topPatterns: Array<{ pattern: string; count: number }>;
  filesWithPatterns: number;
} {
  const patternsByCategory: Record<PatternCategory, number> = {
    creational: 0,
    structural: 0,
    behavioral: 0,
    architectural: 0,
    functional: 0,
    react: 0
  };

  const patternCounts = new Map<string, number>();

  for (const result of results) {
    for (const match of result.matches) {
      patternsByCategory[match.category]++;
      patternCounts.set(match.patternName, (patternCounts.get(match.patternName) || 0) + 1);
    }
  }

  const topPatterns = Array.from(patternCounts.entries())
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalFiles: results.length,
    totalMatches: results.reduce((sum, r) => sum + r.totalMatches, 0),
    totalSuggestions: results.reduce((sum, r) => sum + r.suggestions.length, 0),
    patternsByCategory,
    topPatterns,
    filesWithPatterns: results.filter(r => r.totalMatches > 0).length
  };
}

/**
 * Get pattern details by ID
 */
export function getPattern(id: string): CodePattern | undefined {
  return CODE_PATTERNS_LIBRARY.find(p => p.id === id);
}

/**
 * List all patterns
 */
export function listPatterns(): CodePattern[] {
  return [...CODE_PATTERNS_LIBRARY];
}

/**
 * Filter matches by category
 */
export function filterByCategory(
  result: PatternMatchResult,
  category: PatternCategory
): PatternMatch[] {
  return result.matches.filter(m => m.category === category);
}

/**
 * Format pattern report
 */
export function formatReport(result: PatternMatchResult): string {
  const lines: string[] = [];

  lines.push(`Pattern Analysis Report: ${result.file}`);
  lines.push('='.repeat(80));
  lines.push('');

  if (result.totalMatches === 0 && result.suggestions.length === 0) {
    lines.push('No patterns detected');
    return lines.join('\n');
  }

  lines.push(`Patterns Found: ${result.totalMatches}`);
  lines.push(`Suggestions: ${result.suggestions.length}`);
  lines.push('');

  // Group by category
  const categories: PatternCategory[] = ['creational', 'structural', 'behavioral', 'architectural', 'functional', 'react'];

  for (const category of categories) {
    const categoryMatches = filterByCategory(result, category);

    if (categoryMatches.length > 0) {
      lines.push(`${category.toUpperCase()} PATTERNS (${categoryMatches.length}):`);
      lines.push('');

      for (const match of categoryMatches) {
        lines.push(`  ✅ ${match.patternName} (Line ${match.line})`);
        lines.push(`     Confidence: ${match.confidence}%`);
        lines.push(`     Benefits: ${match.benefits.join(', ')}`);
        if (match.context) {
          lines.push(`     Context: ${match.context}`);
        }
        lines.push('');
      }
    }
  }

  if (result.suggestions.length > 0) {
    lines.push('💡 PATTERN SUGGESTIONS:');
    lines.push('');

    for (const suggestion of result.suggestions) {
      lines.push(`  ${suggestion.suggestion}`);
      lines.push(`     Location: ${suggestion.location}`);
      lines.push(`     Reasoning: ${suggestion.reasoning}`);
      if (suggestion.example) {
        lines.push(`     Example: ${suggestion.example}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}
