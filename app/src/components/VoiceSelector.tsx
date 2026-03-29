"use client";

import { useChatStore } from "@/store/chat-store";
import { DEFAULT_VOICES, Voice } from "@/types";
import { isVoiceFree } from "@/lib/plan";

interface VoiceSelectorProps {
  tier?: string;
  onUpgrade?: () => void;
}

export default function VoiceSelector({ tier = "free", onUpgrade }: VoiceSelectorProps) {
  const { selectedVoice, setSelectedVoice, clonedVoice } = useChatStore();
  const isPro = tier === "pro";

  const femaleVoices = DEFAULT_VOICES.filter((v) => v.gender === "female");
  const maleVoices = DEFAULT_VOICES.filter((v) => v.gender === "male");
  const neutralVoices = DEFAULT_VOICES.filter((v) => v.gender === "neutral");

  const handleVoiceClick = (voice: Voice) => {
    if (!isPro && !isVoiceFree(voice.id)) {
      onUpgrade?.();
      return;
    }
    setSelectedVoice(voice);
  };

  const VoiceButton = ({ voice }: { voice: Voice }) => {
    const locked = !isPro && !isVoiceFree(voice.id);
    return (
      <button
        onClick={() => handleVoiceClick(voice)}
        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          selectedVoice.id === voice.id
            ? "bg-primary text-white shadow-lg shadow-primary/25"
            : locked
            ? "bg-surface text-muted/50 border border-border opacity-60 cursor-not-allowed"
            : "bg-surface text-muted hover:bg-surface-hover hover:text-foreground border border-border"
        }`}
        title={locked ? `${voice.name} — Pro only` : voice.description}
      >
        {locked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1 -mt-0.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
        {voice.name}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      {/* Cloned Voice */}
      {clonedVoice && (
        <div>
          <span className="text-xs text-purple-400 font-medium mb-1.5 block">Your Voice</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedVoice(clonedVoice)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedVoice.id === clonedVoice.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/25"
                  : "bg-surface text-muted hover:bg-surface-hover hover:text-foreground border border-purple-500/30"
              }`}
            >
              {clonedVoice.name}
            </button>
          </div>
        </div>
      )}

      {/* Female Voices */}
      <div>
        <span className="text-xs text-pink-400 font-medium mb-1.5 block">Female</span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {femaleVoices.map((voice) => (
            <VoiceButton key={voice.id} voice={voice} />
          ))}
        </div>
      </div>

      {/* Male Voices */}
      <div>
        <span className="text-xs text-blue-400 font-medium mb-1.5 block">Male</span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {maleVoices.map((voice) => (
            <VoiceButton key={voice.id} voice={voice} />
          ))}
        </div>
      </div>

      {/* Neutral Voice */}
      <div>
        <span className="text-xs text-green-400 font-medium mb-1.5 block">Neutral</span>
        <div className="flex gap-2">
          {neutralVoices.map((voice) => (
            <VoiceButton key={voice.id} voice={voice} />
          ))}
        </div>
      </div>

      {!isPro && (
        <p className="text-xs text-muted">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1 -mt-0.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          = Pro only voice.{" "}
          <button onClick={onUpgrade} className="text-primary hover:underline">Upgrade</button>{" "}
          to unlock all 21 voices.
        </p>
      )}
    </div>
  );
}
