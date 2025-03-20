module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: [
      ['babel-preset-expo', {
        // Explicitly enable Expo Router support in the preset
        jsxImportSource: 'react',
        jsxRuntime: 'automatic'
      }]
    ],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
      'expo-router/babel',
      '@babel/plugin-transform-export-namespace-from'
    ],
  };
}; 