import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 3 cloning attempts per hour
    const { success } = await rateLimit(user.id, "clone", 3, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many clone attempts. Try again later." }, { status: 429 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const name = typeof formData.get("name") === "string" ? (formData.get("name") as string).slice(0, 50) : "My Voice";

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    if (audioFile.size > MAX_AUDIO_SIZE) {
      return NextResponse.json({ error: "Audio file too large. Max 25MB." }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Upload to ElevenLabs for instant voice cloning
    const elFormData = new FormData();
    elFormData.append("name", name || "My Cloned Voice");
    elFormData.append("files", audioFile);
    elFormData.append("description", "User cloned voice via VoiceAI app");

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: elFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ElevenLabs clone error:", errorData);
      return NextResponse.json(
        { error: errorData?.detail?.message || "Voice cloning failed" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Save cloned voice to Supabase
    await supabaseAdmin.from("voice_profiles").insert({
      user_id: user.id,
      name: name || "My Voice",
      elevenlabs_voice_id: data.voice_id,
      description: "Cloned voice",
    });

    return NextResponse.json({
      voice: {
        id: `cloned-${data.voice_id}`,
        name: name || "My Voice",
        type: "cloned",
        gender: "cloned",
        description: "Your cloned voice",
        elevenLabsVoiceId: data.voice_id,
      },
    });
  } catch (error) {
    console.error("Voice clone error:", error);
    return NextResponse.json(
      { error: "Failed to clone voice" },
      { status: 500 }
    );
  }
}

// Get user's cloned voices
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("voice_profiles")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch voices error:", error);
      return NextResponse.json({ error: "Failed to fetch voices" }, { status: 500 });
    }

    const voices = (data || []).map((v) => ({
      id: `cloned-${v.elevenlabs_voice_id}`,
      name: v.name,
      type: "cloned" as const,
      gender: "cloned" as const,
      description: v.description || "Your cloned voice",
      elevenLabsVoiceId: v.elevenlabs_voice_id,
    }));

    return NextResponse.json({ voices });
  } catch (error) {
    console.error("Voices fetch error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
