/* eslint-disable react-refresh/only-export-components */

import { lazy, Suspense } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { PageLoader } from '@/components/shared/PageLoader';
import type { UserRole } from '@/types/user';

// ── Lazy-loaded page components (code splitting) ─────────────────────
const OnboardingPage = lazy(() =>
  import('@/pages/onboarding/page').then((m) => ({ default: m.OnboardingPage })),
);
const DocsPage = lazy(() =>
  import('@/pages/docs/page').then((m) => ({ default: m.DocsPage })),
);
const LoginPage = lazy(() =>
  import('@/pages/auth/page').then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/page').then((m) => ({ default: m.DashboardPage })),
);

// ── Helper: wrap page in Suspense + ErrorBoundary ────────────────────
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export interface RouteConfig {
  path: string;
  index?: boolean;
  element: React.ReactNode;
  children?: RouteConfig[];
  requiredRole?: UserRole[];
}

/** All roles */
const ALL_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MEMBER'];

// Add more role groups as needed:
// const ADMIN_LEVEL: UserRole[] = ['SUPER_ADMIN', 'ADMIN'];
// const ADMIN_AND_MANAGER: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];

export const routes: RouteConfig[] = [
  // ── Standalone public pages (no auth wrapper) ────────────────────────
  {
    path: '/',
    element: (
      <LazyPage>
        <OnboardingPage />
      </LazyPage>
    ),
  },
  {
    path: '/docs',
    element: (
      <LazyPage>
        <DocsPage />
      </LazyPage>
    ),
  },

  // ── Public routes — redirect to /dashboard if already logged in ──────
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        path: '',
        index: true,
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
    ],
  },

  // ── Protected routes — redirect to /login if not authenticated ───────
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <AppShell />,
        children: [
          {
            path: '',
            index: true,
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
            requiredRole: ALL_ROLES,
          },
          // Add more routes here:
          // {
          //   path: 'users',
          //   element: (
          //     <RoleGuard allowedRoles={ADMIN_LEVEL}>
          //       <LazyPage><UsersPage /></LazyPage>
          //     </RoleGuard>
          //   ),
          //   requiredRole: ADMIN_LEVEL,
          // },
        ],
      },
    ],
  },
];
