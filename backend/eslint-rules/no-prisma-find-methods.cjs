/**
 * Rule: no-prisma-find-methods
 * Enforces raw SQL reads via prisma.$queryRaw.
 * Blocks: prisma.model.findMany(), findUnique(), findFirst(), findFirstOrThrow(), findUniqueOrThrow()
 * Scoped to: *.repository.ts files
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Prisma query methods for reads. Use prisma.$queryRaw instead.',
    },
    messages: {
      noFindMethod:
        "Use prisma.$queryRaw for reads. 'prisma.{{model}}.{{method}}()' is forbidden in repository files.",
    },
    schema: [],
  },
  create(context) {
    const forbidden = [
      'findMany',
      'findUnique',
      'findFirst',
      'findFirstOrThrow',
      'findUniqueOrThrow',
    ];

    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return;

        const prop = node.callee.property;
        if (prop.type !== 'Identifier' || !forbidden.includes(prop.name)) return;

        // Check pattern: prisma.<model>.<findMethod>()
        const obj = node.callee.object;
        if (
          obj.type === 'MemberExpression' &&
          obj.object.type === 'Identifier' &&
          obj.object.name === 'prisma'
        ) {
          const model = obj.property.type === 'Identifier' ? obj.property.name : 'unknown';
          context.report({
            node,
            messageId: 'noFindMethod',
            data: { model, method: prop.name },
          });
        }
      },
    };
  },
};
