-- Fix RLS policies: Remove overly permissive policies
-- Run this in Supabase Dashboard → SQL Editor

-- Drop old permissive policies
DROP POLICY IF EXISTS "Service role full access" ON users;
DROP POLICY IF EXISTS "Service role full access" ON voice_profiles;
DROP POLICY IF EXISTS "Service role full access" ON generations;
DROP POLICY IF EXISTS "Service role full access" ON user_preferences;

-- Create proper policies: only service_role can access (our backend uses service_role key)
CREATE POLICY "Service role only" ON users FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role only" ON voice_profiles FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role only" ON generations FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role only" ON user_preferences FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- Block anon key from accessing any data
CREATE POLICY "Block anon access" ON users FOR ALL
  TO anon USING (false);

CREATE POLICY "Block anon access" ON voice_profiles FOR ALL
  TO anon USING (false);

CREATE POLICY "Block anon access" ON generations FOR ALL
  TO anon USING (false);

CREATE POLICY "Block anon access" ON user_preferences FOR ALL
  TO anon USING (false);
