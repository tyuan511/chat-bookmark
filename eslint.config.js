import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'no-console': 'off',
    'react/no-unstable-default-props': 'off',
    'react/no-unstable-context-value': 'off',
    'react/no-array-index-key': 'off',
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
  },
})
