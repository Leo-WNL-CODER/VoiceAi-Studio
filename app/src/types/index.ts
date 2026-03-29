export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  timestamp: number;
}

export interface Voice {
  id: string;
  name: string;
  type: "default" | "cloned";
  gender: "female" | "male" | "neutral" | "cloned";
  description: string;
  previewUrl?: string;
  elevenLabsVoiceId: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "EN" },
  { code: "hi", name: "Hindi", flag: "HI" },
  { code: "es", name: "Spanish", flag: "ES" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "de", name: "German", flag: "DE" },
  { code: "ja", name: "Japanese", flag: "JA" },
  { code: "zh", name: "Chinese", flag: "ZH" },
  { code: "ko", name: "Korean", flag: "KO" },
  { code: "pt", name: "Portuguese", flag: "PT" },
  { code: "ar", name: "Arabic", flag: "AR" },
  { code: "it", name: "Italian", flag: "IT" },
  { code: "ta", name: "Tamil", flag: "TA" },
  { code: "te", name: "Telugu", flag: "TE" },
  { code: "bn", name: "Bengali", flag: "BN" },
];

export const DEFAULT_VOICES: Voice[] = [
  // Female voices
  { id: "sarah", name: "Sarah", type: "default", gender: "female", description: "Mature, Reassuring, Confident", elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL" },
  { id: "jessica", name: "Jessica", type: "default", gender: "female", description: "Playful, Bright, Warm", elevenLabsVoiceId: "cgSgspJ2msm6clMCkdW9" },
  { id: "laura", name: "Laura", type: "default", gender: "female", description: "Enthusiast, Quirky Attitude", elevenLabsVoiceId: "FGY2WhTYpPnrIDTdsKH5" },
  { id: "alice", name: "Alice", type: "default", gender: "female", description: "Clear, Engaging Educator", elevenLabsVoiceId: "Xb7hH8MSUJpSbSDYk0k2" },
  { id: "matilda", name: "Matilda", type: "default", gender: "female", description: "Knowledgeable, Professional", elevenLabsVoiceId: "XrExE9yKIg1WjnnlVkGX" },
  { id: "lily", name: "Lily", type: "default", gender: "female", description: "Velvety Actress", elevenLabsVoiceId: "pFZP5JQG7iQjIQuC4Bku" },
  { id: "bella", name: "Bella", type: "default", gender: "female", description: "Professional, Bright, Warm", elevenLabsVoiceId: "hpp4J3VqNfWAUOO0d1Us" },
  // Male voices
  { id: "adam", name: "Adam", type: "default", gender: "male", description: "Dominant, Firm", elevenLabsVoiceId: "pNInz6obpgDQGcFmaJgB" },
  { id: "brian", name: "Brian", type: "default", gender: "male", description: "Deep, Resonant, Comforting", elevenLabsVoiceId: "nPczCjzI2devNBz1zQrb" },
  { id: "daniel", name: "Daniel", type: "default", gender: "male", description: "Steady Broadcaster", elevenLabsVoiceId: "onwK4e9ZLuTAKqWW03F9" },
  { id: "roger", name: "Roger", type: "default", gender: "male", description: "Laid-Back, Casual, Resonant", elevenLabsVoiceId: "CwhRBWXzGAHq8TQ4Fs17" },
  { id: "charlie", name: "Charlie", type: "default", gender: "male", description: "Deep, Confident, Energetic", elevenLabsVoiceId: "IKne3meq5aSn9XLyUdCD" },
  { id: "george", name: "George", type: "default", gender: "male", description: "Warm, Captivating Storyteller", elevenLabsVoiceId: "JBFqnCBsd6RMkjVDRZzb" },
  { id: "liam", name: "Liam", type: "default", gender: "male", description: "Energetic, Social Media Creator", elevenLabsVoiceId: "TX3LPaxmHKxFdv7VOQHJ" },
  { id: "eric", name: "Eric", type: "default", gender: "male", description: "Smooth, Trustworthy", elevenLabsVoiceId: "cjVigY5qzO86Huf0OWal" },
  { id: "chris", name: "Chris", type: "default", gender: "male", description: "Charming, Down-to-Earth", elevenLabsVoiceId: "iP95p4xoKVk53GoZ742B" },
  { id: "will", name: "Will", type: "default", gender: "male", description: "Relaxed Optimist", elevenLabsVoiceId: "bIHbv24MWmeRgasZH58o" },
  { id: "harry", name: "Harry", type: "default", gender: "male", description: "Fierce Warrior", elevenLabsVoiceId: "SOYHLrjzK2X1ezoPC6cr" },
  { id: "callum", name: "Callum", type: "default", gender: "male", description: "Husky Trickster", elevenLabsVoiceId: "N2lVS1w4EtoT3dr4eOWO" },
  { id: "bill", name: "Bill", type: "default", gender: "male", description: "Wise, Mature, Balanced", elevenLabsVoiceId: "pqHfZKP75CvOlQylNhV4" },
  // Neutral voice
  { id: "river", name: "River", type: "default", gender: "neutral", description: "Relaxed, Neutral, Informative", elevenLabsVoiceId: "SAz9YHcvj6GT2YYXdXww" },
];
