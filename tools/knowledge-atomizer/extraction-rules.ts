/**
 * Extraction Rules - Extract atomic concepts from patterns
 *
 * Defines rules for breaking monolithic patterns into atomic concepts
 */

import { Pattern, Concept, Granularity, AtomizerConfig, ConceptRelationship } from './types';

/**
 * Extract atomic concepts from a pattern
 *
 * @param pattern - Source pattern
 * @param config - Atomizer configuration
 * @returns Array of extracted concepts
 */
export function extractConcepts(pattern: Pattern, config: AtomizerConfig): Concept[] {
  const concepts: Concept[] = [];

  // Strategy based on granularity
  switch (config.granularity) {
    case 'fine':
      return extractFineGrained(pattern);
    case 'coarse':
      return extractCoarseGrained(pattern);
    case 'medium':
    default:
      return extractMediumGrained(pattern);
  }
}

/**
 * Extract fine-grained concepts (many small atoms)
 */
function extractFineGrained(pattern: Pattern): Concept[] {
  const concepts: Concept[] = [];

  // Each paragraph becomes a concept (if substantial)
  const paragraphs = pattern.rawText.split('\n\n');

  for (const paragraph of paragraphs) {
    const wordCount = paragraph.split(/\s+/).length;

    // Skip too-short paragraphs
    if (wordCount < 30) continue;

    // Skip if too long (should be split further)
    if (wordCount > 300) {
      // Split long paragraphs by sentences
      const sentences = paragraph.split(/\.\s+/);
      let currentGroup: string[] = [];
      let currentWords = 0;

      for (const sentence of sentences) {
        const sentenceWords = sentence.split(/\s+/).length;

        if (currentWords + sentenceWords > 200) {
          // Flush current group as concept
          if (currentGroup.length > 0) {
            concepts.push(createConceptFromText(currentGroup.join('. '), pattern));
          }
          currentGroup = [sentence];
          currentWords = sentenceWords;
        } else {
          currentGroup.push(sentence);
          currentWords += sentenceWords;
        }
      }

      // Flush remaining
      if (currentGroup.length > 0) {
        concepts.push(createConceptFromText(currentGroup.join('. '), pattern));
      }
    } else {
      // Paragraph is good size for concept
      concepts.push(createConceptFromText(paragraph, pattern));
    }
  }

  return concepts;
}

/**
 * Extract medium-grained concepts (balanced)
 */
function extractMediumGrained(pattern: Pattern): Concept[] {
  const concepts: Concept[] = [];

  // Each major section becomes a concept
  for (const section of pattern.sections) {
    // Skip tiny sections
    const wordCount = section.content.split(/\s+/).length;
    if (wordCount < 30) continue;

    // Create concept from section
    const concept = createConceptFromSection(section, pattern);
    concepts.push(concept);

    // If section is very large, split into sub-concepts
    if (wordCount > 400) {
      const subConcepts = extractSubConcepts(section.content, pattern, concept);
      concepts.push(...subConcepts);
    }
  }

  return concepts;
}

/**
 * Extract coarse-grained concepts (fewer large atoms)
 */
function extractCoarseGrained(pattern: Pattern): Concept[] {
  const concepts: Concept[] = [];

  // Group sections by theme
  const themes = identifyThemes(pattern.sections);

  for (const theme of themes) {
    const combinedText = theme.sections.map(s => s.content).join('\n\n');
    const concept = createConceptFromText(combinedText, pattern, theme.name);
    concepts.push(concept);
  }

  return concepts;
}

/**
 * Create concept from text
 */
function createConceptFromText(
  text: string,
  pattern: Pattern,
  titleOverride?: string
): Concept {
  // Generate title from first sentence
  const title = titleOverride || generateTitle(text);

  // Extract core idea (first 1-2 sentences)
  const sentences = text.split(/\.\s+/);
  const coreIdea = sentences.slice(0, 2).join('. ').trim();

  // Extract context (when/where this applies)
  const context = extractContext(text);

  // Extract evidence (why this is true)
  const evidence = extractEvidence(text);

  // Extract implications (what follows)
  const implications = extractImplications(text);

  return {
    id: '', // Assigned later
    tempId: generateTempId(),
    title,
    coreIdea,
    context,
    evidence,
    implications,
    sourcePattern: pattern.name,
    sourceFile: pattern.sourceFile,
    relatedConcepts: [],
    tags: pattern.tags,
    category: pattern.category
  };
}

/**
 * Create concept from section
 */
function createConceptFromSection(section: any, pattern: Pattern): Concept {
  return createConceptFromText(section.content, pattern, section.title);
}

/**
 * Extract sub-concepts from large section
 */
function extractSubConcepts(
  text: string,
  pattern: Pattern,
  parent: Concept
): Concept[] {
  const subConcepts: Concept[] = [];

  // Look for subsections or concept boundaries
  const boundaryMarkers = [
    'However,',
    'Additionally,',
    'For example,',
    'In contrast,',
    'Alternatively,',
    'Furthermore,'
  ];

  let currentText = '';
  const parts = text.split(/\n\n/);

  for (const part of parts) {
    const startsWithBoundary = boundaryMarkers.some(marker =>
      part.trim().startsWith(marker)
    );

    if (startsWithBoundary && currentText) {
      // Flush current as sub-concept
      const subConcept = createConceptFromText(currentText, pattern);
      subConcept.relatedConcepts.push({
        targetId: parent.tempId!,
        type: 'parent'
      });
      subConcepts.push(subConcept);
      currentText = part;
    } else {
      currentText += '\n\n' + part;
    }
  }

  // Flush remaining
  if (currentText.trim()) {
    const subConcept = createConceptFromText(currentText, pattern);
    subConcept.relatedConcepts.push({
      targetId: parent.tempId!,
      type: 'parent'
    });
    subConcepts.push(subConcept);
  }

  return subConcepts;
}

/**
 * Generate title from text
 */
function generateTitle(text: string): string {
  // Take first sentence and clean up
  const firstSentence = text.split(/\.\s+/)[0];

  // Remove markdown formatting
  let title = firstSentence
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/#/g, '')
    .trim();

  // Truncate if too long
  if (title.length > 80) {
    title = title.slice(0, 77) + '...';
  }

  return title;
}

/**
 * Extract context from text
 */
function extractContext(text: string): string {
  // Look for context markers
  const contextMarkers = [
    'when',
    'where',
    'applies to',
    'use this',
    'appropriate for',
    'best for',
    'in situations'
  ];

  const sentences = text.split(/\.\s+/);

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (contextMarkers.some(marker => lowerSentence.includes(marker))) {
      return sentence.trim();
    }
  }

  return 'Context to be determined based on usage';
}

/**
 * Extract evidence from text
 */
function extractEvidence(text: string): string {
  // Look for evidence markers
  const evidenceMarkers = [
    'because',
    'research shows',
    'evidence',
    'proven',
    'demonstrated',
    'studies',
    'example'
  ];

  const sentences = text.split(/\.\s+/);

  const evidenceSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return evidenceMarkers.some(marker => lowerSentence.includes(marker));
  });

  return evidenceSentences.length > 0
    ? evidenceSentences.join('. ')
    : 'Evidence to be gathered from projects and research';
}

/**
 * Extract implications from text
 */
function extractImplications(text: string): string {
  // Look for implication markers
  const implicationMarkers = [
    'this means',
    'therefore',
    'as a result',
    'consequently',
    'this enables',
    'this requires',
    'this affects'
  ];

  const sentences = text.split(/\.\s+/);

  const implicationSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return implicationMarkers.some(marker => lowerSentence.includes(marker));
  });

  return implicationSentences.length > 0
    ? implicationSentences.join('. ')
    : 'Implications to be explored in related atoms';
}

/**
 * Identify themes across sections
 */
function identifyThemes(sections: any[]): Array<{ name: string; sections: any[] }> {
  // Simple grouping by section level
  const themes: Array<{ name: string; sections: any[] }> = [];
  let currentTheme: any = null;

  for (const section of sections) {
    if (section.level === 2) {
      // New theme
      if (currentTheme) {
        themes.push(currentTheme);
      }
      currentTheme = {
        name: section.title,
        sections: [section]
      };
    } else if (currentTheme) {
      // Add to current theme
      currentTheme.sections.push(section);
    }
  }

  // Add last theme
  if (currentTheme) {
    themes.push(currentTheme);
  }

  return themes;
}

/**
 * Generate temporary ID for concept (before Folgezettel ID assigned)
 */
let tempIdCounter = 0;
function generateTempId(): string {
  return `TEMP-${tempIdCounter++}`;
}
