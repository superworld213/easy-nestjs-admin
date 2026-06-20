# MineAdmin NestJS Server

This directory contains a NestJS backend refactor for the existing MineAdmin
frontend in `../web`.

The current implementation uses TypeORM with Docker MySQL, keeps the existing
Vue frontend contract, and intentionally does not implement the MineAdmin
plugin runtime.

## Commands

```bash
pnpm install
pnpm start:dev
pnpm build
pnpm typecheck
```

The server listens on `http://127.0.0.1:9502` by default, avoiding the original
Hyperf backend port `9501`.

The frontend development proxy in `../web/.env.development` points to
`http://127.0.0.1:9502`, so the existing frontend can be started normally:

```bash
cd ../web
pnpm dev --host 127.0.0.1
```

## Database

Start the Docker MySQL service from the project root:

```bash
docker compose up -d mysql
```

Then run the Nest server from this directory:

```bash
pnpm start:dev
```

Default local database settings target Docker's published MySQL port:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mineadmin
DB_USERNAME=root
DB_PASSWORD=root
```

If the Nest server also runs inside Docker Compose, set `DB_HOST=mysql`.
`DB_SYNCHRONIZE=true` is enabled by default for this development refactor so an
empty Docker database can bootstrap itself. Turn it off before production and
replace it with real migrations.

## Implemented Backend Scope

- Login, refresh, logout, current user info
- Menu, role, user, department, position, leader CRUD endpoints
- Role/menu and user/role permission relationships
- Backend permission-code checks for `@Permission(...)` routes
- Login logs and automatic operation logs for write requests
- Local attachment upload, list, delete, and `/uploads/*` static access

Default development login:

```text
username: admin
password: 123456
```

## Uploads

Uploaded files are stored outside this server directory by default:

```text
UPLOAD_DIR=../storage/uploads
UPLOAD_PUBLIC_BASE_URL=http://127.0.0.1:9502
UPLOAD_MAX_BYTES=20971520
```

`storage/uploads` is ignored by Git. Files are served from `/uploads/*`; the
returned attachment URL uses `UPLOAD_PUBLIC_BASE_URL` so the unchanged frontend
can preview files while running on port `2888`.
