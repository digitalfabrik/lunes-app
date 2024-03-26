const transformNodeModules = ['react-native', '@react-native', 'react-navigation-header-buttons', 'victory-(.+)']
export default {
  rootDir: '.',
  roots: ['src'],
  preset: 'react-native',
  verbose: true,
  automock: false,
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '\\.svg': '<rootDir>/src/__mocks__/svgrMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
  },
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')}/)`],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '<rootDir>/node_modules/@testing-library/jest-native/extend-expect'],
}
