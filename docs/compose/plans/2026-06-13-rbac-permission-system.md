# RBAC Permission System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite MineAdmin's user/role/permission/menu RBAC + data-permission system in NestJS, reusing the existing MySQL database.

**Architecture:** NestJS modules (Auth, Permission, DataPermission) with TypeORM entities mapping to existing tables. Guard+decorator pattern for permission checks, interceptor for data-scope filtering.

**Tech Stack:** NestJS 11, TypeORM 0.3, @nestjs/jwt, Passport, bcrypt, class-validator, MySQL

---

### Task 1: Project Scaffolding

**Covers:** S2, S3

**Files:**
- Create: `package.json`, `tsconfig.json`, `nest-cli.json`, `.env.example`, `.env`
- Create: `src/main.ts`, `src/app.module.ts`

- [ ] **Step 1: Initialize NestJS project**

```bash
cd C:\Users\11575\Desktop\收纳\demo\nestjs-admin
npx @nestjs/cli@latest new . --package-manager pnpm --skip-git --strict
```

- [ ] **Step 2: Install dependencies**

```bash
pnpm add @nestjs/typeorm typeorm mysql2 @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer @nestjs/config
pnpm add -D @types/passport-jwt @types/bcrypt
```

- [ ] **Step 3: Create .env.example**

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=mineadmin
JWT_SECRET=your-secret-key-base64
JWT_ACCESS_EXPIRES=3600
JWT_REFRESH_EXPIRES=7200
```

- [ ] **Step 4: Update src/app.module.ts with TypeORM + Config**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { DataPermissionModule } from './data-permission/data-permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'mineadmin'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    PermissionModule,
    DataPermissionModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 5: Verify build**

```bash
pnpm build
```

---

### Task 2: TypeORM Entities

**Covers:** S3, S4

**Files:**
- Create: `src/entities/user.entity.ts`
- Create: `src/entities/role.entity.ts`
- Create: `src/entities/menu.entity.ts`
- Create: `src/entities/department.entity.ts`
- Create: `src/entities/position.entity.ts`
- Create: `src/entities/data-permission-policy.entity.ts`
- Create: `src/entities/user-role.entity.ts` (join table)
- Create: `src/entities/role-menu.entity.ts` (join table)
- Create: `src/entities/index.ts`

All entities use `@Entity('existing_table_name')` to map to existing tables. No migrations needed.

---

### Task 3: Auth Module (JWT Dual-Token)

**Covers:** S4

**Files:**
- Create: `src/auth/auth.module.ts`
- Create: `src/auth/auth.controller.ts`
- Create: `src/auth/auth.service.ts`
- Create: `src/auth/dto/login.dto.ts`
- Create: `src/auth/strategies/jwt.strategy.ts`
- Create: `src/auth/strategies/jwt-refresh.strategy.ts`
- Create: `src/auth/guards/jwt-auth.guard.ts`
- Create: `src/auth/guards/jwt-refresh.guard.ts`
- Create: `src/common/decorators/current-user.decorator.ts`

Endpoints: POST /auth/login, POST /auth/refresh, POST /auth/logout

---

### Task 4: Permission Guard + Decorators

**Covers:** S4

**Files:**
- Create: `src/permission/decorators/permission.decorator.ts`
- Create: `src/permission/guards/permission.guard.ts`
- Create: `src/common/decorators/current-user.decorator.ts` (if not in auth)

---

### Task 5: Permission CRUD Modules (User, Role, Menu, Dept, Position)

**Covers:** S4, S5

Each sub-module: controller + service + dto files.

---

### Task 6: Data Permission Module

**Covers:** S4

**Files:**
- Create: `src/data-permission/data-permission.module.ts`
- Create: `src/data-permission/data-permission.service.ts`
- Create: `src/data-permission/decorators/data-scope.decorator.ts`
- Create: `src/data-permission/interceptors/data-scope.interceptor.ts`
- Create: `src/data-permission/enums/policy-type.enum.ts`
- Create: `src/data-permission/enums/scope-type.enum.ts`
- Create: `src/data-permission/rules/dept-execute.ts`
- Create: `src/data-permission/rules/created-by-ids-execute.ts`

---

### Task 7: Verification

- [ ] Build passes: `pnpm build`
- [ ] App starts: `pnpm start:dev`
- [ ] Login returns tokens
- [ ] Protected endpoint returns 401 without token
- [ ] Permission guard returns 403 without permission
