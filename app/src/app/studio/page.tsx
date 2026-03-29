"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import VoiceSelector from "@/components/VoiceSelector";
import VoiceRecorder from "@/components/VoiceRecorder";
import LanguageSelector from "@/components/LanguageSelector";
import UpgradeModal from "@/components/UpgradeModal";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import { getPlanLimits } from "@/lib/plan";

export default function StudioPage() {
  const { selectedVoice, selectedLanguage, setClonedVoice } = useChatStore();

  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [charCount, setCharCount] = useState(0);

  // Plan state
  const [tier, setTier] = useState("free");
  const [generationsToday, setGenerationsToday] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");

  const limits = getPlanLimits(tier);
  const isPro = tier === "pro" || tier === "business";

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCharCount(script.length);
  }, [script]);

  // Load usage data
  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        if (data.tier) setTier(data.tier);
        if (typeof data.generationsToday === "number") setGenerationsToday(data.generationsToday);
      })
      .catch(() => {});
  }, []);

  // Sync user and load cloned voices
  useEffect(() => {
    fetch("/api/user").catch(() => {});
    fetch("/api/voices/clone")
      .then((res) => res.json())
      .then((data) => {
        if (data.voices?.length > 0) {
          setClonedVoice(data.voices[0]);
        }
      })
      .catch(() => {});
  }, [setClonedVoice]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const promptUpgrade = (feature: string) => {
    setUpgradeFeature(feature);
    setShowUpgrade(true);
  };

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setStatusText(generatedAudioUrl ? "Stopped. Click play to listen again." : "");
  }, [generatedAudioUrl]);

  const handleGenerate = async () => {
    if (!script.trim()) return;

    // Free tier: check generation limit
    if (!isPro && generationsToday >= limits.maxGenerationsPerDay) {
      promptUpgrade("Unlimited generations");
      return;
    }

    // Free tier: check script length
    if (!isPro && script.trim().length > limits.maxScriptLength) {
      promptUpgrade(`Scripts over ${limits.maxScriptLength} characters`);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (generatedAudioUrl) {
      URL.revokeObjectURL(generatedAudioUrl);
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedAudioUrl(null);
    setIsPlaying(false);
    setIsPaused(false);
    setStatusText("Generating audio with ElevenLabs...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: script.trim(),
          elevenLabsVoiceId: selectedVoice.elevenLabsVoiceId,
          voiceId: selectedVoice.id,
          voiceName: selectedVoice.name,
          language: selectedLanguage.code,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Generation failed");
      }

      const audioBlob = await res.blob();
      const url = URL.createObjectURL(audioBlob);
      setGeneratedAudioUrl(url);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        setStatusText(isPro ? "Playback complete. Download or play again." : "Playback complete.");
      };

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      setStatusText(`Audio ready! Playing with ${selectedVoice.name}...`);
      setIsGenerating(false);
      setGenerationsToday((prev) => prev + 1);

      audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Generate error:", error);
      setStatusText(
        error instanceof Error ? error.message : "Generation failed. Try again."
      );
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !generatedAudioUrl) {
      handleGenerate();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      setStatusText("Paused");
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      setStatusText(`Playing with ${selectedVoice.name}...`);
    }
  };

  const handleDownload = () => {
    if (!isPro) {
      promptUpgrade("MP3 Download");
      return;
    }
    if (!generatedAudioUrl) {
      alert("Generate the audio first, then download it.");
      return;
    }
    const a = document.createElement("a");
    a.href = generatedAudioUrl;
    a.download = `voiceai-${selectedVoice.name.toLowerCase()}-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setStatusText("Downloaded!");
  };

  const handleAIRewrite = async () => {
    if (!isPro) {
      promptUpgrade("AI Script Rewrite");
      return;
    }
    if (!script.trim()) return;
    setIsGenerating(true);
    setStatusText("AI is rewriting your script...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Rewrite the following script to sound more natural and engaging when spoken aloud. Keep the same meaning but make it flow better for voice narration. Only return the rewritten script, nothing else:\n\n${script}`,
          conversationHistory: [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setScript(data.text);
        setStatusText("Script rewritten by AI!");
      } else {
        setStatusText("AI rewrite failed. Try again.");
      }
    } catch {
      setStatusText("AI rewrite failed. Check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScriptChange = (value: string) => {
    if (!isPro && value.length > limits.maxScriptLength) {
      setScript(value.slice(0, limits.maxScriptLength));
      setStatusText(`Free tier limit: ${limits.maxScriptLength} characters. Upgrade for up to 5,000.`);
    } else {
      setScript(value);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            VoiceAI Studio
          </h1>
          <p className="text-xs text-muted">Turn any script into speech</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Plan Badge */}
          {isPro ? (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-pink-500 text-white">
              {tier === "business" ? "Business" : "Pro"} ({generationsToday}/{limits.maxGenerationsPerDay} today)
            </span>
          ) : (
            <button
              onClick={() => promptUpgrade("Pro features")}
              className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-muted hover:text-primary hover:border-primary/30 transition-all"
            >
              Free ({generationsToday}/{limits.maxGenerationsPerDay} today)
            </button>
          )}
          {isPro && <VoiceRecorder />}
          {!isPro && (
            <button
              onClick={() => promptUpgrade("Voice Cloning")}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white/70 cursor-not-allowed"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1.5 -mt-0.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              Clone My Voice
            </button>
          )}
          <ThemeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Free tier banner */}
          {!isPro && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">You&apos;re on the Free plan</p>
                <p className="text-xs text-muted mt-0.5">
                  {limits.maxGenerationsPerDay - generationsToday} generations left today | 6 voices | English only | {limits.maxScriptLength} chars max
                </p>
              </div>
              <button
                onClick={() => promptUpgrade("Pro features")}
                className="px-4 py-2 text-xs font-medium rounded-full bg-gradient-to-r from-primary to-pink-500 text-white hover:from-primary-hover hover:to-pink-400 transition-all flex-shrink-0"
              >
                Upgrade to Pro
              </button>
            </div>
          )}

          {/* Voice Selection */}
          <div>
            <label className="text-sm font-medium text-muted mb-2 block">
              Select Voice
            </label>
            <VoiceSelector tier={tier} onUpgrade={() => promptUpgrade("Premium AI Voices")} />
          </div>

          {/* Language Selection */}
          <div>
            <label className="text-sm font-medium text-muted mb-2 block">
              Language
            </label>
            <LanguageSelector tier={tier} onUpgrade={() => promptUpgrade("Multilingual Support")} />
          </div>

          {/* Script Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted">
                Your Script
              </label>
              <div className="flex items-center gap-3">
                <span className={`text-xs ${!isPro && charCount >= limits.maxScriptLength ? "text-red-400" : "text-muted"}`}>
                  {charCount}{!isPro ? `/${limits.maxScriptLength}` : ""} characters
                </span>
                <button
                  onClick={handleAIRewrite}
                  disabled={!script.trim() || isGenerating}
                  className={`text-xs px-3 py-1 rounded-full transition-all disabled:opacity-50 ${
                    isPro
                      ? "bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-hover"
                      : "bg-surface border border-border text-muted/50 cursor-not-allowed"
                  }`}
                >
                  {!isPro && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1 -mt-0.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                  AI Rewrite
                </button>
              </div>
            </div>
            <textarea
              value={script}
              onChange={(e) => handleScriptChange(e.target.value)}
              placeholder="Paste or type your script here... The AI will convert it to speech using your selected voice."
              rows={10}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-y"
            />
          </div>

          {/* Quick Templates */}
          <div>
            <label className="text-xs text-muted mb-2 block">Quick Templates</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "YouTube Intro", text: "Hey everyone! Welcome back to the channel. In today's video, we're going to dive deep into something really exciting. Make sure to hit that subscribe button and let's get started!" },
                { label: "Podcast Opening", text: "Welcome to another episode. I'm your host, and today we have an incredible topic lined up for you. Grab your coffee, settle in, and let's have a great conversation." },
                { label: "Product Demo", text: "Let me show you something amazing. This product was designed with one goal in mind: making your life easier. Watch how simple it is to get started." },
                { label: "Audiobook", text: "Chapter One. The morning sun cast long shadows across the empty street. She stood at the window, watching the world wake up, wondering if today would be the day everything changed." },
                ...(isPro ? [
                  { label: "Hindi Intro", text: "नमस्ते दोस्तों! चैनल पर वापस स्वागत है। आज के वीडियो में हम कुछ बहुत ही रोमांचक विषय पर बात करने वाले हैं। सब्सक्राइब बटन दबाना मत भूलिए और चलिए शुरू करते हैं!" },
                  { label: "Hindi Story", text: "एक समय की बात है, एक छोटे से गांव में एक बुद्धिमान बूढ़ा आदमी रहता था। वह हर सुबह नदी किनारे बैठकर सूरज को उगते देखता था और सोचता था कि आज का दिन कितना खूबसूरत है।" },
                ] : []),
              ].map((template) => (
                <button
                  key={template.label}
                  onClick={() => handleScriptChange(template.text)}
                  className="px-3 py-1.5 text-xs bg-surface border border-border rounded-full text-muted hover:text-foreground hover:bg-surface-hover transition-all"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={!script.trim() || isGenerating}
              className="flex-1 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-pink-500 hover:from-primary-hover hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                `Generate Speech with ${selectedVoice.name}`
              )}
            </button>

            {generatedAudioUrl && (
              <button
                onClick={handleDownload}
                className={`px-6 py-3 rounded-xl font-medium text-white flex items-center gap-2 transition-all shadow-lg ${
                  isPro
                    ? "bg-green-600 hover:bg-green-500 shadow-green-600/20"
                    : "bg-green-600/50 cursor-not-allowed shadow-none"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {isPro ? "Download MP3" : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="-ml-1">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Download
                  </>
                )}
              </button>
            )}
          </div>

          {/* Player */}
          {(isPlaying || isPaused || progress > 0 || statusText) && (
            <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{statusText}</span>
                <span className="text-xs text-muted font-mono">{Math.round(progress)}%</span>
              </div>

              <div className="w-full bg-background rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-primary to-pink-500 h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={stopPlayback}
                  className="p-2 rounded-full bg-background border border-border text-muted hover:text-foreground transition-all"
                  title="Stop"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>

                <button
                  onClick={handlePlayPause}
                  className="p-3 rounded-full bg-primary text-white hover:bg-primary-hover transition-all"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className={`p-2 rounded-full bg-background border border-border transition-all ${
                    isPro ? "text-muted hover:text-foreground" : "text-muted/40 cursor-not-allowed"
                  }`}
                  title={isPro ? "Download MP3" : "Pro feature"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-border text-center">
        <p className="text-xs text-muted">
          Using {selectedVoice.type === "cloned" ? "your cloned voice" : `${selectedVoice.name} voice`}
          {" "} | {isPro ? "Pro Plan" : "Free Plan"} | Powered by ElevenLabs AI
        </p>
      </footer>

      {/* Upgrade Modal */}
      <UpgradeModal
        show={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature={upgradeFeature}
      />
    </div>
  );
}
