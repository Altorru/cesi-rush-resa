-- Add role column to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'user';

-- Add status column to reservation table
ALTER TABLE "reservation" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pending';

-- Add foreign key from reservation to user (if not already present)
DO $$ BEGIN
   IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'reservation_userId_fkey'
   ) THEN
      ALTER TABLE "reservation" ADD CONSTRAINT "reservation_userId_fkey"
         FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
   END IF;
END $$;
