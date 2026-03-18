/**
 * Rule: no-inline-zod-schema
 * Enforces Zod schemas in src/utils/validations/ only.
 * Blocks: z.object() calls in page/component files
 * Scoped to: src/pages/**\/*.{ts,tsx}, src/components/**\/*.{ts,tsx}
 */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Disallow defining Zod schemas in page/component files. Define in 'src/utils/validations/' and import.",
    },
    messages: {
      noInlineSchema:
        "Define Zod schemas in 'src/utils/validations/index.ts', not in component/page files. Import the schema instead.",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'z' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'object'
        ) {
          context.report({ node, messageId: 'noInlineSchema' });
        }
      },
    };
  },
};
