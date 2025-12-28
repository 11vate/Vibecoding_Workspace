/**
 * SVG Generator - Code-based SVG icon generation
 *
 * Purpose: Generate scalable vector icons programmatically
 * Authority: Tier 2 (Mandatory for vector generation)
 * Use: Icons, symbols, scalable UI elements
 */

export interface SVGConfig {
  size: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

/**
 * Generate SVG icon by name
 */
export function generateIcon(name: string, config: SVGConfig): string {
  const iconGenerators: Record<string, (config: SVGConfig) => string> = {
    save: generateSaveIcon,
    load: generateLoadIcon,
    settings: generateSettingsIcon,
    menu: generateMenuIcon,
    close: generateCloseIcon,
    check: generateCheckIcon,
    cross: generateCrossIcon,
    plus: generatePlusIcon,
    minus: generateMinusIcon,
    arrow: generateArrowIcon,
    arrowLeft: generateArrowLeftIcon,
    arrowRight: generateArrowRightIcon,
    arrowUp: generateArrowUpIcon,
    arrowDown: generateArrowDownIcon,
    home: generateHomeIcon,
    user: generateUserIcon,
    search: generateSearchIcon,
    play: generatePlayIcon,
    pause: generatePauseIcon,
    stop: generateStopIcon,
    heart: generateHeartIcon,
    star: generateStarIcon
  };

  const generator = iconGenerators[name];
  if (!generator) {
    // Default to placeholder circle
    return wrapSVG(config.size, `<circle cx="${config.size/2}" cy="${config.size/2}" r="${config.size/3}" fill="${config.color || '#000000'}" />`);
  }

  return generator(config);
}

/**
 * Wrap SVG content in SVG tag
 */
function wrapSVG(size: number, content: string): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
}

// Icon generators

function generateSaveIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <rect x="${size * 0.2}" y="${size * 0.15}" width="${size * 0.6}" height="${size * 0.7}"
          fill="none" stroke="${color}" stroke-width="2"/>
    <rect x="${size * 0.2}" y="${size * 0.15}" width="${size * 0.6}" height="${size * 0.2}"
          fill="${color}"/>
    <rect x="${size * 0.4}" y="${size * 0.55}" width="${size * 0.2}" height="${size * 0.3}"
          fill="${color}"/>
  `;
  return wrapSVG(size, content);
}

function generateLoadIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.5} ${size * 0.2} L ${size * 0.5} ${size * 0.6} M ${size * 0.3} ${size * 0.4} L ${size * 0.5} ${size * 0.6} L ${size * 0.7} ${size * 0.4}"
          stroke="${color}" stroke-width="2" fill="none"/>
    <rect x="${size * 0.2}" y="${size * 0.6}" width="${size * 0.6}" height="${size * 0.2}"
          fill="none" stroke="${color}" stroke-width="2"/>
  `;
  return wrapSVG(size, content);
}

function generateSettingsIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.15;

  let content = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="2"/>`;

  // Add 6 teeth around the gear
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    const x1 = cx + Math.cos(angle) * (r + 2);
    const y1 = cy + Math.sin(angle) * (r + 2);
    const x2 = cx + Math.cos(angle) * (size * 0.4);
    const y2 = cy + Math.sin(angle) * (size * 0.4);
    content += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"/>`;
  }

  return wrapSVG(size, content);
}

function generateMenuIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <line x1="${size * 0.2}" y1="${size * 0.3}" x2="${size * 0.8}" y2="${size * 0.3}" stroke="${color}" stroke-width="2"/>
    <line x1="${size * 0.2}" y1="${size * 0.5}" x2="${size * 0.8}" y2="${size * 0.5}" stroke="${color}" stroke-width="2"/>
    <line x1="${size * 0.2}" y1="${size * 0.7}" x2="${size * 0.8}" y2="${size * 0.7}" stroke="${color}" stroke-width="2"/>
  `;
  return wrapSVG(size, content);
}

function generateCloseIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <line x1="${size * 0.25}" y1="${size * 0.25}" x2="${size * 0.75}" y2="${size * 0.75}" stroke="${color}" stroke-width="2"/>
    <line x1="${size * 0.75}" y1="${size * 0.25}" x2="${size * 0.25}" y2="${size * 0.75}" stroke="${color}" stroke-width="2"/>
  `;
  return wrapSVG(size, content);
}

function generateCheckIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.2} ${size * 0.5} L ${size * 0.4} ${size * 0.7} L ${size * 0.8} ${size * 0.3}"
          stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  return wrapSVG(size, content);
}

function generateCrossIcon(config: SVGConfig): string {
  return generateCloseIcon(config);
}

function generatePlusIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <line x1="${size * 0.5}" y1="${size * 0.2}" x2="${size * 0.5}" y2="${size * 0.8}" stroke="${color}" stroke-width="2"/>
    <line x1="${size * 0.2}" y1="${size * 0.5}" x2="${size * 0.8}" y2="${size * 0.5}" stroke="${color}" stroke-width="2"/>
  `;
  return wrapSVG(size, content);
}

function generateMinusIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <line x1="${size * 0.2}" y1="${size * 0.5}" x2="${size * 0.8}" y2="${size * 0.5}" stroke="${color}" stroke-width="2"/>
  `;
  return wrapSVG(size, content);
}

function generateArrowIcon(config: SVGConfig): string {
  return generateArrowRightIcon(config);
}

function generateArrowLeftIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.7} ${size * 0.5} L ${size * 0.3} ${size * 0.5} M ${size * 0.3} ${size * 0.5} L ${size * 0.45} ${size * 0.35} M ${size * 0.3} ${size * 0.5} L ${size * 0.45} ${size * 0.65}"
          stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  return wrapSVG(size, content);
}

function generateArrowRightIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.3} ${size * 0.5} L ${size * 0.7} ${size * 0.5} M ${size * 0.7} ${size * 0.5} L ${size * 0.55} ${size * 0.35} M ${size * 0.7} ${size * 0.5} L ${size * 0.55} ${size * 0.65}"
          stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  return wrapSVG(size, content);
}

function generateArrowUpIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.5} ${size * 0.7} L ${size * 0.5} ${size * 0.3} M ${size * 0.5} ${size * 0.3} L ${size * 0.35} ${size * 0.45} M ${size * 0.5} ${size * 0.3} L ${size * 0.65} ${size * 0.45}"
          stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  return wrapSVG(size, content);
}

function generateArrowDownIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.5} ${size * 0.3} L ${size * 0.5} ${size * 0.7} M ${size * 0.5} ${size * 0.7} L ${size * 0.35} ${size * 0.55} M ${size * 0.5} ${size * 0.7} L ${size * 0.65} ${size * 0.55}"
          stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  return wrapSVG(size, content);
}

function generateHomeIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.5} ${size * 0.2} L ${size * 0.8} ${size * 0.5} L ${size * 0.8} ${size * 0.8} L ${size * 0.2} ${size * 0.8} L ${size * 0.2} ${size * 0.5} Z"
          fill="none" stroke="${color}" stroke-width="2"/>
    <rect x="${size * 0.4}" y="${size * 0.55}" width="${size * 0.2}" height="${size * 0.25}" fill="${color}"/>
  `;
  return wrapSVG(size, content);
}

function generateUserIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <circle cx="${size * 0.5}" cy="${size * 0.35}" r="${size * 0.15}" fill="none" stroke="${color}" stroke-width="2"/>
    <path d="M ${size * 0.25} ${size * 0.75} Q ${size * 0.5} ${size * 0.55} ${size * 0.75} ${size * 0.75}"
          fill="none" stroke="${color}" stroke-width="2"/>
  `;
  return wrapSVG(size, content);
}

function generateSearchIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <circle cx="${size * 0.4}" cy="${size * 0.4}" r="${size * 0.2}" fill="none" stroke="${color}" stroke-width="2"/>
    <line x1="${size * 0.55}" y1="${size * 0.55}" x2="${size * 0.75}" y2="${size * 0.75}" stroke="${color}" stroke-width="2"/>
  `;
  return wrapSVG(size, content);
}

function generatePlayIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.3} ${size * 0.2} L ${size * 0.3} ${size * 0.8} L ${size * 0.7} ${size * 0.5} Z" fill="${color}"/>
  `;
  return wrapSVG(size, content);
}

function generatePauseIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <rect x="${size * 0.3}" y="${size * 0.2}" width="${size * 0.15}" height="${size * 0.6}" fill="${color}"/>
    <rect x="${size * 0.55}" y="${size * 0.2}" width="${size * 0.15}" height="${size * 0.6}" fill="${color}"/>
  `;
  return wrapSVG(size, content);
}

function generateStopIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <rect x="${size * 0.25}" y="${size * 0.25}" width="${size * 0.5}" height="${size * 0.5}" fill="${color}"/>
  `;
  return wrapSVG(size, content);
}

function generateHeartIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const content = `
    <path d="M ${size * 0.5} ${size * 0.75} Q ${size * 0.25} ${size * 0.5} ${size * 0.25} ${size * 0.35} Q ${size * 0.25} ${size * 0.2} ${size * 0.4} ${size * 0.2} Q ${size * 0.5} ${size * 0.2} ${size * 0.5} ${size * 0.3} Q ${size * 0.5} ${size * 0.2} ${size * 0.6} ${size * 0.2} Q ${size * 0.75} ${size * 0.2} ${size * 0.75} ${size * 0.35} Q ${size * 0.75} ${size * 0.5} ${size * 0.5} ${size * 0.75} Z"
          fill="${color}"/>
  `;
  return wrapSVG(size, content);
}

function generateStarIcon(config: SVGConfig): string {
  const { size, color = '#000000' } = config;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.4;
  const innerR = size * 0.2;
  const points = 5;

  let path = 'M ';
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += `${x} ${y} `;
    if (i < points * 2 - 1) path += 'L ';
  }
  path += 'Z';

  return wrapSVG(size, `<path d="${path}" fill="${color}"/>`);
}

/**
 * List all available icons
 */
export function listIcons(): string[] {
  return [
    'save', 'load', 'settings', 'menu', 'close', 'check', 'cross',
    'plus', 'minus', 'arrow', 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown',
    'home', 'user', 'search', 'play', 'pause', 'stop', 'heart', 'star'
  ];
}
