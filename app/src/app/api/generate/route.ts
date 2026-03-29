import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { getPlanLimits } from "@/lib/plan";

const MAX_TEXT_LENGTH = 10000;
const ALLOWED_VOICE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 generations per minute
    const { success: rateLimitOk } = await rateLimit(user.id, "generate", 10, 60 * 1000);
    if (!rateLimitOk) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const voiceId = typeof body.voiceId === "string" ? body.voiceId : "";
    const voiceName = typeof body.voiceName === "string" ? body.voiceName : "";
    const elevenLabsVoiceId = typeof body.elevenLabsVoiceId === "string" ? body.elevenLabsVoiceId : "";
    const language = typeof body.language === "string" ? body.language.slice(0, 5) : "en";

    // Input validation
    if (!text || text.length === 0) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: `Text too long. Max ${MAX_TEXT_LENGTH} characters.` }, { status: 400 });
    }

    const elVoiceId = elevenLabsVoiceId || voiceId;
    if (!elVoiceId || !ALLOWED_VOICE_ID_PATTERN.test(elVoiceId)) {
      return NextResponse.json({ error: "Invalid voice ID" }, { status: 400 });
    }

    // Check daily generation limit
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("subscription_tier")
      .eq("clerk_id", user.id)
      .single();

    const tier = userData?.subscription_tier || "free";
    const limits = getPlanLimits(tier);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabaseAdmin
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((count || 0) >= limits.maxGenerationsPerDay) {
      return NextResponse.json(
        { error: `Daily generation limit reached (${limits.maxGenerationsPerDay}/day). Upgrade your plan for more.` },
        { status: 429 }
      );
    }

    // Server-side script length enforcement
    if (text.length > limits.maxScriptLength) {
      return NextResponse.json(
        { error: `Script too long for your plan. Max ${limits.maxScriptLength} characters.` },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(elVoiceId)}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: language && language !== "en" ? "eleven_multilingual_v2" : "eleven_flash_v2_5",
          language_code: language || undefined,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ElevenLabs TTS error:", errorData);
      return NextResponse.json(
        { error: errorData?.detail?.message || "Text-to-speech failed" },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    // Save generation history
    supabaseAdmin.from("generations").insert({
      user_id: user.id,
      script: text.substring(0, 5000),
      voice_id: voiceId || elVoiceId,
      voice_name: voiceName || voiceId,
      language: language || "en",
      character_count: text.length,
    }).then(() => {});

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Content-Disposition": `attachment; filename="voiceai-${Date.now()}.mp3"`,
      },
    });
  } catch (error) {
    console.error("Generate audio error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
