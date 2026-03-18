const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const localPlugin = require('./eslint-rules/index.cjs');

module.exports = [
  {
    ignores: ['dist', 'node_modules', 'eslint-rules']
  },
  {
    files: ['src/**/*.{ts,tsx}', 'scripts/**/*.{ts,js}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      local: localPlugin
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['error'] }]
    }
  },
  // ── Module files: enforce path aliases + AppError ──
  {
    files: ['src/modules/**/*.ts'],
    rules: {
      'local/no-raw-error-throw': 'error',
      'local/enforce-path-aliases': 'error'
    }
  },
  // ── Repository files: no Prisma find methods ──
  {
    files: ['src/**/*.repository.ts'],
    rules: {
      'local/no-prisma-find-methods': 'error'
    }
  },
  // ── Controller files: no direct res.json/send/status ──
  {
    files: ['src/**/*.controller.ts'],
    rules: {
      'local/no-direct-response': 'error'
    }
  },
  // ── Route files: no PATCH method ──
  {
    files: ['src/**/*.routes.ts'],
    rules: {
      'local/no-patch-route': 'error'
    }
  },
  // ── Scripts: relax rules ──
  {
    files: ['scripts/**/*.{ts,js}', '*.config.{js,cjs,mjs}'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off'
    }
  }
];
