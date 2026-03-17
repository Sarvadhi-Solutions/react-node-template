import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

/**
 * Detects new deployments by fetching /version.json and shows a non-intrusive banner.
 *
 * Triggers (no timer — zero background polling):
 *  1. Route change        → every internal navigation is a checkpoint
 *  2. Tab becomes visible → instant check when user returns from another tab
 */
export function AppUpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const detectedRef = useRef(false);
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);

  const checkVersion = useCallback(async () => {
    if (detectedRef.current) return;
    try {
      const res = await fetch('/version.json', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { buildTime: number };
      if (data.buildTime > __BUILD_TIME__) {
        detectedRef.current = true;
        setUpdateAvailable(true);
      }
    } catch {
      // Network error — silently ignore
    }
  }, []);

  // Subscribe to tab visibility changes + initial mount check
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        void checkVersion();
      }
    }

    // Initial check via scheduled microtask (not synchronous in effect body)
    const timer = setTimeout(() => void checkVersion(), 0);

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [checkVersion]);

  // React to route changes via ref comparison
  useEffect(() => {
    if (pathnameRef.current !== location.pathname) {
      pathnameRef.current = location.pathname;
      const timer = setTimeout(() => void checkVersion(), 0);
      return () => clearTimeout(timer);
    }
  });

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg border border-gray-700 min-w-[320px] max-w-[480px]">
      <RefreshCw className="h-4 w-4 text-indigo-400 flex-shrink-0" strokeWidth={1.5} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">New version available</p>
        <p className="text-xs text-gray-400">Refresh to get the latest updates</p>
      </div>
      <button
        className="h-7 px-3 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 rounded-md flex-shrink-0 transition-colors"
        onClick={() => window.location.reload()}
      >
        Update Now
      </button>
    </div>
  );
}
