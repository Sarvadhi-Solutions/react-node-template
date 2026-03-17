import { useAppSelector } from '@/store/hooks';
import { useLogout } from '@/services/auth/auth.query';
import { LogOut } from 'lucide-react';

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { mutate: logoutFn, isPending } = useLogout();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, {user?.name ?? 'User'}
          </p>
        </div>
        <button
          onClick={() => logoutFn()}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-foreground hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Sign out
        </button>
      </div>

      {/* Add your dashboard content here */}
      <div className="rounded-xl border border-border bg-white p-8 text-center">
        <p className="text-muted-foreground">
          Start building your application. Add pages in <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">src/pages/</code>
        </p>
      </div>
    </div>
  );
}
