/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/** Millisecond Unix timestamp injected at build time (see vite.config.ts define). */
declare const __BUILD_TIME__: number;

interface ImportMetaEnv {
  readonly VITE_PUBLIC_DOMAIN: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_ENV: 'local' | 'development' | 'staging' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
