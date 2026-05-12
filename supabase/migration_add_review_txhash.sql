-- Add tx_hash column to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS tx_hash TEXT;

-- Drop the task_id FK constraint (we don't need it — reviews link to agent, not task UUID)
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_task_id_fkey;
