import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

// Sync Clerk user to Supabase on first visit
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json({ user: existing });
    }

    // Create new user
    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert({
        clerk_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "User",
      })
      .select()
      .single();

    if (error) {
      console.error("Create user error:", error);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
