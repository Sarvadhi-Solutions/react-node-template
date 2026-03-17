/**
 * Master data category codes.
 * These match the `parent_code` values in the master data API.
 * Add new codes as your project defines new master categories.
 */
export const MASTER_CODES = {
  ROLE: 'ROLE',
  USER_STATUS: 'USER_STATUS',
  PRIORITY: 'PRIORITY',
} as const;

export type MasterCode = (typeof MASTER_CODES)[keyof typeof MASTER_CODES];
