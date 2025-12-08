const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */

/** @type {import('metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname)
const {
  resolver: { assetExts, sourceExts },
} = defaultConfig

/** @type {import('react-native/metro-config').MetroConfig} */
const config = {
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
  },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
