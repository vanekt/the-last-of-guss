# syntax=docker/dockerfile:1

FROM node:24-alpine AS builder
WORKDIR /app

# `git rev-parse`/`git log` - shared/frontend/helpers/getBuildInfo.ts
RUN apk add --no-cache git
RUN corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY frontend/package.json frontend/package.json

RUN pnpm install --frozen-lockfile --filter frontend --filter shared

COPY frontend frontend
COPY shared shared
COPY .git .git

RUN pnpm --filter frontend prod

FROM nginx:alpine AS runtime

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
