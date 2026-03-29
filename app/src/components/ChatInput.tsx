"use client";

import { useState, useRef } from "react";
import { useChatStore } from "@/store/chat-store";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendAudio: (audioBlob: Blob) => void;
}

export default function ChatInput({ onSendMessage, onSendAudio }: ChatInputProps) {
  const [text, setText] = useState("");
  const { isLoading, isRecording, setIsRecording } = useChatStore();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText("");
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        chunksRef.current = [];
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          onSendAudio(audioBlob);
        };

        mediaRecorder.start(250);
        setIsRecording(true);
      } catch {
        alert("Microphone access is required for voice input.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={isLoading}
        className={`p-3 rounded-full transition-all ${
          isRecording
            ? "bg-red-500 text-white animate-pulse"
            : "bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-hover"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path
            d="M19 10v2a7 7 0 0 1-14 0v-2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
          <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isRecording ? "Recording..." : "Type a message..."}
        disabled={isRecording || isLoading}
        className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="p-3 rounded-full bg-primary text-white hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        )}
      </button>
    </form>
  );
}
