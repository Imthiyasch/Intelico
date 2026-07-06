import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing resume ID" }, { status: 400 });
    }

    const supabase = createServerSupabase(); // Automatically uses service role key if environment variables are correct
    const { data, error } = await supabase
      .from("resumes")
      .select("title, content_json, template_id")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Share resume fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
