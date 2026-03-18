/**
 * Local ESLint plugin — Backend custom rules
 * Enforces project conventions from .claude/rules/node.md
 */
module.exports = {
  rules: {
    'no-prisma-find-methods': require('./no-prisma-find-methods.cjs'),
    'no-raw-error-throw': require('./no-raw-error-throw.cjs'),
    'no-direct-response': require('./no-direct-response.cjs'),
    'no-patch-route': require('./no-patch-route.cjs'),
    'enforce-path-aliases': require('./enforce-path-aliases.cjs'),
  },
};
