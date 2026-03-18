/**
 * Rule: no-relative-deep-imports
 * Enforces @/ path alias for all src imports.
 * Blocks: imports starting with ../../ (crossing directory boundaries)
 * Scoped to: src/**\/*.{ts,tsx}
 */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: "Disallow deep relative imports. Use '@/' path alias instead.",
    },
    messages: {
      usePathAlias: "Use '@/' path alias instead of deep relative import '{{path}}'.",
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (typeof source === 'string' && source.startsWith('../../')) {
          context.report({
            node,
            messageId: 'usePathAlias',
            data: { path: source },
          });
        }
      },
    };
  },
};
