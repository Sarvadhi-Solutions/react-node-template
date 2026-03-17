# Project Specification — ProjectSkelaton

> Production-ready full-stack boilerplate: React 19 frontend + Node.js/Express backend in a single monorepo.

## Purpose

A reusable skeleton for rapidly bootstrapping enterprise-grade web applications. Both apps live in one repo but are **independently runnable** — separate `package.json`, separate dev servers, separate builds.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Client (Browser)               │
│                                                  │
│  React 19 + Vite + TypeScript + Tailwind         │
│  Redux Toolkit (state) + React Query (mutations) │
│  React Router DOM 7 (routing + role guards)      │
└───────────────────┬─────────────────────────────┘
                    │ Axios (HTTP)
                    ▼
┌─────────────────────────────────────────────────┐
│                  REST API Server                 │
│                                                  │
│  Express + TypeScript                            │
│  Controller → Service → Repository (layered)     │
│  Prisma ORM + PostgreSQL                         │
│  JWT Auth + Role-Based Access                    │
└─────────────────────────────────────────────────┘
```

---

## Frontend Spec

### Tech Stack
| Category       | Technology                                    |
|---------------|-----------------------------------------------|
| Framework     | React 19 + TypeScript 5.9                     |
| Build Tool    | Vite 7                                         |
| Styling       | Tailwind CSS 3.4 + CSS Variables (design tokens)|
| State         | Redux Toolkit + redux-persist                  |
| Server State  | React Query (TanStack) — mutations only        |
| Forms         | React Hook Form + Zod                          |
| Routing       | React Router DOM 7 + lazy loading              |
| HTTP          | Axios (baseService + apiService wrapper)       |
| Icons         | Lucide React (strokeWidth={1.5})               |
| Testing       | Vitest + Testing Library + MSW                 |
| PWA           | vite-plugin-pwa                                |

### State Management Strategy
- **Redux Toolkit** — ALL API data, filters, pagination, UI state (dialogs, view modes)
- **React Query** — Mutations only (create/update/delete) with toast notifications
- **React Context** — Global UI-only state (sidebar collapse, timers)
- **Never `useState`** for: filters, pagination, fetched data, dialog open state

### Directory Convention
```
frontend/src/
├── components/{layout,shared,ui}/    # Reusable components
├── contexts/                         # React contexts
├── hooks/                            # Custom hooks
├── lib/                              # Utilities (cn, permissions, logger)
├── pages/{feature}/                  # Feature pages (page.tsx, components/, config/)
├── providers/                        # Provider wrappers
├── routes/                           # Route definitions + role guards
├── services/{configs,react-query,feature}/  # API layer
├── store/{slices}/                   # Redux store
├── styles/                           # CSS variables + design tokens
├── types/                            # TypeScript definitions
└── utils/{constants,validations,common-functions}/
```

### Key Patterns
- **Named exports only** (no default exports, except Redux slice reducers)
- **Path alias**: `@/` maps to `src/` — never use relative imports
- **`import type`** enforced via `verbatimModuleSyntax`
- **`cn()`** for all Tailwind class composition
- **Centralized Zod schemas** in `utils/validations/`
- **Toast on every mutation** (success + error with backend message)

### Scripts
```bash
npm run local      # Dev at :5000
npm run dev        # Dev at :5001
npm run build      # Production build
npm run lint       # ESLint (0 warnings)
npm run test:run   # Vitest
```

---

## Backend Spec

### Tech Stack
| Category       | Technology                          |
|---------------|-------------------------------------|
| Runtime       | Node.js 18+                         |
| Framework     | Express                             |
| Language      | TypeScript 5.7 (strict)             |
| ORM           | Prisma 6                            |
| Database      | PostgreSQL                          |
| Auth          | JWT (jsonwebtoken + bcryptjs)       |
| Validation    | Zod                                 |
| Logging       | Winston                             |
| Security      | Helmet + CORS + express-rate-limit  |

### Architecture: Controller → Service → Repository
- **Controllers** — HTTP only: parse request, call service, return response via `handleApiResponse`
- **Services** — Business rules, orchestration, throw `AppError` for expected failures
- **Repositories** — Data access only (Prisma)

### Performance Rule: Raw SQL for Reads
- All **read operations** use `prisma.$queryRaw` with parameterized queries
- No `findMany` / `findUnique` / `findFirst` for data retrieval
- Single well-structured SQL over multiple round-trips (no N+1)
- Always paginate list endpoints, select only required columns
- **Writes** (create/update/delete) may use regular Prisma client

### Directory Convention
```
backend/src/
├── config/                  # Environment loader (Zod-validated)
├── constant/                # ERROR_TYPES, RES_TYPES, RES_STATUS, END_POINTS
├── db/                      # Prisma client singleton
├── logger/                  # Winston logger
├── middleware/               # auth, errorHandler, responseHandler, validation, security
├── modules/{feature}/       # Feature modules
│   ├── {feature}.controller.ts
│   ├── {feature}.service.ts
│   ├── {feature}.repository.ts
│   ├── {feature}.routes.ts
│   └── {feature}.types.ts
├── routes/                  # Main router + health check
├── types/                   # Express augmentations
└── utils/                   # AppError, handleResponse, jwt
```

### Standardized API Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { },
  "pagination": { "total": 100 }
}
```

### Scripts
```bash
npm run dev            # Dev server with nodemon
npm run build          # TypeScript compilation
npm run build:interactive  # Interactive build (branch + env + message)
npm run db:migrate     # Prisma migrate
npm run db:seed        # Seed database
```

---

## Shared Conventions

### Environment Flavors
Both apps support: `local` | `dev` | `staging` | `production`

### Validation
Zod everywhere — frontend form schemas + backend request validation

### Authentication Flow
1. User logs in → backend returns JWT
2. Frontend stores token in Redux (persisted via redux-persist)
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. Backend `authenticate` middleware validates JWT
5. Role guards (`authorizeByRole`) restrict access on both ends

### Roles
| Role         | Access Level |
|-------------|-------------|
| SUPER_ADMIN | Full system access |
| ADMIN       | Organization management |
| MANAGER     | Team management |
| MEMBER      | Standard user |

---

## Adding a New Feature (End-to-End)

### Backend
1. Create `src/modules/{feature}/` with controller, service, repository, routes, types
2. Add Zod validation schemas in types file
3. Register routes in `src/routes/index.ts`
4. Add Prisma model in `prisma/schema.prisma` and migrate
5. Add constants to `src/constant/`

### Frontend
1. Create `src/pages/{feature}/page.tsx` + components
2. Add types in `src/types/{feature}.ts`
3. Add API service in `src/services/{feature}/{feature}.api.ts`
4. Add Redux slice in `src/store/slices/{feature}Slice.ts` + register in rootReducer
5. Add mutation hooks in `src/services/{feature}/{feature}.query.ts`
6. Add Zod schemas in `src/utils/validations/index.ts`
7. Add route in `src/routes/route.tsx` with role guard
8. Add API endpoint constant in `src/utils/constants/api.constant.ts`
