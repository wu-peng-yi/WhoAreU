module.exports = {
  extends: ['taro/react'],
  rules: {
    'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
    'react/no-multi-comp': ['error', { ignoreStateless: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^React' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
