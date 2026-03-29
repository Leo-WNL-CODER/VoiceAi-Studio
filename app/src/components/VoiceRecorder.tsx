"use client";

import { useState, useRef } from "react";
import { useChatStore } from "@/store/chat-store";

const READING_PARAGRAPHS = [
  {
    id: "english-general",
    label: "English - General",
    language: "EN",
    text: "The quick brown fox jumps over the lazy dog. Technology has changed how we communicate with each other. I enjoy learning new things every day and sharing knowledge with others. The weather today is quite pleasant and perfect for a walk outside. Every great journey begins with a single step forward.",
  },
  {
    id: "english-story",
    label: "English - Story",
    language: "EN",
    text: "Once upon a time, in a small village by the mountains, there lived a wise old man. He would sit by the river every morning, watching the sun rise over the peaks. Children from the village would gather around him, eager to hear his stories about faraway lands and magical creatures.",
  },
  {
    id: "english-professional",
    label: "English - Professional",
    language: "EN",
    text: "Good morning everyone, and welcome to today's presentation. I'm excited to share some groundbreaking insights with you. Over the past year, our team has been working tirelessly to develop innovative solutions that will transform the way we approach everyday challenges. Let me walk you through the key findings.",
  },
  {
    id: "english-podcast",
    label: "English - Podcast Style",
    language: "EN",
    text: "Hey, what's up everybody! Welcome back to another episode. Today we've got something really special lined up. I've been thinking about this topic for weeks, and I finally feel ready to share my thoughts. So grab your headphones, get comfortable, and let's dive right in.",
  },
  {
    id: "hindi-general",
    label: "Hindi - General",
    language: "HI",
    text: "नमस्ते दोस्तों, आज मैं आपके साथ कुछ बहुत ही रोचक बातें साझा करना चाहता हूँ। हमारी दुनिया तेजी से बदल रही है और हर दिन नई तकनीक हमारे जीवन को आसान बना रही है। मुझे विश्वास है कि आने वाला कल और भी बेहतर होगा। चलिए साथ मिलकर इस सफर को शुरू करते हैं।",
  },
  {
    id: "hindi-story",
    label: "Hindi - Story",
    language: "HI",
    text: "एक समय की बात है, एक छोटे से गांव में एक बुद्धिमान किसान रहता था। वह हर सुबह अपने खेतों में जाता और प्रकृति की सुंदरता को निहारता। उसकी मेहनत और लगन ने उसे गांव का सबसे सम्मानित व्यक्ति बना दिया। लोग दूर दूर से उसकी सलाह लेने आते थे।",
  },
  {
    id: "spanish",
    label: "Spanish",
    language: "ES",
    text: "Buenos días a todos. Hoy vamos a hablar sobre algo muy interesante. La tecnología está cambiando nuestras vidas de maneras que nunca imaginamos. Cada día trae nuevas oportunidades para aprender y crecer. Estoy muy emocionado de compartir estas ideas con ustedes.",
  },
  {
    id: "french",
    label: "French",
    language: "FR",
    text: "Bonjour à tous et bienvenue. Aujourd'hui, je voudrais partager avec vous quelques réflexions sur l'avenir de la technologie. Notre monde change rapidement, et il est important de rester informé. Ensemble, nous pouvons construire un avenir meilleur pour tous.",
  },
];

export default function VoiceRecorder() {
  const { isRecording, setIsRecording, setClonedVoice, setSelectedVoice } =
    useChatStore();
  const [isCloning, setIsCloning] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);
  const [selectedParagraph, setSelectedParagraph] = useState(READING_PARAGRAPHS[0]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await cloneVoice(audioBlob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
      setCloneSuccess(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      alert("Microphone access is required to clone your voice.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const cloneVoice = async (audioBlob: Blob) => {
    setIsCloning(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice-recording.webm");
      formData.append("name", "My Voice");

      const res = await fetch("/api/voices/clone", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.voice) {
        setClonedVoice(data.voice);
        setSelectedVoice(data.voice);
        setCloneSuccess(true);
      } else {
        alert(data.error || "Voice cloning failed. Please try again.");
      }
    } catch {
      alert("Failed to clone voice. Check your connection and try again.");
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowCloneModal(true)}
        className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-600/20"
      >
        Clone My Voice
      </button>

      {showCloneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Clone Your Voice</h2>
              <button
                onClick={() => {
                  if (isRecording) stopRecording();
                  setShowCloneModal(false);
                }}
                className="p-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-hover transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-muted text-sm mb-4">
              Choose a paragraph below, then record yourself reading it aloud
              for at least 30 seconds.
            </p>

            {/* Paragraph Selector */}
            <div className="mb-4">
              <label className="text-xs text-muted mb-2 block">
                Choose what to read:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {READING_PARAGRAPHS.map((para) => (
                  <button
                    key={para.id}
                    onClick={() => setSelectedParagraph(para)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedParagraph.id === para.id
                        ? "bg-primary text-white"
                        : "bg-background border border-border text-muted hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    <span className="mr-1 opacity-70">{para.language}</span>
                    {para.label.split(" - ")[1] || para.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Paragraph */}
            <div className="bg-background rounded-xl p-4 mb-6 border border-border">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted italic">
                  Read this aloud naturally:
                </p>
                <span className="text-xs px-2 py-0.5 rounded bg-surface text-muted border border-border">
                  {selectedParagraph.language}
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                &quot;{selectedParagraph.text}&quot;
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              {isRecording && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-mono">
                    {Math.floor(recordingTime / 60)}:
                    {(recordingTime % 60).toString().padStart(2, "0")}
                  </span>
                  {recordingTime < 30 && (
                    <span className="text-xs text-muted">
                      (min 30s recommended)
                    </span>
                  )}
                  {recordingTime >= 30 && (
                    <span className="text-xs text-green-400">
                      Good length!
                    </span>
                  )}
                </div>
              )}

              {cloneSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3 text-center">
                  Voice cloned successfully with ElevenLabs! Your voice is now
                  available as &quot;My Voice&quot; in the voice selector.
                </div>
              )}

              {isCloning ? (
                <div className="flex flex-col items-center gap-2 text-muted">
                  <svg
                    className="animate-spin h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                  <span className="text-sm">Cloning with ElevenLabs AI...</span>
                  <span className="text-xs text-muted">This may take a few seconds</span>
                </div>
              ) : (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-400 scale-110"
                      : cloneSuccess
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-primary hover:bg-primary-hover"
                  }`}
                >
                  {isRecording ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none" />
                      <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" />
                      <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              )}

              <p className="text-xs text-muted">
                {isRecording
                  ? "Click to stop and clone"
                  : cloneSuccess
                  ? "Click to re-record"
                  : "Click to start recording"}
              </p>
            </div>

            <button
              onClick={() => {
                if (isRecording) stopRecording();
                setShowCloneModal(false);
              }}
              className="mt-4 w-full py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              {cloneSuccess ? "Done" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
