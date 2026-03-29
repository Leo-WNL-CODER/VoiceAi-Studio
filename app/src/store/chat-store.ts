import { create } from "zustand";
import { Message, Voice, Language, DEFAULT_VOICES, SUPPORTED_LANGUAGES } from "@/types";

export interface VoiceProfile {
  pitch: number;
  rate: number;
  volume: number;
  voiceURI: string;
  audioSampleUrl: string;
}

interface ChatState {
  messages: Message[];
  selectedVoice: Voice;
  selectedLanguage: Language;
  clonedVoice: Voice | null;
  clonedVoiceProfile: VoiceProfile | null;
  isLoading: boolean;
  isRecording: boolean;
  isPlaying: boolean;

  addMessage: (message: Message) => void;
  setSelectedVoice: (voice: Voice) => void;
  setSelectedLanguage: (language: Language) => void;
  setClonedVoice: (voice: Voice | null) => void;
  setClonedVoiceProfile: (profile: VoiceProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  selectedVoice: DEFAULT_VOICES[0],
  selectedLanguage: SUPPORTED_LANGUAGES[0],
  clonedVoice: null,
  clonedVoiceProfile: null,
  isLoading: false,
  isRecording: false,
  isPlaying: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  setSelectedLanguage: (language) => set({ selectedLanguage: language }),
  setClonedVoice: (voice) => set({ clonedVoice: voice }),
  setClonedVoiceProfile: (profile) => set({ clonedVoiceProfile: profile }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  clearMessages: () => set({ messages: [] }),
}));
