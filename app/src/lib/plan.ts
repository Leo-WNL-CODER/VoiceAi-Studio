// Free tier voice IDs (first 6 voices only)
export const FREE_VOICE_IDS = ["sarah", "jessica", "adam", "brian", "daniel", "river"];

export const FREE_LIMITS = {
  maxGenerationsTotal: 5, // lifetime limit
  maxGenerationsPerDay: Infinity, // no daily limit (lifetime handles it)
  maxScriptLength: 500,
  maxVoiceClones: 0,
  allowedLanguages: ["en"],
  allowVoiceCloning: false,
  allowDownload: false,
  allowAIRewrite: false,
};

export const PRO_LIMITS = {
  maxGenerationsTotal: Infinity,
  maxGenerationsPerDay: 50,
  maxScriptLength: 5000,
  maxVoiceClones: 1,
  allowedLanguages: "all" as const,
  allowVoiceCloning: true,
  allowDownload: true,
  allowAIRewrite: true,
};

export const BUSINESS_LIMITS = {
  maxGenerationsTotal: Infinity,
  maxGenerationsPerDay: 200,
  maxScriptLength: 10000,
  maxVoiceClones: 5,
  allowedLanguages: "all" as const,
  allowVoiceCloning: true,
  allowDownload: true,
  allowAIRewrite: true,
};

export function getPlanLimits(tier: string) {
  if (tier === "business") return BUSINESS_LIMITS;
  if (tier === "pro") return PRO_LIMITS;
  return FREE_LIMITS;
}

export function isVoiceFree(voiceId: string): boolean {
  return FREE_VOICE_IDS.includes(voiceId);
}
