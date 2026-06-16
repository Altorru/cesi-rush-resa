#!/bin/sh
set -e

echo "🔍 Waiting for PostgreSQL to be ready..."

# Safely parse DATABASE_URL: postgresql://user:pass@host:port/db
# Handles URLs with and without explicit port
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:?/]*\).*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_PORT=${DB_PORT:-5432}

# Fallback if sed extraction failed (e.g. unusual URL format)
if [ -z "$DB_HOST" ]; then
  echo "⚠️  Could not parse DATABASE_URL host, trying direct connection..."
  DB_HOST="db"
fi

echo "  → Host: $DB_HOST  Port: $DB_PORT"

# Wait for PostgreSQL to accept connections
for i in $(seq 1 30); do
  if pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1; then
    echo "✅ PostgreSQL is ready!"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "❌ PostgreSQL did not become ready in time. Aborting."
    exit 1
  fi
  echo "⏳ PostgreSQL not ready yet... attempt $i/30 (sleeping 2s)"
  sleep 2
done

# Apply pending Prisma migrations (safe for production — only applies what's pending)
echo "📦 Applying Prisma migrations..."
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  bunx prisma migrate deploy
else
  echo "⚠️  No migrations found. Creating database tables with prisma db push..."
  bunx prisma db push
fi

echo "🚀 Starting application..."
exec "$@"
