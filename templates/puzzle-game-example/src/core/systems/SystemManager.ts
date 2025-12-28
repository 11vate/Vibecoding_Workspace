/**
 * System Manager - Puzzle Game Version
 *
 * Purpose: Manage and orchestrate systems
 * Authority: Tier 2 (Core subsystem)
 */

export interface ISystem {
  name: string;
  priority: number;
  enabled: boolean;
  initialize(): void;
  update(deltaTime: number): void;
  cleanup(): void;
}

export abstract class BaseSystem implements ISystem {
  public name: string;
  public priority: number;
  public enabled: boolean = true;

  constructor(name: string, priority: number) {
    this.name = name;
    this.priority = priority;
  }

  abstract initialize(): void;
  abstract update(deltaTime: number): void;
  abstract cleanup(): void;
}

export class SystemManager {
  private systems: ISystem[] = [];

  registerSystem(system: ISystem): void {
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
    console.log(`[SystemManager] Registered system: ${system.name} (priority: ${system.priority})`);
  }

  initialize(): void {
    for (const system of this.systems) {
      system.initialize();
    }
    console.log('[SystemManager] All systems initialized');
  }

  update(deltaTime: number): void {
    for (const system of this.systems) {
      if (system.enabled) {
        system.update(deltaTime);
      }
    }
  }

  cleanup(): void {
    for (const system of this.systems) {
      system.cleanup();
    }
    console.log('[SystemManager] All systems cleaned up');
  }

  getSystem<T extends ISystem>(name: string): T | undefined {
    return this.systems.find(s => s.name === name) as T | undefined;
  }

  enableSystem(name: string): void {
    const system = this.getSystem(name);
    if (system) {
      system.enabled = true;
      console.log(`[SystemManager] Enabled system: ${name}`);
    }
  }

  disableSystem(name: string): void {
    const system = this.getSystem(name);
    if (system) {
      system.enabled = false;
      console.log(`[SystemManager] Disabled system: ${name}`);
    }
  }
}
