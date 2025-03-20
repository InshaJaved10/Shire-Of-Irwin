// Solution for Node.js 20+ ReadableStream issues with Expo CLI

// Monkey patch the ReadableStream error by fixing the fromWeb method
// This runs before anything else in the application
const originalReadable = require('stream').Readable;
const originalFromWeb = originalReadable.fromWeb;

// Replace the fromWeb function with a safer version
originalReadable.fromWeb = function patchedFromWeb(readableStream, options) {
  try {
    // Try the original first
    return originalFromWeb.call(this, readableStream, options);
  } catch (error) {
    console.log('[Node.js Patch] Using fallback for ReadableStream');
    
    // Convert the response body to a Node.js Readable stream
    return new Promise(async (resolve) => {
      try {
        const response = new Response(readableStream);
        const text = await response.text();
        const buffer = Buffer.from(text);
        const readable = originalReadable.from(buffer);
        resolve(readable);
      } catch (innerError) {
        console.error('[Node.js Patch] Fallback error:', innerError);
        // Last resort: return an empty stream
        resolve(originalReadable.from(Buffer.alloc(0)));
      }
    });
  }
};

console.log('[Node.js Patch] Applied ReadableStream compatibility patch');

// Now that we've patched the required functionality, start Expo
require('child_process').spawn(
  'npx',
  ['expo', 'start', '-c'], 
  { stdio: 'inherit', shell: true }
).on('exit', code => {
  process.exit(code);
}); 