module.exports = {
    root: true,
    extends: 'airbnb',

    env: {
        node: true,
        browser: true,
        es2021: true,
        webextensions: true
    },

    ignorePatterns: ["dist"],

    parserOptions: {
        sourceType: "module",
        ecmaVersion: 14
    },

    rules: {
        'no-console': 'off',
        indent: ['error', 4],
        'semi': [2, 'always'],
        'no-unused-vars': 'off',
        'no-new': 'off',
        quotes: ['error', 'single'],
        'comma-dangle': ["error", "never"],
        'max-len': ["error", 120],
        'class-methods-use-this': 'off',
        'import/no-unresolved': 'off',
        'lines-between-class-members': 'off',
        'no-await-in-loop': 'off',
        'no-underscore-dangle': 'off',
        'no-plusplus': 'off',
        'consistent-return': 'off',
        'no-unused-expressions': 'off',
        'no-restricted-syntax': 'off',
        'import/extensions': 'off',
        'import/prefer-default-export': ["off", "any"],
        "import/no-extraneous-dependencies": ["off"]
    }
};
