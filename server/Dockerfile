FROM node:22-alpine AS deps

WORKDIR /app/server
ARG NPM_REGISTRY=https://registry.npmmirror.com
ENV COREPACK_NPM_REGISTRY=${NPM_REGISTRY}
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
RUN pnpm config set registry ${NPM_REGISTRY}

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN pnpm build

FROM deps AS prod-deps

RUN pnpm prune --prod

FROM node:22-alpine AS runner

WORKDIR /app/server
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
COPY --from=prod-deps /app/server/node_modules ./node_modules
COPY --from=build /app/server/dist ./dist

EXPOSE 9502
CMD ["node", "dist/main.js"]
