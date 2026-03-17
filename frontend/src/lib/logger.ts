import { APP_CONFIG } from '@/services/configs/app.config';

const noop = () => {};

/**
 * Only log/info/debug are enabled in `local` and `development`.
 * In staging/production they are no-ops. warn/error are always forwarded.
 */
function installConsolePatch() {
  if (APP_CONFIG.ENABLE_LOGS) return;
  console.log = noop;
  console.info = noop;
  console.debug = noop;
}

installConsolePatch();

/** Use this for env-gated logs; in non-dev envs log/info/debug are no-ops. */
export const logger = {
  log: APP_CONFIG.ENABLE_LOGS ? console.log.bind(console) : noop,
  info: APP_CONFIG.ENABLE_LOGS ? console.info.bind(console) : noop,
  debug: APP_CONFIG.ENABLE_LOGS ? console.debug.bind(console) : noop,
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
