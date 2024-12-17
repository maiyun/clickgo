// eslint.config.js
const LitertEslintRules = require('@litert/eslint-plugin-rules');

module.exports = [
    ...LitertEslintRules.configs.typescript,
    {
        plugins: {
            '@litert/rules': require('@litert/eslint-plugin-rules'),
        },
        files: [
            '**/*.ts',
        ],
        languageOptions: {
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'max-lines': 3000
        }
    }
];