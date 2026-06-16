# CESI Rush Resa 🏗️

Application de **réservation de matériel BTP** (projet scolaire fictif).

Next.js 15 (App Router) + BetterAuth + PostgreSQL + Prisma — **prête à lancer avec Docker**.

## Fonctionnalités

- **Authentification** email/mot de passe (BetterAuth) + **2FA** (TOTP, codes de secours).
- **Catalogue de matériel BTP** et **réservations** : parcourir le matériel, réserver sur une plage de dates, consulter / annuler ses réservations.
- Dashboard protégé par session, dark mode, toasts.

## Quickstart

```bash
git clone <your-repo>
cd cesi-rush-resa
cp .example.env .env
docker compose up -d
```

Au démarrage, le service `app` génère le client Prisma, applique les migrations (`prisma migrate deploy`) et **seed le catalogue** automatiquement (idempotent).

Ouvre **http://localhost:3000**. Les changements de code se rechargent à chaud.

## Commandes utiles

| Commande                                       | Effet                                |
|------------------------------------------------|--------------------------------------|
| `docker compose up -d`                         | Démarrer en arrière-plan             |
| `docker compose down`                          | Tout arrêter                         |
| `docker compose logs -f app`                   | Suivre les logs de l'app             |
| `docker compose exec app bunx prisma studio`   | Ouvrir Prisma Studio                 |
| `docker compose exec app bunx prisma migrate dev --name <x>` | Créer + appliquer une migration |
| `docker compose exec app bun prisma/seed.ts`   | (Re)seed le catalogue (idempotent)   |
| `docker compose down -v`                        | Arrêter + **supprimer** les données  |

## Variables d'environnement

Copie `.example.env` vers `.env` puis édite :

| Variable             | Défaut (Docker)                                          | Requis |
|----------------------|----------------------------------------------------------|--------|
| `BETTER_AUTH_SECRET` | —                                                        | ✅      |
| `BETTER_AUTH_URL`    | `http://localhost:3000`                                  | ✅      |
| `DATABASE_URL`       | `postgresql://cesi_rush_resa:***@db:5432/cesi_rush_resa` | ✅      |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | identifiants du conteneur `db`          | ✅ (Docker) |

> `DATABASE_URL` peut être dérivée de `PRISMA_DATABASE_URL` au build/runtime via
> `scripts/prepare-db-url.js` (convention de nommage Vercel).

## Développement local (sans Docker)

```bash
bun install
bunx prisma migrate dev
bun prisma/seed.ts
bun dev
```

Nécessite un PostgreSQL accessible et un `DATABASE_URL` pointant dessus (host `localhost`, pas `db`).
