"use client";

import { Message } from "@/types";
import { useRef, useState } from "react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (!message.audioUrl || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-white rounded-br-md"
            : "bg-surface border border-border text-foreground rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {message.audioUrl && (
          <>
            <audio
              ref={audioRef}
              src={message.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
            <button
              onClick={playAudio}
              className={`mt-2 flex items-center gap-1.5 text-xs ${
                isUser
                  ? "text-white/70 hover:text-white"
                  : "text-muted hover:text-foreground"
              } transition-colors`}
            >
              {isPlaying ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
