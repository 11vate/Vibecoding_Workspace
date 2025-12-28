/**
 * Feature Creep Detector - Detect scope creep against blueprint
 *
 * Purpose: Identify features that deviate from original blueprint
 * Authority: Tier 2 (Mandatory for scope management)
 * Use: Blueprint validation, scope enforcement
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FeatureCreepAnalysis {
  projectPath: string;
  blueprintFeatures: Feature[];
  implementedFeatures: Feature[];
  creepFeatures: Feature[]; // Features not in blueprint
  missingFeatures: Feature[]; // Blueprint features not implemented
  scopeViolations: number;
  passed: boolean;
  recommendations: string[];
}

export interface Feature {
  name: string;
  category: FeatureCategory;
  complexity: 'low' | 'medium' | 'high';
  source: 'blueprint' | 'implementation' | 'both';
  location?: string;
  description?: string;
}

export type FeatureCategory =
  | 'core-mechanic'
  | 'ui'
  | 'progression'
  | 'content'
  | 'system'
  | 'polish';

/**
 * Analyze feature creep by comparing blueprint to implementation
 */
export function detectFeatureCreep(
  blueprintPath: string,
  projectPath: string
): FeatureCreepAnalysis {
  // Extract features from blueprint
  const blueprintFeatures = extractBlueprintFeatures(blueprintPath);

  // Extract features from implementation
  const implementedFeatures = extractImplementedFeatures(projectPath);

  // Find creep (implemented but not in blueprint)
  const creepFeatures: Feature[] = [];
  for (const impl of implementedFeatures) {
    const inBlueprint = blueprintFeatures.some(bp =>
      isSameFeature(bp.name, impl.name)
    );

    if (!inBlueprint) {
      creepFeatures.push({ ...impl, source: 'implementation' });
    }
  }

  // Find missing (in blueprint but not implemented)
  const missingFeatures: Feature[] = [];
  for (const bp of blueprintFeatures) {
    const implemented = implementedFeatures.some(impl =>
      isSameFeature(bp.name, impl.name)
    );

    if (!implemented) {
      missingFeatures.push({ ...bp, source: 'blueprint' });
    }
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (creepFeatures.length > 0) {
    recommendations.push(`Remove ${creepFeatures.length} feature(s) not in blueprint or update blueprint`);
  }

  if (missingFeatures.length > 0) {
    const coreMissing = missingFeatures.filter(f => f.category === 'core-mechanic');
    if (coreMissing.length > 0) {
      recommendations.push(`Implement ${coreMissing.length} missing core mechanic(s)`);
    }
  }

  // Check for over-engineering
  const polishFeatures = creepFeatures.filter(f => f.category === 'polish');
  if (polishFeatures.length > 3) {
    recommendations.push('Excessive polish features before core complete - focus on blueprint');
  }

  return {
    projectPath,
    blueprintFeatures,
    implementedFeatures,
    creepFeatures,
    missingFeatures,
    scopeViolations: creepFeatures.length,
    passed: creepFeatures.length === 0,
    recommendations
  };
}

/**
 * Extract features from blueprint markdown
 */
function extractBlueprintFeatures(blueprintPath: string): Feature[] {
  const content = fs.readFileSync(blueprintPath, 'utf-8');
  const lines = content.split('\n');

  const features: Feature[] = [];

  // Find Features section
  let inFeaturesSection = false;
  let currentCategory: FeatureCategory = 'core-mechanic';

  for (const line of lines) {
    // Feature section headers
    if (/^##\s+Features/i.test(line)) {
      inFeaturesSection = true;
      continue;
    }

    if (inFeaturesSection && /^##\s+/.test(line)) {
      break; // End of features section
    }

    if (!inFeaturesSection) {
      continue;
    }

    // Category headers
    if (/^###\s+Core\s+Mechanic/i.test(line)) {
      currentCategory = 'core-mechanic';
    } else if (/^###\s+UI/i.test(line)) {
      currentCategory = 'ui';
    } else if (/^###\s+Progression/i.test(line)) {
      currentCategory = 'progression';
    } else if (/^###\s+Content/i.test(line)) {
      currentCategory = 'content';
    } else if (/^###\s+System/i.test(line)) {
      currentCategory = 'system';
    } else if (/^###\s+Polish/i.test(line)) {
      currentCategory = 'polish';
    }

    // Feature list items
    const featureMatch = line.match(/^[-*]\s+(.+?)(?:\s*\(([^)]+)\))?$/);
    if (featureMatch) {
      const name = featureMatch[1].trim();
      const complexityStr = featureMatch[2]?.toLowerCase();

      let complexity: 'low' | 'medium' | 'high' = 'medium';
      if (complexityStr?.includes('low')) {
        complexity = 'low';
      } else if (complexityStr?.includes('high')) {
        complexity = 'high';
      }

      features.push({
        name,
        category: currentCategory,
        complexity,
        source: 'blueprint'
      });
    }
  }

  return features;
}

/**
 * Extract features from implementation
 */
function extractImplementedFeatures(projectPath: string): Feature[] {
  const features: Feature[] = [];

  // Scan common feature indicators
  scanDirectory(projectPath, features);

  return features;
}

/**
 * Recursively scan directory for features
 */
function scanDirectory(dir: string, features: Feature[]): void {
  if (!fs.existsSync(dir)) {
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }

      // Directory names can indicate features
      if (['systems', 'features', 'mechanics', 'components'].includes(entry.name)) {
        scanDirectory(fullPath, features);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        extractFeaturesFromFile(fullPath, features);
      }
    }
  }
}

/**
 * Extract features from code file
 */
function extractFeaturesFromFile(filePath: string, features: Feature[]): void {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Look for class/function names that indicate features
  const patterns = [
    // Classes
    /class\s+(\w+)(?:System|Manager|Controller|Service)\s*\{/g,
    // Functions
    /function\s+(handle\w+|process\w+|manage\w+)\s*\(/g,
    // React components
    /(?:function|const)\s+([A-Z]\w+)(?:Component|View|Screen|Modal)\s*[=:]/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const name = match[1];

      // Deduplicate
      if (!features.some(f => f.name === name)) {
        features.push({
          name,
          category: determineCategory(name, filePath),
          complexity: 'medium',
          source: 'implementation',
          location: filePath
        });
      }
    }
  }
}

/**
 * Determine feature category from name and path
 */
function determineCategory(name: string, filePath: string): FeatureCategory {
  const lowerName = name.toLowerCase();
  const lowerPath = filePath.toLowerCase();

  if (lowerPath.includes('ui') || lowerPath.includes('component') || lowerName.includes('button') || lowerName.includes('panel')) {
    return 'ui';
  }

  if (lowerName.includes('fusion') || lowerName.includes('battle') || lowerName.includes('craft')) {
    return 'core-mechanic';
  }

  if (lowerName.includes('level') || lowerName.includes('xp') || lowerName.includes('unlock')) {
    return 'progression';
  }

  if (lowerName.includes('content') || lowerName.includes('data') || lowerName.includes('asset')) {
    return 'content';
  }

  if (lowerName.includes('analytics') || lowerName.includes('tutorial') || lowerName.includes('hint')) {
    return 'polish';
  }

  return 'system';
}

/**
 * Check if two feature names refer to the same feature
 */
function isSameFeature(name1: string, name2: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  const n1 = normalize(name1);
  const n2 = normalize(name2);

  // Exact match
  if (n1 === n2) {
    return true;
  }

  // Partial match (one contains the other)
  if (n1.includes(n2) || n2.includes(n1)) {
    return true;
  }

  // Synonym matching
  const synonyms: Record<string, string[]> = {
    'fusion': ['fuse', 'combine', 'merge'],
    'battle': ['combat', 'fight'],
    'inventory': ['bag', 'storage'],
    'shop': ['store', 'market'],
  };

  for (const [key, syns] of Object.entries(synonyms)) {
    if ((n1.includes(key) || syns.some(s => n1.includes(s))) &&
        (n2.includes(key) || syns.some(s => n2.includes(s)))) {
      return true;
    }
  }

  return false;
}

/**
 * Suggest features to remove
 */
export function suggestRemovals(analysis: FeatureCreepAnalysis): Feature[] {
  const suggestions: Feature[] = [];

  // Prioritize removal of polish features if core is incomplete
  if (analysis.missingFeatures.some(f => f.category === 'core-mechanic')) {
    const polishCreep = analysis.creepFeatures.filter(f => f.category === 'polish');
    suggestions.push(...polishCreep);
  }

  // Suggest removing high-complexity creep first
  const highComplexityCreep = analysis.creepFeatures.filter(f => f.complexity === 'high');
  suggestions.push(...highComplexityCreep);

  return suggestions;
}

/**
 * Format analysis report
 */
export function formatReport(analysis: FeatureCreepAnalysis): string {
  const lines: string[] = [];

  lines.push('Feature Creep Analysis');
  lines.push('='.repeat(80));
  lines.push('');

  lines.push(`Blueprint Features: ${analysis.blueprintFeatures.length}`);
  lines.push(`Implemented Features: ${analysis.implementedFeatures.length}`);
  lines.push(`Scope Violations (Creep): ${analysis.scopeViolations}`);
  lines.push(`Missing Features: ${analysis.missingFeatures.length}`);
  lines.push('');
  lines.push(`Status: ${analysis.passed ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push('');

  if (analysis.creepFeatures.length > 0) {
    lines.push('🚨 FEATURE CREEP DETECTED:');
    lines.push('');
    for (const feature of analysis.creepFeatures) {
      lines.push(`  - ${feature.name} (${feature.category}, ${feature.complexity} complexity)`);
      if (feature.location) {
        lines.push(`    Location: ${feature.location}`);
      }
    }
    lines.push('');
  }

  if (analysis.missingFeatures.length > 0) {
    lines.push('📋 MISSING FEATURES FROM BLUEPRINT:');
    lines.push('');
    for (const feature of analysis.missingFeatures) {
      const priority = feature.category === 'core-mechanic' ? '🔴 HIGH PRIORITY' : '⚪ Normal';
      lines.push(`  - ${feature.name} (${feature.category}) ${priority}`);
    }
    lines.push('');
  }

  if (analysis.recommendations.length > 0) {
    lines.push('💡 RECOMMENDATIONS:');
    lines.push('');
    for (const rec of analysis.recommendations) {
      lines.push(`  - ${rec}`);
    }
    lines.push('');
  }

  // Feature breakdown by category
  const creepByCategory: Record<FeatureCategory, number> = {
    'core-mechanic': 0,
    'ui': 0,
    'progression': 0,
    'content': 0,
    'system': 0,
    'polish': 0
  };

  for (const feature of analysis.creepFeatures) {
    creepByCategory[feature.category]++;
  }

  lines.push('Creep Breakdown by Category:');
  for (const [category, count] of Object.entries(creepByCategory)) {
    if (count > 0) {
      lines.push(`  ${category}: ${count}`);
    }
  }

  return lines.join('\n');
}
