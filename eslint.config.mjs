import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import pluginNoOnlyTests from 'eslint-plugin-no-only-tests';

export default tseslint.config(
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
            'no-only-tests': pluginNoOnlyTests,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'brace-style': 'error',
            curly: ['error', 'all'],
            quotes: ['error', 'single'],
            'no-only-tests/no-only-tests': ['error', {focus: ['only', 'skip']}],
            semi: ['error', 'always'],
        },
    },

    // HTML templates
    {
        files: ['src/app/**/*.html'],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],
        rules: {
            '@angular-eslint/template/interactive-supports-focus':   'off', // No interaction assumed
            '@angular-eslint/template/click-events-have-key-events': 'off', // No interaction assumed
        },
    },
);
