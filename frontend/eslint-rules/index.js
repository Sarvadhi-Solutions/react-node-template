/**
 * Local ESLint plugin — Frontend custom rules
 * Enforces project conventions from .claude/rules/react.md
 */
import noRawReduxHooks from './no-raw-redux-hooks.js';
import noDefaultExport from './no-default-export.js';
import noPatchApi from './no-patch-api.js';
import noRelativeDeepImports from './no-relative-deep-imports.js';
import noInlineZodSchema from './no-inline-zod-schema.js';

export default {
  rules: {
    'no-raw-redux-hooks': noRawReduxHooks,
    'no-default-export': noDefaultExport,
    'no-patch-api': noPatchApi,
    'no-relative-deep-imports': noRelativeDeepImports,
    'no-inline-zod-schema': noInlineZodSchema,
  },
};
