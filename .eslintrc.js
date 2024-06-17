module.exports = {
    env: {
        node: true,
    },
    extends: ['plugin:prettier/recommended', 'eslint:recommended', 'react-app', 'react-app/jest'],
    root: true,
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'prettier/prettier': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-async-promise-executor': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/alt-text': 'off',
        'react-hooks/exhaustive-deps': 'off',
    },
};
