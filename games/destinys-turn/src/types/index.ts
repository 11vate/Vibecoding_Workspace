export type Coordinate = {
  x: number;
  y: number;
};

export type PlayerId = string;
export type ThemeType = 'NORMAL' | 'WATER' | 'FIRE' | 'ICE' | 'JUNGLE' | 'CLOCKWORK' | 'VOID';

export interface Player {
  id: PlayerId;
  name: string;
  position: number; // Index on the Circle Board (0-39)
  inventory: Relic[];
  stats: {
    movementMod: number;
    luck: number;
  };
  color: string;
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  effectId: string; // ID for the effect logic in RelicRegistry
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY' | 'CURSED';
  icon?: string; // Emoji or asset path
}

export interface Tile {
  id: string;
  position: Coordinate;
  type: 'EMPTY' | 'TERRAIN' | 'OBSTACLE' | 'EVENT' | 'BOSS_LAIR';
  themeState: ThemeType; // The tile's current elemental state
  isLocked: boolean; // Cannot be changed by Master Dice
  contents: WorldObject[];
}

export interface WorldObject {
  id: string;
  type: 'PLAYER_TOKEN' | 'BOSS' | 'RABBIT' | 'RELIC_DROP' | 'HAZARD';
  name: string;
}

export interface Boss {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  theme: ThemeType;
  position: Coordinate;
  phase: number;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'INFO' | 'EVENT' | 'COMBAT' | 'DIALOGUE';
  timestamp: number;
}

export interface GameEvent {
  id: string;
  type: 'THEME_CHANGE' | 'BOSS_SPAWN' | 'FLOOD' | 'FREEZE' | 'RABBIT_MOVE';
  payload: any;
}

export interface ThemeLogic {
  id: ThemeType;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    bg: string;
  };
  onTurnStart: (gameState: GameState) => Partial<GameState>;
}

export interface GameState {
  // World State
  status: 'PLAYING' | 'WON' | 'LOST';
  activeTheme: ThemeType;
  turnCount: number;
  isNight: boolean; // Day/Night cycle

  // Boards
  circleBoardSize: number; // e.g., 40 spaces
  squareGrid: Tile[][]; // 8x8 Grid

  // Entities
  players: Record<PlayerId, Player>;
  activePlayerId: PlayerId;
  bosses: Boss[];
  rabbit: {
    position: Coordinate;
    isCaught: boolean;
    isVisible: boolean;
  };

  // Systems
  messageLog: LogEntry[];
  reactionQueue: GameEvent[]; // For resolving chain reactions
  activeRelicId: string | null; // The relic currently being held for placement
}
