# Node.js Backend Rules

> Auto-loaded when working in `backend/`. Mandatory for all development — human or AI.

## Quick Reference

```bash
cd backend
npm run dev              # Dev server with nodemon
npm run build            # TypeScript compilation
npm run build:interactive # Interactive build (branch + env + message)
npm run db:migrate       # Prisma migrate dev
npm run db:seed          # Seed database
npm run lint             # ESLint
```

## Tech Stack

Node.js 18+ · Express · TypeScript 5.7 (strict) · Prisma 6 · PostgreSQL · JWT · Zod · Winston · Helmet · CORS · express-rate-limit

---

## 1. Architecture: Controller → Service → Repository

Every module follows strict layering. Never skip layers.

| Layer | Responsibility | Can Call |
|-------|---------------|---------|
| **Controller** | HTTP only — parse request, call service, return via `handleApiResponse` | Service |
| **Service** | Business rules, orchestration, throw `AppError` for expected failures | Repository |
| **Repository** | Data access only (Prisma) | Database |

### File Structure per Module
```
src/modules/{feature}/
├── {feature}.controller.ts   # HTTP handlers
├── {feature}.service.ts      # Business logic
├── {feature}.repository.ts   # Database access
├── {feature}.routes.ts       # Route definitions + validation
└── {feature}.types.ts        # DTOs + Zod schemas
```

---

## 2. Data Access — Prisma Performance Rules

### Reads: Raw SQL ONLY
```typescript
// CORRECT — raw SQL for all reads
const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, first_name, last_name, role
  FROM "User"
  WHERE role = ${role}
  ORDER BY created_at DESC
  LIMIT ${pageSize} OFFSET ${offset}
`;

// WRONG — never use for reads
const users = await prisma.user.findMany({ where: { role } });
```

- Always `prisma.$queryRaw` with parameterized template strings
- No `findMany` / `findUnique` / `findFirst` for data retrieval
- Single well-structured SQL over multiple round-trips (no N+1)
- Always paginate list endpoints
- Select only required columns

### Writes: Prisma Client Allowed
```typescript
// Writes can use Prisma client
const user = await prisma.user.create({ data: { email, password: hashedPassword, role } });
```

---

## 3. Responses & Errors

### Standardized Response
Always use `handleApiResponse` / `handleErrorResponse`:
```typescript
// Controller
const users = await userService.getAll(query);
handleApiResponse(res, RES_STATUS.OK, RES_TYPES.SUCCESS, 'Users fetched', users);
```

Response shape: `{ success, statusCode, message, data?, pagination? }`

### Error Handling
- Only throw `AppError` from services/controllers
- Use `ERROR_TYPES` and `RES_TYPES` for categorization
- Never send raw error stacks to clients — `ErrorHandler` middleware handles this
- Constants from `src/constant/` (`ERROR_TYPES`, `RES_TYPES`, `RES_STATUS`, `END_POINTS`)

```typescript
throw new AppError(
  'User not found',
  RES_STATUS.NOT_FOUND,
  ERROR_TYPES.NOT_FOUND,
);
```

---

## 4. Validation

- Zod schemas + `validateRequest` middleware for `body`, `query`, and `params`
- NEVER manually validate in controllers — centralize via schemas
- Schemas defined in `{feature}.types.ts`

```typescript
// {feature}.types.ts
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
  }),
});

// {feature}.routes.ts
router.post('/', validateRequest(createUserSchema), userController.create);
```

---

## 5. Security & Auth

### Middlewares (registered in `app.ts`)
- `helmet` — security headers
- `cors` — explicit origin configuration
- `express-rate-limit` — values from config

### JWT Authentication
- All protected routes use `authenticate` from `src/middleware/auth.ts`
- Role guards: `authorizeByRole`, `authorizeByAnyRole`

```typescript
router.get('/', authenticate, authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']), userController.getAll);
```

---

## 6. Environment & Builds

### Environment Flavors
`APP_ENV` values: `local` | `dev` | `staging` | `production`

- Config loader reads base `.env` then overlays `.env.<APP_ENV>`
- Maintain: `.env.local`, `.env.dev`, `.env.staging`, `.env.production`
- Zod-validated config in `src/config/config.ts`

### Build Scripts
- `build:interactive` — primary entry point (branch + env + message → `dist/build-info.json`)
- `build:local`, `build:dev`, `build:staging`, `build:prod` — flavor-specific
- Never remove or bypass `scripts/build-interactive.ts`

---

## 7. Logging

- Use `logger` from `src/logger/logger.ts` (Winston)
- NEVER use `console.log` / `console.error` in application code
- Only allowed in scripts and startup (exceptional cases)
- Request logging centralized in `responseHandler` middleware

---

## 8. Path Aliases

tsconfig maps these aliases:
```
@app/*       → src/*
@config/*    → src/config/*
@constant/*  → src/constant/*
@middleware/* → src/middleware/*
@logger/*    → src/logger/*
@utils/*     → src/utils/*
@routes/*    → src/routes/*
@modules/*   → src/modules/*
@db/*        → src/db/*
```

---

## 9. Database (Prisma)

- Schema: `prisma/schema.prisma` (PostgreSQL provider)
- Migrations: `prisma/migrations/`
- Seed: `prisma/seed.ts`
- Client singleton: `src/db/prisma.ts`
- User model with `UserRole` enum: `USER`, `ADMIN`, `SUPER_ADMIN`

---

## 10. Quality Standards

| Rule | Detail |
|------|--------|
| TypeScript | Strict mode — zero `any`, zero unused variables |
| ESLint + Prettier | Must pass before merge |
| Husky | Pre-commit hooks enforced — never skip |
| Modules | Small, focused, well-named |
| DTOs | Explicit typed DTOs and return types |
| Constants | Add to `src/constant/` — never hardcode strings |
| Response messages | Use `src/constant/message.constant.ts` |
| Incremental changes | Small PRs over large rewrites |
