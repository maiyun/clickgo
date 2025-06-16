// eslint.config.js
const rules = require('@litert/eslint-plugin-recommended-rules');

module.exports = [
    ...rules.typescript,
    {
        files: [
            '**/*.ts', // don't add `./` before the path
        ],
        languageOptions: {
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'max-lines': ['warn', 5000]
        }
    }
];