"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Zap, ArrowRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRICING_PLANS } from "@/lib/types";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (planId: string) => {
    if (planId === "free") {
      window.location.href = "/auth?tab=signup";
      return;
    }
    setLoading(planId);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const { orderId, amount, keyId } = await res.json();
      if (!orderId) throw new Error("Order creation failed");

      // @ts-expect-error Razorpay global
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "Intellico",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        theme: { color: "#6366f1" },
        handler: function() {
          window.location.href = "/dashboard?payment=success";
        },
      });
      rzp.open();
    } catch {
      alert("Payment system temporarily unavailable. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="section-label mb-3">Pricing</div>
            <h1 className="font-display text-5xl md:text-6xl font-black mb-4">
              Simple{" "}
              <span className="gradient-text">pricing</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Start free. Upgrade when you need more. No hidden fees, no monthly subscriptions.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-2 border-blue-500 shadow-xl bg-white"
                    : "glass border border-slate-200"
                }`}
                style={plan.highlighted ? { background: "linear-gradient(160deg, #f8fafc 0%, #eff6ff 100%)" } : {}}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge-brand px-4 py-1 whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold mb-1">{plan.name}</h2>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black">
                      {plan.price === 0 ? "₹0" : `₹${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-400 text-sm">/ {plan.period}</span>
                    )}
                  </div>
                  {plan.price === 0 && (
                    <span className="text-sm text-slate-500">Forever free</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePayment(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? "btn-primary justify-center"
                      : "btn-secondary justify-center"
                  } flex items-center`}
                >
                  {loading === plan.id ? (
                    <span className="animate-spin mr-2">⟳</span>
                  ) : null}
                  {plan.price === 0 ? "Get Started Free" : `Buy ${plan.name}`}
                  {plan.price > 0 && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="glass rounded-2xl overflow-hidden mb-16 border border-slate-200">
            <div className="px-8 py-5 border-b border-slate-200">
              <h2 className="font-display text-xl font-bold">Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left px-8 py-4 text-slate-500 font-medium">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">Free</th>
                    <th className="px-6 py-4 text-center font-semibold text-blue-600">Pro</th>
                    <th className="px-6 py-4 text-center font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    ["Resume limit", "1", "Unlimited", "Unlimited"],
                    ["Templates", "3", "All 5", "All 5"],
                    ["PDF Download", "✓", "✓", "✓"],
                    ["Word Download", "—", "✓", "✓"],
                    ["AI Optimization", "Basic", "Advanced", "Advanced"],
                    ["CV Upload & Parse", "—", "✓", "✓"],
                    ["ATS Score Check", "—", "✓", "✓"],
                    ["Cover Letter", "—", "—", "✓"],
                    ["Priority Support", "—", "—", "✓"],
                  ].map(([feat, free, pro, prem]) => (
                    <tr key={feat} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-3.5 text-slate-700">{feat}</td>
                      <td className="px-6 py-3.5 text-center text-slate-400">{free}</td>
                      <td className="px-6 py-3.5 text-center text-slate-700 font-medium">{pro}</td>
                      <td className="px-6 py-3.5 text-center text-slate-400">{prem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Support section */}
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-4">Need help choosing a plan?</p>
            <a
              href="https://wa.me/919999999999?text=Hi%2C+I+need+help+choosing+an+Intellico+plan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
