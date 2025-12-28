/**
 * Type definitions for Knowledge Atomizer
 */

export interface Pattern {
  name: string;
  category: string;
  tags: string[];
  sections: Section[];
  rawText: string;
  sourceFile: string;
}

export interface Section {
  title: string;
  content: string;
  level: number; // Heading level (1-6)
}

export interface Concept {
  id: string; // Folgezettel ID (assigned during processing)
  tempId?: string; // Temporary ID for linking before final IDs assigned
  title: string;
  coreIdea: string;
  context: string;
  evidence: string;
  implications: string;
  sourcePattern: string;
  sourceFile: string;
  relatedConcepts: ConceptRelationship[];
  tags: string[];
  category: string;
}

export interface ConceptRelationship {
  targetId: string; // Target concept ID
  type: RelationshipType;
  context?: string; // Optional context for relationship
}

export type RelationshipType =
  | 'extends'      // Elaborates on concept
  | 'contradicts'  // Opposes concept
  | 'implements'   // Concrete implementation
  | 'supports'     // Provides supporting evidence
  | 'requires'     // Prerequisite concept
  | 'inspired-by'  // Source of inspiration
  | 'parent'       // Hierarchical parent
  | 'child';       // Hierarchical child

export interface Atom {
  id: string; // Final Folgezettel ID
  title: string;
  category: AtomCategory;
  tags: string[];
  created: string; // ISO date
  lastModified: string; // ISO date
  coreIdea: string;
  context: string;
  evidence: string;
  implications: string;
  relatedAtoms: AtomLink[];
  references: Reference[];
  filePath: string;
  content?: string; // Full markdown content (generated)
}

export type AtomCategory =
  | 'mechanics'
  | 'principles'
  | 'decisions'
  | 'insights'
  | 'constraints'
  | 'questions';

export interface AtomLink {
  targetId: string;
  type: RelationshipType;
  description?: string;
}

export interface Reference {
  type: 'pattern' | 'project' | 'layer' | 'external';
  name: string;
  path?: string;
  url?: string;
}

export interface FolgezettId {
  year: number;
  sequence: number;
  branches: string; // e.g., '', 'a', 'a1', 'b2c'
}

export type BranchType = 'related' | 'elaboration' | 'alternative';

export interface BranchingDecision {
  parentId: string;
  childConcept: Concept;
  relationship: BranchType;
  branchId: string; // The branch suffix (e.g., 'a', 'a1', 'b')
  finalId: string; // Complete ID (e.g., 'AKU-2025-001a')
}

export type Granularity = 'coarse' | 'medium' | 'fine';

export interface AtomizerConfig {
  granularity: Granularity;
  minWordsPerAtom: number;
  maxWordsPerAtom: number;
  autoLink: boolean;
  autoLinkThreshold: number; // 0-1, similarity threshold
  branchingStrategy: 'semantic' | 'sequential' | 'manual';
  outputDirectory: string;
  registryPath: string;
  preserveOriginals: boolean;
  dryRun: boolean;
}

export interface AtomizationResult {
  sourceFile: string;
  patternName: string;
  atomsCreated: number;
  atoms: Atom[];
  linksCreated: number;
  errors: string[];
  warnings: string[];
}

export interface AtomRegistry {
  meta: {
    version: string;
    lastUpdated: string;
    totalAtoms: number;
    nextId: string;
  };
  atoms: {
    [id: string]: AtomRegistryEntry;
  };
  index: {
    byCategory: {
      [category: string]: string[];
    };
    byTag: {
      [tag: string]: string[];
    };
    byYear: {
      [year: string]: string[];
    };
  };
  statistics: {
    atomsPerCategory: {
      [category: string]: number;
    };
    totalLinks: number;
    averageLinksPerAtom: number;
    mostConnectedAtoms: Array<{ id: string; connections: number }>;
    recentlyModified: Array<{ id: string; modified: string }>;
  };
}

export interface AtomRegistryEntry {
  id: string;
  title: string;
  category: string;
  tags: string[];
  created: string;
  lastModified: string;
  file: string;
  outgoingLinks: string[];
  incomingLinks: string[];
  status: 'active' | 'deprecated';
}

export interface ExtractionRule {
  name: string;
  pattern: RegExp | ((text: string) => boolean);
  extract: (text: string) => Concept[];
  priority: number; // Higher = applied first
}

export interface ConceptBoundary {
  marker: string | RegExp;
  type: 'section' | 'paragraph' | 'sentence';
  significance: 'high' | 'medium' | 'low';
}
