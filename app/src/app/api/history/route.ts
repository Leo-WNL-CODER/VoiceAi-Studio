import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

// Save a generation to history
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { script, voiceId, voiceName, language, characterCount } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("generations")
      .insert({
        user_id: user.id,
        script,
        voice_id: voiceId,
        voice_name: voiceName,
        language,
        character_count: characterCount,
      })
      .select()
      .single();

    if (error) {
      console.error("Save generation error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ generation: data });
  } catch (error) {
    console.error("History save error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Get generation history
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Fetch history error:", error);
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    return NextResponse.json({ generations: data });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
