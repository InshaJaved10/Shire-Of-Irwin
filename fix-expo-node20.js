/**
 * Expo CLI + Node.js 20+ Compatibility Fix
 * 
 * This script helps fix the ReadableStream error when using Expo with Node.js 20+
 * The error occurs because of incompatibility between Node.js 20's ReadableStream
 * implementation and the one expected by Expo CLI.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Print header
console.log('\n=======================================================');
console.log('   EXPO CLI + NODE.JS 20+ COMPATIBILITY FIX');
console.log('=======================================================');
console.log(`Current Node.js version: ${process.version}`);
console.log('\nThis tool helps fix the ReadableStream error when using Expo with Node.js 20+');
console.log('\nChoose one of the following options:');
console.log('1. Run Expo with React Native CLI directly (bypass Expo CLI)');
console.log('2. Help me downgrade to Node.js 18 (recommended by Expo)');
console.log('3. Try to patch Expo CLI (experimental)');
console.log('4. Exit');

// Handle user choice
rl.question('\nEnter your choice (1-4): ', (choice) => {
  switch (choice) {
    case '1':
      runWithReactNativeCLI();
      break;
    case '2':
      helpDowngradeNode();
      break;
    case '3':
      tryPatchExpoCLI();
      break;
    case '4':
      console.log('Exiting...');
      rl.close();
      break;
    default:
      console.log('Invalid choice. Exiting...');
      rl.close();
      break;
  }
});

// Option 1: Run with React Native CLI directly
function runWithReactNativeCLI() {
  console.log('\nStarting React Native CLI directly...');
  
  rl.question('Which platform? (web/android/ios/metro): ', (platform) => {
    let command, args;
    
    switch (platform.toLowerCase()) {
      case 'web':
        command = 'npx';
        args = ['react-native', 'start', '--web'];
        break;
      case 'android':
        command = 'npx';
        args = ['react-native', 'run-android'];
        break;
      case 'ios':
        command = 'npx';
        args = ['react-native', 'run-ios'];
        break;
      case 'metro':
      default:
        command = 'npx';
        args = ['react-native', 'start'];
        break;
    }
    
    console.log(`Running: ${command} ${args.join(' ')}`);
    rl.close();
    
    const child = spawn(command, args, { stdio: 'inherit', shell: true });
    child.on('close', (code) => process.exit(code));
  });
}

// Option 2: Help downgrade Node.js
function helpDowngradeNode() {
  console.log('\nHelping you downgrade to Node.js 18.x...');
  
  if (process.platform === 'win32') {
    // For Windows
    console.log('Opening PowerShell script to help with downgrade...');
    spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-File', './downgrade-node.ps1'], { 
      stdio: 'inherit', 
      shell: true 
    });
  } else {
    // For macOS/Linux
    console.log('\nTo downgrade Node.js using nvm (Node Version Manager):');
    console.log('1. Install nvm if not already installed:');
    console.log('   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash');
    console.log('2. Restart your terminal');
    console.log('3. Install Node.js 18.18.2:');
    console.log('   nvm install 18.18.2');
    console.log('4. Use Node.js 18.18.2:');
    console.log('   nvm use 18.18.2');
    console.log('5. Try running Expo again');
  }
  
  rl.close();
}

// Option 3: Try to patch Expo CLI
function tryPatchExpoCLI() {
  console.log('\nAttempting to patch Expo CLI (experimental)...');
  console.log('This will modify node_modules files to fix the ReadableStream error.');
  
  rl.question('Are you sure you want to proceed? (yes/no): ', (answer) => {
    if (answer.toLowerCase() !== 'yes') {
      console.log('Operation cancelled.');
      rl.close();
      return;
    }
    
    // Find the problematic file
    const filePath = path.join(
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
    );
    
    if (!fs.existsSync(filePath)) {
      console.log(`Error: Cannot find file ${filePath}`);
      console.log('The patch cannot be applied. Try option 1 or 2 instead.');
      rl.close();
      return;
    }
    
    // Make a backup
    const backupPath = `${filePath}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`Created backup at ${backupPath}`);
    }
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply the patch
    let patchedContent = content;
    const patterns = [
      /bodyIntegrity\s*=\s*await\s*readable_1\.Readable\.fromWeb\(responseInfo\.body\)\.text\(\)/,
      /bodyIntegrity\s*=\s*await.*fromWeb\(responseInfo\.body\)\.text\(\)/
    ];
    
    let patchApplied = false;
    for (const pattern of patterns) {
      if (pattern.test(patchedContent)) {
        patchedContent = patchedContent.replace(
          pattern,
          `bodyIntegrity = await new Response(responseInfo.body).text()`
        );
        patchApplied = true;
        break;
      }
    }
    
    if (patchApplied) {
      fs.writeFileSync(filePath, patchedContent, 'utf8');
      console.log('Patch applied successfully!');
      console.log('Try running "npx expo start -c" now.');
    } else {
      console.log('Could not apply patch - pattern not found in the file.');
      console.log('Try option 1 or 2 instead.');
    }
    
    rl.close();
  });
} 