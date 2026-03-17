import { z } from 'zod';

// ── Auth ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

// ── Add your feature schemas below ──────────────────────────────────
//
// Naming conventions:
//   Schema:  {action}{Entity}Schema  (camelCase)  → createProjectSchema
//   Type:    {Action}{Entity}FormValues (PascalCase) → CreateProjectFormValues
//
// Example:
//   export const createProjectSchema = z.object({
//     name: z.string().min(3, 'Name must be at least 3 characters'),
//     description: z.string().optional(),
//   });
//   export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
