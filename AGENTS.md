# MineAdmin NestJS Edition - Agent Instructions

## Project Overview

This workspace keeps the original Vue 3 frontend in `web/` and uses the NestJS
backend in `server/`.

- Backend: NestJS, TypeORM, MySQL, Redis-ready Docker stack
- Frontend: Original Vue 3/Vite/Element Plus app
- Plugin runtime: intentionally not implemented

## Directory Structure

```text
server/          NestJS backend
web/             Original Vue frontend
storage/uploads  Local uploaded files
docker-compose.yml
```

## Backend Commands

```bash
cd server
pnpm install
pnpm typecheck
pnpm build
pnpm migration:run
pnpm start:dev
```

## Frontend Commands

```bash
cd web
pnpm install
pnpm dev --host 127.0.0.1
pnpm build
```

## Docker

```bash
docker compose up -d mysql redis nest
```

- Nest API: `http://127.0.0.1:9502`
- Frontend dev server: `http://127.0.0.1:2888`
- Uploads: `storage/uploads`

## Database

Use TypeORM migrations. Do not rely on `DB_SYNCHRONIZE=true`.

```bash
cd server
pnpm migration:run
```

Default login:

```text
admin / 123456
```
