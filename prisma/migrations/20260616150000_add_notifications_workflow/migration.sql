-- Create notification table
CREATE TABLE IF NOT EXISTS "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "notification_userId_seenAt_idx" ON "notification"("userId", "seenAt");

-- Add adminMessage and adminReviewedAt to reservation
ALTER TABLE "reservation" ADD COLUMN IF NOT EXISTS "adminMessage" TEXT;
ALTER TABLE "reservation" ADD COLUMN IF NOT EXISTS "adminReviewedAt" TIMESTAMP(3);
