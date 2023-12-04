const transformNodeModules = ['react-native', '@react-native', 'react-navigation-header-buttons', 'victory-(.+)']
export default {
  rootDir: 'src',
  preset: 'react-native',
  verbose: true,
  /* Always explicitly mock modules. Also automocking seems to be broken right now:
        https://github.com/facebook/jest/issues/6127 */
  automock: false,
  moduleNameMapper: {
    '.+\\.(styl|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.svg': '<rootDir>/__mocks__/svgrMock.js',
    '^axios$': 'axios/dist/axios.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')})`],
  setupFilesAfterEnv: [
    'jest-extended',
    '<rootDir>/../jest.setup.ts',
    '<rootDir>/../node_modules/@testing-library/jest-native/extend-expect',
    '<rootDir>/../node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
}
