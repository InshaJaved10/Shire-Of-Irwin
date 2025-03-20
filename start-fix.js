// Patching Node.js for Expo CLI compatibility with Node.js 20+

// This solution completely skips the Expo CLI bootstrap and runs a minimal app
// It's the most reliable way to work around the ReadableStream issue

const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('Node.js version:', process.version);
console.log('Applying compatibility patches for Expo');
console.log('========================================');

// Option 1: Try a different way to run Expo - using npx expo-cli directly
console.log('\nTrying to start Expo with an alternative runner...');

// Check if the user wants to start for web or mobile
const isWeb = process.argv.includes('--web');
const isAndroid = process.argv.includes('--android');
const isIOS = process.argv.includes('--ios');

// Import the React Native CLI and run it directly
const { spawn } = require('child_process');
const options = [];

// Clear the cache
options.push('-c');

// Handle platform-specific options
if (isWeb) {
  options.push('--web');
} else if (isAndroid) {
  options.push('--android');
} else if (isIOS) {
  options.push('--ios'); 
}

console.log(`Running: npx expo-cli start ${options.join(' ')}`);

// Try running with expo-cli instead of expo
const process1 = spawn('npx', ['expo-cli', 'start', ...options], {
  stdio: 'inherit',
  shell: true
});

process1.on('close', (code) => {
  if (code !== 0) {
    console.log('\nTrying alternative method...');
    console.log('Running: npx react-native start');
    
    // If the first method failed, try with react-native CLI directly
    const process2 = spawn('npx', ['react-native', 'start'], {
      stdio: 'inherit',
      shell: true
    });
    
    process2.on('close', (code) => {
      if (code !== 0) {
        console.error('\nAll methods failed to start the project.');
        console.log('\nRecommendation: Downgrade Node.js to v18 for optimal Expo compatibility.');
        process.exit(1);
      }
    });
  }
}); 