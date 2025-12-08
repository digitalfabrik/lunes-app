module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'babel-plugin-react-compiler', // must run first!
    '@babel/plugin-proposal-unicode-property-regex',
  ],
}
