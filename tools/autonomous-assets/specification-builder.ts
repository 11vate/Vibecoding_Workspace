/**
 * Specification Builder - Build detailed asset generation specifications
 *
 * Purpose: Transform asset needs into generator-ready specifications
 * Authority: Tier 2 (Mandatory for autonomous asset generation)
 * Use: Convert high-level needs to low-level generation params
 */

import { AssetNeed, GenerationMethod } from './asset-decision-engine';
import { ButtonSpec, ButtonStyle } from '../asset-generators/ui-generator/button-generator';
import { PanelSpec, PanelStyle } from '../asset-generators/ui-generator/panel-generator';
import { IconSpec } from '../asset-generators/ui-generator/icon-generator';
import { ProgressBarSpec, ProgressBarStyle } from '../asset-generators/ui-generator/progress-bar-generator';
import { HumanoidSpec, CharacterClass, CharacterSize } from '../asset-generators/character-generator/humanoid-generator';
import { TilesetSpec, TileType, TileSize } from '../asset-generators/environment-generator/tileset-generator';
import { ItemSpec, ItemCategory, ItemSize } from '../asset-generators/item-generator/item-generator';

export type GenerationSpec =
  | ButtonSpec
  | PanelSpec
  | IconSpec
  | ProgressBarSpec
  | HumanoidSpec
  | TilesetSpec
  | ItemSpec
  | GeometricSpec
  | NoiseTextureSpec;

// Generic specs for base generators
export interface GeometricSpec {
  type: 'geometric';
  width: number;
  height: number;
  shapes: GeometricShape[];
}

export interface GeometricShape {
  type: 'circle' | 'rectangle' | 'polygon';
  params: Record<string, any>;
}

export interface NoiseTextureSpec {
  type: 'noise-texture';
  width: number;
  height: number;
  scale: number;
  octaves: number;
  persistence: number;
  seed: number;
  colorMap: (v: number) => string;
}

/**
 * Build generation specification from asset need
 */
export function buildSpecification(need: AssetNeed, method: GenerationMethod, seed: number = Date.now()): GenerationSpec {
  switch (method) {
    case 'geometric':
      return buildGeometricSpec(need, seed);
    case 'pixel-art-symmetry':
      return buildPixelArtSpec(need, seed);
    case 'noise-texture':
      return buildNoiseTextureSpec(need, seed);
    case 'svg-code':
      return buildSVGSpec(need);
    default:
      return buildGeometricSpec(need, seed); // Fallback
  }
}

/**
 * Build geometric specification (UI components)
 */
function buildGeometricSpec(need: AssetNeed, seed: number): GenerationSpec {
  const { category, description, dimensions, attributes } = need;

  // Button
  if (category === 'button') {
    return buildButtonSpec(need, attributes);
  }

  // Panel
  if (category === 'panel' || category === 'window' || category === 'dialog') {
    return buildPanelSpec(need, attributes);
  }

  // Progress bar
  if (category === 'progress-bar' || category === 'health-bar' || category === 'status-bar') {
    return buildProgressBarSpec(need, attributes);
  }

  // Generic geometric shape
  return {
    type: 'geometric',
    width: dimensions?.width || 64,
    height: dimensions?.height || 64,
    shapes: inferShapesFromDescription(description)
  };
}

/**
 * Build button specification
 */
function buildButtonSpec(need: AssetNeed, attributes?: Record<string, any>): ButtonSpec {
  const width = need.dimensions?.width || 120;
  const height = need.dimensions?.height || 40;

  // Infer style from description
  let style: ButtonStyle = 'flat';
  if (need.description.toLowerCase().includes('glossy')) style = 'glossy';
  if (need.description.toLowerCase().includes('glass')) style = 'glass';
  if (need.description.toLowerCase().includes('outline')) style = 'outline';
  if (need.description.toLowerCase().includes('gradient')) style = 'gradient';

  // Infer color
  let color = '#3498db'; // Default blue
  if (need.description.toLowerCase().includes('red')) color = '#e74c3c';
  if (need.description.toLowerCase().includes('green')) color = '#2ecc71';
  if (need.description.toLowerCase().includes('yellow')) color = '#f39c12';
  if (need.description.toLowerCase().includes('gray') || need.description.toLowerCase().includes('grey')) color = '#95a5a6';

  // Extract text if present
  const textMatch = need.description.match(/(?:text|label|saying)\s+["']([^"']+)["']/i);
  const text = textMatch ? textMatch[1] : attributes?.text;

  return {
    width,
    height,
    color: attributes?.color || color,
    state: attributes?.state || 'normal',
    style: attributes?.style || style,
    text,
    borderRadius: attributes?.borderRadius
  };
}

/**
 * Build panel specification
 */
function buildPanelSpec(need: AssetNeed, attributes?: Record<string, any>): PanelSpec {
  const width = need.dimensions?.width || 300;
  const height = need.dimensions?.height || 200;

  // Infer style
  let style: PanelStyle = 'bordered';
  if (need.description.toLowerCase().includes('glass')) style = 'glass';
  if (need.description.toLowerCase().includes('solid')) style = 'solid';
  if (need.description.toLowerCase().includes('gradient')) style = 'gradient';
  if (need.description.toLowerCase().includes('paper')) style = 'paper';

  // Infer background color
  let backgroundColor = '#ffffff';
  if (need.description.toLowerCase().includes('dark')) backgroundColor = '#2c3e50';
  if (need.description.toLowerCase().includes('blue')) backgroundColor = '#3498db';

  // Extract title if present
  const titleMatch = need.description.match(/(?:title|titled)\s+["']([^"']+)["']/i);
  const title = titleMatch ? titleMatch[1] : attributes?.title;

  return {
    width,
    height,
    backgroundColor: attributes?.backgroundColor || backgroundColor,
    style: attributes?.style || style,
    title,
    shadow: attributes?.shadow !== false
  };
}

/**
 * Build progress bar specification
 */
function buildProgressBarSpec(need: AssetNeed, attributes?: Record<string, any>): ProgressBarSpec {
  const width = need.dimensions?.width || 200;
  const height = need.dimensions?.height || 20;

  // Infer style
  let style: ProgressBarStyle = 'standard';
  if (need.description.toLowerCase().includes('segment')) style = 'segmented';
  if (need.description.toLowerCase().includes('gradient')) style = 'gradient';
  if (need.description.toLowerCase().includes('radial') || need.description.toLowerCase().includes('circle')) style = 'radial';

  // Infer colors
  let fillColor = '#2ecc71'; // Default green
  if (need.description.toLowerCase().includes('health')) fillColor = '#e74c3c'; // Red
  if (need.description.toLowerCase().includes('mana') || need.description.toLowerCase().includes('blue')) fillColor = '#3498db'; // Blue
  if (need.description.toLowerCase().includes('experience') || need.description.toLowerCase().includes('xp')) fillColor = '#f39c12'; // Gold

  const backgroundColor = attributes?.backgroundColor || '#2c3e50';

  return {
    width,
    height,
    progress: attributes?.progress || 0.75, // Default 75%
    style: attributes?.style || style,
    backgroundColor,
    fillColor: attributes?.fillColor || fillColor
  };
}

/**
 * Build pixel art specification (characters, items)
 */
function buildPixelArtSpec(need: AssetNeed, seed: number): GenerationSpec {
  const { category, description, dimensions } = need;

  // Character
  if (category === 'character' || category === 'npc' || category === 'creature') {
    return buildCharacterSpec(need, seed);
  }

  // Item
  if (category === 'item' || category === 'equipment' || category === 'consumable' || category === 'collectible') {
    return buildItemSpec(need, seed);
  }

  // Default to item spec
  return buildItemSpec(need, seed);
}

/**
 * Build character specification
 */
function buildCharacterSpec(need: AssetNeed, seed: number): HumanoidSpec {
  // Infer class
  let characterClass: CharacterClass = 'warrior';
  if (need.description.toLowerCase().includes('mage') || need.description.toLowerCase().includes('wizard')) characterClass = 'mage';
  if (need.description.toLowerCase().includes('rogue') || need.description.toLowerCase().includes('thief')) characterClass = 'rogue';
  if (need.description.toLowerCase().includes('cleric') || need.description.toLowerCase().includes('priest')) characterClass = 'cleric';
  if (need.description.toLowerCase().includes('archer') || need.description.toLowerCase().includes('ranger')) characterClass = 'archer';
  if (need.description.toLowerCase().includes('knight') || need.description.toLowerCase().includes('paladin')) characterClass = 'knight';

  // Infer size
  let size: CharacterSize = 'medium';
  if (need.dimensions) {
    const avgDim = (need.dimensions.width + need.dimensions.height) / 2;
    if (avgDim <= 20) size = 'small';
    else if (avgDim >= 40) size = 'large';
  }

  return {
    class: characterClass,
    size,
    seed,
    generateAnimations: need.attributes?.generateAnimations !== false
  };
}

/**
 * Build item specification
 */
function buildItemSpec(need: AssetNeed, seed: number): ItemSpec {
  // Infer category
  let itemCategory: ItemCategory = 'collectible';
  if (need.category === 'consumable' || need.description.toLowerCase().includes('potion')) itemCategory = 'consumable';
  if (need.category === 'equipment' || need.description.toLowerCase().includes('weapon') || need.description.toLowerCase().includes('armor')) itemCategory = 'equipment';
  if (need.category === 'currency' || need.description.toLowerCase().includes('coin') || need.description.toLowerCase().includes('gold')) itemCategory = 'currency';
  if (need.description.toLowerCase().includes('material') || need.description.toLowerCase().includes('ore')) itemCategory = 'material';

  // Infer size
  let itemSize: ItemSize = 'medium';
  if (need.dimensions) {
    const avgDim = (need.dimensions.width + need.dimensions.height) / 2;
    if (avgDim <= 20) itemSize = 'small';
    else if (avgDim >= 40) itemSize = 'large';
  }

  // Extract name
  const name = extractItemName(need.description);

  return {
    category: itemCategory,
    name,
    size: itemSize,
    seed
  };
}

/**
 * Build noise texture specification (backgrounds, terrain)
 */
function buildNoiseTextureSpec(need: AssetNeed, seed: number): NoiseTextureSpec | TilesetSpec {
  const { category, dimensions } = need;

  // Tileset
  if (need.type === 'tileset' || category === 'terrain') {
    return buildTilesetSpec(need, seed);
  }

  // Generic noise texture
  const width = dimensions?.width || 256;
  const height = dimensions?.height || 256;

  return {
    type: 'noise-texture',
    width,
    height,
    scale: 30,
    octaves: 4,
    persistence: 0.5,
    seed,
    colorMap: inferColorMapFromDescription(need.description)
  };
}

/**
 * Build tileset specification
 */
function buildTilesetSpec(need: AssetNeed, seed: number): TilesetSpec {
  // Infer tile type
  let tileType: TileType = 'grass';
  if (need.description.toLowerCase().includes('stone') || need.description.toLowerCase().includes('rock')) tileType = 'stone';
  if (need.description.toLowerCase().includes('water') || need.description.toLowerCase().includes('ocean')) tileType = 'water';
  if (need.description.toLowerCase().includes('sand') || need.description.toLowerCase().includes('desert')) tileType = 'sand';
  if (need.description.toLowerCase().includes('dirt') || need.description.toLowerCase().includes('earth')) tileType = 'dirt';
  if (need.description.toLowerCase().includes('wood') || need.description.toLowerCase().includes('floor')) tileType = 'wood';
  if (need.description.toLowerCase().includes('lava') || need.description.toLowerCase().includes('magma')) tileType = 'lava';

  // Infer tile size
  let tileSize: TileSize = 32;
  if (need.dimensions) {
    const dim = need.dimensions.width;
    if (dim === 16 || dim === 32 || dim === 64) tileSize = dim as TileSize;
  }

  return {
    tileType,
    tileSize,
    seed
  };
}

/**
 * Build SVG icon specification
 */
function buildSVGSpec(need: AssetNeed): IconSpec {
  const size = need.dimensions?.width || 32;

  // Extract icon name from description
  const iconName = extractIconName(need.description);

  return {
    name: iconName,
    size,
    format: 'png'
  };
}

// Helper functions

function inferShapesFromDescription(description: string): GeometricShape[] {
  // Simple shape inference - can be expanded
  const shapes: GeometricShape[] = [];

  if (description.toLowerCase().includes('circle')) {
    shapes.push({ type: 'circle', params: { cx: 32, cy: 32, r: 20, fill: '#3498db' } });
  }

  if (description.toLowerCase().includes('rectangle') || description.toLowerCase().includes('square')) {
    shapes.push({ type: 'rectangle', params: { x: 10, y: 10, width: 44, height: 44, fill: '#3498db' } });
  }

  return shapes;
}

function inferColorMapFromDescription(description: string): (v: number) => string {
  // Default grayscale
  if (description.toLowerCase().includes('grass') || description.toLowerCase().includes('green')) {
    return (v: number) => {
      if (v < 0.3) return '#1b5e20';
      if (v < 0.6) return '#2e7d32';
      if (v < 0.8) return '#388e3c';
      return '#4caf50';
    };
  }

  if (description.toLowerCase().includes('stone') || description.toLowerCase().includes('rock')) {
    return (v: number) => {
      if (v < 0.25) return '#3e2723';
      if (v < 0.5) return '#5d4037';
      if (v < 0.75) return '#6d4c41';
      return '#8d6e63';
    };
  }

  // Default grayscale
  return (v: number) => {
    const gray = Math.floor(v * 255);
    const hex = gray.toString(16).padStart(2, '0');
    return `#${hex}${hex}${hex}`;
  };
}

function extractItemName(description: string): string {
  // Extract meaningful name from description
  const words = description.toLowerCase().split(/\s+/);

  // Look for item keywords
  const itemKeywords = ['sword', 'potion', 'shield', 'armor', 'gem', 'coin', 'key', 'scroll', 'staff', 'bow', 'axe'];

  for (const keyword of itemKeywords) {
    if (words.includes(keyword)) {
      return keyword;
    }
  }

  // Fallback to first meaningful word
  return words.find(w => w.length > 3) || 'item';
}

function extractIconName(description: string): string {
  // Extract icon name from description
  const words = description.toLowerCase().split(/\s+/);

  // Common icon names
  const iconNames = [
    'save', 'load', 'settings', 'menu', 'close', 'check', 'cross',
    'plus', 'minus', 'arrow', 'home', 'user', 'search', 'play', 'pause', 'stop',
    'heart', 'star'
  ];

  for (const iconName of iconNames) {
    if (words.includes(iconName) || description.toLowerCase().includes(iconName)) {
      return iconName;
    }
  }

  // Fallback
  return 'circle';
}
