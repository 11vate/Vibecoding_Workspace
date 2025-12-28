/**
 * Core types for AI Sprite Generator
 */

/**
 * Entity type for sprite generation
 */
export type EntityType = 
  | "character" 
  | "enemy" 
  | "pet" 
  | "monster" 
  | "npc" 
  | "boss" 
  | "item" 
  | "equipment" 
  | "tile" 
  | "ui" 
  | "effect" 
  | "particle";

/**
 * Visual style
 */
export type VisualStyle = 
  | "pixel-art" 
  | "pixel-art-8bit" 
  | "pixel-art-16bit" 
  | "pixel-art-hd" 
  | "cartoon" 
  | "hand-drawn" 
  | "painterly" 
  | "fantasy" 
  | "isometric" 
  | "pseudo-3d";

/**
 * Perspective/view angle
 */
export type Perspective = 
  | "side-view" 
  | "top-down" 
  | "isometric" 
  | "front-view" 
  | "back-view" 
  | "diagonal";

/**
 * Animation action
 */
export type AnimationAction = 
  | "idle" 
  | "walk" 
  | "run" 
  | "attack" 
  | "cast" 
  | "hit" 
  | "death" 
  | "jump" 
  | "fall";

/**
 * Structured generation parameters
 */
export interface GenerationParams {
  entity: EntityType;
  style: VisualStyle;
  theme?: string;
  action?: AnimationAction;
  frameCount?: number;
  perspective: Perspective;
  resolution: [number, number];
  loopable?: boolean;
  model?: string;
  lora?: string;
  palette?: string[];
  postProcessing: string[];
}

/**
 * Concept interpretation result
 */
export interface ConceptInterpretation {
  params: GenerationParams;
  confidence: number;
  reasoning: string[];
}

/**
 * Prompt compilation result
 */
export interface CompiledPrompt {
  positivePrompt: string;
  negativePrompt: string;
  model: string;
  lora?: string;
  loraWeight?: number;
  steps?: number;
  cfgScale?: number;
  seed?: number;
}

/**
 * Generated sprite asset
 */
export interface GeneratedSprite {
  id: string;
  data: Buffer;
  width: number;
  height: number;
  format: "png" | "webp";
  metadata: SpriteMetadata;
}

/**
 * Sprite metadata
 */
export interface SpriteMetadata {
  entity: EntityType;
  style: VisualStyle;
  theme?: string;
  action?: AnimationAction;
  frameCount?: number;
  perspective: Perspective;
  palette?: {
    dominant: string[];
    all: string[];
    count: number;
    style: string;
  };
  tags: string[];
  createdAt: string;
  filePath?: string;
}

/**
 * Animation frame
 */
export interface AnimationFrame {
  index: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  duration?: number;
}

/**
 * Sprite sheet metadata
 */
export interface SpriteSheetMetadata {
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
  frames: AnimationFrame[];
  animations?: {
    [key: string]: {
      frames: number[];
      frameRate: number;
      loop: boolean;
    };
  };
}







