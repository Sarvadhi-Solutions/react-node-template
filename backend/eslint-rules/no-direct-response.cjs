/**
 * Rule: no-direct-response
 * Enforces using handleApiResponse() in controllers.
 * Blocks: res.json(), res.send(), res.status()
 * Scoped to: *.controller.ts files
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct response methods in controllers. Use handleApiResponse() instead.',
    },
    messages: {
      useHandleApiResponse:
        "Use handleApiResponse() instead of res.{{method}}(). Direct response methods are forbidden in controllers.",
    },
    schema: [],
  },
  create(context) {
    const forbidden = ['json', 'send', 'status'];

    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return;

        const obj = node.callee.object;
        const prop = node.callee.property;

        if (
          obj.type === 'Identifier' &&
          obj.name === 'res' &&
          prop.type === 'Identifier' &&
          forbidden.includes(prop.name)
        ) {
          context.report({
            node,
            messageId: 'useHandleApiResponse',
            data: { method: prop.name },
          });
        }
      },
    };
  },
};
