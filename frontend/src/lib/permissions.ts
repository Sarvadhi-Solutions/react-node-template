import type { UserRole } from '@/types/user';

/**
 * Permission helpers for role-based access control.
 * Customize these roles and permissions for your project.
 */

const ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN'];
const MANAGEMENT_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];

export function canViewAdmin(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function canEditResource(role: UserRole): boolean {
  return MANAGEMENT_ROLES.includes(role);
}

export function canManageUsers(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function canViewAllResources(role: UserRole): boolean {
  return MANAGEMENT_ROLES.includes(role);
}

export function canAccessAdminNav(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

/**
 * Navigation items that should be hidden for non-admin users.
 * Add your admin-only paths here.
 */
export const ADMIN_ONLY_NAV_ITEMS = [
  '/settings',
  '/users',
];

export function canAccessNavItem(role: UserRole, path: string): boolean {
  if (MANAGEMENT_ROLES.includes(role)) return true;
  return !ADMIN_ONLY_NAV_ITEMS.includes(path);
}

/**
 * Check if a user can delete a resource.
 * Admins/Managers can delete any; Members can only delete own.
 */
export function canDeleteResource(
  role: UserRole,
  createdById: string | undefined,
  currentUserId: string,
): boolean {
  if (MANAGEMENT_ROLES.includes(role)) return true;
  return !!createdById && createdById === currentUserId;
}
