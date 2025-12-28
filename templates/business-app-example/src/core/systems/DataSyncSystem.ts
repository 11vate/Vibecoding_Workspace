/**
 * Data Sync System - Example Business System
 *
 * Purpose: Handle data synchronization
 * Priority: 20 (After core updates)
 */

import { BaseSystem } from './SystemManager';
import { store, ActionType } from '../state/store';

export class DataSyncSystem extends BaseSystem {
  private syncInterval: number = 0;
  private nextSync: number = 0;

  constructor(syncIntervalSeconds: number = 60) {
    super('DataSyncSystem', 20);
    this.syncInterval = syncIntervalSeconds;
  }

  initialize(): void {
    this.nextSync = this.syncInterval;
    console.log(`[DataSyncSystem] Initialized with ${this.syncInterval}s sync interval`);
  }

  update(deltaTime: number): void {
    const state = store.getState();

    if (state.paused) {
      return;
    }

    this.nextSync -= deltaTime;

    if (this.nextSync <= 0) {
      this.syncData();
      this.nextSync = this.syncInterval;
    }
  }

  cleanup(): void {
    console.log('[DataSyncSystem] Cleaned up');
  }

  /**
   * Sync data
   */
  private syncData(): void {
    const state = store.getState();

    // Generate mock data
    const mockData = this.generateMockData();

    // Dispatch data loaded action
    store.dispatch({
      type: ActionType.DATA_LOADED,
      payload: mockData
    });

    if (state.debug.logLevel === 'info' || state.debug.logLevel === 'debug') {
      console.log('[DataSyncSystem] Data synced:', mockData.length, 'records');
    }
  }

  /**
   * Generate mock data
   */
  private generateMockData(): any[] {
    const count = 10 + Math.floor(Math.random() * 20);
    const data = [];

    for (let i = 0; i < count; i++) {
      data.push({
        id: `item-${i}`,
        name: `Item ${i}`,
        value: Math.floor(Math.random() * 1000),
        timestamp: Date.now()
      });
    }

    return data;
  }

  /**
   * Force sync
   */
  forceSync(): void {
    this.syncData();
    this.nextSync = this.syncInterval;
  }

  /**
   * Set sync interval
   */
  setSyncInterval(seconds: number): void {
    this.syncInterval = seconds;
    console.log(`[DataSyncSystem] Sync interval set to ${seconds}s`);
  }
}
