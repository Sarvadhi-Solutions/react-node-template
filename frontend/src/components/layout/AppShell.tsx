import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

function AppShellContent() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'h-full bg-white border-r border-border transition-all duration-200 flex flex-col',
          isCollapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]',
        )}
      >
        <div className="flex items-center h-[var(--topbar-height)] px-4 border-b border-border">
          {!isCollapsed && (
            <span className="text-lg font-semibold text-foreground">My App</span>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Add your sidebar navigation items here */}
          <p className="text-xs text-muted-foreground px-3 py-2">
            Add navigation items in AppShell.tsx
          </p>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-[var(--topbar-height)] border-b border-border bg-white flex items-center px-4 gap-3">
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <div className="flex-1" />
          {/* Add your top bar content here (user menu, notifications, etc.) */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppShell() {
  return (
    <SidebarProvider>
      <AppShellContent />
    </SidebarProvider>
  );
}
