import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';

const eslintConfig = defineConfig([
  // Ignore build artifacts
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),

  // Next.js recommended rules (includes @typescript-eslint, import, react, jsx-a11y)
  ...nextVitals,
  ...nextTs,

  // Prettier disables conflicting formatting rules from all configs above
  prettierConfig,

  {
    // Register only the plugins not already registered by eslint-config-next
    plugins: { unicorn, sonarjs, jsdoc, prettier },

    settings: {
      'import/resolver': {
        typescript: {},
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'] },
      },
    },

    rules: {
      // ── Prettier ──────────────────────────────────────────────────
      'prettier/prettier': 'error',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // ── TypeScript ────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variableLike', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        {
          selector: 'memberLike',
          // Allow names starting with __, digits, or containing / or - (e.g. ESLint rule keys)
          filter: { regex: '^__|^\\d+|[/-]', match: false },
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],

      // ── Import ordering (plugin already registered by eslint-config-next) ──
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: 'react', group: 'builtin', position: 'before' }],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],
      'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '*.config.{ts,mts,js,mjs}',
            '*.setup.{ts,mts,js,mjs}',
            'tests/**/*',
          ],
        },
      ],

      // ── File / code size ──────────────────────────────────────────
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],

      // ── Unicorn ───────────────────────────────────────────────────
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-array-reduce': 'error',
      'unicorn/filename-case': [
        'error',
        { cases: { kebabCase: true, camelCase: true, pascalCase: true } },
      ],

      // ── SonarJS ───────────────────────────────────────────────────
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-nested-switch': 'error',
      'sonarjs/no-redundant-boolean': 'error',

      // ── JSDoc ─────────────────────────────────────────────────────
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error',

      // ── General best-practices ────────────────────────────────────
      'no-shadow': 'off', // superseded by @typescript-eslint/no-shadow
      'no-use-before-define': 'off', // superseded by @typescript-eslint version
      curly: 'error',
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: false },
        },
        { enforceForRenamedProperties: false },
      ],
    },
  },

  // Relax limits inside test and config files
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**/*', '*.setup.*', '*.config.*'],
    rules: {
      'max-lines': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  },
]);

export default eslintConfig;
