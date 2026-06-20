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
pnpm migration:run
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

The backend now defaults to migrations instead of TypeORM schema sync:

```text
DB_SYNCHRONIZE=false
DB_MIGRATIONS_RUN=true
```

For local development, start Docker MySQL from the project root:

```bash
docker compose up -d mysql
```

Then run migrations and start the Nest server from this directory:

```bash
pnpm migration:run
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

The project root also defines a Docker Compose `nest` service:

```bash
docker compose up -d mysql redis nest
```

That container uses `DB_HOST=mysql` and `DB_MIGRATIONS_RUN=true`, so a fresh
Docker database can bootstrap itself without enabling `DB_SYNCHRONIZE`.

## Implemented Backend Scope

- Login, refresh, logout, current user info
- Database-backed access/refresh token sessions with refresh rotation
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

## Auth Sessions

Access and refresh tokens are opaque random tokens. The API returns the plaintext
token once, while the database stores only a SHA-256 token hash in `auth_token`.
Refreshing a token revokes the old session and creates a new access/refresh
pair. Logging out revokes the whole token session.
