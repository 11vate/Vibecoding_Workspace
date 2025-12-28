/**
 * Item Generator - Generate item sprites
 *
 * Purpose: Create item sprites for inventory, loot, collectibles
 * Authority: Tier 2 (Mandatory for item generation)
 * Use: Consumables, equipment, collectibles, currency
 */

import { generateSymmetricalSprite, SymmetryMode } from '../../procedural-generation/pixel-art-engine/symmetry-generator';
import { getPalette, generatePaletteFromBase } from '../../procedural-generation/pixel-art-engine/palette-engine';

export type ItemCategory = 'consumable' | 'equipment' | 'collectible' | 'currency' | 'material';
export type ItemSize = 'small' | 'medium' | 'large';

export interface ItemSpec {
  category: ItemCategory;
  name: string;
  size: ItemSize;
  seed: number;
  baseColor?: string; // Base color for the item
  palette?: string; // Palette name (overrides baseColor)
}

export interface ItemGenerationResult {
  sprite: Buffer;
  spec: ItemSpec;
  symbolName: string;
}

const SIZE_MAP = {
  small: { width: 16, height: 16 },
  medium: { width: 32, height: 32 },
  large: { width: 48, height: 48 }
};

/**
 * Generate item sprite
 */
export async function generateItem(spec: ItemSpec): Promise<ItemGenerationResult> {
  const { category, name, size, seed, baseColor, palette } = spec;

  const dimensions = SIZE_MAP[size];

  // Determine palette
  let colors: string[];
  if (palette) {
    colors = getPalette(palette);
  } else if (baseColor) {
    colors = generatePaletteFromBase(baseColor, 5);
  } else {
    colors = getCategoryDefaultPalette(category);
  }

  // Generate sprite using symmetry
  const symmetry = getItemSymmetry(category);
  const density = getItemDensity(category);

  const sprite = generateSymmetricalSprite({
    width: dimensions.width,
    height: dimensions.height,
    palette: colors,
    symmetry,
    density,
    seed
  });

  const symbolName = `item-${category}-${name}-${size}`;

  return {
    sprite,
    spec,
    symbolName
  };
}

/**
 * Get default palette for item category
 */
function getCategoryDefaultPalette(category: ItemCategory): string[] {
  const paletteMap: Record<ItemCategory, string[]> = {
    consumable: ['#e74c3c', '#c0392b', '#a93226', '#922b21', '#7b241c'], // Red tones (potions)
    equipment: ['#95a5a6', '#7f8c8d', '#566573', '#34495e', '#2c3e50'], // Gray/metal tones
    collectible: ['#f39c12', '#f1c40f', '#d4ac0d', '#b7950b', '#9a7d0a'], // Gold tones
    currency: ['#f39c12', '#e67e22', '#d68910', '#ca6f1e', '#b9770e'], // Gold/bronze
    material: ['#8d6e63', '#6d4c41', '#5d4037', '#4e342e', '#3e2723'] // Brown/earth tones
  };

  return paletteMap[category];
}

/**
 * Get symmetry mode for item category
 */
function getItemSymmetry(category: ItemCategory): SymmetryMode {
  const symmetryMap: Record<ItemCategory, SymmetryMode> = {
    consumable: 'vertical', // Bottles/potions are vertically symmetrical
    equipment: 'vertical', // Weapons/armor generally vertical
    collectible: 'quad', // Gems/coins are fully symmetrical
    currency: 'quad', // Coins are fully symmetrical
    material: 'none' // Materials can be asymmetrical (ore chunks, etc.)
  };

  return symmetryMap[category];
}

/**
 * Get pixel density for item category
 */
function getItemDensity(category: ItemCategory): number {
  const densityMap: Record<ItemCategory, number> = {
    consumable: 0.6, // Moderate density
    equipment: 0.7, // Higher density (solid items)
    collectible: 0.5, // Lower density (shiny, open)
    currency: 0.5, // Lower density
    material: 0.65 // Moderate-high density
  };

  return densityMap[category];
}

/**
 * Generate potion (red health potion)
 */
export async function generatePotion(
  type: 'health' | 'mana' | 'stamina' = 'health',
  size: ItemSize = 'medium',
  seed: number = 12345
): Promise<ItemGenerationResult> {
  const colorMap = {
    health: '#e74c3c',
    mana: '#3498db',
    stamina: '#2ecc71'
  };

  return generateItem({
    category: 'consumable',
    name: `${type}-potion`,
    size,
    seed,
    baseColor: colorMap[type]
  });
}

/**
 * Generate weapon
 */
export async function generateWeapon(
  type: 'sword' | 'axe' | 'bow' | 'staff' = 'sword',
  size: ItemSize = 'medium',
  seed: number = 12345
): Promise<ItemGenerationResult> {
  return generateItem({
    category: 'equipment',
    name: `${type}`,
    size,
    seed,
    palette: 'grayscale' // Weapons use metal colors
  });
}

/**
 * Generate gem/collectible
 */
export async function generateGem(
  color: string = '#9b59b6',
  size: ItemSize = 'small',
  seed: number = 12345
): Promise<ItemGenerationResult> {
  return generateItem({
    category: 'collectible',
    name: 'gem',
    size,
    seed,
    baseColor: color
  });
}

/**
 * Generate currency (coins)
 */
export async function generateCoin(
  value: 'copper' | 'silver' | 'gold' = 'gold',
  size: ItemSize = 'small',
  seed: number = 12345
): Promise<ItemGenerationResult> {
  const colorMap = {
    copper: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700'
  };

  return generateItem({
    category: 'currency',
    name: `${value}-coin`,
    size,
    seed,
    baseColor: colorMap[value]
  });
}

/**
 * Generate complete item set for a game
 */
export async function generateGameItemSet(
  seed: number = 12345
): Promise<{
  consumables: ItemGenerationResult[];
  equipment: ItemGenerationResult[];
  collectibles: ItemGenerationResult[];
  currency: ItemGenerationResult[];
}> {
  const consumables: ItemGenerationResult[] = [
    await generatePotion('health', 'medium', seed + 1),
    await generatePotion('mana', 'medium', seed + 2),
    await generatePotion('stamina', 'medium', seed + 3)
  ];

  const equipment: ItemGenerationResult[] = [
    await generateWeapon('sword', 'medium', seed + 10),
    await generateWeapon('axe', 'medium', seed + 11),
    await generateWeapon('bow', 'medium', seed + 12),
    await generateWeapon('staff', 'medium', seed + 13)
  ];

  const collectibles: ItemGenerationResult[] = [
    await generateGem('#9b59b6', 'small', seed + 20), // Purple gem
    await generateGem('#e74c3c', 'small', seed + 21), // Red gem
    await generateGem('#3498db', 'small', seed + 22), // Blue gem
    await generateGem('#2ecc71', 'small', seed + 23)  // Green gem
  ];

  const currency: ItemGenerationResult[] = [
    await generateCoin('gold', 'small', seed + 30),
    await generateCoin('silver', 'small', seed + 31),
    await generateCoin('copper', 'small', seed + 32)
  ];

  return {
    consumables,
    equipment,
    collectibles,
    currency
  };
}
