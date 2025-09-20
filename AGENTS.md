# Repository Guidelines

## Project Structure & Module Organization
The workspace is managed by `pnpm` and split into `backend/`, `frontend/`, `frontend-vue/`, and `shared/`. The Fastify API lives in `backend/src` with routes, services, and Drizzle schema under `db/`. React assets sit in `frontend/src` (with `@/` aliasing via `tsconfig.app.json`), while the Vue alternative mirrors that layout in `frontend-vue/src`. Cross-cutting utilities, constants, and TypeScript types are colocated in `shared/` and should stay framework-agnostic.

## Build, Test, and Development Commands
Install dependencies once with `pnpm install`. Use `pnpm dev` for a full-stack watch; individual packages can be targeted, e.g. `pnpm --filter backend dev` or `pnpm --filter frontend dev`. Build artefacts with `pnpm --filter backend build` and `pnpm --filter frontend prod`. Run linting and type safety checks via `pnpm -r lint` and `pnpm -r typecheck`. Database migrations are applied with `pnpm mg`, which proxies to `drizzle-kit push` inside the backend.

## Coding Style & Naming Conventions
TypeScript is strict across the workspace. Prefer 2-space indentation and single quotes in backend files; frontends follow Prettier defaults emitted by Vite (respect import ordering). Components and stores use PascalCase, hooks/composables use camelCase (`useCountdown`), and shared constants remain UPPER_SNAKE. Keep shared modules free of browser or Node globals to maintain compatibility. Run ESLint locally (`frontend/eslint.config.js`, `frontend-vue/eslint.config.js`) before sending changes.

## Testing Guidelines
Automated tests are not yet established; introduce unit or integration coverage alongside features and wire them to `pnpm -r test`. Co-locate tests next to sources under `__tests__/` or `*.test.ts(x)` files, mirroring the module name. When touching backend logic, provide deterministic Fastify route tests and database fixtures; frontends should exercise React Testing Library or Vue Test Utils components. Document any manual QA steps in the pull request until automated coverage exists.

## Commit & Pull Request Guidelines
Recent commits use short, imperative summaries (`refactoring`, `useCountdown`). Follow that style, reference tickets with `(#id)` if relevant, and group logical changes per commit. Pull requests must describe the feature, note environment or migration impacts, and attach UI screenshots or screencasts when altering the frontends. Ensure `pnpm -r lint`, `pnpm -r typecheck`, and any new test targets succeed before requesting review.

## Environment & Configuration
Copy `env.example` to `.env` within both `backend/` and `frontend*/` packages, keeping secrets out of version control. For backend work, update Drizzle schemas and run `pnpm mg` whenever migrations change. When adding shared config, expose read-only values through `shared/constants` so both clients remain synced.
