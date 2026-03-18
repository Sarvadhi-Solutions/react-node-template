/**
 * Rule: no-patch-api
 * Enforces PUT over PATCH for API updates.
 * Blocks: .patch() calls in API service files
 * Scoped to: *.api.ts files
 */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow .patch() in API services. Use .put() for updates per project convention.',
    },
    messages: {
      usePut: "Use .put() instead of .patch(). PATCH is not allowed per project convention.",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'patch'
        ) {
          context.report({ node, messageId: 'usePut' });
        }
      },
    };
  },
};
