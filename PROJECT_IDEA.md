# Voice AI Assistant — Custom Voice + Voice Cloning App

## The Idea

An AI assistant app where users can:
1. Talk to an AI that responds in customizable voices (5-10 default presets)
2. Clone their own voice and have the AI respond in it ("My Voice" feature)

The "My Voice" feature is the core differentiator — user records 30-60 seconds of audio, voice is cloned, and AI responds in their voice going forward.

---

## Why This Works

- Personalization sells — people pay for custom avatars, ringtones, themes
- Hearing AI speak in YOUR voice creates a strong emotional hook
- Voice AI market projected at $5B+ by 2028
- ElevenLabs hit $100M+ ARR proving demand for voice tech
- Gap in market: no consumer-friendly conversational AI app with voice personalization baked in

---

## Target Markets

- **Content creators** — AI narration in their own voice
- **Businesses** — branded voice for customer support bots
- **Accessibility** — people who've lost their voice (ALS patients, etc.)
- **Entertainment** — talk to AI in fun/familiar voices
- **Language learning** — hear corrections in a comfortable voice

---

## Core Features

### MVP (v1)
- Simple chat interface (web + mobile)
- 3 default AI voices (warm male, friendly female, deep narrator)
- Voice input — speak to AI via microphone
- Text + voice output — AI responds with text and audio
- "Clone My Voice" flow — record 30-60s -> clone -> use
- Stripe subscription for Pro tier
- Conversation history

### v2 (Post-validation)
- More default voices (up to 10)
- Voice quality settings (speed, pitch adjustment)
- Multi-language support
- Conversation export
- Mobile app (iOS + Android)

---

## Tech Stack

### Frontend
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js** (web MVP) / **React Native (Expo)** (mobile) | Fast to ship, one codebase for mobile |
| UI | Tailwind CSS / NativeWind | Rapid styling |
| State Management | Zustand | Lightweight, simple |
| Audio Recording | Web Audio API / expo-av | Mic access, audio capture |
| Audio Playback | HTML5 Audio / expo-av | Stream TTS audio |

### Backend
| Layer | Choice | Why |
|---|---|---|
| Runtime | **Node.js (Bun preferred)** or Express/Fastify | Fast, huge ecosystem, real-time streaming |
| Language | **TypeScript** | Type safety, fewer bugs |
| Auth | **Clerk** or **Supabase Auth** | Free tier, social login, handles everything |
| Database | **Supabase (PostgreSQL)** | Free tier, real-time, auth built-in |
| File Storage | **Supabase Storage** or **AWS S3** | Store voice recordings & cloned voice profiles |
| Payments | **Stripe** | Subscriptions, one-time payments |

### AI / Voice Pipeline
| Service | Role | Cost |
|---|---|---|
| **Deepgram** | Speech-to-Text (STT) | $0.0043/min, $200 free credit |
| **Claude Haiku** (Anthropic) | LLM — generates response | ~$0.001/request |
| **ElevenLabs** | Text-to-Speech (TTS) + Voice Cloning | $5-22/month tiers |

### Infrastructure
| Service | Choice | Cost |
|---|---|---|
| Hosting | **Vercel** or **Railway** or **Render** | Free tier -> $5-20/month |
| CDN | Cloudflare | Free |
| Monitoring | Sentry | Free tier |
| Analytics | PostHog | Free tier |

---

## Architecture

```
+---------------------------------+
|          FRONTEND               |
|   Next.js / React Native (Expo) |
|   - Voice recorder              |
|   - Chat UI                     |
|   - Voice selector              |
|   - Audio player                |
+---------------+-----------------+
                | API calls
                v
+---------------------------------+
|         BACKEND (Node.js)       |
|   - Auth (Clerk/Supabase)       |
|   - Voice clone management      |
|   - Conversation history        |
|   - Stripe billing              |
|   - Rate limiting               |
+-------+-------+-------+--------+
        |       |       |
        v       v       v
    Deepgram  Claude  ElevenLabs
     (STT)    (LLM)    (TTS)
```

### Voice Pipeline Flow

```
User speaks
    |
    v
Deepgram STT (~300-500ms) -- Speech to Text
    |
    v
Claude Haiku LLM (~500-1500ms) -- Generate intelligent response
    |
    v
ElevenLabs TTS (~300-800ms) -- Convert text to speech in selected voice
    |
    v
User hears AI response in chosen voice
```

### "Clone My Voice" Flow

```
User taps "Clone My Voice"
    |
    v
App prompts user to read a specific phrase (30-60 seconds)
    |
    v
Audio recorded and uploaded to backend
    |
    v
Backend sends audio to ElevenLabs Instant Voice Clone API
    |
    v
Voice profile created and stored (linked to user account)
    |
    v
All future AI responses use cloned voice for TTS
```

---

## Monetization

### Pricing Tiers

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | 2-3 default voices, 5 messages/day |
| **Pro** | $7-10/month | All default voices + "My Voice" clone, unlimited messages |
| **One-time clone** (alternative) | $3-5 | Pay once to clone voice, pay per usage |

### Why This Pricing Works
- Free tier hooks users with default voices
- "My Voice" is the upgrade trigger — emotional pull
- $7-10/month is impulse-buy territory
- Most expensive feature (voice cloning) is behind the paywall, so paying users fund their own cost

### Revenue Math
- 1000 users, 5% conversion = 50 paying users
- 50 x $8/month = $400/month revenue
- Costs at 1000 users ~$50-80/month
- **Profit margin: ~80%**

---

## Cost Breakdown

### Development Phase (Month 1-2)
| Item | Cost |
|---|---|
| Code editor, GitHub, frameworks | $0 (all free/open source) |
| ElevenLabs API (testing) | $5/month |
| Deepgram (free credits) | $0 |
| Claude API (free credits) | $0 |
| **Total** | **$5-10/month** |

### Launch Phase (Month 3)
| Item | Cost |
|---|---|
| Hosting (free tier) | $0 |
| Database (Supabase free) | $0 |
| Domain name | $12/year |
| ElevenLabs | $5-22/month |
| LLM API | $5-10/month |
| **Total** | **$15-25/month** |

### Scaling Costs
| Users | Estimated Monthly Cost |
|---|---|
| 0-50 | $5-10 |
| 50-500 | $30-80 |
| 500-2000 | $150-400 |
| 2000-10000 | $500-2000 |

### Total Investment Before First Revenue: ~$30-50

---

## Why Node.js/TypeScript Over Rust

The app's latency is dominated by external API calls (Deepgram, Claude, ElevenLabs) which take ~1500-2500ms total. Backend processing is ~5-15ms in Node.js vs ~1-3ms in Rust — a ~10ms difference that's imperceptible.

| Factor | Node.js/TS | Rust |
|---|---|---|
| Dev speed | 2-4 weeks for MVP | 5-10 weeks |
| Ecosystem | Full SDK support for all APIs | Limited SDK support |
| Latency difference | ~10ms (0.4% of total) | Negligible gain |
| Cost savings | — | ~$5-10/month |
| Hiring | Easy | Hard |

**Decision: Ship fast with Node.js/TypeScript. Rewrite hot paths in Rust if/when hitting 50K+ users.**

If you want Rust-like speed with JS ecosystem, use **Bun** runtime (~2-5ms response time).

---

## Risk Mitigation

| Risk | Severity | Mitigation |
|---|---|---|
| Voice cloning without consent | High | Require user to read a specific phrase during recording (proof of ownership) |
| Competition (ElevenLabs, etc.) | High | They're API tools; we're building an experience/product |
| High API costs at scale | Medium | Switch to open-source TTS (Coqui/XTTS) as you grow |
| Voice quality issues | Medium | Start with ElevenLabs (best quality), iterate |
| Legal/regulation (EU AI Act) | Medium | Consent-first design, transparent about AI-generated audio |

---

## MVP Build Plan

### Week 1: Foundation
- Set up Next.js project with Tailwind
- Implement auth (Clerk or Supabase)
- Build chat UI (text input/output)
- Set up backend API routes
- Integrate Claude Haiku for text responses

### Week 2: Voice Pipeline
- Add Deepgram STT — voice input from microphone
- Add ElevenLabs TTS — voice output with 3 default voices
- Voice selector UI component
- Audio streaming and playback

### Week 3: "Clone My Voice" + Payments
- Voice recording flow (guided phrase reading)
- ElevenLabs voice cloning API integration
- Voice profile storage and management
- Stripe subscription integration (Free vs Pro)

### Week 4: Polish and Deploy
- Rate limiting for free tier
- Error handling and loading states
- Mobile responsiveness
- Deploy to Vercel/Railway
- Domain setup
- Beta testing

---

## Key API Endpoints

```
POST   /api/auth/signup          - Create account
POST   /api/auth/login           - Login
POST   /api/chat/message         - Send message (text or audio)
GET    /api/chat/history         - Get conversation history
GET    /api/voices               - List available voices
POST   /api/voices/clone         - Clone user's voice (upload audio)
DELETE /api/voices/clone/:id     - Delete cloned voice
GET    /api/user/subscription    - Get subscription status
POST   /api/user/subscribe       - Create Stripe subscription
POST   /api/user/cancel          - Cancel subscription
```

---

## Database Schema (PostgreSQL)

```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free',  -- free, pro
  stripe_customer_id TEXT,
  created_at TIMESTAMP
)

-- Voice profiles
voice_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT,                              -- "My Voice", "Deep Narrator", etc.
  type TEXT,                              -- 'default' or 'cloned'
  elevenlabs_voice_id TEXT,              -- ElevenLabs voice identifier
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)

-- Conversations
conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  voice_id UUID REFERENCES voice_profiles(id),
  created_at TIMESTAMP
)

-- Messages
messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role TEXT,                              -- 'user' or 'assistant'
  content TEXT,                           -- text content
  audio_url TEXT,                         -- stored audio file URL
  created_at TIMESTAMP
)
```

---

## Environment Variables Required

```env
# Auth
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Database
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI APIs
ANTHROPIC_API_KEY=
DEEPGRAM_API_KEY=
ELEVENLABS_API_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Storage
SUPABASE_STORAGE_BUCKET=voice-recordings
```

---

## Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|---|---|---|
| Signups | 100 | 500 |
| Daily active users | 20 | 100 |
| Free-to-Pro conversion | 3% | 5-8% |
| Voice clones created | 10 | 50 |
| Avg session length | 3 min | 5 min |
| MRR | $0 | $400+ |
