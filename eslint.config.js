import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'no-console': 'off',
    'react/no-unstable-default-props': 'off',
    'react/no-unstable-context-value': 'off',
  },
})
