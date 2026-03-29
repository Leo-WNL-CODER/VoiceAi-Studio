"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/studio");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      [0, 1, 2, 3].forEach((i) => {
        setTimeout(() => {
          setVisibleSteps((prev) => [...prev, i]);
        }, i * 300);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">

      {/* ===== BACKGROUND ANIMATIONS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] animate-[float1_20s_ease-in-out_infinite]" />
        <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-pink-500/20 dark:bg-pink-500/10 blur-[120px] animate-[float2_25s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/15 dark:bg-purple-500/8 blur-[100px] animate-[float3_18s_ease-in-out_infinite]" />
        <div className="absolute top-[60%] left-[60%] w-[300px] h-[300px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[80px] animate-[float1_22s_ease-in-out_infinite_reverse]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        {mounted && Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 dark:bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle ${8 + Math.random() * 12}s linear ${Math.random() * 5}s infinite`,
              opacity: 0.2 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
          VoiceAI Studio
        </h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm text-muted hover:text-foreground transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-white hover:bg-primary-hover transition-all shadow-md shadow-primary/20"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20 text-primary text-xs font-medium mb-6 animate-[fadeInUp_0.5s_ease-out] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          21 AI Voices + Voice Cloning + 14 Languages
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold leading-tight max-w-3xl mb-6 animate-[fadeInUp_0.7s_ease-out]">
          Turn Any Script Into{" "}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
            Natural Speech
          </span>
        </h2>

        <p className="text-lg text-muted max-w-xl mb-10 animate-[fadeInUp_0.9s_ease-out]">
          Generate professional voiceovers in seconds. Choose from 21 AI voices,
          clone your own voice, or speak in 14 languages. Download as MP3.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-[fadeInUp_1.1s_ease-out]">
          <Link
            href="/sign-up"
            className="px-8 py-3.5 text-base font-medium rounded-full bg-gradient-to-r from-primary to-pink-500 text-white hover:from-primary-hover hover:to-pink-400 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95"
          >
            Start Generating Free
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 text-base font-medium rounded-full bg-surface/80 backdrop-blur-sm border border-border text-foreground hover:bg-surface-hover transition-all hover:scale-105 active:scale-95"
          >
            See How It Works
          </a>
        </div>

        {/* Animated Waveform */}
        <div className="flex items-end gap-[3px] mt-20 h-16 animate-[fadeInUp_1.3s_ease-out]">
          {mounted && Array.from({ length: 50 }).map((_, i) => {
            const baseHeight = Math.sin(i * 0.3) * 20 + 24;
            return (
              <div
                key={i}
                className="w-[3px] rounded-full bg-gradient-to-t from-primary/80 to-pink-500/80 dark:from-primary/60 dark:to-pink-500/60"
                style={{
                  height: `${baseHeight}px`,
                  animation: `waveform ${0.6 + Math.random() * 0.8}s ease-in-out ${i * 0.04}s infinite`,
                }}
              />
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20 max-w-5xl mx-auto w-full">
        <h3 className="text-2xl font-bold text-center mb-3">
          Everything You Need for Voice Generation
        </h3>
        <p className="text-muted text-center mb-14 text-sm">
          Professional-grade text-to-speech, powered by AI
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ),
              title: "21 Premium AI Voices",
              desc: "Male, female, and neutral voices — from warm storytellers to energetic creators.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
              ),
              title: "Clone Your Voice",
              desc: "Record 30 seconds. AI creates a perfect clone. Generate speech that sounds like you.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              title: "14 Languages",
              desc: "English, Hindi, Spanish, French, German, Japanese, Chinese, Korean, and more.",
              gradient: "from-green-500 to-emerald-500",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              ),
              title: "Download as MP3",
              desc: "High-quality MP3 files ready for YouTube, podcasts, presentations, anywhere.",
              gradient: "from-orange-500 to-red-500",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              ),
              title: "AI Script Rewrite",
              desc: "Let AI polish your script to sound natural and engaging when spoken aloud.",
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
              title: "Secure & Private",
              desc: "Your scripts and voice data are encrypted. Your voice clone belongs to you.",
              gradient: "from-indigo-500 to-purple-500",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="relative bg-surface/80 dark:bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/50 to-surface/0 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <h3 className="text-2xl font-bold text-center mb-4">
            How It Works
          </h3>
          <p className="text-muted text-center mb-14">
            Generate professional voiceovers in 4 simple steps
          </p>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500 via-purple-500 via-orange-500 to-green-500 opacity-20 hidden sm:block" />

            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Choose a Voice",
                  desc: "Pick from 21 premium AI voices — male, female, or neutral. Or clone your own voice by recording for 30 seconds.",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  step: "2",
                  title: "Select Language",
                  desc: "Choose from 14 languages including English, Hindi, Spanish, French, Japanese, and more.",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  step: "3",
                  title: "Paste Your Script",
                  desc: "Type or paste your script. Use quick templates or hit 'AI Rewrite' to polish it for narration.",
                  color: "from-orange-500 to-red-500",
                },
                {
                  step: "4",
                  title: "Generate & Download",
                  desc: "Click 'Generate Speech' — audio is ready in seconds. Play it back, then download the MP3.",
                  color: "from-green-500 to-emerald-500",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-6 items-start transition-all duration-700 ${
                    visibleSteps.includes(i)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-8"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-${item.color.split('-')[1]}-500/20 z-10`}
                  >
                    {item.step}
                  </div>
                  <div className="bg-surface/80 dark:bg-surface/50 backdrop-blur-sm border border-border rounded-xl p-5 flex-1 hover:border-primary/20 transition-all hover:shadow-lg">
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voice Showcase */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <h3 className="text-2xl font-bold text-center mb-4">
          Meet the Voices
        </h3>
        <p className="text-muted text-center mb-14">
          21 unique AI voices, each with its own personality
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { name: "Sarah", desc: "Reassuring", gender: "F", color: "pink" },
            { name: "Jessica", desc: "Playful", gender: "F", color: "pink" },
            { name: "Laura", desc: "Quirky", gender: "F", color: "pink" },
            { name: "Alice", desc: "Educator", gender: "F", color: "pink" },
            { name: "Lily", desc: "Velvety", gender: "F", color: "pink" },
            { name: "Bella", desc: "Professional", gender: "F", color: "pink" },
            { name: "Matilda", desc: "Knowledgeable", gender: "F", color: "pink" },
            { name: "Adam", desc: "Dominant", gender: "M", color: "blue" },
            { name: "Brian", desc: "Deep", gender: "M", color: "blue" },
            { name: "Daniel", desc: "Broadcaster", gender: "M", color: "blue" },
            { name: "Roger", desc: "Laid-Back", gender: "M", color: "blue" },
            { name: "Charlie", desc: "Energetic", gender: "M", color: "blue" },
            { name: "George", desc: "Storyteller", gender: "M", color: "blue" },
            { name: "Liam", desc: "Creator", gender: "M", color: "blue" },
            { name: "Eric", desc: "Smooth", gender: "M", color: "blue" },
            { name: "Chris", desc: "Charming", gender: "M", color: "blue" },
            { name: "Will", desc: "Optimist", gender: "M", color: "blue" },
            { name: "Harry", desc: "Fierce", gender: "M", color: "blue" },
            { name: "Bill", desc: "Wise", gender: "M", color: "blue" },
            { name: "River", desc: "Neutral", gender: "N", color: "green" },
          ].map((voice, i) => (
            <div
              key={i}
              className="bg-surface/80 dark:bg-surface/50 backdrop-blur-sm border border-border rounded-xl p-3 flex items-center gap-3 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md group-hover:scale-110 transition-transform ${
                  voice.color === "pink"
                    ? "bg-gradient-to-br from-pink-500 to-rose-500"
                    : voice.color === "blue"
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500"
                    : "bg-gradient-to-br from-green-500 to-emerald-500"
                }`}
              >
                {voice.gender}
              </div>
              <div>
                <p className="text-sm font-medium">{voice.name}</p>
                <p className="text-xs text-muted">{voice.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/50 to-surface/0 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <h3 className="text-2xl font-bold text-center mb-14">
            Perfect For
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "YouTube Videos", icon: "Y", gradient: "from-red-500 to-rose-500" },
              { label: "Podcasts", icon: "P", gradient: "from-purple-500 to-violet-500" },
              { label: "Audiobooks", icon: "A", gradient: "from-amber-500 to-orange-500" },
              { label: "Presentations", icon: "S", gradient: "from-blue-500 to-cyan-500" },
              { label: "Social Media", icon: "M", gradient: "from-pink-500 to-fuchsia-500" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-surface/80 dark:bg-surface/50 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {item.icon}
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        {/* CTA background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 dark:bg-primary/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto relative">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to{" "}
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Generate Your Voice?
            </span>
          </h3>
          <p className="text-muted mb-8">
            Join thousands of creators using VoiceAI Studio. Start for free, no
            credit card required.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-10 py-4 text-base font-medium rounded-full bg-gradient-to-r from-primary to-pink-500 text-white hover:from-primary-hover hover:to-pink-400 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border text-center backdrop-blur-md bg-background/80">
        <p className="text-xs text-muted">
          VoiceAI Studio | Powered by ElevenLabs AI
        </p>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.1); }
          66% { transform: translate(20px, -40px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, -30px); }
        }
        @keyframes particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
}
