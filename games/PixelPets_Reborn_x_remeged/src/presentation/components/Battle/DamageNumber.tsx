/**
 * Damage Number Component
 * Floating damage/heal numbers with animations
 */

import React, { useEffect, useState } from 'react';
import './DamageNumber.css';

export type DamageType = 'damage' | 'critical' | 'heal' | 'miss' | 'block';

interface DamageNumberProps {
  value: number;
  type: DamageType;
  position: { x: number; y: number };
  onComplete: () => void;
}

export const DamageNumber: React.FC<DamageNumberProps> = ({
  value,
  type,
  position,
  onComplete
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getDisplayText = () => {
    switch (type) {
      case 'damage':
        return `-${value}`;
      case 'critical':
        return `-${value}!`;
      case 'heal':
        return `+${value}`;
      case 'miss':
        return 'MISS';
      case 'block':
        return 'BLOCK';
      default:
        return value.toString();
    }
  };

  return (
    <div
      className={`damage-number ${type} ${visible ? 'visible' : 'hidden'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <span className="damage-text">{getDisplayText()}</span>
    </div>
  );
};

/**
 * Damage Number Manager Component
 * Manages multiple floating damage numbers
 */

interface DamageEvent {
  id: string;
  value: number;
  type: DamageType;
  position: { x: number; y: number };
}

interface DamageNumberManagerProps {
  events: DamageEvent[];
  onEventComplete: (id: string) => void;
}

export const DamageNumberManager: React.FC<DamageNumberManagerProps> = ({
  events,
  onEventComplete
}) => {
  return (
    <div className="damage-number-manager">
      {events.map((event) => (
        <DamageNumber
          key={event.id}
          value={event.value}
          type={event.type}
          position={event.position}
          onComplete={() => onEventComplete(event.id)}
        />
      ))}
    </div>
  );
};
