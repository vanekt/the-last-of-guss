# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"The Last of Guss" — a browser clicker game: tap a goose within a round, every 11th tap gives 10 points instead of 1. Take-home assignment, frontend implemented twice (React and Vue) on top of a shared Fastify/Drizzle/Postgres backend and a shared TS package `shared/`.

pnpm workspace, 4 packages: `backend`, `frontend` (React), `frontend-vue` (Vue), `shared`.

## Commands

From repo root unless noted otherwise (`pnpm --filter <pkg> <cmd>`):

```bash
pnpm install       # install deps for the whole workspace
pnpm dev           # dev mode for all packages at once
pnpm dev:node      # backend only (tsx --watch)
pnpm dev:react     # React only (vite --open)
pnpm dev:vue       # Vue only (vite --open)

pnpm mg            # migrations (drizzle-kit push), proxies into backend

pnpm lint          # eslint across all packages
pnpm typecheck     # tsc --noEmit across all packages
pnpm test          # stub, no tests yet in any package

pnpm prod:node     # frozen-lockfile install + typecheck + esbuild bundle
pnpm prod:react    # frozen-lockfile install + typecheck + lint + vite build
pnpm prod:vue      # frozen-lockfile install + typecheck + lint + vue-tsc + vite build
```

Local Postgres/pgAdmin: `make up` / `down` / `recreate` (drops the volume) / `logs` (uses `docker-compose.dev.yml`).

Full prod stack from GHCR images, locally: `docker compose -f docker-compose.prod.yml --env-file <file> up -d` (needs `IMAGE_TAG`, `JWT_SECRET`, `CORS_ORIGIN`, see `.env.prod.example`).

### Environment variables

- Root `.env` — creds for `docker-compose.dev.yml`.
- `backend/.env` — `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`, `ROUND_DURATION`/`COOLDOWN_DURATION` (seconds). Backend exits on startup if any of these are missing. **Contains real prod credentials** (Render/Supabase) — read before editing, don't overwrite carelessly.
- `frontend/.env`, `frontend-vue/.env` — only `VITE_BACKEND_URL`.
- `.env.prod.example` — template for `docker-compose.prod.yml`.

## Architecture

### `shared/` — common code

Framework-agnostic package used by backend (`@shared/*`) and both frontends:
- `shared/types` — single source of truth for API contracts. Change the API shape here, don't duplicate per package.
- `shared/constants` — `SUPER_TAP_SCORE = 10`.
- `shared/helpers` — `isSuperTap(n)` (`n % 11 === 0`), `isNikita(role)`.
- `shared/frontend/core/api.ts` — `createAPI(baseUrl, getToken, onUnauthorized)` factory, shared axios client for React/Vue (Bearer token, 401 handling).
- `shared/frontend/helpers` — round status, formatting, etc.

`@shared/*` → `../shared/*`, `@/*` → `./src/*` — aliases in every package.

### Backend (Fastify + Drizzle + Postgres, ESM)

- `src/middleware.ts` — `authMiddleware`, parses `Bearer <token>` → `request.user`/`request.token`, wired in as `preHandler: fastify.auth`.
- `src/utils/auth.ts` — JWT, bcrypt, `getUserRole(username)` (`admin`/`nikita`/`survivor` by name, case-insensitive, including Cyrillic «никита»).
- `src/routes/auth.ts` — `POST /auth/login` is login-or-register (no such user → creates one). `POST /auth/verify` — user by token.
- `src/routes/rounds.ts`:
  - `GET /rounds`, `/rounds/:id` — with computed status (`pending`/`active`/`finished` + timer).
  - `POST /rounds` — `role === "admin"` only.
  - `GET /rounds/:id/winner` — lazily finishes the round (`finishRound`) if time is up but no winner set yet.
  - `POST /rounds/:id/tap/batch` — batched taps; `nikita` gets `{success:false, taps:0, score:0}` without reaching the service.
- `src/services/roundService.ts` — the core logic:
  - `getRoundStatus` — status purely from time, DB isn't the source of truth.
  - `processBatchTaps` — consistency across **multiple backend instances** (see README: 1 DB, several backends behind a reverse proxy). `db.transaction` + `SELECT ... FOR UPDATE` on `userRoundStats` and `rounds`. Points are computed tap-by-tap in a loop (not for the whole batch at once) — needed for correct super-tap scoring (every 11th).
  - `finishRound` — winner = max `score`; on a tie, no winner is assigned.
  - `nikita` role is filtered in the route, not the service.
- `src/db/schema.ts` — `users`, `rounds`, `userRoundStats` (unique index on `user_id+round_id`). Migrations via `pnpm mg` (drizzle-kit push), config in `backend/drizzle.config.ts`.
- Build — `esbuild` into `dist/index.cjs` (CJS), not `tsc`. Prod start: `node dist/index.cjs`.

### Frontends (`frontend/` React, `frontend-vue/` Vue)

Independent Vite apps, same UX (see `README.md`), both on top of `shared/frontend`. File structure mirrors between the two packages — look for the same-named file in the other one.

- **React**: React Router 7, TanStack Query, Jotai (`store/authAtoms.ts`), framer-motion, react-hot-toast, Tailwind.
- **Vue**: Vue Router, TanStack Vue Query, Pinia (`store/authStore.ts`, `roundsStore.ts`), `@vueuse/core`.
- **Tap batching** (`useTapBatching` / vue composable): taps accumulate locally, sent as `POST /rounds/:id/tap/batch` either on a timer (300ms) or at `maxBatchSize` (10) — the source of the `tapCount` that `processBatchTaps` consumes.
- `AuthGuard` — route protection in both packages.
- `nikita`: the server always returns zero score regardless of the UI — frontend must not rely on hiding taps.

### Docker / CI

- `docker-compose.dev.yml` — just `postgres`+`pgadmin`, default for `Makefile`.
- `docker-compose.prod.yml` — `image: ghcr.io/vanekt/the-last-of-guss-{backend,frontend}:${IMAGE_TAG}`, secrets required with no defaults (`${VAR:?...}`), no source needed — ships to the VPS as-is.
- Local Dockerfile testing — plain `docker build`, no separate compose file.

`backend/Dockerfile`/`frontend/Dockerfile` — multi-stage, build context is the **repo root** (not the package folder) — needed for `shared/` (not a workspace dependency, just a path alias). Notes:
- `pnpm install --frozen-lockfile --filter <pkg>` — with frozen-lockfile it resolves from `pnpm-lock.yaml`, no need to copy other packages' package.json.
- `frontend/Dockerfile` installs `git`: `vite.config.ts` bakes in the commit hash (`getBuildInfo.ts`) — that's why `.git` isn't in `.dockerignore`.
- `VITE_BACKEND_URL` — a build-arg, not a runtime env var (Vite inlines it at build time).
- `backend/Dockerfile` — `USER node`, runtime image is just `dist/index.cjs`.

`.github/workflows/release.yml` — builds+pushes to GHCR on git tag `v*` (multi-arch: `linux/amd64,linux/arm64` via `setup-qemu-action`), not on every push/merge.

## Coding conventions

- TypeScript strict everywhere.
- Backend: 2-space indent, single quotes. Frontends: Prettier defaults.
- PascalCase — components/stores; camelCase — hooks/composables; UPPER_SNAKE — constants.
- `shared/` — no browser/Node-specific globals.

## Testing

No automated tests yet (`pnpm test` is a stub). Tests go next to sources (`*.test.ts(x)`), mirroring the module. Priority — `roundService` (race conditions).

## Test users

- `admin`/`admin` — can create rounds.
- `nikita`/`nikita` (and case/Cyrillic variations) — taps don't count.
- Any other login/password — a regular survivor, created on first login.
