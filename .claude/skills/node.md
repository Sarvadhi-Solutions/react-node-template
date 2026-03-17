---
name: node
description: Scaffold a new Node.js backend module with all required files following project conventions
user_invocable: true
---

# /node — Scaffold a Node.js Backend Module

## Usage
```
/node <module-name>
```

## What This Skill Does

When invoked, scaffold a complete backend module following the project's layered architecture. Ask the user for:

1. **Module name** (if not provided as argument) — e.g., `project`, `task`, `invoice`
2. **Fields/properties** — what data does this module manage?
3. **CRUD operations needed** — list, get by ID, create, update, delete?
4. **Auth requirements** — public, authenticated, or role-restricted?
5. **Relationships** — does it relate to other modules (e.g., belongs to User)?

## Files to Generate

Based on the user's answers, create these files inside `backend/src/modules/{module}/`:

### 1. Types — `{module}.types.ts`
```typescript
import { z } from 'zod';

// --- DTOs ---
export interface {Module}DTO {
  id: string;
  // ... fields from user input
  created_at: Date;
  updated_at: Date;
}

export interface {Module}ListQuery {
  page?: number;
  page_size?: number;
  search?: string;
}

// --- Zod Validation Schemas ---
export const create{Module}Schema = z.object({
  body: z.object({
    // fields with validation
  }),
});

export const update{Module}Schema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    // fields with validation
  }),
});

export const get{Module}Schema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const list{Module}Schema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    page_size: z.coerce.number().int().positive().max(100).optional().default(20),
    search: z.string().optional(),
  }),
});
```

### 2. Repository — `{module}.repository.ts`
```typescript
import { prisma } from '@db/prisma';
import type { {Module}DTO, {Module}ListQuery } from './{module}.types';

export const {module}Repository = {
  async findAll(query: {Module}ListQuery): Promise<{ data: {Module}DTO[]; total: number }> {
    const { page = 1, page_size = 20, search } = query;
    const offset = (page - 1) * page_size;

    // Raw SQL for reads (MANDATORY)
    const data = await prisma.$queryRaw<{Module}DTO[]>`
      SELECT id, /* columns */
      FROM "{Module}"
      WHERE (${'${search}'} IS NULL OR name ILIKE ${'${`%${search}%`}'})
      ORDER BY created_at DESC
      LIMIT ${page_size} OFFSET ${offset}
    `;

    const [{ count }] = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM "{Module}"
      WHERE (${'${search}'} IS NULL OR name ILIKE ${'${`%${search}%`}'})
    `;

    return { data, total: Number(count) };
  },

  async findById(id: string): Promise<{Module}DTO | null> {
    const results = await prisma.$queryRaw<{Module}DTO[]>`
      SELECT * FROM "{Module}" WHERE id = ${id}
    `;
    return results[0] ?? null;
  },

  // Writes can use Prisma client
  async create(data: Create{Module}Input) {
    return prisma.{module}.create({ data });
  },

  async update(id: string, data: Update{Module}Input) {
    return prisma.{module}.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.{module}.delete({ where: { id } });
  },
};
```

### 3. Service — `{module}.service.ts`
```typescript
import { AppError } from '@utils/appError';
import { ERROR_TYPES, RES_STATUS, RES_TYPES } from '@constant/index';
import { {module}Repository } from './{module}.repository';
import type { {Module}ListQuery } from './{module}.types';

export const {module}Service = {
  async getAll(query: {Module}ListQuery) {
    return {module}Repository.findAll(query);
  },

  async getById(id: string) {
    const item = await {module}Repository.findById(id);
    if (!item) {
      throw new AppError('{Module} not found', RES_STATUS.NOT_FOUND, ERROR_TYPES.NOT_FOUND);
    }
    return item;
  },

  async create(data: Create{Module}Input) {
    return {module}Repository.create(data);
  },

  async update(id: string, data: Update{Module}Input) {
    await this.getById(id); // Ensure exists
    return {module}Repository.update(id, data);
  },

  async delete(id: string) {
    await this.getById(id); // Ensure exists
    return {module}Repository.delete(id);
  },
};
```

### 4. Controller — `{module}.controller.ts`
```typescript
import type { Request, Response, NextFunction } from 'express';
import { handleApiResponse } from '@utils/handleResponse';
import { RES_STATUS, RES_TYPES } from '@constant/index';
import { {module}Service } from './{module}.service';

export const {module}Controller = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await {module}Service.getAll(req.query);
      handleApiResponse(res, RES_STATUS.OK, RES_TYPES.SUCCESS, '{Module}s fetched', result.data, {
        total: result.total,
      });
    } catch (error) { next(error); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await {module}Service.getById(req.params.id);
      handleApiResponse(res, RES_STATUS.OK, RES_TYPES.SUCCESS, '{Module} fetched', item);
    } catch (error) { next(error); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await {module}Service.create(req.body);
      handleApiResponse(res, RES_STATUS.CREATED, RES_TYPES.SUCCESS, '{Module} created', item);
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await {module}Service.update(req.params.id, req.body);
      handleApiResponse(res, RES_STATUS.OK, RES_TYPES.SUCCESS, '{Module} updated', item);
    } catch (error) { next(error); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await {module}Service.delete(req.params.id);
      handleApiResponse(res, RES_STATUS.OK, RES_TYPES.SUCCESS, '{Module} deleted');
    } catch (error) { next(error); }
  },
};
```

### 5. Routes — `{module}.routes.ts`
```typescript
import { Router } from 'express';
import { authenticate, authorizeByAnyRole } from '@middleware/auth';
import { validateRequest } from '@middleware/validation';
import { {module}Controller } from './{module}.controller';
import { create{Module}Schema, update{Module}Schema, get{Module}Schema, list{Module}Schema } from './{module}.types';

const router = Router();

router.get('/', authenticate, validateRequest(list{Module}Schema), {module}Controller.getAll);
router.get('/:id', authenticate, validateRequest(get{Module}Schema), {module}Controller.getById);
router.post('/', authenticate, validateRequest(create{Module}Schema), {module}Controller.create);
router.put('/:id', authenticate, validateRequest(update{Module}Schema), {module}Controller.update);
router.delete('/:id', authenticate, validateRequest(get{Module}Schema), {module}Controller.delete);

export default router;
```

## Additional Steps

After generating the module files:

### 6. Register Routes
Add to `src/routes/index.ts`:
```typescript
import {module}Routes from '@modules/{module}/{module}.routes';
router.use(END_POINTS.{MODULE}S, {module}Routes);
```

### 7. Add Endpoint Constant
Add to `src/constant/endPoints.constant.ts`:
```typescript
{MODULE}S: '/{module}s',
```

### 8. Add Prisma Model
Add to `prisma/schema.prisma`:
```prisma
model {Module} {
  id         String   @id @default(uuid())
  // ... fields
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}
```

Then run: `npx prisma migrate dev --name add-{module}-model`

## Rules to Follow

- Read `.claude/rules/node.md` for all conventions
- Raw SQL for ALL reads (`prisma.$queryRaw`)
- Controller → Service → Repository — never skip layers
- `AppError` for expected errors — never raw `Error`
- `handleApiResponse` for ALL responses
- Constants from `src/constant/` — never hardcode strings
- `logger` from `src/logger/logger.ts` — never `console.log`
- Zod for request validation via `validateRequest` middleware
- JWT auth + role guards on protected routes

## After Scaffolding

Tell the user:
1. Which files were created
2. Remind them to run `npx prisma migrate dev` after adding the model
3. Run `npm run build` to verify TypeScript compilation
4. If this is a new feature, remind them to scaffold the frontend with `/react`
