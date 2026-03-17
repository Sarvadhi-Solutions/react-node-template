import type { AxiosError } from 'axios';

/**
 * Extract the human-readable `message` from an Axios error response.
 * Backend format: `{ success, statusCode, data, message, pagination }`
 *
 * Usage in mutation `onError`:
 *   `onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to create task'))`
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosErr = error as AxiosError<{ message?: string }>;
  return axiosErr?.response?.data?.message || fallback;
}
