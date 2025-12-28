/**
 * Knowledge Atomizer - Main Orchestration
 *
 * Breaks monolithic patterns into atomic knowledge units
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Pattern,
  Concept,
  Atom,
  AtomizerConfig,
  AtomizationResult,
  AtomRegistry
} from './types';
import { getNextRootId, branchId, decideBranch } from './folgezettel';
import { extractConcepts } from './extraction-rules';
import { generateAtom } from './atom-templates';

/**
 * Default configuration
 */
const DEFAULT_CONFIG: AtomizerConfig = {
  granularity: 'medium',
  minWordsPerAtom: 30,
  maxWordsPerAtom: 300,
  autoLink: true,
  autoLinkThreshold: 0.7,
  branchingStrategy: 'semantic',
  outputDirectory: '../../knowledge-base/atoms',
  registryPath: '../../knowledge-base/atoms/atom-registry.json',
  preserveOriginals: true,
  dryRun: false
};

/**
 * Main atomization function
 *
 * @param sourcePath - Path to source document
 * @param patternName - Specific pattern to atomize (optional, atomizes all if not provided)
 * @param config - Atomizer configuration
 * @returns Atomization result
 */
export async function atomizeDocument(
  sourcePath: string,
  patternName?: string,
  config: Partial<AtomizerConfig> = {}
): Promise<AtomizationResult> {
  const fullConfig: AtomizerConfig = { ...DEFAULT_CONFIG, ...config };

  console.log(`\n🔬 Atomizing: ${sourcePath}`);
  if (patternName) {
    console.log(`   Pattern: ${patternName}`);
  } else {
    console.log(`   Mode: All patterns`);
  }
  console.log(`   Granularity: ${fullConfig.granularity}`);
  console.log(`   Dry run: ${fullConfig.dryRun ? 'Yes' : 'No'}\n`);

  const result: AtomizationResult = {
    sourceFile: sourcePath,
    patternName: patternName || 'all',
    atomsCreated: 0,
    atoms: [],
    linksCreated: 0,
    errors: [],
    warnings: []
  };

  try {
    // Step 1: Parse source document
    const patterns = await parseSourceDocument(sourcePath);
    console.log(`✓ Parsed ${patterns.length} patterns\n`);

    // Filter to specific pattern if requested
    const patternsToAtomize = patternName
      ? patterns.filter(p => p.name === patternName)
      : patterns;

    if (patternsToAtomize.length === 0) {
      result.errors.push(`Pattern "${patternName}" not found in ${sourcePath}`);
      return result;
    }

    // Step 2: Atomize each pattern
    for (const pattern of patternsToAtomize) {
      console.log(`\n📦 Atomizing pattern: ${pattern.name}`);

      const atoms = await atomizePattern(pattern, fullConfig);
      result.atoms.push(...atoms);
      result.atomsCreated += atoms.length;

      console.log(`   Created ${atoms.length} atoms`);
    }

    // Step 3: Link atoms
    if (fullConfig.autoLink) {
      console.log(`\n🔗 Auto-linking atoms...`);
      const links = linkAtoms(result.atoms, fullConfig.autoLinkThreshold);
      result.linksCreated = links;
      console.log(`   Created ${links} bidirectional links`);
    }

    // Step 4: Write atoms to files (unless dry run)
    if (!fullConfig.dryRun) {
      console.log(`\n💾 Writing atoms to disk...`);
      await writeAtoms(result.atoms, fullConfig.outputDirectory);
      console.log(`   Wrote ${result.atoms.length} files`);

      // Step 5: Update registry
      console.log(`\n📋 Updating atom registry...`);
      await updateRegistry(result.atoms, fullConfig.registryPath);
      console.log(`   Registry updated`);
    } else {
      console.log(`\n⚠️  Dry run mode - no files written`);
    }

    // Print summary
    printSummary(result);

    return result;

  } catch (error) {
    result.errors.push(`Atomization failed: ${error.message}`);
    console.error(`\n❌ Error: ${error.message}`);
    return result;
  }
}

/**
 * Parse source markdown document into patterns
 */
async function parseSourceDocument(sourcePath: string): Promise<Pattern[]> {
  const content = fs.readFileSync(sourcePath, 'utf-8');
  const patterns: Pattern[] = [];

  // Split by pattern headers (## Pattern Name or # Pattern Name)
  const patternRegex = /^##?\s+(.+?)$/gm;
  const matches = [...content.matchAll(patternRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const name = match[1].trim();
    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : content.length;
    const rawText = content.slice(startIndex, endIndex).trim();

    // Extract metadata from first paragraph or YAML frontmatter
    const { category, tags } = extractMetadata(rawText);

    // Parse sections
    const sections = parseSections(rawText);

    patterns.push({
      name,
      category: category || 'mechanics',
      tags: tags || [],
      sections,
      rawText,
      sourceFile: sourcePath
    });
  }

  return patterns;
}

/**
 * Extract metadata from pattern text
 */
function extractMetadata(text: string): { category?: string; tags?: string[] } {
  // Simple heuristic: look for category/tags in first paragraph
  const firstPara = text.split('\n\n')[0];

  const categoryMatch = firstPara.match(/category:\s*(\w+)/i);
  const tagsMatch = firstPara.match(/tags?:\s*([^\n]+)/i);

  return {
    category: categoryMatch ? categoryMatch[1] : undefined,
    tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : undefined
  };
}

/**
 * Parse sections from pattern text
 */
function parseSections(text: string): any[] {
  const sections: any[] = [];
  const sectionRegex = /^(#{2,6})\s+(.+?)$/gm;
  const matches = [...text.matchAll(sectionRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const level = match[1].length;
    const title = match[2].trim();
    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : text.length;
    const content = text.slice(startIndex, endIndex).trim();

    sections.push({ title, level, content });
  }

  return sections;
}

/**
 * Atomize a single pattern
 */
async function atomizePattern(
  pattern: Pattern,
  config: AtomizerConfig
): Promise<Atom[]> {
  // Step 1: Extract concepts
  const concepts = extractConcepts(pattern, config);
  console.log(`   Extracted ${concepts.length} concepts`);

  // Step 2: Assign Folgezettel IDs
  const conceptsWithIds = assignFolgezettIds(concepts, config);
  console.log(`   Assigned Folgezettel IDs`);

  // Step 3: Convert concepts to atoms
  const atoms = conceptsWithIds.map(concept => conceptToAtom(concept, config));

  return atoms;
}

/**
 * Assign Folgezettel IDs to concepts
 */
function assignFolgezettIds(concepts: Concept[], config: AtomizerConfig): Concept[] {
  if (concepts.length === 0) return [];

  // Root concept gets first ID
  const rootId = getNextRootId();
  concepts[0].id = rootId;

  // Assign IDs to remaining concepts based on relationships
  for (let i = 1; i < concepts.length; i++) {
    const concept = concepts[i];

    // Find parent concept (first related concept with existing ID)
    const parentConcept = concepts
      .slice(0, i)
      .find(c => concept.relatedConcepts.some(r => r.targetId === c.tempId));

    if (parentConcept) {
      // Branch from parent
      const decision = decideBranch(parentConcept, concept);
      concept.id = decision.finalId;
    } else {
      // No parent, create new root
      concept.id = getNextRootId();
    }
  }

  return concepts;
}

/**
 * Convert concept to atom
 */
function conceptToAtom(concept: Concept, config: AtomizerConfig): Atom {
  const now = new Date().toISOString().split('T')[0];

  const atom: Atom = {
    id: concept.id,
    title: concept.title,
    category: concept.category as any,
    tags: concept.tags,
    created: now,
    lastModified: now,
    coreIdea: concept.coreIdea,
    context: concept.context,
    evidence: concept.evidence,
    implications: concept.implications,
    relatedAtoms: concept.relatedConcepts.map(rc => ({
      targetId: rc.targetId,
      type: rc.type,
      description: rc.context
    })),
    references: [
      {
        type: 'pattern',
        name: concept.sourcePattern,
        path: concept.sourceFile
      }
    ],
    filePath: path.join(
      config.outputDirectory,
      concept.category,
      `${concept.id}.md`
    )
  };

  // Generate full markdown content
  atom.content = generateAtom(atom);

  return atom;
}

/**
 * Auto-link atoms based on semantic similarity
 */
function linkAtoms(atoms: Atom[], threshold: number): number {
  let linksCreated = 0;

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const atom1 = atoms[i];
      const atom2 = atoms[j];

      // Simple similarity: shared tags
      const sharedTags = atom1.tags.filter(t => atom2.tags.includes(t));
      const similarity = sharedTags.length / Math.max(atom1.tags.length, atom2.tags.length);

      if (similarity >= threshold) {
        // Create bidirectional link
        if (!atom1.relatedAtoms.some(r => r.targetId === atom2.id)) {
          atom1.relatedAtoms.push({
            targetId: atom2.id,
            type: 'supports', // Default relationship
            description: `Shares ${sharedTags.length} tags`
          });
          linksCreated++;
        }

        if (!atom2.relatedAtoms.some(r => r.targetId === atom1.id)) {
          atom2.relatedAtoms.push({
            targetId: atom1.id,
            type: 'supports',
            description: `Shares ${sharedTags.length} tags`
          });
          linksCreated++;
        }
      }
    }
  }

  return linksCreated;
}

/**
 * Write atoms to disk
 */
async function writeAtoms(atoms: Atom[], outputDir: string): Promise<void> {
  for (const atom of atoms) {
    const dir = path.dirname(atom.filePath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(atom.filePath, atom.content || '', 'utf-8');
  }
}

/**
 * Update atom registry
 */
async function updateRegistry(atoms: Atom[], registryPath: string): Promise<void> {
  let registry: AtomRegistry;

  // Load existing registry or create new
  if (fs.existsSync(registryPath)) {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  } else {
    registry = {
      meta: {
        version: '1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        totalAtoms: 0,
        nextId: 'AKU-2025-001'
      },
      atoms: {},
      index: {
        byCategory: {},
        byTag: {},
        byYear: {}
      },
      statistics: {
        atomsPerCategory: {},
        totalLinks: 0,
        averageLinksPerAtom: 0,
        mostConnectedAtoms: [],
        recentlyModified: []
      }
    };
  }

  // Add atoms to registry
  for (const atom of atoms) {
    registry.atoms[atom.id] = {
      id: atom.id,
      title: atom.title,
      category: atom.category,
      tags: atom.tags,
      created: atom.created,
      lastModified: atom.lastModified,
      file: path.relative(path.dirname(registryPath), atom.filePath),
      outgoingLinks: atom.relatedAtoms.map(r => r.targetId),
      incomingLinks: [], // Populated by reverse lookup
      status: 'active'
    };

    // Update indexes
    if (!registry.index.byCategory[atom.category]) {
      registry.index.byCategory[atom.category] = [];
    }
    registry.index.byCategory[atom.category].push(atom.id);

    atom.tags.forEach(tag => {
      if (!registry.index.byTag[tag]) {
        registry.index.byTag[tag] = [];
      }
      registry.index.byTag[tag].push(atom.id);
    });

    const year = atom.created.split('-')[0];
    if (!registry.index.byYear[year]) {
      registry.index.byYear[year] = [];
    }
    registry.index.byYear[year].push(atom.id);
  }

  // Calculate incoming links
  for (const atomId in registry.atoms) {
    registry.atoms[atomId].incomingLinks = Object.keys(registry.atoms)
      .filter(id => registry.atoms[id].outgoingLinks.includes(atomId));
  }

  // Update statistics
  registry.meta.totalAtoms = Object.keys(registry.atoms).length;
  registry.meta.lastUpdated = new Date().toISOString().split('T')[0];

  registry.statistics.totalLinks = Object.values(registry.atoms)
    .reduce((sum, atom) => sum + atom.outgoingLinks.length, 0);

  registry.statistics.averageLinksPerAtom =
    registry.statistics.totalLinks / registry.meta.totalAtoms;

  // Update next ID
  const maxId = Math.max(...Object.keys(registry.atoms)
    .filter(id => id.match(/^AKU-\d+-\d+$/))
    .map(id => parseInt(id.split('-')[2])));
  const year = new Date().getFullYear();
  registry.meta.nextId = `AKU-${year}-${String(maxId + 1).padStart(3, '0')}`;

  // Write registry
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
}

/**
 * Print summary report
 */
function printSummary(result: AtomizationResult): void {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Atomization Complete`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Source: ${result.sourceFile}`);
  console.log(`Pattern: ${result.patternName}`);
  console.log(`\nAtoms Created: ${result.atomsCreated}`);

  result.atoms.slice(0, 10).forEach(atom => {
    console.log(`  - ${atom.id}: ${atom.title}`);
  });

  if (result.atoms.length > 10) {
    console.log(`  ... and ${result.atoms.length - 10} more`);
  }

  console.log(`\nLinks Created: ${result.linksCreated} bidirectional links`);

  if (result.warnings.length > 0) {
    console.log(`\nWarnings: ${result.warnings.length}`);
    result.warnings.forEach(w => console.log(`  ⚠️  ${w}`));
  }

  if (result.errors.length > 0) {
    console.log(`\nErrors: ${result.errors.length}`);
    result.errors.forEach(e => console.log(`  ❌ ${e}`));
  }

  console.log(`\n${'='.repeat(50)}\n`);
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const sourcePath = args.find(a => a.startsWith('--source='))?.split('=')[1];
  const patternName = args.find(a => a.startsWith('--pattern='))?.split('=')[1];
  const dryRun = args.includes('--dry-run');

  if (!sourcePath) {
    console.error('Usage: node atomize.ts --source=<path> [--pattern=<name>] [--dry-run]');
    process.exit(1);
  }

  atomizeDocument(sourcePath, patternName, { dryRun })
    .then(result => {
      process.exit(result.errors.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
