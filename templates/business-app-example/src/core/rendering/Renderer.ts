/**
 * Renderer - Business App Version
 *
 * Purpose: Render business UI
 * Authority: Tier 2 (Core subsystem)
 */

import { AppState } from '../state/store';

export interface RenderOptions {
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  align?: 'left' | 'center' | 'right';
  baseline?: 'top' | 'middle' | 'bottom';
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Resize canvas to window size
   */
  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Main render method
   */
  render(state: AppState, interpolation: number): void {
    this.clear();

    // Render based on current view
    switch (state.ui.currentView) {
      case 'dashboard':
        this.renderDashboard(state);
        break;
      case 'analytics':
        this.renderAnalytics(state);
        break;
      case 'reports':
        this.renderReports(state);
        break;
      case 'settings':
        this.renderSettings(state);
        break;
    }

    // Render sidebar
    if (state.ui.sidebarOpen) {
      this.renderSidebar(state);
    }

    // Render modal if active
    if (state.ui.activeModal) {
      this.renderModal(state);
    }

    // Render debug info
    if (state.debug.enabled || state.debug.showFPS) {
      this.renderDebugInfo(state);
    }
  }

  /**
   * Clear canvas
   */
  private clear(): void {
    this.ctx.fillStyle = '#f5f7fa';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Render dashboard view
   */
  private renderDashboard(state: AppState): void {
    const sidebarWidth = state.ui.sidebarOpen ? 240 : 0;
    const contentX = sidebarWidth + 40;
    const contentWidth = this.canvas.width - sidebarWidth - 80;

    // Header
    this.renderText({
      x: contentX,
      y: 40,
      color: '#2d3748',
      fontSize: 32,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, 'Dashboard');

    // Stats cards
    const cardWidth = (contentWidth - 60) / 4;
    const stats = [
      { label: 'Total Revenue', value: '$245,890', change: '+12.5%', color: '#48bb78' },
      { label: 'Active Users', value: '1,234', change: '+5.2%', color: '#4299e1' },
      { label: 'Conversion Rate', value: '3.24%', change: '-0.3%', color: '#ed8936' },
      { label: 'Avg Order Value', value: '$89.50', change: '+8.1%', color: '#9f7aea' }
    ];

    for (let i = 0; i < stats.length; i++) {
      const x = contentX + i * (cardWidth + 20);
      this.renderStatCard(x, 100, cardWidth, 120, stats[i]);
    }

    // Chart area
    this.renderPanel(contentX, 240, contentWidth, 300, 'Sales Overview');
    this.renderChart(contentX + 20, 290, contentWidth - 40, 230, state);

    // Recent activity
    this.renderPanel(contentX, 560, contentWidth, 200, 'Recent Activity');
    this.renderActivityList(contentX + 20, 610, contentWidth - 40, 130);
  }

  /**
   * Render analytics view
   */
  private renderAnalytics(state: AppState): void {
    const sidebarWidth = state.ui.sidebarOpen ? 240 : 0;
    const contentX = sidebarWidth + 40;

    this.renderText({
      x: contentX,
      y: 40,
      color: '#2d3748',
      fontSize: 32,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, 'Analytics');

    this.renderText({
      x: contentX,
      y: 100,
      color: '#718096',
      fontSize: 16,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, 'Detailed analytics and metrics coming soon...');
  }

  /**
   * Render reports view
   */
  private renderReports(state: AppState): void {
    const sidebarWidth = state.ui.sidebarOpen ? 240 : 0;
    const contentX = sidebarWidth + 40;

    this.renderText({
      x: contentX,
      y: 40,
      color: '#2d3748',
      fontSize: 32,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, 'Reports');

    this.renderText({
      x: contentX,
      y: 100,
      color: '#718096',
      fontSize: 16,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, 'Generate and view reports here...');
  }

  /**
   * Render settings view
   */
  private renderSettings(state: AppState): void {
    const sidebarWidth = state.ui.sidebarOpen ? 240 : 0;
    const contentX = sidebarWidth + 40;

    this.renderText({
      x: contentX,
      y: 40,
      color: '#2d3748',
      fontSize: 32,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, 'Settings');

    this.renderPanel(contentX, 100, 400, 200, 'Application Settings');

    // Theme setting
    this.renderText({
      x: contentX + 20,
      y: 150,
      color: '#2d3748',
      fontSize: 14,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, `Theme: ${state.settings.theme}`);

    // Auto-save setting
    this.renderText({
      x: contentX + 20,
      y: 180,
      color: '#2d3748',
      fontSize: 14,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, `Auto-save: ${state.settings.autoSave ? 'Enabled' : 'Disabled'}`);

    // Refresh interval
    this.renderText({
      x: contentX + 20,
      y: 210,
      color: '#2d3748',
      fontSize: 14,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, `Refresh interval: ${state.settings.refreshInterval / 1000}s`);
  }

  /**
   * Render sidebar
   */
  private renderSidebar(state: AppState): void {
    // Background
    this.renderRect(0, 0, 240, this.canvas.height, '#2d3748', true);

    // Logo area
    this.renderText({
      x: 120,
      y: 30,
      color: '#ffffff',
      fontSize: 20,
      fontFamily: 'sans-serif',
      align: 'center',
      baseline: 'middle'
    }, 'Business App');

    // Navigation items
    const navItems = [
      { label: 'Dashboard', view: 'dashboard', icon: '📊' },
      { label: 'Analytics', view: 'analytics', icon: '📈' },
      { label: 'Reports', view: 'reports', icon: '📋' },
      { label: 'Settings', view: 'settings', icon: '⚙️' }
    ];

    for (let i = 0; i < navItems.length; i++) {
      const y = 80 + i * 50;
      const isActive = state.ui.currentView === navItems[i].view;

      if (isActive) {
        this.renderRect(10, y - 15, 220, 40, '#4299e1', true);
      }

      this.renderText({
        x: 30,
        y: y,
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'sans-serif',
        align: 'left',
        baseline: 'middle'
      }, `${navItems[i].icon}  ${navItems[i].label}`);
    }
  }

  /**
   * Render modal
   */
  private renderModal(state: AppState): void {
    // Overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Modal box
    const modalWidth = 500;
    const modalHeight = 300;
    const modalX = (this.canvas.width - modalWidth) / 2;
    const modalY = (this.canvas.height - modalHeight) / 2;

    this.renderRect(modalX, modalY, modalWidth, modalHeight, '#ffffff', true);
    this.renderRect(modalX, modalY, modalWidth, modalHeight, '#e2e8f0', false, 2);

    // Modal content
    this.renderText({
      x: modalX + modalWidth / 2,
      y: modalY + 40,
      color: '#2d3748',
      fontSize: 20,
      fontFamily: 'sans-serif',
      align: 'center',
      baseline: 'top'
    }, 'Modal Window');
  }

  /**
   * Render debug info
   */
  private renderDebugInfo(state: AppState): void {
    const x = this.canvas.width - 150;
    const y = 20;

    // Background
    this.renderRect(x - 10, y - 10, 140, 80, 'rgba(0, 0, 0, 0.7)', true);

    // FPS
    if (state.debug.showFPS) {
      this.renderText({
        x: x,
        y: y,
        color: '#ffffff',
        fontSize: 14,
        fontFamily: 'monospace',
        align: 'left',
        baseline: 'top'
      }, `FPS: ${state.fps}`);
    }

    // Frame count
    if (state.debug.enabled) {
      this.renderText({
        x: x,
        y: y + 20,
        color: '#ffffff',
        fontSize: 14,
        fontFamily: 'monospace',
        align: 'left',
        baseline: 'top'
      }, `Frame: ${state.frameCount}`);

      this.renderText({
        x: x,
        y: y + 40,
        color: '#ffffff',
        fontSize: 14,
        fontFamily: 'monospace',
        align: 'left',
        baseline: 'top'
      }, `Delta: ${state.deltaTime.toFixed(3)}`);
    }
  }

  /**
   * Render stat card
   */
  private renderStatCard(x: number, y: number, width: number, height: number, stat: any): void {
    // Card background
    this.renderRect(x, y, width, height, '#ffffff', true);
    this.renderRect(x, y, width, height, '#e2e8f0', false, 1);

    // Label
    this.renderText({
      x: x + 20,
      y: y + 20,
      color: '#718096',
      fontSize: 12,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, stat.label);

    // Value
    this.renderText({
      x: x + 20,
      y: y + 50,
      color: '#2d3748',
      fontSize: 24,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, stat.value);

    // Change
    this.renderText({
      x: x + 20,
      y: y + 85,
      color: stat.color,
      fontSize: 14,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, stat.change);
  }

  /**
   * Render panel
   */
  private renderPanel(x: number, y: number, width: number, height: number, title: string): void {
    // Panel background
    this.renderRect(x, y, width, height, '#ffffff', true);
    this.renderRect(x, y, width, height, '#e2e8f0', false, 1);

    // Title
    this.renderText({
      x: x + 20,
      y: y + 20,
      color: '#2d3748',
      fontSize: 16,
      fontFamily: 'sans-serif',
      align: 'left',
      baseline: 'top'
    }, title);
  }

  /**
   * Render chart
   */
  private renderChart(x: number, y: number, width: number, height: number, state: AppState): void {
    // Simple line chart
    const data = [45, 52, 48, 65, 70, 68, 82];
    const maxValue = Math.max(...data);
    const stepX = width / (data.length - 1);

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#4299e1';
    this.ctx.lineWidth = 2;

    for (let i = 0; i < data.length; i++) {
      const px = x + i * stepX;
      const py = y + height - (data[i] / maxValue) * height;

      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }

    this.ctx.stroke();
  }

  /**
   * Render activity list
   */
  private renderActivityList(x: number, y: number, width: number, height: number): void {
    const activities = [
      'User John Doe logged in',
      'Report generated: Q4 Sales',
      'Data export completed',
      'Settings updated'
    ];

    for (let i = 0; i < activities.length; i++) {
      this.renderText({
        x: x,
        y: y + i * 25,
        color: '#4a5568',
        fontSize: 14,
        fontFamily: 'sans-serif',
        align: 'left',
        baseline: 'top'
      }, activities[i]);
    }
  }

  /**
   * Render text
   */
  private renderText(options: RenderOptions, text: string): void {
    this.ctx.save();

    this.ctx.fillStyle = options.color || '#000000';
    this.ctx.font = `${options.fontSize || 16}px ${options.fontFamily || 'sans-serif'}`;
    this.ctx.textAlign = options.align || 'left';
    this.ctx.textBaseline = options.baseline || 'top';

    this.ctx.fillText(text, options.x, options.y);

    this.ctx.restore();
  }

  /**
   * Render rectangle
   */
  private renderRect(x: number, y: number, width: number, height: number, color: string, filled: boolean, lineWidth: number = 1): void {
    this.ctx.save();

    if (filled) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeRect(x, y, width, height);
    }

    this.ctx.restore();
  }

  /**
   * Get canvas
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
