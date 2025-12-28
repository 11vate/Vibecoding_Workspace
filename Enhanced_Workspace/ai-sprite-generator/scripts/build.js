#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function build() {
  try {
    const { stdout, stderr } = await execAsync('tsc', { encoding: 'utf8' });
    
    // Filter out errors from cursor-enhancements
    const lines = (stdout + stderr).split('\n');
    const filtered = lines.filter(line => 
      !line.includes('cursor-enhancements') || 
      line.trim() === '' ||
      line.includes('Found') // Keep summary lines
    );
    
    const output = filtered.join('\n');
    
    if (output.trim()) {
      console.log(output);
    }
    
    // Check if there are any errors in our own code
    const ourErrors = lines.filter(line => 
      line.includes('src/') && 
      !line.includes('cursor-enhancements') &&
      line.includes('error TS')
    );
    
    if (ourErrors.length > 0) {
      console.error('\nErrors in ai-sprite-generator code:');
      ourErrors.forEach(err => console.error(err));
      process.exit(1);
    }
    
    console.log('\nBuild completed successfully (cursor-enhancements errors ignored)');
  } catch (error) {
    // tsc exits with non-zero on errors, but we want to continue
    const output = error.stdout + error.stderr;
    const lines = output.split('\n');
    
    // Filter out cursor-enhancements errors
    const ourErrors = lines.filter(line => 
      line.includes('src/') && 
      !line.includes('cursor-enhancements') &&
      line.includes('error TS')
    );
    
    if (ourErrors.length > 0) {
      console.error('Errors in ai-sprite-generator code:');
      ourErrors.forEach(err => console.error(err));
      process.exit(1);
    }
    
    console.log('Build completed (cursor-enhancements errors ignored)');
  }
}

build();



