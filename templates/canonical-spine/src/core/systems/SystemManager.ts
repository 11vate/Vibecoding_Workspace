/**
 * System Manager
 *
 * Purpose: Manages all game/app systems with priority ordering
 * Pattern: Entity-Component-System inspired
 * Authority: Tier 1 (Core architecture)
 */

export interface ISystem {
  name: string;
  priority: number; // Lower number = higher priority
  enabled: boolean;

  initialize(): void;
  update(deltaTime: number): void;
  cleanup(): void;
}

export abstract class BaseSystem implements ISystem {
  public name: string;
  public priority: number;
  public enabled: boolean = true;

  constructor(name: string, priority: number = 100) {
    this.name = name;
    this.priority = priority;
  }

  abstract initialize(): void;
  abstract update(deltaTime: number): void;
  abstract cleanup(): void;
}

export class SystemManager {
  private systems: ISystem[] = [];
  private systemMap: Map<string, ISystem> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize all systems
   */
  initialize(): void {
    if (this.initialized) {
      console.warn('SystemManager already initialized');
      return;
    }

    // Register default systems
    this.registerDefaultSystems();

    // Initialize all systems in priority order
    for (const system of this.systems) {
      try {
        system.initialize();
        console.log(`[System] ${system.name} initialized`);
      } catch (error) {
        console.error(`[System] Failed to initialize ${system.name}:`, error);
      }
    }

    this.initialized = true;
    console.log('SystemManager initialized with', this.systems.length, 'systems');
  }

  /**
   * Cleanup all systems
   */
  cleanup(): void {
    // Cleanup in reverse priority order
    const reversedSystems = [...this.systems].reverse();

    for (const system of reversedSystems) {
      try {
        system.cleanup();
        console.log(`[System] ${system.name} cleaned up`);
      } catch (error) {
        console.error(`[System] Failed to cleanup ${system.name}:`, error);
      }
    }

    this.systems = [];
    this.systemMap.clear();
    this.initialized = false;

    console.log('SystemManager cleaned up');
  }

  /**
   * Update all enabled systems
   */
  update(deltaTime: number): void {
    for (const system of this.systems) {
      if (system.enabled) {
        try {
          system.update(deltaTime);
        } catch (error) {
          console.error(`[System] Error updating ${system.name}:`, error);
        }
      }
    }
  }

  /**
   * Register a new system
   */
  registerSystem(system: ISystem): void {
    if (this.systemMap.has(system.name)) {
      console.warn(`[System] System ${system.name} already registered`);
      return;
    }

    this.systems.push(system);
    this.systemMap.set(system.name, system);

    // Re-sort by priority
    this.systems.sort((a, b) => a.priority - b.priority);

    // Initialize if manager is already initialized
    if (this.initialized) {
      system.initialize();
    }

    console.log(`[System] Registered ${system.name} (priority: ${system.priority})`);
  }

  /**
   * Unregister a system
   */
  unregisterSystem(name: string): void {
    const system = this.systemMap.get(name);

    if (!system) {
      console.warn(`[System] System ${name} not found`);
      return;
    }

    // Cleanup system
    system.cleanup();

    // Remove from collections
    this.systems = this.systems.filter(s => s.name !== name);
    this.systemMap.delete(name);

    console.log(`[System] Unregistered ${name}`);
  }

  /**
   * Get system by name
   */
  getSystem(name: string): ISystem | undefined {
    return this.systemMap.get(name);
  }

  /**
   * Enable/disable system
   */
  setSystemEnabled(name: string, enabled: boolean): void {
    const system = this.systemMap.get(name);

    if (!system) {
      console.warn(`[System] System ${name} not found`);
      return;
    }

    system.enabled = enabled;
    console.log(`[System] ${name} ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get count of active systems
   */
  getActiveSystemCount(): number {
    return this.systems.filter(s => s.enabled).length;
  }

  /**
   * Get all systems
   */
  getAllSystems(): ISystem[] {
    return [...this.systems];
  }

  /**
   * Register default systems
   */
  private registerDefaultSystems(): void {
    // Register example systems
    // Add your own systems here

    // Example: Physics system (priority 10)
    // this.registerSystem(new PhysicsSystem());

    // Example: Animation system (priority 50)
    // this.registerSystem(new AnimationSystem());

    // Example: Particle system (priority 90)
    // this.registerSystem(new ParticleSystem());

    console.log('Default systems registered');
  }
}

/**
 * Example System Implementation
 */
export class ExampleSystem extends BaseSystem {
  constructor() {
    super('ExampleSystem', 100);
  }

  initialize(): void {
    console.log('[ExampleSystem] Initialized');
  }

  update(deltaTime: number): void {
    // Update logic here
  }

  cleanup(): void {
    console.log('[ExampleSystem] Cleaned up');
  }
}
