---
name: react
description: Scaffold a new React feature with all required files following project conventions
user_invocable: true
---

# /react — Scaffold a React Feature

## Usage
```
/react <feature-name>
```

## What This Skill Does

When invoked, scaffold a complete React feature following the project's established patterns. Ask the user for:

1. **Feature name** (if not provided as argument) — e.g., `projects`, `tasks`, `invoices`
2. **Fields/properties** — what data does this feature manage?
3. **CRUD operations needed** — list, detail, create, edit, delete?
4. **Role restrictions** — which roles can access?

## Files to Generate

Based on the user's answers, create these files inside `frontend/src/`:

### 1. Types — `types/{feature}.ts`
```typescript
export interface {Feature} {
  id: string;
  // ... fields from user input
  created_at: string;
  updated_at: string;
}

export interface {Feature}ListParams {
  page?: number;
  page_size?: number;
  search?: string;
}
```

### 2. API Service — `services/{feature}/{feature}.api.ts`
```typescript
import { apiService } from '@/services/configs/apiService';
import { baseService } from '@/services/configs/baseService';
import { API_ENDPOINTS } from '@/utils/constants/api.constant';
import type { {Feature}, {Feature}ListParams } from '@/types/{feature}';

export const {feature}Api = {
  list: (params?: {Feature}ListParams) =>
    baseService.get<{ data: {Feature}[] }>(API_ENDPOINTS.{FEATURE}S, { params }).then((r) => r.data),
  getById: (id: string) =>
    apiService.get<{Feature}>(`${API_ENDPOINTS.{FEATURE}S}/${id}`),
  create: (data: Create{Feature}Payload) =>
    apiService.post<{Feature}>(API_ENDPOINTS.{FEATURE}S, data),
  update: (id: string, data: Update{Feature}Payload) =>
    apiService.put<{Feature}>(`${API_ENDPOINTS.{FEATURE}S}/${id}`, data),
  delete: (id: string) =>
    apiService.delete<void>(`${API_ENDPOINTS.{FEATURE}S}/${id}`),
};
```

### 3. Redux Slice — `store/slices/{feature}Slice.ts`
- `createAsyncThunk` for fetch
- State: items, pagination, isLoading, isError, filters, editingItem, isCreateOpen
- Reducers: setSearch, setDebouncedSearch, setPage, setEditingItem, setCreateOpen
- extraReducers: pending/fulfilled/rejected

### 4. Mutation Hooks — `services/{feature}/{feature}.query.ts`
- `useRefetch{Feature}s()` helper
- `useCreate{Feature}()`, `useUpdate{Feature}()`, `useDelete{Feature}()` mutations
- All with toast notifications (success + error)

### 5. Validation Schemas — append to `utils/validations/index.ts`
```typescript
export const create{Feature}Schema = z.object({ /* fields */ });
export type Create{Feature}FormValues = z.infer<typeof create{Feature}Schema>;
```

### 6. Page — `pages/{feature}/page.tsx`
- Named export: `export function {Feature}sPage()`
- Use `useAppSelector` / `useAppDispatch`
- Debounced search pattern
- Fetch on filter change via useEffect

### 7. Route Registration
- Add lazy import in `routes/route.tsx`
- Add route with `requiredRole` guard

### 8. Constants
- Add `API_ENDPOINTS.{FEATURE}S` in `utils/constants/api.constant.ts`
- Register slice in `store/rootReducer.ts`

## Rules to Follow

- Read `.claude/rules/react.md` for all conventions
- Named exports only (no default exports)
- `@/` path alias for all imports
- `import type` for type-only imports
- `cn()` for Tailwind classes
- `useAppSelector` / `useAppDispatch` — never raw hooks
- Toast on every mutation
- Zod schemas in centralized validation file
- Lucide icons with `strokeWidth={1.5}`

## After Scaffolding

Tell the user:
1. Which files were created
2. Run `npm run lint` and `npm run build` to verify
3. Remind them to add the Prisma model on the backend if not done
