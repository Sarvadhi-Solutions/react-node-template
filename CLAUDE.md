# ProjectSkelaton — Full-Stack Monorepo

> React 19 + Node.js/Express/Prisma in a single repository, managed and run separately.

## Repository Layout

```
ProjectSkelaton/
├── package.json       # Root — monorepo scripts, Husky, lint-staged
├── .husky/pre-commit  # Single pre-commit hook for entire repo
├── .prettierrc        # Shared Prettier config
├── .gitignore         # Shared gitignore
├── frontend/          # React 19 SPA (Vite + TypeScript + Tailwind)
├── backend/           # Node.js REST API (Express + Prisma + PostgreSQL)
├── project-spec.md    # Full project specification
├── .claude/
│   ├── rules/
│   │   ├── react.md   # Frontend coding rules (auto-loaded for frontend/ work)
│   │   └── node.md    # Backend coding rules (auto-loaded for backend/ work)
│   └── skills/
│       ├── react.md   # /react skill — scaffold React features
│       └── node.md    # /node skill — scaffold Node modules
└── CLAUDE.md          # ← You are here
```

## Quick Start

```bash
# Install everything (root + frontend + backend)
npm install && npm run install:all

# Run frontend (http://localhost:5000)
npm run fe:dev

# Run backend (http://localhost:3000)
npm run be:dev

# Or run any sub-project command directly
npm run fe -- run build       # frontend build
npm run be -- run dev         # backend dev
```

## Monorepo Scripts (root package.json)

| Command | What it does |
|---------|-------------|
| `npm run install:all` | Install deps in both frontend + backend |
| `npm run fe:dev` | Start frontend dev server (:5000) |
| `npm run be:dev` | Start backend dev server |
| `npm run fe:build` | Build frontend for production |
| `npm run be:build` | Build backend (TypeScript compile) |
| `npm run lint` | Lint both frontend + backend |
| `npm run fe:test` | Run frontend tests (Vitest) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database |
| `npm run fe -- run <script>` | Run any frontend script |
| `npm run be -- run <script>` | Run any backend script |

## Husky & Lint-Staged (Root Only)

Husky is configured **only at the root** — not inside frontend or backend.
- Pre-commit runs `lint-staged` which auto-detects changed files:
  - `frontend/src/**/*.{ts,tsx}` → ESLint + Prettier
  - `backend/src/**/*.{ts,tsx}` → ESLint + Prettier
  - `**/*.{json,md}` → Prettier

## Rules System

Rules are **auto-scoped** by directory:
- Working in `frontend/` → `.claude/rules/react.md` applies
- Working in `backend/` → `.claude/rules/node.md` applies
- Both rule files are mandatory — every contributor (human or AI) must follow them

## Skills

Use skills to scaffold new features with consistent patterns:
- `/react` — Scaffold a new React feature (page, slice, API service, types, validation)
- `/node` — Scaffold a new Node module (controller, service, repository, routes, types)

## Cross-Cutting Rules

These apply to **both** frontend and backend:

### TypeScript
- Strict mode enabled — zero `any`, zero unused variables
- Explicit return types on exported functions
- `import type` for type-only imports

### Code Quality
- ESLint + Prettier must pass before merge
- Husky pre-commit hooks enforced — never skip with `--no-verify`
- Zero warnings policy (`--max-warnings 0`)

### Git Conventions
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- One logical change per commit
- PR titles follow the same convention

### Environment
- Never commit `.env` files — use `.env.example` as template
- Environment flavors: `local`, `dev`, `staging`, `production`
- Frontend ports: 5000 (local), 5001 (dev), 5002 (staging), 5003 (prod)
- Backend: configured via `APP_ENV`

### Validation
- Zod for all validation — frontend forms and backend request validation
- Schemas are centralized, never inline in components/controllers

### Security
- No secrets in code — all via environment variables
- CORS, Helmet, rate-limiting on backend
- JWT auth with role-based guards on both ends
- Roles: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `MEMBER` (frontend) / `USER`, `ADMIN`, `SUPER_ADMIN` (backend enum)

### Logging
- Never use raw `console.log` in application code
- Frontend: use `logger` from `@/lib/logger`
- Backend: use `logger` from `src/logger/logger.ts` (Winston)
