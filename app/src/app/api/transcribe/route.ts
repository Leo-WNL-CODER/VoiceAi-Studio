import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["audio/webm", "audio/wav", "audio/mp3", "audio/mpeg", "audio/ogg", "audio/mp4"];

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 transcriptions per minute
    const { success } = await rateLimit(user.id, "transcribe", 10, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Validate file size
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.some((t) => audioFile.type.startsWith(t.split("/")[0]))) {
      return NextResponse.json({ error: "Invalid audio format" }, { status: 400 });
    }

    if (!process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json({ error: "DEEPGRAM_API_KEY not configured" }, { status: 500 });
    }

    const audioBuffer = await audioFile.arrayBuffer();

    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": audioFile.type || "audio/webm",
        },
        body: audioBuffer,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Deepgram error:", errorData);
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }

    const data = await response.json();
    const transcript =
      data.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

    if (!transcript) {
      return NextResponse.json(
        { error: "No speech detected. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: transcript });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
