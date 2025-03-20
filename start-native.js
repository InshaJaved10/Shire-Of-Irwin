// This script starts the React Native project directly 
// bypassing Expo CLI issues with Node.js 20

const { spawn } = require('child_process');

console.log('Starting React Native project directly...');
console.log('This bypasses Expo CLI issues with Node.js 20+');

// Determine if we're using Android or iOS
const isAndroid = process.argv.includes('--android');
const isIOS = process.argv.includes('--ios');

let command;
let args;

if (isAndroid) {
  console.log('\nStarting Android version...');
  command = 'npx';
  args = ['react-native', 'run-android'];
} else if (isIOS) {
  console.log('\nStarting iOS version...');
  command = 'npx';
  args = ['react-native', 'run-ios'];
} else {
  console.log('\nStarting Metro bundler...');
  command = 'npx';
  args = ['react-native', 'start'];
}

console.log(`Running: ${command} ${args.join(' ')}`);

// Run the command
const child = spawn(command, args, {
  stdio: 'inherit',
  shell: true
});

// Handle exit
child.on('close', (code) => {
  if (code !== 0) {
    console.error(`\nCommand failed with exit code ${code}`);
    console.log('\nTo fix this issue permanently, consider:');
    console.log('1. Downgrading Node.js to version 18.x (recommended by Expo)');
    console.log('2. Using a Docker environment with the correct Node.js version');
    console.log('3. Using Expo EAS Build service instead of local development');
  }
  process.exit(code);
}); 