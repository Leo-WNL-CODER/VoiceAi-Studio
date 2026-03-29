-- VoiceAI Studio Database Schema
-- Run this in Supabase Dashboard → SQL Editor

-- Users table (linked to Clerk user IDs)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cloned voice profiles
CREATE TABLE IF NOT EXISTS voice_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Voice',
  elevenlabs_voice_id TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generation history
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  script TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  voice_name TEXT,
  language TEXT DEFAULT 'en',
  character_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  preferred_voice_id TEXT,
  preferred_language TEXT DEFAULT 'en',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_voice_profiles_user_id ON voice_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies: allow service role full access (our backend uses service role key)
CREATE POLICY "Service role full access" ON users FOR ALL USING (true);
CREATE POLICY "Service role full access" ON voice_profiles FOR ALL USING (true);
CREATE POLICY "Service role full access" ON generations FOR ALL USING (true);
CREATE POLICY "Service role full access" ON user_preferences FOR ALL USING (true);
