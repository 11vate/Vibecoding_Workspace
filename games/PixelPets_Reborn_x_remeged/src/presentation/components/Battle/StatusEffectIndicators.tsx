/**
 * Status Effect Indicators Component
 * Visual indicators for active status effects on pets
 */

import React from 'react';
import './StatusEffectIndicators.css';

export type StatusEffect =
  | 'burn'
  | 'poison'
  | 'freeze'
  | 'stun'
  | 'shield'
  | 'regen'
  | 'buff'
  | 'debuff'
  | 'confusion'
  | 'sleep';

interface StatusEffectIndicatorsProps {
  activeEffects: Array<{
    type: StatusEffect;
    stacks?: number;
    duration?: number;
  }>;
  position: 'top' | 'bottom';
}

export const StatusEffectIndicators: React.FC<StatusEffectIndicatorsProps> = ({
  activeEffects,
  position
}) => {
  if (activeEffects.length === 0) return null;

  return (
    <div className={`status-effect-indicators ${position}`}>
      {activeEffects.map((effect, index) => (
        <div key={`${effect.type}-${index}`} className={`status-effect ${effect.type}`}>
          <span className="status-icon">{getStatusIcon(effect.type)}</span>
          {effect.stacks && effect.stacks > 1 && (
            <span className="status-stacks">×{effect.stacks}</span>
          )}
          {effect.duration && (
            <div className="status-duration-bar">
              <div
                className="duration-fill"
                style={{ width: `${(effect.duration / 3) * 100}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

function getStatusIcon(type: StatusEffect): string {
  const icons: Record<StatusEffect, string> = {
    burn: '🔥',
    poison: '☠️',
    freeze: '❄️',
    stun: '⚡',
    shield: '🛡️',
    regen: '💚',
    buff: '⬆️',
    debuff: '⬇️',
    confusion: '❓',
    sleep: '💤'
  };

  return icons[type] || '❔';
}
