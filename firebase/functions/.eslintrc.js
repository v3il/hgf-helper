module.exports = {
    root: true,
    env: {
        es6: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'airbnb',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
        sourceType: 'module'
    },
    ignorePatterns: [
        '/lib/**/*', // Ignore built files.
        '/generated/**/*' // Ignore generated files.
    ],
    plugins: [
        '@typescript-eslint',
        'import'
    ],
    rules: {
        quotes: ['error', 'single'],
        'import/no-unresolved': 'off',
        indent: ['error', 4],
        'max-len': ['error', 120],
        'object-curly-spacing': 2,
        'import/prefer-default-export': 0,
        'consistent-return': 0,
        'comma-dangle': ['error', 'never'],
        'import/no-extraneous-dependencies': ['off'],
        'import/extensions': 'off'
    }
};
