import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import pluginNoOnlyTests from 'eslint-plugin-no-only-tests';

/** Formatting rules, shared by the app and the Node-side scripts. */
const style = {
    '@stylistic/brace-style': 'error',
    '@stylistic/indent':      ['error', 4],
    '@stylistic/quotes':      ['error', 'single'],
    '@stylistic/semi':        ['error', 'always'],
    curly:                    ['error', 'all'],
};

export default tseslint.config(
    // Build output and caches
    {
        ignores: ['.angular/', 'dist/', 'out-tsc/', 'tmp/'],
    },

    // Typescript
    {
        files: ['src/**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        plugins: {
            '@stylistic': stylistic,
        },
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.eslint.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            ...style,
            '@typescript-eslint/no-explicit-any': 'off',
            eqeqeq: ['error', 'always'],

            // Type-aware rules
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            // Strings are excluded because an empty string is a meaningful fallback trigger in several places
            '@typescript-eslint/prefer-nullish-coalescing': ['error', {ignorePrimitives: {string: true}}],

            // Conventions
            '@angular-eslint/component-selector':         ['error', {type: 'element',   prefix: 'app', style: 'kebab-case'}],
            '@angular-eslint/directive-selector':         ['error', {type: 'attribute', prefix: 'app', style: 'camelCase'}],
            '@angular-eslint/pipe-prefix':                ['error', {prefixes: ['app']}],
            '@angular-eslint/consistent-component-styles': 'error',
        },
    },

    // Unit tests
    {
        files: ['src/**/*.spec.ts'],
        plugins: {
            'no-only-tests': pluginNoOnlyTests,
        },
        rules: {
            'no-only-tests/no-only-tests': ['error', {focus: ['only', 'skip', 'todo']}],
        },
    },

    // Node-side scripts (Electron shell, packaging, tooling config)
    {
        files: ['*.js', '*.mjs', '*.ts'],
        extends: [eslint.configs.recommended],
        plugins: {
            '@stylistic': stylistic,
        },
        languageOptions: {
            globals: {
                console: 'readonly',
                process: 'readonly',
            },
        },
        rules: style,
    },

    // HTML templates
    {
        files: ['src/app/**/*.html'],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],
        rules: {
            '@angular-eslint/template/interactive-supports-focus':      'off', // No interaction assumed
            '@angular-eslint/template/click-events-have-key-events':    'off', // No interaction assumed
            '@angular-eslint/template/prefer-contextual-for-variables': 'error',
            '@angular-eslint/template/prefer-template-literal':         'error',
        },
    },
);
