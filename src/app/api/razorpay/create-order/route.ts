import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials missing");
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

const PLAN_IDS: Record<string, string> = {
  pro: "plan_pro_id_from_razorpay",
  premium: "plan_premium_id_from_razorpay",
};

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
    }

    const razorpay = getRazorpay();
    const razorpayPlanId = PLAN_IDS[planId];
    if (!razorpayPlanId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // For one-time payment (simpler than subscription for demo)
    const amounts: Record<string, number> = { pro: 49900, premium: 99900 }; // in paise
    const order = await razorpay.orders.create({
      amount: amounts[planId],
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { planId },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
