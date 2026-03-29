import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription tier
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("subscription_tier")
      .eq("clerk_id", user.id)
      .single();

    const tier = userData?.subscription_tier || "free";

    // Count today's generations
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabaseAdmin
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    return NextResponse.json({
      tier,
      generationsToday: count || 0,
    });
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
