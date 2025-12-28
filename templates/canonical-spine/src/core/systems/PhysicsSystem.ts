/**
 * Physics System - Example System Implementation
 *
 * Purpose: Handle physics simulation
 * Priority: 10 (Early in update cycle)
 */

import { BaseSystem } from './SystemManager';
import { store } from '../state/store';

export class PhysicsSystem extends BaseSystem {
  private gravity: number = 9.8;
  private entities: PhysicsEntity[] = [];

  constructor() {
    super('PhysicsSystem', 10);
  }

  initialize(): void {
    console.log('[PhysicsSystem] Initialized with gravity', this.gravity);
  }

  update(deltaTime: number): void {
    const state = store.getState();

    if (state.paused) {
      return;
    }

    // Update all physics entities
    for (const entity of this.entities) {
      // Apply gravity
      entity.velocity.y += this.gravity * deltaTime;

      // Update position
      entity.position.x += entity.velocity.x * deltaTime;
      entity.position.y += entity.velocity.y * deltaTime;

      // Simple ground collision
      if (entity.position.y > 500) {
        entity.position.y = 500;
        entity.velocity.y = 0;
      }
    }
  }

  cleanup(): void {
    this.entities = [];
    console.log('[PhysicsSystem] Cleaned up');
  }

  /**
   * Add entity to physics simulation
   */
  addEntity(entity: PhysicsEntity): void {
    this.entities.push(entity);
  }

  /**
   * Remove entity from physics simulation
   */
  removeEntity(entity: PhysicsEntity): void {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }

  /**
   * Get all physics entities
   */
  getEntities(): PhysicsEntity[] {
    return [...this.entities];
  }
}

export interface PhysicsEntity {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  mass: number;
}
