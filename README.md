# Better Auth Starter 🚀

Next.js 15 + BetterAuth + PostgreSQL + Prisma — **ready to run with Docker**.

## Quickstart

```bash
git clone <your-repo>
cd better-auth
cp .example.env .env
docker compose up -d
docker compose exec app bunx prisma migrate dev --name init
```

Open **http://localhost:3000**. Code changes auto-refresh.

## Useful Commands

| Command | What it does |
|---|---|
| `docker compose up -d` | Start in background |
| `docker compose down` | Stop everything |
| `docker compose logs -f app` | Follow app logs |
| `docker compose exec app bunx prisma studio` | Open Prisma Studio |
| `docker compose down -v` | Stop + delete database data |

## Environment Variables

Edit `.env` after copying from `.example.env`:

| Variable | Default (Docker) | Required |
|---|---|---|
| `BETTER_AUTH_SECRET` | — | ✅ |
| `BETTER_AUTH_URL` | `http://localhost:3000` | ✅ |
| `DATABASE_URL` | `postgresql://cesi_rush_resa:***@db:5432/cesi_rush_resa` | ✅ |

---

*Built by Aayush Ghimire*
