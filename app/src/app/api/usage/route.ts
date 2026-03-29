import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("subscription_tier")
      .eq("clerk_id", user.id)
      .single();

    const tier = userData?.subscription_tier || "free";
    const isPro = tier === "pro" || tier === "business";

    if (!isPro) {
      // Free: count lifetime total
      const { count: totalCount } = await supabaseAdmin
        .from("generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      return NextResponse.json({
        tier,
        generationsUsed: totalCount || 0,
        generationsLimit: 5,
        limitType: "lifetime",
      });
    } else {
      // Pro/Business: count today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: dailyCount } = await supabaseAdmin
        .from("generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", todayStart.toISOString());

      return NextResponse.json({
        tier,
        generationsUsed: dailyCount || 0,
        generationsLimit: tier === "business" ? 200 : 50,
        limitType: "daily",
      });
    }
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
