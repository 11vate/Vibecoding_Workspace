/**
 * Notification System - Example Business System
 *
 * Purpose: Handle in-app notifications
 * Priority: 90 (Late in cycle, UI-related)
 */

import { BaseSystem } from './SystemManager';
import { store } from '../state/store';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
  duration: number;
  expired: boolean;
}

export class NotificationSystem extends BaseSystem {
  private notifications: Map<string, Notification> = new Map();
  private nextId: number = 0;

  constructor() {
    super('NotificationSystem', 90);
  }

  initialize(): void {
    console.log('[NotificationSystem] Initialized');
  }

  update(deltaTime: number): void {
    const state = store.getState();

    if (state.paused) {
      return;
    }

    const currentTime = Date.now();

    // Check for expired notifications
    for (const [id, notification] of this.notifications.entries()) {
      if (!notification.expired && currentTime - notification.timestamp > notification.duration) {
        notification.expired = true;
      }
    }

    // Remove expired notifications after grace period
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.expired && currentTime - notification.timestamp > notification.duration + 1000) {
        this.notifications.delete(id);
      }
    }
  }

  cleanup(): void {
    this.notifications.clear();
    console.log('[NotificationSystem] Cleaned up');
  }

  /**
   * Show notification
   */
  show(type: Notification['type'], message: string, duration: number = 3000): string {
    const id = `notification-${this.nextId++}`;

    const notification: Notification = {
      id,
      type,
      message,
      timestamp: Date.now(),
      duration,
      expired: false
    };

    this.notifications.set(id, notification);

    console.log(`[NotificationSystem] ${type.toUpperCase()}: ${message}`);

    return id;
  }

  /**
   * Show info notification
   */
  info(message: string, duration?: number): string {
    return this.show('info', message, duration);
  }

  /**
   * Show success notification
   */
  success(message: string, duration?: number): string {
    return this.show('success', message, duration);
  }

  /**
   * Show warning notification
   */
  warning(message: string, duration?: number): string {
    return this.show('warning', message, duration);
  }

  /**
   * Show error notification
   */
  error(message: string, duration?: number): string {
    return this.show('error', message, duration);
  }

  /**
   * Dismiss notification
   */
  dismiss(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.expired = true;
    }
  }

  /**
   * Get all active notifications
   */
  getActive(): Notification[] {
    const active: Notification[] = [];
    for (const notification of this.notifications.values()) {
      if (!notification.expired) {
        active.push(notification);
      }
    }
    return active;
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.clear();
    console.log('[NotificationSystem] All notifications cleared');
  }
}
