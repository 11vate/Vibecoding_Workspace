/**
 * Rarity system - 7 tiers from Basic to Omega
 */

export enum Rarity {
  BASIC = 0,
  RARE = 1,
  SR = 2,
  LEGENDARY = 3,
  MYTHIC = 4,
  PRISMATIC = 5,
  OMEGA = 6,
}

export interface RarityConfig {
  name: string;
  color: string;
  hpRange: [number, number];
  attackRange: [number, number];
  defenseRange: [number, number];
  speedRange: [number, number];
  passiveCount: number;
  activeCount: number;
  ultimateCount: number;
  summonCost: number;
  dropRate: number;
}

export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  [Rarity.BASIC]: {
    name: 'Basic',
    color: '#808080',
    hpRange: [500, 750],      // Enhanced from [120, 180]
    attackRange: [45, 65],    // Enhanced from [18, 28]
    defenseRange: [35, 50],   // Enhanced from [12, 22]
    speedRange: [60, 80],      // Enhanced from [55, 75]
    passiveCount: 0,
    activeCount: 2,
    ultimateCount: 0,
    summonCost: 50,
    dropRate: 0.45,
  },
  [Rarity.RARE]: {
    name: 'Rare',
    color: '#0088ff',
    hpRange: [850, 1200],     // Enhanced from [200, 280]
    attackRange: [75, 100],   // Enhanced from [35, 50]
    defenseRange: [60, 85],   // Enhanced from [28, 45]
    speedRange: [70, 90],     // Enhanced from [65, 85]
    passiveCount: 1,
    activeCount: 2,
    ultimateCount: 0,
    summonCost: 30,
    dropRate: 0.30,
  },
  [Rarity.SR]: {
    name: 'SR',
    color: '#aa00ff',
    hpRange: [1400, 1900],    // Enhanced from [320, 440]
    attackRange: [120, 160],  // Enhanced from [55, 78]
    defenseRange: [100, 140], // Enhanced from [48, 70]
    speedRange: [80, 100],    // Enhanced from [75, 95]
    passiveCount: 2,
    activeCount: 2,
    ultimateCount: 0,
    summonCost: 20,
    dropRate: 0.15,
  },
  [Rarity.LEGENDARY]: {
    name: 'Legendary',
    color: '#ffaa00',
    hpRange: [2200, 3000],    // Enhanced from [550, 750]
    attackRange: [180, 240],  // Enhanced from [88, 120]
    defenseRange: [160, 220], // Enhanced from [75, 110]
    speedRange: [90, 110],    // Enhanced from [85, 105]
    passiveCount: 2,
    activeCount: 3,
    ultimateCount: 1,
    summonCost: 15,
    dropRate: 0.08,
  },
  [Rarity.MYTHIC]: {
    name: 'Mythic',
    color: '#ff00ff',
    hpRange: [3500, 4800],    // Enhanced from [950, 1300]
    attackRange: [280, 360],  // Enhanced from [140, 185]
    defenseRange: [240, 320], // Enhanced from [120, 165]
    speedRange: [100, 120],   // Enhanced from [95, 115]
    passiveCount: 3,
    activeCount: 3,
    ultimateCount: 1,
    summonCost: 10,
    dropRate: 0.019,
  },
  [Rarity.PRISMATIC]: {
    name: 'Prismatic',
    color: '#ffffff',
    hpRange: [5000, 6500],    // Enhanced from [1400, 1800]
    attackRange: [400, 520],  // Enhanced from [200, 260]
    defenseRange: [360, 480], // Enhanced from [180, 230]
    speedRange: [110, 130],   // Enhanced from [110, 125]
    passiveCount: 4,
    activeCount: 4,
    ultimateCount: 2,
    summonCost: 0,
    dropRate: 0.001,
  },
  [Rarity.OMEGA]: {
    name: 'Omega',
    color: '#ff0080',
    hpRange: [7000, 9000],     // Enhanced from [2000, 2500]
    attackRange: [600, 800],  // Enhanced from [300, 400]
    defenseRange: [500, 700],  // Enhanced from [250, 350]
    speedRange: [130, 150],   // Enhanced from [130, 150]
    passiveCount: 5,
    activeCount: 5,
    ultimateCount: 3,
    summonCost: 0,
    dropRate: 0.0001,
  },
};

export function getRarityInfo(rarity: Rarity): RarityConfig {
  return RARITY_CONFIG[rarity];
}













