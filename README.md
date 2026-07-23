# The Last of Guss

[Русская версия](README-RU.md)

A browser game where players compete to tap a virtual goose infected with the G-42 mutation as fast and as many times as possible.

## Demo

- React: [https://the-last-of-guss-frontend.onrender.com/](https://the-last-of-guss-frontend.onrender.com/)
- Vue: [https://the-last-of-guss-frontend-vue.onrender.com/](https://the-last-of-guss-frontend-vue.onrender.com/)

The demo backend runs on a free hosting tier, so the first request after a long idle period may be slow.

#### Game users:

- admin:admin - can create a round
- nikita:nikita - a user whose taps don't count
- Any other user (except variations of "nikita" like Никита, Nikita, NiKiTA, etc.) - can tap

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Both the `backend` and `frontend` folders contain a `.env.example` file with sample environment variables.

- Copy `.env.example` to `.env` and edit the values if needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Start the local database (Postgres + pgAdmin)

```bash
make up
```

### 4. Run database migrations

```bash
pnpm mg
```

### 5. Run

```bash
pnpm dev
```

The game should open in your browser automatically.

## Task

Build a browser game called "The Last of Guss", where players compete to tap a virtual goose infected with the G-42 mutation as fast and as many times as possible.

A round has a start date and an end date. Round duration and cooldown must be configurable, and it's enough that they're applied when the backend starts. Cooldown is the time between round creation and its start — it gives players time to get to the round page.
For example,

```bash
# .env
ROUND_DURATION=60 # one minute per round
COOLDOWN_DURATION=30 # half a minute countdown
```

Round rules:

- 1 tap = 1 point, every eleventh tap gives 10 points
- tapping is only allowed within an active round
- an active round is one that has already started but hasn't ended yet

Game users:

- survivor – can tap
- if the survivor's name is Nikita, their taps don't count (stats show zero), though the tap request still behaves like a regular survivor's
- admin, can create a round

Roles can be assigned when a user is created, based on their username. For example, if the username is "admin", the role is admin; if the username is Nikita, the role is nikita.

### Backend

Backend on postgres, nodejs and typescript (with strict enabled). ORM of your choice: sequelize, drizzle, prisma, typeorm. API framework of your choice: Fastify, Nest.

**When a tap on the goose happens, you need to ensure data consistency, correct score calculation (accounting for possible race conditions), and correct round state**.
For example:

- check the user's role (Nikita or not)
- check that the round is active (current time is between the round's start and end dates)
- increment the player's tap and score counters for this round
- increment the round's total score counter

REST API is an acceptable choice.

You **must** account for the possibility of running multiple backend servers (e.g., 1 database and 3 nodejs apps).
Assumed deployment: 1 database, 1 reverse proxy, 3 backends in Docker containers. You don't need to actually implement this, just account for it in development — there should be no binding of a user to a specific backend instance. You don't need to write compose or a Dockerfile. To run it, `node dist/index.js` is enough.

Expected load: this is a take-home assignment, so you can assume around 10 survivors per round, but scalable solutions are preferred.

A possible, but not required, set of REST API routes.

- login (via cookie, token, or a token in a cookie)
- get the list of rounds, pagination not required
- create a round
- get round info, including winner info (if the round has ended) and your own score
- tap the goose, returns your own score

### Frontend

Frontend on react, typescript, react-router, vite. UI library and state manager of your choice.

3 pages:

- login, where you enter a username and password; if it doesn't exist in the database, it's created; if it exists and the password doesn't match, show an error below the button
- a list of currently active and scheduled rounds, the round ID is a link to the round, a "create round" button if the user is an admin, clicking it takes you straight to the round page
- a round page showing its state (finished, active, not started yet) with the goose, which can be tapped if the round is active

---

We expect clean code following SOLID, correct API, and a responsive frontend.

---

### Mockups:

```
┌───────────────────────────────────────┐
│               LOG IN                  │
├───────────────────────────────────────┤
│                                       │
│  Username:                            │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│  Password:                            │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │          Log in                 │  │
│  └─────────────────────────────────┘  │
│                                       │
└───────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ROUNDS list                      Player name │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐                                                │
│  │ Create round    │                                                │  <–– visible if admin
│  └─────────────────┘                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ● Round ID: 8c3eed83-8a8a-41a0-8f91-9ad501e8f8a1             │  │  <–– link to the round
│  │                                                               │  │
│  │  Start: 18.05.2025, 06:28:17                                  │  │
│  │  End:   18.05.2025, 06:29:17                                  │  │
│  │                                                               │  │
│  │  ──────────────────────────────────────────────────────────── │  │
│  │  Status: Active                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ● Round ID: 8c3eed83-8a8a-41a0-8f91-9ad501e8f8a2             │  │
│  │                                                               │  │
│  │  Start: 18.05.2025, 07:28:17                                  │  │
│  │  End:   18.05.2025, 08:29:17                                  │  │
│  │                                                               │  │
│  │  ──────────────────────────────────────────────────────────── │  │
│  │  Status: Cooldown                                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

```
┌───────────────────────────────────────┐
│               Rounds      Player name │
├───────────────────────────────────────┤
│                                       │
│            ░░░░░░░░░░░░░░░            │
│          ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░           │
│        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         │
│        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         │
│      ░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░       │
│    ░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░   │
│    ░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░   │
│    ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░   │
│      ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░     │
│        ░░░░░░░░░░░░░░░░░░░░░░░░░░     │
│                                       │
│            Round is active!           │  <–– round state changes when the time comes
│           Time left: 00:23            │  <–– timer, updates every second
│            My score - 123             │  <–– updates with each own tap
│                                       │
└───────────────────────────────────────┘
```

```
┌───────────────────────────────────────┐
│               Cooldown    Player name │
├───────────────────────────────────────┤
│                                       │
│            ░░░░░░░░░░░░░░░            │
│          ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░           │
│        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         │
│        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         │
│      ░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░       │
│    ░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░   │
│    ░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░   │
│    ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░   │
│      ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░     │
│        ░░░░░░░░░░░░░░░░░░░░░░░░░░     │
│                                       │
│              Cooldown                 │  <–– round state changes when the time comes
│        round starts in 00:15          │  <–– timer, updates every second
│                                       │
└───────────────────────────────────────┘

```

```
┌───────────────────────────────────────┐
│           Round finished  Player name │
├───────────────────────────────────────┤
│                                       │
│            ░░░░░░░░░░░░░░░            │
│          ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░           │
│        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         │
│        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         │
│      ░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░       │
│    ░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░   │
│    ░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░   │
│    ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░   │
│      ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░     │
│        ░░░░░░░░░░░░░░░░░░░░░░░░░░     │
│                                       │
│  ---------------------------------    │
│  Total               999999           │ <–– round stats
│  Winner - Ivan       100500           │
│  My score            321              │
│                                       │
└───────────────────────────────────────┘
```

## ⚠️ License notice:

This project was created as part of a take-home assignment. The source code is **not licensed** for reuse or distribution. All rights reserved and belong to the author.
