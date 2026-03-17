/**
 * Status code → UI style mapping.
 *
 * Use this pattern for mapping status codes to Tailwind classes.
 * When using master data, match by `code` field, NOT by `name`.
 *
 * Example usage:
 *   const style = getStatusStyle(status.code);
 *   <span className={cn('px-2 py-1 rounded-md text-xs font-medium border', style)}>
 *     {status.name}
 *   </span>
 */

export const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  INACTIVE: 'bg-gray-50 text-gray-600 border-gray-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const DEFAULT_STYLE = 'bg-gray-50 text-gray-600 border-gray-200';

export function getStatusStyle(code: string): string {
  return STATUS_STYLES[code] ?? DEFAULT_STYLE;
}
