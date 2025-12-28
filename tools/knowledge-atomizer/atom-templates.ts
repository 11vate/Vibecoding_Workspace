/**
 * Atom Templates - Generate markdown files for atoms
 *
 * Creates properly formatted atom markdown files
 */

import { Atom, AtomLink, Reference } from './types';

/**
 * Generate complete atom markdown file
 *
 * @param atom - Atom to generate markdown for
 * @returns Markdown content
 */
export function generateAtom(atom: Atom): string {
  const sections = [
    generateHeader(atom),
    generateMetadata(atom),
    generateCoreIdea(atom),
    generateContext(atom),
    generateEvidence(atom),
    generateImplications(atom),
    generateRelatedAtoms(atom),
    generateReferences(atom),
    generateRevisionHistory(atom),
    generateNotes(atom)
  ];

  return sections.filter(s => s).join('\n\n---\n\n');
}

/**
 * Generate atom header
 */
function generateHeader(atom: Atom): string {
  return `# ${atom.id}: ${atom.title}`;
}

/**
 * Generate metadata section
 */
function generateMetadata(atom: Atom): string {
  return [
    `**Category**: ${atom.category}`,
    `**Tags**: ${atom.tags.join(', ')}`,
    `**Created**: ${atom.created}`,
    `**Last Modified**: ${atom.lastModified}`
  ].join('\n');
}

/**
 * Generate core idea section
 */
function generateCoreIdea(atom: Atom): string {
  return [
    '## Core Idea',
    '',
    atom.coreIdea
  ].join('\n');
}

/**
 * Generate context section
 */
function generateContext(atom: Atom): string {
  return [
    '## Context',
    '',
    '**When does this apply?**',
    '',
    atom.context || 'Context to be determined based on usage.',
    '',
    '**When does this NOT apply?**',
    '',
    '[To be documented as edge cases are discovered]'
  ].join('\n');
}

/**
 * Generate evidence section
 */
function generateEvidence(atom: Atom): string {
  return [
    '## Evidence',
    '',
    '**Why is this true?**',
    '',
    atom.evidence || 'Evidence to be gathered from projects and research.',
    '',
    '**Sources**:',
    '- [To be added as evidence accumulates]'
  ].join('\n');
}

/**
 * Generate implications section
 */
function generateImplications(atom: Atom): string {
  return [
    '## Implications',
    '',
    '**What follows from this idea?**',
    '',
    atom.implications || 'Implications to be explored in related atoms.',
    '',
    '**Design implications**:',
    '- [To be documented based on project applications]',
    '',
    '**Implementation implications**:',
    '- [To be documented based on implementation experience]'
  ].join('\n');
}

/**
 * Generate related atoms section
 */
function generateRelatedAtoms(atom: Atom): string {
  const lines = [
    '## Related Atoms',
    ''
  ];

  if (atom.relatedAtoms && atom.relatedAtoms.length > 0) {
    lines.push('**Direct relationships**:');

    for (const link of atom.relatedAtoms) {
      const desc = link.description ? ` - ${link.description}` : '';
      lines.push(`- [[${link.targetId}]] (${link.type})${desc}`);
    }

    lines.push('');
    lines.push('**Relationship types**:');
    lines.push('- (supports) - Provides supporting evidence');
    lines.push('- (contradicts) - Presents contradictory view');
    lines.push('- (extends) - Elaborates on concept');
    lines.push('- (implements) - Concrete implementation');
    lines.push('- (inspired-by) - Source of inspiration');
    lines.push('- (parent) - Parent concept');
    lines.push('- (child) - Child concept');
  } else {
    lines.push('No related atoms yet. Links will be added as the knowledge graph grows.');
  }

  return lines.join('\n');
}

/**
 * Generate references section
 */
function generateReferences(atom: Atom): string {
  const lines = [
    '## References',
    ''
  ];

  if (atom.references && atom.references.length > 0) {
    // Group by type
    const byType: { [key: string]: Reference[] } = {};
    for (const ref of atom.references) {
      if (!byType[ref.type]) {
        byType[ref.type] = [];
      }
      byType[ref.type].push(ref);
    }

    if (byType.pattern) {
      lines.push('**Patterns**:');
      byType.pattern.forEach(ref => {
        lines.push(`- ${ref.name}${ref.path ? ` (${ref.path})` : ''}`);
      });
      lines.push('');
    }

    if (byType.project) {
      lines.push('**Projects**:');
      byType.project.forEach(ref => {
        lines.push(`- ${ref.name}${ref.path ? ` (${ref.path})` : ''}`);
      });
      lines.push('');
    }

    if (byType.layer) {
      lines.push('**DIS Layers**:');
      byType.layer.forEach(ref => {
        lines.push(`- ${ref.name}`);
      });
      lines.push('');
    }

    if (byType.external) {
      lines.push('**External**:');
      byType.external.forEach(ref => {
        if (ref.url) {
          lines.push(`- [${ref.name}](${ref.url})`);
        } else {
          lines.push(`- ${ref.name}`);
        }
      });
      lines.push('');
    }
  } else {
    lines.push('No external references. Add references as they become relevant.');
  }

  return lines.join('\n');
}

/**
 * Generate revision history section
 */
function generateRevisionHistory(atom: Atom): string {
  return [
    '## Revision History',
    '',
    `**${atom.created}**: Initial creation (atomized from pattern)`,
    '',
    '[Future revisions will be logged here]'
  ].join('\n');
}

/**
 * Generate notes section
 */
function generateNotes(atom: Atom): string {
  return [
    '## Notes',
    '',
    '[Any additional notes, questions, or areas for future exploration]'
  ].join('\n');
}

/**
 * Format atom link for markdown
 */
export function formatAtomLink(link: AtomLink): string {
  return `[[${link.targetId}]] (${link.type})${link.description ? ' - ' + link.description : ''}`;
}

/**
 * Generate atom from template with custom data
 */
export function fillTemplate(templatePath: string, data: any): string {
  // This would load a template file and replace placeholders
  // For now, we use the generateAtom function above
  return generateAtom(data);
}

/**
 * Validate atom content before writing
 *
 * @param atom - Atom to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateAtom(atom: Atom): string[] {
  const errors: string[] = [];

  // Required fields
  if (!atom.id) errors.push('Missing ID');
  if (!atom.title) errors.push('Missing title');
  if (!atom.category) errors.push('Missing category');
  if (!atom.coreIdea) errors.push('Missing core idea');

  // ID format
  if (atom.id && !/^AKU-\d{4}-\d{3}[a-z0-9]*$/.test(atom.id)) {
    errors.push(`Invalid ID format: ${atom.id}`);
  }

  // Core idea length
  if (atom.coreIdea) {
    const wordCount = atom.coreIdea.split(/\s+/).length;
    if (wordCount < 10) {
      errors.push(`Core idea too short (${wordCount} words, minimum 10)`);
    }
    if (wordCount > 100) {
      errors.push(`Core idea too long (${wordCount} words, maximum 100)`);
    }
  }

  // Tags
  if (!atom.tags || atom.tags.length === 0) {
    errors.push('No tags specified');
  }

  return errors;
}

/**
 * Generate minimal atom (for testing or placeholders)
 */
export function generateMinimalAtom(id: string, title: string, coreIdea: string): Atom {
  const now = new Date().toISOString().split('T')[0];

  return {
    id,
    title,
    category: 'mechanics',
    tags: [],
    created: now,
    lastModified: now,
    coreIdea,
    context: 'Context to be determined',
    evidence: 'Evidence to be gathered',
    implications: 'Implications to be explored',
    relatedAtoms: [],
    references: [],
    filePath: `atoms/mechanics/${id}.md`
  };
}
