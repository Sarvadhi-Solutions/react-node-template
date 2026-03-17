# React Boilerplate

Production-ready React + TypeScript boilerplate with standardized patterns for building enterprise applications.

## Quick Start

```bash
# 1. Copy this boilerplate and rename
cp -r react-boilerplate my-new-project
cd my-new-project

# 2. Update project name in package.json, index.html, and globals.css

# 3. Create your environment file
cp .env.example .env.local

# 4. Install dependencies
npm install

# 5. Start development server
npm run local
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run local` | Dev server at :5000 (uses `.env.local`) |
| `npm run dev` | Dev server at :5001 (uses `.env.development`) |
| `npm run stg` | Dev server at :5002 (uses `.env.staging`) |
| `npm run prd` | Dev server at :5003 (uses `.env.production`) |
| `npm run build` | Production build (TypeScript check + Vite build) |
| `npm run lint` | ESLint strict mode (0 warnings allowed) |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Test coverage report |

## Project Structure

```
src/
├── components/
│   ├── layout/           # AppShell, route guards (ProtectedRoute, PublicRoute, RoleGuard)
│   ├── shared/           # Reusable components (ErrorBoundary, PageLoader, AppUpdateBanner)
│   └── ui/               # UI primitives (toast). Add your component library here.
├── contexts/             # React contexts (SidebarContext — example pattern)
├── hooks/                # Custom hooks
├── lib/                  # Core utilities (cn, logger, permissions, sanitize)
├── pages/{feature}/      # Feature pages (page.tsx + components/ + index.ts)
├── providers/            # Root providers (Redux > QueryClient > Toast)
├── routes/               # Route definitions with lazy loading + role guards
├── services/
│   ├── configs/          # Axios baseService + apiService (auto-unwraps response.data.data)
│   ├── react-query/      # QueryClient + query keys
│   └── {feature}/        # Feature API methods + mutation hooks
├── store/
│   ├── hooks.ts          # Typed useAppSelector / useAppDispatch
│   ├── rootReducer.ts    # Register all slices here
│   ├── storeSetup.ts     # Redux + persist config (only auth persisted)
│   └── slices/           # One slice per feature (authSlice included)
├── styles/globals.css    # Design tokens (CSS variables)
├── test/                 # Vitest setup, test utilities, MSW mock handlers
├── types/                # TypeScript definitions
└── utils/
    ├── constants/        # API endpoints, app constants, master data codes
    ├── common-functions/ # getApiErrorMessage()
    ├── validations/      # ALL Zod schemas (centralized)
    └── status-styles.ts  # Status code → Tailwind class mapping
```

## Coding Rules

**Read `CLAUDE.md`** for the complete coding standards. Key highlights:

1. **`import type`** — Required for type-only imports (`verbatimModuleSyntax` is ON)
2. **Named exports only** — Never use `export default` (except Redux slice reducers)
3. **Redux for all API data** — `createAsyncThunk` for GETs, state in slices
4. **React Query for mutations** — With toast notifications on success/error
5. **Centralized Zod schemas** — All in `src/utils/validations/index.ts`
6. **Toast on every mutation** — Always show success/error feedback
7. **Master data** — Never hardcode status names, match by `code`
8. **Logger, not console.log** — Use `logger` from `@/lib/logger`
9. **`cn()` for all classNames** — From `@/lib/utils`
10. **Optional chaining `?.`** — Always for nullable/API data access

## AI Assistants

- **Claude Code**: Reads `CLAUDE.md` automatically
- **Cursor AI**: Reads `.cursorrules` automatically (same content as CLAUDE.md)

Both files must stay in sync. Update both when rules change.

## Build Versioning

The boilerplate includes automatic build versioning:
- Every build writes a timestamp to `/version.json`
- `AppUpdateBanner` component detects new deployments (on route change + tab focus)
- Shows a non-intrusive "Update Now" banner — zero polling, zero background requests

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 + PWA support |
| Styling | Tailwind CSS 3.4 |
| State | Redux Toolkit + redux-persist |
| Server State | React Query (TanStack Query) |
| Forms | React Hook Form + Zod |
| Routing | React Router DOM 7 |
| HTTP | Axios (with auth interceptor) |
| Icons | Lucide React |
| Testing | Vitest + Testing Library + MSW |
| Notifications | react-hot-toast (custom wrapper) |
