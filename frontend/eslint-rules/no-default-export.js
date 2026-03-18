/**
 * Rule: no-default-export
 * Enforces named exports only.
 * Blocks: export default (except in *Slice.ts, store files, service configs)
 * Scoped via eslint.config.js ignores
 */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow default exports. Use named exports. Exception: Redux slices, store config, service configs.',
    },
    messages: {
      noDefaultExport:
        'Use named exports (export function X / export const X). Default exports are only allowed in Redux slices and config files.',
    },
    schema: [],
  },
  create(context) {
    return {
      ExportDefaultDeclaration(node) {
        context.report({ node, messageId: 'noDefaultExport' });
      },
    };
  },
};
