---
name: react
description: Scaffold a complete React feature with all required files — types, API service, Redux slice, mutation hooks, validation schemas, page component, and route registration — following project conventions strictly
user_invocable: true
---

# /react — Scaffold a React Feature

## Usage

```
/react <feature-name>
```

## Pre-Flight

Before generating ANY code:

1. **Read the rules** — Load `.claude/rules/react.md` and understand every convention
2. **Read existing patterns** — Study these files to match the exact code style:
   - `frontend/src/store/slices/authSlice.ts` — slice pattern
   - `frontend/src/services/auth/auth.api.ts` — API service pattern
   - `frontend/src/services/auth/auth.query.ts` — mutation hook pattern
   - `frontend/src/utils/validations/index.ts` — validation pattern
   - `frontend/src/routes/route.tsx` — routing pattern
   - `frontend/src/store/rootReducer.ts` — slice registration
   - `frontend/src/utils/constants/api.constant.ts` — endpoint constants
3. **Ask the user** for:
   - **Feature name** (if not provided) — singular noun, e.g., `project`, `task`, `invoice`
   - **Fields/properties** — what data does this feature manage? (name, description, status, etc.)
   - **CRUD operations** — which ones? list, detail, create, edit, delete?
   - **Role restrictions** — which roles can access? (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `MEMBER`)
   - **Has file uploads?** — determines whether to use `baseService` or `apiService`

---

## Files to Generate

Generate ALL files below inside `frontend/src/`. Replace `{feature}` with the feature name (lowercase), `{Feature}` with PascalCase, `{FEATURE}` with UPPER_SNAKE_CASE.

---

### FILE 1: Types — `types/{feature}.ts`

```typescript
// ── MANDATORY RULES ──
// - snake_case fields for API response types (matching backend)
// - camelCase fields for app-level types
// - import type for type-only imports
// - Named exports only — NEVER default export

export interface {Feature} {
  id: number;
  // ... fields matching the Prisma model (snake_case from API)
  createdAt: string;   // ISO date string from API
  updatedAt: string;
}

export interface {Feature}ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface {Feature}ListResponse {
  data: {Feature}[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface Create{Feature}Payload {
  // ... fields required for creation
}

export interface Update{Feature}Payload {
  // ... fields allowed for update (all optional)
}
```

**Rules enforced:**
- `import type` when importing these types elsewhere
- No `any` types — every field explicitly typed
- API response fields match backend exactly

---

### FILE 2: API Endpoint Constant — APPEND to `utils/constants/api.constant.ts`

```typescript
// Add to the API_ENDPOINTS object:
{FEATURE}S: '/{feature}s',
```

**Rules enforced:**
- Never hardcode URL paths anywhere else — always reference `API_ENDPOINTS.{FEATURE}S`

---

### FILE 3: API Service — `services/{feature}/{feature}.api.ts`

```typescript
import baseService from '@/services/configs/baseService';
import { apiService } from '@/services/configs/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api.constant';
import type {
  {Feature},
  {Feature}ListParams,
  {Feature}ListResponse,
  Create{Feature}Payload,
  Update{Feature}Payload,
} from '@/types/{feature}';

export const {feature}Api = {
  // LIST — uses baseService (needs pagination from response wrapper)
  list: (params?: {Feature}ListParams) =>
    baseService
      .get<{ data: {Feature}ListResponse }>(API_ENDPOINTS.{FEATURE}S, { params })
      .then((res) => res.data.data),

  // GET BY ID — uses apiService (auto-unwraps response.data.data)
  getById: (id: number) =>
    apiService.get<{Feature}>(`${API_ENDPOINTS.{FEATURE}S}/${id}`),

  // CREATE — uses apiService + PUT for updates (NEVER PATCH)
  create: (data: Create{Feature}Payload) =>
    apiService.post<{Feature}>(API_ENDPOINTS.{FEATURE}S, data),

  // UPDATE — ALWAYS PUT, never PATCH (backend expects PUT)
  update: (id: number, data: Update{Feature}Payload) =>
    apiService.put<{Feature}>(`${API_ENDPOINTS.{FEATURE}S}/${id}`, data),

  // DELETE
  delete: (id: number) =>
    apiService.delete<void>(`${API_ENDPOINTS.{FEATURE}S}/${id}`),
};
```

**Rules enforced:**
- `baseService` for list (needs pagination wrapper) / `apiService` for single-item ops (auto-unwraps)
- `baseService` directly for FormData uploads (if feature has file uploads)
- Always PUT for updates — NEVER PATCH
- `import type` for all type imports
- `@/` path alias — never relative imports

---

### FILE 4: Redux Slice — `store/slices/{feature}Slice.ts`

```typescript
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { {feature}Api } from '@/services/{feature}/{feature}.api';
import type { {Feature}, {Feature}ListParams } from '@/types/{feature}';

// ── Async Thunk (GET only — mutations go through React Query) ──
export const fetch{Feature}s = createAsyncThunk(
  '{feature}s/fetch{Feature}s',
  async (params: {Feature}ListParams) => {feature}Api.list(params),
);

// ── State Interface ──
interface {Feature}sState {
  {feature}s: {Feature}[];
  pagination: { page: number; limit: number; total: number };
  isLoading: boolean;
  isError: boolean;

  // Filters — ALL filter/UI state lives in Redux, NEVER in useState
  filters: {
    search: string;
    debouncedSearch: string;
    statusFilter: string;
    page: number;
    limit: number;
  };

  // UI state — dialogs, editing state (NEVER useState for these)
  editing{Feature}: {Feature} | null;
  isCreateOpen: boolean;
}

const initialState: {Feature}sState = {
  {feature}s: [],
  pagination: { page: 1, limit: 20, total: 0 },
  isLoading: false,
  isError: false,
  filters: {
    search: '',
    debouncedSearch: '',
    statusFilter: 'all',
    page: 1,
    limit: 20,
  },
  editing{Feature}: null,
  isCreateOpen: false,
};

// ── Slice ──
const {feature}sSlice = createSlice({
  name: '{feature}s',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    setDebouncedSearch(state, action: PayloadAction<string>) {
      state.filters.debouncedSearch = action.payload;
      state.filters.page = 1; // ALWAYS reset page on filter change
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.filters.statusFilter = action.payload;
      state.filters.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    setEditing{Feature}(state, action: PayloadAction<{Feature} | null>) {
      state.editing{Feature} = action.payload;
    },
    setCreateOpen(state, action: PayloadAction<boolean>) {
      state.isCreateOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch{Feature}s.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetch{Feature}s.fulfilled, (state, action) => {
        state.{feature}s = action.payload.data;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
      })
      .addCase(fetch{Feature}s.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const {
  setSearch,
  setDebouncedSearch,
  setStatusFilter,
  setPage,
  setEditing{Feature},
  setCreateOpen,
} = {feature}sSlice.actions;

// DEFAULT EXPORT — only exception to "named exports only" rule
export default {feature}sSlice.reducer;
```

**Rules enforced:**
- `createAsyncThunk` for GET APIs only — mutations use React Query
- ALL filter/pagination/UI state in Redux — NEVER `useState`
- `PayloadAction<T>` for every action
- Reset page to 1 on filter changes
- `export default` ONLY for the reducer (the sole exception)
- Named exports for actions and thunks

---

### FILE 5: Register Slice — EDIT `store/rootReducer.ts`

```typescript
// Add import:
import {feature}sReducer from './slices/{feature}Slice';

// Add to combineReducers:
{feature}s: {feature}sReducer,
```

---

### FILE 6: Mutation Hooks — `services/{feature}/{feature}.query.ts`

```typescript
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/utils/common-functions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetch{Feature}s } from '@/store/slices/{feature}Slice';
import { {feature}Api } from './{feature}.api';
import type { Create{Feature}Payload, Update{Feature}Payload } from '@/types/{feature}';

// ── Refetch helper — reads current Redux filters → dispatches thunk ──
function useRefetch{Feature}s() {
  const dispatch = useAppDispatch();
  const { debouncedSearch, statusFilter, page, limit } = useAppSelector(
    (s) => s.{feature}s.filters,
  );

  return () => {
    dispatch(
      fetch{Feature}s({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        page,
        limit,
      }),
    );
  };
}

// ── CREATE ──
export function useCreate{Feature}() {
  const refetch = useRefetch{Feature}s();

  return useMutation({
    mutationFn: (data: Create{Feature}Payload) => {feature}Api.create(data),
    onSuccess: () => {
      toast.success('{Feature} created successfully');
      refetch();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to create {feature}'));
    },
  });
}

// ── UPDATE ──
export function useUpdate{Feature}() {
  const refetch = useRefetch{Feature}s();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Update{Feature}Payload }) =>
      {feature}Api.update(id, data),
    onSuccess: () => {
      toast.success('{Feature} updated successfully');
      refetch();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update {feature}'));
    },
  });
}

// ── DELETE ──
export function useDelete{Feature}() {
  const refetch = useRefetch{Feature}s();

  return useMutation({
    mutationFn: (id: number) => {feature}Api.delete(id),
    onSuccess: () => {
      toast.success('{Feature} deleted successfully');
      refetch();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete {feature}'));
    },
  });
}
```

**Rules enforced:**
- EVERY mutation has `toast.success()` on success and `toast.error(getApiErrorMessage(...))` on error — NO EXCEPTIONS
- `getApiErrorMessage` always used with a human-readable fallback
- `useRefetch` reads current Redux filters and re-dispatches the fetch thunk
- Named function exports — never arrow function exports for hooks
- `useAppDispatch` / `useAppSelector` — NEVER raw `useDispatch` / `useSelector`

---

### FILE 7: Validation Schemas — APPEND to `utils/validations/index.ts`

```typescript
// ── {Feature} ────────────────────────────────────────────────────────

export const create{Feature}Schema = z.object({
  name: z.string().min(1, 'Name is required'),       // .min(1) for required — NEVER just .string()
  description: z.string().optional(),
  // ... more fields
});
export type Create{Feature}FormValues = z.infer<typeof create{Feature}Schema>;

export const update{Feature}Schema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  // ... more fields
});
export type Update{Feature}FormValues = z.infer<typeof update{Feature}Schema>;
```

**Rules enforced:**
- ALL schemas in this ONE file — NEVER in component files
- Schema naming: `{action}{Entity}Schema` (camelCase)
- Type naming: `{Action}{Entity}FormValues` (PascalCase)
- Required string fields use `.min(1, 'X is required')` — never just `.string()`
- Every schema exports a corresponding inferred type

---

### FILE 8: Page Component — `pages/{feature}/page.tsx`

```typescript
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetch{Feature}s,
  setSearch,
  setDebouncedSearch,
  setPage,
  setEditing{Feature},
  setCreateOpen,
} from '@/store/slices/{feature}Slice';
import { PageLoader } from '@/components/shared/PageLoader';
import type { {Feature} } from '@/types/{feature}';

export function {Feature}sPage() {
  const dispatch = useAppDispatch();
  const {
    {feature}s,
    isLoading,
    isError,
    pagination,
    filters: { search, debouncedSearch, statusFilter, page, limit },
    isCreateOpen,
    editing{Feature},
  } = useAppSelector((s) => s.{feature}s);

  // ── Debounced search (300ms) ──
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedSearch(search));
    }, 300);
    return () => clearTimeout(timer); // ALWAYS cleanup timers
  }, [search, dispatch]);

  // ── Fetch on filter change ──
  useEffect(() => {
    dispatch(
      fetch{Feature}s({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        page,
        limit,
      }),
    );
  }, [debouncedSearch, statusFilter, page, limit, dispatch]);

  // ── Handlers passed to children — MUST useCallback ──
  const handleEdit = useCallback(
    (item: {Feature}) => {
      dispatch(setEditing{Feature}(item));
    },
    [dispatch],
  );

  const handleCreateOpen = useCallback(() => {
    dispatch(setCreateOpen(true));
  }, [dispatch]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{Feature}s</h1>
        {/* Add create button here */}
      </div>

      {/* Search, filters, table/list, pagination */}
      {/* Use optional chaining (?.) on all nullable data */}
      {/* Use stable keys: key={item.id} — NEVER index */}
      {/* Use cn() for conditional Tailwind classes */}
    </div>
  );
}
```

**Rules enforced:**
- Named export: `export function` — never `export default`
- `useAppSelector` / `useAppDispatch` — never raw hooks
- Debounce search with 300ms timer + cleanup function
- `useCallback` for ALL handlers passed to child components as props
- Inline handlers on leaf elements (buttons) are fine without `useCallback`
- All hooks called BEFORE any conditional return
- Optional chaining `?.` on any nullable/API data
- `cn()` for all Tailwind class composition
- Stable keys (`item.id`) — NEVER array index

---

### FILE 9: Page Barrel Export — `pages/{feature}/index.ts`

```typescript
export { {Feature}sPage } from './page';
```

---

### FILE 10: Route Registration — EDIT `routes/route.tsx`

```typescript
// Add lazy import at the top (after existing lazy imports):
const {Feature}sPage = lazy(() =>
  import('@/pages/{feature}/page').then((m) => ({ default: m.{Feature}sPage })),
);

// Add route inside the protected /dashboard children array:
{
  path: '{feature}s',
  element: (
    <LazyPage>
      <{Feature}sPage />
    </LazyPage>
  ),
  requiredRole: ALL_ROLES, // or specific roles like ADMIN_LEVEL
},
```

**Rules enforced:**
- `React.lazy()` + `<Suspense>` (via `<LazyPage>`) for code splitting
- Named export re-exported as default for lazy loading compatibility
- `<ErrorBoundary>` wraps every lazy page (built into `<LazyPage>`)
- `requiredRole` array for role-based access

---

## Dialog/Modal Pattern (if feature has create/edit)

```typescript
// ── Dialog props — ALWAYS this pattern ──
interface {Feature}DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing{Feature}: {Feature} | null;  // null = create mode, non-null = edit mode
}

export function {Feature}Dialog({ open, onOpenChange, editing{Feature} }: {Feature}DialogProps) {
  const isEditing = editing{Feature} !== null;

  // RHF + Zod
  const form = useForm<Create{Feature}FormValues>({
    resolver: zodResolver(create{Feature}Schema),
  });

  // Mutation hook
  const createMutation = useCreate{Feature}();
  const updateMutation = useUpdate{Feature}();

  const handleSubmit = form.handleSubmit((data) => {
    if (isEditing) {
      updateMutation.mutate({ id: editing{Feature}!.id, data });
    } else {
      createMutation.mutate(data);
    }
  });

  // ... render dialog with form
}
```

**Rules enforced:**
- Same dialog for create + edit — check `editing{Feature}` to determine mode
- Dialog props: `open: boolean` + `onOpenChange: (open: boolean) => void`
- RHF + Zod resolver — never manual validation in components
- Mutation hooks handle toast notifications automatically

---

## Strict Checklist — Verify Before Done

After generating all files, verify every item:

- [ ] **`import type`** used for all type-only imports (verbatimModuleSyntax)
- [ ] **`@/` path alias** for every import — zero relative paths
- [ ] **Named exports** everywhere — no `export default` (except slice reducer)
- [ ] **`useAppSelector` / `useAppDispatch`** — never raw `useSelector` / `useDispatch`
- [ ] **No `useState`** for filters, pagination, fetched data, dialog state
- [ ] **Toast on every mutation** — both `onSuccess` and `onError`
- [ ] **`getApiErrorMessage(err, 'fallback')`** for error toasts
- [ ] **Zod schemas in `utils/validations/index.ts`** — not in components
- [ ] **`.min(1, 'Required')`** for required string fields
- [ ] **`useCallback`** on handlers passed to child components
- [ ] **`useEffect` cleanup** for timers/subscriptions
- [ ] **Stable keys** (`item.id`) — never array index
- [ ] **Optional chaining `?.`** on nullable objects + `??` for fallbacks
- [ ] **`cn()`** for all conditional Tailwind classes
- [ ] **PUT for updates** — never PATCH
- [ ] **`API_ENDPOINTS` constant** — never hardcoded URLs
- [ ] **Slice registered** in `rootReducer.ts`
- [ ] **Route added** with `<LazyPage>` wrapper and `requiredRole`
- [ ] **Icons**: Lucide React with `strokeWidth={1.5}`

## After Scaffolding

Tell the user:
1. List of all files created/modified
2. Run `npm run fe:lint` and `npm run fe:build` from root to verify
3. Remind them to scaffold the backend module with `/node {feature}` if not done
4. Mention the route path: `/dashboard/{feature}s`
