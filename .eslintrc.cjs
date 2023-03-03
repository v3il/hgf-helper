module.exports = {
    root: true,
    extends: 'airbnb',

    env: {
        node: true,
        browser: true,
        es2021: true
    },

    parserOptions: {
        sourceType: "module",
        ecmaVersion: 13
    },

    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
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
        'no-plusplus': 'off',
        'import/prefer-default-export': ["off", "any"],
        "import/no-extraneous-dependencies": ["error", { devDependencies: ["**/*.config.js"] }]
    }
};
