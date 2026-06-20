# MineAdmin NestJS Edition

This workspace keeps the original Vue frontend in `web/` and uses the NestJS
backend in `server/`.

The plugin runtime is intentionally not included.

## Structure

```text
server/          NestJS API server
web/             Original Vue frontend
storage/uploads  Local uploaded files
docker-compose.yml
```

## Start Backend Services

```bash
docker compose up -d mysql redis nest
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
