# ProjectSkelaton

Production-ready full-stack monorepo boilerplate — **React 19** frontend + **Node.js/Express/Prisma** backend — in a single repository, independently runnable.

```
┌─────────────────────────────────────────────────┐
│                 Client (Browser)                 │
│                                                  │
│  React 19 · Vite 7 · TypeScript 5.9 · Tailwind  │
│  Redux Toolkit · React Query · React Router 7   │
└──────────────────────┬──────────────────────────┘
                       │ Axios (HTTP + JWT)
                       ▼
┌─────────────────────────────────────────────────┐
│                 REST API Server                  │
│                                                  │
│  Express · TypeScript 5.7 · Prisma 6 · Postgres │
│  Controller → Service → Repository (layered)    │
│  JWT Auth · Role Guards · Winston Logger        │
└─────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** running locally (for backend)
- **npm** 9+

### Setup

```bash
# 1. Clone the repo
git clone <your-repo-url> && cd ProjectSkelaton

# 2. Install all dependencies (root + frontend + backend)
npm install && npm run install:all

# 3. Setup backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your DATABASE_URL, JWT_SECRET, etc.

# 4. Setup frontend environment
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your API base URL

# 5. Setup database
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed initial data

# 6. Start development
npm run fe:dev         # Frontend → http://localhost:5000
npm run be:dev         # Backend  → http://localhost:3000
```

---

## Monorepo Scripts

All commands run from the **project root**:

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for both frontend and backend |
| `npm run fe:dev` | Start frontend dev server (port 5000) |
| `npm run be:dev` | Start backend dev server (port 3000) |
| `npm run fe:build` | Production build for frontend |
| `npm run be:build` | Compile backend TypeScript to `dist/` |
| `npm run lint` | Lint both frontend and backend |
| `npm run fe:test` | Run frontend tests (Vitest) |
| `npm run db:migrate` | Run Prisma database migrations |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:generate` | Regenerate Prisma client |

**Run any sub-project script directly:**

```bash
npm run fe -- run <script>    # e.g. npm run fe -- run build:dev
npm run be -- run <script>    # e.g. npm run be -- run build:interactive
```

---

## Project Structure

```
ProjectSkelaton/
├── package.json              # Root: monorepo scripts, Husky, lint-staged
├── .husky/pre-commit         # Single pre-commit hook for entire repo
├── .prettierrc               # Shared Prettier config
├── .gitignore                # Shared gitignore
│
├── frontend/                 # React 19 SPA
│   ├── src/
│   │   ├── components/       # layout/ · shared/ · ui/
│   │   ├── contexts/         # React contexts (sidebar, etc.)
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities (cn, logger, permissions)
│   │   ├── pages/{feature}/  # Feature pages (page.tsx + components/)
│   │   ├── providers/        # Root providers (Redux → Query → Toast)
│   │   ├── routes/           # Route definitions + role guards
│   │   ├── services/         # API layer + React Query mutations
│   │   ├── store/            # Redux slices + typed hooks
│   │   ├── styles/           # Design tokens (CSS variables)
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Constants, validations, helpers
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js REST API
│   ├── src/
│   │   ├── config/           # Env loader (Zod-validated)
│   │   ├── constant/         # Error types, response types, endpoints
│   │   ├── db/               # Prisma client singleton
│   │   ├── logger/           # Winston logger
│   │   ├── middleware/       # Auth, validation, error handler, security
│   │   ├── modules/          # Feature modules (controller → service → repo)
│   │   │   ├── user/         # Full CRUD example
│   │   │   └── auth/         # Auth scaffold
│   │   ├── routes/           # Main router + health check
│   │   └── utils/            # AppError, response helpers, JWT
│   ├── prisma/               # Schema, migrations, seed
│   └── package.json
│
├── .claude/                  # AI assistant configuration
│   ├── rules/react.md        # Frontend coding rules
│   ├── rules/node.md         # Backend coding rules
│   ├── skills/react.md       # /react — scaffold React features
│   └── skills/node.md        # /node — scaffold backend modules
│
├── CLAUDE.md                 # AI assistant entry point
├── project-spec.md           # Full project specification
└── README.md                 # ← You are here
```

---

## Tech Stack

### Frontend

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript 5.9 |
| Build Tool | Vite 7 + PWA support |
| Styling | Tailwind CSS 3.4 + CSS Variables |
| State | Redux Toolkit + redux-persist |
| Server State | React Query (TanStack) — mutations only |
| Forms | React Hook Form + Zod |
| Routing | React Router DOM 7 + lazy loading |
| HTTP | Axios (auth interceptor + auto-unwrap) |
| Icons | Lucide React |
| Testing | Vitest + Testing Library + MSW |

### Backend

| Category | Technology |
|----------|------------|
| Runtime | Node.js 18+ |
| Framework | Express |
| Language | TypeScript 5.7 (strict) |
| ORM | Prisma 6 (raw SQL reads) |
| Database | PostgreSQL |
| Auth | JWT + bcryptjs |
| Validation | Zod |
| Logging | Winston |
| Security | Helmet + CORS + express-rate-limit |

---

## Architecture

### Frontend — State Management

| What | Where |
|------|-------|
| API data, filters, pagination, UI state | **Redux Toolkit** (createAsyncThunk for GETs) |
| Mutations (create/update/delete) | **React Query** (with toast notifications) |
| Global UI state (sidebar, timers) | **React Context** |

### Backend — Layered Architecture

```
Request → Middleware (auth, validate) → Controller → Service → Repository → Database
                                             ↓
                                        handleApiResponse → { success, statusCode, message, data, pagination }
```

| Layer | Responsibility |
|-------|---------------|
| **Controller** | HTTP only — parse request, call service, return response |
| **Service** | Business rules, orchestration, throw `AppError` |
| **Repository** | Data access — raw SQL reads (`$queryRaw`), Prisma writes |

---

## Authentication & Roles

**Flow:** Login → JWT issued → stored in Redux (persisted) → Axios interceptor attaches `Bearer` token → backend validates via `authenticate` middleware → role guards restrict access.

| Role | Access Level |
|------|-------------|
| `SUPER_ADMIN` | Full system access |
| `ADMIN` | Organization management |
| `MANAGER` | Team management |
| `MEMBER` | Standard user |

---

## Environment Configuration

Both apps support four environments: `local` · `dev` · `staging` · `production`

**Frontend ports:** 5000 (local) · 5001 (dev) · 5002 (staging) · 5003 (prod)

**Backend:** controlled via `APP_ENV` variable — config loader reads base `.env` then overlays `.env.<APP_ENV>`.

> Never commit `.env` files. Use `.env.example` as template.

---

## Code Quality

### Pre-Commit Hooks

Husky is configured at the **root only**. On every commit, lint-staged automatically:
- Runs **ESLint** on changed `.ts/.tsx` files in `frontend/` and `backend/` (using each project's own config)

### Standards

- **TypeScript strict mode** — zero `any`, zero unused variables
- **ESLint** — zero warnings policy (`--max-warnings 0`)
- **Prettier** — consistent formatting (single quotes, trailing commas, 100 char width)
- **Conventional commits** — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- **Zod** — centralized validation schemas (frontend forms + backend requests)
- **No `console.log`** — use project logger (frontend: `@/lib/logger`, backend: Winston)

---

## Adding a New Feature

### Backend

1. Create `backend/src/modules/{feature}/` with 5 files:
   - `{feature}.controller.ts` — HTTP handlers
   - `{feature}.service.ts` — Business logic
   - `{feature}.repository.ts` — Database access (raw SQL reads)
   - `{feature}.routes.ts` — Routes + validation middleware
   - `{feature}.types.ts` — DTOs + Zod schemas
2. Add Prisma model in `prisma/schema.prisma` → run `npm run db:migrate`
3. Register routes in `backend/src/routes/index.ts`
4. Add endpoint constant in `backend/src/constant/endPoints.constant.ts`

### Frontend

1. Create `frontend/src/pages/{feature}/page.tsx` + components
2. Add types in `frontend/src/types/{feature}.ts`
3. Add API service in `frontend/src/services/{feature}/{feature}.api.ts`
4. Add Redux slice in `frontend/src/store/slices/{feature}Slice.ts` → register in `rootReducer.ts`
5. Add mutation hooks in `frontend/src/services/{feature}/{feature}.query.ts`
6. Add Zod schemas in `frontend/src/utils/validations/index.ts`
7. Add route in `frontend/src/routes/route.tsx` with role guard
8. Add API endpoint in `frontend/src/utils/constants/api.constant.ts`

### With AI Assistants

Use the built-in skills for consistent scaffolding:
- **`/node <feature>`** — generates all backend module files
- **`/react <feature>`** — generates all frontend feature files

---

## AI Assistant Support

This repo is configured for consistent AI-assisted development:

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Entry point — repo layout, monorepo scripts, cross-cutting rules |
| `.claude/rules/react.md` | Frontend coding rules (auto-loaded for `frontend/` work) |
| `.claude/rules/node.md` | Backend coding rules (auto-loaded for `backend/` work) |
| `.claude/skills/react.md` | `/react` skill — scaffold React features |
| `.claude/skills/node.md` | `/node` skill — scaffold Node.js modules |
| `frontend/.cursorrules` | Same rules for Cursor IDE |
| `project-spec.md` | Full architectural specification |

Every team member — human or AI — follows the same rules, producing consistent code across the entire codebase.

---

## License

Private — Internal use only.
