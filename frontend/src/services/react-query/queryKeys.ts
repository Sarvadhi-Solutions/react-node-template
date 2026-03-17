/**
 * Hierarchical query key factory.
 * Add new feature keys as your project grows.
 *
 * Pattern:
 *   feature: {
 *     all: ['feature'] as const,
 *     list: (filters) => ['feature', 'list', filters] as const,
 *     detail: (id) => ['feature', 'detail', id] as const,
 *   }
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },

  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, unknown>) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },

  master: {
    all: ['master'] as const,
    byParentCode: (code: string, params?: Record<string, unknown>) =>
      ['master', 'by-parent-code', code, params] as const,
  },
} as const;
