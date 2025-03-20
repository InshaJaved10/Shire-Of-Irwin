const fs = require('fs');
const path = require('path');

// Path to the problematic file (compiled JS file)
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

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

// Read the file content
const content = fs.readFileSync(filePath, 'utf8');

// Make a backup of the original file
const backupPath = filePath + '.bak';
fs.writeFileSync(backupPath, content, 'utf8');
console.log(`Backup created at: ${backupPath}`);

// Replace the problematic code (in the compiled JS file)
const patchedContent = content.replace(
  /bodyIntegrity\s*=\s*await\s*readable_1\.Readable\.fromWeb\(responseInfo\.body\)\.text\(\)/,
  `bodyIntegrity = await new Response(responseInfo.body).text()`
);

// In case the first replacement didn't work, try an alternative pattern
const finalContent = patchedContent.replace(
  /bodyIntegrity\s*=\s*await.*fromWeb\(responseInfo\.body\)\.text\(\)/,
  `bodyIntegrity = await new Response(responseInfo.body).text()`
);

// Write the patched content back to the file
fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('Successfully patched the ReadableStream error in Expo CLI'); 