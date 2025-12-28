#!/usr/bin/env node
/**
 * Verify Stable Diffusion Setup
 * Checks if all prerequisites and components are properly installed
 */

import { existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const aiToolsDir = __dirname;

const checks = {
  python: false,
  automatic1111: false,
  comfyui: false,
  models: false,
  services: false
};

const issues = [];

console.log('Verifying Stable Diffusion Setup...\n');

// Check Python
console.log('[1/5] Checking Python installation...');
try {
  const pythonVersion = execSync('python --version', { encoding: 'utf-8' }).trim();
  console.log(`  ✓ Python found: ${pythonVersion}`);
  checks.python = true;
} catch (error) {
  console.log('  ✗ Python not found or not in PATH');
  issues.push('Python is not installed or not in PATH');
}

// Check Automatic1111
console.log('\n[2/5] Checking Automatic1111...');
const auto1111Path = join(aiToolsDir, 'automatic1111', 'webui.py');
if (existsSync(auto1111Path)) {
  console.log('  ✓ Automatic1111 repository found');
  checks.automatic1111 = true;
} else {
  console.log('  ✗ Automatic1111 not found');
  issues.push('Automatic1111 repository not found. Run: git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git automatic1111');
}

// Check ComfyUI
console.log('\n[3/5] Checking ComfyUI...');
const comfyuiPath = join(aiToolsDir, 'comfyui', 'main.py');
if (existsSync(comfyuiPath)) {
  console.log('  ✓ ComfyUI repository found');
  checks.comfyui = true;
} else {
  console.log('  ✗ ComfyUI not found');
  issues.push('ComfyUI repository not found. Run: git clone https://github.com/comfyanonymous/ComfyUI.git comfyui');
}

// Check Models
console.log('\n[4/5] Checking models...');
const auto1111ModelsPath = join(aiToolsDir, 'automatic1111', 'models', 'Stable-diffusion');
const comfyuiModelsPath = join(aiToolsDir, 'comfyui', 'models', 'checkpoints');

let hasModels = false;
if (existsSync(auto1111ModelsPath)) {
  const files = readdirSync(auto1111ModelsPath);
  const modelFiles = files.filter(f => f.endsWith('.ckpt') || f.endsWith('.safetensors'));
  if (modelFiles.length > 0) {
    console.log(`  ✓ Automatic1111 models found: ${modelFiles.length} file(s)`);
    hasModels = true;
  }
}

if (existsSync(comfyuiModelsPath)) {
  const files = readdirSync(comfyuiModelsPath);
  const modelFiles = files.filter(f => f.endsWith('.ckpt') || f.endsWith('.safetensors'));
  if (modelFiles.length > 0) {
    console.log(`  ✓ ComfyUI models found: ${modelFiles.length} file(s)`);
    hasModels = true;
  }
}

if (!hasModels) {
  console.log('  ✗ No models found');
  issues.push('No Stable Diffusion models found. Download models using: python download-model.py');
} else {
  checks.models = true;
}

// Check Services (optional - just check if ports are in use)
console.log('\n[5/5] Checking services...');
try {
  const netstat = execSync('netstat -an | findstr "7860 8188"', { encoding: 'utf-8' });
  if (netstat.includes('7860')) {
    console.log('  ✓ Port 7860 in use (Automatic1111 may be running)');
  }
  if (netstat.includes('8188')) {
    console.log('  ✓ Port 8188 in use (ComfyUI may be running)');
  }
  if (!netstat.includes('7860') && !netstat.includes('8188')) {
    console.log('  ⚠ No services detected on ports 7860 or 8188');
    console.log('     Start services using: start-automatic1111.bat or start-comfyui.bat');
  }
  checks.services = true;
} catch (error) {
  console.log('  ⚠ Could not check service status');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('Setup Verification Summary');
console.log('='.repeat(50));

const allCritical = checks.python && checks.automatic1111 && checks.comfyui && checks.models;
if (allCritical) {
  console.log('\n✓ All critical components are installed!');
  console.log('\nNext steps:');
  console.log('  1. Start Automatic1111: start-automatic1111.bat');
  console.log('  2. Start ComfyUI: start-comfyui.bat');
  console.log('  3. Test sprite generator: cd ../ai-sprite-generator && npm run dev generate "test"');
} else {
  console.log('\n⚠ Some components are missing:');
  issues.forEach(issue => console.log(`  - ${issue}`));
  process.exit(1);
}



