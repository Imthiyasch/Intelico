import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = createServerSupabase();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const planId = payment.notes?.planId;
      const userId = payment.notes?.userId;

      if (userId && planId) {
        const expiresAt = new Date();
        if (planId === "pro") {
          expiresAt.setMonth(expiresAt.getMonth() + 3);
        } else {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        await supabase.from("subscriptions").upsert({
          user_id: userId,
          plan: planId,
          razorpay_payment_id: payment.id,
          status: "active",
          expires_at: expiresAt.toISOString(),
        });

        await supabase.from("users").upsert({ id: userId, plan: planId });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
