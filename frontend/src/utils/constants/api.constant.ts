/**
 * API endpoint constants.
 * Add new feature endpoints here as your project grows.
 *
 * Usage: import { API_ENDPOINTS } from '@/utils/constants/api.constant';
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/sign-out',
  ME: '/auth/me',

  // Users
  USERS: '/users',

  // Master data
  MASTER: '/master',
  MASTER_BY_PARENT_CODE: '/master/by-parent-code',

  // Add new feature endpoints below:
  // PROJECTS: '/projects',
  // TASKS: '/tasks',
} as const;
