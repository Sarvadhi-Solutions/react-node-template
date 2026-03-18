/**
 * Rule: enforce-path-aliases
 * Enforces using @app/, @utils/, @constant/, etc. instead of deep relative imports.
 * Blocks: imports starting with ../../ (crossing module boundaries)
 * Scoped to: src/modules/**\/*.ts
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow deep relative imports. Use path aliases (@utils/, @constant/, etc.) instead.',
    },
    messages: {
      usePathAlias:
        "Use path alias (e.g., @modules/, @utils/, @constant/) instead of deep relative import '{{path}}'.",
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
