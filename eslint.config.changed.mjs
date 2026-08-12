import diff from 'eslint-plugin-diff'

import config from './eslint.config.mjs'

// Lints only the lines changed compared to the default branch
export default [...config, ...diff.configs['flat/diff']]
