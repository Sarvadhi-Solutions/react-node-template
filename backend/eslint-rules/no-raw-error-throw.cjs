/**
 * Rule: no-raw-error-throw
 * Enforces using AppError instead of raw Error in module files.
 * Blocks: throw new Error(), TypeError(), RangeError(), etc.
 * Scoped to: src/modules/**\/*.ts
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow throwing raw Error. Use AppError from @utils/appError instead.',
    },
    messages: {
      useAppError:
        "Use 'throw new AppError({ errorType, message, code })' instead of 'throw new {{name}}()'. Import from @utils/appError.",
    },
    schema: [],
  },
  create(context) {
    const builtinErrors = ['Error', 'TypeError', 'RangeError', 'ReferenceError', 'SyntaxError'];

    return {
      ThrowStatement(node) {
        if (
          node.argument &&
          node.argument.type === 'NewExpression' &&
          node.argument.callee.type === 'Identifier' &&
          builtinErrors.includes(node.argument.callee.name)
        ) {
          context.report({
            node,
            messageId: 'useAppError',
            data: { name: node.argument.callee.name },
          });
        }
      },
    };
  },
};
