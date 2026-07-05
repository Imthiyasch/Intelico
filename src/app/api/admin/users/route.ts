import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const supabase = createServerSupabase(); // Has service role key

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
    const userEmail = user.email?.toLowerCase();

    if (!userEmail || !adminEmails.includes(userEmail)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { action, targetUserId } = body;

    if (!targetUserId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (action === "ban") {
      const { error } = await supabase.auth.admin.updateUserById(targetUserId, { ban_duration: "87600h" });
      if (error) throw error;
      
      // Log activity
      await supabase.from("activities").insert({
        user_id: user.id,
        action: "Banned User",
        details: { targetUserId }
      });
      
      return NextResponse.json({ success: true, message: "User banned successfully" });
    } 
    
    if (action === "unban") {
      const { error } = await supabase.auth.admin.updateUserById(targetUserId, { ban_duration: "none" });
      if (error) throw error;
      
      // Log activity
      await supabase.from("activities").insert({
        user_id: user.id,
        action: "Unbanned User",
        details: { targetUserId }
      });

      return NextResponse.json({ success: true, message: "User unbanned successfully" });
    }

    if (action === "delete") {
      const { error } = await supabase.auth.admin.deleteUser(targetUserId);
      if (error) throw error;
      
      // Log activity
      await supabase.from("activities").insert({
        user_id: user.id,
        action: "Deleted User",
        details: { targetUserId }
      });

      return NextResponse.json({ success: true, message: "User deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Admin user action error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
