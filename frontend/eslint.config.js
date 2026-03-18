import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import localPlugin from './eslint-rules/index.js'

export default defineConfig([
  globalIgnores(['dist', 'src/test/**', 'src/**/*.test.ts', 'src/**/*.test.tsx', 'eslint-rules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      local: localPlugin,
    },
    rules: {
      // ── Project rules ──
      'no-console': ['error', { allow: ['error'] }],
      'local/no-relative-deep-imports': 'error',
    },
  },
  // ── No raw Redux hooks (exclude hooks.ts where they are defined) ──
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/store/hooks.ts'],
    plugins: { local: localPlugin },
    rules: {
      'local/no-raw-redux-hooks': 'error',
    },
  },
  // ── No default exports (exclude slices, store config, service configs, App.tsx) ──
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/**/*Slice.ts',
      'src/store/rootReducer.ts',
      'src/store/storage.ts',
      'src/services/configs/*.ts',
      'src/App.tsx',
    ],
    plugins: { local: localPlugin },
    rules: {
      'local/no-default-export': 'error',
    },
  },
  // ── No PATCH in API services ──
  {
    files: ['src/**/*.api.ts'],
    plugins: { local: localPlugin },
    rules: {
      'local/no-patch-api': 'error',
    },
  },
  // ── No inline Zod schemas in pages/components ──
  {
    files: ['src/pages/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    plugins: { local: localPlugin },
    rules: {
      'local/no-inline-zod-schema': 'error',
    },
  },
  // ── Logger file exception: console usage is intentional ──
  {
    files: ['src/lib/logger.ts'],
    rules: {
      'no-console': 'off',
    },
  },
])
