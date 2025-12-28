/**
 * Evolution Planner - Analyze system growth and plan scaling
 *
 * Purpose: Predict growth and plan scaling strategies
 * Authority: Tier 2 (Mandatory for sustainable evolution)
 * Use: Architecture planning, scaling decisions
 */

import * as fs from 'fs';
import * as path from 'path';

export interface GrowthAnalysis {
  projectPath: string;
  currentMetrics: ProjectMetrics;
  growthTrend: 'stable' | 'growing' | 'rapid';
  projectedMetrics: ProjectMetrics;
  scalingNeeds: ScalingNeed[];
  recommendations: string[];
  evolutionScore: number; // 0-100
}

export interface ProjectMetrics {
  totalFiles: number;
  totalLines: number;
  totalFunctions: number;
  totalClasses: number;
  averageFileSize: number;
  averageComplexity: number;
  dependencies: number;
}

export interface ScalingNeed {
  area: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  strategy: string;
  estimatedEffort: 'low' | 'medium' | 'high';
}

/**
 * Analyze project growth trajectory
 */
export function analyzeGrowth(
  projectPath: string,
  historicalData?: ProjectMetrics[]
): GrowthAnalysis {
  // Measure current state
  const currentMetrics = measureProject(projectPath);

  // Determine growth trend
  const growthTrend = determineGrowthTrend(currentMetrics, historicalData);

  // Project future metrics
  const projectedMetrics = projectFutureMetrics(currentMetrics, growthTrend);

  // Identify scaling needs
  const scalingNeeds = identifyScalingNeeds(currentMetrics, projectedMetrics);

  // Generate recommendations
  const recommendations = generateEvolutionRecommendations(currentMetrics, scalingNeeds);

  // Calculate evolution score
  const evolutionScore = calculateEvolutionScore(currentMetrics, scalingNeeds);

  return {
    projectPath,
    currentMetrics,
    growthTrend,
    projectedMetrics,
    scalingNeeds,
    recommendations,
    evolutionScore
  };
}

/**
 * Measure current project metrics
 */
function measureProject(projectPath: string): ProjectMetrics {
  const files: string[] = [];
  let totalLines = 0;
  let totalFunctions = 0;
  let totalClasses = 0;
  const dependencies = new Set<string>();

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
          files.push(fullPath);

          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');

          totalLines += lines.length;

          // Count functions
          const functionMatches = content.match(/function\s+\w+\s*\(/g) || [];
          const arrowFunctions = content.match(/=>\s*\{/g) || [];
          totalFunctions += functionMatches.length + arrowFunctions.length;

          // Count classes
          const classMatches = content.match(/class\s+\w+/g) || [];
          totalClasses += classMatches.length;

          // Count dependencies
          const importMatches = content.match(/import\s+.*\s+from\s+['"](.*)['"]/g) || [];
          for (const imp of importMatches) {
            const match = imp.match(/from\s+['"](.*)['"]/);
            if (match && !match[1].startsWith('.')) {
              dependencies.add(match[1]);
            }
          }
        }
      }
    }
  }

  scan(projectPath);

  const averageFileSize = files.length > 0 ? totalLines / files.length : 0;
  const averageComplexity = totalFunctions > 0 ? totalLines / totalFunctions : 0;

  return {
    totalFiles: files.length,
    totalLines,
    totalFunctions,
    totalClasses,
    averageFileSize,
    averageComplexity,
    dependencies: dependencies.size
  };
}

/**
 * Determine growth trend
 */
function determineGrowthTrend(
  current: ProjectMetrics,
  historical?: ProjectMetrics[]
): 'stable' | 'growing' | 'rapid' {
  // Without historical data, infer from current size
  if (!historical || historical.length === 0) {
    if (current.totalFiles > 100) {
      return 'rapid';
    } else if (current.totalFiles > 50) {
      return 'growing';
    } else {
      return 'stable';
    }
  }

  // Calculate growth rate from historical data
  const oldest = historical[0];
  const fileGrowth = (current.totalFiles - oldest.totalFiles) / oldest.totalFiles;

  if (fileGrowth > 0.5) {
    return 'rapid'; // >50% growth
  } else if (fileGrowth > 0.2) {
    return 'growing'; // >20% growth
  } else {
    return 'stable';
  }
}

/**
 * Project future metrics based on trend
 */
function projectFutureMetrics(
  current: ProjectMetrics,
  trend: 'stable' | 'growing' | 'rapid'
): ProjectMetrics {
  const multipliers = {
    stable: 1.1,   // 10% growth
    growing: 1.5,  // 50% growth
    rapid: 2.0     // 100% growth
  };

  const multiplier = multipliers[trend];

  return {
    totalFiles: Math.round(current.totalFiles * multiplier),
    totalLines: Math.round(current.totalLines * multiplier),
    totalFunctions: Math.round(current.totalFunctions * multiplier),
    totalClasses: Math.round(current.totalClasses * multiplier),
    averageFileSize: current.averageFileSize, // Stays similar
    averageComplexity: current.averageComplexity * 1.1, // Slight increase
    dependencies: Math.round(current.dependencies * multiplier)
  };
}

/**
 * Identify scaling needs
 */
function identifyScalingNeeds(
  current: ProjectMetrics,
  projected: ProjectMetrics
): ScalingNeed[] {
  const needs: ScalingNeed[] = [];

  // File count scaling
  if (projected.totalFiles > 200) {
    needs.push({
      area: 'File Organization',
      priority: 'high',
      description: 'Project will exceed 200 files - reorganization needed',
      strategy: 'Implement feature-based folder structure with domain boundaries',
      estimatedEffort: 'medium'
    });
  }

  // Complexity scaling
  if (projected.averageComplexity > 50) {
    needs.push({
      area: 'Code Complexity',
      priority: 'high',
      description: 'Average complexity will exceed maintainability threshold',
      strategy: 'Introduce layered architecture and enforce complexity gates',
      estimatedEffort: 'high'
    });
  }

  // Dependency scaling
  if (projected.dependencies > 50) {
    needs.push({
      area: 'Dependency Management',
      priority: 'medium',
      description: 'Dependency count will exceed manageability',
      strategy: 'Audit dependencies, consider monorepo or micro-frontend architecture',
      estimatedEffort: 'medium'
    });
  }

  // Class count scaling
  if (projected.totalClasses > 100) {
    needs.push({
      area: 'Architecture',
      priority: 'medium',
      description: 'Class count suggests need for architectural patterns',
      strategy: 'Implement DDD patterns, aggregate roots, and clear bounded contexts',
      estimatedEffort: 'high'
    });
  }

  // File size scaling
  if (current.averageFileSize > 300) {
    needs.push({
      area: 'File Size',
      priority: 'medium',
      description: 'Average file size indicates need for decomposition',
      strategy: 'Split large files into focused modules, extract shared utilities',
      estimatedEffort: 'low'
    });
  }

  // Function count scaling
  if (projected.totalFunctions > 500) {
    needs.push({
      area: 'Code Organization',
      priority: 'low',
      description: 'Large function count suggests need for service layer',
      strategy: 'Introduce service layer pattern to organize business logic',
      estimatedEffort: 'medium'
    });
  }

  // Sort by priority
  needs.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return needs;
}

/**
 * Generate evolution recommendations
 */
function generateEvolutionRecommendations(
  metrics: ProjectMetrics,
  needs: ScalingNeed[]
): string[] {
  const recommendations: string[] = [];

  // General architecture recommendations
  if (metrics.totalFiles > 50 && metrics.totalClasses < 10) {
    recommendations.push('Consider OOP refactoring - low class count for project size');
  }

  if (metrics.averageFileSize > 400) {
    recommendations.push('Large average file size - enforce 500-line file limit');
  }

  if (metrics.totalFunctions / metrics.totalFiles > 20) {
    recommendations.push('High function density - consider splitting modules');
  }

  // Add scaling-specific recommendations
  for (const need of needs) {
    if (need.priority === 'high') {
      recommendations.push(`URGENT: ${need.description}`);
    }
  }

  // Suggest specific patterns
  if (metrics.totalClasses > 30) {
    recommendations.push('Consider Repository pattern for data access');
    recommendations.push('Consider Service layer for business logic');
  }

  if (metrics.dependencies > 20) {
    recommendations.push('Review dependency tree for circular dependencies');
    recommendations.push('Consider dependency injection for better testability');
  }

  return recommendations;
}

/**
 * Calculate evolution score
 */
function calculateEvolutionScore(
  metrics: ProjectMetrics,
  needs: ScalingNeed[]
): number {
  let score = 100;

  // Penalize based on scaling needs
  const highPriorityNeeds = needs.filter(n => n.priority === 'high').length;
  const mediumPriorityNeeds = needs.filter(n => n.priority === 'medium').length;

  score -= highPriorityNeeds * 15;
  score -= mediumPriorityNeeds * 5;

  // Penalize based on metrics
  if (metrics.averageFileSize > 500) score -= 10;
  if (metrics.averageFileSize > 700) score -= 10;

  if (metrics.averageComplexity > 40) score -= 10;
  if (metrics.averageComplexity > 60) score -= 15;

  if (metrics.dependencies > 40) score -= 5;
  if (metrics.dependencies > 60) score -= 10;

  // Bonus for good structure
  const classToFileRatio = metrics.totalClasses / metrics.totalFiles;
  if (classToFileRatio >= 0.3 && classToFileRatio <= 1.5) {
    score += 10; // Good OOP structure
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Format analysis report
 */
export function formatReport(analysis: GrowthAnalysis): string {
  const lines: string[] = [];

  lines.push('Evolution & Growth Analysis');
  lines.push('='.repeat(80));
  lines.push('');

  lines.push('CURRENT STATE:');
  lines.push(`  Files: ${analysis.currentMetrics.totalFiles}`);
  lines.push(`  Lines: ${analysis.currentMetrics.totalLines}`);
  lines.push(`  Functions: ${analysis.currentMetrics.totalFunctions}`);
  lines.push(`  Classes: ${analysis.currentMetrics.totalClasses}`);
  lines.push(`  Dependencies: ${analysis.currentMetrics.dependencies}`);
  lines.push(`  Avg File Size: ${Math.round(analysis.currentMetrics.averageFileSize)} lines`);
  lines.push(`  Avg Complexity: ${Math.round(analysis.currentMetrics.averageComplexity)}`);
  lines.push('');

  lines.push(`GROWTH TREND: ${analysis.growthTrend.toUpperCase()}`);
  lines.push('');

  lines.push('PROJECTED STATE:');
  lines.push(`  Files: ${analysis.projectedMetrics.totalFiles} (${Math.round((analysis.projectedMetrics.totalFiles / analysis.currentMetrics.totalFiles - 1) * 100)}% growth)`);
  lines.push(`  Lines: ${analysis.projectedMetrics.totalLines}`);
  lines.push(`  Functions: ${analysis.projectedMetrics.totalFunctions}`);
  lines.push(`  Classes: ${analysis.projectedMetrics.totalClasses}`);
  lines.push('');

  lines.push(`Evolution Score: ${analysis.evolutionScore}/100`);
  const health = analysis.evolutionScore >= 80 ? '🟢 Healthy' : analysis.evolutionScore >= 60 ? '🟡 Needs Attention' : '🔴 Critical';
  lines.push(`Status: ${health}`);
  lines.push('');

  if (analysis.scalingNeeds.length > 0) {
    lines.push('SCALING NEEDS:');
    lines.push('');

    for (const need of analysis.scalingNeeds) {
      const priorityEmoji = need.priority === 'high' ? '🔴' : need.priority === 'medium' ? '🟡' : '🟢';
      lines.push(`  ${priorityEmoji} ${need.area} [${need.priority.toUpperCase()}]`);
      lines.push(`     ${need.description}`);
      lines.push(`     Strategy: ${need.strategy}`);
      lines.push(`     Effort: ${need.estimatedEffort}`);
      lines.push('');
    }
  }

  if (analysis.recommendations.length > 0) {
    lines.push('RECOMMENDATIONS:');
    lines.push('');

    for (const rec of analysis.recommendations) {
      lines.push(`  💡 ${rec}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
