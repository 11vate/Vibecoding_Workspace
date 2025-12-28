/**
 * Domain Effect Overlay Component
 * Visual effects for battlefield domain control
 */

import React, { useEffect, useRef } from 'react';
import type { PetFamily } from '@/shared/types/family';
import './DomainEffectOverlay.css';

interface DomainEffectOverlayProps {
  activeDomain: PetFamily | null;
  intensity: number; // 0-1
}

export const DomainEffectOverlay: React.FC<DomainEffectOverlayProps> = ({
  activeDomain,
  intensity
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!activeDomain || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (activeDomain) {
        case 'PYRO_KIN':
          drawFireDomain(ctx, canvas.width, canvas.height, time, intensity);
          break;
        case 'AQUA_BORN':
          drawWaterDomain(ctx, canvas.width, canvas.height, time, intensity);
          break;
        case 'TERRA_FORGED':
          drawEarthDomain(ctx, canvas.width, canvas.height, time, intensity);
          break;
        case 'VOLT_STREAM':
          drawLightningDomain(ctx, canvas.width, canvas.height, time, intensity);
          break;
        case 'SHADOW_VEIL':
          drawShadowDomain(ctx, canvas.width, canvas.height, time, intensity);
          break;
        case 'LUMINA':
          drawLightDomain(ctx, canvas.width, canvas.height, time, intensity);
          break;
        case 'AERO_FLIGHT':
          drawWindDomain(ctx, canvas.width, canvas.height, time, intensity);
          break;
        default:
          break;
      }

      time += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeDomain, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="domain-effect-overlay"
      style={{ opacity: intensity * 0.3 }}
    />
  );
};

// Domain effect rendering functions
function drawFireDomain(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number) {
  // Rising embers
  for (let i = 0; i < 20 * intensity; i++) {
    const x = (i * 37 + time * 10) % width;
    const y = height - ((time * 50 + i * 23) % height);
    const size = 2 + Math.sin(time + i) * 2;
    const alpha = Math.sin(time + i) * 0.5 + 0.5;

    ctx.fillStyle = `rgba(255, 69, 0, ${alpha * intensity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Heat waves (wavy gradient overlay)
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `rgba(255, 100, 0, ${0.05 * intensity})`);
  gradient.addColorStop(1, `rgba(255, 69, 0, ${0.1 * intensity})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawWaterDomain(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number) {
  // Water ripples
  for (let i = 0; i < 3; i++) {
    const radius = ((time * 30 + i * 100) % 200) * intensity;
    const alpha = 1 - (radius / 200);
    const centerX = width / 2 + Math.sin(time + i) * 100;
    const centerY = height / 2 + Math.cos(time + i) * 50;

    ctx.strokeStyle = `rgba(0, 191, 255, ${alpha * 0.3 * intensity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Water particles
  for (let i = 0; i < 15 * intensity; i++) {
    const x = (i * 41 + Math.sin(time + i) * 20) % width;
    const y = (i * 29 + time * 20) % height;
    const size = 1 + Math.cos(time + i) * 1.5;
    const alpha = Math.sin(time + i * 2) * 0.3 + 0.3;

    ctx.fillStyle = `rgba(135, 206, 235, ${alpha * intensity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEarthDomain(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number) {
  // Falling rocks/pebbles
  for (let i = 0; i < 10 * intensity; i++) {
    const x = (i * 53 + time * 15) % width;
    const y = ((time * 40 + i * 31) % height);
    const size = 3 + Math.sin(time + i) * 2;
    const rotation = time + i;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = `rgba(139, 69, 19, ${0.6 * intensity})`;
    ctx.fillRect(-size, -size, size * 2, size * 2);
    ctx.restore();
  }
}

function drawLightningDomain(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number) {
  // Lightning flashes (random intervals)
  if (Math.sin(time * 5) > 0.95) {
    ctx.fillStyle = `rgba(255, 255, 0, ${0.2 * intensity})`;
    ctx.fillRect(0, 0, width, height);
  }

  // Electric arcs
  for (let i = 0; i < 5 * intensity; i++) {
    const startX = (i * 127) % width;
    const startY = (i * 83) % height;
    const endX = startX + Math.sin(time + i) * 50;
    const endY = startY + Math.cos(time + i) * 50;

    ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 * intensity})`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#FFD700';

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(
      startX + 20, startY + 10,
      endX - 20, endY - 10,
      endX, endY
    );
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawShadowDomain(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number) {
  // Creeping shadows
  for (let i = 0; i < 8; i++) {
    const x = (i * width / 8) + Math.sin(time + i) * 30;
    const y = height - ((time * 20 + i * 50) % (height + 100));
    const size = 20 + Math.cos(time + i) * 10;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${0.5 * intensity})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }
}

function drawLightDomain(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number) {
  // Floating light orbs
  for (let i = 0; i < 12 * intensity; i++) {
    const x = (i * 67 + Math.sin(time + i) * 50) % width;
    const y = (i * 43 + Math.cos(time + i * 0.5) * 30) % height;
    const size = 3 + Math.sin(time + i) * 2;
    const alpha = Math.sin(time * 2 + i) * 0.3 + 0.5;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    gradient.addColorStop(0, `rgba(255, 248, 220, ${alpha * intensity})`);
    gradient.addColorStop(1, 'rgba(255, 248, 220, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWindDomain(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number) {
  // Wind streaks
  for (let i = 0; i < 15 * intensity; i++) {
    const y = (i * 37) % height;
    const x = ((time * 100 + i * 53) % (width + 100)) - 50;
    const length = 30 + Math.sin(time + i) * 20;
    const alpha = Math.sin(time + i) * 0.3 + 0.3;

    const gradient = ctx.createLinearGradient(x, y, x + length, y);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.5, `rgba(220, 220, 220, ${alpha * intensity})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();
  }
}
