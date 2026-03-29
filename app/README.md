# VoiceAI Studio

**A vibe-coded AI-powered Text-to-Speech generator** built entirely through conversational coding with Claude AI. No boilerplate templates, no copy-paste — every line of code was generated through natural conversation.

## What is VoiceAI Studio?

VoiceAI Studio lets you turn any script into natural-sounding speech. Choose from 21 premium AI voices, clone your own voice, select from 14 languages, and download high-quality MP3 files — all from your browser.

## Features

### Voice Generation
- **21 Premium AI Voices** — 7 female, 12 male, 1 neutral, each with unique personality (Sarah, Adam, Brian, Jessica, Lily, George, and more)
- **Voice Cloning** — Record 30 seconds of your voice, AI creates a high-quality clone using ElevenLabs
- **14 Language Support** — English, Hindi, Spanish, French, German, Japanese, Chinese, Korean, Portuguese, Arabic, Italian, Tamil, Telugu, Bengali
- **MP3 Download** — Generate and download high-quality audio files

### AI Features
- **AI Script Rewrite** — Paste any script and let AI rewrite it to sound natural when spoken aloud
- **Quick Templates** — Pre-built scripts for YouTube intros, podcast openings, product demos, audiobooks, and Hindi content
- **Smart Model Selection** — Automatically uses the best TTS model based on selected language

### User Experience
- **Dark/Light Mode** — Toggle between themes with preference saved locally
- **Voice Categories** — Voices organized by gender (Female/Male/Neutral) with descriptions
- **Language Selector** — Visual language picker with flags
- **Audio Player** — Play, pause, stop with real-time progress bar
- **Responsive Design** — Works on desktop and mobile

### Monetization & Plans
- **Free Tier** — 5 generations/day, 6 voices, English only, 500 char limit
- **Pro Tier ($8/mo)** — 50 generations/day, all 21 voices, 14 languages, 5,000 char limit, voice cloning, MP3 download, AI rewrite
- **Business Tier ($20/mo)** — 200 generations/day, 10,000 char limit, 5 voice clones, priority support

### Security
- **Authentication** — Clerk-powered sign-in/sign-up with social login support
- **Rate Limiting** — Supabase-backed per-user rate limits on all API endpoints
- **Input Validation** — Server-side text length, file size, and type validation
- **Row Level Security** — Supabase RLS policies restricting data access
- **Security Headers** — X-Frame-Options, X-Content-Type-Options, XSS-Protection, Referrer-Policy
- **Server-side Plan Enforcement** — Limits enforced on backend, not just frontend

### Landing Page
- Animated background with floating gradient orbs and particles
- Glassmorphism UI with backdrop blur
- Animated waveform visualization
- Voice showcase grid
- Step-by-step "How It Works" section
- Responsive pricing display

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **Auth** | Clerk |
| **Database** | Supabase (PostgreSQL) |
| **LLM** | Groq (Llama 3.3 70B) |
| **TTS** | ElevenLabs |
| **STT** | Deepgram |
| **Hosting** | Vercel |

## Architecture

```
User Browser
    |
    v
Next.js App (Vercel)
    |
    +-- Clerk Auth (sign-in/sign-up/session)
    |
    +-- API Routes (protected + rate limited)
    |     |
    |     +-- /api/generate --> ElevenLabs TTS
    |     +-- /api/chat --> Groq LLM
    |     +-- /api/transcribe --> Deepgram STT
    |     +-- /api/voices/clone --> ElevenLabs Cloning
    |     +-- /api/usage --> Supabase (plan limits)
    |     +-- /api/history --> Supabase (generation log)
    |     +-- /api/user --> Supabase (user sync)
    |
    +-- Supabase (PostgreSQL)
          |
          +-- users (linked to Clerk)
          +-- voice_profiles (cloned voices)
          +-- generations (usage history)
          +-- user_preferences
          +-- rate_limits
```

## Environment Variables

```env
# AI APIs
GROQ_API_KEY=
ELEVENLABS_API_KEY=
DEEPGRAM_API_KEY=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys

# Run Supabase SQL migrations (in Supabase Dashboard → SQL Editor)
# - supabase-setup.sql
# - supabase-fix-rls.sql
# - supabase-rate-limit.sql

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Vibe Coded

This entire project was built through conversational coding — describing features in plain English and having AI generate the code. From the initial idea analysis to security audit, every decision was made collaboratively.

**Built with Claude AI (Anthropic) as the coding partner.**
