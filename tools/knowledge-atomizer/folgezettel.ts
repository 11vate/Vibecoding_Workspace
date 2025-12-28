/**
 * Folgezettel ID Management
 *
 * Generates and manages Folgezettel-style branching IDs for atomic knowledge units
 */

import * as fs from 'fs';
import * as path from 'path';
import { FolgezettId, BranchType, BranchingDecision, Concept } from './types';

/**
 * Get the next root ID
 *
 * @returns Next available root ID (e.g., "AKU-2025-001")
 */
export function getNextRootId(): string {
  const registry = loadRegistry();
  return registry.meta.nextId;
}

/**
 * Parse Folgezettel ID into components
 *
 * @param id - Folgezettel ID (e.g., "AKU-2025-001a1")
 * @returns Parsed components
 */
export function parseId(id: string): FolgezettId {
  const match = id.match(/^AKU-(\d{4})-(\d{3})([a-z0-9]*)$/);

  if (!match) {
    throw new Error(`Invalid Folgezettel ID: ${id}`);
  }

  return {
    year: parseInt(match[1]),
    sequence: parseInt(match[2]),
    branches: match[3] || ''
  };
}

/**
 * Validate Folgezettel ID format
 *
 * @param id - ID to validate
 * @returns true if valid
 */
export function validateId(id: string): boolean {
  return /^AKU-\d{4}-\d{3}([a-z0-9]*)$/.test(id);
}

/**
 * Generate branch ID from parent ID
 *
 * @param parentId - Parent Folgezettel ID
 * @param branchType - Type of branch (related, elaboration, alternative)
 * @returns New branch ID
 */
export function branchId(parentId: string, branchType: BranchType): string {
  const parsed = parseId(parentId);

  if (branchType === 'related') {
    // Letter branch (a, b, c, ...)
    const nextLetter = getNextLetter(parsed.branches);
    return `AKU-${parsed.year}-${String(parsed.sequence).padStart(3, '0')}${nextLetter}`;
  } else if (branchType === 'elaboration') {
    // Number branch (1, 2, 3, ...)
    const nextNumber = getNextNumber(parsed.branches);
    return `AKU-${parsed.year}-${String(parsed.sequence).padStart(3, '0')}${parsed.branches}${nextNumber}`;
  } else {
    // Alternative: combination of letters and numbers
    const nextSuffix = getNextAlternative(parsed.branches);
    return `AKU-${parsed.year}-${String(parsed.sequence).padStart(3, '0')}${nextSuffix}`;
  }
}

/**
 * Decide branch type and generate ID for child concept
 *
 * @param parent - Parent concept
 * @param child - Child concept
 * @returns Branching decision
 */
export function decideBranch(parent: Concept, child: Concept): BranchingDecision {
  // Determine relationship based on content similarity and relationship type
  const relationship = inferRelationship(parent, child);

  let branchType: BranchType;
  if (isElaboration(parent, child)) {
    branchType = 'elaboration';
  } else if (isAlternative(parent, child)) {
    branchType = 'alternative';
  } else {
    branchType = 'related';
  }

  const finalId = branchId(parent.id, branchType);
  const parsed = parseId(finalId);

  return {
    parentId: parent.id,
    childConcept: child,
    relationship: branchType,
    branchId: parsed.branches,
    finalId
  };
}

/**
 * Get next letter suffix
 *
 * @param currentBranches - Current branch suffix
 * @returns Next letter
 */
function getNextLetter(currentBranches: string): string {
  if (!currentBranches) {
    return 'a';
  }

  // Get the last letter in the branches
  const lastChar = currentBranches[currentBranches.length - 1];

  if (/[a-z]/.test(lastChar)) {
    // Increment letter
    const nextCharCode = lastChar.charCodeAt(0) + 1;
    if (nextCharCode > 122) { // 'z'
      throw new Error('Exceeded maximum letter branches (z)');
    }
    return currentBranches.slice(0, -1) + String.fromCharCode(nextCharCode);
  } else {
    // Last char is number, append 'a'
    return currentBranches + 'a';
  }
}

/**
 * Get next number suffix
 *
 * @param currentBranches - Current branch suffix
 * @returns Next number
 */
function getNextNumber(currentBranches: string): string {
  if (!currentBranches) {
    return '1';
  }

  // Get the last digit
  const lastChar = currentBranches[currentBranches.length - 1];

  if (/[0-9]/.test(lastChar)) {
    // Increment number
    const num = parseInt(lastChar);
    if (num >= 9) {
      throw new Error('Exceeded maximum number branches (9)');
    }
    return String(num + 1);
  } else {
    // Last char is letter, append '1'
    return '1';
  }
}

/**
 * Get next alternative suffix
 *
 * @param currentBranches - Current branch suffix
 * @returns Next alternative suffix
 */
function getNextAlternative(currentBranches: string): string {
  // For alternatives, combine letters and numbers
  // e.g., a1 → a2, a2 → a3, a9 → b1
  const match = currentBranches.match(/^([a-z]+)(\d*)$/);

  if (!match) {
    return 'a1';
  }

  const letters = match[1];
  const numbers = match[2] ? parseInt(match[2]) : 0;

  if (numbers < 9) {
    return letters + String(numbers + 1);
  } else {
    // Increment letter
    const lastLetter = letters[letters.length - 1];
    const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
    return letters.slice(0, -1) + nextLetter + '1';
  }
}

/**
 * Infer relationship between parent and child concepts
 *
 * @param parent - Parent concept
 * @param child - Child concept
 * @returns Inferred relationship type
 */
function inferRelationship(parent: Concept, child: Concept): string {
  // Check explicit relationships first
  const explicitRel = child.relatedConcepts.find(r => r.targetId === parent.tempId);
  if (explicitRel) {
    return explicitRel.type;
  }

  // Infer from content
  if (isElaboration(parent, child)) {
    return 'elaborates';
  } else if (isContradiction(parent, child)) {
    return 'contradicts';
  } else {
    return 'relates-to';
  }
}

/**
 * Check if child elaborates on parent
 *
 * @param parent - Parent concept
 * @param child - Child concept
 * @returns true if elaboration
 */
function isElaboration(parent: Concept, child: Concept): boolean {
  // Simple heuristic: child title contains parent title keywords
  const parentKeywords = extractKeywords(parent.title);
  const childKeywords = extractKeywords(child.title);

  const overlap = parentKeywords.filter(k => childKeywords.includes(k));
  return overlap.length >= 2; // At least 2 keywords overlap
}

/**
 * Check if child is alternative to parent
 *
 * @param parent - Parent concept
 * @param child - Child concept
 * @returns true if alternative
 */
function isAlternative(parent: Concept, child: Concept): boolean {
  // Simple heuristic: similar structure but different approach
  const alternativeMarkers = [
    'alternatively',
    'instead',
    'another approach',
    'different way',
    'contrast'
  ];

  const childText = (child.coreIdea + ' ' + child.context).toLowerCase();
  return alternativeMarkers.some(marker => childText.includes(marker));
}

/**
 * Check if child contradicts parent
 *
 * @param parent - Parent concept
 * @param child - Child concept
 * @returns true if contradiction
 */
function isContradiction(parent: Concept, child: Concept): boolean {
  const contradictionMarkers = [
    'however',
    'but',
    'contradicts',
    'opposes',
    'wrong',
    'incorrect'
  ];

  const childText = (child.coreIdea + ' ' + child.context).toLowerCase();
  return contradictionMarkers.some(marker => childText.includes(marker));
}

/**
 * Extract keywords from text
 *
 * @param text - Input text
 * @returns Array of keywords
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction: words longer than 4 chars, excluding common words
  const commonWords = ['that', 'this', 'with', 'from', 'have', 'been', 'were', 'their', 'there', 'what', 'when', 'which', 'where'];

  return text.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 4 && !commonWords.includes(word));
}

/**
 * Load atom registry
 *
 * @returns Atom registry
 */
function loadRegistry(): any {
  const registryPath = path.join(__dirname, '../../knowledge-base/atoms/atom-registry.json');

  if (!fs.existsSync(registryPath)) {
    return {
      meta: {
        nextId: `AKU-${new Date().getFullYear()}-001`
      }
    };
  }

  return JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
}

/**
 * Get all existing IDs from registry
 *
 * @returns Array of existing IDs
 */
export function getExistingIds(): string[] {
  const registry = loadRegistry();
  return Object.keys(registry.atoms || {});
}

/**
 * Check if ID already exists
 *
 * @param id - ID to check
 * @returns true if exists
 */
export function idExists(id: string): boolean {
  return getExistingIds().includes(id);
}

/**
 * Generate unique ID (ensuring no collision)
 *
 * @param baseId - Base ID to start from
 * @returns Unique ID
 */
export function generateUniqueId(baseId?: string): string {
  let id = baseId || getNextRootId();
  let counter = 1;

  while (idExists(id)) {
    const parsed = parseId(baseId || getNextRootId());
    id = `AKU-${parsed.year}-${String(parsed.sequence + counter).padStart(3, '0')}`;
    counter++;
  }

  return id;
}
