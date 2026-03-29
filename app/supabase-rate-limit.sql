-- Rate limiting table
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(user_id, endpoint, created_at DESC);

-- Auto-delete old entries (older than 1 hour) to keep table small
CREATE OR REPLACE FUNCTION cleanup_rate_limits() RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON rate_limits FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Block anon access" ON rate_limits FOR ALL
  TO anon USING (false);
