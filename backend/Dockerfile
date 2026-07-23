# syntax=docker/dockerfile:1

FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json backend/package.json

RUN pnpm install --frozen-lockfile --filter backend

COPY backend backend
COPY shared shared

RUN pnpm --filter backend prod

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/backend/dist/index.cjs ./dist/index.cjs

USER node
CMD ["node", "dist/index.cjs"]
