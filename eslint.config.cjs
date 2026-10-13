// eslint.config.js
const rules = require('@litert/eslint-plugin-recommended-rules');

const aboxStyleRules = Object.fromEntries([
    ...rules.typescript.flatMap(config => Object.keys(config.rules ?? {}))
        .filter(name => name.startsWith('@stylistic/')),
    '@litert/disable-for-each-method', 'brace-style', 'camelcase', 'max-len', 'max-lines',
    'semi', 'space-before-function-paren', 'space-unary-ops', 'space-infix-ops',
    'linebreak-style', 'quotes', 'keyword-spacing', 'lines-between-class-members',
    'func-call-spacing', 'comma-spacing', 'no-multiple-empty-lines', 'no-extra-semi',
    '@typescript-eslint/naming-convention', '@typescript-eslint/member-ordering',
    '@typescript-eslint/array-type', '@typescript-eslint/consistent-indexed-object-style',
    '@typescript-eslint/consistent-type-definitions', '@typescript-eslint/explicit-member-accessibility',
    '@typescript-eslint/consistent-type-assertions',
    '@typescript-eslint/prefer-as-const', '@typescript-eslint/prefer-for-of',
    '@typescript-eslint/prefer-readonly', '@typescript-eslint/prefer-nullish-coalescing',
    '@typescript-eslint/prefer-literal-enum-member', '@typescript-eslint/prefer-function-type',
    '@typescript-eslint/prefer-reduce-type-parameter', '@typescript-eslint/prefer-includes',
    '@typescript-eslint/prefer-string-starts-ends-with', '@typescript-eslint/prefer-return-this-type',
    '@typescript-eslint/prefer-regexp-exec', '@typescript-eslint/prefer-optional-chain',
    '@typescript-eslint/non-nullable-type-assertion-style', '@typescript-eslint/no-extra-parens',
    '@typescript-eslint/adjacent-overload-signatures', '@typescript-eslint/default-param-last',
    '@typescript-eslint/no-extraneous-class', '@typescript-eslint/no-namespace',
    '@typescript-eslint/unified-signatures',
].map(name => [name, 'off']));

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
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            'max-lines': ['warn', 5000],
        }
    },
    {
        files: ['dist/**/abox/**/*.ts'],
        rules: aboxStyleRules,
    },
];
