/**
 * Rule: no-raw-redux-hooks
 * Enforces using useAppSelector/useAppDispatch from @/store/hooks.
 * Blocks: importing useSelector/useDispatch from react-redux
 * Scoped to: src/**\/*.{ts,tsx} (excluding src/store/hooks.ts)
 */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow raw useSelector/useDispatch from react-redux. Use useAppSelector/useAppDispatch from @/store/hooks.',
    },
    messages: {
      useTypedHook:
        "Import '{{hook}}' from react-redux is forbidden. Use {{replacement}} from '@/store/hooks' instead.",
    },
    schema: [],
  },
  create(context) {
    const replacements = {
      useSelector: 'useAppSelector',
      useDispatch: 'useAppDispatch',
    };

    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'react-redux') return;

        for (const spec of node.specifiers) {
          if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
            const imported = spec.imported.name;
            if (replacements[imported]) {
              context.report({
                node: spec,
                messageId: 'useTypedHook',
                data: { hook: imported, replacement: replacements[imported] },
              });
            }
          }
        }
      },
    };
  },
};
