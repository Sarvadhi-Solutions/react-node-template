---
name: node
description: Scaffold a complete Node.js backend module with all required files — types, repository (raw SQL reads), service, controller, routes, Prisma model, constants, and route registration — following project conventions strictly
user_invocable: true
---

# /node — Scaffold a Node.js Backend Module

## Usage

```
/node <module-name>
```

## Pre-Flight

Before generating ANY code:

1. **Read the rules** — Load `.claude/rules/node.md` and understand every convention
2. **Read existing patterns** — Study these files to match the EXACT code style:
   - `backend/src/modules/user/user.types.ts` — DTO + Zod schema pattern
   - `backend/src/modules/user/user.repository.ts` — raw SQL reads + Prisma writes
   - `backend/src/modules/user/user.service.ts` — business logic + AppError pattern
   - `backend/src/modules/user/user.controller.ts` — HTTP handler + handleApiResponse
   - `backend/src/modules/user/user.routes.ts` — route wiring with validateRequest + auth
   - `backend/src/constant/message.constant.ts` — RES_STATUS + RES_TYPES
   - `backend/src/constant/errorTypes.constant.ts` — ERROR_TYPES
   - `backend/src/constant/endPoints.constant.ts` — END_POINTS
   - `backend/src/utils/appError.ts` — AppError class signature
   - `backend/src/utils/handleResponse.ts` — handleApiResponse signature
   - `backend/src/middleware/validation.ts` — validateRequest({ body, query, params })
3. **Ask the user** for:
   - **Module name** (if not provided) — singular noun, e.g., `project`, `task`, `invoice`
   - **Fields/properties** — what data does this module manage? (name, description, status, etc.)
   - **Field types** — string, number, boolean, Date, enum, relation to other models?
   - **CRUD operations** — which ones? list, get by ID, create, update, delete?
   - **Auth requirements** — public, authenticated, or role-restricted? Which roles?
   - **Relationships** — belongs to User? Has many items? Foreign keys?
   - **Search/filter fields** — which fields should be searchable in list endpoint?
   - **Unique constraints** — any unique fields (like email on User)?

---

## Files to Generate

Generate ALL files below. Replace `{module}` with lowercase, `{Module}` with PascalCase, `{MODULE}` with UPPER_SNAKE_CASE.

---

### FILE 1: Types — `src/modules/{module}/{module}.types.ts`

```typescript
import { z } from 'zod';

// ── DTO — matches Prisma model shape, used as return type from repository ──
export interface {Module}DTO {
  id: number;
  // ... fields from user input, matching Prisma column names
  createdAt: Date;
  updatedAt: Date;
}

// ── Zod Schemas — used by validateRequest middleware ──
// validateRequest accepts { body?, query?, params? } — each a separate Zod schema

export const create{Module}Schema = z.object({
  // Fields with proper validation
  // Required strings: .min(1, 'X is required') — NEVER just .string()
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  // ... more fields
});

export const update{Module}Schema = z
  .object({
    // All fields optional for partial updates
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    // ... more fields
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.',
  });

export const {module}IdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, { message: 'id must be a positive integer' })
    .transform((value) => Number(value)),
});

export const list{Module}sQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 1))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 10))
    .pipe(z.number().int().min(1).max(100)),
  search: z.string().optional(),
});

// ── Inferred Types ──
export type Create{Module}Dto = z.infer<typeof create{Module}Schema>;
export type Update{Module}Dto = z.infer<typeof update{Module}Schema>;
```

**Rules enforced:**
- Zod schemas are separate for `body`, `query`, `params` — passed individually to `validateRequest`
- Query params come as strings from Express — use `.transform()` to coerce to numbers
- Update schema uses `.refine()` to require at least one field
- ID param validated and transformed to number
- Pagination: page defaults to 1, limit defaults to 10, max 100
- Required strings always use `.min(1, 'message')` — never bare `.string()`

---

### FILE 2: Repository — `src/modules/{module}/{module}.repository.ts`

```typescript
import { prisma } from '@db/prisma';
import type { {Module}DTO } from './{module}.types';

// ── Repository Input Types ──
export interface Create{Module}RepositoryInput {
  name: string;
  description?: string;
}

export interface Update{Module}RepositoryInput {
  name?: string;
  description?: string;
}

export interface List{Module}sParams {
  page: number;
  limit: number;
  search?: string;
}

export interface List{Module}sResult {
  {module}s: {Module}DTO[];
  total: number;
}

// ── READS: Raw SQL ONLY — MANDATORY, no findMany/findUnique/findFirst ──

export const findAll{Module}s = async (params: List{Module}sParams): Promise<List{Module}sResult> => {
  const offset = (params.page - 1) * params.limit;

  const {module}s = await prisma.$queryRaw<{Module}DTO[]>`
    SELECT "id", "name", "description", "createdAt", "updatedAt"
    FROM "{Module}"
    WHERE (${params.search ?? null}::text IS NULL OR "name" ILIKE ${'%' + (params.search ?? '') + '%'})
    ORDER BY "createdAt" DESC
    LIMIT ${params.limit} OFFSET ${offset}
  `;

  const [{ count }] = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS "count"
    FROM "{Module}"
    WHERE (${params.search ?? null}::text IS NULL OR "name" ILIKE ${'%' + (params.search ?? '') + '%'})
  `;

  return {
    {module}s,
    total: Number(count),
  };
};

export const find{Module}ById = async (id: number): Promise<{Module}DTO | null> => {
  const rows = await prisma.$queryRaw<{Module}DTO[]>`
    SELECT "id", "name", "description", "createdAt", "updatedAt"
    FROM "{Module}"
    WHERE "id" = ${id}
    LIMIT 1
  `;

  return rows[0] ?? null;
};

// ── WRITES: Prisma client allowed ──

export const create{Module} = async (input: Create{Module}RepositoryInput): Promise<{Module}DTO> => {
  const created = await prisma.{module}.create({
    data: {
      name: input.name,
      description: input.description,
    },
  });

  // Return via raw SQL read to match DTO shape exactly
  const [row] = await prisma.$queryRaw<{Module}DTO[]>`
    SELECT "id", "name", "description", "createdAt", "updatedAt"
    FROM "{Module}"
    WHERE "id" = ${created.id}
    LIMIT 1
  `;

  return row;
};

export const update{Module} = async (
  id: number,
  input: Update{Module}RepositoryInput,
): Promise<{Module}DTO | null> => {
  await prisma.{module}.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
    },
  });

  const rows = await prisma.$queryRaw<{Module}DTO[]>`
    SELECT "id", "name", "description", "createdAt", "updatedAt"
    FROM "{Module}"
    WHERE "id" = ${id}
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const delete{Module} = async (id: number): Promise<void> => {
  await prisma.{module}.delete({
    where: { id },
  });
};
```

**Rules enforced:**
- **ALL reads use `prisma.$queryRaw`** — NEVER `findMany` / `findUnique` / `findFirst`
- Parameterized template strings for SQL injection protection
- Select only required columns — never `SELECT *` in list queries
- Always paginate with `LIMIT` + `OFFSET`
- Writes use Prisma client but return via raw SQL read for consistent DTO shape
- `rows[0] ?? null` for single-item queries — null-safe
- `Number(count)` to convert BigInt from PostgreSQL COUNT

---

### FILE 3: Service — `src/modules/{module}/{module}.service.ts`

```typescript
import { ERROR_TYPES } from '@constant/errorTypes.constant';
import { RES_TYPES } from '@constant/message.constant';
import { AppError } from '@utils/appError';
import type { Create{Module}Dto, {Module}DTO, Update{Module}Dto } from './{module}.types';
import {
  create{Module},
  delete{Module},
  findAll{Module}s,
  find{Module}ById,
  update{Module},
} from './{module}.repository';

export interface List{Module}sServiceParams {
  page: number;
  limit: number;
  search?: string;
}

export interface List{Module}sServiceResult {
  {module}s: {Module}DTO[];
  total: number;
  page: number;
  limit: number;
}

export const create{Module}Service = async (dto: Create{Module}Dto): Promise<{Module}DTO> => {
  // Add uniqueness checks here if needed:
  // const existing = await find{Module}ByName(dto.name);
  // if (existing) {
  //   throw new AppError({
  //     errorType: ERROR_TYPES.CONFLICT,
  //     message: RES_TYPES.CONFLICT,
  //     code: '{MODULE}_ALREADY_EXISTS',
  //   });
  // }

  const {module} = await create{Module}({
    name: dto.name,
    description: dto.description,
  });

  return {module};
};

export const get{Module}ByIdService = async (id: number): Promise<{Module}DTO> => {
  const {module} = await find{Module}ById(id);

  if (!{module}) {
    throw new AppError({
      errorType: ERROR_TYPES.NOT_FOUND,
      message: RES_TYPES.RESOURCE_NOT_FOUND,
      code: '{MODULE}_NOT_FOUND',
    });
  }

  return {module};
};

export const list{Module}sService = async (
  params: List{Module}sServiceParams,
): Promise<List{Module}sServiceResult> => {
  const result = await findAll{Module}s(params);

  return {
    {module}s: result.{module}s,
    total: result.total,
    page: params.page,
    limit: params.limit,
  };
};

export const update{Module}Service = async (
  id: number,
  dto: Update{Module}Dto,
): Promise<{Module}DTO> => {
  const existing = await find{Module}ById(id);

  if (!existing) {
    throw new AppError({
      errorType: ERROR_TYPES.NOT_FOUND,
      message: RES_TYPES.RESOURCE_NOT_FOUND,
      code: '{MODULE}_NOT_FOUND',
    });
  }

  const updated = await update{Module}(id, {
    name: dto.name,
    description: dto.description,
  });

  if (!updated) {
    throw new AppError({
      errorType: ERROR_TYPES.UNKNOWN_ERROR,
      message: RES_TYPES.INTERNAL_SERVER_ERROR,
      code: '{MODULE}_UPDATE_FAILED',
    });
  }

  return updated;
};

export const delete{Module}Service = async (id: number): Promise<void> => {
  const existing = await find{Module}ById(id);

  if (!existing) {
    throw new AppError({
      errorType: ERROR_TYPES.NOT_FOUND,
      message: RES_TYPES.RESOURCE_NOT_FOUND,
      code: '{MODULE}_NOT_FOUND',
    });
  }

  await delete{Module}(id);
};
```

**Rules enforced:**
- Only throws `AppError` — NEVER raw `Error`
- `AppError` uses `{ errorType, message, code }` matching `src/utils/appError.ts`
- `errorType` uses `ERROR_TYPES` constants — never hardcoded
- `message` uses `RES_TYPES` constants — never hardcoded
- `code` is unique machine-readable like `{MODULE}_NOT_FOUND`
- Service ONLY calls Repository — never direct Prisma access
- Always verify entity exists before update/delete
- Business rules (uniqueness, permissions) live HERE — not in controller or repository

---

### FILE 4: Controller — `src/modules/{module}/{module}.controller.ts`

```typescript
import type { Request, Response } from 'express';
import { RES_STATUS, RES_TYPES } from '@constant/message.constant';
import { handleApiResponse } from '@utils/handleResponse';
import {
  create{Module}Service,
  delete{Module}Service,
  get{Module}ByIdService,
  list{Module}sService,
  update{Module}Service,
} from './{module}.service';

export const create{Module}Controller = async (req: Request, res: Response) => {
  const {module} = await create{Module}Service(req.body);

  return handleApiResponse(res, {
    responseType: RES_STATUS.CREATE,
    message: RES_TYPES.{MODULE}_CREATED,
    data: {module},
  });
};

export const get{Module}ByIdController = async (req: Request, res: Response) => {
  const {module}Id = Number(req.params.id);
  const {module} = await get{Module}ByIdService({module}Id);

  return handleApiResponse(res, {
    responseType: RES_STATUS.GET,
    message: RES_TYPES.{MODULE}_FETCHED,
    data: {module},
  });
};

export const list{Module}sController = async (req: Request, res: Response) => {
  const { page, limit, search } = req.query as unknown as {
    page: number;
    limit: number;
    search?: string;
  };

  const result = await list{Module}sService({ page, limit, search });

  return handleApiResponse(res, {
    responseType: RES_STATUS.GET,
    message: RES_TYPES.{MODULE}S_FETCHED,
    data: result.{module}s,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
    },
  });
};

export const update{Module}Controller = async (req: Request, res: Response) => {
  const {module}Id = Number(req.params.id);
  const {module} = await update{Module}Service({module}Id, req.body);

  return handleApiResponse(res, {
    responseType: RES_STATUS.UPDATE,
    message: RES_TYPES.{MODULE}_UPDATED,
    data: {module},
  });
};

export const delete{Module}Controller = async (req: Request, res: Response) => {
  const {module}Id = Number(req.params.id);
  await delete{Module}Service({module}Id);

  return handleApiResponse(res, {
    responseType: RES_STATUS.DELETE,
    message: RES_TYPES.{MODULE}_DELETED,
  });
};
```

**Rules enforced:**
- Controllers are HTTP-ONLY — no business logic, no direct DB access
- `handleApiResponse` for ALL responses — `{ responseType, message, data?, pagination? }`
- `responseType` uses `RES_STATUS`: `CREATE`, `GET`, `UPDATE`, `DELETE`
- `message` uses `RES_TYPES` constants — never hardcoded
- List endpoint returns `pagination: { page, limit, total }`
- Errors propagate to `ErrorHandler` middleware via route wrappers

---

### FILE 5: Routes — `src/modules/{module}/{module}.routes.ts`

```typescript
import { Router } from 'express';
import { authenticate, authorizeByAnyRole } from '@middleware';
import { validateRequest } from '@middleware/validation';
import {
  create{Module}Schema,
  update{Module}Schema,
  {module}IdParamSchema,
  list{Module}sQuerySchema,
} from './{module}.types';
import {
  create{Module}Controller,
  delete{Module}Controller,
  get{Module}ByIdController,
  list{Module}sController,
  update{Module}Controller,
} from './{module}.controller';

export const {module}Router = Router();

// List {module}s
{module}Router.get(
  '/',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ query: list{Module}sQuerySchema }),
  (req, res, next) => {
    void list{Module}sController(req, res).catch(next);
  },
);

// Get {module} by ID
{module}Router.get(
  '/:id',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ params: {module}IdParamSchema }),
  (req, res, next) => {
    void get{Module}ByIdController(req, res).catch(next);
  },
);

// Create {module}
{module}Router.post(
  '/',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ body: create{Module}Schema }),
  (req, res, next) => {
    void create{Module}Controller(req, res).catch(next);
  },
);

// Update {module} (PUT — NEVER PATCH)
{module}Router.put(
  '/:id',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ params: {module}IdParamSchema, body: update{Module}Schema }),
  (req, res, next) => {
    void update{Module}Controller(req, res).catch(next);
  },
);

// Delete {module}
{module}Router.delete(
  '/:id',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ params: {module}IdParamSchema }),
  (req, res, next) => {
    void delete{Module}Controller(req, res).catch(next);
  },
);
```

**Rules enforced:**
- Middleware order: `authenticate` → `authorizeByAnyRole` → `validateRequest` → controller
- `validateRequest({ body?, query?, params? })` — separate schemas per source
- Route handler: `(req, res, next) => { void controller(req, res).catch(next); }`
- Always `PUT` for updates — NEVER `PATCH`
- Named export `{module}Router` — not default export

---

### FILE 6: Constants — APPEND to existing files

**`src/constant/message.constant.ts`** — add to `RES_TYPES`:
```typescript
{MODULE}_CREATED: '{Module} created successfully.',
{MODULE}_UPDATED: '{Module} updated successfully.',
{MODULE}_DELETED: '{Module} deleted successfully.',
{MODULE}_FETCHED: '{Module} fetched successfully.',
{MODULE}S_FETCHED: '{Module}s fetched successfully.',
```

**`src/constant/endPoints.constant.ts`** — add to `END_POINTS`:
```typescript
{MODULE}: '/{module}s',
```

---

### FILE 7: Route Registration — EDIT `src/routes/index.ts`

```typescript
import { {module}Router } from '@modules/{module}/{module}.routes';

router.use(END_POINTS.{MODULE}, {module}Router);
```

---

### FILE 8: Prisma Model — APPEND to `prisma/schema.prisma`

```prisma
model {Module} {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  // ... more fields
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations:
  // userId    Int
  // user      User     @relation(fields: [userId], references: [id])
  // @@index([userId])
}
```

---

## Post-Generation Commands

```bash
npm run be -- run prisma:generate
cd backend && npx prisma migrate dev --name add-{module}-model
npm run be:build
```

---

## Strict Checklist — Verify Before Done

- [ ] **Architecture**: Controller → Service → Repository — no layer skipped
- [ ] **Reads use raw SQL**: `prisma.$queryRaw` — no `findMany`/`findUnique`/`findFirst`
- [ ] **Writes use Prisma client** and return via raw SQL read
- [ ] **`AppError` only**: `{ errorType, message, code }` — never raw `Error`
- [ ] **`ERROR_TYPES`** + **`RES_TYPES`** constants — never hardcoded strings
- [ ] **`handleApiResponse`**: `{ responseType, message, data?, pagination? }`
- [ ] **`validateRequest`**: Zod schemas for body/query/params — no manual validation
- [ ] **Required strings**: `.min(1, 'X is required')` — never bare `.string()`
- [ ] **Pagination**: `LIMIT` + `OFFSET` in SQL, `{ page, limit, total }` in response
- [ ] **Auth middleware**: `authenticate` + `authorizeByAnyRole` on protected routes
- [ ] **PUT for updates**: never PATCH
- [ ] **Route wrapper**: `void controller(req, res).catch(next)`
- [ ] **Constants added**: `RES_TYPES` messages + `END_POINTS` endpoint
- [ ] **Route registered** in `src/routes/index.ts`
- [ ] **Prisma model added** with `createdAt` + `updatedAt`
- [ ] **No `console.log`**: use `logger` from `@logger/logger`
- [ ] **`import type`** for type-only imports
- [ ] **Path aliases**: `@db/`, `@utils/`, `@constant/`, `@middleware/`, `@modules/`

## After Scaffolding

Tell the user:
1. List of all files created/modified
2. Run: `cd backend && npx prisma migrate dev --name add-{module}-model`
3. Run: `npm run be:build` to verify TypeScript
4. Test: `curl http://localhost:3000/api/v1/{module}s` (after auth)
5. Scaffold frontend: `/react {module}`
6. Endpoints: `GET/POST /api/v1/{module}s`, `GET/PUT/DELETE /api/v1/{module}s/:id`
