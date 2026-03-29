import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 15 TTS requests per minute
    const { success } = await rateLimit(user.id, "tts", 15, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const { text, voiceId } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0 || text.length > 10000) {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    if (!voiceId || typeof voiceId !== "string") {
      return NextResponse.json({ error: "Invalid voice ID" }, { status: 400 });
    }

    // Fallback: tell frontend to use browser TTS
    return NextResponse.json({ useBrowserTTS: true, text });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ useBrowserTTS: true, text: "" });
  }
}
