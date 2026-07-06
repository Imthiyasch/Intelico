import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, resumeTitle, resumeUrl } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    console.log(`[Email Service Simulation] Sending resume "${resumeTitle}" to ${email}. Link: ${resumeUrl}`);

    // Simulation of a delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      message: `Resume link emailed successfully to ${email}!`,
    });
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
