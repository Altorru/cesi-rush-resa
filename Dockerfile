# ================================================================
# Stage 1: Install dependencies
# ================================================================
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Copy package.json and Prisma schema before install so that
# the postinstall script (prisma generate) can find schema.prisma.
# scripts/ is required too: postinstall runs scripts/prepare-db-url.js.
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY scripts ./scripts

# Install all dependencies (dev + prod) in one pass
# postinstall (prisma generate) runs automatically
RUN bun install

# Explicitly generate Prisma client in case postinstall was skipped
RUN bunx prisma generate || true

# Clear the base image entrypoint ("bun") so docker-compose can
# override the command directly without it being prefixed by "bun"
ENTRYPOINT []

# ================================================================
# Stage 2: Build the Next.js application
# ================================================================
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN bun run build

# ================================================================
# Stage 3: Production runner (minimal image)
# ================================================================
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Install postgresql-client for pg_isready in the entrypoint script
RUN apk add --no-cache postgresql-client

# Create a non-root user for security
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy the standalone Next.js output
COPY --from=builder --chown=nextjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunjs /app/.next/static ./.next/static

# Copy Prisma schema & migrations for runtime migration
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma

# Copy the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["bun", "server.js"]
