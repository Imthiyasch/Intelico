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
  starter: "plan_starter_3mo",
  popular: "plan_popular_6mo",
  "best-value": "plan_bestvalue_12mo",
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

    // Amounts in paise (INR): Starter=₹999, Popular=₹1799, Best Value=₹2999
    const amounts: Record<string, number> = {
      starter: 99900,
      popular: 179900,
      "best-value": 299900,
    };
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
