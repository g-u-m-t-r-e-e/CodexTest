export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      eslint: require('eslint/use-at-your-own-risk')
    },
    rules: {}
  }
];
