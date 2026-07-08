import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabase();

    // Find the access token from cookies (try both common formats)
    const allCookies = cookieStore.getAll();
    const tokenCookie = allCookies.find(
      (c) => c.name.includes("access_token") || c.name === "sb-access-token"
    );
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
    if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    // Fetch resumes for the given user (service role bypasses RLS)
    const { data: resumes, error } = await supabase
      .from("resumes")
      .select("id, title, template_id, content_json, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ resumes: resumes || [] });
  } catch (err: any) {
    console.error("Admin get resumes error:", err);
    return NextResponse.json({ error: err.message || "Failed to load resumes" }, { status: 500 });
  }
}
