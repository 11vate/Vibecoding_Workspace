/**
 * Create minimal valid PNG icons
 * Creates simple colored square PNG files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconDir = path.join(__dirname, '../public/icons');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create a minimal valid PNG using base64
// This is a 1x1 pixel PNG - browsers will scale it
// For proper icons, use the HTML generator
const minimalPNGBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Write minimal placeholder files
// These are valid PNGs but very small - they'll stop the errors
// For proper icons, users should use the HTML generator
const icon192 = Buffer.from(minimalPNGBase64, 'base64');
const icon512 = Buffer.from(minimalPNGBase64, 'base64');

fs.writeFileSync(path.join(iconDir, 'icon-192x192.png'), icon192);
fs.writeFileSync(path.join(iconDir, 'icon-512x512.png'), icon512);

console.log('Created minimal placeholder icon files:');
console.log('- icon-192x192.png');
console.log('- icon-512x512.png');
console.log('');
console.log('Note: These are minimal 1x1 pixel PNGs that will stop the errors.');
console.log('For proper icons, use: http://localhost:3000/icons/icon-generator.html');







