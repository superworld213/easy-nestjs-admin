# MineAdmin NestJS Edition

This workspace keeps the original Vue frontend in `web/` and uses the NestJS
backend in `server/`.

The plugin runtime is intentionally not included.

## Environment

Create the backend environment file before starting Docker or the Nest server:

```powershell
Copy-Item server/.env.example server/.env
```

Or on bash-compatible shells:

```bash
cp server/.env.example server/.env
```

`server/.env` is ignored by Git and should be adjusted locally. The default
`DB_HOST=127.0.0.1` works when running Nest directly on the host; Docker Compose
overrides the `nest` container to use `DB_HOST=mysql`.

## Structure

```text
server/          NestJS API server
web/             Original Vue frontend
storage/uploads  Local uploaded files
docker-compose.yml
```

## Start Backend Services

```bash
docker compose --env-file server/.env up -d mysql redis nest
```

The Nest API listens on:

```text
http://127.0.0.1:9502
```

## Start Frontend

```bash
cd web
pnpm install
pnpm dev --host 127.0.0.1
```

The frontend listens on:

```text
http://127.0.0.1:2888
```

`web/.env.development` proxies API requests to `http://127.0.0.1:9502`.

## Default Account

```text
username: admin
password: 123456
```

## Backend Development

```bash
cd server
pnpm install
pnpm typecheck
pnpm build
pnpm migration:run
pnpm start:dev
```

Database schema is managed by TypeORM migrations. Do not enable
`DB_SYNCHRONIZE` for normal development or deployment.
