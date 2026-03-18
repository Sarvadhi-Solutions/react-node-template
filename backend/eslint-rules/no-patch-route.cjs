/**
 * Rule: no-patch-route
 * Enforces PUT over PATCH for update routes.
 * Blocks: router.patch(), *.patch()
 * Scoped to: *.routes.ts files
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow PATCH routes. Use PUT for updates per project convention.',
    },
    messages: {
      usePut: "Use .put() instead of .patch(). PATCH routes are not allowed per project convention.",
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
