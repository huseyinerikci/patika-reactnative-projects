const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  maxWorkers: 2, // CPU ve watcher yükünü azaltır
  watchFolders: [], // ekstra klasörleri izlemez
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
