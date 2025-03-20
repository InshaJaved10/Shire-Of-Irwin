// Launcher script for Expo that applies patches for Node.js 20 compatibility

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Applying Node.js 20 compatibility patches for Expo CLI...');

// Define the patches to apply
const patches = [
  {
    filePath: path.join(
      __dirname,
      'node_modules',
      '@expo',
      'cli',
      'build',
      'src',
      'api',
      'rest',
      'cache',
      'FileSystemResponseCache.js'
    ),
    find: /bodyIntegrity\s*=\s*await.*fromWeb\(responseInfo\.body\)\.text\(\)/,
    replace: `bodyIntegrity = await new Response(responseInfo.body).text()`
  }
];

// Apply all patches
let patchesApplied = 0;
patches.forEach(patch => {
  if (fs.existsSync(patch.filePath)) {
    console.log(`Patching file: ${patch.filePath}`);
    
    // Read the file content
    const content = fs.readFileSync(patch.filePath, 'utf8');
    
    // Make a backup if it doesn't exist
    const backupPath = `${patch.filePath}.original`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content, 'utf8');
      console.log(`  Created backup: ${backupPath}`);
    }
    
    // Apply the patch
    const patchedContent = content.replace(patch.find, patch.replace);
    
    // Check if the patch was applied
    if (patchedContent !== content) {
      fs.writeFileSync(patch.filePath, patchedContent, 'utf8');
      console.log('  Patch applied successfully');
      patchesApplied++;
    } else {
      console.log('  No changes needed or patch pattern not found');
    }
  } else {
    console.log(`File not found: ${patch.filePath}`);
  }
});

console.log(`Applied ${patchesApplied} patches`);

// Start Expo with the provided arguments
console.log('\nStarting Expo...');
const args = process.argv.slice(2).length ? process.argv.slice(2) : ['start', '-c'];

const expo = spawn('npx', ['expo', ...args], { stdio: 'inherit' });

expo.on('close', (code) => {
  console.log(`Expo process exited with code ${code}`);
});

// Forward signals to the child process
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    if (!expo.killed) {
      expo.kill(signal);
    }
  });
}); 