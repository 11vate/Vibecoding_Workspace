/**
 * Create simple placeholder PWA icons
 * This script creates minimal valid PNG files for the PWA manifest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal valid 1x1 PNG (transparent)
// We'll create a simple colored square
const createMinimalPNG = (size, color = '#1a1a2e') => {
  // For a proper PNG, we'd need a library
  // For now, create a simple base64-encoded minimal PNG
  // This is a 1x1 red pixel PNG - we'll scale it conceptually
  
  // Actually, let's create a proper approach: use a simple data structure
  // Since we can't easily create PNGs without a library, let's create
  // a note that icons need to be created manually or use a tool
  
  return null; // Placeholder
};

const iconDir = path.join(__dirname, '../public/icons');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create a simple HTML file that users can open to generate icons
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>PWA Icon Generator</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #1a1a2e; color: #fff; }
    canvas { border: 2px solid #00ffff; margin: 10px; background: #1a1a2e; }
    button { padding: 10px 20px; margin: 10px; background: #00ffff; color: #1a1a2e; border: none; cursor: pointer; font-weight: bold; }
    button:hover { background: #00cccc; }
    .container { text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Pixel Pets PWA Icon Generator</h1>
    <p>Click the buttons below to generate and download the icon files.</p>
    
    <canvas id="canvas192" width="192" height="192"></canvas>
    <canvas id="canvas512" width="512" height="512"></canvas>
    
    <br>
    <button onclick="generateIcon(192)">Generate & Download 192x192</button>
    <button onclick="generateIcon(512)">Generate & Download 512x512</button>
    <button onclick="generateBoth()">Generate Both</button>
  </div>
  
  <script>
    function drawIcon(canvas, size) {
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, size, size);
      
      // Border
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = size * 0.02;
      ctx.strokeRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8);
      
      // Simple "PP" text
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold ' + Math.floor(size * 0.25) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PP', size / 2, size / 2);
      
      // Add small decorative elements
      ctx.fillStyle = '#00ffff';
      const dotSize = size * 0.05;
      ctx.beginPath();
      ctx.arc(size * 0.25, size * 0.25, dotSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size * 0.75, size * 0.75, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    function generateIcon(size) {
      const canvas = document.getElementById('canvas' + size);
      drawIcon(canvas, size);
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'icon-' + size + 'x' + size + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Downloaded icon-' + size + 'x' + size + '.png');
      }, 'image/png');
    }
    
    function generateBoth() {
      generateIcon(192);
      setTimeout(() => generateIcon(512), 500);
    }
    
    // Draw icons on load
    window.onload = () => {
      drawIcon(document.getElementById('canvas192'), 192);
      drawIcon(document.getElementById('canvas512'), 512);
    };
  </script>
</body>
</html>`;

// Write the HTML generator
fs.writeFileSync(path.join(iconDir, 'icon-generator.html'), htmlContent);

console.log('Icon generator HTML created at: public/icons/icon-generator.html');
console.log('Open this file in a browser to generate the icon files.');
console.log('Alternatively, create icon-192x192.png and icon-512x512.png manually.');

// For now, let's also update the vite config to make icons optional in dev mode
// Actually, let's create a simple workaround by making the manifest icons optional







