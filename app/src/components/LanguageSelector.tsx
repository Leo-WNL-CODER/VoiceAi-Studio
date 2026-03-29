"use client";

import { useChatStore } from "@/store/chat-store";
import { SUPPORTED_LANGUAGES } from "@/types";

interface LanguageSelectorProps {
  tier?: string;
  onUpgrade?: () => void;
}

export default function LanguageSelector({ tier = "free", onUpgrade }: LanguageSelectorProps) {
  const { selectedLanguage, setSelectedLanguage } = useChatStore();
  const isPro = tier === "pro";

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {SUPPORTED_LANGUAGES.map((lang) => {
        const locked = !isPro && lang.code !== "en";
        return (
          <button
            key={lang.code}
            onClick={() => {
              if (locked) {
                onUpgrade?.();
                return;
              }
              setSelectedLanguage(lang);
            }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedLanguage.code === lang.code
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : locked
                ? "bg-surface text-muted/50 border border-border opacity-60 cursor-not-allowed"
                : "bg-surface text-muted hover:bg-surface-hover hover:text-foreground border border-border"
            }`}
          >
            {locked && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1 -mt-0.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
            <span className="mr-1">{lang.flag}</span>
            {lang.name}
          </button>
        );
      })}
    </div>
  );
}
