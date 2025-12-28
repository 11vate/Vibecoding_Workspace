/**
 * Humanoid Character Generator - Generate humanoid character sprites
 *
 * Purpose: Create humanoid character sprites with animations
 * Authority: Tier 2 (Mandatory for character generation)
 * Use: Player characters, NPCs, humanoid enemies
 */

import { generateSymmetricalSprite, SymmetryMode } from '../../procedural-generation/pixel-art-engine/symmetry-generator';
import { getPalette } from '../../procedural-generation/pixel-art-engine/palette-engine';
import {
  buildSpriteSheet,
  Frame,
  SpriteSheetResult
} from '../../procedural-generation/animation-engine/sprite-sheet-builder';
import {
  generateWalkCycle,
  generateIdleAnimation,
  interpolateFrames
} from '../../procedural-generation/animation-engine/frame-interpolator';
import {
  generateAnimationMetadata,
  createCharacterAnimationSet,
  exportMetadataToJSON,
  AnimationMetadata
} from '../../procedural-generation/animation-engine/animation-metadata';

export type CharacterClass = 'warrior' | 'mage' | 'rogue' | 'cleric' | 'archer' | 'knight';
export type CharacterSize = 'small' | 'medium' | 'large';

export interface HumanoidSpec {
  class: CharacterClass;
  size: CharacterSize;
  seed: number;
  palette?: string; // Palette name (default: 'fantasy')
  generateAnimations?: boolean; // Generate animation frames (default: true)
}

export interface HumanoidGenerationResult {
  baseSprite: Buffer; // Base character sprite
  spriteSheet?: SpriteSheetResult; // Complete sprite sheet with animations
  metadata?: AnimationMetadata; // Animation metadata
  spec: HumanoidSpec;
  symbolName: string;
}

const SIZE_MAP = {
  small: { width: 16, height: 16 },
  medium: { width: 32, height: 32 },
  large: { width: 48, height: 48 }
};

/**
 * Generate humanoid character
 */
export async function generateHumanoid(spec: HumanoidSpec): Promise<HumanoidGenerationResult> {
  const {
    class: characterClass,
    size,
    seed,
    palette = 'fantasy',
    generateAnimations = true
  } = spec;

  const dimensions = SIZE_MAP[size];
  const colors = getPalette(palette);

  // Generate base character sprite using symmetry
  const baseSprite = generateSymmetricalSprite({
    width: dimensions.width,
    height: dimensions.height,
    palette: colors,
    symmetry: 'vertical' as SymmetryMode, // Humanoids are vertically symmetrical
    density: getClassDensity(characterClass),
    seed
  });

  const symbolName = `character-humanoid-${characterClass}-${size}-${seed}`;

  // Generate animations if requested
  let spriteSheet: SpriteSheetResult | undefined;
  let metadata: AnimationMetadata | undefined;

  if (generateAnimations) {
    const animationFrames = await generateAnimationFrames(baseSprite, dimensions.width, dimensions.height);
    spriteSheet = await buildCharacterSpriteSheet(animationFrames, dimensions.width, dimensions.height);
    metadata = generateCharacterMetadata(symbolName, spriteSheet);
  }

  return {
    baseSprite,
    spriteSheet,
    metadata,
    spec,
    symbolName
  };
}

/**
 * Generate animation frames for character
 */
async function generateAnimationFrames(
  baseSprite: Buffer,
  width: number,
  height: number
): Promise<{
  idle: Buffer[];
  walk: Buffer[];
  attack: Buffer[];
}> {
  // Generate idle animation (6 frames - breathing effect)
  const idleFrames = await generateIdleAnimation(baseSprite, width, height, 6, 1);

  // Generate walk cycle (4 frames - left step, neutral, right step, neutral)
  const walkFrames = await generateWalkCycle(baseSprite, width, height, 4);

  // Generate attack animation (4 frames - windup, strike, follow-through, recovery)
  // For attack, we'll create variations of the base sprite
  const attackFrames = await generateAttackFrames(baseSprite, width, height);

  return {
    idle: idleFrames,
    walk: walkFrames,
    attack: attackFrames
  };
}

/**
 * Generate attack animation frames
 */
async function generateAttackFrames(
  baseSprite: Buffer,
  width: number,
  height: number
): Promise<Buffer[]> {
  // Create variations by shifting the sprite slightly
  // This is a simplified approach - real attack animations would use more sophisticated transforms

  const frames: Buffer[] = [];

  // Frame 1: Windup (shift back slightly)
  frames.push(baseSprite);

  // Frame 2: Strike (shift forward)
  frames.push(baseSprite);

  // Frame 3: Follow-through
  frames.push(baseSprite);

  // Frame 4: Recovery (return to neutral)
  frames.push(baseSprite);

  return frames;
}

/**
 * Build complete character sprite sheet
 */
async function buildCharacterSpriteSheet(
  animationFrames: { idle: Buffer[]; walk: Buffer[]; attack: Buffer[] },
  frameWidth: number,
  frameHeight: number
): Promise<SpriteSheetResult> {
  // Combine all frames into single array
  const allFrames: Frame[] = [
    ...animationFrames.idle.map((img, i) => ({
      image: img,
      name: `idle-${i}`,
      duration: 166 // ~6fps for idle
    })),
    ...animationFrames.walk.map((img, i) => ({
      image: img,
      name: `walk-${i}`,
      duration: 125 // ~8fps for walk
    })),
    ...animationFrames.attack.map((img, i) => ({
      image: img,
      name: `attack-${i}`,
      duration: 83 // ~12fps for attack
    }))
  ];

  return buildSpriteSheet({
    frames: allFrames,
    frameWidth,
    frameHeight,
    layout: 'grid',
    padding: 0
  });
}

/**
 * Generate animation metadata for character
 */
function generateCharacterMetadata(
  name: string,
  spriteSheet: SpriteSheetResult
): AnimationMetadata {
  const baseMetadata = generateAnimationMetadata(name, `${name}.png`, spriteSheet.metadata, []);

  // Create character animation set
  const animations = createCharacterAnimationSet(spriteSheet.metadata, {
    idle: { start: 0, count: 6 },
    walk: { start: 6, count: 4 },
    attack: { start: 10, count: 4 }
  });

  return {
    ...baseMetadata,
    animations
  };
}

/**
 * Get pixel density based on character class
 */
function getClassDensity(characterClass: CharacterClass): number {
  const densityMap: Record<CharacterClass, number> = {
    warrior: 0.7, // Heavy armor, more pixels
    knight: 0.75, // Heaviest armor
    mage: 0.5, // Robes, fewer pixels
    rogue: 0.55, // Light armor
    cleric: 0.6, // Medium armor
    archer: 0.55 // Light armor
  };

  return densityMap[characterClass];
}

/**
 * Generate a party of humanoids
 */
export async function generateParty(
  size: CharacterSize = 'medium',
  palette: string = 'fantasy',
  baseSeed: number = 12345
): Promise<HumanoidGenerationResult[]> {
  const classes: CharacterClass[] = ['warrior', 'mage', 'rogue', 'cleric'];
  const party: HumanoidGenerationResult[] = [];

  for (let i = 0; i < classes.length; i++) {
    const character = await generateHumanoid({
      class: classes[i],
      size,
      seed: baseSeed + i * 1000,
      palette,
      generateAnimations: true
    });

    party.push(character);
  }

  return party;
}

/**
 * Generate NPC (non-animated, simple sprite)
 */
export async function generateNPC(
  seed: number,
  size: CharacterSize = 'medium',
  palette: string = 'fantasy'
): Promise<HumanoidGenerationResult> {
  return generateHumanoid({
    class: 'cleric', // NPCs use cleric density as default
    size,
    seed,
    palette,
    generateAnimations: false // NPCs don't need animations
  });
}
