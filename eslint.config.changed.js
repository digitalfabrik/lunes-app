const diff = require('eslint-plugin-diff')

const config = require('./eslint.config')

// Lints only the lines changed compared to the default branch
module.exports = [...config, ...diff.configs['flat/diff']]
