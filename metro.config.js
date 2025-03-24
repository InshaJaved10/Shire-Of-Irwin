// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add any custom configurations here
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

// Fix for metro-core issues - provide our own implementation if needed
config.resolver.extraNodeModules = {
  'metro-core': path.resolve(__dirname, './metro-core-fix.js')
};

// Make sure Expo can resolve modules correctly
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'metro-core') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/metro-core/src/index.js'),
      type: 'sourceFile',
    };
  }
  
  // Let the default resolver handle it
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config; 