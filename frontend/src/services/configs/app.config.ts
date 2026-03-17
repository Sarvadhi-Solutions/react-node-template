const ENV = import.meta.env.VITE_ENV || 'local';

export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1',
  PUBLIC_DOMAIN: import.meta.env.VITE_PUBLIC_DOMAIN || 'http://localhost:5000',
  ENV,
  /** Logs (log/info/debug) are only output when ENV is `local` or `development`. */
  ENABLE_LOGS: ENV === 'local' || ENV === 'development',
} as const;
