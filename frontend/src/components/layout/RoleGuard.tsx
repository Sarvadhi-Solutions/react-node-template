import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { UserRole } from '@/types/user';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const role = useAppSelector((state) => state.auth.user?.role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
