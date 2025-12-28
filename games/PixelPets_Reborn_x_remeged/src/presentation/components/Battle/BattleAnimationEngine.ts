/**
 * Battle Animation Engine
 * Procedural animation system for battle effects using Canvas API
 */

import type { Ability } from '@/domain/entities/Ability';
import type { Pet } from '@/domain/entities/Pet';

interface Position {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  rotation?: number;
  rotationSpeed?: number;
}

interface SpriteState {
  image: HTMLImageElement | null;
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
}

export class BattleAnimationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprites: Map<string, SpriteState> = new Map();
  private particles: Particle[] = [];
  private animationFrameId: number | null = null;
  private isAnimating: boolean = false;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    const context = canvasElement.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.ctx = context;
    this.setupCanvas();
  }

  private setupCanvas(): void {
    // Set canvas to match container size
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // Enable high-DPI rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Load sprite for a pet (placeholder implementation)
   * In production, would load from generated sprites
   */
  private async loadSprite(petId: string, state: string): Promise<SpriteState> {
    const key = `${petId}-${state}`;
    if (this.sprites.has(key)) {
      return this.sprites.get(key)!;
    }

    // Placeholder: Create colored rectangle representing sprite
    const spriteState: SpriteState = {
      image: null,
      x: 0,
      y: 0,
      width: 128,
      height: 128,
      alpha: 1
    };

    this.sprites.set(key, spriteState);
    return spriteState;
  }

  /**
   * Main attack animation sequence
   */
  public async playAttackAnimation(
    attacker: Pet,
    defender: Pet,
    ability: Ability,
    attackerPos: Position,
    defenderPos: Position,
    damage: number
  ): Promise<void> {
    try {
      // 1. Load sprites
      const attackerSprite = await this.loadSprite(attacker.id as string, 'attack');
      const defenderSprite = await this.loadSprite(defender.id as string, 'hit');

      attackerSprite.x = attackerPos.x;
      attackerSprite.y = attackerPos.y;
      defenderSprite.x = defenderPos.x;
      defenderSprite.y = defenderPos.y;

      // 2. Animate attacker movement (slide forward)
      await this.slideSprite(attackerSprite, { x: 50, y: 0 }, 200);

      // 3. Play ability effect (procedural particles)
      await this.playAbilityEffect(ability, defenderPos);

      // 4. Flash defender (hit reaction)
      await this.flashSprite(defenderSprite, 3, 100);

      // 5. Show damage number
      await this.showDamageNumber(damage, defenderPos);

      // 6. Return attacker to original position
      await this.slideSprite(attackerSprite, { x: -50, y: 0 }, 200);

    } catch (error) {
      console.error('Animation failed:', error);
    }
  }

  /**
   * Slide sprite animation
   */
  private async slideSprite(sprite: SpriteState, offset: Position, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const startX = sprite.x;
      const startY = sprite.y;
      const targetX = sprite.x + offset.x;
      const targetY = sprite.y + offset.y;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);

        sprite.x = startX + (targetX - startX) * eased;
        sprite.y = startY + (targetY - startY) * eased;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          sprite.x = targetX;
          sprite.y = targetY;
          resolve();
        }
      };

      animate();
    });
  }

  /**
   * Flash sprite (hit reaction)
   */
  private async flashSprite(sprite: SpriteState, count: number, interval: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      sprite.alpha = 0.3;
      await this.sleep(interval / 2);
      sprite.alpha = 1;
      await this.sleep(interval / 2);
    }
  }

  /**
   * Play ability effect based on ability tags
   */
  private async playAbilityEffect(ability: Ability, targetPos: Position): Promise<void> {
    const tags = ability.tags;

    if (tags.includes('fire') || tags.includes('pyro')) {
      await this.fireParticles(targetPos, 30, 300);
    } else if (tags.includes('ice') || tags.includes('frost')) {
      await this.iceShards(targetPos, 12, 400);
    } else if (tags.includes('lightning') || tags.includes('electric')) {
      await this.lightningBolt(targetPos, 200);
    } else if (tags.includes('poison')) {
      await this.poisonBubbles(targetPos, 20, 400);
    } else if (tags.includes('shadow') || tags.includes('dark')) {
      await this.shadowTendrils(targetPos, 8, 500);
    } else if (tags.includes('healing') || tags.includes('light')) {
      await this.healingSparkles(targetPos, 25, 350);
    } else {
      // Default impact effect
      await this.impactWave(targetPos, 300);
    }
  }

  /**
   * Fire particle effect
   */
  private async fireParticles(pos: Position, count: number, duration: number): Promise<void> {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 3;

      particles.push({
        x: pos.x,
        y: pos.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Upward bias
        life: duration,
        maxLife: duration,
        size: 4 + Math.random() * 6,
        color: Math.random() > 0.5 ? '#FF4500' : '#FF8C00',
        alpha: 1
      });
    }

    this.particles.push(...particles);
    this.startParticleAnimation();
    await this.sleep(duration);
  }

  /**
   * Ice shard effect
   */
  private async iceShards(pos: Position, count: number, duration: number): Promise<void> {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 3 + Math.random() * 2;

      particles.push({
        x: pos.x,
        y: pos.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: duration,
        maxLife: duration,
        size: 6 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#00BFFF' : '#87CEEB',
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }

    this.particles.push(...particles);
    this.startParticleAnimation();
    await this.sleep(duration);
  }

  /**
   * Lightning bolt effect
   */
  private async lightningBolt(pos: Position, duration: number): Promise<void> {
    const startTime = Date.now();
    const segments = 8;

    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
          resolve();
          return;
        }

        // Draw lightning bolt
        this.ctx.save();
        this.ctx.strokeStyle = '#FFFF00';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#FFFF00';

        this.ctx.beginPath();
        let x = pos.x;
        let y = pos.y - 100;

        this.ctx.moveTo(x, y);

        for (let i = 0; i < segments; i++) {
          x += (Math.random() - 0.5) * 30;
          y += 100 / segments;
          this.ctx.lineTo(x, y);
        }

        this.ctx.stroke();
        this.ctx.restore();

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Poison bubbles effect
   */
  private async poisonBubbles(pos: Position, count: number, duration: number): Promise<void> {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30;

      particles.push({
        x: pos.x + Math.cos(angle) * distance,
        y: pos.y + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -1 - Math.random() * 1.5, // Float upward
        life: duration,
        maxLife: duration,
        size: 3 + Math.random() * 5,
        color: Math.random() > 0.5 ? '#00FF00' : '#32CD32',
        alpha: 0.8
      });
    }

    this.particles.push(...particles);
    this.startParticleAnimation();
    await this.sleep(duration);
  }

  /**
   * Shadow tendrils effect
   */
  private async shadowTendrils(pos: Position, count: number, duration: number): Promise<void> {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1.5 + Math.random() * 1;

      particles.push({
        x: pos.x,
        y: pos.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: duration,
        maxLife: duration,
        size: 8 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#1a1a1a' : '#333333',
        alpha: 0.7,
        rotation: angle,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    }

    this.particles.push(...particles);
    this.startParticleAnimation();
    await this.sleep(duration);
  }

  /**
   * Healing sparkles effect
   */
  private async healingSparkles(pos: Position, count: number, duration: number): Promise<void> {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 40;

      particles.push({
        x: pos.x + Math.cos(angle) * distance,
        y: pos.y + Math.sin(angle) * distance,
        vx: 0,
        vy: -2 - Math.random() * 1,
        life: duration,
        maxLife: duration,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFF8DC',
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3
      });
    }

    this.particles.push(...particles);
    this.startParticleAnimation();
    await this.sleep(duration);
  }

  /**
   * Impact wave effect
   */
  private async impactWave(pos: Position, duration: number): Promise<void> {
    const startTime = Date.now();
    const maxRadius = 60;

    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
          resolve();
          return;
        }

        const progress = elapsed / duration;
        const radius = maxRadius * progress;
        const alpha = 1 - progress;

        this.ctx.save();
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Show damage number
   */
  private async showDamageNumber(damage: number, pos: Position): Promise<void> {
    const startTime = Date.now();
    const duration = 600;
    const startY = pos.y;
    const targetY = pos.y - 40;

    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
          resolve();
          return;
        }

        const progress = elapsed / duration;
        const y = startY + (targetY - startY) * progress;
        const alpha = 1 - progress;

        this.ctx.save();
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = 'center';
        this.ctx.strokeText(`-${damage}`, pos.x, y);
        this.ctx.fillText(`-${damage}`, pos.x, y);
        this.ctx.restore();

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Particle animation loop
   */
  private startParticleAnimation(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;

    const animate = () => {
      if (this.particles.length === 0) {
        this.isAnimating = false;
        return;
      }

      // Update particles
      this.particles = this.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 16; // Assume 60fps
        p.alpha = p.life / p.maxLife;

        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }

        // Apply gravity for some particles
        if (p.vy < 5) {
          p.vy += 0.1;
        }

        return p.life > 0;
      });

      // Render particles
      this.ctx.save();
      this.particles.forEach(p => {
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;

        if (p.rotation !== undefined) {
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rotation);
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          this.ctx.restore();
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
      });
      this.ctx.restore();

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Animate HP bar
   */
  public async animateHPBar(
    currentHP: number,
    targetHP: number,
    maxHP: number,
    barElement: HTMLElement,
    duration: number
  ): Promise<void> {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
          // Set final value
          const percentage = (targetHP / maxHP) * 100;
          barElement.style.width = `${percentage}%`;
          resolve();
          return;
        }

        const progress = elapsed / duration;
        const current = currentHP + (targetHP - currentHP) * progress;
        const percentage = (current / maxHP) * 100;
        barElement.style.width = `${percentage}%`;

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Clear all animations
   */
  public clear(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.particles = [];
    this.isAnimating = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Helper: Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.clear();
    this.sprites.clear();
  }
}
