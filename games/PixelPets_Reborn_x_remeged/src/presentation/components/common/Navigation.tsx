/**
 * Navigation Component
 * Main navigation menu for the game
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/collection', label: 'Collection' },
    { path: '/summon', label: 'Summon' },
    { path: '/fusion', label: 'Fusion Lab' },
    { path: '/battle', label: 'Battle' },
    { path: '/dungeons', label: 'Dungeons' },
    { path: '/teams', label: 'Teams' },
    { path: '/stones', label: 'Stones' },
  ];

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <div className="navigation__logo">Pixel Pets: Remeged</div>
        <ul className="navigation__list">
          {navItems.map((item) => (
            <li key={item.path} className="navigation__item">
              <Link
                to={item.path}
                className={`navigation__link ${
                  location.pathname === item.path ? 'navigation__link--active' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

