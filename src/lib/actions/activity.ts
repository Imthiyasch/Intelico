"use server";

import { createServerSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function logActivity(action: string, details: Record<string, any> = {}) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const supabase = createServerSupabase();

    if (!token) return;

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return;

    // Insert activity
    await supabase.from("activities").insert({
      user_id: user.id,
      action,
      details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
