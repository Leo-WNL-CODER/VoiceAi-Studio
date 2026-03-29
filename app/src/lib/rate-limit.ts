import { supabaseAdmin } from "./supabase";

export async function rateLimit(
  userId: string,
  endpoint: string,
  maxRequests: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  // Count requests in the current window
  const { count } = await supabaseAdmin
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("endpoint", endpoint)
    .gte("created_at", windowStart);

  const currentCount = count || 0;

  if (currentCount >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  // Log this request
  await supabaseAdmin.from("rate_limits").insert({
    user_id: userId,
    endpoint,
  });

  return { success: true, remaining: maxRequests - currentCount - 1 };
}

// Call this periodically or via Supabase cron to clean old entries
export async function cleanupRateLimits() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  await supabaseAdmin
    .from("rate_limits")
    .delete()
    .lt("created_at", oneHourAgo);
}
