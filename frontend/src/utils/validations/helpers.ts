import type { ZodSchema } from 'zod';
import { toast } from '@/components/ui/toast';

/**
 * Validate data against a Zod schema before submitting.
 * Shows toast error with the first validation failure message.
 * Returns validated data on success, null on failure.
 */
export function validateBeforeSubmit<T>(schema: ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  toast.error(result.error.errors[0].message);
  return null;
}

/**
 * Check if data passes schema validation (for canSubmit / button disabled state).
 * Lightweight — no toast, no side effects.
 */
export function isFormValid(schema: ZodSchema, data: unknown): boolean {
  return schema.safeParse(data).success;
}
