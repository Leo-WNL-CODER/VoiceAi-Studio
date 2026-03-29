import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { currentUser } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 20 requests per minute per user
    const { success } = await rateLimit(user.id, "chat", 20, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const conversationHistory = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];

    if (!message || message.length > 10000) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const messages = [
      {
        role: "system" as const,
        content:
          "You are a friendly, helpful AI voice assistant. Keep responses concise and conversational since they will be spoken aloud. Avoid using markdown, bullet points, or formatting — speak naturally.",
      },
      ...conversationHistory.slice(-20).map(
        (msg: { role: string; content: string }) => ({
          role: (msg.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
          content: typeof msg.content === "string" ? msg.content.slice(0, 5000) : "",
        })
      ),
      { role: "user" as const, content: message },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 1024,
    });

    const text =
      response.choices[0]?.message?.content ||
      "I could not generate a response.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
